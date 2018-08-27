import routing from "./routes";
import passwordResetCodeService from "./service";
import PasswordResetCodeController from "./controller";

var ngroute = 'ngRoute';
var uiroute = 'ui.router';
var resource = 'ngResource';

export default angular.module('passwordResetCode', [ngroute, uiroute, resource, passwordResetCodeService])
    .config(routing)
    .controller('PasswordResetCodeController', PasswordResetCodeController)
    .name;