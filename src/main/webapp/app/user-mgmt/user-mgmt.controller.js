/**
 * user-mgmt.controller.js
 */
(function () {

    'use strict';

    UserMgmtCtrl.$inject = ['$scope', '$http', '$uibModal', '$compile', 'toaster', '$filter', 'UserService', 'DTOptionsBuilder', 'DTColumnBuilder', '$state', 'permissionCheckService', 'SweetAlert'];


    /**
     * TradeMgmtCtrl
     */
    function UserMgmtCtrl($scope, $http, $uibModal, $compile, toaster, $filter, UserService, DTOptionsBuilder, DTColumnBuilder, $state, permissionCheckService, SweetAlert) {
        var vm = this;

        //是否有新增用户的权限
        vm.addNewUser = permissionCheckService.check("WEB.PERMISSION.USER-MGMT.ADD");
        //是否有新增子部门的权限
        vm.addNewDept = permissionCheckService.check("WEB.PERMISSION.USER-MGMT.DEPT.ADD");
        //删除部门
        vm.deleteDept = permissionCheckService.check("WEB.PERMISSION.USER-MGMT.DEPT.DELETE");
        //查看用户详情
        vm.userDetail = permissionCheckService.check("WEB.PERMISSION.USER-MGMT.VIEWDETAIL");
        //编辑用户
        vm.editUser = permissionCheckService.check("WEB.PERMISSION.USER-MGMT.MODIFY");
        //修改密码
        vm.modifyPasswd = permissionCheckService.check("WEB.PERMISSION.USER-MGMT.MODIFYPASSWORD");
        //禁用
        vm.disableUser = permissionCheckService.check("WEB.PERMISSION.USER-MGMT.UPDATEUSERSTATUS");
        //恢复
        vm.resumeUser = permissionCheckService.check("WEB.PERMISSION.USER-MGMT.UPDATEUSERSTATUS");
        //更换部门
        vm.changeDept = permissionCheckService.check("WEB.PERMISSION.USER-MGMT.CHANGEDEPARTMENT");

        vm.modifyDeptName = permissionCheckService.check("WEB.PERMISSION.USER-MGMT.DEPT.DELETE");
        // vm.modifyDeptName = true;


        $scope.roleList = [];

        function init() {
            UserService.getRoleList()
            .then(function (resp) {

                $scope.roleList = resp.data.data;
            });

            UserService.loadDeptTree($scope);
        }


        $scope.treeData = [];
        vm.deptFilterMessage = '';

        $scope.treeInstance = {};

        var createUserFunction = null;
        var addDeptFunction = null;
        var deleteDeptFunction = null;
        var updateDeptNameFunction = null;

        if(vm.addNewUser) {
            createUserFunction = {
                "label": "新增用户", "action": function (obj) {

                    var inst = jQuery.jstree.reference(obj.reference);
                    var clickedNode = inst.get_node(obj.reference);

                    $scope.addUser(clickedNode);
                }
            }
        }
        if(vm.addNewDept) {
            addDeptFunction = {
                "label": "新增子部门", "action": function (obj) {
                    var inst = jQuery.jstree.reference(obj.reference);
                    var clickedNode = inst.get_node(obj.reference);
                    // alert("add operation--clickedNode's id is:" + clickedNode.id);
                    if(clickedNode.id == -1) {
                        toaster.pop({
                            type: 'error', title: '提示信息', body: "不能在根节点上添加部门", showCloseButton: true, timeout: 3000
                        });
                    } else{
                        $scope.addSubDept(clickedNode);
                    }

                }
            };
        }
        if(vm.deleteDept) {
            deleteDeptFunction = {
                "label": "删除", "action": function (obj) {

                    var inst = jQuery.jstree.reference(obj.reference);
                    var clickedNode = inst.get_node(obj.reference);
                    // alert("delete operation--clickedNode's id is:" + clickedNode.id);
                    if(clickedNode.id == -1) {
                        toaster.pop({
                            type: 'error', title: '提示信息', body: "不能删除根节点", showCloseButton: true, timeout: 3000
                        });
                    } else{
                        $scope.deleteDept(clickedNode);
                    }
                }
            }

        }

        if(vm.modifyDeptName) {
            updateDeptNameFunction = {
                "label": "修改部门名称", "action": function (obj) {
                    var inst = jQuery.jstree.reference(obj.reference);
                    var clickedNode = inst.get_node(obj.reference);
                    // alert("add operation--clickedNode's id is:" + clickedNode.id);
                    if(clickedNode.id == -1) {
                        toaster.pop({
                            type: 'error', title: '提示信息', body: "不能修改根节点", showCloseButton: true, timeout: 3000
                        });
                    } else{
                        $scope.updateDeptName(clickedNode);
                    }

                }
            };
        }


        $scope.treeConfig = {
            'version': 1, 'plugins': ['types', "contextmenu"], 'types': {
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

            }, "contextmenu": {
                "items": {
                    "create": createUserFunction, "add": addDeptFunction, "delete": deleteDeptFunction,"update":updateDeptNameFunction
                }
            }
        };

        init();

        $scope.roleList.unshift({'id': 0, 'roleName': "未选择"})


        $scope.dtInstance = {};

        $scope.dtOptions = DTOptionsBuilder
            .fromSource('')
            .withFnServerData(serverData)
            .withDataProp('data')
            .withOption('serverSide', true)
            .withOption('searching', false)
            .withOption('lengthChange', true)
            .withDOM('frtlip')
            .withOption('autoWidth', true)
            .withOption('scrollX', true)
            .withOption('lengthMenu', [10, 25, 50, 100, 200])
            .withOption('displayLength', 10)
            .withPaginationType('full_numbers')
            // .withOption('rowCallback', rowCallback)
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
            DTColumnBuilder.newColumn('id').withTitle('员工编号').renderWith(function actionsHtml(data, type, full, meta) {
            if(full.validity == 0) {
                data = '<span class="label label-danger">' + data + '(已禁用)</span>';
            }
            return data;
        }), 
            DTColumnBuilder.newColumn('employee_no').withTitle('工号'), 
            DTColumnBuilder.newColumn('mobile').withTitle('手机号码'), 
            DTColumnBuilder.newColumn('real_name').withTitle('姓名'), 
            DTColumnBuilder.newColumn('full_depart_name').withTitle('部门'), 
            DTColumnBuilder.newColumn('role_name').withTitle('角色'), 
            DTColumnBuilder.newColumn('login_times').withTitle('登录次数'), 
            DTColumnBuilder.newColumn('last_login_time').withTitle('登录时间').renderWith(timeHtml), 
            DTColumnBuilder.newColumn('lastlogin_ip').withTitle('登录IP'), 
            DTColumnBuilder.newColumn('last_modifypwd_time').withTitle('改密时间').renderWith(timeHtml), 
            DTColumnBuilder.newColumn(null).withTitle('操作').notSortable().withClass('text-center p-w-xxs-i')
            .withOption('width', '40px').renderWith(actionsHtml)];


        function rowCallback(row, data, dataIndex) {
            $('td', row).unbind('dblclick');
            $('td', row).bind('dblclick', function () {
                $scope.view(data);
            });
            return row;
        }

        function actionsHtml(data, type, full, meta) {
            var str = '<button class="btn btn-xs btn-info"  ng-click="view(vm.tableData[' + meta.row + '])">' + '    <span class="glyphicon glyphicon-th-large"></span>查看' + '</button>&nbsp;&nbsp;';

            if(data.validity == 1) {
                str += '<button  class="btn btn-xs btn-success"  ng-click="updateUser(' + meta.row + ')">' + '    <i class="fa fa-pencil-square-o">编辑</i>' + '</button>&nbsp;&nbsp;';

                str += '<button  class="btn btn-xs btn-warning"  ng-click="modifyPassword(' + meta.row + ')">' + '    <i class="fa fa-dot-circle-o">改密</i>' + '</button>&nbsp;&nbsp;';

                str += '<button  class="btn btn-xs btn-danger"  ng-click="disable(vm.tableData[' + meta.row + '])">' + '    <i class="fa fa-times">禁用</i>' + '</button>&nbsp;&nbsp;';

                str += '<button  class="btn btn-xs btn-white"  ng-click="changeDepartment(vm.tableData[' + meta.row + '])">' + '    <i class="fa fa-exchange">更换部门</i>' + '</button>&nbsp;&nbsp;';

            } else{
                str += '<button  class="btn btn-xs btn-warning"  ng-click="resume(vm.tableData[' + meta.row + '])">' + '    <i class="fa fa-recycle">恢复</i>' + '</button>&nbsp;&nbsp;';
            }
            return str;

        }

        $scope.view = function (rowObj) {

            return UserService.getDataAndopenUserModal($scope, $uibModal, rowObj, 3);
        };

        $scope.addUser = function (node) {

            if(node.id=='-1'){
                toaster.info({
                    type: 'error',
                    title: '提示信息',
                    body: "不能在根节点上添加用户",
                    showCloseButton: true,
                    timeout: 3000
                });
                return;
            }


            UserService.getRoleList().then(function successCallback(response) {
                if(response.data.code == 200) {
                    $scope.roleList = response.data.data
                }
            });
            return UserService.openAddUserModal($scope, $uibModal);

        }

        /**
         * 更换部门
         * @param row 行对象
         */
        $scope.changeDepartment = function (row) {
            var modalInstance = $uibModal.open({
                templateUrl: 'app/user-mgmt/modal/change-dept-modal.html?v=' + LG.appConfig.clientVersion,
                size: 'lg',
                keyboard: false,
                controller: 'ChangeUserDeptModalCtrl',
                resolve: {
                    data: function () {
                        return row;
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

        }

        $scope.modifyPassword = function (row) {
            var rowObj = vm.tableData[row];
            var opener = $scope;

            $uibModal.open({
                templateUrl: "app/user-mgmt/modal/modify-password-modal.html",
                keyboard: false,
                controller: function ($scope, $uibModalInstance, toaster) {
                    $scope.userId = rowObj["id"]
                    $scope.newPassword = ''

                    $scope.cancel = function () {
                        $uibModalInstance.dismiss('cancel');
                    };

                    $scope.ok = function () {
                        $scope.okBtnDisabled = true;
                        UserService.modifyPasword($scope.userId, $scope.newPassword)
                            .then(function successCallback(response) {
                                toaster.pop({
                                    type: response.data.code == 200 ? 'success' : 'error',
                                    title: '修改密码',
                                    body: response.data.message,
                                    showCloseButton: true,
                                    timeout: 5000
                                });
                                if(response.data.code == 200) {
                                    opener.dtInstance.reloadData();
                                }
                            })
                            .finally(function () {
                                $uibModalInstance.close();
                                $scope.okBtnDisabled = false;
                            });
                    };
                },
                windowClass: 'animated bounceIn'
            });

        }

        $scope.updateUser = function (row) {
            var rowObj = vm.tableData[row];
            UserService.getRoleList().then(function successCallback(response) {
                if(response.data.code == 200) {
                    $scope.roleList = response.data.data;
                }
            });
            return UserService.openUpdateUserModal($scope, $uibModal, rowObj);
        };

        /**
         * 新增大区
         */
        $scope.addRootDept = function () {
            return UserService.openAddDeptModal($scope, $uibModal, {"id": 0, "deptName": ""});
        }

        /**
         * 新增部门
         */
        $scope.addSubDept = function (data) {
            if(data.id == "-1") {
                return $scope.addRootDept();
            } else{
                return UserService.openAddDeptModal($scope, $uibModal, {"id": data.id, "deptName": data.text});
            }
        }

        /**
         * 删除部门
         * @param data
         * @returns {*}
         */
        $scope.deleteDept = function (data) {
            return UserService.deleteDepartment($scope, data);

        }

        $scope.disable = function (rowObj) {

            UserService.disableUser($scope, rowObj);
        };


        $scope.resume = function (rowObj) {
            UserService.resumeUser($scope, rowObj);
        };


        $scope.updateDeptName = function(data){

            var modalInstance = $uibModal.open(
                {
                    templateUrl: 'app/user-mgmt/modal/modify-deptName-modal.html?v=' + LG.appConfig.clientVersion,
                    keyboard: false,
                    controller: function ($scope, $uibModal,$uibModalInstance,$compile, UserService, toaster,deptId) {

                        $scope.modal = {};
                        $scope.modal.newDeptName = "";

                        $scope.ok = function () {
                            UserService.updateDeptName(deptId,$scope.modal.newDeptName).then(
                                function successCallback(response) {
                                    toaster.pop(
                                        {
                                            type: response.data.code== 200? 'success': 'error',
                                            title: '操作提示',
                                            body: response.data.message,
                                            showCloseButton: true,
                                            timeout: 5000
                                        });

                                }).finally(function () {
                                $uibModalInstance.close();
                            });
                        };

                        $scope.cancel = function () {
                            $uibModalInstance.dismiss('cancel');
                        };
                    },
                    resolve: {
                        deptId: function () {
                            return data.id
                        }
                    }
                });

            modalInstance.result.then(function (result) {
                UserService.loadDeptTree($scope);
                $scope.dtInstance.reloadData(function () {
                }, false);
            }, function (reason) {
            });



        };


        $scope.tabQuery = function (event) {

            setTimeout(function () {
                var ele = $(event.target);
                var dataFilter = ele.closest('li').attr("data-filter");
                if(isNullOrEmpty(dataFilter)) {
                    vm.tabFilter = [];
                } else{
                    vm.tabFilter = JSON.parse(decodeURIComponent(dataFilter));
                }
                $scope.submit();
            }, 200);
        }

        function serverData(sSource, aoData, fnCallback, oSettings) {
            var draw = aoData[0].value;
            var sortColumn = $scope.dtColumns[parseInt(aoData[2].value[0].column)].mData;
            var sortDir = aoData[2].value[0].dir;
            var start = aoData[3].value;
            var limit = aoData[4].value;
            var searchValue = aoData[5].value.value;
            var searchRegex = aoData[5].value.regex;


            var form = $(oSettings.nTableWrapper).closest('#gridcontroller').find('form');
            var queryConditionObject = getQueryParams(form, vm.tabFilter);
            var selectedDepartment = $scope.treeInstance.jstree(true).get_selected();
            //将选择的部门代入条件
            if(selectedDepartment != null && selectedDepartment.length > 0) {
                if(selectedDepartment[0] != '-1') {
                    var rule = {"field": "departmentId", "op": "equal", "value": selectedDepartment[0]};
                    queryConditionObject.rules.push(rule);
                }
            }

            var where = JSON.stringify(queryConditionObject);

            return UserService.query(draw, sortColumn, sortDir, start, limit, where).then(function (resp) {
                fnCallback(resp.data);
                vm.tableData = resp.data.data;
                vm.deptFilterMessage = resp.data.extendData.message;//部门筛选条件
                vm.dataPrivilegeMessage = resp.data.extendData.dataPrivilegeMessage;//数据权限

            }).finally(function () {
                $scope.queryBtnDisabled = false;
            });
        }

        $scope.submit = function () {
            $scope.queryBtnDisabled = true;
            $scope.dtInstance.reloadData();
        };

        /**
         * 选择一个树节点
         */
        $scope.selectTreeNode = function (nodedata) {

            $scope.submit();

        }

    }

    angular
        .module('app.user-mgmt')
        .controller('UserMgmtCtrl', UserMgmtCtrl);
})();