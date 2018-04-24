/**
 * Created by zhenyu on 2016/10/26.
 */

(function () {

    'use strict';

    AllocateBatchCtrl.$inject = ['$scope', '$uibModal', '$uibModalInstance', 'DTColumnBuilder', 'DTOptionsBuilder', 'DTColumnDefBuilder', 'toaster', 'customerMgmtService', 'buyerList', 'sellerList', 'rowObjs', 'customerIds', 'opener'];
    /**
     * AllocateBatchCtrl
     */
    function AllocateBatchCtrl($scope, $uibModal, $uibModalInstance, DTColumnBuilder, DTOptionsBuilder, DTColumnDefBuilder, toaster, customerMgmtService, buyerList, sellerList, rowObjs, customerIds, opener) {

        if(!isEmpty(rowObjs)) {
            for (var i in rowObjs) {
                rowObjs[i].successRegionStatus = ""

                rowObjs[i].failRegionStatus = ""
                if(!isEmpty(rowObjs[i].buyerRelInfo)) {
                    rowObjs[i].hasBuyerRelInfo = true;
                }
                if(!isEmpty(rowObjs[i].sellerRelInfo)) {
                    rowObjs[i].hasSellerRelInfo = true;
                }
            }
        }

        $scope.modal = {};
        $scope.customerList = rowObjs;

        if(isEmpty(buyerList)) {
            buyerList = []
        }
        buyerList.unshift({'id': -1, 'realName': '区部公海'})

        if(isEmpty(sellerList)) {
            sellerList = []
        }
        sellerList.unshift({'id': -1, 'realName': '区部公海'})

        $scope.buyerList = buyerList

        $scope.sellerList = sellerList


        $scope.dtOptions = DTOptionsBuilder.newOptions()
            .withDOM('frtl')
            .withOption('searching', false)
            .withOption('lengthChange', false)
            .withOption('autoWidth', false)
            .withOption('scrollX', true)
            .withOption('displayLength', 10000)
            .withPaginationType('full_numbers');

        $scope.dtColumnDefs = [
            DTColumnDefBuilder.newColumnDef(0).notSortable(),
            DTColumnDefBuilder.newColumnDef(1).notSortable(),
            DTColumnDefBuilder.newColumnDef(2).notSortable(),
            DTColumnDefBuilder.newColumnDef(3).notSortable(),
            DTColumnDefBuilder.newColumnDef(4).notSortable(),
            DTColumnDefBuilder.newColumnDef(5).notSortable(),
            DTColumnDefBuilder.newColumnDef(6).notSortable(),

        ];


        $scope.ok = function () {
            $scope.okBtnDisabled = true;
            if(isEmpty($scope.modal.buyerOperatorId)) {
                $scope.modal.buyerOperatorId = '0';
            };
            if(isEmpty($scope.modal.sellerOperatorId)) {
                $scope.modal.sellerOperatorId = '0';
            };


            $uibModal.open({
                templateUrl: 'app/customer-mgmt/modal/confirm.html?v=' + LG.appConfig.clientVersion,
                keyboard: false,
                controller: function ($scope, $uibModalInstance,tempScope, rowObjects) {
                    $scope.modal = {}
                    $scope.modal.typeText = "批量分配操作";

                    $scope.ok = function () {
                        $scope.okBtnDisabled = true;
                        customerMgmtService.allocateBatchCustomer(customerIds, tempScope.modal.buyerOperatorId, tempScope.modal.sellerOperatorId)
                            .then(function successCallback(response) {
                                //debugger;
                                console.log(">>>>>response");
                                console.log(response.data);

                                toaster.pop({
                                    type: response.data.code == 200 ? 'success' : 'error',
                                    title: "提示信息",
                                    body: response.data.message,
                                    showCloseButton: true,
                                    timeout: 5000
                                });
                                if(response.data.code == 200) {
                                    var successMap = response.data.data.successMap;
                                    var failMap = response.data.data.failMap;
                                    var operators = response.data.data.operators;

                                    for (var i in rowObjects) {
                                        var successMsg = isEmpty(successMap[rowObjects[i].id]) ? "" : successMap[rowObjects[i].id];
                                        var failMsg = isEmpty(failMap[rowObjects[i].id]) ? "" : failMap[rowObjects[i].id];
                                        var operator = operators[rowObjects[i].id];

                                        rowObjects[i].successRegionStatus = successMsg;
                                        rowObjects[i].failRegionStatus = failMsg


                                        if(!isEmpty(operator.buyerOperatorFullReginName)) {
                                            rowObjects[i].hasBuyerRelInfo = true;
                                            rowObjects[i].buyerRelInfo = operator.buyerOperatorFullReginName
                                        } else{
                                            rowObjects[i].hasBuyerRelInfo = false;
                                            rowObjects[i].buyerRelInfo = ""
                                        }
                                        if(!isEmpty(operator.sellerOperatorFullReginName)) {
                                            rowObjects[i].hasSellerRelInfo = true;
                                            rowObjects[i].sellerRelInfo = operator.sellerOperatorFullReginName
                                        } else{
                                            rowObjects[i].hasSellerRelInfo = false;
                                            rowObjects[i].sellerRelInfo = ""
                                        }

                                    };
                                    tempScope.customerList = rowObjects;
                                }
                            })
                            .finally(function () {
                                tempScope.okBtnDisabled = false;
                                $scope.okBtnDisabled = false;
                                $uibModalInstance.close();

                            });
                    };

                    $scope.cancel = function () {
                        tempScope.okBtnDisabled = false;
                        $uibModalInstance.dismiss('cancel');
                    };
                },
                resolve: {
                    tempScope: function () {
                        return $scope
                    }, rowObjects: function () {
                        return rowObjs
                    }
                }
            });
        }

        $scope.cancel = function () {

            opener.dtInstance.reloadData();
            $uibModalInstance.dismiss('cancel');
        }

    }

    angular
        .module('app.customer-mgmt')
        .controller('AllocateBatchCtrl', AllocateBatchCtrl)

})();