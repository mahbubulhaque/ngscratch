routes.$inject = ['$stateProvider'];

export default function routes($stateProvider) {
    $stateProvider
        .state('forget-password', {
            url: '/forget-password',
            template: require('./forget-password.html'),
            controller: 'ForgetPasswordController',
            controllerAs: 'fpassword',
        });
}
