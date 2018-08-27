class RouteService {
    constructor($state, CONST, $location, coreFactory) {
        this.coreFactory = coreFactory;
        this.state = $state;
        this.constants = CONST;
        this.location = $location;
        this.startsWithPolyFillForIE();
        this.currentSelectedNavigationMidTab = -1;
        this.currentSelectedNavigationParentTab = -1;
        this.permittedMenuItems = [];
        this.navBarScope = null;
    }

    startsWithPolyFillForIE() {
        if (!String.prototype.startsWith) {
            String.prototype.startsWith = function(searchString, position) {
                return this.substr(position || 0, searchString.length) === searchString;
            };
        }
    }

    go(state) {
        this.state.go(state);
    }

    setCurrentSelectedNavigationMidTab(position) {
        this.currentSelectedNavigationMidTab = position;
    }

    getCurrentSelectedNavigationMidTab() {
        return this.currentSelectedNavigationMidTab;
    }

    setCurrentSelectedNavigationParentTab(position) {
        this.currentSelectedNavigationParentTab = position;
    }

    getCurrentSelectedNavigationParentTab() {
        return this.currentSelectedNavigationParentTab;
    }

    setMenuItems(menuItems) {
        this.permittedMenuItems = menuItems;
    }

    getMenuItems() {
        return this.permittedMenuItems;
    }

    setNavbarScope(navBarScope) {
        this.navBarScope = navBarScope;
    }

    isAuthenticated() {
        let authenticated = this.coreFactory.storageHandler.getValue('isAuthenticated');
        if (this.coreFactory.objectHelper.isNotNull(authenticated) && this.coreFactory.objectHelper.isNotEmpty(authenticated)) {
            authenticated = JSON.parse(authenticated);
            return authenticated;
        } else {
            return false;
        }
    }

    // restrictUrl(path) {
    //     let publicallyOpenPaths, route, i, len;
    //     route = {
    //         allow: true,
    //         desiredUrl: '/login'
    //     };
    //     publicallyOpenPaths = ['/forget-password', '/login', '/password-reset-code', '/password-reset-confirm', '/reset-password', '/register', '/employee-dashboard', '/user-profiles', '/user-profile-details', '/category', '/vacancies', '/vacancy-details', '/company', '/employee', '/employee-details', '/login-code', '/questions-answer', '/to-do', '/company-details', '/home', '/about-us', '/terms-and-condition', '/privacy-statement', '/contact-us', '/profile', '/references', '/question-and-answer', '/blog', '/blog-details', '/training-materials', '/training-scan'];
    //     len = publicallyOpenPaths.length;
    //     for (i = 0; i < len; i++) {
    //         if (path.indexOf(publicallyOpenPaths[i]) >= 0) {
    //             if (this.isAuthenticated()) {
    //                 route.allow = true;
    //                 route.desiredUrl = '/dashboard';
    //             }
    //             return route;
    //         }
    //     }
    //     if (!this.isAuthenticated()) {
    //         route.allow = false;
    //         route.desiredUrl = '/login';
    //         return route;
    //     }
    //     return route;

    // }

    restrictUrl(path, user_group_type) {
        let publicallyOpenPaths, dashboardUserOpenPaths, companyUserOpenPaths, employeeUserOpenPaths, route, tempPath;
        route = {
            allow: true,
            desiredUrl: '/home'
        };
        publicallyOpenPaths     = [
            '/forget-password', '/login', '/password-reset-code', '/password-reset-confirm', '/reset-password/',
            '/register', '/home', '/about-us', '/terms-and-condition', '/privacy-statement', '/contact-us',
            '/references', '/blog', '/blog-details', '/question-and-answer'
        ];

        dashboardUserOpenPaths  = [
            '/forget-password', '/login', '/password-reset-code', '/password-reset-confirm', '/reset-password/',
            '/register', '/home', '/employee-dashboard', '/user-profiles', '/user-profile-details', '/category',
            '/category-items', '/vacancies', '/vacancy-details', '/company', '/employee', '/employee-details',
            '/login-code', '/questions-answer', '/to-do', '/company-details', '/about-us', '/terms-and-condition',
            '/privacy-statement', '/contact-us', '/profile', '/references', '/question-and-answer', '/blog',
            '/blog-details', '/matches', '/training-materials', '/training-scan', '/job-domain', '/contact-data',
            '/category-validations'
        ];

        companyUserOpenPaths    = [
            '/forget-password', '/login', '/password-reset-code', '/password-reset-confirm', '/reset-password/',
            '/register', '/employee-dashboard', '/user-profiles', '/user-profile-details', '/vacancies',
            '/vacancy-details', '/company', '/employee', '/employee-details', '/login-code', '/company-details',
            '/home', '/about-us', '/terms-and-condition', '/privacy-statement', '/contact-us', '/profile',
            '/references', '/blog', '/blog-details', '/question-and-answer', '/matches', '/training-materials',
            '/training-scan', '/job-domain', '/contact-data', '/category-validations', '/questions-answer',
        ];

        employeeUserOpenPaths   = [
            '/forget-password', '/login', '/password-reset-code', '/password-reset-confirm', '/reset-password/',
            '/register', '/home', '/about-us', '/terms-and-condition', '/privacy-statement', '/contact-us',
            '/references', '/blog', '/blog-details', 
            '/employee-dashboard', '/question-and-answer', '/training-materials', '/profile', '/favourite-vacancies',
            '/vacancies', '/vacancy-details', '/questions-answer', '/job-domain',
        ];

        if (!this.isAuthenticated()) {
            tempPath = path.split('/');

            if (publicallyOpenPaths.indexOf(path) >= 0) {
                route.allow = true;
                route.desiredUrl = path;
            } else if(tempPath[1] == "reset-password") {
                route.allow = true;
                route.desiredUrl = path;
            } else {
                route.allow = false;
                route.desiredUrl = '/home';
            }
        } else if (this.isAuthenticated()){
            switch ( user_group_type ){
                case 'dashboard_user' :
                    if(dashboardUserOpenPaths.indexOf(path) >= 0) {
                        route.allow = true;
                        route.desiredUrl = path;
                    } else {
                        route.allow = false;
                        route.desiredUrl = 'employee-dashboard';
                    }
                    break;
                case 'company_user' :
                    if(companyUserOpenPaths.indexOf(path) >= 0) {
                        route.allow = true;
                        route.desiredUrl = path;
                    } else {
                        route.allow = false;
                        route.desiredUrl = 'employee-dashboard';
                    }
                    break;
                case 'employee_user' :
                    if(employeeUserOpenPaths.indexOf(path) >= 0) {
                        route.allow = true;
                        route.desiredUrl = path;
                    } else {
                        route.allow = false;
                        route.desiredUrl = 'employee-dashboard';
                    }
                    break;
                default :
                    if (publicallyOpenPaths.indexOf(path) >= 0) {
                        route.allow = true;
                        route.desiredUrl = path;
                    } else {
                        route.allow = false;
                        route.desiredUrl = '/home';
                    }
            }
        }
        return route;
    }

    userBasedRole(path, user_group_type) {
        let route, companyUserOpenPaths, len, i;
        route = {
            allow: true,
            desiredUrl: '/employee-dashboard',
        };
        if ( user_group_type == 'company_user') {
            companyUserOpenPaths = ['/forget-password', '/login', '/password-reset-code', '/password-reset-confirm', '/reset-password', '/register', '/employee-dashboard', '/user-profiles', '/user-profile-details', '/vacancies', '/vacancy-details', '/company', '/employee', '/employee-details', '/login-code', '/company-details', '/home', '/about-us', '/terms-and-condition', '/privacy-statement', '/contact-us', '/profile', '/references', '/blog', '/blog-details', 'matches', '/training-materials', '/training-scan'];
            len = companyUserOpenPaths.length;
            for (i = 0; i < len; i++) {
                if(path.indexOf(companyUserOpenPaths[i]) >= 0) {
                    route.allow = true;
                    route.desiredUrl = path
                    return route;
                }
            }
            route.allow = false;
            route.desiredUrl = '/employee-dashboard';
        }
        return route;
    }
}

export default angular.module('services.route', [])
    .service('routeService', RouteService)
    .name;
