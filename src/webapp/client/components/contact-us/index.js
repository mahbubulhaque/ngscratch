import routing from "./routes";
import contactUsService from "../contact-us/service";
import ContactUsController from "./controller";

var ngroute = 'ngRoute';
var uiroute = 'ui.router';
var resource = 'ngResource';

export default angular.module('contactus', [ngroute, uiroute, resource, contactUsService])
    .config(routing)
    .controller('ContactUsController', ContactUsController)
    .name;
