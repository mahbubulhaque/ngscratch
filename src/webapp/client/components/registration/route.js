route.$inject = ['$stateProvider'];

export default function route($stateProvider) {
    $stateProvider
        .state('register', {
            url: '/register',
            template: require('./registration.html'),
            controller: 'RegistrationController',
            controllerAs: 'reg',
        });
}
