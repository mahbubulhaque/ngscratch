import routing from "./route";
import companyService from "./service";
import CompanyController from "./controller";

var ngroute = 'ngRoute';
var uiroute = 'ui.router';
var resource = 'ngResource';

export default angular.module( 'company', [ ngroute, uiroute, resource, companyService ] )
    .config( routing )
    .controller( 'CompanyController', CompanyController )
    .name;