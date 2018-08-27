import BaseAngularController from './../../shared/jslizer-files/angular/base-angular-controller';

export default class UserProfilesController extends BaseAngularController {

    constructor(userProfilesService, $scope, $window, CONST, $rootScope, $stateParams, coreFactory, $mdDialog, $element, $mdToast, $filter, $state) {
        super();
        this.rootScope = $rootScope;
        this.scope = $scope;
        this.state = $state;
        this.stateParams = $stateParams;
        this.service = userProfilesService;
        this.coreFactory = coreFactory;
        this.mdDialog = $mdDialog;
        this.element = $element;
        this.mdToast = $mdToast;
        this.loader = false;
        this.filter = $filter;
        // this.selectedLan = this.coreFactory.storageHandler.getValue('selectedLan');

        this.searchTerm = '';
        this.searchFields = [
            "uuid",
            "email",
            "phone_number",
        ];

        this.emitNavbarStatus();
        this.emitSideNavbarStatus(true);

        /*********************** re initialize array for language change :starts *******************/
        this.rootScope.$on('changeLanguage', (event, args) => {
            this.items = [
                {
                    // 'name': 'All'
                    'name': this.filter('translate')('ALL'),
                },
                {
                    // 'name': 'Dashboard User',
                    'name': this.filter('translate')('DASHBOARD_USER'),
                    'value': 'dashboard_user'
                }, {
                    // 'name': 'Company User',
                    'name': this.filter('translate')('COMPANY_USER'),
                    'value': 'company_user'
                }, {
                    // 'name': 'Employee User',
                    'name': this.filter('translate')('EMPLOYEE_USER'),
                    'value': 'employee_user'
                }
            ]; 
            this.selectedItem = {
                // 'name': 'All'
                'name': this.filter('translate')('ALL'),
            };
            
        });
        /*********************** re initialize array for language change :ends *******************/

        this.items = [
            {
                // 'name': 'All'
                'name': this.filter('translate')('ALL'),
            },
            {
                // 'name': 'Dashboard User',
                'name': this.filter('translate')('DASHBOARD_USER'),
                'value': 'dashboard_user'
            }, {
                // 'name': 'Company User',
                'name': this.filter('translate')('COMPANY_USER'),
                'value': 'company_user'
            }, {
                // 'name': 'Employee User',
                'name': this.filter('translate')('EMPLOYEE_USER'),
                'value': 'employee_user'
            }
        ];
        this.selectedItem = {
            // 'name': 'All'
            'name': this.filter('translate')('ALL'),
        };

        this.getSelectedText = function() {
            if (this.selectedItem !== undefined) {
                // return "Filter by : " + this.selectedItem.name;
                return this.filter('translate')('FILTER_BY') + this.selectedItem.name;
            } else {
                return this.filter('translate')('FILTER_BY');
                // return "Filter by ";
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

        this.answer = (answer) => {
            $mdDialog.hide(answer);
        };

        $element.find('input').on('keydown', (ev) => {
            ev.stopPropagation();
        });

        this.closeToast = function() {
            this.mdToast.hide();
        };

        this.companyList = [];
        this.userListArr = [];
        this.summary = {
            sustainable_employability_employee_count: 0,
            employee_user_count: 0,
            company_user_count: 0,
            dashboard_user_count: 0,
            outplacement_employee_count: 0,
        };
        this.isUpdate = false;
        this.getUserList();
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
        if (this.coreFactory.objectHelper.isNotNull(this.selectedItem, 'value')) {
            this.filterQuery.groups__name = this.selectedItem.value;
        }
        this.searchTermChanged('getUserList');
    }

    //Delete confirmation
    showConfirm(ev, user, index) {
        // Appending dialog to document.body to cover sidenav in docs app
        var confirm = this.mdDialog.confirm()
            .title(this.filter('translate')('DELETE_CONFIRMATION_HEADER_TEXT'))
            .textContent(this.filter('translate')('DELETE_CONFIRMATION_TEXT'))
            .ariaLabel('Lucky day')
            .targetEvent(ev)
            .ok(this.filter('translate')('YES_TEXT'))
            .cancel(this.filter('translate')('NO_TEXT'));

        this.mdDialog.show(confirm).then(() => {
            this.showLoader();
            this.status = 'Yes.';

            this.service.apiModuleUrl = `users/remove/`;

            let params = {
                parentObj: this,
                service: this.service,
                uuid: user.uuid
            };

            this.callDelete(params, (response, originalResponse) => {
                if (!response.hasError) {
                    let msg = 'User has been deleted successfully!';
                    this.showSuccessMessage(msg);
                    this.userListArr.splice(index, 1);
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

    //Add user profile
    addUser(ev) {
        this.mdDialog.show({
            locals: {
                service: this.service,
                thisCntrlr: this,
                companyList: this.companyList,
            },
            controller: this.mdDialogCtrlAddUser,
            template: require('./adduser_template.html'),
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

    mdDialogCtrlAddUser($scope, service, thisCntrlr, companyList) {

        $scope.mdDialogData = {};
        $scope.service = service;
        $scope.thisCntrlr = thisCntrlr;
        $scope.companyList = companyList;
        $scope.addUserErrorMessage = null;

        /*********************** re initialize array for language change :starts *******************/
        thisCntrlr.rootScope.$on('changeLanguage', (event, args) => {
            $scope.typesArray = [
                {
                    // name: 'Dashboard',
                    name: thisCntrlr.filter('translate')('DASHBOARD_USER'),
                    value: 'dashboard_user'
                },
                {
                    // name: 'Employee',
                    name: thisCntrlr.filter('translate')('EMPLOYEE_USER'),
                    value: 'employee_user'
                },
                {
                    // name: 'Company',
                    name: thisCntrlr.filter('translate')('COMPANY_USER'),
                    value: 'company_user'
                },
            ];

            $scope.types = [
                {
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
            
        });
        /*********************** re initialize array for language change :ends *******************/

        $scope.typesArray = [
            {
                // name: 'Dashboard',
                name: thisCntrlr.filter('translate')('DASHBOARD_USER'),
                value: 'dashboard_user'
            },
            {
                // name: 'Employee',
                name: thisCntrlr.filter('translate')('EMPLOYEE_USER'),
                value: 'employee_user'
            },
            {
                // name: 'Company',
                name: thisCntrlr.filter('translate')('COMPANY_USER'),
                value: 'company_user'
            },
        ];

        $scope.types = [
            {
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

        $scope.mdDialogData['user_group_type'] = 'dashboard_user';

        $scope.isDashBoardUser = true;
        $scope.isCompanyUser = false;
        $scope.isEmployeeUser = false;
        $scope.bindGroupType = (user_group_type) => {
            if (user_group_type === "dashboard_user") {
                $scope.isDashBoardUser = true;
                $scope.isCompanyUser = false;
                $scope.isEmployeeUser = false;
            } else if(user_group_type === 'company_user'){
                $scope.isDashBoardUser = false;
                $scope.isCompanyUser = true;
                $scope.isEmployeeUser = false;
            } else if(user_group_type === 'employee_user'){
                $scope.isDashBoardUser = false;
                $scope.isCompanyUser = false;
                $scope.isEmployeeUser = true;
            }
        }

        $scope.validateUserTypeData = (mdDialogData)=>{
            let validated = true;

            if($scope.isEmployeeUser){
                if(!mdDialogData.company_uuid){
                    validated = false;
                    $scope.addUserErrorMessage = $scope.thisCntrlr.filter('translate')('INVALID_INPUT');
                    $scope.company_uuid_error = $scope.thisCntrlr.filter('translate')('REQUIRED_FIELD_VALIDATION_TEXT');
                }
                // if(typeof mdDialogData.login_code_type !== "undefined") { // this can be used too
                if(mdDialogData.login_code_type === undefined){
                    validated = false;
                    $scope.addUserErrorMessage = $scope.thisCntrlr.filter('translate')('INVALID_INPUT');
                    $scope.login_code_type_error = $scope.thisCntrlr.filter('translate')('REQUIRED_FIELD_VALIDATION_TEXT');
                }
            }
            if($scope.isCompanyUser){
                if(!mdDialogData.company_uuid){
                    validated = false;
                    $scope.addUserErrorMessage = $scope.thisCntrlr.filter('translate')('INVALID_INPUT');
                    $scope.company_uuid_error = $scope.thisCntrlr.filter('translate')('REQUIRED_FIELD_VALIDATION_TEXT');
                }
            }
            return validated;
        }

        $scope.addNewUser = (mdDialogData) => {
            let validated = $scope.validateUserTypeData(mdDialogData);
            if(!validated){
                return;
            }
            $scope.service.apiModuleUrl = `users/`;
            let params = {
                errorId: 'ctrl_user_profile_add_1',
                payload: mdDialogData,
                service: $scope.service,
                schema: $scope.service.userCreateSchema,
                parentObj: $scope,
                errorMessageFieldKey: 'addUserErrorMessage',
                successFieldKey: 'userAdd'
            };

            $scope.thisCntrlr.callSave(params, (response, originalResponse) => {
                if (!response.hasError) {
                    let msg = 'User has been added successfully!';
                    $scope.thisCntrlr.showSuccessMessage(msg);
                    $scope.thisCntrlr.cancel();
                    $scope.thisCntrlr.getUserList();
                } else {
                    if(!!originalResponse && originalResponse.status_code === 403) {
                        // this.coreFactory.storageHandler.setValue('isAuthenticated', false);
                        $scope.thisCntrlr.coreFactory.storageHandler.destroyAllStorage();
                        $scope.thisCntrlr.state.go('login', {}, {
                            reload: true
                        });
                        // this.location.path('/login');                    
                    }
                    $scope.$digest();
                }
                //$scope.$digest();
            });

        }

    }

    // User profile update
    updateUser(ev, dataToPass, index) {
        this.mdDialog.show({
            locals: {
                dataToPass: dataToPass,
                service: this.service,
                thisCntrlr: this,
                index: index,
                companyList: this.companyList
            },
            controller: this.mdDialogCtrl,
            template: require('./adduser_template.html'),
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

    mdDialogCtrl($scope, service, thisCntrlr, index, dataToPass, companyList) {

        $scope.isUpdate = true;
        $scope.mdDialogData = Object.assign({}, dataToPass);
        $scope.service = service;
        $scope.thisCntrlr = thisCntrlr;
        $scope.companyList = companyList;
        $scope.index = index;
        $scope.addUserErrorMessage = null;
        if ($scope.mdDialogData.company_list.length > 0) {
            $scope.mdDialogData.company_uuid = $scope.mdDialogData.company_list[0].uuid;
        }

        if ($scope.mdDialogData.user_login_code.length > 0) {
            $scope.mdDialogData.login_code_type = $scope.mdDialogData.user_login_code[0].login_code_type;
        }
        
        /*********************** re initialize array for language change :starts *******************/
        thisCntrlr.rootScope.$on('changeLanguage', (event, args) => {
            $scope.typesArray = [
                {
                    // name: 'Dashboard',
                    name: thisCntrlr.filter('translate')('DASHBOARD_USER'),
                    value: 'dashboard_user'
                },
                {
                    // name: 'Employee',
                    name: thisCntrlr.filter('translate')('EMPLOYEE_USER'),
                    value: 'employee_user'
                },
                {
                    // name: 'Company',
                    name: thisCntrlr.filter('translate')('COMPANY_USER'),
                    value: 'company_user'
                },
            ];

            $scope.types = [
                {
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
            
        });
        /*********************** re initialize array for language change :ends *******************/
        $scope.typesArray = [
            {
                // name: 'Dashboard',
                name: thisCntrlr.filter('translate')('DASHBOARD_USER'),
                value: 'dashboard_user'
            },
            {
                // name: 'Employee',
                name: thisCntrlr.filter('translate')('EMPLOYEE_USER'),
                value: 'employee_user'
            },
            {
                // name: 'Company',
                name: thisCntrlr.filter('translate')('COMPANY_USER'),
                value: 'company_user'
            },
        ];

        $scope.types = [
            {
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

        $scope.isDashBoardUser = false;
        $scope.isCompanyUser = false;
        $scope.isEmployeeUser = false;
        $scope.bindGroupType = (user_group_type) => {
            if (user_group_type === "dashboard_user") {
                $scope.isDashBoardUser = true;
                $scope.isCompanyUser = false;
                $scope.isEmployeeUser = false;
            } else if(user_group_type === 'company_user'){
                $scope.isDashBoardUser = false;
                $scope.isCompanyUser = true;
                $scope.isEmployeeUser = false;
            } else if(user_group_type === 'employee_user'){
                $scope.isDashBoardUser = false;
                $scope.isCompanyUser = false;
                $scope.isEmployeeUser = true;
            }
        }
        $scope.bindGroupType($scope.mdDialogData.user_group_type);

        $scope.getCompanyNameByUuid = (companyUuid) => {
            for(let i = 0; i< $scope.companyList.length; i++){
                if($scope.companyList[i].uuid == companyUuid) {
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

        $scope.updateUser = (mdDialogData) => {
            $scope.service.apiModuleUrl = `users/profile/`;

            let params = {
                errorId: 'ctrl_user_profile_update_2',
                payload: mdDialogData,
                service: $scope.service,
                schema: $scope.service.userUpdateSchema,
                parentObj: $scope,
                errorMessageFieldKey: 'addUserErrorMessage',
                successFieldKey: 'userUpdated',
                uuid: mdDialogData.uuid
            };

            $scope.thisCntrlr.callUpdate(params, (response, originalResponse) => {
                if (!response.hasError) {
                    let msg = 'User has been updated successfully!';
                    $scope.thisCntrlr.showSuccessMessage(msg);
                    $scope.thisCntrlr.cancel();
                    $scope.thisCntrlr.getUserList();
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

    getUserList(queryObj = null) {
        this.showLoader();
        if (this.coreFactory.objectHelper.isNull(queryObj)) {
            queryObj = this.paginationQuery;
        }
        this.service.apiModuleUrl = 'users/listing/';
        let params = {
            service: this.service,
            parentObj: this,
            queryObj: queryObj,
            errorId: 'ctrl_user_profile_list_1',
            successFieldKey: 'userList'
        };
        this.callListing(params, (response, originalResponse) => {

            if (!response.hasError) {
                this.calculatePagination(response);
                this.userListArr = response.results;
                this.summary = originalResponse.summary;
                this.hideLoader();
                this.scope.$digest();
            } else {
                if(!!originalResponse && originalResponse.status_code === 403) {
                    this.mdDialog.cancel();
                    this.mdDialog.cancel();
                    // this.coreFactory.storageHandler.setValue('isAuthenticated', false);
                    this.coreFactory.storageHandler.destroyAllStorage();
                    this.state.go('login', {}, {
                        reload: true
                    });
                    // this.location.path('/login');                    
                }
            }

            if (!response.hasError) {
                this.userListArr = response.results;
                this.userListArr.forEach((arrayItem) => {
                    if (arrayItem.user_login_code.length > 0) {
                        arrayItem.loginType = arrayItem.user_login_code[0].login_code;
                        arrayItem.startDate = arrayItem.user_login_code[0].date_created;
                        arrayItem.expireDate = arrayItem.user_login_code[0].expire_date;
                    } else {
                        arrayItem.loginType = '';
                        arrayItem.startDate = '';
                        arrayItem.expireDate = '';
                    }
                });
                this.scope.$digest();
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
                this.companyList = response.results;
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

    goToUserProfileDetails(userObj) {
        this.service.goToUserProfileDetailsComp(userObj);
    }

    emitNavbarStatus() {
        this.scope.$emit('navbarStatus', true);
    }

    emitSideNavbarStatus(value) {
        this.scope.$emit('showSideNav', value);
    }
}

UserProfilesController.$inject = ['userProfilesService', '$scope', '$window', 'CONST', '$rootScope', '$stateParams', 'coreFactory', '$mdDialog', '$element', '$mdToast', '$filter', '$state'];
