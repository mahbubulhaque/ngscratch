routes.$inject = ['$stateProvider'];

export default function routes($stateProvider) {
  $stateProvider
  .state('blog-details', {
    url: '/blog-details',
    template: require('./blog-details.html'),
    controller: 'BlogDetailsController',
    controllerAs: 'blogDCtrl',
  });
}