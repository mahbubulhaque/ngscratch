import routing from "./route";
import userProfilesService from "./service";
import UserProfilesController from "./controller";

var ngroute = 'ngRoute';
var uiroute = 'ui.router';
var resource = 'ngResource';

export default angular.module( 'userProfiles', [ ngroute, uiroute, resource, userProfilesService ] )
    .config( routing )
    .controller( 'UserProfilesController', UserProfilesController )
    .name;