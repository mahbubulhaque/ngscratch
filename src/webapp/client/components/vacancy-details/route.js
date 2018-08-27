route.$inject = ['$stateProvider'];

export default function route($stateProvider) {
    $stateProvider
        .state('vacancy-details', {
            url: '/vacancy-details',
            template: require('./vacancy-details.html'),
            controller: 'VacancyDetailsController',
            params: {
                vacancyObj: 'vacancyObj'
            },
            controllerAs: 'vcdCtrl',
        });
}
