/**
 * Created by zhenyu on 2016/9/20.
 */

(function () {

    'use strict';

    RolePermissionMgmtCtrl.$inject = ['$scope', '$http', '$uibModal', '$filter', '$compile', 'toaster', 'rolePermissionMgmtService', 'permissionCheckService', 'DTOptionsBuilder', 'DTColumnBuilder'];

    function RolePermissionMgmtCtrl($scope, $http, $uibModal, $filter, $compile, toaster, rolePermissionMgmtService, permissionCheckService, DTOptionsBuilder, DTColumnBuilder) {
        var vm = this
        vm.id = vm.role_name = ''
        //是否有新增角色的权限
        vm.addNewRole = permissionCheckService.check("WEB.PERMISSION.ROLE-MGMT.ADD")
        //是否有修改权限
        vm.editRole = permissionCheckService.check("WEB.PERMISSION.ROLE-MGMT.MODIFY")
        //是否有删除权限
        vm.deleteRole = permissionCheckService.check("WEB.PERMISSION.ROLE-MGMT.DELETE")
        //是否有添加人员的权限
        vm.addUsers = permissionCheckService.check("WEB.PERMISSION.ROLE-MGMT.ADDUSERS")
        //是否有分配权限的的权限
        vm.assignPermission = permissionCheckService.check("WEB.PERMISSION.ROLE-MGMT.ASSIGN")
        //查看角色详情
        vm.roleDetail = permissionCheckService.check("WEB.PERMISSION.ROLE-MGMT.DETAIL")


        $scope.userScopes = [
        ]
        init();

        function init() {
            rolePermissionMgmtService.getUserScope().then(function (resp) {
                $scope.userScopes = resp.data.data
            })


            $scope.roleMgmtScopes = [
                {key:0,value:'无'},
                {key:1,value:'自定义'},
                {key:2,value:'全部'}
            ]
        }


        function isEmpty(obj) {
            for (var name in obj)
            {
                return false;
            }
            return true;
        }


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
            DTColumnBuilder.newColumn('id').withTitle('角色编号'),
            DTColumnBuilder.newColumn('roleName').withTitle('角色名'),
            DTColumnBuilder.newColumn('userNum').withTitle('有效人数').notSortable(),
            DTColumnBuilder.newColumn('roleDesc').withTitle('描述').notSortable(),
            DTColumnBuilder.newColumn('roleMgmtIds').withTitle('角色管理具体id').notVisible(),
            DTColumnBuilder.newColumn('remark').withTitle('备注').notVisible(),
            DTColumnBuilder.newColumn('roleMgmtScope').withTitle('角色管理范围').notVisible(),
            DTColumnBuilder.newColumn('userScope').withTitle('权限范围').notSortable().renderWith(statusHtml),
            DTColumnBuilder.newColumn('validity').withTitle('是否有效').notSortable().renderWith(
                function (data, type, full, meta) {
                    if (data == 1) {
                        return '<span class="label label-success">有效</span>';
                    } else {

                        return '<span class="label label-danger">无效</span>'
                    }
                }
            ),

            DTColumnBuilder.newColumn(null).withTitle('操作').notSortable().withClass('text-center p-w-xxs-i')
                .renderWith(actionsHtml)];

        function actionsHtml(data, type, full, meta) {
            return '<button id="btn-to-receive-' + full.id + '" class="btn btn-xs btn-success"' + 'ng-if="vm.roleDetail && ' + data.validity + '==1"' + ' ng-click="roleDetail(' + meta.row + ',' + escapeHTML(full.id) + ')">' + '详情' + '</button>&nbsp;' +

                //'<button id="btn-to-receive-' + full.id + '" class="btn btn-xs btn-info"' + 'ng-if="vm.addUsers && '+data.validity+'==1"'+' ng-click="addUsers(' + meta.row + ',' + escapeHTML(full.id) + ')">' + '添加人员' + '</button>&nbsp;' +

                '<button id="btn-to-receive-' + full.id + '" class="btn btn-xs btn-blue"' + 'ng-if="vm.editRole && ' + data.validity + '==1"' + ' ng-click="editRole(' + meta.row + ',' + escapeHTML(full.id) + ')">' + '编辑' + '</button>&nbsp;' +

                '<button id="btn-to-receive-' + full.id + '" class="btn btn-xs btn-info"' + 'ng-if="vm.assignPermission  && ' + data.validity + '==1"' + ' ng-click="assignPermission(vm.tableData[' + meta.row + '])">' + '分配权限' + '</button> &nbsp;' +

                '<button id="btn-to-receive-' + full.id + '" class="btn btn-xs btn-danger"' + 'ng-if="vm.deleteRole && ' + data.validity + '==1"' + ' ng-click="deleteRole(' + meta.row + ',' + escapeHTML(full.id) + ')">' + '删除' + '</button>' +
                '<button id="btn-to-receive-' + full.id + '" class="btn btn-xs btn-info"' + 'ng-if="' + data.validity + '==0" ng-click="resumeRole(' + meta.row + ',' + escapeHTML(full.id) + ')">' + '恢复' + '</button>'

        }

        function statusHtml(data, type, full, meta) {
            for (var i = 0; data != '' && i < $scope.userScopes.length; ++i) {
                if ($scope.userScopes[i].key == data) {
                    return $scope.userScopes[i].value;
                }
            }
            return '未知';
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

            console.log("_aoData")
            console.log(aoData)
            console.log("_osSettings")
            console.log(oSettings)

            var draw = aoData[0].value;
            var sortColumn = $scope.dtColumns[parseInt(aoData[2].value[0].column)].mData;
            var sortDir = aoData[2].value[0].dir;
            var start = aoData[3].value;
            var limit = aoData[4].value;
            var searchValue = aoData[5].value.value;
            var searchRegex = aoData[5].value.regex;

            var form = $(oSettings.nTableWrapper).closest('#gridcontroller').find('form');
            var queryConditionObject = getQueryParams(form, vm.tabFilter);

            var where = JSON.stringify(queryConditionObject);

            return rolePermissionMgmtService.roleQuery(draw, sortColumn, sortDir, start, limit, where).then(function (resp) {
                console.log(resp)
                fnCallback(resp.data);
                vm.tableData = resp.data.data
            }).finally(function () {
                $scope.queryBtnDisabled = false;
            });
        }

        $scope.roleDetail = function (row, roleId) {
            rolePermissionMgmtService.roleDetail(roleId).then(function successCallback(response) {
                if (response.data.code == 200) {

                    console.log(response)
                    $uibModal.open({
                        templateUrl: 'app/role-permission-mgmt/modal/role-detail.html?v=' + LG.appConfig.clientVersion,
                        windowClass: 'large-Modal',
                        keyboard: false,
                        controller: 'RolePermissionDetailCtrl',
                        resolve: {
                            data: function () {
                                return response.data.data
                            }
                        }
                    });
                }
            });


        }



        $scope.editRole = function (row, roleId) {
            var rowObj = vm.tableData[row];

            openModal('app/role-permission-mgmt/modal/add-role.html?v=' + LG.appConfig.clientVersion, "修改成功",rowObj);
        }

        $scope.addRole = function () {
            var rowObj = {}
            rowObj.id = 0
            rowObj.roleName = ''
            rowObj.roleDesc = ''
            rowObj.userScope = 2
            rowObj.roleMgmtScope = 0
            rowObj.remark = ''
            rowObj.roleMgmtIds = ''

            openModal('app/role-permission-mgmt/modal/add-role.html?v=' + LG.appConfig.clientVersion, "添加成功", rowObj);
        }

        $scope.deleteRole = function (row, roleId) {
            var opener = $scope
            $uibModal.open({
                templateUrl: 'app/role-permission-mgmt/modal/confirm-delete.html?v=' + LG.appConfig.clientVersion,
                // size:'lg',
                controller: function ($scope, $uibModalInstance) {

                    $scope.cancel = function () {
                        $uibModalInstance.dismiss('cancel');
                    };

                    $scope.ok = function () {
                        $scope.okBtnDisabled = true;
                        rolePermissionMgmtService.deleteRole(roleId)
                            .then(function successCallback(response) {
                                toaster.pop({
                                    type: response.data.code == 200 ? 'success' : 'error',
                                    title: '删除成功',
                                    body: response.data.message,
                                    showCloseButton: true,
                                    timeout: 5000
                                });
                                if (response.data.code == 200) {
                                    opener.dtInstance.reloadData();
                                }
                            })
                            .finally(function () {
                                $uibModalInstance.close();
                                opener.okBtnDisabled = false;
                            });
                    };
                },
                windowClass: 'animated bounceIn'
            });
        }


        $scope.assignPermission = function (rowObj) {
            if (rowObj.validity == 0) {
                toaster.pop({
                    type: 'error',
                    title: '提示信息',
                    body: '当前角色不可用,不能分配角色权限',
                    showCloseButton: true,
                    timeout: 5000
                });
                return;
            } else {
                var modalInstance = $uibModal.open({
                    templateUrl: 'app/role-permission-mgmt/modal/assignPermission.modal.html?v=' + LG.appConfig.clientVersion,
                    windowClass: 'large-Modal',
                    keyboard: false,
                    controller: 'AssignPermissionCtrl',
                    resolve: {
                        rowObj: function () {
                            return rowObj;
                        }
                    }
                });
            }

        }

        $scope.resumeRole = function (row, roleId) {
            rolePermissionMgmtService.resumeRole(roleId).then(function successCallback(response) {
                    toaster.pop({
                        type: response.data.code == 200 ? 'success' : 'error',
                        title: "提示信息",
                        body: response.data.message,
                        showCloseButton: true,
                        timeout: 3000
                    });
                    if (response.data.code == 200) {
                        $scope.dtInstance.reloadData();
                    }
                })
                .finally(function () {
                    $uibModalInstance.close();
                    $scope.okBtnDisabled = false;
                });
        }

        function openModal(url, title,rowObj) {
            var opener = $scope
            $uibModal.open({
                templateUrl: url,
                // size:'lg',
                controller: function ($scope, $uibModalInstance,rolePermissionMgmtService) {

                    $scope.modal = {};
                    $scope.modalRoleDesc = rowObj.roleDesc
                    $scope.modalRoleId = rowObj.id
                    $scope.modalRoleName = rowObj.roleName
                    $scope.userScopes = opener.userScopes;
                    $scope.modal.userScope=rowObj.userScope+'';
                    $scope.roleMgmtScopes = opener.roleMgmtScopes
                    $scope.roleMgmtScope = rowObj.roleMgmtScope
                    $scope.remark = rowObj.remark
                    $scope.isHas = false

                    if(isEmpty(rowObj.roleMgmtIds) && $scope.roleMgmtScope != 2 ){
                        $scope.roleMgmtIds = []
                        $scope.isHas = false
                    }else{
                        $scope.roleMgmtIds = rowObj.roleMgmtIds.split(',')
                        $scope.isHas = true
                    }

                    
                    $scope.cancel = function () {
                        $uibModalInstance.dismiss('cancel');
                    };

                    $scope.title='';
                    if(rowObj.id<=0){
                        $scope.title='新增角色';
                    }else{
                        $scope.title='修改角色-'+rowObj.id;
                    }


                    $scope.change = function (roleMgmtScope) {
                        if(roleMgmtScope == 0){
                            $scope.remark = ''
                            $scope.isHas = false
                        $scope.roleMgmtIds = []
                    }else if(roleMgmtScope == 1) {
                            
                            rolePermissionMgmtService.getTop20Role().then(function successCallback(response) {

                                $uibModal.open({
                                    templateUrl: 'app/role-permission-mgmt/modal/role-scope-mgmt-select.html?v=' + LG.appConfig.clientVersion,
                                    windowClass: "large-Modal",
                                    controller: 'RoleMgmtScopeCtrl',
                                    resolve: {
                                        roleList: function () {
                                            return response.data;
                                        },
                                        tempScope:function () {
                                            return $scope
                                        }
                                    }
                                });
                            })
                        }else{
                            $scope.remark = "包含（全部角色）"
                            $scope.isHas = true
                            $scope.roleMgmtIds = []
                        }
                    }


                    $scope.ok = function () {
                        $scope.okBtnDisabled = true;

                        rolePermissionMgmtService.saveRole($scope.modalRoleId, $scope.modalRoleName, $scope.modalRoleDesc,
                            $scope.modal.userScope,$scope.roleMgmtScope,$scope.remark,$scope.roleMgmtIds )
                            .then(function successCallback(response) {
                                toaster.pop({
                                    type: response.data.code == 200 ? 'success' : 'error',
                                    title: title,
                                    body: response.data.message,
                                    showCloseButton: true,
                                    timeout: 5000
                                });
                                if (response.data.code == 200) {
                                    opener.dtInstance.reloadData();
                                }
                            })
                            .finally(function () {
                                $uibModalInstance.close();
                                $scope.okBtnDisabled = false;
                            });
                    };
                },
                resolve: {
                    // UserService: function () {
                    //     return UserService;
                    // },
                    rolePermissionMgmtService:function () {
                        return rolePermissionMgmtService
                    }
                }
            });
        }


        $scope.submit = function () {
            $scope.queryBtnDisabled = true;
            $scope.dtInstance.reloadData();
        };


    }


    angular
        .module('app.role-permission-mgmt')
        .controller('RolePermissionMgmtCtrl', RolePermissionMgmtCtrl);

})();