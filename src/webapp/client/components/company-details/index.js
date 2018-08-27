import routing from "./route";
import companyDetailsService from "./service";
import CompanyDetailsController from "./controller";

var ngroute = 'ngRoute';
var uiroute = 'ui.router';
var resource = 'ngResource';

export default angular.module( 'companyDetails', [ ngroute, uiroute, resource, companyDetailsService ] )
    .config( routing )
    .controller( 'CompanyDetailsController', CompanyDetailsController )
    .name;