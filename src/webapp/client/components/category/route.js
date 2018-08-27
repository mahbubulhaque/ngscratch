route.$inject = ['$stateProvider'];

export default function route($stateProvider) {
    $stateProvider
        .state('category', {
            url: '/category',
            template: require('./category.html'),
            controller: 'CategoryController',
            controllerAs: 'ctgCtrl',
        });
}
