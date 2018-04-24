/**
 * goods-modal.controller
 */
(function () {

    'use strict';

    DetailModalCtrl.$inject = ['$scope', '$uibModal', '$uibModalInstance', '$compile', 'demandMgmtService', 'toaster', 'rowObj', 'demandBean', 'domain', 'DTOptionsBuilder', 'DTColumnBuilder', 'itemDomain'];

    function DetailModalCtrl($scope, $uibModal, $uibModalInstance, $compile, demandMgmtService, toaster, rowObj, demandBean, domain, DTOptionsBuilder, DTColumnBuilder,itemDomain) {
        var vm = this;
        $scope.isNewDemand = rowObj.newMark;
        $scope.isFabric = demandBean.rootCategoryId == 1 ? true : false;
        $scope.demandId = rowObj.demandId;
        $scope.demandBean = demandBean;
        $scope.parentRowObj = rowObj;
        //$scope.picArr = demandBean.imgPathList.split(',');
        $scope.picArr = demandBean.imgPathList;
        $scope.sourceName = rowObj.sourceName;
        $scope.itemDomain = itemDomain;
        $scope.showCraftName = '';

        if($scope.demandBean.itemTypeName==='特殊工艺布') {
            if ($scope.demandBean.craft) {
                $scope.showCraftName = '\n特殊工艺:' + $scope.demandBean.craft;
            }
        }

        //alert(demandBean.imgPathList);
        //alert(imgPathList);
        //alert(imgPathList);
       /* if(imgPathList==null||imgPathList==""||imgPathList=="undefined"){
            $scope.picArr = "";
        }*/
        //else if(imgPathList.indexOf(",")>0){
            //$scope.picArr = demandBean.imgPathList.split(',');

     /*   }else{
            //$scope.picArr = demandBean.imgPathList[0];
            //alert($scope.picArr);


        }*/
        //alert($scope.picArr);
        //$scope.pic = demandBean.imgPathList;

        $scope.itemProps = demandBean.itemPropList;
        $scope.itemTags = demandBean.itemTags;
        $scope.pickCount = rowObj.pickUserCount;

        $scope.itemPropArr = [];
        $scope.domain = domain;
        var itemPropRow = [];

        var items = demandBean.itemPropList;
        for(var x = 0 ; x < items.length ; x++)
        {
            itemPropRow.push(items[x]);

            if(itemPropRow.length == 2 || x == items.length - 1)
            {
                $scope.itemPropArr.push(itemPropRow);
                itemPropRow = [];
            }
        }

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };

        $( '.swipebox' ).swipebox();
    }

    angular
        .module('app.demand-mgmt')
        .controller('DetailModalCtrl', DetailModalCtrl);

})();