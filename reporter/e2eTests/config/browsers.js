'use strict';
exports.model = function(browserName) {

    var enabledBrowsers = [
        {'browserName': 'chrome'},
        {'browserName': 'firefox'}
    ];

    if (browserName) {
        switch (browserName.toLowerCase()) {
            case 'ff':
                enabledBrowsers = [{'browserName': 'firefox'}];
                break;
            case 'ch':
                enabledBrowsers = [{'browserName': 'chrome'}];
                break;
            case 'ie':
                enabledBrowsers = [{'browserName': 'internet explorer'}];
                break;
            default :
                enabledBrowsers = [{'browserName': 'chrome'}];
                break;
        }
    }

    return enabledBrowsers;

};