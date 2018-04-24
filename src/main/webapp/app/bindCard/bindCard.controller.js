(function(){
    'use strict';

    bindCardCtrl.$inject = ['$scope', '$http', '$uibModal', 'toaster', '$compile',
        '$filter', '$location', 'bindCardService', '$state', 'permissionCheckService'];

    function bindCardCtrl($scope,$http,$uibModal,toaster,
                          $compile,$filter,$location,bindCardService,$state,permissionCheckService) {
        var vm = this;
        function init() {
            /**
             * 获取银行列表
             */
            bindCardService.getBankList().then(function(resp) {
                if (resp.data.code === 200) {
                    vm.bankList = resp.data.data.bankList;
                }
            },function(){

            })

            /**
             * 获取省列表
             */
            bindCardService.getProvinceList().then(function (response) {
                vm.provinceList = response.data.data;
            }, function () {
                toaster.pop({
                    type: 'warning',
                    title: '提示信息',
                    body: '获取省失败',
                    timeout: 5000
                });
            });

            /**
             * 获取初始化的银行信息
             */
            bindCardService.getInitInfo().then(function(resp){
                vm.bankObj = resp.data.data.lscrmUsersBankEntityDto || {};

                if (vm.bankObj.bankId && vm.bankObj.bankId) {
                    bindCardService.getBankSubList(vm.bankObj.bankId, vm.bankObj.bankCityId).then(function (resq) {
                        if (resq.data.code == 200) {
                            vm.subBankList = resq.data.data.subBankList;
                        } else {
                            toaster.pop({
                                type: resq.data.code == 200 ? 'success' : 'error',
                                title: '提示信息',
                                body: resq.data.message,
                                showCloseButton: true,
                                timeout: 5000
                            });
                        }
                    });
                }


                /**
                 * 获取城市列表
                 */
                if (vm.bankObj.bankProvinceId) {
                    bindCardService.getCityList(vm.bankObj.bankProvinceId).then(function (response) {
                        vm.cityList = response.data.data;
                    }, function () {
                        toaster.pop({
                            type: 'warning',
                            title: '提示信息',
                            body: '获取城市列表失败',
                            timeout: 5000
                        });
                    });
                }
            });
        }

        init();


        /**
         * 点击修改银行卡的按钮
         */

        $scope.handleChangeBankInfo = function() {
            var bankObj = vm.bankObj;
            var validateDataInfo = validateData(bankObj);
            if (!validateDataInfo) {
                vm.bankList.forEach(function(item,index){
                    if (item.bankId === bankObj.bankId) {
                        bankObj.bankName = item.bankName;
                        bankObj.bankCode = item.bankCode;
                    }
                });

                vm.subBankList.forEach(function(item,index) {
                    if (item.bankSubId === bankObj.branchBankId) {
                        bankObj.bankFullname = item.bankSubName;
                    }
                });

                bindCardService.saveUsersBank(bankObj).then(function (resp) {
                    if (resp.data.code === 200) {
                        toaster.pop({
                            type:'success',
                            title: '提示信息',
                            body: resp.data.message,
                            showCloseButton: true,
                            timeout: 5000
                        })
                    }
                })

            } else {
                toaster.pop({
                    type:'error',
                    title: '提示信息',
                    body: validateDataInfo,
                    showCloseButton: true,
                    timeout: 5000
                })
            }
        }

        /**
         * 改变开户银行回调函数
         */
        $scope.changeBank = function () {
            vm.bankObj.branchBankId = '';
            var bankId = vm.bankObj.bankId;
            var cityId = vm.bankObj.bankCityId;
            if (bankId && cityId) {
                bindCardService.getBankSubList(bankId, cityId).then(function (resq) {
                    if (resq.data.code == 200) {
                        vm.subBankList = resq.data.data.subBankList;
                    } else {
                        toaster.pop({
                            type: resq.data.code == 200 ? 'success' : 'error',
                            title: '提示信息',
                            body: resq.data.message,
                            showCloseButton: true,
                            timeout: 5000
                        });
                    }
                });
            }
        };

        /**
         * 改变省后的回调函数
         */
        $scope.changeProvince = function(){
            // 重置区和支行
            vm.bankObj.branchBankId = vm.bankObj.bankCityId = '';
            vm.subBankList = vm.cityList = [];
            bindCardService.getCityList(vm.bankObj.bankProvinceId).then(function (response) {
                vm.cityList = response.data.data;
            }, function () {
                toaster.pop({
                    type: 'warning',
                    title: '提示信息',
                    body: '获取城市列表失败',
                    timeout: 5000
                });
            });
        }

        /**
         *  改变市后的回调函数
         */

        $scope.changeCity = function() {
            vm.subBankList = [];
            vm.bankObj.branchBankId  = '';
            var bankId = vm.bankObj.bankId;
            var cityId = vm.bankObj.bankCityId;
            if (bankId && cityId) {
                bindCardService.getBankSubList(bankId,cityId).then(function(resq){
                    if (resq.data.code == 200) {
                        vm.subBankList = resq.data.data.subBankList;
                    } else {
                        toaster.pop({
                            type: resq.data.code == 200 ? 'success' : 'error',
                            title: '提示信息',
                            body: resq.data.message,
                            showCloseButton: true,
                            timeout: 5000
                        });
                    }
                },function(){})
            }

        }

        function validateData(data) {
            if (!data.bankAccountOwner) {
                return '收款人信息不能为空';
            }

            if (!data.bankId) {
                return '开户银行不能为空';
            }

            if (!data.bankProvinceId) {
                return '开户省份不能为空';
            }

            if (!data.bankCityId) {
                return '开户城市不能为空';
            }

            if (!data.branchBankId) {
                return '开户支行不能为空';
            }

            if (!data.bankAccountNo) {
                return '银行账户不能为空';
            }

            return false;

        }





    }


    angular.module('app.bind-card')
        .controller('bindCardCtrl',bindCardCtrl);
}());