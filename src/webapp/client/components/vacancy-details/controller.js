import BaseAngularController from '../../shared/jslizer-files/angular/base-angular-controller';

export default class VacancyDetailsController extends BaseAngularController {

    constructor(vacancyDetailsService, $scope, $window, CONST, $rootScope, $stateParams, coreFactory, $mdDialog, $element) {
        super();
        this.rootScope = $rootScope;
        this.scope = $scope;
        this.stateParams = $stateParams;
        this.service = vacancyDetailsService;
        this.coreFactory = coreFactory;
        this.mdDialog = $mdDialog;
        this.element = $element;

        this.loader = false;
        this.customFullscreen = false;
        this.hideForm = true;
        this.registrationSuccess = "";
        this.status = "";
        this.actype = {
            name: 'Link',
        };
        this.personInfoObj = {
            job_category_uuid: '',
            category_name: '',
            category_item_name: ''
        };
        this.personInfoArray = [];
        this.categoryList = [];

        this.errorMessage = null;
        this.vacancyObj = {};

        if (this.stateParams.vacancyObj !== 'vacancyObj') {
            this.vacancyObj = this.stateParams.vacancyObj;
            this.coreFactory.storageHandler.setValue('dataUUID', this.stateParams.vacancyObj.uuid);
        }
        this.emitSideNavbarStatus(true);
        this.emitNavbarStatus();

        this.getJobCategoryList();

    }

    hideLoader() {
        this.loader = false;
    }

    showLoader() {
        this.loader = true;
    }

    getJobCategoryList() {
        this.showLoader();
        this.service.apiModuleUrl = 'jobs/job-category/';
        let params = {
            service: this.service,
            parentObj: this,
            errorId: 'ctrl_category_list_1',
            successFieldKey: 'categoryList'
        };
        this.callListing(params, (response) => {
            if (!response.hasError) {
                this.categoryList = response.results;
                this.categoryItemMap = {};
                let len = this.categoryList.length;
                for(let i = 0 ; i < len ; i++) {
                    let len2 = this.categoryList[i].category_item_list.length;
                    for(let j = 0 ; j < len2 ; j++) {
                        this.categoryItemMap[this.categoryList[i].category_item_list[j].uuid] = this.categoryList[i];
                    }
                }
                this.getDetail(this.coreFactory.storageHandler.getValue('dataUUID'));
            }
        });
    }

    getDetail(uuid) {
        this.service.apiModuleUrl = `jobs/vacancy/`;

        let params = {
            errorId: 'ctrl_user_profile_detail_1',
            parentObj: this,
            successFieldKey: 'singleUser',
            uuid: uuid
        };
        this.callFetch(params, (response) => {
            if (!response.hasError) {
                this.vacancyObj = response.results;
                console.log('THIS.EMPLOYEEOBJ', this.vacancyObj)
                let len = this.vacancyObj.vacancy_category_item_list.length;
                for(let i = 0 ; i < len ;i++){
                    this.vacancyObj.vacancy_category_item_list[i].category_name=this.categoryItemMap[this.vacancyObj.vacancy_category_item_list[i].category_item.uuid].name;
                }
                this.categoryNameAndItemMaping();
            }
        });
    }

    categoryNameAndItemMaping(){
        let len = this.vacancyObj.vacancy_category_item_list.length;
        for(let i=0; i < len; i++){
            this.personInfoObj.job_category_uuid = this.vacancyObj.vacancy_category_item_list[i].category_item.job_category_uuid;
            this.personInfoObj.category_name = this.vacancyObj.vacancy_category_item_list[i].category_name;
            this.personInfoObj.category_item_name = this.vacancyObj.vacancy_category_item_list[i].category_item.name;
            let fObj = this.personInfoArray.find((value) => {
                return this.personInfoObj.job_category_uuid === value.job_category_uuid;
            });
            if (fObj) {
                fObj.category_item_name += ', ' + this.personInfoObj.category_item_name;
            } else {
                this.personInfoArray.push(this.personInfoObj);
            }
            this.personInfoObj = {};
        }
        this.hideLoader();
        this.scope.$digest();
    }

    emitNavbarStatus() {
        this.scope.$emit('navbarStatus', true);
    }

    emitSideNavbarStatus(value) {
        this.scope.$emit('showSideNav', value);
    }
}

VacancyDetailsController.$inject = ['vacancyDetailsService', '$scope', '$window', 'CONST', '$rootScope', '$stateParams', 'coreFactory', '$mdDialog', '$element'];
