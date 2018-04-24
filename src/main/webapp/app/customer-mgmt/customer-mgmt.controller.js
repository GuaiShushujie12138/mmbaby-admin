/**
 * customer-mgmt.controller
 */
(function () {

    'use strict';

    CustomerMgmtCtrl.$inject = ['$location', '$scope', '$uibModal', '$state', '$filter', '$compile', 'toaster', 'customerMgmtService', 'DTOptionsBuilder', 'DTColumnBuilder', 'permissionCheckService'];
    /**
     * CustomerMgmtCtrl
     */
    function CustomerMgmtCtrl($location , $scope, $uibModal, $state, $filter, $compile, toaster, customerMgmtService, DTOptionsBuilder, DTColumnBuilder, permissionCheckService) {

        var vm = this;
        var rootScope = $scope;

        var params = $location.search();

        vm.table1_show = 1;
        vm.table2_show = 0;

        //是否有查看详情的权限
        vm.customerDetail = permissionCheckService.check("WEB.CUSTOMER.CUSTOMER-MGMT.VIEWDETAIL")
        //分配区部
        vm.assignRegion = permissionCheckService.check("WEB.CUSTOMER.CUSTOMER-MGMT.ALLOTREGION")
        //设置等级
        vm.level = permissionCheckService.check("WEB.CUSTOMER.CUSTOMER-MGMT.SETLEVEL")
        //编辑
        vm.edit = permissionCheckService.check("WEB.CUSTOMER.CUSTOMER-MGMT.EDIT")
        //客户管理客户分配
        vm.assignCustomer = permissionCheckService.check("WEB.CUSTOMER.CUSTOMER-MGMT.ALLOTUSER")
        //公海拣入
        vm.customerInPublic = permissionCheckService.check("WEB.PERMISSION.CUSTOMER-MGMT.PUBLIC")
        // 银行账号显示
        vm.canBankInfo = permissionCheckService.check('WEB.CUSTOMER.BANKINFO.VIEW');

        //回访
        vm.backVisit =permissionCheckService.check('WEB.CUSTOMER.CUSTOMER-MGMT.PHONE-VISIT')

        vm.selected = {};
        vm.selectAll = false;
        vm.toggleAll = toggleAll;
        vm.toggleOne = toggleOne;
        vm.authUserList=[];

        vm.customerName = vm.mobile = vm.companyName = '';
        vm.userId = '';

        vm.startDate = $filter('date')(new Date() - ( 365 * 2 + 1) * 24 * 60 * 60 * 1000, 'yyyy-MM-dd') + " 00:00:00";
        vm.endDate = $filter('date')(new Date(), 'yyyy-MM-dd') + " 23:59:59";
        vm.rangeDate = vm.startDate + " - " + vm.endDate;

        vm.validateDateRange = {
            startDate: vm.startDate,
            endDate: vm.endDate
        }

        $scope.$watch('vm.validateDateRange', function (newVal, oldVal) {
            if (newVal) {
                vm.startDate = moment(newVal.startDate, "YYYY-MM-DD hh:mm:ss").format("YYYY-MM-DD HH:mm:ss");
                vm.endDate = moment(newVal.endDate, "YYYY-MM-DD hh:mm:ss").format("YYYY-MM-DD HH:mm:ss");
                vm.rangeDate = vm.startDate + " - " + vm.endDate;
            }
        });

        function init() {
            customerMgmtService.getLevelList()
                .then(function (resp) {
                    vm.customerLevel = resp.data.data.data;
                });

            customerMgmtService.getTopRegionList()
                .then(function (resp) {
                    vm.topRegionList = resp.data.data.list;
                });

            customerMgmtService.getAuthUsers()
                .then(function (resp) {
                    vm.authUserList = resp.data.data;
                });
        }

        init();

        vm.opts = {
            timePicker: true,
            timePickerSeconds: true,
            timePickerIncrement: 1,
            timePicker12Hour: false,
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

        vm.tabFilter = [];

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
            .withDOM('frtlip')
            .withOption('serverSide', true)
            .withOption('searching', false)
            .withOption('lengthChange', true)
            .withOption('autoWidth', false)
            .withOption('scrollX', true)
            .withOption('lengthMenu', [10, 20, 30, 50, 100])
            .withOption('displayLength', 10)
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

        var titleHtml = '<input type="checkbox"  ng-model="vm.selectAll" ng-click="vm.toggleAll(vm.selectAll, vm.selected)" style="width: 22px;"/>';
        $scope.dtColumns = [

            DTColumnBuilder.newColumn(null).withTitle(titleHtml).notSortable().withClass('text-center p-w-xxs-i choose-th func-th').withOption("width", "10px")
                .renderWith(function (data, type, full, meta) {
                    vm.selected[full.id] = false;
                    return '<input type="checkbox" ng-model="vm.selected[\'' + full.id + '\']" ng-click="vm.toggleOne(vm.selected)" style="width: 22px;"/>';
                }),

            DTColumnBuilder.newColumn('').withTitle('操作').withClass('func-th').withOption("width", "90px").renderWith(operateHtml).notSortable(),
            DTColumnBuilder.newColumn('id').withTitle('客户ID').withClass('func-th').withOption("width", "70px"),
            DTColumnBuilder.newColumn('bindId').withTitle('链尚ID').withClass('func-th').withOption("width", "70px").notSortable(),
            DTColumnBuilder.newColumn('').withTitle('注册手机').withClass('func-th').withOption("width", "90px").notSortable().renderWith(function (data, type, full, meta) {
                var str = '';
                if (full.mobile != undefined || full.mobile != null) {
                    str = full.mobile;
                }
                return '<div style="white-space:normal;word-wrap:break-word;"><span>' + str + '</span></div>';
            }),
            DTColumnBuilder.newColumn('').withTitle('联系人').withClass('func-th').withOption("width", "70px").notSortable().renderWith(function (data, type, full, meta) {
                var str = '';
                if (full.contactName != undefined || full.contactName != null) {
                    str = full.contactName;
                }
                return '<div style="white-space:normal;word-wrap:break-word;"><span>' + str + '</span></div>';
            }),
            DTColumnBuilder.newColumn('').withTitle('联系人手机').withClass('func-th').withOption("width", "90px").notSortable().renderWith(function (data, type, full, meta) {
                var str = '';
                if (full.contactMobile != undefined || full.contactMobile != null) {
                    str = full.contactMobile;
                }
                return '<div style="white-space:normal;word-wrap:break-word;"><span>' + str + '</span></div>';
            }),
            DTColumnBuilder.newColumn('').withTitle('公司名称').withClass('func-th').withOption("width", "80px").notSortable().renderWith(function (data, type, full, meta) {
                var str = '';
                if (full.companyName != undefined || full.companyName != null) {
                    str = full.companyName;
                }
                return '<div style="white-space:normal;word-wrap:break-word;"><span>' + str + '</span></div>';
            }),
            //DTColumnBuilder.newColumn('shopType').withTitle('组织形式').withClass('func-th').withOption("width", "80px").renderWith(shopTypeHtml).notSortable(),
            //DTColumnBuilder.newColumn('').withTitle('客户等级').withClass('func-th').withOption("width", "100px").notSortable().renderWith(levelHtml),
            DTColumnBuilder.newColumn('').withTitle('客户层级').withClass('func-th').withOption("width", "100px").notSortable().renderWith(layerHtml),
            DTColumnBuilder.newColumn('regionName').withTitle('所属大区').withClass('func-th').withOption("width", "60px").notSortable(),
            //DTColumnBuilder.newColumn('').withTitle('角色').withClass('func-th').renderWith(roleHtml).notSortable(),
            //DTColumnBuilder.newColumn('isBuyer').withTitle('买家').withClass('func-th').notSortable().renderWith(isBuyerHtml),
            //DTColumnBuilder.newColumn('isSeller').withTitle('卖家').withClass('func-th').notSortable().renderWith(isSellerHtml),
            DTColumnBuilder.newColumn('regionId').withTitle('').notVisible(),
            DTColumnBuilder.newColumn('').withTitle('运营负责人').withClass('func-th').withOption("width", "100px").renderWith(relUserInfoHtml).notSortable(),
            DTColumnBuilder.newColumn('').withTitle('客户形态').withClass('func-th').withOption("width", "100px").renderWith(authHtml).notSortable(),
            DTColumnBuilder.newColumn('').withTitle('公司地址').withClass('func-th').withOption("width", "160px").renderWith(companyAddressHtml).notSortable(),
            DTColumnBuilder.newColumn('').withTitle('店铺地址').withClass('func-th').withOption("width", "160px").renderWith(shopAddressHtml).notSortable()

        ];

        function companyAddressHtml(data, type, full, meta) {
            return '<div style="white-space:normal;word-wrap:break-word;">' +
                '<span>' + full.companyAddress + '</span>' +
                '</div>';
        }
        function shopAddressHtml(data, type, full, meta) {
            return '<div style="white-space:normal;word-wrap:break-word;">' +
                '<span>' + full.shopAddress + '</span>' +
                '</div>';
        }


        function serverData(sSource, aoData, fnCallback, oSettings) {

            vm.selected = {};
            var draw = aoData[0].value;
            var sortColumn = $scope.dtColumns[parseInt(aoData[2].value[0].column)].mData;
            var sortDir = aoData[2].value[0].dir;
            var start = aoData[3].value;
            var limit = aoData[4].value;

            if (vm.table2_show == 1) {

                if (vm.userId == undefined || vm.userId == '') vm.userId = 0;

                return customerMgmtService.queryByUserId(draw, sortColumn, sortDir, start, limit, vm.userId)
                    .then(function (resp) {

                        vm.selectAll = false;
                        fnCallback(resp.data);
                        vm.tableData = resp.data.data;
                        vm.dataPrivilegeMessage = resp.data.extendData.dataPrivilegeMessage;//数据权限

                    })
                    .finally(function () {
                        $scope.queryBtnDisabled2 = false;
                    });
            }

            var form = $(oSettings.nTableWrapper).closest('#gridcontroller').find('form');
            var queryConditionObject = getQueryParams(form, vm.tabFilter);
            if (queryConditionObject.rules.length < 1) {
                queryConditionObject.rules.push({"field": "cus.create_time", "value": vm.rangeDate, "op": "between"})
            }

            if(!isEmpty(params)){
                queryConditionObject.rules.push({"field":"kpi","value":JSON.stringify(params),"op":"equal"});
                queryConditionObject.rules.splice(0,1);
            }

            var where = JSON.stringify(queryConditionObject);

            return customerMgmtService.query(draw, sortColumn, sortDir, start, limit, where)
                .then(function (resp) {

                    vm.selectAll = false;
                    fnCallback(resp.data);
                    vm.tableData = resp.data.data;
                    vm.dataPrivilegeMessage = resp.data.extendData.dataPrivilegeMessage;//数据权限

                })
                .finally(function () {
                    $scope.queryBtnDisabled = false;
                });
        }

        $scope.submit = function (event,type) {
           if(type){
               params = null;
           }

            vm.table1_show = 1;
            vm.table2_show = 0;

            $scope.queryBtnDisabled = true;
            $scope.dtInstance.reloadData();
        };

        $scope.submit2 = function (event) {

            vm.table1_show = 0;
            vm.table2_show = 1;

            $scope.queryBtnDisabled2 = true;
            $scope.dtInstance.reloadData();
        };

        $scope.clickConTab = function (event) {

            vm.table1_show = 1;
            vm.table2_show = 0;
        }

        $scope.clickConTab2 = function (event) {

            vm.table1_show = 0;
            vm.table2_show = 1;
        }

        //操作列
        function operateHtml(data, type, full, meta) {

            var str = '';
            str += '<div class="m-t-xs m-b-sm">' +
                '<span class="text-success">' +
                '<button class="btn btn-xs btn-w-xs btn-success btn-outline" ng-if="vm.customerDetail" ng-click="customerDetail(vm.tableData[' + meta.row + '])" >' +
                '    <i class="fa fa-info icon-width">详情</i>' +
                '</button>' +
                '</span>' +
                '</div>';

            str += '<div class="m-t-xs m-b-sm">' +
                '<span class="text-success">' +
                '<button class="btn btn-xs btn-w-xs btn-success btn-outline" ng-if="vm.edit" ng-click="customerEdit(vm.tableData[' + meta.row + '])" >' +
                '    <i class="fa fa-edit icon-width">编辑</i>' +
                '</button>' +
                '</span>' +
                '</div>';

            str += '<div class="m-t-xs m-b-sm">' +
                '<span class="text-success">' +
                '<button class="btn btn-xs btn-w-xs btn-success btn-outline"  ng-if="vm.assignCustomer" ng-click="allot(' + meta.row + ')">' +
                '    <i class="fa fa-rebel icon-width">客户分配管理</i>' +
                '</button>' +
                '</span>' +
                '</div>';

            str += '<div class="m-t-xs m-b-sm">' +
                '<span class="text-success">' +
                '<button class="btn btn-xs btn-w-xs btn-success btn-outline"  ng-if="vm.assignRegion" ng-click="dispatchRegion(vm.tableData[' + meta.row + '])">' +
                '    <i class="fa fa-legal icon-width">分配大区</i>' +
                '</button>' +
                '</span>' +
                '</div>';

            str += '<div class="m-t-xs m-b-sm">' +
                '<span class="text-success">' +
                '<button class="btn btn-xs btn-w-xs btn-success btn-outline"  ng-if="vm.backVisit" ng-click="addVisit(vm.tableData[' + meta.row + '])">' +
                '    <i class="fa fa-legal icon-width">添加回访</i>' +
                '</button>' +
                '</span>' +
                '</div>';

            return str;
        }

        $scope.dispatchRegion = function (rowObj) {
            customerMgmtService.getTopRegionList()
                .then(function successCallback(response) {

                    var modalInstancer = $uibModal.open({
                        templateUrl: 'app/customer-mgmt/modal/customerRegion.html?v=' + LG.appConfig.clientVersion,
                        windowClass: "large-Modal",
                        controller: function ($scope, $uibModalInstance, regionList) {
                            $scope.modal = {};
                            $scope.modal.customerId = rowObj.id;
                            $scope.modal.region = rowObj.regionId;
                            $scope.modal.regionList = regionList;

                            $scope.ok = function () {
                                customerMgmtService.setCustomerRegionId($scope.modal.customerId, $scope.modal.region)
                                    .then(function successCallback(response) {
                                        toaster.pop({
                                            type: response.data.code == 200 ? 'success' : 'error',
                                            title: '提示信息',
                                            body: response.data.message,
                                            showCloseButton: true,
                                            timeout: 5000
                                        });

                                        $uibModalInstance.close();
                                    });


                            };

                            $scope.cancel = function () {
                                $uibModalInstance.close();
                            };
                        },
                        resolve: {
                            regionList: function () {
                                return response.data.data.list;
                            }
                        }
                    });

                    modalInstancer.result.then(function (result) {
                        console.log('分配大区结束');
                        $scope.dtInstance.reloadData(function () {
                        }, false);
                    }, function (reason) {
                        console.log('分配大区');
                    });
                });
        }

        // 添加回访开始
        $scope.addVisit = function (rowObj) {
            customerMgmtService.getVisitInit(rowObj.id).then(function successCallback(response) {
                console.log(response);
                var modalInstance = $uibModal.open({
                    templateUrl: 'app/customer-mgmt/modal/addVisit.html?v=' + LG.appConfig.clientVersion,
                    keyboard: false,
                    windowClass: "",
                    controller: "AddVisitCtrl",
                    resolve:{
                        opener:function () {
                            return $scope
                        },
                        customerId:function(){
                            return rowObj.id
                        }
                    }
                });

                modalInstance.result.then(function (result) {
                    console.log('result:' + result);
                    $scope.dtInstance.reloadData(function () {
                    }, false);
                }, function (reason) {
                    console.log('reason:' + reason);
                });

            });


        }
        // 添加回访结束

        $scope.allocateBatch = function () {
            var customerIds = [];
            for (var id in vm.selected) {
                if (vm.selected[id]) {
                    customerIds.push(id)
                }
            };

            if (customerIds.length == 0) {
                toaster.pop({
                    type: 'error',
                    title: '提示信息',
                    body: "请选择客户",
                    showCloseButton: true,
                    timeout: 5000
                });
                return;
            };

            var rowObjs = [];
            var regionIds = []

            for (var i = 0;i < vm.tableData.length;i++){
                var rowObject = vm.tableData[i];
                if(vm.selected[rowObject.id]){
                    rowObjs.push(rowObject)

                    if(rowObject.regionId == 0){
                        toaster.pop({
                            type: 'error',
                            title: '提示信息',
                            body: "不能分配全国公海客户",
                            showCloseButton: true,
                            timeout: 5000
                        });
                        return;
                    }

                    regionIds.push(rowObject.regionId)
                }
            }

            for(var i = 0;i<regionIds.length-1;i++){
                if(regionIds[i] != regionIds[i+1]){
                    toaster.pop({
                        type: 'error',
                        title: '提示信息',
                        body: "所选客户大区不一致，请检查",
                        showCloseButton: true,
                        timeout: 5000
                    });
                    return;
                }
            }

            customerMgmtService.getCustomerOperatorList(regionIds[0]).then(function successCallback(response) {
               console.log(response);
                var modalInstance = $uibModal.open({
                    templateUrl: 'app/customer-mgmt/modal/allocateBatch.html?v=' + LG.appConfig.clientVersion,
                    keyboard: false,
                    windowClass: "large-Modal",
                    controller: "AllocateBatchCtrl",
                    resolve:{
                        buyerList:function () {
                            return response.data.data.buyerList;
                        },
                        sellerList:function () {
                            return response.data.data.sellerList;
                        },
                        rowObjs:function () {
                            return rowObjs;
                        },
                        customerIds:function () {
                            return customerIds;
                        },
                        opener:function () {
                            return $scope
                        }

                    }
                });

                modalInstance.result.then(function (result) {
                    console.log('result:' + result);
                    $scope.dtInstance.reloadData(function () {
                    }, false);
                }, function (reason) {
                    console.log('reason:' + reason);
                });

            });

        };

        $scope.setlevel = function () {
            var customerIds = [];
            for (var id in vm.selected) {
                if (vm.selected[id]) {
                    customerIds.push(id)
                }
            }

            if (customerIds.length == 0) {
                toaster.pop({
                    type: 'error',
                    title: '提示信息',
                    body: "请选择客户",
                    showCloseButton: true,
                    timeout: 5000
                });
                return;
            }
            customerMgmtService.getCustomerLevelList(customerIds)
                .then(function successCallback(response) {
                    var levels = response.data.data["list"];
                    var customerlist = response.data.data["customerlist"];
                    var modalInstancer = $uibModal.open({
                        templateUrl: 'app/customer-mgmt/modal/customerLevel.html?v=' + LG.appConfig.clientVersion,
                        windowClass: 'large-Modal',
                        controller: function ($scope, $uibModalInstance, customerLevelList, DTColumnDefBuilder) {
                            $scope.modal = {};
                            $scope.modal.typeText = '客户等级';
                            $scope.customerLevels = levels;

                            $scope.modal.buyerCustomerLevel = -1;
                            $scope.modal.sellerCustomerLevel = -1;
                            //alert(JSON.stringify(customerlist));

                            $scope.dtInstance = {};

                            $scope.dtOptions = DTOptionsBuilder.newOptions()
                                .withDOM('frtl')
                                .withOption('searching', false)
                                .withOption('lengthChange', false)
                                .withOption('autoWidth', false)
                                .withOption('scrollX', true)
                                .withOption('displayLength', 10000)
                                .withPaginationType('full_numbers');

                            $scope.dtColumnDefs = [
                                DTColumnDefBuilder.newColumnDef(0).notSortable(),
                                DTColumnDefBuilder.newColumnDef(1).notSortable(),
                                DTColumnDefBuilder.newColumnDef(2).notSortable(),
                                DTColumnDefBuilder.newColumnDef(3).notSortable(),
                                DTColumnDefBuilder.newColumnDef(4).notSortable()

                            ];

                            $scope.customerList = customerlist;

                            $scope.ok = function () {
                                if ($scope.modal.buyerCustomerLevel == undefined || $scope.modal.buyerCustomerLevel == "" || $scope.modal.buyerCustomerLevel == null
                                    || $scope.modal.sellerCustomerLevel == undefined || $scope.modal.sellerCustomerLevel == "" || $scope.modal.sellerCustomerLevel == null

                                ) {
                                    toaster.pop({
                                        type: 'error',
                                        title: '请选择客户等级',
                                        body: "请选择客户等级",
                                        showCloseButton: true,
                                        timeout: 5000
                                    });
                                    return;
                                }
                                customerMgmtService.modifyCustomerLevel(customerIds, $scope.modal.buyerCustomerLevel, $scope.modal.sellerCustomerLevel)
                                    .then(function successCallback(response) {
                                        toaster.pop({
                                            type: response.data.code == 200 ? 'success' : 'error',
                                            title: '提示信息',
                                            body: response.data.message,
                                            showCloseButton: true,
                                            timeout: 5000
                                        });
                                        $uibModalInstance.close();


                                    });

                            };
                            $scope.cancel = function () {
                                $uibModalInstance.dismiss("cancel");
                            };

                        },
                        resolve: {
                            customerLevelList: function () {
                                return response.data.data.list;
                            }
                        },
                    });

                    modalInstancer.result.then(function (result) {
                        console.log('分配等级结束');
                        $scope.dtInstance.reloadData(function () {
                        }, false);
                    }, function (reason) {
                        console.log('分配等级');
                    });

                });

        }

        $scope.allot = function (row) {

            var customerIds = [];
            var rowObj = vm.tableData[row];

            customerIds.push(rowObj.id);

            if (customerIds.length == 0) {
                toaster.pop({
                    type: 'error',
                    title: '提示信息',
                    body: "请选择客户",
                    showCloseButton: true,
                    timeout: 5000
                });
                return;
            };

            var rowObjs = [];
            rowObjs.push(rowObj);

            if(rowObj.regionId == 0){
                toaster.pop({
                    type: 'error',
                    title: '提示信息',
                    body: "不能分配全国公海客户,请先分配大区",
                    showCloseButton: true,
                    timeout: 5000
                });
                return;
            }

            customerMgmtService.getCustomerOperatorList(rowObj.regionId).then(function successCallback(response) {
                console.log(response);
                var modalInstance = $uibModal.open({
                    templateUrl: 'app/customer-mgmt/modal/allocateBatch.html?v=' + LG.appConfig.clientVersion,
                    keyboard: false,
                    windowClass: "large-Modal",
                    controller: "AllocateBatchCtrl",
                    resolve:{
                        buyerList:function () {
                            return response.data.data.buyerList;
                        },
                        sellerList:function () {
                            return response.data.data.sellerList;
                        },
                        rowObjs:function () {
                            return rowObjs;
                        },
                        customerIds:function () {
                            return customerIds;
                        },
                        opener:function () {
                            return $scope
                        }

                    }
                });

                modalInstance.result.then(function (result) {
                    console.log('result:' + result);
                    $scope.dtInstance.reloadData(function () {
                    }, false);
                }, function (reason) {
                    console.log('reason:' + reason);
                });

            });


        }

       

        //组织形式
        function shopTypeHtml(data, type, full, meta) {
            return '<div ng-switch on="' + full.shopType + '">' +
                '<span ng-switch-when="0" >未知</span>' +
                '<span ng-switch-when="1">公司</span>' +
                '<span ng-switch-when="2">个人</span>' +
                '<span ng-switch-default>未知</span>' +
                '</div>';
        }

        //角色
        function roleHtml(data, type, full, meta) {
            var str = '';
            if (full.isBuyer) {
                str += '买家' + '<br/>';
            }

            if (full.isSeller) {
                str += '卖家';
            }

            if (str == '') {
                str += '未知';
            }

            return str;
        }

        ////买家身份
        //function isBuyerHtml(data, type, full, meta) {
        //
        //    if (full.isBuyer == 1) {
        //        return '是';
        //    }
        //
        //    return '否';
        //}
        //
        ////卖家身份
        //function isSellerHtml(data, type, full, meta) {
        //
        //    if (full.isSeller == 1) {
        //        return '是';
        //    }
        //
        //    return '否';
        //}

        //创建人
        function createrUserHtml(data, type, full, meta) {
            var str = '';
            if (full.createUserInfo != undefined && full.createUserInfo != '') {
                str += full.createUserInfo;
            } else {
                str += '未知';
            }

            return '<div style="white-space:normal;word-wrap:break-word;">' +
                '<span>' + str + '</span>' +
                '</div>';
        }

        //运营负责人
        function relUserInfoHtml(data, type, full, meta) {

            var str = '';
            if (full.buyerRelInfo != undefined && full.buyerRelInfo != '' && full.buyerRelInfo != 'NaN' && full.buyerRelInfo != 'undefined') {
                str += '<span class="label label-danger" >买:</span>' + full.buyerRelInfo + '<br/>';
            }

            if (full.sellerRelInfo != undefined && full.sellerRelInfo != '' && full.sellerRelInfo != 'NaN' && full.sellerRelInfo != 'undefined') {
                str += '<span class="label label-danger" >卖:</span>' + full.sellerRelInfo + '<br/>';
            }

            return '<div style="white-space:normal;word-wrap:break-word;">' +
                '<span>' + str + '</span>' +
                '</div>';
        }

        //客户等级
        function levelHtml(data, type, full, meta) {

            var str = '';

            if (full.isBuyer == 1 && full.buyerLevel != undefined && full.buyerLevel != null) {
                if (full.buyerLevel == 0) {
                    str += "普通买家" + '<br/>';
                } else if (full.buyerLevel == 1) {
                    str += "种子买家" + '<br/>';
                } else if (full.buyerLevel == 2) {
                    str += "VIP买家" + '<br/>';
                } else if (full.buyerLevel == 5) {
                    str += "优质买家";
                }
            }

            if (full.isSeller == 1 && full.sellerLevel != undefined && full.sellerLevel != null) {
                if (full.sellerLevel == 0) {
                    str += "普通卖家" + '<br/>';
                } else if (full.sellerLevel == 1) {
                    str += "种子卖家" + '<br/>';
                } else if (full.sellerLevel == 2) {
                    str += "VIP卖家" + '<br/>';
                } else if (full.sellerLevel == 5) {
                    str += "优质卖家";
                }
            }

            return '<div style="white-space:normal;word-wrap:break-word;">' +
                '<span>' + str + '</span>' +
                '</div>';
        }

      //客户层级
      function layerHtml(data, type, full, meta) {

        return '<div style="white-space:normal;word-wrap:break-word;">' +
            '<span>' + full.customerLayer + '</span>' +
            '</div>';
      }

        //实名认证
        function authHtml(data, type, full, meta) {
            return '<div style="white-space:normal;word-wrap:break-word;">' +
                '<span>' + full.customerStatus + '</span>' +
                '</div>';
        }

        function toggleAll(selectAll, selectedItems) {
            for (var mainId in selectedItems) {
                if (selectedItems.hasOwnProperty(mainId)) {
                    selectedItems[mainId] = selectAll;
                }
            }
        }

        function toggleOne(selectedItems) {
            for (var mainId in selectedItems) {
                if (selectedItems.hasOwnProperty(mainId)) {
                    if (!selectedItems[mainId]) {
                        vm.selectAll = false;
                        return;
                    }
                }
            }
            vm.selectAll = true;
        }

        $scope.tabQuery = function (event) {

            vm.table1_show = 1;
            vm.table2_show = 0;

            setTimeout(function () {
                var ele = $(event.target);
                var dataFilter = ele.closest('li').attr("data-filter");
                if (isNullOrEmpty(dataFilter)) {
                    vm.tabFilter = [];
                } else {
                    vm.tabFilter = JSON.parse(decodeURIComponent(dataFilter));
                }
                $scope.submit(false);
            }, 200);
        }

        //客户详情
        $scope.customerDetail = function (rowObj) {
            customerMgmtService.getCustomerDetail(rowObj.id)
                .then(function successCallback(response) {

                    $uibModal.open({
                        templateUrl: 'app/customer-mgmt/modal/customerDetail.html?v=' + LG.appConfig.clientVersion,
                        size: 'lg',
                        keyboard: false,
                        controller: function ($scope, $uibModalInstance, rowObj, data,opener) {

                            $scope.info = data.customer;
                            $scope.extralData = data.extralData;
                            $scope.rowObj = rowObj;
                            $scope.canBankInfo = opener.canBankInfo;


                            $scope.cancel = function () {
                                $uibModalInstance.dismiss('cancel');
                            };
                        },
                        resolve: {
                            rowObj: function () {
                                return rowObj;
                            },
                            data: function () {
                                return response.data.data;
                            },
                            opener: function() {
                                return vm;
                            }
                        }
                    });
                });
        }
        //客户详情 END

        //编辑客户
        $scope.customerEdit = function (rowObj) {
            customerMgmtService.getCustomerEditInfo(rowObj.id)
                .then(function successCallback(response) {

                    var modalInstancer = $uibModal.open({
                        templateUrl: 'app/customer-mgmt/modal/customerEdit.html?v=' + LG.appConfig.clientVersion,
                        size: 'lg',
                        keyboard: false,
                        controller: 'CustomerEditCtrl',
                        controllerAs: 'vm',
                        resolve: {
                            rowObj: function () {
                                return rowObj;
                            },
                            customerInfo: function () {
                                return response.data.data.customer;
                            },
                            rootScope: function () {
                                return rootScope;
                            }
                        }
                    });

                    modalInstancer.result.then(function (result) {
                        console.log('编辑客户结束');
                        $scope.dtInstance.reloadData(function () {
                        }, false);
                    }, function (reason) {
                        console.log('编辑客户结束');
                    });

                });
        }
        //编辑客户　END


        //公海拣入
        $scope.gainInPublic = function () {
            customerMgmtService.getUserList().then(function successCallback(response) {
                var modalInstancer =$uibModal.open({
                    templateUrl: 'app/customer-mgmt/modal/gain_customer_public.html?v=' + LG.appConfig.clientVersion,
                    windowClass: 'large-Modal',
                    keyboard: false,
                    controller: 'CustomerInPublicCtrl',
                    resolve: {
                        buyerList: function () {
                            return response.data.data.buyerList;
                        },
                        sellerList:function () {
                            return response.data.data.sellerList;
                        },
                        restNum:function () {
                            return response.data.data.restNum
                        }
                    }
                });

                modalInstancer.result.then(function (result) {
                    console.log('公海拣入成功');
                    $scope.dtInstance.reloadData(function () {
                    }, false);
                }, function (reason) {
                    console.log('公海拣入取消');
                });
            });
        };




    }

    angular
        .module('app.customer-mgmt')
        .controller('CustomerMgmtCtrl', CustomerMgmtCtrl)

})();