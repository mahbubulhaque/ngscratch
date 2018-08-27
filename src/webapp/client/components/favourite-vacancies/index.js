import routing from "./route";
import favouriteVacancyService from "./service";
import FavouriteVacanciesController from "./controller";

var ngroute = 'ngRoute';
var uiroute = 'ui.router';
var resource = 'ngResource';

export default angular.module( 'favouriteVacancy', [ ngroute, uiroute, resource, favouriteVacancyService ] )
    .config( routing )
    .controller( 'FavouriteVacanciesController', FavouriteVacanciesController )
    .name;