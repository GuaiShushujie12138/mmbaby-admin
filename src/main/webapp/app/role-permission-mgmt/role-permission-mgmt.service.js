(function () {
'use strict';

rolePermissionMgmtService.$inject = ['$http', '$rootScope'];

function rolePermissionMgmtService($http, $rootScope) {

    return {
        getTop20Role: getTop20Role,
        roleQuery:roleQuery,
        saveRole:saveRole,
        deleteRole:deleteRole,
        roleDetail:roleDetail,
        addUsers:addUsers,
        assignPermission:assignPermission,
        roleDetail_privileges:roleDetail_privileges,
        roleDetail_users:roleDetail_users,
        getRolePrivilegesTree:getRolePrivilegesTree,
        resumeRole:resumeRole,
        getUserScope:getUserScope
        

    }


    function getTop20Role() {
        return $http.post('web/rolePermission/getTop20Role', {}
        );
    }

    function roleQuery(draw, sortColumn, sortDir, start, limit, where){
        return $http.post('web/rolePermission/roleQuery', {
                draw: draw,
                sortColumn: sortColumn,
                sortDir: sortDir,
                start: start,
                limit: limit,
                where:where
            }
        );
    }

    /**
     * 获取角色权限树
     * @param roleId
     */
    function getRolePrivilegesTree(roleId){
        return $http({
            url: '/web/rolePermission/roleDetail-privileges-tree/' + roleId,
            method: 'GET'
        });

    }

    function saveRole(id,roleName,roleDesc,userScope,roleMgmtScope,remark,roleMgmtIds){
        return $http.post('web/rolePermission/saveRole',{
            id:id,
            roleName:roleName,
            roleDesc:roleDesc,
            userScope:userScope,
            roleMgmtScope:roleMgmtScope,
            remark:remark,
            roleMgmtIds:roleMgmtIds
        })
    }

    function deleteRole(roleId){
        return $http.post('web/rolePermission/deleteRole?roleId='+roleId)
    }

    function addUsers(userIds){
        return $http.post('web/rolePermission/addUsers',{
            userIds:userIds
        })
    }

    function roleDetail(roleId){
        return $http.get('web/rolePermission/roleDetail?roleId='+roleId)
    }

    function roleDetail_privileges(draw, sortColumn, sortDir, start, limit, where){
        return $http.post('web/rolePermission/roleDetail-privileges',{
            draw: draw,
            sortColumn: sortColumn,
            sortDir: sortDir,
            start: start,
            limit: limit,
            where:where
        })
    }

    function roleDetail_users(draw, sortColumn, sortDir, start, limit, where){
        return $http.post('web/rolePermission/roleDetail-users',{
            draw: draw,
                sortColumn: sortColumn,
                sortDir: sortDir,
                start: start,
                limit: limit,
                where:where
        })
    }

    function assignPermission(roleId,permissions){
        return $http.post('web/rolePermission/assignPermission',{
            roleId:roleId,
            permissionList:permissions
        })
    }


    function resumeRole(roleId){
        return $http.post('/web/rolePermission/resumeRole?roleId='+roleId)
    }

    function getUserScope() {
        return $http.get('/web/rolePermission/getUserScope');
    }

    


}



angular.module("app.role-permission-mgmt")
    .factory("rolePermissionMgmtService", rolePermissionMgmtService);

})();