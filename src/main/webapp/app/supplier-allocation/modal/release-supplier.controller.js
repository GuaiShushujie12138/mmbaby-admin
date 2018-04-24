

(function () {

    'use strict';

    releaseSupplierCtrl.$inject = ['$scope', '$http', '$uibModal', '$uibModalInstance', '$filter', '$compile', 'toaster','supplierId','supplierMgmtService'];

    function releaseSupplierCtrl($scope, $http, $uibModal, $uibModalInstance, $filter, $compile, toaster,supplierId,supplierMgmtService) {
        $scope.supplierId = supplierId;

        /**
         * 释放供应商
         */
        $scope.ok = function() {
            if ($scope.supplierId) {
                $scope.okBtnDisabled = true;
                supplierMgmtService.releaseSupplier($scope.supplierId).then(function(resp) {
                    if (resp.data.code === 200) {
                       toaster.pop({
                           type: 'success',
                           title: '提示信息',
                           body: '提交成功',
                           timeout: 5000
                       });
                        $uibModalInstance.dismiss('cancel');
                    } else {
                       toaster.pop({
                           type: 'error',
                           title: '提示信息',
                           body: '操作失败',
                           timeout: 5000
                       });
                    }
                    $scope.okBtnDisabled = false;
                },function(){
                    $scope.okBtnDisabled = false;
                });
            }
        }

        $scope.cancel = function() {
            $uibModalInstance.dismiss('cancel');
        }
    }

    angular
        .module('app.supplier-mgmt')
        .controller('releaseSupplierCtrl', releaseSupplierCtrl)
})();