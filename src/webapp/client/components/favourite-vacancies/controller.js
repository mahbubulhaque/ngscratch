import BaseAngularController from '../../shared/jslizer-files/angular/base-angular-controller';

export default class FavouriteVacanciesController extends BaseAngularController {

    constructor(favouriteVacancyService, $scope, $window, CONST, $rootScope, $stateParams, coreFactory, $mdDialog, $element, $http, $filter, $state) {
        super();
        this.scope = $scope;
        this.rootScope = $rootScope;
        this.state = $state;
        this.stateParams = $stateParams;
        this.coreFactory = coreFactory;
        this.mdDialog = $mdDialog;
        this.element = $element;
        this.service = favouriteVacancyService;
        this.httpObj = $http;
        this.vacancyImage = null;
        this.errorMessage = null;
        this.addVacancyErrorMessage = null;
        this.errors = {};
        this.searchTerm = '';
        this.loader = false;
        this.filter = $filter;
        this.searchFields = [
            'uuid',
            'education_necessary',
            'is_success_count',
            'description',
            'title',
            'address',
            'company__name',
            'salary',
            'way_of_working',
        ];

        this.hide = () => {
            $mdDialog.hide();
        };

        this.cancel = () => {
            $mdDialog.cancel();
        };

        this.answer = (answer) => {
            $mdDialog.hide(answer);
        };

        $element.find('input').on('keydown', (ev) => {
            ev.stopPropagation();
        });

        this.emitNavbarStatus();
        this.emitSideNavbarStatus(true);

        this.searchTerm = '';
        this.categoryList = [];
        this.vacancyList = [];
        this.companyList = [];
        this.categoryItemValidationList = [];

        this.selectedCategoryItemUuidList = [];
        this.jobCategoryList = [];
        this.summary = {
            archived: 0,
            active: 0,
        };

        this.isImage = false;
        this.fileExt = '';
        this.picFile = [];

        this.createdVacancy = {
            'uuid': null
        };

        this.getJobCategoryList();
        this.getCompanyList();
        this.getVacancyList();
    }

    hideLoader() {
        this.loader = false;
    }

