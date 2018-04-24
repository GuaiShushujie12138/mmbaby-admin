/**
 * delivery.controller.js
 */
(function () {

    'use strict';

    deliveryCtrl.$inject =
        ['$scope', '$uibModalInstance', '$compile',
            'tradeMgmtService', 'toaster', 'initDeliveryData'];

    function deliveryCtrl($scope, $uibModalInstance, $compile, tradeMgmtService, toaster, initDeliveryData) {
        var vm = this;

        /**
         * 初始化页面数据
         */
        function initData() {
            vm.deliveryTypeList = [{name: '商家发货', id: 10}, {name: '买家自提', id: 20}];
            $scope.tradeLogistics = initDeliveryData.tradeLogistics || {};
            $scope.tradeLogistics.deliveryType = 10;
            $scope.rootCategoryId = initDeliveryData.rootCategoryId || 1;
            $scope.isChecked = false;

            $scope.interpretation = {};

            $scope.packingSlipDetail = initDeliveryData.packingSlipDetail || [];

            $scope.packingSlipDetail.forEach(function(item,index) {
                item.rollListFirst = chunk(item.rollList,5)[0];
                item.rollListNext = chunk(item.rollList,5).slice(1);
                item.rollListLength = chunk(item.rollList,5).length;
            });

            tradeMgmtService.getLogistics().then(function(resp){
                if (resp.data.code === 200) {
                    vm.logisticsCompanyList = resp.data.data;
                }
            },function(err) {

            });

            $scope.$watch('$viewContentLoaded', function () {
                //物流凭证上传
                newOssUpload($('#imgUploadIdCard')[0], function (imgurls) {
                    $scope.tradeLogistics.logisticsPics = $scope.tradeLogistics.logisticsPics || [];
                    $scope.tradeLogistics.logisticsPics = $scope.tradeLogistics.logisticsPics.concat(imgurls);
                    $scope.$apply();
                });
            });

            /**
             * 获取省的列表
             */
            tradeMgmtService.getProvinceList().then(function (resp) {
                if (resp.data.code === 200) {
                    vm.provinceList = resp.data.data.list;
                }
            }, function (err) {

            });

            /**
             * 根据是否为编辑来获取到市和区的列表
             */

            if ($scope.tradeLogistics.receiverProvinceId) {
                // 获取到市的列表
                tradeMgmtService.getCityList($scope.tradeLogistics.receiverProvinceId).then(function (resp) {
                    if (resp.data.code === 200) {
                        vm.cityList = resp.data.data.list;
                    }
                }, function (err) {

                });
            }

            if ($scope.tradeLogistics.receiverCityId) {
                // 获取到区的列表
                tradeMgmtService.getAreaList($scope.tradeLogistics.receiverCityId).then(function (resp) {
                    if (resp.data.code === 200) {
                        vm.areaList = resp.data.data.list;
                    }
                }, function (err) {

                });
            }
        }


        initData();

        /**
         * 获取到城市的列表
         */
        $scope.getCityList = function (provinceId) {
            $scope.tradeLogistics.receiverDistrictId = '';
            tradeMgmtService.getCityList(provinceId).then(function (resp) {
                if (resp.data.code === 200) {
                    vm.cityList = resp.data.data.list;
                }
            }, function (err) {

            });
        }

        /**
         * 获取到区的列表
         */
        $scope.getAreaList = function (cityId) {
            if (cityId) {
                $scope.tradeLogistics.receiverDistrictId = '';
                tradeMgmtService.getAreaList(cityId).then(function (resp) {
                    if (resp.data.code === 200) {
                        vm.areaList = resp.data.data.list;
                    }
                }, function (err) {

                });
            }
        }

        /**
         * 删除某个图片
         */
        $scope.delimg = function ($index) {
            $scope.tradeLogistics.logisticsPics = $scope.tradeLogistics.logisticsPics.filter(function (item, index) {
                if ($index === index) {
                    return false;
                }
            });
        }

        /**
         * 改变某一个色号或者规格
         * @param index
         */
        $scope.changeRollAmount = function ($index) {
            var isChecked = $scope.interpretation[$index];
            var isTotalChecked = true; // 全选

            $scope.packingSlipDetail.forEach(function (item, index) {
                if (index === $index) {
                    item.rollList.forEach(function (item2, index2) {
                        if (!item2.deliveryType) {
                            item2.isChecked = isChecked;
                        }
                    });
                }
            });

            $scope.packingSlipDetail.forEach(function (item, index) {
                item.rollList.forEach(function (item2, index2) {
                    if (!item2.deliveryType) {
                        if (!item2.isChecked) {
                            isTotalChecked = false;
                        }
                    }
                });
            });

            $scope.isChecked = isTotalChecked;


        }

        /**
         * 改变某一个码单明细
         */

        $scope.changeThisRollAmount = function (packingIndex) {
            var isAllChecked = true;
            var isTotalChecked = true;
            $scope.packingSlipDetail.forEach(function (item, index) {
                if (index === packingIndex) {
                    item.rollList.forEach(function (item2, index2) {
                        if (!item2.deliveryType) {
                            if (!item2.isChecked) {
                                isAllChecked = false;
                            }
                        }
                    });
                }
            })

            $scope.packingSlipDetail.forEach(function (item, index) {
                item.rollList.forEach(function (item2, index2) {
                    if (!item2.deliveryType) {
                        if (!item2.isChecked) {
                            isTotalChecked = false;
                        }
                    }
                });
            });

            $scope.isChecked = isTotalChecked;

            $scope.interpretation[packingIndex] = isAllChecked;
        };


        /**
         *  改变全选按钮
         */

        $scope.changeAllRollAmount = function () {
            var isChecked = $scope.isChecked;
            $scope.packingSlipDetail.forEach(function (item, index) {
                $scope.interpretation[index] = isChecked;
                item.rollList.forEach(function (item2, index2) {
                    if (!item2.deliveryType) {
                        item2.isChecked = isChecked;
                    }
                });
            })
        }

        /**
         * 获取发货数量的数据
         * @returns {Array}
         */
        function getPackingData() {
            var packingSlipArr = [];
            var packingSlipObj;
            var rollList;
            $scope.packingSlipDetail.forEach(function (item, index) {
                packingSlipObj = {};
                rollList = []
                packingSlipObj.detailId = item.detailId;
                for (var i = 0, j = item.rollList.length; i < j; i++) {
                    if (!item.rollList[i].deliveryType && item.rollList[i].isChecked) {
                        rollList.push({"rollId": item.rollList[i].rollId});
                    }
                }
                packingSlipObj.rollList = rollList;
                packingSlipArr.push(packingSlipObj);
            });

            return packingSlipArr;
        }

        /**
         * 点击发货后
         */
        $scope.deliveryData = function () {
            var packingSlipData;
            var tradeLogistics = $scope.tradeLogistics;
            if ($scope.validateData()) { //验证数据
                packingSlipData = getPackingData();
                vm.logisticsCompanyList.forEach(function(item,index) {
                    if (item.id === tradeLogistics.logisticsCompanyId) {
                        tradeLogistics.logisticsCompanyName = item.name;
                    }
                });

                vm.provinceList.forEach(function(item,index) {
                    if (item.id === tradeLogistics.receiverProvinceId) {
                        tradeLogistics.receiverProvinceName = item.name;
                    }
                });

                vm.cityList.forEach(function(item,index) {
                    if (item.id === tradeLogistics.receiverCityId) {
                        tradeLogistics.receiverCityName = item.name;
                    }
                });

                vm.areaList.forEach(function(item,index) {
                    if (item.id === tradeLogistics.receiverDistrictId) {
                        tradeLogistics.receiverDistrictName = item.name;
                    }
                });

                tradeMgmtService.deliverySubmit(tradeLogistics,packingSlipData).then(function(resp) {
                    if (resp.data.code === 200) {
                        showMessage('发货成功','','success');
                        $uibModalInstance.dismiss('cancel');
                    } else {
                        showMessage(resp.data.message);
                    }
                });
            }
        }


        $scope.validateData = function() {
            var tradeLogistics = $scope.tradeLogistics;

            var packingSlipData = getPackingData();
            var allRollList = [];

            if (tradeLogistics.deliveryType === 10) {
                if (!tradeLogistics.logisticsCompanyId) {
                    showMessage('物流公司不能为空');
                    return;
                } else if (!tradeLogistics.receiverName) {
                    showMessage('收件人不能为空');
                    return;
                } else if (!tradeLogistics.receiverMobile) {
                    showMessage('联系电话不能为空');
                    return;
                } else if (!tradeLogistics.receiverProvinceId || !tradeLogistics.receiverDistrictId || !tradeLogistics.receiverCityId) {
                    showMessage('物流地址不能为空');
                    return;
                }   else if (!tradeLogistics.receiverAddress) {
                    showMessage('详细地址不能为空');
                    return;
                }
            }

            if (packingSlipData && packingSlipData instanceof  Array) {
                packingSlipData.forEach(function(item,index) {
                    allRollList = allRollList.concat(item.rollList);
                });
                if (allRollList.length === 0) {
                    showMessage('码单明细不能为空');
                    return;
                }
            }
            return true;
        }

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };

        /**
         * 根据cols来对data进行分组
         * @param data
         * @param cols
         */
        function chunk(data,cols) {
            var list = [];
            var current = [];
            if (data && data instanceof Array) {
                data.forEach(function(item,index) {
                    current.push(item);
                    if (current.length === cols) {
                        list.push(current);
                        current = [];
                    }
                });

                if (current.length > 0) {
                    while(current.length < 5) {
                        current.push({'rollAmount': ''});
                    }
                    list.push(current);
                }
            }
            return list;
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

    }

    angular
        .module('app.trade-mgmt')
        .controller('deliveryCtrl', deliveryCtrl);

})();