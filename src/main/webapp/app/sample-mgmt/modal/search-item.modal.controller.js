/**
 * trade-mark-shop-modal.controller
 */
(function () {

  'use strict';

  SelectItemSearchCtrl.$inject =
      ['$scope', '$uibModalInstance','$compile',
        'sampleMgmtService', 'toaster','DTOptionsBuilder',
        'DTColumnBuilder','shopId'];

  function SelectItemSearchCtrl($scope, $uibModalInstance,$compile
      ,sampleMgmtService, toaster,DTOptionsBuilder,DTColumnBuilder,shopId) {

    var vm= $scope;
    vm.tableData = [];
    $scope.modal = {};
    $scope.modal.shopId = shopId;
    $scope.modal.keyword = "";

    $scope.okBtnDisabled = true;

    $scope.dtInstance = {};

    $scope.dtOptions = DTOptionsBuilder
    .fromSource('')
    .withFnServerData(serverData)
    .withDataProp('data')
    .withOption('serverSide', true)
    .withOption('searching', false)
    .withOption('lengthChange', true)
    .withDOM('frtlip')
    .withOption('autoWidth', false)
    .withOption('scrollX', false)
    .withOption('lengthMenu', [5, 10, 20, 50, 100])
    .withOption('displayLength', [10])
    .withPaginationType('full_numbers')
    // .withOption('rowCallback', rowCallback)
    .withOption('createdRow', function(row, data, dataIndex) {
      $compile(angular.element(row).contents())($scope);
    })
    .withOption('headerCallback', function (header) {
      if (!vm.headerCompiled) {
        vm.headerCompiled = true;
        $compile(angular.element(header).contents())($scope);
      }
    });

    $scope.dtColumns = [
      DTColumnBuilder.newColumn(null).withTitle('操作').notSortable().withClass('text-center')
      .withOption('width', '100px').renderWith(actionsHtml),
      DTColumnBuilder.newColumn('mainPic').withTitle('商品图片').withClass('func-th').withOption("width", "70px").renderWith(mainPicHtml),
      DTColumnBuilder.newColumn('itemId').withTitle('商品编号').withClass('func-th').withOption("width", "60px").notSortable(),
      DTColumnBuilder.newColumn('name').withTitle('商品名称').withClass('func-th').withOption("width", "60px").notSortable(),
      DTColumnBuilder.newColumn('itemCode').withTitle('货号').withClass('func-th').withOption("width", "60px").notSortable(),
      DTColumnBuilder.newColumn('sampleCount').withTitle('样卡数').withClass('func-th').withOption("width", "60px").notSortable(),
      DTColumnBuilder.newColumn('businessCityName').withTitle('店铺所在城市').withClass('func-th').withOption("width", "100px").notSortable()
    ];

    function actionsHtml(data, type, full, meta) {

      var str = '';

      str += '<div class="m-t-xs m-b-sm"><button'
          + ' class="btn'
          + ' btn-xs'
          + ' btn-w-xs'
          + ' btn-success btn-outline"'
          + ' ng-click="choseShop($event,tableData[' + meta.row + '])">' +
          '    <i class="fa fa-code-fork  icon-width">选择该商品</i>' +
          '</button></div>';

      return str;
    }

    function mainPicHtml(data, type, full, meta) {
      var pic = '';
      pic += '<div class="m-t-xs m-b-sm"><img'
          + ' ng-src='+full.mainPic+' />'+
          '</div>';
      return pic;
    }

    function serverData(sSource, aoData, fnCallback, oSettings) {
      var draw = aoData[0].value;

      var sortColumn = $scope.dtColumns[parseInt(aoData[2].value[0].column)].mData;

      var sortDir = aoData[2].value[0].dir;

      var start = aoData[3].value;

      var limit = aoData[4].value;


      return sampleMgmtService.searchItemList('',
          $scope.modal.keyword,start,limit,draw).then(function(resp) {
        fnCallback(resp.data.data);
        vm.tableData = resp.data.data.data;

      }).finally(function() {
        $scope.queryBtnDisabled = false;
      });
    }

    $scope.submit = function() {
      $scope.queryBtnDisabled = true;
      $scope.dtInstance.reloadData();
      // params = null;
    };

    $scope.choseShop = function ($event,rowObj) {
      $uibModalInstance.close(rowObj);
    };


    $scope.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };

  }

  angular
  .module('app.sample-mgmt')
  .controller('SelectItemSearchCtrl', SelectItemSearchCtrl);

})();