/**
 *
 *buyer-dispatch-modal.controller.js
 */

(function () {

    'use strict';

    SampleHistoryCtl.$inject = ['$scope', '$uibModal', '$uibModalInstance', 'sampleMgmtService','pageModel','sampleCode'];

    function SampleHistoryCtl($scope, $uibModal, $uibModalInstance, sampleMgmtService,pageModel,sampleCode) {
        var vm = this;
        $scope.dynamicList = [];
        $scope.dynamicList = pageModel.list;
        $scope.hasMore = pageModel.hasMore;
        vm.pageNo = 2;
        $scope.sampleCode = sampleCode;

        $scope.loadNextPage = function () {
        	sampleMgmtService.getHistory(sampleCode,vm.pageNo).then(function successCallback(response) {
                $scope.dynamicList= $scope.dynamicList.concat(response.data.data.list);
                console.log($scope.dynamicList)
                $scope.hasMore = response.data.data.hasMore;
                vm.pageNo++;
            })
        }

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        }
    }


    angular
        .module('app.sample-mgmt')
        .controller('SampleHistoryCtl', SampleHistoryCtl);

})();