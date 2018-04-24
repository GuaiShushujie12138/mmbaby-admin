/**
 * trade-modal.controller
 */
(function () {

    'use strict';

    TradeModalCtrl.$inject = ['$scope', '$uibModal', '$uibModalInstance', '$compile', 'demandMgmtService', 'toaster', 'rowObj', 'domain', 'demandTradeList', 'DTOptionsBuilder', 'DTColumnBuilder'];

    function TradeModalCtrl($scope, $uibModal, $uibModalInstance, $compile, demandMgmtService, toaster, rowObj, domain, demandTradeList, DTOptionsBuilder, DTColumnBuilder) {
        var vm = $scope;
        $scope.demandId = rowObj.demandId;
        $scope.domain = domain;


        $scope.dtOptions = DTOptionsBuilder
            .fromSource('')
            .withOption('data', demandTradeList)
            .withOption('serverSide', false)
            .withOption('searching', false)
            .withOption('lengthChange', true)
            .withOption('autoWidth', true)
            .withOption('lengthMenu', [10, 20, 50])
            .withOption('displayLength', 10)
            .withPaginationType('full_numbers')
            .withOption('createdRow', function(row, data, dataIndex){
                $compile(angular.element(row).contents())($scope);
            });

        $scope.dtColumns = [
            DTColumnBuilder.newColumn('tradeId').notVisible(),
            DTColumnBuilder.newColumn('tradeId').withTitle('订单ID').notSortable().withClass('func-th'),
            DTColumnBuilder.newColumn('shopId').withTitle('店铺ID').notSortable().withClass('func-th').renderWith(shopIdHtml),
            DTColumnBuilder.newColumn('status').withTitle('订单状态').notSortable().withClass('func-th').renderWith(statusHtml),
            DTColumnBuilder.newColumn('createTime').withTitle('创建时间').notSortable().withClass('func-th'),
            DTColumnBuilder.newColumn('totalFee').withTitle('商品金额').notSortable().withClass('func-th'),
            DTColumnBuilder.newColumn('userName').withTitle('用户名').notSortable().withClass('func-th'),
            DTColumnBuilder.newColumn('mobileno').withTitle('手机号').notSortable().withClass('func-th')

        ];


        function shopIdHtml(data, type, full, meta)
        {
            return '<a href="'+ domain +'shop/' + full.shopId + '" target="_blank">' + full.shopName + '</a>';
        }

        function statusHtml(data, type, full, meta)
        {
            return '<div ng-switch on=' + full.status + '>' +
                '<span ng-switch-when="1">待付款</span>' +
                '<span ng-switch-when="2">待发货</span>' +
                '<span ng-switch-when="3">待确认收货</span>' +
                '<span ng-switch-when="4">待评价</span>' +
                '<span ng-switch-when="5">已成功</span>' +
                '<span ng-switch-when="6">已取消</span>' +
                '<span ng-switch-when="7">已删除</span>' +
                '<span ng-switch-when="8">交易关闭</span>' +
                '<span ng-switch-default>未知</span>' +
                '</div>';
        }

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };

    }

    angular
        .module('app.demand-mgmt')
        .controller('TradeModalCtrl', TradeModalCtrl);

})();