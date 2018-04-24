/**
 * re-create-print-sample.modal.controller
 */
(function () {

    'use strict';

    ReCreatePrintSampleModalCtrl.$inject =
        ['$scope', '$uibModalInstance', '$uibModal', '$compile',
            'sampleMgmtService', 'toaster', 'selectedSampleIds', 'listData'];

    function ReCreatePrintSampleModalCtrl($scope, $uibModalInstance, $uibModal,
                                          $compile, sampleMgmtService, toaster, selectedSampleIds, listData) {
        var vm = $scope;

        $scope.shop = {};
        $scope.sample = {};
        $scope.item = {};

        $scope.selectedSampleIds = selectedSampleIds;
        var selectedSampleCodes = selectedSampleIds.map(function (item) {
            var rowData = listData[item];
            var sampleCode = rowData.sampleCode;
            return sampleCode;
        });

        $scope.selectedSampleCodes = selectedSampleCodes;

        $scope.confirm = function () {

            sampleMgmtService.reCreateAndPrintSamples(selectedSampleIds).then(function call(resp) {
                if (resp.data.code == 200) {
                    var sampleIds = resp.data.data.sampleIds;
                    var modalInstance = $uibModal.open({
                        templateUrl: 'app/sample-mgmt/modal/print-batch-qr-code.html?v=' + LG.appConfig.clientVersion,
                        keyboard: false,
                        controller: 'PrintBatchQrCodeModalCtrl',
                        resolve: {
                            selectedSampleIds: function () {
                                return sampleIds;
                            },
                            sendType: function () {
                                return $scope.sample.sendType;
                            }
                        }
                    });
                }
            });
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };

    }

    angular
        .module('app.sample-mgmt')
        .controller('ReCreatePrintSampleModalCtrl', ReCreatePrintSampleModalCtrl);

})();