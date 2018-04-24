(function () {
'use strict';

DashboardService.$inject = ['$http', '$rootScope'];

function DashboardService($http, $rootScope) {
    return {
        getAuditStatusCountStatistics: getAuditStatusCountStatistics
    };

    function getAuditStatusCountStatistics () {
        return $http.post('dashboard/index.do',
            {}
        );
    }

}

angular
    .module('app.dashboard')
    .factory('DashboardService', DashboardService);
})();