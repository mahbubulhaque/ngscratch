import BaseAngularController from '../../shared/jslizer-files/angular/base-angular-controller';

export default class ResetPasswordController extends BaseAngularController {
    constructor(resetPasswordService, $state, $scope, $rootScope, $timeout, $stateParams, coreFactory) {
        super();
        this.service = resetPasswordService;
        this.state = $state;
        this.timeout = $timeout;
        this.stateParams = $stateParams;
        this.coreFactory = coreFactory;
        this.service.apiModuleUrl = "users/password-reset/";
        // this.service.apiModuleUrl = "users/reset-password/";
        // this.userService.apiModuleUrl = "users/";
        this.scope = $scope;
        this.userCredentials = {};
        this.errorMessage = null;
        this.message = null;
        this.passMatch = false;
        this.saved = false;
        this.showInvalidLinkMsg = false;
        this.getPasswordResetUser();
        this.emitNavbarStatus();
    }

    removeError() {
        this.errorMessage = null;
        this.passMatch = false;
    }

    getPasswordResetUser() {
        // var uuidFromStateParam = this.stateParams.reset_uuid.split('/')[2];
        var uuidFromStateParam = this.stateParams.reset_uuid;
        var params = {
            errorId: 'ctrl_reset_confirm_password_2',
            parentObj: this,
            successFieldKey: 'userData',
            // uuid: this.stateParams.reset_uuid.split(':')[1]
            uuid: uuidFromStateParam,
        };
        this.callFetch(params, (response, originalResponse) => {
            if (!response.hasError) {
                if(originalResponse.status_code == 400 || originalResponse.status == 404) {
                    this.showInvalidLinkMsg = true;
                    this.scope.$digest();
                } else {
                    this.userData.is_valid = true;
                }
                // if (!response.results.is_valid) {
                // // if (!response.status === "success") {
                //     this.showInvalidLinkMsg = true;
                //     this.scope.$digest();
                // }
            } else {
                if(!!originalResponse && originalResponse.status == 'error') {
                    this.showInvalidLinkMsg = true;
                    this.scope.$digest();
                }
            }
        });
    }

    submit() {
        // let uuidFromStateParam = this.stateParams.reset_uuid.split('/')[2],
        let uuidFromStateParam = this.stateParams.reset_uuid,
            params = {
                errorId: 'ctrl_reset_confirm_password_2',
                payload: this.userCredentials,
                parentObj: this,
                schema: this.service.confirmPasswordSchema,
                service: this.service,
                successFieldKey: 'passwordResetConfirmation',
                // uuid: this.stateParams.reset_uuid
                // uuid: this.stateParams.reset_uuid.split(':')[1]
                uuid: uuidFromStateParam,
            };

        this.callUpdate(params, (response, originalResponse) => {
            if (!response.hasError) {
                this.message = "Your password has been reset successfully. Redirecting to login...";
                this.timeout(() => {
                    this.message = "";
                    this.service.goToLogin();
                }, 3000);
                this.scope.$digest();
            } else {
                if (!!originalResponse && originalResponse.status == 'error') {
                    this.errorMessage = originalResponse.message;
                    this.scope.$digest();
                }
            }
        });
    }

    emitNavbarStatus() {
        this.scope.$emit('navbarStatus', false);
    }

    passwordMatch(password = null, confirm_password = null) {
        if ((password && confirm_password) && password === confirm_password) {
            this.passMatch = true;
        }
    }

}

ResetPasswordController.$inject = ['resetPasswordService', '$state', '$scope', '$rootScope', '$timeout', '$stateParams', 'coreFactory'];
