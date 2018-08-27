import BaseAngularApiService from "../../shared/jslizer-files/angular/base-angular-api-service";

class jobdomainService extends BaseAngularApiService {
    constructor($resource, $state, coreFactory) {
        super();
        this.resource = $resource;
        this.state = $state;
        this.apiModuleUrl = 'users/';
        this.coreFactory = coreFactory;
        this.jobdomainSchema = {
            'title': {
                type: 'str',
                min: 1,
                max: 128
            }
        };
    }

    goToLoginComponent() {
        this.state.go('login');
    }
}

export default angular.module('services.jobdomain', [])
    .service('jobdomainService', jobdomainService)
    .name;
