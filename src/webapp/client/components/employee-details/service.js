import BaseAngularApiService from "./../../shared/jslizer-files/angular/base-angular-api-service";

class employeeDetailsService extends BaseAngularApiService {
    constructor($resource, $state, coreFactory) {
        super();
        this.resource = $resource;
        this.state = $state;
        this.apiModuleUrl = 'users/';
        this.saveNeedsAuthentication = false;
        this.coreFactory = coreFactory;
         
    }
 

}

export default angular.module('services.employeeDetails', [])
    .service('employeeDetailsService', employeeDetailsService)
    .name;