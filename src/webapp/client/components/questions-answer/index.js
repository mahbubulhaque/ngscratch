import routing from "./route";
import questionAnswerService from "./service";
import QuestionsAnswerController from "./controller";

var ngroute = 'ngRoute';
var uiroute = 'ui.router';
var resource = 'ngResource';

export default angular.module( 'questionanswer', [ ngroute, uiroute, resource, questionAnswerService ] )
    .config( routing )
    .controller( 'QuestionsAnswerController', QuestionsAnswerController )
    .name;