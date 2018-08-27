route.$inject = ['$stateProvider'];

export default function route($stateProvider) {
    $stateProvider
        .state('company-details', {
            url: '/company-details',
            template: require('./company-details.html'),
            controller: 'CompanyDetailsController',
            params: {
                companyObj: 'companyObj'
            },
            controllerAs: 'cdCtrl',
        });
}
