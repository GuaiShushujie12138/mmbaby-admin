(function () {
    'use strict';

    packingSlipMgmtService.$inject = ['$http', '$rootScope'];

    function packingSlipMgmtService($http, $rootScope) {

        return {
            listQuery: listQuery,
            getSlipDetail:getSlipDetail,
            invalidSlip:invalidSlip,
            auditSuccess:auditSuccess,
            getSlipRecordList:getSlipRecordList,
            getOperatorList:getOperatorList,
            queryDeptTree:queryDeptTree,
            getLsPriceList:getLsPriceList,
            modifyLsPrice:modifyLsPrice,
            getSalePriceList:getSalePriceList,
            modifySalePrice:modifySalePrice,
            downloadSlip:downloadSlip,
            getPackingSlipData: getPackingSlipData,
            getOperator:getOperator,
        }

        function getOperator() {
            return $http.get("/public/getOperatorList");

        }

        // 获取码单列表接口
        function listQuery(draw,sortColumn,sortDir,start,limit,where) {
            return $http.post('/web/packing-slip/query',{
                draw:draw,
                sortColumn:sortColumn,
                sortDir:sortDir,
                start:start,
                limit:limit,
                where:where
            });
        }

        // 获取码单详情
        function getSlipDetail(packingSlipId) {
            return $http.get('/web/packing-slip/detail?packingSlipId=' + packingSlipId);
        }

        // 码单失效

        function invalidSlip(packingSlipId,invalidReason) {
            return $http.post('/web/packing-slip/cancel',{
                packingSlipId: packingSlipId,
                invalidReason:invalidReason
            });
        }

        // 码单审核
        function auditSuccess(packingSlipId) {
            return $http.post('/web/packing-slip/auditSuccess',{
                packingSlipId: packingSlipId
            });
        }

        // 码单记录

        function getSlipRecordList(packingSlipId,pageNo) {
            return $http.get('/web/packing-slip/recordList?packingSlipId=' + packingSlipId + '&pageNo=' + pageNo);
        }

        // 获取需求单发起人,获取需求单跟进人

        function getOperatorList() {
            return $http.get("trade-mgmt/getOperatorList");
        }

        // 获取部门树状图结构

        function queryDeptTree() {
            return $http.get('/sample-mgmt/queryDeptTree');
        }

        // 修改链尚价格初始化

        function getLsPriceList(packingSlipId) {
            return $http.get('/web/packing-slip/getLsPriceList?packingSlipId='+ packingSlipId);
        }

        // 修改链尚价格

        function modifyLsPrice(packingSlipId,priceData) {
            return $http.post('/web/packing-slip/modifyLsPrice',JSON.stringify({data:{
                packingSlipId:packingSlipId,
                priceData: priceData
            }}),{
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }

        // 修改销售价格列表

        function getSalePriceList(packingSlipId) {
            return $http.get('/web/packing-slip/getSalePriceList?packingSlipId=' + packingSlipId);
        }

        // 修改销售价格

        function modifySalePrice(packingSlipId,priceData) {
            return $http.post('/web/packing-slip/modifySalePrice',JSON.stringify({
                data: {
                    packingSlipId: packingSlipId,
                    priceData: priceData,
                }
            }),{
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }

        // 码单导出
        function downloadSlip(draw,sortColumn,sortDir,start,limit,where) {
            $http.post('/web/packing-slip/download.do',{
                draw: draw,
                sortColumn: sortColumn,
                sortDir: sortDir,
                start: start,
                limit: limit,
                where:where
            });
        }

        // 获取部门树状图结构

        function queryDeptTree() {
            return $http.get('/web/dept/loadDeptTreeAndUser');
        }

        // 获取码单信息
        function getPackingSlipData(packingSlipId) {
            return $http.get('/web/packing-slip/detail?packingSlipId=' + packingSlipId);
        }

    }

    angular.module("app.packing-slip-management")
        .factory("packingSlipMgmtService", packingSlipMgmtService);

})();