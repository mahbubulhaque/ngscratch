import BaseAngularApiService from "../../shared/jslizer-files/angular/base-angular-api-service";

class contactUsService extends BaseAngularApiService {
    constructor($state, coreFactory) {
        super();
        this.state = $state;
        this.coreFactory = coreFactory; 
        this.saveNeedsAuthentication = false;
        this.apiModuleUrl = 'commons/contact-us/';

        this.contactSubmitSchema = {
            'name': {
                type: 'str',
                min: 1,
                max: 128
            },
            'phone': {
                type: 'int',
                min: 1,
                max: 32
            },
            'email': {
                type: 'str',
                min: 1,
                max: 128
            },
            'message': {
                type: 'str',
            },
        }
    } 
    storeJWT(uuid, token, doRemember) {
        this.coreFactory.storageHandler.saveUserUuid(uuid);
        this.coreFactory.storageHandler.saveToken(token, doRemember);
    }
}

export default angular.module('services.contacutus', [])
    .service('contactUsService', contactUsService)
    .name;
