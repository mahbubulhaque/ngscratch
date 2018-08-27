import BaseAngularController from '../../jslizer-files/angular/base-angular-controller'

export default class NavbarController extends BaseAngularController {

    constructor($scope, $location, screenSize, routeService, logoutService, CONST, $rootScope, $resource, coreFactory, $window, $cookies, userProfilesService) {
        super();
        this.cookiesObj = $cookies;
        this.resource = $resource;
        this.windowObj = $window;
        this.logoutService = logoutService;
        this.state = routeService;
        this.location = $location;
        this.scope = $scope;
        this.rootScope = $rootScope;
        this.coreFactory = coreFactory;
        this.userProfilesService = userProfilesService;

        this.constant = CONST;
        this.showSideNav = false;
        this.userEmail = null;
        this.userName = null;
        this.showAcString = '';
        this.selectedLan = 'en';
        this.mdDialogData = {};

        this.rootScope.$on('user-data', (event, args) => {
            this.userName = args.username;
            this.userEmail = args.email;
            this.showAcString = this.userName !== null ? this.userName : this.userEmail;
        });
        this.rootScope.$on('changeLanguage', (event, args) => {
            this.selectedLan = args.langKey;
        });


        this.profileImgLink = this.coreFactory.storageHandler.getValue('profileImgLink');
        if (!this.profileImgLink || this.profileImgLink.split("/").pop() === 'null') {
            this.profileImgLink = null;
        }
        this.getUserData();
        this.getCurrentSelectedLanguage();
    }

    getCurrentSelectedLanguage() {
        this.selectedLan = this.coreFactory.storageHandler.getValue('selectedLan');

        if( this.coreFactory.objectHelper.isNotNull(this.selectedLan))
            this.coreFactory.systemSettings.SYSTEM_LANGUAGE = this.selectedLan;

        this.rootScope.$broadcast('changeLanguage', {
            langKey: this.selectedLan
        });
    }

    updateProfileLanguageCode(currLanCode) {
        this.userProfilesService.apiModuleUrl = `users/profile/`;

        let params = {
            errorId: 'ctrl_user_profile_update_2',
            payload: {
                current_language_code: currLanCode
            },
            service: this.userProfilesService,
            parentObj: this,
            errorMessageFieldKey: 'addUserErrorMessage',
            successFieldKey: 'userUpdated',
            uuid: this.coreFactory.storageHandler.getValue('userUUID')
        };
        this.callUpdate(params, (response) => {
            if (!response.hasError) {
                this.scope.$digest();
            }
        });
    }

    getLaguageCode(langKey) {
        this.userProfilesService.apiModuleUrl = `commons/language/`;

        let params = {
            errorId: 'ctrl_user_profile_detail_1',
            parentObj: this,
            service: this.userProfilesService,
            successFieldKey: 'singleUser',
        };
        this.callListing(params, response => {
            if (!response.hasError) {
                let fObj = response.results.find((value) => {
                    return value.short_code === langKey;
                });
                if (fObj) {
                    this.updateProfileLanguageCode(fObj.short_code);
                }
            }
        });
    }

    changeLanguage(langKey) {
        this.selectedLan = langKey;
        this.getLaguageCode(langKey);
        this.coreFactory.storageHandler.setValue('selectedLan', langKey);

        if( this.coreFactory.objectHelper.isNotNull(this.selectedLan))
            this.coreFactory.systemSettings.SYSTEM_LANGUAGE = langKey;

        this.rootScope.$broadcast('changeLanguage', {
            langKey: langKey
        });
    }

    getProfileImgLink() {
        this.profileImgLink = this.coreFactory.storageHandler.getValue('profileImgLink');
        if (!this.profileImgLink || this.profileImgLink.split("/").pop() === 'null') {
            this.profileImgLink = null;
        }
        return this.profileImgLink;
    }

    isSet(tabNum) {
        return this.scope.tab === tabNum;
    }

