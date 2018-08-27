route.$inject = ['$stateProvider'];

export default function route($stateProvider) {
    $stateProvider
        .state('user-profile-details', {
            url: '/user-profile-details',
            template: require('./user-profile-details.html'),
            controller: 'UserProfileDetailsController',
            params: {
                userObj: 'userObj'
            },
            controllerAs: 'epdCtrl',
        });
}
