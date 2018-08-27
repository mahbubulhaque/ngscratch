import BaseAngularApiService from "./../../shared/jslizer-files/angular/base-angular-api-service";

class categoryItemsService extends BaseAngularApiService {
    constructor($resource, $state, coreFactory) {
        super();
        this.resource = $resource;
        this.state = $state;
        this.coreFactory = coreFactory;
        this.apiModuleUrl = 'jobs/';
        this.categoryItemSchema = {
            'name': {
                type: 'str',
                min: 4,
                max: 64
            }
        };
    }

}

export default angular.module('services.categoryItems', [])
    .service('categoryItemsService', categoryItemsService)
    .name;
