routes.$inject = ['$stateProvider'];

export default function routes($stateProvider) {
    $stateProvider
        .state('passwordReset', {
            url: '/password-reset-confirm',
            template: require('./password-reset-confirm.html'),
            controller: 'PasswordResetConfirmController',
            controllerAs: 'prcon',
        });
}
