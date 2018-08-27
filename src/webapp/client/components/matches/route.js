route.$inject = ['$stateProvider'];

export default function route($stateProvider) {
    $stateProvider
        .state('matches', {
            url: '/matches',
            template: require('./matches.html'),
            controller: 'MatchesController',
            controllerAs: 'mthCtrl',
        });
}
