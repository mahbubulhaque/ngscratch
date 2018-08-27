 import BaseAngularController from './../../shared/jslizer-files/angular/base-angular-controller';

export default class TrainingMaterialsController extends BaseAngularController {

    constructor(trainingMaterialsService, $scope, $timeout, $http, $window, CONST, $rootScope, $stateParams, coreFactory, $mdDialog, $element, $mdToast, $state, $filter) {
        super();
        this.rootScope = $rootScope;
        this.scope = $scope;
        this.state = $state;
        this.stateParams = $stateParams;
        this.timeout = $timeout;
        this.service = trainingMaterialsService;
        this.coreFactory = coreFactory;
        this.mdDialog = $mdDialog;
        this.element = $element;
        this.mdToast = $mdToast;
        this.httpObj = $http;

        this.errorMessage = null;
        this.loader = false;
        this.filter = $filter;
        this.customFullscreen = false;
        this.isImage = false;
        this.isFile = false;
        this.hideForm = true;

        this.addTrainingErrorMessage= null;
        this.errors = {};
        this.selectedFile = '';
        this.selectedFileName = '';

        $element.find('input').on('keydown', (ev) => {
            ev.stopPropagation();
        });

        this.payloadObj = {};
        
        /*********************** re initialize array for language change :starts *******************/
        this.rootScope.$on('changeLanguage', (event, args) => {
            this.items = [
                {
                    // 'name': 'All',
                    'name': this.filter('translate')('ALL'),
                },
                {
                    // 'name': 'Training',
                    'name': this.filter('translate')('TRAINING'),
                    'value': 'training'
                }, {
                    // 'name': 'Scan',
                    'name': this.filter('translate')('SCAN'),
                    'value': 'scan'
                }
            ];
            this.selectedItem = {
                // 'name': 'All',
                'name': this.filter('translate')('ALL'),
            };
            
        });
        /*********************** re initialize array for language change :ends *******************/

        this.items = [
            {
                // 'name': 'All',
                'name': this.filter('translate')('ALL'),
            },
            {
                // 'name': 'Training',
                'name': this.filter('translate')('TRAINING'),
                'value': 'training'
            }, {
                // 'name': 'Scan',
                'name': this.filter('translate')('SCAN'),
                'value': 'scan'
            }
        ];
        this.selectedItem = {
            // 'name': 'All',
            'name': this.filter('translate')('ALL'),
        };
        this.searchFields = [
            "id",
            "external_url",
            "attached_file",
            "title"
        ];
        this.trainingList = [];
        this.searchTerm = '';

        this.registrationSuccess = '';
        this.status = '';

        this.emitNavbarStatus();
        this.emitSideNavbarStatus(true);

        this.getTrainingList();

    }

    hideLoader() {
        this.loader = false;
    }

    showLoader() {
        this.loader = true;
    }

    hide() {
        this.mdDialog.hide();
    }

    answer(answer) {
        this.mdDialog.hide(answer);
    }

    cancel (){
        this.mdDialog.cancel();
    }

    getSelectedText() {
        if (this.selectedItem !== undefined) {
            return "Filter by : " + this.selectedItem.name;
        } else {
            return "Filter by ";
        }
    }

    filterChanged() {
        this.filterQuery = {};
        if (this.coreFactory.objectHelper.isNotNull(this.selectedItem, 'value')) {
            if (this.selectedItem.value === 'training') {
                this.filterQuery.external_url__isnull = 'True';
            } else {
                this.filterQuery.external_url__isnull = 'False';
            }
        }
        this.searchTermChanged('getTrainingList');
    }

    getSelectedPage() {
        if (this.selectedPage !== undefined) {
            return this.selectedPage;
        } else {
            return this.selectedPage;
        }
    };

    getSelectedPageSize () {
        if (this.selectedPageSize !== undefined) {
            return this.selectedPageSize;
        } else {
            return this.selectedPageSize;
        }
    };


