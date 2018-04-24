/**
 * Created by joey on 2017/8/15.
 *
 * 查看询价单
 */

(function () {

    'use strict';

    feedbackInquiryCtrl.$inject = ['$scope', '$http', '$uibModal', '$uibModalInstance', '$filter', '$compile', 'toaster','requestInquiryMgmtService','sellerList','opener','sellerId','demandId'];

    function feedbackInquiryCtrl($scope, $http, $uibModal, $uibModalInstance, $filter, $compile, toaster,requestInquiryMgmtService,sellerList,opener,sellerId,demandId) {
        var vm = this;

        $scope.sellerId = sellerId;

        $scope.sellerList = sellerList;

        $scope.ok = function() {
            if (demandId && $scope.sellerId) {
                requestInquiryMgmtService.allocateInquiry($scope.sellerId,demandId).then(function(response) {
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
        .controller('feedbackInquiryCtrl', feedbackInquiryCtrl)
})();