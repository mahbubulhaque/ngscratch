import routing from "./route";
import employeeDetailsService from "./service";
import EmployeeDetailsController from "./controller";

var ngroute = 'ngRoute';
var uiroute = 'ui.router';
var resource = 'ngResource';

export default angular.module( 'employeeDetails', [ ngroute, uiroute, resource, employeeDetailsService ] )
    .config( routing )
    .controller( 'EmployeeDetailsController', EmployeeDetailsController )
    .name;