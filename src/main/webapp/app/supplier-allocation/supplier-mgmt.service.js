/**
 * supplier Management service
 */

'use strict';

supplierMgmtService.$inject = ['$http', '$rootScope', 'toaster'];

function supplierMgmtService($http, $rootScope, toaster) {
    return {
        supplierListQuery:supplierListQuery,
        releaseSupplier:releaseSupplier,
        assignUser:assignUser,
        getUsersList:getUsersList,
        getBelongUserList:getBelongUserList,
        getUnAllowanceNum:getUnAllowanceNum
    };


    /**
     * 供应商列表
     * @param draw
     * @param sortColumn
     * @param sortDir
     * @param start
     * @param limit
     * @param where
     * @returns {*}
     */
    function supplierListQuery(where) {
        return $http.post('/supplier-mgmt/query',where);
    }

    /**
     * 释放供应商
     * @param supplierId
     * @returns {*}
     */
    function releaseSupplier(supplierId) {
        return $http.post('/supplier-mgmt/assign/cancelUser',{
            supplierId: supplierId
        });
    }

    /**
     * 分配供应商
     * @param supplierId
     * @param userId
     */
    function assignUser(supplierId,employeeNo) {
        return $http.post('/supplier-mgmt/assign/user',{
            supplierId: supplierId,
          employeeNo: employeeNo
        });
    }

    /**
     * 获取到供给顾问列表
     * @returns {*}
     */
    function getUsersList() {
        return $http.post('/supplier-mgmt/assign/userList');
    }

    /**
     * 获取到供应商归属人
     * @returns {*}
     */
    function getBelongUserList() {
        return $http.post('/sample-mgmt/loanerList');
    }

    /**
     * 获取到未分配供应商数量
     * @returns {*}
     */
    function getUnAllowanceNum() {
        return $http.post('/supplier-mgmt/unAssignNum');
    }
}

angular
    .module('app.supplier-mgmt')
    .factory('supplierMgmtService', supplierMgmtService);
