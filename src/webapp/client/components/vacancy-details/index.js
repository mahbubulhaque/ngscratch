import routing from "./route";
import vacancyDetailsService from "./service";
import VacancyDetailsController from "./controller";

var ngroute = 'ngRoute';
var uiroute = 'ui.router';
var resource = 'ngResource';

export default angular.module( 'vacancyDetails', [ ngroute, uiroute, resource, vacancyDetailsService ] )
    .config( routing )
    .controller( 'VacancyDetailsController', VacancyDetailsController )
    .name;