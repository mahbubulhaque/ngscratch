import routing from "./route";
import trainingScanService from "./service";
import TrainingScanController from "./controller";

var ngroute = 'ngRoute';
var uiroute = 'ui.router';
var resource = 'ngResource';

export default angular.module( 'trainingScan', [ ngroute, uiroute, resource, trainingScanService ] )
    .config( routing )
    .controller( 'TrainingScanController', TrainingScanController )
    .name;