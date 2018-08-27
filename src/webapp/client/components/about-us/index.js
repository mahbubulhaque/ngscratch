import routing from "./routes";
import aboutUsService from "../about-us/service";
import AboutUsController from "./controller";

var ngroute = 'ngRoute';
var uiroute = 'ui.router';
var resource = 'ngResource';

export default angular.module('aboutus', [ngroute, uiroute, resource, aboutUsService])
    .config(routing)
    .controller('AboutUsController', AboutUsController)
    .name;
