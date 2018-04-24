/**
 * add-dept.modal.controller.js
 */

(function () {

    'use strict';

    AddDeptModalCtrl.$inject = ['$scope', '$http', '$uibModal','$uibModalInstance', '$filter', '$compile', 'toaster', 'UserService', 'DTOptionsBuilder', 'DTColumnBuilder','data'];


    function AddDeptModalCtrl($scope, $http, $uibModal,$uibModalInstance, $filter, $compile, toaster, UserService, DTOptionsBuilder, DTColumnBuilder,data) {
        var vm = this;

        $scope.data=data;

        $scope.parentId=data.id;
        $scope.parentDeptName=data.deptName;
        $scope.title=data.id==0?'大区':'部门';

        $scope.ok = function() {
            $scope.okBtnDisabled = true;
            UserService.saveDept($scope,$scope.parentId,$scope.deptName)
                .then(function successCallback(response) {
                    toaster.pop({
                        type: response.data.code == 200 ? 'success' : 'error',
                        title: '提示信息',
                        body: response.data.message,
                        showCloseButton: true,
                        timeout: 5000
                    });
                    $uibModalInstance.close();
                })
                .finally(function() {
                    $scope.okBtnDisabled = false;
                });
        };


        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    }


    angular
        .module('app.user-mgmt')
        .controller('AddDeptModalCtrl', AddDeptModalCtrl)

})();