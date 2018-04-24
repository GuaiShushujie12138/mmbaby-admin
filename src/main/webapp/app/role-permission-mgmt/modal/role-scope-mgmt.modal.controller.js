/**
 */

(function () {

    'use strict';

    RoleMgmtScopeCtrl.$inject = ['$scope', '$uibModalInstance', 'roleList', 'tempScope'];


    function RoleMgmtScopeCtrl($scope, $uibModalInstance, roleList, tempScope) {
        $scope.modal = {};
        $scope.modal.roleList = roleList;

        function isEmpty(obj) {
            for (var name in obj) {
                return false;
            }
            return true;
        }

        function getRole(id) {
            for(var i = 0;i<=roleList.length;i++){
                if(roleList[i].id == id){}
                return roleList[i]
            }
            return null
        }

        $scope.selected = []

        $scope.selectedTags = [];

        var updateSelected = function (action, id, name) {
            if(action == 'add' && $scope.selected.indexOf(id) == -1) {
                $scope.selected.push(id);
                $scope.selectedTags.push(name);
            }
            if(action == 'remove' && $scope.selected.indexOf(id) != -1) {
                var idx = $scope.selected.indexOf(id);
                $scope.selected.splice(idx, 1);
                $scope.selectedTags.splice(idx, 1);
            }
        }

        $scope.updateSelection = function ($event, id) {
            var checkbox = $event.target;
            var action = (checkbox.checked ? 'add' : 'remove');
            updateSelected(action, id, checkbox.name);
        }

        $scope.isSelected = function (id) {
            return $scope.selected.indexOf(id) >= 0;
        }

        $scope.ok = function () {
            $scope.okBtnDisabled = true;
            if($scope.selectedTags.length != 0) {
                tempScope.remark = '包含（' + $scope.selectedTags.join() + '）'
                tempScope.roleMgmtIds = $scope.selected
                tempScope.isHas = true
            } else{
                tempScope.roleMgmtScope = 0
                tempScope.roleMgmtIds = []
                tempScope.isHas = false
            }
            $uibModalInstance.dismiss('cancel');
            $scope.okBtnDisabled = false;

        };

        $scope.cancel = function () {
            tempScope.roleMgmtScope = 0
            tempScope.isHas = false
            tempScope.roleMgmtIds = []
            $uibModalInstance.dismiss('cancel');
        };
    }


    angular
        .module('app.role-permission-mgmt')
        .controller('RoleMgmtScopeCtrl', RoleMgmtScopeCtrl)

})();