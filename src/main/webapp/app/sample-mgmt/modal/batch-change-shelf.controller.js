/**
 * sample-print-qr-modal.controller
 */
(function () {

    'use strict';

    batchChangeShelfCtrl.$inject =
        ['$scope','$uibModalInstance','$uibModal','sampleMgmtService','sampleList','warehouseList','toaster'];


    function batchChangeShelfCtrl($scope, $uibModalInstance,$uibModal,sampleMgmtService,sampleList,warehouseList,toaster) {
        var vm = this;

        initData();
        function initData() {
            vm.shelfId = "";
            vm.warehouseId = "";
            vm.shelfList = [];
            vm.warehouseList = warehouseList;
            vm.sampleList = sampleList;
        }


        /**
         *  在点击了确认按钮之后
         */
        $scope.ok = function () {
            $scope.okBtnDisabled = true;
            if (!vm.shelfId || !vm.warehouseId) {
                toaster.pop({
                    type:'error',
                    title: '仓库或者货架不能为空',
                    body: "",
                    showCloseButton: true,
                    timeout: 5000
                })
                return;
            }
            sampleMgmtService.batchChangeShelf(vm.sampleList,vm.warehouseId,vm.shelfId).then(function(resp){
                if (resp.data.code === 200) {
                    toaster.pop({
                        type:'success',
                        title: resp.data.message,
                        body: "",
                        showCloseButton: true,
                        timeout: 5000
                    });
                    // 关闭当前页面并且刷新列表页
                    $scope.cancel();
                    opener.dtInstance.reloadData(function () {
                    }, false);
                }
            });

        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };

        /**
         * 在改变仓库时触发
         */
        $scope.changeWarehouse = function() {
            if (!vm.warehouseId) {
                vm.shelfList = [];
                vm.shelfId = "";
                return;
            } else {
                sampleMgmtService.getShelfListByWarehouse(vm.warehouseId).then(function(resp){
                    if (resp.data.code === 200) {
                        vm.shelfList = resp.data.data;
                    } else {
                        toaster.pop({
                            type: 'error',
                            title: resp.data.message,
                            body: "",
                            showCloseButton: true,
                            timeout: 5000
                        });
                    }
                });
            }
        }

    }

    angular
        .module('app.sample-mgmt')
        .controller('batchChangeShelfCtrl', batchChangeShelfCtrl);

})();