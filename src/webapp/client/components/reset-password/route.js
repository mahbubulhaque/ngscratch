route.$inject = ['$stateProvider'];

export default function route($stateProvider) {
  $stateProvider
  .state('reset-password', {
    url: '/reset-password/:reset_uuid',
    // url: '/reset-password',
    template: require('./reset-password.html'),
    controller: 'ResetPasswordController',
    controllerAs: 'resPass',
  });
}