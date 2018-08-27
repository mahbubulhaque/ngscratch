import BaseAngularController from './../../shared/jslizer-files/angular/base-angular-controller';

export default class MatchesController extends BaseAngularController {

    constructor(matchesService, $scope, $window, CONST, $rootScope, $stateParams, coreFactory, $mdDialog, $element, $mdToast, $state, $filter) {
        super();
        this.rootScope = $rootScope;
        this.scope = $scope;
        this.state = $state;
        this.stateParams = $stateParams;
        this.service = matchesService;
        this.userData = {};
        this.searchTerm = '';
        this.errorMessage = null;
        this.coreFactory = coreFactory;
        this.mdDialog = $mdDialog;
        this.element = $element;
        this.mdToast = $mdToast;
        this.status = "";
        this.customFullscreen = false;
        this.emitNavbarStatus();
        this.emitSideNavbarStatus(true);
        this.hideForm = true;
        this.registrationSuccess = "";
        this.loader = false;
        this.filter = $filter;
        this.cadidateInterestBool = false;
        this.searchFields = [
            "uuid",
            "user__first_name",
            "user__last_name",
            "vacancy__title",
            "vacancy__company__name",
        ];
        this.actype = {
            name: 'Link',
        };
        this.country = {
            name: 'United States',
            code: '+1',
            selected: true,
        };
        /*********************** re initialize array for language change :starts *******************/
        this.rootScope.$on('changeLanguage', (event, args) => {
            this.filteritems = [
                {
                    // 'name': 'All',
                    'name': this.filter('translate')('ALL'),
                },
                {
                    // 'name': 'Active',
                    'name': this.filter('translate')('ACTIVE_TEXT'),
                    'value': true
                }, {
                    // 'name': 'Closed',
                    'name': this.filter('translate')('CLOSED_TEXT'),
                    'value': false
                }
            ];
            this.selectedItem = {
                // 'name': 'All',
                'name': this.filter('translate')('ALL'),
            };
            
        });
        /*********************** re initialize array for language change :ends *******************/

        this.filteritems = [
            {
                // 'name': 'All',
                'name': this.filter('translate')('ALL'),
            },
            {
                // 'name': 'Active',
                'name': this.filter('translate')('ACTIVE_TEXT'),
                'value': true
            }, {
                // 'name': 'Closed',
                'name': this.filter('translate')('CLOSED_TEXT'),
                'value': false
            }
        ];
        this.selectedItem = {
            // 'name': 'All',
            'name': this.filter('translate')('ALL'),
        };

        this.getSelectedText = function () {
            if (this.selectedItem !== undefined) {
                return "Filter by : " + this.selectedItem.name;
            } else {
                return "Filter by ";
            }
        };


        this.vacancyList = ['Sales Rep', 'Marketing Ex', 'Marketing Ch Ex'];

        this.selectedVacancy = 'Sales Rep';
        this.getSelectedVacancy = function () {
            if (this.selectedVacancy !== undefined) {
                return this.selectedVacancy;
            } else {
                return this.selectedVacancy;
            }
        };

        this.companyList = ['Yahoo', 'Google', 'Microsoft', 'HU'];

        this.selectedCompany = 'Yahoo';
        this.getSelectedCompany = function () {
            if (this.selectedCompany !== undefined) {
                return this.selectedCompany;
            } else {
                return this.selectedCompany;
            }
        };


        this.candidateList = ['Mr X', 'Mr Xyz', 'Mr Y', ];

        this.selectedCandidate = 'Mr X';
        this.getSelectedCandidate = function () {
            if (this.selectedCandidate !== undefined) {
                return this.selectedCandidate;
            } else {
                return this.selectedCandidate;
            }
        };


        this.pages = ['1', '2', '3', '4', '5', '6', '7'];
        this.selectedPage = 1;
        this.getSelectedPage = function () {
            if (this.selectedPage !== undefined) {
                return this.selectedPage;
            } else {
                return this.selectedPage;
            }
        };

        this.pagerows = ['10', '25', '50', '100'];
        this.selectedPageSize = 10;
        this.getSelectedPageSize = function () {
            if (this.selectedPageSize !== undefined) {
                return this.selectedPageSize;
            } else {
                return this.selectedPageSize;
            }
        };

        this.addTodoInlist = () => {
            $mdDialog.cancel();
            this.showSuccessMessage();
        };

        //Delete confirmation
        this.showConfirm = (ev, dataToPass, index) => {
            // Appending dialog to document.body to cover sidenav in docs app
            var confirm = $mdDialog.confirm()
                .title(this.filter('translate')('DELETE_CONFIRMATION_HEADER_TEXT'))
                .textContent(this.filter('translate')('DELETE_CONFIRMATION_TEXT'))
                .ariaLabel('Lucky day')
                .targetEvent(ev)
                .ok(this.filter('translate')('YES_TEXT'))
                .cancel(this.filter('translate')('NO_TEXT'));

            $mdDialog.show(confirm).then(() => {
                this.status = 'Yes.';
                this.service.apiModuleUrl = `jobs/vacancy-interest/`;
                let params = {
                    parentObj: this,
                    service: this.service,
                    uuid: dataToPass.uuid
                };
                this.callDelete(params, (response, originalResponse) => {
                    if (!response.hasError) {
                        this.matchesList.splice(index, 1);
                        this.scope.$digest();
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
        };


        //View Match
        this.quickView = (ev, dataToPass, index) => {
            $mdDialog.show({
                locals      : {
                    dataToPass  :   dataToPass,
                    service     :   this.service,
                    thisCntrlr  :   this,
                    index       :   index,
                },
                controller: this.mdQuickDialogCtrl,
                template: require('./matches_quick_view_template.html'),
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
        };

        // quickview match controller
        this.mdQuickDialogCtrl = function($scope, service, thisCntrlr, index, dataToPass) {
            // $scope.isUpdate = true;
            $scope.mdQuickDialogData = Object.assign({}, dataToPass);
            $scope.service = service;
            $scope.thisCntrlr = thisCntrlr;
            $scope.index = index;
        }

        //Edit match
        this.editMatch = (ev, dataToPass, index) => {
            $mdDialog.show({
                locals      : {
                    dataToPass  :   dataToPass,
                    service     :   this.service,
                    thisCntrlr  :   this,
                    index       :   index,
                },
                controller: this.mdDialogCtrl,
                template: require('./add_matches_template.html'),
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
        };

        // edit match controller
        this.mdDialogCtrl = function($scope, service, thisCntrlr, index, dataToPass) {
            $scope.isUpdate = true;
            $scope.mdDialogData = Object.assign({}, dataToPass);
            $scope.service = service;
            $scope.thisCntrlr = thisCntrlr;
            $scope.index = index;

            $scope.updateMatch = (mdDialogData) => {
                $scope.service.apiModuleUrl = `jobs/vacancy-interest/`;
                let params = {
                    errorId: 'ctrl_match_update_2',
                    payload: mdDialogData,
                    service: $scope.service,
                    schema: $scope.service.matchUpdateSchema,
                    parentObj: this,
                    successFieldKey: 'matchUpdated',
                    uuid: mdDialogData.uuid
                };
                $scope.thisCntrlr.callUpdate(params, (response, originalResponse) => {
                    if (!response.hasError) {
                        $scope.thisCntrlr.cancel();
                        $scope.thisCntrlr.getMatchList();
                        // $scope.thisCntrlr.matchesList.splice($scope.index, 1);
                        // $scope.thisCntrlr.matchesList.splice($scope.index, 0, response.results);
                    } else {
                        if(!!originalResponse && originalResponse.status_code === 403) {
                            $scope.errorMessage = 'Invalid input';
                            $scope.errors = response.errors;
                            // this.coreFactory.storageHandler.setValue('isAuthenticated', false);
                            $scope.thisCntrlr.coreFactory.storageHandler.destroyAllStorage();
                            $scope.thisCntrlr.state.go('login', {}, {
                                reload: true
                            });
                            // this.location.path('/login');                    
                        }
                    }
                });
            }
        };

        this.hide = () => {
            $mdDialog.hide();
        };

        this.cancel = () => {
            $mdDialog.cancel();
        };

        this.filterChanged = () => {
            if(!this.filterQuery) {
                this.filterQuery = {};
            }
            if (this.coreFactory.objectHelper.isNotNull(this.selectedItem, 'value')) {
                var string = this.selectedItem.value;
                string = ""+string;
                string = string.charAt(0).toUpperCase() + string.slice(1);
                // this.filterQuery.is_active = this.selectedItem.value;
                this.filterQuery.is_active = string;
            }
            this.searchTermChanged('getMatchList');
        }
        this.hasShownInterest = () => {
            if(!this.filterQuery) {
                this.filterQuery = {};
            }
            if(this.cadidateInterestBool) {
                this.filterQuery.has_shown_interest = "True";
            } else {
                if(this.filterQuery.has_shown_interest){
                    delete this.filterQuery.has_shown_interest;
                }                
            }
            this.searchTermChanged('getMatchList');
        }

        this.answer = (answer) => {
            $mdDialog.hide(answer);
        };

        $element.find('input').on('keydown', (ev) => {
            ev.stopPropagation();
        });

        //Multi select search

        this.items = ['Item 01', 'Item 02', 'Item 03', 'Item 04', 'Item 05', 'Item 06', 'Item 07'];
        this.clearsearchTerms = () => {
            this.searchTerm = '';
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

        this.matchesList = [];
        this.getMatchList();
        this.summary = {
            successful: 0,
            active: 0,
            closed: 0,
        };
    }

    hideLoader() {
        this.loader = false;
    }

    showLoader() {
        this.loader = true;
    }


    getMatchList(queryObj = null) {
        this.showLoader();
        if (this.coreFactory.objectHelper.isNull(queryObj)) {
            queryObj = this.paginationQuery;
        }
        // queryObj['custom_filter__has_shown_interest'] = 'True';
        this.service.apiModuleUrl = 'jobs/vacancy-interest/';
        let params = {
            service: this.service,
            parentObj: this,
            queryObj: queryObj,
            errorId: 'ctrl_vacancy_interest_list_1',
            successFieldKey: 'matchesList'
        };
        this.callListing(params, (response, originalResponse) => {

            if (!response.hasError) {
                this.calculatePagination(response);
                this.matchesListArr = response.results;
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


    emitNavbarStatus() {
        this.scope.$emit('navbarStatus', true);
    }

    emitSideNavbarStatus(value) {
        this.scope.$emit('showSideNav', value);
    }
}

MatchesController.$inject = ['matchesService', '$scope', '$window', 'CONST', '$rootScope', '$stateParams', 'coreFactory', '$mdDialog', '$element', '$mdToast', '$state', '$filter'];
