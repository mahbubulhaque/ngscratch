import BaseAngularController from './../../shared/jslizer-files/angular/base-angular-controller';

export default class ProfileController extends BaseAngularController {

    constructor(profileService, $scope, $window, CONST, $rootScope, $stateParams, coreFactory, $mdDialog, $element,
                $http, $mdToast, $filter, $state) {
        super();
        this.rootScope = $rootScope;
        this.scope = $scope;
        this.http = $http;
        this.stateParams = $stateParams;
        this.service = profileService;
        this.coreFactory = coreFactory;
        this.mdDialog = $mdDialog;
        this.element = $element;
        this.mdToast = $mdToast;
        this.filter = $filter;
        this.state = $state;
        this.imageUrl = '';
        this.imageFile = {};
        this.mdDialogData = {
            profile_image_view_link: null
        };
        this.isRefreshNeed = false;
        this.loader = false;

        this.emitSideNavbarStatus(true);
        this.emitNavbarStatus();

        this.categoryItemValidationList = [];
        this.selectedCategoryItemUuidList = [];
        this.jobCategoryList = [];
        this.errorMessage = null;
        this.errors = null;

        this.employeeUser = this.coreFactory.storageHandler.getValue('user_group_type') &&
          this.coreFactory.storageHandler.getValue('user_group_type') === 'employee_user' ? true : false;

        if(this.employeeUser)
        {
            this.getJobCategoryList();
        }
        else{
            this.getUserData();
        }

        //this.getUserData();
    }

    hideLoader() {
        this.loader = false;
    }

    showLoader() {
        this.loader = true;
    }

    getUserData() {
        this.showLoader();
        this.service.apiModuleUrl = `users/profile/`;

        let params = {
            errorId: 'ctrl_user_profile_detail_1',
            parentObj: this,
            successFieldKey: 'singleUser',
            uuid: this.coreFactory.storageHandler.getValue('userUUID')
        };
        this.callFetch(params, (response) => {
            if (!response.hasError) {
                this.mdDialogData = response.results;
                this.mdDialogData.house_number = parseInt(this.mdDialogData.house_number, 10);
                this.mdDialogData.profile_image_view_link = this.coreFactory.systemSettings.ROOT_API_URL + this.mdDialogData.profile_image_view_link;
                if (this.isRefreshNeed) {
                    this.isRefreshNeed = false;
                    this.coreFactory.storageHandler.setValue('profileImgLink', this.mdDialogData.profile_image_view_link);
                    location.reload();
                }

                //to show image update without reload
                // let imageUrl = this.coreFactory.systemSettings.ROOT_API_URL + this.mdDialogData.profile_image_view_link;
                // if(this.mdDialogData.profile_image_view_link !== null){
                //     let to = imageUrl.lastIndexOf('/');
                //     imageUrl = to != -1 ? imageUrl.substring(0, to) + "?" + new Date().getTime() : imageUrl;
                // }
                // this.mdDialogData.profile_image_view_link = imageUrl;
                // this.coreFactory.storageHandler.setValue('profileImgLink', this.mdDialogData.profile_image_view_link);
                // this.emitProfileImageStatus();

                //this.getJobCategoryList();
                if(this.employeeUser){
                    this.initializeCategoryItems(this.mdDialogData);
                    this.processVacancyCategoies(this.mdDialogData, 'user_category_item_list');
                }
            }
            if (!this.mdDialogData.profile_image_view_link || this.mdDialogData.profile_image_view_link.split("/").pop() === 'null') {
                this.mdDialogData .profile_image_view_link = null;
            }
            this.hideLoader();
            this.scope.$digest();
        });
    }

    validateProfilePayload(payloadObj){
        let hasValidationError = false;

        if(this.employeeUser && payloadObj.selectedCategoryItems){
            Object.keys(payloadObj.selectedCategoryItems).forEach((key)=> {
                if (payloadObj.selectedCategoryItems[key] ===  undefined) {
                    hasValidationError = true;
                    this.errorMessage = this.filter('translate')('REQUIRED_CATEGORY_ITEM');
                }
            });
        }
        return hasValidationError;
    }

