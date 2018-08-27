import routing from "./routes";
import blogService from "../blog/service";
import BlogController from "./controller";

var ngroute = 'ngRoute';
var uiroute = 'ui.router';
var resource = 'ngResource';

export default angular.module('blog', [ngroute, uiroute, resource, blogService])
    .config(routing)
    .controller('BlogController', BlogController)
    .name;
