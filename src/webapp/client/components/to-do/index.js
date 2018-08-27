import routing from "./route";
import toDoService from "./service";
import ToDoController from "./controller";

var ngroute = 'ngRoute';
var uiroute = 'ui.router';
var resource = 'ngResource';

export default angular.module( 'toDo', [ ngroute, uiroute, resource, toDoService ] )
    .config( routing )
    .controller( 'ToDoController', ToDoController )
    .name;