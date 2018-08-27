import routing from "./routes";
import referenceService from "../references/service";
import ReferenceController from "./controller";

var ngroute = 'ngRoute';
var uiroute = 'ui.router';
var resource = 'ngResource';

export default angular.module('reference', [ngroute, uiroute, resource, referenceService])
    .config(routing)
    .controller('ReferenceController', ReferenceController)
    .name;
