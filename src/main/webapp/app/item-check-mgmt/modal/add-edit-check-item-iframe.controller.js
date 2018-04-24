/**
 * Created by zhenyu on 2016/9/20.
 */

(function () {

    'use strict';

    addEditCheckItemIframeCtrl.$inject = ['$scope','$sce', '$http', '$uibModal', '$uibModalInstance', '$filter', '$compile', 'toaster','itemCheckMgmtService', 'jumpUrl','typeText','vm'];

    function addEditCheckItemIframeCtrl($scope, $sce, $http, $uibModal, $uibModalInstance, $filter, $compile, toaster,itemCheckMgmtService,jumpUrl,typeText,vm) {
        $scope.jumpUrl = $sce.trustAsResourceUrl(jumpUrl);
        $scope.typeText = typeText;
        var winH = $(window).height();
        var iframeHight = winH - 130;
        $scope.iframeStryle = 'height:' + iframeHight + 'px;width: 100%';
        $scope.cancel = function() {
            $uibModalInstance.dismiss('cancel');
        }


        window.addEventListener('message',function(e) {
            if (typeof e.data == 'object' && e.data.status == 'success') {
                // document.body.removeChild(document.getElementById('iframe'));
                $uibModalInstance.dismiss('cancel');
                // var a = successCancel;
                vm.cancelSuccess();
            }
        })
    }

    angular
        .module('app.item-check-mgmt')
        .controller('addEditCheckItemIframeCtrl', addEditCheckItemIframeCtrl)
})();