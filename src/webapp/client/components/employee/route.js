route.$inject = ['$stateProvider'];

export default function route($stateProvider) {
    $stateProvider
        .state('employee', {
            url: '/employee',
            template: require('./employee.html'),
            controller: 'EmployeeController',
            controllerAs: 'empCtrl',
        });
}
