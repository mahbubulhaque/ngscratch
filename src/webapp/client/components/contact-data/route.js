route.$inject = ['$stateProvider'];

export default function route($stateProvider) {
    $stateProvider
        .state('contact-data', {
            url: '/contact-data',
            template: require('./contact-data.html'),
            controller: 'ContactDataController',
            controllerAs: 'cntdataCtrl',
        });
}
