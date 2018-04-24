/**
 * CustomerLogCtrl
 */
(function () {

    'use strict';

    CustomerLogCtrl.$inject = ['$scope', '$uibModal', '$filter', '$compile', 'customerMgmtService', 'toaster',  'DTOptionsBuilder', 'DTColumnBuilder'];

    function CustomerLogCtrl($scope, $uibModal, $filter, $compile, customerMgmtService, toaster, DTOptionsBuilder, DTColumnBuilder) {

        var vm = $scope;
        vm.customerId = $scope.info.customerId;

        $scope.dtInstance = {};

        $scope.dtOptions = DTOptionsBuilder
            .fromSource('')
            .withFnServerData(serverData)
            .withDOM('frtlip')
            .withDataProp('data')
            .withOption('serverSide', true)
            .withOption('searching', false)
            .withOption('lengthChange', true)
            .withOption('autoWidth', false)
            .withOption('scrollX', false)
            .withOption('lengthMenu', [10, 20, 50])
            .withOption('displayLength', 10)
            .withPaginationType('full_numbers')
            .withOption('createdRow', function (row, data, dataIndex) {
                $compile(angular.element(row).contents())($scope);
            });

        $scope.dtColumns = [
            DTColumnBuilder.newColumn('id').notVisible(),
            DTColumnBuilder.newColumn('logType').withTitle('操作类型').notSortable().withClass('func-th'),
            DTColumnBuilder.newColumn('').withTitle('操作信息').notSortable().withClass('func-th').renderWith(function (data, type, full, meta) {
                var str = '';
                if (full.logMessage != undefined || full.logMessage != null) {
                    str = full.logMessage;
                }
                return '<div style="white-space:normal;word-wrap:break-word;"><span>' + str + '</span></div>';
            }),
            DTColumnBuilder.newColumn('updateName').withTitle('操作人').withClass('func-th'),
            DTColumnBuilder.newColumn('ipAddress').withTitle('操作人IP').withClass('func-th').notSortable(),
            DTColumnBuilder.newColumn('').withTitle('操作时间').withClass('func-th').renderWith(createTimeHtml)
        ];

        function serverData(sSource, aoData, fnCallback, oSettings) {
            var draw = aoData[0].value;
            var sortColumn = $scope.dtColumns[parseInt(aoData[2].value[0].column)].mData;
            var sortDir = aoData[2].value[0].dir;
            var start = aoData[3].value;
            var limit = aoData[4].value;

            return customerMgmtService.getCustomerLogs(vm.customerId, draw, sortColumn, sortDir, start, limit)
                .then(function (resp) {
                    fnCallback(resp.data);
                    vm.tableData = resp.data.data;
                });
        }

        function createTimeHtml(data, type, full, meta) {
           return $filter('date')(full.createTime, 'yyyy-MM-dd: HH:mm:dd');
        }

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    }

    angular
        .module('app.customer-mgmt')
        .controller('CustomerLogCtrl', CustomerLogCtrl);

})();