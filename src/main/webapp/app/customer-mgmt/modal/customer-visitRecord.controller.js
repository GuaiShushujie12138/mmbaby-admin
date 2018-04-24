/**
 * CustomerVisitRecordCtrl
 */
(function () {

    'use strict';

    CustomerVisitRecordCtrl.$inject = ['$scope', '$uibModal', '$filter', '$compile', 'customerMgmtService', 'toaster',  'DTOptionsBuilder', 'DTColumnBuilder'];

    function CustomerVisitRecordCtrl($scope, $uibModal, $filter, $compile, customerMgmtService, toaster, DTOptionsBuilder, DTColumnBuilder) {

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
            DTColumnBuilder.newColumn('createId').withTitle('CRM用户ID').notSortable().withClass('func-th').withOption("width", "10%"),
            DTColumnBuilder.newColumn('').withTitle('备注').withClass('func-th').notSortable().renderWith(function (data, type, full, meta) {
                var str = '';
                if (full.remark != undefined || full.remark != null) {
                    str = full.remark;
                }
                return '<div style="white-space:normal;word-wrap:break-word;word-break:break-all;"><span>' + str + '</span></div>';
            }),
            DTColumnBuilder.newColumn('visitTime').withTitle('拜访时间').withClass('func-th').withOption("width", "15%"),
            DTColumnBuilder.newColumn('').withTitle('图片').withClass('func-th').notSortable().renderWith(picHtml).withOption("width", "20%"),
            DTColumnBuilder.newColumn('').withTitle('语音').withClass('func-th').notSortable().renderWith(voicesHtml).withOption("width", "10%")
        ];

        function serverData(sSource, aoData, fnCallback, oSettings) {
            var draw = aoData[0].value;
            var sortColumn = $scope.dtColumns[parseInt(aoData[2].value[0].column)].mData;
            var sortDir = aoData[2].value[0].dir;
            var start = aoData[3].value;
            var limit = aoData[4].value;

            return customerMgmtService.getVisitRecordByCustomerId(vm.customerId, draw, sortColumn, sortDir, start, limit)
                .then(function (resp) {
                    fnCallback(resp.data);
                    vm.tableData = resp.data.data;
                });
        }

        function picHtml(data, type, full, meta){
            var str = '';

            if (full.pics != null && full.pics.length > 0) {

                var ret = '<uib-carousel class="td-carousel">';
                for (var i = 0; i < full.pics.length; ++i) {
                    ret += '<uib-slide ' + (i === 0 ? ' class="active"' : '') + '><a href="' + full.pics[i] + '" data-gallery=""><img src="' + full.pics[i] + '" /></a></uib-slide>';
                }
                ret += '</uib-carousel>';

                str = ret;
            } else {
                str = "无图片";
            }

            return str;
        }

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };

        function voicesHtml(data, type, full, meta) {
            var str = '';
            if (full.voices != null && full.voices.length > 0) {
                for (var x = 0; x < full.voices.length; x++) {
                    str += '<audio src="' + full.voices[x] + '" controls=""></audio></br>';
                }
            }

            return str;
        }
    }

    angular
        .module('app.customer-mgmt')
        .controller('CustomerVisitRecordCtrl', CustomerVisitRecordCtrl);

})();