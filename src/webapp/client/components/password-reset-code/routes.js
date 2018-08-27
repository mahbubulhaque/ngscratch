routes.$inject = ['$stateProvider'];

export default function routes($stateProvider) {
    $stateProvider
        .state('passwordResetCode', {
            url: '/password-reset-code',
            template: require('./password-reset-code.html'),
            controller: 'PasswordResetCodeController',
            controllerAs: 'passwordRC',
        });
}
