/**
 * sample-print-qr-modal.controller
 */
(function () {

  'use strict';

  PrintQrCodeModalCtrl.$inject =
      ['$scope', '$uibModalInstance','$uibModal','$compile','rowObj',
        'sampleMgmtService', 'toaster','isBatch','selectedSampleIds','$filter',
      '$sce'];

  function PrintQrCodeModalCtrl($scope, $uibModalInstance,$uibModal, $compile,
      rowObj,sampleMgmtService, toaster,isBatch,selectedSampleIds,$filter,
      $sce) {
    var vm = $scope;
    $scope.rowObj = rowObj;
    $scope.code = {};
    $scope.sampleIdList = [];
    $scope.sampleIdList = selectedSampleIds;
    $scope.whichCode = 1;
    // $scope.code.createTime = timeHtml(rowObj.createTime);

    initData();
    function initData() {
      sampleMgmtService.getSampleDetail($scope.sampleIdList[0])
      .then(function callback(resp) {
        if (resp.data.code == 200) {
          $scope.code = resp.data.data.sampleDetail;
          // $scope.beizhu = ($scope.code.itemSourceType === 16)? $scope.code.itemName : (demandId==0?"":$scope.code.demandId);
        }
      });
      sampleMgmtService.getQrCode($scope.sampleIdList[0])
      .then(function callback(resp) {
        if (resp.data.code == 200) {
          $scope.code.qrUrl = resp.data.data.qrUrl;
          $scope.qrUrl = resp.data.data.qrUrl;
          $scope.printUrl = resp.data.data.printUrl;
        }
      });
    }

    function timeHtml(data, type, full, meta) {

      if (data == null || data == '') {
        return "";
      }

      return $filter('date')(data,'yyyy-MM-dd HH:mm:ss');
    }

    $scope.ok = function () {
      $scope.code.sendType = 0;//后期去掉寄样方式,接口不改,将参数设置为0

      sampleMgmtService.printQrCode($scope.sampleIdList,$scope.code.sendType)
      .then(function call(resp) {
        if (resp.data.code == 200) {
          var data = resp.data.data;
          var num = Object.keys(data);
          if (num.length >0){
            for(var key in data){
              var sampleId = data[key].sampleId;
              var sampleCode = data[key].sampleCode;
              if($scope.code.sampleId == sampleId){
                $scope.code.sampleCode = sampleCode;
                break;
              }
            }
          }
          prn2_preview();
          toaster.pop({
            type:'success',
            title: '打印样卡',
            body: "打印成功",
            showCloseButton: true,
            timeout: 5000
          });
        }
      });
      // $scope.okBtnDisabled = true;
    };

    $scope.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };

    /**
     * 改变tab值
     */
    $scope.changeTab = function(whichCode) {
        $scope.whichCode = whichCode;
    }

    function prn2_preview() {
      CreateTwoFormPage();
      LODOP.PREVIEW();
      // LODOP.PRINT_DESIGN();
    };

    function CreateTwoFormPage() {
      LODOP = getLodop();
      LODOP.PRINT_INIT("");
      //LODOP.PRINT_INITA("0mm","1mm","78mm","50mm","打印二维码");
      LODOP.SET_PRINT_PAGESIZE(1,800, 500,'');

      if ($scope.whichCode === 1) {
        var html=document.getElementById("form1").innerHTML;
      } else {
        var html=document.getElementById("form2").innerHTML;
      }
      html = html.replace(/<img[^>]+>/g, "");

      var strBodyStyle = "<style>" + document.getElementById("style1").innerHTML + "</style>";
      var strFormHtml = strBodyStyle + "<body>" + html + "</body>";

      LODOP.ADD_PRINT_HTM("1.5mm", "1mm", "77.5mm", "47mm", strFormHtml);
      //LODOP.SET_PRINT_STYLEA(0,"FontSize",15);
      // LODOP.ADD_PRINT_BARCODE("21.85mm","53.00mm","29mm","29mm","QRCode",);
      LODOP.ADD_PRINT_BARCODE("17.3mm","51mm","30mm","30mm","QRCode",$scope.printUrl);
      LODOP.SET_PRINT_STYLEA(0,"QRCodeVersion",3);
      LODOP.SET_PRINT_STYLEA(0,"QRCodeErrorLevel","L");

    };

  }

  angular
  .module('app.sample-mgmt')
  .controller('PrintQrCodeModalCtrl', PrintQrCodeModalCtrl);

})();