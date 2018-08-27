route.$inject = ['$stateProvider'];

export default function route($stateProvider) {
    $stateProvider
        .state('profile', {
            url: '/profile',
            template: require('./profile.html'),
            controller: 'ProfileController', 
            controllerAs: 'pfCtrl',
        });
}
