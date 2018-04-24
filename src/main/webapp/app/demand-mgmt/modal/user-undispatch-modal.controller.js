/**
 * user-undispatch-modal.controller
 */
(function () {

    'use strict';

    UserUnDispatchModalCtrl.$inject = ['$scope', '$uibModal', '$uibModalInstance', '$compile', 'demandMgmtService', 'toaster', 'rootScope', 'rowObj', 'dispatchedUserList', 'dispatchedTaskList', 'DTOptionsBuilder', 'DTColumnBuilder'];

    function UserUnDispatchModalCtrl($scope, $uibModal, $uibModalInstance, $compile, demandMgmtService, toaster, rootScope, rowObj, dispatchedUserList, dispatchedTaskList, DTOptionsBuilder, DTColumnBuilder) {
        var vm = $scope;
        vm.demandId = rowObj.demandId;

        $scope.belongUserName = rowObj.belongUserName;
        $scope.belongUserPhone = rowObj.belongUserPhone;

        vm.selected = {};
        vm.selectAll = false;
        $scope.showUnDispatch = false;
        var titleHtml = '<input type="checkbox" ng-model="selectAll" ng-click="toggleAll(selectAll, selected)" />';

        $scope.toggleAll = function(selectAll, selectedItems) {
            for (var id in selectedItems) {
                //if (selectedItems.hasOwnProperty(id)) {
                    selectedItems[id] = selectAll;
                //}
            }
        }

        $scope.toggleOne = function(selectedItems) {
            for (var id in selectedItems) {
                if (selectedItems.hasOwnProperty(id)) {
                    if (!selectedItems[id]) {
                        vm.selectAll = false;
                        return;
                    }
                }
            }
            vm.selectAll = true;
        }

        $scope.dtInstance = {};

        $scope.dtOptions = DTOptionsBuilder
            .fromSource('')
            .withOption('data', dispatchedUserList)
            .withOption('serverSide', false)
            .withOption('searching', true)
            .withOption('autoWidth', false)
            .withOption('scrollX', false)
            .withOption('lengthMenu', [10, 25, 50, 100])
            .withOption('displayLength', 10)
            .withOption('order', [2,'desc'])
        //    .withOption('dom', 'flt')
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
            DTColumnBuilder.newColumn('userId').withTitle('_id').notSortable().notVisible(),
            DTColumnBuilder.newColumn(null).withTitle(titleHtml).notSortable().withClass('text-center p-w-xxs-i choose-th').withOption('width', '40px')
                .renderWith(function (data, type, full, meta) {
                    if (full.taskStatus != 1 && full.taskStatus != 4)
                    {
                        return "";
                    }
                    vm.selected[full.taskId] = false;
                    return '<input type="checkbox" ng-model="selected[\'' + full.taskId + '\']" ng-click="toggleOne(selected)" />';
                }),
            DTColumnBuilder.newColumn('taskId').withTitle('任务ID'),
            DTColumnBuilder.newColumn('userId').withTitle('用户ID').notSortable(),
            DTColumnBuilder.newColumn('employeeNo').withTitle('工号').notSortable(),
            DTColumnBuilder.newColumn('realName').withTitle('姓名').notSortable(),
            DTColumnBuilder.newColumn('mobile').withTitle('手机号').notSortable(),
            DTColumnBuilder.newColumn('deptName').withTitle('部门').notSortable(),
            DTColumnBuilder.newColumn('roleName').withTitle('角色').notSortable(),
            DTColumnBuilder.newColumn('email').withTitle('邮箱').notSortable(),
            DTColumnBuilder.newColumn('taskId').withTitle('状态').renderWith(function (data, type, full, meta) {
                        switch (full.sourceType) {
                            case 1:
                                return "公海抢入";
                            case 2:
                                return "后台分配";
                            default:
                                return "未知";
                        }
            })
        ];

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };

        $scope.undispatchTask = function () {

            var taskIds = [];
            for (var id in vm.selected) {
                if (vm.selected[id])
                {
                    taskIds.push(id);
                }
            }

            if(taskIds.length > 0)
            {
                demandMgmtService.undispatchTask(rowObj.demandId, taskIds)
                    .then(function successCallback(response) {

                        toaster.pop({
                            type: response.data.code == 200 ? 'success' : 'error',
                            title: '提示信息',
                            body: response.data.message,
                            showCloseButton: true,
                            timeout: 5000
                        });
                        if (response.data.code == 200) {
                            $uibModalInstance.close();
                            rootScope.dtInstance.reloadData();
                        }

                    });
            }
            else
            {
                toaster.pop({
                    type: 'warning',
                    title: '提示信息',
                    body: "请选择需要撤销任务的用户",
                    showCloseButton: true,
                    timeout: 5000
                });
            }

        };

    }

    angular
        .module('app.demand-mgmt')
        .controller('UserUnDispatchModalCtrl', UserUnDispatchModalCtrl);

})();