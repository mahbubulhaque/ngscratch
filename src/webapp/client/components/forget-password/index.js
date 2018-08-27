import routing from "./routes";
import forgetPasswordService from "./service";
import ForgetPasswordController from "./controller";

var ngroute = 'ngRoute';
var uiroute = 'ui.router';
var resource = 'ngResource';

export default angular.module('forgetPassword', [ngroute, uiroute, resource, forgetPasswordService])
    .config(routing)
    .controller('ForgetPasswordController', ForgetPasswordController)
    .name;
