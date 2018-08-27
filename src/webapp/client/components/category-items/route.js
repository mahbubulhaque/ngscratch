route.$inject = ['$stateProvider'];

export default function route($stateProvider) {
    $stateProvider
        .state('category-items', {
            url: '/category-items',
            template: require('./category-items.html'),
            controller: 'CategoryItemsController',
            controllerAs: 'ctgICtrl',
        });
}
