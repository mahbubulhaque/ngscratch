import BaseAngularController from './../../shared/jslizer-files/angular/base-angular-controller';

export default class CompanyDetailsController extends BaseAngularController {

    constructor(companyDetailsService, $scope, $window, CONST, $rootScope, $stateParams, coreFactory, $mdDialog, $element) {
        super();
        this.rootScope = $rootScope;
        this.scope = $scope;
        this.stateParams = $stateParams;
        this.service = companyDetailsService;
        this.coreFactory = coreFactory;
        this.mdDialog = $mdDialog;
        this.element = $element;
        this.loader = false;

        this.companyObj = {};
        if (this.stateParams.companyObj !== 'companyObj') {
            this.coreFactory.storageHandler.setValue('dataUUID', this.stateParams.companyObj.uuid);
        }

        this.emitNavbarStatus();
        this.emitSideNavbarStatus(true);

        this.getDetail(this.coreFactory.storageHandler.getValue('dataUUID'));

    }

    hideLoader() {
        this.loader = false;
    }

    showLoader() {
        this.loader = true;
    }

    getDetail(uuid){
        this.showLoader();
        this.service.apiModuleUrl = `users/company/`;

        let params = {
            errorId: 'ctrl_user_company_detail_1',
            parentObj: this.scope,
            successFieldKey: 'singleCompany',
            uuid: uuid
        };
        this.callFetch(params, (response) => {
            if (!response.hasError) {
                this.companyObj = response.results;
                this.hideLoader();
                this.scope.$digest();
            }
        });
    }

    emitNavbarStatus() {
        this.scope.$emit('navbarStatus', true);
    }

    emitSideNavbarStatus(value) {
        this.scope.$emit('showSideNav', value);
    }
}

CompanyDetailsController.$inject = ['companyDetailsService', '$scope', '$window', 'CONST', '$rootScope', '$stateParams', 'coreFactory', '$mdDialog', '$element'];
