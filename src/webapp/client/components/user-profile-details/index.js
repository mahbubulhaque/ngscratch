import routing from "./route";
import userProfileDetailsService from "./service";
import UserProfileDetailsController from "./controller";

var ngroute = 'ngRoute';
var uiroute = 'ui.router';
var resource = 'ngResource';

export default angular.module( 'userProfileDetails', [ ngroute, uiroute, resource, userProfileDetailsService ] )
    .config( routing )
    .controller( 'UserProfileDetailsController', UserProfileDetailsController )
    .name;