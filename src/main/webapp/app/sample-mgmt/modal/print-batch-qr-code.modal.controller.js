/**
 * sample-batch-print-qr-modal.controller
 */
(function () {

  'use strict';

  PrintBatchQrCodeModalCtrl.$inject =
      ['$scope', '$uibModalInstance','$uibModal','$compile',
        'sampleMgmtService', 'toaster','selectedSampleIds','$filter','sendType'];

  function PrintBatchQrCodeModalCtrl($scope, $uibModalInstance,$uibModal, $compile
      ,sampleMgmtService, toaster,selectedSampleIds,$filter,sendType) {
    var vm = $scope;
    $scope.code = {};
    $scope.sampleIdList = [];
    $scope.sampleIdList = selectedSampleIds;
    $scope.sampleList = [];
    $scope.code.showType = true;
    if (!!sendType) {
      $scope.code.sendType = sendType;
      $scope.code.showType = false;
    }
    $scope.whichCode = 1;

    initData();
    function initData() {

      sampleMgmtService.getSamples($scope.sampleIdList)
      .then(function callBack(resp) {
        if (resp.data.code == 200) {
          $scope.sampleList = resp.data.data.sampleBeans;
        }
      });
    }

    $scope.ok = function () {

      sampleMgmtService.printQrCode($scope.sampleIdList)
      .then(function call(resp) {
        if (resp.data.code == 200) {
          var data = resp.data.data;
          var num = Object.keys(data);
          if (num.length >0){
            for(var key in data){
              var sampleId = data[key].sampleId;
              var sampleCode = data[key].sampleCode;
              for(var i in $scope.sampleList){
                if($scope.sampleList[i].sampleId == sampleId){
                  $scope.sampleList[i].sampleCode = sampleCode;
                  break;
                }
              }
            }
          }

          preview($scope.sampleList);
          toaster.pop({
            type:'success',
            title: '打印样卡',
            body: "打印成功",
            showCloseButton: true,
            timeout: 5000
          });
        }
      });


    };

    $scope.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };

    /**
     *  改变tab值类型回调函数
     */
    $scope.changeTab = function(whichCode) {
      $scope.whichCode = whichCode;
    }

    var LODOP; //声明为全局变量
    function preview(sampleList) {
      LODOP=getLodop();
      LODOP.PRINT_INIT("");
      LODOP.SET_PRINT_PAGESIZE(1,800, 500,'');
      CreateAllPages(sampleList);
      LODOP.PREVIEW();
    };


    function CreateAllPages(sampleList){
      for (var i = 0; i < sampleList.length; i++) {
        LODOP.NewPage();

        createOnePage(sampleList[i]);
      }
    };



    function createOnePage(sampleItem) {
      if ($scope.whichCode === 1) {
        var html=document.getElementById("sample"+sampleItem.sampleId).innerHTML;
      } else {
        var html=document.getElementById("sample2"+sampleItem.sampleId).innerHTML;
      }
      html = html.replace(/<img[^>]+>/g, "");

      var strBodyStyle = "<style>" + document.getElementById("style1").innerHTML + "</style>";
      var strFormHtml = strBodyStyle + "<body>" + html + "</body>";

      LODOP.ADD_PRINT_HTM("1.5mm", "1mm", "77.5mm", "47mm", strFormHtml);
      // LODOP.ADD_PRINT_BARCODE("21.85mm","53.00mm","25mm","25mm","QRCode",sampleItem.printQrCode);

      // LODOP.ADD_PRINT_BARCODE("22.00mm","54.32mm","25mm","25mm","QRCode",sampleItem.printQrCode);
      LODOP.ADD_PRINT_BARCODE("17.3mm","51mm","25mm","25mm","QRCode",sampleItem.printQrCode);
      LODOP.SET_PRINT_STYLEA(0,"QRCodeVersion",3);
      LODOP.SET_PRINT_STYLEA(0,"QRCodeErrorLevel","L");

    };

  }

  angular
  .module('app.sample-mgmt')
  .controller('PrintBatchQrCodeModalCtrl', PrintBatchQrCodeModalCtrl);

})();