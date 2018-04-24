/**
 * trade-log.㳧fund
 */
(function () {

    'use strict';

    refundLogCtrl.$inject = ['$scope', '$uibModalInstance','$http', '$compile','$filter',
        'tradeMgmtService', 'DTOptionsBuilder', 'DTColumnBuilder', 'tradeId', 'id'];

    /**
     * refundLogCtrl
     */
    function refundLogCtrl($scope, $uibModalInstance, $http, $compile, $filter, tradeMgmtService,
                                DTOptionsBuilder, DTColumnBuilder,tradeId, id) {
        $scope.memo = "";
        $scope.flag = '0';
        $scope.dtInstance = {};

        $scope.dtOptions = DTOptionsBuilder
            .fromSource('')
            .withFnServerData(serverData)
            .withDataProp('data')
            .withOption('serverSide', true)
            .withOption('searching', false)
            .withOption('lengthChange', true)
            .withOption('autoWidth', false)
            .withOption('scrollX', false)
            .withOption('paging', false)
            .withOption('createdRow', function (row, data, dataIndex) {
                $compile(angular.element(row).contents())($scope);
            });

        $scope.dtColumns = [
            DTColumnBuilder.newColumn('id').notVisible(),
            DTColumnBuilder.newColumn('operateTypeText').notSortable().withTitle(
                '操作类型'),
            DTColumnBuilder.newColumn('refundId').notSortable().withTitle(
                '退款单号'),
            DTColumnBuilder.newColumn('flag').notSortable().withTitle(
                '标记类别').renderWith(flagHtml),
            DTColumnBuilder.newColumn('memo').notSortable().withTitle('备注'),
            DTColumnBuilder.newColumn('platform').notSortable().withTitle(
                '来源').renderWith(platformHtml),
            DTColumnBuilder.newColumn('createId').notSortable().withTitle('操作人'),
            DTColumnBuilder.newColumn('createTime').notSortable().withTitle('操作时间').renderWith(
                timeHtml),
        ];

        function timeHtml(data, type, full, meta) {

            if (data == null || data == '') {
                return "";
            }

            return $filter('date')(data, 'yyyy-MM-dd HH:mm:ss');
        }

        function flagHtml(data, type, full, meta) {
            if (data == 0) {
                return "<span class='remark'><label class='memo0'>&nbsp;&nbsp;</label></span>"
            }
            if (data == 1) {
                return "<span class='remark'><label class='memo1'>&nbsp;&nbsp;</label></span>"
            }
            else if (data == 2) {
                return "<span class='remark'><label class='memo2'>&nbsp;&nbsp;</label></span>"
            }
            else if (data == 3) {
                return "<span class='remark'><label class='memo3'>&nbsp;&nbsp;</label></span>"
            }
            else if (data == 4) {
                return "<span class='remark'><label class='memo4'>&nbsp;&nbsp;</label></span>"
            }
            else if (data == 5) {
                return "<span class='remark'><label class='memo5'>&nbsp;&nbsp;</label></span>"
            }
            else {
                return "未知";
            }
        }

        function serverData(sSource, aoData, fnCallback, oSettings) {
            return tradeMgmtService.getRefundLog(tradeId,id)
                .then(function (resp) {
                    fnCallback(resp.data);
                    // $scope.tableData = resp.data.refundLogs;
                }).finally(function () {
                    $scope.queryBtnDisabled = false;
                });
        }

        $scope.cancel = function() {
            $uibModalInstance.dismiss('cancel');
        };

    }

    angular
        .module('app.trade-mgmt')
        .controller('refundLogCtrl', refundLogCtrl)
    ;
})();