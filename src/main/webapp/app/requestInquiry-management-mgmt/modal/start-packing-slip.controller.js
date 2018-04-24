/**
 * Created by mf on 2017/8/15.
 */

(function () {

    'use strict';


    startPackingSlipCtrl.$inject = ['$rootScope', '$scope', '$http', '$uibModal', 'SweetAlert','$filter', '$compile', 'toaster', 'requestInquiryMgmtService', '$stateParams',];

    function startPackingSlipCtrl($rootScope, $scope, $http, $uibModal, SweetAlert,$filter, $compile, toaster, requestInquiryMgmtService, $stateParams) {
        $scope.vm = {};

        $scope.packingSlipId = $stateParams.packingSlipId;
        $scope.requestInquiryId = $stateParams.requestInquiryId;

        if ($scope.packingSlipId == "null") {
            $scope.packingSlipId = null;
        }

        if ($scope.requestInquiryId == "null") {
            $scope.requestInquiryId = null;
        }


        if (!!$scope.packingSlipId) {
            requestInquiryMgmtService.changePackingSlip($scope.packingSlipId).then(function (resq) {

                $scope.vm = resq.data.data.packingSlip;
                $scope.vm.packingSlipSourceStateRequest = $scope.vm.packingSlipSourceState;
                init();
                //console.log(JSON.stringify($scope.vm));
            });

        } else if (!!$scope.requestInquiryId) {
            requestInquiryMgmtService.packingSlipInit($scope.requestInquiryId).then(function (resq) {

                $scope.vm = resq.data.data.requestInquiry;
                $scope.vm.packingSlipSourceStateRequest = {};
                init();
                //console.log(JSON.stringify($scope.vm));
            });
        }


        $scope.removeSupplier = function () {

            SweetAlert.swal({
                    title: '提示',
                    text: '您确定解除该卖家关联的供应商?',
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#DD6B55",
                    confirmButtonText: "是",
                    cancelButtonText: "否",
                    closeOnConfirm: false,
                    closeOnCancel: true
                },
                function (isConfirm) {
                    if (isConfirm) {
                        requestInquiryMgmtService.relatSupplier($scope.vm.realShopId||0, $scope.vm.niceShopId||0,"cancel").then(function (resq) {
                            toaster.pop({
                                type: resq.data.code == 200 ? 'success' : 'error',
                                title: '提示信息',
                                body: resq.data.message,
                                showCloseButton: true,
                                timeout: 5000
                            });
                            if (resq.data.code == 200) {
                                SweetAlert.swal("操作成功!", '已解绑', "success");
                                $scope.vm.isShowNiceShop = false;
                                $scope.vm.niceShopId = 0;

                            }else{
                                SweetAlert.swal("操作失败!", '已取消', "error");
                            }
                        });
                    }
                });
        };


        function init() {
            // $scope.vm.fullDose = $scope.vm.fullDose?"true":"false";
            // $scope.vm.needLogitics = $scope.vm.needLogitics?"true":"false";

            for (var index in $scope.vm.detailList) {
                if (!$scope.vm.detailList[index].procurementPrice) {
                    $scope.vm.detailList[index].procurementPrice = $scope.vm.detailList[index].standPrice;
                }
            }

            if ($scope.vm.lengthShortFall!=null) {
                $scope.vm.disablePaperTube = 1;
                $scope.vm.paperTube = null;
                $scope.vm.weightShortFall =null;
            }

            if ($scope.vm.paperTube!=null && $scope.vm.weightShortFall!=null) {
                $scope.vm.disablePaperTube = 2;
                $scope.vm.lengthShortFall = null;
            }


            if (!$scope.vm.lengthShortFall && !$scope.vm.paperTube && !$scope.vm.weightShortFall) {
                $scope.vm.disablePaperTube = 3;
            }

            $scope.calTotalPrice();
            initCityPicker();
            $scope.vm.isShowNiceShop = true;
            $scope.vm.isShowRealShop = true;


            if ($scope.vm.realShopId == null || $scope.vm.realShopId == 0) {
                $scope.vm.isShowRealShop = false;
            }

            if ($scope.vm.niceShopId == null || $scope.vm.niceShopId == 0) {
                $scope.vm.isShowNiceShop = false;
            }

            requestInquiryMgmtService.getSupplierDetail($scope.vm.realShopId || 0, $scope.vm.niceShopId || 0).then(function (resp) {
                $scope.supplierDetail = resp.data.data;
            });

            if ($scope.vm.packingSlipSourceStateRequest.previousPaymentTradeId == 0 || $scope.vm.packingSlipSourceStateRequest.previousPaymentTradeId == "0"
                || !$scope.vm.packingSlipSourceStateRequest.previousPaymentTradeId) {
                $scope.vm.showAccountNum = 3;
            } else {
                $scope.vm.showAccountNum = 1;
            }
        }

        requestInquiryMgmtService.getColorList().then(function (resq) {
            $scope.colorList = resq.data.data;

        });

        requestInquiryMgmtService.getNewColorList().then(function (resq) {
            $scope.newColorList = resq.data.data;

        })


        $scope.delimg = function (imgs, index) {
            imgs.splice(index, 1);
        };


        $scope.changeUnit = function (sku) {
            if (sku.typeName == '样布') {
                sku.measurementUnit = $scope.vm.swatchMeasurementUnit;
            } else {
                sku.measurementUnit = $scope.vm.largeCargoMeasurementUnit
            }
        }

        $scope.changeAmount = function (sku, pindex, index) {
            var amount = sku.amountList[5 * pindex + index];
            amount = amount.replace(/[^\d.]/g, "");  //清除“数字”和“.”以外的字符
            amount = amount.replace(/\.{2,}/g, "."); //只保留第一个. 清除多余的
            amount = amount.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
            amount = amount.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3');//只能输入两个小数
            if (amount.indexOf(".") < 0 && amount != "") {//以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额
                amount = parseFloat(amount);
            }
            sku.amountList[5 * pindex + index] = amount;
            sku.amountList = sku.amountList || [];
            var all = 0;
            for (var i = 0; i < sku.amountList.length; i++) {
                all += 1 * sku.amountList[i];
            }
            sku.allAmount = all.toFixed(2);
            $scope.calTotalFee(sku);
        };

        $scope.addAmount = function (sku) {
            sku.amountList = sku.amountList || [];
            sku.amountList.push('', '', '', '', '');
        };

        $scope.calTotalFee = function (sku) {
            if (sku.allAmount && sku.procurementPrice) {
                sku.procurementTotalFee = (sku.procurementPrice * sku.allAmount).toFixed(2);
            }
            $scope.calTotalPrice();
        };


        $scope.calTotalPrice = function () {
            var list = $scope.vm.detailList || [];
            var len = list.length;
            var totalPrice = 0;
            for (var i = 0; i < len; i++) {
                if (list[i].procurementTotalFee) {
                    totalPrice += parseFloat(list[i].procurementTotalFee);
                }
            }
            $scope.vm.totalPrice = totalPrice.toFixed(2);
        };

        $scope.addDetail = function () {
            $scope.vm.detailList.push({});
        };
        $scope.delDetail = function (index) {
            $scope.vm.detailList.splice(index, 1);
        };

        // 省市区三级联动初始化方法(分为新增)
        function initCityPicker() {
            requestInquiryMgmtService.getProvinceList().then(function (response) {
                $scope.provinceList = response.data.data;
            }, function () {
                toaster.pop({
                    type: 'warning',
                    title: '提示信息',
                    body: '获取省失败',
                    timeout: 5000
                });
            });

            // 改变省
            $scope.changeProvince = function (listnub, isgetData) {
                if (!isgetData) {
                    if (listnub == 1) {
                        $scope.vm.sendCityId = $scope.vm.sendDistrictId = 0;
                    } else {
                        $scope.vm.receiveCityId = $scope.vm.receiveDistrictId = 0;
                    }
                }
                $scope['cityList' + listnub] = $scope['areaList' + listnub] = [];
                var provinceId;
                if (listnub == 1) {
                    provinceId = $scope.vm.sendProvinceId || 0;
                } else {
                    provinceId = $scope.vm.receiveProvinceId || 0;
                }
                if (provinceId && provinceId !== 0) {
                    requestInquiryMgmtService.getCityList(provinceId).then(function (response) {
                        $scope['cityList' + listnub] = response.data.data;
                    }, function () {
                        toaster.pop({
                            type: 'warning',
                            title: '提示信息',
                            body: '获取城市列表失败',
                            timeout: 5000
                        });
                    });
                }
            };


            // 改变城市
            $scope.changeCity = function (listnub, isgetData) {
                if (!isgetData) {
                    if (listnub == 1) {
                        $scope.vm.sendDistrictId = 0;
                    } else {
                        $scope.vm.receiveDistrictId = 0;
                    }
                }
                $scope['districtList' + listnub] = [];
                var cityId;
                if (listnub == 1) {
                    cityId = $scope.vm.sendCityId;
                } else {
                    cityId = $scope.vm.receiveCityId;
                }
                if (cityId && cityId !== 0) {
                    requestInquiryMgmtService.getDistrictList(cityId).then(function (response) {
                        $scope['districtList' + listnub] = response.data.data;
                    }, function () {
                        toaster.pop({
                            type: 'warning',
                            title: '提示信息',
                            body: '获取区域列表失败',
                            timeout: 5000
                        });
                    });
                }
            };
            $scope.changeProvince(1, true);
            $scope.changeProvince(2, true);
            $scope.changeCity(1, true);
            $scope.changeCity(2, true);
        }


        // 关联供应商
        $scope.changeSupplier = function () {

            var modalInstance = $uibModal.open({
                templateUrl: 'app/requestInquiry-management-mgmt/modal/supplier-list.html?v=' + LG.appConfig.clientVersion,
                size: 'lg',
                keyboard: false,
                controller: 'supplierListCtrl',
                windowClass: 'supplierWC',
                resolve: {
                    realShopId: function () {
                        return $scope.vm.realShopId;
                    },
                    realShopName: function () {
                        return $scope.vm.realShopName;
                    },
                    itemId: function () {
                        return $scope.vm.itemId;
                    }
                }
            });
            modalInstance.result.then(function (result) {


                $scope.vm.niceShopId = result.niceShopId || 0;
                $scope.vm.niceShopName = result.shopName;

                $scope.vm.isShowNiceShop = true;
                if ($scope.vm.niceShopId == null || $scope.vm.niceShopId == 0) {
                    $scope.vm.isShowNiceShop = false;
                }

                requestInquiryMgmtService.getSupplierDetail($scope.vm.realShopId || 0, $scope.vm.niceShopId || 0).then(function (resp) {
                    $scope.supplierDetail = resp.data.data;
                });
            }, function (reason) {

            });
        };

        $scope.cancel = function () {
            $uibModalInstance.close();
        };

        function getAddressNameById(list, id) {
            for (var i = 0; i < list.length; i++) {
                if (list[i].id == id) {
                    return list[i].name;
                }
            }
        }

        $scope.relatedInquiryDetail = function () {
            var url = '#/request/edit/' + $scope.vm.itemId;
            window.open(url);
        }

        $scope.paperTubeChange = function () {
            //控制空差米差的显示
            $scope.vm.disablePaperTube = 3;
            if ($('#lengthShortFall').val() != "" && $('#lengthShortFall').val() != undefined && $('#lengthShortFall').val() != null) {
                $scope.vm.disablePaperTube = 1;
            }
            if ($('#weightShortFall').val() != "" && $('#weightShortFall').val() != undefined && $('#weightShortFall').val() != null) {
                $scope.vm.disablePaperTube = 2;
            }
            if ($('#paperTube').val() != "" && $('#paperTube').val() != undefined && $('#paperTube').val() != null) {
                $scope.vm.disablePaperTube = 2;
            }
        }

        $scope.chooseFalseStatus = function () {

            $scope.vm.showAccountNum = 3;
            if ($scope.vm.packingSlipSourceStateRequest.paymentSeq == 1) {
                $scope.vm.showAccountNum = 3;
                return;
            }

            if ($scope.vm.packingSlipSourceStateRequest.previousPaymentTradeId == null || $scope.vm.packingSlipSourceStateRequest.previousPaymentTradeId == "0"
                ||$scope.vm.packingSlipSourceStateRequest.previousPaymentTradeId == 0) {
                requestInquiryMgmtService.queryFirstPackingSlipTrade($scope.vm.buyerId, null,
                    $scope.vm.niceShopId || null, $scope.vm.itemId).then(function (res) {
                        if (res.data.code == 200) {
                            $scope.tradeList = res.data.data;
                                for (var index in $scope.tradeList) {
                                    $scope.vm.packingSlipSourceStateRequest.previousPaymentTradeId = $scope.tradeList[index].tradeId;
                                    break;
                                }
                            $scope.vm.showAccountNum = 1;
                        }
                    }, function (res) {
                        $scope.vm.packingSlipSourceStateRequest.previousPaymentTradeId = null;
                        $scope.vm.showAccountNum = 2;
                    })
            } else {
                $scope.vm.showAccountNum = 1;
            }
        }

        $scope.ok = function () {
            var verify = verifyData();
            if (verify) {
                toaster.pop({
                    type: 'info',
                    title: '提示信息',
                    body: verify,
                    showCloseButton: true,
                    timeout: 5000
                });
                return false;
            }
            var data = $scope.vm;

            if ($scope.packingSlipId) {
                data.packingSlipId = data.packingSlipId || $scope.packingSlipId;
            } else if ($scope.requestInquiryId) {
                data.requestInquiryId = data.requestInquiryId || $scope.requestInquiryId;
            }
            var detailList = data.detailList;
            var detailLen = detailList.length;
            for (var i = 0; i < detailLen; i++) {
                if (data.rootCategoryId == 1) {
                    var newArr = [];
                    var amountList = detailList[i].amountList;
                    for (var j = 0; j < amountList.length; j++) {
                        if (amountList[j]) {
                            newArr.push(amountList[j]);
                        }
                    }
                    data.detailList[i].amountList = newArr;

                    //data.detailList[i].colorName = getAddressNameById($scope.colorList, data.detailList[i].colorName);

                } else {
                    data.detailList[i].amountList = new Array('' + data.detailList[i].allAmount);
                }
                if (data.detailList[i].typeName == '大货') {
                    data.detailList[i].type = 3;
                    data.detailList[i].measurementUnit = data.largeCargoMeasurementUnit;
                } else if (data.detailList[i].typeName == '样布') {
                    data.detailList[i].type = 2;
                    data.detailList[i].measurementUnit = data.swatchMeasurementUnit;
                }
            }
            //地址
            if (!data.needLogitics || data.needLogitics == 'false') {
                data.sendProvinceId = null;
                data.sendProvinceName = null;
                data.sendCityId = null;
                data.sendCityName = null;
                data.sendDistrictId = null;
                data.sendDistrictName = null;
                data.sendAddress = null;
            } else {
                data.sendProvinceName = getAddressNameById($scope.provinceList, data.sendProvinceId);
                data.sendCityName = getAddressNameById($scope.cityList1, data.sendCityId);
                data.sendDistrictName = getAddressNameById($scope.districtList1, data.sendDistrictId);
            }
            data.receiveProvinceName = getAddressNameById($scope.provinceList, data.receiveProvinceId);
            data.receiveCityName = getAddressNameById($scope.cityList2, data.receiveCityId);
            data.receiveDistrictName = getAddressNameById($scope.districtList2, data.receiveDistrictId);


            if (data.packingSlipSourceStateRequest.state == 1) {
                data.packingSlipSourceStateRequest.advanceTime = null;
                data.packingSlipSourceStateRequest.paymentSeq = null;
                data.packingSlipSourceStateRequest.previousPaymentTradeId = null;
            } else if (data.packingSlipSourceStateRequest.state == 2) {
                data.packingSlipSourceStateRequest.isCod = null;
                data.packingSlipSourceStateRequest.paymentSeq = null;
                data.packingSlipSourceStateRequest.previousPaymentTradeId = null;
            } else if (data.packingSlipSourceStateRequest.state == 3) {
                data.packingSlipSourceStateRequest.isCod = null;
                data.packingSlipSourceStateRequest.advanceTime = null;
            }

            if (data.disablePaperTube == 2) {
                data.lengthShortFall = null;
            } else if (data.disablePaperTube == 1) {
                data.paperTube = null;
                data.weightShortFall = null;
            }

            console.log(JSON.stringify(data));
            requestInquiryMgmtService.savePaceingSlip(data).then(function (res) {
                toaster.pop({
                    type: res.data.code == 200 ? 'success' : 'error',
                    title: '提示信息',
                    body: res.data.message,
                    showCloseButton: true,
                    timeout: 5000
                });
                if (res.data.code == 200) {
                    window.close();
                }
            }, function (res) {
                console.log(JSON.stringify(res))
                if (res.data.message.indexOf('该色号') > -1) {
                    $scope.showInquireDetail = true;
                }
            })

        };

        function verifyData() {
            var vm = $scope.vm;
            if (!vm.certificate) {
                return '请上传卖家码单'
            }
            if (vm.certificate.length > 3) {
                //return '卖家码单最多上传三张图片'
            }
            if (!vm.niceShopId || vm.niceShopId <= 0) {
                return '请选择供应商'
            }
            //短驳物流
            if (vm.needLogitics && vm.needLogitics != 'false') {
                if (!vm.sendProvinceId || !vm.sendCityId || !vm.sendDistrictId || !vm.sendAddress) {
                    return '请输入拉货地址'
                }
            }
            if (!vm.receiveProvinceId || !vm.receiveCityId || !vm.receiveDistrictId || !vm.receiveAddress) {
                //return '请输入退货地址'
            }

            if (vm.packingSlipSourceStateRequest == undefined || !vm.packingSlipSourceStateRequest.state) {
                return '请输入期货现货';
            } else {
                if (vm.packingSlipSourceStateRequest.state == 1) {
                    if (vm.packingSlipSourceStateRequest.isCod == null) {
                        return '请输入是否货到付款';
                    }
                }
                if (vm.packingSlipSourceStateRequest.state == 2) {
                    if (vm.packingSlipSourceStateRequest.advanceTime == null) {
                        return '请输入预付时长';
                    }
                    if (vm.packingSlipSourceStateRequest.advanceTime > 15) {
                        return '预付时长不能大于15天';
                    }
                    if (vm.packingSlipSourceStateRequest.advanceTime <= 0) {
                        return '预付时长不能小于1天';
                    }
                }

                if (vm.packingSlipSourceStateRequest.state == 3) {
                    if (vm.packingSlipSourceStateRequest.paymentSeq == null) {
                        return '请输入首款尾款';
                    }

                    if (vm.packingSlipSourceStateRequest.paymentSeq == 2 && vm.showAccountNum == 2) {
                        return '请选择首款';
                    }
                }
            }

            if (vm.disablePaperTube == 1) {
                if (vm.lengthShortFall== null) {
                    return '请输入米差'
                }
            }

            if (vm.disablePaperTube == 2) {
                if (vm.weightShortFall==null) {
                    return '请输入空差'
                }
                if (vm.paperTube == null) {
                    return '请输入纸管'
                }
            }


            var len = vm.detailList.length;
            if (!vm.detailList || len == 0) {
                return '请输入码单明细'
            }

            if (vm.rootCategoryId == 1) {
                var mddetailText = '';
                for (var i = 0; i < len; i++) {
                    var detail = vm.detailList[i];

                    if (!detail.colorName || !detail.colorNo || !detail.typeName || !detail.amountList ||
                        detail.amountList.length == 0 || !detail.procurementPrice || !detail.standPrice ||
                        detail.procurementPrice > detail.standPrice) {
                        mddetailText += '码单明细第' + (i + 1) + '行的';
                        if (!detail.colorName) {
                            mddetailText += '颜色 '
                        }
                        if (!detail.colorNo) {
                            mddetailText += '色号 '
                        }
                        if (!detail.typeName) {
                            mddetailText += '类型 '
                        }
                        var amount = 0;
                        if (detail.amountList && detail.amountList.length > 0) {
                            for (var k = 0; k < detail.amountList.length; k++) {
                                amount += 1 * detail.amountList[k];
                            }
                        }
                        if (!detail.amountList || amount == 0) {
                            mddetailText += '数量明细  '
                        }
                        if (!detail.procurementPrice) {
                            mddetailText += '采购价 '
                        }
                        if (detail.procurementPrice > detail.standPrice) {
                            mddetailText += '采购价要小于等于链尚价 '
                        }
                    }
                }
                if (mddetailText != '') {
                    return mddetailText;
                }
            } else if (vm.rootCategoryId == 2) {
                var mddetailText = '';
                for (var i = 0; i < len; i++) {
                    var detail = vm.detailList[i];
                    if (!detail.specification || !detail.typeName || !detail.allAmount || !detail.procurementPrice) {
                        mddetailText += '码单明细第' + (i + 1) + '行的';
                        if (!detail.specification) {
                            mddetailText += '规格 '
                        }
                        if (!detail.typeName) {
                            mddetailText += '类型 '
                        }
                        if (!detail.allAmount) {
                            mddetailText += '数量 '
                        }
                        if (!detail.procurementPrice) {
                            mddetailText += '采购价 '
                        }
                        mddetailText += ',';
                    }
                }
                if (mddetailText != '') {
                    return mddetailText;
                }
            }
            return false;
        }

        $scope.range = function (n) {
            return new Array(n);
        };
        $scope.rangeSku = function (sku) {
            var amountList = sku.amountList || [];
            var len = amountList.length;
            var n = Math.ceil(len / 5);
            return $scope.range(n);
        };
        $scope.$watch('$viewContentLoaded', function () {
            //商家名片上传
            newOssUpload($('#imgUploadIdCard')[0], function (imgurls) {
                $scope.vm.businessCardPicList = $scope.vm.businessCardPicList || [];
                $scope.vm.businessCardPicList = $scope.vm.businessCardPicList.concat(imgurls);
                $scope.$apply();
            });

            //卖家码单图片上传
            newOssUpload($('#packingSlipUpload')[0], function (imgurls) {
                $scope.vm.certificate = $scope.vm.certificate || [];
                $scope.vm.certificate = $scope.vm.certificate.concat(imgurls);
                $scope.$apply();
            });
        });

        // 关联订单选择框
        $scope.changeTrade = function () {

            var modalInstance = $uibModal.open({
                templateUrl: 'app/requestInquiry-management-mgmt/modal/chooseTrade.html?v=' + LG.appConfig.clientVersion,
                size: 'md',
                keyboard: false,
                controller: 'chooseTradeCtrl',
                resolve: {
                    tradeList: function () {
                        return $scope.tradeList;
                    },
                    previousPaymentTradeId: function () {
                        return $scope.vm.packingSlipSourceStateRequest.previousPaymentTradeId;
                    }

                }
            });
            modalInstance.result.then(function (result) {
                $scope.vm.packingSlipSourceStateRequest.previousPaymentTradeId = result.tradeNum;
            });
        };
    }

    angular
        .module('app.request-inquiry-management')
        .controller('startPackingSlipCtrl', startPackingSlipCtrl)


})();