    //Delete confirmation
    showConfirm(ev, item, index){
        // Appending dialog to document.body to cover sidenav in docs app
        let confirm = this.mdDialog.confirm()
            .title(this.filter('translate')('DELETE_CONFIRMATION_HEADER_TEXT'))
            .textContent(this.filter('translate')('DELETE_CONFIRMATION_TEXT'))
            .ariaLabel('Lucky day')
            .targetEvent(ev)
            .ok(this.filter('translate')('YES_TEXT'))
            .cancel(this.filter('translate')('NO_TEXT'));

        this.mdDialog.show(confirm).then(() => {

            this.status = 'Yes.';

            this.service.apiModuleUrl = `careers/training-item/`;

            let params = {
                parentObj: this,
                service: this.service,
                uuid: item.uuid
            };

            this.callDelete(params, (response, originalResponse) => {
                if (!response.hasError) {
                    let msg = 'User has been deleted successfully!';
                    this.showSuccessMessage(msg);
                    this.trainingList.splice(index, 1);
                    this.scope.$digest();
                } else {
                    if(!!originalResponse && originalResponse.status_code === 403) {
                        // this.coreFactory.storageHandler.setValue('isAuthenticated', false);
                        this.coreFactory.storageHandler.destroyAllStorage();
                        this.state.go('login', {}, {
                            reload: true
                        });
                        // this.location.path('/login');                    
                    }
                }
            });

        }, () => {
            this.status = 'No';
        });
    }

    showSuccessMessage(msg) {
        this.mdToast.show(
            this.mdToast.simple()
            .textContent(msg)
            .action('Close')
            .highlightClass('md-success')
            .position('bottom right')
            .hideDelay(3000)
        );
    }

    getTrainingList(queryObj = null) {
        this.showLoader();
        if (this.coreFactory.objectHelper.isNull(queryObj)) {
            queryObj = this.paginationQuery;
        }
        this.service.apiModuleUrl = 'careers/training-item/';
        let params = {
            service: this.service,
            parentObj: this,
            queryObj: queryObj,
            errorId: 'ctrl_vacancy_list_1',
            successFieldKey: 'trainingList'
        };
        this.callListing(params, (response, originalResponse) => {
            if (!response.hasError) {
                this.trainingList = response.results;
                this.calculatePagination(response);
                this.hideLoader();
                this.scope.$digest();
            } else {
                if(!!originalResponse && originalResponse.status_code === 403) {
                    this.mdDialog.cancel();
                    // this.coreFactory.storageHandler.setValue('isAuthenticated', false);
                    this.coreFactory.storageHandler.destroyAllStorage();
                    this.state.go('login', {}, {
                        reload: true
                    });
                    // this.location.path('/login');
                }
            }
        });
    }


    addTrainingFile(ev) {
        this.addTrainingErrorMessage = null;
        this.errors = {};
        this.selectedFile = '';
        this.selectedFileName = '';
        this.mdDialog.show({
                locals: {
                    service: this.service,
                    parentCtrl: this,
                    moment: this.coreFactory.momentJs
                },
                controller: this.addTrainingMdDialogCtrl,
                template: require('./add_training_materials.html'),
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true,
                fullscreen: this.customFullscreen // Only for -xs, -sm breakpoints.
            })
            .then((answer) => {
            }, () => {
            });
    }

