import routing from "./route";
import jobdomainService from "./service";
import JobdomainController from "./controller";

var ngroute = 'ngRoute';
var uiroute = 'ui.router';
var resource = 'ngResource';

export default angular.module( 'jobdomain', [ ngroute, uiroute, resource, jobdomainService ] )
    .config( routing )
    .controller( 'JobdomainController', JobdomainController )
    .name;