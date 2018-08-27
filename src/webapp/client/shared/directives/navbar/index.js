import directive from "./directive";
import controller from "./controller";
import routeService from "../../services/route";
import userProfilesService from "../../../components/user-profiles/service";

var matchmedia = 'matchMedia';

export default angular.module('directives.navbar', [matchmedia, routeService, userProfilesService])
.directive('navbar', directive)
.controller('NavbarController', controller)
    .name;
