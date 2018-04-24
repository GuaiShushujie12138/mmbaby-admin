/**
 * sample-log-modal.controller
 */
(function () {

  'use strict';

  SampleLogModalCtrl.$inject =
      ['$scope', '$uibModal', '$uibModalInstance', '$compile',
        'sampleMgmtService', 'toaster','sampleId','operateType',
        'DTOptionsBuilder', 'DTColumnBuilder' ];

  function SampleLogModalCtrl($scope, $uibModal, $uibModalInstance,
      $compile, sampleMgmtService, toaster,sampleId,operateType,
      DTOptionsBuilder,DTColumnBuilder) {
    var vm = $scope;

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
    .withOption('lengthMenu', [10, 25, 50, 100, 200])
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
      DTColumnBuilder.newColumn('sampleId').withTitle('样卡ID').withClass('func-th').withOption("width", "60px").notSortable(),
      DTColumnBuilder.newColumn('createTime').withTitle('生成时间').withClass('func-th').withOption("width", "60px").renderWith(timeHtml),
      DTColumnBuilder.newColumn('fromSourceName').withTitle('样卡来源').withClass('func-th').withOption("width", "60px").notSortable(),
      DTColumnBuilder.newColumn('ipAddress').withTitle('ip地址').withClass('func-th').withOption("width", "60px").notSortable(),
      DTColumnBuilder.newColumn('sellerOperatorName').withTitle('样卡卖家运营').withClass('func-th').withOption("width", "100px").notSortable(),
      DTColumnBuilder.newColumn('belongOperatorName').withTitle('当前持有人').withOption("width", "100px").notSortable(),
      DTColumnBuilder.newColumn('memo').withTitle('备注').withOption("width", "100px").notSortable(),
      DTColumnBuilder.newColumn('platformText').withTitle('来源平台').withOption("width", "100px").notSortable(),
      DTColumnBuilder.newColumn('createId').withTitle('创建人').withOption("width", "100px").notSortable(),
      DTColumnBuilder.newColumn('updateId').withTitle('修改人').withOption("width", "100px").notSortable()
    ];

    function serverData(sSource, aoData, fnCallback, oSettings) {
      var draw = aoData[0].value;
      var sortColumn = $scope.dtColumns[parseInt(aoData[2].value[0].column)].mData;
      var sortDir = aoData[2].value[0].dir;
      var start = aoData[3].value;
      var limit = aoData[4].value;
      sortColumn = 'createTime';
      // var where =JSON.stringify("{\"rules\":[{\"field\":\"\",\"value\":\"\",\"op\":\"\"}],\"groups\":[],\"op\":\"equal\"}");
      var queryConditionObject = resetQueryCondition();
      var where =JSON.stringify(queryConditionObject);
      return sampleMgmtService.queryLogByOperateType(sampleId,operateType,
          draw, sortColumn, sortDir, start, limit,where
      ).then(function(resp) {
        fnCallback(resp.data.data);
        vm.tableData = resp.data.data.data;

      }).finally(function() {
        $scope.queryBtnDisabled = false;
      });
    }

    function resetQueryCondition() {
      var form = $('#sampleController').find('form');
      var queryConditionObject = getQueryParams(form, vm.tabFilter);

      return queryConditionObject;
    }

    $scope.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };

  }

  angular
  .module('app.sample-mgmt')
  .controller('SampleLogModalCtrl', SampleLogModalCtrl);

})();