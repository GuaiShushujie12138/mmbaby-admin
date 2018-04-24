(function () {

    'use strict';

    updateUserCtrl.$inject = ['$scope','$uibModal', '$uibModalInstance',
      'toaster', 'opener', 'data', 'UserService'];

    function updateUserCtrl($scope,$uibModal,$uibModalInstance, toaster, opener,
        data, UserService) {

      $scope.modal = {};
        $scope.modalEmployeeNo = data["employee_no"];
        $scope.modalRealName = data["real_name"];
        $scope.modalMobile = data["mobile"];
        $scope.modalPassword = '******';
        $scope.modalEmail = data["email"];
        $scope.modalUserId = data["id"];
        $scope.deptName = data["full_depart_name"];
        $scope.isNeedResetPassword=data["is_need_reset_pwd"];
        $scope.userRemark=data["remark"];
        $scope.modal.salesAreaId = data.sales_area_id;
        $scope.roles = []
        for (var index = 0; index < opener.roleList.length; ++index) {
            var role = opener.roleList[index]
            $scope.roles.push({'key': role.id, 'value': role.roleName})
        }

        $scope.roles.push({'key': 0, 'value': "未选择"})

        $scope.roleId = data["user_role_id"]
        $scope.ok = function () {

            var isEmpty = UserService.isEmpty
            if(isEmpty($scope.modalRealName)){
                toaster.pop({
                    type: 'error',
                    title: "提示信息",
                    body: "用户名不能为空并且用户名长度应在3~20个字符内",
                    showCloseButton: true,
                    timeout: 5000
                });
                return;
            }

            if($scope.roleId <= 0 || $scope.roleId == undefined){
                toaster.pop({
                    type: 'error',
                    title: "提示信息",
                    body: "请选择角色",
                    showCloseButton: true,
                    timeout: 5000
                });
                return ;
            }

          if (!!!$scope.modal.salesAreaId) {
            $scope.modal.salesAreaId = 0;
          }

            $scope.okBtnDisabled = true;

            UserService.updateUser($scope.modalUserId, $scope.modalEmployeeNo,
                $scope.modalRealName, $scope.modalMobile,$scope.modalPassword,
                $scope.modalEmail, $scope.roleId,$scope.isNeedResetPassword,
                $scope.userRemark,$scope.modal.salesAreaId).then(function successCallback(response) {
                toaster.pop({
                    type: response.data.code == 200 ? 'success' : 'error',
                    title: "提示信息",
                    body: response.data.message,
                    showCloseButton: true,
                    timeout: 5000
                });
                if(response.data.code == 200) {
                    opener.dtInstance.reloadData();
                }
            }).finally(function () {
                $uibModalInstance.close();
                $scope.okBtnDisabled = false;
            });

        }

      initData();
      function initData() {
        listSalesAreaList();
      }

      function listSalesAreaList() {
        UserService.listSalesAreaList().then(function call(resp) {
          if (resp.data.code == 200) {
            $scope.salesAreaList = resp.data.data.salesAreaList;
          }
        });
      }

      $scope.addSalesArea = function() {
        var modalInstance = $uibModal.open({
          templateUrl: 'app/user-mgmt/modal/add-sales-area.html?v=' + LG.appConfig.clientVersion,
          keyboard: false,
          size : 'md',
          controller: 'AddSalesAreaModalCtrl'
        });

        modalInstance.result.then(function (result) {
          listSalesAreaList();
          console.log('新增结束');

        }, function (reason) {
        });

      }

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        }

    }

    angular
        .module('app.user-mgmt')
        .controller('updateUserCtrl', updateUserCtrl);
})();