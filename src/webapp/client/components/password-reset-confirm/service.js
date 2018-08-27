import BaseAngularApiService from "../../shared/jslizer-files/angular/base-angular-api-service";

class PasswordResetConfirmService extends BaseAngularApiService {

    constructor($resource, $state, localStorageService) {
        super();
        this.resource = $resource;
        this.state = $state;
        this.storage = localStorageService;
        this.apiModuleUrl = 'users/';
        this.customSaveUrl = 'users/password-reset/';
        this.saveNeedsAuthentication = false;
        this.confirmPasswordSchema = {
            'password': {
                type: 'str',
                min: 6,
                max: 64
            },
            'confirm_password': {
                type: 'str',
                min: 6,
                max: 64
            },
            'code': {
                type: 'str',
                min: 6,
                max: 6
            }
        };
    }

    goToLogin() {
        this.state.go('login');
    }

}

export default angular.module('services.password_reset_confirm', [])
    .service('passwordResetConfirmService', PasswordResetConfirmService)
    .name;
