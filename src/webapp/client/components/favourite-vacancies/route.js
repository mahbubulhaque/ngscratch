route.$inject = ['$stateProvider'];

export default function route($stateProvider) {
    $stateProvider
        .state('favourite-vacancies', {
            url: '/favourite-vacancies',
            template: require('./favourite-vacancies.html'),
            controller: 'FavouriteVacanciesController',
            controllerAs: 'fvcCtrl',
        });
}
