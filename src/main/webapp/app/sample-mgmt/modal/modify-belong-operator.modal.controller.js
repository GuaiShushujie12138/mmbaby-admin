/**
 * sample-print-qr-modal.controller
 */
(function () {

  'use strict';

  ModifyBelongOperatorModalCtrl.$inject =
      ['$scope', '$uibModalInstance','$uibModal','$compile',
        'sampleMgmtService', 'toaster','sampleId'];

  function ModifyBelongOperatorModalCtrl($scope, $uibModalInstance,$uibModal,
      $compile,sampleMgmtService, toaster,sampleId) {
    var vm = $scope;

    $scope.modal = {};
    $scope.operatorList = [];

    initData();
    function initData() {
      initGetOperatorList();
    }

    function initGetOperatorList() {
      sampleMgmtService.listBelongOperator().then(function call(resp) {
        if (resp.data.code == 200) {
          $scope.operatorList = resp.data.data.operatorList;
        }
      });
    }
    
    $scope.modify = function () {
      if (!!!$scope.modal.operatorType) {
        sampleMgmtService.showErrorMessage("请选择操作方式");
        return;
      }

      if ($scope.modal.operatorType == 2) {
          $scope.modal.belongOperatorId = 0;
      } else if ($scope.modal.operatorType == 1) {
        if (!!!$scope.modal.belongOperatorId) {
          sampleMgmtService.showErrorMessage("当前持有人必须选择");
          return;
        }
      }
      sampleMgmtService.modifyBelongOperator($scope.modal.belongOperatorId,
      $scope.modal.operatorType,sampleId).then(function call(resp) {
        if (resp.data.code == 200) {
          $uibModalInstance.close();
        }
      });
    };


    $scope.ok = function () {
      $scope.okBtnDisabled = true;
    };

    $scope.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };

  }

  angular
  .module('app.sample-mgmt')
  .controller('ModifyBelongOperatorModalCtrl', ModifyBelongOperatorModalCtrl);

})();