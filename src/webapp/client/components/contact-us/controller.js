import BaseAngularController from '../../shared/jslizer-files/angular/base-angular-controller';

export default class ContactUsController extends BaseAngularController {

    constructor(contactUsService, $scope, CONST, $rootScope, $window, $state, coreFactory, $filter, $mdToast) {
        super();
        this.coreFactory = coreFactory;
        this.state = $state;
        this.service = contactUsService;
        this.constant = CONST;
        this.userCredentials = {
            'social_token': null,
            'login_type': 1
        };
        this.windowObj = $window;
        this.doRemember = false;
        this.errorMessage = null;
        this.loggedIn = false;
        this.scope = $scope;
        this.rootScope = $rootScope;
        this.filter = $filter;
        this.mdToast = $mdToast;
        this.addContactErrorMessage = null;
        this.errors = {};
        this.contactData = {};

        this.emitNavbarStatus();
        this.emitSideNavbarStatus(false);
    }

    showSuccessMessage(msg) {
        this.mdToast.show(
          this.mdToast.simple()
            .textContent(msg)
            .action('Close')
            .highlightClass('md-success')
            .position('bottom right')
            .hideDelay(3000)
        );
    }
    emitNavbarStatus() {
        this.scope.$emit('navbarStatus', false);
    }

    emitSideNavbarStatus(value) {
        this.scope.$emit('showSideNav', value);
    }

    sendContactData(){

        let params = {
            payload: this.contactData,
            schema: this.service.contactSubmitSchema,
            errorMessageFieldKey: 'addContactErrorMessage',
            service: this.service,
            parentObj: this,
            errorId: 'ctrl_contact_send_error_1',
            successFieldKey: 'submitContact'
        };

        this.callSave(params, (response)=>{
            if (!response.hasError) {
                let msg = this.filter('translate')('CONTACT_SUBMIT_SUCCESS');
                this.showSuccessMessage(msg);
                this.contactData={};
            }
        });
    }
}

ContactUsController.$inject = ['contactUsService', '$scope', 'CONST', '$rootScope', '$window', '$state', 'coreFactory', '$filter', '$mdToast'];
