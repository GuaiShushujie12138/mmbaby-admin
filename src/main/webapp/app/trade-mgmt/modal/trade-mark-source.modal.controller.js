/**
 * trade-mark-source-modal.controller
 */
(function () {

  'use strict';

  MarkSourceModalCtrl.$inject =
      ['$scope', '$uibModalInstance', '$compile', 'rowData',
        'tradeMgmtService', 'toaster', 'sellerOperatorList'];

  function MarkSourceModalCtrl($scope, $uibModalInstance, $compile,
      rowData, tradeMgmtService, toaster, sellerOperatorList) {
    var vm = $scope;
    $scope.modal = {};
    $scope.modal.markSource = 0;
    $scope.modal.oriReorderTradeId = '';
    $scope.modal.otherSource = "";
    $scope.modal.relatedDemandIds = [];
    $scope.rowObj = rowData;

    $scope.modal.sellerOperatorId = (rowData.sellerOperatorId + '') || 0;
    $scope.modal.relatedDemandIds = rowData.demandIds;
    $scope.modal.tradeId = rowData.tradeId;

    if (sellerOperatorList[0].id != 0) {
      sellerOperatorList.unshift({"id": 0, "realName": "无卖家运营"});
    }
    $scope.sellerOperatorList = sellerOperatorList;

    function initData() {

      tradeMgmtService.initTradeSource(rowData.tradeId)
      .then(function successCallback(resp) {
        var initData=resp.data.data;
        $scope.modal.markSource = initData.tradeSource.tradeSource;
        $scope.modal.canSelectSellerOperator = initData.canSelectSellerOperator;

        if(initData.tradeSource.oriReorderTradeId!=0){
          $scope.modal.oriReorderTradeId = initData.tradeSource.oriReorderTradeId;
        }
        if(isArray(initData.demandIdList)){
          $scope.modal.relatedDemandIds=initData.demandIdList.join(",");
        }

        $scope.modal.otherSource = initData.tradeSource.otherSourceRemark;

      });
    }

    initData();

    function reInitData() {

      if ($scope.modal.markSource == 1) {
        $scope.modal.otherSource = "";
        $scope.modal.oriReorderTradeId = '';
        if ($scope.demandIds.length <= 0) {
          throw new Error('关联需求编号不能为空');
        }

      } else if ($scope.modal.markSource == 2) {
        $scope.modal.otherSource = "";
        $scope.demandIds = [];
        if (isNullOrEmpty($scope.modal.oriReorderTradeId)
            || $scope.modal.oriReorderTradeId == 0) {
          throw new Error('返单订单号必填');
        }
      } else if ($scope.modal.markSource == 3) {
        $scope.modal.otherSource = "";
        $scope.modal.oriReorderTradeId = '';
        $scope.demandIds = [];
      } else if ($scope.modal.markSource == 4) {
        $scope.modal.oriReorderTradeId = '';
        $scope.demandIds = [];
        if (isNullOrEmpty($scope.modal.otherSource)) {
          throw new Error('其他来源必填');
        }
      }
    }

    $scope.ok = function () {

      if (!!!$scope.modal.markSource) {
        tradeMgmtService.showMessage('标记来源', '来源类型必须选择');

        return;
      }

      if ($scope.modal.markSource == 1) {
        if($scope.modal.relatedDemandIds==null || $scope.modal.relatedDemandIds==undefined){
          tradeMgmtService.showMessage('标记来源', '关联需求必填');
          return;
        }

        $scope.demandIds = $scope.modal.relatedDemandIds.split(/\,|\，/);
        if ($scope.demandIds.length > 3) {
          tradeMgmtService.showMessage('标记来源', '关联的需求最多是三个');

          return;
        }
      }

      try {
        reInitData();
      } catch (e) {
        tradeMgmtService.showMessage('标记来源参数错误', e.message);
        return;
      }

      $scope.okBtnDisabled = true;
      tradeMgmtService.markSource($scope.modal.markSource, $scope.modal.tradeId,
          $scope.demandIds.toString(), $scope.modal.sellerOperatorId,
          $scope.modal.otherSource, $scope.modal.oriReorderTradeId)
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
  .controller('MarkSourceModalCtrl', MarkSourceModalCtrl);

})();