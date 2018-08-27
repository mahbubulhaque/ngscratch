import BaseAngularController from '../../shared/jslizer-files/angular/base-angular-controller';

export default class ForgetPasswordController extends BaseAngularController {

    constructor(forgetPasswordService, $scope) {
        super();
        this.service = forgetPasswordService;
        this.userCredentials = {};
        this.successMessage = null;
        this.showForm = true;
        this.scope = $scope;
        this.emitNavbarStatus();
    }

    resetPassword() {
        let params = {
            errorId: 'ctrl_forget_password_1',
            payload: this.userCredentials,
            parentObj: this,
            schema: this.service.forgetPasswordSchema,
            successFieldKey: 'forgetPasswordSuccess',
        };
        this.callSave(params, (response) => {
            if (!response.hasError) {
                this.showForm = false;
                this.scope.$digest();
            }
        });
    }
    removeMessage() {
        this.successMessage = null;
    }

    emitNavbarStatus() {
        this.scope.$emit('navbarStatus', false);
    }
}

ForgetPasswordController.$inject = ['forgetPasswordService', '$scope'];
