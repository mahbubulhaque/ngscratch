import routing from "./route";
import categoryService from "./service";
import CategoryController from "./controller";

var ngroute = 'ngRoute';
var uiroute = 'ui.router';
var resource = 'ngResource';

export default angular.module( 'category', [ ngroute, uiroute, resource, categoryService ] )
    .config( routing )
    .controller( 'CategoryController', CategoryController )
    .name;