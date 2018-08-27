import BaseAngularApiService from "../../shared/jslizer-files/angular/base-angular-api-service";

class blogDetailsService extends BaseAngularApiService {
    constructor($state, coreFactory) {
        super();
        this.state = $state;
        this.coreFactory = coreFactory; 
        this.saveNeedsAuthentication = false; 
    } 
     
}

export default angular.module('services.blogDetails', [])
    .service('blogDetailsService', blogDetailsService)
    .name;
