/**
 * Created by joey on 2017/8/15.
 *
 * 查看询价单
 */

(function () {

    'use strict';

    watchInquiryCtrl.$inject = ['$scope', '$http', '$uibModal', '$uibModalInstance', '$filter', '$compile', 'toaster', 'requestInquiryMgmtService', 'itemId', 'opener'];

    watchInquiryCtrlForRoute.$inject = ['$scope', '$http', '$uibModal', '$filter', '$compile', 'toaster', 'requestInquiryMgmtService', '$stateParams'];

    function watchInquiryCtrl($scope, $http, $uibModal, $uibModalInstance, $filter, $compile, toaster, requestInquiryMgmtService, itemId, opener) {
        watchInquiryCtrlInner($scope, $http, $uibModal, $uibModalInstance, $filter, $compile, toaster, requestInquiryMgmtService, itemId, opener);
    }

    function watchInquiryCtrlForRoute($scope, $http, $uibModal, $filter, $compile, toaster, requestInquiryMgmtService, $stateParams) {
        var itemId = null;
        if ($stateParams) {
            itemId = $stateParams.itemId;
        }
        watchInquiryCtrlInner($scope, $http, $uibModal, null, $filter, $compile, toaster, requestInquiryMgmtService, itemId, null)
    }

    function watchInquiryCtrlInner($scope, $http, $uibModal, $uibModalInstance, $filter, $compile, toaster, requestInquiryMgmtService, itemId, opener) {
        var vm = this;
        $scope.ok = function () {
        }

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        }

        function initData() {

            requestInquiryMgmtService.initEditInquiry(itemId).then(function (resp) {
                if (resp.data.code == 200) {
                    $scope.inquiryDetail = resp.data.data.inquiryDetail;
                }
            })

            requestInquiryMgmtService.initColorDetailList(itemId, 971, 1, 10).then(function (resp) {
                if (resp.data.code == 200) {
                    $scope.whiteInquiryDetail = resp.data.data.list.list;
                    console.log(JSON.stringify($scope.whiteInquiryDetail));
                } else {
                    toaster.error('请求失败');
                }
            })

            requestInquiryMgmtService.initColorDetailList(itemId, 975, 1, 10).then(function (resp) {
                if (resp.data.code == 200) {
                    $scope.blackInquiryDetail = resp.data.data.list.list;
                } else {
                    toaster.error('请求失败');
                }
            })

            requestInquiryMgmtService.initColorDetailList(itemId, 976, 1, 10).then(function (resp) {
                if (resp.data.code == 200) {

                    var diffInquiryList = resp.data.data.list.list;
                    for (var index in diffInquiryList) {
                        $scope.diffInquiryDetailList.push(diffInquiryList[index]);
                    }

                    var listLength = diffInquiryList.length;
                    if (listLength == 10) {
                        $scope.diffNumber += 1;
                        $scope.diffNumberHide = true;
                    } else {
                        $scope.diffNumberHide = false;
                    }

                } else {
                    toaster.error('请求失败');
                }
            })
        }

        $scope.getMoreColorList = function () {
            var pageNumber = $scope.diffNumber;
            console.log(pageNumber);
            requestInquiryMgmtService.initColorDetailList(itemId, 976, pageNumber, 10).then(function (resp) {
                console.log(config.url)
                if (resp.data.code == 200) {

                    var diffInquiryList = resp.data.data.list.list;
                    for (var index in diffInquiryList) {
                        $scope.diffInquiryDetailList.push(diffInquiryList[index]);
                    }
                    var listLength = diffInquiryList.length;
                    if (listLength == 10) {
                        $scope.diffNumber += 1;
                        $scope.diffNumberHide = true;
                    } else {
                        $scope.diffNumberHide = false;
                    }

                } else {
                    toaster.error('请求失败');
                }
            })
        }


        $scope.getColorHistory = function (event) {
            var positionTool = $(event.currentTarget);
            $scope.loadColorHistory(positionTool);
        }

        $scope.loadMoreHistory = function(event){
            var positionTool = $(event.currentTarget);
            var LoadMore = positionTool.parent('.load_more');
            var iboxContent = LoadMore.parent('.ibox-content');
            var ibox = iboxContent.parent('.ibox');
            $scope.loadColorHistory(ibox.find('a'));
        }

        $scope.loadColorHistory = function (positionTool){

            var itemId = positionTool.attr('data-id');
            var colorNo = positionTool.attr('data-color');
            var colorPageNum = Number(positionTool.attr('data-pageNum'));
            var boxContent = positionTool.parent().next('.ibox-content');
            var boxHistory = boxContent.find('.history_list');
            boxHistory.html("");

            console.log(colorPageNum);
            requestInquiryMgmtService.initColorHistoryList(itemId, colorNo, 1, colorPageNum).then(function (resp) {
                if (resp.data.code == 200) {
                    var historyList = resp.data.data.list.list;
                    console.log(JSON.stringify(historyList))
                    for (var index  in  historyList) {
                        var updateTime = $filter('date')(historyList[index].updateTime, 'yyyy-MM-dd HH:mm:ss')
                        boxHistory.append('<div class="row">' +
                            '<div class="col-sm-12" style="border-bottom: 1px solid #e0dbdb;padding: 2px 2px;">' +
                            '<span>' + (Number(index) + 1) + ':' + '</span>' +
                            '<span>价格&nbsp</span>' +
                            '<span>大货:</span>' +
                            '<span>' + historyList[index].swatchPrice + '元/' + historyList[index].swatchMeasurementUnit + '</span>' +
                            '<span>&nbsp&nbsp样布:</span>' +
                            '<span>' + historyList[index].largeCargoPrice + '元/' + historyList[index].largeCargoMeasurementUnit + '</span>'+
                            '<br>'+
                            '&nbsp&nbsp<span>操作人:</span>' +
                            '<span>' + historyList[index].operatorName +'</span>'+
                            '<span>&nbsp&nbsp操作时间:</span>' +
                            '<span>' + updateTime +'</span>'+
                            '</div> </div>');
                    }

                    var historyNumber = resp.data.data.list.list.length;
                    if (historyNumber == colorPageNum) {
                        positionTool.attr('data-pageNum', (colorPageNum + 10));
                        boxContent.find('.load_more').show();
                    }else{
                        boxContent.find('.load_more').hide();
                    }
                }
            })
        }

        //初始化标准
        function init() {
            initData();
            $scope.diffNumber = 1;
            $scope.diffInquiryDetailList = [];
        }

        init();
    }


    angular
        .module('app.request-inquiry-management')
        .controller('watchInquiryCtrl', watchInquiryCtrl)
    angular
        .module('app.request-inquiry-management')
        .controller('watchInquiryCtrlForRoute', watchInquiryCtrlForRoute)
})();
