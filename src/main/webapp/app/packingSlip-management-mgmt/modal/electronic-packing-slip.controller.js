/**
 * Created by mf on 2017/10/12.
 */

(function () {

    'use strict';

    electronicPackingSlipCtrl.$inject = ['$scope', '$http', '$uibModal', '$uibModalInstance', '$filter', '$compile', 'toaster','packingSlipMgmtService','packingSlipId'];

    function electronicPackingSlipCtrl($scope, $http, $uibModal, $uibModalInstance, $filter, $compile, toaster,packingSlipMgmtService,packingSlipId) {
        $scope.vm = {};

        packingSlipMgmtService.getPackingSlipData(packingSlipId).then(function (data) {
            if(data.data.code == 200) {
                $scope.vm = data.data.data;
                if($scope.vm.rootCategoryId == 1){
                    $scope.vm.skuAndProperties = data.data.data.fabric;
                }else{
                    $scope.vm.skuAndProperties = data.data.data.accessory;
                }
                $scope.vm.productName = getProductName($scope.vm.skuAndProperties.itemProperties);
                $scope.vm.totalQuantity = calTotalQuantity($scope.vm.skuAndProperties.skuList)
                $scope.vm.totalPrice = calTotalPrice($scope.vm.skuAndProperties.skuList)
            }else {
                toaster.pop({
                    type: 'error',
                    title: '提示信息',
                    body: '获取电子码单信息错误，请关闭重新获取！',
                    showCloseButton: true,
                    timeout: 5000
                });
            }
        });

        //获取品名
        function getProductName(properTiesList) {
            var len = properTiesList.length;
            for(var i = 0; i < len; i++){
                if(properTiesList[i].propertyCode == 'PRODUCT_NAME'){
                    return properTiesList[i].values[0].valueName;
                }
            }
        }

        //计算总数量
        function calTotalQuantity(skuList) {
            var skuLen = skuList.length;
            var totalQuantityText = '';
            var totalObj = {};
            for(var n = 0; n < skuLen; n++){
                totalObj[skuList[n].measurementUnit] = totalObj[skuList[n].measurementUnit] || 0;
                totalObj[skuList[n].measurementUnit] += parseFloat(skuList[n].allAmount);
            }
            for(var key in totalObj){
                totalQuantityText += totalObj[key].toFixed(2) + key + ';';
            }
            return totalQuantityText;
        }

        //计算总价格
        function calTotalPrice(skuList) {
            var skuLen = skuList.length;
            var totalPrice = 0;
            for(var i = 0; i < skuLen; i++){
                totalPrice += parseFloat(skuList[i].saleFee);
            }
            return totalPrice.toFixed(2) + skuList[0].priceUnit;
        }

        $scope.cancel = function() {
            $uibModalInstance.dismiss('cancel');
        }
    }

    angular
        .module('app.packing-slip-management')
        .controller('electronicPackingSlipCtrl', electronicPackingSlipCtrl);

    angular
        .module('app.packing-slip-management')
        .filter('quantityFilter', function() { //可以注入依赖
        return function(text) {
            var nub = 5;
            var arr = text.split(';');
            var len = arr.length;
            var Arr = [];
            var ArrLen = Math.ceil(len/nub);
            for(var i = 0; i < ArrLen; i++){
                var ARR2 = [];
                for(var j = 0; j < nub; j++){
                    if(nub*i + j < len){
                        ARR2.push(arr[nub*i + j]);
                    }else {
                        ARR2.push('');
                    }
                }
                Arr.push(ARR2);
            }
            return Arr;
        }
    });
})();