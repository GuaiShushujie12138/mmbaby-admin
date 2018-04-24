/**
 * view-user-modal.controller.js
 */

(function () {

    'use strict';

    UserLogCtrl.$inject = ['$scope', '$http', '$uibModal', '$filter', '$compile', 'toaster', 'UserService', 'DTOptionsBuilder', 'DTColumnBuilder'];


    function UserLogCtrl($scope, $http, $uibModal, $filter, $compile, toaster, UserService, DTOptionsBuilder, DTColumnBuilder) {
        var vm = this;
        $scope.dtInstance = {};

        $scope.dtOptions = DTOptionsBuilder
            .fromSource('')
            .withFnServerData(serverData)
            .withDataProp('data')
            .withOption('serverSide', true)
            .withOption('searching', false)
            .withOption('lengthChange', true)
            .withOption('autoWidth', false)
            .withOption('scrollX', false)
            .withDOM('frtlip')
            .withOption('lengthMenu', [10, 25, 50])
            .withOption('displayLength', 10)
            .withPaginationType('full_numbers')
            .withOption('createdRow', function (row, data, dataIndex) {
                $compile(angular.element(row).contents())($scope);
            })
            .withOption('headerCallback', function (header) {
                if(!vm.headerCompiled) {
                    vm.headerCompiled = true;
                    $compile(angular.element(header).contents())($scope);
                }
            });

        $scope.dtColumns = [
            DTColumnBuilder.newColumn('id').notVisible(),
            DTColumnBuilder.newColumn('log_type').notSortable().withTitle('日志类型'),
            DTColumnBuilder.newColumn('log_message').notSortable().withTitle('日志备注'),
            DTColumnBuilder.newColumn('create_id').notSortable().withTitle('创建人'),
            DTColumnBuilder.newColumn('create_time').notSortable().withTitle('创建时间').renderWith(timeHtml),
            DTColumnBuilder.newColumn('ip_address').notSortable().withTitle('IP地址')
        ];


        function serverData(sSource, aoData, fnCallback, oSettings) {
            var draw = aoData[0].value;
            var sortColumn = $scope.dtColumns[parseInt(aoData[2].value[0].column)].mData;
            var sortDir = aoData[2].value[0].dir;
            var start = aoData[3].value;
            var limit = aoData[4].value;
            return UserService.queryUserLog(
                draw, sortColumn, sortDir, start, limit,$scope.data.id
            ).then(function (resp) {
                fnCallback(resp.data);
            }).finally(function () {
            });
        }

    }


    angular
        .module('app.user-mgmt')
        .controller('UserLogCtrl', UserLogCtrl)

})();