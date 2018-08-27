import BaseAngularController from '../../shared/jslizer-files/angular/base-angular-controller';

export default class LoginController extends BaseAngularController {

    constructor(loginService, $scope, CONST, $rootScope, $window, $state, coreFactory, $timeout) {
        super();
        this.coreFactory = coreFactory;
        this.state = $state;
        this.service = loginService;
        this.rootScope = $rootScope;
        this.scope = $scope;
        this.windowObj = $window;
        this.timeout = $timeout;

        this.constant = CONST;
        this.userCredentials = {
            'social_token': null,
            'login_type': 1
        };
        this.doRemember = false;
        this.errorMessage = null;
        this.loggedIn = false;
        this.profileImgLink = '';
        this.selectedLan = 'en';

        this.emitNavbarStatus();
        this.emitSideNavbarStatus(false);
    }

    login() {
        let params = {
            errorId: 'ctrl_login_1',
            payload: {
                email: this.userCredentials.email,
                password: this.userCredentials.password
            },
            parentObj: this,
            schema: this.service.loginSchema,
            successFieldKey: 'loginUser'
        };

        this.callSave(params, (response) => {
            if (!response.hasError) {
                let data = response.results;
                this.doRemember = true;
                this.service.storeJWT(data.uuid, data.token, this.doRemember);
                this.coreFactory.storageHandler.setValue('isAuthenticated', true);
                this.coreFactory.storageHandler.setValue('userName', data.first_name);
                this.coreFactory.storageHandler.setValue('email', data.email);
                this.coreFactory.storageHandler.setValue('avatar', data.avatar);
                this.coreFactory.storageHandler.setValue('user_group_type', data.user_group_type);
                this.broadcastUserAndEmail({username: data.first_name, email: data.email});

                this.getUserProfileData(data.uuid);
                this.getCurrentLanguage(data.uuid);
            }
        });
    }
    getCurrentLanguage(loggedInUserUuid){
        this.service.apiModuleUrl = `users/profile/`;

        let params = {
            errorId: 'ctrl_user_profile_detail_1',
            parentObj: this.scope,
            service: this.service,
            uuid: loggedInUserUuid,
            successFieldKey: 'singleUser'
        };
        this.callFetch(params, (response) => {
            if (!response.hasError) {
                if (response.results.current_language) {
                    this.selectedLan = response.results.current_language.short_code;
                } else {
                    this.selectedLan = 'en';
                }
                this.rootScope.$broadcast('changeLanguage', {
                    langKey: this.selectedLan
                });
                this.coreFactory.storageHandler.setValue('selectedLan', this.selectedLan);
            }
        });
    }
    getUserProfileData(uuid) {
        this.service.apiModuleUrl = `users/profile/`;

        let params = {
            errorId: 'ctrl_user_profile_detail_1',
            parentObj: this.scope,
            successFieldKey: 'singleUser',
            uuid: uuid
        };
        this.callFetch(params, (response) => {
            if (!response.hasError) {
                this.profileImgLink = this.coreFactory.systemSettings.ROOT_API_URL + response.results.profile_image_view_link;
                this.coreFactory.storageHandler.setValue('profileImgLink', this.profileImgLink);

                this.scope.$emit('navbarStatus', true);
                this.emitSideNavbarStatus(true);
                // if ( response.results.user_group_type == 'employee_user') {
                //     this.service.goToEmployeeDashboard();
                // } else {
                //     this.service.goToUserProfiles();
                // }
                this.service.goToEmployeeDashboard();
            }
        });
    }

    enterKeyCallback($event){
        var keyCode = $event.which || $event.keyCode;
        if (keyCode === 13) {
            // Do that thing you finally wanted to do
            this.login();
        }

    }

    broadcastUserAndEmail(data){
        this.rootScope.$emit('user-data', data);
    }

    emitNavbarStatus() {
        this.scope.$emit('navbarStatus', false);
    }

    emitSideNavbarStatus(value) {
        this.scope.$emit('showSideNav', value);
    }
    goToForgetPassword() {
        // this.service.goToEmployeeDashboard();
        this.service.goToForgetPassword();
    }
}

LoginController.$inject = ['loginService', '$scope', 'CONST', '$rootScope', '$window', '$state', 'coreFactory', '$timeout'];
