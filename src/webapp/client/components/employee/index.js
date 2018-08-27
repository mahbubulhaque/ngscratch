import routing from "./route";
import employeeService from "./service";
import EmployeeController from "./controller";

var ngroute = 'ngRoute';
var uiroute = 'ui.router';
var resource = 'ngResource';

export default angular.module( 'employees', [ ngroute, uiroute, resource, employeeService ] )
    .config( routing )
    .controller( 'EmployeeController', EmployeeController )
    .name;