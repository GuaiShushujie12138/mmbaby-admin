/**
 *
 *buyer-dispatch-modal.controller.js
 */

(function () {

  'use strict';

  DemandAreaCtrl.$inject = ['$scope','toaster', '$uibModalInstance',
    'demandMgmtService', 'purchaseAreaList', 'rowObj'];

  function DemandAreaCtrl($scope,toaster, $uibModalInstance,
      demandMgmtService, purchaseAreaList, rowObj) {

    $scope.modal = {};
    $scope.modal.initPurchaseAreaId = rowObj.purchaseAreaId
    $scope.modal.modifyAreaRemark = "";
    $scope.modal.purchaseAreaList = purchaseAreaList;
    $scope.modal.area = rowObj.purchaseAreaId; // 如果两个都选中传-34
    $scope.selection = [];

    // 初始化选中的区域
    $scope.modal.purchaseAreaList.forEach(function(item,index) {
      if (Number(item.key) === Number($scope.modal.area)) {
        $scope.selection.push(item.key);
      }
    });

    if ($scope.modal.area == '-34') {
        $scope.selection = ['3','4'];
    }

    /**
     * 在点击复选框时
     * @param index
     */
    $scope.toggleSelection = function(areaValue) {
      var idx = $scope.selection.indexOf(areaValue);
      if (idx > -1) {
        $scope.selection.splice(idx,1);
      } else {
        $scope.selection.push(areaValue);
      }
    }

    $scope.ok = function () {

      if ($scope.selection.length === 0) {
        toaster.pop({
          type: 'error',
          title: '必须选择优先采购区域',
          body: '',
          showCloseButton: true,
          timeout: 3000
        });
        return;
      }

      /**
       * 如果优先采购区域为空
       */
      if (isNullOrEmpty($scope.modal.modifyAreaRemark)) {
        toaster.pop({
          type: 'error',
          title: '必须填写更改原因',
          body: '',
          showCloseButton: true,
          timeout: 3000
        });
        return;
      }

      if(!isNullOrEmpty($scope.modal.modifyAreaRemark)
          && $scope.modal.modifyAreaRemark.length > 200){
        toaster.pop({
          type: 'warning',
          title: '提示信息',
          body: '备注信息最多200个字符！',
          showCloseButton: true,
          timeout: 3000
        });
        return;
      }

      if ( $scope.selection.length === 2) {
        $scope.selection = '-34';
      } else {
        $scope.selection = $scope.selection.toString();
      }

      demandMgmtService.modifyPurchaseArea($scope.selection,
          $scope.modal.modifyAreaRemark,rowObj.demandId)
      .then(function successCallback(response) {
        toaster.pop(
            {
              type: response.data.code == 200 ? 'success'
                  : 'error',
              title: '操作提示',
              body: response.data.message,
              showCloseButton: true,
              timeout: 5000
            });

      }).finally(function () {
        $uibModalInstance.close();
      });

    }

    $scope.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    }
  }

  angular
  .module('app.demand-mgmt')
  .controller('DemandAreaCtrl', DemandAreaCtrl);

})();