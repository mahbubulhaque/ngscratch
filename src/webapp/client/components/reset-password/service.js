import BaseAngularApiService from "../../shared/jslizer-files/angular/base-angular-api-service";
class ResetPasswordService extends BaseAngularApiService {
    // constructor($resource, $state, localStorageService) {
    constructor($resource, $state) {
        super();
        this.resource = $resource;
        this.state = $state;
        // this.storage = localStorageService;
        this.apiModuleUrl = 'users/';
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
            }
        };
    }

    goToLogin() {
        this.state.go('login');
    }

}

export default angular.module('services.reset_password', [])
    .service('resetPasswordService', ResetPasswordService)
    .name;