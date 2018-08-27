routes.$inject = ['$stateProvider'];

export default function routes($stateProvider) {
  $stateProvider
  .state('references', {
    url: '/references',
    template: require('./references.html'),
    controller: 'ReferenceController',
    controllerAs: 'rfCtrl',
  });
}