    validateVacancyPayload(form_data, parentCtlr, isUpdate, isFile){
        let hasValidationError = false;
        let payloadObj = Object.assign({}, form_data);

        if(!payloadObj.title){
            hasValidationError = true;
            parentCtlr.addTrainingErrorMessage = parentCtlr.filter('translate')('INVALID_INPUT');
            parentCtlr.errors['title'] = parentCtlr.filter('translate')('REQUIRED_FIELD_VALIDATION_TEXT');
        }else if(payloadObj.title && payloadObj.title.length > 512){

            hasValidationError = true;
            parentCtlr.addTrainingErrorMessage =  parentCtlr.filter('translate')('INVALID_INPUT');
            parentCtlr.errors['title'] = parentCtlr.filter('translate')('MAX_LIMIT')+ " : 512 chars";
        }
        else{
            parentCtlr.errors['title'] = null;
        }

        if(!payloadObj.selectedType && !isUpdate){

            hasValidationError = true;
            parentCtlr.addTrainingErrorMessage = parentCtlr.filter('translate')('INVALID_INPUT');
            parentCtlr.errors['selectedType'] = parentCtlr.filter('translate')('REQUIRED_FIELD_VALIDATION_TEXT');
        }else if(payloadObj.selectedType && payloadObj.selectedType === 'training' && !parentCtlr.selectedFile){

            hasValidationError = true;
            parentCtlr.addTrainingErrorMessage = parentCtlr.filter('translate')('INVALID_INPUT');
            parentCtlr.errors['selectedFile'] = parentCtlr.filter('translate')('REQUIRED_FIELD_VALIDATION_TEXT');
        } else if(payloadObj.selectedType && payloadObj.selectedType === 'scan' && !payloadObj.external_url){
            hasValidationError = true;
            parentCtlr.addTrainingErrorMessage = parentCtlr.filter('translate')('INVALID_INPUT');
            parentCtlr.errors['external_url'] = parentCtlr.filter('translate')('REQUIRED_FIELD_VALIDATION_TEXT');
        }else if(payloadObj.selectedType && payloadObj.selectedType === 'scan' && payloadObj.external_url){
            if(!(payloadObj.external_url.startsWith("http://") || payloadObj.external_url.startsWith("https://"))){

                hasValidationError = true;
                parentCtlr.addTrainingErrorMessage = parentCtlr.filter('translate')('INVALID_INPUT');
                parentCtlr.errors['external_url'] = parentCtlr.filter('translate')('VALID_URL_ERROR');
            }
        } else if(isUpdate && isFile && parentCtlr.selectedFileName === ''){
            hasValidationError = true;
            parentCtlr.addTrainingErrorMessage = parentCtlr.filter('translate')('INVALID_INPUT');
            parentCtlr.errors['selectedFile'] = parentCtlr.filter('translate')('REQUIRED_FIELD_VALIDATION_TEXT');
        } else if(isUpdate && !isFile && !payloadObj.external_url){
            hasValidationError = true;
            parentCtlr.addTrainingErrorMessage = parentCtlr.filter('translate')('INVALID_INPUT');
            parentCtlr.errors['external_url'] = parentCtlr.filter('translate')('REQUIRED_FIELD_VALIDATION_TEXT');
        } else if(isUpdate && !isFile && payloadObj.external_url){
            if(!(payloadObj.external_url.startsWith("http://") || payloadObj.external_url.startsWith("https://"))){
                hasValidationError = true;
                parentCtlr.addTrainingErrorMessage = parentCtlr.filter('translate')('INVALID_INPUT');
                parentCtlr.errors['external_url'] = parentCtlr.filter('translate')('VALID_URL_ERROR');
            }
        }
        return hasValidationError;
    }

