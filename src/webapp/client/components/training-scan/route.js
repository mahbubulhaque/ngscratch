route.$inject = ['$stateProvider'];

export default function route($stateProvider) {
    $stateProvider
        .state('training-scan', {
            url: '/training-scan',
            template: require('./training-scan.html'),
            controller: 'TrainingScanController',
            controllerAs: 'tsCtrl',
        });
}
