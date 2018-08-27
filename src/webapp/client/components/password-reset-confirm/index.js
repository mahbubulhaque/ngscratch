import routing from "./routes";
import passwordResetConfirmService from "../password-reset-confirm/service";
import PasswordResetConfirmController from "./controller";

var ngroute = 'ngRoute';
var uiroute = 'ui.router';
var resource = 'ngResource';

export default angular.module('passwordReset', [ngroute, uiroute, resource, passwordResetConfirmService])
    .config(routing)
    .controller('PasswordResetConfirmController', PasswordResetConfirmController)
    .name;
