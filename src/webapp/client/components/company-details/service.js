import BaseAngularApiService from "./../../shared/jslizer-files/angular/base-angular-api-service";

class companyDetailsService extends BaseAngularApiService {
    constructor($resource, $state, coreFactory) {
        super();
        this.resource = $resource;
        this.state = $state;
        this.coreFactory = coreFactory;
        
        this.apiModuleUrl = 'users/';

    }


}

export default angular.module('services.companyDetails', [])
    .service('companyDetailsService', companyDetailsService)
    .name;
