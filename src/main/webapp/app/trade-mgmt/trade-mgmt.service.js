/**
 * Trade Management service
 */

'use strict';

tradeMgmtService.$inject = ['$http', '$rootScope', 'toaster'];

function tradeMgmtService($http, $rootScope, toaster) {
    return {
        tradeQuery: tradeQuery,
        query: query,
        queryByItem: queryByItem,
        getOneTrade: getOneTrade,
        getLogisticsList: getLogisticsList,
        getStockList: getStockList,
        showMessage: showMessage,
        modifyGainsFee: modifyGainsFee,
        getOperatorList: getOperatorList,
        getCurrentRegionUser: getCurrentRegionUser,
        relateDemand: relateDemand,
        markRevenue: markRevenue,
        markFollowUp: markFollowUp,
        getDomainUrl: getDomainUrl,
        getItemList: getItemList,
        getItemUrl: getItemUrl,
        getClothCheckStatus: getClothCheckStatus,
        markSource: markSource,
        getTradeInfo: getTradeInfo,
        getShopInfo: getShopInfo,
        getProvinceList: getProvinceList,
        getCityList: getCityList,
        getAreaList: getAreaList,
        markShop: markShop,
        initTradeSource: initTradeSource,
        searchShopList: searchShopList,
        initCustomerShopInfo: initCustomerShopInfo,
        getShopInfoByCustomer: getShopInfoByCustomer,
        changeSellerOperator: changeSellerOperator,
        queryRemittanceReceipt: queryRemittanceReceipt,
        getLogistics: getLogistics,
        initDeliveryData: initDeliveryData,
        deliverySubmit: deliverySubmit,
        getTradeLog:getTradeLog,
        getRefundLog:getRefundLog
    };

    function getShopInfoByCustomer(customerId) {
        return $http.post("trade-mgmt/getShopInfoByCustomer.do", {
            customerId: customerId
        });
    }

    function getTradeLog(tradeId) {
        return $http.get('trade-mgmt/query-trade-logs?tradeId='+tradeId+'');
    }

    function searchShopList(openShop, keyword, start, limit, draw) {
        if (!!!openShop) {
            openShop = 1;//默认查询已开店
        }
        var option = "";
        if (!!keyword) {
            option = "&keyword=" + keyword;
        }
        option += "&limit=" + limit;
        option += "&start=" + start;
        option += "&draw=" + draw;
        return $http.get("/web/customer/search?isOpenShop=" + openShop + option);
    }

    function markShop(tradeId, customerId, shopAddress, provinceId,
                      cityId, districtId) {
        return $http.post("trade-mgmt/markShop.do", {
            tradeId: tradeId,
            customerId: customerId,
            shopAddress: shopAddress,
            provinceId: provinceId,
            cityId: cityId,
            districtId: districtId
        });

    }

    function getProvinceList() {
        return $http.get("public/getProvinceList?id=1");
    }

    function getCityList(cityId) {
        return $http.get("public/getCityList?id=" + cityId);
    }

    function getAreaList(districtId) {
        return $http.get("public/getDistrictList?id=" + districtId);
    };

    function showMessage(title, msg, type) {
        toaster.pop({
            type: type || 'error',
            title: title || '提示信息',
            body: msg,
            showCloseButton: true,
            timeout: 5000
        });
        return false;

    }

    function tradeQuery(draw, sortColumn, sortDir, start, limit, where) {
        return $http.post('trade-mgmt/query', {
                draw: draw,
                sortColumn: sortColumn,
                sortDir: sortDir,
                start: start,
                limit: limit,
                where: where
            }
        );
    }

    function initCustomerShopInfo(tradeId) {
        return $http.post('trade-mgmt/initCustomerShopInfo', {
            tradeId: tradeId
        });
    };


    function initTradeSource(tradeId) {
        return $http.post('trade-mgmt/initTradeSource', {
                tradeId: tradeId
            }
        );
    }

    function query(draw, sortColumn, sortDir, start, limit, searchValue,
                   searchRegex,
                   tradeId, buyerName, buyerMobile, sellerName, sellerMobile, shopName,
                   startDate, endDate, paySwitch, tradeStatus) {
        return $http.post('trade-mgmt/query.do', {
                draw: draw,
                sortColumn: sortColumn,
                sortDir: sortDir,
                start: start,
                limit: limit,
                searchValue: searchValue,
                searchRegex: searchRegex,
                tradeId: tradeId,
                buyerName: buyerName,
                buyerMobile: buyerMobile,
                sellerName: sellerName,
                sellerMobile: sellerMobile,
                shopName: shopName,
                startDate: startDate,
                endDate: endDate,
                paySwitch: paySwitch,
                tradeStatus: tradeStatus
            }
        );
    }

    function queryByItem(draw, sortColumn, sortDir, start, limit, searchValue,
                         searchRegex,
                         tradeId, shopId, shopName, itemId, startDate, endDate, tradeStatus) {
        return $http.post('trade-mgmt/tradeItemQuery.do', {
                draw: draw,
                sortColumn: sortColumn,
                sortDir: sortDir,
                start: start,
                limit: limit,
                searchValue: searchValue,
                searchRegex: searchRegex,
                tradeId: tradeId,
                shopId: shopId,
                shopName: shopName,
                itemId: itemId,
                startDate: startDate,
                endDate: endDate,
                tradeStatus: tradeStatus
            }
        );
    }

    function getTradeBase(tradeId, isPeriod, draw) {
        return $http.post('trade-mgmt/query-trade-base.do', {
                tradeId: tradeId,
                isPeriod: isPeriod,
                draw: draw
            }
        );
    }

    function getShopInfo(customerId, openShop) {
        return $http.post("trade-mgmt/getShopInfo.do", {
            customerId: customerId,
            openShop: openShop
        });
    }

    function getTradeInfo(tradeId) {
        return $http.post("trade-mgmt/queryKpiTradeInfo.do", {
            tradeId: tradeId
        });
    }

    function getOneTrade(tradeId) {
        return $http.post('trade-mgmt/queryOneTrade.do', {
                tradeId: tradeId
            }
        );
    }

  function getTradeLog(tradeId) {
      return $http.get('trade-mgmt/query-trade-logs?tradeId='+tradeId+'');
  }

  function getRefundLog(tradeId,tradeItemId){
      return $http.get('trade-mgmt/query-trade-refund-logs?tradeId='+tradeId+'&tradeItemId='+tradeItemId+'');
  }


  function modifyGainsFee(tradeId, gainsFee, gainsMemo) {
    return $http.post('trade-mgmt/modify-gains-fee.do', {
      tradeId: tradeId,
      gainsFee: gainsFee,
      gainsMemo: gainsMemo
    });
  }

    function getOperatorList() {
        return $http.get("trade-mgmt/getOperatorList");
    }

    function getCurrentRegionUser() {
        return $http.get("trade-mgmt/getCurrentRegionUser");
    }

    //lscrmTradeSource,标记来源
    function markSource(lscrmTradeSource, tradeId, demandIds, sellerOperatorId,
                        otherSource, oriReorderTradeId) {
        return $http.post("trade-mgmt/webMarkSource", {
            lscrmTradeSource: lscrmTradeSource,
            tradeId: tradeId,
            demandIds: demandIds,
            sellerOperatorId: sellerOperatorId,
            otherSource: otherSource,
            oriReorderTradeId: oriReorderTradeId
        });

    }

    function relateDemand(relatedDemandId, feedbackUserId, tradeId) {
        return $http.post(
            "trade-mgmt/relateDemand?relatedDemandId=" + relatedDemandId
            + "&feedbackUserId=" + feedbackUserId + "&tradeId=" + tradeId);
    }

    function markRevenue(isRevenue, revenueFee, revenueRemark, tradeId) {
        // return $http.post("trade-mgmt/markRevenue?isRevenue="+isRevenue+"&revenueFee="+revenueFee+"&revenueRemark="+revenueRemark+"&tradeId="+tradeId);
        return $http.post("trade-mgmt/markRevenue", {
            isRevenue: isRevenue,
            revenueFee: revenueFee,
            revenueRemark: revenueRemark,
            tradeId: tradeId
        });
    }

    function markFollowUp(isFollowUp, changeReason, tradeId) {
        return $http.post(
            "trade-mgmt/markFollowUp?isFollowUp=" + isFollowUp + "&changeReason="
            + changeReason + "&tradeId=" + tradeId);
    }

    function getDomainUrl() {
        return $http.get('demand-mgmt/getDomainUrl');
    }

    function getItemList(tradeId) {
        return $http.get('trade-mgmt/getItemList?tradeId=' + tradeId);
    }

    function getItemUrl() {
        return $http.get('demand-mgmt/getItemUrl');
    }

    function getClothCheckStatus() {
        return $http.get('trade-mgmt/getClothCheckStatus');
    }

    function changeSellerOperator(tradeId, sellerOperatorId) {
        return $http.post('/trade-mgmt/changeSellerOperator', {
            tradeId: tradeId,
            sellerOperatorId: sellerOperatorId
        })
    }

    function queryRemittanceReceipt(tradeId, userId) {
        return $http.get('/trade-mgmt/queryRemittanceReceipt?tradeId=' + tradeId + '&userId=' + userId);
    }

    /**
     *  获取物流公司列表
     */
    function getLogistics() {
        return $http.get('/public/logistics');
    }

    /**
     *  发货的请求初始化数据
     */

    function initDeliveryData(tradeId) {
        return $http.get('/delivery-mgmt/init?tradeId=' + tradeId);
    }

    /**
     * 订单库存接口
     */
    function getStockList(tradeId, start, limit) {
        return $http.get('/trade-mgmt/queryOneTradeClothInventory?tradeId=' + tradeId + '&start=' + start + '&limit=' + limit);
    }

    /**
     * 订单物流接口
     */
    function getLogisticsList(tradeId) {
        return $http.get('/trade-mgmt/queryOneTradeLogistics?tradeId=' + tradeId);
    }

    /**
     * 商家发货提交接口
     */

    function deliverySubmit(tradeLogistics, packingSlipDetail) {
        return $http.post('/delivery-mgmt/submit', JSON.stringify({data:{
            tradeLogistics: tradeLogistics,
            packingSlipDetail: packingSlipDetail
        }}),{
            headers:{'Content-Type':'application/json'}
        });
    }


}

angular
    .module('app.trade-mgmt')
    .factory('tradeMgmtService', tradeMgmtService);
