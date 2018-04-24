/**
 * Created by zhenyu on 2016/9/20.
 */

(function () {

    'use strict';

    itemCheckMgmtCtrl.$inject = ['$scope', '$http', '$uibModal', '$filter', '$compile', 'toaster', 'DTOptionsBuilder', 'DTColumnBuilder','itemCheckMgmtService','SweetAlert'];

    function itemCheckMgmtCtrl($scope, $http, $uibModal, $filter, $compile, toaster, DTOptionsBuilder, DTColumnBuilder,itemCheckMgmtService,SweetAlert) {
        var vm = this
        vm.id = vm.role_name = ''

        vm.quoteManId = -1;

        vm.qualification = -1;

        vm.productNameId = -1;

        vm.itemSource = -1;

        vm.currentStatus =  -1;

        vm.status = -1;

        vm.searchContent = "";

        vm.itemType = -1;

        vm.district = -1;

        vm.startDate = '';

        vm.endDate = '';

        vm.lsIsbn = '';

        vm.sampleId = '';

        vm.deptPath = '';

        vm.subDeptList = [];



        // 初始化数据
        function init() {
            // 初始化报价业务员数据
            itemCheckMgmtService.getOperatorList().then(function(response) {
                vm.roleList = response.data.data.sellerOperatorList;
            });

            // 初始化品名列表
            itemCheckMgmtService.getProductNameList(-1).then(function(response) {
                vm.productNameList = response.data.data.product.propertyList;
            });

            //初始化下拉菜单数据
            itemCheckMgmtService.queryInit().then(function(response) {
                vm.itemStatusList = response.data.data.itemStatus;
                vm.statusList = response.data.data.statusList;
                vm.qualificationList = response.data.data.isPassed;
                vm.itemTypeList = response.data.data.itemCategory;
                vm.itemSourceList = response.data.data.itemSource;
                vm.districtList = response.data.data.regions;
                vm.privilegeNameList = response.data.data.privilegeNameList;
                initPermission(vm.privilegeNameList);
            });

          changeRegion();
        }

        init();

        // 初始化权限控制

        function initPermission(data) {
            vm.showPassBtn = check(data,'WEB.ITEM-CHECK.PASSED');
            vm.showAuditBtn = check(data,'WEB.ITEM-CHECK.AUDIT');
            vm.showEditBtn = check(data,'WEB.ITEM-CHECK.EDIT');
            vm.showAddBtn = check(data,'WEB.ITEM-CHECK.ADD');
        }

        // 初始化搜索条件

        function clear() {
            vm.searchContent = "";
            vm.quoteManId  = vm.productNameId = -1;
            vm.itemStatus = vm.status = vm.itemType = vm.district = vm.qualification = vm.currentStatus = vm.itemSource = vm.district = -1;
            vm.lsIsbn = vm.sampleId = vm.deptPath = "";
            vm.subDeptList = [];
            $('#createTime').val('');
        }

        // 从指定数组中找到对应的数组项,返回true或者false

        function check(data,item) {
            if (!(data instanceof Array)) {
                throw new Error('data 不是一个数组');
            }

            return data.indexOf(item) > -1;

        }

      // 改变大区
      function changeRegion() {
        vm.deptPath = "";
        vm.subDeptList = [];
        if (vm.district) {
          itemCheckMgmtService.getSubDept(vm.district).then(function(response){
            vm.subDeptList = response.data.data.deptList;
          },function(){
            toaster.pop({
              type: 'warning',
              title: '提示信息',
              body: '获取子部门列表失败',
              timeout: 5000
            });
          });
        }
      }

      $scope.changeRegion = function($event) {
        changeRegion();
      };

        $scope.clear = function($event) {
            clear();
          changeRegion();
        };

        $scope.addItem = function(rowData) {
            openModal('app/item-check-mgmt/modal/add-edit-check-item.html?v=' + LG.appConfig.clientVersion,'addEditCheckItemCtrl',1,rowData);
        };

        $scope.editItem = function(rowData) {
            openModal('app/item-check-mgmt/modal/add-edit-check-item.html?v=' + LG.appConfig.clientVersion,'addEditCheckItemCtrl',2,rowData);
        }

        $scope.reviewItem = function(rowData) {
            openModal('app/item-check-mgmt/modal/add-edit-check-item.html?v=' + LG.appConfig.clientVersion,'addEditCheckItemCtrl',3,rowData);
        }

        $scope.changeItemType = function() {
            // 修改品名列表
            itemCheckMgmtService.getProductNameList(vm.itemType).then(function(response) {
                vm.productNameList = response.data.data.product.propertyList;
            });
        }

        var today = new Date();
        //vm.startDate = $filter('date')(today.setDate(today.getDate()-7), 'yyyy-MM-dd') + " 00:00:00";
        vm.startDate = $filter('date')(today.setMonth(today.getMonth()-1), 'yyyy-MM-dd') + " 00:00:00";
        vm.endDate = $filter('date')(new Date(), 'yyyy-MM-dd') + " 23:59:59";

        // 默认显示的时间
        vm.validateDateRange = {
            startDate: vm.startDate,
            endDate: vm.endDate
        };

        $scope.$watch('vm.validateDateRange', function (newVal, oldVal) {
            if (newVal) {
                vm.startDate = moment(newVal.startDate, "YYYY-MM-DD hh:mm:ss").format(
                    "YYYY-MM-DD HH:mm:ss");
                vm.endDate = moment(newVal.endDate, "YYYY-MM-DD hh:mm:ss").format(
                    "YYYY-MM-DD HH:mm:ss");
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
            }
        };

        $scope.dtInstance = {};

        $scope.search = function() {
            setTimeout(function() {
                $scope.dtInstance.reloadData(null,false);
            },2000);
        }

        // 配置列表

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
            DTColumnBuilder.newColumn(null).withOption("width", "300px").withTitle('操作')
                .withClass('func-th').notSortable().renderWith(actionsHtml),
            DTColumnBuilder.newColumn('lsItemCode').withTitle('链尚货号')
                .withClass('func-th').withOption("width", "70px").notSortable(),
            DTColumnBuilder.newColumn('itemId').withTitle('商品ID')
                .withClass('func-th').withOption("width", "70px").notSortable(),
            DTColumnBuilder.newColumn('itemCode').withTitle('商品货号')
            .withClass('func-th').withOption("width", "70px").notSortable(),
            DTColumnBuilder.newColumn('itemSourceName').withTitle('商品来源')
            .withClass('func-th').withOption("width", "70px").notSortable(),
            DTColumnBuilder.newColumn('name').withTitle('标题')
                .withClass('func-th').withOption("width", "70px").notSortable(),
            DTColumnBuilder.newColumn('createTime').withTitle('创建时间  ')
                .withClass('func-th').withOption("width", "120px")
                .renderWith(timeHtml),
            DTColumnBuilder.newColumn('largeCargoOrderNum').withTitle('大货订单 ')
                .withClass('func-th').withOption("width", "80px"),
            DTColumnBuilder.newColumn('swatchOrderNum').withTitle('样布订单')
                .withClass('func-th').withOption("width", "70px"),
            DTColumnBuilder.newColumn('colorStandOrderNum').withTitle('样卡')
                .withClass('func-th').withOption("width", "60px"),
            DTColumnBuilder.newColumn('sampleCode').withTitle('样卡ID')
                .withClass('func-th').withOption("width", "70px").notSortable(),
            DTColumnBuilder.newColumn('sellTotal').withTitle('累计销量')
                .withClass('func-th').withOption("width", "60px"),
            DTColumnBuilder.newColumn('lsPrice').withTitle('链尚价')
                .withClass('func-th').withOption("width", "400px"),
            DTColumnBuilder.newColumn('purchasePrice').withTitle('采购价')
                .withClass('func-th').withOption("width", "400px"),
            DTColumnBuilder.newColumn('itemStatus').withTitle('审核状态')
                .withClass('func-th').withOption("width", "100px"),
            DTColumnBuilder.newColumn('productName').withTitle('品名')
                .withClass('func-th').withOption("width", "200px").notSortable(),
            DTColumnBuilder.newColumn('operatorName').withTitle('报价业务员')
                .withClass('func-th').withOption("width", "200px").notSortable()
        ];

        function actionsHtml(data, type, full, meta) {
            var itemStatusId = data.itemStatusId;
            var AuditStatus = itemStatusId == 0 || itemStatusId == 3;// 根据商品状态来判断审核按钮显示与否
            var status = data.status;
            var onlineStatus = status == 1;
            var offlineStatus = status == 2;
            var isPassed = data.isPassed;
            var passedBtn = isPassed == 1;
            var noPassedBtn = isPassed == 0;
            var normalBtn = isPassed != 1 && isPassed != 0;
            return'<button id="btn-to-receive-2" ng-if="vm.showEditBtn" class="btn btn-xs btn-blue" ng-click="editItem(vm.tableData[' + meta.row + '])">' + '编辑' + '</button>&nbsp;' +

                '<button id="btn-to-receive-3" ng-if="vm.showAuditBtn &&' + AuditStatus +'" class="btn btn-xs btn-info"  ng-click="reviewItem(vm.tableData[' + meta.row + '])">' + '审核' + '</button>&nbsp;' +

                '<button id="btn-to-receive-3" ng-if="vm.showEditBtn &&' + offlineStatus +'" class="btn btn-xs btn-success"  ng-click="updateStatus(vm.tableData[' + meta.row + '])">' + '上架' + '</button>&nbsp;' +

                '<button id="btn-to-receive-3" ng-if="vm.showEditBtn &&' + onlineStatus +'" class="btn btn-xs btn-primary"  ng-click="updateStatus(vm.tableData[' + meta.row + '])">' + '下架' + '</button>&nbsp;' +

                '<button id="btn-to-receive-4" ng-if="vm.showPassBtn &&' + passedBtn +'" class="btn btn-xs btn-danger" ng-click="editPass(vm.tableData[' + meta.row + '])">' + '不合格' + '</button>' +

                '<button id="btn-to-receive-4" ng-if="vm.showPassBtn &&' + noPassedBtn +'" class="btn btn-xs btn-success" ng-click="editPass(vm.tableData[' + meta.row + '])">' + '合格' + '</button>' +

                '<button id="btn-to-receive-4" ng-if="vm.showPassBtn &&' + normalBtn +'" class="btn btn-xs btn-warning" ng-click="editPass(vm.tableData[' + meta.row + '])">' + '是否合格' + '</button>'
        }

        function serverData(sSource, aoData, fnCallback, oSettings) {
                var aSource = aSource;
                console.log("_aoData")
                console.log(aoData)
                console.log("_osSettings")
                console.log(oSettings)
                console.log(aSource);

                var createTimeVal = $('#createTime').val();

                if (createTimeVal.length > 0) {
                    vm.startDate = createTimeVal.trim().split(' - ')[0] + ':00';
                    vm.endDate = createTimeVal.trim().split(' - ')[1] + ':00';
                } else {
                    vm.startDate = vm.endDate = '';
                }

                var draw = aoData[0].value;
                var sortColumn = $scope.dtColumns[parseInt(aoData[2].value[0].column)].mData;
                var sortDir = aoData[2].value[0].dir;
                var start = aoData[3].value;
                var limit = aoData[4].value;
                var searchValue = aoData[5].value.value;
                var searchRegex = aoData[5].value.regex;

                var form = $(oSettings.nTableWrapper).closest('#gridcontroller').find('form');

                return itemCheckMgmtService.listQuery(
                    vm.searchContent,sortColumn, sortDir,draw, start, limit, vm.itemType,vm.qualification,
                    vm.itemSource,vm.quoteManId,vm.productNameId,vm.district,vm.deptPath,vm.currentStatus,
                    vm.status,vm.lsIsbn,vm.sampleId,vm.startDate,vm.endDate).then(function (resp) {
                    fnCallback(resp.data.data);
                    vm.tableData = resp.data.data.data
                }).finally(function () {
                    $scope.queryBtnDisabled = false;
                });
            }

        function timeHtml(data, type, full, meta) {

            if (data == null || data == '') {
                return "";
            }

            return $filter('date')(data,'yyyy-MM-dd HH:mm:ss');
        }


        function openModal(templateUrl,controller,state,rowData) {
            var opener = $scope;
            var modalInstance =  $uibModal.open({
                templateUrl: templateUrl,
                // size: 'lg',
                controller: controller,
                resolve: {
                    state: function() {
                        return state;
                    },
                    roleList: function() {
                        return vm.roleList;
                    },
                    rowData: function() {
                        return rowData;
                    },
                    opener: function() {
                        return opener;
                    }
                }
            });
            modalInstance.result.then(function (result) {
            	$scope.dtInstance.reloadData(null,false);
               }, function (reason) {
            	$scope.dtInstance.reloadData(null,false);
            });
        }

        // 判断是否合格插件
        $scope.editPass = function(rowData) {
            var opener = $scope;
            $uibModal.open({
                templateUrl: 'app/item-check-mgmt/modal/is-qualified.html?v=' + LG.appConfig.clientVersion,
                controller: 'isQualifiedCtrl',
                resolve: {
                    isPassedData:function () {
                        return {itemId: rowData.itemId,isPassed: rowData.isPassed,passedReason: rowData.passedReason};
                    },
                    opener: function() {
                        return opener;
                    }
                }
            });
        }

        // 上下架方法

        $scope.updateStatus = function(rowData) {
            var status = rowData.status;
            var title = '';
            var statusText = '';
            var confirmBtnText = '';
            // 1的当前状态为上架
            if (status == 1) {
                title = '商品下架';
                statusText = '是否下架该商品？下架之后，该商品在自营店中不会被搜索到';
                confirmBtnText = '确定下架';
            // 2当前状态为下架
            } else if (status == 2) {
                title = '商品上架';
                statusText = '是否上架该商品？上架之后，该商品在自营店中可以被搜索到。';
                confirmBtnText = '确定上架';
            }
            SweetAlert.swal({
                    title: title,
                    text: statusText,
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#DD6B55",
                    confirmButtonText: confirmBtnText,
                    cancelButtonText: "取消返回",
                    closeOnConfirm: false,
                    closeOnCancel: true
                },
                function (isConfirm) {
                    if (isConfirm) {
                        itemCheckMgmtService.updateStatus(rowData.itemId)
                            .then(function successCallback(resp) {
                                if (resp.data.code == 200) {
                                    SweetAlert.swal("操作成功!", resp.data.data, "success");
                                    setTimeout(function() {
                                        $scope.dtInstance.reloadData(null,false);
                                    },2000);

                                } else {
                                    SweetAlert.swal("操作失败!", resp.data.message, "error");
                                }
                            });

                    }
                });
        }

        $scope.userScopes = [
        ]

        // $('.table').on('draw.dt', function () {
        //     //使用col插件实现表格头宽度拖拽
        //     $(".table").colResizable(
        //         {
        //             minWidth: 80,
        //             liveDrag: true
        //         }
        //     );
        // });
    }


    angular
        .module('app.item-check-mgmt')
        .controller('itemCheckMgmtCtrl', itemCheckMgmtCtrl);

})();