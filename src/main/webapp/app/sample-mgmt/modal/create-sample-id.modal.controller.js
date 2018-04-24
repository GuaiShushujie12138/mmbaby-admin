/**
 * sample-print-qr-modal.controller
 */
(function () {

  'use strict';

  CreateSampleIdModalCtrl.$inject =
      ['$scope','$uibModalInstance','$uibModal','sampleMgmtService','sellerUserList'];

  CreateSampleIdModalCtrlForRoute.$inject =
      ['$scope','$uibModal', 'sampleMgmtService','$stateParams'];
  function CreateSampleIdModalCtrl($scope, $uibModalInstance,$uibModal,sampleMgmtService,sellerUserList) {
    innerCreateSampleIdModalCtrl($scope, $uibModalInstance,$uibModal,sampleMgmtService,sellerUserList,null);
  }

  function CreateSampleIdModalCtrlForRoute($scope,$uibModal,sampleMgmtService,$stateParams) {
    var itemId = null;
    if($stateParams){
      itemId = $stateParams.itemId;
    }
    innerCreateSampleIdModalCtrl($scope, null,$uibModal,sampleMgmtService,null,itemId)
  }
  function innerCreateSampleIdModalCtrl($scope, $uibModalInstance,$uibModal,sampleMgmtService,sellerUserList,itemId) {
    var vm = $scope;

    vm.shop={};
    vm.sample = {};
    vm.sample.create = {};
    vm.item = {};
    vm.sample.create.sampleSource = 1;
    vm.operatorList = sellerUserList;
    vm.isRoute =true;
    if(!itemId){
      vm.isRoute = false;
    }else {
      $scope.item.itemId = itemId;
    }

    initData();
    function initData() {
      initGetOperatorList();
      initItem();
    }

    function initGetOperatorList() {
      if(!vm.operatorList){
        sampleMgmtService.getAuthUsers()
        .then(function (resp) {
          vm.operatorList = resp.data.data;
        });
      }

    }

    function initItem() {
      if(vm.isRoute){
        sampleMgmtService.getItemName($scope.item.itemId)
        .then(function (resp) {
          vm.item = resp.data;
        });
      }
    }


    $scope.selectItems = function () {
      var modalInstance = $uibModal.open({
        templateUrl: 'app/sample-mgmt/modal/search_item.html?v=' + LG.appConfig.clientVersion,
        keyboard: false,
        controller: 'SelectItemSearchCtrl',
        size: 'lg',
        resolve: {
          shopId : function () {
            return vm.shop.shopId;
          }
        }
      });

      modalInstance.result.then(function (result) {
        var companyName = result.realShopCompanyName || '无';
        vm.item.itemName = result.name + '(真实卖家：' + companyName + ')';
        vm.item.itemId = result.itemId;
        vm.item.showItem = true;
        console.log('选择商品');

      }, function (reason) {
        console.log('选择店铺结束');
      });
    };



    $scope.confirm = function () {
      if (vm.sample.create.sendType == 3) {
        if (!!!vm.sample.create.belongOperatorId) {
          sampleMgmtService.showErrorMessage("当前持有人必须选择");
          return;
        }
      }else {
        vm.sample.create.belongOperatorId=0;
      }

      if (!!!vm.item.itemId) {
        sampleMgmtService.showErrorMessage("商品选择");
        return;
      }
      if (!!!vm.sample.create.sellerOperator) {
        sampleMgmtService.showErrorMessage("选择卖家运营");
        return;
      }
      if (!!!vm.sample.create.count) {
        sampleMgmtService.showErrorMessage("请填写生成样卡个数");
        return;
      }

      var seller = vm.sample.create.sellerOperator;
      var sellerId = seller.id;
      var  regionId = seller.regionId;
      sampleMgmtService.createSampleIds('',vm.item.itemId, // 这边去除店铺id
     sellerId,regionId,vm.sample.create.count,
          vm.sample.create.belongOperatorId).then(function call(resp) {
        if (resp.data.code == 200) {
          var sampleIds = resp.data.data.sampleIds;
          var modalInstance = $uibModal.open({
            templateUrl: 'app/sample-mgmt/modal/print-batch-qr-code.html?v=' + LG.appConfig.clientVersion,
            keyboard: false,
            controller: 'PrintBatchQrCodeModalCtrl',
            resolve: {
              selectedSampleIds : function () {
                return sampleIds;
              },
              sendType : function () {
                return vm.sample.create.sendType;
              }
            }
          });
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
  .controller('CreateSampleIdModalCtrl', CreateSampleIdModalCtrl);
  angular
  .module('app.sample-mgmt')
  .controller('CreateSampleIdModalCtrlForRoute', CreateSampleIdModalCtrlForRoute);

})();