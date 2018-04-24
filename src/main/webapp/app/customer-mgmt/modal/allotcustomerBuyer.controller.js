/**
 * customer-mgmt.controller
 */
(function () {

    'use strict';

    allotcustomerBuyerCtrl.$inject = ['$scope', '$uibModal', '$state', '$filter', '$compile', 'toaster', 'customerMgmtService', 'DTOptionsBuilder', 'DTColumnBuilder'];
    /**
     * allotcustomerSeller
     */
    function allotcustomerBuyerCtrl($scope, $uibModal, $state, $filter, $compile, toaster, customerMgmtService, DTOptionsBuilder, DTColumnBuilder) {

        var vm = this;
        vm.customerIds =  $scope.$parent.customerIds;
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
            .withOption('createdRow', function (row, data, dataIndex) {
                $compile(angular.element(row).contents())($scope);
            });

        $scope.dtColumns = [

            DTColumnBuilder.newColumn('').withClass('func-th').withTitle('分配买家运营').renderWith(operateHtml),
            DTColumnBuilder.newColumn('relStatus').withClass('func-th').withTitle('是否分配').renderWith(function (data, type, full, meta) {
                switch (data) {
                    case 1:
                        return '<span class="label label-success">已分配</span>';
                    case 0:
                        return '<span class="label label-danger">未分配</span>';
                }
                return "未知";
            }),
            DTColumnBuilder.newColumn('id').withClass('func-th').withTitle('用户编号').notVisible(),
            DTColumnBuilder.newColumn('realName').withClass('func-th').withTitle('姓名'),
            DTColumnBuilder.newColumn('mobile').withClass('func-th').withTitle('手机号'),
            DTColumnBuilder.newColumn('departmentFullName').withClass('func-th').withTitle('部门'),
            DTColumnBuilder.newColumn('roleName').withClass('func-th').withTitle('角色')
        ];

        function serverData(sSource, aoData, fnCallback, oSettings) {
            var draw = aoData[0].value;
            var start = aoData[3].value;
            var limit = aoData[4].value;

            return customerMgmtService.getUserListByBuyer(draw, start, limit,vm.customerIds.join())
                .then(function successCallback(resp) {
                    fnCallback(resp.data.data);
                    vm.tableData = resp.data.data.data;
                })
                .finally(function () {
                    $scope.queryBtnDisabled = false;
                });
        }

        $scope.allotuser = function(row) {
            var userid = vm.tableData[row].id
            //1买家
            return customerMgmtService.allotCustomerUser(vm.customerIds,userid,1).then(function(resp) {
                toaster.pop({
                    type: resp.data.code == 200 ? 'success' : 'error',
                    title: '操作成功',
                    body: resp.data.message,
                    showCloseButton: true,
                    timeout: 5000
                });

                $scope.dtInstance.reloadData();

            })

        }

        $scope.cancelallotuser = function(row) {
            var userid = vm.tableData[row].id
            //1买家
            return customerMgmtService.cancelAllotCustomerUser(vm.customerIds,userid,1).then(function(resp) {
                toaster.pop({
                    type: resp.data.code == 200 ? 'success' : 'error',
                    title: '操作成功',
                    body: resp.data.message,
                    showCloseButton: true,
                    timeout: 5000
                });
                //$uibModalInstance.close();
                $scope.dtInstance.reloadData();

            })

        }
        //canceluser
        //操作列
        function operateHtml(data, type, full, meta) {

            var str = '';
            if(full.relStatus==0) {

                str += '<div class="m-t-xs m-b-sm">' +
                    '<span class="text-success">' +
                    '<button class="btn btn-xs btn-w-xs btn-success btn-outline"  ng-click="allotuser(' + meta.row + ')">' +
                    '    <i class="fa fa-info icon-width" >分配</i>' +
                    '</button>' +
                    '</span>' +
                    '</div>';
            }
            if(full.relStatus==1) {

                str += '<div class="m-t-xs m-b-sm">' +
                    '<span class="text-success">' +
                    '<button class="btn btn-xs btn-w-xs btn-success btn-outline"  ng-click="cancelallotuser(' + meta.row + ')">' +
                    '    <i class="fa fa-edit icon-width">取消分配</i>' +
                    '</button>' +
                    '</span>' +
                    '</div>';
            }
            return str;
        }

    }

    angular
        .module('app.customer-mgmt')
        .controller('allotcustomerBuyerCtrl', allotcustomerBuyerCtrl)

})();