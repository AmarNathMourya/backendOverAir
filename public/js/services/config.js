'use strict';

angular.module('overair').factory('config', function Config() {
    var env = (function () {
        var url = window.document.URL;
        console.log("window url----------------", url);

        if (url.indexOf('http://127.0.0.1') === 0 || url.indexOf('http://localhost') === 0 ) {
            return 'development';
        }

        if (url.indexOf('https://overair-front.herokuapp.com') === 0) {
            return 'staging';
        }

        /*if (url.indexOf('https://example.com') === 0 || url.indexOf('https://example.com') === 0) {
            return 'production';
        }*/
    })();

    if (!env) {
        throw new Error('failed to detect application env');
    }

    return window.config[env];
});