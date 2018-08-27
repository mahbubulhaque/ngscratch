routing.$inject = ['$urlRouterProvider', '$resourceProvider', "$interpolateProvider"];

export default function routing($urlRouterProvider, $resourceProvider, $interpolateProvider) {
    $urlRouterProvider.otherwise('/home');

    // Resource Provider
    $resourceProvider.defaults.stripTrailingSlashes = false;

    // CSRF
    // $httpProvider.defaults.xsrfCookieName = 'csrftoken';
    // $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';

    // Date time directive ...
    // datetimePlaceholder.year = 'jjjj';
    // datetimePlaceholder.month = 'mm';
    // datetimePlaceholder.date = 'dd';

    // Interpolarate
    $interpolateProvider.startSymbol('[{');
    $interpolateProvider.endSymbol('}]');
}
