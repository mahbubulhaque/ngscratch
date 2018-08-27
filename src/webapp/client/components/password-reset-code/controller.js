export default class PasswordResetCodeController {

    constructor(passwordResetCodeService, $scope, $rootScope) {
        this.service = passwordResetCodeService;
        this.rootScope = $rootScope
        this.passwordResetCode = '';
        this.successMessage = null;
        this.errorMessage = null;
        this.scope = $scope;
        this.emitNavbarStatus();
    }

    resetPasswordCode() {
        if (this.service.checkValidity(this.passwordResetCode)) {
            this.rootScope.passwordResetCode = this.passwordResetCode;
            this.service.goToPasswordConfirmation();
        } else {
            this.errorMessage = 'Please input valid code';
        }
    }

    removeMessage() {
        this.successMessage = null;
    }

    emitNavbarStatus() {
        this.scope.$emit('navbarStatus', false);
    }
}

PasswordResetCodeController.$inject = ['passwordResetCodeService', '$scope', '$rootScope'];