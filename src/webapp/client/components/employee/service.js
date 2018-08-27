import BaseAngularApiService from "./../../shared/jslizer-files/angular/base-angular-api-service";

class employeeService extends BaseAngularApiService {
    constructor($resource, $state, coreFactory) {
        super();
        this.resource = $resource;
        this.state = $state;
        this.coreFactory = coreFactory;

        this.apiModuleUrl = 'users/';

        //separated for employee add and update
        this.employeeAddSchema = {
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
            //While creating new employee backend shows error for password required. That's why made it required while
            //creating
            'password': {
                type: 'str',
                min: 6,
                max: 32
            },
            'city': {
                type: 'str',
                max: 128,
                required: false,
                null: true,
                empty: true
            },
            'phone_number': {
                type: 'int',
                max: 32,
                required: false,
                null: true
            },
            'post_code': {
                type: 'str',
                max: 8,
                required: false,
                null: true,
                empty: true
            },
            'country': {
                type: 'str',
                max: 32,
                required: false,
                null: true,
                empty: true
            },
            'address': {
                type: 'str',
                max: 256,
            },
            'address2': {
                type: 'str',
                max: 256,
                required: false,
                null: true,
                empty:true
            },
            'house_number': {
                type: 'str',
                max: 16,
                required: false,
                null: true
            },
            'house_number_ext': {
                type: 'str',
                max: 16,
                required: false,
                null: true,
                empty: true
            },
            'login_code_type': {
                type: 'str',
            },
            'company_uuid': {
                type: 'str',
                min: 6,
                max:64
            }
        };

        this.employeeUpdateSchema = {
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
            'city': {
                type: 'str',
                max: 128,
                required: false,
                null: true,
                empty: true
            },
            'phone_number': {
                type: 'int',
                max: 32,
                required: false,
                null: true
            },
            'post_code': {
                type: 'str',
                max: 8,
                required: false,
                null: true,
                empty: true
            },
            'country': {
                type: 'str',
                max: 32,
                required: false,
                null: true,
                empty: true
            },
            'address': {
                type: 'str',
                max: 256
            },
            'address2': {
                type: 'str',
                max: 256,
                required: false,
                null: true,
                empty: true
            },
            'house_number': {
                type: 'str',
                max: 16,
                required: false,
                null: true
            },
            'house_number_ext': {
                type: 'str',
                max: 16,
                required: false,
                null: true,
                empty: true
            }
        };

    }

    goToEmployeeDetailsComp(employeeObj = null) {
        this.state.go('employee-details', {
            'employeeObj': employeeObj
        });
    }

}

export default angular.module('services.employees', [])
    .service('employeeService', employeeService)
    .name;
