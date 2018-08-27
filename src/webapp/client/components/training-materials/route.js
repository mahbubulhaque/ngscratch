route.$inject = ['$stateProvider'];

export default function route($stateProvider) {
    $stateProvider
        .state('training-materials', {
            url: '/training-materials',
            template: require('./training-materials.html'),
            controller: 'TrainingMaterialsController',
            controllerAs: 'tmCtrl',
        });
}
