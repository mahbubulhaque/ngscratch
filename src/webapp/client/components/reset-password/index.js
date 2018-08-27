import routing from "./route";
import ResetPasswordController from "./controller";
import ResetPasswordService from "./service";


var ngroute = 'ngRoute';
var uiroute = 'ui.router';
var resource = 'ngResource';

export default angular.module('ResetPasswordController', [ngroute, uiroute, resource, ResetPasswordService])
    .config(routing)
    .controller('ResetPasswordController', ResetPasswordController)
    .name;
