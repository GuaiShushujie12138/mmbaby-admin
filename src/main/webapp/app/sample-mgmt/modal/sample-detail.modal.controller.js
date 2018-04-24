/**
 * trade-detail-modal.controller
 */
(function () {

  'use strict';

  SampleDetailModalCtrl.$inject =
      ['$scope', '$uibModal', '$uibModalInstance', '$compile',
        'sampleMgmtService', 'toaster', 'rowObj','$state'];


  SampleDetailCtrlForRoute.$inject =
      ['$scope', '$compile','$uibModal',
        'sampleMgmtService', 'toaster','$state','$stateParams'];

  function SampleDetailModalCtrl($scope, $uibModal,$uibModalInstance ,$compile,sampleMgmtService,toaster,rowObj,$state) {
    SampleDetailInnerModalCtrl($scope, $uibModal, $uibModalInstance, $compile, sampleMgmtService, toaster, rowObj,$state);
  }

  function SampleDetailCtrlForRoute($scope,$compile,$uibModal,sampleMgmtService,toaster,$state,$stateParams) {
    var sampleId = null;
    if($stateParams){
      sampleId = $stateParams.sampleId;
    }
    SampleDetailInnerModalCtrl($scope, $uibModal, null, $compile,sampleMgmtService,null,sampleId,$state);
  }


  function SampleDetailInnerModalCtrl($scope, $uibModal, $uibModalInstance,
      $compile, sampleMgmtService, toaster, rowObj,$state) {
    var vm = $scope;

    $scope.tradeModal = {};

    if (typeof rowObj === 'object') {
      $scope.rowObj = rowObj;
    } else {
      $scope.rowObj = {sampleId: rowObj}
    }
    $scope.sampleDetail = {};

    vm.modal = {};
    $scope.spuName = '';
    $scope.phoneNumber = '';

    initSampleData();

    function initSampleData() {
      detailInfo();
    }

    function detailInfo() {
      var sampleId = $scope.rowObj.sampleId;
      sampleMgmtService.getSampleDetail(sampleId).then(function callBack(resp) {
        if (resp.data.code == 200) {
          $scope.sampleDetail = resp.data.data.sampleDetail;
          $scope.picList = $scope.sampleDetail.colorStandImgList;
          // vm.userTransferImgUrl = $sce.trustAsHtml(
          //     buildPictureUrl($scope.sampleDetail.itemPicList,
          //         '?x-oss-process=style/p_w_200'));

          var itemId = $scope.sampleDetail.itemId;
          if(itemId) {
            if (itemId > 0) {
              //itemId = 121467094;
              sampleMgmtService.getSpuName(itemId)
                .then(function (resp) {
                  var data = resp.data.data;
                  if(data){
                    $scope.spuName = data.spuName;
                  }

                });

            }
          }

          if(isNaN($scope.sampleDetail.shopId)){
            console.error("shopId 不是数字");
            return ;
          }else {

            sampleMgmtService.getLSUserInfo($scope.sampleDetail.shopId).then(
                function (resp) {
                  if (resp.data.code != 200) {
                    console.error("获取用户信息失败！" + resp.data.message);
                    return;
                  }
                  var data= resp.data.data;
                  if(data == null || data.LSUser == null){
                    console.error("获取用户信息失败,data中用户为空！" + resp.data.message);
                    return ;
                  }

                  $scope.phoneNumber = data.LSUser.mobile;
                });
          }
        }
      });



    };
    
    $scope.jumpToDemandList = function () {
      $state.go('DEMAND-MGMT.QUERY',
          {demandIdStr : $scope.sampleDetail.lastDemandId}
      );
      $uibModalInstance.dismiss('cancel');

    };
    
    $scope.queryLog = function (operateType) {
      var modalInstance = $uibModal.open({

        templateUrl: 'app/sample-mgmt/modal/sample-log.html?v=' + LG.appConfig.clientVersion,
        windowClass: 'large-Modal',
        keyboard: false,
        controller: 'SampleLogModalCtrl',
        resolve: {
          sampleId: function () {
            return $scope.rowObj.sampleId;
          },
          operateType : function () {
            return operateType;
          }
        }
      });
    };

    $scope.cancel = function () {
      if (typeof rowObj === 'object') {
        $uibModalInstance.dismiss('cancel');
      } else {
        window.close()
      }
    };

  }

  angular
  .module('app.sample-mgmt')
  .controller('SampleDetailModalCtrl', SampleDetailModalCtrl);

  angular
      .module('app.sample-mgmt')
      .controller('SampleDetailCtrlForRoute', SampleDetailCtrlForRoute);

})();