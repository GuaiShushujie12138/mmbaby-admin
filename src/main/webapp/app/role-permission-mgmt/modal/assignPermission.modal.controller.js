/**
 * assignPermission.modal.controller.js
 * boris
 * 2016-09-25
 */

(function () {

    'use strict';

    AssignPermissionCtrl.$inject = ['$scope', '$timeout', '$http', '$uibModal', '$uibModalInstance', '$filter', '$compile', 'toaster', 'rolePermissionMgmtService', 'DTOptionsBuilder', 'DTColumnBuilder', 'rowObj'];


    function AssignPermissionCtrl($scope, $timeout, $http, $uibModal, $uibModalInstance, $filter, $compile, toaster, rolePermissionMgmtService, DTOptionsBuilder, DTColumnBuilder, rowObj) {
        var vm = this;

        $scope.rowObj = rowObj;

        $scope.treeData = [];
        //init();


        $scope.treeConfig = {
            'version': 1,
            'plugins': ['types', "checkbox", "contextmenu"],
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

            rolePermissionMgmtService.getRolePrivilegesTree(rowObj.id)
                .then(function (resp) {
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

        $scope.ok = function () {
            $scope.okBtnDisabled = true;

            //获取所有的选择项
            var selectedPermissions = $scope.treeInstance.jstree(true).get_selected();
            rolePermissionMgmtService.assignPermission(rowObj.id, selectedPermissions)
                .then(function (resp) {
                    if (resp.data.code == 200) {

                        toaster.pop({
                            type: 'info',
                            title: '提示信息',
                            body: '权限分配成功!',
                            showCloseButton: true,
                            timeout: 5000
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
                }).finally(
                function () {
                    $uibModalInstance.close();
                    $scope.okBtnDisabled = false;
                }
            );


        }


        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    }


    angular
        .module('app.role-permission-mgmt')
        .controller('AssignPermissionCtrl', AssignPermissionCtrl)

})();