import directive from "./directive";
import controller from "./controller";
import routeService from "../../services/route";

export default angular.module('directives.sidenav', [])
.directive('sideNav', directive)
.controller('SideNavController', controller)
    .name;