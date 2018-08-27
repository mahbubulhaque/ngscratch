import directive from "./directive";

export default angular.module('directives.loader', [])
.directive('customLoader', directive)
    .name;