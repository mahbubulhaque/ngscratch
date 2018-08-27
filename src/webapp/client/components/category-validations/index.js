import routing from "./route";
import categoryValidationsService from "./service";
import CategoryValidationsController from "./controller";

var ngroute = 'ngRoute';
var uiroute = 'ui.router';
var resource = 'ngResource';

export default angular.module( 'categoryValidations', [ ngroute, uiroute, resource, categoryValidationsService ] )
    .config( routing )
    .controller( 'CategoryValidationsController', CategoryValidationsController )
    .name;