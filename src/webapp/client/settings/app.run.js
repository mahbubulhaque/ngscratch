import PROJECT_MESSAGES from './../shared/jslizer-files/project-messages';
import PROJECT_SYSTEM_SETTINGS from './../shared/jslizer-files/system-settings';

running.$inject = ['$rootScope', '$location', '$state', 'routeService', 'coreFactory', '$window'];

export default function running($rootScope, $location, $state, routeService, coreFactory, $window) {
    coreFactory.errorMessage.loadProjectMessages(PROJECT_MESSAGES);
    coreFactory.systemSettings.loadProjectLocalSettings(coreFactory.systemSettings, PROJECT_SYSTEM_SETTINGS);
    $rootScope.$on('$locationChangeStart', (event) => {
        let path, user_group_type, route, userBasedRoute;

        path = $location.path();
        user_group_type = coreFactory.storageHandler.getValue('user_group_type');
        route = routeService.restrictUrl(path, user_group_type);

        if (!route.allow) {
            $location.path(route.desiredUrl);
        }
        // doesn't need this userbasedroute 'cause this is done withing restricturl
        // userBasedRoute = routeService.userBasedRole(path, user_group_type);
        // if (!userBasedRoute.allow) {
        //     // $state.go(userBasedRoute.desiredUrl);
        //     // $window.location.assign(userBasedRoute.desiredUrl);
        //     $location.path(userBasedRoute.desiredUrl);
        //     // $rootScope.$digest();
        // }
    });
}
