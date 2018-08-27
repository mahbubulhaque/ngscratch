routes.$inject = ['$stateProvider'];

export default function routes($stateProvider) {
  $stateProvider
  .state('about-us', {
    url: '/about-us',
    template: require('./about-us.html'),
    controller: 'AboutUsController',
    controllerAs: 'auCtrl',
  });
}