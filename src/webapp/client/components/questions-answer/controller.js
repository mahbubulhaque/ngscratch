import BaseAngularController from './../../shared/jslizer-files/angular/base-angular-controller';

export default class QuestionsAnswerController extends BaseAngularController {

    constructor(questionAnswerService, $scope, $window, CONST, $rootScope, $stateParams, coreFactory, $mdDialog, $element, $filter, $state) {
        super();
        this.rootScope = $rootScope;
        this.scope = $scope;
        this.stateParams = $stateParams;
        this.state = $state;
        this.service = questionAnswerService;
        this.userData = {};
        this.errorMessage = null;
        this.coreFactory = coreFactory;
        this.mdDialog = $mdDialog;
        this.element = $element;
        this.status = "";
        this.customFullscreen = false;
        this.emitNavbarStatus();
        this.emitSideNavbarStatus(true);
        this.hideForm = true;
        this.loader = false;
        this.filter = $filter;
        this.registrationSuccess = "";
        this.searchFields = [
            "uuid",
            "question",
            "answer",
            "description",
            "asked_by_uuid",
            "answered_by_uuid"
        ];
        this.actype = {
            name: 'Link',
        };
        this.country = {
            name: 'United States',
            code: '+1',
            selected: true,
        };


        // this.filteritems = ['All', 'Question', 'Talent', 'Personal', 'Preferences', 'Intelligence', 'Level', 'Region'];
        // this.selectedItem = 'All';

        // this.getSelectedText = function() {
        //     if (this.selectedItem !== undefined) {
        //         return "Filter by : " + this.selectedItem;
        //      } else {
        //         return "Filter by ";
        //     }
        // };

        // added on github for testing
        this.pages = ['1', '2', '3', '4', '5', '6', '7'];

        this.selectedPage = 1;
        this.getSelectedPage = function() {
            if (this.selectedPage !== undefined) {
                return this.selectedPage;
            } else {
                return this.selectedPage;
            }
        };

        this.pagerows = ['10', '25', '50', '100'];
        this.selectedPageSize = 10;
        this.getSelectedPageSize = function() {
            if (this.selectedPageSize !== undefined) {
                return this.selectedPageSize;
            } else {
                return this.selectedPageSize;
            }
        };

        this.questionAnswers = [
            {
                id: 1,
                asked_by: 'Example name',
                answered_by: 'Example name here',
                question: "Question example here?",
                answer: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Ex rem obcaecati doloremque",
                faqStatus: true,
            }
        ];

        //Delete confirmation
        this.showConfirm = (ev, qaObj, index) => {
            // Appending dialog to document.body to cover sidenav in docs app
            var confirm = $mdDialog.confirm()
                .title(this.filter('translate')('DELETE_CONFIRMATION_HEADER_TEXT'))
                .textContent(this.filter('translate')('DELETE_CONFIRMATION_TEXT'))
                .ariaLabel('Lucky day')
                .targetEvent(ev)
                .ok(this.filter('translate')('YES_TEXT'))
                .cancel(this.filter('translate')('NO_TEXT'));

            $mdDialog.show(confirm).then(() => {
                this.status = 'Yes.';
                this.service.apiModuleUrl = `commons/question-answer/`;

                let params = {
                    parentObj: this,
                    service: this.service,
                    uuid: qaObj.uuid
                };

                this.callDelete(params, (response, originalResponse) => {
                    if (!response.hasError) {
                        this.questionAnswers.splice(index, 1);
                        this.scope.$digest();
                        // this.timeout(() => {
                        //   this.isDeleted = false;
                        // }, 2000);
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
        };


        //View QA
        this.quickView = (ev, dataToPass, index) => {
            $mdDialog.show({
                locals      : {
                    dataToPass  :   dataToPass,
                    service     :   this.service,
                    thisCntrlr  :   this,
                    index       :   index,
                },
                // controller  : QuestionsAnswerController,
                controller  : this.mdQuickDialogCtrl,
                template    : require('./quick_view_template.html'),
                parent      : angular.element(document.body),
                targetEvent : ev,
                clickOutsideToClose: true,
                fullscreen  : this.customFullscreen // Only for -xs, -sm breakpoints.
            })
                .then((answer) => {
                    this.status = 'You said the information was "' + answer + '".';
                }, () => {
                    this.status = 'You cancelled the dialog.';
                });
        };

        // view QA controller
        this.mdQuickDialogCtrl = function($scope, service, thisCntrlr, index, dataToPass) {
            $scope.isUpdate = true;
            $scope.mdQuickDialogData = Object.assign({}, dataToPass);
            $scope.service = service;
            $scope.thisCntrlr = thisCntrlr;
            $scope.index = index;
        }

        // Add QA
        this.addQa= (ev) => {
            $mdDialog.show({
                locals      : {
                    // dataToPass  :   dataToPass,
                    service     :   this.service,
                    thisCntrlr  :   this,
                    // index       :   index,
                },
                // controller: QuestionsAnswerController,
                controller  : this.addMdDialogCtrl,
                template    : require('./edit_qa_template.html'),
                parent      : angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true,
                fullscreen: this.customFullscreen // Only for -xs, -sm breakpoints.
            })
                .then((answer) => {
                    this.status = 'You said the information was "' + answer + '".';
                }, () => {
                    this.status = 'You cancelled the dialog.';
                });
        };

        // Add QA controller
        this.addMdDialogCtrl = function($scope, service, thisCntrlr) {
            // $scope.isUpdate = true;
            $scope.mdDialogData = {};
            $scope.service = service;
            $scope.thisCntrlr = thisCntrlr;
            $scope.addQuestionErrorMessage = null;
            // $scope.index = index;

            $scope.addQa = (mdDialogData) => {
                $scope.service.apiModuleUrl = `commons/question-answer/`;
                if(!!mdDialogData.asked_by) {
                    mdDialogData.asked_by_uuid = mdDialogData.asked_by.uuid;
                } else {
                    mdDialogData.asked_by_uuid = thisCntrlr.useruuid;
                }
                if(!!mdDialogData.answer) {
                    if(!!mdDialogData.answered_by) {
                        // answered by uuid will be the current users uuid
                        // there has to be a easy and standard way to access current user from all module
                        mdDialogData.answered_by_uuid = mdDialogData.answered_by.uuid;
                    } else {
                        mdDialogData.answered_by_uuid = thisCntrlr.useruuid;
                    }
                }
                let params = {
                    errorId: 'ctrl_question_answer_add_1',
                    payload: mdDialogData,
                    service: $scope.service,
                    schema: $scope.service.qaUpdateSchema,
                    parentObj: $scope,
                    errorMessageFieldKey: 'addQuestionErrorMessage',
                    successFieldKey: 'qaAdded',
                    // uuid: mdDialogData.uuid
                };
                $scope.thisCntrlr.callSave(params, (response, originalResponse) => {
                    if (!response.hasError) {
                        $scope.thisCntrlr.cancel();
                        $scope.thisCntrlr.getQuestionAnswerList();
                        // $scope.thisCntrlr.cancel();
                        // $scope.thisCntrlr.questionAnswers.splice($scope.index, 1);
                        // $scope.thisCntrlr.questionAnswers.splice($scope.index, 0, response.results);
                    } else {
                        if(!!originalResponse && originalResponse.status_code === 403) {
                            // this.coreFactory.storageHandler.setValue('isAuthenticated', false);
                            $scope.thisCntrlr.coreFactory.storageHandler.destroyAllStorage();
                            $scope.thisCntrlr.state.go('login', {}, {
                                reload: true
                            });
                            // this.location.path('/login');                    
                        }
                    }
                    // else {
                    //     $scope.errorMessage = 'Invalid input';
                    //     $scope.errors = response.errors;
                    // }
                });
            }
        }

        //Edit QA
        this.editQa= (ev, dataToPass, index) => {
            $mdDialog.show({
                locals      : {
                    dataToPass  :   dataToPass,
                    service     :   this.service,
                    thisCntrlr  :   this,
                    index       :   index,
                },
                // controller: QuestionsAnswerController,
                controller  : this.mdDialogCtrl,
                template    : require('./edit_qa_template.html'),
                parent      : angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true,
                fullscreen: this.customFullscreen // Only for -xs, -sm breakpoints.
            })
                .then((answer) => {
                    this.status = 'You said the information was "' + answer + '".';
                }, () => {
                    this.status = 'You cancelled the dialog.';
                });
        };

        // Edit QA controller
        this.mdDialogCtrl = function($scope, service, thisCntrlr, index, dataToPass) {
            $scope.isUpdate = true;
            $scope.mdDialogData = Object.assign({}, dataToPass);
            $scope.service = service;
            $scope.thisCntrlr = thisCntrlr;
            $scope.index = index;
            $scope.addQuestionErrorMessage = null;

            $scope.updateQa = (mdDialogData) => {
                $scope.service.apiModuleUrl = `commons/question-answer/`;
                if(!!mdDialogData.asked_by) {
                    mdDialogData.asked_by_uuid = mdDialogData.asked_by.uuid;
                }
                if(!!mdDialogData.answered_by) {
                    // answered by uuid will be the current users uuid
                    // there has to be a easy and standard way to access current user from all module
                    mdDialogData.answered_by_uuid = mdDialogData.answered_by.uuid;
                } else {
                    mdDialogData.answered_by_uuid = thisCntrlr.useruuid;
                }
                let params = {
                    errorId: 'ctrl_question_answer_update_2',
                    payload: mdDialogData,
                    service: $scope.service,
                    schema: $scope.service.qaUpdateSchema,
                    parentObj: $scope,
                    errorMessageFieldKey: 'addQuestionErrorMessage',
                    successFieldKey: 'qaUpdated',
                    uuid: mdDialogData.uuid
                };
                $scope.thisCntrlr.callUpdate(params, (response, originalResponse) => {
                    if (!response.hasError) {
                        $scope.thisCntrlr.cancel();
                        $scope.thisCntrlr.getQuestionAnswerList();
                        // $scope.thisCntrlr.questionAnswers.splice($scope.index, 1);
                        // $scope.thisCntrlr.questionAnswers.splice($scope.index, 0, response.results);
                    } else {
                        if(!!originalResponse && originalResponse.status_code === 403) {
                            // this.coreFactory.storageHandler.setValue('isAuthenticated', false);
                            $scope.thisCntrlr.coreFactory.storageHandler.destroyAllStorage();
                            $scope.thisCntrlr.state.go('login', {}, {
                                reload: true
                            });
                            // this.location.path('/login');                    
                        }
                    }
                    // else {
                    //     $scope.errorMessage = 'Invalid input';
                    //     $scope.errors = response.errors;
                    // }
                });
            }
        }

        this.hide = () => {
            $mdDialog.hide();
        };

        this.cancel = () => {
            $mdDialog.cancel();
        };

        this.answer = (answer) => {
            $mdDialog.hide(answer);
        };

        $element.find('input').on('keydown', (ev) => {
            ev.stopPropagation();
        });

        //Multi select search

        this.items = ['Item 01' ,'Item 02' ,'Item 03' ,'Item 04' ,'Item 05', 'Item 06', 'Item 07'];

        this.clearsearchTerms = () => {
            this.searchTerm = '';
        }; 

        this.getUserData();
        this.questionAnswers = [];
        this.getQuestionAnswerList()
    }

    hideLoader() {
        this.loader = false;
    }

    showLoader() {
        this.loader = true;
    }

    getQuestionAnswerList(queryObj = null) {
        this.showLoader();
        if (this.coreFactory.objectHelper.isNull(queryObj)) {
            queryObj = this.paginationQuery;
        }
        this.service.apiModuleUrl = 'commons/question-answer/';
        let params = {
            service: this.service,
            parentObj: this,
            queryObj: queryObj,
            errorId: 'ctrl_user_question_answer_list_1',
            successFieldKey: 'questionAnswerList'
        };
        this.callListing(params, (response, originalResponse) => {

            if (!response.hasError) {
                this.calculatePagination(response);
                this.questionAnswers = response.results;
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



    emitNavbarStatus() {
        this.scope.$emit('navbarStatus', true);
    }

    emitSideNavbarStatus(value) {
        this.scope.$emit('showSideNav', value);
    }

    canAddEditDelete(){
        this.user_group_type = this.coreFactory.storageHandler.getValue('user_group_type');
        if (this.user_group_type == 'employee_user') {
            return false;
        } else {
            return true;
        }
    }

    getUserData() {
        this.userEmail = this.coreFactory.storageHandler.getValue('email');
        this.userName = this.coreFactory.storageHandler.getValue('userName');
        this.useruuid = this.coreFactory.storageHandler.getValue('userUUID');
        this.avatar = this.coreFactory.storageHandler.getValue('avatar');
        this.user_group_type = this.coreFactory.storageHandler.getValue('user_group_type');
        // var selectedTab = localStorage.getItem('selectedTab') ? parseInt(localStorage.getItem('selectedTab')) : -1;
        // this.setTab(selectedTab);
        // if ((this.userName !== null && this.userName !== 'null') && (this.userName !== undefined && this.userName !== 'undefined')) {
        //     this.showAcString = this.userName;
        // } else if ((this.userEmail !== null && this.userEmail !== 'null') && (this.userEmail !== undefined && this.userEmail !== 'undefined')) {
        //     this.showAcString = this.userEmail;
        // }
    }
}

QuestionsAnswerController.$inject = ['questionAnswerService', '$scope', '$window', 'CONST', '$rootScope', '$stateParams', 'coreFactory', '$mdDialog', '$element', '$filter', '$state'];

