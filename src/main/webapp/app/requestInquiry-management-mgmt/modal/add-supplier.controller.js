/**
 * Created by mf on 2017/8/15.
 */

(function () {

    'use strict';

    addSupplierCtrl.$inject = ['$scope', '$http', '$uibModal', '$uibModalInstance', '$filter', '$compile', 'toaster', 'requestInquiryMgmtService', 'DTOptionsBuilder', 'DTColumnBuilder', 'realShopId','itemId'];

    function addSupplierCtrl($scope, $http, $uibModal, $uibModalInstance, $filter, $compile, toaster, requestInquiryMgmtService, DTOptionsBuilder, DTColumnBuilder, realShopId, itemId) {

        $scope.realShopId = realShopId || 0;
        $scope.vm = {};
        $scope.vm.bankData = {};
        $scope.bankList = [];
        $scope.subBankList = [];

        requestInquiryMgmtService.getSupplierDetail($scope.realShopId, 0).then(function (resq) {
            if (resq.data.code == 200) {

                $scope.realShopInfo = resq.data.data.customerInfo;

                console.log($scope.realShopInfo);

                $scope.vm.province = $scope.realShopInfo.shopProvinceId;
                $scope.vm.city = $scope.realShopInfo.shopCityId;
                $scope.vm.area = $scope.realShopInfo.shopDistrictId;

                $scope.vm.shopName = $scope.realShopInfo.shopName;
                $scope.vm.shopContactTel = $scope.realShopInfo.contactMobile;
                $scope.vm.shopContacts = $scope.realShopInfo.contactName;
                $scope.vm.shopCompanyName = $scope.realShopInfo.companyName;
                $scope.vm.shopAddress = $scope.realShopInfo.shopAddress;

                $scope.vm.bankData.accountOwner = $scope.realShopInfo.accountOwner;
                $scope.vm.bankData.accountNo = $scope.realShopInfo.accountNo;
                $scope.vm.bankData.bankCode = $scope.realShopInfo.bankCode;
                $scope.vm.bankData.bankProvince = $scope.realShopInfo.bankProvinceId;
                $scope.vm.bankData.bankCity = $scope.realShopInfo.bankCityId;
                $scope.vm.bankData.bankFullname = $scope.realShopInfo.bankFullName;

                $scope.changeProvince(1, true);
                $scope.changeCity(1, true);
                $scope.changeProvince(2, true);
                $scope.changeCity(2, true);
                getBankInitInformation();
            } else {
                getBankInitInformation();
            }
        });

        function getBankInitInformation() {
            // 获取银行列表
            requestInquiryMgmtService.getBankList().then(function (resq) {
                if (resq.data.code == 200) {
                    $scope.bankList = resq.data.data.bankList;
                    for (var index in $scope.bankList) {
                        if ($scope.bankList[index].bankCode == $scope.vm.bankData.bankCode) {
                            $scope.vm.bankData.bankId = $scope.bankList[index].bankId;
                        }
                    }
                    $scope.changeBankSubAll();
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


        $scope.changeBankSubAll = function () {
            var bankId = $scope.vm.bankData.bankId;
            var cityId = $scope.vm.bankData.bankCity;
            if (bankId && cityId) {
                requestInquiryMgmtService.getBankSubList(bankId, cityId).then(function (resq) {
                    if (resq.data.code == 200) {
                        $scope.subBankList = resq.data.data.subBankList;
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


        // 省市区三级联动初始化方法(分为新增)
        function initCityPicker() {
            requestInquiryMgmtService.getProvinceList().then(function (response) {
                $scope.provinceList = response.data.data;
            }, function () {
                toaster.pop({
                    type: 'warning',
                    title: '提示信息',
                    body: '获取省失败',
                    timeout: 5000
                });
            });

            // 改变省
            $scope.changeProvince = function (listnub, isgetData) {
                if (!isgetData) {
                    if (listnub == 1) {
                        $scope.vm.city = $scope.vm.area = 0;
                    } else {
                        $scope.vm.bankData.bankCity = 0;
                        $scope.vm.bankData.bankFullname = '';
                        $scope.bankSubList = [];
                    }
                }
                $scope['cityList' + listnub] = $scope['districtList' + listnub] = [];
                var provinceId;
                if (listnub == 1) {
                    provinceId = $scope.vm.province || 0;
                } else {
                    provinceId = $scope.vm.bankData.bankProvince || 0;
                }
                if (provinceId && provinceId !== 0) {
                    requestInquiryMgmtService.getCityList(provinceId).then(function (response) {
                        $scope['cityList' + listnub] = response.data.data;
                    }, function () {
                        toaster.pop({
                            type: 'warning',
                            title: '提示信息',
                            body: '获取城市列表失败',
                            timeout: 5000
                        });
                    });
                }
            };

            // 改变城市
            $scope.changeCity = function (listnub, isgetData) {
                if (!isgetData) {
                    if (listnub == 1) {
                        $scope.vm.area = 0;
                    } else {
                        $scope.vm.receiveDistrictId = 0;
                    }
                }
                $scope['districtList' + listnub] = [];
                var cityId;
                if (listnub == 1) {
                    cityId = $scope.vm.city;
                }
                if (cityId && cityId !== 0) {
                    requestInquiryMgmtService.getDistrictList(cityId).then(function (response) {
                        $scope['districtList' + listnub] = response.data.data;
                    }, function () {
                        toaster.pop({
                            type: 'warning',
                            title: '提示信息',
                            body: '获取区域列表失败',
                            timeout: 5000
                        });
                    });
                }
            };
            $scope.changeProvince(1, true);
            $scope.changeProvince(2, true);
            $scope.changeCity(1, true);
            $scope.changeCity(2, true);
        }

        initCityPicker();

        function getBankData() {
            var vm = $scope.vm;
            var bankData = vm.bankData;
            var len = $scope.bankList.length;
            for (var i = 0; i < len; i++) {
                if ($scope.bankList[i].bankId == bankData.bankId) {
                    bankData.bankName = $scope.bankList[i].bankName;
                    bankData.bankCode = $scope.bankList[i].bankCode;
                    break;
                }
            }

            var subLen = $scope.subBankList.length;
            for (var i = 0; i < subLen; i++) {
                if ($scope.subBankList[i].bankSubName == bankData.bankFullname) {
                    bankData.bankNo = $scope.subBankList[i].bankNo;
                    break;
                }
            }

            return [bankData];
        }

        $scope.ok = function () {
            var verify = verifyData();
            if (verify) {
                toaster.pop({
                    type: 'info',
                    title: '提示信息',
                    body: verify,
                    showCloseButton: true,
                    timeout: 5000
                });
                return false;
            }
            var data = $scope.vm;
            data.supplierBankAccountDtos = getBankData();
            data.itemId = itemId;
            data.supplierRealShopMappingDtos = [{
                "realShopId": $scope.realShopId
            }];

            requestInquiryMgmtService.addSupplier(data).then(function (resq) {
                toaster.pop({
                    type: resq.data.code == 200 ? 'success' : 'error',
                    title: '提示信息',
                    body: resq.data.message,
                    showCloseButton: true,
                    timeout: 5000
                });
                if (resq.data.code == 200) {
                    var closeData = {
                        niceShopId: resq.data.data.niceShopId,
                        shopName: $scope.vm.shopName,
                    };
                    $uibModalInstance.close(closeData);
                }
            });
        };

        function verifyData() {
            var rex = /^\d+$/g;
            var vm = $scope.vm;
            if (!vm.shopName) {
                return '请输入供应商名称'
            }
            if (!vm.shopContactTel) {
                return '请输入正确的联系人手机'
            }
            if (!vm.shopContacts) {
                return '请输入联系人'
            }
            if (!vm.shopCompanyName) {
                return '请输入公司名称'
            }
            if (!vm.province || !vm.city || !vm.area || !vm.shopAddress) {
                return '请输入公司地址'
            }
            if (!vm.bankData.accountOwner) {
                return '请输入持卡人姓名'
            }
            if (!vm.bankData.accountNo) {
                return '请输入正确的银行账号'
            }
            if (!vm.bankData.bankId) {
                return '请输入开户银行'
            }

            if (!vm.bankData.bankProvince) {
                return '请选择开户省份'
            }
            if (!vm.bankData.bankCity) {
                return '请选择开户省份'
            }
            if (!vm.bankData.bankFullname) {
                return '请选择开户省份'
            }
            return false;
        }


        $scope.cancel = function () {
            $uibModalInstance.close();
        };
    }

    angular
        .module('app.request-inquiry-management')
        .controller('addSupplierCtrl', addSupplierCtrl);

})();