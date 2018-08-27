import BaseAngularApiService from "../../shared/jslizer-files/angular/base-angular-api-service";

class termsAndConditionService extends BaseAngularApiService {
    constructor($state, coreFactory) {
        super();
        this.state = $state;
        this.coreFactory = coreFactory; 
        this.saveNeedsAuthentication = false; 
    } 
    storeJWT(uuid, token, doRemember) {
        this.coreFactory.storageHandler.saveUserUuid(uuid);
        this.coreFactory.storageHandler.saveToken(token, doRemember);
    }
}

export default angular.module('services.termsandcondition', [])
    .service('termsAndConditionService', termsAndConditionService)
    .name;