    updateProfile(){
        this.errorMessage = null;
        this.errors = null;
        let validationError = this.validateProfilePayload(this.mdDialogData);
        if(validationError){
            return;
        }
        this.service.apiModuleUrl = `users/profile/`;
        let params = {
            errorId: 'ctrl_employee_profile_update_2',
            payload: this.mdDialogData,
            service: this.service,
            schema: this.service.employeeUpdateSchema,
            parentObj: this,
            successFieldKey: 'userUpdated',
            uuid: this.mdDialogData.uuid
        };

        this.callUpdate(params, (response) => {
            if (!response.hasError) {
                // let msg = 'Employee has been updated successfully!';
                // this.showSuccessMessage(msg);
                //this.getUserData();

                if(this.employeeUser){
                    this.updateUserCategoryItems(this.mdDialogData);
                }
                else{
                    let msg = 'Employee has been updated successfully!';
                    this.showSuccessMessage(msg);
                }
            } else {
                this.errorMessage = this.filter('translate')('INVALID_INPUT');
                this.errors = response.errors;
                this.scope.$digest();
            }
        });
    }

    showSuccessMessage(msg) {
        this.mdToast.show(
            this.mdToast.simple()
            .textContent(msg)
            .action('Close')
            .highlightClass('md-success')
            .position('bottom right')
            .hideDelay(3000)
        );
    }

    changeProfilePic(file, invalidFiles) {
        if (file) {
            this.imageFile = file;
        }

        let fd = new FormData();
        fd.append("profile_image", this.imageFile);
        this.http({
            method: "PUT",
            url: this.coreFactory.systemSettings.ROOT_API_URL + `users/profile/${this.coreFactory.storageHandler.getValue('userUUID')}/`,
            data: fd,
            headers: {
                "Content-Type": undefined,
                'Authorization': this.coreFactory.systemSettings.SYSTEM_DEFAULT_AUTHORIZATION_HEADER_VALUE_PREFIX +this.coreFactory.storageHandler.getToken()
            }
        }).then((response) => {
            this.isRefreshNeed = true;
            this.getUserData();
        }, (response) => {
        });
    }


    emitNavbarStatus() {
        this.scope.$emit('navbarStatus', true);
    }

    emitSideNavbarStatus(value) {
        this.scope.$emit('showSideNav', value);
    }

    //profile category
    getJobCategoryList() {
        this.service.apiModuleUrl = 'jobs/job-category/';
        let params = {
            service: this.service,
            parentObj: this,
            queryObj: {},
            errorId: 'ctrl_vacancies_1',
            successFieldKey: 'jobCategoryList'
        };
        this.callListing(params, (response, originalResponse) => {
            if (!response.hasError) {
                this.scope.$digest();
                this.getCategoryItemValidationList();
            } else {
                if(!!originalResponse && originalResponse.status_code === 403) {
                    // this.coreFactory.storageHandler.setValue('isAuthenticated', false);
                    this.coreFactory.storageHandler.destroyAllStorage();
                    this.state.go('login', {}, {
                        reload: true
                    });
                    // this.location.path('/login');
                }
            }
        });
    }

    getCategoryItemValidationList() {
        this.service.apiModuleUrl = 'jobs/category-item-validation/?type=1';
        let params = {
            service: this.service,
            parentObj: this,
            errorId: 'ctrl_category_item_validation_list_1',
            successFieldKey: 'categoryItemValidationList'
        };
        this.callListing(params, (response, originalResponse) => {
            if (!response.hasError) {
                let len, i, j, len2, found, newJobCategoryList, max_item, min_item;
                len = this.jobCategoryList.length;
                len2 = this.categoryItemValidationList.length;
                newJobCategoryList = [];
                for (i = 0; i < len; i++) {
                    found = false;
                    for (j = 0; j < len2; j++) {
                        if (this.categoryItemValidationList[j].job_category.uuid == this.jobCategoryList[i].uuid) {
                            found = true;
                            max_item = this.categoryItemValidationList[j].max_item;
                            min_item = this.categoryItemValidationList[j].min_item;
                            break;
                        }
                    }
                    if (found == true) {
                        let catItem = JSON.parse(JSON.stringify(this.jobCategoryList[i]));
                        catItem.max_item=max_item;
                        catItem.min_item=min_item;
                        newJobCategoryList.push(catItem);
                    }
                }
                this.jobCategoryList = JSON.parse(JSON.stringify(newJobCategoryList));
                //this.scope.$digest();
                this.getUserData();

            } else {
                if(!!originalResponse && originalResponse.status_code === 403) {
                    // this.coreFactory.storageHandler.setValue('isAuthenticated', false);
                    this.coreFactory.storageHandler.destroyAllStorage();
                    this.state.go('login', {}, {
                        reload: true
                    });
                    // this.location.path('/login');
                }
            }
        });
    }

