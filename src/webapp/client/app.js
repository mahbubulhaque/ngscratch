'use strict';
// NPM packages
let uirouter = 'ui.router';
let ngroute = 'ngRoute';
let resource = 'ngResource';
let cookie = 'ngCookies';
let matchmedia = 'matchMedia';
let multipleSelect = 'multipleSelect';
let ngMaterial = 'ngMaterial';
let ngTranslate = 'pascalprecht.translate';
let ngMessages = 'ngMessages';
import jslizer from 'jslizer';
let coreFactory = jslizer.angularCoreFactory();
// angular project related settings
import routing from './settings/app.config';
import translate from './settings/app.translate';
import running from './settings/app.run';
import constants from './settings/app.const';
import startFrom from './shared/filters/start-from/index';
import MainController from './shared/controllers/main-controller';
// Services
import routeService from './shared/services/route';
// Directives
import loader from './shared/directives/loader';
import navbar from './shared/directives/navbar';
import sidenav from './shared/directives/side-nav';
// Components
import login from "./components/login";
import logoutService from './components/logout/logout-service';
import forgetPassword from "./components/forget-password";
import passwordReset from "./components/password-reset-confirm";
import register from "./components/registration";
import passwordResetCode from "./components/password-reset-code";
import ResetPasswordController from "./components/reset-password";
import EmployeeDashboardController from "./components/employee-dashboard";
import UserProfilesController from "./components/user-profiles";
import UserProfileDetailsController from "./components/user-profile-details";
import CategoryController from "./components/category";
import VacanciesController from "./components/vacancies";
import FavouriteVacanciesController from "./components/favourite-vacancies";
import VacancyDetailsController from "./components/vacancy-details";
import CompanyController from "./components/company";
import EmployeeController from "./components/employee";
import EmployeeDetailsController from "./components/employee-details";
import LoginCodeController from "./components/login-code";
import QuestionsAnswerController from "./components/questions-answer";
import ToDoController from './components/to-do';
import MatchesController from './components/matches';
import CategoryItemsController from './components/category-items';
import CompanyDetailsController from './components/company-details';
import HomeController from './components/home';
import AboutUsController from './components/about-us';
import TermsAndConditionController from './components/terms-and-condition';
import PrivacyStatementController from './components/privacy-statement';
import ContactUsController from './components/contact-us';
import ProfileController from './components/profile';
import ReferenceController from './components/references';
import QuestionAnswerWebController from './components/question-answer-web';
import BlogController from './components/blog';
import BlogDetailsController from './components/blog-details';
import TrainingMaterialsController from './components/training-materials';
import TrainingScanController from './components/training-scan';
import JobdomainController from './components/job-domain';
import ContactDataController from './components/contact-data';
import CategoryValidationsController from './components/category-validations';

var ngFileUpload = 'ngFileUpload';


angular
    .module('EnergieQApp', [
        uirouter,
        ngFileUpload, // Libraries
        ngroute,
        resource,
        cookie,
        matchmedia,
        multipleSelect,
        ngMaterial,
        ngTranslate,
        ngMessages,
        coreFactory,
        login, // Components
        forgetPassword,
        passwordReset,
        register,
        passwordResetCode,
        ResetPasswordController,
        EmployeeDashboardController,
        UserProfilesController,
        UserProfileDetailsController,
        CategoryController,
        VacanciesController,
        FavouriteVacanciesController,
        VacancyDetailsController,
        CompanyController,
        EmployeeController,
        EmployeeDetailsController,
        LoginCodeController,
        QuestionsAnswerController,
        ToDoController,
        MatchesController,
        CategoryItemsController,
        CompanyDetailsController,
        HomeController,
        AboutUsController,
        TermsAndConditionController,
        PrivacyStatementController,
        ContactUsController,
        ProfileController,
        ReferenceController,
        QuestionAnswerWebController,
        BlogController,
        BlogDetailsController,
        TrainingMaterialsController,
        TrainingScanController,
        routeService, // Services
        logoutService,
        loader, // Directives
        navbar,
        sidenav,
        JobdomainController,
        ContactDataController,
        CategoryValidationsController,
    ])
    .config(routing)
    // .config(['$translateProvider',translate])
    .config(translate)
    .controller('mainController', MainController)
    .constant(constants)
    .run(running)
    .filter('startFrom', startFrom);
