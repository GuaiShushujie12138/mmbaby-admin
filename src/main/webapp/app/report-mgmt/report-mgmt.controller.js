/**
 * report-mgmt.controller.js
 * boris
 * 2016-10-9
 */

(function () {
  'use strict';

  ReportMgmtCtrl.$inject = ['$scope', '$timeout', '$http', '$uibModal',
    '$filter', '$compile', 'toaster', 'ReportService', 'DTOptionsBuilder',
    'DTColumnBuilder', 'DTColumnDefBuilder', 'permissionCheckService'];

  function ReportMgmtCtrl($scope, $timeout, $http, $uibModal, $filter, $compile,
      toaster, ReportService, DTOptionsBuilder, DTColumnBuilder,
      DTColumnDefBuilder, permissionCheckService) {
    var vm = this;

    vm.defaultStr = "";
    vm.canClickDeptStr = "";
    vm.canClickDeptId = -1;

    vm.kpiView = permissionCheckService.check("WEB.REPORT.KPI-SUMMARY.VIEW");

    vm.downloadKpiData = permissionCheckService.check(
        "WEB.REPORT.KPI-SUMMARY.EXPORTKPISUMMARY");

    vm.downloadVisitData = permissionCheckService.check(
        "WEB.REPORT.KPI-SUMMARY.EXPORTVISITMESSAGE");

    vm.downloadByTradeData = permissionCheckService.check(
        "WEB.REPORT.KPI-SUMMARY.EXPORTTRADEMESSAGE");

    vm.lookKpiBuyerTabPrivilege = permissionCheckService.check(
        "WEB.REPORT.KPI-SUMMARY.BUYER");

    vm.lookKpiSellerTabPrivilege = permissionCheckService.check(
        "WEB.REPORT.KPI-SUMMARY.SELLER");
    vm.canQuery = permissionCheckService.check(
        "WEB.TRADE-MGMT.QUERY");

    vm.canLookDemand = permissionCheckService.check(
        "WEB.DEMAND-MGMT.QUERY.DETAIL"
    );

    //授权用户列表
    vm.authUserList = [];
    //买家数据表格实例
    vm.dtInstanceBuyer = {};
    //卖家数据表格实例
    vm.dtInstanceSeller = {};

    //查询相关数据>>
    vm.datas = [];
    vm.dataFilterMsg = '';
    vm.filterMsg = '';
    vm.sumData = null;
    //切换uibtab时,记录切换到买家数据还是切换到卖价数据
    vm.clickTabType = 1; //默认是买家数据
    //数据权限类型  1：买家  2：卖家 3：买家卖家
    vm.type = 0;
    //当前面包屑所在的层级id
    vm.deptId = -1;
    vm.deptName = "";
    //面包屑列表
    vm.banner = [];

    //vm.startDate = $filter('date')(new Date(), 'yyyy-MM-dd') + " 00:00:00";
      var today = new Date();
      vm.startDate = $filter('date')(today.setMonth(today.getMonth()-1), 'yyyy-MM-dd') + " 00:00:00";
    vm.endDate = $filter('date')(new Date(), 'yyyy-MM-dd') + " 23:59:59";

    vm.validateDateRange = {
      startDate: vm.startDate,
      endDate: vm.endDate
    };

    //日期控件配置
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

    //获取授权用户列表
    ReportService.getAuthUsers().then(function (resp) {
      vm.authUserList = resp.data.data;
    });

    //初始化数据权限类型
    if (vm.lookKpiBuyerTabPrivilege && vm.lookKpiSellerTabPrivilege) {
      vm.type = 3;
    }
    else if (vm.lookKpiSellerTabPrivilege) {
      vm.type = 2;
    } else if (vm.lookKpiBuyerTabPrivilege) {
      vm.type = 1;
    }

    var initType = vm.type == 3 ? 1 : vm.type;
    loadServerData(initType);

    $scope.dtColumnDefsBuyer = [
      DTColumnDefBuilder.newColumnDef(0).notVisible(),
      DTColumnDefBuilder.newColumnDef(1).notSortable(),
      DTColumnDefBuilder.newColumnDef(2).notSortable(),
      DTColumnDefBuilder.newColumnDef(3).notSortable(),
      DTColumnDefBuilder.newColumnDef(4).notSortable(),
      DTColumnDefBuilder.newColumnDef(5).notSortable(),
      DTColumnDefBuilder.newColumnDef(6).notSortable(),
      DTColumnDefBuilder.newColumnDef(7).notSortable(),
      DTColumnDefBuilder.newColumnDef(8).notSortable(),
      DTColumnDefBuilder.newColumnDef(9).notSortable(),
      DTColumnDefBuilder.newColumnDef(10).notSortable(),
      DTColumnDefBuilder.newColumnDef(11).notSortable(),
      DTColumnDefBuilder.newColumnDef(12).notSortable(),
      DTColumnDefBuilder.newColumnDef(13).notSortable(),
      DTColumnDefBuilder.newColumnDef(14).notSortable()
    ];

    $scope.dtColumnDefsSeller = [
      DTColumnDefBuilder.newColumnDef(0).notVisible(),
      DTColumnDefBuilder.newColumnDef(1).notSortable(),
      DTColumnDefBuilder.newColumnDef(2).notSortable(),
      DTColumnDefBuilder.newColumnDef(3).notSortable(),
      DTColumnDefBuilder.newColumnDef(4).notSortable(),
      DTColumnDefBuilder.newColumnDef(5).notSortable(),
      DTColumnDefBuilder.newColumnDef(6).notSortable(),
      DTColumnDefBuilder.newColumnDef(7).notSortable(),
      DTColumnDefBuilder.newColumnDef(8).notSortable(),
      DTColumnDefBuilder.newColumnDef(9).notSortable(),
      DTColumnDefBuilder.newColumnDef(10).notSortable(),
      DTColumnDefBuilder.newColumnDef(11).notSortable(),
      DTColumnDefBuilder.newColumnDef(12).notSortable(),
      DTColumnDefBuilder.newColumnDef(13).notSortable(),
      DTColumnDefBuilder.newColumnDef(14).notSortable(),
      DTColumnDefBuilder.newColumnDef(15).notSortable(),
      DTColumnDefBuilder.newColumnDef(16).notSortable()
    ];

    $scope.$watch('vm.validateDateRange', function (newVal, oldVal) {
      if (newVal) {
        vm.startDate =
            moment(newVal.startDate, "YYYY-MM-DD hh:mm:ss").format(
                "YYYY-MM-DD HH:mm:ss");
        vm.endDate =
            moment(newVal.endDate, "YYYY-MM-DD hh:mm:ss").format(
                "YYYY-MM-DD HH:mm:ss");
      }
    });

    $scope.changeDept = function ($event, id, type, name) {
      vm.deptId = id;
      vm.deptName = name;
      $scope.submit(type);
    };

    $scope.dtOptionsBuyer = DTOptionsBuilder.newOptions()
    .withDOM('frtl')
    .withOption('searching', false)
    .withOption('lengthChange', false)
    .withOption('autoWidth', false)
    .withOption('scrollX', true)
    .withOption('displayLength', 10000)
    .withPaginationType('full_numbers');
    $scope.dtOptionsSeller = DTOptionsBuilder.newOptions()
    .withDOM('frtl')
    .withOption('searching', false)
    .withOption('lengthChange', false)
    .withOption('autoWidth', false)
    .withOption('scrollX', true)
    .withOption('displayLength', 10000)
    .withPaginationType('full_numbers');

    $scope.tabQuery = function (event, type) {
      vm.clickTabType = type;

      vm.deptId = -1;
      vm.deptName = vm.canClickDeptStr;
      $scope.submit(type);
    }

    $scope.submit = function (type) {
      if (type == 3) {
        type = vm.clickTabType;
      }
      $scope.queryBtnDisabled = true;
      loadServerData(type);
    };

    $scope.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };

    $scope.downloadKpiSummary = function () {
      var userId = ifn(vm.userId, 0);

      var url = '/web/report/downloadByKpiSummary.do';

      $http.post(url, {
        beginTime: vm.startDate,
        endTime: vm.endDate,
        deptId: vm.deptId,
        userId: userId
      }).then(function (response) {
        toaster.pop(
            {
              type: response.data.code == 200 ? 'success' : 'error',
              title: '操作提示',
              body: response.data.message,
              showCloseButton: true,
              timeout: 5000
            });

      });

      console.log(url);
    }

    $scope.downloadByVisitMessage = function () {
      var userId = ifn(vm.userId, 0);
      var url = '/web/report/downloadByVisitMessage.do?beginTime='
          + vm.startDate + '&endTime=' + vm.endDate;
      window.open(url);
    }

    $scope.downloadByTradeMessage = function () {
      var userId = ifn(vm.userId, 0);
      var url = '/web/report/downloadByTradeMessage.do?beginTime='
          + vm.startDate + '&endTime=' + vm.endDate;
      window.open(url);
    }

    /**
     * 面包屑导航
     */
    $scope.navBanner = function (type, id, name) {
      if (id == -1 || vm.canClickDeptId == id){
        vm.banner = [];
      } else {
        vm.banner = this.calcBanner(vm.banner, id, name);
      }
    }

    /**
     * 生成面包屑
     */
    $scope.calcBanner = function (banner, id, name) {
      var newList = [];
      var dep = null;
      banner = banner || [];
      name = name || "";
      name = name.indexOf("-") > -1 ? name.split('-').pop() : name;
      for (var i = 0, k = banner.length; i < k; i++) {
        dep = banner[i];
        if (dep.id == id) {
          break;
        }
        newList.push(dep);
      }
      newList.push({
        id: id,
        name: name
      });
      return newList;
    }

    function loadServerData(type) {
      return ReportService.query(vm.startDate, vm.endDate, vm.deptId, vm.userId,
          type)
      .then(function (resp) {
        vm.datas = resp.data.data;
        vm.dataFilterMsg = resp.data.extendData.dataFilterMsg;
        vm.filterMsg = resp.data.extendData.filterMsg;
        vm.sumData = resp.data.extendData.sumData;
        vm.defaultStr = resp.data.extendData.defaultStr;
        vm.canClickDeptStr = resp.data.extendData.canClickDeptStr;
        vm.canClickDeptId = resp.data.extendData.canClickDeptId;
        $scope.navBanner(type, vm.deptId, vm.deptName);

      }).finally(function () {
        $scope.queryBtnDisabled = false;
      });
    }
  }

  angular
  .module('app.report-mgmt')
  .controller('ReportMgmtCtrl', ReportMgmtCtrl);

})();