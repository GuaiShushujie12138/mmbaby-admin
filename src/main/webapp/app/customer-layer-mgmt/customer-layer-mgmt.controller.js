(function () {
  'use strict';

  CustomerLayerMgmtCtrl.$inject = ['$scope', '$timeout', '$http', '$uibModal',
    '$filter', '$compile', 'toaster', 'customerLayerService',
    'DTOptionsBuilder',
    'DTColumnBuilder', 'DTColumnDefBuilder', 'permissionCheckService',
    'customerType'];

  function CustomerLayerMgmtCtrl($scope, $timeout, $http, $uibModal, $filter,
      $compile,
      toaster, customerLayerService, DTOptionsBuilder, DTColumnBuilder,
      DTColumnDefBuilder, permissionCheckService, customerType) {
    var vm = this;
    vm.customerType = customerType;
    $scope.modal = {};
    vm.conditionSelect = [];//条件筛选项
    vm.operatorSelect = [];//运算符筛选项
    var conditionMap = {0: ""};//条件映射
    var operatorMap = {0: ""};//运算符映射
    var matchTypeMap = {1: '全部', 2: '任何'};
    vm.tableData = [];
    var roleList = [];

    vm.canAddLayer = permissionCheckService.check(
            "WEB.CUSTOMER-LAYER.BUYER.ADD")
        || permissionCheckService.check("WEB.CUSTOMER-LAYER.SELLER.ADD");
    vm.canEditLayer = permissionCheckService.check(
            "WEB.CUSTOMER-LAYER.BUYER.EDIT")
        || permissionCheckService.check("WEB.CUSTOMER-LAYER.SELLER.EDIT");

    vm.canDeleteLayer = permissionCheckService.check(
            "WEB.CUSTOMER-LAYER.BUYER.DELETE")
        || permissionCheckService.check("WEB.CUSTOMER-LAYER.SELLER.DELETE");

    vm.canSetReleaseStrategy = permissionCheckService.check(
            "WEB.CUSTOMER-LAYER.BUYER.RELEASE-STRATEGY")
        || permissionCheckService.check(
            "WEB.CUSTOMER-LAYER.SELLER.RELEASE-STRATEGY");

    vm.canSetWhiteList = permissionCheckService.check(
            "WEB.CUSTOMER-LAYER.BUYER.WHITE-LIST")
        || permissionCheckService.check("WEB.CUSTOMER-LAYER.SELLER.WHITE-LIST");

    vm.canLimitCount = permissionCheckService.check(
            "WEB.CUSTOMER-LAYER.BUYER.LIMIT-COUNT")
        || permissionCheckService.check(
            "WEB.CUSTOMER-LAYER.SELLER.LIMIT-COUNT");

    init();
    function init() {

      customerLayerService.getConditionSelect().then(function (resp) {
        vm.conditionSelect = resp.data.data;
        vm.conditionSelect.forEach(function (condition) {
          conditionMap[condition.key] = condition.value;
        });
      });

      customerLayerService.getOperatorSelect().then(function (resp) {
        vm.operatorSelect = resp.data.data;
        vm.operatorSelect.forEach(function (operator) {
          operatorMap[operator.key] = operator.value;
        });
      });

      customerLayerService.getRoleList()
      .then(function (resp) {
        roleList = resp.data.data;
      });
    }

    $scope.dtInstance = {};
    $scope.dtOptions = DTOptionsBuilder
    .fromSource('')
    .withFnServerData(serverData)
    .withDataProp('list')
    .withDOM('frtl')
    .withOption('serverSide', true)
    .withOption('searching', false)
    .withOption('lengthChange', false)
    .withOption('autoWidth', false)
    .withOption('scrollX', true)
    .withOption('displayLength', 1000)
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
      DTColumnBuilder.newColumn('id').withTitle('序列号').withClass(
          'func-th').withOption("width", "50px").notSortable(),
      DTColumnBuilder.newColumn('name').withTitle('名称').withClass(
          'func-th').withOption("width", "50px").notSortable(),
      DTColumnBuilder.newColumn('').withTitle('定义').withClass(
          'func-th').withOption("width", "200px").notSortable().renderWith(
          defineStrHtml),
      DTColumnBuilder.newColumn('description').withClass('func-th').withOption(
          "width", "100px").notSortable().withTitle('描述').renderWith(
          descriptionHtml),
      DTColumnBuilder.newColumn('weight').withClass('func-th').withOption(
          "width", "100px").notSortable().withTitle('权重'),
      DTColumnBuilder.newColumn(null).withTitle('操作').withOption("width",
          "100px").withClass('text-center p-w-xxs-i').notSortable()
      .renderWith(operateHtml)
    ];

    function operateHtml(data, type, full, meta) {

      var str = '<div class="m-t-xs m-b-sm">';

      str += '<button ng-if="vm.canEditLayer"'
          + '  class="btn btn-xs btn-primary"'
          + ' ng-click="saveLayer(vm.tableData[' + meta.row + '])">' + '编辑'
          + '</button>&nbsp;';

      str += '<button ng-if="vm.canDeleteLayer"  class="btn btn-xs btn-danger"'
          + ' ng-click="deleteLayer(vm.tableData[' + meta.row + '])">' + '删除'
          + '</button>';

      str += '</div>';

      return str;
    }

    function descriptionHtml(data, type, full, meta) {
      var str = '<div style="white-space:normal;word-wrap:break-word;word-break:break-all;"><span>'
          + full.description + '</span></div>';

      return str;
    }

    function defineStrHtml(data, type, full, meta) {

      var str = '<div style="white-space:normal;word-wrap:break-word;word-break:break-all;"><span>'
          + '符合' + matchTypeMap[full.matchType] + '以下条件：</span><br/>';

      full.conditions.forEach(function (condition) {
        str += '<span>' + condition.days + '天内'
            + conditionMap[condition.conditionType]
            + operatorMap[condition.operatorType]
            + condition.targetValue + '</span><br/>';
      });
      str += '</div>';
      return str;
    }


    function serverData(sSource, aoData, fnCallback, oSettings) {

      return customerLayerService.getCustomerLayerList(vm.customerType).then(
          function (resp) {
            console.log(resp);
            fnCallback(resp.data.data);
            vm.tableData = resp.data.data.list;
          });
    }

    $scope.saveLayer = function (rowObj) {

      if (isEmpty(rowObj)) {
        var obj = {};
        obj.id = 0;
        obj.matchType = 1;
        obj.conditions = [];
        obj.name = "";
        obj.description = "";
        rowObj = obj;
      }

      if (rowObj.conditions.length == 0) {
        var emptyCondition = {};
        emptyCondition.layerId = rowObj.id;
        emptyCondition.days = 0;
        emptyCondition.conditionType = 1;
        emptyCondition.operatorType = 1;
        emptyCondition.targetValue = '';
        rowObj.conditions.push(emptyCondition);
      }

      rowObj.conditions.forEach(function (condition) {
        condition.conditionType = condition.conditionType + '';
        condition.operatorType = condition.operatorType + '';
      })

      var modalInstance = $uibModal.open(
          {
            templateUrl: 'app/customer-layer-mgmt/modal/save-layer-modal.html?v=' + LG.appConfig.clientVersion,
            keyboard: false,
            size: 'lg',
            controller: 'SaveLayerCtrl',
            resolve: {
              rowObject: function () {
                return rowObj;
              },
              conditionSelect: function () {
                return vm.conditionSelect
              },

              operatorSelect: function () {
                return vm.operatorSelect
              },
              customerType: function () {
                return vm.customerType;
              }
            }
          });

      modalInstance.result.then(function (result) {

        $scope.dtInstance.reloadData(function () {
        }, false);
      }, function (reason) {
      });
    };

    $scope.deleteLayer = function (rowObj) {

      var modalInstance = $uibModal.open(
          {
            templateUrl: 'app/customer-layer-mgmt/modal/confirmDelete.html?v=' + LG.appConfig.clientVersion,
            keyboard: false,
            controller: function ($scope, $uibModal,
                $uibModalInstance,
                $compile,
                customerLayerService, toaster, layerId) {

              $scope.ok = function () {
                customerLayerService.deleteLayer(layerId)
                .then(
                    function successCallback(response) {
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
              layerId: function () {
                return rowObj.id;
              }
            }
          });

      modalInstance.result.then(function (result) {

        $scope.dtInstance.reloadData(function () {
        }, false);
      }, function (reason) {
      });
    };

    $scope.limitCount = function () {
      customerLayerService.getLimitCount(vm.customerType).then(function (resp) {
        if (resp.data.code == 200) {
          var limitConditions = [];
          limitConditions = resp.data.data;
          if (isEmpty(limitConditions)){
            var limitCondition = {};
            limitCondition.customerLayers = [];
            limitCondition.limitType = 0;
            limitCondition.limitNum = 0;
            limitCondition.roleId = 0;
            limitConditions.push(limitCondition);
          }

          var modalInstance = $uibModal.open(
              {
                templateUrl: 'app/customer-layer-mgmt/modal/limit-count-modal.html?v=' + LG.appConfig.clientVersion,
                keyboard: false,
                size: 'lg',
                controller: 'LimitCountCtrl',
                resolve: {
                  roleList: function () {
                    return roleList;
                  },
                  layerList: function () {
                    return vm.tableData;
                  },
                  customerType: function () {
                    return vm.customerType;
                  },
                  limitConditions: function () {
                    return  limitConditions;
                  }
                }
              });
        }
      })
    };

    $scope.whiteUserList = function () {

      customerLayerService.getWhiteList(vm.customerType).then(function (resp) {
          var whiteList = resp.data.data;
          var modalInstance = $uibModal.open(
              {
                templateUrl: 'app/customer-layer-mgmt/modal/white-list.html?v=' + LG.appConfig.clientVersion,
                keyboard: false,
                size: 'lg',
                controller: 'WhitelistCtrl',
                resolve: {
                  customerType: function () {
                    return vm.customerType;
                  },
                  whiteList: function () {
                    return  whiteList;
                  }
                }
              });
      })

    }

  }

  angular
  .module('app.customer-layer-mgmt')
  .controller('CustomerLayerMgmtCtrl', CustomerLayerMgmtCtrl);

})();