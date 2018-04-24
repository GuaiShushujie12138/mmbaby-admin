/**
 * trade-mark-shop-modal.controller
 */
(function () {

  'use strict';

  MarkShopSearchCtrl.$inject =
      ['$scope', '$uibModalInstance','$compile','rowDatas',
        'tradeMgmtService', 'toaster','DTOptionsBuilder',
        'DTColumnBuilder'];

  function MarkShopSearchCtrl($scope, $uibModalInstance,$compile,
      rowDatas,tradeMgmtService, toaster,DTOptionsBuilder,DTColumnBuilder) {

    var vm= $scope;
    vm.tableData = [];
    $scope.modal = {};
    $scope.rowObj = rowDatas;
    $scope.sohp={};
    // $scope.shop.address = "";
    $scope.modal.provinceList=[];
    $scope.modal.cityList=[];
    $scope.modal.areaList=[];
    $scope.okBtnDisabled = true;
    $scope.modal.tradeId = rowDatas.tradeId;
    $scope.modal.isShowShop = false;

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
      DTColumnBuilder.newColumn('customerId').withTitle('客户编号').withClass('func-th').withOption("width", "70px"),
      DTColumnBuilder.newColumn('shopId').withTitle('店铺编号').withClass('func-th').withOption("width", "70px"),
      DTColumnBuilder.newColumn('companyName').withTitle('公司名称').withClass('func-th').withOption("width", "60px").notSortable(),
      DTColumnBuilder.newColumn('shopName').withTitle('店铺名称').withClass('func-th').withOption("width", "60px").notSortable(),
      DTColumnBuilder.newColumn('mobile').withTitle('电话').withClass('func-th').withOption("width", "60px").notSortable(),
      DTColumnBuilder.newColumn('provinceName').withTitle('店铺所在省份').withClass('func-th').withOption("width", "60px").notSortable(),
      DTColumnBuilder.newColumn('cityName').withTitle('店铺所在城市').withClass('func-th').withOption("width", "100px").notSortable(),
      DTColumnBuilder.newColumn('districtName').withTitle('店铺所在区').withOption("width", "100px").notSortable(),
      DTColumnBuilder.newColumn('shopAddress').withTitle('店铺详细地址').withOption("width", "100px").notSortable()
    ];

    function actionsHtml(data, type, full, meta) {

      var str = '';

      str += '<div class="m-t-xs m-b-sm"><button'
          + ' class="btn'
          + ' btn-xs'
          + ' btn-w-xs'
          + ' btn-success btn-outline"'
          + ' ng-click="choseShop($event,tableData[' + meta.row + '])">' +
          '    <i class="fa fa-code-fork  icon-width">选择该店铺</i>' +
          '</button></div>';

      return str;
    }

    function serverData(sSource, aoData, fnCallback, oSettings) {
      var draw = aoData[0].value;

      var sortColumn = $scope.dtColumns[parseInt(aoData[2].value[0].column)].mData;

      var sortDir = aoData[2].value[0].dir;

      var start = aoData[3].value;

      var limit = aoData[4].value;


      return tradeMgmtService.searchShopList($scope.modal.openShop,
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
      var customerId = rowObj.customerId;
      var data={};
      tradeMgmtService.getShopInfoByCustomer(customerId)
      .then(function call(resp) {
        if (resp.data.code == 200) {
          data = resp.data.data;
          $uibModalInstance.close(data);
        }
      });

    };


    function initData() {

    }

    $scope.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };

  }

  angular
  .module('app.trade-mgmt')
  .controller('MarkShopSearchCtrl', MarkShopSearchCtrl);

})();