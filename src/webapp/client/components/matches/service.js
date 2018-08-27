import BaseAngularApiService from "./../../shared/jslizer-files/angular/base-angular-api-service";

class matchesService extends BaseAngularApiService {
    constructor($resource, $state, coreFactory) {
        super();
        this.resource = $resource;
        this.state = $state;
        this.apiModuleUrl = 'jobs/vacancy-interest/';
        this.saveNeedsAuthentication = false;
        this.coreFactory = coreFactory;
        this.matchUpdateSchema = {
            'is_active': {
                type: 'bool',
            },
            // 'password': {
            //     type: 'str',
            //     min: 6,
            //     max: 64
            // },
            'is_success': {
                type: 'bool',
            }
        };
    }

    goToLoginComponent() {
        this.state.go('login');
    }

}

export default angular.module('services.matches', [])
    .service('matchesService', matchesService)
    .name;
