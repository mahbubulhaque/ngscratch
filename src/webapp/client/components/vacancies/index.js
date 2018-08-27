import routing from "./route";
import vacancyService from "./service";
import VacanciesController from "./controller";

var ngroute = 'ngRoute';
var uiroute = 'ui.router';
var resource = 'ngResource';

export default angular.module( 'vacancy', [ ngroute, uiroute, resource, vacancyService ] )
    .config( routing )
    .controller( 'VacanciesController', VacanciesController )
    .name;