    initializeCategoryItems(dataToPass) {
        let i, len;
        len = this.jobCategoryList.length;
        dataToPass.selectedCategoryItems = {};
        for (i = 0; i < len; i++) {
            if(this.jobCategoryList[i].min_item > 0){
                dataToPass.selectedCategoryItems[this.jobCategoryList[i].uuid] = undefined;
            } else {
                dataToPass.selectedCategoryItems[this.jobCategoryList[i].uuid] = [];
            }

        }
        return dataToPass;
    }

    buildUuids(mdDialogData, jobCategoryUuid) {
        let len, i, res, val;
        res = '';
        for (let key in mdDialogData.selectedCategoryItems) {
            if (key == jobCategoryUuid) {
                len = mdDialogData.selectedCategoryItems[key].length;
                for (i = 0; i < len; i++) {
                    if (res.indexOf(mdDialogData.selectedCategoryItems[key][i].uuid) == -1) {
                        if (res !== '') {
                            res += ',';
                        }
                        res += mdDialogData.selectedCategoryItems[key][i].uuid;
                    }
                }
            }
        }
        return res;
    }

    processVacancyCategoies(dataToPass, categoryItemParentField) {
        let i, len;
        len = dataToPass[categoryItemParentField].length;
        dataToPass.selectedCategoryItemUuidList = [];
        for (i = 0; i < len; i++) {
            dataToPass.selectedCategoryItemUuidList.push(dataToPass[categoryItemParentField][i].category_item.uuid);
        }
        return dataToPass;
    }

    updateUserCategoryItems(mdDialogData) {
        let payloadObj;
        this.updatedUserCategoryItemCount = 0;
        this.updatedUserCategoryItemCallbackCount = 0;
        for (let key in mdDialogData.selectedCategoryItems) {
            payloadObj = {};
            payloadObj.category_item_uuids = this.buildUuids(mdDialogData, key);

            //will be changed later after api is updated
            if (payloadObj.category_item_uuids == '') {
                continue;
            }
            this.updatedUserCategoryItemCount++;
            if (this.coreFactory.objectHelper.isNotNull(this.mdDialogData, 'uuid')) {
                payloadObj.user_uuid = this.mdDialogData.uuid;
            } else {
                payloadObj.user_uuid = mdDialogData.uuid;
            }

            this.service.apiModuleUrl = `jobs/user-category-item/bulk/`;
            let params = {
                errorId: 'ctrl_vacancies_2',
                payload: payloadObj,
                service: this.service,
                parentObj: this,
                errorMessageFieldKey:"errorMessage",
                successFieldKey: 'userCategoryItemSuccess'
            };
            this.callSave(params, (response, originalResponse) => {
                this.hideLoader();
                if (!response.hasError) {
                    let msg = 'User category items has been added successfully!';
                } else {
                    if(!!originalResponse && originalResponse.status_code === 403) {
                        // this.coreFactory.storageHandler.setValue('isAuthenticated', false);
                        this.coreFactory.storageHandler.destroyAllStorage();
                        this.state.go('login', {}, {
                            reload: true
                        });
                        // this.location.path('/login');
                    }
                }
                this.updatedUserCategoryItemCallbackCount++;
                this.checkUpdateCount();
            });
        }

    }

    checkIfPreSelected(childItem) {
        if (this.coreFactory.objectHelper.isNotNull(this.mdDialogData, 'selectedCategoryItemUuidList') && this.mdDialogData.selectedCategoryItemUuidList.indexOf(childItem.uuid) >= 0) {
            return true;
        } else {
            return false;
        }
    }

    checkUpdateCount() {
        if (this.updatedUserCategoryItemCount > 0 && this.updatedUserCategoryItemCallbackCount == this.updatedUserCategoryItemCount) {
            this.updatedUserCategoryItemCount = 0;
            this.updatedUserCategoryItemCallbackCount = 0;
            //this.isRefreshNeed=true;
            //this.getUserData();
            if(this.errorMessage === null){
                let msg = 'Employee has been updated successfully!';
                this.showSuccessMessage(msg);
            }
        }
    }
}

ProfileController.$inject = ['profileService', '$scope', '$window', 'CONST', '$rootScope', '$stateParams', 'coreFactory',
    '$mdDialog', '$element', '$http', '$mdToast', '$filter', '$state'];
