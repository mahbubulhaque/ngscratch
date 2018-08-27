import BaseAngularController from './../../shared/jslizer-files/angular/base-angular-controller';

export default class CategoryController extends BaseAngularController {

    constructor(categoryService, $scope, $window, CONST, $rootScope, $stateParams, coreFactory, $mdDialog, $element, $filter, $state) {
        super();
        this.rootScope = $rootScope;
        this.scope = $scope;
        this.state = $state;
        this.stateParams = $stateParams;
        this.service = categoryService;
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
            "employee_usage_count",
            "name",
            "domain_usage_count",
            "vacancy_usage_count"
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

        this.categoryList = [];
        this.categoryItemList = [];
        this.getCategoryList();
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
    addCategory(ev) {
        this.mdDialog.show({
                locals: {
                    service: this.service,
                    thisCntrlr: this
                },
                controller: this.addCategoryMdDialogCtrl,
                template: require('./edit_ctg_template.html'),
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
    addCategoryMdDialogCtrl($scope, service, thisCntrlr) {

        $scope.mdDialogData = {};
        $scope.service = service;
        $scope.thisCntrlr = thisCntrlr;
        $scope.addCategoryErrorMessage = null;

        $scope.addCategory = (mdDialogData) => {
            $scope.service.apiModuleUrl = `jobs/job-category/`;

            let params = {
                errorId: 'ctrl_category_add_1',
                payload: mdDialogData,
                service: $scope.service,
                schema: $scope.service.categorySchema,
                parentObj: $scope,
                errorMessageFieldKey: 'addCategoryErrorMessage',
                successFieldKey: 'categoryAdded',
            };

            $scope.thisCntrlr.callSave(params, (response, originalResponse) => {
                if (!response.hasError) {
                    $scope.thisCntrlr.cancel();
                    $scope.thisCntrlr.getCategoryList();
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
    editCategory(ev, dataToPass) {
        this.mdDialog.show({
                locals: {
                    dataToPass: dataToPass,
                    service: this.service,
                    thisCntrlr: this
                },
                controller: this.updateCategoryMdDialogCtrl,
                template: require('./edit_ctg_template.html'),
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
    updateCategoryMdDialogCtrl($scope, $timeout, service, thisCntrlr, dataToPass) {

        $scope.isUpdate = true;
        $scope.mdDialogData = Object.assign({}, dataToPass);
        $scope.service = service;
        $scope.thisCntrlr = thisCntrlr;
        $scope.addCategoryErrorMessage = null;

        $scope.updateCategory = (mdDialogData) => {
            $scope.service.apiModuleUrl = `jobs/job-category/`;

            let params = {
                errorId: 'ctrl_category_update_4',
                payload: $scope.mdDialogData,
                service: $scope.service,
                schema: $scope.service.categorySchema,
                parentObj: $scope,
                errorMessageFieldKey: 'addCategoryErrorMessage',
                successFieldKey: 'categoryUpdated',
                uuid: $scope.mdDialogData.uuid
            };

            $scope.thisCntrlr.callUpdate(params, (response, originalResponse) => {
                if (!response.hasError) {
                    $scope.thisCntrlr.cancel();
                    $scope.thisCntrlr.getCategoryList();
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

    getCategoryList(queryObj = null) {
        this.showLoader();
        if (this.coreFactory.objectHelper.isNull(queryObj)) {
            queryObj = this.paginationQuery;
        }
        this.service.apiModuleUrl = 'jobs/job-category/';
        let params = {
            service: this.service,
            parentObj: this,
            queryObj: queryObj,
            errorId: 'ctrl_category_list_1',
            successFieldKey: 'categoryList'
        };
        this.callListing(params, (response, originalResponse) => {
            if (!response.hasError) {
                this.calculatePagination(response);
                this.categoryList = response.results;
                this.categoryList.forEach((arrayItem) => {
                    arrayItem.itemNameStr = '';
                    arrayItem.itemCnt = arrayItem.category_item_list.length;

                    let catItemCnt = 0;
                    arrayItem.category_item_list.forEach((catItem) => {
                        catItemCnt++;
                        if (catItemCnt < arrayItem.category_item_list.length) {
                            arrayItem.itemNameStr += catItem.name + ', ';
                        } else {
                            arrayItem.itemNameStr += catItem.name;
                        }
                    })
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
    showConfirm(ev, category) {
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
            this.service.apiModuleUrl = `jobs/job-category/`;

            let params = {
                parentObj: this,
                service: this.service,
                uuid: category.uuid
            };

            this.callDelete(params, (response, originalResponse) => {
                if (!response.hasError) {
                    this.getCategoryList();
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

CategoryController.$inject = ['categoryService', '$scope', '$window', 'CONST', '$rootScope', '$stateParams', 'coreFactory', '$mdDialog', '$element', '$filter', '$state'];
