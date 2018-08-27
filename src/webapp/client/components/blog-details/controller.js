import BaseAngularController from '../../shared/jslizer-files/angular/base-angular-controller';

export default class BlogDetailsController extends BaseAngularController {

    constructor(blogDetailsService, $scope, CONST, $rootScope, $window, $state, coreFactory) {
        super();
        this.coreFactory = coreFactory;
        this.state = $state;
        this.service = blogDetailsService;
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

BlogDetailsController.$inject = ['blogDetailsService', '$scope', 'CONST', '$rootScope', '$window', '$state', 'coreFactory'];
