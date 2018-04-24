/**
 * Sample Management service
 */

'use strict';

sampleMgmtService.$inject = ['$http', '$rootScope', 'toaster'];

function sampleMgmtService($http, $rootScope, toaster) {
  return {
    sampleQuery: sampleQuery,
    showMessage: showMessage,
    getAuthUsers: getAuthUsers,
    getSampleDetail: getSampleDetail,
    deleteSample: deleteSample,
    queryLogByOperateType: queryLogByOperateType,
    getQrCode: getQrCode,
    printQrCode: printQrCode,
    getSamples: getSamples,
    searchItemList: searchItemList,
    createSampleIds: createSampleIds,
    showErrorMessage: showErrorMessage,
    queryDeptTree: queryDeptTree,
    listBelongOperator: listBelongOperator,
    modifyBelongOperator: modifyBelongOperator,
    getHistory: getHistory,
    getQueryInfo: getQueryInfo,
    loanerList: loanerList,
    getSpuName: getSpuName,
    reCreateAndPrintSamples: reCreateAndPrintSamples,
    getLSUserInfo: getLSUserInfo,
    getItemName:getItemName,
    getProductNameList:getProductNameList,
    batchChangeShelf: batchChangeShelf,
    getShelfListByWarehouse:getShelfListByWarehouse,
    setBasicCard: setBasicCard,
    getUserWarehouse:getUserWarehouse

  };

  function getLSUserInfo(userId){

    return $http.get("/sample-mgmt/queryLSUserInfo?userId=" + userId);
  }

  function getItemName(itemId) {
    return $http.post("/sample-mgmt/getItemName", {
      itemId:itemId
    });
  }
  function getSpuName(itemId) {
    /*return $http.jsonp('http://gfdb.lianshang.com/itemBase/loadSpu?jsonp=JSON_CALLBACK&itemId=121467094')
     .success(function (data) {
     log.console(data)
     });*/
    //return $http.jsonp
    /*return $http({
     method: 'GET',
     url: 'http://gfdb.lianshang.com/itemBase/loadSpu?itemId='+121467094
     });*/
    return $http.get("/sample-mgmt/getSpuName?itemId=" + itemId);
  }

  function loanerList() {
    return $http.post("/sample-mgmt/loanerList");
  }

  function getQueryInfo() {
    return $http.post("/sample-mgmt/getQueryInfo");
  }

  function getHistory(sampleCode, pageNo) {
    return $http.get(
        "/sample-mgmt/getHistory?sampleCode=" + sampleCode + "&pageNo="
        + pageNo);

  }

  function modifyBelongOperator(belongOperatorId, operatorType, sampleId) {
    var requestParam = "operatorType=" + operatorType + "&belongOperatorId="
        + belongOperatorId + "&sampleId=" + sampleId;
    return $http.get("/sample-mgmt/modifyBelongOperator?" + requestParam);
  }

  function listBelongOperator() {
    return $http.get("/sample-mgmt/listBelongOperator");
  }

  function queryDeptTree($scope) {
    return $http({
      url: '/sample-mgmt/queryDeptTree',
      method: 'GET'
    }).then(function (resp) {
      if (resp.data.code == 200) {
        $scope.treeData = resp.data.data.deptTree;
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
    });
  }

  //需要去除shopid,生成样卡的时候
  function createSampleIds(shopId, itemId, sellerOperatorId,
      sellerRegionId, num, belongOperatorId) {
    return $http.post("/sample-mgmt/create/sampleId", {
      shopId: shopId,
      itemId: itemId,
      sellerOperatorId: sellerOperatorId,
      sellerRegionId: sellerRegionId,
      num: num,
      belongOperatorId: belongOperatorId

    });

  }

  function reCreateAndPrintSamples(sampleIdList) {
    return $http.post("/sample-mgmt/reCreate/sampleId", {
      sampleIds: sampleIdList
    });
  }

  //搜索商品列表,去除店铺id
  function searchItemList(shopId, keyword, pageId, pageSize, draw) {
    return $http.post("/sample-mgmt/listItemInfoByShopId", {
      shopId: shopId,
      keyword: keyword,
      pageId: pageId,
      pageSize: pageSize,
      draw: draw
    });

  }

  function getSamples(sampleIdList) {
    return $http.post("/sample-mgmt/listSampleByIds", {
      sampleIdList: sampleIdList
    });
  }

  function printQrCode(sampleIdList) {
    var sendSampleWayJson = {};
    sendSampleWayJson.sampleIdList = sampleIdList;

    return $http({
      method: 'POST',
      url: '/sample-mgmt/print/sample',
      data: sendSampleWayJson
    });
  }

  function getQrCode(sampleId) {
    return $http.get("/sample-mgmt/get-qrCode?sampleId=" + sampleId);
  }

  function queryLogByOperateType(sampleId, operateType, draw, sortColumn,
      sortDir, start, limit, where) {
    return $http.post("/sample-mgmt/queryLogByOperateType", {
      sampleId: sampleId,
      operateType: operateType,
      draw: draw,
      sortColumn: sortColumn,
      sortDir: sortDir,
      start: start,
      limit: limit,
      where: where

    });
  }

  function deleteSample(sampleId) {
    return $http.get("/sample-mgmt/deleteSample?sampleId=" + sampleId);
  }

  function getSampleDetail(sampleId) {
    return $http.get("/sample-mgmt/getSampleDetail?sampleId=" + sampleId);
  }

  function getAuthUsers() {
    return $http({
      url: '/web/report/getAuthUsers',
      method: 'GET'
    });

  }

  function sampleQuery(draw, sortColumn, sortDir, start, limit, where) {
    return $http.post('sample-mgmt/query', {
          draw: draw,
          sortColumn: sortColumn,
          sortDir: sortDir,
          start: start,
          limit: limit,
          where: where
        }
    );
  }

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

  function showErrorMessage(msg) {
    toaster.pop({
      type: 'error',
      title: '错误信息',
      body: msg,
      showCloseButton: true,
      timeout: 5000
    });
    return false;

  }

  /**
   * 获取品名
   * @param rootCategoryId
   * @returns {*}
   */
  function getProductNameList(rootCategoryId) {
    return $http.post('/item-mgmt/getProductNameList',{
      rootCategoryId: rootCategoryId,
      keyword: '',
      pageNo: 1,
      pageSize: 1000
    });
  }

  /**
   * 根据仓库来获取货架列表
   */
  function getShelfListByWarehouse(warehouseId) {
    return $http.post('/shelf-mgmt/list',{
      warehouseId: warehouseId
    });
  }

  /**
   * 批量更改货架位置
   * @param sampleList
   * @param warehouseId
   * @param shelfId
   */
  function batchChangeShelf(sampleList,warehouseId,shelfId) {
    return $http.post('/shelf-mgmt/batchAdjustShelf',JSON.stringify({
      sampleIdList: sampleList,
      warehouseId: warehouseId,
      shelfId: shelfId
    }),{headers:{
      "Content-Type": 'application/json'
    }});
  }

  /**
   * 设置为底卡
   * @param sampleId
   * @returns {*}
   */
  function setBasicCard(sampleId) {
    return $http.get('sample-mgmt/markAsBasicCard?sampleId=' + sampleId);
  }

  /**
   * 查看当前管理员能够操作的仓库列表
   */

  function getUserWarehouse() {
    return $http.get('warehouse-mgmt/getUserWarehouse');
  }

}

angular
.module('app.sample-mgmt')
.factory('sampleMgmtService', sampleMgmtService);
