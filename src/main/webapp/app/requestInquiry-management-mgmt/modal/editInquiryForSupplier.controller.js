/**
 * Created by joey on 2017/8/15.
 *
 * 修改询价单
 */

(function () {

    'use strict';

    editInquiryCtrlForRouteSupplier.$inject = ['$scope', '$http', '$uibModal','$filter', '$compile', 'toaster','requestInquiryMgmtService','SweetAlert','$stateParams'];

    function editInquiryCtrlForRouteSupplier($scope, $http, $uibModal, $filter, $compile, toaster,requestInquiryMgmtService,SweetAlert,$stateParams) {

        var itemId = null;
        if($stateParams) {
            itemId = $stateParams.itemId;
        }

        var vm = this;

        $scope.okBtnDisabled = true;

        /**
         * 点击下一步操作
         */
        $scope.nextStep = function() {
            var ajaxData = {};
            var colorNoList = [];
            var specificationNoList = [];
            var itemColorDTOList = [];
            var itemSpecificationDTOList = [];
            // 验证
            $scope.itemCraftsDTOList.forEach(function(item,index) {

                if (item.editable) {
                    toaster.pop({
                        type: 'error',
                        title: '工艺不能为可编辑的状态',
                        body: '',
                        showCloseButton: true,
                        timeout: 5000
                    });
                    return;
                }
            });

            // 验证空差米差是否填写,辅料不用验证

            if ($scope.rootCategoryId === 1) {
                if (Number($scope.sellType.type) === 1) {
                    if ($scope.sellType.paperTube == null || $scope.sellType.blankShort == null) {
                        popup('error','纸管,空差数据没填写完整');
                        return;
                    }
                } else if (Number($scope.sellType.type) === 2) {
                    if (!$scope.sellType.meterShort) {
                        popup('error','米差数据没有填写');
                        return;
                    }
                } else {
                    popup('error','您有空差/米差需要选择');
                    return;
                }
            }


            // 验证时间,时间必填

            if ($scope.isSetInventory && (!vm.endDate || vm.endDate === 'Invalid date')) {
                popup('error','库存/价格有效期必须填写');
                return;
            }
            // 验证询价列表中是否足货,有货或者无货没有选择

            if ($scope.isSetInventory) {
                if ($scope.blackInquiryList.length > 0 ) {
                    for (var i = 0, j = $scope.blackInquiryList.length; i < j; i++) {
                        if (!$scope.blackInquiryList[i].inventoryStatus && $scope.blackInquiryList[i].inventoryStatus!== 0) {
                            toaster.pop({
                                type: 'error',
                                title: '黑色库存列表中足货,有货,无货没有选择',
                                body: '',
                                showCloseButton: true,
                                timeout: 5000
                            });
                            return;
                        }
                    }

                }

                if ($scope.whiteInquiryList.length > 0 ) {
                    for (var i = 0, j = $scope.whiteInquiryList.length; i < j; i++) {
                        if (!$scope.whiteInquiryList[i].inventoryStatus && $scope.whiteInquiryList[i].inventoryStatus!== 0) {
                            toaster.pop({
                                type: 'error',
                                title: '白色询价列表中足货,有货,无货没有选择',
                                body: '',
                                showCloseButton: true,
                                timeout: 5000
                            });
                            return;
                        }
                    }
                }

                if ($scope.variegateInquiryList.length > 0) {
                    for (var i = 0, j = $scope.variegateInquiryList.length; i < j; i++) {
                        if (!$scope.variegateInquiryList[i].inventoryStatus  && $scope.variegateInquiryList[i].inventoryStatus!== 0) {
                            toaster.pop({
                                type: 'error',
                                title: '杂色询价列表中足货,有货,无货没有选择',
                                body: '',
                                showCloseButton: true,
                                timeout: 5000
                            });
                            return;
                        }
                    }
                }

                if ($scope.specificationInquiryList.length > 0) {
                    for (var i = 0, j = $scope.specificationInquiryList.length; i < j; i++) {
                        if (!$scope.specificationInquiryList[i].inventoryStatus && $scope.specificationInquiryList[i].inventoryStatus !== 0) {
                            toaster.pop({
                                type: 'error',
                                title: '规格询价列表中足货,有货,无货没有选择',
                                body: '',
                                showCloseButton: true,
                                timeout: 5000
                            });
                            return;
                        }
                    }
                }
            }

            /**
             * 黑色的色号列表
             */
            if ($scope.blackColorList.colorNo) {
                if (Number($scope.blackColorList.colorNo.indexOf(';')) === ($scope.blackColorList.colorNo.length - 1)) {
                    $scope.blackColorList.colorNo = $scope.blackColorList.colorNo.slice(0,$scope.blackColorList.colorNo.length - 1);
                }
                if ($scope.blackColorList.colorNo.indexOf(';') !== -1) {
                    popup('error','黑色色系只能添加一个色号');
                    return;
                }
                if (!$scope.blackColorList.swatchPrice ||
                    !$scope.blackColorList.swatchMeasurementUnit ||
                    !$scope.blackColorList.largeCargoPrice ||
                    !$scope.blackColorList.largeCargoMeasurementUnit){
                    popup('error','黑色列表中您有样布/大货单位,样布/大货价格需要补充');
                    return;
                }

                $scope.blackColorList.colorId = 971;
                $scope.blackColorList.itemId = itemId;
                $scope.blackColorList.colorName = '黑色';
                // $scope.blackColorList.inventoryStatus = "0";
                // $scope.blackColorList.inventory = 0;
                if ($scope.isSetInventory) {
                    for (var i =0, j = $scope.blackInquiryList.length; i < j; i++) {
                        if ($scope.blackColorList.colorNo === $scope.blackInquiryList[i].colorNo) {
                            $scope.blackColorList.inventoryStatus = $scope.blackInquiryList[i].inventoryStatus;
                            if ( $scope.blackColorList.inventoryStatus == '1') {
                                $scope.blackColorList.inventory = $scope.blackInquiryList[i].inventory;
                            }
                        }
                    }
                }
                itemColorDTOList.push($scope.blackColorList);
            }

            /**
             * 白色的色号列表
             */
            if ($scope.whiteColorList.colorNo) {
                if (Number($scope.whiteColorList.colorNo.indexOf(';')) === ($scope.whiteColorList.colorNo.length - 1)) {
                    $scope.whiteColorList.colorNo = $scope.whiteColorList.colorNo.slice(0,$scope.whiteColorList.colorNo.length -1);
                }

                if ($scope.whiteColorList.colorNo.indexOf(';') !== -1) {
                    popup('error','白色色系只能添加一个色号');
                    return;
                }

                if (!$scope.whiteColorList.swatchPrice ||
                    !$scope.whiteColorList.swatchMeasurementUnit ||
                    !$scope.whiteColorList.largeCargoPrice ||
                    !$scope.whiteColorList.largeCargoMeasurementUnit) {
                    popup('error', '白色列表中您有样布/大货单位,样布/大货价格需要补充');
                    return;
                }
                $scope.whiteColorList.colorId = 975;
                $scope.whiteColorList.itemId = itemId;
                $scope.whiteColorList.colorName = '白色';
                // $scope.whiteColorList.inventoryStatus = "0";
                // $scope.whiteColorList.inventory = 0;
                if ($scope.isSetInventory) {
                    for (var i =0, j = $scope.whiteInquiryList.length; i < j; i++) {
                        if ($scope.whiteColorList.colorNo === $scope.whiteInquiryList[i].colorNo) {
                            $scope.whiteColorList.inventoryStatus = $scope.whiteInquiryList[i].inventoryStatus;
                            if ( $scope.whiteColorList.inventoryStatus == '1') {
                                $scope.whiteColorList.inventory = $scope.whiteInquiryList[i].inventory;
                            }
                        }
                    }
                }
                itemColorDTOList.push($scope.whiteColorList);
            }



            /**
             *  在杂色列表中,判断是否有没有选中
             */
            if ($scope.variegateColorList.length > 0) {
                for (var i = 0, j = $scope.variegateColorList.length; i < j; i++) {

                    if (!$scope.variegateColorList[i].swatchPrice ||
                        !$scope.variegateColorList[i].swatchMeasurementUnit ||
                        !$scope.variegateColorList[i].largeCargoPrice ||
                        !$scope.variegateColorList[i].largeCargoMeasurementUnit){
                        popup('error','杂色列表中您有样布/大货单位,样布/大货价格需要补充');
                        return;
                    }
                }
            }

            /**
             * 杂色色号列表
             */
            //收集所有杂色色号
            for (var i = 0,j = $scope.variegateColorList.length; i < j; i++) {
                colorNoList = colorNoList.concat(parseColorNo($scope.variegateColorList[i].colorNo));
            }

            var colorItem;
            for (var i = 0,j = colorNoList.length; i < j; i++) {
                colorItem= {};
                colorItem.itemId = itemId;
                colorItem.colorNo = colorNoList[i];
                colorItem.colorId = 976;
                colorItem.colorName = '杂色';
                // colorItem.inventoryStatus = '0';
                // colorItem.inventory = 0;

                // 遍历variegateColorList,找出对应色号的对应colorId和colorName

                $scope.variegateColorList.forEach(function(item,index) {
                    if (item.colorNo.indexOf(colorNoList[i]) !== -1 && colorNoList[i]) {
                        item.colorNoNameArr && item.colorNoNameArr.forEach(function(item2,index2) {
                            if (item2.colorNo === colorNoList[i]) {
                                colorItem.colorId = item2.colorId;
                                colorItem.colorName = item2.colorName;
                            }
                        });
                    }
                });

                // 遍历杂色询价列表,获取到库存和状态
                if ($scope.isSetInventory) {
                    for (var m = 0,n = $scope.variegateInquiryList.length; m < n; m++) {
                        if ($scope.variegateInquiryList[m].colorNo === colorNoList[i]) {
                            colorItem.inventoryStatus = $scope.variegateInquiryList[m].inventoryStatus;
                            if ($scope.variegateInquiryList[m].inventoryStatus == '1') { // 有货状态
                                colorItem.inventory = $scope.variegateInquiryList[m].inventory;
                            }
                            break;
                        }
                    }
                }

                // 遍历所有的杂色列表,找到当前色号的价格
                for (var m = 0, n = $scope.variegateColorList.length; m < n; m++) {
                    var parseColorArr = parseColorNo($scope.variegateColorList[m].colorNo);
                    if (parseColorArr.indexOf(colorNoList[i]) > -1) {
                        colorItem.swatchPrice = $scope.variegateColorList[m].swatchPrice;
                        colorItem.largeCargoPrice = $scope.variegateColorList[m].largeCargoPrice;
                        colorItem.swatchMeasurementUnit =  $scope.variegateColorList[m].swatchMeasurementUnit;
                        colorItem.largeCargoMeasurementUnit =  $scope.variegateColorList[m].largeCargoMeasurementUnit;
                        break;
                    }
                }
                itemColorDTOList.push(colorItem);
            }

            /**
             * 规格列表中,,判断是否有没有选中样布价,大货价,样布单位,大货单位
             */

            if ($scope.specificationList.length > 0) {
                for (var i = 0, j = $scope.specificationList.length; i < j; i++) {

                    if (!$scope.specificationList[i].swatchPrice ||
                        !$scope.specificationList[i].swatchMeasurementUnit ||
                        !$scope.specificationList[i].largeCargoPrice ||
                        !$scope.specificationList[i].largeCargoMeasurementUnit){
                        popup('error','规格列表中您有样布/大货单位,样布/大货价格需要补充');
                        return;
                    }
                }
            }

            for (var i = 0,j = $scope.specificationList.length; i < j; i++) {
                specificationNoList = specificationNoList.concat(parseColorNo($scope.specificationList[i].specification));
            }

            var colorItem;
            for (var i = 0,j = specificationNoList.length; i < j; i++) {
                colorItem= {};
                colorItem.itemId = itemId;
                colorItem.specification = specificationNoList[i];
                // colorItem.inventoryStatus = '0';
                // colorItem.inventory = 0;
                // 遍历规格询价列表,获取到库存和状态

                if ($scope.isSetInventory) {
                    for (var m = 0,n = $scope.specificationInquiryList.length; m < n; m++) {
                        if ($scope.specificationInquiryList[m].specification === specificationNoList[i]) {
                            colorItem.inventoryStatus = $scope.specificationInquiryList[m].inventoryStatus;
                            if ($scope.specificationInquiryList[m].inventoryStatus == '1') { // 有货状态
                                colorItem.inventory = $scope.specificationInquiryList[m].inventory;
                            }
                            break;
                        }
                    }
                }

                // 遍历所有的杂色列表,找到当前色号的价格
                for (var m = 0, n = $scope.specificationList.length; m < n; m++) {
                    var parseColorArr = parseColorNo($scope.specificationList[m].specification);
                    if (parseColorArr.indexOf(specificationNoList[i]) > -1) {
                        colorItem.swatchPrice = $scope.specificationList[m].swatchPrice;
                        colorItem.largeCargoPrice = $scope.specificationList[m].largeCargoPrice;
                        colorItem.swatchMeasurementUnit =  $scope.specificationList[m].swatchMeasurementUnit;
                        colorItem.largeCargoMeasurementUnit =  $scope.specificationList[m].largeCargoMeasurementUnit;
                        break;
                    }
                }
                itemSpecificationDTOList.push(colorItem);
            }



            /**
             * 传递纸管空差数据
             */

            if ($scope.rootCategoryId === 1) {
                if (Number($scope.sellType.type) === 1) {
                    ajaxData.paperTube = $scope.sellType.paperTube;
                    ajaxData.blankShort = $scope.sellType.blankShort;
                    ajaxData.meterShort = '';
                } else if (Number($scope.sellType.type) === 2) {
                    ajaxData.paperTube = '';
                    ajaxData.blankShort = '';
                    ajaxData.meterShort = $scope.sellType.meterShort;
                }
            } else {
                ajaxData.paperTube = '';
                ajaxData.blankShort = '';
                ajaxData.meterShort = '';
            }


            /**
             * 传递itemId
             */

            ajaxData.itemId = itemId;

            /**
             * 传递工艺信息
             * @type {any}
             */
            ajaxData.itemCraftsDTOList = $scope.itemCraftsDTOList;


            /**
             * 传递色号信息(库存信息)
             * @type {Array}
             */
            ajaxData.itemColorDTOList = itemColorDTOList;

            /**
             * 传递有效期,如果设置库存了,就需要传递时间,如果没有设置,就不传
             */
            if ($scope.isSetInventory) {
                ajaxData.inventoryTime = vm.endDate;
            }

            /**
             * 传递规格信息
             * @type {Array.<T>}
             */
            ajaxData.itemSpecificationDTOList = itemSpecificationDTOList;

            /**
             * 为了区分设置库存和普通询价而设置的type值
             * @type {number}
             */
            ajaxData.type = 2;

            requestInquiryMgmtService.inquirySave(ajaxData).then(function(resp) {
                if (resp.data.code === 200) {
                    toaster.pop({type: 'success', title: '保存成功', body: '', showCloseButton: true, timeout: 5000});

                } else {
                    toaster.pop({type: 'error', title: resp.data.message, body: '', showCloseButton: true, timeout: 5000});
                }
            });
        }


        /**
         *  添加工艺
         */
        $scope.addCraft = function () {
            var newCraftObj = {
                itemId: itemId,
                price: '',
                craftsName: '',
                editable: true
            }
            $scope.itemCraftsDTOList.push(newCraftObj);
        };

        /**
         * 删除工艺
         */

        $scope.deleteCraft = function($index) {
            $scope.itemCraftsDTOList = $scope.itemCraftsDTOList.filter(function(item,index) {
                if (index !== $index) {
                    return true;
                }
            });
        }

        /**
         * 点击修改工艺
         */

        $scope.editCraft = function($index) {
            $scope.itemCraftsDTOList.map(function(item,index) {
                if (index === $index) {
                    item.editable = true;
                }
            });
        }

        /**
         * 点击确定工艺按钮
         */

        $scope.confirmCraft = function($index) {
            if ($scope.itemCraftsDTOList[$index].craftsName.length === 0 || $scope.itemCraftsDTOList[$index].price.length === 0) {
                toaster.pop({
                    type: 'error',
                    title: '工艺名称或者价钱不能为空',
                    body: '',
                    showCloseButton: true,
                    timeout: 5000
                });
                return;
            }
            $scope.itemCraftsDTOList.map(function(item,index) {
                if (index === $index) {
                    item.editable = false;
                }
            });
        }


        /**
         *  是否取消本次修改
         */
        $scope.cancel = function() {
            window.close();
        }

        /**
         * 点击添加杂色回调函数
         */
        $scope.addVariegate = function() {
            $scope.variegateColorList.push({});
        }

        /**
         * 删除当前杂色
         */

        $scope.deleteVariegate = function($index) {
            $scope.variegateColorList = $scope.variegateColorList.filter(function(item,index) {
                if ($index !== index) {
                    return true;
                }
            });
        }

        /**
         * 点击添加规格
         */

        $scope.addSpecification = function() {
            $scope.specificationList.push({});
        }

        /**
         * 删除规格
         */

        $scope.deleteSpecification = function($index){
            $scope.specificationList = $scope.specificationList.filter(function(item,index) {
                if ($index !== index) {
                    return true;
                }
            });
        }

        /**
         *  在改变白色色号的回调函数
         */

        $scope.changeWhiteColor = function() {
            var colorNo = $scope.whiteColorList.colorNo;
            if (colorNo) {
                $scope.whiteColorList.inventory = '';
                $scope.whiteColorList.inventoryStatus = '';
                $scope.whiteInquiryList = [JSON.parse(JSON.stringify($scope.whiteColorList))];
            } else {
                $scope.whiteInquiryList = [];
            }
        }

        /**
         *  改变黑色色号的回调函数
         */

        $scope.changeBlackColor = function() {
            var colorNo = $scope.blackColorList.colorNo;
            if (colorNo) {
                $scope.blackColorList.inventory = '';
                $scope.blackColorList.inventoryStatus = '';
                $scope.blackInquiryList = [JSON.parse(JSON.stringify($scope.blackColorList))];
            } else {
                $scope.blackInquiryList = [];
            }
        }

        /**
         * 改变杂色色号的回调函数
         */

        $scope.changeVariegateColor = function() {
            var inquiryMap = JSON.parse(JSON.stringify($scope.variegateInquiryList));
            $scope.variegateInquiryList = [];
            var colorNoList = [];
            //收集所有杂色色号
            for (var i = 0,j = $scope.variegateColorList.length; i < j; i++) {
                colorNoList = parseColorNo($scope.variegateColorList[i].colorNo);
                colorNoList.forEach(function(item,index) {
                    if (item) {
                        var thisVariegateColor = JSON.parse(JSON.stringify($scope.variegateColorList[i]));
                        thisVariegateColor.colorNo = item;
                        for (var m = 0,n = inquiryMap.length; m < n;m++) {
                            if (inquiryMap[m].colorNo === item) {
                                thisVariegateColor.inventoryStatus = inquiryMap[m].inventoryStatus;
                                thisVariegateColor.inventory = inquiryMap[m].inventory;
                            }
                        }
                        $scope.variegateInquiryList = $scope.variegateInquiryList.concat([JSON.parse(JSON.stringify(thisVariegateColor))]);
                    }
                });
            }
        }

        /**
         * 改变规格的回调函数,此函数中的colorNoList为规格的列表
         */

        $scope.changeSpecification = function() {
            var inquiryMap = JSON.parse(JSON.stringify($scope.specificationInquiryList));
            $scope.specificationInquiryList = [];
            var colorNoList = [];
            //收集规格列表
            for (var i = 0,j = $scope.specificationList.length; i < j; i++) {
                colorNoList = parseColorNo($scope.specificationList[i].specification);
                colorNoList.forEach(function(item,index) {
                    if (item) {
                        var thisSpecification = JSON.parse(JSON.stringify($scope.specificationList[i]));
                        thisSpecification.specification = item;
                        for (var m = 0,n = inquiryMap.length; m < n;m++) {
                            if (inquiryMap[m].colorNo === item) {
                                thisSpecification.inventoryStatus = inquiryMap[m].inventoryStatus;
                                thisSpecification.inventory = inquiryMap[m].inventory;
                            }
                        }
                        $scope.specificationInquiryList = $scope.specificationInquiryList.concat([JSON.parse(JSON.stringify(thisSpecification))]);
                    }
                });
            }
        };

        /**
         * 改变库存
         */

        $scope.setInventory = function() {
            if ($scope.isSetInventory) { //判断是否设置了库存
                if($scope.whiteInquiryList.length > 0) {
                    $scope.whiteInquiryList.forEach(function(item,index) {
                        item.inventoryStatus = 2;
                    });
                }

                if($scope.blackInquiryList.length > 0) {
                    $scope.blackInquiryList.forEach(function(item,index) {
                        item.inventoryStatus = 2;
                    });
                }

                if($scope.variegateInquiryList.length > 0) {
                    $scope.variegateInquiryList.forEach(function(item,index) {
                        item.inventoryStatus = 2;
                    });
                }

                if($scope.specificationInquiryList.length > 0) {
                    $scope.specificationInquiryList.forEach(function(item,index) {
                        item.inventoryStatus = 2;
                    });
                }

            }
        }


        /**
         * 初始化相关操作
         */
        function init() {
            initData();
        }

        /**
         * 初始化页面数据
         */

        function initData() {
            requestInquiryMgmtService.initEditInquiry(itemId).then(function(resp) {
                if (resp.data.code == 200) {
                    $scope.okBtnDisabled = false;
                    $scope.itemCraftsDTOList = wrapCraftData(resp.data.data.inquiryDetail.itemCraftsDTOList) || [];
                    $scope.colorList = resp.data.data.inquiryDetail.itemColorDTOList;
                    $scope.itemSpecificationDTOList = resp.data.data.inquiryDetail.itemSpecificationDTOList;
                    $scope.whiteColorList = filterColorArr($scope.colorList,'白色')[0] || {};
                    $scope.whiteInquiryList = [];
                    if (Object.keys($scope.whiteColorList).length > 0) {
                        $scope.whiteInquiryList = [JSON.parse(JSON.stringify($scope.whiteColorList))];
                    }
                    $scope.blackColorList = filterColorArr($scope.colorList,'黑色')[0] || {};
                    $scope.blackInquiryList = [];
                    if (Object.keys($scope.blackColorList).length > 0) {
                        $scope.blackInquiryList = [JSON.parse(JSON.stringify($scope.blackColorList))];
                    }
                    $scope.variegateColorList = groupAccoundingByPrice(filterVariegateColor($scope.colorList) || [{}],'colorNo');
                    $scope.variegateInquiryList = filterVariegateColor($scope.colorList) || [];
                    $scope.specificationList = groupAccoundingByPrice($scope.itemSpecificationDTOList || [{}] ,'specification');
                    $scope.specificationInquiryList = JSON.parse(JSON.stringify($scope.itemSpecificationDTOList)) || [{}];
                    $scope.inquiryDetail = resp.data.data.inquiryDetail;
                    $scope.rootCategoryId = resp.data.data.inquiryDetail.rootCategoryId;
                    // sellType 初始化空差米差数据
                    $scope.sellType = {
                        paperTube: Number($scope.inquiryDetail.paperTube),
                        meterShort: Number($scope.inquiryDetail.meterShort),
                        blankShort: Number($scope.inquiryDetail.blankShort)
                    }
                    // 默认选中的只管空差米差
                    if ($scope.sellType.paperTube && $scope.sellType.blankShort) {
                        $scope.sellType.type = "1";
                    } else if ($scope.sellType.meterShort) {
                        $scope.sellType.type = "2";
                    }

                    // 初始化单位列表,适配面料和辅料
                    if ($scope.rootCategoryId === 1) {
                        $scope.unitList = [{name:'元/米',value:'米'},{name:'元/码',value:'码'},{name:'元/公斤',value:'公斤'}];
                    } else {
                        $scope.unitList = [{name:'元/个',value:'个'},{name: '元/卷',value: '卷'},{name:'元/张',value:'张'},{name:'元/箱',value:'箱'}
                            ,{name:'元/条',value:'条'},{name:'元/磅',value:'磅'},{name:'元/根',value:'根'},{name:'元/米',value:'米'},
                            {name:'元/码',value:'码'},{name:'元/公斤',value:'公斤'}
                        ]
                    }

                    initDatePicker(resp.data.data.inquiryDetail.inventoryTime);
                }
            })
        }


        function initDatePicker(inventoryTime) {

            // 如果有过期时间,默认库存已经设置了
            if (inventoryTime) {
                $scope.isSetInventory = true;
            }

            vm.opts = {
                singleDatePicker: true,
                showDropdowns: true,
            };
            if (inventoryTime) {
                vm.endDate = $filter('date')(inventoryTime, 'yyyy-MM-dd HH:mm:ss');
            } else {
                vm.endDate = null;
            }

            vm.inventoryTime = {
                endDate: vm.endDate
            };
            $scope.$watch('vm.inventoryTime', function (newVal, oldVal) {
                if (newVal) {
                    vm.endDate = moment(newVal.endDate).format(
                        "YYYY-MM-DD HH:mm:ss");
                }
            });
        }

        /**
         * 获取到库存的信息
         */
        function getInventoryData() {

        }


        /**
         * 初始化工艺的一些状态数据,是否可编辑
         */

        function wrapCraftData(data) {
            if (data && data instanceof Array) {
                data.forEach(function(item,index) {
                    item.editable = false;
                });
            }
            return data;
        }

        /**
         * 筛选出黑色,白色
         */

        function filterColorArr(colorArray,colorName) {
            var newColorArray = [];
            if (colorArray && colorArray instanceof Array) {
                newColorArray = colorArray.filter(function(item,index){
                    if (item.colorName === colorName) {
                        return true;
                    }
                });
            }
            return newColorArray;
        }

        /**
         *  筛选出非杂色信息,(新版sku出来后,杂色不仅仅是杂色了,也有各种颜色组成的,将各种颜色统一合成一个新的数组)
         */

        function filterVariegateColor(colorArray) {
            var newColorArray = [];
            if (colorArray && colorArray instanceof Array) {
                newColorArray = colorArray.filter(function(item,index){
                    if (item.colorName !== '白色' && item.colorName !== '黑色') {
                        return true;
                    }
                });
            }
            return newColorArray;
        }

        /**
         *  根据大货和样布价相同的进行分组,并且将每一组解析为一个对象
         */

        function groupAccoundingByPrice(list,whichType) {
            var groupObj = {}
            var prefixItem = "";
            var colorNo = "";
            var swatchPrice = 0;
            var largeCargoPrice = 0;
            var updateTime = 0;
            var operatorName = "";
            var swatchMeasurementUnit = "";
            var largeCargoMeasurementUnit = "";
            var newValidateColorObj = null;
            var newValidateColorArr = [];
            var colorNoNameArr = null; // 存储杂色中不同色号对应的不同colorName和colorId方便后面进行拼接
            if (list && list instanceof Array) {
                list.forEach(function(item,index) {
                    prefixItem = item.largeCargoPrice + item.swatchPrice;
                    if (groupObj[prefixItem]) {
                        groupObj[prefixItem].push(item);
                    } else {
                        groupObj[prefixItem] = [];
                        groupObj[prefixItem].push(item);
                    }
                });
            }

            for (var key in groupObj) {
                newValidateColorObj = {};
                colorNoNameArr = [];
                colorNo = "";
                for (var i = 0,j = groupObj[key].length; i < j; i++) {
                    colorNo += groupObj[key][i][whichType] + ';';
                    swatchPrice = groupObj[key][i].swatchPrice;
                    largeCargoPrice = groupObj[key][i].largeCargoPrice;
                    updateTime = groupObj[key][i].updateTime;
                    operatorName = groupObj[key][i].operatorName;
                    swatchMeasurementUnit = groupObj[key][i].swatchMeasurementUnit;
                    largeCargoMeasurementUnit = groupObj[key][i].largeCargoMeasurementUnit;
                    largeCargoMeasurementUnit = groupObj[key][i].largeCargoMeasurementUnit;
                    colorNoNameArr.push({colorNo: groupObj[key][i].colorNo,colorName: groupObj[key][i].colorName,colorId: groupObj[key][i].colorId})
                }
                newValidateColorObj[whichType] = colorNo;
                newValidateColorObj.swatchPrice = swatchPrice;
                newValidateColorObj.largeCargoPrice = largeCargoPrice;
                newValidateColorObj.updateTime = updateTime;
                newValidateColorObj.operatorName = operatorName;
                newValidateColorObj.swatchMeasurementUnit = swatchMeasurementUnit;
                newValidateColorObj.largeCargoMeasurementUnit = largeCargoMeasurementUnit;
                newValidateColorObj.colorNoNameArr = colorNoNameArr;
                newValidateColorArr.push(newValidateColorObj);
            }
            return newValidateColorArr;
        }

        /**
         * 取出后端返回的色号list
         */

        function getItemColorList(colorList) {
            var newColorList = [];
            if (colorList && colorList instanceof Array) {
                colorList.forEach(function(item,index) {
                    newColorList.push(item.itemColorDTO);
                });
            }
            return newColorList;
        }

        /**
         * 根据规格号到询价信息中找到对应的询价列表
         */

        /**
         * 筛选出已被接单的询价列表
         * @param arr
         */
        function filterNoAcceptInquiry(inquiryListArr) {
            var newArr = [];
            newArr = inquiryListArr.filter(function(item,index) {
                if (Number(item.crmSellerId) === 0) {
                    return false;
                } else {
                    return true;
                }
            });
            return newArr;
        }

        /**
         * 解析输入的色号字符串，转为相应的数组色号
         * @param colorNoStr
         */
        function parseColorNo(colorNoStr) {
            if ($.trim(colorNoStr).length === 0) {
                return [];
            }
            var colorNoArr =[];
            var min = '';
            var max = '';
            var prefix = '';
            var unParsedcolorNoArr = colorNoStr.split(';');
            for (var i = 0, j = unParsedcolorNoArr.length; i < j; i++) {
                if  (unParsedcolorNoArr[i].indexOf('#') > -1 &&  unParsedcolorNoArr[i].indexOf('~') > -1) {
                    prefix = unParsedcolorNoArr[i].split('#')[0];
                    min = Number(unParsedcolorNoArr[i].split('#')[1].split('~')[0]);
                    max = Number(unParsedcolorNoArr[i].split('#')[1].split('~')[1]);
                    for (var k = min,l = max + 1; k < l; k++) {
                        colorNoArr.push(prefix + k);
                    }
                } else if (unParsedcolorNoArr[i].indexOf('#') === -1 &&  unParsedcolorNoArr[i].indexOf('~') > -1) {
                    min = Number(unParsedcolorNoArr[i].split('~')[0]);
                    max = Number(unParsedcolorNoArr[i].split('~')[1]);
                    for (var m = min, n = max + 1; m < n; m++) {
                        colorNoArr.push(m);
                    }
                } else {
                    colorNoArr.push(unParsedcolorNoArr[i]);
                }
            }
            return colorNoArr;
        }

        /**
         * 计算出
         * @param list
         */
        function sumDemand(list) {
            var sumCount = 0;
            if (list && list instanceof Array ) {
                list.forEach(function(item,index) {
                    sumCount += item.amount;
                });
            }
            return sumCount;
        }

        /**
         * 将弹出框简写
         */
        function popup(type,message) {
            toaster.pop({
                type: type,
                title: message,
                body: '',
                showCloseButton: true,
                timeout: 5000
            });
        }

        /**
         * 将杂色列表按照价格分类,如果样布和大货价格相同,则放在一个数组中
         */

        init();


    }

    angular
        .module('app.request-inquiry-management')
        .controller('editInquiryCtrlForRouteSupplier', editInquiryCtrlForRouteSupplier)
})();