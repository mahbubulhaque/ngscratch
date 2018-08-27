import BaseAngularApiService from "./../../shared/jslizer-files/angular/base-angular-api-service";

class categoryService extends BaseAngularApiService {
    constructor($resource, $state, coreFactory) {
        super();
        this.resource = $resource;
        this.state = $state;
        this.apiModuleUrl = 'users/';
        this.coreFactory = coreFactory;
        this.categorySchema = {
            'name': {
                type: 'str',
                min: 4,
                max: 64
            }
        };
    }

    goToLoginComponent() {
        this.state.go('login');
    }

}

export default angular.module('services.category', [])
    .service('categoryService', categoryService)
    .name;
