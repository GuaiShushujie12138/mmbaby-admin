/**
 *
 *buyer-dispatch-modal.controller.js
 */

(function () {

    'use strict';

    DemandDynamicCtl.$inject = ['$scope', '$uibModal', '$uibModalInstance', 'demandMgmtService','pageModel','demandId'];

    function DemandDynamicCtl($scope, $uibModal, $uibModalInstance, demandMgmtService,pageModel,demandId) {
        var vm = this;
        $scope.dynamicList = [];
        $scope.dynamicList = pageModel.list;
        $scope.hasMore = pageModel.hasMore;
        vm.pageNo = 2;
        $scope.demandId = demandId;

        $scope.loadNextPage = function () {
            demandMgmtService.getDemandDynamicList(demandId,vm.pageNo).then(function successCallback(response) {
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
        .module('app.demand-mgmt')
        .controller('DemandDynamicCtl', DemandDynamicCtl);

})();