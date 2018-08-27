import BaseAngularApiService from "./../../shared/jslizer-files/angular/base-angular-api-service";

class questionAnswerService extends BaseAngularApiService {
    constructor($resource, $state, coreFactory) {
        super();
        this.resource = $resource;
        this.state = $state;
        this.apiModuleUrl = '/commons/question-answer/';
        // this.saveNeedsAuthentication = false;
        this.coreFactory = coreFactory;
        this.qaUpdateSchema = {
            'asked_by_uuid': {
                type: 'str',
                min: 1,
                max: 128
            },
            'question': {
                type: 'str',
                min: 1,
                max: 128
            },
            'answered_by_uuid': {
                type: 'str',
                min: 1,
                max: 128
            },
        };
    }

    goToLoginComponent() {
        this.state.go('login');
    }

}

export default angular.module('services.questionanswer', [])
    .service('questionAnswerService', questionAnswerService)
    .name;
