routes.$inject = ['$stateProvider'];

export default function routes($stateProvider) {
  $stateProvider
  .state('question-and-answer', {
    url: '/question-and-answer',
    template: require('./question-answer-web.html'),
    controller: 'QuestionAnswerWebController',
    controllerAs: 'qawCtrl',
  });
}