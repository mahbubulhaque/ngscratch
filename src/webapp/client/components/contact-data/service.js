import BaseAngularApiService from "../../shared/jslizer-files/angular/base-angular-api-service";

class contactDataService extends BaseAngularApiService {
    constructor($resource, $state, coreFactory) {
        super();
        this.resource = $resource;
        this.state = $state;
        this.apiModuleUrl = 'commons/contact-us/list/';
        this.coreFactory = coreFactory;
    }

    goToLoginComponent() {
        this.state.go('login');
    }
}

export default angular.module('services.contactData', [])
    .service('contactDataService', contactDataService)
    .name;
