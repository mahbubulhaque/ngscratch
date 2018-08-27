import BaseAngularController from '../../shared/jslizer-files/angular/base-angular-controller';

export default class QuestionAnswerWebController extends BaseAngularController {

    constructor(questionAnswerWebService, $scope, CONST, $rootScope, $window, $state, coreFactory) {
        super();
        this.coreFactory = coreFactory;
        this.state = $state;
        this.service = questionAnswerWebService;
        this.constant = CONST;
         
        this.windowObj = $window;
        this.doRemember = false;
        this.errorMessage = null;
        this.loggedIn = false;
        this.scope = $scope;
        this.rootScope = $rootScope;

        this.emitNavbarStatus();
        this.emitSideNavbarStatus(false);
    }

    emitNavbarStatus() {
        this.scope.$emit('navbarStatus', false);
    }

    emitSideNavbarStatus(value) {
        this.scope.$emit('showSideNav', value);
    }
}

QuestionAnswerWebController.$inject = ['questionAnswerWebService', '$scope', 'CONST', '$rootScope', '$window', '$state', 'coreFactory'];
