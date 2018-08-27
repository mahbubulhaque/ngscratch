import BaseAngularController from '../../shared/jslizer-files/angular/base-angular-controller';

export default class CompanyController extends BaseAngularController {

    constructor(companyService, $scope, $window, CONST, $rootScope, $stateParams, coreFactory, $mdDialog, $element, $mdToast, $http, $filter, $state) {
        super();
        this.rootScope = $rootScope;
        this.scope = $scope;
        this.stateParams = $stateParams;
        this.state = $state;
        this.service = companyService;
        this.coreFactory = coreFactory;
        this.mdDialog = $mdDialog;
        this.element = $element;
        this.mdToast = $mdToast;
        this.httpObj = $http;

        this.loader = false;
        this.filter = $filter;

        this.companyImage = null;
        this.errors = {};
        this.isImage = false;
        this.fileExt = '';
        this.addCompanyErrorMessage = null;

        this.searchTerm = '';
        this.searchFields = [
            "uuid",
            "name",
            "contact_person",
            "contact_info"
        ];

        // this.items = [{
        //         'name': 'All'
        //     },
        //     {
        //         'name': 'Outplacement',
        //         'value': 0
        //     }, {
        //         'name': 'Sustainable',
        //         'value': 1
        //     }
        // ];
        // this.selectedItem = {
        //     'name': 'All'
        // };

        // this.getSelectedText = function() {
        //     if (this.selectedItem !== undefined) {
        //         return "Filter by : " + this.selectedItem.name;
        //     } else {
        //         return "Filter by ";
        //     }
        // };

        this.getSelectedPage = function() {
            if (this.selectedPage !== undefined) {
                return this.selectedPage;
            } else {
                return this.selectedPage;
            }
        };

        this.getSelectedPageSize = function() {
            if (this.selectedPageSize !== undefined) {
                return this.selectedPageSize;
            } else {
                return this.selectedPageSize;
            }
        };

        this.addCompanyItem = () => {
            $mdDialog.cancel();
            this.showSuccessMessage();
        };


        this.hide = () => {
            $mdDialog.hide();
        };

        this.answer = (answer) => {
            $mdDialog.hide(answer);
        };

        this.closeToast = function() {
            this.mdToast.hide();
        };

        this.emitNavbarStatus();
        this.emitSideNavbarStatus(true);

        this.companyList = [];
        this.getCompanyList();
        this.getUserData();
        this.setUserGroupType();
    }    

    hideLoader() {
        this.loader = false;
    }

