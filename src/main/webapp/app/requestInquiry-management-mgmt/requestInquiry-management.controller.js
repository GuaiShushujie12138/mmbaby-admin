/**
 * requestInquiryCtrl
 */
(function () {

    'use strict';

    requestInquiryCtrl.$inject = ['$scope', '$http', '$uibModal', 'toaster', '$compile',
        '$filter', '$location', 'requestInquiryMgmtService', 'DTOptionsBuilder',
        'DTColumnBuilder', '$state', 'permissionCheckService', 'SweetAlert','$rootScope'];

    /**
     * requestInquiryCtrl
     */
    function requestInquiryCtrl($scope, $http, $uibModal, toaster, $compile, $filter,
                                $location, requestInquiryMgmtService, DTOptionsBuilder, DTColumnBuilder,
                                $state, permissionCheckService, SweetAlert,$rootScope) {
        var vm = this;
        var params = $location.search();
        $scope.sample = {};
        vm.belongUserList = [];
        vm.sellerUserList = [];
        $scope.dtInstance = {};


        //是否有查看详情的权限
        vm.canDetail = permissionCheckService.check(
            "WEB.REQUEST.INQUIRY.DETAIL");

        // 是否有失效的权限
        vm.canCancel = permissionCheckService.check(
            "WEB.REQUEST.INQUIRY.CANCEL");

        // 是否有分配的权限
        vm.canAllocate = permissionCheckService.check(
            "WEB.REQUEST.INQUIRY.ALLOCATE");

        // 是否有查看需求单记录的权利
        vm.canRecordList = permissionCheckService.check(
            "WEB.REQUEST.INQUIRY.ALLOCATE");

        //是否有开码单的权利
        vm.canStartPackingSlip = permissionCheckService.check(
            "WEB.PACKING.SLIP.ADD");

        // 是否有修改银行卡的权限
        vm.canEditBankCard = permissionCheckService.check(
            "WEB.PERMISSION.USER-MGMT.BINDCARD"
        );

        /**
         *  初始化判断是否要绑定银行卡
         */
        requestInquiryMgmtService.getInitInfo().then(function(resp){
            if (vm.canEditBankCard && resp.data.code === 200) {
                if (!resp.data.data.lscrmUsersBankEntityDto){
                    SweetAlert.swal({
                            title: "绑卡",
                            text: "请先绑定个人银行卡，米样订单款项会直接转账至该银行卡账户。请立刻去绑卡",
                            confirmButtonColor: "#DD6B55",
                            confirmButtonText: "确认",
                            closeOnConfirm: false
                        },
                        function(isConfirm) {
                            if (isConfirm) {
                                // $state.go('BIND-CARD.DETAIL');
                                location.href = '/#/bind-card/detail';
                                swal.close();
                            }
                        }
                    )
                } else {
                    init();
                }
            }
        });

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

            // requestInquiryMgmtService.getOperatorList()
            //     .then(function (resp) {
            //         vm.buyerList = resp.data.data.buyerOperatorList;
            //         vm.sellerList = resp.data.data.sellerOperatorList;
            //     });
            requestInquiryMgmtService.queryDeptTree().then(function (resp) {
                if (resp.data.code == 200) {
                    $scope.treeData = resp.data.data.deptTree;
                    //重绘
                    $scope.treeConfig.version++;
                } else {
                    toaster.pop({
                        type: 'info',
                        title: '提示信息',
                        body: resp.data.message,
                        showCloseButton: true,
                        timeout: 5000
                    });
                }
            }, function () {

            });

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

            requestInquiryMgmtService.getBuyerCity().then(function(resp) {
                if (resp.data.code === 200) {
                    $scope.salesAreaList = resp.data.data.salesAreaList;

                    $scope.salesAreaList.forEach(function(item,index) {
                        item.id = String(item.id);
                    });
                } else {
                    toaster.pop({
                        type: 'error',
                        title: '',
                        body: resp.data.message,
                        showCloseButton: true,
                        timeout: 5000
                    });
                }
            });

            requestInquiryMgmtService.getInquiryNum().then(function(resp) {
                if (resp.data.code === 200) {
                    $scope.southNum = resp.data.data.southNum;
                    $scope.eastNum = resp.data.data.eastNum;
                }
            });

            requestInquiryMgmtService.getOperator().then(function (resp) {
                $scope.operatorList = resp.data.data.operatorList

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
            DTColumnBuilder.newColumn('requestInquiryId').withTitle('询价单ID').withClass('func-th').withOption("width", "200px").notSortable(),
            DTColumnBuilder.newColumn('packingSlipId').withTitle('码单ID').withClass('func-th').withOption("width", "150px").notSortable(),
            DTColumnBuilder.newColumn('tradeId').withTitle('订单ID').withClass('func-th').withOption("width", "150px").notSortable(),
            DTColumnBuilder.newColumn('createTime').withTitle('生成时间').withClass('func-th').withOption("width", "200px"),
            DTColumnBuilder.newColumn(null).withTitle('状态').withClass('func-th').withOption("width", "60px").notSortable().renderWith(statusHtml),
            DTColumnBuilder.newColumn('crmSellerName').withTitle('询价单跟进人').withOption("width", "200px").notSortable(),
            DTColumnBuilder.newColumn('crmBuyerName').withTitle('询价单发起人').withClass('func-th').withOption("width", "200px").notSortable(),
            DTColumnBuilder.newColumn('realBuyerId').withTitle('真实买家ID').withClass('func-th ').withOption("width", "60px").notSortable(),
            DTColumnBuilder.newColumn('itemId').withTitle('商品ID').withClass('func-th').withOption("width", "60px").notSortable(),
            DTColumnBuilder.newColumn('itemName').withTitle('商品名称').withClass('func-th').withOption("width", "500px").notSortable(),
        ];

        function statusHtml(data,type,full,meta) {
            if (data.status === 60) {
                if (data.sysAutoFeedback === 0) {
                    return '供给顾问反馈';
                } else {
                    return '系统自动反馈';
                }
            } else {
                return data.statusName;
            }
        }

        function actionsHtml(data, type, full, meta) {
            var str = '';

            str += '<div class="m-t-xs m-b-sm" ng-if="vm.canDetail"><button'
                + ' class="btn'
                + ' btn-xs'
                + ' btn-w-xs'
                + ' btn-success btn-outline" ng-click="getDetail(vm.tableData[' + meta.row + '])">' +
                '    <i class="fa fa-code-fork  icon-width">查看</i>' +
                '</button></div>';

            str += '<div class="m-t-xs m-b-sm"><button'
                + ' class="btn'
                + ' btn-xs'
                + ' btn-w-xs'
                + ' btn-success btn-outline" ng-click="watchInquiryDetail(vm.tableData[' + meta.row + '])">' +
                '    <i class="fa fa-code-fork  icon-width">查看询价</i>' +
                '</button></div>';

            var showEditBtn = (Number(data.crmSellerId) === Number($rootScope.user.userId));//data.status === 50 &&
            str += '<div class="m-t-xs m-b-sm" ng-if="' + showEditBtn + ' "><button'
                + ' class="btn'
                + ' btn-xs'
                + ' btn-w-xs'
                + ' btn-success btn-outline" ng-click="editInquiry(vm.tableData[' + meta.row + '])">' +
                '    <i class="fa fa-code-fork  icon-width">修改询价单</i>' +
                '</button></div>';


            var showExpireBtn = data.status !== 30 && data.status !== 20 && data.status !== 40;
            str += '<div class="m-t-xs m-b-sm" ng-if="vm.canCancel && ' + showExpireBtn +' "><button'
                + ' class="btn'
                + ' btn-xs'
                + ' btn-w-xs'
                + ' btn-success btn-outline"'
                + ' ng-click="stateChange(vm.tableData[' + meta.row + '])">' +
                '    <i class="fa fa-code-fork  icon-width">状态变更</i>' +
                '</button></div>';
            str += '<div class="m-t-xs m-b-sm" ng-if="vm.canAllocate && ' + (data.status !== 20 && data.status !== 30 && data.status !== 40) + '"><button'
                + ' class="btn'
                + ' btn-xs'
                + ' btn-w-xs'
                + ' btn-success btn-outline"'
                + ' ng-click="allocateInquiry(vm.tableData[' + meta.row + '])">' +
                '    <i class="fa fa-code-fork  icon-width">分配询价单</i>' +
                '</button></div>';

            str += '<div class="m-t-xs m-b-sm" ng-if="vm.canRecordList"><button'
                + ' class="btn'
                + ' btn-xs'
                + ' btn-w-xs'
                + ' btn-success btn-outline"'
                + ' ng-click="showDemandDynamic(vm.tableData[' + meta.row + '])">' +
                '    <i class="fa fa-code-fork  icon-width">询价单记录</i>' +
                '</button></div>';

            str += '<div class="m-t-xs m-b-sm" ng-if="vm.canStartPackingSlip && ' + (data.status === 10) + '"><button'
                + ' class="btn'
                + ' btn-xs'
                + ' btn-w-xs'
                + ' btn-success btn-outline"'
                + ' ng-click="packingSlip(vm.tableData[' + meta.row + '])">' +
                '    <i class="fa fa-code-fork  icon-width">开码单</i>' +
                '</button></div>';
            return str;
        }

        // 开码单
        $scope.packingSlip = function (row) {
            //var modalInstance = $uibModal.open({
            //    templateUrl: 'app/requestInquiry-management-mgmt/modal/start-packing-slip.html?v=' + LG.appConfig.clientVersion,
            //    size: 'lg',
            //    keyboard: false,
            //    controller: 'startPackingSlipCtrl',
            //    resolve: {
            //        requestInquiryId:  function () {
            //            return row.requestInquiryId;
            //        },
            //        packingSlipId: function () {
            //            return null;
            //        },
            //    }
            //});
            //modalInstance.result.then(function (result) {
            //    $scope.submit();
            //}, function (reason) {
            //
            //});
            var  requestInquiryId = row.requestInquiryId;
            var url = '/#/request/start-packing-slip/'+requestInquiryId+'/null';
            window.open(url);
        };


        // 询价单记录
        $scope.showDemandDynamic = function (rowObj) {
            requestInquiryMgmtService.getRecordList(rowObj.requestInquiryId, 1)
                .then(function successCallback(response) {

                    $uibModal.open({
                        templateUrl: 'app/requestInquiry-management-mgmt/modal/inquiry-recordList.html?v=' + LG.appConfig.clientVersion,
                        size: 'lg',
                        keyboard: false,
                        controller: 'recordListCtrl',
                        resolve: {
                            pageModel: function () {
                                return response.data.data;
                            },
                            demandId: function () {
                                return rowObj.requestInquiryId;
                            },
                            itemInfo:function(){
                                return rowObj.status;
                            }
                        }
                    });
                });
        };

        // 分配询价单
        $scope.allocateInquiry = function (rowObj) {
            var sellerList = [];
            requestInquiryMgmtService.getAlloacteOperatorList().then(function(resp) {
                if (resp.data.code == 200) {
                    sellerList = resp.data.data.operatorList;
                    $uibModal.open({
                        templateUrl: 'app/requestInquiry-management-mgmt/modal/allocate-inquiry.html?v=' + LG.appConfig.clientVersion,
                        keyboard: false,
                        controller: 'allocateInquiryCtrl',
                        resolve: {
                            sellerList: function () {
                                return sellerList;
                            },
                            sellerId: function () {
                                return rowObj.crmSellerId;
                            },
                            opener: function () {
                                return $scope;
                            },
                            demandId: function () {
                                return rowObj.requestInquiryId;
                            }
                        }
                    });
                } else {
                    toaster.pop({
                        type: 'error',
                        title: '提示信息',
                        body: '请求异常',
                        showCloseButton: true,
                        timeout: 5000
                    });
                }
            },function() {});
        }

        // 提交逻辑
        $scope.submit = function () {
            $scope.queryBtnDisabled = true;
            $scope.dtInstance.reloadData();
            params = null;
        };

        // 询价单失效（旧）
        // $scope.invalidInquiry = function (rowObj) {
        //     SweetAlert.swal({
        //             title: "使失效",
        //             text: "需求单失效后将不可使用,此操作不可逆",
        //             type: "input",
        //             showCancelButton: true,
        //             confirmButtonColor: "#DD6B55",
        //             confirmButtonText: "确认失效",
        //             cancelButtonText: "取消",
        //             inputPlaceholder: "请输入原因",
        //             closeOnConfirm: false,
        //             closeOnCancel: true
        //         },
        //         function (invalidReason) {
        //             if (invalidReason) {
        //                 requestInquiryMgmtService.invalidInquiry(rowObj.requestInquiryId,invalidReason)
        //                     .then(function successCallback(resp) {
        //                         if (resp.data.code == 200) {
        //                             SweetAlert.swal("操作成功!", '需求单'+ rowObj.requestInquiryId + '失效', "success");
        //                             refreshGrid();
        //                         } else {
        //                             SweetAlert.swal("操作失败!", resp.data.message, "error");
        //                         }
        //                     });
        //
        //             }
        //         });
        // };

        // 询价单状态变更（新）

        $scope.stateChange = function(rowObj){
            var modalInstance = $uibModal.open({
                templateUrl: 'app/requestInquiry-management-mgmt/modal/stateChange.html?v=' + LG.appConfig.clientVersion,
                keyboard: false,
                controller: 'stateChangeCtrl',
                controllerAs: 'vm',
                resolve: {
                    inquiryData: function() {
                        return rowObj;
                    },
                    opener: function() {
                        return $scope;
                    }
                }

            });
        }

        // 获取需求单详情
        $scope.getDetail = function(rowObj) {
            var modalInstance = $uibModal.open({
                templateUrl: 'app/requestInquiry-management-mgmt/modal/requestInquiry-detail.html?v=' + LG.appConfig.clientVersion,
                size: 'lg',
                keyboard: false,
                controller: 'inquiryDetailCtrl',
                resolve: {
                    requestInquiryId: function () {
                        return rowObj.requestInquiryId;
                    }
                }
            });
        }

        // 选择需求单发起人
        $scope.selectCrmBuyer = function() {
            var modalInstance = $uibModal.open({
                templateUrl: 'app/requestInquiry-management-mgmt/modal/select-buyerSeller-id.html?v=' + LG.appConfig.clientVersion,
                keyboard: false,
                controller: 'selectBuyerSellerIdCtrl',
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

        // 选择需求单跟进人

        $scope.selectCrmSeller = function() {
            var opener = $scope;
            var modalInstance = $uibModal.open({
                templateUrl: 'app/requestInquiry-management-mgmt/modal/select-buyerSeller-id.html?v=' + LG.appConfig.clientVersion,
                keyboard: false,
                controller: 'selectBuyerSellerIdCtrl',
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

        // 查看询价

        $scope.watchInquiryDetail = function(rowObj) {
            var opener = $scope;
            var modalInstance = $uibModal.open({
                templateUrl: 'app/requestInquiry-management-mgmt/modal/watchInquiryDetail.html?v=' + LG.appConfig.clientVersion,
                keyboard: false,
                controller: 'watchInquiryCtrl',
                resolve: {
                    itemId: function() {
                        return rowObj.itemId;
                    },
                    opener: function() {
                        return $scope;
                    }
                }
            });
        }

        // 修改询价

        $scope.editInquiry = function(rowObj) {
            var canModifyInquiry = false;
            requestInquiryMgmtService.canModifyInquiry(rowObj.requestInquiryId,rowObj.itemId).then(function(resp) {
                if (resp.data.code == 200) {
                    if (!resp.data.data.canModifyInquiry) {
                        toaster.pop({
                            type: 'error',
                            title: '提示信息',
                            body: '该询价商品已设定自动询价，不能进行询价单修改，如需修改请至优供后台-商品管理-询价管理',
                            showCloseButton: true,
                            timeout: 5000
                        });
                    } else {
                        canModifyInquiry = resp.data.data.canModifyInquiry;
                    }
                }
            });

            setTimeout(function(){
                if (canModifyInquiry) {
                    var url = '/#/request/edit/' + rowObj.itemId;
                    window.open(url);
                }
            },500)

            // var opener = $scope;
            // var modalInstance = $uibModal.open({
            //     templateUrl: 'app/requestInquiry-management-mgmt/modal/editInquiry.html?v=' + LG.appConfig.clientVersion,
            //     keyboard: false,
            //     size: 'lg',
            //     controller: 'editInquiryCtrl',
            //     resolve: {
            //         itemId: function () {
            //             return rowObj.itemId;
            //         },
            //         opener: function() {
            //             return $scope;
            //         },
            //         SweetAlert: function() {
            //             return SweetAlert;
            //         }
            //     }
            // });
        }

       //点击下一步
        $scope.editInquiryNext = function(rowObj) {
            var opener = $scope;
            var modalInstance = $uibModal.open({
                templateUrl: 'app/requestInquiry-management-mgmt/modal/editInquiryNext.html?v=' + LG.appConfig.clientVersion,
                keyboard: false,
                controller: 'editInquiryNextCtrl',
                resolve: {
                    opener: function() {
                        return $scope;
                    },
                    SweetAlert: function() {
                        return SweetAlert;
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

        // 选择需求单跟进人后的回调函数
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
            var rule = '';
            var queryConditionObject = resetQueryCondition();
            // var selectedDepartment = $scope.treeInstance.jstree(true).get_selected();
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

            //
            // if ($scope.crmBuyerObj && $scope.crmBuyerObj.id) {
            //     var rule = '';
            //     // if ($scope.crmBuyerObj.treeType === 20) {
            //     //     rule = {"field":"ri.crm_buyer_id","value":$scope.crmBuyerObj.id,"op":"equal"}
            //     // } else if ($scope.crmBuyerObj.treeType === 10) {
            //     //     rule = {"field":"buyerrel.depart_id","value":$scope.crmBuyerObj.id,"op":"equal"}
            //     // }
            //     rule = {"field":"ri.crm_buyer_id","value":$scope.crmBuyerObj.id,"op":"equal"}
            //     queryConditionObject.rules.push(rule);
            // }
            //
            // if ($scope.crmSellerObj && $scope.crmSellerObj.id) {
            //     var rule = '';
            //     // if ($scope.crmSellerObj.treeType === 20) {
            //     //     rule = {"field":"ri.crm_seller_id","value":$scope.crmSellerObj.id,"op":"equal"}
            //     // } else if ($scope.crmSellerObj.treeType === 10) {
            //     //     rule = {"field":"sellerrel.depart_id","value":$scope.crmSellerObj.id,"op":"equal"}
            //     // }
            //     rule = {"field":"ri.crm_seller_id","value":$scope.crmSellerObj.id,"op":"equal"}
            //     queryConditionObject.rules.push(rule);
            // }
            var where =JSON.stringify(queryConditionObject);
            return requestInquiryMgmtService.listQuery(
                draw, sortColumn, sortDir, start, limit,where
            ).then(function(resp) {
                fnCallback(resp.data.data);
                vm.tableData = resp.data.data.data;

            }).finally(function() {
                $scope.queryBtnDisabled = false;
            });
        }

        function resetQueryCondition() {
            var form = $('#sampleController').find('form');
            var queryConditionObject = getQueryParams(form, vm.tabFilter);

            return queryConditionObject;
        }

        function isEmptyObj(obj) {
            var keys = Object.keys(obj);
            if (keys.length > 0) {
                return false;
            } else {
                return true;
            }
        }

    }

    angular
        .module('app.request-inquiry-management')
        .controller('requestInquiryCtrl', requestInquiryCtrl);
})();