/**
 * Created by mf on 2017/8/15.
 */

(function () {

    'use strict';

    supplierListCtrl.$inject = ['$scope', '$http', '$uibModal', '$uibModalInstance', '$filter','$location', '$compile', 'toaster','requestInquiryMgmtService','DTOptionsBuilder','DTColumnBuilder','realShopId','realShopName','itemId'];

    function supplierListCtrl($scope, $http, $uibModal, $uibModalInstance, $filter,$location, $compile, toaster,requestInquiryMgmtService,DTOptionsBuilder,DTColumnBuilder,realShopId,realShopName,itemId) {

        var vm = $scope;

        $scope.realShopId = realShopId;
        $scope.realShopName = realShopName;
        $scope.draw = 1;

        $scope.dtInstance = {};

        $scope.dtOptions = DTOptionsBuilder
            .fromSource('')
            .withFnServerData(serverData)
            .withDataProp('data')
            .withOption('serverSide', true)
            .withOption('searching', false)
            .withOption('lengthChange', true)
            .withDOM('frtlip')
            .withOption('autoWidth', true)
            .withOption('scrollX', true)
            .withOption('lengthMenu', [10, 25, 50, 100, 200])
            .withOption('displayLength', 10)
            .withPaginationType('full_numbers')
            .withOption('createdRow', function (row, data, dataIndex) {
                $compile(angular.element(row).contents())($scope);
            })
            .withOption('headerCallback', function (header) {
                if (!vm.headerCompiled) {
                    vm.headerCompiled = true;
                    $compile(angular.element(header).contents())($scope);
                }
            });

        $scope.dtColumns = [
            DTColumnBuilder.newColumn(null).withTitle('操作').notSortable().withClass('text-center').withOption('width', '80px')
                .renderWith(actionsHtml),
            DTColumnBuilder.newColumn('shopName').withTitle('供应商名称').withClass('func-th').withOption("width", "150px").notSortable(),
            DTColumnBuilder.newColumn('contactMobile').withTitle('联系人手机').withClass('func-th').withOption("width", "100px"),
            DTColumnBuilder.newColumn('isNiceSupplier').withTitle('供应商来源').withClass('func-th').withOption("width", "100px").renderWith(isNiceSupplierHtml),
            DTColumnBuilder.newColumn('contactName').withTitle('联系人').withClass('func-th').withOption("width", "120px").notSortable(),
            DTColumnBuilder.newColumn('companyName').withTitle('公司名称').withClass('func-th ').withOption("width", "150px").notSortable(),
            DTColumnBuilder.newColumn('address').withTitle('地址').withClass('func-th').withOption("width", "300px").notSortable(),
        ];

        function isNiceSupplierHtml(data, type, full, meta) {
            if(data){
                return '优供自选';
            }else {
                return '非优供'
            }
        }

        function actionsHtml(data, type, full, meta) {
            var str = "";
            str += '<div class="m-t-xs m-b-sm"><button'
                + ' class="btn'
                + ' btn-xs'
                + ' btn-w-xs'
                + ' btn-success btn-outline" ng-click="changeSupplier('+ full.niceShopId + ',\'' + full.shopName + '\')">' +
                '    <i class="fa fa-code-fork  icon-width">选择该供应商</i>' +
                '</button></div>';
            return str;
        }


        function serverData(sSource, aoData, fnCallback, oSettings) {
            var draw = aoData[0].value;
            $scope.draw = draw;
            aoData = aoData || [];
            var start = aoData[3].value;
            var limit = aoData[4].value;
            var keyword = $scope.keyword || '',
                pageNo = start/limit + 1,
                pageSize = limit;

            return requestInquiryMgmtService.supplierListQuery(keyword,pageNo,pageSize,$scope.draw).then(function(resp) {
                fnCallback(resp.data.data);
            }).finally(function() {
                $scope.queryBtnDisabled = false;
            });
        }


        // 确认选择供应商
        $scope.changeSupplier = function (niceShopId,shopName) {
            var modalInstance = $uibModal.open({
                templateUrl: 'app/requestInquiry-management-mgmt/modal/supplier-detail.html?v=' + LG.appConfig.clientVersion,
                size: 'md',
                keyboard: false,
                controller: 'supplierDetailCtrl',
                resolve: {
                    realShopId: function () {
                        return $scope.realShopId;
                    },
                    niceShopId: function () {
                        return niceShopId;
                    }
                }
            });
            modalInstance.result.then(function (result) {
                if(result){
                    var data = {
                        niceShopId: niceShopId,
                        shopName: shopName
                    };
                    $uibModalInstance.close(data);
                }
            }, function (reason) {

            });
        };

        // 新增供应商
        $scope.addSupplier = function () {
            var modalInstance = $uibModal.open({
                templateUrl: 'app/requestInquiry-management-mgmt/modal/add-supplier.html?v=' + LG.appConfig.clientVersion,
                size: 'md',
                keyboard: false,
                controller: 'addSupplierCtrl',
                resolve: {
                    realShopId: function () {
                        return $scope.realShopId;
                    },
                    itemId: function () {
                        return itemId;
                    }
                }
            });
            modalInstance.result.then(function (result) {
                if(result){
                    var data = {
                        niceShopId: result.niceShopId,
                        shopName: result.shopName
                    };
                    $uibModalInstance.close(data);
                }
            }, function (reason) {

            });
        };

        // 提交逻辑
        $scope.submit = function () {
            $scope.queryBtnDisabled = true;
            $scope.dtInstance.reloadData();
        };

        $scope.cancel = function() {
            $uibModalInstance.close();
        };
        $scope.$watch('$viewContentLoaded', function() {

        });
    }
    angular
        .module('app.request-inquiry-management')
        .controller('supplierListCtrl', supplierListCtrl);

})();