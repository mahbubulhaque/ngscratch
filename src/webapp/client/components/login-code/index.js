import routing from "./route";
import loginCodeService from "./service";
import LoginCodeController from "./controller";

var ngroute = 'ngRoute';
var uiroute = 'ui.router';
var resource = 'ngResource';

export default angular.module( 'logincode', [ ngroute, uiroute, resource, loginCodeService ] )
    .config( routing )
    .controller( 'LoginCodeController', LoginCodeController )
    .name;