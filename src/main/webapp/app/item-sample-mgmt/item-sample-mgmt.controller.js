(function () {
  'use strict';

  ItemSampleCtrl.$inject = ['$http', 'SweetAlert', 'toaster'];

  function ItemSampleCtrl($http, SweetAlert, toaster) {
    return {};

  }

  angular
  .module('app.item-sample-mgmt')
  .factory('itemSampleCtrl', ItemSampleCtrl);
})();