/**
 * trade-mark-source-modal.controller
 */
(function () {

  'use strict';

  MarkShopModalCtrl.$inject =
      ['$scope', '$uibModalInstance','$uibModal','$compile','rowData',
        'tradeMgmtService', 'toaster'];

  function MarkShopModalCtrl($scope, $uibModalInstance,$uibModal, $compile,
      rowData,tradeMgmtService, toaster) {
    var vm = $scope
    $scope.modal = {};
    $scope.rowObj = rowData;
    $scope.shop={};
    $scope.shop.provinceId = 1;
    // $scope.shop.address = "";
    $scope.modal.provinceList=[];
    $scope.modal.cityList=[];
    $scope.modal.areaList=[];
    $scope.okBtnDisabled = false;


    // tradeMgmtService.getCurrentRegionUser().then(function successCallback(resp) {
    //   $scope.feedbackUsers = resp.data.data
    // });

    $scope.modal.tradeId = rowData.tradeId;
    $scope.modal.isShowShop = false;

    $scope.initShopInfo = function () {
      tradeMgmtService.initCustomerShopInfo(rowData.tradeId)
      .then(function callback(resp) {
        if (resp.data.code == 200) {
          $scope.shop = resp.data.data;
          $scope.modal.customerId = resp.data.data.customerId;
          $scope.modal.isShowShop = true;

          initArea();
        }
      });
    };
    initData();
    function initData() {
      $scope.initShopInfo();
    }
    $scope.checkCustomer = function () {
      if (!!!$scope.modal.customerId) {
        tradeMgmtService.showMessage('标记店铺','请填写客户编号');
        return;
      }
      if (!!!$scope.modal.isOpenShop) {
        tradeMgmtService.showMessage('标记店铺','请选择店铺类型');
        return;
      }
      var customerId = $scope.modal.customerId;

      tradeMgmtService.getShopInfo(customerId,$scope.modal.isOpenShop).then(function callBack(resp) {
        if (resp.data.code == 200) {
          $scope.shop = resp.data.data;
          $scope.modal.isShowShop = true;
          initArea();
          $scope.okBtnDisabled = false;
        }

      });
    };

    $scope.markShopSearch = function () {
      var rowDatas = rowData;
      var modalInstance = $uibModal.open({
        templateUrl: 'app/trade-mgmt/modal/mark_shop_search.html?v=' + LG.appConfig.clientVersion,
        keyboard: false,
        controller: 'MarkShopSearchCtrl',
        size: 'lg',
        resolve: {
          rowDatas : function () {
            return rowDatas;
          }
        }
      });
      modalInstance.result.then(function (result) {
        console.log('选择店铺结束');
        $scope.modal.isShowShop = true;
        $scope.okBtnDisabled = false;
        // initArea();
        if (!!result.provinceId) {
          $scope.shop.provinceId = result.provinceId;
        }else {
          $scope.shop.provinceId = 1;
        }
        if (!!result.cityId) {
          $scope.shop.cityId = result.cityId;
        }else {
          $scope.shop.cityId = "";
        }
        if (!!result.districtId) {
          $scope.shop.areaId = result.districtId;
        }else{
          $scope.shop.areaId = "";
        }
        initArea();
        if (!!result.shopAddress) {
          $scope.shop.address = result.shopAddress;
        }else {
          $scope.shop.address = "";
        }
        $scope.shop.contactUser = result.contactName;
        $scope.shop.mobile = result.contactMobile;
        $scope.modal.customerId = result.customerId;
        $scope.shop.shopName = result.companyName;
        // $scope.dtInstance.reloadData(function () {}, false);
      }, function (reason) {
        console.log('选择店铺结束');
      });
    };

    function initArea() {
      tradeMgmtService.getProvinceList(1).then(function callBack(prov) {
        if (prov.data.code == 200) {
          $scope.modal.provinceList = prov.data.data.list;
        }
      });
      if (!!$scope.shop.provinceId) {
        tradeMgmtService.getCityList($scope.shop.provinceId).then(function callBack(city) {
          if (city.data.code == 200) {
            $scope.modal.cityList  = city.data.data.list;
          }
        });
      }
      if (!!$scope.shop.cityId) {
        tradeMgmtService.getAreaList($scope.shop.cityId).then(function callback (area) {
          if (area.data.code == 200) {
            $scope.modal.areaList = area.data.data.list;
          }
        });
      }

    }
    $scope.getCityList = function (provinceId) {
      if (!!!provinceId) {
        return;
      }
      tradeMgmtService.getCityList(provinceId).then(function callBack(resp) {
        if (resp.data.code = 200) {
          $scope.modal.cityList =resp.data.data.list;
        }
      });
    };

    $scope.getAreaList = function (cityId) {
      if (!!!cityId) {
        return;
      }
      tradeMgmtService.getAreaList(cityId).then(function callBack(resp) {
        if (resp.data.code = 200) {
          $scope.modal.areaList =resp.data.data.list;
        }
      });
    };

    $scope.ok = function () {

      if (!!!$scope.shop.provinceId || !!!$scope.shop.cityId ||
          !!!$scope.shop.areaId) {
        tradeMgmtService.showMessage('标记店铺','省市区必须选择');
        $scope.okBtnDisabled = false;
        return;
      }
      $scope.okBtnDisabled = true;

      // initData();
      tradeMgmtService.markShop($scope.modal.tradeId,$scope.modal.customerId,
          $scope.shop.address, $scope.shop.provinceId,
          $scope.shop.cityId, $scope.shop.areaId)
      .then(function successCallback(resp) {
        toaster.pop({
          type: resp.data.code == 200 ? 'success' : 'error',
          title: '操作提示',
          body: resp.data.message,
          showCloseButton: true,
          timeout: 5000
        });
        if (resp.data.code == 200){
          $uibModalInstance.close();
        }
      }).finally(function(){
        $scope.okBtnDisabled = false;
      });
    };

    $scope.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };

  }

  angular
  .module('app.trade-mgmt')
  .controller('MarkShopModalCtrl', MarkShopModalCtrl);

})();