(function () {
    'use strict';

    requestInquiryMgmtService.$inject = ['$http', '$rootScope'];

    function requestInquiryMgmtService($http, $rootScope) {

        return {
            listQuery: listQuery,
            getInquiryDetail: getInquiryDetail,
            invalidInquiry: invalidInquiry,
            allocateInquiry: allocateInquiry,
            getRecordList: getRecordList,
            queryDeptTree: queryDeptTree,
            getOperatorList: getOperatorList,
            getNewColorList:getNewColorList,
            getAlloacteOperatorList: getAlloacteOperatorList,
            getProvinceList: getProvinceList,
            getCityList: getCityList,
            getDistrictList: getDistrictList,
            packingSlipInit: packingSlipInit,
            getColorList: getColorList,
            savePaceingSlip: savePaceingSlip,
            queryFirstPackingSlipTrade: queryFirstPackingSlipTrade,
            changePackingSlip: changePackingSlip,
            supplierListQuery: supplierListQuery,
            getSupplierDetail: getSupplierDetail,
            relatSupplier: relatSupplier,
            getBankList: getBankList,
            getBankSubList: getBankSubList,
            addSupplier: addSupplier,
            inquirySave: inquirySave,
            initInquiryDetail: initInquiryDetail,
            initEditInquiry: initEditInquiry,
            getHistoryFeedback: getHistoryFeedback,
            saveFeedbackCommon: saveFeedbackCommon,
            initColorDetailList: initColorDetailList,
            initColorHistoryList: initColorHistoryList,
            getBuyerCity: getBuyerCity,
            getInquiryNum: getInquiryNum,
            getInquiryMemoList: getInquiryMemoList,
            getOperator: getOperator,
            getInitInfo: getInitInfo,
            canModifyInquiry:canModifyInquiry,

            //变更状态的接口
            changeStatus: changeStatus
        };

        function getOperator() {
            return $http.get("/public/getOperatorList");

        }

        // 需求单列表接口
        function listQuery(draw, sortColumn, sortDir, start, limit, where) {
            return $http.post('/web/request-inquiry/query', {
                draw: draw,
                sortColumn: sortColumn,
                sortDir: sortDir,
                start: start,
                limit: limit,
                where: where
            });
        }

        // 获取需求单详情
        function getInquiryDetail(requestInquiryId) {
            return $http.get('/web/request-inquiry/detail?requestInquiryId=' + requestInquiryId);
        }

        // 需求单失效

        function invalidInquiry(requestInquiryId, invalidReason) {
            return $http.post('/web/request-inquiry/cancel', {
                requestInquiryId: requestInquiryId,
                invalidReason: invalidReason
            });
        }

        // 获取分配需求单卖家运营列表

        function getAlloacteOperatorList() {
            return $http.get('/web/request-inquiry/listOperator');
        }


        // 分配需求单

        function allocateInquiry(userId, requestInquiryId) {
            return $http.post('/web/request-inquiry/allocate', {
                userId: userId,
                requestInquiryId: requestInquiryId
            });
        }

        // 需求单记录

        function getRecordList(requestInquiryId, pageNo) {
            return $http.get('/web/request-inquiry/recordList?requestInquiryId=' + requestInquiryId + '&pageNo=' + pageNo);
        }

        // 获取需求单发起人,获取需求单跟进人

        function getOperatorList() {
            return $http.get("trade-mgmt/getOperatorList");
        }

        // 获取部门树状图结构

        function queryDeptTree() {
            return $http.get('/web/dept/loadDeptTreeAndUser');
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
            return $http.get('/item-mgmt/getDistrictList?id=' + cityId);
        }

        //开码单初始化
        function packingSlipInit(requestInquiryId) {
            return $http.get('/web/packing-slip/initbyrequestInquiryId?requestInquiryId=' + requestInquiryId);
        }

        //获取颜色
        function getColorList() {
            return $http.get('/public/getcolordata');
        }


        function getNewColorList() {
            return $http.get('/web/packing-slip/getColors');
        }

        // 修改码单
        function changePackingSlip(id) {
            return $http.get('/web/packing-slip/initbyupdate?packingSlipId=' + id);
        }


        //获取尾款
        function queryFirstPackingSlipTrade(buyerId, realShopId, niceShopId, itemId) {
            var url = '/web/packing-slip/queryFirstPackingSlipTrade?'
            if (buyerId != null && buyerId != "") {
                url += '&buyerId=' + buyerId;
            }

            if (realShopId != null && realShopId != "") {
                url += '&realShopId=' + realShopId;
            }

            if (niceShopId != null && niceShopId != "") {
                url += '&niceShopId=' + niceShopId;
            }

            if (itemId != null && itemId != "") {
                url += '&itemId=' + itemId;
            }
            return $http.get(url);
        }

        //保存开码单
        function savePaceingSlip(data) {
            return $http.post('/web/packing-slip/save', JSON.stringify({data: data}), {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }

        function supplierListQuery(keyword, pageNo, pageSize, draw) {
            return $http.get('/web/packing-slip/search-supplier?keyword=' + keyword + '&pageNo=' + pageNo + '&pageSize=' + pageSize + '&draw=' + draw);
        }

        function getSupplierDetail(realShopId, niceShopId) {
            return $http.get('/web/packing-slip/supplier-detail?realShopId=' + realShopId + '&niceShopId=' + niceShopId)
        }

        function relatSupplier(realShopId, niceShopId,type) {
            var data = {
                "realShopId": realShopId,
                "niceShopId": niceShopId,
                "type":type
            };
            return $http.post('/web/packing-slip/relat-supplier', JSON.stringify({data: data}), {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }

        function getBankList() {
            return $http.get('/public/bank/all', {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }

        function getBankSubList(bankId, cityId) {
            return $http.get('/public/bank/subAll?bankId=' + bankId + '&cityId=' + cityId, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }

        function addSupplier(data) {
            return $http.post('/web/packing-slip/add-supplier', JSON.stringify({data: data}), {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }

        /**
         * 修改询价单数据初始化
         */
        function initEditInquiry(itemId) {
            return $http.get('/web/request-inquiry/inquiryDetail?itemId=' + itemId + '&init=1');
        }

        /**
         * 查看询价单初始化数据
         */

        function initInquiryDetail(itemId) {
            return $http.get('/web/request-inquiry/inquiryDetail?itemId=' + itemId);
        }


        /**
         * 查看色号数据
         */

        function initColorDetailList(itemId, colorId, page, pageSize) {
            return $http.get('/web/request-inquiry/getColorList?itemId=' + itemId + '&colorId=' + colorId + '&pageId=' + page + '&pageSize=' + pageSize);
        }

        /**
         * 查看色号历史
         */
        function initColorHistoryList(itemId, colorNo, page, pageSize) {
            return $http.get('/web/request-inquiry/getColorHistoryList?itemId=' + itemId + '&colorNo=' + colorNo + '&pageId=' + page + '&pageSize=' + pageSize);
        }

        /**
         * 查看历史询价反馈
         */
        function getHistoryFeedback(requestInquiryId) {
            return $http.get('/web/request-inquiry/inquiryMemoList?requestInquiryId=' + requestInquiryId);
        }

        /**
         *  保存询价单的数据
         */

        function inquirySave(data) {
            return $http.post('/web/request-inquiry/inquirySave', JSON.stringify({data: data}), {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }

        /**
         *  保存反馈备注
         */

        function saveFeedbackCommon(requestInquiryDto) {

            return $http.post('/web/request-inquiry/inquiryFeedBack', JSON.stringify(requestInquiryDto), {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }

        /**
         *  获取买家区域
         */

        function getBuyerCity() {
            return $http.get('/web/user/listUserSalesArea');
        }

        /**
         * 获取华东华南的询价单数量
         */

        function getInquiryNum() {
            return $http.get('/web/request-inquiry/unProcessNum');
        }

        /**
         *  获取到需求单记录
         */

        function getInquiryMemoList(requestInquiryId) {
            return $http.get('/web/request-inquiry/inquiryMemoList?requestInquiryId=' + requestInquiryId);
        }

        /**
         * 变更状态接口
         */
        function changeStatus(data) {
            return $http.post('/web/request-inquiry/changeStatus', {
                requestInquiryId: data.requestInquiryId,
                operateType: data.actionStatus,
                score: data.star,
                comment: data.reason
            });
        }

        /**
         * 获取银行卡信息
         * @returns {*}
         */
        function getInitInfo() {
            return $http.get('/usersbank-mgmt/queryUsersBank');
        }

        function canModifyInquiry(requestInquiryId,itemId) {
            return $http.post('/web/request-inquiry/canModifyInquiry',{
                requestInquiryId:requestInquiryId,
                itemId:itemId
            });
        }
    }

    angular.module("app.request-inquiry-management")
        .factory("requestInquiryMgmtService", requestInquiryMgmtService);

})();