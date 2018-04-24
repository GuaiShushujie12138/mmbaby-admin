(function() {

    'use strict';

    EditGainsFeeCtrl.$inject = [ '$scope',  '$uibModalInstance','$http', '$uibModal', '$filter', '$compile', 'toaster', 'tradeId', 'gainsFee','maxGainsFee','gainsMemo', 'tradeMgmtService'];

    function EditGainsFeeCtrl($scope,$uibModalInstance, $http, $uibModal, $filter, $compile, toaster, tradeId, gainsFee,maxGainsFee,gainsMemo, tradeMgmtService) {
        var vm = $scope;
       
        vm.modal = {};
        init();

        function init() {
            vm.modal.tradeId = tradeId;
            vm.modal.gainsFee = gainsFee;
            vm.modal.maxGainsFee = maxGainsFee;
            vm.modal.gainsMemo = gainsMemo;
        }

        $scope.ok = function () {
            $scope.okBtnDisabled = true;

            if(vm.modal.gainsFee<0){
                toaster.pop({
                    type: 'error',
                    title: '提示信息',
                    body:'金额输入错误：营收金额不能为负数且必须小于订单金额',
                    showCloseButton: true,
                    timeout: 5000
                });
                $scope.okBtnDisabled = false;
                return;
            }
            if(vm.modal.gainsFee>vm.modal.maxGainsFee){
                toaster.pop({
                    type: 'error',
                    title: '提示信息',
                    body:'金额输入错误：营收金额不能超过最大打款金额',
                    showCloseButton: true,
                    timeout: 5000
                });
                $scope.okBtnDisabled = false;
                return;
            }

            //var reg = new RegExp("(\.\d{0,2})?");
            var reg = /^\d+\.?(\d{1,2})?$/gi;
            var flag = reg.test(vm.modal.gainsFee);
            if(!flag){
                toaster.pop({
                    type: 'error',
                    title: '提示信息',
                    body:'金额输入错误：营收金额最多只能有两位小数',
                    showCloseButton: true,
                    timeout: 5000
                });
                $scope.okBtnDisabled = false;
                return;
            }
            if(!vm.modal.gainsMemo){
                toaster.pop({
                    type: 'error',
                    title: '提示信息',
                    body:'金额备注不能为空',
                    showCloseButton: true,
                    timeout: 5000
                });
                $scope.okBtnDisabled = false;
                return;
            }
            tradeMgmtService.modifyGainsFee(vm.modal.tradeId, vm.modal.gainsFee,vm.modal.gainsMemo)
                .then(function successCallback(response){
                    toaster.pop({
                        type: response.data.code == 200 ? 'success' : 'error',
                        title: '提示信息',
                        body: response.data.message,
                        showCloseButton: true,
                        timeout: 5000
                    });
                    if (response.data.code == 200) {
                        $uibModalInstance.close();
                    }
                }).finally(function() {
                    $scope.okBtnDisabled = false;
                });

        };


        $scope.cancel = function() {
            $uibModalInstance.dismiss('cancel');
        };
    }

    angular
        .module('app.trade-mgmt')
        .controller('EditGainsFeeCtrl', EditGainsFeeCtrl);

})();