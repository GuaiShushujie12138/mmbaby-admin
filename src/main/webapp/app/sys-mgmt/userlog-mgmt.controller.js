/**
 * user-mgmt.controller.js
 */
(function () {

    'use strict';

    UserLogMgmtCtrl.$inject = ['$scope', '$http', '$uibModal', '$compile', '$filter', 'UserLogService', 'DTOptionsBuilder', 'DTColumnBuilder', '$state'];


    /**
     * TradeMgmtCtrl
     */
    function UserLogMgmtCtrl($scope, $http, $uibModal, $compile, $filter, UserLogService, DTOptionsBuilder, DTColumnBuilder, $state) {
        var vm = this;




        $scope.dtInstance = {};

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
            .withOption('lengthMenu', [10, 25, 50])
            .withOption('displayLength', 10)
            //.withOption('order', [10,'desc'])
            .withPaginationType('full_numbers')
            .withOption('createdRow', function(row, data, dataIndex) {
                $compile(angular.element(row).contents())($scope);
            });
        $scope.dtColumns = [
            DTColumnBuilder.newColumn('id').withTitle('编号').notVisible(),
            DTColumnBuilder.newColumn('create_time').withTitle('时间').renderWith(timeHtml),
            DTColumnBuilder.newColumn('user_id').withTitle('用户编号'),

            DTColumnBuilder.newColumn('create_id').withTitle('用户名称'),

            DTColumnBuilder.newColumn('log_type').withTitle('类型'),
            DTColumnBuilder.newColumn('log_message').withTitle('日志详情')

        ];

        vm.operationTypeList=[
            {id:"0",text:"操作日志"},
            {id:"1",text:"系统日志"}
        ];

        vm.isSystemLog="0";

        //vm.startDate = $filter('date')(new Date()-1, 'yyyy-MM-dd') + " 00:00:00";
        var today = new Date();
        vm.startDate = $filter('date')(today.setMonth(today.getMonth()-1), 'yyyy-MM-dd') + " 00:00:00";
        vm.endDate = $filter('date')(new Date(), 'yyyy-MM-dd') + " 23:59:59";
        vm.rangeDate = vm.startDate + " - " + vm.endDate;

        vm.validateDateRange = {
            startDate:vm.startDate ,
            endDate:vm.endDate
        }

        vm.opts = {
            timePicker: true,
            timePickerSeconds:true,
            timePickerIncrement: 1,
            timePicker12Hour:false,
            locale: {
                applyClass: 'btn-green',
                applyLabel: "应用",
                fromLabel: "从",
                format: "YYYY-MM-DD HH:mm:ss",
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

        $scope.$watch('vm.validateDateRange', function (newVal, oldVal) {
            if (newVal) {
                vm.startDate =moment(newVal.startDate, "YYYY-MM-DD hh:mm:ss").format("YYYY-MM-DD HH:mm:ss");
                vm.endDate =moment(newVal.endDate, "YYYY-MM-DD hh:mm:ss").format("YYYY-MM-DD HH:mm:ss");
                vm.rangeDate = vm.startDate + " - " + vm.endDate;
            }
        });

        $scope.UserAndDeptData = function () {
            return UserLogService.UserAndDeptData();
        }
        function serverData(sSource, aoData, fnCallback, oSettings) {
            var draw = aoData[0].value;
            var sortColumn = $scope.dtColumns[parseInt(aoData[2].value[0].column)].mData;
            var sortDir = aoData[2].value[0].dir;
            var start = aoData[3].value;
            var limit = aoData[4].value;
            //var searchValue = aoData[5].value.value;
            //var searchRegex = aoData[5].value.regex;


            var form = $(oSettings.nTableWrapper).closest('#gridcontroller').find('form');
            var queryConditionObject = getQueryParams(form, vm.tabFilter);
            var where = JSON.stringify(queryConditionObject);
            return UserLogService.query(draw, sortColumn, sortDir, start, limit, where).then(function (resp) {
                fnCallback(resp.data);
                vm.tableData = resp.data.data;
                //vm.deptFilterMessage=resp.data.extendData.message;//部门筛选条件

            }).finally(function () {
                $scope.queryBtnDisabled = false;
            });
        }

        $scope.submit = function () {
            $scope.queryBtnDisabled = true;
            $scope.dtInstance.reloadData();
        };


    }

    angular
        .module('app.userlog-mgmt')
        .controller('UserLogMgmtCtrl', UserLogMgmtCtrl);
})();