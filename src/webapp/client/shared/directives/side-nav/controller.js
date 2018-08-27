import BaseAngularController from '../../jslizer-files/angular/base-angular-controller'

export default class SideNavController extends BaseAngularController {

    constructor($scope, $location, screenSize, routeService, CONST, $rootScope, $resource, coreFactory, logoutService, $window, $cookies) {
        super();
        this.cookiesObj = $cookies;
        this.resource = $resource;
        this.windowObj = $window;
        this.logoutService = logoutService;
        this.state = routeService;
        this.location = $location;
        this.constant = CONST;
        this.scope = $scope;
        this.tab = 0;
        this.rootScope = $rootScope;
        this.coreFactory = coreFactory;
        this.user_group_type = this.coreFactory.storageHandler.getValue('user_group_type');
        this.companyUserNavs = [
            'employee-dashboard', 'user-profiles', 'vacancies',
            'company', 'employee', 'login-code',
            'question-answer', 'matches', 'training-materials',
            'job-domain', 'category-validations'
        ];

        this.employeeUserNavs = [
            'employee-dashboard', 'question-answer', 'vacancies', 'training-materials',
            'job-domain', 'favourite-vacancies', 
        ];
    }

    userBasedNavCheck(nav){
        this.user_group_type = this.coreFactory.storageHandler.getValue('user_group_type');
        if(this.user_group_type == 'company_user') {
            if(this.companyUserNavs.indexOf(nav) >= 0) {
                return true;
            } else {
                return false;
            }
        } else if (this.user_group_type == 'employee_user') {
            if(this.employeeUserNavs.indexOf(nav) >= 0) {
                return true;
            } else {
                return false;
            }
        } else {
            if(nav == 'favourite-vacancies') {
                return false;
            } else {
                return true;
            }
        }
    }

    // Element tab section
    setTab(newTab, item) {
        this.tab = newTab;
    };
    isSet(tabNum) {
        return this.tab === tabNum;
    };

}

SideNavController.$inject = ['$scope', '$location', 'screenSize', 'routeService', 'CONST', '$rootScope', '$resource', 'coreFactory', 'logoutService', '$window', '$cookies'];
