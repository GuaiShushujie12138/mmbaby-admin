'use strict';

permissionCheckService.$inject = ['$rootScope'];

function permissionCheckService($rootScope) {
    return {
        check: check
    };

    function check(functionCode) {
        var isHavePermission = false;
        if(functionCode=='-1'){
            return true;
        }

        if (!$rootScope.authButtonList.hasOwnProperty(functionCode)) {
            return false;
        }

        // for (var i = 0; i < $rootScope.authButtonList[sysTableId].length; i++) {
        //     if ($rootScope.authButtonList[sysTableId][i].btnscript === btnScript) {
        //         isHavePermission = true;
        //         break;
        //     }
        //
        // }
        return true;
    }
}

angular
    .module('app')
    .factory('permissionCheckService', permissionCheckService);