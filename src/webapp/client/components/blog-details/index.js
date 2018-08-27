import routing from "./routes";
import blogDetailsService from "../blog-details/service";
import BlogDetailsController from "./controller";

var ngroute = 'ngRoute';
var uiroute = 'ui.router';
var resource = 'ngResource';

export default angular.module('blogDetails', [ngroute, uiroute, resource, blogDetailsService])
    .config(routing)
    .controller('BlogDetailsController', BlogDetailsController)
    .name;
