(function () {
    'use strict';

    downloadService.$inject = ['$http'];

    function downloadService($http) {
        return {
            query: query
        };
        function query(draw,start, limit, startDate,endDate ) {
            return $http.get("/download-mgmt/query?draw="+draw+"&start="
                             +start+"&limit="+limit+"&startTime="+startDate+"&endTime="+endDate)
        }

    }
    angular
        .module('app.download-mgmt')
        .factory('downloadService', downloadService);
})();