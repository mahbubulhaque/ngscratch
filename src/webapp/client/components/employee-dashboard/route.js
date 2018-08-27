route.$inject = ['$stateProvider'];

export default function route($stateProvider) {
    $stateProvider
        .state('employee-dashboard', {
            url: '/employee-dashboard',
            template: require('./employee-dashboard.html'),
            controller: 'EmployeeDashboardController',
            controllerAs: 'edCtrl',
        });
}
