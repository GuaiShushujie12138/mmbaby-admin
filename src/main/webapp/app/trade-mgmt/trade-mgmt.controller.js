/**
 * trade-mgmt.controller
 */
(function () {

    'use strict';

    TradeMgmtCtrl.$inject = ['$scope', '$http', '$uibModal', 'toaster', '$compile', '$filter', '$location', 'tradeMgmtService', 'DTOptionsBuilder', 'DTColumnBuilder', '$state', 'permissionCheckService'];

    /**
     * TradeMgmtCtrl
     */
    function TradeMgmtCtrl($scope, $http, $uibModal, toaster, $compile, $filter, $location, tradeMgmtService, DTOptionsBuilder, DTColumnBuilder, $state, permissionCheckService) {
        var vm = this;
        //debugger;
        var params = $location.search();
        vm.clothCheckStatusSelect = [];

        init();
        function init() {
            vm.sortColumn = "payTime";
            vm.limit = 10;
            vm.sortDir = "desc";
            vm.start = 0;
            vm.draw = 1;
            $scope.tradeDemandIdsMap = {};
            $scope.canMarkRevenue = permissionCheckService.check("WEB.TRADE-MGMT.REVENUE");
            $scope.canFollowUp = permissionCheckService.check("WEB.TRADE-MGMT.FOLLOWUP");
            $scope.canRelateDemand = permissionCheckService.check("WEB.TRADE-MGMT.RELATEDEMAND");
            $scope.canViewDetail = permissionCheckService.check("WEB.TRADE-MGMT.DETAIL");
            $scope.canMarkSource = permissionCheckService.check("WEB.TRADE-MGMT.MARKSOURCE");
            $scope.canMarkShop = permissionCheckService.check("WEB.TRADE-MGMT.MARKSHOP");
            $scope.canQuery = permissionCheckService.check("WEB.TRADE-MGMT.QUERY");
            $scope.canQuerySeller = permissionCheckService.check("WEB.TRADE-MGMT.QUERY.SELLER");
            $scope.canQueryBuyer = permissionCheckService.check("WEB.TRADE-MGMT.QUERY.BUYER");
            $scope.canDownLoad = permissionCheckService.check("WEB.TRADE-MGMT.DOWNLOAD");
            $scope.canDownloadBuyer = permissionCheckService.check("WEB.TRADE-MGMT.DOWNLOAD.BUYER");
            $scope.canDownloadSeller = permissionCheckService.check("WEB.TRADE-MGMT.DOWNLOAD.SELLER");
            $scope.canChangeOperator = permissionCheckService.check("WEB.TRADE-MGMT.CHANGE.OPERATOR");
            $scope.canRemittanceReceipt = permissionCheckService.check("WEB_TRADE_MGMT_QUERY_REMITTANCE_RECEIPT");
            $scope.canDelivery = permissionCheckService.check("WEB.TRADE-MGMT.DELIVERY");

            vm.paySwitch = false;
            vm.tradeStatusSelect = [
                {key: "0", value: '已支付(待发货,待收货,待评价,已成功)'},
                {key: '1', value: '待付款'},
                {key: '2', value: '待发货'},
                {key: '3', value: '待收货'},
                {key: '4', value: '待评价'},
                {key: '5', value: '已成功'},
                {key: '6', value: '已取消'},
                {key: '7', value: '已删除'},
                {key: '8', value: '交易关闭'}
            ];

            vm.auditStatusSelect = [
                {key: '1', value: '待审核'},
                {key: '2', value: '待打款'},
                {key: '3', value: '已打款'},
                {key: '4', value: '打款拒绝'},
                {key: '5', value: '打款失败'},
                {key: '9', value: '全额退款'},
                {key: '10', value: '部分退款'}
                // { key: '6', value: '待退款' },
                // { key: '7', value: '已退款' },
                // { key: '8', value: '退款拒绝' }
            ]

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

            vm.ClothCheckStatus = '';

            tradeMgmtService.getClothCheckStatus().then(function (resp) {
                vm.clothCheckStatusSelect = resp.data.data;
            });

            vm.gains = '';
            vm.gainsSelect = [
                {key: '', value: "所有"},
                {key: '1', value: "是"},
                {key: '0', value: "否"}
            ];

            vm.niceItem = '';
            vm.niceItemSelect = [
                {key: '', value: "所有"},
                {key: '0', value: "非优供"},
                {key: '1', value: "优供"}
            ];

            $scope.sellerOperatorList = []
            $scope.buyerOperatorList = []

            tradeMgmtService.getOperatorList().then(function (resp) {
                $scope.sellerOperatorList = resp.data.data.sellerOperatorList;
                $scope.buyerOperatorList = resp.data.data.buyerOperatorList;
            });

            tradeMgmtService.getDomainUrl()
                .then(function (resp) {
                    vm.domain = resp.data.data.domain;
                });

            tradeMgmtService.getItemUrl()
                .then(function (resp) {
                    vm.itemDomain = resp.data.data.domain;
                });

            // $('select[name="DataTables_Table_0_length"]').change(function(){
            //     vm.limit = $(this).children('option:selected').val();
            // });

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
                .withOption('width', '100px').renderWith(actionsHtml),
            DTColumnBuilder.newColumn('id').withTitle('订单ID').withClass('func-th hide').withOption("width", "70px"),
            DTColumnBuilder.newColumn('requestInquiryId').withTitle('询价单ID').withClass('func-th').withOption("width", "70px").notSortable(),
            DTColumnBuilder.newColumn('packingSlipId').withTitle('码单ID').withClass('func-th').withOption("width", "70px").notSortable(),
            DTColumnBuilder.newColumn('tradeId').withTitle('订单编号').withClass('func-th').withOption("width", "120px"),
            DTColumnBuilder.newColumn('status').withTitle('订单状态').withClass('func-th').withOption("width", "70px").notSortable().renderWith(statusHtml),
            DTColumnBuilder.newColumn('auditStatusText').withTitle('财务审核状态').withClass('func-th').withOption("width", "60px").notSortable().renderWith(
                auditStatusTextHtml
            ),
            DTColumnBuilder.newColumn('payTime').withTitle('支付时间').withClass('func-th').withOption("width", "120px").renderWith(timeHtml),
            DTColumnBuilder.newColumn('payTypeStr').withTitle('支付方式').notSortable().withClass('func-th').withOption("width", "60px").renderWith(payTypeHtml),
            DTColumnBuilder.newColumn('totalFee').withTitle('商品金额').withClass('func-th').withOption("width", "60px").notSortable(),
            DTColumnBuilder.newColumn('payableFee').withTitle('应付金额').withClass('func-th').withOption("width", "60px"),
            DTColumnBuilder.newColumn('paymentFee').withTitle('实收金额').withClass('func-th').withOption("width", "60px"),
            DTColumnBuilder.newColumn('gainsFee').withTitle('营收金额').withClass('func-th').withOption("width", "60px"),
            DTColumnBuilder.newColumn('refundTime').withTitle('退款时间').withClass('func-th').withOption("width", "120px").renderWith(timeHtml),
            DTColumnBuilder.newColumn('refundFee').withTitle('退款金额').withClass('func-th').withOption("width", "60px"),
            // DTColumnBuilder.newColumn('isFollowUp').withTitle('跟进订单').withClass('func-th').withOption("width", "40px")
            //     .notSortable().renderWith(function (data, type, full, meta) {
            //     if (data == 1){
            //         return "是";
            //     }else {
            //         return "否";
            //     }
            // }),
            DTColumnBuilder.newColumn('reduceOrderStatusText').withTitle('验布状态').withClass('func-th').withOption("width", "60px").notSortable(),
            DTColumnBuilder.newColumn('relatedDemandId').withTitle('关联需求').withOption("width", "100px").notSortable().renderWith(relatedDemandHtml)

            // DTColumnBuilder.newColumn('woStatus').withTitle('工单状态').notSortable().withClass('func-th').withOption("width", "3%").renderWith(woStatusHtml),
            // DTColumnBuilder.newColumn('buyerName').withTitle('买家').withClass('func-th').withOption("width", "3%").notSortable(),
            // DTColumnBuilder.newColumn('buyerMobile').withTitle('买家号码').withClass('func-th').withOption("width", "2%").notSortable(),
            // DTColumnBuilder.newColumn('receiver').withTitle('收货人').withClass('func-th').withOption("width", "2%").notSortable(),
            // DTColumnBuilder.newColumn('sellerName').withTitle('卖家').withClass('func-th').withOption("width", "3%").notSortable(),
            // DTColumnBuilder.newColumn('sellerMobile').withTitle('卖家号码').withClass('func-th').withOption("width", "3%").notSortable(),
            // DTColumnBuilder.newColumn('shopName').withTitle('店铺名称').withClass('func-th').withOption("width", "4%").notSortable(),
            // DTColumnBuilder.newColumn('modifyFee').withTitle('调整金额').withClass('func-th').withOption("width", "2%"),
            // DTColumnBuilder.newColumn('couponFee').withTitle('优惠金额').withClass('func-th').withOption("width", "6%").renderWith(couponFeeHtml),
            // //DTColumnBuilder.newColumn('couponSn').withTitle('优惠劵号').notSortable(),
            // //DTColumnBuilder.newColumn('platform').withTitle('来源').renderWith(platformHtml),
            // //DTColumnBuilder.newColumn('payType').withTitle('支付方式').renderWith(payTypeHtml),
            // DTColumnBuilder.newColumn('createTime').withTitle('下单时间').withClass('func-th').withOption("width", "6%").renderWith(timeHtml),

        ];

        if ($scope.canQuery) {
            if ($scope.canQuery && $scope.canQueryBuyer) {
                $scope.dtColumns.splice(13, 0, DTColumnBuilder.newColumn('lsBuyerId').withTitle('买家链尚ID').withClass('func-th').withOption("width", "60px").notSortable(), DTColumnBuilder.newColumn('buyerOperatorName').withTitle('买家运营').withClass('func-th').withOption("width", "60px").notSortable());
            }
            if ($scope.canQuery && $scope.canQuerySeller) {
                $scope.dtColumns.splice(13, 0, DTColumnBuilder.newColumn('lsSellerId').withTitle('卖家链尚ID').withClass('func-th').withOption("width", "60px").notSortable(), DTColumnBuilder.newColumn('sellerOperatorName').withTitle('卖家运营').withClass('func-th').withOption("width", "100px").notSortable()
                );
            }

        }


        function auditStatusTextHtml(data, type, full, meta) {
            if (data.indexOf('待审核') >= 0 || data.indexOf('财务拒绝打款') >= 0 || data.indexOf('财务打款失败') >= 0
                || data.indexOf('财务拒绝退款') >= 0 || data.indexOf('状态不正确') >= 0) {
                return '<span class="label label-danger">' + data + '</span>';
            } else {
                return data;
            }
        }

        function relatedDemandHtml(data, type, full, meta) {

            var demandIds = data.split(",");
            var str = '';

            str = '<div style="width: auto">';
            if (!isEmpty(demandIds) && demandIds.length > 0 && demandIds[0] != "") {
                for (var i in demandIds) {
                    str += '<span><a ng-href="{{vm.domain}}demand/' + demandIds[i] + '" target="_blank"'
                        + ' class="text-danger">' + demandIds[i] + ';</a></span><br/>';
                }
            }
            str += '</div>';

            return str;

        }

        //标记店铺
        $scope.markShop = function (rowObj) {
            var rowData = rowObj;
            var modalInstance = $uibModal.open({
                templateUrl: 'app/trade-mgmt/modal/mark_shop.html?v=' + LG.appConfig.clientVersion,
                keyboard: false,
                controller: 'MarkShopModalCtrl',
                resolve: {
                    rowData: function () {
                        return rowData;
                    }
                }
            });

            modalInstance.result.then(function (result) {
                console.log('关联需求结束');
                $scope.dtInstance.reloadData(function () {
                }, false);
            }, function (reason) {
                console.log('关联需求');
            });
        };


        //标记来源
        $scope.markSource = function (rowObj) {
            var rowData = rowObj;
            var modalInstance = $uibModal.open({
                templateUrl: 'app/trade-mgmt/modal/mark_source.html?v=' + LG.appConfig.clientVersion,
                keyboard: false,
                controller: 'MarkSourceModalCtrl',
                resolve: {
                    rowData: function () {
                        return rowData;
                    },
                    sellerOperatorList: function () {
                        return $scope.sellerOperatorList;
                    }

                }
            });

            modalInstance.result.then(function (result) {

                $scope.dtInstance.reloadData(function () {
                }, false);
            }, function (reason) {

                console.log('关联来源结束:' + reason);
            });

        };

        // 更改卖家运营
        $scope.changeOperator = function(rowObj) {
            var rowData = rowObj;
            var modalInstance = $uibModal.open({
                templateUrl: 'app/trade-mgmt/modal/changeOperator.html?v=' + LG.appConfig.clientVersion,
                keyboard: false,
                controller: 'changeOperatorModalCtrl',
                resolve: {
                    rowData: function () {
                        return rowData;
                    },
                    sellerOperatorList: function () {
                        return $scope.sellerOperatorList;
                    }

                }
            });

            modalInstance.result.then(function (result) {

                $scope.dtInstance.reloadData(function () {
                }, false);
            }, function (reason) {
            });
        }

        //关联需求
        $scope.relateDemand = function (rowObj) {

            var feedbackUserId = rowObj.feedbackUserId;
            var demandIds = rowObj.relatedDemandId;

            var modalInstance = $uibModal.open({
                templateUrl: 'app/trade-mgmt/modal/relateDemand.html?v=' + LG.appConfig.clientVersion,
                keyboard: false,
                controller: function ($scope, $uibModal, $uibModalInstance, $compile,
                                      tradeMgmtService, toaster, feedbackUserId, demandIds, tradeId) {

                    var vm = this;
                    tradeMgmtService.getCurrentRegionUser().then(function successCallback(resp) {
                        $scope.feedbackUsers = resp.data.data
                    });
                    $scope.modal = {};
                    $scope.modal.feedbackUserId = feedbackUserId + '';
                    $scope.modal.relatedDemandId = demandIds;

                    $scope.ok = function () {
                        $scope.okBtnDisabled = true;

                        var demandIds = $scope.modal.relatedDemandId.split(",|，");
                        if (demandIds.length > 3) {
                            toaster.pop({
                                type: 'error',
                                title: '操作提示',
                                body: '至多关联三个需求',
                                showCloseButton: true,
                                timeout: 5000
                            });
                            $scope.okBtnDisabled = false;
                            return;
                        }


                        tradeMgmtService.relateDemand(
                            $scope.modal.relatedDemandId,
                            $scope.modal.feedbackUserId,
                            tradeId).then(function successCallback(resp) {
                            toaster.pop({
                                type: resp.data.code == 200 ? 'success' : 'error',
                                title: '操作提示',
                                body: resp.data.message,
                                showCloseButton: true,
                                timeout: 5000
                            });
                            if (resp.data.code == 200) {
                                $uibModalInstance.close();
                            }
                        }).finally(function () {
                            $scope.okBtnDisabled = false;
                        });
                    };

                    $scope.cancel = function () {
                        $uibModalInstance.dismiss('cancel');
                    };
                },
                resolve: {
                    feedbackUserId: function () {
                        return feedbackUserId;
                    },
                    demandIds: function () {
                        return demandIds;
                    },
                    tradeId: function () {
                        return rowObj.tradeId;
                    }

                }
            });

            modalInstance.result.then(function (result) {
                console.log('关联需求结束');
                $scope.dtInstance.reloadData(function () {
                }, false);
            }, function (reason) {
                console.log('关联需求');
            });


        }

        //标记营收
        $scope.markRevenue = function (rowObj) {

            var modalInstance = $uibModal.open({
                templateUrl: 'app/trade-mgmt/modal/markRevenue.html?v=' + LG.appConfig.clientVersion,
                keyboard: false,
                controller: function ($scope, $uibModal, $uibModalInstance, $compile,
                                      tradeMgmtService, toaster, rowObj) {

                    $scope.rowObj = rowObj;
                    $scope.modal = {};
                    $scope.modal.isRevenue = rowObj.gainsFee > 0 ? 1 : 0;
                    $scope.modal.revenueFee = rowObj.gainsFee == 0 ? "" : rowObj.gainsFee;
                    $scope.modal.revenueRemark = rowObj.gainsMemo;
                    $scope.modal.payableFee = rowObj.payableFee;
                    $scope.modal.revenueFeePercent = 0;
                    function initFeePercent() {
                        var percent = $scope.modal.revenueFee / ($scope.modal.payableFee
                            + rowObj.couponFee);
                        $scope.modal.revenueFeePercent = Math.floor(percent * 10000) / 100;
                    };
                    initFeePercent();
                    $scope.calculateRevenueFee = function () {
                        initFeePercent();
                    };

                    $scope.ok = function () {
                        var revenueFee = $scope.modal.revenueFeePercent + "%";
                        $scope.modal.revenueRemark = revenueFee;
                        $scope.okBtnDisabled = true;

                        if ($scope.modal.isRevenue == 1) {

                            if ($scope.modal.revenueFee <= 0) {
                                toaster.pop({
                                    type: 'error',
                                    title: '操作提示',
                                    body: '请输入营收金额',
                                    showCloseButton: true,
                                    timeout: 5000
                                });
                                $scope.okBtnDisabled = false;
                                return;
                            }

                            var reg = /^\d+\.?(\d{1,2})?$/gi;
                            var flag = reg.test($scope.modal.revenueFee);
                            if (!flag) {
                                toaster.pop({
                                    type: 'error',
                                    title: '提示信息',
                                    body: '金额输入错误：营收金额最多只能有两位小数',
                                    showCloseButton: true,
                                    timeout: 5000
                                });
                                $scope.okBtnDisabled = false;
                                return;
                            }

                            if ($scope.modal.revenueFee > rowObj.payableFee) {
                                toaster.pop({
                                    type: 'error',
                                    title: '操作提示',
                                    body: '请输入正确的营收金额',
                                    showCloseButton: true,
                                    timeout: 5000
                                });
                                $scope.okBtnDisabled = false;
                                return;
                            }

                        } else {
                            $scope.modal.revenueFee = "";
                            $scope.modal.revenueRemark = "";
                        }

                        tradeMgmtService.markRevenue($scope.modal.isRevenue, $scope.modal.revenueFee, $scope.modal.revenueRemark, rowObj.tradeId)
                            .then(function successCallback(resp) {
                                toaster.pop({
                                    type: resp.data.code == 200 ? 'success' : 'error',
                                    title: '操作提示',
                                    body: resp.data.message,
                                    showCloseButton: true,
                                    timeout: 5000
                                });
                                if (resp.data.code == 200) {
                                    $uibModalInstance.close();
                                }

                            }).finally(function () {
                            $scope.okBtnDisabled = false;
                        });

                    };
                    $scope.cancel = function () {
                        $uibModalInstance.dismiss('cancel');
                    };
                }, resolve: {
                    rowObj: function () {
                        return rowObj;
                    }
                }
            });

            modalInstance.result.then(function (result) {
                console.log('标记营收结束');
                $scope.dtInstance.reloadData(function () {
                }, false);
            }, function (reason) {
                console.log('标记营收');
            });
        }
        //标记跟进
        $scope.markFollowUp = function (rowObj) {
            var modalInstance = $uibModal.open(
                {
                    templateUrl: 'app/trade-mgmt/modal/markFollowUp.html?v=' + LG.appConfig.clientVersion,
                    keyboard: false,
                    controller: function ($scope, $uibModal, $uibModalInstance, $compile,
                                          tradeMgmtService, toaster, rowObj) {

                        $scope.modal = {};
                        $scope.modal.isFollowUp = rowObj.isFollowUp;
                        $scope.modal.changeReason = "";

                        $scope.ok = function () {
                            $scope.okBtnDisabled = true;
                            var payTime = rowObj.payTime;

                            var diff = diffHours(payTime);
                            if (diff > 120) {
                                toaster.pop({
                                    type: 'error',
                                    title: '操作提示',
                                    body: '此订单付款已超过120小时，禁止修改',
                                    showCloseButton: true,
                                    timeout: 5000
                                });
                                $scope.okBtnDisabled = false;

                                return;
                            }

                            if ($scope.modal.isFollowUp != rowObj.isFollowUp && isEmpty($scope.modal.changeReason)) {
                                toaster.pop({
                                    type: 'error',
                                    title: '操作提示',
                                    body: '变更原因必填',
                                    showCloseButton: true,
                                    timeout: 5000
                                });
                                $scope.okBtnDisabled = false;

                                return;
                            }

                            tradeMgmtService.markFollowUp($scope.modal.isFollowUp, $scope.modal.changeReason, rowObj.tradeId)
                                .then(function successCallback(resp) {
                                    toaster.pop({
                                        type: resp.data.code == 200 ? 'success' : 'error',
                                        title: '操作提示',
                                        body: resp.data.message,
                                        showCloseButton: true,
                                        timeout: 5000
                                    });
                                    if (resp.data.code == 200) {
                                        $uibModalInstance.close();
                                    }
                                }).finally(function () {
                                $scope.okBtnDisabled = false;
                            });
                        };
                        $scope.cancel = function () {
                            $uibModalInstance.dismiss('cancel');
                        };
                    },
                    resolve: {
                        rowObj: function () {
                            return rowObj;
                        }
                    }
                });
            modalInstance.result.then(function (result) {
                console.log('标记跟进结束');
                $scope.dtInstance.reloadData(function () {
                }, false);
            }, function (reason) {
                console.log('标记跟进');
            });


        }


        function woStatusHtml(data, type, full, meta) {

            var str = '';

            if (data == null || data == undefined || data == 0) {
                str = '<span class="label">' + "无工单" + '</span>';
            } else if (full.status == 1) {
                if (data == 1 || data == 2) {
                    str = '<span class="label label-danger">' + "待处理工单" + '</span>' +
                        '<button class="btn  btn-link" type="button" tooltip-placement="right" uib-tooltip="'
                        + full.lastDeptName + ':' + full.woMemo + '"><i class="fa fa-info-circle red"></i></button>';
                } else if (data == 3) {
                    str = '<span class="label">' + "已处理工单" + '</span>' +
                        '<button class="btn  btn-link" type="button" tooltip-placement="right" uib-tooltip="'
                        + full.lastDeptName + ':' + full.dealResult + '"><i class="fa fa-info-circle"></i></button>';
                } else if (data == 4) {
                    str = '<span class="label">' + "已关闭工单" + '</span>' +
                        '<button class="btn  btn-link" type="button" tooltip-placement="right" uib-tooltip="'
                        + full.lastDeptName + ':' + full.dealResult + '"><i class="fa fa-info-circle"></i></button>';
                } else if (data == 9) {
                    str = '<span class="label">' + "工单流转中" + '</span>' +
                        '<button class="btn  btn-link" type="button" tooltip-placement="right" uib-tooltip="'
                        + full.lastDeptName + ':' + full.dealResult + '"><i class="fa fa-info-circle"></i></button>';
                }
            } else {
                str = '<span class="label">' + "已关闭工单" + '</span>';
            }

            return str;
        }

        function rowCallback(row, data, dataIndex) {
            // $('td', row).unbind('dblclick');
            $('td', row).bind('dblclick', function () {
                $scope.getDetail(data);
            });
            return row;
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


        function actionsHtml(data, type, full, meta) {

            var showMarkSource = false;
            var realShopId = data.realShopId;
            var niceShopId = data.niceShopId;
            var orderType = data.orderType;
            var tradeStatus = data.status; // 订单状态
            var diff = diffHours(full.payTime);
            var canFollowUp = true;
            if (diff > 120 || (full.isFollowUp == 0 && full.status != 1
                && full.paymentFee <= 0)
                || full.status == 1 && full.payableFee <= 0) {
                canFollowUp = false;
            }

            var canMarkRevenue = false;
            if (full.auditStatus == 1 || full.auditStatus == 4
                || full.auditStatus == 5 || full.refundStatus == 4
                || (full.status == 1 && full.payableFee > 0)) {
                canMarkRevenue = true;
            }

            if (full.gainsFee <= 0 && (full.status != 1 && full.paymentFee == 0)) {
                canMarkRevenue = false;
            }

            var canMarkShop = false;
            if (full.realSellerCustomerId == 0) {
                canMarkShop = true;
            }

            if (orderType === 3) {
                showMarkSource = true;
            } else if (orderType === 1 && (realShopId > 0 || niceShopId > 0)) {
                showMarkSource = true;
            } else if (orderType === 1 && realShopId === 0 && niceShopId === 0) {
                showMarkSource = false;
            }

            var remittanceSuccess = false;
            if (data.remittanceSuccess === 1) {
                remittanceSuccess = true;
            } else {
                remittanceSuccess = false;
            }

            var str = '';

            str += '<div ng-if="canViewDetail" class="m-t-xs m-b-sm"><button'
                + ' class="btn'
                + ' btn-xs'
                + ' btn-w-xs'
                + ' btn-success btn-outline" ng-click="getDetail(vm.tableData[' + meta.row + '])">' +
                '    <i class="fa fa-code-fork  icon-width">订单详情</i>' +
                '</button></div>';

            str += '<div ng-if="canRemittanceReceipt &&' + remittanceSuccess + '" class="m-t-xs m-b-sm"><button'
                + ' class="btn'
                + ' btn-xs'
                + ' btn-w-xs'
                + ' btn-success btn-outline" ng-click="RemittanceReceiptDetail(vm.tableData[' + meta.row + '])">' +
                '    <i class="fa fa-code-fork  icon-width">查看汇款回单</i>' +
                '</button></div>';

            str += '<div ng-if="canMarkSource && ' + showMarkSource + '" class="m-t-xs m-b-sm"><button'
                + ' class="btn'
                + ' btn-xs'
                + ' btn-w-xs'
                + ' btn-success btn-outline"'
                + ' ng-click="markSource(vm.tableData[' + meta.row + '])">' +
                '    <i class="fa fa-code-fork  icon-width">标记来源</i>' +
                '</button></div>';

            str += '<div ng-if="canDelivery && ' +tradeStatus + '=== 2 ||' + tradeStatus + '=== 3" class="m-t-xs m-b-sm"><button'
                + ' class="btn'
                + ' btn-xs'
                + ' btn-w-xs'
                + ' btn-success btn-outline"'
                + ' ng-click="delivery(vm.tableData[' + meta.row + '])">' +
                '    <i class="fa fa-code-fork  icon-width">发货</i>' +
                '</button></div>';

            // str += '<div ng-if="canChangeOperator" class="m-t-xs m-b-sm"><button'
            //     + ' class="btn'
            //     + ' btn-xs'
            //     + ' btn-w-xs'
            //     + ' btn-success btn-outline"'
            //     + ' ng-click="changeOperator(vm.tableData[' + meta.row + '])">' +
            //     '    <i class="fa fa-code-fork  icon-width">更改卖家运营</i>' +
            //     '</button></div>';

            // && vm.tableData[' + meta.row + '].isSelfOperateShop
            //   str += '<div ng-if="canMarkShop && ' + canMarkShop + '" class="m-t-xs m-b-sm"><button'
            //       + ' class="btn'
            //       + ' btn-xs'
            //       + ' btn-w-xs'
            //       + ' btn-success btn-outline"'
            //       + ' ng-click="markShop(vm.tableData[' + meta.row + '])">' +
            //       '    <i class="fa fa-code-fork  icon-width">标记店铺</i>' +
            //       '</button></div>';

            // str += '<div ng-if="canMarkRevenue && '+canMarkRevenue+'" class="m-t-xs m-b-sm" ><button'
            //        + ' class="btn'
            //        + ' btn-xs'
            //        + ' btn-w-xs'
            //        + ' btn-success btn-outline" ng-click="markRevenue(vm.tableData[' + meta.row + '])">' +
            //        '    <i class="fa fa-code-fork  icon-width">标记营收</i>' +
            //        '</button></div>';

            // str += '<div ng-if="canFollowUp && '+canFollowUp+'"  class="m-t-xs m-b-sm"><button'
            //        + ' class="btn btn-xs'
            //        + ' btn-w-xs'
            //        + ' btn-success btn-outline" ng-click="markFollowUp(vm.tableData[' + meta.row + '])">' +
            //        '    <i class="fa fa-code-fork  icon-width">标记跟进</i>' +
            //        '</button></div>';


            return str;
        }

        function timeHtml(data, type, full, meta) {

            if (data == null || data == '') {
                return "";
            }

            return $filter('date')(data, 'yyyy-MM-dd HH:mm:ss');
        }

        function couponFeeHtml(data, type, full, meta) {
            if (data != null && data != '') {
                return data.toFixed(2);
            }
            else {
                return data;
            }
        }

        function platformHtml(data, type, full, meta) {
            if (data == 0) {
                return "未设定"
            }
            else if (data == 1) {
                return "web"
            }
            else if (data == 2) {
                return "ios"
            }
            else if (data == 3) {
                return "android"
            }
            else if (data == 4) {
                return "h5"
            }
            else {
                return "未知";
            }
        }

        function payTypeHtml(data, type, full, meta) {
            if (data == "") {
                return "未知"
            }else{
                return data;
            }
        }

        function clothStatusHtml(data, type, full, meta) {
            if (data == 0) {
                return "未知"
            } else if (data == 1) {
                return "待入库"
            } else if (data == 2) {
                return "验布中"
            } else if (data == 3) {
                return "部分发货"
            } else if (data == 4) {
                return "全部发货"
            } else if (data == 5) {
                return "验布关闭"
            } else if (data == 6) {
                return "验布取消"
            }  else {
                return "未知";
            }
        }

        function statusHtml(data, type, full, meta) {

            if (data == 1) {
                return '<span class="label label-default">待付款</span>';
            }
            else if (data == 2) {
                return '<span class="label label-primary">待发货</span>';
            }
            else if (data == 3) {
                return '<span class="label label-success">待收货</span>';
            }
            else if (data == 4) {
                return '<span class="label label-info">待评价</span>';
            }
            else if (data == 5) {
                return '<span class="label label-warning">已成功</span>';
            }
            else if (data == 6) {
                return '<span class="label label-danger">已取消</span>';
            }
            else if (data == 7) {
                return '<span class="label label-danger">已删除</span>';
            }
            else if (data == 8) {
                return '<span class="label label-danger">交易关闭</span>';
            } else {
                return '<span class="label label-default">未知状态</span>';
            }
        }

        // 查看汇款回单
        $scope.RemittanceReceiptDetail = function(rowObj) {
            var userId = rowObj.lsSellerId || rowObj.lsBuyerId || -1;
            tradeMgmtService.queryRemittanceReceipt(rowObj.tradeId,userId).then(function(resp){
                if (resp.data.code == 200) {
                    //location.href = resp.data.data.receiptUrl;
                    window.open(resp.data.data.receiptUrl);
                }
            })
        }

        /**
         * 查看订单详情
         * @param rowObj
         */
        $scope.getDetail = function (rowObj) {
            var modalInstance = $uibModal.open({
                templateUrl: 'app/trade-mgmt/modal/trade-detail.html?v=' + LG.appConfig.clientVersion,
                //windowClass: 'animated bounceIn',
                windowClass: 'large-Modal',
                keyboard: false,
                controller: 'TradeDetailModalCtrl',
                resolve: {
                    rowObj: function () {
                        rowObj.isPeriod = false;
                        return rowObj;
                    },
                    domain: function () {
                        return vm.domain;
                    },
                    tradeStatusSelect: function () {
                        return vm.tradeStatusSelect;
                    },
                    itemDomain: function () {
                        return vm.itemDomain
                    }
                }
            });
        };

        $scope.download = function (role) {

            var queryConditionObject = resetQueryCondition();

            var where = JSON.stringify(queryConditionObject);

            var url = '/trade-mgmt/download.do';

            if (role == 'buyer') {
                url = '/trade-mgmt/buyerDownload.do';
            } else if (role == 'seller') {
                url = '/trade-mgmt/sellerDownload.do';
            }
            $http.post(url, {
                draw: vm.draw,
                sortColumn: vm.sortColumn,
                sortDir: vm.sortDir,
                start: vm.start,
                limit: vm.limit,
                where: where
            }).then(function (response) {
                toaster.pop(
                    {
                        type: response.data.code == 200 ? 'success' : 'error',
                        title: '操作提示',
                        body: response.data.message,
                        showCloseButton: true,
                        timeout: 5000
                    });

            });

            console.log(url);
            // window.open(url);
        };

        /**
         * delivery 发货
         * @param event
         */

        $scope.delivery = function(rowObj) {
            // 发货页面

            tradeMgmtService.initDeliveryData(rowObj.tradeId).then(function(resp) {
                if (resp.data.code === 200) {
                    if (resp.data.data.isSendAll) {
                        tradeMgmtService.showMessage('当前订单已全部发货');
                        return;
                    } else {
                        var modalInstance = $uibModal.open({
                            templateUrl: 'app/trade-mgmt/modal/delivery.html?v=' + LG.appConfig.clientVersion,
                            size: 'lg',
                            keyboard: false,
                            controller: 'deliveryCtrl',
                            controllerAs: 'vm',
                            resolve: {
                                initDeliveryData: function () {
                                    return resp.data.data;
                                }
                            }
                        });
                    }
                }
            },function(err) {

            });
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

        function resetQueryCondition() {
            var form = $('#gridcontroller').find('form');
            var queryConditionObject = getQueryParams(form, vm.tabFilter);

            queryConditionObject.rules.push(
                {"field": "paySwitch", "value": vm.paySwitch, "op": "equal"});

            if (vm.gains == "1") {
                queryConditionObject.rules.push({"field": "gains_fee", "value": 0, "op": "notequal"});
            } else if (vm.gains == "0") {
                queryConditionObject.rules.push({"field": "gains_fee", "value": 0, "op": "equal"});
            } else {
            }

            if (vm.tradeStatus == "0") {

                queryConditionObject.rules.push(
                    {"field": "trade.status", "value": "2,3,4,5", "op": "in"})
            }

            if (vm.auditStatus == "1") {
                queryConditionObject.rules.push({"field": "trade.audit_status", "value": "1", "op": "equal"},
                    {"field": "trade.refund_status", "value": "1", "op": "notequal"})
            } else if (vm.auditStatus > "1" && vm.auditStatus < "6") {
                queryConditionObject.rules.push({"field": "trade.audit_status", "value": vm.auditStatus, "op": "equal"})
            } else if (vm.auditStatus == "6") {
                queryConditionObject.rules.push({"field": "trade.refund_status", "value": "1", "op": "equal"})
            } else if (vm.auditStatus == "7") {
                queryConditionObject.rules.push({"field": "trade.refund_status", "value": "2", "op": "equal"})
            } else if (vm.auditStatus == "8") {
                queryConditionObject.rules.push({"field": "trade.refund_status", "value": "4", "op": "equal"})
            } else if (vm.auditStatus == "9") {
                queryConditionObject.rules.push({"field": "trade.audit_status", "value": "9", "op": "equal"})
            } else if (vm.auditStatus == "10") {
                queryConditionObject.rules.push({"field": "trade.audit_status", "value": "10", "op": "equal"})
            }

            if (!isEmpty(params)) {
                queryConditionObject.rules.push({"field": "kpi", "value": JSON.stringify(params), "op": "equal"});
                queryConditionObject.rules.splice(0, 2);
            }

            return queryConditionObject;
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

            var queryConditionObject = resetQueryCondition();

            var where = JSON.stringify(queryConditionObject);

            return tradeMgmtService.tradeQuery(
                draw, sortColumn, sortDir, start, limit, where
            ).then(function (resp) {
                console.log(resp.data.data)
                fnCallback(resp.data.data);
                vm.tableData = resp.data.data.data;

            }).finally(function () {
                $scope.queryBtnDisabled = false;
            });
        }

        $scope.submit = function () {
            $scope.queryBtnDisabled = true;
            $scope.dtInstance.reloadData();
            params = null;
        };

    }

    angular
        .module('app.trade-mgmt')
        .controller('TradeMgmtCtrl', TradeMgmtCtrl);
})();