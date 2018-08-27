route.$inject = ['$stateProvider'];

export default function route($stateProvider) {
    $stateProvider
        .state('job-domain', {
            url: '/job-domain',
            template: require('./job-domain.html'),
            controller: 'JobdomainController',
            controllerAs: 'jdCtrl',
        });
}
