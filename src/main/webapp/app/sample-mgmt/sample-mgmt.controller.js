/**
 * sample-mgmt.controller
 */
(function () {

    'use strict';

    SampleMgmtCtrl.$inject = ['$scope', '$http', '$uibModal', 'toaster', '$compile',
        '$filter', '$location', 'sampleMgmtService', 'DTOptionsBuilder',
        'DTColumnBuilder', '$state', 'permissionCheckService', 'SweetAlert'];

    /**
     * SampleMgmtCtrl
     */
    function SampleMgmtCtrl($scope, $http, $uibModal, toaster, $compile, $filter,
                            $location, sampleMgmtService, DTOptionsBuilder, DTColumnBuilder,
                            $state, permissionCheckService, SweetAlert) {
        var vm = this;

        vm.modal = {};
        //debugger;
        var params = $location.search();
        $scope.sample = {};
        vm.belongUserList = [];
        vm.sellerUserList = [];
        $scope.dtInstance = {};

        vm.selectAll = false;
        vm.selected = {};
        vm.toggleAll = toggleAll;
        vm.toggleOne = toggleOne;
        $scope.treeConfig = {
            'version': 1, 'plugins': ['types'], 'types': {
                'default': {
                    'icon': 'fa fa-folder'
                }, 'html': {
                    'icon': 'fa fa-file-code-o'
                }, 'svg': {
                    'icon': 'fa fa-file-picture-o'
                }, 'css': {
                    'icon': 'fa fa-file-code-o'
                }, 'img': {
                    'icon': 'fa fa-file-image-o'
                }, 'js': {
                    'icon': 'fa fa-file-text-o'
                }

            }
        };

        init();
        function init() {
            vm.sortColumn = "createTime";
            vm.limit = 10;
            vm.sortDir = "desc";
            vm.start = 0;
            vm.draw = 1;
            vm.canChangeShelf = permissionCheckService.check('APP.ITEM.SAMPLE.SHELF.ADJUST');
            vm.canSetBackcard = permissionCheckService.check('APP.ITEM.SAMPLE.SET.BACKCARD');

            //vm.startDate = $filter('date')(new Date(), 'yyyy-MM-dd') + " 00:00:00";
            var today = new Date();
            vm.startDate = $filter('date')(today.setMonth(today.getMonth() - 1), 'yyyy-MM-dd') + " 00:00:00";
            vm.endDate = $filter('date')(new Date(), 'yyyy-MM-dd') + " 23:59:59";

            $scope.sample.createTime = {
                startDate: vm.startDate,
                endDate: vm.endDate
            };


            $scope.sample.status = '';
            $scope.$watch('vm.validateDateRange', function (newVal, oldVal) {
                if (newVal) {
                    vm.startDate = moment(newVal.startDate, "YYYY-MM-DD hh:mm:ss").format("YYYY-MM-DD HH:mm:ss");
                    vm.endDate = moment(newVal.endDate, "YYYY-MM-DD hh:mm:ss").format("YYYY-MM-DD HH:mm:ss");
                }
            });

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

            sampleMgmtService.getAuthUsers()
                .then(function (resp) {
                    vm.belongUserList = resp.data.data;
                    vm.sellerUserList = resp.data.data;
                });
            sampleMgmtService.queryDeptTree($scope);
            sampleMgmtService.getQueryInfo()
                .then(function (resp) {
                    var data = resp.data.data;
                    vm.modal.statusList = data.statusList;
                    vm.modal.warehouseList = data.warehouseList;

                });

            sampleMgmtService.loanerList()
                .then(function (resp) {
                    vm.modal.loanerList = resp.data.data.loanerList;
                })

            sampleMgmtService.getProductNameList(-1).then(function(response) {
                vm.modal.productNameList = response.data.data.product.propertyList.splice(1);
            });

            /**
             * 设置仓库权限
             */
            sampleMgmtService.getUserWarehouse().then(function(resp) {
                if (resp.data.code == 200) {
                    vm.warehouseList = resp.data.data || [];
                }
            });
        }

        /**
         * 选择一个树节点
         */
        $scope.selectTreeNode = function (nodedata) {

            $scope.submit();

        }

        $('.table').on('draw.dt', function () {
            //使用col插件实现表格头宽度拖拽
            $(".table").colResizable(
                {
                    liveDrag: true
                }
            );
        });

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
            // .withOption('rowCallback', rowCallback)
            .withOption('createdRow', function (row, data, dataIndex) {
                $compile(angular.element(row).contents())($scope);
            })
            .withOption('headerCallback', function (header) {
                if (!vm.headerCompiled) {
                    vm.headerCompiled = true;
                    $compile(angular.element(header).contents())($scope);
                }
            });

        var titleHtml = '<input type="checkbox"  '
            + 'ng-model="vm.selectAll" ng-click="vm.toggleAll(vm.selectAll,'
            + ' vm.selected)" style="width: 55px;"/>';

        function toggleAll(selectAll, selectedSampleIds) {
            for (var sampleId in selectedSampleIds) {
                if (selectedSampleIds.hasOwnProperty(sampleId)) {
                    selectedSampleIds[sampleId] = selectAll;
                }
            }
        }

        function toggleOne(selectedSampleIds) {
            for (var sampleId in selectedSampleIds) {
                if (selectedSampleIds.hasOwnProperty(sampleId)) {
                    if (!selectedSampleIds[sampleId]) {
                        vm.selectAll = false;
                        return;
                    }
                }
            }
            vm.selectAll = true;
        }

        function selectSampleHtml(data, type, full, meta) {

            vm.selected[full.sampleId] = false;
            return '<input type="checkbox" icheck ng-model="vm.selected[\'' + full.sampleId + '\']" ng-click="vm.toggleOne(vm.selected)" />';
        };

        $scope.dtColumns = [
            DTColumnBuilder.newColumn(null).withTitle(titleHtml).notSortable().withClass('text-center p-w-xxs-i choose-th').withOption('width', '40px')
                .renderWith(selectSampleHtml),

            DTColumnBuilder.newColumn(null).withTitle('操作').notSortable().withClass('text-center')
                .withOption('width', '100px').renderWith(actionsHtml),
            DTColumnBuilder.newColumn('sampleCode').withTitle('样卡ID').withClass('func-th').withOption("width", "60px"),
            DTColumnBuilder.newColumn('itemId').withTitle('商品ID').withOption("width", "100px").notSortable(),
            DTColumnBuilder.newColumn('title').withTitle('商品标题').withOption("width", "100px").notSortable(),
            DTColumnBuilder.newColumn('varietyName').withTitle('品名').withOption("width", "100px").notSortable(),
            DTColumnBuilder.newColumn('isPrintQr').withTitle('是否已打印').withClass('func-th').withOption("width", "100px").notSortable(),
            DTColumnBuilder.newColumn('sellerOperatorName').withTitle('样卡卖家运营').withClass('func-th').withOption("width", "100px").notSortable(),
            DTColumnBuilder.newColumn('createTime').withTitle('生成时间').withClass('func-th').withOption("width", "60px").renderWith(timeHtml),
            DTColumnBuilder.newColumn('statusName').withTitle('样卡状态').withClass('func-th').withOption("width", "60px"),
            DTColumnBuilder.newColumn('sampleOwnerName').withTitle('仓库/目标地/出借人').withClass('func-th').withOption("width", "60px").notSortable(),
            DTColumnBuilder.newColumn('shelfName').withTitle('仓库位置').withClass('func-th').withOption("width", "60px").notSortable(),
            DTColumnBuilder.newColumn('sampleSource').withTitle('样卡来源').withClass('func-th').withOption("width", "60px").notSortable(),
            // DTColumnBuilder.newColumn('niceShopName').withTitle('供应商名称').withOption("width", "100px").notSortable(),
            // DTColumnBuilder.newColumn('niceShopId').withTitle('供应商ID').withOption("width", "100px").notSortable(),
            // DTColumnBuilder.newColumn('companyName').withTitle('平台卖家').withOption("width", "100px").notSortable(),
            // DTColumnBuilder.newColumn('realShopId').withTitle('平台卖家ID').withOption("width", "100px").notSortable()
            // DTColumnBuilder.newColumn('shopName').withTitle('店铺名称').withOption("width", "100px").notSortable()

            // DTColumnBuilder.newColumn('deptName').withTitle('部门').withClass('func-th').withOption("width", "60px").notSortable()

            //   DTColumnBuilder.newColumn('isExistOurCompany').withTitle('是否在链尚').withClass('func-th').withOption("width", "60px").notSortable(),
            //   DTColumnBuilder.newColumn('varietyName').withTitle('品名').withClass('func-th').withOption("width", "100px").notSortable(),
            //   DTColumnBuilder.newColumn('belongOperatorName').withTitle('当前持有人').withOption("width", "100px").notSortable(),
            //
            //   DTColumnBuilder.newColumn('shopName').withTitle('店铺名称').withOption("width", "100px").notSortable(),
            //   DTColumnBuilder.newColumn('regMobile').withTitle('买家注册手机号').withOption("width", "100px").notSortable()

        ];


        function actionsHtml(data, type, full, meta) {

            var printText = '打印二维码';
            var isPrintQr = data.printTimes;
            var isItemHasBasicCard = data.isItemHasBasicCard === 1? true : false ;
            var isBasicCard = data.isBasicCard === 1? true : false;
            var hasWarehouseRole = vm.warehouseList.indexOf(data.warehouseId) !== -1; // 判断是否有仓库权限
            if (isPrintQr != null && isPrintQr > 0) {
                printText = '重新打印';
            }

            var str = '';

            str += '<div class="m-t-xs m-b-sm"><button'
                + ' class="btn'
                + ' btn-xs'
                + ' btn-w-xs'
                + ' btn-success btn-outline" ng-click="getDetail(vm.tableData[' + meta.row + '])">' +
                '    <i class="fa fa-code-fork  icon-width">查看详情</i>' +
                '</button></div>';
            str += '<div class="m-t-xs m-b-sm"><button'
                + ' class="btn'
                + ' btn-xs'
                + ' btn-w-xs'
                + ' btn-success btn-outline"'
                + ' ng-click="printQrCode(vm.tableData[' + meta.row + '],' + false + ')">' +
                '    <i class="fa fa-code-fork  icon-width">' + printText + '</i>' +
                '</button></div>';
            str += '<div class="m-t-xs m-b-sm"><button'
                + ' class="btn'
                + ' btn-xs'
                + ' btn-w-xs'
                + ' btn-success btn-outline"'
                + ' ng-click="deleteSample(vm.tableData[' + meta.row + '])">' +
                '    <i class="fa fa-code-fork  icon-width">删除</i>' +
                '</button></div>';
            /*
             str += '<div class="m-t-xs m-b-sm"><button'
             + ' class="btn'
             + ' btn-xs'
             + ' btn-w-xs'
             + ' btn-success btn-outline"'
             + ' ng-click="modifyBelongOperator(vm.tableData[' + meta.row + '])">' +
             '    <i class="fa fa-code-fork  icon-width">修改持有人</i>' +
             '</button></div>';*/
            str += '<div class="m-t-xs m-b-sm"><button'
                + ' class="btn'
                + ' btn-xs'
                + ' btn-w-xs'
                + ' btn-success btn-outline"'
                + ' ng-click="showHistory(vm.tableData[' + meta.row + '])">' +
                '    <i class="fa fa-code-fork  icon-width">日志</i>' +
                '</button></div>';

            str += '<div class="m-t-xs m-b-sm"><button'
                + ' class="btn'
                + ' btn-xs'
                + ' btn-w-xs'
                + ' btn-success btn-outline"'
                + ' ng-click="reCreateOne(vm.tableData[' + meta.row + '])">' +
                '    <i class="fa fa-code-fork  icon-width">生成新的样卡ID并打印</i>' +
                '</button><button class="btn  btn-link" type="button" tooltip-placement="right" uib-tooltip="用于历史存量样卡重新打印入库"><i class="fa fa-info-circle red"></i></button>' +
                '</div>';

            if (isItemHasBasicCard) {
                if (isBasicCard) {
                    str += '<div class="m-t-xs m-b-sm">此样卡为底卡</div>';
                }  else {
                    str += '<div class="m-t-xs m-b-sm">此商品已有底卡</div>';
                }
            } else if (hasWarehouseRole && !isItemHasBasicCard){
                str += '<div class="m-t-xs m-b-sm" ng-if="vm.canSetBackcard"><button'
                    + ' class="btn'
                    + ' btn-xs'
                    + ' btn-w-xs'
                    + ' btn-success btn-outline"'
                    + ' ng-click="setBasicCard(vm.tableData[' + meta.row + '])">' +
                    '    <i class="fa fa-code-fork  icon-width">设置为此商品底卡</i>' +
                    '</button></div>';
            }


            return str;
        }

        $scope.showHistory = function (rowObj) {
            sampleMgmtService.getHistory(rowObj.sampleId, 1)
                .then(function successCallback(response) {

                    $uibModal.open({
                        templateUrl: 'app/sample-mgmt/modal/sample-history.html?v=' + LG.appConfig.clientVersion,
                        size: 'lg',
                        keyboard: false,
                        controller: 'SampleHistoryCtl',
                        resolve: {
                            pageModel: function () {
                                return response.data.data;
                            },
                            sampleCode: function () {
                                return rowObj.sampleId
                            }
                        }
                    });
                });
        };

        $scope.createSampleId = function () {

            var modalInstance = $uibModal.open({
                templateUrl: 'app/sample-mgmt/modal/create-sample-id.html?v=' + LG.appConfig.clientVersion,
                keyboard: false,
                size: 'md',
                controller: 'CreateSampleIdModalCtrl',
                resolve: {
                    sellerUserList: function () {
                        return vm.sellerUserList;
                    }
                }
            });
        };

        $scope.modifyBelongOperator = function (row) {
            var sampleId = row.sampleId;
            var modalInstance = $uibModal.open({
                templateUrl: 'app/sample-mgmt/modal/modify-belong-operator.html?v=' + LG.appConfig.clientVersion,
                keyboard: false,
                controller: 'ModifyBelongOperatorModalCtrl',
                resolve: {
                    sampleId: function () {
                        return sampleId;
                    }
                }
            });
            modalInstance.result.then(function (result) {
                $scope.dtInstance.reloadData(function () {
                }, false);
                console.log('修改持有人结束');

            }, function (reason) {
                console.log('选择店铺结束');
            });
        };

        $scope.printBatchQrCode = function () {
            var selectedSampleIds = [];
            for (var sampleId in vm.selected) {
                if (vm.selected[sampleId]) {
                    selectedSampleIds.push(sampleId);
                }
            }
            ;
            if (!!!selectedSampleIds) {
                sampleMgmtService.showMessage('打印二维码', '请勾选要打印的记录');
            }
            var modalInstance = $uibModal.open({
                templateUrl: 'app/sample-mgmt/modal/print-batch-qr-code.html?v=' + LG.appConfig.clientVersion,
                keyboard: false,
                controller: 'PrintBatchQrCodeModalCtrl',
                resolve: {
                    selectedSampleIds: function () {
                        return selectedSampleIds;
                    },
                    sendType: function () {
                        return 0;
                    }
                }
            });
        };

        /**
         * 批量重新生成并打印
         */
        $scope.reBatchPrint = function () {

            var selectedSampleIds = [];
            for (var sampleId in vm.selected) {
                if (vm.selected[sampleId]) {
                    selectedSampleIds.push(sampleId);
                }
            }

            if (!!!selectedSampleIds || selectedSampleIds.length == 0) {
                sampleMgmtService.showMessage('重新生成并打印样卡二维码', '请勾选要重新生成并打印的记录');
                return;
            }

            var modalInstance = $uibModal.open({
                templateUrl: 'app/sample-mgmt/modal/re-create-print-sample.html?v=' + LG.appConfig.clientVersion,
                keyboard: false,
                controller: 'ReCreatePrintSampleModalCtrl',
                resolve: {
                    selectedSampleIds: function () {
                        return selectedSampleIds;
                    },
                    listData: function () {
                        return vm.allData;
                    }

                }
            });
        };

        /**
         * 单个重新生成并打印
         */
        $scope.reCreateOne = function (row) {
            console.log(row);
            if (row == null) {
                sampleMgmtService.showMessage('重新生成并打印样卡二维码', '勾选的记录为空');
                return;
            }

            var selectedSampleIds = [row.sampleId];
            var modalInstance = $uibModal.open({
                templateUrl: 'app/sample-mgmt/modal/re-create-print-sample.html?v=' + LG.appConfig.clientVersion,
                keyboard: false,
                controller: 'ReCreatePrintSampleModalCtrl',
                resolve: {
                    selectedSampleIds: function () {
                        return selectedSampleIds;
                    },
                    listData: function () {
                        return vm.allData;
                    }

                }
            });

        }

        $scope.printQrCode = function (rowObj, isBatch) {
            var selectedSampleIds = [];
            if (isBatch) {
                for (var sampleId in vm.selected) {
                    if (vm.selected[sampleId]) {
                        selectedSampleIds.push(sampleId);
                    }
                }
            } else {
                selectedSampleIds[0] = rowObj.sampleId;
            }

            var modalInstance = $uibModal.open({
                templateUrl: 'app/sample-mgmt/modal/print-qr-code.html?v=' + LG.appConfig.clientVersion,
                keyboard: false,
                controller: 'PrintQrCodeModalCtrl',
                resolve: {
                    rowObj: function () {
                        return rowObj;
                    },
                    isBatch: function () {
                        return isBatch;
                    },
                    selectedSampleIds: function () {
                        return selectedSampleIds;
                    }
                }
            });
        };

        $scope.deleteSample = function (rowObj) {
            SweetAlert.swal({
                    title: "是否确认删除此样卡?",
                    text: "删除后,买家后台将看不到此样卡信息",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#DD6B55",
                    confirmButtonText: "确认删除",
                    cancelButtonText: "取消",
                    closeOnConfirm: false,
                    closeOnCancel: true
                },
                function (isConfirm) {
                    if (isConfirm) {
                        //rowObj.isDeleted = true;
                        sampleMgmtService.deleteSample(rowObj.sampleId)
                            .then(function successCallback(resp) {
                                if (resp.data.code == 200) {
                                    refreshGrid();
                                    SweetAlert.swal("删除成功!", "样卡删除成功!", "success");
                                    refreshGrid();
                                } else {
                                    SweetAlert.swal("删除失败!", resp.data.message, "error");
                                }
                            });

                    } else {
                        toaster.pop({
                            type: 'error',
                            title: '提示信息',
                            body: "您中止了操作",
                            showCloseButton: true,
                            timeout: 5000
                        });
                    }
                });
        };

        /**
         * 批量修改货架位置
         */
        $scope.batchChangeShelf = function() {
            var selectedSampleIds = [];
            var selectedWarehouseId = [];
            for (var sampleId in vm.selected) {
                if (vm.selected[sampleId]) {
                    selectedSampleIds.push(sampleId);
                }
            }
            ;
            if (!!!selectedSampleIds || selectedSampleIds.length == 0) {
                sampleMgmtService.showMessage('批量修改货架位置', '请勾选需要修改货架的样卡');
                return;
            }

            // 筛选出对应的仓库id
            for (var i =0, j = vm.tableData.length; i < j;i++) {
                if (selectedSampleIds.indexOf(String(vm.tableData[i].sampleId)) > -1) {
                    if (selectedWarehouseId.indexOf(vm.tableData[i].warehouseId) === -1) {
                        selectedWarehouseId.push(vm.tableData[i].warehouseId);
                    }
                }
            }

            /**
             * 获取到当前操作人可以操作的仓库列表
             */
            sampleMgmtService.getUserWarehouse().then(function(resp){
                if (resp.data.code == 200) {
                    vm.warehouseList = resp.data.data;
                    if (vm.warehouseList.length === 0) {
                        sampleMgmtService.showMessage('你没有可以管理的仓库');
                        return;
                    } else {
                        for (var i = 0, j = selectedWarehouseId.length; i < j;i++) {
                            if (vm.warehouseList.indexOf(selectedWarehouseId[i]) === -1) {
                                sampleMgmtService.showMessage('批量选中没有权限的仓库');
                                return;
                            }
                        }
                    }

                    var modalInstance = $uibModal.open({
                        templateUrl: 'app/sample-mgmt/modal/batch-change-shelf.html?v=' + LG.appConfig.clientVersion,
                        keyboard: false,
                        controller: 'batchChangeShelfCtrl',
                        controllerAs:'vm',
                        resolve: {
                            sampleList: function() {
                                return selectedSampleIds;
                            },
                            warehouseList: function() {
                                return vm.modal.warehouseList;
                            },
                            opener: function(){
                                return $scope;
                            }
                        }
                    });
                }
            },function(){

            })

            // 打开一个新的modal
        }

        $scope.setBasicCard = function(rowObj) {
            SweetAlert.swal({
                    title: "是否设置此商品底卡?",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#DD6B55",
                    confirmButtonText: "确认",
                    cancelButtonText: "取消",
                    closeOnConfirm: false,
                    closeOnCancel: true
                },
                function (isConfirm) {
                    if (isConfirm) {
                        sampleMgmtService.setBasicCard(rowObj.sampleId)
                            .then(function successCallback(resp) {
                                if (resp.data.code == 200) {
                                    SweetAlert.swal("操作成功!",null,"success");
                                    refreshGrid();
                                } else {
                                    SweetAlert.swal("操作失败!", resp.data.message, "error");
                                }
                            },function(resp){

                            });

                    } else {
                    }
                });
        }

        /**
         * 改变仓库列表的回调函数
         */
        $scope.changeWarehouse = function() {
            if (!vm.warehouseId) {
                vm.modal.shelf_list = [];
                vm.shelfId = "";
                return;
            } else {
                sampleMgmtService.getShelfListByWarehouse(vm.warehouseId).then(function(resp){
                    if (resp.data.code === 200) {
                        vm.modal.shelf_list = resp.data.data;
                    }
                });
            }
        }

        function refreshGrid() {
            $scope.dtInstance.reloadData(function () {
            }, false);
        }

        $scope.getDetail = function (rowObj) {
            var modalInstance = $uibModal.open({

                templateUrl: 'app/sample-mgmt/modal/sample-detail.html?v=' + LG.appConfig.clientVersion,
                windowClass: 'large-Modal',
                keyboard: false,
                controller: 'SampleDetailModalCtrl',
                resolve: {
                    rowObj: function () {
                        return rowObj;
                    }
                }
            });
        };


        function diffHours(originDateStr) {
            if (isEmpty(originDateStr)) {
                originDateStr = moment(new Date(), "YYYY-MM-DD hh:mm:ss").format("YYYY-MM-DD"
                    + " HH:mm:ss");
            }
            originDateStr = originDateStr.replace(/-/g, "/");
            var originDate = new Date(originDateStr);
            var currentDate = new Date();
            var diff = (currentDate - originDate) / (3600 * 1000);
            return diff;
        }

        function timeHtml(data, type, full, meta) {

            if (data == null || data == '') {
                return "";
            }

            return $filter('date')(data, 'yyyy-MM-dd HH:mm:ss');
        }


        $scope.tabQuery = function (event) {

            setTimeout(function () {
                var ele = $(event.target);
                var dataFilter = ele.closest('li').attr("data-filter");
                if (isNullOrEmpty(dataFilter)) {
                    vm.tabFilter = [];
                } else {
                    vm.tabFilter = JSON.parse(decodeURIComponent(dataFilter));
                }
                $scope.submit();
            }, 200);
        }


        function serverData(sSource, aoData, fnCallback, oSettings) {
            var draw = aoData[0].value;
            vm.draw = draw;
            var sortColumn = $scope.dtColumns[parseInt(aoData[2].value[0].column)].mData;
            vm.sortColumn = sortColumn;
            var sortDir = aoData[2].value[0].dir;
            vm.sortDir = sortDir;
            var start = aoData[3].value;
            vm.start = start;
            var limit = aoData[4].value;
            vm.limit = limit;
            sortColumn = 'createTime';
            var queryConditionObject = resetQueryCondition();
            var selectedDepartment = $scope.treeInstance.jstree(true).get_selected();
            //将选择的部门代入条件
            if (selectedDepartment != null && selectedDepartment.length > 0) {
                if (selectedDepartment[0] != '-1') {
                    var rule = {"field": "ud.depart_id", "op": "equal", "value": selectedDepartment[0]};
                    queryConditionObject.rules.push(rule);
                }
            }
            var where = JSON.stringify(queryConditionObject);

            return sampleMgmtService.sampleQuery(
                draw, sortColumn, sortDir, start, limit, where
            ).then(function (resp) {
                vm.allData = {};
                vm.selected = {};
                vm.selectAll = false;
                for (var i = 0; i < resp.data.data.length; ++i) {
                    vm.allData[resp.data.data[i].sampleId] = resp.data.data[i];
                    vm.selected[resp.data.data[i].sampleId] = false;
                }

                for (var i = 0; i < resp.data.data.data.length; ++i) {
                    vm.allData[resp.data.data.data[i].sampleId] = resp.data.data.data[i];
                }
                fnCallback(resp.data.data);
                vm.tableData = resp.data.data.data;

            }).finally(function () {
                $scope.queryBtnDisabled = false;
            });
        }

        function resetQueryCondition() {
            var form = $('#sampleController').find('form');
            var queryConditionObject = getQueryParams(form, vm.tabFilter);

            return queryConditionObject;
        }

        $scope.submit = function () {
            $scope.queryBtnDisabled = true;
            $scope.dtInstance.reloadData();
            params = null;
        };

    }

    angular
        .module('app.sample-mgmt')
        .controller('SampleMgmtCtrl', SampleMgmtCtrl);
})();