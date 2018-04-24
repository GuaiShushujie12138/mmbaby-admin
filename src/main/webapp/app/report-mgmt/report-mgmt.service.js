(function () {
  'use strict';

  ReportService.$inject = ['$http'];

  function ReportService($http) {
    return {
      query: query,
      getAuthUsers: getAuthUsers
    };
    function query(beinTime, endTime, deptId, userId, type) {
      userId = ifn(userId, 0);
      type = (isNullOrEmpty(type) || isNaN(type)) ? 0 : type;
      deptId = deptId < 0 ? 0 : deptId;
      return $http.post('web/report/kpi-summary', {
        beginTime: beinTime,
        endTime: endTime,
        deptId: deptId,
        userId: userId,
        type: type
      })
    }

    function getAuthUsers() {
      return $http({
        url: '/web/report/getAuthUsers',
        method: 'GET'
      });

    }
  }

  angular
  .module('app.report-mgmt')
  .factory('ReportService', ReportService);
})();