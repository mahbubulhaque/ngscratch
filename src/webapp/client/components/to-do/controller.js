import BaseAngularController from './../../shared/jslizer-files/angular/base-angular-controller';

export default class ToDoController extends BaseAngularController {

    constructor(toDoService, $scope, $window, CONST, $rootScope, $stateParams, coreFactory, $mdDialog, $element, $mdToast) {
        super();
        this.rootScope = $rootScope;
        this.scope = $scope;
        this.stateParams = $stateParams;
        this.service = toDoService;
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
        this.loader = false;
        this.registrationSuccess = "";
        this.actype = {
            name: 'Link',
        };
        this.country = {
            name: 'United States',
            code: '+1',
            selected: true,
        };


        this.filteritems = ['All', 'To-Do', 'Completed', 'Inprogress'];
        this.selectedItem = 'All';

        this.getSelectedText = function () {
            if (this.selectedItem !== undefined) {
                return "Filter by : " + this.selectedItem;
            } else {
                return "Filter by ";
            }
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

        this.todoList = [
            {
                id: 1,
                name: 'Example to-do item',
                issue_date: "01/05/2018",
                title_status: true,
            },
            {
                id: 2,
                name: 'Example item',
                issue_date: "11/05/2018",
                title_status: false,
            },
            {
                id: 3,
                name: 'Example item',
                issue_date: "12/05/2018",
                title_status: true,
            },
            {
                id: 4,
                name: 'Example to-do item',
                issue_date: "01/05/2018",
                title_status: true,
            },
            {
                id: 7,
                name: 'Example item',
                issue_date: "11/05/2018",
                title_status: false,
            },
            {
                id: 6,
                name: 'Example item',
                issue_date: "12/05/2018",
                title_status: true,
            },
            {
                id: 7,
                name: 'Example to-do item',
                issue_date: "01/05/2018",
                title_status: false,
            },
            {
                id: 8,
                name: 'Example item',
                issue_date: "11/05/2018",
                title_status: false,
            },
            {
                id: 9,
                name: 'Example item',
                issue_date: "12/05/2018",
                title_status: true,
            },
            {
                id: 10,
                name: 'Example to-do item',
                issue_date: "01/05/2018",
                title_status: true,
            }
        ];

        this.addTodoInlist = () => {
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


        //View QA
        this.quickView = (ev) => {
            $mdDialog.show({
                    controller: ToDoController,
                    template: require('./to_do_quick_view_template.html'),
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

        //Edit QA
        this.addTodo = (ev) => {
            $mdDialog.show({
                    controller: ToDoController,
                    template: require('./add_to_do_template.html'),
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

    hideLoader() {
        this.loader = false;
    }

    showLoader() {
        this.loader = true;
    }

    emitNavbarStatus() {
        this.scope.$emit('navbarStatus', true);
    }

    emitSideNavbarStatus(value) {
        this.scope.$emit('showSideNav', value);
    }
}

ToDoController.$inject = ['toDoService', '$scope', '$window', 'CONST', '$rootScope', '$stateParams', 'coreFactory', '$mdDialog', '$element', '$mdToast'];
