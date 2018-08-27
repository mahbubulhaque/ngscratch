import BaseAngularApiService from "../../shared/jslizer-files/angular/base-angular-api-service";

class ForgetPasswordService extends BaseAngularApiService {

    constructor($state, coreFactory) {
        super();
        this.state = $state;
        this.coreFactory = coreFactory;
        this.apiModuleUrl = 'users/';
        this.customSaveUrl = 'users/password-reset/email/';
        this.saveNeedsAuthentication = false;
        this.forgetPasswordSchema = {
            'email': {
                type: 'str',
                min: 4,
                max: 64
            }
        };
    }

    goToConfirmationCodePage() {
        this.state.go('passwordResetCode');
    }
}

export default angular.module('services.password_reset', [])
    .service('forgetPasswordService', ForgetPasswordService)
    .name;
