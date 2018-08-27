import BaseAngularApiService from "./../../shared/jslizer-files/angular/base-angular-api-service";

class employeeDashboardService extends BaseAngularApiService {
    constructor($resource, $state, coreFactory) {
        super();
        this.resource = $resource;
        this.state = $state;
        this.apiModuleUrl = 'users/';
        this.saveNeedsAuthentication = false;
        this.coreFactory = coreFactory;
        this.registrationSchema = {
            'email': {
                type: 'str',
                min: 4,
                max: 64
            },
            // 'password': {
            //     type: 'str',
            //     min: 6,
            //     max: 64
            // },
            'subdomain': {
                type: 'str',
                min: 1,
                max: 40
            }
        };
    }

    goToLoginComponent() {
        this.state.go('login');
    }

}

export default angular.module('services.employeeDashboard', [])
    .service('employeeDashboardService', employeeDashboardService)
    .name;