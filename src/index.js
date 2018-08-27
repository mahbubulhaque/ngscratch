// Load Files
function requireAll(r) {
    r.keys().forEach(r);
}
requireAll(require.context('./webapp/client/', true, /\.*/)); // Load Angular Apps
requireAll(require.context('./webapp/assets/', true, /\.*/)); // Load Assets

// Load Libraries Below
import '../node_modules/angular/angular.min.js';
import '../node_modules/angular-resource/angular-resource.min.js';
import '../node_modules/angular-cookies/angular-cookies.min.js';
import '../node_modules/angular-route/angular-route.min.js';
import '../node_modules/angular-media-queries/match-media.js';
import '../node_modules/@uirouter/angularjs/release/angular-ui-router.min.js';
import '../node_modules/lodash/lodash.min.js';
import '../node_modules/angular-multiple-select/build/multiple-select';
import '../node_modules/jslizer/dist/jslizer.js';
import '../node_modules/angular-animate/angular-animate.min.js';
import '../node_modules/angular-aria/angular-aria.min.js';
import '../node_modules/angular-messages/angular-messages.min.js';
import '../node_modules/angular-material/angular-material.min.js';
import '../node_modules/angular-translate/dist/angular-translate.js';

import '../node_modules/ng-file-upload/dist/ng-file-upload.min.js';
