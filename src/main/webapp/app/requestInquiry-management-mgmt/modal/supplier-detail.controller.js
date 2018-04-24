/**
 * Created by mf on 2017/8/15.
 */

(function () {

    'use strict';

    supplierDetailCtrl.$inject = ['$scope', '$http', '$uibModal', 'SweetAlert', '$uibModalInstance', '$filter', '$compile', 'toaster', 'requestInquiryMgmtService', 'DTOptionsBuilder', 'DTColumnBuilder', 'realShopId', 'niceShopId'];

    function supplierDetailCtrl($scope, $http, $uibModal, SweetAlert, $uibModalInstance, $filter, $compile, toaster, requestInquiryMgmtService, DTOptionsBuilder, DTColumnBuilder, realShopId, niceShopId) {


        $scope.niceShopId = niceShopId||0;
        $scope.realShopId = realShopId ||0;


        requestInquiryMgmtService.getSupplierDetail($scope.realShopId, $scope.niceShopId).then(function (resq) {
            toaster.pop({
                type: resq.data.code == 200 ? 'success' : 'error',
                title: '提示信息',
                body: resq.data.message,
                showCloseButton: true,
                timeout: 5000
            });
            $scope.vm = resq.data.data;
        });

        $scope.ok = function () {

            SweetAlert.swal({
                    title: '提示',
                    text: '您确定关联该名字为' + $scope.vm.supplierInfo.shopCompanyName + '的供应商?',
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
                        swal.close();
                        requestInquiryMgmtService.relatSupplier($scope.realShopId, $scope.niceShopId).then(function (resq) {
                            toaster.pop({
                                type: resq.data.code == 200 ? 'success' : 'error',
                                title: '提示信息',
                                body: resq.data.message,
                                showCloseButton: true,
                                timeout: 5000
                            });
                            if (resq.data.code == 200) {
                                $uibModalInstance.close(true);
                            }
                        });
                    }
                });
        };

        $scope.cancel = function () {
            $uibModalInstance.close();
        };
    }

    angular
        .module('app.request-inquiry-management')
        .controller('supplierDetailCtrl', supplierDetailCtrl);

})();