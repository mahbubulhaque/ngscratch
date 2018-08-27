import BaseAngularApiService from "../../shared/jslizer-files/angular/base-angular-api-service";

class loginCodeService extends BaseAngularApiService {
    constructor($resource, $state, coreFactory) {
        super();
        this.resource = $resource;
        this.state = $state;
        this.coreFactory = coreFactory;
        this.apiModuleUrl = 'users/';
        this.loginCodeSchema = {
            'login_code': {
                type: 'str',
                min: 1,
                max: 16
            }
        };
    }

}

export default angular.module('services.logincode', [])
    .service('loginCodeService', loginCodeService)
    .name;
