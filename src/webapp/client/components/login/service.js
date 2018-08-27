import BaseAngularApiService from "../../shared/jslizer-files/angular/base-angular-api-service";

class LoginService extends BaseAngularApiService {
    constructor($state, coreFactory, $location, $window) {
        super();
        this.state = $state;
        this.coreFactory = coreFactory;
        this.apiModuleUrl = 'users/';
        this.customSaveUrl = 'users/login/';
        this.saveNeedsAuthentication = false;
        this.location = $location;
        this.window = $window;
        this.loginSchema = {
            'email': {
                type: 'str',
                min: 4,
                max: 64
            },
            'password': {
                type: 'str',
                min: 6,
                max: 64
            }
        };
    }

    goToUserProfiles() {
        this.state.go('user-profiles');
    }

    goToEmployeeDashboard() {
        this.state.go('employee-dashboard');
    }

    goToForgetPassword() {
        this.state.go('forget-password');
    }

    storeJWT(uuid, token, doRemember) {
        this.coreFactory.storageHandler.saveUserUuid(uuid);
        this.coreFactory.storageHandler.saveToken(token, doRemember);
    }
}

export default angular.module('services.login', [])
    .service('loginService', LoginService)
    .name;
