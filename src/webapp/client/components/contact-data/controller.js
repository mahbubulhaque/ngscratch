import BaseAngularController from './../../shared/jslizer-files/angular/base-angular-controller';

export default class ContactDataController extends BaseAngularController {

    constructor(contactDataService, $scope, $window, CONST, $rootScope, $stateParams, coreFactory, $mdDialog, $element, $filter, $state) {
        super();
        this.rootScope = $rootScope;
        this.scope = $scope;
        this.stateParams = $stateParams;
        this.state = $state;
        this.service = contactDataService;
        this.coreFactory = coreFactory;
        this.mdDialog = $mdDialog;
        this.element = $element;
        this.loader = false;
        this.filter = $filter;

        this.customFullscreen = false;
        this.errorMessage = null;
        this.hideForm = true;
        this.status = "";
        this.registrationSuccess = "";
        this.searchTerm = '';
        this.searchFields = [
            "uuid",
            "name",
            "email",
            "phone",
            "message"
        ];

        this.getSelectedText = function() {
            if (this.selectedItem !== undefined) {
                return "Filter by : " + this.selectedItem;
            } else {
                return "Filter by ";
            }
        };

        this.getSelectedPage = function() {
            if (this.selectedPage !== undefined) {
                return this.selectedPage;
            } else {
                return this.selectedPage;
            }
        };

        this.getSelectedPageSize = function() {
            if (this.selectedPageSize !== undefined) {
                return this.selectedPageSize;
            } else {
                return this.selectedPageSize;
            }
        };

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

        this.emitSideNavbarStatus(true);
        this.emitNavbarStatus();

        this.contactDataList = [];
        this.getContactDataList();
    }


    hideLoader() {
        this.loader = false;
    }

    showLoader() {
        this.loader = true;
    }

    clearsearchTerms() {
        this.searchTerm = '';
    }


    // Category update
    showContactData(ev, dataToPass) {
        this.mdDialog.show({
            locals: {
                dataToPass: dataToPass,
                service: this.service,
                thisCntrlr: this
            },
            controller: this.showContactDataMdDialogCtrl,
            template: require('./contact_data_details_template.html'),
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

    // Category update controller
    showContactDataMdDialogCtrl($scope, $timeout, service, thisCntrlr, dataToPass) {
        $scope.isUpdate = true;
        $scope.mdDialogData = Object.assign({}, dataToPass);
        $scope.service = service;
        $scope.thisCntrlr = thisCntrlr;
    }

    getContactDataList(queryObj = null) {
        this.showLoader();
        if (this.coreFactory.objectHelper.isNull(queryObj)) {
            queryObj = this.paginationQuery;
        }
        this.service.apiModuleUrl = 'commons/contact-us/list/';
        let params = {
            service: this.service,
            parentObj: this,
            queryObj: queryObj,
            errorId: 'ctrl_contactdata_list_1',
            successFieldKey: 'contactDataList'
        };
        this.callListing(params, (response, originalResponse) => {
            if (!response.hasError) {
                this.calculatePagination(response);
                this.contactDataList = response.results;
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

    //Delete confirmation
    showConfirm(ev, contactData) {
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
            this.service.apiModuleUrl = `commons/contact-us/`;

            let params = {
                parentObj: this,
                service: this.service,
                uuid: contactData.uuid
            };

            this.callDelete(params, (response, originalResponse) => {
                if (!response.hasError) {
                    this.getContactDataList();
                    this.scope.$digest();
                    // TODO: integrate loader
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
    }

    emitNavbarStatus() {
        this.scope.$emit('navbarStatus', true);
    }

    emitSideNavbarStatus(value) {
        this.scope.$emit('showSideNav', value);
    }
}

ContactDataController.$inject = ['contactDataService', '$scope', '$window', 'CONST', '$rootScope', '$stateParams', 'coreFactory', '$mdDialog', '$element', '$filter', '$state'];
