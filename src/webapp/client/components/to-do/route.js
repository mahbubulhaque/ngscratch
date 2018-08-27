route.$inject = ['$stateProvider'];

export default function route($stateProvider) {
    $stateProvider
        .state('to-do', {
            url: '/to-do',
            template: require('./to-do.html'),
            controller: 'ToDoController',
            controllerAs: 'todoCtrl',
        });
}
