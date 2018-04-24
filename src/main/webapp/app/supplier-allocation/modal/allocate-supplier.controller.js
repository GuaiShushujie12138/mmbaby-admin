

(function () {

    'use strict';

    allocateSupplierCtrl.$inject = ['$scope', '$http', '$uibModal', '$uibModalInstance', '$filter', '$compile', 'toaster','supplierId','supplierMgmtService','businessUserEmployeeNo','inquiryUsers'];

    function allocateSupplierCtrl($scope, $http, $uibModal, $uibModalInstance, $filter, $compile, toaster,supplierId,supplierMgmtService,businessUserEmployeeNo,inquiryUsers) {

        $scope.businessUserEmployeeNo= businessUserEmployeeNo;
        $scope.supplierId = supplierId;
        $scope.sellerList = inquiryUsers;

        /**
         * 分配供应商
         */
        $scope.ok = function() {
            if ($scope.supplierId) {
                $scope.okBtnDisabled = true;
                supplierMgmtService.assignUser($scope.supplierId,$scope.businessUserEmployeeNo).then(function(resp) {
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
            } else {

                $scope.okBtnDisabled = false;
                toaster.pop({
                    type: 'error',
                    title: '提示信息',
                    body: '供应商分配人不能为空',
                    timeout: 5000
                });
            }
        }

        /**
         * 关闭分配供应商弹框
         */
        $scope.cancel = function() {
            $uibModalInstance.dismiss('cancel');
        }
    }

    angular
        .module('app.supplier-mgmt')
        .controller('allocateSupplierCtrl', allocateSupplierCtrl)
})();