/**
 * Created by zhenyu on 2016/9/20.
 */

(function () {

    'use strict';

    RolePermissionDetailCtrl.$inject = ['$scope', '$http', '$uibModal', '$uibModalInstance', '$filter', '$compile', 'toaster', 'rolePermissionMgmtService', 'data'];

    ValidUserCtrl.$inject = ['$scope', '$http', '$uibModal', '$filter', '$compile', 'toaster', 'rolePermissionMgmtService', 'DTOptionsBuilder', 'DTColumnBuilder'];
    InvalidUserCtrl.$inject = ['$scope', '$http', '$uibModal', '$filter', '$compile', 'toaster', 'rolePermissionMgmtService', 'DTOptionsBuilder', 'DTColumnBuilder'];


    function RolePermissionDetailCtrl($scope, $http, $uibModal, $uibModalInstance, $filter, $compile, toaster, rolePermissionMgmtService, data) {
        var vm = this;
        $scope.modal = data;
        $scope.treeData = [];
        var roleId = data.id;
        $scope.treeConfig = {
            'version': 1,
            'plugins': ['types', "checkbox"],
            'types': {
                'default': {
                    'icon': 'fa fa-folder'
                },
                'html': {
                    'icon': 'fa fa-file-code-o'
                },
                'svg': {
                    'icon': 'fa fa-file-picture-o'
                },
                'css': {
                    'icon': 'fa fa-file-code-o'
                },
                'img': {
                    'icon': 'fa fa-file-image-o'
                },
                'js': {
                    'icon': 'fa fa-file-text-o'
                }

            }
        };
        init();

        function init() {
            rolePermissionMgmtService.getRolePrivilegesTree(roleId)
                .then(function (resp) {
                    if (resp.data.code == 200) {
                        $scope.treeData = resp.data.data;
                        //重绘
                        $scope.treeConfig.version++;

                        // alert(roleId);

                    } else {
                        toaster.pop({
                            type: 'info',
                            title: '提示信息',
                            body: resp.data.message,
                            showCloseButton: true,
                            timeout: 5000
                        });
                    }
                });
        }


        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };


    }


    function ValidUserCtrl($scope, $http, $uibModal, $filter, $compile, toaster, rolePermissionMgmtService, DTOptionsBuilder, DTColumnBuilder) {

        var vm = this
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
                if (!vm.headerCompiled) {
                    vm.headerCompiled = true;
                    $compile(angular.element(header).contents())($scope);
                }
            });

        $scope.dtColumns = [
            DTColumnBuilder.newColumn('employeeNo').withTitle('员工编号'),
            DTColumnBuilder.newColumn('realName').withTitle('人员名称'),
            DTColumnBuilder.newColumn('email').withTitle('邮箱'),
            DTColumnBuilder.newColumn('validity').withTitle('是否有效').notSortable().renderWith(
                function (data, type, full, meta) {
                    if (full.validity == 1) {
                        return '<span class="label label-success">有效</span>';
                    } else {

                        return '<span class="label label-danger">无效</span>'
                    }
                }
            ),
            DTColumnBuilder.newColumn('departmentFullName').withTitle('部门名称').notSortable(),
            DTColumnBuilder.newColumn('userRoleName').withTitle('角色名称').notSortable()
        ]


        function serverData(sSource, aoData, fnCallback, oSettings) {
            var draw = aoData[0].value;
            var sortColumn = $scope.dtColumns[parseInt(aoData[2].value[0].column)].mData;
            var sortDir = aoData[2].value[0].dir;
            var start = aoData[3].value;
            var limit = aoData[4].value;
            var queryConditionObject = new LG.QueryBuilder('and').data
            queryConditionObject.rules.push({"field": "P.user_role_id", "value": $scope.modal.id, "op": "equal"})
            queryConditionObject.rules.push({"field": "P.validity", "value": 1, "op": "equal"})

            var where = JSON.stringify(queryConditionObject);

            return rolePermissionMgmtService.roleDetail_users(draw, sortColumn, sortDir, start, limit, where
            ).then(function (resp) {
                fnCallback(resp.data);
            })
        }


    }



    function InvalidUserCtrl($scope, $http, $uibModal, $filter, $compile, toaster, rolePermissionMgmtService, DTOptionsBuilder, DTColumnBuilder) {

        var vm = this
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
                if (!vm.headerCompiled) {
                    vm.headerCompiled = true;
                    $compile(angular.element(header).contents())($scope);
                }
            });

        $scope.dtColumns = [
            DTColumnBuilder.newColumn('employeeNo').withTitle('员工编号'),
            DTColumnBuilder.newColumn('realName').withTitle('人员名称'),
            DTColumnBuilder.newColumn('email').withTitle('邮箱'),
            DTColumnBuilder.newColumn('validity').withTitle('是否有效').notSortable().renderWith(
                function (data, type, full, meta) {
                    if (full.validity == 1) {
                        return '<span class="label label-success">有效</span>';
                    } else {

                        return '<span class="label label-danger">无效</span>'
                    }
                }
            ),
            DTColumnBuilder.newColumn('departmentFullName').withTitle('部门名称').notSortable(),
            DTColumnBuilder.newColumn('userRoleName').withTitle('角色名称').notSortable()
        ]


        function serverData(sSource, aoData, fnCallback, oSettings) {
            var draw = aoData[0].value;
            var sortColumn = $scope.dtColumns[parseInt(aoData[2].value[0].column)].mData;
            var sortDir = aoData[2].value[0].dir;
            var start = aoData[3].value;
            var limit = aoData[4].value;
            var queryConditionObject = new LG.QueryBuilder('and').data
            queryConditionObject.rules.push({"field": "P.user_role_id", "value": $scope.modal.id, "op": "equal"})
            queryConditionObject.rules.push({"field": "P.validity", "value": 0, "op": "equal"})

            var where = JSON.stringify(queryConditionObject);

            return rolePermissionMgmtService.roleDetail_users(draw, sortColumn, sortDir, start, limit, where
            ).then(function (resp) {
                fnCallback(resp.data);
            })
        }


    }



    angular
        .module('app.role-permission-mgmt')
        .controller('RolePermissionDetailCtrl', RolePermissionDetailCtrl)
        .controller('ValidUserCtrl', ValidUserCtrl)
        .controller('InvalidUserCtrl', InvalidUserCtrl);

})();