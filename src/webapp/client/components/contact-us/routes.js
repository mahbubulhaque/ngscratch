routes.$inject = ['$stateProvider'];

export default function routes($stateProvider) {
  $stateProvider
  .state('contact-us', {
    url: '/contact-us',
    template: require('./contact-us.html'),
    controller: 'ContactUsController',
    controllerAs: 'cuCtrl',
  });
}