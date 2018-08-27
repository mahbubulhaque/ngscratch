import BaseAngularController from './../../shared/jslizer-files/angular/base-angular-controller';

export default class CategoryItemsController extends BaseAngularController {

    constructor(categoryItemsService, $scope, $window, CONST, $rootScope, $stateParams, coreFactory, $mdDialog, $element, $mdToast, $filter, $state) {
        super();
        this.rootScope = $rootScope;
        this.scope = $scope;
        this.stateParams = $stateParams;
        this.state = $state;
        this.service = categoryItemsService;
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
        this.searchFields = [
            "uuid",
            "name",
        ];


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
        this.categoryItemList = [];
        this.getCategoryItemList();
        this.getCategoryList();
    }    

    hideLoader() {
        this.loader = false;
    }

    showLoader() {
        this.loader = true;
    }

    // Category Item add
    addCategoryItem(ev) {
        this.mdDialog.show({
                locals: {
                    service: this.service,
                    categoryList: this.categoryList,
                    thisCntrlr: this
                },
                controller: this.addCategoryItemMdDialogCtrl,
                template: require('./edit_ctg_item_template.html'),
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

    // Category Item Add controller
    addCategoryItemMdDialogCtrl($scope, service, thisCntrlr, categoryList) {

        $scope.mdDialogData = {};
        $scope.service = service;
        $scope.thisCntrlr = thisCntrlr;
        $scope.categoryList = categoryList;
        $scope.addCategoryItemErrorMessage = null;

        $scope.addCtgItem = (mdDialogData) => {
            $scope.service.apiModuleUrl = `jobs/category-item/`;

            let params = {
                errorId: 'ctrl_category_item_add_1',
                payload: mdDialogData,
                service: $scope.service,
                schema: $scope.service.categoryItemSchema,
                parentObj: $scope,
                errorMessageFieldKey: 'addCategoryItemErrorMessage',
                successFieldKey: 'categoryItemAdded',
                // uuid: mdDialogData.uuid
            };

            $scope.thisCntrlr.callSave(params, (response, originalResponse) => {
                if (!response.hasError) {
                    let msg = 'Category Item has been added successfully!';
                    $scope.thisCntrlr.showSuccessMessage(msg);
                    $scope.thisCntrlr.cancel();
                    $scope.thisCntrlr.getCategoryItemList();
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
                // else {
                //     $scope.errorMessage = 'Invalid input';
                //     $scope.errors = response.errors;
                //     $scope.thisCntrlr.showErrorMessage($scope.errorMessage);
                // }
            });
        }
    }

    filterChanged() {
        this.filterQuery = {};
        if (this.coreFactory.objectHelper.isNotNull(this.selectedJobCategory, 'uuid')) {
            this.filterQuery.job_category__name = this.selectedJobCategory.name;
        }
        this.searchTermChanged('getCategoryItemList');
    }

    // this method is might be obsolute, there is a 'getCategoryList' method in action
    getJobCategoryList() {
        this.service.apiModuleUrl = 'jobs/job-category/';
        let params = {
            service: this.service,
            parentObj: this,
            queryObj: {},
            errorId: 'ctrl_category_item_list_2',
            successFieldKey: 'jobCategoryList'
        };
        this.callListing(params, (response, originalResponse) => {
            if (!response.hasError) {
                this.jobCategoryList = [{
                    'name': 'All'
                }].concat(response.results);
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

    // Category Item update
    updateCategoryItem(ev, dataToPass, index) {
        this.mdDialog.show({
                locals: {
                    dataToPass: dataToPass,
                    service: this.service,
                    thisCntrlr: this,
                    index: index,
                    categoryList: this.categoryList,
                },
                controller: this.updateCategoryItemMdDialogCtrl,
                template: require('./edit_ctg_item_template.html'),
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

    // Category Item update controller
    updateCategoryItemMdDialogCtrl($scope, service, thisCntrlr, dataToPass, index, categoryList) {

        $scope.isUpdate = true;
        $scope.mdDialogData = Object.assign({}, dataToPass);
        $scope.service = service;
        $scope.thisCntrlr = thisCntrlr;
        $scope.index = index;
        $scope.categoryList = categoryList;
        $scope.addCategoryItemErrorMessage = null;

        $scope.updateCtgItem = (mdDialogData) => {
            $scope.service.apiModuleUrl = `jobs/category-item/`;

            let params = {
                errorId: 'ctrl_category_item_update_2',
                payload: mdDialogData,
                service: $scope.service,
                schema: $scope.service.categoryItemSchema,
                parentObj: $scope,
                errorMessageFieldKey: 'addCategoryItemErrorMessage',
                successFieldKey: 'categoryItemUpdated',
                uuid: mdDialogData.uuid
            };

            $scope.thisCntrlr.callUpdate(params, (response, originalResponse) => {
                if (!response.hasError) {
                    $scope.thisCntrlr.cancel();
                    $scope.thisCntrlr.getCategoryItemList();
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
                // else {
                //     $scope.errorMessage = 'Invalid input';
                //     $scope.errors = response.errors;
                // }
            });
        }
    }


    getCategoryItemList(queryObj = null) {
        this.showLoader();
        if (this.coreFactory.objectHelper.isNull(queryObj)) {
            queryObj = this.paginationQuery;
        }
        this.service.apiModuleUrl = 'jobs/category-item/';
        let params = {
            service: this.service,
            parentObj: this,
            queryObj: queryObj,
            errorId: 'ctrl_category_item_list_1',
            successFieldKey: 'categoryItemList'
        };
        this.callListing(params, (response, originalResponse) => {
            if (!response.hasError) {
                this.calculatePagination(response);
                this.categoryItemList = response.results;
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
    showConfirm(ev, categoryItem) {
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
            this.service.apiModuleUrl = `jobs/category-item/`;

            let params = {
                parentObj: this,
                service: this.service,
                uuid: categoryItem.uuid
            };

            this.callDelete(params, (response, originalResponse) => {
                if (!response.hasError) {
                    this.getCategoryItemList();
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

    getCategoryList() {
        this.service.apiModuleUrl = 'jobs/job-category/';
        let params = {
            service: this.service,
            parentObj: this,
            errorId: 'ctrl_category_list_1',
            successFieldKey: 'categoryList'
        };
        this.callListing(params, (response, originalResponse) => {
            if (!response.hasError) {
                this.categoryList = response.results;
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
    getCategoryNameByUuid(uuid) {
        if (!!this.categoryList && this.categoryList.length > 0) {
            for (var i = 0; i <= this.categoryList.length; i++) {
                if (!!this.categoryList[i] && this.categoryList[i].uuid == uuid) {
                    return this.categoryList[i].name;
                }
            }
            return '';
        }
    }
}

CategoryItemsController.$inject = ['categoryItemsService', '$scope', '$window', 'CONST', '$rootScope', '$stateParams', 'coreFactory', '$mdDialog', '$element', '$mdToast', '$filter', '$state'];
