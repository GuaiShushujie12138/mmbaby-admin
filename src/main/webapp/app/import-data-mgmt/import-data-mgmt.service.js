(function () {
    'use strict';

    importDataMgmtService.$inject = ['$http', '$rootScope', 'toaster'];

    function importDataMgmtService($http, $rootScope, toaster) {

      return {
        showMessage: showMessage,
        getImportList:getImportList
      }

      function showMessage(title, msg, type) {
        toaster.pop({
          type: type || 'error',
          title: title || '提示信息',
          body: msg,
          showCloseButton: true,
          timeout: 5000
        });
        return false;

      }

      function getImportList(draw, sortColumn, sortDir, start, limit, where) {
        return $http.post(
            'upload/query', {
              draw: draw,
              sortColumn: sortColumn,
              sortDir: sortDir,
              start: start,
              limit: limit,
              where: where
            }
        );
      }

    }

    angular.module("app.import-data-mgmt")
        .factory("importDataMgmtService", importDataMgmtService);

})();