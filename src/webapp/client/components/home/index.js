import routing from "./routes";
import homeService from "../home/service";
import HomeController from "./controller";

var ngroute = 'ngRoute';
var uiroute = 'ui.router';
var resource = 'ngResource';

export default angular.module('home', [ngroute, uiroute, resource, homeService])
    .config(routing)
    .controller('HomeController', HomeController)
    .name;
