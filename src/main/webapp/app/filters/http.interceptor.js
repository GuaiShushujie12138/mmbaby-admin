angular
    .module('app')
    .factory('httpInterceptor', ['$q', '$rootScope', '$window', 'toaster', 
             function($q, $rootScope, $window, toaster) {
        return {
            // optional method
            'request': function(config) {
                if ($rootScope.user && $rootScope.user.usertoken != '') {
                    config.headers['token'] = $rootScope.user.usertoken;
                }
                $q.requestConfig = config;
                return config || $q.when(config);
            },

            // optional method
            'requestError': function(rejection) {
                return $q.reject(rejection);
            },

            // optional method
            'response': function(response) {
                if (response.data && response.data.code && response.data.code != 200) {
                    console.log(response.data);
                    toaster.pop({
                        type: 'error',
                        title: '出错啦',
                        body: response.data.message,
                        showCloseButton: true,
                        timeout: 5000
                    });
                    return $q.reject(response);
                }
                return response || $q.when(response);
            },

            // optional method
            'responseError': function(rejection) {
                if (rejection.status == 599) {

                    toaster.pop({
                        type: 'error',
                        title: '无权限',
                        body: '对不起，登录状态失效或无权限，您需要重新登录！',
                        showCloseButton: true,
                        timeout: 5000
                    });

                    setTimeout(function(){
                        $window.location.href = LG.appConfig.loginUrl;
                        return $q.reject(rejection);
                    },5500);

                }else if(rejection.status == 598){
                    toaster.pop({
                        type: 'error',
                        title: '无权限',
                        body: '对不起，无权限或读取权限异常,请稍后重试!',
                        showCloseButton: true,
                        timeout: 5000
                    });
                }
                else {
                    BJ_REPORT.report('ajaxError' + rejection.status + ':' + JSON.stringify($q.requestConfig));
                    toaster.pop({
                        type: 'error',
                        title: '出错啦',
                        body: rejection.statusText,
                        showCloseButton: true,
                        timeout: 5000
                    });

                }
                return $q.reject(rejection);
            }
        }
    }]);
