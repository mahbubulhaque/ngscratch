import BaseAngularApiService from "./../../shared/jslizer-files/angular/base-angular-api-service";

class categoryValidationsService extends BaseAngularApiService {
    constructor($resource, $state, coreFactory) {
        super();
        this.resource = $resource;
        this.state = $state;
        this.coreFactory = coreFactory;
        this.apiModuleUrl = 'jobs/';
        this.categoryValidationSchema = {
            'max_item':{
                type:'int',
                required: false,
                null: true
            },
            'min_item': {
                type:'int',
                required: false,
                null: true
            },
            'type':{
                type:'int',
                required: false,
                null: true
            }
        };
    }

}

export default angular.module('services.categoryValidations', [])
    .service('categoryValidationsService', categoryValidationsService)
    .name;
