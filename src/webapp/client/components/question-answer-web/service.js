import BaseAngularApiService from "../../shared/jslizer-files/angular/base-angular-api-service";

class questionAnswerWebService extends BaseAngularApiService {
    constructor($state, coreFactory) {
        super();
        this.state = $state;
        this.coreFactory = coreFactory; 
        this.saveNeedsAuthentication = false; 
    }  
}

export default angular.module('services.questionAnswerWeb', [])
    .service('questionAnswerWebService', questionAnswerWebService)
    .name;
