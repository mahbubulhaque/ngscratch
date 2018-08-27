import routing from "./routes";
import loginService from "../login/service";
import LoginController from "./controller";

var ngroute = 'ngRoute';
var uiroute = 'ui.router';
var resource = 'ngResource';

export default angular.module('login', [ngroute, uiroute, resource, loginService])
    .config(routing)
    .controller('LoginController', LoginController)
    .name;
