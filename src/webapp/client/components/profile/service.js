import BaseAngularApiService from "./../../shared/jslizer-files/angular/base-angular-api-service";

class profileService extends BaseAngularApiService {
    constructor($resource, $state, coreFactory) {
        super();
        this.resource = $resource;
        this.state = $state;
        this.coreFactory = coreFactory;
        
        this.apiModuleUrl = 'users/';

    }


}

export default angular.module('services.profile', [])
    .service('profileService', profileService)
    .name;
