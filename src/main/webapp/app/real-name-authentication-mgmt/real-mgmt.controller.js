(function () {

  'use strict';

  RealMgmtCtrl.$inject =
      ['$location', '$scope', '$uibModal', '$state', '$filter', '$compile', 'toaster', 'RealService', 'DTOptionsBuilder', 'DTColumnBuilder'];

  function RealMgmtCtrl($location , $scope, $uibModal, $state, $filter, $compile, toaster, RealService, DTOptionsBuilder, DTColumnBuilder) {
    var vm = this;

    $scope.dtInstance = {};

    vm.datas = [];

    //vm.startDate = $filter('date')(new Date(), 'yyyy-MM-dd') + " 00:00:00";
    var today = new Date();
    vm.startDate = $filter('date')(today.setMonth(today.getMonth()-1), 'yyyy-MM-dd') + " 00:00:00";
    vm.endDate = $filter('date')(new Date(), 'yyyy-MM-dd') + " 23:59:59";

    vm.validateDateRange = {
      startDate: vm.startDate,
      endDate: vm.endDate
    };

    $scope.$watch('vm.validateDateRange', function (newVal, oldVal) {
      if (newVal) {
        vm.startDate = moment(newVal.startDate, "YYYY-MM-DD hh:mm:ss").format("YYYY-MM-DD HH:mm:ss");
        vm.endDate = moment(newVal.endDate, "YYYY-MM-DD hh:mm:ss").format("YYYY-MM-DD HH:mm:ss");
      }
    });

    vm.deptId = 0;

    vm.opts = {
      timePicker: true,
      timePickerSeconds: true,
      timePickerIncrement: 1,
      timePicker12Hour: false,
      locale: {
        applyClass: 'btn-green',
        applyLabel: "应用",
        fromLabel: "从",
        format: "YYYY-MM-DD",
        toLabel: "至",
        cancelLabel: '取消',
        customRangeLabel: '自定义区间'
      },
      ranges: {
        '今日': [moment().startOf('day'), moment().endOf('day')],
        '本周': [moment().startOf('isoWeek'), moment().endOf('day')],
        '本月': [moment().startOf('month'), moment().endOf('day')]
      }
    }

    $scope.dtOptions = DTOptionsBuilder
        .fromSource('')
        .withFnServerData(serverData)
        .withDataProp('data')
        .withDOM('frtlip')
        .withOption('serverSide', true)
        .withOption('searching', false)
        .withOption('lengthChange', true)
        .withOption('autoWidth', false)
        .withOption('scrollX', false)
        .withOption('lengthMenu', [10, 20, 30, 50, 100])
        .withOption('displayLength', 10)
        //.withOption('rowCallback', rowCallback)
        .withPaginationType('full_numbers')
        .withOption('createdRow', function (row, data, dataIndex) {
          $compile(angular.element(row).contents())($scope);
        })
        .withOption('headerCallback', function (header) {
          if (!vm.headerCompiled) {
            vm.headerCompiled = true;
            $compile(angular.element(header).contents())($scope);
          }
        });

    $scope.dtColumns = [
      DTColumnBuilder.newColumn('customerId').withTitle('客户ID').notSortable(),
      DTColumnBuilder.newColumn('auditStatusName').withTitle('审核状态').notSortable(),
      DTColumnBuilder.newColumn('authTypeName').withTitle('类型').notSortable(),
      DTColumnBuilder.newColumn('mobile').withTitle('手机号码').notSortable(),
      DTColumnBuilder.newColumn('crmUserName').withTitle('销售').notSortable(),
      DTColumnBuilder.newColumn('crmUserDeptFullName').withTitle('城市').notSortable().renderWith(cityHtml),
      DTColumnBuilder.newColumn('submitTime').withTitle('提交时间').notSortable().renderWith(timeHtml),
      DTColumnBuilder.newColumn('remark').withTitle('备注').notSortable().renderWith(remarkHtml),
      DTColumnBuilder.newColumn(null).withTitle('操作').notSortable().withClass('text-center')
          .withOption('width', '100px').renderWith(actionsHtml),
    ];

    function timeHtml(data, type, full, meta){
      var str = '';
      str +=
          '<div class="m-t-xs m-b-sm remarkStyle">'
          + data +
          '</div>';

      return str;
    }

    function cityHtml(data, type, full, meta){
      var str = '';
      str +=
          '<div class="m-t-xs m-b-sm remarkStyle">'
          + data +
          '</div>';

      return str;
    }

    function remarkHtml(data, type, full, meta){
      var str = '';
      str +=
          '<div class="m-t-xs m-b-sm remarkStyle">'
          + full.remark+
          '</div>';

      return str;
    }

    function actionsHtml(data, type, full, meta) {
      var str = '';
      if(full.auditStatus == 10){
        str +=
            '<div class="m-t-xs m-b-sm">'
            + '<button class="btn btn-xs btn-w-xs btn-success btn-outline" ng-click="gotoDetail(vm.tableData['
            + meta.row + '])" >'
            + '<i class="fa fa-info icon-width">审批</i>'
            + '</button></div>';
      }
      if(full.auditStatus == 20 || full.auditStatus == 30){
        str +=
            '<div class="m-t-xs m-b-sm">'
            + '<button class="btn btn-xs btn-w-xs btn-warning btn-outline" ng-click="gotoDetail(vm.tableData['
            + meta.row + '])" >'
            + '<i class="fa fa-info icon-width">查看</i>'
            + '</button></div>';
      }

      return str;
    }

    function auditStatus(data, type, full, meta) {
      var str = '';
      str +=
          '<div class="m-t-xs m-b-sm" ng-if="'+ (full.status == 3) +'">'
          + '<button class="btn btn-xs btn-w-xs btn-success btn-outline" ng-click="download(vm.tableData['
          + meta.row + '])" >'
          + '<i class="fa fa-info icon-width">企业</i>'
          + '</button></div>';

      return str;
    }

    function serverData(sSource, aoData, fnCallback, oSettings) {

      var draw = aoData[0].value;
      var sortColumn = $scope.dtColumns[parseInt(aoData[2].value[0].column)].mData;
      var sortDir = aoData[2].value[0].dir;
      var start = aoData[3].value;
      var limit = aoData[4].value;

      var form = $(oSettings.nTableWrapper).closest('#gridcontroller').find('form');
      var queryConditionObject = getQueryParams(form, vm.tabFilter);
      var auditStatus = $(".auditStatus").find("option:selected").val();
      if(auditStatus!='100'){
        queryConditionObject.rules.push({"field":"ca.audit_status","value":auditStatus,"op":"equal"})
      }
      var where = JSON.stringify(queryConditionObject);
      return RealService.query(draw,'c.id', sortDir, start,limit, where).then(function (resp) {
        fnCallback(resp.data);
        vm.tableData = resp.data.data;
      }).finally(function () {
        $scope.queryBtnDisabled = false;
      });
    };

    $scope.submit = function () {
      $scope.queryBtnDisabled = true;
      $scope.dtInstance.reloadData();
    };

    //客户实名认证详情页
    $scope.gotoDetail = function(rowObj){
      var modalInstance = $uibModal.open({
        templateUrl: 'app/real-name-authentication-mgmt/modal/real-authentication-detail.html?v='
        + LG.appConfig.clientVersion,
        windowClass: 'large-Modal',
        keyboard: false,
        controller: 'RealDetailMgmtCtrl',
        resolve: {
          rowObj: function () {
            return rowObj;
          }
        }
      })
      modalInstance.result.then(function (result) {
        $scope.dtInstance.reloadData(function () {
        }, false);
      });
    }

  }

  angular
      .module('app.real-name-authentication-mgmt')
      .controller('RealMgmtCtrl', RealMgmtCtrl)

})();