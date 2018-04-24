/**
 *
 *buyer-dispatch-modal.controller.js
 */

(function () {

    'use strict';

    recordListCtrl.$inject = ['$scope', '$uibModal', '$uibModalInstance', 'requestInquiryMgmtService','pageModel','demandId','toaster','itemInfo'];

    function recordListCtrl($scope, $uibModal, $uibModalInstance, requestInquiryMgmtService,pageModel,demandId,toaster,itemInfo) {
        var vm = this;
        // $scope.dynamicList = [];
        // $scope.dynamicList = pageModel.list;
        // $scope.hasMore = pageModel.hasMore;
        // vm.pageNo = 2;
        $scope.demandId = demandId;

        $scope.status = itemInfo;


        //
        // $scope.loadNextPage = function () {
        //     requestInquiryMgmtService.getRecordList(demandId,vm.pageNo).then(function successCallback(response) {
        //         $scope.dynamicList= $scope.dynamicList.concat(response.data.data.list);
        //         $scope.hasMore = response.data.data.hasMore;
        //         vm.pageNo++;
        //     })
        // }

        console.log($scope);

        function initData() {
            requestInquiryMgmtService.getInquiryMemoList(demandId).then(function (resp) {
                if (resp.data.code === 200) {
                    $scope.dynamicList = resp.data.data.list;
                }
            }, function () {

            })
        }


        $scope.submitFeedback = function (event) {

            var positionInfo = $(event.currentTarget);
            var requestInquiryText = positionInfo.parent().find('input').val();

            var requestInquiryDto = {
                "data": {
                    "requestInquiryId":  $scope.demandId,
                    "operatorType":12,
                    "memo": requestInquiryText,
                }
            }

            requestInquiryMgmtService.saveFeedbackCommon(requestInquiryDto).then(function (resp) {
                if (resp.data.code == 200) {
                    toaster.success("提交成功");
                    positionInfo.parent().find('input').val("");
                    initData();

                } else {
                    toaster.error("提交失败");
                }
            })
        }

        function init() {
            initData();
            $scope.isHide =true;

            console.log($scope.status);
            if($scope.status == 50||$scope.status == 60 ||$scope.status == 10){
                $scope.isHide= false;
            }
        }

        init();
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        }
    }

    angular
        .module('app.request-inquiry-management')
        .controller('recordListCtrl', recordListCtrl);

})();