    setTab(newTab) {
        let prevTab = this.scope.tab;
        this.state.setCurrentSelectedNavigationParentTab(newTab);
        if (newTab == 2 || newTab == 21) {
            this.scope.tab = 2;
            this.isSet(2);
        } else if (newTab == 8 || newTab == 81 || newTab == 82 || newTab == 83 || newTab == 84 || newTab == 85) {
            this.scope.tab = 8;
            this.isSet(8);
        } else if (newTab == 5 || newTab == 51 || newTab == 52 || newTab == 53) {
            this.scope.tab = 5;
            this.isSet(5);
        } else if (newTab == 4) {
            this.scope.tab = 4;
            this.isSet(4);
        }
        switch (newTab) {
            case 2:
                localStorage.setItem("selectedTab", 2);
                this.goTo('/EnergieQ-dashboard');
                break;
            case 21:
                localStorage.setItem("selectedTab", 21);
                this.goTo(this.location.path());
                break;
            case 5:
                localStorage.setItem("selectedTab", 5);
                this.goTo('/mail-dashboard');
                break;
            case 51:
                localStorage.setItem("selectedTab", 51);
                this.goTo(this.location.path());
                break;
            case 52:
                localStorage.setItem("selectedTab", 52);
                this.goTo(this.location.path());
                break;
            case 53:
                localStorage.setItem("selectedTab", 53);
                this.goTo(this.location.path());
                break;
            case 4:
                localStorage.setItem("selectedTab", 4);
                this.goTo('/ads-manager-dashboard');
                break;
            case 7:
                localStorage.setItem("selectedTab", 7);
                this.goTo('/create-mail-template');
                break;
            case 8:
                localStorage.setItem("selectedTab", 8);
                this.goTo('/crm');
                break;
            case 81:
                localStorage.setItem("selectedTab", 81);
                this.goTo(this.location.path());
                break;
            case 82:
                localStorage.setItem("selectedTab", 82);
                this.goTo(this.location.path());
                break;
            case 83:
                localStorage.setItem("selectedTab", 83);
                this.goTo(this.location.path());
                break;
            case 84:
                localStorage.setItem("selectedTab", 84);
                this.goTo(this.location.path());
                break;
            case 85:
                localStorage.setItem("selectedTab", 85);
                this.goTo(this.location.path());
                break;
            case 9:
                this.goTo('/wizard');
                break;
        }
    }

    getUserData() {
        this.userEmail = this.coreFactory.storageHandler.getValue('email');
        this.userName = this.coreFactory.storageHandler.getValue('userName');
        this.avatar = this.coreFactory.storageHandler.getValue('avatar');
        this.user_group_type = this.coreFactory.storageHandler.getValue('user_group_type');
        var selectedTab = localStorage.getItem('selectedTab') ? parseInt(localStorage.getItem('selectedTab')) : -1;
        this.setTab(selectedTab);
        if ((this.userName !== null && this.userName !== 'null') && (this.userName !== undefined && this.userName !== 'undefined')) {
            this.showAcString = this.userName;
        } else if ((this.userEmail !== null && this.userEmail !== 'null') && (this.userEmail !== undefined && this.userEmail !== 'undefined')) {
            this.showAcString = this.userEmail;
        }

    }

    goTo(url) {
        this.location.path(url);
    }

    logout() {
        this.callLogoutApi();
    }

    goNext() {
        this.scope.$emit('navbarStatus', false);
        this.state.go('login', {}, {
            reload: true
        });
    }

    callLogoutApi() {
        if (this.coreFactory.storageHandler.getValue('userToken')) {
            let params = {
                'errorId': 'ctrl_nav_bar_1',
                'payload': {},
                'service': this.logoutService,
                'parentObj': this.scope,
                'successFieldKey': 'logoutData'
            };
            this.callSave(params, (response) => {
                if (!response.hasError) {
                    this.coreFactory.storageHandler.destroyAllStorage();
                    this.goNext();
                } else {
                    this.coreFactory.storageHandler.destroyAllStorage();
                    this.goNext();
                }
            });
        } else {
            this.coreFactory.storageHandler.destroyAllStorage();
            this.goNext();
        }

    }

    showSidenav(value) {
        this.showSideNav = !value;
        this.emitSideNavbarStatus(this.showSideNav);
    }

    emitSideNavbarStatus(value) {
        this.scope.$emit('showSideNav', value);
    }

}

NavbarController.$inject = ['$scope', '$location', 'screenSize', 'routeService', 'logoutService', 'CONST', '$rootScope', '$resource', 'coreFactory', '$window', '$cookies', 'userProfilesService'];
