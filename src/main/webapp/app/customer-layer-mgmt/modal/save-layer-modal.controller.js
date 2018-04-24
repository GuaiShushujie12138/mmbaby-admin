(function () {

  'use strict';

  SaveLayerCtrl.$inject = ['$scope', '$uibModalInstance', 'toaster', 'rowObject',
    'customerLayerService', 'conditionSelect', 'operatorSelect',
    'customerType'];

  function SaveLayerCtrl($scope, $uibModalInstance, toaster, rowObject,
      customerLayerService, conditionSelect, operatorSelect, customerType) {

    $scope.modal = {};

    $scope.modal.data = {};



    $scope.modal.data.id = rowObject.id;
    $scope.modal.data.matchType = rowObject.matchType + '';
    $scope.modal.data.name = rowObject.name;
    $scope.modal.data.description = rowObject.description;
    $scope.modal.data.weight = rowObject.weight;
    $scope.modal.data.customerType = customerType;
    $scope.modal.data.conditions = rowObject.conditions.slice(0,rowObject.conditions.length);

    $scope.modal.conditionSelect = conditionSelect;
    $scope.modal.operatorSelect = operatorSelect;
    $scope.modal.conditionTypeMap = {};
    $scope.modal.operatorMap = {};
    $scope.modal.daysMap = {};
    $scope.modal.targetValueMap = {};

    conditionChange();

    $scope.ok = function () {

      if (isEmpty($scope.modal.data.name) || $scope.modal.data.name.length
          > 6) {
        toaster.pop({
          type: 'warning',
          title: "提示信息",
          body: "名称最多6个字符",
          showCloseButton: true,
          timeout: 5000
        });

        return;
      }

      if (isNaN($scope.modal.data.weight)) {
        toaster.pop({
          type: 'warning',
          title: "提示信息",
          body: "权重值不合法",
          showCloseButton: true,
          timeout: 5000
        });
        return;
      }

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

      // customerLayerService.saveLayer($scope.modal.data.id,
      //     $scope.modal.data.matchType, $scope.modal.data.name,
      //     $scope.modal.data.description, $scope.modal.data.weight,
      //     $scope.modal.data.customerType, $scope.modal.data.conditions)
      // .then(function successCallback(response) {
      //   toaster.pop({
      //     type: response.data.code == 200 ? 'success' : 'error',
      //     title: "提示信息",
      //     body: response.data.message,
      //     showCloseButton: true,
      //     timeout: 5000
      //   });
      //   if (response.data.code == 200) {
      //     $uibModalInstance.close();
      //   }
      // }).finally(function () {
      //   $scope.okBtnDisabled = false;
      // });

      customerLayerService.saveLayer(JSON.stringify($scope.modal.data))
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

    $scope.addCondition = function (index) {

      if ($scope.modal.data.conditions.length == 5) {
        toaster.pop({
          type: 'warning',
          title: '提示信息',
          body: '分类条件个数最多5个！',
          showCloseButton: true,
          timeout: 5000
        });
        return;
      }

      var isValid = resetCondition();

      if (!isValid) {
        return;
      }
      var emptyCondition = {};
      emptyCondition.layerId = $scope.modal.data.id;
      emptyCondition.days = 0;
      emptyCondition.conditionType = 1 + '';
      emptyCondition.operatorType = 1 + '';
      emptyCondition.targetValue = '';

      $scope.modal.data.conditions.push(emptyCondition);
      conditionChange();
    }

    $scope.subCondition = function (index) {

      if ($scope.modal.data.conditions.length == 1) {
        return;
      }

      $scope.modal.data.conditions.splice(index, 1);
      conditionChange();
    }

    function conditionChange() {
      for (var i in $scope.modal.data.conditions) {
        var condition = $scope.modal.data.conditions[i];
        $scope.modal.conditionTypeMap[i] = condition.conditionType;
        $scope.modal.operatorMap[i] = condition.operatorType;
        $scope.modal.daysMap[i] = condition.days;
        $scope.modal.targetValueMap[i] = condition.targetValue+'';
      }
    }

    function resetCondition() {
      for (var i in $scope.modal.data.conditions) {
        var pattern = /^\d{4}-\d{1,2}-\d{1,2}\s\d{2}:\d{2}:\d{2}$/;
        var pattern2 = /^\d{4}-\d{1,2}-\d{1,2}$/;

        if ($scope.modal.conditionTypeMap[i] == 11
            || $scope.modal.conditionTypeMap[i] == 13) {
          var result = $scope.modal.targetValueMap[i].match(pattern);
          var result2 = $scope.modal.targetValueMap[i].match(pattern2);

          if (result == null && result2 == null) {
            toaster.pop({
              type: 'warning',
              title: '提示信息',
              body: '条件日期格式不正确！',
              showCloseButton: true,
              timeout: 5000
            });
            return false;
          }
        } else {
          if (isNaN($scope.modal.targetValueMap[i])
              || isEmpty($scope.modal.targetValueMap[i])
              || parseFloat($scope.modal.targetValueMap[i]) > 1000000000
              || parseFloat($scope.modal.targetValueMap[i]) < 0) {
            toaster.pop({
              type: 'warning',
              title: '提示信息',
              body: '条件值不合法！',
              showCloseButton: true,
              timeout: 5000
            });
            return false;
          }
        }

        var daysPattern=/^[0-9]{1,5}$/
        var daysResult =  ($scope.modal.daysMap[i]+'').match(daysPattern);
        if($scope.modal.daysMap[i] < 0 || $scope.modal.daysMap[i] > 10000 || daysResult == null ){
          toaster.pop({
            type: 'warning',
            title: '提示信息',
            body: '天数值不合法！',
            showCloseButton: true,
            timeout: 5000
          });
          return false;
        }
        $scope.modal.data.conditions[i].conditionType = $scope.modal.conditionTypeMap[i];
        $scope.modal.data.conditions[i].operatorType = $scope.modal.operatorMap[i];
        $scope.modal.data.conditions[i].days = $scope.modal.daysMap[i];
        $scope.modal.data.conditions[i].targetValue = $scope.modal.targetValueMap[i]+'';
        $scope.modal.data.conditions[i].layerId = $scope.modal.data.id;

      }
      return true;
    }

  }

  angular
  .module('app.customer-layer-mgmt')
  .controller('SaveLayerCtrl', SaveLayerCtrl);
})();