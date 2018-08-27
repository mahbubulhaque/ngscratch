route.$inject = ['$stateProvider'];

export default function route($stateProvider) {
    $stateProvider
        .state('category-validations', {
            url: '/category-validations',
            template: require('./category-validations.html'),
            controller: 'CategoryValidationsController',
            controllerAs: 'ctgVCtrl',
        });
}
