import routing from "./route";
import employeeDashboardService from "./service";
import EmployeeDashboardController from "./controller";

var ngroute = 'ngRoute';
var uiroute = 'ui.router';
var resource = 'ngResource';

export default angular.module( 'employeeDashboard', [ ngroute, uiroute, resource, employeeDashboardService ] )
    .config( routing )
    .controller( 'EmployeeDashboardController', EmployeeDashboardController )
    .name;