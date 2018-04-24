(function () {

  'use strict';

  LimitCountCtrl.$inject = ['$scope', '$uibModalInstance', 'toaster',
    'customerLayerService', 'layerList', 'roleList', 'customerType',
    'limitConditions'];

  function LimitCountCtrl($scope, $uibModalInstance, toaster,
      customerLayerService, layerList, roleList, customerType,
      limitConditions) {

    $scope.modal = {};

    $scope.mark = 0;
    $scope.modal.data = {};
    $scope.modal.roleList = roleList;
    $scope.modal.layerList = layerList;
    $scope.modal.limitConditions = limitConditions;

    $scope.modal.limitTypeMap = {};
    $scope.modal.limitNumMap = {};
    $scope.modal.roleIdMap = {};
    $scope.modal.selectedMap = {};

    $scope.selected = []

    $scope.selectedTags = [];

    var updateSelected = function (action, id, name) {
      if (action == 'add' && $scope.selected.indexOf(id) == -1) {
        $scope.selected.push(id);
        $scope.selectedTags.push(name);
      }
      if (action == 'remove' && $scope.selected.indexOf(id) != -1) {
        var idx = $scope.selected.indexOf(id);
        $scope.selected.splice(idx, 1);
        $scope.selectedTags.splice(idx, 1);
      }
    }

    $scope.updateSelection = function ($event, id) {
      var checkbox = $event.target;
      var action = (checkbox.checked ? 'add' : 'remove');
      updateSelected(action, id, checkbox.name);
    }

    $scope.isSelected = function (id) {
      return $scope.selected.indexOf(id) >= 0;
    }

    $scope.addCondition = function (index) {

      resetCondition();
      var limitCondition = {};
      limitCondition.customerLayers = [];
      limitCondition.limitType = 0;
      limitCondition.limitNum = 0;
      limitCondition.roleId = 0;

      $scope.modal.limitConditions.push(limitCondition);
      conditionChange();
    }

    $scope.subCondition = function (index) {

      if ($scope.modal.limitConditions.length == 1) {
        return;
      }

      $scope.modal.limitConditions.splice(index, 1);
      conditionChange();
    }

    function conditionChange() {
      for (var i in $scope.modal.limitConditions) {
        var condition = $scope.modal.limitConditions[i];
        $scope.modal.limitTypeMap[i] = condition.limitType;
        $scope.modal.limitNumMap[i] = condition.limitNum;
        $scope.modal.roleIdMap[i] = condition.roleId;
      }
    }

    function resetCondition() {
      for (var i in $scope.modal.limitConditions) {

        if ($scope.modal.limitNumMap[i] <= 0 || $scope.modal.limitNumMap[i]
            > 99999) {
          toaster.pop({
            type: 'warning',
            title: '提示信息',
            body: '限额数量不合法',
            showCloseButton: true,
            timeout: 5000
          });
          return false;
        }

        $scope.modal.limitConditions[i].customerLayers = $scope.selected;
        $scope.modal.limitConditions[i].limitType = $scope.modal.limitTypeMap[i];
        $scope.modal.limitConditions[i].limitNum = $scope.modal.limitNumMap[i];
        $scope.modal.limitConditions[i].roleId = $scope.modal.roleIdMap[i];

      }
      return true;
    }

    $scope.ok = function () {

      if ($scope.modal.data.description != null
          && $scope.modal.data.description.length > 200) {
        toaster.pop({
          type: 'warning',
          title: "提示信息",
          body: "描述信息最多200字符",
          showCloseButton: true,
          timeout: 5000
        });

        return;
      }

      var isValid = resetCondition();
      if (!isValid) {
        return;
      }

      $scope.okBtnDisabled = true;

      customerLayerService.saveLimitCount(
          JSON.stringify($scope.modal.limitConditions))
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

    $scope.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    }

  }

  angular
  .module('app.customer-layer-mgmt')
  .controller('LimitCountCtrl', LimitCountCtrl);
})();