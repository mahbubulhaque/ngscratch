route.$inject = ['$stateProvider'];

export default function route($stateProvider) {
    $stateProvider
        .state('questions-answer', {
            url: '/questions-answer',
            template: require('./questions-answer.html'),
            controller: 'QuestionsAnswerController',
            controllerAs: 'qaCtrl',
        });
}
