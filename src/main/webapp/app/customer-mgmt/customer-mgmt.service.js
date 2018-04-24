(function () {
/**
 * Privilege Management service
 */

'use strict';

customerMgmtService.$inject = [ '$http', '$rootScope', "$q", "$log"];

function customerMgmtService($http, $rootScope, $q, $log) {
    return {
        query: query,
        queryByUserId: queryByUserId,
        getCustomerDetail: getCustomerDetail,
        getUserListBySeller:getUserListBySeller,
        getUserListByBuyer:getUserListByBuyer,
        allotCustomerUser:allotCustomerUser,
        cancelAllotCustomerUser:cancelAllotCustomerUser,
        getCustomerLevelList: getCustomerLevelList,
        modifyCustomerLevel:modifyCustomerLevel,
        getTopRegionList: getTopRegionList,
        getVisitInit:getVisitInit,
        addBackVisit:addBackVisit,
        setCustomerRegionId: setCustomerRegionId,
        getAuthUsers: getAuthUsers,

        getVisitRecordByCustomerId: getVisitRecordByCustomerId,
        getVisitBackByCustomerId:getVisitBackByCustomerId,
        getCustomerLogs: getCustomerLogs,
        getLevelList: getLevelList,
        getCustomerEditInfo: getCustomerEditInfo,
        editCustomer: editCustomer,
        postMultipartService: postMultipartService,
        getProvinceList: getProvinceList,
        getCityList: getCityList,
        getDistrictList: getDistrictList,
        getCompanyClassList: getCompanyClassList,
        readAsDataURLTest: readAsDataURLTest,
        getUserList:getUserList,
        loadByMobileInPublic:loadByMobileInPublic,
        gainCustomerInPublic:gainCustomerInPublic,
        getRestNum:getRestNum,
        getCustomerOperatorList:getCustomerOperatorList,
        allocateBatchCustomer:allocateBatchCustomer


    };

    function query(draw, sortColumn, sortDir, start, limit, where)
    {
        return $http.post(
            '/web/customer/query',
            {
                draw: draw,
                sortColumn: sortColumn,
                sortDir: sortDir,
                start: start,
                limit: limit,
                where: where
            }
        );
    }

    function queryByUserId(draw, sortColumn, sortDir, start, limit, userId)
    {
        return $http.post(
            '/web/customer/queryByUserId',
            {
                draw: draw,
                sortColumn: sortColumn,
                sortDir: sortDir,
                start: start,
                limit: limit,
                userId: userId
            }
        );
    }

    function getCustomerLevelList(customerIds)
    {
        return $http.post('/web/customer/getCustomerLevelList',
            {
            customerIds:customerIds

        }
        );
    }

    function getCustomerDetail(customerId){
        return $http.get(
            '/web/customer/getCustomerDetail?customerId=' + customerId
        );
    }

    function getCustomerEditInfo(customerId){
        return $http.get(
            '/web/customer/getCustomerEditInfo?customerId=' + customerId
        );
    }
    function getUserListByBuyer(draw,start,limit,customerIds){
        return $http.get(
            '/web/customer/getUserListBySellerOrBuyer?draw='+draw+'&start='+start+'&limit='+limit+'&customerIds=' + customerIds+'&type=Buyer'
        );
    }

    function editCustomer(customerId, customerInfo){
        return $http.post(
            '/web/customer/editCustomer', {
                customerId: customerId,
                customerInfo: customerInfo
            }
        )
    }
    function getUserListBySeller(draw,start,limit,customerIds){
        return $http.get(
            '/web/customer/getUserListBySellerOrBuyer?draw='+draw+'&start='+start+'&limit='+limit+'&customerIds=' + customerIds+'&type=Seller'
        );
    }

    function modifyCustomerLevel(customerIds, buyerCustomerLevel,sellerCustomerLevel)
    {
        return $http.post(
            '/web/customer/modifyCustomerLevel',
            {
                customerIds: customerIds,
                buyerCustomerLevel: buyerCustomerLevel,
                sellerCustomerLevel:sellerCustomerLevel
            }
        )
    }

    function getTopRegionList(){
        return $http.get(
            '/web/dept/getTopRegionList'
        );
    }

    function getVisitInit(customerId) {
        return $http.get(
            '/web/customer-service/return-visit-init?customerId='+customerId
        )
    }

    // 添加回访
    function addBackVisit(customerId,type,mobile,callResult,visitContentList,csInquiry) {
        return $http.post('/web/customer-service/add-return-visit',JSON.stringify(
            {
                data:{
                    customerId:customerId,
                    type: type,
                    mobile:mobile,
                    callResult:callResult,
                    visitContentList:visitContentList,
                    csInquiry:csInquiry
                }
            }
            ),{
            headers: {
                'Content-Type': 'application/json'
            }
        }
        );
    }

    function setCustomerRegionId(customerId, regionId) {
        return $http.post(
            '/web/customer/setCustomerRegionId',
            {
                customerId:customerId,
                regionId:regionId
            }
        );
    }

    function allotCustomerUser(customerIds,userId,customerType){
        return $http.post(
            '/web/customer/allotCustomerUser',{
                customerIds:customerIds,
                userId:userId,
                customerType:customerType
            }
        );
    }


    function cancelAllotCustomerUser(customerIds,userId,customerType){
        return $http.post(
            '/web/customer/cancelAllotCustomerUser',{
            customerIds:customerIds,
                userId:userId,
                customerType:customerType
            }
        );
    }

    //主营行业
    function getCompanyClassList() {
        return $http.get(
            '/public/getCompanyClassList'
        )
    }

    //获取省份列表
    function getProvinceList() {
        return $http.get(
            '/public/getProvinceList?id='+1
        )
    }

    //获取某省份城市列表
    function getCityList(id) {
        return $http.get(
            '/public/getCityList?id='+id
        )
    }

    //获取某城市区县列表
    function getDistrictList(id) {
        return $http.get(
            '/public/getDistrictList?id='+id
        )
    }

    function getCustomerLogs(customerId, draw, sortColumn, sortDir, start, limit) {
        return $http.get(
            '/web/customer/getCustomerLogs?customerId=' + customerId + '&draw='+draw+'&sortColumn='+sortColumn+'&sortDir='+sortDir+'&start='+start + '&limit='+ limit
        )
    }

    function getVisitRecordByCustomerId(customerId, draw, sortColumn, sortDir, start, limit) {
        return $http.get(
            '/web/customer/getVisitRecordByCustomerId?customerId=' + customerId + '&draw='+draw+'&sortColumn='+sortColumn+'&sortDir='+sortDir+'&start='+start + '&limit='+ limit
        )
    }

    function getVisitBackByCustomerId(draw, sortColumn, sortDir, start, limit,where) {
        return $http.post(
            '/web/customer-service/get-return-visit-list',{
                draw:draw,
                sortColumn:sortColumn,
                sortDir:sortDir,
                start:start,
                limit:limit,
                where:where
            }
        );
    }

    function getLevelList() {
        return $http.get(
            '/web/customer/getLevelList'
        )
    }

    function getAuthUsers(){
        return $http({
            url: '/web/report/getAuthUsers',
            method: 'GET'
        });

    }

    function readAsDataURLTest(file, scope)
    {
        var deferred = $q.defer();
        var reader = getReader(deferred, scope);
        reader.readAsDataURL(file);
        return deferred.promise;
    }

    function postMultipartService(myFile, fileName)
    {
        var fd = new FormData();
        fd.append('upload', myFile);
        fd.append('type', fileName);

        return $http.post(
            'public/upload', fd, {
                headers: {'Content-Type': undefined },
                transformRequest: angular.identity
            }
        );
    }

    function onLoad(reader, deferred, scope)
    {
        return function () {
            scope.$apply(function () {
                deferred.resolve(reader.result);
            });
        };
    }

    function onError(reader, deferred, scope)
    {
        return function () {
            scope.$apply(function () {
                deferred.reject(reader.result);
            });
        };
    }

    function getReader(deferred, scope)
    {
        var reader = new FileReader();
        reader.onload = onLoad(reader, deferred, scope);
        reader.onerror = onError(reader, deferred, scope);
        return reader;
    }

    function getUserList(){
        return $http.get("/web/customer/getUserList")
    }

    function loadByMobileInPublic(mobile) {
        return $http.get("/web/customer/loadByMobileInPublic?mobile="+mobile)

    }

    function gainCustomerInPublic(customerid,buyerOperatorId,sellerOperatorId) {

        return $http.post("/web/customer/gainCustomerInPublic",{
            customerId:customerid,
            buyerOperatorId:buyerOperatorId,
            sellerOperatorId:sellerOperatorId
        })
    }

    function  getRestNum() {
        return $http.get("/web/customer/getRestNum")

    }

    function getCustomerOperatorList(regionId) {
        regionId = regionId?regionId:0;

        return $http.get("/web/customer/getCustomerOperatorList?regionId="+regionId)
    }

    function allocateBatchCustomer(customerIds, buyerOperatorId, sellerOperatorId){
        buyerOperatorId = parseInt(buyerOperatorId)
        sellerOperatorId = parseInt(sellerOperatorId)
        return $http.post("/web/customer/allocateBatchCustomer",{
            customerIds:customerIds,
            buyerOperatorId:buyerOperatorId,
            sellerOperatorId:sellerOperatorId
        })
    }

}

angular
    .module('app.customer-mgmt')
    .factory('customerMgmtService', customerMgmtService);
})();