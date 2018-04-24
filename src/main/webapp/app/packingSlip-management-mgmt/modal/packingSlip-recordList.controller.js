/**
 *
 *
 */

(function () {

    'use strict';

    recordListCtrl.$inject = ['$scope', '$uibModal', '$uibModalInstance', 'packingSlipMgmtService','pageModel','demandId'];

    function recordListCtrl($scope, $uibModal, $uibModalInstance, packingSlipMgmtService,pageModel,demandId) {
        var vm = this;
        $scope.dynamicList = [];
        $scope.dynamicList = pageModel.list;
        $scope.hasMore = pageModel.hasMore;
        vm.pageNo = 2;
        $scope.demandId = demandId;

        $scope.loadNextPage = function () {
            packingSlipMgmtService.getRecordList(demandId,vm.pageNo).then(function successCallback(response) {
                $scope.dynamicList= $scope.dynamicList.concat(response.data.data.list);
                $scope.hasMore = response.data.data.hasMore;
                vm.pageNo++;
            })
        }

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        }
    }


    angular
        .module('app.packing-slip-management')
        .controller('recordListCtrl', recordListCtrl);

})();