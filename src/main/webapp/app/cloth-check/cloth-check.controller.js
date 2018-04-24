(function () {

  'use strict';

  ClothCheckCtrl.$inject = ['$scope', '$http', '$uibModal', 'toaster',
    '$compile', '$filter', '$location', 'clothCheckService', 'DTOptionsBuilder',
    'DTColumnBuilder', '$state'];

  function ClothCheckCtrl($scope, $http, $uibModal, toaster, $compile, $filter,
      $location, clothCheckService, DTOptionsBuilder, DTColumnBuilder, $state) {

    var vm = this;
    var params = $location.search();

    vm.clothStoreSelect = [];
    vm.isDeclare = 0;
    // vm.treeData = [];
    $scope.treeConfig = {
      'version': 1,
      'plugins': ['types'],
      'types': {
        'default': {
          'icon': 'fa fa-folder'
        }, 'html': {
          'icon': 'fa fa-file-code-o'
        }, 'svg': {
          'icon': 'fa fa-file-picture-o'
        }, 'css': {
          'icon': 'fa fa-file-code-o'
        }, 'img': {
          'icon': 'fa fa-file-image-o'
        }, 'js': {
          'icon': 'fa fa-file-text-o'
        }

      }
    };

    init();

    function init() {
      vm.sortColumn = "createTime";
      vm.limit = 10;
      vm.sortDir = "desc";
      vm.start = 0;
      vm.draw = 1;
      var startDate = new Date();
      startDate.setDate(startDate.getDate() - 6);
      vm.startDate = $filter('date')(startDate, 'yyyy-MM-dd') + " 00:00:00";
      var endDate = new Date();
      endDate.setDate(endDate.getDate() + 6);
      vm.endDate = $filter('date')(endDate, 'yyyy-MM-dd') + " 23:59:59";

      vm.validateDateRange = {
        startDate: vm.startDate,
        endDate: vm.endDate
      };

      $scope.$watch('vm.validateDateRange', function (newVal, oldVal) {
        if (newVal) {
          vm.startDate = moment(newVal.startDate, "YYYY-MM-DD hh:mm:ss").format(
              "YYYY-MM-DD HH:mm:ss");
          vm.endDate = moment(newVal.endDate, "YYYY-MM-DD hh:mm:ss").format(
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

      vm.clothCheckStatusSelect = [
          { key: '0', value: '未知' },
          { key: '1', value: '待入库'},
          { key: '2', value: '验布中'},
          { key: '3', value: '部分发货'},
          { key: '4', value: '全部发货'},
          { key: '5', value: '验布关闭'},
          { key: '6', value: '验布取消'}
      ];

      clothCheckService.getClothStore().then(function (resp) {
        vm.clothStoreSelect = resp.data.data;
      });

      //获取组织结构
      clothCheckService.queryDeptTree().then(function (resp) {
        if (resp.data.code == 200) {
          var treeData = resp.data.data;
          $scope.treeData = treeData;
          //重绘
          $scope.treeConfig.version++;
        } else {
          toaster.pop({
            type: 'info',
            title: '提示信息',
            body: resp.data.message,
            showCloseButton: true,
            timeout: 5000
          });
        }
      })


    }

    $scope.selectTreeNode = function (nodedata) {
      $scope.submit();
    };

    $scope.dtInstance = {};

    $scope.dtOptions = DTOptionsBuilder
    .fromSource('')
    .withFnServerData(serverData)
    .withDataProp('data')
    .withOption('serverSide', true)
    .withOption('searching', false)
    .withOption('lengthChange', true)
    .withDOM('frtlip')
    .withOption('autoWidth', true)
    .withOption('scrollX', true)
    .withOption('lengthMenu', [10, 25, 50, 100, 200])
    .withOption('displayLength', 10)
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
      DTColumnBuilder.newColumn(null).withTitle('操作').notSortable()
          .withOption('width', '40px').renderWith(actionsHtml),
      DTColumnBuilder.newColumn('lsTradeId').withTitle('链尚订单ID')
      .withClass('func-th'),
      DTColumnBuilder.newColumn('createTime').withTitle('创建时间')
      .withClass('func-th')
      .renderWith(timeHtml),
      DTColumnBuilder.newColumn('buyerOperatorName').withTitle('买家运营')
      .withClass('func-th').notSortable(),
      DTColumnBuilder.newColumn('sellerOperatorName').withTitle('卖家运营')
      .withClass('func-th').notSortable(),
      DTColumnBuilder.newColumn('clothStoreId').withTitle('验布坊')
      .withClass('func-th').notSortable().renderWith(clothStoreHtml),
      DTColumnBuilder.newColumn('clothOrderNo').withTitle('验布订单')
      .withClass('func-th').notSortable(),
      DTColumnBuilder.newColumn('reduceOrderStatusText').withTitle('验布状态')
      .withClass('func-th').notSortable(),
      DTColumnBuilder.newColumn('requireCompletionTime').withTitle('要求发货时间')
      .withClass('func-th').notSortable()
      .renderWith(requireHtml),
      DTColumnBuilder.newColumn('trailUrl').withTitle('操作')
          .withClass('func-th').notSortable()
          .renderWith(orderoperatingHtml),
    ];

    function actionsHtml(data, type, full, meta) {
      var html = "";
      if(vm.isDeclare != 1){
        html += '<button type="button" ng-click="goClothRecord('+ full.lsTradeId +')" class="btn btn-primary btn-xs">验布登记</button>'
      }else {
        if(full.clothOrderStatus == 4){
          html += '<button type="button" ng-click="fixClothRecord('+ full.lsTradeId +')" class="btn btn-info btn-xs">修改</button>';
          html += '<button type="button" ng-click="closeClothRecord('+ full.lsTradeId +')" class="btn btn-danger btn-xs">取消</button>';
        }
        html += '<button type="button" ng-click="lookClothRecord('+ full.lsTradeId +')" class="btn btn-success btn-xs">查看</button>';
      }
      return html
    }

    function orderoperatingHtml(data, type, full, meta) {
      return '<a href="'+data+'" target="_blank">订单跟踪</a>'
    }

    function requireHtml(data, type, full, meta) {
      if(full.requireCompletionType==1) {
        return "当日发货";
      }else if(full.requireCompletionType == 2){
        return "次日发货";
      }else{
        return data;
      }
    }

    function clothStoreHtml(data, type, full, meta) {
      if(data == 1) {
        return "绍兴万商路店";
      }else if(data == 2){
        return "广州交易园店";
      }else if(data == 3){
        return "广州珠江店";
      }else if(data == 4){
        return "绍兴南区市场店";
      }
      return '--'
    }
    
    function timeHtml(data, type, full, meta) {

      if (data == null || data == '') {
        return "";
      }

      return $filter('date')(data, 'yyyy-MM-dd HH:mm:ss');
    }

    function serverData(sSource, aoData, fnCallback, oSettings) {
      var draw = aoData[0].value;
      aoData = aoData || [];
      var start = aoData[3].value;
      var limit = aoData[4].value;

      var createTime = vm.startDate + ' - ' + vm.endDate;
      var deptId = $scope.treeInstance.jstree(true).get_selected();
      var searchData = {
        draw: draw || 0,
        tradeId: vm.tradeId || '',
        createTime: createTime || '',
        isDeclare: vm.isDeclare,
        status: vm.ClothCheckStatus || '',
        storeId: vm.auditStatus || '',
        pageId: start/limit,
        pageSize: limit,
        deptId: deptId[0] || '111',
      };

      return clothCheckService.search(searchData).then(function (resp) {
        fnCallback(resp.data);
        vm.tableData = resp.data.data;
      }).finally(function () {
        $scope.queryBtnDisabled = false;
      });
    }

    $scope.submit = function () {
      $scope.queryBtnDisabled = true;
      $scope.dtInstance.reloadData();
      params = null;
    };
    $scope.isDeclare = function (off) {
      vm.isDeclare = off;
      $scope.submit();
    };

    //验布登记
    $scope.goClothRecord = function (lsTradeId) {
      openClothRecord(lsTradeId,1)
    };
    //修改
    $scope.fixClothRecord = function (lsTradeId) {
      openClothRecord(lsTradeId,2)
    };
    //查看
    $scope.lookClothRecord = function (lsTradeId) {
      openClothRecord(lsTradeId,3)
    };

    // 取消
    $scope.closeClothRecord = function (lsTradeId) {
      var modalInstance = $uibModal.open({
        templateUrl: 'app/cloth-check/modal/closeClothRecord.html?v='
        + LG.appConfig.clientVersion,
        size: 'md',
        controller: 'closeClothRecordCtrl',
        resolve: {
          lsTradeId: function () {
            return lsTradeId;
          }
        }
      });
      modalInstance.result.then(function (result) {
        setTimeout(function () {
          $scope.submit();
        },1000);
      }, function (reason) {

      });
    };

    //clothType:1验布登记, 2修改, 3查看
    function openClothRecord(lsTradeId,clothType) {
      var modalInstance = $uibModal.open({
        templateUrl: 'app/cloth-check/modal/clothRecord.html?v='
        + LG.appConfig.clientVersion,
        windowClass: 'large-Modal',
        keyboard: false,
        controller: 'clothRecordCtrl',
        resolve: {
          lsTradeId: function () {
            return lsTradeId;
          },
          clothType: function () {
            return clothType;
          }
        }
      });
      modalInstance.result.then(function (result) {
        setTimeout(function () {
          $scope.submit();
        },1000);
      }, function (reason) {

      });
    }

  }

  angular
  .module('app.cloth-check')
  .controller('ClothCheckCtrl', ClothCheckCtrl);
})();