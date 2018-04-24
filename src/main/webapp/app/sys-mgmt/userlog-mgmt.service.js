(function () {

'use strict';

UserLogService.$inject = ['$http'];

function UserLogService($http) {
    return {
        query: query,
        UserAndDeptData:UserAndDeptData,
    };

    function query(draw, sortColumn, sortDir, start, limit, where) {
        return $http.post('web/sys/queryUserLog', {
            draw: draw,
            sortColumn: sortColumn,
            sortDir: sortDir,
            start: start,
            limit: limit,
            where:where
        });
    }

    function UserAndDeptData(){
        return $http.post('web/user/UserAndDeptData', {

        });

    }
}


angular
    .module('app.userlog-mgmt')
    .factory('UserLogService', UserLogService);
})();