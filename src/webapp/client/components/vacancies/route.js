route.$inject = ['$stateProvider'];

export default function route($stateProvider) {
    $stateProvider
        .state('vacancies', {
            url: '/vacancies',
            template: require('./vacancies.html'),
            controller: 'VacanciesController',
            controllerAs: 'vcCtrl',
        });
}