    showLoader() {
        this.loader = true;
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
    // company add with image
    imgChosen(file) {
        if(file[0] === undefined) {
            return;
        } else {
            this.companyImage = file[0];
            this.fileExt = file[0].name.split(".").pop();

            if(this.fileExt.match(/^(jpg|jpeg|gif|png)$/)) {
                this.isImage = true;
            } else {
                this.isImage = false;
            }
        }
    }

    buildCompanyPayload(mdDialogData) {
        let payloadObj = Object.assign({}, mdDialogData);
        let fd = new FormData();
        if (this.companyImage) {
            fd.append("company_image", this.companyImage);
        }
        fd.append("name", payloadObj.name !== undefined ? payloadObj.name : '');
        fd.append("description", payloadObj.description !== undefined ? payloadObj.description : '');
        fd.append("address", payloadObj.address !== undefined ? payloadObj.address : '');
        fd.append("contact_person", payloadObj.contact_person !== undefined ? payloadObj.contact_person : '');
        fd.append("contact_info", payloadObj.contact_info !== undefined ? payloadObj.contact_info : '');
        return fd;
    }

    //Add user profile
    addCompany(ev) {
        this.companyImage = null;
        this.isImage = false;
        this.errors = {};
        this.addCompanyErrorMessage = null;
        this.mdDialog.show({
            locals: {
                service: this.service,
                parentCtrl: this
            },
            controller: this.addCompanyMdDialogCtrl,
            template: require('./add_company_template.html'),
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

    addCompanyMdDialogCtrl($scope, $http, Upload, $timeout, service, parentCtrl) {
        $scope.service = service;
        $scope.parentCtrl = parentCtrl;
        $scope.mdDialogData = {};
        $scope.uniqueCheckCB = (value, index, self) => {
            return self.indexOf(value) === index;
        }
    }

    //added custom check for now. Need to make dynamic later
    validateCompanyPayload(form_data){
        let hasValidationError = false;
        let payloadObj = Object.assign({}, form_data);

        if(!payloadObj.name){
            hasValidationError = true;
            this.addCompanyErrorMessage = this.filter('translate')('INVALID_INPUT');
            this.errors['name'] = this.filter('translate')('REQUIRED_FIELD_VALIDATION_TEXT');
        }else if(payloadObj.name && payloadObj.name.length > 128){
            hasValidationError = true;
            this.addCompanyErrorMessage =  this.filter('translate')('INVALID_INPUT');
            this.errors['name'] = this.filter('translate')('MAX_LIMIT')+ " : 128 chars";
        }
        else{
            this.errors['name'] = null;
        }

        if(payloadObj.contact_person && payloadObj.contact_person.length > 128){
            hasValidationError = true;
            this.addCompanyErrorMessage = this.filter('translate')('INVALID_INPUT');
            this.errors['contact_person'] = this.filter('translate')('MAX_LIMIT')+ " : 128 chars";
        }else{
            this.errors['contact_person'] = null;
        }
        return hasValidationError;
    }

    addNewCompany(mdDialogData) {
        let fd = this.buildCompanyPayload(mdDialogData);
        this.addCompanyErrorMessage = null;
        this.errors = {};
        let validationError = this.validateCompanyPayload(mdDialogData);
        if(validationError){
            return;
        }
        this.showLoader();
        this.httpObj({
            method: "POST",
            url: this.coreFactory.systemSettings.ROOT_API_URL + `users/company/`,
            data: fd,
            headers: {
                "Content-Type": undefined,
                'Authorization': this.coreFactory.systemSettings.SYSTEM_DEFAULT_AUTHORIZATION_HEADER_VALUE_PREFIX + this.coreFactory.storageHandler.getToken()
            }
        }).then((response) => {
            this.cancel();
            this.getCompanyList();
            this.showSuccessMessage('Company has been added successfully!');
        }, (errResponse) => {
            if(errResponse.status === 403) {
                // this.coreFactory.storageHandler.setValue('isAuthenticated', false);
                this.coreFactory.storageHandler.destroyAllStorage();
                this.state.go('login', {}, {
                    reload: true
                });
                // this.location.path('/login');                    
            } else {
                this.addCompanyErrorMessage = errResponse.data['message_code'];
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

    //update with image
    updateCompany(ev, dataToPass, index) {
        this.errors = {};
        this.addCompanyErrorMessage = null;
        this.mdDialog.show({
            locals: {
                dataToPass: dataToPass,
                thisCntrlr: this,
                index: index,
                service: this.service,
                parentCtrl: this,
                coreFactory: this.coreFactory,
            },
            controller: this.updateCompanyMdDialogCtrl,
            template: require('./add_company_template.html'),
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

    updateCompanyMdDialogCtrl($scope, $http, Upload, $timeout, service, parentCtrl, dataToPass, thisCntrlr, index, coreFactory) {
        this.scope = $scope;
        $scope.thisCntrlr = thisCntrlr;
        $scope.coreFactory = coreFactory;
        $scope.isUpdate = true;
        $scope.mdDialogData = Object.assign({}, dataToPass);
        if ($scope.mdDialogData.company_image_view_link) {
            $scope.isImage = true;

            //to load image after update
            let imageUrl = $scope.thisCntrlr.coreFactory.systemSettings.ROOT_API_URL + $scope.mdDialogData.company_image_view_link;
            let to = imageUrl.lastIndexOf('/');
            imageUrl = to != -1 ? imageUrl.substring(0, to) + "?" + new Date().getTime() : imageUrl;
            $scope.companyImage = imageUrl;
            //$scope.companyImage = $scope.thisCntrlr.coreFactory.systemSettings.ROOT_API_URL + $scope.mdDialogData.company_image_view_link;
        } else {
            $scope.isImage = false;
            $scope.companyImage = '../../../assets/img/no-image.jpg';
        }

        $scope.imgChosen = function(file) {
            if(file[0] === undefined) {
                return;
            } else {
                $scope.companyImage = file[0];
                $scope.thisCntrlr.companyImage = file[0];
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
    }

    updateComp(mdDialogData) {

        let fd = this.buildCompanyPayload(mdDialogData);

        this.addCompanyErrorMessage = null;
        this.errors = {};
        let validationError = this.validateCompanyPayload(mdDialogData);
        if(validationError){
            return;
        }
        this.showLoader();
        this.httpObj({
            method: "PUT",
            url: this.coreFactory.systemSettings.ROOT_API_URL + `users/company/` + mdDialogData.uuid + `/`,
            data: fd,
            headers: {
                "Content-Type": undefined,
                'Authorization': this.coreFactory.systemSettings.SYSTEM_DEFAULT_AUTHORIZATION_HEADER_VALUE_PREFIX + this.coreFactory.storageHandler.getToken()
            }
        }).then((response) => {
            this.cancel();
            this.showSuccessMessage('Company has been updated successfully!');
            this.getCompanyList();
        }, (errResponse) => {
            if(errResponse.status === 403) {
                // this.coreFactory.storageHandler.setValue('isAuthenticated', false);
                this.coreFactory.storageHandler.destroyAllStorage();
                this.state.go('login', {}, {
                    reload: true
                });
                // this.location.path('/login');                    
            } else {
                this.addCompanyErrorMessage = errResponse.data['message_code'];
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

    cancel() {
        this.mdDialog.cancel();
    }

    getCompanyList(queryObj = null) {
        this.showLoader();
        if (this.coreFactory.objectHelper.isNull(queryObj)) {
            queryObj = this.paginationQuery;
        }
        this.service.apiModuleUrl = 'users/company/';
        let params = {
            service: this.service,
            parentObj: this,
            queryObj: queryObj,
            errorId: 'ctrl_company_list_1',
            successFieldKey: 'companyList'
        };
        this.callListing(params, (response, originalResponse) => {
            if (!response.hasError) {
                this.calculatePagination(response);
                this.companyList = response.results;
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

    //Delete confirmation
    showConfirm(ev, company) {
        // Appending dialog to document.body to cover sidenav in docs app
        var confirm = this.mdDialog.confirm()
            .title(this.filter('translate')('DELETE_CONFIRMATION_HEADER_TEXT'))
            .textContent(this.filter('translate')('DELETE_CONFIRMATION_TEXT'))
            .ariaLabel('Lucky day')
            .targetEvent(ev)
            .ok(this.filter('translate')('YES_TEXT'))
            .cancel(this.filter('translate')('NO_TEXT'));

        this.mdDialog.show(confirm).then(() => {
            this.status = 'Yes.';

            this.service.apiModuleUrl = `users/company/`;

            let params = {
                parentObj: this,
                service: this.service,
                uuid: company.uuid
            };

            this.callDelete(params, (response, originalResponse) => {
                if (!response.hasError) {
                    let msg = 'Company has been deleted successfully!';
                    this.showSuccessMessage(msg);
                    this.getCompanyList();
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

    goToCompanyDetails(companyObj) {
        this.service.goToCompanyDetailsComp(companyObj);
    }

    emitNavbarStatus() {
        this.scope.$emit('navbarStatus', true);
    }

    emitSideNavbarStatus(value) {
        this.scope.$emit('showSideNav', value);
    }
    getUserData() {
        this.userEmail = this.coreFactory.storageHandler.getValue('email');
        this.userName = this.coreFactory.storageHandler.getValue('userName');
        this.avatar = this.coreFactory.storageHandler.getValue('avatar');
        this.user_group_type = this.coreFactory.storageHandler.getValue('user_group_type');                
    }
    setUserGroupType() {
        if (this.user_group_type) {
            switch(this.user_group_type) {
                case 'dashboard_user':
                    this.isDashboardUser = true;
                    this.isCompanyUser = false;
                    this.isEmployeeUser = false;
                    break;
                case 'company_user':
                    this.isDashboardUser = false;
                    this.isCompanyUser = true;
                    this.isEmployeeUser = false;
                    break;
                case 'employee_user':
                    this.isDashboardUser = false;
                    this.isCompanyUser = true;
                    this.isEmployeeUser = false;
                    break;
            }
        }
    }
}

CompanyController.$inject = ['companyService', '$scope', '$window', 'CONST', '$rootScope', '$stateParams', 'coreFactory', '$mdDialog', '$element', '$mdToast', '$http', '$filter', '$state'];
