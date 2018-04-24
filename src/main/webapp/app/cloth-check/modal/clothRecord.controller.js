/**
 * sample-print-qr-modal.controller
 */
(function () {

  'use strict';

  clothRecordCtrl.$inject =
      ['$scope', '$uibModalInstance','$uibModal','clothCheckService', 'toaster','$filter', 'lsTradeId', 'clothType'];

  function clothRecordCtrl($scope, $uibModalInstance,$uibModal, clothCheckService, toaster,$filter,lsTradeId, clothType) {
    var vm = $scope;
    vm.modal = {};
    vm.clothType = clothType;
    vm.logisticsCompanyId = null;
    $scope.okBtnDisabled = false;
    $scope.psRollInfosCheckAll = 0;

    //获取数据
    clothCheckService.declareInit(lsTradeId).then(init);
    //初始化数据
    function init(resp) {
      vm.modal = resp.data.data;

      vm.logisticsCompanyId = resp.data.data.oriLogistics.logisticsCompanyId;
      vm.logisticsCompanyName = resp.data.data.oriLogistics.logisticsCompanyName;

      var newDate = new Date().getTime();
      vm.modal.order.estimatedDeliveryTime = vm.modal.order.estimatedDeliveryTime || newDate;
      vm.modal.order.pullInTime = vm.modal.order.pullInTime || newDate;
      vm.modal.order.requireCompletionTime = vm.modal.order.requireCompletionTime || newDate;
      vm.modal.order.clothStoreId = vm.modal.order.clothStoreId || vm.modal.defaultStoreId;
      // if(vm.modal.order.canDirectDelivery == null){
      //   vm.modal.order.canDirectDelivery = true;
      // }
      vm.modal.order.defaultMarketId = vm.modal.order.defaultMarketId || vm.modal.defaultMarketId;
      vm.psInfo = vm.modal.psInfo;

      vm.modal.requireCompletionTypeList = [
        {
          type: 1,
          name: '当日发货'
        },
        {
          type: 2,
          name: '次日发货'
        },
      ];

      var len = vm.modal.detail.itemList.length;
      for(var i = 0; i < len; i++){
          var item = vm.modal.detail.itemList[i];
        item.refundStatiste = 1;
        var psRollInfos = item.detailList || [];
        var psRollInfosLen = psRollInfos.length;
        for(var n = 0; n < psRollInfosLen; n++){
          psRollInfos[n].check = 0;
          psRollInfos[n].detailRollList = arrToNewArr(psRollInfos[n].detailRollList);
        }
        item.psRollInfos = psRollInfos;
        item.psRollInfosCheckAll = 0;
        $scope.calCheckNub(item);
        $scope.changeRefundStatiste(item,true);
      }

      function arrToNewArr(oldArr) {
        var nub = 5;
        var len = oldArr.length;
        var Arr = [];
        var ArrLen = Math.ceil(len/nub);
        for(var i = 0; i < ArrLen; i++){
          var ARR2 = [];
          for(var j = 0; j < nub; j++){
            if(nub*i + j < len){
              var item = oldArr[nub*i + j];
              item.check = item.deliveryType == 30?1:item.deliveryType == 0?0:null;
              ARR2.push(item);
            }else {
              ARR2.push({});
            }
          }
          Arr.push(ARR2);
        }
        return Arr;
      }

      initCityPicker();

      if (vm.modal.psInfo.fullDose == true) {
          vm.modal.psInfo.weightShortString = "足米"
      } else {
          if (vm.modal.psInfo.paperTube == null) {
              vm.modal.psInfo.weightShortString = vm.modal.psInfo.weightShortFall + "%";
          } else {
              vm.modal.psInfo.weightShortString = vm.modal.psInfo.paperTube + " + " + vm.modal.psInfo.weightShortFall;
          }
      }

    }

    $scope.checkAllFunc = function (item) {
      for(var i = 0, len = item.psRollInfos.length; i < len; i++){
          item.psRollInfos[i].check = item.psRollInfosCheckAll;
        for(var j = 0, listLen = item.psRollInfos[i].detailRollList.length; j < listLen; j++){
          for(var z = 0; z < 5; z++){
            var rollInfo = item.psRollInfos[i].detailRollList[j][z];
            if(rollInfo.check === 0 || rollInfo.check === 1) {
              rollInfo.check = item.psRollInfosCheckAll;
            }
          }
        }
      }
      this.calCheckNub(item);
    };

    $scope.checkRow = function (checkRow,item) {
      for(var j = 0, listLen = checkRow.detailRollList.length; j < listLen; j++){
        for(var z = 0; z < 5; z++){
          var rollInfo = checkRow.detailRollList[j][z];
          if(rollInfo.check === 0 || rollInfo.check === 1) {
            rollInfo.check = checkRow.check;
          }
        }
      }
      this.calCheckNub(item);
    };

    $scope.changeCheck = function (item) {
        this.calCheckNub(item);
    };

    $scope.calCheckNub = function (item) {
        var nub = 0;
        for(var i = 0, len = item.psRollInfos.length; i < len; i++){
            for(var j = 0, listLen = item.psRollInfos[i].detailRollList.length; j < listLen; j++){
                for(var z = 0; z < 5; z++){
                    var rollInfo = item.psRollInfos[i].detailRollList[j][z];
                    if(rollInfo.check === 1) {
                        nub++;
                    }
                }
            }
        }
        item.expectRollQuantity = nub;
        return nub;
    };

    $scope.calCheckPsRollsId = function (psRollInfos) {
        var arr = [];
        for(var i = 0, len = psRollInfos.length; i < len; i++){
            for(var j = 0, listLen = psRollInfos[i].detailRollList.length; j < listLen; j++){
                for(var z = 0; z < 5; z++){
                    var rollInfo = psRollInfos[i].detailRollList[j][z];
                    if(rollInfo.check === 1) {
                        arr.push(rollInfo.detailRollId);
                    }
                }
            }
        }
        return arr;
    };

    //获取品名list
    var rootCategoryId = 1;
    clothCheckService.getProductNameList(rootCategoryId).then(function (resp) {
      vm.productNameList = resp.data.data.product.propertyList;
    });


    // 省市区三级联动初始化方法(分为新增)
    function initCityPicker() {
      clothCheckService.getProvinceList().then(function(response) {
          $scope.provinceList = response.data.data;
        },function() {
          toaster.pop({
            type: 'warning',
            title: '提示信息',
            body: '获取省失败',
            timeout: 5000
          });
        });

      // 改变省
      $scope.changeProvince = function(isgetData) {
        if(!isgetData) {
          vm.modal.logistics.cityId = vm.modal.logistics.districtId = 0;
        }
        $scope.cityList = $scope.areaList = [];
        if (vm.modal.logistics.provinceId && vm.modal.logistics.provinceId !== 0) {
          clothCheckService.getCityList(vm.modal.logistics.provinceId).then(function (response) {
            $scope.cityList = response.data.data;
          }, function () {
            toaster.pop({
              type: 'warning',
              title: '提示信息',
              body: '获取城市列表失败',
              timeout: 5000
            });
          })
        }
      };

      // 改变城市
      $scope.changeCity = function(isgetData) {
        if(!isgetData) {
          vm.modal.logistics.districtId = 0;
        }
        $scope.districtList = [];
        if (vm.modal.logistics.cityId && vm.modal.logistics.cityId !== 0) {
          clothCheckService.getDistrictList(vm.modal.logistics.cityId).then(function (response) {
            $scope.districtList = response.data.data;
          }, function () {
            toaster.pop({
              type: 'warning',
              title: '提示信息',
              body: '获取区域列表失败',
              timeout: 5000
            });
          });
        }
      }
      $scope.changeProvince(true);
      $scope.changeCity(true);
    }


    //验布坊修改
    $scope.changeClothStore = function () {
      clothCheckService.loadMarketLogistics(vm.modal.order.clothStoreId).then(function (resp) {
        vm.modal.marketList = resp.data.data.markets;
        vm.modal.order.marketId = 0;
        vm.modal.logisticsCompanyList = resp.data.data.logisticsCompanyList;
        vm.modal.logistics.logisticsId = 0;
      });
    };

    //修改物流公司
    $scope.changeLogistics = function () {
      var logisticsCompanyId = vm.modal.logistics.logisticsCompanyId;
      var logisticsCompanyList = vm.modal.logisticsCompanyList;
      var listLen = logisticsCompanyList.length;
      for(var i = 0; i < listLen; i++){
        var logisticsCompany = logisticsCompanyList[i];
        if(logisticsCompany.companyId == logisticsCompanyId){
          vm.modal.logistics.logisticsMobile = logisticsCompany.mobiles;
        }
      }
      return "";
    };
    //
    $scope.changeIsVip = function () {
      // var isVip = vm.modal.order.isVip;
      // var text = '此订单加急';
      // if(isVip){
      //   if(vm.modal.order.remark.indexOf(text) <= 0){
      //     vm.modal.order.remark += text;
      //   }
      // }else{
      //   vm.modal.order.remark.replace(text,'');
      // }
    };

    function isTel(tel) {
      // if(/^1[345789]\d{9}$/.test(tel)){
      if((/^\d/.test(tel))){
        return true;
      }else {
        return false;
      }
    }

    //提交获取order
    function getOrder() {
      var modalOrder = vm.modal.order;
      var order = {
        "thirdOrderNo": modalOrder.thirdOrderNo,
        "customerType": modalOrder.customerType,
        "realCustomerName": modalOrder.realCustomerName,
        "realCustomerMobile": modalOrder.realCustomerMobile,
        "requireCompletionType": modalOrder.requireCompletionType,
        "logisticsTypeId": modalOrder.logisticsTypeId,
        "clothStoreId": modalOrder.clothStoreId,
        "marketId": modalOrder.marketId,
        "remark": modalOrder.remark,
        "niceTrade": modalOrder.niceTrade,
        "isVip": modalOrder.isVip,
      };
      //是否是指定时间
      if(modalOrder.requireCompletionType == 1) {
        order.requireCompletionTime = $filter('date')(new Date().getTime(), 'yyyy-MM-dd') + ' 23:59:59';
        order.canDirectDelivery = modalOrder.canDirectDelivery;
      }else if(modalOrder.requireCompletionType == 2) {
        order.requireCompletionTime = $filter('date')(new Date().getTime() + 24*60*60*1000, 'yyyy-MM-dd') + ' 23:59:59';
      }else if(modalOrder.requireCompletionType == 3) {
        order.requireCompletionTime = $filter('date')(new Date(modalOrder.requireCompletionTime), 'yyyy-MM-dd HH:mm:ss');
      }
      //是否是短驳拉货
      if(modalOrder.customerType == 4){
        order.pullInTime = $filter('date')(new Date(modalOrder.pullInTime), 'yyyy-MM-dd HH:mm:ss');
        order.pullInAddress = modalOrder.pullInAddress;
        order.pullInContact = modalOrder.pullInContact;
        order.pullInTel = modalOrder.pullInTel;
      }else {
        order.estimatedDeliveryTime = $filter('date')(new Date(modalOrder.estimatedDeliveryTime), 'yyyy-MM-dd HH:mm:ss');
      }
      return order;
    }

    function getLogisticsCompanyName(logisticsCompanyId) {
      var logisticsCompanyList = vm.modal.logisticsCompanyList;
      var listLen = logisticsCompanyList.length;
      for(var i = 0; i < listLen; i++){
        var logisticsCompany = logisticsCompanyList[i];
        if(logisticsCompany.companyId == logisticsCompanyId){
          return logisticsCompany.companyName;
        }
      }
      return "";
    }

      function getLogisticsId(logisticsCompanyId) {
          var logisticsCompanyList = vm.modal.logisticsCompanyList;
          var listLen = logisticsCompanyList.length;
          for(var i = 0; i < listLen; i++){
              var logisticsCompany = logisticsCompanyList[i];
              if(logisticsCompany.companyId == logisticsCompanyId){
                  return logisticsCompany.id;
              }
          }
          return "";
      }

    function getName(list,id,idname) {
      var listLen = list.length;
      for(var i = 0; i < listLen; i++){
        var item = list[i];
        if(item[idname] == id){
          return item.name;
        }
      }
      return "";
    }


    //获取itemList
    function getItemList() {
      var itemList = vm.modal.detail.itemList;
      var logistics = [];
      var itemListLen = itemList.length;
      for(var i = 0; i < itemListLen; i++){
        var item = itemList[i];
        var itemlogistics = {
          "itemId": item.itemId,
          "itemName": item.itemName,
          "lsItemCode": item.lsItemCode || "",
          "mainPic": item.mainPic,
          "rootCategoryId": item.rootCategoryId,
          "isRecord": item.isRecord,
          "orderItemId": item.orderItemId,
          "rowNo": item.rowNo,
          "tradeItemId": item.tradeItemId,
          "productId": item.productId,
          "fabricStructure": item.fabricStructure,
          "colorName": item.colorName,
          "orderType": item.orderType,
          "checkType": item.checkType,
          "expectRollQuantity": item.expectRollQuantity,
          "needCheckRollQuantity": item.needCheckRollQuantity,
          "variableItemImage": item.variableItemImage,
          "itemImage": item.itemImage
        };
        itemlogistics.fabricStructureName = getName(vm.modal.FABRIC_STRUCTURE.values,item.fabricStructure,'valueId');
        itemlogistics.productName = getName(vm.productNameList,item.productId,'valueId');
        // itemlogistics.colorName = item.colorName;
        itemlogistics.orderTypeName = getName(vm.modal.ClothOrderTypeEnum,item.orderType,'code');
        itemlogistics.checkTypeName = getName(vm.modal.CheckTypeEnum,item.checkType,'type');
        if(itemlogistics.checkType==1){
          itemlogistics.needCheckRollQuantity = itemlogistics.expectRollQuantity
        }else if(itemlogistics.checkType==3){
          itemlogistics.needCheckRollQuantity = 0;
        }
        // 送检明细
        itemlogistics.checkPsRolls = $scope.calCheckPsRollsId(item.psRollInfos);
        if(itemlogistics.checkPsRolls.length > 0) {
          logistics.push(itemlogistics);
        }
      }
      return logistics;
    }

    $scope.changeRefundStatiste = function (item,isInit) {
      var refundStatis = {};
      item = item || {};
      item.refundStatiste = item.refundStatiste || [{}];
      item.refundStatistics = item.refundStatistics || [{}];
      if(item.refundStatiste && !isInit) {
        refundStatis = item.refundStatistics[1 * item.refundStatiste - 1];
      }else {
        refundStatis = item.refundStatistics[0] || {};
      }
      item.avgRefundRate = refundStatis.avgRefundRate;
      item.avgQualityDeduct = refundStatis.avgQualityDeduct;
      item.suggest = refundStatis.suggest;
    };

    $scope.changeProductName = function (item) {
      var data = {
        "productName": getName(vm.productNameList,item.productId,'valueId'),
        "tradeId": vm.modal.order.thirdOrderNo
      };
      clothCheckService.loadRefundStatistics(data).then(function (resq) {
        item.refundStatistics = resq.data.data.refundStatistics;
        $scope.changeRefundStatiste(item,true);
      })

    };

    $scope.calNeedRoll = function (item) {
      if(typeof item.expectRollQuantity == 'string') {
        item.expectRollQuantity = item.expectRollQuantity.replace(/[^\d]/g, "");
      }
      if(!item.expectRollQuantity || item.checkType != 2 || !item.rate){
        item.needCheckRollQuantity = "";
        return false;
      }
      item.needCheckRollQuantity = Math.ceil(item.expectRollQuantity*parseFloat(item.rate)/100);
    };

    $scope.ok = function () {
      vm.okBtnDisabled = true;
      var verification = $scope.verification();
      if(verification){
        toaster.pop({
          type: 'error',
          title: '提示信息',
          body: verification,
          showCloseButton: true,
          timeout: 3000
        });
        vm.okBtnDisabled = false;
        return false;
      }
      var param = {};
      param.order = getOrder();
      param.logistics = vm.modal.logistics;
      param.logistics.logisticsCompanyName = getLogisticsCompanyName(vm.modal.logistics.logisticsCompanyId);
      param.logistics.logisticsId = getLogisticsId(vm.modal.logistics.logisticsCompanyId);
      param.itemList = getItemList();

      if(vm.modal.logistics.logisticsCompanyId != vm.logisticsCompanyId){
        isCanclePopByMao('温馨提示','报单选择的物流公司为:' + param.logistics.logisticsCompanyName + '(id:' + vm.modal.logistics.logisticsCompanyId + ')' + '，与订单选择的物流公司:' + vm.logisticsCompanyName + '(id:' + vm.logisticsCompanyId + ')' + '不一致，确定要修改发货的物流公司么？',function () {
          saveData(param);
        });
        vm.okBtnDisabled = false;
      }else {
        saveData(param);
      }
    };

    function saveData(param) {
      clothCheckService.saveClothRecord(angular.toJson(param)).then(function (resp) {
        if(resp.data.code == 200){
          toaster.pop({
            type: 'success',
            title: '提示信息',
            body: resp.data.message,
            showCloseButton: true,
            timeout: 3000
          });
          $uibModalInstance.close();
        }
      }).finally(function () {
        vm.okBtnDisabled = true;
      });
    }


    $scope.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };

    //必填项验证
    $scope.verification = function () {
      var veriText = "";
      if(!vm.modal.order.clothStoreId){
        veriText = '请选择验布坊';
        return veriText;
      }
      if(!vm.modal.order.marketId){
        veriText = '请选择所属市场';
        return veriText;
      }
      if(!vm.modal.order.realCustomerName){
        veriText = '请输入真实商户名';
        return veriText;
      }
      if(!vm.modal.order.realCustomerMobile || !isTel(vm.modal.order.realCustomerMobile)){
        veriText = '请输入正确的真实商户手机';
        return veriText;
      }
      if(!vm.modal.order.customerType){
        veriText = '请选择送检方式';
        return veriText;
      }
      if(vm.modal.order.customerType == 4 && !vm.modal.order.pullInTime){
        veriText = '请选择拉货时间';
        return veriText;
      }
      if(vm.modal.order.customerType == 4 && !vm.modal.order.pullInContact){
        veriText = '请输入拉货联系人';
        return veriText;
      }
      if(vm.modal.order.customerType == 4 && !vm.modal.order.pullInTel && !isTel(vm.modal.order.pullInTel)){
        veriText = '请输入拉货联系电话';
        return veriText;
      }
      if(vm.modal.order.customerType == 4 && !vm.modal.order.pullInAddress){
        veriText = '请输入拉货地址';
        return veriText;
      }


      var len = vm.modal.detail.itemList.length;
      var verifItem = false;
      // 只要有一个item能通过就不提示。
      for(var i = 0; i < len; i++) {
        var item = vm.modal.detail.itemList[i];
        if(
            item.itemName &&
            item.productId &&
            item.color &&
            item.fabricStructure &&
            item.orderType &&
            item.checkType &&
            (item.expectRollQuantity && item.expectRollQuantity>=0) &&
            (
                item.checkType!=2 ||
                item.checkType==2 &&
                  (item.needCheckRollQuantity && item.needCheckRollQuantity>=0)  &&
                  (item.expectRollQuantity*1 >= item.needCheckRollQuantity*1)
            )
        ){
          verifItem = true;
        }
      }
      if(!verifItem){
        for(var i = 0; i < len; i++){
          var item = vm.modal.detail.itemList[i];
          if(!item.itemName){
            veriText = '第'+(i + 1) +'个商品请输入商品名称';
            return veriText;
          }
          if(!item.productId){
            veriText = '第'+(i + 1) +'个商品请选择品名';
            return veriText;
          }
          if(!item.colorName){
            veriText = '第'+(i + 1) +'个商品请选择颜色';
            return veriText;
          }
          if(!item.fabricStructure){
            veriText = '第'+(i + 1) +'个商品请选择面料结构';
            return veriText;
          }
          if(!item.orderType){
            veriText = '第'+(i + 1) +'个商品请选择验布类型';
            return veriText;
          }
          if(!item.checkType){
            veriText = '第'+(i + 1) +'个商品请选择验布方式';
            return veriText;
          }
          if(!item.expectRollQuantity || item.expectRollQuantity<=0){
            veriText = '第'+(i + 1) +'个商品请勾选送检明细';
            return veriText;
          }
          if(item.checkType==2 && (!item.needCheckRollQuantity || item.needCheckRollQuantity<=0)){
            veriText = '第'+(i + 1) +'个商品请输入商品抽检数';
            return veriText;
          }
          if(item.checkType==2 && (item.expectRollQuantity*1 < item.needCheckRollQuantity*1)){
            veriText = '第'+(i + 1) +'个商品商品总卷数不能小于商品抽检数';
            return veriText;
          }
        }
      }

      //
      if(!vm.modal.order.requireCompletionType || (vm.modal.order.requireCompletionType ==3 && !vm.modal.order.requireCompletionTime)){
        veriText = '请选择要求发货时间';
        return veriText;
      }
      if(vm.modal.order.requireCompletionType == 1 && vm.modal.order.canDirectDelivery == null){
        veriText = '请选择验布未完成直接发货';
        return veriText;
      }
      if(!vm.modal.order.logisticsTypeId){
        veriText = '请选择提货方式';
        return veriText;
      }
      if(vm.modal.order.logisticsTypeId == 2 && !vm.modal.logistics.logisticsCompanyId){
        veriText = '请选择物流公司';
        return veriText;
      }
      if(vm.modal.order.logisticsTypeId == 2 && !vm.modal.logistics.logisticsMobile){
        veriText = '请输入物流联系方式';
        return veriText;
      }
      if(vm.modal.order.logisticsTypeId == 2 && !vm.modal.logistics.buyerName){
        veriText = '请输入收货人';
        return veriText;
      }
      if(vm.modal.order.logisticsTypeId == 2 && !vm.modal.logistics.mobile && !isTel(vm.modal.logistics.mobile)){
        veriText = '请输入收货人联系方式';
        return veriText;
      }
      if(vm.modal.order.logisticsTypeId == 2 && (!vm.modal.logistics.provinceId || !vm.modal.logistics.cityId || !vm.modal.logistics.districtId || !vm.modal.logistics.address)){
        veriText = '请输入收货地址';
        return veriText;
      }
    };
    // 跳转验布动态
    $scope.directToPlan = function () {
      window.open(vm.modal.planUrl);
    }
  }

  angular
  .module('app.cloth-check')
  .controller('clothRecordCtrl', clothRecordCtrl);
})();