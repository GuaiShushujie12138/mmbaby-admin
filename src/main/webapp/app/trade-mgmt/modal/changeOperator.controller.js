/**
 * trade-mark-source-modal.controller
 */
(function () {

    'use strict';

    changeOperatorModalCtrl.$inject =
        ['$scope', '$uibModalInstance', '$compile', 'rowData',
            'tradeMgmtService', 'toaster', 'sellerOperatorList'];

    function changeOperatorModalCtrl($scope, $uibModalInstance, $compile,
                                 rowData, tradeMgmtService, toaster, sellerOperatorList) {
        var vm = $scope;
        $scope.modal = {};
        $scope.rowObj = rowData;
        $scope.modal.sellerOperatorId = (rowData.sellerOperatorId + '');
        $scope.modal.tradeId = rowData.tradeId;

        if (sellerOperatorList[0].id != 0) {
            sellerOperatorList.unshift({"id": 0, "realName": "无卖家运营"});
        }
        $scope.sellerOperatorList = sellerOperatorList;

        $scope.ok = function () {
            if (!$scope.modal.sellerOperatorId) {
                toaster.pop({
                    type: 'error',
                    title: '操作提示',
                    body: '卖家运营不能为空',
                    showCloseButton: true,
                    timeout: 5000
                });
                return;
            }
            $scope.okBtnDisabled = true;
            tradeMgmtService.changeSellerOperator($scope.modal.tradeId, $scope.modal.sellerOperatorId)
                .then(function successCallback(resp) {
                    toaster.pop({
                        type: resp.data.code == 200 ? 'success' : 'error',
                        title: '操作提示',
                        body: resp.data.message,
                        showCloseButton: true,
                        timeout: 5000
                    });
                    if (resp.data.code == 200) {
                        $uibModalInstance.close();
                    }
                }).finally(function () {
                $scope.okBtnDisabled = false;
            });
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };

    }

    angular
        .module('app.trade-mgmt')
        .controller('changeOperatorModalCtrl', changeOperatorModalCtrl);

})();