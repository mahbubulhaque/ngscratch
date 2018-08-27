import BaseAngularController from './../../shared/jslizer-files/angular/base-angular-controller';

export default class EmployeeController extends BaseAngularController {

    constructor(employeeService, $scope, $window, CONST, $rootScope, $stateParams, coreFactory, $mdDialog, $element, $mdToast, $filter, $state) {
        super();
        this.rootScope = $rootScope;
        this.scope = $scope;
        this.stateParams = $stateParams;
        this.state= $state;
        this.service = employeeService;
        this.coreFactory = coreFactory;
        this.mdDialog = $mdDialog;
        this.element = $element;
        this.mdToast = $mdToast;
        this.loader = false;
        this.filter = $filter;

        this.searchTerm = '';
        this.searchFields = [
            'uuid',
            'email',
            'first_name',
            'last_name'
        ];
        /*********************** re initialize array for language change :starts *******************/
        this.rootScope.$on('changeLanguage', (event, args) => {
            this.selectedTypeItem = {
                // 'name': 'All',
                'name': this.filter('translate')('ALL'),
            };

            this.typeList = [{
                // 'name': 'All',
                'name': this.filter('translate')('ALL'),
            },
                {
                    // 'name': 'Outplacement',
                    'name': this.filter('translate')('OUTPLACEMENT'),
                    'value': 0
                }, {
                    // 'name': 'Sustainable',
                    'name': this.filter('translate')('SUSTAINABLE'),
                    'value': 1
                }
            ];
            this.statusList = [{
                'name': this.filter('translate')('RED'),
                'value': 0
            },
                {
                    'name': this.filter('translate')('GREEN'),
                    'value': 1
                }, {
                    'name': this.filter('translate')('ORANGE'),
                    'value': 2
                }
            ];

        });
        /*********************** re initialize array for language change :ends *******************/
        this.selectedTypeItem = {
            // 'name': 'All',
            'name': this.filter('translate')('ALL'),
        };

        this.typeList = [{
            // 'name': 'All',
            'name': this.filter('translate')('ALL'),
        },
            {
                // 'name': 'Outplacement',
                'name': this.filter('translate')('OUTPLACEMENT'),
                'value': 0
            }, {
                // 'name': 'Sustainable',
                'name': this.filter('translate')('SUSTAINABLE'),
                'value': 1
            }
        ];

        this.statusList = [{
                'name': this.filter('translate')('RED'),
                'value': 0
            },
            {
                'name': this.filter('translate')('GREEN'),
                'value': 1
            }, {
                'name': this.filter('translate')('ORANGE'),
                'value': 2
            }
        ];

        this.getSelectedText = function() {
            if (this.selectedTypeItem !== undefined) {
                return "Filter by : " + this.selectedTypeItem.name;
            } else {
                return "Filter by ";
            }
        };

        this.getSelectedTypeText = function() {
            if (this.selectedTypeItem !== undefined) {
                return "Filter by : " + this.selectedTypeItem.name;
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

        this.addUserItem = () => {
            $mdDialog.cancel();
            this.showSuccessMessage();
        };

        this.hide = () => {
            $mdDialog.hide();
        };

        this.answer = (answer) => {
            $mdDialog.hide(answer);
        };

        $element.find('input').on('keydown', (ev) => {
            ev.stopPropagation();
        });

        this.closeToast = function() {
            this.mdToast.hide();
        };

        this.employeeObj = {};
        this.personInfoObj = {
            affinity_with: '',
            qualities_strengths: '',
            competences: '',
            personal_preferences_caracter: '',
            work_and_intelligence_level: '',
            hours_and_scedule_per_week: ''
        }
        this.companyList = [];
        this.employeeListArr = [];
        this.categoryList = [];
        this.categoryItemList = [];
        this.summary = {
            sustainable_employability_employee_count: 0,
            employee_user_count: 0,
            company_user_count: 0,
            dashboard_user_count: 0,
            outplacement_employee_count: 0,
        };

        this.emitNavbarStatus();
        this.emitSideNavbarStatus(true);

        this.getEmployeeList();
        this.getCompanyList();
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

    cancel() {
        this.mdDialog.cancel();
    }

    filterChanged() {
        this.filterQuery = {};
        if (this.coreFactory.objectHelper.isNotNull(this.selectedItem, 'uuid')) {
            this.filterQuery.membership_user__company__uuid = this.selectedItem.uuid;
        }
        if (this.coreFactory.objectHelper.isNotNull(this.selectedTypeItem, 'value')) {
            this.filterQuery.user_login_code_user__login_code_type = this.selectedTypeItem.value;
        }
        this.searchTermChanged('getEmployeeList');
    }

    //Delete confirmation
    showConfirm(ev, employee, index) {
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

            this.service.apiModuleUrl = `users/remove/`;

            let params = {
                parentObj: this,
                service: this.service,
                uuid: employee.uuid
            };

            this.callDelete(params, (response, originalResponse) => {
                if (!response.hasError) {
                    let msg = 'Employee has been deleted successfully!';
                    this.showSuccessMessage(msg);
                    this.employeeListArr.splice(index, 1);
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

    //Add user profile
    addEmployee(ev) {
        this.mdDialog.show({
            locals: {
                service: this.service,
                thisCntrlr: this,
                companyList: this.companyList
            },
            controller: this.addEmpMdDialogCtrl,
            template: require('./addemployee_template.html'),
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

    addEmpMdDialogCtrl($scope, service, thisCntrlr, companyList) {

        $scope.mdDialogData = {};
        $scope.service = service;
        $scope.thisCntrlr = thisCntrlr;
        $scope.companyList = companyList;
        $scope.addEmployeeErrorMessage = null;

        /*********************** re initialize array for language change :starts *******************/
        thisCntrlr.rootScope.$on('changeLanguage', (event, args) => {
            $scope.types = [{
                // name: 'Outplacement',
                name: thisCntrlr.filter('translate')('OUTPLACEMENT'),
                value: 0
            },
                {
                    // name: 'Sustainable',
                    name: thisCntrlr.filter('translate')('SUSTAINABLE'),
                    value: 1
                }
            ];
            $scope.statusList = [{
                'name': thisCntrlr.filter('translate')('RED'),
                'value': 0
            },
                {
                    'name': thisCntrlr.filter('translate')('GREEN'),
                    'value': 1
                }, {
                    'name': thisCntrlr.filter('translate')('ORANGE'),
                    'value': 2
                }
            ];

        });
        /*********************** re initialize array for language change :ends *******************/
        $scope.types = [{
            // name: 'Outplacement',
            name: thisCntrlr.filter('translate')('OUTPLACEMENT'),
            value: 0
        },
            {
                // name: 'Sustainable',
                name: thisCntrlr.filter('translate')('SUSTAINABLE'),
                value: 1
            }
        ];

        $scope.statusList = [{
            'name': thisCntrlr.filter('translate')('RED'),
            'value': 0
        },
            {
                'name': thisCntrlr.filter('translate')('GREEN'),
                'value': 1
            }, {
                'name': thisCntrlr.filter('translate')('ORANGE'),
                'value': 2
            }
        ];

        $scope.mdDialogData['user_group_type'] = 'employee_user';

        $scope.addNewEmployee = (mdDialogData) => {

            $scope.service.apiModuleUrl = `users/`;
            let params = {
                errorId: 'ctrl_employee_profile_add_3',
                payload: mdDialogData,
                service: $scope.service,
                schema: $scope.service.employeeAddSchema,
                parentObj: $scope,
                errorMessageFieldKey: 'addEmployeeErrorMessage',
                successFieldKey: 'userEmployee'
            };

            $scope.thisCntrlr.callSave(params, (response, originalResponse) => {
                if (!response.hasError) {
                    $scope.thisCntrlr.cancel();
                    $scope.thisCntrlr.getEmployeeList();
                    let msg = 'Employee has been added successfully!';
                    $scope.thisCntrlr.showSuccessMessage(msg);
                } else {
                    if(!!originalResponse && originalResponse.status_code === 403) {
                        // this.coreFactory.storageHandler.setValue('isAuthenticated', false);
                        $scope.thisCntrlr.coreFactory.storageHandler.destroyAllStorage();
                        $scope.thisCntrlr.state.go('login', {}, {
                            reload: true
                        });
                        // this.location.path('/login');
                    }
                    if(response.errors === ''){
                        $scope.$digest();
                    }
                }
            });

        }

    }
    getStatusNameByUuid(statusid) {
        for(let i = 0; i< this.statusList.length; i++){
            if(this.statusList[i].value == statusid) {
                return this.statusList[i].name;
            }
        }
        return '';
    };

    // User profile update
    updateEmployee(ev, dataToPass, index) {
        this.mdDialog.show({
            locals: {
                dataToPass: dataToPass,
                service: this.service,
                thisCntrlr: this,
                index: index,
                companyList: this.companyList
            },
            controller: this.updateEmpMdDialogCtrl,
            template: require('./addemployee_template.html'),
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

    updateEmpMdDialogCtrl($scope, service, thisCntrlr, index, dataToPass, companyList) {

        $scope.isUpdate = true;
        $scope.mdDialogData = Object.assign({}, dataToPass);
        $scope.service = service;
        $scope.thisCntrlr = thisCntrlr;
        $scope.companyList = companyList;
        $scope.index = index;
        $scope.addEmployeeErrorMessage = null;

        if ($scope.mdDialogData.company_list.length > 0) {
            $scope.mdDialogData.company_uuid = $scope.mdDialogData.company_list[0].uuid;
        }

        $scope.mdDialogData.house_number = parseInt($scope.mdDialogData.house_number, 10);
        if ($scope.mdDialogData.user_login_code.length > 0) {
            $scope.mdDialogData.login_code_type = $scope.mdDialogData.user_login_code[0].login_code_type;
        }

        /*********************** re initialize array for language change :starts *******************/
        thisCntrlr.rootScope.$on('changeLanguage', (event, args) => {
            $scope.types = [{
                // name: 'Outplacement',
                name: thisCntrlr.filter('translate')('OUTPLACEMENT'),
                value: 0
            },
                {
                    // name: 'Sustainable',
                    name: thisCntrlr.filter('translate')('SUSTAINABLE'),
                    value: 1
                }
            ];
            $scope.statusList = [{
                'name': thisCntrlr.filter('translate')('RED'),
                'value': 0
            },
                {
                    'name': thisCntrlr.filter('translate')('GREEN'),
                    'value': 1
                }, {
                    'name': thisCntrlr.filter('translate')('ORANGE'),
                    'value': 2
                }
            ];

        });
        /*********************** re initialize array for language change :ends *******************/
        $scope.types = [{
            // name: 'Outplacement',
            name: thisCntrlr.filter('translate')('OUTPLACEMENT'),
            value: 0
        },
            {
                // name: 'Sustainable',
                name: thisCntrlr.filter('translate')('SUSTAINABLE'),
                value: 1
            }
        ];
        $scope.statusList = [{
            'name': thisCntrlr.filter('translate')('RED'),
            'value': 0
        },
            {
                'name': thisCntrlr.filter('translate')('GREEN'),
                'value': 1
            }, {
                'name': thisCntrlr.filter('translate')('ORANGE'),
                'value': 2
            }
        ];
        $scope.getStatusNameByUuid = (statusid) => {
            for(let i = 0; i< $scope.statusList.length; i++){
                if($scope.statusList[i].value == statusid) {
                    return $scope.statusList[i].name;
                }
            }
            return '';
        };

        $scope.getCompanyNameByUuid = (companyUuid) => {
            for(let i = 0; i< $scope.companyList.length; i++){
                if(!!$scope.companyList[i] && $scope.companyList[i].uuid == companyUuid) {
                    return $scope.companyList[i].name;
                }
            }
            return '';
        };
        $scope.getLoginCodeTypeNameByValue = (value) => {
            for(let i = 0; i< $scope.types.length; i++){
                if($scope.types[i].value == value) {
                    return $scope.types[i].name;
                }
            }
            return '';
        };

        $scope.updateEmp = (mdDialogData) => {
            $scope.service.apiModuleUrl = `users/profile/`;

            let params = {
                errorId: 'ctrl_employee_profile_update_2',
                payload: mdDialogData,
                service: $scope.service,
                schema: $scope.service.employeeUpdateSchema,
                parentObj: $scope,
                errorMessageFieldKey: 'addEmployeeErrorMessage',
                successFieldKey: 'userUpdated',
                uuid: mdDialogData.uuid
            };

            $scope.thisCntrlr.callUpdate(params, (response, originalResponse) => {
                if (!response.hasError) {
                    $scope.thisCntrlr.cancel();
                    let msg = 'Employee has been updated successfully!';
                    $scope.thisCntrlr.showSuccessMessage(msg);
                    $scope.thisCntrlr.getEmployeeList();
                } else {
                    if(!!originalResponse && originalResponse.status_code === 403) {
                        // this.coreFactory.storageHandler.setValue('isAuthenticated', false);
                        $scope.thisCntrlr.coreFactory.storageHandler.destroyAllStorage();
                        $scope.thisCntrlr.state.go('login', {}, {
                            reload: true
                        });
                        // this.location.path('/login');
                    }
                    if(response.errors === ''){
                        $scope.$digest();
                    }
                }
            });
        }
    }

    getEmployeeList(queryObj = null) {
        this.showLoader();
        if (this.coreFactory.objectHelper.isNull(queryObj)) {
            queryObj = this.paginationQuery;
        }
        this.service.apiModuleUrl = 'users/listing/';
        queryObj.groups__name = 'employee_user';
        let params = {
            service: this.service,
            parentObj: this,
            queryObj: queryObj,
            errorId: 'ctrl_employee_profile_list_1',
            successFieldKey: 'employeeListArr'
        };
        this.callListing(params, (response, originalResponse) => {
            if (!response.hasError) {
                this.calculatePagination(response);
                this.employeeListArr = response.results;
                this.summary = originalResponse.summary;
                this.getCategoryAndItem();
                // followig 2 lines are in getCategoryAndItem promise success
                // this.hideLoader();
                // this.scope.$digest();
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

    getCategoryAndItem() {
        return new Promise((resolve, reject) => {

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
                    resolve(this.categoryList);
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

        }).then((result) => {
            return new Promise((resolve, reject) => {
                this.service.apiModuleUrl = 'jobs/category-item/';
                let params = {
                    service: this.service,
                    parentObj: this,
                    errorId: 'ctrl_category_item_list_1',
                    successFieldKey: 'categoryItemList'
                };
                this.callListing(params, (response) => {
                    if (!response.hasError) {
                        this.categoryItemList = response.results;
                        resolve(this.categoryItemList);
                    }
                });
            });

        }).then((result) => {
            this.getIntelligenceAndDiscipline();
            // following 2 line added because digest were called before getting these data
            // thats why data like login_type or intelligence or discipline were not showing
            // now they'll be shown and loader will hide after getting this data from promise
            this.hideLoader();
            this.scope.$digest();
        });
    }

    getIntelligenceAndDiscipline() {
        this.employeeListArr.forEach((value, index) => {
            if (value.user_login_code.length > 0) {
                if (value.user_login_code[0].login_code_type === 1) {
                    value.loginType = 'Sustainable';
                } else {
                    value.loginType = 'Outplacement';
                }
            }
            if (value.user_category_item_list.length > 0) {
                value.user_category_item_list.forEach((value1, index1) => {
                    let categoryObj = this.categoryList.find(value2 => value2.uuid === value1.job_category_uuid);
                    let categoryItemObj = this.categoryItemList.find(value3 => value3.uuid === value1.uuid);

                    if (categoryObj) {
                        let nameStr = categoryObj.name.trim().replace(/ /g, "_").toLowerCase();

                        switch (nameStr) {
                            case 'affinity_with':
                                if (this.personInfoObj.affinity_with === '') {
                                    this.personInfoObj.affinity_with += categoryItemObj.name;
                                } else {
                                    this.personInfoObj.affinity_with += `, ${categoryItemObj.name}`;
                                }
                                break;
                            case 'qualities_strengths':
                                if (this.personInfoObj.qualities_strengths === '') {
                                    this.personInfoObj.qualities_strengths += categoryItemObj.name;
                                } else {
                                    this.personInfoObj.qualities_strengths += `, ${categoryItemObj.name}`;
                                }
                                break;
                            case 'qualities/strengths':
                                if (this.personInfoObj.qualities_strengths === '') {
                                    this.personInfoObj.qualities_strengths += categoryItemObj.name;
                                } else {
                                    this.personInfoObj.qualities_strengths += `, ${categoryItemObj.name}`;
                                }
                                break;
                            case 'competences':
                                if (this.personInfoObj.competences === '') {
                                    this.personInfoObj.competences += categoryItemObj.name;
                                } else {
                                    this.personInfoObj.competences += `, ${categoryItemObj.name}`;
                                }
                                value.discipline = this.personInfoObj.competences;
                                break;
                            case 'personal_preferences_caracter':
                                if (this.personInfoObj.personal_preferences_caracter === '') {
                                    this.personInfoObj.personal_preferences_caracter += categoryItemObj.name;
                                } else {
                                    this.personInfoObj.personal_preferences_caracter += `, ${categoryItemObj.name}`;
                                }
                                break;
                            case 'work_and_intelligence_level':
                                if (this.personInfoObj.work_and_intelligence_level === '') {
                                    this.personInfoObj.work_and_intelligence_level += categoryItemObj.name;
                                } else {
                                    this.personInfoObj.work_and_intelligence_level += `, ${categoryItemObj.name}`;
                                }
                                value.intelligence = this.personInfoObj.work_and_intelligence_level;
                                break;
                            case 'hours_and_scedule_per_week':
                                if (this.personInfoObj.hours_and_scedule_per_week === '') {
                                    this.personInfoObj.hours_and_scedule_per_week += categoryItemObj.name;
                                } else {
                                    this.personInfoObj.hours_and_scedule_per_week += `, ${categoryItemObj.name}`;
                                }
                                break;
                            case 'travel_time':
                                if (this.personInfoObj.hours_and_scedule_per_week === '') {
                                    this.personInfoObj.hours_and_scedule_per_week += categoryItemObj.name;
                                } else {
                                    this.personInfoObj.hours_and_scedule_per_week += `, ${categoryItemObj.name}`;
                                }
                                break;
                            case 'travel_radius':
                                if (this.personInfoObj.hours_and_scedule_per_week === '') {
                                    this.personInfoObj.hours_and_scedule_per_week += categoryItemObj.name;
                                } else {
                                    this.personInfoObj.hours_and_scedule_per_week += `, ${categoryItemObj.name}`;
                                }
                                break;
                            case 'decision_making':
                                if (this.personInfoObj.personal_preferences_caracter === '') {
                                    this.personInfoObj.personal_preferences_caracter += categoryItemObj.name;
                                } else {
                                    this.personInfoObj.personal_preferences_caracter += `, ${categoryItemObj.name}`;
                                }
                                break;
                            case 'character_type':
                                if (this.personInfoObj.personal_preferences_caracter === '') {
                                    this.personInfoObj.personal_preferences_caracter += categoryItemObj.name;
                                } else {
                                    this.personInfoObj.personal_preferences_caracter += `, ${categoryItemObj.name}`;
                                }
                                break;
                            case 'orientation':
                                if (this.personInfoObj.personal_preferences_caracter === '') {
                                    this.personInfoObj.personal_preferences_caracter += categoryItemObj.name;
                                } else {
                                    this.personInfoObj.personal_preferences_caracter += `, ${categoryItemObj.name}`;
                                }
                                break;
                            default:
                                break;
                        }
                    }
                })
            }
        });
    }

    getCompanyList(queryObj = null) {
        if (this.coreFactory.objectHelper.isNull(queryObj)) {
            queryObj = {};
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
                this.companyList = [this.selectedItem];
                this.companyList = this.companyList.concat(response.results);
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

    goToEmployeeDetails(employeeObj) {
        this.service.goToEmployeeDetailsComp(employeeObj);
    }

    emitNavbarStatus() {
        this.scope.$emit('navbarStatus', true);
    }

    emitSideNavbarStatus(value) {
        this.scope.$emit('showSideNav', value);
    }
}

EmployeeController.$inject = ['employeeService', '$scope', '$window', 'CONST', '$rootScope', '$stateParams', 'coreFactory', '$mdDialog', '$element', '$mdToast', '$filter', '$state'];
