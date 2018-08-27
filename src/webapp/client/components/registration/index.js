import routing from "./route";
import registerService from "./service";
import RegistrationController from "./controller";

var ngroute = 'ngRoute';
var uiroute = 'ui.router';
var resource = 'ngResource';

export default angular.module( 'register', [ ngroute, uiroute, resource, registerService ] )
    .config( routing )
    .controller( 'RegistrationController', RegistrationController )
    .name;