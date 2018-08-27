routes.$inject = ['$stateProvider'];

export default function routes($stateProvider) {
  $stateProvider
  .state('terms-and-condition', {
    url: '/terms-and-condition',
    template: require('./terms-and-condition.html'),
    controller: 'TermsAndConditionController',
    controllerAs: 'tacCtrl',
  });
}