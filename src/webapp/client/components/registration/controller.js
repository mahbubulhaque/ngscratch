import BaseAngularController from './../../shared/jslizer-files/angular/base-angular-controller';

export default class RegistrationController extends BaseAngularController {

    constructor(registerService, $scope, $window, CONST, $rootScope, $stateParams, coreFactory) {
        super();
        this.rootScope = $rootScope;
        this.scope = $scope;
        this.stateParams = $stateParams;
        this.service = registerService;
        this.userData = {};
        this.errorMessage = null;
        this.coreFactory = coreFactory;
        this.emitNavbarStatus();
        this.hideForm = true;
        this.registrationSuccess = "";
        this.actype = {
            name: 'Link',
        };
        this.country = {
            name: 'United States',
            code: '+1',
            selected: true,
        };
    }

    register() {
        let params = {
            errorId: 'ctrl_registration_1',
            payload: this.userData,
            schema: this.service.registrationSchema,
            parentObj: this,
            successFieldKey: 'registeredUser'
        };
        this.callSave(params, (response) => {
            if (!response.hasError) {
                this.registrationSuccess = "You have been registered successfully. Please check inbox to confirm your email Address."
                this.hideForm = false;
                this.scope.$digest();
                this.service.goToLoginComponent();
            }
        });
    }

    emitNavbarStatus() {
        this.scope.$emit('navbarStatus', false);
    }
}

RegistrationController.$inject = ['registerService', '$scope', '$window', 'CONST', '$rootScope', '$stateParams', 'coreFactory'];
