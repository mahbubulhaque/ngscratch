import routing from "./route";
import categoryItemsService from "./service";
import CategoryItemsController from "./controller";

var ngroute = 'ngRoute';
var uiroute = 'ui.router';
var resource = 'ngResource';

export default angular.module( 'categoryItems', [ ngroute, uiroute, resource, categoryItemsService ] )
    .config( routing )
    .controller( 'CategoryItemsController', CategoryItemsController )
    .name;