    addTrainingMdDialogCtrl($scope, $http, Upload, $timeout, service, parentCtrl, moment) {
        $scope.service = service;
        $scope.parentCtrl = parentCtrl;
        $scope.moment = moment;

        $scope.isTraining = false;
        $scope.isScan = false;

        $scope.isFile = false;
        $scope.parentCtrl.selectedFile = '';
        $scope.parentCtrl.selectedFileName = '';
        /*********************** re initialize array for language change :starts *******************/
        parentCtrl.rootScope.$on('changeLanguage', (event, args) => {
            $scope.typesArray = [{
                    // name: 'training',
                    name: parentCtrl.filter('translate')('TRAINING'),
                    value: 'training',
                },
                {
                    // name: 'scan',
                    name: parentCtrl.filter('translate')('SCAN'),
                    value: 'scan',
                }
            ];
            
        });
        /*********************** re initialize array for language change :ends *******************/
        $scope.typesArray = [{
                // name: 'training',
                name: parentCtrl.filter('translate')('TRAINING'),
                value: 'training',
            },
            {
                // name: 'scan',
                name: parentCtrl.filter('translate')('SCAN'),
                value: 'scan',
            }
        ];
        $scope.selectedType = '';

        // $scope.typesArray = [
        //     {
        //         name: 'Training',
        //         value: 'training'
        //     },
        //     {
        //         name: 'Scan',
        //         value: 'scan'
        //     }
        // ];

        $scope.fileChosen = (file) =>{
            if(file[0] === undefined) {
                return;
            } else {
                $scope.isFile = true;
                $scope.parentCtrl.selectedFile = file[0];
                $scope.parentCtrl.selectedFileName = $scope.parentCtrl.selectedFile.name;
            }
        }

        $scope.addTrainingInlist = (payloadObj) => {
            $scope.parentCtrl.addTrainingErrorMessage = null;
            $scope.parentCtrl.errors = {};
            let validationError = $scope.parentCtrl.validateVacancyPayload(payloadObj, $scope.parentCtrl);
            if(validationError){
                return;
            }

            let payloadObj1 = Object.assign({}, payloadObj);

            let fd = new FormData();
            fd.append("title", payloadObj1.title);
            if(payloadObj1.external_url){
                fd.append("external_url", payloadObj1.external_url);
            }
            if ($scope.parentCtrl.selectedFile) {
                fd.append("attached_file", $scope.parentCtrl.selectedFile);
            }


            $http({
                method: "POST",
                url: $scope.parentCtrl.coreFactory.systemSettings.ROOT_API_URL + `careers/training-item/`,
                data: fd,
                headers: {
                    "Content-Type": undefined,
                    'Authorization': $scope.parentCtrl.coreFactory.systemSettings.SYSTEM_DEFAULT_AUTHORIZATION_HEADER_VALUE_PREFIX + $scope.parentCtrl.coreFactory.storageHandler.getToken()
                }
            }).then((response) => {
                $scope.parentCtrl.trainingList.push(response.data.results);
                $scope.parentCtrl.getTrainingList();
                $scope.parentCtrl.cancel();
                // this.scope.$digest();
            }, (errResponse) => {                
                if(errResponse.status === 403) {
                    // this.coreFactory.storageHandler.setValue('isAuthenticated', false);
                    $scope.parentCtrl.coreFactory.storageHandler.destroyAllStorage();
                    $scope.parentCtrl.state.go('login', {}, {
                        reload: true
                    });
                    // this.location.path('/login');                    
                } else {                
                    $scope.parentCtrl.addTrainingErrorMessage = errResponse.data['message_code'];
                    let errorObj = errResponse.data['errors'];
                    $scope.parentCtrl.errors={};
                    let len = errorObj.length;
                    for( let i = 0 ; i < len ; i++ ) {
                        if(errorObj[i].field) {
                            $scope.parentCtrl.errors[errorObj[i].field] = errorObj[i].message;
                        }
                    }
                }
            });
        }

        $scope.bindGroupType = (selectedType) => {
            if (selectedType === 'training') {
                $scope.isTraining = true;
                $scope.isScan = false;
            } else {
                $scope.isScan = true;
                $scope.isTraining = false;
            }
        }

    }

    // Training and Scan update
    updateTraining(ev, item, index) {
        this.mdDialog.show({
            locals: {
                dataToPass: item,
                service: this.service,
                thisCntrlr: this,
                index: index,
                trainingList: this.trainingList
            },
            controller: this.updateTrainingCtrlr,
            template: require('./add_training_materials.html'),
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose: true,
            fullscreen: this.customFullscreen // Only for -xs, -sm breakpoints.
        })
            .then((answer) => {
                this.status = 'You said the information was "' + answer + '".';
            }, () => {
                this.status = 'You cancelled the dialog.';
            });

    }

