/**
 * Created by joey on 2017/8/15.
 */

(function () {

    'use strict';

    modifyLsPriceCtrl.$inject = ['$scope', '$http', '$uibModal', '$uibModalInstance', '$filter', '$compile', 'toaster','packingSlipMgmtService','packingSlipId','opener'];

    function modifyLsPriceCtrl($scope, $http, $uibModal, $uibModalInstance, $filter, $compile, toaster,packingSlipMgmtService,packingSlipId,opener) {
        var vm = this;


        // 链尚价格比率,目前为1.2%;
        var lsRate = 0;
        $scope.lsPriceList = {};

        // 改变链尚网
        $scope.changeLsPrice = function(detailId) {
            var list = $scope.lsPriceList.list;
            for (var i = 0, j = list.length;i < j; i++) {
                if (list[i].detailId == detailId) {
                    var lsPrice = list[i].lsPrice;
                    if (lsPrice) {
                        // list[i].lsPrice =  $filter('number')(Math.ceil(mul(lsPrice,100)) / 100, 2);
                        list[i].lsPrice =  Math.ceil(mul(lsPrice,100)) / 100;
                        list[i].lsFee = Number(mul(list[i].lsPrice,list[i].totalAmount).toFixed(2));
                        list[i].lsFee = Number(mul(list[i].lsPrice,list[i].totalAmount).toFixed(2));
                        $scope.skuInfo = initSum(list);
                    }
                }
            }
        };


        $scope.changePmPrice = function(detailId) {
            var list = $scope.lsPriceList.list;
            for (var i = 0, j = list.length;i < j; i++) {
                if (list[i].detailId == detailId) {
                    var lsPrice = list[i].procurementPrice;
                    if (lsPrice) {
                        // list[i].lsPrice =  $filter('number')(Math.ceil(mul(lsPrice,100)) / 100, 2);
                        list[i].procurementPrice =  Math.ceil(mul(lsPrice,100)) / 100;
                        list[i].procurementFee = Number(mul(list[i].procurementPrice,list[i].totalAmount).toFixed(2));
                        list[i].procurementFee = Number(mul(list[i].procurementPrice,list[i].totalAmount).toFixed(2));
                        $scope.skuInfo = initSum(list);
                    }
                }
            }
        };

        // 点击提交操作
        $scope.ok = function() {
            var list = $scope.lsPriceList.list;
            var priceData = [];
            var priceObj = {};
            for (var i = 0, j = list.length; i < j; i++) {
                if (list[i].lsPrice === null) {
                    showToaster('error','第' + (i + 1) + '个输入框链尚价不能为空');
                    return;
                } else if (list[i].lsPrice === undefined) {
                    showToaster('error','第' + (i + 1) + '个输入框链尚价填写不规范');
                    return;
                } else if (list[i].lsPrice || list[i].lsPrice === 0) {
                    // 样布
                    if (list[i].type === '样布') {
                        if (list[i].procurementPrice > list[i].lsPrice) {
                            showToaster('error','第' + (i + 1) + '个输入框链尚价需大于等于采购价');
                            return;
                        }
                    // 大货
                    } else if (list[i].type === '大货') {
                        if (mul(list[i].procurementPrice,1 + lsRate) > list[i].lsPrice) {
                            showToaster('error','第' + (i + 1) + '个输入框输入的链尚价必须>=（1+1.2%）*采购价');
                            return;
                        }
                    }
                    priceObj = {
                        detailId: list[i].detailId,
                        price: Number(list[i].lsPrice),
                        procurementPrice:Number(list[i].procurementPrice)
                    }
                    priceData.push(priceObj);
                }
            }


            packingSlipMgmtService.modifyLsPrice(packingSlipId,priceData).then(function(resp) {
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


        // 初始化获取修改链尚价列表
        packingSlipMgmtService.getLsPriceList(packingSlipId).then(function(resp) {
            if (resp.data.code == 200) {
                $scope.lsPriceList = resp.data.data;
                $scope.skuInfo = initSum($scope.lsPriceList.list);
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
            var sumTotalAmount = 0;
            var sumProcurementFee = 0;
            var sumLsFee = 0;
            for (var i = 0,j = list.length; i < j; i++) {
                sumTotalAmount = add(sumTotalAmount,list[i].totalAmount);
                sumProcurementFee = add(sumProcurementFee,list[i].procurementFee);
                sumLsFee = add(sumLsFee,list[i].lsFee);
            }

            // 采购金额小数点第三位四舍五入
            sumProcurementFee = Number(sumProcurementFee.toFixed(2));
            sumLsFee = Number(sumLsFee.toFixed(2));

            return {
                sumTotalAmount:sumTotalAmount,
                sumProcurementFee: sumProcurementFee,
                sumLsFee:sumLsFee
            };
        }
    }

    angular
        .module('app.packing-slip-management')
        .controller('modifyLsPriceCtrl', modifyLsPriceCtrl)
})();