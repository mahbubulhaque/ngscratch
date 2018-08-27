import routing from "./routes";
import privacyStatmentService from "../privacy-statement/service";
import PrivacyStatementController from "./controller";

var ngroute = 'ngRoute';
var uiroute = 'ui.router';
var resource = 'ngResource';

export default angular.module('privacystatement', [ngroute, uiroute, resource, privacyStatmentService])
    .config(routing)
    .controller('PrivacyStatementController', PrivacyStatementController)
    .name;
