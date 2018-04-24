(function(){
    'use strict';
    bindCardService.inject = ['$http','$rootScope'];

    function bindCardService($http,$rootScope) {
        return {
            getBankList:getBankList,
            getBankSubList:getBankSubList,
            getProvinceList:getProvinceList,
            getCityList: getCityList,
            getInitInfo:getInitInfo,
            saveUsersBank:saveUsersBank
        };

        function getBankList() {
            return $http.get('/public/bank/all', {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }

        /**
         * 获取支行的方法
         * @param bankId
         * @param cityId
         * @returns {*}
         */
        function getBankSubList(bankId, cityId) {
            return $http.get('/public/bank/subAll?bankId=' + bankId + '&cityId=' + cityId, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }

        /**
         * 获取省列表
         * @returns {*}
         */
        function getProvinceList() {
            return $http.get('/item-mgmt/getProvinceList?id=1');
        }

        /**
         * 获取到城市列表
         * @param provinceId
         * @returns {*}
         */
        function getCityList(provinceId) {
            return $http.get('/item-mgmt/getCityList?id=' + provinceId);
        }


        /**
         * 初始化获取银行卡信息
         */

        function getInitInfo() {
            return $http.get('/usersbank-mgmt/queryUsersBank');
        }

        /**
         * crm保存银行卡
         */

        function saveUsersBank(data) {
            return $http.post('/usersbank-mgmt/saveUsersBank',{
                id: data.id || '',
                bankId: data.bankId,
                bankName: data.bankName,
                bankCode: data.bankCode,
                bankProvinceId: data.bankProvinceId,
                bankCityId: data.bankCityId,
                branchBankId: data.branchBankId,
                bankFullname: data.bankFullname,
                bankAccountNo: data.bankAccountNo,
                bankAccountOwner:data.bankAccountOwner
            });
        }
    }



    angular.module('app.bind-card')
        .factory('bindCardService',bindCardService);
}());