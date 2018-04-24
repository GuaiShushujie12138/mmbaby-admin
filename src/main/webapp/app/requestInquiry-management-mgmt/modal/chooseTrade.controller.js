(function () {

    'use strict';

    chooseTradeCtrl.$inject = ['$scope', '$http', '$uibModal', '$uibModalInstance', '$filter', '$compile', 'toaster', 'requestInquiryMgmtService', 'tradeList','previousPaymentTradeId'];

    function chooseTradeCtrl($scope, $http, $uibModal, $uibModalInstance, $filter, $compile, toaster, requestInquiryMgmtService, tradeList,previousPaymentTradeId) {

        $scope.ok = function () {
            $scope.vm.relatedTrade =null;
            $('.tradeRadio').each(function() {
                if ($(this).is(':checked')) {
                    $scope.vm.relatedTrade = $(this).val();
                }
            })

            console.log($scope.vm.relatedTrade);
            var closeData = {
                tradeNum: $scope.vm.relatedTrade
            };
            $uibModalInstance.close(closeData);
        }


        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        }

        //初始化标准
        function init() {
            $scope.vm={};
            $scope.tradeList = tradeList;
            $scope.vm.relatedTrade = previousPaymentTradeId;
            console.log($scope.previousPaymentTradeId);

        }
        init();
    }

    angular
        .module('app.request-inquiry-management')
        .controller('chooseTradeCtrl', chooseTradeCtrl)
})();