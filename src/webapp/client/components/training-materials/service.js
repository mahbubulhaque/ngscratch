import BaseAngularApiService from "./../../shared/jslizer-files/angular/base-angular-api-service";

class trainingMaterialsService extends BaseAngularApiService {
    constructor($resource, $state, coreFactory) {
        super();
        this.resource = $resource;
        this.state = $state;
        this.coreFactory = coreFactory;
        this.apiModuleUrl = 'users/';

        this.trainingSchema = {
        };
    }
    
}

export default angular.module('services.trainingMaterials', [])
    .service('trainingMaterialsService', trainingMaterialsService)
    .name;
