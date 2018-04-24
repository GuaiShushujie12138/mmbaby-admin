/**
 * Admin - 后台管理
 * 
 * 请求拦截器
 * 
 */
(function () {

    'use strict';

    config.$inject = [ '$httpProvider' ];

    function config($httpProvider) {
        $httpProvider.interceptors.push('httpInterceptor');
        $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
        $httpProvider.defaults.transformRequest.unshift(function (data, headersGetter) {
            var key, result = [];

            if (typeof data === 'string') {
                return data;
            }

            for (key in data) {
                if (data.hasOwnProperty(key)) {
                    result.push(encodeURIComponent(key) + '=' + encodeURIComponent(data[key]));
                }
            }
            return result.join('&');
        });
    }

    angular
        .module('app')
        .config(config);

})();
