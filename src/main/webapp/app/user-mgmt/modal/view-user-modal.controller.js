/**
 * view-user-modal.controller.js
 */

(function () {

    'use strict';

    ViewUserInfoDetailCtrl.$inject = ['$scope', '$http', '$uibModal','$uibModalInstance', '$filter', '$compile', 'toaster', 'UserService', 'DTOptionsBuilder', 'DTColumnBuilder','data'];


    function ViewUserInfoDetailCtrl($scope, $http, $uibModal,$uibModalInstance, $filter, $compile, toaster, UserService, DTOptionsBuilder, DTColumnBuilder,data) {
        var vm = this;

        data['create_time'] = $filter('date')(data['create_time'], 'yyyy-MM-dd HH:mm:ss')
        data['update_time'] = $filter('date')(data['update_time'], 'yyyy-MM-dd HH:mm:ss')
        data['last_login_time'] = $filter('date')(data['last_login_time'], 'yyyy-MM-dd HH:mm:ss')
        data['last_modifypwd_time'] = $filter('date')(data['last_modifypwd_time'], 'yyyy-MM-dd HH:mm:ss')

        $scope.data=data;

        $scope.userStatusText=data.validity==1?"正常":"禁用";


        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    }


    angular
        .module('app.user-mgmt')
        .controller('ViewUserInfoDetailCtrl', ViewUserInfoDetailCtrl)

})();