import translationsEN from './../shared/languages/translate-en';
import translationsNL from './../shared/languages/translate-nl';

translate.$inject = ['$translateProvider'];

export default function translate($translateProvider) {
    $translateProvider.translations('en', translationsEN);
    $translateProvider.translations('nl', translationsNL);
    $translateProvider.fallbackLanguage('nl');
    $translateProvider.preferredLanguage('nl');
    // Enable escaping of HTML
  	$translateProvider.useSanitizeValueStrategy('escape');
}
