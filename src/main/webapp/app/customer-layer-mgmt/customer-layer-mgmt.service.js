(function () {
  'use strict';

  customerLayerService.$inject = ['$http'];

  function customerLayerService($http) {
    return {
      getCustomerLayerList: getCustomerLayerList,
      getConditionSelect: getConditionSelect,
      getOperatorSelect: getOperatorSelect,
      saveLayer: saveLayer,
      getRoleList: getRoleList,
      getLimitCount: getLimitCount,
      saveWhiteList: saveWhiteList,
      getWhiteList: getWhiteList,
      deleteLayer:deleteLayer
    };

    function getCustomerLayerList(customerType) {

      return $http.get(
          "/customer-layer/getCustomerLayerList?customerType=" + customerType);
    }

    function getConditionSelect() {

      return $http.get("/customer-layer/getConditionSelect");
    }

    function getOperatorSelect() {

      return $http.get("/customer-layer/getOperatorSelect");
    }

    function saveLayer(data) {
      return $http.post("/customer-layer/saveLayer",{
            requestData:data
          }
        )
    }

    // function saveLayer(id, matchType, name, description, weight, customerType,
    //     conditions) {
    //   return $http.post("/customer-layer/saveLayer", {
    //     id: id,
    //     matchType: matchType,
    //     name: name,
    //     description: description,
    //     weight: weight,
    //     customerType: customerType,
    //     conditions: conditions
    //   })
    // }
    function deleteLayer(layerId) {

      return $http.get("/customer-layer/deleteLayer?layerId=" + layerId);
    }

    function getRoleList() {
      return $http.get("/web/rolePermission/getRoleList")
    }

    function getLimitCount(customerType) {
      return $http.get(
          "/customer-layer/getLimitCount?customerType=" + customerType);
    }

    function getWhiteList(customerType) {
      return $http.get(
          "/customer-layer/getWhiteList?customerType=" + customerType);
    }

    function saveWhiteList(whiteList, customerType) {
      return $http.post("/customer-layer/saveWhiteList", {
        whiteList: whiteList,
        customerType: customerType
      })

    }

  }

  angular
  .module('app.customer-layer-mgmt')
  .factory('customerLayerService', customerLayerService);
})();