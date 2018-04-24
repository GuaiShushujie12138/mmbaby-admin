(function () {

    'use strict';

    addUserCtrl.$inject = ['$scope', '$uibModalInstance','$uibModal', 'toaster', 'opener', 'data', 'UserService'];

    function addUserCtrl($scope, $uibModalInstance,$uibModal, toaster, opener, data, UserService) {


        $scope.roles = [];
        for (var index = 0; index < opener.roleList.length; ++index) {
            var role = opener.roleList[index]
            $scope.roles.push({'key': role.id, 'value': role.roleName})
        }

        $scope.roles.push({'key': 0, 'value': "未选择"})

        $scope.modal = {};
        $scope.roleId = 0
        $scope.modalRealName = ''
        $scope.modalEmployeeNo = ''
        $scope.modalMobile = ''
        $scope.modalPassword = ''
        $scope.modalEmail = ''
        $scope.deptName = opener.deptName;
        $scope.userRemark='';
        $scope.salesAreaList = [];

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
        
        $scope.ok = function () {

            var isEmpty = UserService.isEmpty

            if(isEmpty($scope.modalEmployeeNo)){
                toaster.pop({
                    type: 'error',
                    title: "提示信息",
                    body: "工号不能为空并且工号长度应在3~20个字符内",
                    showCloseButton: true,
                    timeout: 5000
                });
                return ;
            }


            if(isEmpty($scope.modalRealName)){
                toaster.pop({
                    type: 'error',
                    title: "提示信息",
                    body: "用户名不能为空并且用户名长度应在3~20个字符内",
                    showCloseButton: true,
                    timeout: 5000
                });
                return ;
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
            UserService.addUser($scope.modalEmployeeNo, $scope.modalRealName,
                $scope.modalMobile, $scope.modalPassword, $scope.modalEmail,
                $scope.roleId, opener.deptId,$scope.userRemark,
                $scope.modal.salesAreaId).then(function successCallback(response) {
                toaster.pop({
                    type: response.data.code == 200 ? 'success' : 'error',
                    title: "提示信息",
                    body: response.data.message,
                    showCloseButton: true,
                    timeout: 5000
                });
                if(response.data.code == 200) {
                    opener.dtInstance.reloadData();
                    $uibModalInstance.close();
                }
            }).finally(function () {

                $scope.okBtnDisabled = false;
            });

        }

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        }

    }

    angular
        .module('app.user-mgmt')
        .controller('addUserCtrl', addUserCtrl);
})();