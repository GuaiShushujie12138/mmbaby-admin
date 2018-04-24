/**
 * sample-print-qr-modal.controller
 */
(function () {

  'use strict';

  closeClothRecordCtrl.$inject =
      ['$scope', '$uibModalInstance','clothCheckService', 'toaster', 'lsTradeId'];

  function closeClothRecordCtrl($scope, $uibModalInstance, clothCheckService, toaster,lsTradeId) {

    $scope.reason = "";
    $scope.close = function () {
      if(!$scope.reason || $scope.reason.length == 0){
        toaster.pop({
          type: 'info',
          title: '提示信息',
          body: "请输入取消原因",
          showCloseButton: true,
          timeout: 3000
        });
        return false;
      }
      clothCheckService.closeClothRecord(lsTradeId,$scope.reason).then(function (res) {
        if(res.data.code == 200){
          toaster.pop({
            type: 'success',
            title: '提示信息',
            body: res.data.message,
            showCloseButton: true,
            timeout: 3000
          });
          $uibModalInstance.close();
        }
      })
    };

    $scope.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };
  }

  angular
  .module('app.cloth-check')
  .controller('closeClothRecordCtrl', closeClothRecordCtrl);

})();