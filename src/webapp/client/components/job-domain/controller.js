import BaseAngularController from './../../shared/jslizer-files/angular/base-angular-controller';

export default class JobdomainController extends BaseAngularController {

    constructor(jobdomainService, $scope, $window, CONST, $rootScope, $stateParams, coreFactory, $mdDialog, $element, $filter, $state) {
        super();
        this.rootScope = $rootScope;
        this.scope = $scope;
        this.stateParams = $stateParams;
        this.state = $state;
        this.service = jobdomainService;
        this.coreFactory = coreFactory;
        this.mdDialog = $mdDialog;
        this.element = $element;
        this.loader = false;
        this.filter = $filter;

        this.customFullscreen = false;
        this.errorMessage = null;
        this.hideForm = true;
        this.status = "";
        this.registrationSuccess = "";
        this.searchTerm = '';
        this.searchFields = [
            "uuid",
            "description",
            "title",
        ];

        this.getSelectedText = function() {
            if (this.selectedItem !== undefined) {
                return "Filter by : " + this.selectedItem;
            } else {
                return "Filter by ";
            }
        };

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

        this.emitSideNavbarStatus(true);
        this.emitNavbarStatus();

        this.jobdomainList = [];
        this.jobdomainListItemList = [];
        this.getJobdomainList();
    }


    hideLoader() {
        this.loader = false;
    }

    showLoader() {
        this.loader = true;
    }

    clearsearchTerms() {
        this.searchTerm = '';
    }

    // Category add
    addJobdomain(ev) {
        this.mdDialog.show({
            locals: {
                service: this.service,
                thisCntrlr: this
            },
            controller: this.addJobdomainMdDialogCtrl,
            template: require('./add_jobdomain_template.html'),
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

    // Category Add controller
    addJobdomainMdDialogCtrl($scope, service, thisCntrlr) {

        $scope.mdDialogData = {};
        $scope.service = service;
        $scope.thisCntrlr = thisCntrlr;
        $scope.addJobdomainErrorMessage = null;

        $scope.addJobdomain = (mdDialogData) => {
            $scope.service.apiModuleUrl = `jobs/job-domain/`;

            let params = {
                errorId: 'ctrl_jobdomain_list_1',
                payload: mdDialogData,
                service: $scope.service,
                schema: $scope.service.jobdomainSchema,
                parentObj: $scope,
                errorMessageFieldKey: 'addJobdomainErrorMessage',
                successFieldKey: 'jobdomainAdded',
            };

            $scope.thisCntrlr.callSave(params, (response) => {
                if (!response.hasError) {
                    $scope.thisCntrlr.cancel();
                    $scope.thisCntrlr.getJobdomainList();
                } else {
                    if(!!originalResponse && originalResponse.status_code === 403) {
                        // this.coreFactory.storageHandler.setValue('isAuthenticated', false);
                        $scope.thisCntrlr.coreFactory.storageHandler.destroyAllStorage();
                        $scope.thisCntrlr.state.go('login', {}, {
                            reload: true
                        });
                        // this.location.path('/login');                    
                    }
                }
                // $scope.$digest();
            });
        }
    }

    // Category update
    editJobDomain(ev, dataToPass) {
        this.mdDialog.show({
            locals: {
                dataToPass: dataToPass,
                service: this.service,
                thisCntrlr: this
            },
            controller: this.updateJobdomainMdDialogCtrl,
            template: require('./add_jobdomain_template.html'),
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

    // Category update controller
    updateJobdomainMdDialogCtrl($scope, $timeout, service, thisCntrlr, dataToPass) {

        $scope.isUpdate = true;
        $scope.mdDialogData = Object.assign({}, dataToPass);
        $scope.service = service;
        $scope.thisCntrlr = thisCntrlr;
        $scope.addJobdomainErrorMessage = null;

        $scope.updateJobDomain = (mdDialogData) => {
            $scope.service.apiModuleUrl = `jobs/job-domain/`;

            let params = {
                errorId: 'ctrl_jobdomain_update_4',
                payload: $scope.mdDialogData,
                service: $scope.service,
                schema: $scope.service.jobdomainSchema,
                parentObj: $scope,
                errorMessageFieldKey: 'addJobdomainErrorMessage',
                successFieldKey: 'jobdomainUpdated',
                uuid: $scope.mdDialogData.uuid
            };

            $scope.thisCntrlr.callUpdate(params, (response) => {
                if (!response.hasError) {
                    $scope.thisCntrlr.cancel();
                    $scope.thisCntrlr.getJobdomainList();
                } else {
                    if(!!originalResponse && originalResponse.status_code === 403) {
                        // this.coreFactory.storageHandler.setValue('isAuthenticated', false);
                        $scope.thisCntrlr.coreFactory.storageHandler.destroyAllStorage();
                        $scope.thisCntrlr.state.go('login', {}, {
                            reload: true
                        });
                        // this.location.path('/login');                    
                    }
                }
                // $scope.$digest();
            });
        }
    }

    getJobdomainList(queryObj = null) {
        this.showLoader();
        if (this.coreFactory.objectHelper.isNull(queryObj)) {
            queryObj = this.paginationQuery;
        }
        this.service.apiModuleUrl = 'jobs/job-domain/';
        let params = {
            service: this.service,
            parentObj: this,
            queryObj: queryObj,
            errorId: 'ctrl_jobdomain_list_1',
            successFieldKey: 'jobdomainList'
        };
        this.callListing(params, (response, originalResponse) => {
            if (!response.hasError) {
                this.calculatePagination(response);
                this.jobdomainList = response.results;
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
    showConfirm(ev, jobdomain) {
        // Appending dialog to document.body to cover sidenav in docs app
        let confirm = this.mdDialog.confirm()
          .title(this.filter('translate')('DELETE_CONFIRMATION_HEADER_TEXT'))
          .textContent(this.filter('translate')('DELETE_CONFIRMATION_TEXT'))
          .ariaLabel('Lucky day')
          .targetEvent(ev)
          .ok(this.filter('translate')('YES_TEXT'))
          .cancel(this.filter('translate')('NO_TEXT'));

        this.mdDialog.show(confirm).then(() => {
            this.status = 'Yes.';
            this.service.apiModuleUrl = `jobs/job-domain/`;

            let params = {
                parentObj: this,
                service: this.service,
                uuid: jobdomain.uuid
            };

            this.callDelete(params, (response) => {
                if (!response.hasError) {
                    this.getJobdomainList();
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

JobdomainController.$inject = ['jobdomainService', '$scope', '$window', 'CONST', '$rootScope', '$stateParams', 'coreFactory', '$mdDialog', '$element', '$filter', '$state'];
