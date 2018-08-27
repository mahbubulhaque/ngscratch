import routing from "./route";
import profileService from "./service";
import ProfileController from "./controller";

var ngroute = 'ngRoute';
var uiroute = 'ui.router';
var resource = 'ngResource';

export default angular.module( 'profile', [ ngroute, uiroute, resource, profileService ] )
    .config( routing )
    .controller( 'ProfileController', ProfileController )
    .name;