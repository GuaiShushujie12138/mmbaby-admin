/**
 * Created by dell on 2016/12/19.
 */
(function () {
    'use strict';
    FunctionPrivilegeMgmtService.$inject = ['$http']

    function FunctionPrivilegeMgmtService($http){
        return {
            functionPrivilegeQuery:functionPrivilegeQuery,
            addOrUpdatePrivilege:addOrUpdatePrivilege
        }
        function functionPrivilegeQuery(draw, sortColumn, sortDir, start, limit, where){
            return $http.post('/web/functionPrivilege/query' , {
                draw: draw, sortColumn: sortColumn, sortDir: sortDir, start: start, limit: limit, where: where
            });
        }


        function addOrUpdatePrivilege(id , code , functionName , parentId , isLeafNode , subSystemId , isHidden
            , functionIcon , orderBy){
            return $http.post('web/functionPrivilege/addOrUpdatePrivilege',{
                id:id,
                code:code,
                functionName:functionName,
                parentId:parentId,
                isLeafNode:isLeafNode,
                subSystemId:subSystemId,
                isHidden:isHidden,
                functionIcon:functionIcon,
                orderBy:orderBy
            });
        }
    }
    angular.module("app.function-privilege-mgmt").factory("FunctionPrivilegeMgmtService", FunctionPrivilegeMgmtService);
})();
