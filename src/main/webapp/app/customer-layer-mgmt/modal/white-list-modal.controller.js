(function () {

  'use strict';

  WhitelistCtrl.$inject = ['$scope', '$uibModalInstance', 'toaster',
    'customerLayerService', 'customerType', 'whiteList'];

  function WhitelistCtrl($scope, $uibModalInstance, toaster,
      customerLayerService, customerType, whiteList) {

    $scope.modal = {};

    $scope.modal.data = {};
    $scope.modal.whiteList = [];
    $scope.whiteMap = {};

    for (var i in whiteList) {
      var white = whiteList[i];
      $scope.whiteMap[i] = white.customerId;
      $scope.modal.whiteList.push(white.customerId);
    }

    $scope.add = function () {
      resetData();
      $scope.modal.whiteList.push(null);
      changeWhiteList();
    }

    $scope.delete = function (index) {
      $scope.modal.whiteList.splice(index, 1);
      changeWhiteList()
    }

    function changeWhiteList() {
      for (var i in $scope.modal.whiteList) {
        $scope.whiteMap[i] = $scope.modal.whiteList[i];
      }
    }

    function resetData() {
      for (var i in $scope.modal.whiteList) {

        $scope.modal.whiteList[i] = $scope.whiteMap[i];
      }
    }

    $scope.ok = function () {

      resetData();

      if (!isValid()) {
        return;
      }

      if (arrRepeat($scope.modal.whiteList)) {
        toaster.pop({
          type: 'warning',
          title: '提示信息',
          body: '客户id不能重复',
          showCloseButton: true,
          timeout: 5000
        });
        return;
      }

      $scope.okBtnDisabled = true;

      customerLayerService.saveWhiteList($scope.modal.whiteList, customerType)
      .then(function successCallback(response) {
        toaster.pop({
          type: response.data.code == 200 ? 'success' : 'error',
          title: "提示信息",
          body: response.data.message,
          showCloseButton: true,
          timeout: 5000
        });
        if (response.data.code == 200) {
          $uibModalInstance.close();
        }
      }).finally(function () {
        $scope.okBtnDisabled = false;
      });
    }
    function isValid() {

      for (var i in  $scope.modal.whiteList) {


        var white = $scope.modal.whiteList[i];
        if (!white) {
          toaster.pop({
            type: 'warning',
            title: '提示信息',
            body: '客户id不能为空',
            showCloseButton: true,
            timeout: 5000
          });
          return false;
        }

        var id = white+'';
        if (id.length > 10){
          toaster.pop({
            type: 'warning',
            title: '提示信息',
            body: '客户id不合法,最大长度为10',
            showCloseButton: true,
            timeout: 5000
          });
          return false;
        }
      }
      return true;

    }

    $scope.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    }
  }

  angular
  .module('app.customer-layer-mgmt')
  .controller('WhitelistCtrl', WhitelistCtrl);
})();