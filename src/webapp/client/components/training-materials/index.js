import routing from "./route";
import trainingMaterialsService from "./service";
import TrainingMaterialsController from "./controller";

var ngroute = 'ngRoute';
var uiroute = 'ui.router';
var resource = 'ngResource';

export default angular.module( 'trainingMaterials', [ ngroute, uiroute, resource, trainingMaterialsService ] )
    .config( routing )
    .controller( 'TrainingMaterialsController', TrainingMaterialsController )
    .name;