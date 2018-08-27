route.$inject = ['$stateProvider'];

export default function route($stateProvider) {
    $stateProvider
        .state('login-code', {
            url: '/login-code',
            template: require('./login-code.html'),
            controller: 'LoginCodeController',
            controllerAs: 'lcCtrl',
        });
}
