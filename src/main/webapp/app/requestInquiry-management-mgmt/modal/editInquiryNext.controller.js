(function () {

    'use strict';

    editInquiryNextCtrl.$inject = ['$scope', '$http', '$uibModal', '$uibModalInstance', '$filter', '$compile', 'toaster', 'requestInquiryMgmtService', 'opener', 'inquiryListData', 'itemId', 'craftsData'];

    function editInquiryNextCtrl($scope, $http, $uibModal, $uibModalInstance, $filter, $compile, toaster, requestInquiryMgmtService, opener, inquiryListData, itemId, craftsData) {
        var vm = this;


        $scope.ok = function () {
            opener.cancel1();
            $uibModalInstance.dismiss('cancel');
        }

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        }

        $scope.submitFeedback = function (event) {

            var positionInfo = $(event.currentTarget);
            var requestInquiryId = positionInfo.attr('data-id');
            var feedbackDtoList = [];
            var requestInquiryText = "";
            positionInfo.parents('.inquiryModel').find('.all_common').each(function () {
                var inquiryModel = $(this);
                requestInquiryText += iGetInnerText(inquiryModel.find('span').text());
                requestInquiryText = requestInquiryText + '备注:' + positionInfo.parent().find('.common').val();
                var inquiryDto = inquiryModel.attr('data-dto');
                if (inquiryDto != undefined) {
                    inquiryDto = JSON.parse(inquiryDto);
                }
                var inquiryDto = {
                    "itemId": $scope.inquiryDetail.itemId,
                    "requestInquiryId": requestInquiryId,
                    "colorNo": inquiryDto.colorNo || "",
                    "colorId": inquiryDto.newColorId || 0,
                    "colorName": inquiryDto.newColorName || "",
                    "specification": inquiryDto.newSpecification || "",
                    "swatchPrice": inquiryDto.swatchPrice || 0,
                    "swatchMeasurementUnit": inquiryDto.swatchMeasurementUnit || "",
                    "largeCargoPrice": inquiryDto.largeCargoPrice || 0,
                    "largeCargoMeasurementUnit": inquiryDto.largeCargoMeasurementUnit || "",
                    "inventoryStatus": inquiryDto.inventoryStatus || 0,
                    "inventory": inquiryDto.inventory || 0
                }
                feedbackDtoList.push(inquiryDto);
            });

            var requestInquiryDto = {
                "data": {
                    "requestInquiryId": requestInquiryId,
                    "memo": requestInquiryText,
                    "feedbackDtoList": feedbackDtoList
                }
            }

            //console.log(JSON.stringify(requestInquiryDto))
            requestInquiryMgmtService.saveFeedbackCommon(requestInquiryDto).then(function (resp) {
                if (resp.data.code == 200) {
                    toaster.success("提交成功");
                    positionInfo.text("已反馈");
                    positionInfo.attr('disabled', true);
                    initData();

                } else {
                    toaster.error("提交失败");
                }
            })
        }

        $scope.getHistoryFeedback = function (event) {
            var positionTool = $(event.currentTarget);
            var boxContent = positionTool.parent().next('.ibox-content');
            var requestInquiryId = positionTool.attr('data-id');
            boxContent.html("");
            requestInquiryMgmtService.getHistoryFeedback(requestInquiryId).then(function (resp) {
                if (resp.data.code == 200) {
                    var historyList = resp.data.data.list;
                    for (var index  in  historyList) {
                        var styleColor = "background-color:#c8ebfb";
                        if (index % 2 == 1) {
                            styleColor = "float:right;background-color:#e4e4e4";
                        }
                        boxContent.append('<div class="row" style="margin-top:5px;padding:0px 10px">' +
                            '<div class="col-sm-10" style="border: 1px solid #c7c7c7;border-radius: 5px;padding: 5px;' + styleColor + '">' +
                            '<span style="color:#4CAF50">操作人:</span>' +
                            '<span>' + historyList[index].operatorName + '</span>' +
                            '</br>' +
                            '<span style="color:#03A9F4">评论:</span>' +
                            '<span>' + historyList[index].comment + '</span>' +
                            '<span style="float:right;color:#FF9800">' + historyList[index].formattedTimeStr + '</span>' +
                            '</div></div>');
                    }
                }
            })
        }

        function initData() {
            requestInquiryMgmtService.initEditInquiry(itemId).then(function (resp) {
                if (resp.data.code == 200) {

                    $scope.inquiryDetail = resp.data.data.inquiryDetail;

                    var detailDtoList = filterNoAcceptInquiry($scope.inquiryDetail.detailDtoList);
                    $scope.inquiryDetail.detailDtoList = detailDtoList;

                    if (detailDtoList.length == 0) {
                        $('#closeButton').attr('disabled', false);
                    }

                    for (var index in detailDtoList) {
                        var requestInquiryDetailDtoList = detailDtoList[index].requestInquiryDetailDtoList;
                        detailDtoList[index].isFalse = true;//判断是否有问题
                        for (var index1 in requestInquiryDetailDtoList) {
                            for (var req in inquiryListData) {
                                if (requestInquiryDetailDtoList[index1].id == inquiryListData[req].id) {
                                    requestInquiryDetailDtoList[index1].inventoryStatus = inquiryListData[req].inventoryStatus;
                                    requestInquiryDetailDtoList[index1].inventory = inquiryListData[req].inventory;
                                    var craftsList = requestInquiryDetailDtoList[index1].crafts;
                                    var craftsNamePrice = 0;
                                    var flagVersion = false;
                                    if (craftsList.length == 0) {
                                        flagVersion = true;
                                    }

                                    if(craftsList.length==1&&craftsList[0].trim()===""){
                                        flagVersion = true;
                                    }

                                    for (var x in craftsData) {
                                        for (var y in craftsList) {
                                            if (craftsList[y].trim() == craftsData[x].craftsName.trim()) {
                                                craftsNamePrice += Number(craftsData[x].price);//工艺的加价
                                                flagVersion = true;//已经有工艺的加价
                                            }
                                        }
                                    }

                                    requestInquiryDetailDtoList[index1].lianShangPrice = null;
                                    requestInquiryDetailDtoList[index1].flagVersion = flagVersion;

                                    if (!flagVersion) {
                                        detailDtoList[index].isFalse = flagVersion;
                                    }

                                    if (inquiryListData[req].type == 3) {

                                        requestInquiryDetailDtoList[index1].lianShangPrice = Number(inquiryListData[req].largeCargoPrice || 0) + craftsNamePrice;
                                        requestInquiryDetailDtoList[index1].largeCargoPrice = Number(inquiryListData[req].largeCargoPrice || 0);
                                        if (requestInquiryDetailDtoList[index1].largeCargoPrice == 0) {
                                            requestInquiryDetailDtoList[index1].flagPrice = false;
                                            detailDtoList[index].isFalse = false;
                                        }else{
                                            requestInquiryDetailDtoList[index1].flagPrice = true;
                                        }

                                        if ($scope.inquiryDetail.rootCategoryId == 1) {
                                            for (var xx in  $scope.inquiryDetail.itemColorDTOList) {
                                                if ($scope.inquiryDetail.itemColorDTOList[xx].colorNo == requestInquiryDetailDtoList[index1].colorNo) {
                                                    requestInquiryDetailDtoList[index1].newMeasurementUnit = $scope.inquiryDetail.itemColorDTOList[xx].largeCargoMeasurementUnit;
                                                    requestInquiryDetailDtoList[index1].newColorName = $scope.inquiryDetail.itemColorDTOList[xx].colorName;
                                                    requestInquiryDetailDtoList[index1].newColorId = $scope.inquiryDetail.itemColorDTOList[xx].colorId;
                                                }
                                            }
                                        }

                                        if ($scope.inquiryDetail.rootCategoryId == 2) {
                                            for (var xx in  $scope.inquiryDetail.itemSpecificationDTOList) {
                                                if ($scope.inquiryDetail.itemSpecificationDTOList[xx].specification == requestInquiryDetailDtoList[index1].specification) {
                                                    requestInquiryDetailDtoList[index1].newMeasurementUnit = $scope.inquiryDetail.itemSpecificationDTOList[xx].largeCargoMeasurementUnit;
                                                    requestInquiryDetailDtoList[index1].newSpecification = $scope.inquiryDetail.itemSpecificationDTOList[xx].specification;
                                                }
                                            }
                                        }

                                        requestInquiryDetailDtoList[index1].largeCargoMeasurementUnit = requestInquiryDetailDtoList[index1].newMeasurementUnit;
                                    }
                                    if (inquiryListData[req].type == 2) {

                                        requestInquiryDetailDtoList[index1].lianShangPrice = Number(inquiryListData[req].swatchPrice || 0) + craftsNamePrice;
                                        requestInquiryDetailDtoList[index1].swatchPrice = Number(inquiryListData[req].swatchPrice || 0);

                                        if (requestInquiryDetailDtoList[index1].swatchPrice == 0) {
                                            requestInquiryDetailDtoList[index1].flagPrice = false;
                                            detailDtoList[index].isFalse = false;
                                        }else{
                                            requestInquiryDetailDtoList[index1].flagPrice = true;
                                        }

                                        if ($scope.inquiryDetail.rootCategoryId == 1) {
                                            for (var xx in  $scope.inquiryDetail.itemColorDTOList) {

                                                if ($scope.inquiryDetail.itemColorDTOList[xx].colorNo == requestInquiryDetailDtoList[index1].colorNo) {
                                                    requestInquiryDetailDtoList[index1].newMeasurementUnit = $scope.inquiryDetail.itemColorDTOList[xx].swatchMeasurementUnit;
                                                    requestInquiryDetailDtoList[index1].newColorName = $scope.inquiryDetail.itemColorDTOList[xx].colorName;
                                                    requestInquiryDetailDtoList[index1].newColorId = $scope.inquiryDetail.itemColorDTOList[xx].colorId;
                                                }
                                            }
                                        }

                                        if ($scope.inquiryDetail.rootCategoryId == 2) {
                                            for (var xx in  $scope.inquiryDetail.itemSpecificationDTOList) {
                                                if ($scope.inquiryDetail.itemSpecificationDTOList[xx].specification == requestInquiryDetailDtoList[index1].specification) {
                                                    requestInquiryDetailDtoList[index1].newMeasurementUnit = $scope.inquiryDetail.itemSpecificationDTOList[xx].largeCargoMeasurementUnit;
                                                    requestInquiryDetailDtoList[index1].newSpecification = $scope.inquiryDetail.itemSpecificationDTOList[xx].specification;
                                                }
                                            }
                                        }
                                        requestInquiryDetailDtoList[index1].swatchMeasurementUnit = requestInquiryDetailDtoList[index1].newMeasurementUnit;
                                    }

                                }
                            }
                        }
                    }

                } else {
                    toaster.error('请求失败');
                }
            })
        }

        function filterNoAcceptInquiry(inquiryListArr) {
            var newArr = [];
            newArr = inquiryListArr.filter(function (item, index) {
                if (Number(item.crmSellerId) === 0) {
                    return false;
                } else {
                    return true;
                }
            });
            return newArr;
        }

        //初始化标准
        function init() {
            initData();
            //console.log(JSON.stringify(inquiryListData));
            //console.log(JSON.stringify(craftsData))
        }

        function iGetInnerText(testStr) {
            var resultStr = testStr.replace(/\ +/g, ""); //去掉空格
            resultStr = testStr.replace(/[ ]/g, "");    //去掉空格
            resultStr = testStr.replace(/[\r\n]/g, ""); //去掉回车换行
            return resultStr;
        }

        init();
    }

    angular
        .module('app.request-inquiry-management')
        .controller('editInquiryNextCtrl', editInquiryNextCtrl)
})();