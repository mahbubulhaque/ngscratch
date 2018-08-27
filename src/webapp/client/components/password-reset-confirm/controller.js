import BaseAngularController from '../../shared/jslizer-files/angular/base-angular-controller';

export default class PasswordResetConfirmController extends BaseAngularController {

    constructor(passwordResetConfirmService, $state, $scope, $rootScope) {
        super();
        this.service = passwordResetConfirmService;
        this.state = $state;
        this.scope = $scope;
        this.userCredentials = {};
        this.errorMessage = null;
        this.userCredentials.code = $rootScope.passwordResetCode;
        this.emitNavbarStatus();
    }

    removeError() {
        this.errorMessage = null;
    }

    submit() {

        let params = {
            errorId: 'ctrl_reset_confirm_password_2',
            payload: this.userCredentials,
            parentObj: this,
            schema: this.service.confirmPasswordSchema,
            successFieldKey: 'passwordResetConfirmation',
        };

        this.callSave(params, (response) => {
            if (!response.hasError) {
                this.service.goToLogin();
            }
        });
    }

    emitNavbarStatus() {
        this.scope.$emit('navbarStatus', false);
    }
}

PasswordResetConfirmController.$inject = ['passwordResetConfirmService', '$state', '$scope', '$rootScope'];
