import BaseAngularApiService from "../../shared/jslizer-files/angular/base-angular-api-service";

class companyService extends BaseAngularApiService {
    constructor($resource, $state, coreFactory) {
        super();
        this.resource = $resource;
        this.state = $state;
        this.apiModuleUrl = 'users/';
        this.coreFactory = coreFactory;
        this.addCompanySchema = {
            'name': {
                type: 'str',
                min: 1,
                max: 128
            },
            'contact_person': {
                type: 'str',
                required: false,
                null:true,
                max: 128
            }
        };
    }

    goToCompanyDetailsComp(companyObj = null) {
        this.state.go('company-details', {
            'companyObj': companyObj
        });
    }

}

export default angular.module('services.company', [])
    .service('companyService', companyService)
    .name;
