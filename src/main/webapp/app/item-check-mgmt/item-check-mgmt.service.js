(function () {
    'use strict';

    itemCheckMgmtService.$inject = ['$http', '$rootScope'];

    function itemCheckMgmtService($http, $rootScope) {

        return {
            updatePassed: updatePassed,
            getOperatorList:getOperatorList,
            getProductNameList:getProductNameList,
            getProvinceList:getProvinceList,
            getCityList:getCityList,
            getDistrictList:getDistrictList,
            getRealSellerByMobile: getRealSellerByMobile,
            saveRealSellerInfo: saveRealSellerInfo,
            queryInit: queryInit,
            itemInit:itemInit,
            getSubDept:getSubDept,
            listQuery: listQuery,
            getPassedInfo: getPassedInfo,
            allocateCustomer: allocateCustomer,
            updateStatus: updateStatus
        }


        // 商品是否合格提交接口

        function updatePassed(itemId,isPassed,passedReason) {
            return $http.post('/item-mgmt/updatePassed',{
                itemId: itemId,
                isPassed: isPassed,
                passedReason: passedReason
            });
        }

        // 获取报价业务员列表

        function getOperatorList() {
            return $http.get('/item-mgmt/getOperatorList');
        }

        // 获取品名列表

        function getProductNameList(rootCategoryId) {
            return $http.post('/item-mgmt/getProductNameList',{
                rootCategoryId: rootCategoryId,
                keyword: '',
                pageNo: 1,
                pageSize: 1000
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

        // 通过手机号获取用户信息

        function getRealSellerByMobile(phoneNumber) {
            return $http.get('/item-mgmt/getRealSellerByMobile?mobile=' + phoneNumber);
        }

        // 保持真实卖家信息
        function saveRealSellerInfo(data) {
            return $http.post('/item-mgmt/saveRealSellerInfo',data);
        }

        // 获取搜索列表初始化数据

        function queryInit() {
            return  $http.get('/item-mgmt/queryInit');
        }

        // 获取商品详情里面单位初始化

        function itemInit(itemId) {
            return $http.get('/item-mgmt/itemInit?itemId=' + itemId);
        }

        // 获取子部门接口
        function getSubDept(deptId) {
            return $http.get('/item-mgmt/getSubDept?deptId=' + deptId);
        }

        // 查询商品列表

        function listQuery(keyword,sortColumn,sortDir,draw,start,limit,itemCategory,isPassed,itemSource,operatorId,
            productNameId,regionId,deptPath,itemStatus,status,lsIsbn,sampleId,startData,endDate) {
            return $http.post('/item-mgmt/query',{
                keyword:keyword,
                sortColumn:sortColumn,
                sortDir: sortDir,
                draw: draw,
                start: start,
                limit: limit,
                itemCategory: itemCategory,
                isPassed: isPassed,
                itemSource: itemSource,
                operatorId: operatorId,
                productNameId: productNameId,
                regionId: regionId,
                deptPath: deptPath,
                itemStatus: itemStatus,
                status:status,
                lsIsbn: lsIsbn,
                sampleCode: sampleId,
                startDate: startData,
                endDate: endDate
            });
        }

        // 获取是否合格初始化数据

        function getPassedInfo(itemId) {
            return $http.get('/item-mgmt/auditInfo?itemId=' + itemId);
        }

        // 分配接口

        function allocateCustomer (customerId,operatorUserId) {
            return $http.post('/item-mgmt/allocateCustomer',{
                customerId: customerId,
                operatorUserId: operatorUserId
            });
        }

        // 商品上下架

        function updateStatus (itemId) {
            return $http.post('/item-mgmt/updateStatus',{
                itemId: itemId
            });
        }



    }



    angular.module("app.item-check-mgmt")
        .factory("itemCheckMgmtService", itemCheckMgmtService);

})();