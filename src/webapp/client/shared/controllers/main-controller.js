import BaseAngularController from '../../shared/jslizer-files/angular/base-angular-controller';

export default class MainController extends BaseAngularController {

    constructor($scope, $location, coreFactory, $timeout, $translate, $rootScope) {
        super();
        this.coreFactory = coreFactory;
        this.scope = $scope;
        this.rootScope = $rootScope;
        $scope.location = $location;
        this.timeout = $timeout;
        $scope.showNavbar = true;
        $scope.$on('navbarStatus', function(event, args) {
            $scope.showNavbar = args;
        });
        $scope.$on('showSideNav', function(event, args) {
            $scope.showSideNav = args;
        });

        //Intro loader delay
        $scope.hideIntroLoader = false;
        $timeout(function() {
            $scope.hideIntroLoader = true;
        }, 3000);

        // $scope.changeLanguage = function (langKey) {
        //     $translate.use(langKey);
        // };
        this.rootScope.$on('changeLanguage', (event, args) => {
            $translate.use(args.langKey);
        });
    }
}

MainController.$inject = ['$scope', '$location', 'coreFactory', '$timeout', '$translate', '$rootScope'];
