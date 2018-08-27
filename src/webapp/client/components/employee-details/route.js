route.$inject = ['$stateProvider'];

export default function route($stateProvider) {
    $stateProvider
        .state('employee-details', {
            url: '/employee-details',
            template: require('./employee-details.html'),
            controller: 'EmployeeDetailsController',
            params: {
                employeeObj: 'employeeObj'
            },
            controllerAs: 'empdCtrl',
        });
}
