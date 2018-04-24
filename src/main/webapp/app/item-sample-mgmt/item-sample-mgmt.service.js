(function () {
  'use strict';

  ItemSampleService.$inject = ['$http', 'SweetAlert', 'toaster'];

  function ItemSampleService($http, SweetAlert, toaster) {
    return {};

  }

  angular
  .module('app.item-sample-mgmt')
  .factory('itemSampleService', ItemSampleService);
})();