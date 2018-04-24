/**
 * demand-mgmt.controller
 */
(function () {

  'use strict';

  DemandMgmtCtrl.$inject =
      ['$location', '$scope', '$http', '$uibModal', '$compile', '$filter',
        'toaster', 'demandMgmtService',
        'DTOptionsBuilder', 'DTColumnBuilder', 'permissionCheckService',
        '$interval', 'SweetAlert', '$stateParams'];

  /**
   * DemandMgmtCtrl
   */
  function DemandMgmtCtrl($location, $scope, $http, $uibModal, $compile,
      $filter, toaster, demandMgmtService,
      DTOptionsBuilder, DTColumnBuilder, permissionCheckService,
      $interval, SweetAlert, $stateParams) {
    var vm = this;
    var rootScope = $scope;
    var params = $location.search();
    vm.demandIdStr = vm.userMobile = vm.userName = vm.outHide = '';
    vm.demandIdStr = $stateParams.demandIdStr ? $stateParams.demandIdStr : "";
    vm.pickUserCount = vm.commentPickCount = vm.feedbackCount = '';
    vm.demandSourceOptions = [];
    $scope.modal = {};
    $scope.modal.auditStatus = [];
    $scope.modal.purchaseArea = [];
    $scope.modal.notInPrivateDemandNum = 0;
    vm.clickDemandNumBtn = false;
    vm.auditSwitch = 'false';
    vm.timer = null;
    vm.clickDemandNumData = 0;
    vm.crmBuyerId = '';

    //是否有查看详情的权限
    vm.demandDetail = permissionCheckService.check(
        "WEB.DEMAND-MGMT.QUERY.DETAIL");
    //找版反馈
    vm.demandPick = permissionCheckService.check(
        "WEB.DEMAND-MGMT.QUERY.QUERYRESULTLIST");
    //分配需求
    vm.demandDispatch = permissionCheckService.check(
        "WEB.DEMAND-MGMT.QUERY.DISPATCHTASK");

    //分配需求
    vm.viewdemandDispatch =
        permissionCheckService.check("WEB.DEMAND-MGMT.QUERY.VIEWDISPATCHTASK");
    //标记收样
    vm.hasMarkModelPermission = permissionCheckService.check(
        "WEB.DEMAND-MGMT.MARKMODEL");
    //需求进度
    vm.demandDynamic = permissionCheckService.check("WEB.DEMAND-MGMT.DYNAMIC");

    vm.canMarkDemandSource = permissionCheckService.check(
        "WEB.DEMAND-MGMT.MRAKSOURCE");

    vm.canModifyPurchaseArea = permissionCheckService.check(
        "WEB.DEMAND-MGMT.MODIFYAREA");

    vm.canSeeDemandNum = permissionCheckService.check(
        "WEB.DEMAND-MGMT.NOT-IN-PRIVATE-DEMAND-NUM");

    vm.canCancel = permissionCheckService.check("WEB.DEMAND-MGMT.CANCEL");

    init();
    function init() {
      demandMgmtService.getDomainUrl()
      .then(function (resp) {
        vm.domain = resp.data.data.domain;
        console.log(vm.domain)
      });

      demandMgmtService.getItemUrl()
      .then(function (resp) {
        vm.itemDomain = resp.data.data.domain;
        console.log(vm.itemDomain)
      });

      demandMgmtService.getRootCategory()
      .then(function (resp) {
        vm.rootCategoryOpts = resp.data.data.list;
      });
      demandMgmtService.getRegionList().then(function (resp) {
        $scope.regionList = resp.data.data

      });
      demandMgmtService.getBuyerOperatorList().then(function (resp) {
        $scope.buyerOperatorList = resp.data.data.buyerOperatorList

      });

      demandMgmtService.getDemandSourceOptions().then(
          function successCallback(response) {
            vm.demandSourceOptions = response.data.data;
          });

      demandMgmtService.getAuditStatus().then(function (resp) {
        $scope.modal.auditStatus = resp.data.data;
      });

      demandMgmtService.getPurchaseArea().then(function (resp) {
        $scope.modal.purchaseArea = resp.data.data;
      });

      if (vm.canSeeDemandNum) {
        demandMgmtService.getNotInPrivateDemandNum().then(function (resp) {
          $scope.modal.notInPrivateDemandNum = resp.data.data;
        });

        timer();
      }

    };

    function timer() {
      var i = 0;
      vm.timer = $interval(function () {
        demandMgmtService.getNotInPrivateDemandNum().then(function (resp) {
          $scope.modal.notInPrivateDemandNum = resp.data.data;
        });
        console.log(i++);
      }, 1 * 60 * 1000);
    }

    //vm.startDate = $filter('date')(new Date(), 'yyyy-MM-dd') + " 00:00:00";
    var today = new Date();
    vm.startDate = $filter('date')(today.setMonth(today.getMonth() - 1),
            'yyyy-MM-dd') + " 00:00:00";
    vm.endDate = $filter('date')(new Date(), 'yyyy-MM-dd') + " 23:59:59";

    vm.validateDateRange = {
      startDate: vm.startDate,
      endDate: vm.endDate
    };

    // vm.validateDateRange = $stateParams.validateDateRange?$stateParams.validateDateRange:"";

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

    vm.opts = {
      timePicker: true,
      timePickerSeconds: true,
      timePickerIncrement: 1,
      timePicker12Hour: false,
      locale: {
        applyClass: 'btn-green',
        applyLabel: "应用",
        fromLabel: "从",
        format: "YYYY-MM-DD HH:mm",
        toLabel: "至",
        cancelLabel: '取消',
        customRangeLabel: '自定义区间'
      },
      ranges: {
        '今日': [moment().startOf('day'), moment().endOf('day')],
        '本周': [moment().startOf('isoWeek'), moment().endOf('day')],
        '本月': [moment().startOf('month'), moment().endOf('day')]
      }
    };

    //$scope.$on('$viewContentLoaded', function(){
    //alert("hello angularJS !");
    $('.table').on('draw.dt', function () {
      //使用col插件实现表格头宽度拖拽
      $(".table").colResizable(
          {
            liveDrag: true
          }
      );
    });
    //});

    $scope.dtInstance = {};

    $scope.dtOptions = DTOptionsBuilder
    .fromSource('')
    .withFnServerData(serverData)
    .withDataProp('data.list')
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
      DTColumnBuilder.newColumn(null).withTitle('操作').notSortable().withClass(
          'text-center').withOption('width', '200px').renderWith(actionsHtml),
      DTColumnBuilder.newColumn('demandId').withTitle('需求ID').withClass(
          'func-th').withOption("width", "120px").renderWith(demandIdHtml),
      DTColumnBuilder.newColumn(null).withTitle('类目').notSortable().withClass(
          'func-th').withOption("width", "98px").renderWith(categoryHtml),
      DTColumnBuilder.newColumn('demandStatus').withTitle(
          '需求状态').notSortable().withClass('func-th').withOption("width",
          "80px").renderWith(demandStatus),
      DTColumnBuilder.newColumn('replyTimes').withTitle('抢单次数').withClass(
          'func-th').withOption("width", "80px").notSortable().renderWith(
          replyTimesHtml),
      DTColumnBuilder.newColumn('').withTitle('需求人').notSortable().withClass(
          'func-th').withOption("width", "90px").renderWith(contactman),
      // DTColumnBuilder.newColumn('crmUserRealname').withTitle('代发人').notSortable().withClass('func-th'),
      DTColumnBuilder.newColumn('').withTitle(pickUserCountTitle()).withClass(
          'func-th').withOption("width", "80px").notSortable().renderWith(
          pickUserCountHtml),
      DTColumnBuilder.newColumn('').withTitle(feedbackCountTitle()).withClass(
          'func-th').withOption("width", "90px").notSortable().renderWith(
          feedbackCountHtml),
      DTColumnBuilder.newColumn('').withTitle(commentCountTitle()).withClass(
          'func-th').withOption("width", "90px").notSortable().renderWith(
          commentCountHtml),
      DTColumnBuilder.newColumn('').withTitle('买家运营').withClass(
          'func-th').withOption("width", "160px").notSortable().renderWith(
          buyerRunnerHtml),
      DTColumnBuilder.newColumn('purchaseArea').withTitle('优先采购区域').withClass(
          'func-th').withOption("width", "120px").notSortable(),
      DTColumnBuilder.newColumn('').withTitle('代发人').withClass(
          'func-th').withOption("width", "160px").notSortable().renderWith(
          replaceHtml),
      DTColumnBuilder.newColumn('').withTitle('需求描述').notSortable().withClass(
          'func-th').withOption("width", "150px").renderWith(desHtml),
      DTColumnBuilder.newColumn('score').withTitle('需求评分').withClass(
          'func-th').withOption("width", "50px"),
      DTColumnBuilder.newColumn('sourceName').withTitle('需求来源').withClass(
          'func-th').withOption("width", "90px").notSortable(),
      DTColumnBuilder.newColumn('d.update_time').withTitle('更新时间').withClass(
          'text-center').withOption("width", "120px").renderWith(timeHtml),
      DTColumnBuilder.newColumn('d.audit_time').withTitle('审核时间').withClass(
          'text-center').withOption("width", "120px").renderWith(auditTimeHtml)

    ];

    function pickUserCountTitle() {
      return '找版人数<button class="btn  btn-link" type="button"'
          + ' tooltip-placement="right" uib-tooltip="有反馈的人数/找版人数">' +
          '<i class="fa fa-info-circle red"></i></button>'
    }

    function feedbackCountTitle() {
      return '找版反馈数<button class="btn  btn-link" type="button"'
          + ' tooltip-placement="right" uib-tooltip="成功反馈数/反馈数">' +
          '<i class="fa fa-info-circle red"></i></button>'
    }

    function commentCountTitle() {
      return '评价找版数<button class="btn  btn-link" type="button"'
          + ' tooltip-placement="bottom" uib-tooltip="成功评价数/评价数">' +
          '<i class="fa fa-info-circle red"></i></button>'
    }

    function replaceHtml(data, type, full, meta) {
      return '<div style="white-space:normal;word-wrap:break-word;word-break:break-all;">'
          +
          '<span>' + full.crmUserRealname + '</span></br>' + '<span>'
          + full.crmUserMobile
          + '</span>' +
          '</div>'
    };

    function timeHtml(data, type, full, meta) {
      return '<div style="white-space:normal;word-wrap:break-word;word-break:break-all;">'
          +
          '<span>' + full.updateTime + '</span>' +
          '</div>'
    };

    function auditTimeHtml(data, type, full, meta) {
      return '<div style="white-space:normal;word-wrap:break-word;word-break:break-all;">'
          +
          '<span>' + full.auditTime + '</span>' +
          '</div>'
    };

    function demandIdHtml(data, type, full, meta) {
      var html = "";
      if (full.bigCustomer) {
          html = '<span class="btn btn-link" style="padding: 0; color: #f50;" type="button" tooltip-placement="right" uib-tooltip="金融大客户，第一优先处理"><i class="fa fa-money fa-lg"></i> '
            + '<a ng-href="{{vm.domain}}demand/' + full.demandId
            + '" target="_blank" class="text-danger">' + full.demandId + '</a>'
            + '</span>';
      } else {
          html = '<a ng-href="{{vm.domain}}demand/' + full.demandId
            + '" target="_blank" class="text-danger">' + full.demandId + '</a>';
      }
      if(full.isReDemand){
          html += '<br /><span class="btn btn-danger btn-xs" tooltip-placement="right" uib-tooltip="'+ full.reFindReason +'">重新找版</span>'
      }
      return html;
    };

    function desHtml(data, type, full, meta) {
      return '<div style="white-space:normal;word-wrap:break-word;word-break:break-all;">'
          +
          '<label class="badge badge-danger">' + full.tryUser + '</label>' +
          '<span>' + full.description + '</span>' +
          '</div>'
    };

    function categoryHtml(data, type, full, meta) {
      if (full.newMark) {
        return full.propertyNames;
      } else {
        return '<div>' + full.rootCategoryName + '</br>' + full.subCatagoryName
            + '</div>';
      }

    };

    //需求方
    function contactman(data, type, full, meta) {
      return '<div style="white-space:normal;word-wrap:break-word;word-break:break-all;">'
          +
          '<span>' + full.userContactLinkman + '</span></br>' + '<span>'
          + full.userContactMobile + '</span>' +
          '</div>'
    };

    function buyerRunnerHtml(data, type, full, meta) {
      return '<div style="white-space:normal;word-wrap:break-word;word-break:break-all;"><span>'
          + full.buyerRunner + '</span></div>';
    };

    function pickUserCountHtml(data, type, full, meta) {
      var str = '<div style="white-space:normal;word-wrap:break-word;word-break:break-all;"><span style="color: red">'
          + '本区' + full.hasFeedbackUserCountByRegion + '/'
          + full.pickUserCountByRegion + '</span></div>';
      str += '<div style="white-space:normal;word-wrap:break-word;word-break:break-all;"><span>'
          + '全国' + full.hasFeedbackUserCount + '/' + full.pickUserCount
          + '</span></div>';
      return str;
    }

    function feedbackCountHtml(data, type, full, meta) {
      var str = '<div style="white-space:normal;word-wrap:break-word;word-break:break-all;"><span style="color: red">'
          + '本区' + full.successFeedbackCountByRegion + '/'
          + full.feedbackCountByRegion + '</span></div>';
      str += '<div style="white-space:normal;word-wrap:break-word;word-break:break-all;"><span>'
          + '全国' + full.successFeedbackCount + '/' + full.feedbackCount
          + '</span></div>';
      return str;
    }

    function commentCountHtml(data, type, full, meta) {
      var str = '<div style="white-space:normal;word-wrap:break-word;word-break:break-all;"><span>'
          + full.successCommentCount + '/' + full.commentCount
          + '</span></div>';

      return str;
    }

    function replyTimesHtml(data, type, full, meta) {
      return '<div ng-switch on=' + full.replyTimes + '>' +
          '<span ng-switch-when="0">0</span>' +
          '<span ng-switch-default>已抢单(' + full.replyTimes + ')</span>' +
          '</div>';
    };

    function demandStatus(data, type, full, meta) {
      return '<div ng-switch on="vm.tableData[' + meta.row + '].demandStatus">'
          +
          '<span ng-switch-when="0" >审核中</span>' +
          '<span ng-switch-when="1">审核不通过</span>' +
          '<span ng-switch-when="2">采购中</span>' +
          '<span ng-switch-when="7">待分配</span>' +
          '<span ng-switch-when="3">已完成</span>' +
          '<span ng-switch-when="4">取消</span>' +
          '<span ng-switch-when="5">过期</span>' +
          '<span ng-switch-when="6">已删除</span>' +
          '<span ng-switch-when="8">找版完成</span> ' +
          '<span ng-switch-default>未知</span>' +
          '</div>';
    };

    function platform(data, type, full, meta) {
      return '<div ng-switch on="vm.tableData[' + meta.row + '].platform">' +
          '<span ng-switch-when="0">未设定</span>' +
          '<span ng-switch-when="1">Web</span>' +
          '<span ng-switch-when="2">IOS</span>' +
          '<span ng-switch-when="3">Android</span>' +
          '<span ng-switch-when="4">H5</span>' +
          '<span ng-switch-when="5">Flow</span>' +
          '<span ng-switch-when="6">管理后台</span>' +
          '<span ng-switch-when="7">CRM</span>' +
          '<span ng-switch-when="8">CRM签约</span>' +
          '<span ng-switch-when="9">CRM快捷开店</span>' +
          '<span ng-switch-when="10">CRM代抢单</span>' +
          '<span ng-switch-default>未知</span>';
    };

    function actionsHtml(data, type, full, meta) {

      var str = '';

      var canCancel = true;
      if (full.demandStatus != 2) {
        canCancel = false;
      }

      str +=
          '<div class="m-t-xs m-b-sm"><button class="btn btn-xs btn-w-xs btn-success btn-outline" ng-if="vm.demandDetail"  ng-click="viewDetail(vm.tableData['
          + meta.row + '])">' +
          '    <i class="fa fa-info icon-width">查看详情</i>' +
          '</button>&nbsp;' +
          '<button ng-disabled="' + !full.belongToPurchaseArea + '" '
          + 'class="btn btn-xs btn-w-xs btn-success btn-outline"'
          + ' ng-if="vm.hasMarkModelPermission && '
          + (full.model == 2) + '&&' + (full.isMarkModel == 0) + '&&'
          + (full.demandStatus != 0) + '&&' + (full.demandStatus != 1)
          + '" ng-click="markModel(vm.tableData[' + meta.row + '])">' +
          '    <i class="fa fa-info icon-width">标记收样</i>' +
          '</button>' +
          '<button class="btn btn-xs btn-w-xs btn-danger btn-outline" ng-if="vm.hasMarkModelPermission && '
          + (full.model == 2) + '&&' + (full.isMarkModel == 1
          || full.isMarkModel == 2) + '">'
          + '<i class="fa fa-info icon-width">'
          + full.receiveSampleStatusText
          + '</i>' +
          '</button>' +

          '</div>';

      str += '<div class="m-t-xs m-b-sm">' +

          '<button class="btn btn-xs btn-w-xs btn-success btn-outline" ng-if="vm.demandPick" ng-click="showDemandResult(vm.tableData['
          + meta.row + '])">' +
          '    <i class="fa fa-info icon-width">找版反馈</i>' +
          '</button> &nbsp;' +

          '<button class="btn btn-xs btn-w-xs btn-success btn-outline" ng-if="vm.demandDynamic" ng-click="showDemandDynamic(vm.tableData['
          + meta.row + '])">' +
          '    <i class="fa fa-info icon-width">需求进度</i>' +
          '</button>' +
          '</div>';

      str +=
          '<div class="m-t-xs m-b-sm" ng-if="vm.demandDispatch && dispatchBtnShow('
          + full.demandStatus + ' , ' + full.regionStatus
          + ')">'

          + '<button class="btn btn-xs btn-w-xs btn-success btn-outline" ng-click="dispatch(vm.tableData['
          + meta.row + '])">' +
          '    <i class="fa fa-code-fork  icon-width">分配需求</i>' +
          '</button>&nbsp;'

          + '<button ng-disabled="'
          + '" ng-if="vm.canModifyPurchaseArea"'
          + ' class="btn btn-xs btn-w-xs btn-success btn-outline" ng-click="modifyPurchaseArea(vm.tableData['
          + meta.row + '])">' +
          '    <i class="fa fa-code-fork  icon-width">更改找版区域</i>' +
          '</button>'

          + '</div>';

      str += '<div class="m-t-xs m-b-sm" >' +
          '<button class="btn btn-xs btn-w-xs btn-success btn-outline" ng-if="vm.viewdemandDispatch && '
          + (full.dispatched == 0) + '" ng-click="viewdispatch(vm.tableData['
          + meta.row
          + '])">' +
          '    <i class="fa fa-code-fork  icon-width">查看分配需求</i>' +
          '</button>' +
          '<button class="btn btn-xs btn-w-xs btn-danger btn-outline" ng-if="vm.viewdemandDispatch && '
          + (full.dispatched == 1) + '" ng-click="viewdispatch(vm.tableData['
          + meta.row
          + '])">' +
          '    <i class="fa fa-code-fork  icon-width">查看分配需求</i>' +
          '</button> &nbsp;' +

          '<button class="btn btn-xs btn-w-xs btn-success btn-outline"' +
          'ng-if="vm.canMarkDemandSource" ' +
          ' ng-click="markDemandSource(vm.tableData[' + meta.row + '])">' +
          '    <i class="fa fa-info icon-width">标记来源</i>' +
          '</button>' +
          '</div>';
      str +=
          '<div class="m-t-xs m-b-sm" ng-if="vm.canCancel && ' + canCancel
          + '">'

          + '<button class="btn btn-xs btn-w-xs btn-success'
          + ' btn-outline" ng-click="cancelDemand(vm.tableData['
          + meta.row + '])">' +
          '<i class="fa fa-code-fork  icon-width">取消需求</i>' +
          '</button>'
          + '</div>'
          + '<div class="m-t-xs m-b-sm" >'
          + '<button class="btn btn-xs btn-w-xs btn-success'
          + ' btn-outline" ng-click="lookupDemandQRCode(vm.tableData['
          + meta.row + '])">' +
          '<i class="fa fa-code-fork  icon-width">查看二维码</i>' +
          '</button>'
          + '</div>';

      // 找版完成
      str += '<div class="m-t-xs m-b-sm" ng-if="vm.canCancel && ' + canCancel + '">'
          + '<button class="btn btn-xs btn-w-xs btn-success'
          + '" ng-click="completeDemand('
          + full.demandId + ')">' +
          '<i class="fa fa-check  icon-width"></i> 找版完成' +
          '</button>'
          + '</div>';

      return str;
    };

    $scope.dispatchBtnShow = function (demandStatus, regionStatus) {
      if (demandStatus == 2 && regionStatus == 1) {
        return true;
      }

      return true;
    };

    function serverData(sSource, aoData, fnCallback, oSettings) {

      var draw = aoData[0].value;
      var sortColumn = $scope.dtColumns[parseInt(
          aoData[2].value[0].column)].mData;
      var sortDir = aoData[2].value[0].dir;
      var start = aoData[3].value;
      var limit = aoData[4].value;

      var form = $(oSettings.nTableWrapper).closest('#gridcontroller').find(
          'form');
      var queryConditionObject = getQueryParams(form, vm.tabFilter);

      if (!isEmpty(params)) {
        queryConditionObject.rules.push(
            {"field": "kpi", "value": JSON.stringify(params), "op": "equal"});
        queryConditionObject.rules.splice(0, 1);
      }

      if (vm.outHide == '') {
        queryConditionObject.rules.push(
            {"field": "d.out_hide", "value": 0, "op": "equal"});
      }

      if (vm.clickDemandNumBtn) {
        queryConditionObject.rules.splice(0, queryConditionObject.rules.length);
        queryConditionObject.rules.push(
            {
              "field": "clickDemandNum",
              "value": vm.clickDemandNumData,
              "op": "like"
            });
      }

      var where = JSON.stringify(queryConditionObject);

      return demandMgmtService.getDemandList(draw, sortColumn, sortDir, start,
          limit, where)
      .then(
          function (resp) {
            fnCallback(resp.data);
            vm.tableData = resp.data.data.list;
          }).finally(function () {
        $scope.queryBtnDisabled = false;
      });
    };

    $scope.lookupDemandQRCode = function (rowObj) {
      if(rowObj == null){
        toaster.error("需求id为空");
        return ;
      }

      var demandId = rowObj.demandId;

      var modalInstance = $uibModal.open({
        templateUrl: 'app/demand-mgmt/modal/print-demand-qr-code.html?v=' + LG.appConfig.clientVersion,
        keyboard: false,
        controller: 'printDemandQrCodeModalCtrl',
        resolve: {
          demandId: function () {
            return demandId;
          }
        }
      });

    }

    $scope.rootCategoryOnChange = function (categoryId) {
      demandMgmtService.getSubCategory(categoryId)
      .then(function (resp) {
        vm.categoryOpts = resp.data.data.list;
      });
    };

    $scope.submit = function () {
      params = null;
      $scope.queryBtnDisabled = true;
      $scope.dtInstance.reloadData();
    };

    $scope.clear = function () {

      vm.demandIdStr = vm.userMobile = '';
      vm.startDate = vm.endDate = '';
      vm.publishDate = '';
      vm.auditStatusStr = vm.replyTypeStr = '';
      vm.purchaseArea = '';
      vm.userName = '';
      vm.rootCategoryStr = vm.mainCategoryStr = -1;
      vm.isReplace = '';
      vm.regionId = '';
      vm.crmBuyerId = '';
      vm.reply = '';
      vm.receiveSample = '';
      vm.sourceCode = '';
      vm.outHide = '';
      vm.pickUserCount = vm.commentPickCount = vm.feedbackCount = '';
      vm.auditSwitch = 'false';
      vm.clickDemandNumBtn = false;
      params = null;
      $scope.dtInstance.reloadData();
    };

    $scope.dispatch = function (rowObj) {

      //只有进行中的需求才能进行 任务分配
      if (rowObj.demandStatus != 2 && rowObj.demandStatus != 7) {
        toaster.pop({
          type: 'warning',
          title: '提示信息',
          body: '此需求状态不在进行中！',
          showCloseButton: true,
          timeout: 5000
        });

        return;
      }
      ;

      demandMgmtService.getUserList(rowObj.demandId)
      .then(function successCallback(response) {
        $scope.lastDemandId = '';
        //var modalInstance;
        var userList = response.data.data["list"];
        $scope.userList = userList;
        var dispatchButtonOnShow = true;
        $scope.dispatchButtonOnShow = dispatchButtonOnShow;

        var modalInstance = $uibModal.open(
            {
              templateUrl: 'app/demand-mgmt/modal/user-query.html?v='
              + LG.appConfig.clientVersion,
              size: 'lg',
              keyboard: false,
              controller: 'UserDispatchModalCtrl',
              resolve: {
                rootScope: function () {
                  return rootScope;
                },
                rowObj: function () {
                  return rowObj;
                },
                userList: function () {
                  return userList;
                },
                dispatchButtonOnShow: function () {
                  return dispatchButtonOnShow;
                },
              }
            });
      });
    };

    $scope.viewdispatch = function (rowObj) {

      demandMgmtService.getUserListByAll(rowObj.demandId)
      .then(function successCallback(response) {
        $scope.lastDemandId = '';
        //var modalInstance;
        var userList = response.data.data["list"];
        $scope.userList = userList;
        var dispatchButtonOnShow = false;
        $scope.dispatchButtonOnShow = dispatchButtonOnShow;

        var modalInstance = $uibModal.open(
            {
              templateUrl: 'app/demand-mgmt/modal/user-query.html?v='
              + LG.appConfig.clientVersion,
              size: 'lg',
              keyboard: false,
              controller: 'UserDispatchModalCtrl',
              resolve: {
                rootScope: function () {
                  return rootScope;
                },
                rowObj: function () {
                  return rowObj;
                },
                userList: function () {
                  return userList;
                },
                dispatchButtonOnShow: function () {
                  return dispatchButtonOnShow;
                },
              }
            });
      });
    };

    $scope.undispatch = function (rowObj) {

      var dispatchedTaskList = [];

      demandMgmtService.getDispatchTaskList(rowObj.demandId)
      .then(function successCallback(response) {
        dispatchedTaskList = response.data.data.list;
      });

      var dispatchedUserList = [];

      demandMgmtService.queryDispatchedUserList(rowObj.demandId)
      .then(function successCallback(response) {
        dispatchedUserList = response.data.data.list;
        var modalInstance;
        modalInstance = $uibModal.open(
            {
              templateUrl: 'app/demand-mgmt/modal/cancel-dispatch.html?v='
              + LG.appConfig.clientVersion,
              size: 'lg',
              keyboard: false,
              controller: 'UserUnDispatchModalCtrl',
              resolve: {
                rootScope: function () {
                  return rootScope;
                },
                rowObj: function () {
                  return rowObj;
                },
                dispatchedUserList: function () {
                  return dispatchedUserList;
                },
                dispatchedTaskList: function () {
                  return dispatchedTaskList;
                }
              }

            });
      });
    };

    $scope.viewReplyList = function (rowObj) {

      var modalInstance = $uibModal.open(
          {
            templateUrl: 'app/demand-mgmt/modal/demandReply.html?v='
            + LG.appConfig.clientVersion,
            size: 'lg',
            keyboard: false,
            controller: 'ReplyModalCtrl',
            resolve: {
              rowObj: function () {
                return rowObj;
              },
              domain: function () {
                return vm.domain;
              }
            }

          });
    };

    //查看需求详情
    $scope.viewDetail = function (rowObj) {

      demandMgmtService.getDemandDetail(rowObj.demandId)
      .then(function successCallback(response) {
        if (response.data.code == 200) {
          var modalInstance = $uibModal.open(
              {
                templateUrl: 'app/demand-mgmt/modal/demandDetail.html?v='
                + LG.appConfig.clientVersion,
                size: 'lg',
                keyboard: false,
                controller: 'DetailModalCtrl',
                resolve: {

                  rowObj: function () {
                    return rowObj;
                  },
                  demandId: function () {
                    return rowObj.demandId;
                  },
                  demandBean: function () {
                    return response.data.data.demandBean;
                  },
                  domain: function () {
                    return vm.domain;
                  },
                  itemDomain: function () {
                    return vm.itemDomain;
                  }
                }

              });
        }
        else {
          toaster.pop({
            type: 'warning',
            title: '提示信息',
            body: '查看的需求不存在！',
            showCloseButton: true,
            timeout: 5000
          });
        }

      });
    };

    //查看需求找版反馈
    $scope.showDemandResult = function (rowObj) {
      var replyList = [];
      demandMgmtService.getReplyList(rowObj.demandId).then(function (resp) {
        if (resp.data.code == 200) {
          replyList = resp.data.data;
          demandMgmtService.getDemandFeedbackList(rowObj.demandId).then(
              function (response) {
                if (response.data.code == 200) {
                  var modalInstance = $uibModal.open(
                      {
                        templateUrl: 'app/demand-mgmt/modal/demandResult.html?v='
                        + LG.appConfig.clientVersion,
                        size: 'lg',
                        keyboard: false,
                        controller: 'DemandResultCtrl',
                        resolve: {
                          demandId: function () {
                            return rowObj.demandId;
                          },
                          feedbackList: function () {
                            return response.data.data.list;
                          },
                          replyList: function () {
                            return replyList;
                          },
                          itemDomain: function () {
                            return vm.itemDomain;
                          }
                        }
                      });
                }
              });
        }
      })

    };

    $scope.showDemandDynamic = function (rowObj) {
      demandMgmtService.getDemandDynamicList(rowObj.demandId, 1)
      .then(function successCallback(response) {

        $uibModal.open({
          templateUrl: 'app/demand-mgmt/modal/demandDynamic.html?v='
          + LG.appConfig.clientVersion,
          size: 'lg',
          keyboard: false,
          controller: 'DemandDynamicCtl',
          resolve: {
            pageModel: function () {
              return response.data.data;
            },
            demandId: function () {
              return rowObj.demandId
            }
          }
        });
      });
    };

    $scope.markModel = function (rowObject) {

      var modalInstance = $uibModal.open(
          {
            templateUrl: 'app/demand-mgmt/modal/markModel.html?v='
            + LG.appConfig.clientVersion,
            keyboard: false,
            controller: function ($scope, $uibModal,
                $uibModalInstance,
                $compile,
                demandMgmtService, toaster,
                demandId, opener) {

              $scope.modal = {};
              $scope.modal.receiveSampleStatus = 1;

              $scope.ok = function () {
                $scope.okBtnDisabled = true;
                demandMgmtService.markModel(demandId,
                    $scope.modal.receiveSampleStatus, $scope.modal.remark)
                .then(
                    function successCallback(response) {
                      demandMgmtService.showMessage(response.data.message,
                          '操作提示', 'success');
                    })
                .finally(
                    function () {
                      $uibModalInstance.close();
                      opener.dtInstance.reloadData();
                      $scope.okBtnDisabled = false;
                    }
                );
              };

              $scope.cancel = function () {
                $uibModalInstance.dismiss('cancel');
              };

            },
            resolve: {
              demandId: function () {
                return rowObject.demandId
              },
              opener: function () {
                return $scope;
              }
            }
          });
    };

    $scope.markDemandSource = function (rowObject) {

      demandMgmtService.getDemandSourceOptions().then(
          function successCallback(response) {
            vm.demandSourceOptions = response.data.data;
          });

      var modalInstance = $uibModal.open(
          {
            templateUrl: 'app/demand-mgmt/modal/markDemandSource.html?v='
            + LG.appConfig.clientVersion,
            keyboard: false,
            controller: function ($scope, $uibModal,
                $uibModalInstance, demandMgmtService,
                toaster, rowObject, demandSourceOptions) {

              var demandId = rowObject.demandId;
              $scope.modal = {};
              $scope.modal.demandSourceOptions = demandSourceOptions;
              $scope.modal.defaultOption = rowObject.sourceCode;
              $scope.modal.newOption = rowObject.sourceCode;

              $scope.ok = function () {
                var sourceName = rowObject.sourceName;
                demandSourceOptions.forEach(function (val) {
                  if ($scope.modal.newOption == val.sourceCode) {
                    sourceName = val.sourceName;
                  }
                });

                demandMgmtService.markDemandSource(demandId,
                    $scope.modal.newOption, sourceName)
                .then(function successCallback(response) {
                  toaster.pop(
                      {
                        type: response.data.code == 200 ? 'success'
                            : 'error',
                        title: '操作提示',
                        body: response.data.message,
                        showCloseButton: true,
                        timeout: 5000
                      });

                }).finally(function () {
                  $uibModalInstance.close();

                });
              };

              $scope.cancel = function () {
                $uibModalInstance.dismiss('cancel');
              };

            },
            resolve: {
              rowObject: function () {
                return rowObject
              },
              demandSourceOptions: function () {
                return vm.demandSourceOptions;
              }
            }
          });

      modalInstance.result.then(function (result) {

        $scope.dtInstance.reloadData(function () {
        }, false);
      }, function (reason) {
      });

    };

    $scope.modifyPurchaseArea = function (rowObj) {
      var modalInstance = $uibModal.open(
          {
            templateUrl: 'app/demand-mgmt/modal/modifyPurchaseArea.html?v='
            + LG.appConfig.clientVersion,
            keyboard: false,
            controller: 'DemandAreaCtrl',
            resolve: {
              rowObj: function () {
                return rowObj;
              },
              purchaseAreaList: function () {
                return $scope.modal.purchaseArea;
              }
            }
          });

      modalInstance.result.then(function (result) {

        $scope.dtInstance.reloadData(function () {
        }, false);
      }, function (reason) {
      });
    };

    $scope.getNotInPrivateDemands = function (data) {
      vm.clickDemandNumBtn = true;
      vm.clickDemandNumData = data;
      params = null;
      $scope.queryBtnDisabled = true;
      $scope.dtInstance.reloadData();
    };

    $scope.closeTimer = function () {
      if (!isEmpty(vm.timer)) {
        $interval.cancel(vm.timer);
        vm.timer = null;
      }
    }

    $scope.openTimer = function () {
      if (isEmpty(vm.timer)) {
        timer();
      }
    }

    $scope.cancelDemand = function (rowObj) {

      var modalInstance = $uibModal.open(
          {
            templateUrl: 'app/demand-mgmt/modal/cancelDemand.html?v='
            + LG.appConfig.clientVersion,
            keyboard: false,
            controller: function ($scope, $uibModal,
                $uibModalInstance, demandMgmtService,
                toaster, demandId) {

              $scope.modal = {};
              $scope.modal.cancelReason = "";

              $scope.ok = function () {

                if (isEmpty($scope.modal.cancelReason)) {
                  toaster.pop(
                      {
                        type: 'warning',
                        title: '操作提示',
                        body: '请填写取消原因',
                        showCloseButton: true,
                        timeout: 5000
                      });
                  return;
                }

                if ($scope.modal.cancelReason.length > 20) {
                  toaster.pop(
                      {
                        type: 'warning',
                        title: '操作提示',
                        body: '取消原因最多20个字符',
                        showCloseButton: true,
                        timeout: 5000
                      });
                  return;
                }

                demandMgmtService.cancelDemand(demandId,
                    $scope.modal.cancelReason)
                .then(function successCallback(response) {
                  toaster.pop(
                      {
                        type: response.data.code == 200 ? 'success'
                            : 'error',
                        title: '操作提示',
                        body: response.data.message,
                        showCloseButton: true,
                        timeout: 5000
                      });

                }).finally(function () {
                  $uibModalInstance.close();

                });
              };

              $scope.cancel = function () {
                $uibModalInstance.dismiss('cancel');
              };

            },
            resolve: {
              demandId: function () {
                return rowObj.demandId;
              }
            }
          });

      modalInstance.result.then(function (result) {

        $scope.dtInstance.reloadData(function () {
        }, false);
      }, function (reason) {
      });
    }

    // 找版完成
    $scope.completeDemand = function (demandId) {
        demandMgmtService.completeDemand(demandId).then(function (response) {
            toaster.pop({
                    type: response.data.code == 200 ? 'success' : 'error',
                    title: '操作提示',
                    body: response.data.message,
                    showCloseButton: true,
                    timeout: 5000
                });
            if(response.data.code == 200){
                $scope.submit();
            }
        })
    }
  }

  angular
  .module('app.demand-mgmt')
  .controller('DemandMgmtCtrl', DemandMgmtCtrl);

})();