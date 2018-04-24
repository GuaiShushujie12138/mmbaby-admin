/**
 * Created by joey on 2017/8/15.
 */

(function () {

    'use strict';

    slipDetailCtrl.$inject = ['$scope', '$http', '$uibModal', '$uibModalInstance', '$filter', '$compile', 'toaster', 'packingSlipMgmtService', 'packingSlipId'];

    function slipDetailCtrl($scope, $http, $uibModal, $uibModalInstance, $filter, $compile, toaster, packingSlipMgmtService, packingSlipId) {
        var vm = this;
        packingSlipMgmtService.getSlipDetail(packingSlipId).then(function (resp) {
            if (resp.data.code == 200) {
                $scope.packingSlip = resp.data.data;
                $scope.fabric = resp.data.data.fabric;
                $scope.accessory = resp.data.data.accessory;

                // 定义材质是面料还是辅料
                if ($scope.fabric) {
                    $scope.material = 1;
                    $scope.fabricSkuInfo = initSum($scope.fabric.skuList);
                    $scope.hasRoleToPrice = hasRoleToPrice($scope.fabric.skuList);
                } else {
                    $scope.material = 2;
                    $scope.accessorySkuInfo = initSum($scope.accessory.skuList);
                    $scope.hasRoleToPrice = hasRoleToPrice($scope.accessory.skuList);
                }
            } else {
                toaster.pop({
                    type: 'error',
                    title: '提示信息',
                    body: '请求异常',
                    showCloseButton: true,
                    timeout: 5000
                });
            }
        });

        $scope.clickImg = function (event, url) {
            event.stopPropagation();
            var fragment = document.querySelector('.imgFragment');
            if (!fragment) {
                fragment = document.createElement('div');
                var img = document.createElement('img');
                img.src = url;
                img.style.cssText = 'position: absolute; height: 100%; top: 0;left: 50%; transform: translateX(-50%)';
                fragment.appendChild(img);
                fragment.style.cssText = 'position: fixed;width: 800px;height: 600px;left: 50%;top: 50%;margin-top: -300px;margin-left: -400px;background-color: rgba(0,0,0,0.4);z-index: 9999;';
                fragment.className = 'imgFragment';
                document.body.appendChild(fragment);
            }
        }

        document.body.addEventListener('click', function (e) {
            var fragment = document.querySelector('.imgFragment');
            if (fragment) {
                document.body.removeChild(fragment);
            }
        });


        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        }

        function hasRoleToPrice(list) {
            for (var i = 0,j = list.length; i < j; i++) {
                var procurementPrice = list[i].procurementPrice;
                if (typeof procurementPrice == 'string' && procurementPrice.indexOf('*') !== -1) {
                    return false;
                }
            }
            return true;
        }

        function initSum(list) {
            var sumProcurementFee = 0;
            var sumStandFee = 0;
            var sumSaleFee = 0;
            for (var i = 0, j = list.length; i < j; i++) {
                sumProcurementFee = add(sumProcurementFee, list[i].procurementFee);
                sumStandFee = add(sumStandFee, list[i].standFee);
                sumSaleFee = add(sumSaleFee, list[i].saleFee);
            }

            // 采购金额小数点第三位四舍五入
            sumStandFee = Number(sumStandFee.toFixed(2));
            sumSaleFee = Number(sumSaleFee.toFixed(2));
            sumProcurementFee = Number(sumProcurementFee.toFixed(2));

            return {
                sumProcurementFee: sumProcurementFee,
                sumStandFee: sumStandFee,
                sumSaleFee: sumSaleFee
            };
        }

        // 浮点数 精确相乘做法
        function mul(a, b) {
            var c = 0,
                d = a.toString(),
                e = b.toString();
            try {
                c += d.split(".")[1].length;
            } catch (f) {
            }
            try {
                c += e.split(".")[1].length;
            } catch (f) {
            }
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
            return (mul(a, e) + mul(b, e)) / e;
        }
    }

    angular
        .module('app.packing-slip-management')
        .controller('slipDetailCtrl', slipDetailCtrl)
})();