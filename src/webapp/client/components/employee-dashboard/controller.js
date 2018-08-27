import BaseAngularController from './../../shared/jslizer-files/angular/base-angular-controller';

export default class EmployeeDashboardController extends BaseAngularController {

    constructor(employeeDashboardService, $scope, $window, CONST, $rootScope, $stateParams, coreFactory, $state) {
        super();
        this.rootScope = $rootScope;
        this.scope = $scope;
        this.stateParams = $stateParams;
        this.state = $state;
        this.service = employeeDashboardService;
        this.userData = {};
        this.errorMessage = null;
        this.coreFactory = coreFactory;
        this.emitNavbarStatus();
        this.emitSideNavbarStatus(true);
        this.hideForm = true;
        this.registrationSuccess = "";
        this.loader = false;
        this.userGroupType = this.coreFactory.storageHandler.getValue('user_group_type');
        this.actype = {
            name: 'Link',
        };
        this.country = {
            name: 'United States',
            code: '+1',
            selected: true,
        };

        // employee dashboard summary starts here
        this.dashboardOverview = {};
        this.getDashboardOverview();
        // employee dashboard summary ends here

    } 

    // employee dashboard summary starts here
    getDashboardOverview() {
        this.showLoader();
        // if (this.coreFactory.objectHelper.isNull(queryObj)) {
        //     // queryObj = this.paginationQuery;
        //     queryObj = {};
        // }
        this.service.apiModuleUrl = 'commons/overview/';
        // queryObj.groups__name = 'employee_user';
        let params = {
            service: this.service,
            parentObj: this,
            // queryObj: queryObj,
            errorId: 'ctrl_dashboard_overview',
            successFieldKey: 'dashboardOverview'
        };
        this.callFetch(params, (response, originalResponse) => {
            if (!response.hasError) {
                                
                this.hideLoader();
                this.scope.$digest();
            } else {
                if(!!originalResponse && originalResponse.status_code === 403) {
                    if(!! this.mdDialog) {
                        this.mdDialog.cancel();
                    }
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

    hideLoader() {
        this.loader = false;
    }

    showLoader() {
        this.loader = true;
    }

    // employee dashboard summary ends here

    emitNavbarStatus() {
        this.scope.$emit('navbarStatus', true);
    }

    emitSideNavbarStatus(value) { 
        this.scope.$emit('showSideNav', value);
    }

    isEmployeeUser () {
        if(this.userGroupType == 'employee_user'){
            return true;
        } else {
            return false;
        }
        // return this.user_group_type;
    }
    isCompanyUser () {
        if(this.userGroupType == 'company_user'){
            return true;
        } else {
            return false;
        }
        // return this.user_group_type;
    }
    isDashboardUser () {
        if(this.userGroupType == 'dashboard_user'){
            return true;
        } else {
            return false;
        }
        // return this.user_group_type;
    }

    goToVacancyDetails(vacancyObj = null) {
        this.state.go('vacancy-details', {
            'vacancyObj': vacancyObj
        });
    }
}

EmployeeDashboardController.$inject = ['employeeDashboardService', '$scope', '$window', 'CONST', '$rootScope', '$stateParams', 'coreFactory', '$state'];
