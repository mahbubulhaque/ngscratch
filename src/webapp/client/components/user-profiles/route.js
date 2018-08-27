route.$inject = ['$stateProvider'];

export default function route($stateProvider) {
    $stateProvider
        .state('user-profiles', {
            url: '/user-profiles',
            template: require('./user-profiles.html'),
            controller: 'UserProfilesController',
            controllerAs: 'epCtrl',
        });
}
