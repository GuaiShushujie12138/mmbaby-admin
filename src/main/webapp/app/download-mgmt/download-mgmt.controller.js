(function () {

    'use strict';

    DownloadMgmtCtrl.$inject =
        ['$scope', '$timeout', '$http', '$uibModal', '$filter', '$compile', 'toaster', 'downloadService',
         'DTOptionsBuilder', 'DTColumnBuilder', 'DTColumnDefBuilder', 'permissionCheckService','$interval'];

    function DownloadMgmtCtrl($scope, $timeout, $http, $uibModal, $filter, $compile, toaster, downloadService,
                              DTOptionsBuilder, DTColumnBuilder, DTColumnDefBuilder, permissionCheckService,$interval) {
        var vm = this;

        $scope.dtInstance = {};

        vm.datas = [];

        //vm.startDate = $filter('date')(new Date(), 'yyyy-MM-dd') + " 00:00:00";
        var today = new Date();
        vm.startDate = $filter('date')(today.setMonth(today.getMonth()-1), 'yyyy-MM-dd') + " 00:00:00";
        vm.endDate = $filter('date')(new Date(), 'yyyy-MM-dd') + " 23:59:59";

        vm.validateDateRange = {
            startDate: vm.startDate,
            endDate: vm.endDate
        };

        $scope.$watch('vm.validateDateRange', function (newVal, oldVal) {
            if (newVal) {
                vm.startDate = moment(newVal.startDate, "YYYY-MM-DD hh:mm:ss").format("YYYY-MM-DD HH:mm:ss");
                vm.endDate = moment(newVal.endDate, "YYYY-MM-DD hh:mm:ss").format("YYYY-MM-DD HH:mm:ss");
            }
        });

        vm.deptId = 0;

        vm.opts = {
            timePicker: true,
            timePickerSeconds: true,
            timePickerIncrement: 1,
            timePicker12Hour: false,
            locale: {
                applyClass: 'btn-green',
                applyLabel: "应用",
                fromLabel: "从",
                format: "YYYY-MM-DD",
                toLabel: "至",
                cancelLabel: '取消',
                customRangeLabel: '自定义区间'
            },
            ranges: {
                '今日': [moment().startOf('day'), moment().endOf('day')],
                '本周': [moment().startOf('isoWeek'), moment().endOf('day')],
                '本月': [moment().startOf('month'), moment().endOf('day')]
            }
        }

        $scope.dtOptions = DTOptionsBuilder
            .fromSource('')
            .withFnServerData(serverData)
            .withDataProp('data')
            .withDOM('frtlip')
            .withOption('serverSide', true)
            .withOption('searching', false)
            .withOption('lengthChange', true)
            .withOption('autoWidth', false)
            .withOption('scrollX', false)
            .withOption('lengthMenu', [10, 20, 30, 50, 100])
            .withOption('displayLength', 20)
            //.withOption('rowCallback', rowCallback)
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
            DTColumnBuilder.newColumn(null).withTitle('操作').notSortable().withClass('text-center')
                .withOption('width', '100px').renderWith(actionsHtml),
            DTColumnBuilder.newColumn('statusName').withTitle('报表生成状态').withClass('func-th').withOption("width", "90px")
                .notSortable(),
            DTColumnBuilder.newColumn('id').withTitle('id').withClass('func-th').withOption("width", "80px").notSortable(),
            DTColumnBuilder.newColumn('fileName').withTitle('文件名').withClass('func-th').withOption("width", "120px")
                .notSortable(),
            DTColumnBuilder.newColumn('userName').withTitle('生成报表用户').withClass('func-th').withOption("width", "90px")
                .notSortable(),
            DTColumnBuilder.newColumn('createTime').withTitle('生成报表日期').withClass('func-th').withOption("width", "90px")
                .notSortable(),
            DTColumnBuilder.newColumn('doneTime').withTitle('结束时间').withClass('func-th').withOption("width", "90px")
                .notSortable(),
            DTColumnBuilder.newColumn('fileSizeStr').withTitle('文件大小').withClass('func-th').withOption("width", "90px")
                .notSortable(),
            DTColumnBuilder.newColumn('queryParams').withTitle('查询参数').withClass('func-th').withOption("width", "200px")
                .notSortable()


        ];

        function actionsHtml(data, type, full, meta) {

            var str = '';

            str +=
                '<div class="m-t-xs m-b-sm" ng-if="'+ (full.status == 3) +'">'
                + '<button class="btn btn-xs btn-w-xs btn-success btn-outline" ng-click="download(vm.tableData['
                + meta.row + '])" >'
                + '<i class="fa fa-info icon-width">下载</i>'
                + '</button></div>';

            return str;

        }


        $scope.download=function(rowObject){

            var url = "/download-mgmt/download?id="+encodeURI(rowObject.id);

            window.open(url);
        }

        function serverData(sSource, aoData, fnCallback, oSettings) {

            var draw = aoData[0].value;
            var sortColumn = $scope.dtColumns[parseInt(aoData[2].value[0].column)].mData;
            var sortDir = aoData[2].value[0].dir;
            var start = aoData[3].value;
            var limit = aoData[4].value;

            var form = $(oSettings.nTableWrapper).closest('#gridcontroller').find('form');
            var queryConditionObject = getQueryParams(form, vm.tabFilter);

            var where = JSON.stringify(queryConditionObject);

            return downloadService.query(draw,start, limit, vm.startDate,vm.endDate )
                .then(
                    function (resp) {
                        fnCallback(resp.data.data);
                        vm.tableData = resp.data.data.data;

                    }).finally(function () {
                    $scope.queryBtnDisabled = false;
                });
        };

        $scope.submit = function () {
            $scope.queryBtnDisabled = true;
            $scope.dtInstance.reloadData();
        };

    }

    angular
        .module('app.download-mgmt')
        .controller('DownloadMgmtCtrl', DownloadMgmtCtrl)

})();