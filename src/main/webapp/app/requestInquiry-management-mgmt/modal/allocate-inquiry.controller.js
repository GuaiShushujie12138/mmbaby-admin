/**
 * Created by joey on 2017/8/15.
 */

(function () {

    'use strict';

    allocateInquiryCtrl.$inject = ['$scope', '$http', '$uibModal', '$uibModalInstance', '$filter', '$compile', 'toaster','requestInquiryMgmtService','sellerList','opener','sellerId','demandId'];

    function allocateInquiryCtrl($scope, $http, $uibModal, $uibModalInstance, $filter, $compile, toaster,requestInquiryMgmtService,sellerList,opener,sellerId,demandId) {
        var vm = this;

        $scope.sellerId = sellerId;

        $scope.sellerList = sellerList;

        $scope.ok = function() {
            if (demandId && $scope.sellerId) {
                $scope.okBtnDisabled = true;
                requestInquiryMgmtService.allocateInquiry($scope.sellerId,demandId).then(function(response) {
                    $scope.okBtnDisabled = false;
                    toaster.pop({
                        type: 'success',
                        title: '提示信息',
                        body: '提交成功',
                        timeout: 5000
                    });
                    $uibModalInstance.dismiss('cancel');
                    setTimeout(function() {
                        opener.dtInstance.reloadData();
                    },1000);
                },function(err) {
                    toaster.pop({
                        type: 'error',
                        title: '提示信息',
                        body: '操作失败',
                        timeout: 5000
                    });
                });
            } else {
                toaster.pop({
                    type: 'error',
                    title: '提示信息',
                    body: '报价业务员不能为空',
                    timeout: 5000
                });
            }
        }

        $scope.cancel = function() {
            $uibModalInstance.dismiss('cancel');
        }
    }

    angular
        .module('app.request-inquiry-management')
        .controller('allocateInquiryCtrl', allocateInquiryCtrl)
})();