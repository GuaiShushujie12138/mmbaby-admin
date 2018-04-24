/**
 * Created by zhenyu on 2016/10/22.
 */

(function () {

    'use strict';

    CustomerInPublicCtrl.$inject = ['$scope', '$uibModal', '$uibModalInstance', 'toaster', 'customerMgmtService', 'buyerList', 'sellerList','restNum'];
    /**
     * allotcustomerSeller
     */
    function CustomerInPublicCtrl($scope, $uibModal, $uibModalInstance, toaster, customerMgmtService, buyerList, sellerList,restNum) {

        var vm = this;

        function isEmpty(obj) {
            for (var name in obj) {
                return false;
            }
            return true;
        }
        $scope.hasBuyers = true
        $scope.hasSellers = true

        if(isEmpty(buyerList)) {
            $scope.hasBuyers = false
        }
        if(isEmpty(sellerList)) {
            $scope.hasSellers = false
        }


        $scope.buyerList = buyerList

        $scope.sellerList = sellerList

        $scope.mobile = ""
        $scope.info = null;
        $scope.authStatus = "";
        $scope.modal={};

        $scope.hasInfo = false;
        $scope.restNum = restNum;


        $scope.submit = function () {
            $scope.okBtnDisabled = false;
            $scope.hasInfo = false;
            $scope.info={};

            customerMgmtService.loadByMobileInPublic($scope.mobile).then(function successCallback(response) {
                console.log(response.data)

                if(response.data.data.code == -1){
                    toaster.pop({
                        type: 'error',
                        title: '出错啦',
                        body: response.data.message,
                        showCloseButton: true,
                        timeout: 5000
                    });
                    $scope.restNum = response.data.data.restNum;
                    return;
                }

                if(response.data.data.code == 200){
                    $scope.info = response.data.data.data
                    if(!isEmpty($scope.info)) {
                        var customer = $scope.info;
                        $scope.restNum = customer.restNum
                        $scope.hasInfo = true;

                        if(customer.regionId > 0 && customer.regionId != customer.crmUserRegionId) {
                            $scope.okBtnDisabled = true;
                        };
                    }
                }else{
                    $scope.restNum = response.data.data
                }

            })
        };


        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };


        $scope.ok = function () {
            $scope.okBtnDisabled = true;
            if(isEmpty($scope.modal.buyerOperatorId)){
                $scope.modal.buyerOperatorId = '0';
            };
            if(isEmpty($scope.modal.sellerOperatorId)){
                $scope.modal.sellerOperatorId = '0';
            };


            customerMgmtService.gainCustomerInPublic($scope.info.customerId, $scope.modal.buyerOperatorId, $scope.modal.sellerOperatorId)
                .then(function successCallback(response) {
                    toaster.pop({
                        type: response.data.code == 200 ? 'success' : 'error',
                        title: "提示信息",
                        body: response.data.message,
                        showCloseButton: true,
                        timeout: 5000
                    });
                    if(response.data.code == 200) {
                        $uibModalInstance.close();
                    }
                })
                .finally(function () {
                    $uibModalInstance.close();
                    $scope.okBtnDisabled = false;
                });
        };


    }

    angular
        .module('app.customer-mgmt')
        .controller('CustomerInPublicCtrl', CustomerInPublicCtrl)

})();