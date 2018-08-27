import BaseAngularController from './../../shared/jslizer-files/angular/base-angular-controller';

export default class TrainingScanController extends BaseAngularController {

    constructor(trainingScanService, $scope, $window, CONST, $rootScope, $stateParams, coreFactory, $mdDialog, $element, $mdToast) {
        super();
        this.rootScope = $rootScope;
        this.scope = $scope;
        this.stateParams = $stateParams;
        this.service = trainingScanService;
        this.userData = {};
        this.searchTerm = '';
        this.searchFields = ["uuid", ];
        this.errorMessage = null;
        this.coreFactory = coreFactory;
        this.mdDialog = $mdDialog;
        this.element = $element;
        this.mdToast = $mdToast;
        this.status = "";
        this.customFullscreen = false;
        this.emitNavbarStatus();
        this.emitSideNavbarStatus(true);
        this.hideForm = true;
        this.registrationSuccess = "";
        this.actype = {
            name: 'Link',
        };
        this.country = {
            name: 'United States',
            code: '+1',
            selected: true,
        };
  


        this.pages = ['1', '2', '3', '4', '5', '6', '7'];


        this.selectedPage = 1;
        this.getSelectedPage = function () {
            if (this.selectedPage !== undefined) {
                return this.selectedPage;
            } else {
                return this.selectedPage;
            }
        };

        this.pagerows = ['10', '25', '50', '100'];
        this.selectedPageSize = 10;
        this.getSelectedPageSize = function () {
            if (this.selectedPageSize !== undefined) {
                return this.selectedPageSize;
            } else {
                return this.selectedPageSize;
            }
        };

        this.trainingScanlList = [{
                id: 1,
                name: 'http://training-scan.com/gdgada-adg-dg-s46546',
            },
            {
                id: 2,
                name: 'http://training-scan.com/gdgada-adg-6',
            },
            {
                id: 3,
                name: 'http://training-scan.com/gdgada-adg-6',
            },
            {
                id: 4,
                name: 'http://training-scan.com/gdgada-adg-dg-s46546',
            },
            {
                id: 7,
                name: 'http://training-scan.com/gdgada-adg-6',
            },
            {
                id: 6,
                name: 'http://training-scan.com/gdgada-adg-6',
            },
            {
                id: 7,
                name: 'http://training-scan.com/gdgada-adg-dg-s46546', 
            },
            {
                id: 8,
                name: 'http://training-scan.com/gdgada-adg-6',
            },
            {
                id: 9,
                name: 'http://training-scan.com/gdgada-adg-6',
            },
            {
                id: 10,
                name: 'http://training-scan.com/gdgada-adg-dg-s46546',
            }
        ];

        this.addTrainingInlist = () => {
            $mdDialog.cancel();
            this.showSuccessMessage();
        };

        //Delete confirmation
        this.showConfirm = (ev) => {
            // Appending dialog to document.body to cover sidenav in docs app
            var confirm = $mdDialog.confirm()
                .title('Delete Confirmation')
                .textContent('Would you like to delete this item?')
                .ariaLabel('Lucky day')
                .targetEvent(ev)
                .ok('Yes')
                .cancel('No');

            $mdDialog.show(confirm).then(() => {
                this.status = 'Yes.';
            }, () => {
                this.status = 'No';
            });
        };

 
        //Edit QA
        this.addTrainingFile = (ev) => {
            $mdDialog.show({
                    controller: TrainingScanController,
                    template: require('./add_training_scan.html'),
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

        //Multi select search

        this.items = ['Item 01', 'Item 02', 'Item 03', 'Item 04', 'Item 05', 'Item 06', 'Item 07'];

        this.clearsearchTerms = () => {
            this.searchTerm = '';
        };

        this.showSuccessMessage = () => {
            this.mdToast.show(
                this.mdToast.simple()
                .textContent('Item has added successfully!')
                .action('Close')
                .highlightClass('md-success')
                .position('bottom right')
                .hideDelay(3000)
            );
        };

    }





    emitNavbarStatus() {
        this.scope.$emit('navbarStatus', true);
    }

    emitSideNavbarStatus(value) {
        this.scope.$emit('showSideNav', value);
    }
}

TrainingScanController.$inject = ['trainingScanService', '$scope', '$window', 'CONST', '$rootScope', '$stateParams', 'coreFactory', '$mdDialog', '$element', '$mdToast'];
