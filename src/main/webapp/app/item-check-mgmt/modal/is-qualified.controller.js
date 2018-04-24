/**
 * Created by zhenyu on 2016/9/20.
 */

(function () {

    'use strict';

    isQualifiedCtrl.$inject = ['$scope', '$http', '$uibModal', '$uibModalInstance', '$filter', '$compile', 'toaster','itemCheckMgmtService','isPassedData','opener'];

    function isQualifiedCtrl($scope, $http, $uibModal, $uibModalInstance, $filter, $compile, toaster,itemCheckMgmtService,isPassedData,opener) {
        var vm = this;
        itemCheckMgmtService.getPassedInfo(isPassedData.itemId).then(function(response) {
            if (response.status == 200) {
                var responseData = response.data.data;
                if (responseData.itemAuditDTO) {
                    if (responseData.itemAuditDTO.isPassed == 0) {
                        $scope.isPassed = 0;
                    } else {
                        $scope.isPassed = 1;
                    }
                    $scope.passedReason = responseData.itemAuditDTO.passedReason || '';
                } else {
                    $scope.isPassed = 2;
                    $scope.passedReason = '';
                }
                $scope.itemId = isPassedData.itemId;
            }
        },function(){});
        // 存在传过来的数据
        // if (isPassedData) {
        //     if (isPassedData.isPassed == 0) {
        //         $scope.isPassedChecked = false;
        //         $scope.isPassed = 0;
        //     } else {
        //         $scope.isPassedChecked = true;
        //         $scope.isPassed = 1;
        //     }
        //     $scope.passedReason = isPassedData.passedReason || '';
        //     $scope.itemId = isPassedData.itemId;
        // }

        $scope.ok = function() {
            if ($scope.isPassed == '1') {
                itemCheckMgmtService.updatePassed($scope.itemId,$scope.isPassed,$scope.passedReason).then(function(response) {
                    toaster.pop({
                        type: 'success',
                        title: '提示信息',
                        body: '提交成功',
                        timeout: 5000
                    });
                    $uibModalInstance.dismiss('cancel');
                    setTimeout(function() {
                        opener.dtInstance.reloadData(null,false);
                    },1000);
                });
            } else if ($scope.isPassed == '0'){
                if ($scope.passedReason.length <= 0) {
                    toaster.pop({
                        type: 'warning',
                        title: '提示信息',
                        body: '不合格原因必填',
                        timeout: 5000
                    });
                    return;
                }
                itemCheckMgmtService.updatePassed($scope.itemId,$scope.isPassed,$scope.passedReason).then(function(response) {
                    toaster.pop({
                        type: 'success',
                        title: '提示信息',
                        body: '提交成功',
                        timeout: 5000
                    });
                    $uibModalInstance.dismiss('cancel');
                    setTimeout(function() {
                        opener.dtInstance.reloadData(null,false);
                    },1000);
                });
            } else {
                toaster.pop({
                    type: 'error',
                    title: '提示信息',
                    body: '请选择合格不合格',
                    timeout: 5000
                });
            }

        }

        $scope.cancel = function() {
            $uibModalInstance.dismiss('cancel');
        }
    }

    angular
        .module('app.item-check-mgmt')
        .controller('isQualifiedCtrl', isQualifiedCtrl)
})();