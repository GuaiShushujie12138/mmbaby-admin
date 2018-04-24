(function () {

    'use strict';

    DashboardCtrl.$inject = ['$scope', '$http', '$compile', '$filter','DashboardService'];

    /**
     * DashboardCtrl
     */
    function DashboardCtrl($scope, $http, $compile, $filter,DashboardService) {
        var vm = this;


        vm.data={"waitCSAudit":0,"waitFINAudit":0,"waitAuthShopCount":0};

        function init(){
          
        }

        init();




    }

    angular
        .module('app.dashboard')
        .controller('DashboardCtrl', DashboardCtrl);
})();