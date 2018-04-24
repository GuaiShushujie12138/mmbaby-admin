/**
 * CustomerVisitRecordCtrl
 */
(function () {

    'use strict';

    CustomerVisitBackCtrl.$inject = ['$scope', '$uibModal', '$filter', '$compile', 'customerMgmtService', 'toaster',  'DTOptionsBuilder', 'DTColumnBuilder'];

    function CustomerVisitBackCtrl($scope, $uibModal, $filter, $compile, customerMgmtService, toaster, DTOptionsBuilder, DTColumnBuilder) {

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
            DTColumnBuilder.newColumn('type').withTitle('回访类型').notSortable().renderWith(function (data, type, full, meta) {
                var str = '';
                if (full.type == 10) {
                    str = '流失客户回访';
                }else if(full.type == 20){
                    str = '金融客户回访';
                }
                return str;
            }),
            DTColumnBuilder.newColumn('mobile').withTitle('回访电话').notSortable(),
            DTColumnBuilder.newColumn('callResult').withTitle('呼叫情况').notSortable().renderWith(function (data, type, full, meta) {
                var str = '';
                if (full.callResult == undefined || full.callResult == null ||full.callResult == "") {
                    str = '无';
                }else{
                    str = full.callResult;
                }
                return str;
            }),
            DTColumnBuilder.newColumn('visitContent').withTitle('回访结果').notSortable().withOption("width", "30%").renderWith(function (data, type, full, meta) {
                var str = '';
                if (full.visitContent == undefined || full.visitContent == null ||full.visitContent == "") {
                    str = '无';
                }else{
                    str = full.visitContent;
                }
                return str;
            }),
            DTColumnBuilder.newColumn('csInquiry').withTitle('回访内容').notSortable().renderWith(function (data, type, full, meta) {
                var str = '';
                if (full.csInquiry == undefined || full.csInquiry == null ||full.csInquiry == "") {
                    str = '无';

                }else{
                    str = full.csInquiry;
                }
                return str;
            }),,
            DTColumnBuilder.newColumn('visitTime').withTitle('回访时间'),
            DTColumnBuilder.newColumn('operatorName').withTitle('操作人').notSortable()
        ];

        function serverData(sSource, aoData, fnCallback, oSettings) {
            var draw = aoData[0].value;
            var sortColumn = $scope.dtColumns[6].mData;
            var sortDir = aoData[2].value[0].dir;
            var start = aoData[3].value;
            var limit = aoData[4].value;

            var form = $(oSettings.nTableWrapper).closest('#gridcontroller').find('form');
            var queryConditionObject = getQueryParams(form, vm.tabFilter);
            queryConditionObject.rules.push({"field":"pv.lscrm_customer_id","value":vm.customerId,"op":"equal"})
            var where = JSON.stringify(queryConditionObject);

            return customerMgmtService.getVisitBackByCustomerId( draw, sortColumn, sortDir, start, limit, where)
                .then(function (resp) {
                    fnCallback(resp.data.data);
                    vm.tableData = resp.data.data.data;
                });
        }


        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };

    }

    angular
        .module('app.customer-mgmt')
        .controller('CustomerVisitBackCtrl', CustomerVisitBackCtrl);

})();