    updateTrainingCtrlr($scope, $http, service, thisCntrlr, index, dataToPass, trainingList) {

        $scope.isUpdate = true;
        $scope.payloadObj = Object.assign({}, dataToPass);
        $scope.service = service;
        $scope.parentCtrl = thisCntrlr;
        $scope.trainingList = trainingList;
        $scope.index = index;

        $scope.isFile = false;
        $scope.parentCtrl.selectedFile = '';
        $scope.parentCtrl.selectedFileName = '';

        if ($scope.payloadObj.attached_file_view_link && $scope.payloadObj.attached_file_view_link !== 'undefined') {
            $scope.isFile = true;
            $scope.isTraining = true;
            $scope.parentCtrl.selectedFileName = $scope.payloadObj.attached_file_view_link;
        }

        if ($scope.payloadObj.external_url && $scope.payloadObj.external_url!== 'undefined') {
            $scope.isScan = true;
        }

        $scope.fileChosen = (file) =>{
            if(file[0] === undefined) {
                return;
            } else {
                $scope.isFile = true;
                $scope.parentCtrl.selectedFile = file[0];
                $scope.parentCtrl.selectedFileName = $scope.parentCtrl.selectedFile.name;
            }
        }

        $scope.updateTrainingData = (payloadObj) => {
            $scope.parentCtrl.addTrainingErrorMessage = null;
            $scope.parentCtrl.errors = {};
            let validationError = $scope.parentCtrl.validateVacancyPayload(payloadObj, $scope.parentCtrl, $scope.isUpdate, $scope.isFile);
            if(validationError){
                return;
            }
            let payloadObj1 = Object.assign({}, payloadObj);
            let fd = new FormData();
            fd.append("title", payloadObj1.title);

            if (payloadObj1.external_url) {
                fd.append("external_url", payloadObj1.external_url);
            }

            if ($scope.parentCtrl.selectedFile) {
                fd.append("attached_file", $scope.parentCtrl.selectedFile);
            }

            $http({
                method: "PUT",
                url: $scope.parentCtrl.coreFactory.systemSettings.ROOT_API_URL + `careers/training-item/${$scope.payloadObj.uuid}/`,
                data: fd,
                headers: {
                    "Content-Type": undefined,
                    'Authorization': $scope.parentCtrl.coreFactory.systemSettings.SYSTEM_DEFAULT_AUTHORIZATION_HEADER_VALUE_PREFIX + $scope.parentCtrl.coreFactory.storageHandler.getToken()
                }
            }).then((response) => {
                $scope.parentCtrl.trainingList.push(response.data.results);
                $scope.parentCtrl.getTrainingList();
                $scope.parentCtrl.cancel();
            }, (errResponse) => {
                if(errResponse.status === 403) {
                    // this.coreFactory.storageHandler.setValue('isAuthenticated', false);
                    $scope.parentCtrl.coreFactory.storageHandler.destroyAllStorage();
                    $scope.parentCtrl.state.go('login', {}, {
                        reload: true
                    });
                    // this.location.path('/login');                    
                } else {
                    $scope.parentCtrl.addTrainingErrorMessage = errResponse.data['message_code'];
                    let errorObj = errResponse.data['errors'];
                    $scope.parentCtrl.errors={};
                    let len = errorObj.length;
                    for( let i = 0 ; i < len ; i++ ) {
                        if(errorObj[i].field) {
                            $scope.parentCtrl.errors[errorObj[i].field] = errorObj[i].message;
                        }
                    }
                }
            });
        }
    }

    canAddEditDelete(){
        this.user_group_type = this.coreFactory.storageHandler.getValue('user_group_type');
        if (this.user_group_type == 'employee_user') {
            return false;
        } else {
            return true;
        }
    }

    emitNavbarStatus() {
        this.scope.$emit('navbarStatus', true);
    }

    emitSideNavbarStatus(value) {
        this.scope.$emit('showSideNav', value);
    }
}

TrainingMaterialsController.$inject = ['trainingMaterialsService', '$scope', '$timeout', '$http', '$window', 'CONST', '$rootScope', '$stateParams', 'coreFactory', '$mdDialog', '$element', '$mdToast', '$state', '$filter'];
