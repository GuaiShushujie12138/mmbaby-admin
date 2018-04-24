/**
 *
 *buyer-dispatch-modal.controller.js
 */

(function () {

    'use strict';

    DemandResultCtrl.$inject =
        ['$scope', '$uibModal', '$uibModalInstance', '$compile', 'toaster', 'demandMgmtService',
         'demandId', 'feedbackList', 'replyList','itemDomain'];

    DemandResultCtrlForRoute.$inject =
        ['$scope', '$uibModal', '$compile', 'toaster', 'demandMgmtService', '$stateParams'];

    function DemandResultCtrl($scope, $uibModal, $uibModalInstance, $compile, toaster,
                              demandMgmtService,demandId, feedbackList, replyList,itemDomain) {
        DemandResultCtrlInner($scope, $uibModal, $uibModalInstance, $compile, toaster,
            demandMgmtService,demandId, feedbackList, replyList,itemDomain);
    }

    function DemandResultCtrlForRoute($scope, $uibModal, $compile, toaster, demandMgmtService, $stateParams) {

        var demandId = null;
        if($stateParams){
            demandId = $stateParams.demandId;
        }else{
            return;
        }

        var replyList = [];
        var feedbackList = [];
        var itemDomain = null;

        demandMgmtService.getReplyList(demandId).then(function (resp) {
            if (resp.data.code == 200) {
                replyList = resp.data.data;
                console.log(replyList);

                demandMgmtService.getDemandFeedbackList(demandId).then(function (response) {
                        if (response.data.code == 200) {
                            feedbackList = response.data.data.list;
                            console.log(JSON.stringify(feedbackList));

                            demandMgmtService.getItemUrl().then(function (res) {
                                    itemDomain = res.data.data.domain;
                                    console.log(itemDomain);

                                DemandResultCtrlInner($scope, $uibModal, null, $compile, toaster,
                                    demandMgmtService,demandId, feedbackList, replyList, itemDomain);
                                });
                        }
                    });
            }
        });

    }

    function DemandResultCtrlInner($scope, $uibModal, $uibModalInstance, $compile, toaster,
                              demandMgmtService,demandId, feedbackList, replyList,itemDomain) {
        //alert("DemandResultCtrl");
        var vm = $scope;
        //alert($scope.demandId);
        vm.demandId = demandId;
        $scope.feedbackList = feedbackList;
        $scope.showMoreCol = true;
        initColorName();

        function initColorName(){
            var colorNameList= [];
            var colorCodeList= [];
            for(var x in $scope.feedbackList) {

                if(!$scope.feedbackList[x].item){
                    $scope.feedbackList[x].item= {};
                    $scope.feedbackList[x].item.propertyList=[];
                    $scope.feedbackList[x].item.skuList=[];
                }

                for (var order in $scope.feedbackList[x].item.propertyList) {
                    var property = $scope.feedbackList[x].item.propertyList[order];
                    if (property.propertyName === "颜色") {
                        colorNameList = property.values;
                    }
                }

                for (var order in $scope.feedbackList[x].item.propertyList) {
                    var property = $scope.feedbackList[x].item.propertyList[order];
                    if (property.propertyName === "色号") {
                        colorCodeList = property.values;
                    }
                }

                for (var index in $scope.feedbackList[x].item.skuList) {
                    var sku = $scope.feedbackList[x].item.skuList[index];
                    for (var order in colorNameList) {
                        if (sku.properties['1'] === colorNameList[order].valueId) {
                            sku.colorName = colorNameList[order].valueName;
                            break;
                        }
                    }
                }

                for (var index in $scope.feedbackList[x].item.skuList) {
                    var sku = $scope.feedbackList[x].item.skuList[index];
                    for (var order in colorCodeList) {
                        if (sku.properties['31'] === colorCodeList[order].valueId) {
                            sku.colorCode = colorCodeList[order].valueName;
                            break;
                        }
                    }
                }
            }
        }

        replyList.unshift({"replyId": 0, "replyName": "请选择"});

        $scope.alterShowStatus=function(event){

            var $target = $(event.currentTarget);
            $target.text("展开更多价格>>");
            if($scope.showMoreCol){
                $target.text("拉上多余价格>>");
            }
            $scope.showMoreCol = !$scope.showMoreCol;
        }

        $scope.replyList = replyList;
        vm.modal = {};
        vm.replyAndFeedbackMap = {};
        vm.remarkAndFeedbackMap = {};
        vm.replyAndItemMap = {};
        vm.modal.itemDomain = itemDomain;
        
        
        $scope.printQrCode = function (sampleId) {
          var selectedSampleIds = [];
          var rowObj = {};
          rowObj.sampleId = sampleId;
          selectedSampleIds[0] = sampleId;

          var modalInstance = $uibModal.open({
            templateUrl: 'app/sample-mgmt/modal/print-qr-code.html?v=' + LG.appConfig.clientVersion,
            keyboard: false,
            controller: 'PrintQrCodeModalCtrl',
            resolve: {
              rowObj : function () {

                return rowObj;
              },
              isBatch : function () {
                return false;
              },
              selectedSampleIds : function () {
                return selectedSampleIds;
              }
            }
          });
        };

        for (var idx in feedbackList) {
            var feedback = feedbackList[idx];
            /*if(feedbackList[idx].itemStatus == 0){
                $scope.feedbackList[idx].itemStatus = "";
            } else if(feedbackList[idx].itemStatus == 1){
                $scope.feedbackList[idx].itemStatus = "现货";
            }else{
                $scope.feedbackList[idx].itemStatus = "期货";
            }*/
            vm.replyAndFeedbackMap[feedback.feedbackId] = feedback.replyId;
            vm.remarkAndFeedbackMap[feedback.feedbackId] = feedback.remark;
        };

        replyList.forEach(function(e){
            vm.replyAndItemMap[e.replyId] = e.itemId;
        });

        $scope.auditFail=function ($event,feedbackId,demandId) {
          return demandMgmtService.feedbackAuditFail(feedbackId,demandId,refreshFeedBackList);
        }

        $scope.auditSuccess = function($event,feedbackId,demandId) {
            return demandMgmtService.feedbackAuditSuccess(feedbackId,demandId,refreshFeedBackList);
        }


        function refreshFeedBackList(demandId) {

          return demandMgmtService.getDemandFeedbackList(demandId).then(
              function (response) {
                if (response.data.code == 200) {
                  $scope.feedbackList=response.data.data.list
                }
              });

        }

        //客户详情
        $scope.customerDetail = function (customerId) {
            demandMgmtService.getCustomerDetail(customerId)
                .then(function successCallback(response) {

                    $uibModal.open({
                        templateUrl: 'app/customer-mgmt/modal/customerDetail.html?v=' + LG.appConfig.clientVersion,
                        size: 'lg',
                        keyboard: false,
                        controller: function ($scope, $uibModalInstance, data) {
                            $scope.info = data.customer;
                            $scope.extralData = data.extralData;
                            $scope.rowObj = data.customer;

                            $scope.cancel = function () {
                                $uibModalInstance.dismiss('cancel');
                            };
                        },
                        resolve: {
                            data: function () {
                                return response.data.data;
                            }
                        }
                    });
                });
        }


        $scope.ok = function () {
            var requestData = [];
            var remarkRequestData = [];
            for (var idx in feedbackList) {
                var feedback = feedbackList[idx];
                if (vm.remarkAndFeedbackMap[feedback.feedbackId].length > 100) {
                    toaster.pop({
                                    type: 'error',
                                    title: '操作提示',
                                    body: "备注长度不能超过100",
                                    showCloseButton: true,
                                    timeout: 5000
                                });
                    return;
                };
                requestData.push({
                                     "feedbackId": feedback.feedbackId,
                                     "replyId": vm.replyAndFeedbackMap[feedback.feedbackId],
                                     "remark": vm.remarkAndFeedbackMap[feedback.feedbackId],
                                      "feedbackUserName":""
                                 })
            }
            ;

            demandMgmtService.modifyFeedbackReply(JSON.stringify(requestData))
                .then(function (resp) {
                    toaster.pop({
                                    type: resp.data.code == 200 ? 'success' : 'error',
                                    title: '操作提示',
                                    body: resp.data.message,
                                    showCloseButton: true,
                                    timeout: 5000
                                });
                    if (resp.data.code == 200) {
                        $uibModalInstance.close();
                    }
                    ;
                })
        }

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        }

        $( '.swipebox' ).swipebox();
    }

    angular
        .module('app.demand-mgmt')
        .controller('DemandResultCtrl', DemandResultCtrl);

    angular
        .module('app.demand-mgmt')
        .controller('DemandResultCtrlForRoute', DemandResultCtrlForRoute);

})();