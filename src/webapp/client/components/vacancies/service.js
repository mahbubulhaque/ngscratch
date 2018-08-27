import BaseAngularApiService from "../../shared/jslizer-files/angular/base-angular-api-service";

class vacancyService extends BaseAngularApiService {
    constructor($resource, $state, coreFactory) {
        super();
        this.resource = $resource;
        this.state = $state;
        this.coreFactory = coreFactory;

        this.apiModuleUrl = 'jobs/';
        this.vacancyCreateSchema = {
            'company_uuid': {
                type: 'str',
                min: 1,
                max: 128
            },
            'title': {
                type: 'str',
                min: 1,
                max: 128
            },
            'end_date': {
                type: 'date'
            }
        };

    }

    goToVacancyDetailComp(vacancyObj = null) {
        this.state.go('vacancy-details', {
            'vacancyObj': vacancyObj
        });
    }

}

export default angular.module('services.vacancy', [])
    .service('vacancyService', vacancyService)
    .name;