    showLoader() {
        this.loader = true;
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

    prepareDate(date) {
        if (date === '' || date === null || date === undefined) {
            return null;
        } else {
            let date_format;
            date_format = this.coreFactory.momentJs(date, this.coreFactory.systemSettings.DATEPICKER_DATE_TIME_FORMAT).format(this.coreFactory.systemSettings.SYSTEM_DATE_TIME_FORMAT);
            if (date_format == 'Invalid date') {
                return null;
            }
            return date_format;
        }
    }

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

    getCompanyList() {
        this.service.apiModuleUrl = 'users/company/';
        let params = {
            service: this.service,
            parentObj: this,
            errorId: 'ctrl_company_list_1',
            successFieldKey: 'companyList'
        };
        this.callListing(params, (response, originalResponse) => {
            if (!response.hasError) {
                this.scope.$digest();
            } else {
                // if(!!originalResponse && originalResponse.status_code === 403) {
                //     // this.coreFactory.storageHandler.setValue('isAuthenticated', false);
                //     this.coreFactory.storageHandler.destroyAllStorage();
                //     this.state.go('login', {}, {
                //         reload: true
                //     });
                //     // this.location.path('/login');                    
                // }
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
                this.scope.$digest();
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

    initializeCategoryItemsAndWeight(dataToPass) {
        let i, len;
        len = this.jobCategoryList.length;
        dataToPass.selectedCategoryItems = {};
        dataToPass.weightFactor = {};
        for (i = 0; i < len; i++) {
            dataToPass.selectedCategoryItems[this.jobCategoryList[i].uuid] = [];
            dataToPass.weightFactor[this.jobCategoryList[i].uuid] = 0.0;
        }
        return dataToPass;
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

    processWeightFactor(dataToPass) {
        let i, len, j, len2, k, len3;
        len = this.jobCategoryList.length;
        len2 = dataToPass.vacancy_category_item_list.length;
        for (i = 0; i < len; i++) {
            len3 = this.jobCategoryList[i].category_item_list.length;
            for (k = 0; k < len3; k++) {
                for (j = 0; j < len2; j++) {
                    if (dataToPass.vacancy_category_item_list[j].category_item.uuid == this.jobCategoryList[i].category_item_list[k].uuid) {
                        dataToPass.weightFactor[this.jobCategoryList[i].uuid] = parseFloat(dataToPass.vacancy_category_item_list[j].weight_factor);
                    }
                }
            }
        }
        return dataToPass;
    }

    getVacancyList(queryObj = null) {
        this.showLoader();
        if (this.coreFactory.objectHelper.isNull(queryObj)) {
            queryObj = this.paginationQuery;
        }
        queryObj['custom_filter__is_interested'] = 'True';
        this.service.apiModuleUrl = 'jobs/vacancy/';
        let params = {
            service: this.service,
            parentObj: this,
            queryObj: queryObj,
            errorId: 'ctrl_vacancy_list_1',
            successFieldKey: 'vacancyList'
        };
        this.callListing(params, (response, originalResponse) => {
            if (!response.hasError) {
                this.calculatePagination(response);
                this.vacancyList = response.results;
                this.summary = originalResponse.summary;
                this.hideLoader();
                this.scope.$digest();
            } else {
                if(!!originalResponse && originalResponse.status_code === 403) {
                    this.mdDialog.cancel();
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

    imgChosen(file) {
        if(file[0] === undefined) {
            return;
        } else {
            this.vacancyImage = file[0];
            this.fileExt = file[0].name.split(".").pop();

            if(this.fileExt.match(/^(jpg|jpeg|gif|png)$/)) {
                this.isImage = true;
            } else {
                this.isImage = false;
            }
        }
    }

    buildVacancyPayload(mdDialogData) {
        let payloadObj = Object.assign({}, mdDialogData);
        payloadObj.end_date = this.prepareDate(payloadObj.end_date_picker);
        payloadObj.company_uuid = payloadObj.selectedCompany ? payloadObj.selectedCompany.uuid : null;
        let fd = new FormData();
        if (this.vacancyImage) {
            fd.append("vacancy_image", this.vacancyImage);
        }
        if (payloadObj.end_date) {
            fd.append("end_date", payloadObj.end_date);
        }
        fd.append("title", payloadObj.title);
        fd.append("company_uuid", payloadObj.company_uuid !== undefined ? payloadObj.company_uuid : '');
        fd.append("description", payloadObj.description !== undefined ? payloadObj.description : '');
        fd.append("address", payloadObj.address !== undefined ? payloadObj.address : '');
        fd.append("salary", payloadObj.salary !== undefined ? payloadObj.salary : '');
        fd.append("education_necessary", payloadObj.education_necessary !== undefined ? payloadObj.education_necessary : '');
        fd.append("way_of_working", payloadObj.way_of_working !== undefined ? payloadObj.way_of_working : '');
        return fd;
    }

    //Add user profile
    addVacancy(ev) {
        this.vacancyImage=null;
        this.isImage=false;
        this.addVacancyErrorMessage = null;
        this.errors = {};
        let dataToPass;
        dataToPass = this.initializeCategoryItemsAndWeight(dataToPass = {});
        this.mdDialog.show({
                locals: {
                    dataToPass: dataToPass,
                    service: this.service,
                    parentCtrl: this,
                    jobCategoryList: this.jobCategoryList,
                    companyList: this.companyList,
                    moment: this.coreFactory.momentJs
                },
                controller: this.addVacancyMdDialogCtrl,
                template: require('./add_vacancies_template.html'),
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true,
                fullscreen: this.customFullscreen // Only for -xs, -sm breakpoints.
            })
            .then((answer) => {
                this.status = 'You said the information was "' + answer + '".';
            }, () => {
                this.status = 'You cancelled the dialog.';
            });
    }

    addVacancyMdDialogCtrl($scope, $http, Upload, $timeout, service, parentCtrl, dataToPass, companyList, moment, jobCategoryList) {
        $scope.service = service;
        $scope.parentCtrl = parentCtrl;
        $scope.companyList = companyList;
        $scope.jobCategoryList = jobCategoryList;
        $scope.moment = moment;
        $scope.mdDialogData = Object.assign({}, dataToPass);
        $scope.uniqueCheckCB = (value, index, self) => {
            return self.indexOf(value) === index;
        }
    }

    //added custom check for now. Need to make dynamic later
    validateVacancyPayload(form_data){
        let hasValidationError = false;
        let payloadObj = Object.assign({}, form_data);

        payloadObj.end_date = payloadObj.end_date ? payloadObj.end_date : this.prepareDate(payloadObj.end_date_picker);
        payloadObj.company_uuid = payloadObj.selectedCompany ? payloadObj.selectedCompany.uuid : null;

        if(!payloadObj.end_date){
            hasValidationError = true;
            this.addVacancyErrorMessage = this.filter('translate')('INVALID_INPUT');
            this.errors['end_date'] = this.filter('translate')('REQUIRED_FIELD_VALIDATION_TEXT');
        }else{
            this.errors['end_date'] = null;
        }

        if(!payloadObj.title){
            hasValidationError = true;
            this.addVacancyErrorMessage = this.filter('translate')('INVALID_INPUT');
            this.errors['title'] = this.filter('translate')('REQUIRED_FIELD_VALIDATION_TEXT');
        }else if(payloadObj.title && payloadObj.title.length > 128){
            hasValidationError = true;
            this.addVacancyErrorMessage = this.filter('translate')('INVALID_INPUT');
            this.errors['title'] = this.filter('translate')('MAX_LIMIT')+ " : 128 chars";
        }else{
            this.errors['title'] = null;
        }

        if(!payloadObj.address){
            hasValidationError = true;
            this.addVacancyErrorMessage = this.filter('translate')('INVALID_INPUT');
            this.errors['address'] = this.filter('translate')('REQUIRED_FIELD_VALIDATION_TEXT');
        }else if(payloadObj.address && payloadObj.address.length > 512){
            hasValidationError = true;
            this.addVacancyErrorMessage = this.filter('translate')('INVALID_INPUT');
            this.errors['address'] = this.filter('translate')('MAX_LIMIT')+ " : 512 chars";
        }else{
            this.errors['address'] = null;
        }

        if(!payloadObj.company_uuid){
            hasValidationError = true;
            this.addVacancyErrorMessage = this.filter('translate')('INVALID_INPUT');
            this.errors['company_uuid'] = this.filter('translate')('REQUIRED_FIELD_VALIDATION_TEXT');
        }else{
            this.errors['company_uuid'] = null;
        }

        if(payloadObj.salary && payloadObj.salary.length > 64){
            hasValidationError = true;
            this.addVacancyErrorMessage = this.filter('translate')('INVALID_INPUT');
            this.errors['salary'] = this.filter('translate')('MAX_LIMIT');
        }else{
            this.errors['salary'] = null;
        }
        if(payloadObj.selectedCategoryItems){
            Object.keys(payloadObj.selectedCategoryItems).forEach((key)=> {
                if (payloadObj.selectedCategoryItems[key] ===  undefined) {
                    hasValidationError = true;
                    this.addVacancyErrorMessage = this.filter('translate')('INVALID_INPUT');
                }
            });
        }
        return hasValidationError;
    }

    addNewVacancy(mdDialogData) {
        let fd = this.buildVacancyPayload(mdDialogData);

        this.addVacancyErrorMessage = null;
        this.errors = {};
        let validationError = this.validateVacancyPayload(mdDialogData);
        if(validationError){
            return;
        }

        // this.createdVacancy = {
        //     'uuid': null
        // };
        this.showLoader();
        this.httpObj({
            method: "POST",
            url: this.coreFactory.systemSettings.ROOT_API_URL + `jobs/vacancy/`,
            data: fd,
            headers: {
                "Content-Type": undefined,
                'Authorization': this.coreFactory.systemSettings.SYSTEM_DEFAULT_AUTHORIZATION_HEADER_VALUE_PREFIX + this.coreFactory.storageHandler.getToken()
            }
        }).then((response) => {
            this.createdVacancy = response.data.results;
            this.updateVacancyCategoryItems(mdDialogData);
        }, (errResponse) => {
            if(errResponse.status === 403) {
                // this.coreFactory.storageHandler.setValue('isAuthenticated', false);
                this.coreFactory.storageHandler.destroyAllStorage();
                this.state.go('login', {}, {
                    reload: true
                });
                // this.location.path('/login');                    
            } else {
                this.addVacancyErrorMessage = errResponse.data['message_code'];
                let errorObj = errResponse.data['errors'];
                this.errors={};
                let len = errorObj.length;
                for( let i = 0 ; i < len ; i++ ) {
                    if(errorObj[i].field) {
                        this.errors[errorObj[i].field] = errorObj[i].message;
                    }
                }
                this.hideLoader();
                //this.cancel();
            }
        });
    }

    checkUpdateCount() {
        if (this.updatedVacancyCategoryItemCount > 0 && this.updatedVacancyCategoryItemCallbackCount == this.updatedVacancyCategoryItemCount) {
            this.updatedVacancyCategoryItemCount = 0;
            this.updatedVacancyCategoryItemCallbackCount = 0;
            this.getVacancyList();
        }
    }

    updateVacancyCategoryItems(mdDialogData) {
        let payloadObj;
        this.updatedVacancyCategoryItemCount = 0;
        this.updatedVacancyCategoryItemCallbackCount = 0;
        for (let key in mdDialogData.weightFactor) {
            payloadObj = {};
            payloadObj.category_item_uuids = this.buildUuids(mdDialogData, key);
            if (payloadObj.category_item_uuids == '') {
                // this.cancel();
                continue;
            }
            this.updatedVacancyCategoryItemCount++;
            if (this.coreFactory.objectHelper.isNotNull(this.createdVacancy, 'uuid')) {
                payloadObj.vacancy_uuid = this.createdVacancy.uuid;
            } else {
                payloadObj.vacancy_uuid = mdDialogData.uuid;
            }
            payloadObj.weight_factor = mdDialogData.weightFactor[key];
            this.service.apiModuleUrl = `jobs/vacancy-category-item/bulk/`;
            let params = {
                errorId: 'ctrl_vacancies_2',
                payload: payloadObj,
                service: this.service,
                parentObj: this,
                successFieldKey: 'vacancyCategoryItemSuccess'
            };
            this.callSave(params, (response, originalResponse) => {
                this.hideLoader();
                if (!response.hasError) {
                    let msg = 'Vacancy category items has been added successfully!';
                    this.cancel();
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
                this.updatedVacancyCategoryItemCallbackCount++;
                this.checkUpdateCount();
            });
        }
        this.createdVacancy.uuid = null;
    }

    updateExistingVacancy(mdDialogData) {
        let fd = this.buildVacancyPayload(mdDialogData);

        this.addVacancyErrorMessage = null;
        this.errors = {};
        let validationError = this.validateVacancyPayload(mdDialogData);
        if(validationError){
            return;
        }

        this.showLoader();
        this.httpObj({
            method: "PUT",
            url: this.coreFactory.systemSettings.ROOT_API_URL + `jobs/vacancy/` + mdDialogData.uuid + `/`,
            data: fd,
            headers: {
                "Content-Type": undefined,
                'Authorization': this.coreFactory.systemSettings.SYSTEM_DEFAULT_AUTHORIZATION_HEADER_VALUE_PREFIX + this.coreFactory.storageHandler.getToken()
            }
        }).then((response) => {
            this.updateVacancyCategoryItems(mdDialogData);
        }, (errResponse) => {
            if(errResponse.status === 403) {
                // this.coreFactory.storageHandler.setValue('isAuthenticated', false);
                this.coreFactory.storageHandler.destroyAllStorage();
                this.state.go('login', {}, {
                    reload: true
                });
                // this.location.path('/login');                    
            } else {
                this.addVacancyErrorMessage = errResponse.data['message_code'];
                let errorObj = errResponse.data['errors'];
                this.errors={};
                let len = errorObj.length;
                for( let i = 0 ; i < len ; i++ ) {
                    if(errorObj[i].field) {
                        this.errors[errorObj[i].field] = errorObj[i].message;
                    }
                }
                this.hideLoader();
                //this.cancel();
            }
        });
    }

    // vacancy update modal
    updateVacancy(ev, dataToPass, index) {
        let len;
        len = dataToPass.vacancy_category_item_list.length;
        this.addVacancyErrorMessage = null;
        this.errors = {};
        dataToPass = this.initializeCategoryItemsAndWeight(dataToPass);
        dataToPass = this.processWeightFactor(dataToPass);
        dataToPass = this.processVacancyCategoies(dataToPass, 'vacancy_category_item_list');
        dataToPass.selectedCompany = dataToPass.company;
        dataToPass.end_date_picker = this.coreFactory.momentJs(dataToPass.end_date, this.coreFactory.systemSettings.SYSTEM_DATE_TIME_FORMAT).format(this.coreFactory.systemSettings.REVERSE_DATEPICKER_DATE_TIME_FORMAT);
        this.mdDialog.show({
                locals: {
                    dataToPass: dataToPass,
                    thisCntrlr: this,
                    index: index,
                    service: this.service,
                    parentCtrl: this,
                    companyList: this.companyList,
                    jobCategoryList: this.jobCategoryList,
                    coreFactory: this.coreFactory,
                    moment: this.coreFactory.momentJs,
                },
                controller: this.updateVacancyMdDialogCtrl,
                template: require('./add_vacancies_template.html'),
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true,
                fullscreen: this.customFullscreen // Only for -xs, -sm breakpoints.
            })
            .then((answer) => {

                this.scope.$digest();
                this.status = 'You said the information was "' + answer + '".';
            }, () => {
                this.status = 'You cancelled the dialog.';
            });
    }

    updateVacancyMdDialogCtrl($scope, $http, Upload, $timeout, service, parentCtrl, companyList, moment, dataToPass, thisCntrlr, index, jobCategoryList, coreFactory) {
        this.scope = $scope;
        $scope.thisCntrlr = thisCntrlr;
        $scope.coreFactory = coreFactory;
        $scope.isUpdate = true;
        $scope.mdDialogData = Object.assign({}, dataToPass);
        if ($scope.mdDialogData.vacancy_image_view_link) {
            $scope.isImage = true;

            //to load image after update
            let imageUrl = $scope.thisCntrlr.coreFactory.systemSettings.ROOT_API_URL + $scope.mdDialogData.vacancy_image_view_link;
            let to = imageUrl.lastIndexOf('/');
            imageUrl = to != -1 ? imageUrl.substring(0, to) + "?" + new Date().getTime() : imageUrl;
            $scope.vacancyImage = imageUrl;
            //$scope.vacancyImage = $scope.thisCntrlr.coreFactory.systemSettings.ROOT_API_URL + $scope.mdDialogData.vacancy_image_view_link;
        } else {
            $scope.isImage = false;
            //$scope.vacancyImage = '../../../assets/img/no-image.jpg';
        }

        $scope.imgChosen = function(file) {
            if(file[0] === undefined) {
                return;
            } else {
                $scope.vacancyImage = file[0];
                $scope.thisCntrlr.vacancyImage = file[0];
                $scope.fileExt = file[0].name.split(".").pop();

                if($scope.fileExt.match(/^(jpg|jpeg|gif|png)$/)) {
                    $scope.isImage = true;
                } else {
                    $scope.isImage = false;
                }
            }
        }

        $scope.index = index;
        $scope.service = service;
        $scope.parentCtrl = parentCtrl;
        $scope.companyList = companyList;
        $scope.moment = moment;
        $scope.jobCategoryList = jobCategoryList;
        $scope.checkIfPreSelected = function checkIfPreSelected(childItem, mdDialogData, coreFactory) {
            if (coreFactory.objectHelper.isNotNull(mdDialogData, 'selectedCategoryItemUuidList') && mdDialogData.selectedCategoryItemUuidList.indexOf(childItem.uuid) >= 0) {
                return true;
            } else {
                return false;
            }
        };
    }

    goToVacancyDetails(vacancyObj) {
        this.service.goToVacancyDetailComp(vacancyObj);
    }

    //Delete confirmation
    showConfirm(ev, vacancy, index) {
        // Appending dialog to document.body to cover sidenav in docs app
        let confirm = this.mdDialog.confirm()
            .title(this.filter('translate')('DELETE_CONFIRMATION_HEADER_TEXT'))
            .textContent(this.filter('translate')('DELETE_CONFIRMATION_TEXT'))
            .ariaLabel('Lucky day')
            .targetEvent(ev)
            .ok(this.filter('translate')('YES_TEXT'))
            .cancel(this.filter('translate')('NO_TEXT'));

        this.mdDialog.show(confirm).then(() => {
            this.showLoader();
            this.status = 'Yes.';

            this.service.apiModuleUrl = `jobs/vacancy/`;

            let params = {
                parentObj: this,
                service: this.service,
                uuid: vacancy.uuid
            };

            this.callDelete(params, (response, originalResponse) => {
                if (!response.hasError) {
                    this.vacancyList.splice(index, 1);
                    this.hideLoader();
                    this.scope.$digest();
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
        }, () => {
            this.status = 'No';
        });
    }

    canAddEditDelete(){
        this.user_group_type = this.coreFactory.storageHandler.getValue('user_group_type');
        if (this.user_group_type == 'employee_user') {
            return false;
        } else {
            return true;
        }
    }

    emitNavbarStatus() {
        this.scope.$emit('navbarStatus', true);
    }

    emitSideNavbarStatus(value) {
        this.scope.$emit('showSideNav', value);
    }
}

FavouriteVacanciesController.$inject = ['favouriteVacancyService', '$scope', '$window', 'CONST', '$rootScope', '$stateParams', 'coreFactory', '$mdDialog', '$element', '$http', '$filter', '$state'];
