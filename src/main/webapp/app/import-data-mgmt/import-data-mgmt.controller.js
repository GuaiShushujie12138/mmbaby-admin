/**
 * Created by zhenyu on 2016/9/20.
 */

(function () {

    'use strict';

  importDataMgmtCtrl.$inject = ['$scope',
    '$filter', '$compile', 'toaster',
    'importDataMgmtService', 'DTOptionsBuilder', 'DTColumnBuilder', 'Upload'];

  function importDataMgmtCtrl($scope,
      $filter, $compile,toaster,
      importDataMgmtService,DTOptionsBuilder, DTColumnBuilder, Upload) {

    var vm = this;

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
    .withOption('lengthMenu', [10, 25, 50, 100, 200])
    .withOption('displayLength', 10)
    .withPaginationType('full_numbers')
    // .withOption('rowCallback', rowCallback)
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
      DTColumnBuilder.newColumn('id').withTitle('id').withClass(
          'func-th').withOption("width", "120px").notVisible(),
      DTColumnBuilder.newColumn('orderCode').withTitle('编号').withClass(
          'func-th').withOption("width", "120px"),
      DTColumnBuilder.newColumn('recordDate').withTitle('日期').withClass(
          'func-th').withOption("width", "120px").renderWith(dateHtml),
      DTColumnBuilder.newColumn('sellerRegion').withTitle('区域').withClass(
          'func-th').withOption("width", "120px").notSortable(),
      DTColumnBuilder.newColumn('buyerMobile').withTitle('买家手机号').withClass(
          'func-th').withOption("width", "120px").notSortable(),
      DTColumnBuilder.newColumn('seller').withTitle('销售员').withClass(
          'func-th').withOption("width", "120px").notSortable(),
      DTColumnBuilder.newColumn('sellerEmployeeNo').withTitle('销售工号').withClass(
          'func-th').withOption("width", "120px"),
      DTColumnBuilder.newColumn('itemId').withTitle('商品ID').withClass(
          'func-th').withOption("width", "120px"),
      DTColumnBuilder.newColumn('shopName').withTitle('商家名称').withClass(
          'func-th').withOption("width", "120px").notSortable(),
      DTColumnBuilder.newColumn('productName').withTitle('品名').withClass(
          'func-th').withOption("width", "120px"),
      DTColumnBuilder.newColumn('itemCode').withTitle('货号').withClass(
          'func-th').withOption("width", "120px"),
      DTColumnBuilder.newColumn('color').withTitle('颜色').withClass(
          'func-th').withOption("width", "120px"),
      DTColumnBuilder.newColumn('colorNo').withTitle('色号').withClass(
          'func-th').withOption("width", "120px"),
      DTColumnBuilder.newColumn('quantity').withTitle('数量').withClass(
          'func-th').withOption("width", "120px"),
      DTColumnBuilder.newColumn('unit').withTitle('单位').withClass(
          'func-th').withOption("width", "120px"),
      DTColumnBuilder.newColumn('price').withTitle('剪版单价').withClass(
          'func-th').withOption("width", "120px"),
      DTColumnBuilder.newColumn('totalFee').withTitle('剪版总额').withClass(
          'func-th').withOption("width", "120px"),
      DTColumnBuilder.newColumn('sendDate').withTitle('寄出日期').withClass(
          'func-th').withOption("width", "120px").renderWith(dateHtml),
      DTColumnBuilder.newColumn('followRegion').withTitle('跟进人区域').withClass(
          'func-th').withOption("width", "120px"),
      DTColumnBuilder.newColumn('followUser').withTitle('跟进人').withClass(
          'func-th').withOption("width", "120px").notSortable(),
      DTColumnBuilder.newColumn('followEmployee').withTitle('跟进人工号').withClass(
          'func-th').withOption("width", "120px"),
      DTColumnBuilder.newColumn('remark').withTitle('备注').withClass(
          'func-th').withOption("width", "120px").notSortable(),
      DTColumnBuilder.newColumn('createTime').withTitle('导入时间').withClass(
          'func-th').withOption("width", "120px").renderWith(timeHtml)



    ];


    function dateHtml(data, type, full, meta) {

      if (data == null || data == '') {
        return "";
      }

      return $filter('date')(data, 'yyyy-MM-dd');
    }

    function timeHtml(data, type, full, meta) {

      if (data == null || data == '') {
        return "";
      }

      return $filter('date')(data, 'yyyy-MM-dd HH:mm:ss');
    }

    function serverData(sSource, aoData, fnCallback, oSettings) {

      var draw = aoData[0].value;
      // var sortColumn = $scope.dtColumns[parseInt(
      //     aoData[2].value[0].column)].mData;
      var sortColumn = "id";
      var sortDir = aoData[2].value[0].dir;
      var start = aoData[3].value;
      var limit = aoData[4].value;

      var form = $(oSettings.nTableWrapper).closest('#gridcontroller').find(
          'form');
      var queryConditionObject = getQueryParams(form, []);

      var where = JSON.stringify(queryConditionObject);

      return importDataMgmtService.getImportList(draw, sortColumn, sortDir,
          start,
          limit, where)
      .then(
          function (resp) {
            fnCallback(resp.data);
            vm.tableData = resp.data.data.list;
          }).finally(function () {
        $scope.queryBtnDisabled = false;
      });
    }

    $scope.submit = function () {
      $scope.queryBtnDisabled = true;
      $scope.dtInstance.reloadData();
    };


    vm.tips = [];

    $scope.file;
    $scope.fileName = '';
    $scope.selectFile = function (files) {
      if (files && files.length) {
        if (files.length > 1) {
          throw new Error("只能上传一个excel文件!");
        }
        try {
          $scope.file = files[0];
          $scope.fileName = files[0].name;
          if ($scope.fileName == '') {
            throw new Error("文件名错误!");
          }
        } catch (e) {
          console.log(e);
          importDataMgmtService.showMessage('错误', e.name + ": " + e.message,
              'error');
        }
      }
    };

    $scope.upload = function () {

      if ($scope.file) {
        $scope.uploadDisable = true;
        Upload.upload({
          url: 'upload/uploadFile',
          file: $scope.file
        }).then(function successCallback(response) {
              if (response.data.code == 200) {
                importDataMgmtService.showMessage('数据保存成功', response.data.message,
                    "success");
                vm.tips = [];
                $scope.submit();
              }
            }
            , function errorCallback(response) {
              var errlist = response.data.data.uploadLogErrorDtoList;
              if (errlist) {
                var tipList = [];
                errlist.forEach(function (err) {
                  tipList.push(
                      "第[" + err.rowIndex + "]行数据错误，原因:[" + err.errorMsg + "]");
                });
                vm.tips = tipList;
              }else {
                vm.tips = [];
              }
            }).finally(function () {
          $scope.uploadDisable = false;
        })
      }
    };

  }
    angular
        .module('app.import-data-mgmt')
        .controller('importDataMgmtCtrl', importDataMgmtCtrl);

})();