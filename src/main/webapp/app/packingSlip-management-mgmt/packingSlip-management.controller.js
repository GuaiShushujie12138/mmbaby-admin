/**
 * packingSlipCtrl
 */
(function () {

    'use strict';

    packingSlipCtrl.$inject = ['$scope', '$http', '$uibModal', 'toaster', '$compile',
        '$filter', '$location', 'packingSlipMgmtService', 'DTOptionsBuilder',
        'DTColumnBuilder', '$state', 'permissionCheckService', 'SweetAlert'];

    /**
     * packingSlipCtrl
     */
    function packingSlipCtrl($scope, $http, $uibModal, toaster, $compile, $filter,
                                $location, packingSlipMgmtService, DTOptionsBuilder, DTColumnBuilder,
                                $state, permissionCheckService, SweetAlert) {
        var vm = this;
        var params = $location.search();
        $scope.sample = {};
        vm.belongUserList = [];
        vm.sellerUserList = [];
        $scope.dtInstance = {};

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

        // 码单查看权限
        vm.canDetail = permissionCheckService.check('WEB.PACKING.SLIP.DETAIL');

        // 码单失效权限
        vm.canCancel = permissionCheckService.check('WEB.PACKING.SLIP.CANCEL');

        // 审核通过权限
        vm.canAudit = permissionCheckService.check('WEB.PACKING.SLIP.AUDIT');

        // 修改链尚价
        vm.canModifyLSPrice = permissionCheckService.check('WEB.PACKING.SLIP.MODIFY.LSPRICE');

        // 修改销售价
        vm.canModifySalePrice = permissionCheckService.check('WEB.PACKING.SLIP.MODIFY.SALEPRICE');

        // 码单记录
        vm.canRecordList = permissionCheckService.check('WEB.PACKING.SLIP.MODIFY.RECORDLIST');

        //查看电子码单
        vm.canEPSdetail = permissionCheckService.check('WEB.PACKING.SLIP.E-DETAIL');

        //修改码单
        vm.canEditPS = permissionCheckService.check('WEB.PACKING.SLIP.EDIT');

        init();
        function init() {
            vm.sortColumn = "createTime";
            vm.limit = 10;
            vm.sortDir = "desc";
            vm.start = 0;
            vm.draw = 1;
            vm.crmBuyerId = "";
            vm.crmSellerId = "";


            //vm.startDate = $filter('date')(new Date(), 'yyyy-MM-dd') + " 00:00:00";
            var today = new Date();
            vm.startDate = $filter('date')(today.setMonth(today.getMonth()-1), 'yyyy-MM-dd') + " 00:00:00";
            vm.endDate = $filter('date')(new Date(), 'yyyy-MM-dd') + " 23:59:59";

            $scope.sample.createTime = {
                startDate: vm.startDate,
                endDate: vm.endDate
            };

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

            // packingSlipMgmtService.getOperatorList()
            //     .then(function (resp) {
            //         vm.buyerList = resp.data.data.buyerOperatorList;
            //         vm.sellerList = resp.data.data.sellerOperatorList;
            //     });

            $scope.crmBuyerObj = {
                name:'',
                id: '',
                treeType: ''
            }

            $scope.crmSellerObj = {
                name:'',
                id: '',
                treeType: ''
            }

            packingSlipMgmtService.getOperator().then(function (resp) {
                $scope.operatorList = resp.data.data.operatorList

            });
        }

        /**
         * 选择一个树节点
         */
        $scope.selectTreeNode = function (nodedata) {
            console.log(nodedata);
            var selectId = $scope.treeInstance.jstree(true).get_selected()[0];
            console.log($scope.treeInstance.jstree(true).get_json(selectId));
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
            .withOption('autoWidth', false)
            .withOption('scrollX', false)
            .withOption('lengthMenu', [10, 25, 50, 100, 200])
            .withOption('displayLength', 10)
            .withPaginationType('full_numbers')
            // .withOption('rowCallback', rowCallback)
            .withOption('createdRow', function(row, data, dataIndex) {
                $compile(angular.element(row).contents())($scope);
            })
            .withOption('headerCallback', function (header) {
                if (!vm.headerCompiled) {
                    vm.headerCompiled = true;
                    $compile(angular.element(header).contents())($scope);
                }
            });

        $scope.dtColumns = [
            DTColumnBuilder.newColumn(null).withTitle('操作').notSortable().withClass('text-center').withOption('width', '60px')
                .renderWith(actionsHtml),
            DTColumnBuilder.newColumn('packingSlipId').withTitle('码单ID').withClass('func-th').withOption("width", "150px").notSortable(),
            DTColumnBuilder.newColumn('createTime').withTitle('生成时间').withClass('func-th').withOption("width", "200px").notSortable(),
            DTColumnBuilder.newColumn('statusName').withTitle('状态').withClass('func-th').withOption("width", "100px").notSortable(),
            DTColumnBuilder.newColumn('crmSellerName').withTitle('码单发起人').withClass('func-th').withOption("width", "150px").notSortable(),
            DTColumnBuilder.newColumn('itemId').withTitle('商品ID').withClass('func-th').withOption("width", "150px").notSortable(),
            DTColumnBuilder.newColumn('tradeId').withTitle('订单ID').withClass('func-th').withOption("width", "150px").notSortable(),
            DTColumnBuilder.newColumn('procurementPrice').withTitle('采购金额').withClass('func-th').withOption("width", "100px").notSortable().renderWith(numHtml),
            DTColumnBuilder.newColumn('lsPrice').withTitle('链尚金额').withClass('func-th').withOption("width", "100px").notSortable().renderWith(numHtml),
            DTColumnBuilder.newColumn('salePrice').withTitle('销售金额').withClass('func-th').withOption("width", "100px").notSortable().renderWith(numHtml),
            DTColumnBuilder.newColumn('requestInquiryId').withTitle('询价单ID').withOption("width", "100px").notSortable(),
            DTColumnBuilder.newColumn('crmBuyerName').withTitle('询价单发起人').withOption("width", "200px").notSortable()
        ];

        function actionsHtml(data, type, full, meta) {
            var str = '';

            // 状态值是否显示失效
            var statusCancel = data.status === 10 || data.status === 20 || data.status === 30 || data.status === 40;

            var statusAudit = data.status === 30;

            var statusModifyLSPrice = data.status === 10 || data.status === 20 || data.status === 30;

            var statusModifySalePrice = data.status === 20 || data.status === 30 ||data.status === 40;

            //修改
            var statusEdit = data.status === 10 || data.status === 20 || data.status === 30 || data.status === 40;



            str += '<div class="m-t-xs m-b-sm" ng-if="vm.canDetail"><button'
                + ' class="btn'
                + ' btn-xs'
                + ' btn-w-xs'
                + ' btn-success btn-outline" ng-click="getDetail(vm.tableData[' + meta.row + '])">' +
                '    <i class="fa fa-code-fork  icon-width">查看详情</i>' +
                '</button></div>';
            str += '<div class="m-t-xs m-b-sm" ng-if="vm.canCancel && ' + statusCancel + '"><button'
                + ' class="btn'
                + ' btn-xs'
                + ' btn-w-xs'
                + ' btn-success btn-outline"'
                + ' ng-click="invalidSlip(vm.tableData[' + meta.row + '],' + false + ')">' +
                '    <i class="fa fa-code-fork  icon-width">使失效</i>' +
                '</button></div>';
            //str += '<div class="m-t-xs m-b-sm" ng-if="vm.canAudit &&' + statusAudit + '"><button'
            //    + ' class="btn'
            //    + ' btn-xs'
            //    + ' btn-w-xs'
            //    + ' btn-success btn-outline"'
            //    + ' ng-click="auditSuccess(vm.tableData[' + meta.row + '])">' +
            //    '    <i class="fa fa-code-fork  icon-width">审核通过</i>' +
            //    '</button></div>';

            str += '<div class="m-t-xs m-b-sm" ng-if="vm.canModifyLSPrice && ' + statusModifyLSPrice +'"><button'
                + ' class="btn'
                + ' btn-xs'
                + ' btn-w-xs'
                + ' btn-success btn-outline"'
                + ' ng-click="modifyLsPrice(vm.tableData[' + meta.row + '])">' +
                '    <i class="fa fa-code-fork  icon-width">修改链尚价</i>' +
                '</button></div>';

            str += '<div class="m-t-xs m-b-sm" ng-if="vm.canModifySalePrice && ' + statusModifySalePrice + '"><button'
                + ' class="btn'
                + ' btn-xs'
                + ' btn-w-xs'
                + ' btn-success btn-outline"'
                + ' ng-click="modifySalePrice(vm.tableData[' + meta.row + '])">' +
                '    <i class="fa fa-code-fork  icon-width">修改销售价</i>' +
                '</button></div>';

            str += '<div class="m-t-xs m-b-sm" ng-if="vm.canRecordList"><button'
                + ' class="btn'
                + ' btn-xs'
                + ' btn-w-xs'
                + ' btn-success btn-outline"'
                + ' ng-click="showDemandDynamic(vm.tableData[' + meta.row + '])">' +
                '    <i class="fa fa-code-fork  icon-width">码单记录</i>' +
                '</button></div>';

            str += '<div class="m-t-xs m-b-sm" ng-if="vm.canEPSdetail"><button'
                + ' class="btn'
                + ' btn-xs'
                + ' btn-w-xs'
                + ' btn-success btn-outline"'
                + ' ng-click="lookElectronicPackingSlip(vm.tableData[' + meta.row + '])">' +
                '    <i class="fa fa-code-fork  icon-width">查看电子码单</i>' +
                '</button></div>';

            str += '<div class="m-t-xs m-b-sm" ng-if="vm.canEditPS && '+ statusEdit +'"><button'
                + ' class="btn'
                + ' btn-xs'
                + ' btn-w-xs'
                + ' btn-success btn-outline"'
                + ' ng-click="editPackingSlip(vm.tableData[' + meta.row + '])">' +
                '    <i class="fa fa-code-fork  icon-width">修改码单</i>' +
                '</button></div>';

            return str;
        }

        //查看电子码单
        $scope.lookElectronicPackingSlip = function (rowObj) {
            var packingSlipId = rowObj.packingSlipId;
            var modalInstance = $uibModal.open({
                templateUrl: 'app/packingSlip-management-mgmt/modal/electronic-packing-slip.html?v=' + LG.appConfig.clientVersion,
                size: 'lg',
                keyboard: false,
                controller: 'electronicPackingSlipCtrl',
                resolve: {
                    packingSlipId: function () {
                        return packingSlipId;
                    },
                }
            });
            modalInstance.result.then(function (result) {
                // $scope.submit();
            }, function (reason) {

            });
        };

        //修改码单
        $scope.editPackingSlip = function (rowObj) {
            //var packingSlipId = rowObj.packingSlipId;
            //var modalInstance = $uibModal.open({
            //    templateUrl: 'app/requestInquiry-management-mgmt/modal/start-packing-slip.html?v=' + LG.appConfig.clientVersion,
            //    size: 'lg',
            //    keyboard: false,
            //    controller: 'startPackingSlipCtrl',
            //    resolve: {
            //        requestInquiryId:  function () {
            //            return null;
            //        },
            //        packingSlipId: function () {
            //            return packingSlipId;
            //        },
            //    }
            //});
            //modalInstance.result.then(function (result) {
            //    // $scope.submit();
            //}, function (reason) {
            //
            //});

            var packingSlipId = rowObj.packingSlipId;
            var url = '/#/request/start-packing-slip/null'+'/'+packingSlipId;
            window.open(url);
        };

        // 码单记录
        $scope.showDemandDynamic = function (rowObj) {
            packingSlipMgmtService.getSlipRecordList(rowObj.packingSlipId, 1)
                .then(function successCallback(response) {

                    $uibModal.open({
                        templateUrl: 'app/packingSlip-management-mgmt/modal/packingSlip-recordList.html?v=' + LG.appConfig.clientVersion,
                        size: 'lg',
                        keyboard: false,
                        controller: 'recordListCtrl',
                        resolve: {
                            pageModel: function () {
                                return response.data.data;
                            },
                            demandId: function () {
                                return rowObj.packingSlipId;
                            }
                        }
                    });
                });
        };

        // 提交逻辑
        $scope.submit = function () {
            $scope.queryBtnDisabled = true;
            $scope.dtInstance.reloadData();
            params = null;
        };

        // 码单失效
        $scope.invalidSlip = function (rowObj) {
            //SweetAlert.swal({
            //        title: "使失效",
            //        text: "码单失效后将不可使用，此操作不可",
            //        type: "input",
            //        showCancelButton: true,
            //        confirmButtonColor: "#DD6B55",
            //        confirmButtonText: "确认失效",
            //        cancelButtonText: "取消",
            //        inputPlaceholder: "请输入原因",
            //        closeOnConfirm: false,
            //        closeOnCancel: true
            //    },
            //    function (invalidReason) {
            //        if (invalidReason) {
            //            packingSlipMgmtService.invalidSlip(rowObj.packingSlipId,invalidReason)
            //                .then(function successCallback(resp) {
            //                    if (resp.data.code == 200) {
            //                        SweetAlert.swal("操作成功!", '码单' + rowObj.packingSlipId + '失效', "success");
            //                        refreshGrid();
            //                    } else {
            //                        SweetAlert.swal("操作失败!", resp.data.message, "error");
            //                    }
            //                });
            //
            //        }
            //    }
            //);

            var modalInstance = $uibModal.open({
                templateUrl: 'app/packingSlip-management-mgmt/modal/packingSlipFailure.html?v=' + LG.appConfig.clientVersion,
                keyboard: false,
                controller: 'packingSlipFailureCtrl',
                resolve: {
                    packingSlipId: function () {
                        return  rowObj.packingSlipId
                    },
                }
            });
        };

        // 码单审核通过

        $scope.auditSuccess = function(rowObj) {
            SweetAlert.swal({
                    title: "审核码单",
                    text: "是否确认审核通过？",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#DD6B55",
                    confirmButtonText: "审核通过",
                    cancelButtonText: "取消",
                    closeOnConfirm: false,
                    closeOnCancel: true
                },
                function (isConfirm) {
                    if (isConfirm) {
                        packingSlipMgmtService.auditSuccess(rowObj.packingSlipId)
                            .then(function successCallback(resp) {
                                if (resp.data.code == 200) {
                                    SweetAlert.swal("操作成功!", '码单' + rowObj.packingSlipId + '审核通过', "success");
                                    refreshGrid();
                                } else {
                                    SweetAlert.swal("操作失败!", resp.data.message, "error");
                                }
                            });

                    }
                }
            );
        };


        // 获取码单详情
        $scope.getDetail = function(rowObj) {
            var modalInstance = $uibModal.open({
                templateUrl: 'app/packingSlip-management-mgmt/modal/packingSlip-detail.html?v=' + LG.appConfig.clientVersion,
                size: 'lg',
                keyboard: false,
                controller: 'slipDetailCtrl',
                resolve: {
                    packingSlipId: function () {
                        return rowObj.packingSlipId;
                    }
                }
            });
        }

        //  修改链尚价

        $scope.modifyLsPrice = function(rowObj) {
            var modalInstance = $uibModal.open({
                templateUrl: 'app/packingSlip-management-mgmt/modal/modifyLsPrice.html?v=' + LG.appConfig.clientVersion,
                keyboard: false,
                controller: 'modifyLsPriceCtrl',
                resolve: {
                    packingSlipId: function () {
                        return rowObj.packingSlipId;
                    },
                    opener: function() {
                        return $scope;
                    }
                }
            });
        }

        // 修改销售价

        $scope.modifySalePrice = function(rowObj) {
            var modalInstance = $uibModal.open({
                templateUrl: 'app/packingSlip-management-mgmt/modal/modifySalePrice.html?v=' + LG.appConfig.clientVersion,
                keyboard: false,
                controller: 'modifySalePriceCtrl',
                resolve: {
                    selectData:function(){
                        return rowObj;
                    },
                    packingSlipId: function () {
                        return rowObj.packingSlipId;
                    },
                    opener: function() {
                        return $scope;
                    }
                }
            });
        }

        // 选择需求单发起人
        $scope.selectCrmBuyer = function() {
            var modalInstance = $uibModal.open({
                templateUrl: 'app/packingSlip-management-mgmt/modal/select-buyerSeller-id.html?v=' + LG.appConfig.clientVersion,
                keyboard: false,
                controller: 'slipSelectBuyerSellerIdCtrl',
                resolve: {
                    Identity: function () { // 1 为crm买家
                        return 1;
                    },
                    opener: function () {
                        return $scope;
                    },
                    id: function() {
                        return $scope.crmBuyerObj.id;
                    }
                }
            });
        };

        // 选择码单发起人

        $scope.selectCrmSeller = function() {
            var opener = $scope;
            var modalInstance = $uibModal.open({
                templateUrl: 'app/packingSlip-management-mgmt/modal/select-buyerSeller-id.html?v=' + LG.appConfig.clientVersion,
                keyboard: false,
                controller: 'slipSelectBuyerSellerIdCtrl',
                resolve: {
                    Identity: function () { // 2为crm卖家
                        return 2;
                    },
                    opener: function() {
                        return $scope;
                    },
                    id: function() {
                        return $scope.crmSellerObj.id;
                    }
                }
            });
        }

        // 选择需求单发起人完成后

        $scope.afterSelectCrmBuyer = function(id,treeType,name) {
            var newObj = {
                id: id,
                treeType: treeType,
                name: name
            }
            $scope.crmBuyerObj = newObj;
        }

        // 选择码单发起人完成后
        $scope.afterSelectCrmSeller = function(id,treeType,name) {
            var newObj = {
                id: id,
                treeType: treeType,
                name: name
            }
            $scope.crmSellerObj = newObj;
        }

        // 清空需求单发起人

        $scope.clearCrmBuyer = function() {
            $scope.crmBuyerObj = {
                name:'',
                id: '',
                treeType: ''
            }
        }

        // 清空需求单跟进人

        $scope.clearCrmSeller = function() {
            $scope.crmSellerObj = {
                name:'',
                id: '',
                treeType: ''
            }
        };

        // 码单导出

        $scope.exportPackingSlip = function() {

        }



        function refreshGrid() {
            $scope.dtInstance.reloadData(function () {
            }, false);
        }


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

        function numHtml(data) {
            if (data == null ) {
                return "";
            } else if (typeof data == 'string' && data.indexOf('*') !== -1) {
                return '***';
            }

            return $filter('number')(data, 2);
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
            //var selectedDepartment = $scope.treeInstance.jstree(true).get_selected();
            // //将选择的部门代入条件
            // if(selectedDepartment != null && selectedDepartment.length > 0) {
            //     if(selectedDepartment[0] != '-1') {
            //         var rule = {"field": "ud.depart_id", "op": "equal", "value": selectedDepartment[0]};
            //         queryConditionObject.rules.push(rule);
            //     }
            // }

            if ($scope.itemPlace) {
                if ($scope.itemPlace == 'null') {
                    rule = {"field":"iteminfo.ls_isbn_code","value":'',"op":"isnull"}
                } else {
                    rule = {"field":"iteminfo.ls_isbn_code","value": $scope.itemPlace ,"op":"startWith"}
                }
                queryConditionObject.rules.push(rule);
            }

            if ($scope.crmBuyerObj && $scope.crmBuyerObj.id) {
                var rule = '';
                rule = {"field":"ps.crm_buyer_id","value":$scope.crmBuyerObj.id,"op":"equal"}
                // if ($scope.crmBuyerObj.treeType === 20) {
                //     rule = {"field":"ps.crm_buyer_id","value":$scope.crmBuyerObj.id,"op":"equal"}
                // } else if ($scope.crmBuyerObj.treeType === 10) {
                //     rule = {"field":"buyerrel.depart_id","value":$scope.crmBuyerObj.id,"op":"equal"}
                // }
                queryConditionObject.rules.push(rule);
            }

            if ($scope.crmSellerObj && $scope.crmSellerObj.id) {
                var rule = '';
                rule = {"field":"ps.crm_seller_id","value":$scope.crmSellerObj.id,"op":"equal"}
                // if ($scope.crmSellerObj.treeType === 20) {
                //     rule = {"field":"ps.crm_seller_id","value":$scope.crmSellerObj.id,"op":"equal"}
                // } else if ($scope.crmSellerObj.treeType === 10) {
                //     rule = {"field":"sellerrel.depart_id","value":$scope.crmSellerObj.id,"op":"equal"}
                // }
                queryConditionObject.rules.push(rule);
            }

            var where =JSON.stringify(queryConditionObject);

            return packingSlipMgmtService.listQuery(
                draw, sortColumn, sortDir, start, limit,where
            ).then(function(resp) {
                fnCallback(resp.data.data);
                vm.tableData = resp.data.data.data;

            }).finally(function() {
                $scope.queryBtnDisabled = false;
            });
        }

        $scope.exportPackingSlip = function(role) {

            var queryConditionObject = resetQueryCondition();

            if ($scope.crmBuyerObj && $scope.crmBuyerObj.id) {
                var rule = '';
                if ($scope.crmBuyerObj.treeType === 20) {
                    rule = {"field":"ps.crm_buyer_id","value":$scope.crmBuyerObj.id,"op":"equal"}
                } else if ($scope.crmBuyerObj.treeType === 10) {
                    rule = {"field":"buyerrel.depart_id","value":$scope.crmBuyerObj.id,"op":"equal"}
                }
                queryConditionObject.rules.push(rule);
            }

            if ($scope.crmSellerObj && $scope.crmSellerObj.id) {
                var rule = '';
                if ($scope.crmSellerObj.treeType === 20) {
                    rule = {"field":"ps.crm_seller_id","value":$scope.crmSellerObj.id,"op":"equal"}
                } else if ($scope.crmSellerObj.treeType === 10) {
                    rule = {"field":"sellerrel.depart_id","value":$scope.crmSellerObj.id,"op":"equal"}
                }
                queryConditionObject.rules.push(rule);
            }

            vm.sortColumn = 'createTime';

            var where =JSON.stringify(queryConditionObject);

            var url = '/web/packing-slip/download.do';

            $http.post(url,{
                draw: vm.draw,
                sortColumn: vm.sortColumn,
                sortDir: vm.sortDir,
                start: vm.start,
                limit: vm.limit,
                where:where
            }).then(function(response) {
                toaster.pop(
                    {
                        type: response.data.code == 200? 'success':'error',
                        title: '操作提示',
                        body: response.data.message,
                        showCloseButton: true,
                        timeout: 5000
                    });

            });
            console.log(url);
            // window.open(url);
        };
        function resetQueryCondition() {
            var form = $('#sampleController').find('form');
            var queryConditionObject = getQueryParams(form, vm.tabFilter);

            return queryConditionObject;
        }

    }

    angular
        .module('app.packing-slip-management')
        .controller('packingSlipCtrl', packingSlipCtrl);
})();