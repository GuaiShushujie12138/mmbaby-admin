/**
 * Created by mf on 2017/8/15.
 */

(function () {

    'use strict';

    packingSlipFailureCtrl.$inject = ['$scope', '$http', '$uibModal', '$uibModalInstance', '$filter', '$compile', 'toaster', 'packingSlipMgmtService', 'packingSlipId'];

    function packingSlipFailureCtrl($scope, $http, $uibModal, $uibModalInstance, $filter, $compile, toaster, packingSlipMgmtService, packingSlipId) {

        $scope.vm = {};
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        }

        $scope.ok = function () {
            $scope.vm.failureReason = "";
            $('.failureReason').each(function () {
                if ($(this).is(':checked')) {
                    if ($(this).val() == "4") {
                        $scope.vm.failureReason += $('#failureText').val();
                        $scope.vm.failureReason += '|';
                    } else {
                        $scope.vm.failureReason += $(this).parent().next('.failureText').text().trim();
                        $scope.vm.failureReason += '|';
                    }
                }
            });

            if($scope.vm.failureReason=="|"){
                toaster.pop({
                    type: 'error',
                    title: '操作提示',
                    body: "请写理由",
                    showCloseButton: true,
                    timeout: 2000
                });
                return ;
            }
            console.log($scope.vm.failureReason);
            packingSlipMgmtService.invalidSlip(packingSlipId, $scope.vm.failureReason)
                .then(function successCallback(resp) {
                    if (resp.data.code == 200) {
                        toaster.pop({
                            type: 'success',
                            title: '操作提示',
                            body: "操作成功! 码单" + packingSlipId + "失效",
                            showCloseButton: true,
                            timeout: 5000
                        });
                        $uibModalInstance.dismiss('cancel');
                    } else {
                        toaster.pop({
                            type: 'error',
                            title: '操作提示',
                            body: "操作失败!" + resp.data.message,
                            showCloseButton: true,
                            timeout: 5000
                        });
                    }
                });
        }


    }

    angular
        .module('app.packing-slip-management')
        .controller('packingSlipFailureCtrl', packingSlipFailureCtrl)


})();