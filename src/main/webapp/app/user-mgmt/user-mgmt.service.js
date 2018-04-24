(function () {
'use strict';

UserService.$inject = ['$http', '$rootScope', 'SweetAlert', 'toaster'];

function UserService($http, $rootScope, SweetAlert, toaster) {
    return {
        query: query,
        getTop20Role: getTop20Role,
        disableUser: disableUser,
        resumeUser: resumeUser,
        getUserInfo: getUserInfo,
        getDataAndopenUserModal: getDataAndopenUserModal,
        openUserModal: openUserModal,
        openAddUserModal: openAddUserModal,
        queryUserLog: queryUserLog,
        loadDeptTree: loadDeptTree,
        addUser: addUser,
        updateUser:updateUser,
        openUpdateUserModal: openUpdateUserModal,
        modifyPasword: modifyPasword,
        getRoleList:getRoleList,
        openAddDeptModal: openAddDeptModal,
        deleteDepartment: deleteDepartment,
        saveDept:saveDept,
        getDept:getDept,
        showDeptTree:showDeptTree,
        showTip:showTip,
        changeUserDept:changeUserDept,
        isEmpty:isEmpty,
        updateDeptName:updateDeptName,
        listSalesAreaList :listSalesAreaList,
        addLscrmSalesArea : addLscrmSalesArea,
        showErrorMessage : showErrorMessage,
        customerList4TransferDepartment: customerList4TransferDepartment

    };

    function addLscrmSalesArea(salesAreaName) {
      var url = '/web/user/addLscrmSalesArea?salesAreaName='+salesAreaName;
      return $http({
        url: url,
        method: 'GET'
      });
    }
    
    function listSalesAreaList() {
      var url = '/web/user/listUserSalesArea';
      return $http({
        url: url,
        method: 'GET'
      });
    }

  function showErrorMessage(msg) {
    toaster.pop({
      type:  'error',
      title:  '错误信息',
      body: msg,
      showCloseButton: true,
      timeout: 5000
    });
    return false;

  }
    
    /**
     *修改用户部门
     */
    function changeUserDept(userId,newDeptId,allowFetchData) {
        var url = '/web/user/changeDepartment/'+userId+'/'+newDeptId+'/'+allowFetchData
        return $http({
            url: url,
            method: 'GET'
        });
    }

    function showTip(type,message) {
        toaster.pop({
            type: type,
            title: "提示信息",
            body:message,
            showCloseButton: true,
            timeout: 5000
        });
    }

    function query(draw, sortColumn, sortDir, start, limit, where) {
        return $http.post('web/user/query', {
            draw: draw, sortColumn: sortColumn, sortDir: sortDir, start: start, limit: limit, where: where
        });
    }

    function addUser(employeeNo, userName, mobile, password, email,
        modalUserRole, modalUserDepartment,userRemark,salesAreaId) {
       return $http.post("/web/user/add", {
            employeeNo: employeeNo,
            realName: userName,
            mobile: mobile,
            userPassword: password,
            email: email,
            userRoleId: modalUserRole,
            departmentId: modalUserDepartment,
            remark:userRemark,
            salesAreaId : salesAreaId
        })

    }

    function updateUser(userId, employeeNo, userName, mobile, password, email,
        modalUserRole,isNeedResetPassword,userRemark,salesAreaId) {
        isNeedResetPassword=ifn(isNeedResetPassword,0);
        return $http.post("/web/user/update", {
            id: userId,
            employeeNo: employeeNo,
            realName: userName,
            mobile: mobile,
            userPassword: password,
            email: email,
            userRoleId: modalUserRole,
            isNeedResetPwd:isNeedResetPassword,
            remark:userRemark,
          salesAreaId : salesAreaId
        })

    }


    function queryUserLog(draw, sortColumn, sortDir, start, limit, userId) {

        var url = '/web/user/queryUserLogsByUserId?userId=' + userId + '&start=' + start + "&limit=" + limit + "&draw=" + draw;
        return $http({
            url: url,
            method: 'GET'
        });
    }

    function openUserModal($scope, $uibModal, data, templateUrl, controller) {

        var modalInstance = $uibModal.open({
            templateUrl: templateUrl,
            keyboard: false,
            controller: controller,
            resolve: {
                data: function () {
                    return data;
                }, opener: function () {
                    return $scope
                }
            }
        });
    }

    /**
     * 打开新增部门的modal
     * @param $uibModal
     * @param data
     */
    function openAddDeptModal($scope,$uibModal, data) {
        var modalInstance = $uibModal.open({
            templateUrl: 'app/user-mgmt/modal/add-dept-modal.html',
            keyboard: false,
            controller: 'AddDeptModalCtrl',
            resolve: {
                data: function () {
                    return data;
                }
            }
        });

        modalInstance.result.then(function () {
            loadDeptTree($scope);
            $scope.dtInstance.reloadData();
        }, function () {
        });
    }

    /**
     * 保存部门
     * @param parentId
     * @param deptName
     */
    function saveDept($scope, parentId, deptName) {

        return $http.post('/web/dept/addDept',
            {
                "parentId": parentId,
                "deptName": deptName
            }
        );

    }

    /**
     * 删除部门
     * @param $scope
     * @param data
     */
    function deleteDepartment($scope, data) {
        SweetAlert.swal({
                title: "是否删除此部门?",
                text: "请先确认当前部门下是否有员工,如有员工,请先手工将部门转移到新的部门",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "确认禁用",
                cancelButtonText: "取消",
                closeOnConfirm: false,
                closeOnCancel: true
            },
            function (isConfirm) {
                if (isConfirm) {

                    $http({
                        url: '/web/dept/delete/' + data.id,
                        method: 'GET'
                    }).then(function (resp) {
                        if (resp.data.code == 200) {
                            SweetAlert.swal("提示信息", "部门删除成功!", "success");
                            // $scope.dtInstance.reloadData(function () {
                            // }, false);
                            loadDeptTree($scope);
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

                } else {

                    toaster.pop({
                        type: 'info',
                        title: '提示信息',
                        body: "您中止了操作",
                        showCloseButton: true,
                        timeout: 5000
                    });
                }
            });
        return;
    }


    /**
     * 打开新增模态框
     * @param $uibModal
     * @returns {*}
     */
    function openAddUserModal($scope, $uibModal) {
        var viewType = decideModalControllerAndTemplate(1);//新增
        var templateUrl = viewType.templateUrl;
        var controller = viewType.controller;

        var department = $scope.treeInstance.jstree(true).get_selected();

        var deptId = 0
        if(!isEmpty(department)) {
            deptId = parseInt(department[0])
        }
        $scope.deptId = deptId
        getDept(deptId).then(function (resp) {

            $scope.deptName = resp.data.data.fullName
            if(resp.data.code == 200) {
                return openUserModal($scope, $uibModal, {}, templateUrl, controller);
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

    /**
     * 打开编辑模态框
     * @param $scope
     * @param $uibModal
     * @returns {*}
     */
    function openUpdateUserModal($scope, $uibModal, rowObject) {
        var viewType = decideModalControllerAndTemplate(2);//编辑
        var templateUrl = viewType.templateUrl;
        var controller = viewType.controller;

        return openUserModal($scope, $uibModal, rowObject, templateUrl, controller);
    }

    /**
     * 决定用户打开的controller和templateurl
     * @param editType
     */
    function decideModalControllerAndTemplate(editType) {
        var templateUrl = 'app/user-mgmt/modal/view-user-modal.html';
        var controller = 'ViewUserInfoDetailCtrl';
        switch (editType) {
            case 1:
                templateUrl = 'app/user-mgmt/modal/add-user-modal.html';
                controller = 'addUserCtrl';
                break;
            case 2:
                templateUrl = 'app/user-mgmt/modal/update-user-modal.html';
                controller = 'updateUserCtrl';
                break;
            case 3:
                templateUrl = 'app/user-mgmt/modal/view-user-modal.html';
                controller = 'ViewUserInfoDetailCtrl';
                break;
            default:
                break;
        }
        return {
            "templateUrl": templateUrl,
            "controller": controller
        };
    }

    /**
     * 打开修改和查看用户模态框
     * @param $scope
     * @param $uibModal
     * @param rowObj
     * @param editType 1.新增 2修改 3.查看
     */
    function getDataAndopenUserModal($scope, $uibModal, rowObj, editType) {
        var viewType = decideModalControllerAndTemplate(editType);
        var templateUrl = viewType.templateUrl;
        var controller = viewType.controller;

        // 获取数据
        getUserInfo($scope, rowObj.id)
            .then(function (resp) {
                if(resp.data.code == 200) {

                    var modalInstance = $uibModal.open({
                        templateUrl: templateUrl,
                        keyboard: false,
                        windowClass:"large-Modal",
                        controller: controller,
                        resolve: {
                            data: function () {
                                return rowObj;
                            }, opener: function () {
                                return $scope
                            }
                        }
                    });

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

    function getUserInfo($scope, userId) {
        return $http({
            url: '/web/user/viewDetail/' + userId,
            method: 'GET'
        });


    }

    /**
     * 获取部门数据
     * @param roleId
     */
    function loadDeptTree($scope) {
        return $http({
            url: '/web/dept/loadDeptTree',
            method: 'GET'
        }).then(function (resp) {
                if (resp.data.code == 200) {
                    $scope.treeData = resp.data.data;
                    //重绘
                    $scope.treeConfig.version++;
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

    function getTop20Role() {
        return $http.post('web/rolePermission/getTop20Role', {}
        );
    }

    function showDeptTree($scope,$uibModal,$uibModalInstance){
        var modalInstance = $uibModal.open({
            templateUrl: 'app/user-mgmt/modal/show-dept-tree-modal.html',
            keyboard: false,
            windowClass: "large-Modal",
            controller: function ($scope, $uibModalInstance,UserService) {

                $scope.treeData = [];
                $scope.treeInstance = {};


                $scope.treeConfig = {
                    'version': 1,
                    'plugins': ['types'],
                    'types': {
                        'default': {
                            'icon': 'fa fa-folder'
                        }, 'html': {
                            'icon': 'fa fa-file-code-o'
                        }
                    }
                };

                UserService.loadDeptTree($scope);

                $scope.cancel = function () {
                    $uibModalInstance.dismiss('cancel');
                };

                $scope.ok = function () {
                    $scope.okBtnDisabled = true;
                    var ref = $scope.treeInstance.jstree(true);
                    var selectDeptId=ref.get_selected();
                    if(ifn(selectDeptId,0)==0 ||  selectDeptId=='-1'){
                        toaster.pop({
                            type:  'error',
                            title: '出错啦',
                            body: '请选择部门,不能是根节点(链尚网)',
                            showCloseButton: true,
                            timeout: 5000
                        });
                    }else {
                        var nodeInfo=ref.get_node(selectDeptId);
                        $uibModalInstance.close(nodeInfo);
                    }

                };
            }
        });

        modalInstance.result.then(function(result) {
            //点击确认返回
            $scope.newDepartmentName=result.text;
            $scope.newDepartmentId=result.id;
        }, function(reason) {
            //点击取消返回
            console.log(reason);
            $log.info('Modal dismissed at: ' + new Date());
        });

    }

    function resumeUser($scope, rowObj) {
        SweetAlert.swal({
                title: "是否恢复此用户?",
                text: "是否恢复此用户?",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "确认恢复",
                cancelButtonText: "取消",
                closeOnConfirm: false,
                closeOnCancel: true
            },
            function (isConfirm) {
                if (isConfirm) {

                    $http({
                        url: '/web/user/resume/' + rowObj.id,
                        method: 'GET'
                    }).then(function (resp) {
                        if (resp.data.code == 200) {
                            SweetAlert.swal("恢复成功", "用户恢复成功!", "success");
                            $scope.dtInstance.reloadData(function () {
                            }, false);
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

                } else {

                    toaster.pop({
                        type: 'info',
                        title: '提示信息',
                        body: "您中止了操作",
                        showCloseButton: true,
                        timeout: 5000
                    });
                }
            });
        return;
    }

    function disableUser($scope, rowObj) {

        SweetAlert.swal({
                title: "是否禁用此用户?",
                text: "禁用后,此帐号将不能登录CRM+后台和APP",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "确认禁用",
                cancelButtonText: "取消",
                closeOnConfirm: false,
                closeOnCancel: true
            },
            function (isConfirm) {
                if (isConfirm) {

                    $http({
                        url: '/web/user/disable/' + rowObj.id,
                        method: 'GET'
                    }).then(function (resp) {
                        if (resp.data.code == 200) {
                            SweetAlert.swal("禁用成功", "用户禁用成功!", "success");
                            $scope.dtInstance.reloadData(function () {
                            }, false);
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

                } else {

                    toaster.pop({
                        type: 'info',
                        title: '提示信息',
                        body: "您中止了操作",
                        showCloseButton: true,
                        timeout: 5000
                    });
                }
            });
        return;
    }

    /**
     * 修改密码
     * @param userId
     * @param newPassword
     * @returns {*}
     */
    function modifyPasword(userId,newPassword) {
        return $http.post("web/user/modifyPassword", {
            userId: userId,
            newPassword: newPassword
        })

    }


    /**
     * 获取角色下拉列表
     * @returns {*}
     */

    function getRoleList(){
        return $http.get("/web/rolePermission/getRoleList")
    }

    /**
     * 获取选中部门
     * @param deptId
     */
    function getDept(deptId) {
       return $http.post("/web/user/getDept?deptId="+deptId)
    }

    function isEmpty(obj) {
        for (var name in obj)
        {
            return false;
        }
        return true;
    }

    function updateDeptName(deptId, deptName) {

        return $http.post("/web/dept/updateDeptName?deptId="+deptId+"&deptName="+deptName);
    }

    function customerList4TransferDepartment(userId,transferType,pageNo,pageSize) {
        return $http.get('/web/customer/customerList4TransferDepartment?userId=' + userId + '&transferType=' + transferType + '&pageNo=' + pageNo+ '&pageSize=' + pageSize);
    }

}

angular
    .module('app.user-mgmt')
    .factory('UserService', UserService);
})();