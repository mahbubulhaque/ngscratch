import BaseAngularController from '../../shared/jslizer-files/angular/base-angular-controller';

export default class LoginCodeController extends BaseAngularController {

    constructor(loginCodeService, $scope, $window, CONST, $rootScope, $stateParams, coreFactory, $mdDialog, $element, $mdToast, $state) {
        super();
        this.rootScope = $rootScope;
        this.scope = $scope;
        this.stateParams = $stateParams;
        this.state = $state;
        this.service = loginCodeService;
        this.coreFactory = coreFactory;
        this.mdDialog = $mdDialog;
        this.element = $element;
        this.mdToast = $mdToast;

        this.loader =  false;
        this.customFullscreen = false;
        this.hideForm = true;
        this.errorMessage = null;
        this.status = "";
        this.registrationSuccess = "";
        this.userData = {};

        this.searchTerm = '';
        this.searchFields = [
            "uuid",
            "user__first_name",
            "user__last_name",
            "user__email",
        ];

        this.actype = {
            name: 'Link',
        };
        this.country = {
            name: 'United States',
            code: '+1',
            selected: true,
        };
        this.emitNavbarStatus();
        this.emitSideNavbarStatus(true);


        this.pages = ['1', '2', '3', '4', '5', '6', '7'];
        this.selectedPage = 1;
        this.getSelectedPage = function() {
            if (this.selectedPage !== undefined) {
                return this.selectedPage;
            } else {
                return this.selectedPage;
            }
        };

        this.pagerows = ['10', '25', '50', '100'];
        this.selectedPageSize = 10;
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

        this.cancel = () => {
            $mdDialog.cancel();
        };

        this.answer = (answer) => {
            $mdDialog.hide(answer);
        };


        this.showSuccessMessage = () => {

            this.mdToast.show(
                this.mdToast.simple()
                .textContent('Item has added successfully!')
                .action('Close')
                .highlightClass('md-success')
                .position('bottom right')
                .hideDelay(3000)
            );
        };

        this.closeToast = function() {
            this.mdToast.hide();
        };

        this.loginCodeList = [];
        this.getLoginCodeList();
    }

    hideLoader() {
        this.loader = false;
    }

    showLoader() {
        this.loader = true;
    }

