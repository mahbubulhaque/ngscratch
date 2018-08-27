import routing from "./routes";
import termsAndConditionService from "../terms-and-condition/service";
import TermsAndConditionController from "./controller";

var ngroute = 'ngRoute';
var uiroute = 'ui.router';
var resource = 'ngResource';

export default angular.module('termsandcondition', [ngroute, uiroute, resource, termsAndConditionService])
    .config(routing)
    .controller('TermsAndConditionController', TermsAndConditionController)
    .name;
