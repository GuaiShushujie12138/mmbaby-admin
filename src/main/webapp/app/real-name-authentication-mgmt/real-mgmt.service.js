(function () {
  'use strict';

  RealService.$inject = ['$http'];

  function RealService($http) {
    return {
      query: query,
      detail:detail,
      audit:audit
    };

    function query(draw, sortColumn, sortDir, start, limit, where) {
      return $http.post('/web/customer/authentication-list', {
            draw: draw,
            sortColumn: sortColumn,
            sortDir: sortDir,
            start: start,
            limit: limit,
            where: where
          }
      );
    }

    function detail(customerId){
      return $http.get('/web/customer/authentication-detail?id='+customerId+'')
    }

    function audit(id,auditStatus,rejectReasonType,rejectReasonName,otherReason) {
      return $http.post('/web/customer/audit', {
          id:id,
          auditStatus: auditStatus,
          rejectReasonType: rejectReasonType,
          rejectReasonName:rejectReasonName,
          otherReason:otherReason
      })
    }
  }

  angular
  .module('app.real-name-authentication-mgmt')
  .factory('RealService', RealService);
})();