/**
 * sample-print-qr-modal.controller
 */
(function () {

    'use strict';

    printDemandQrCodeModalCtrl.$inject =
        ['$scope', '$uibModalInstance', '$uibModal', '$compile',
            'demandMgmtService', 'toaster', '$filter',
            '$sce', 'demandId'];

    function printDemandQrCodeModalCtrl($scope, $uibModalInstance, $uibModal, $compile, demandMgmtService, toaster, $filter,
                                        $sce, demandId) {
        var vm = $scope;

        initData();
        function initData() {
            demandMgmtService.getDemandQrCode(demandId).then(function (resp) {

                if(resp.status==200){
                    $scope.qrUrl = resp.config.url;
                }else{
                    toaster.error('生成失败')
                }
            });
        }

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };

    }

    angular
        .module('app.demand-mgmt')
        .controller('printDemandQrCodeModalCtrl', printDemandQrCodeModalCtrl);
})();