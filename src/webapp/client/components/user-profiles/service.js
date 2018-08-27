import BaseAngularApiService from "./../../shared/jslizer-files/angular/base-angular-api-service";

class userProfilesService extends BaseAngularApiService {
    constructor($resource, $state, coreFactory) {
        super();
        this.resource = $resource;
        this.state = $state;
        this.coreFactory = coreFactory;
        this.apiModuleUrl = 'users/';

        this.userCreateSchema = {
            'email': {
                type: 'str',
                min: 8,
                max: 64
            },
            'first_name': {
                type: 'str',
                min: 1,
                max: 32
            },
            'last_name': {
                type: 'str',
                min: 1,
                max: 32
            },
            'phone_number': {
                type:'int',
                max: 32,
                required: false,
                null: true
            },
            'password': {
                type: 'str',
                min:6,
                max: 32,
            }
        };

        this.userUpdateSchema = {
            'email': {
                type: 'str',
                min: 8,
                max: 64
            },
            'first_name': {
                type: 'str',
                min: 1,
                max: 32
            },
            'last_name': {
                type: 'str',
                min: 1,
                max: 32
            },
            'phone_number': {
                type:'int',
                max: 32,
                required: false,
                null: true
            }
        };
    }

    goToUserProfileDetailsComp(userObj = null) {
        this.state.go('user-profile-details', {
            'userObj': userObj
        });
    }

}

export default angular.module('services.userProfiles', [])
    .service('userProfilesService', userProfilesService)
    .name;
