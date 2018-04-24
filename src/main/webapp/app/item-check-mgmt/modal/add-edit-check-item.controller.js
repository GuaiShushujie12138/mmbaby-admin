/**
 * Created by zhenyu on 2016/9/20.
 */

(function () {

    'use strict';

    addEditCheckItemCtrl.$inject = ['$scope', '$http', '$uibModal', '$uibModalInstance', '$filter', '$compile', 'toaster','state','itemCheckMgmtService','rowData','opener'];

    addEditCheckItemCtrlForRoute.$inject = ['$scope', '$http', '$uibModal', '$filter', '$compile', 'toaster','itemCheckMgmtService','$stateParams'];

    function addEditCheckItemCtrlForRoute($scope, $http, $uibModal, $filter, $compile, toaster,itemCheckMgmtService,$stateParams) {
    	addEditCheckItemCtrlCommon($scope, $http, $uibModal, null, $filter, $compile, toaster,null,itemCheckMgmtService,null,null,$stateParams);
    }
    function addEditCheckItemCtrl($scope, $http, $uibModal, $uibModalInstance, $filter, $compile, toaster,state,itemCheckMgmtService,rowData,opener) {
        var itemId = rowData === undefined || rowData.itemId === undefined ? null : rowData.itemId;
    	addEditCheckItemCtrlCommon($scope, $http, $uibModal, $uibModalInstance, $filter, $compile, toaster,state,itemCheckMgmtService,itemId,opener,null);
    }
    
    function addEditCheckItemCtrlCommon($scope, $http, $uibModal, $uibModalInstance, $filter, $compile, toaster,state,itemCheckMgmtService,itemId,opener,$stateParams) {
        var vm = this;
        
        if($stateParams && $stateParams.itemId){
      	  itemId = $stateParams.itemId;
        }
        if($stateParams && $stateParams.state){
      	  state = $stateParams.state;
        }
        
        // 初始化当前状态
        $scope.state = 0;
        $scope.notEditable = true;
        $scope.canEditItemCode = false;
      $scope.canChooseCategory = false;
      

        // 卖家信息
        var sellerInfo = $scope.sellerInfo = {
            id: '',
            mobile: '',
            contactName: '',
            companyName: '',
            shopName: '',
            provinceId: 0,
            provinceName: '',
            cityId: 0,
            cityName: '',
            districtId: 0,
            districtName: '',
            address: ''
        };

        // 商品信息
        var itemInfo = $scope.itemInfo = {
          rootCategoryId: 1,
          rootCategoryIdCheck: true,
            customerId: -1,
          hasColorStand: true,
          colorStandPrice: 0,
          swatchPrice: '',
          swatchMeasurementUnit: '米',
          largeCargoPrice: '',
          largeCargoMeasurementUnit: '米',
          moq: '',
            samplePrice: '',
            bulkPrice: '',
            itemCodeRegion: '',
            //categoryCode: '',
            itemSource: 17,
            sellerOperator: -1,
            bulkMaxPrice: '',
            weightShortfall: '',
            realShopId: ''
        }

        // 审核信息
        var checkMap = $scope.checkMap = {
            realShopId: false,
            swatchProcurementPrice:false,
            largeCargoProcurementPrice:false,
            hasColorStand: false,
            swatchPrice:false,
            largeCargoPrice:false,
            moq:false,
            largeCargoMaxPrice:false,
            weightShortfall:false
        }

        // 弹框为新增的情况
        if (state == 1) {
            $scope.title = '添加新商品';
            $scope.state = 1;
        } else if (state == 2) {
            $scope.title = '编辑商品(商品ID:' + itemId + ')';
            $scope.state = 2;
        }   else if (state == 3) {
            $scope.title = '商品审核';
            $scope.state = 3;
        }

        // 改变手机号的逻辑
        $scope.changePhone = function() {
            $scope.customerExit = $scope.addCustomer = false;

            if (sellerInfo.mobile.length > 11) {
                sellerInfo.mobile = sellerInfo.mobile.slice(0,11);
            }

            if (sellerInfo.mobile.length === 11) {
                itemCheckMgmtService.getRealSellerByMobile(sellerInfo.mobile).then(function(response) {
                    if (response.data.data) {
                        if (response.data.data.isExist === 1) { // 用户存在
                            sellerInfo = $scope.sellerInfo = response.data.data;
                            $scope.customerExit = true;
                            itemInfo.realShopId = response.data.data.realShopId;
                            itemInfo.customerId = response.data.data.id;
                            getCityListAndDistrictList(sellerInfo.provinceId,sellerInfo.cityId);
                        } else {
                            $scope.addCustomer = true;
                            $scope.notEditable = false;
                          sellerInfo.id = $scope.sellerInfo.id = '';
                        }
                    }
                },function() {
                    toaster.pop({
                        type: 'warning',
                        title: '提示信息',
                        body: '获取卖家信息失败',
                        timeout: 5000
                    });
                });
            } else if (sellerInfo.mobile.length < 11) {
                // 清空买家信息数据并且不能填写
                $scope.notEditable = true;
                clearSellerInfo();
            }
        }

        // 编辑客户资料
        $scope.editCustomerInfo = function() {
            $scope.notEditable = false;
        }

        // 提交卖家信息
        $scope.submitSellerInfo = function() {
            // 根据省id获取省的值
            if (sellerInfo.provinceId && sellerInfo.provinceId !== 0) {
                $scope.provinceList.forEach(function(item,index) {
                    if(item.id == sellerInfo.provinceId) {
                        sellerInfo.provinceName = item.name;
                    }
                })
            }

            // 根据市id值获取市的name值
            if (sellerInfo.cityId && sellerInfo.cityId !== 0) {
                $scope.cityList.forEach(function(item,index) {
                    if (item.id === sellerInfo.cityId) {
                        sellerInfo.cityName = item.name;
                    }
                });
            }

            // 根据区域的id值获取区的name值
            if (sellerInfo.districtId && sellerInfo.districtId !== 0) {
                $scope.districtList.forEach(function(item,index) {
                    if (item.id === sellerInfo.districtId) {
                        sellerInfo.districtName = item.name;
                    }
                });
            }

            // 如果验证通过
            if (validateSellerInfo(sellerInfo)) {
                itemCheckMgmtService.saveRealSellerInfo(sellerInfo).then(function(response) {
                    if (response.status == 200) {
                        $scope.notEditable = true;
                        $scope.customerExit = true;
                        $scope.addCustomer = false;
                        itemInfo.realShopId = response.data.data.realShopId;
                        itemInfo.customerId = response.data.data.id;
                        sellerInfo.id = response.data.data.id;
                        toaster.pop({
                            type: 'success',
                            title: '提示信息',
                            body: '保存成功',
                            timeout: 5000
                        });
                    }
                });
            }
        }

        // 点击取消和关闭弹窗
        $scope.cancel = function() {
            $uibModalInstance.dismiss('cancel');
        };

        $scope.clearNoNum = function (item, key) {
            var val = item[key];
            if(typeof val=='string') {
                val = val.replace(/(^\s+)|(\s+$)/g, "")
                //清除"数字"和"."以外的字符
                val = val.replace(/[^\d.]/g, "");
                //验证第一个字符是数字而不是.
                val = val.replace(/^\./g, "");
                //只保留第一个. 清除多余的.
                val = val.replace(/\.{2,}/g, ".");
                val = val.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
                //只能输入两个小数
                val = val.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3');
            }
            item[key] = val;
        }

        // 点击下一步

        $scope.clickNextStep = function() {
            if (!validateItemInfo(itemInfo)) {
                return;
            }
            // var windowHeight = window.innerHeight;
            // var windowWidth = window.innerWidth;
            // var urlInfo = addUrlInfo();
            // var ifr = createIframe($scope.jumpUrl + urlInfo,windowWidth,windowHeight);

            itemCheckMgmtService.allocateCustomer(itemInfo.customerId,itemInfo.sellerOperator).then(function(response){
                showToaster('success', response.data.data);
            },function(err) {
                showToaster('error', err);
            });

            // var opener = $scope;
            var urlInfo = addUrlInfo();
            $uibModal.open({
                templateUrl: 'app/item-check-mgmt/modal/add-edit-check-item-iframe.html?v=' + LG.appConfig.clientVersion,
                controller: 'addEditCheckItemIframeCtrl',
                windowClass: 'item-iframe',
                resolve: {
                    jumpUrl: function () {
                        return $scope.jumpUrl  + urlInfo
                    },
                    typeText: function () {
                        var typeText;
                        switch($scope.state) {
                            case 1: typeText = '发布新商品';
                                break;
                            case 2: typeText = '编辑商品';
                                break;
                            case 3: typeText = '审核商品';
                                break;
                            default:
                                typeText = '发布新商品';
                                break;
                        }
                        return typeText;
                    },
                    vm: function () {
                        return $scope;
                    }
                }
            });


            // ifr.onload = function() {
            //     ifr.contentWindow.postMessage(itemInfo,"*");
            // }
        };


        function createIframe(url,width,height) {
            var iframe = document.querySelector('#iframe');
            if (!iframe) {
                iframe = document.createElement('iframe');
                iframe.id = 'iframe';
                iframe.src = url;
                iframe.width = width;
                iframe.height = height;
                iframe.style.cssText =  'position: fixed;z-index: 99999; left: 0; top: 0';
                document.body.appendChild(iframe);
            }
            return iframe;
        }

        function addUrlInfo() {
            var urlInfo = '&';
            switch($scope.state) {
                case 1: urlInfo += 'type=add';
                    break;
                case 2: urlInfo += 'type=edit';
                    break;
                case 3: urlInfo += 'type=audit';
                    break;
                default:
                    break;
            }
            if (itemId) {
                urlInfo += '&itemId=' + itemId;
            } else {
                urlInfo += '&itemId=' + 0;
            }

            if (itemInfo.realShopId) {
                urlInfo += '&realShopId=' + itemInfo.realShopId;
            }

            if (itemInfo.sellerOperator) {
                urlInfo += '&operatorId=' + itemInfo.sellerOperator;
            }

            if (itemInfo.itemSource) {
                urlInfo += '&itemSource=' + itemInfo.itemSource;
            }

          if (itemInfo.itemCodeRegion) {
            urlInfo += '&itemCodeRegion=' + itemInfo.itemCodeRegion;
          }

          if (itemInfo.categoryCode) {
            //urlInfo += '&categoryCode=' + itemInfo.categoryCode;
          }

            if (itemInfo.samplePrice) {
                urlInfo += '&swatchProcurementPrice=' + itemInfo.samplePrice;
            }

            if (itemInfo.bulkPrice) {
                urlInfo += '&largeCargoProcurementPrice=' + itemInfo.bulkPrice;
            }

            if (itemInfo.bulkMaxPrice) {
                urlInfo += '&largeCargoMaxPrice=' + itemInfo.bulkMaxPrice;
            }

            if (itemInfo.weightShortfall) {
                urlInfo += '&weightShortfall=' + itemInfo.weightShortfall;
            }

            if (itemInfo.swatchMeasurementUnit) {
                urlInfo += '&swatchMeasurementUnit=' + itemInfo.swatchMeasurementUnit;
            }

            if (itemInfo.largeCargoMeasurementUnit) {
                urlInfo += '&largeCargoMeasurementUnit=' + itemInfo.largeCargoMeasurementUnit;
            }

          var rootCategoryId = itemInfo.rootCategoryIdCheck === true?1:2;
          urlInfo += '&rootCategoryId=' + rootCategoryId;

          if(itemInfo.rootCategoryIdCheck === true){
            urlInfo += '&hasColorStand=' + itemInfo.hasColorStand;
            urlInfo += '&colorStandPrice=' + itemInfo.colorStandPrice;
          }

          if (itemInfo.swatchPrice) {
            urlInfo += '&swatchPrice=' + itemInfo.swatchPrice;
          }

          if (itemInfo.largeCargoPrice) {
            urlInfo += '&largeCargoPrice=' + itemInfo.largeCargoPrice;
          }

          if (itemInfo.moq) {
            urlInfo += '&moq=' + itemInfo.moq;
          }
            
            if ($scope.checkMap) {
                var checkTrueMap = {};
                for (var key in $scope.checkMap) {
                    if ($scope.checkMap[key] === true) {
                        checkTrueMap[key] = $scope.checkMap[key];
                    }
                }
                var checkMapStr = JSON.stringify(checkTrueMap);
                urlInfo += '&checkMap=' + checkMapStr;
            }

            return urlInfo;

        }

        

        function getCityListAndDistrictList(provinceId,cityId) {
            itemCheckMgmtService.getCityList(provinceId).then(function(response) {
                $scope.cityList = response.data.data;
            },function() {
                toaster.pop({
                    type: 'warning',
                    title: '提示信息',
                    body: '获取城市列表失败',
                    timeout: 5000
                });
            })

            itemCheckMgmtService.getDistrictList(cityId).then(function(response){
                $scope.districtList = response.data.data;
            },function(){
                toaster.pop({
                    type: 'warning',
                    title: '提示信息',
                    body: '获取区域列表失败',
                    timeout: 5000
                });
            });
        }

        // 验证买家信息
        function validateSellerInfo(data) {
            var checkResult = true;
            if (data.mobile == null || data.mobile == '') {
                showToaster('error', "手机号不能为空");
                checkResult = false;
            } else if (data.contactName == null || data.contactName == '') {
                showToaster('error', "联系人不能为空");
                checkResult = false;
            } else if (data.companyName == null || data.companyName == '') {
                showToaster('error', "公司名称不能为空");
                checkResult = false;
            } else if (data.shopName == null || data.shopName == '') {
                showToaster('error', "店铺名称不能为空");
                checkResult = false;
            } else if (data.provinceId == 0 || data.provinceId == null) {
                showToaster('error', "省不能为空");
                checkResult = false;
            } else if (data.cityId == 0 || data.cityId == null) {
                showToaster('error', "市不能为空");
                checkResult = false;
            } else if (data.districtId == 0 || data.districtId == null) {
                showToaster('error', "区不能为空");
                checkResult = false;
            } else if (data.address == '' || data.address == null) {
                showToaster('error', "地址不能为空");
                checkResult = false;
            }
            return checkResult;
        }

        // 验证商品信息
        function validateItemInfo(data) {

            if (data.itemCodeRegion == null || data.itemCodeRegion == '') {
              showToaster('error','所属区域不能为空');
              return false;
            }
            if (data.categoryCode == null || data.categoryCode == '') {
              //showToaster('error','链尚货号分类不能为空');
              //return false;
            }
            if (data.samplePrice == null || data.samplePrice == '' || data.samplePrice==0) {
                showToaster('error','样布采购价不能为空');
              return false;
            }
            if (data.bulkPrice == null || data.bulkPrice == '' || data.bulkPrice==0) {
                showToaster('error','大货采购价不能为空');
              return false;
            }
            if (data.sellerOperator == null || data.sellerOperator < 0) {
                showToaster('error','报价业务员不能为空');
              return false;
            }
            if (data.realShopId == null || data.realShopId  == '') {
                showToaster('error','真实卖家信息不能为空');
              return false;
            }
            if (data.rootCategoryIdCheck !== true && data.rootCategoryIdCheck  !== false) {
              showToaster('error','请选择商品分类');
              return false;
            }
            if (data.rootCategoryIdCheck === true && data.hasColorStand !== true && data.hasColorStand  !== false) {
              showToaster('error','请选择有无样卡');
              return false;
            }
            if (data.rootCategoryIdCheck === true && data.hasColorStand === true && data.colorStandPrice == null) {
              showToaster('error','请输入样卡价格');
              return false;
            }
            if (data.swatchPrice == null || data.swatchPrice  == '') {
              showToaster('error','请输入样布链尚价');
              return false;
            }
            if (data.largeCargoPrice == null || data.largeCargoPrice  == '') {
              showToaster('error','请输入大货链尚价');
              return false;
            }
            if (data.moq == null || data.moq  == '') {
              showToaster('error','请输入大货起订量');
              return false;
            }

            return true;
        }

        function showToaster(type, msg) {
            if (msg != undefined || msg != null || msg != "") {
                toaster.pop({
                    type: type,
                    title: '提示信息',
                    body: msg,
                    showCloseButton: true,
                    timeout: 5000
                });
            }

        }


        // 清除真实卖家信息
        function clearSellerInfo() {
            sellerInfo.address = sellerInfo.customerName = sellerInfo.contactName = sellerInfo.companyName = sellerInfo.shopName = sellerInfo.shopAddress = '';
            sellerInfo.provinceId = sellerInfo.cityId = sellerInfo.districtId = 0;
        }

        // 省市区三级联动初始化方法(分为新增)
        function initCityPicker() {
            itemCheckMgmtService.getProvinceList().then(function(response) {
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
            $scope.changeProvince = function() {
                sellerInfo.cityId = sellerInfo.districtId = 0;
                $scope.cityList = $scope.areaList = [];
                if (sellerInfo.provinceId && sellerInfo.provinceId !== 0) {
                    itemCheckMgmtService.getCityList(sellerInfo.provinceId).then(function(response) {
                        $scope.cityList = response.data.data;
                    },function() {
                        toaster.pop({
                            type: 'warning',
                            title: '提示信息',
                            body: '获取城市列表失败',
                            timeout: 5000
                        });
                    })
                }
            }

            // 改变城市
            $scope.changeCity = function() {
                sellerInfo.districtId = 0;
                $scope.districtList = [];
                if (sellerInfo.cityId && sellerInfo.cityId !== 0) {
                    itemCheckMgmtService.getDistrictList(sellerInfo.cityId).then(function(response){
                        $scope.districtList = response.data.data;
                    },function(){
                        toaster.pop({
                            type: 'warning',
                            title: '提示信息',
                            body: '获取区域列表失败',
                            timeout: 5000
                        });
                    });
                }
            }
        }


        // 初始化商品信息单位

        function itemInfoUnit() {
            itemCheckMgmtService.itemInit('').then(function(response) {
                if (response.status == 200) {
                    var clothMeasurementUnits = response.data.data.clothMeasurementUnits;
                    var accessoryMeasurementUnits = response.data.data.accessoryMeasurementUnits;
                    var itemSource = response.data.data.itemSource;
                    var itemCodeRegion = response.data.data.itemCodeRegion;
                    //var categoryCode = response.data.data.categoryCode;
                    //$scope.samplePriceUnitList = $scope.swatchPriceUnitList  = measurementUnits;
                    //$scope.largeCargoPriceUnitList = $scope.bulkPriceUnitList = $scope.bulkMaxPriceUnitList  = measurementUnits;
                    $scope.clothPriceUnits = clothMeasurementUnits;
                    $scope.accessoryPriceUnits = accessoryMeasurementUnits;

                    if($scope.itemInfo.rootCategoryIdCheck){
                        $scope.priceUnitList = $scope.clothPriceUnits;
                    }else{
                        $scope.priceUnitList = $scope.accessoryPriceUnits;
                    }

                    $scope.itemSourceList = itemSource;
                    $scope.itemCodeRegionList = itemCodeRegion;
                    //$scope.categoryCodeList = categoryCode;
                    $scope.jumpUrl = response.data.data.jumpUrl;
                }
            },function(){
                showToaster('error','初始化商品单位失败');
            });
            itemCheckMgmtService.getOperatorList().then(function(response) {
            	$scope.sellerOperatorList  = response.data.data.sellerOperatorList;
            });

        }

        $scope.categoryChange = function () {
          if(itemInfo.rootCategoryIdCheck){
            $scope.priceUnitList = $scope.clothPriceUnits;
          }else{
            $scope.priceUnitList = $scope.accessoryPriceUnits;
          }
        }

        // 编辑和审核时候初始化相关数据

        function editInfoInit(itemId) {
            if (itemId) {
                itemCheckMgmtService.itemInit(itemId).then(function (response) {
                    if (response.status == 200) {
                        var responseData = response.data.data;
                        // 卖家信息

                        if (responseData.realSellerInfo) {
                            sellerInfo = $scope.sellerInfo = responseData.realSellerInfo;
                            $scope.customerExit = true;
                        } else {
                            $scope.customerExit = false;
                        }
                        itemInfo = $scope.itemInfo = {
                          swatchMeasurementUnit: responseData.swatchMeasurementUnit,
                            samplePrice: responseData.swatchProcurementPrice,
                            bulkPrice: responseData.largeCargoProcurementPrice,
                            itemCodeRegion: responseData.lsItemCodeDTO && responseData.lsItemCodeDTO.lsItemCodeRegion,
                            //categoryCode: responseData.lsItemCodeDTO && responseData.lsItemCodeDTO.lsItemCodeCategory,
                          largeCargoMeasurementUnit: responseData.largeCargoMeasurementUnit,
                            itemSource: responseData.sourceType,
                            sellerOperator: responseData.operatorId,
                            bulkMaxPrice: responseData.largeCargoMaxPrice,
                            bulkMaxPriceUnit: responseData.largeCargoMeasurementUnit,
                            weightShortfall: responseData.weightShortfall,
                            realShopId: responseData.realSellerInfo && responseData.realSellerInfo.realShopId,
                            customerId: responseData.realSellerInfo && responseData.realSellerInfo.id,
                          rootCategoryId: responseData.rootCategoryId,
                          rootCategoryIdCheck: responseData.rootCategoryId === 1?true:false,
                          hasColorStand: responseData.hasColorStand,
                          colorStandPrice: responseData.colorStandPrice,
                          swatchPrice: responseData.swatchPrice,
                          largeCargoPrice: responseData.largeCargoPrice,
                          moq: responseData.moq
                        }

                        if($scope.itemInfo.rootCategoryIdCheck){
                            $scope.priceUnitList = $scope.clothPriceUnits;
                        }else{
                            $scope.priceUnitList = $scope.accessoryPriceUnits;
                        }

                        if(responseData.itemAuditDTO
                            && responseData.itemAuditDTO.auditStatus > 0
                            && responseData.itemAuditDTO.auditStatus < 3
                            && itemInfo.itemCodeRegion != null
                            //&& itemInfo.categoryCode != null
                            //&& itemInfo.categoryCode != ''
                            && itemInfo.itemCodeRegion != ''){
                            $scope.canEditItemCode = true;
                        }
                        if (responseData.sourceType != 17 && responseData.sourceType != 18) {
                            itemInfo.itemSource = 999;
                        }
                        getCityListAndDistrictList(sellerInfo.provinceId,sellerInfo.cityId);
                        /*if ($scope.state == 3) {
                            if (responseData.itemAuditDTO && Object.keys(responseData.itemAuditDTO.checkMap).length > 0) {
                                checkMap = $scope.checkMap = responseData.itemAuditDTO.checkMap;
                            }
                        }*/
                      $scope.canChooseCategory = true;
                    }
                }, function () {
                    showToaster('error', '初始化编辑数据失败');
                });
            }
        }

        // 初始化传递数据

        // function initPostMessage() {
        //     window.addEventListener('message',function(e) {
        //         if (typeof e.data == 'object' && e.data.status == 'success') {
        //             document.body.removeChild(document.getElementById('iframe'));
        //             $uibModalInstance.dismiss('cancel');
        //             opener.dtInstance.reloadData();
        //         }
        //     })
        // }

        $scope.cancelSuccess = function () {
            $uibModalInstance.dismiss('cancel');
            setTimeout(function() {
                opener.dtInstance.reloadData(null,false);
            },2000);
        };

        function init() {
            itemInfoUnit();
            editInfoInit(itemId);
            initCityPicker();
            // initPostMessage();
        }

        init();


    }


    angular
        .module('app.item-check-mgmt')
        .controller('addEditCheckItemCtrl', addEditCheckItemCtrl);
    angular
        .module('app.item-check-mgmt')
        .controller('addEditCheckItemCtrlForRoute', addEditCheckItemCtrlForRoute)
})();