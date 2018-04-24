/**
 *
 *buyer-dispatch-modal.controller.js
 */

(function () {

    'use strict';

    slipSelectBuyerSellerIdCtrl.$inject = ['$scope', '$uibModal','toaster', '$uibModalInstance', 'packingSlipMgmtService','Identity','opener','id'];

    function slipSelectBuyerSellerIdCtrl($scope, $uibModal,toaster ,$uibModalInstance, packingSlipMgmtService,Identity,opener,id) {
        var vm = this;

        // 由身份决定选择需求单发起人还是跟进人madan
        if (Identity === 1) {
            $scope.title = '选择询价单发起人';
        } else {
            $scope.title = '选择码单发起人';
        }

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
        }

        $scope.readyCB = function() {
            if ($scope.treeInstance) {
                $scope.treeInstance.jstree(true).select_node(id);
            }
        }


        packingSlipMgmtService.queryDeptTree().then(function (resp) {
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
        }, function () {

        });

        // 点击确定按钮时
        var treeTypes=[];
        var names=[];
        var lastSelectedId=[];
        $scope.ok = function() {
            var selectedId = $scope.treeInstance.jstree(true).get_selected();
            for(var i=0;i<selectedId.length;i++){
                if($scope.treeInstance.jstree(true).get_json(selectedId[i])['a_attr'].treeType!=10){
                    lastSelectedId.push(selectedId[i])
                    names.push($scope.treeInstance.jstree(true).get_json(selectedId[i]).text)
                }
            }
            console.log(lastSelectedId);
            console.log(names);
            var treeType = treeTypes ;
            var name = names;

            if (Identity === 1) {
                opener.afterSelectCrmBuyer(lastSelectedId.toString(),treeType,name);
            } else if (Identity === 2) {
                opener.afterSelectCrmSeller(lastSelectedId.toString(),treeType,name);
            }
            $uibModalInstance.dismiss('cancel');
        }

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        }
    }


    angular
        .module('app.packing-slip-management')
        .controller('slipSelectBuyerSellerIdCtrl', slipSelectBuyerSellerIdCtrl);

})();