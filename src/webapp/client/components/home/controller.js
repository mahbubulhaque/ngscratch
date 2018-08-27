import BaseAngularController from '../../shared/jslizer-files/angular/base-angular-controller';

export default class HomeController extends BaseAngularController {

    constructor(homeService, $scope, CONST, $rootScope, $window, $state, coreFactory) {
        super();
        this.coreFactory = coreFactory;
        this.state = $state;
        this.service = homeService;
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

HomeController.$inject = ['homeService', '$scope', 'CONST', '$rootScope', '$window', '$state', 'coreFactory'];
