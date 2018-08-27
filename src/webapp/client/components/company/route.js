route.$inject = ['$stateProvider'];

export default function route($stateProvider) {
    $stateProvider
        .state('company', {
            url: '/company',
            template: require('./company.html'),
            controller: 'CompanyController',
            controllerAs: 'cmpCtrl',
        });
}
