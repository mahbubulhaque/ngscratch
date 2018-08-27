import routing from "./route";
import contactDataService from "./service";
import ContactDataController from "./controller";

var ngroute = 'ngRoute';
var uiroute = 'ui.router';
var resource = 'ngResource';

export default angular.module( 'contactdata', [ ngroute, uiroute, resource, contactDataService ] )
    .config( routing )
    .controller( 'ContactDataController', ContactDataController )
    .name;