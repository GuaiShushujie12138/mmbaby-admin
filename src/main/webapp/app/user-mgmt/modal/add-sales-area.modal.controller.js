(function () {

  'use strict';

  AddSalesAreaModalCtrl.$inject = ['$scope', '$uibModalInstance', 'toaster', 'UserService'];

  function AddSalesAreaModalCtrl($scope, $uibModalInstance, toaster, UserService) {
    $scope.modal = {};

    function listSalesAreaList() {
      UserService.listSalesAreaList().then(function call(resp) {
        if (resp.data.code == 200) {
          $scope.salesAreaList = resp.data.data.salesAreaList;
        }
      });
    }

    $scope.ok = function () {
      if (!!!$scope.modal.salesAreaName) {
        UserService.showErrorMessage("请填写正确的地区名称");
        return;
      }
      UserService.addLscrmSalesArea($scope.modal.salesAreaName).then(function successCallback(response) {
        toaster.pop({
          type: response.data.code == 200 ? 'success' : 'error',
          title: "提示信息",
          body: response.data.message,
          showCloseButton: true,
          timeout: 5000
        });
        if(response.data.code == 200) {
          $uibModalInstance.close();
        }
      }).finally(function () {

        $scope.okBtnDisabled = false;
      });

    }

    $scope.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    }

  }

  angular
  .module('app.user-mgmt')
  .controller('AddSalesAreaModalCtrl', AddSalesAreaModalCtrl);
})();