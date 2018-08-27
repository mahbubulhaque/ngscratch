class PasswordResetCodeService {

    constructor($state) {

        this.state = $state;
    }

    checkValidity(code) {
        if (code === '') {
            return false;
        };
        return true;
    }

    goToPasswordConfirmation() {
        this.state.go('passwordReset');
    }
}

export default angular.module('services.password_reset_code', [])
    .service('passwordResetCodeService', PasswordResetCodeService)
    .name;