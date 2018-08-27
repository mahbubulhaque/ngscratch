import BaseAngularApiService from "../../shared/jslizer-files/angular/base-angular-api-service";

class blogService extends BaseAngularApiService {
    constructor($state, coreFactory) {
        super();
        this.state = $state;
        this.coreFactory = coreFactory; 
        this.saveNeedsAuthentication = false; 
    } 
     
}

export default angular.module('services.blog', [])
    .service('blogService', blogService)
    .name;