    //Add login code
    addLoginCode(ev) {
        this.mdDialog.show({
                locals: {
                    service: this.service,
                    thisCntrlr: this
                },
                controller: this.addLoginCodeMdDialogCtrl,
                template: require('./add_login_code_template.html'),
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

    addLoginCodeMdDialogCtrl($scope, service, thisCntrlr) {

        $scope.mdDialogData = {};
        $scope.service = service;
        $scope.thisCntrlr = thisCntrlr;
        $scope.loginCodeTypeArray = [{
                name: 'Outplacement',
                value: 0
            },
            {
                name: 'Sustainable Employability',
                value: 1
            }
        ];

        $scope.addNewLoginCode = (mdDialogData) => {
            mdDialogData.user_uuid = $scope.thisCntrlr.coreFactory.storageHandler.getValue('userUUID');
            $scope.service.apiModuleUrl = `users/user-login-code/`;
            let params = {
                errorId: 'ctrl_login_code_save_2',
                payload: mdDialogData,
                service: $scope.service,
                schema: $scope.service.loginCodeSchema,
                parentObj: this,
                successFieldKey: 'addLoginCode'
            };

            $scope.thisCntrlr.callSave(params, (response, originalResponse) => {
                if (!response.hasError) {
                    $scope.thisCntrlr.cancel();
                    $scope.thisCntrlr.getLoginCodeList();
                    // TODO: Need to add success toast message
                    // $scope.showSuccessMessage();
                    $scope.$digest();
                } else {                    
                    if(!!originalResponse && originalResponse.status_code === 403) {
                        // this.coreFactory.storageHandler.setValue('isAuthenticated', false);
                        $scope.thisCntrlr.coreFactory.storageHandler.destroyAllStorage();
                        $scope.thisCntrlr.state.go('login', {}, {
                            reload: true
                        });
                        // this.location.path('/login');                    
                    } else {                
                        if (response.errors !== '') {
                            $scope.errorMessage = 'Invalid input';
                            $scope.errors = response.errors;
                        } else {
                            $scope.errorMessage = 'Company already exists.';
                            $scope.$digest();
                        }
                    }
                }
            });

        }

    }

    // User logincode update
    updateLoginCode(ev, dataToPass) {
        this.mdDialog.show({
                locals: {
                    dataToPass: dataToPass,
                    service: this.service,
                    thisCntrlr: this
                },
                controller: this.updateLoginCodeMdDialogCtrl,
                template: require('./add_login_code_template.html'),
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

    updateLoginCodeMdDialogCtrl($scope, service, thisCntrlr, dataToPass) {

        $scope.isUpdate = true;
        $scope.mdDialogData = Object.assign({}, dataToPass);
        $scope.service = service;
        $scope.thisCntrlr = thisCntrlr;
        $scope.loginCodeTypeArray = [{
                name: 'Outplacement',
                value: 0
            },
            {
                name: 'Sustainable Employability',
                value: 1
            }
        ];

        $scope.updateLoginCode = (mdDialogData) => {
            mdDialogData.user_uuid = $scope.thisCntrlr.coreFactory.storageHandler.getValue('userUUID');
            $scope.service.apiModuleUrl = `users/user-login-code/`;

            let params = {
                errorId: 'ctrl_user_profile_update_2',
                payload: mdDialogData,
                service: $scope.service,
                schema: $scope.service.userUpdateSchema,
                parentObj: this,
                successFieldKey: 'userUpdated',
                uuid: mdDialogData.uuid
            };

            $scope.thisCntrlr.callUpdate(params, (response, originalResponse) => {
                if (!response.hasError) {
                    $scope.thisCntrlr.cancel();
                    $scope.thisCntrlr.getLoginCodeList();
                }  else {
                    if(!!originalResponse && originalResponse.status_code === 403) {
                        // this.coreFactory.storageHandler.setValue('isAuthenticated', false);
                        $scope.thisCntrlr.coreFactory.storageHandler.destroyAllStorage();
                        $scope.thisCntrlr.state.go('login', {}, {
                            reload: true
                        });
                        // this.location.path('/login');                    
                    }
                }
                $scope.$digest();
            });
        }
    }

    getLoginCodeList(queryObj = null) {
        this.showLoader();
        if (this.coreFactory.objectHelper.isNull(queryObj)) {
            queryObj = this.paginationQuery;
        }
        this.service.apiModuleUrl = 'users/user-login-code/';
        let params = {
            service: this.service,
            parentObj: this,
            queryObj: queryObj,
            errorId: 'ctrl_login_code_list_1',
            successFieldKey: 'loginCodeList'
        };
        this.callListing(params, (response, originalResponse) => {
            if (!response.hasError) {
                this.calculatePagination(response);
                this.loginCodeList = response.results;
                this.loginCodeList.forEach((obj) => {
                    if (obj.login_code_type === 0) {
                        obj.lCodeType = 'Outplacement';
                    } else {
                        obj.lCodeType = 'Sustainable Employability';
                    }
                });
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
    showConfirm(ev, data) {
        // Appending dialog to document.body to cover sidenav in docs app
        let confirm = this.mdDialog.confirm()
            .title('Delete Confirmation')
            .textContent('Would you like to delete this item?')
            .ariaLabel('Lucky day')
            .targetEvent(ev)
            .ok('Yes')
            .cancel('No');

        this.mdDialog.show(confirm).then(() => {
            this.status = 'Yes.';

            this.service.apiModuleUrl = `users/user-login-code/`;

            let params = {
                parentObj: this,
                service: this.service,
                uuid: data.uuid
            };

            this.callDelete(params, (response, originalResponse) => {
                if (!response.hasError) {
                    this.getLoginCodeList();
                    this.scope.$digest();
                    // TODO: integrate loader
                    // this.timeout(() => {
                    //   this.isDeleted = false;
                    // }, 2000);
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

    emitNavbarStatus() {
        this.scope.$emit('navbarStatus', true);
    }

    emitSideNavbarStatus(value) {
        this.scope.$emit('showSideNav', value);
    }
}

LoginCodeController.$inject = ['loginCodeService', '$scope', '$window', 'CONST', '$rootScope', '$stateParams', 'coreFactory', '$mdDialog', '$element', '$mdToast', '$state'];
