(function () {

    'use strict';


    function html5notification() {
        return {
            restrict: 'A',
            template: '<a class="count-info" href ng-click="notification($event)"> <i class="fa fa-bell"></i> <span class="label label-primary">7</span></a>',
            replace:true,
            controller: function ($scope, $element) {

                $scope.notification = function (event) {

                    //angular.element(event).preventDefault();
                    webkitNotifications.requestPermission();
                    //判断浏览器是否支持notification
                    if (window.webkitNotifications) {

                        //判断当前页面是否被允许发出通知
                        if (webkitNotifications.checkPermission == 0) {
                            var icon_url = 'http://www.w3.org/';
                            var title = 'Hello HTML5';
                            var body = 'I will be always here waiting for you!';
                            var WebkitNotification = webkitNotifications.createNotification(icon_url, title, body);
                            WebkitNotification.show();
                        } else {
                        }
                    } else {
                        alert("您的浏览器不支持桌面通知特性，请下载谷歌浏览器试用该功能");
                    }
                }
            }
        };
    };

    angular
        .module('app')
        .directive('html5notification', html5notification);

})();

