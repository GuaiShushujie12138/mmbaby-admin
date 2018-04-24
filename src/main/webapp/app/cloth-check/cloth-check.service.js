
'use strict';

clothCheckService.$inject = ['$http', '$rootScope', 'toaster'];

function clothCheckService($http, $rootScope, toaster) {
  return {
    query: query,
    search: search,
    declareInit:declareInit,
    getProductNameList: getProductNameList,
    getProvinceList:getProvinceList,
    getCityList:getCityList,
    getDistrictList:getDistrictList,
    getClothStore: getClothStore,
    loadMarketLogistics: loadMarketLogistics,
    getClothCheckStatus: getClothCheckStatus,
    queryDeptTree: queryDeptTree,
    saveClothRecord: saveClothRecord,
    loadRefundStatistics:loadRefundStatistics,
    closeClothRecord: closeClothRecord,
  };

    //验布大盘搜索
    function queryDeptTree() {
        return $http({
            url: '/cloth-check/loadDeptTree',
            method: 'GET'
        })
    }

    function search(data) {
        return $http.post('cloth-check/search', data);
    }

    // 获取品名列表
    function getProductNameList(rootCategoryId) {
        return $http.post('/cloth-declare/declareProductNameList',{
            rootCategoryId: rootCategoryId,
            keyword: '',
            pageNo: 1,
            pageSize: 1000
        });
    }

  function query(draw, sortColumn, sortDir, start, limit, where) {
    return $http.post('cloth-check/query', {
          draw: draw,
          sortColumn: sortColumn,
          sortDir: sortDir,
          start: start,
          limit: limit,
          where: where
        }
    );
  }

  function getClothStore() {
    return $http.get('cloth-check/getClothStore');
  }

  function getClothCheckStatus() {
    return $http.get('cloth-check/getClothCheckStatus');
  }
  
  function declareInit(thirdOrderNo) {
      return $http.post('cloth-declare/declareInit',{
          thirdOrderNo: thirdOrderNo
      });
  }

    function loadMarketLogistics(clothStoreId) {
        return $http.post('cloth-declare/loadMarketLogistics',{
            storeId: clothStoreId
        });
    }

    // 获取省级列表

    function getProvinceList() {
        return $http.get('/item-mgmt/getProvinceList?id=1');
    }

    // 获取市级列表

    function getCityList(provinceId) {
        return $http.get('/item-mgmt/getCityList?id=' + provinceId);
    }

    // 获取区级列表

    function getDistrictList(cityId) {
        return $http.get('/item-mgmt/getDistrictList?id=' + cityId );
    }

    //保存验布登记
    function saveClothRecord(declareJson) {

        return $http.post('cloth-declare/save',{
            declareJson :declareJson
        });
    }
    
    // 获取退换货分析
    function loadRefundStatistics(data) {
        return $http.post('/cloth-declare/loadRefundStatistics',data);
    }

    function closeClothRecord(lsTradeId,reason) {
        return $http.post('/cloth-declare/cancel',{
            thirdOrderNo:lsTradeId,
            reason:reason,
        });
    }

}

angular
.module('app.cloth-check')
.factory('clothCheckService', clothCheckService);
