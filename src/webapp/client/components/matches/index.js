import routing from "./route";
import matchesService from "./service";
import MatchesController from "./controller";

var ngroute = 'ngRoute';
var uiroute = 'ui.router';
var resource = 'ngResource';

export default angular.module( 'matches', [ ngroute, uiroute, resource, matchesService ] )
    .config( routing )
    .controller( 'MatchesController', MatchesController )
    .name;