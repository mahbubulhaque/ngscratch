import BaseAngularApiService from "../../shared/jslizer-files/angular/base-angular-api-service.js";

class LogoutService extends BaseAngularApiService {
    constructor(coreFactory) {
        super();
        this.coreFactory = coreFactory;
        this.apiModuleUrl = 'users/';
        this.customSaveUrl = 'users/logout/';
    }
}

export default angular.module('services.logoutService', [])
    .service('logoutService', LogoutService)
    .name;
