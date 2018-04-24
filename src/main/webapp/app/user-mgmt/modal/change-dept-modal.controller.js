/**
 * change-dept-modal.controller.js
 */

(function () {

    'use strict';

    ChangeUserDeptModalCtrl.$inject = ['$scope', '$http', '$uibModal', '$uibModalInstance', '$filter', '$compile', 'toaster', 'UserService', 'data', 'DTOptionsBuilder', 'DTColumnBuilder'];


    function ChangeUserDeptModalCtrl($scope, $http, $uibModal, $uibModalInstance, $filter, $compile, toaster, UserService, data, DTOptionsBuilder, DTColumnBuilder) {
        var vm = this;

        $scope.data = data;

        $scope.newDepartmentId = 0;
        $scope.newDepartmentName = '';
        $scope.allowFetchData = 1;
        vm.transferType = 0;


        $scope.showDeptTree = function () {

            UserService.showDeptTree($scope, $uibModal, $uibModalInstance);

        };

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
            .withOption('displayLength', [10])
            .withPaginationType('full_numbers')
            // .withOption('rowCallback', rowCallback)
            .withOption('createdRow', function (row, data, dataIndex) {
                $compile(angular.element(row).contents())($scope);
            });


        $scope.dtColumns = [
            DTColumnBuilder.newColumn('customerId').withTitle('客户ID').withClass('func-th').withOption("width", "70px").notSortable(),
            DTColumnBuilder.newColumn('mobile').withTitle('注册手机号').withClass('func-th').withOption("width", "120px").notSortable(),
            DTColumnBuilder.newColumn('companyName').withTitle('公司名').withClass('func-th').withOption("width", "70px").notSortable(),
            DTColumnBuilder.newColumn('description').withTitle('客户描述').withClass('func-th').withOption("width", "60px").notSortable(),
            DTColumnBuilder.newColumn('shopName').withTitle('店铺名').withClass('func-th').withOption("width", "120px").notSortable(),
            DTColumnBuilder.newColumn('isSeller').withTitle('是否是卖家').notSortable(),
            DTColumnBuilder.newColumn('isBuyer').withTitle('是否是买家').notSortable(),
        ]

        function serverData(sSource, aoData, fnCallback, oSettings) {
            var draw = aoData[0].value;
            var sortColumn = $scope.dtColumns[parseInt(aoData[2].value[0].column)].mData;
            var sortDir = aoData[2].value[0].dir;
            var start = aoData[3].value;
            var limit = aoData[4].value;

            return UserService.customerList4TransferDepartment($scope.data.id, vm.transferType , start, limit).then(function (resp) {
                fnCallback(resp.data);
                vm.tableData = resp.data.data;
            }).finally(function () {
                $scope.queryBtnDisabled = false;
            });
        }


        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };

        $scope.clickTab = function($event) {
            var target = $event.currentTarget;
            vm.transferType = target.dataset.filter;
            $scope.dtInstance.reloadData();
        }

        $scope.ok = function () {


            if ($scope.newDepartmentId == 0) {
                return UserService.showTip('error', '请选择新的部门')
            }
            if ($scope.data.department_id == $scope.newDepartmentId) {
                return UserService.showTip('error', '原部门不能新部门不能一样,新部门ID:' + $scope.newDepartmentId);
            }

            $scope.okBtnDisabled = true;
            UserService.changeUserDept($scope.data.id, $scope.newDepartmentId, $scope.allowFetchData).then(function successCallback(response) {
                UserService.showTip(response.data.code == 200 ? 'success' : 'error', response.data.message);
                if (response.data.code == 200) {
                    $uibModalInstance.close();
                }
            }).finally(function () {

                $scope.okBtnDisabled = false;
            });
        }
    }


    angular
        .module('app.user-mgmt')
        .controller('ChangeUserDeptModalCtrl', ChangeUserDeptModalCtrl)

})();