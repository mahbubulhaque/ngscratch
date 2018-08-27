import BaseAngularController from './../../shared/jslizer-files/angular/base-angular-controller';

export default class CategoryValidationsController extends BaseAngularController {

    constructor(categoryValidationsService, $scope, $window, CONST, $rootScope, $stateParams, coreFactory,
                $mdDialog, $element, $mdToast, $filter, $state) {
        super();
        this.rootScope = $rootScope;
        this.scope = $scope;
        this.stateParams = $stateParams;
        this.state = $state;
        this.service = categoryValidationsService;
        this.coreFactory = coreFactory;
        this.mdDialog = $mdDialog;
        this.element = $element;
        this.mdToast = $mdToast;

        this.loader = false;
        this.filter = $filter;
        this.errorMessage = null;
        this.customFullscreen = false;
        this.hideForm = true;
        this.registrationSuccess = "";
        this.status = "";
        this.searchTerm = '';

        this.getSelectedText = function() {
            if (this.selectedJobCategory !== undefined) {
                return "Filter by : " + this.selectedJobCategory.name;
            } else {
                return "Filter by ";
            }
        };

        this.getSelectedPage = function() {
            if (this.selectedPage !== undefined) {
                return this.selectedPage;
            } else {
                return 1;
            }
        };

        this.getSelectedPageSize = function() {
            if (this.selectedPageSize !== undefined) {
                return this.selectedPageSize;
            } else {
                return this.coreFactory.systemSettings.DEFAULT_PAGE_SIZE;
            }
        };

        this.hide = () => {
            $mdDialog.hide();
        };

        this.closeToast = function() {
            this.mdToast.hide();
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

        this.categoryList = [];
        this.categoryValidationList = [];
        this.getCategoryValidationList();
    }    

    hideLoader() {
        this.loader = false;
    }

    showLoader() {
        this.loader = true;
    }


    filterChanged() {
        this.filterQuery = {};
        if (this.coreFactory.objectHelper.isNotNull(this.selectedJobCategory, 'uuid')) {
            this.filterQuery.job_category__name = this.selectedJobCategory.name;
        }
        this.searchTermChanged('getCategoryValidationList');
    }


    //Category Validation update
    updateCategoryValidation(ev, dataToPass) {
        this.mdDialog.show({
                locals: {
                    dataToPass: dataToPass,
                    service: this.service,
                    thisCntrlr: this,
                },
                controller: this.updateCategoryValidationMdDialogCtrl,
                template: require('./edit_ctg_validations_template.html'),
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

    // Category Validation update controller
    updateCategoryValidationMdDialogCtrl($scope, service, thisCntrlr, dataToPass) {

        $scope.isUpdate = true;
        $scope.mdDialogData = Object.assign({}, dataToPass);
        $scope.service = service;
        $scope.thisCntrlr = thisCntrlr;
        $scope.addCategoryValidationErrorMessage = null;

        $scope.updateCtgValidation = (mdDialogData) => {
            $scope.service.apiModuleUrl = `jobs/category-item-validation/`;
            let payload = {};
            payload.job_category_uuid = mdDialogData.job_category.uuid;
            payload.min_item = mdDialogData.min_item;
            payload.max_item = mdDialogData.max_item;
            payload.type = mdDialogData.type;
            let params = {
                errorId: 'ctrl_category_validation_update_2',
                payload: payload,
                service: $scope.service,
                schema: $scope.service.categoryValidationSchema,
                parentObj: $scope,
                errorMessageFieldKey: 'addCategoryValidationErrorMessage',
                successFieldKey: 'categoryValidationUpdated',
                uuid: mdDialogData.uuid
            };

            $scope.thisCntrlr.callUpdate(params, (response, originalResponse) => {
                if (!response.hasError) {
                    $scope.thisCntrlr.cancel();
                    let msg = $scope.thisCntrlr.filter('translate')('VALIDATION_UPDATE_SUCCESS');
                    $scope.thisCntrlr.showSuccessMessage(msg);
                    $scope.thisCntrlr.getCategoryValidationList();
                } else {
                    if(!!originalResponse && originalResponse.status_code === 403) {
                        // this.coreFactory.storageHandler.setValue('isAuthenticated', false);
                        $scope.thisCntrlr.coreFactory.storageHandler.destroyAllStorage();
                        $scope.thisCntrlr.state.go('login', {}, {
                            reload: true
                        });
                        // this.location.path('/login');
                    }
                    else {
                        $scope.$digest();
                    }

                }
            });
        }
    }


    getCategoryValidationList(queryObj = null) {
        this.showLoader();
        if (this.coreFactory.objectHelper.isNull(queryObj)) {
            queryObj = this.paginationQuery;
        }
        queryObj.type = 1;
        this.service.apiModuleUrl = 'jobs/category-item-validation/';
        let params = {
            service: this.service,
            parentObj: this,
            queryObj: queryObj,
            errorId: 'ctrl_category_validation_list_1',
            successFieldKey: 'categoryValidationList'
        };
        this.callListing(params, (response, originalResponse) => {
            if (!response.hasError) {
                this.calculatePagination(response);
                this.categoryValidationList = response.results;
                this.hideLoader();
                this.scope.$digest();
            } else {
                this.hideLoader();
                if(!!originalResponse && originalResponse.status_code === 403) {
                    this.mdDialog.cancel();
                    // this.coreFactory.storageHandler.setValue('isAuthenticated', false);
                    this.coreFactory.storageHandler.destroyAllStorage();
                    this.state.go('login', {}, {
                        reload: true
                    });
                }
            }
        });
    }


    emitNavbarStatus() {
        this.scope.$emit('navbarStatus', true);
    }

    emitSideNavbarStatus(value) {
        this.scope.$emit('showSideNav', value);
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
    showErrorMessage(msg) {
        this.mdToast.show(
            this.mdToast.simple()
            .textContent(msg)
            .action('Close')
            .highlightClass('md-error')
            .position('bottom right')
            .hideDelay(3000)
        );
    }

}

CategoryValidationsController.$inject = ['categoryValidationsService', '$scope', '$window', 'CONST', '$rootScope',
    '$stateParams', 'coreFactory', '$mdDialog', '$element', '$mdToast', '$filter', '$state'];
