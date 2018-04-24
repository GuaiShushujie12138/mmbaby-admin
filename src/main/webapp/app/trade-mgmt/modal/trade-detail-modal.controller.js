/**
 * trade-detail-modal.controller
 */
(function () {

  'use strict';

  TradeDetailModalCtrl.$inject =
      ['$scope', '$uibModal', '$uibModalInstance', 'DTOptionsBuilder','permissionCheckService',
        'DTColumnBuilder', '$compile', 'tradeMgmtService', 'toaster', 'rowObj',
        'domain', 'tradeStatusSelect', 'itemDomain'];

    function TradeDetailModalCtrl($scope, $uibModal, $uibModalInstance,
                                  DTOptionsBuilder, permissionCheckService,
                                  DTColumnBuilder, $compile, tradeMgmtService, toaster,
                                  rowObj, domain, tradeStatusSelect, itemDomain) {
        var data = this;
        var vm = $scope;
        $scope.domain = domain;
        $scope.relatedDemandId = rowObj.relatedDemandId.split(",");

        $scope.tradeModal = {};

        $scope.rowObj = rowObj;

        $scope.itemDomain = itemDomain;

        $scope.canQuery = permissionCheckService.check("WEB.TRADE-MGMT.QUERY");
        $scope.canQuerySeller = permissionCheckService.check("WEB.TRADE-MGMT.QUERY.SELLER");
        $scope.canQueryBuyer = permissionCheckService.check("WEB.TRADE-MGMT.QUERY.BUYER");

        $scope.showSellerInfo = $scope.canQuery && $scope.canQuerySeller;
        $scope.showBuyerInfo = $scope.canQuery && $scope.canQueryBuyer;

        initTradeData();

    function initTradeData() {
      tradeMgmtService.getOneTrade(rowObj.tradeId)
      .then(function (resp) {
        var respData = resp.data.data;
        $scope.data = respData;
        console.log($scope.data);
      });

      if ($scope.showSellerInfo) {
        tradeMgmtService.getTradeInfo(rowObj.tradeId)
            .then(function callBack(resp) {
              var respData = resp.data.data;
              if (resp.data.code == 200) {
                $scope.tradeModal = respData;
                if($scope.tradeModal.oriReorderTradeId == 0){
                  $scope.tradeModal.oriReorderTradeId="";
                }
              }
            });
      }

    tradeMgmtService.getTradeLog(rowObj.tradeId)
        .then(function (resp) {
            var respData = resp.data.data;
            // $scope.data = respData;
            $scope.tradeLog =respData
        });
    }

        function serverData(sSource, aoData, fnCallback, oSettings) {
            tradeMgmtService.getItemList(rowObj.tradeId)
                .then(function (resp) {
                    fnCallback(resp.data);
                });
        }

        $scope.dtInstance = {};

        $scope.dtOptions = DTOptionsBuilder
            .fromSource('')
            .withFnServerData(serverData)
            .withDataProp('data')
            .withOption('serverSide', true)
            .withOption('searching', false)
            .withOption('lengthChange', true)
            .withOption('scrollX', true)
            .withOption('paging', false)
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

      DTColumnBuilder.newColumn('shopId').withTitle('店铺编号').renderWith(
          shopLinkFormatter).notSortable(),
      DTColumnBuilder.newColumn('shopName').withTitle('店铺名称').notSortable(),
      DTColumnBuilder.newColumn('itemName').withTitle(
          '商品名称').notSortable().renderWith(
          ItemLinkFormatter
      ),
      DTColumnBuilder.newColumn('itemImg').withTitle('商品图片').notSortable()
      .renderWith(imgHtml),
        DTColumnBuilder.newColumn('buyerRefundStatus').withTitle(
            '买家退款状态<button class="btn  btn-link" type="button" tooltip-placement="right" uib-tooltip="表示买家能看到的状态"><i class="fa fa-info-circle column-tip-icon"></i></button>').notSortable().renderWith(buyerRefundHtml),
      DTColumnBuilder.newColumn('refundStatusText').withTitle('退款状态').notSortable(),
      DTColumnBuilder.newColumn('itemTypeId').withTitle(
          '商品类型').notSortable().renderWith(
          itemTypeFormatter
      ),
      DTColumnBuilder.newColumn('skuId').withTitle('商品SKU').notSortable(),
      DTColumnBuilder.newColumn('quantity').withTitle(
          '数量').notSortable().renderWith(
          quantityFormatter
      ),
      DTColumnBuilder.newColumn('price').withTitle('价格').notSortable()
      .renderWith(priceHtml),
      DTColumnBuilder.newColumn('targetUrl').withTitle('验布报告').notSortable()
      .renderWith(reportHtml),
    DTColumnBuilder.newColumn('standardPrice').withTitle('链尚价').notSortable()
    .renderWith(priceHtml),
    DTColumnBuilder.newColumn('refundAmount').withTitle('已退金额').notSortable()
        .renderWith(priceHtml),
    DTColumnBuilder.newColumn('maxCanRefundAmount').withTitle('可退款金额').notSortable()
        .renderWith(priceHtml),
    ];

      function buyerRefundHtml(data, type, full, meta) {
          var str = '';
          if (full.refundId == 0) {
              return str;
          }
          str += '<button id="btn-to-receive-' + full.id + '" ng-if="' + true
              + '"  class="btn btn-xs ' + 'btn-info' + '" ' +
              ' ng-click="getRefundLog(' + full.id +"," + full.tradeId
              + ')">查看退款日志<i class="fa fa-check-square"></i>' +
              '</button>';
          return str;
      }

      $scope.getRefundLog = function(id,tradeId){
              var modalInstance = $uibModal.open({
                  templateUrl: 'app/trade-mgmt/modal/refund_log.html?v=' + LG.appConfig.clientVersion,
                  keyboard: false,
                  controller: 'refundLogCtrl',
                  size: 'lg',
                  resolve: {
                      id : function () {
                          return id;
                      },
                      tradeId:function(){
                          return tradeId;
                      }
                  }
              });
              modalInstance.result.then(function () {

              }, function () {

              });
      }

        function priceHtml(data, type, full, meta) {
            return data + '元';
        }

        function quantityFormatter(data, type, full, meta) {
            return data + '' + full.quantityUnit;
        }

    function reportHtml(data, type, full, meta) {
      if (full.hasClothReport){
          return '<a href="' + full.targetUrl + '" target="_blank">查看报告</a>';
      }
      return "";

    }

        function imgHtml(data, type, full, meta) {
            return '<img style="width:50px;height:50px;" src="' + data + '">';
        }

        function itemTypeFormatter(data, type, full, meta) {
            var result = '';
            switch (data) {
                case 1:
                    result = '样卡';
                    break;
                case 2:
                    result = '样布/样品';
                    break;
                case 3:
                    result = '大货';
                    break;
                default:
                    result = data;
                    break;
            }

            return result;
        }

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };


        //添加验布坊库存
        function stockServerData(sSource, aoData, fnCallback, oSettings) {

            var start = aoData[3].value;
            if (!start) {
                start = 1;
            }
            var limit = aoData[4].value;
            if (limit == -1) {
                limit = 10;
            }

            tradeMgmtService.getStockList(rowObj.tradeId, start, limit)
                .then(function (resp) {
                    console.log(JSON.stringify(resp));
                    resp.data.data=resp.data.data.list||[];
                    fnCallback(resp.data);
                });
        }

        $scope.stockOptions = DTOptionsBuilder
            .fromSource('')
            .withFnServerData(stockServerData)
            .withDataProp('data')
            .withOption('serverSide', true)
            .withOption('searching', false)
            .withOption('autoWidth', false)
            .withOption('paging', false)
            .withOption('createdRow', function (row, data, dataIndex) {
                $compile(angular.element(row).contents())($scope);

            })
            .withOption('headerCallback', function (header) {
                if (!vm.headerCompiled) {
                    vm.headerCompiled = true;
                    $compile(angular.element(header).contents())($scope);
                }
            });

        $scope.stockInstance = {};
        $scope.stockColumns = [
            DTColumnBuilder.newColumn('rollCode').withTitle('唯一码ID').notSortable().withOption("width", "15%"),
            DTColumnBuilder.newColumn('colorName').withTitle('颜色').notSortable().withOption("width", "15%"),
            DTColumnBuilder.newColumn('expectValue').withTitle('客供').notSortable().withOption("width", "15%"),
            DTColumnBuilder.newColumn('status').withTitle('状态').notSortable().withOption("width", "15%"),
            DTColumnBuilder.newColumn('hasInSaleWorkTicket').withTitle('是否有售中').notSortable().renderWith(
                isInSaleWork).withOption("width", "15%"),
            DTColumnBuilder.newColumn('clothReportUrl').withTitle('操作').renderWith(
                isHaveReportHtml).notSortable().withOption("width", "120px"),
        ];


        function isInSaleWork(data, type, full, meta) {
            if (data) {
                return '<span>有</span>';
            } else {
                return '<span>无</span>';
            }
        }

        function isHaveReportHtml(data, type, full, meta) {
            console.log(JSON.stringify(full))
            if (data) {
                return '<a ng-href="'+full.clothReportUrl+'" target="_blank">查看验布报告</a>';
            } else {
                return '<span>暂无验布报告</span>';
            }
        }


        //获取物流信息
        initLogisticsData();
        function initLogisticsData() {
            tradeMgmtService.getLogisticsList(rowObj.tradeId)
                .then(function (resp) {
                    var respData = resp.data.data;
                    $scope.logisticsList = respData;
                });
        }
    }

    angular
        .module('app.trade-mgmt')
        .controller('TradeDetailModalCtrl', TradeDetailModalCtrl);

})();