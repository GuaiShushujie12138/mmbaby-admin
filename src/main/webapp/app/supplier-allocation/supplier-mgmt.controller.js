/**
 * supplier-mgmt.controller
 */
(function () {

    'use strict';

    SupplierMGMTCtrl.$inject = ['$scope', '$http', '$uibModal', 'toaster', '$compile', '$filter', '$location', 'supplierMgmtService', 'DTOptionsBuilder', 'DTColumnBuilder', '$state', 'permissionCheckService'];

    /**
     * SupplierMGMTCtrl
     */
    function SupplierMGMTCtrl($scope, $http, $uibModal, toaster, $compile, $filter, $location, supplierMgmtService, DTOptionsBuilder, DTColumnBuilder, $state, permissionCheckService) {
        var vm = this;
        $scope.numStock=0;
        var params = $location.search();
        init();
        function init() {
            vm.supplier={}
            vm.supplier.pageSize = 10;
            vm.supplier.sortDir = "desc";
            vm.supplier.offset = 0;
            vm.supplier.draw = 1;
            vm.supplier.auditingStatus="";
            vm.supplier.businessEmployeeNo="";
            vm.supplier.source="";
            vm.supplier.supplierId="";
            vm.supplier.mobile="";
            vm.supplier.assignStatus="";

            $scope.canMarkRevenue = permissionCheckService.check("WEB.TRADE-MGMT.REVENUE");
            $scope.canFollowUp = permissionCheckService.check("WEB.TRADE-MGMT.FOLLOWUP");
            $scope.canRelateDemand = permissionCheckService.check("WEB.TRADE-MGMT.RELATEDEMAND");

            var today = new Date();
            vm.supplier.beginCreateTime = $filter('date')(today.setYear('2016'), 'yyyy-MM-dd') + " 00:00:00";
            vm.supplier.endCreateTime = $filter('date')(new Date(), 'yyyy-MM-dd') + " 23:59:59";

            vm.validateDateRange = {
                startDate: vm.supplier.beginCreateTime,
                endDate: vm.supplier.endCreateTime
            };

            $scope.$watch('vm.validateDateRange', function (newVal, oldVal) {
                if (newVal) {
                  vm.supplier.beginCreateTime = moment(newVal.startDate, "YYYY-MM-DD hh:mm:ss").format("YYYY-MM-DD HH:mm:ss");
                  vm.supplier.endCreateTime = moment(newVal.endDate, "YYYY-MM-DD hh:mm:ss").format("YYYY-MM-DD HH:mm:ss");
                }
            });
            getUnAllowanceNum();
            supplierMgmtService.getUsersList().then(function (resp) {
                if(resp.data.code==200){
                    vm.inquiryUsers = resp.data.data.users;
                }
            })


            supplierMgmtService.supplierListQuery({"pageSize":10000,"offset":0}).then(function (resp) {
                if(resp.data.code==200) {
                    vm.supplierList = resp.data.data.data;
                }
            })

            //是否有供应商释放的权限
            vm.canAssignCancel = permissionCheckService.check(
                "WEB.SUPPLIER.ASSIGN.CANCEL");

            //是否有供应商分配的权限
            vm.canAssignUser = permissionCheckService.check(
                "WEB.SUPPLIER.ASSIGN.USER");


            vm.opts = {
                timePicker: true,
                timePickerSeconds: true,
                timePickerIncrement: 1,
                timePicker12Hour: false,
                locale: {
                    applyClass: 'btn-green',
                    applyLabel: "应用",
                    fromLabel: "从",
                    format: "YYYY-MM-DD HH:mm",
                    toLabel: "至",
                    cancelLabel: '取消',
                    customRangeLabel: '自定义区间'
                },
                ranges: {
                    '今日': [moment().startOf('day'), moment().endOf('day')],
                    '本周': [moment().startOf('isoWeek'), moment().endOf('day')],
                    '本月': [moment().startOf('month'), moment().endOf('day')]
                }
            };

            vm.supplierStatusSelect = [
                {key: '', value: "所有"},
                {key: '1', value: '审核通过'},
                {key: '2', value: '待审核'},
                {key: '3', value: '驳回'},
                {key: '4', value: '审核中'}
            ];

            vm.supplierValiditySelect = [
                {key: '', value: "所有"},
                {key: '1', value: '有效'},
                {key: '0', value: '无效'},
            ];

            vm.supplierSourceSelect = [
                {key: '', value: "所有"},
                {key: '1', value: "优供自选"},
                {key: '2', value: "销售提报"},
                {key: '3', value: "找版转入"}
            ];

            vm.supplierAllowanceSelect = [
                {key: '', value: "所有"},
                {key: '1', value: "已分配"},
                {key: '0', value: "未分配"}
            ];
        }


        $('.table').on('draw.dt', function () {
            //使用col插件实现表格头宽度拖拽
            $(".table").colResizable(
                {
                    liveDrag: true
                }
            );
        });

        function getUnAllowanceNum(){
            supplierMgmtService.getUnAllowanceNum().then(function (resp) {
                if(resp.data.code==200){
                    $scope.numStock = resp.data.data;
                }
            })
        }
        $scope.dtInstance = {};

        $scope.dtOptions = DTOptionsBuilder
            .fromSource('')
            .withFnServerData(serverData)
            .withDataProp('data')
            .withOption('serverSide', true)
            .withOption('searching', false)
            .withOption('lengthChange', true)
            .withDOM('frtlip')
            .withOption('autoWidth', false)
            .withOption('scrollX', false)
            .withOption('lengthMenu', [10, 25, 50, 100, 200])
            .withOption('displayLength', 10)
            .withPaginationType('full_numbers')
            .withOption('rowCallback', rowCallback)
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
                .withOption('width', '80px').renderWith(actionsHtml),
            DTColumnBuilder.newColumn('supplierId').withTitle('供应商ID').withClass('func-th hide').withOption("width", "70px"),
            DTColumnBuilder.newColumn('shopName').withTitle('供应商名称').withClass('func-th').withOption("width", "70px").notSortable(),
            DTColumnBuilder.newColumn('shopContactTel').withTitle('联系人手机').withClass('func-th').withOption("width", "70px").notSortable(),
            DTColumnBuilder.newColumn('source').withTitle('供应商来源').withClass('func-th').withOption("width", "60px").notSortable().renderWith(sourceHtml),
            DTColumnBuilder.newColumn('shopContacts').withTitle('联系人').withClass('func-th').withOption("width", "70px").notSortable(),
            DTColumnBuilder.newColumn('validity').withTitle('有效性').withClass('func-th').withOption("width", "60px").notSortable().renderWith(validityHtml),
            DTColumnBuilder.newColumn('businessUserName').withTitle('归属人').withClass('func-th').withOption("width", "60px").notSortable(),
            DTColumnBuilder.newColumn('auditingStatus').withTitle('审核状态').withClass('func-th').withOption("width", "60px").notSortable().renderWith(auditingStatusHtml),
            DTColumnBuilder.newColumn('inquiryAssignStatus').withTitle('分配状态').withClass('func-th').withOption("width", "60px").notSortable().renderWith(inquiryAssignStatusHtml),
            DTColumnBuilder.newColumn('shopCompanyName').withTitle('公司名称').notSortable().withClass('func-th').withOption("width", "120px"),
            DTColumnBuilder.newColumn('shopAddress').withTitle('地址').withClass('func-th').withOption("width", "120px").notSortable(),
        ];


        $scope.findNotAllowance =function(){
            vm.supplier.assignStatus="0";
            $scope.dtInstance.reloadData();
        }

        function sourceHtml(row, data, dataIndex) {
            if (row == 1) {
                return '优供自选';
            } else if (row == 2) {
                return '销售提报';
            } else {
                return '找版转入';
            }
        }

        function auditingStatusHtml(row, data, dataIndex) {
            if (row == 1) {
                return '审核通过';
            } else if (row == 2) {
                return '待审核';
            } else if (row == 3) {
                return '驳回';
            } else {
                return '审核中';
            }
        }

        function inquiryAssignStatusHtml(row, data, dataIndex) {
            if (row) {
                return "已分配"
            }
            return "未分配"
        }

        function validityHtml(row, data, dataIndex) {
            if (row) {
                return "有效"
            }
            return "无效"
        }

        function rowCallback(row, data, dataIndex) {
            $('td', row).bind('dblclick', function () {
                $scope.getDetail(data);
            });
            return row;
        }

        function actionsHtml(data, type, full, meta) {
            var allowanceStr="分配供应商";
            var str = '';
            if(full.inquiryAssignStatus){
                allowanceStr="修改供应商"
                str += '<div class="m-t-xs m-b-sm" ng-if="vm.canAssignCancel"><button'
                    + ' class="btn'
                    + ' btn-xs'
                    + ' btn-w-xs'
                    + ' btn-success btn-outline" ng-click="releaseSupplier(vm.tableData[' + meta.row + '])">' +
                    '    <i class="fa fa-code-fork  icon-width">释放供应商</i>' +
                    '</button></div>';
            }
            str += '<div class="m-t-xs m-b-sm"  ng-if="vm.canAssignUser"><button'
                + ' class="btn'
                + ' btn-xs'
                + ' btn-w-xs'
                + ' btn-success btn-outline" ng-click="allowanceSupplier(vm.tableData[' + meta.row + '])">' +
                '    <i class="fa fa-code-fork  icon-width">'+allowanceStr+'</i>' +
                '</button></div>';

            return str;
        }


        /**
         * 分配供应商
         * @param rowObj
         */
        $scope.allowanceSupplier = function (rowObj) {
            var modalInstance = $uibModal.open({
                templateUrl: 'app/supplier-allocation/modal/allocate-supplier.html?v=' + LG.appConfig.clientVersion,
                windowClass: 'sm',
                keyboard: false,
                controller: 'allocateSupplierCtrl',
                resolve: {
                    supplierId: function () {
                        return rowObj.supplierId;
                    },
                    businessUserEmployeeNo: function () {
                        return rowObj.businessUserEmployeeNo;
                    },
                    inquiryUsers:function () {
                        return vm.inquiryUsers;
                    }
                }
            });

            modalInstance.result.then(function () {
                $scope.dtInstance.reloadData();
                getUnAllowanceNum();
            }, function () {
                $scope.dtInstance.reloadData();
                getUnAllowanceNum();
            });
        };


        /**
         * 释放供应商
         * @param rowObj
         */
        $scope.releaseSupplier = function (rowObj) {
            var modalInstance = $uibModal.open({
                templateUrl: 'app/supplier-allocation/modal/release-supplier.html?v=' + LG.appConfig.clientVersion,
                windowClass: 'sm',
                keyboard: false,
                controller: 'releaseSupplierCtrl',
                resolve: {
                    supplierId: function () {
                        return rowObj.supplierId;
                    }
                }
            });

            modalInstance.result.then(function () {
                $scope.dtInstance.reloadData();
                getUnAllowanceNum();
            }, function () {
                $scope.dtInstance.reloadData();
                getUnAllowanceNum();
            });
        };


        function setInitObject(supplier){
            var params={};
            for(var index in supplier){
                if(supplier[index]){
                    params[index]=supplier[index];
                }

                if(index==="offset") {
                    params[index]=supplier[index];
                }
            }
            return params;
        }

        function serverData(sSource, aoData, fnCallback, oSettings) {
            var draw = aoData[0].value;
            vm.supplier.draw = draw;
            var sortColumn = $scope.dtColumns[parseInt(aoData[2].value[0].column)].mData;
            vm.supplier.sortColumn = sortColumn;
            var sortDir = aoData[2].value[0].dir;
            vm.supplier.sortDir = sortDir;
            var start = aoData[3].value;
            vm.supplier.offset = start;
            var limit = aoData[4].value;
            vm.supplier.pageSize = limit;

            //vm.supplier.beginCreateTime =vm.validateDateRange.startDate;
            //vm.supplier.endCreateTime =vm.validateDateRange.endDate;

            var where =setInitObject(vm.supplier);
            return supplierMgmtService.supplierListQuery(where).then(function (resp) {
                    vm.tableData = resp.data.data.data;
                    fnCallback(resp.data.data);

                })

        }

        $scope.submit = function () {
            $scope.queryBtnDisabled = true;
            $scope.dtInstance.reloadData();
            params = null;
        };
    }

    angular
        .module('app.supplier-mgmt')
        .controller('SupplierMGMTCtrl', SupplierMGMTCtrl);
})();