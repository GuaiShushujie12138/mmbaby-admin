/**
 * Created by joey on 2017/8/15.
 */

(function () {

    'use strict';

    modifySalePriceCtrl.$inject = ['$scope', '$http', '$uibModal', '$uibModalInstance', '$filter', '$compile', 'toaster','packingSlipMgmtService','packingSlipId','opener','selectData'];

    function modifySalePriceCtrl($scope, $http, $uibModal, $uibModalInstance, $filter, $compile, toaster,packingSlipMgmtService,packingSlipId,opener,selectData) {
        var vm = this;
        $scope.requestInquiryId = selectData.requestInquiryId;
        $scope.salePriceList = {};
        $scope.pattern = 1;
        $scope.batchChangeValue='';
        $scope.isClickBatch=0;


        // 改变销售价
        $scope.changeSalePrice = function(detailId) {
            var list = $scope.salePriceList.list;
            // 存入营收比例
            for(var i=0;i<list.length;i++){
                $scope.salePriceList.list[i].proportion = Number(((list[i].salePrice-list[i].lsPrice)*100/list[i].salePrice).toFixed(2));
            }
            console.log($scope.salePriceList.list);
            for (var i = 0, j = list.length;i < j; i++) {
                if (list[i].detailId == detailId) {
                    var salePrice = list[i].salePrice;
                    if (salePrice) {
                        list[i].salePrice = Math.ceil(mul(salePrice,100)) / 100;
                        list[i].saleFee = Number(mul(list[i].salePrice,list[i].totalAmount).toFixed(2));
                        $scope.skuInfo = initSum(list);
                    }else{
                        $scope.salePriceList.list[i].proportion = 0;
                    }
                }
                if(!list[i].salePrice){
                    $scope.salePriceList.list[i].proportion = 0;
                }
            }
        };

        //改变营收比例
        $scope.changeProportionPrice = function(detailId) {
            var list = $scope.salePriceList.list;
            // 存入营收比例
            for(var i=0;i<list.length;i++){
                $scope.salePriceList.list[i].salePrice = Number((list[i].lsPrice*100/(100-list[i].proportion)).toFixed(2));
            }
            for (var i = 0, j = list.length;i < j; i++) {
                if (list[i].detailId == detailId) {
                    var salePrice = list[i].salePrice;
                    if (salePrice) {
                        list[i].salePrice = Math.ceil(mul(salePrice,100)) / 100;
                        list[i].saleFee = Number(mul(list[i].salePrice,list[i].totalAmount).toFixed(2));
                        $scope.skuInfo = initSum(list);
                    }
                }
            }
        };

        // 批量设置
        $scope.batchSetting = function (){
            var batchChangeValue = Number($scope.batchChangeValue);
            if(batchChangeValue==''||batchChangeValue==undefined ||batchChangeValue<=0 ||isNaN(batchChangeValue)){
                toaster.pop({
                    type: 'error',
                    title: '提示信息',
                    body:   '请输入有效数字',
                    showCloseButton: true,
                    timeout: 5000
                });
            }else{
                var list = $scope.salePriceList.list;
                if($scope.pattern==1){
                    for(var i=0;i<list.length;i++){
                        $scope.salePriceList.list[i].salePrice = batchChangeValue;
                        $scope.salePriceList.list[i].proportion = Number(((list[i].salePrice-list[i].lsPrice)*100/list[i].salePrice).toFixed(2));
                        var salePrice = list[i].salePrice;
                        if (salePrice) {
                            $scope.salePriceList.list[i].salePrice = Math.ceil(mul(salePrice,100)) / 100;
                            $scope.salePriceList.list[i].saleFee = Number(mul(list[i].salePrice,list[i].totalAmount).toFixed(2));
                            $scope.skuInfo = initSum($scope.salePriceList.list[i]);
                        }
                    }
                    $scope.skuInfo = initSum($scope.salePriceList.list);
                }else if($scope.pattern==2){
                    for(var i=0;i<list.length;i++){
                        $scope.salePriceList.list[i].proportion = batchChangeValue;
                        $scope.salePriceList.list[i].salePrice = Number((list[i].lsPrice*100/(100-list[i].proportion)).toFixed(2));
                        var salePrice = list[i].salePrice;
                        if (salePrice) {
                            $scope.salePriceList.list[i].salePrice = Math.ceil(mul(salePrice,100)) / 100;
                            $scope.salePriceList.list[i].saleFee = Number(mul(list[i].salePrice,list[i].totalAmount).toFixed(2));
                            $scope.skuInfo = initSum($scope.salePriceList.list[i]);
                        }
                    }
                    $scope.skuInfo = initSum($scope.salePriceList.list);
                }
            }
            console.log($scope.salePriceList.list);
        };


        // 修改模式
        $scope.changePattern = function (event){
            var pattern = $('input[name="pattern"]:checked').val();
            if(pattern==1){
                $scope.pattern=1;
            }else if(pattern==2){
                $scope.pattern=2;
            }
        };

        // 点击提交操作
        $scope.ok = function() {
            var list = $scope.salePriceList.list;
            var priceData = [];
            var priceObj = {};
            for (var i = 0, j = list.length; i < j; i++) {
                if (list[i].salePrice === null) {
                    showToaster('error','第' + (i + 1) + '个输入框销售价不能为空');
                    return;
                } else if (list[i].salePrice === undefined) {
                    showToaster('error','第' + (i + 1) + '个输入框销售价填写不规范');
                    return;
                } else if (list[i].salePrice || list[i].salePrice === 0) {
                    if (list[i].salePrice < list[i].lsPrice) {
                        showToaster('error','第' + (i + 1) + '个输入框销售价需大于链尚价');
                        return;
                    }
                    priceObj = {
                        detailId: list[i].detailId,
                        price: Number(list[i].salePrice)
                    }
                    priceData.push(priceObj);
                }
            }
            packingSlipMgmtService.modifySalePrice(packingSlipId,priceData).then(function(resp) {
                if (resp.data.code == 200) {
                    toaster.pop({
                        type: 'success',
                        title: '提示信息',
                        body:   resp.data.message,
                        showCloseButton: true,
                        timeout: 5000
                    });
                    opener.submit();
                    $uibModalInstance.dismiss('cancel');

                } else {
                    toaster.pop({
                        type: 'error',
                        title: '提示信息',
                        body:   '请求异常',
                        showCloseButton: true,
                        timeout: 5000
                    });
                }
            });
        }


        // 初始化获取修改销售价列表
        packingSlipMgmtService.getSalePriceList(packingSlipId).then(function(resp) {
            if (resp.data.code == 200) {
                $scope.salePriceList = resp.data.data;
                $scope.isEfCustomer = resp.data.data.isEfCustomer;
                $scope.skuInfo = initSum($scope.salePriceList.list);
                $scope.skuInfo.revenueRatio = mul(resp.data.data.revenueRate || 0,100);

                var list = $scope.salePriceList.list;
                // 存入营收比例
                for(var i=0;i<list.length;i++){
                    if($scope.salePriceList.list[i].salePrice==0){
                        $scope.salePriceList.list[i].proportion=0;
                    }else{
                        $scope.salePriceList.list[i].proportion = Number(((list[i].salePrice-list[i].lsPrice)*100/list[i].salePrice).toFixed(2));
                    }
                }
            } else {
                toaster.pop({
                    type: 'error',
                    title: '提示信息',
                    body:   '请求异常',
                    showCloseButton: true,
                    timeout: 5000
                });
            }
        });

        $scope.cancel = function() {
            $uibModalInstance.dismiss('cancel');
        }


        // 浮点数 精确相乘做法
        function mul(a, b) {
            var c = 0,
                d = a.toString(),
                e = b.toString();
            try {
                c += d.split(".")[1].length;
            } catch (f) {}
            try {
                c += e.split(".")[1].length;
            } catch (f) {}
            return Number(d.replace(".", "")) * Number(e.replace(".", "")) / Math.pow(10, c);
        }

        // 浮点数 精确相加算法
        function add(a, b) {
            var c, d, e;
            try {
                c = a.toString().split(".")[1].length;
            } catch (f) {
                c = 0;
            }
            try {
                d = b.toString().split(".")[1].length;
            } catch (f) {
                d = 0;
            }
            e = Math.pow(10, Math.max(c, d));
            return  (mul(a, e) + mul(b, e)) / e;
        }

        // 浮点数相除
        function div(a, b) {
            var c, d, e = 0,
                f = 0;
            try {
                e = a.toString().split(".")[1].length;
            } catch (g) {}
            try {
                f = b.toString().split(".")[1].length;
            } catch (g) {}

            c = Number(a.toString().replace(".", ""));
            d = Number(b.toString().replace(".", ""));
            if (d === 0) return 0;
            return  mul(c / d, Math.pow(10, f - e));
        }

        // 浮点数相减
        function sub(a, b) {
            var c, d, e;
            try {
                c = a.toString().split(".")[1].length;
            } catch (f) {
                c = 0;
            }
            try {
                d = b.toString().split(".")[1].length;
            } catch (f) {
                d = 0;
            }
            return e = Math.pow(10, Math.max(c, d)), (mul(a, e) - mul(b, e)) / e;
        }

        // 展现提示框
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

        function initSum(list) {
            var sumLsFee = 0;
            var sumSaleFee = 0;
            var revenueRatio = 0;
            for (var i = 0,j = list.length; i < j; i++) {
                sumLsFee = add(sumLsFee,list[i].lsFee);
                sumSaleFee = add(sumSaleFee,list[i].saleFee);
            }

            // 采购金额小数点第三位四舍五入
            sumLsFee = Number(sumLsFee.toFixed(2));
            sumSaleFee = Number(sumSaleFee.toFixed(2));
            revenueRatio = mul(Number(div(sub(sumSaleFee,sumLsFee),sumSaleFee).toFixed(4)),100);

            return {
                sumLsFee: sumLsFee,
                sumSaleFee:sumSaleFee,
                revenueRatio:revenueRatio
            };
        }
    }

    angular
        .module('app.packing-slip-management')
        .controller('modifySalePriceCtrl', modifySalePriceCtrl)
})();