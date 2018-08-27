routes.$inject = ['$stateProvider'];

export default function routes($stateProvider) {
  $stateProvider
  .state('privacy-statement', {
    url: '/privacy-statement',
    template: require('./privacy-statement.html'),
    controller: 'PrivacyStatementController',
    controllerAs: 'psCtrl',
  });
}