/**
 * old-site-link.directive
 */
(function() {

    'use strict';
    
    function oldSiteLink() {
        return {
            restrict: 'E',
            template: '<button class="btn btn-outline btn-info btn-lg m-t-md pull-right" type="button" ng-click="goToOldUrl()"><i class="fa fa-home fa-lg"></i> 返回旧版</button>',
            controller: function ($rootScope, $scope, $window) {
                $scope.goToOldUrl = function () {
                    $window.location.href = $rootScope.isProductEnv ? 'http://admin.lianshang.cn' : 'http://web.lianshang.com:8080';
                };
            }
        };
    }

    angular
        .module('app')
        .directive('oldSiteLink', oldSiteLink);

})();