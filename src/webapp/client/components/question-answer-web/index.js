import routing from "./routes";
import questionAnswerWebService from "../question-answer-web/service";
import QuestionAnswerWebController from "./controller";

var ngroute = 'ngRoute';
var uiroute = 'ui.router';
var resource = 'ngResource';

export default angular.module('questionAnswerWeb', [ngroute, uiroute, resource, questionAnswerWebService])
    .config(routing)
    .controller('QuestionAnswerWebController', QuestionAnswerWebController)
    .name;
