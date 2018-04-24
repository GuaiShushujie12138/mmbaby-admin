/**
 * demand Management service
 */
(function () {
  'use strict';

  demandMgmtService.$inject = ['$http', 'toaster', 'SweetAlert'];

  function demandMgmtService($http, toaster, SweetAlert) {
    return {
      getDemandList: getDemandList,
      getUserList: getUserList,
      getUserListByAll: getUserListByAll,

      dispatchTask: dispatchTask,
      getDispatchTaskList: getDispatchTaskList,
      queryReplyList: queryReplyList,
      //queryResultList: queryResultList,
      getRootCategory: getRootCategory,
      getSubCategory: getSubCategory,
      getDemandDetail: getDemandDetail,
      getDemandResult: getDemandResult,
      getDomainUrl: getDomainUrl,
      queryDispatchedUserList: queryDispatchedUserList,
      undispatchTask: undispatchTask,
      queryDemandTradeList: queryDemandTradeList,
      markModel: markModel,
      getRegionList: getRegionList,
        getBuyerOperatorList: getBuyerOperatorList,
      getDemandDynamicList: getDemandDynamicList,
      getDemandFeedbackList: getDemandFeedbackList,
      getReplyList: getReplyList,
      modifyFeedbackReply: modifyFeedbackReply,
      getDemandSourceOptions: getDemandSourceOptions,
      markDemandSource: markDemandSource,
      getItemUrl: getItemUrl,
      getAuditStatus: getAuditStatus,
      getPurchaseArea: getPurchaseArea,
      modifyPurchaseArea: modifyPurchaseArea,
      getNotInPrivateDemandNum: getNotInPrivateDemandNum,
      cancelDemand: cancelDemand,
      completeDemand: completeDemand,
      showMessage: showMessage,
      feedbackAuditFail: feedbackAuditFail,
      feedbackAuditSuccess: feedbackAuditSuccess,
      getCustomerDetail: getCustomerDetail,
      getDemandQrCode:getDemandQrCode


    };

    function getDemandQrCode(demandId){
     return $http.get('/public/demand-feedback-qrcode/'+demandId + '.jpg');
    }

    function showMessage(msg, title, type) {
      toaster.pop({
        type: type || 'error',
        title: title || '提示信息',
        body: msg,
        showCloseButton: true,
        timeout: 5000
      });
      return false;

    }

    function getDemandList(draw, sortColumn, sortDir, start, limit, where) {
      return $http.post(
          'demand-mgmt/query', {
            draw: draw,
            sortColumn: sortColumn,
            sortDir: sortDir,
            start: start,
            limit: limit,
            where: where
          }
      );
    }

    function getUserList(demandId) {
      return $http.post(
          'demand-mgmt/getUserList', {
            demandId: demandId
          }
      );
    }

    function getUserListByAll(demandId) {
      return $http.post(
          'demand-mgmt/getUserListByAll', {
            demandId: demandId
          }
      );
    }

    function getDispatchTaskList(demandId) {
      return $http.post(
          'task-mgmt/getDispatchTaskList', {
            targetId: demandId
          }
      );
    }

    function dispatchTask(demandId, userIds, initUserList) {
      //alert("dispatchTask"+userIds+"=="+initUserList);
      return $http.post(
          'demand-mgmt/dispatchTask', {
            demandId: demandId,
            userIds: userIds,
            initUserList: initUserList
          }
      );
    }

    function undispatchTask(demandId, taskIds) {
      return $http.post(
          'demand-mgmt/undispatchTask', {
            demandId: demandId,
            taskIds: taskIds
          }
      );
    }

    function queryReplyList(draw, sortColumn, sortDir, start, limit, demandId) {
      return $http.post(
          'demand-mgmt/queryReplyList',
          {
            draw: draw,
            sortColumn: sortColumn,
            sortDir: sortDir,
            start: start,
            limit: limit,
            demandId: demandId
          })
    }

    function getDemandResult(draw, start, limit, demandId) {
      return $http.post(
          'demand-mgmt/queryResultList',
          {
            draw: draw,
            start: start,
            limit: limit,
            demandId: demandId
          })
    }

    function getRootCategory() {
      return $http.post('demand-mgmt/getRootCategory', {})
    }

    function getSubCategory(categoryId) {
      return $http.post('demand-mgmt/getSubCategory',
          {
            categoryId: categoryId
          });
    }

    function getDemandDetail(demandId) {
      //alert(demandId);
      return $http.post('demand-mgmt/getDemandDetail',
          {
            demandId: demandId
          });
    }

    /*    function getDemandResult(demandId) {
     //alert("--");
     //alert(demandId +"==");
     return $http.post('demand-mgmt/getDemandResult',
     {
     demandId: demandId
     });
     }*/

    function getDomainUrl() {
      return $http.get('demand-mgmt/getDomainUrl');
    }

    function getItemUrl() {
      return $http.get('demand-mgmt/getItemUrl');
    }

    function queryDispatchedUserList(demandId) {
      return $http.post('demand-mgmt/queryDispatchedUserList',
          {
            demandId: demandId
          });
    }

    function queryDemandTradeList(demandId) {
      return $http.post('demand-mgmt/queryDemandTradeList',
          {
            demandId: demandId
          });
    }

    /**
     * 标记收样
     */
    function markModel(demandId, receiveSampleStatus, remark) {

      if (receiveSampleStatus != 1 && receiveSampleStatus != 2) {
        return showMessage('参数错误!', '提示', 'error');
      }
      if (receiveSampleStatus == 2 && isNullOrEmpty(remark)) {
        return showMessage('请备注未收到实样的原因!', '提示', 'error');
      }

      return $http.post('demand-mgmt/markModel',
          {
            demandId: demandId,
            receiveSampleStatus: receiveSampleStatus,
            remark: remark
          });
    }

    function getRegionList() {
      return $http.get("/demand-mgmt/getRegionList");

    }

      function getBuyerOperatorList() {
          return $http.get("/demand-mgmt/getBuyerOperatorList");

      }

    function getDemandDynamicList(demandId, pageNo) {
      return $http.get(
          "/demand-mgmt/getDemandDynamicList?demandId=" + demandId + "&pageNo="
          + pageNo);

    }

    function getDemandFeedbackList(demandId) {
      return $http.get(
          "/demand-mgmt/feedback/list?demandId=" + demandId + "&pageSize=100")
    }

    function getReplyList(demandId) {
      return $http.get("/demand-mgmt/getReplyList?demandId=" + demandId);
    }

    function modifyFeedbackReply(requestData) {
      return $http.post("/demand-mgmt/modifyFeedbackReply", {
        requestData: requestData
      })
    }

    function getDemandSourceOptions() {
      return $http.get("/demand-mgmt/options");

    }

    function markDemandSource(demandId, sourceCode, sourceName) {
      return $http.post("/demand-mgmt/markDemandSource", {
        demandId: demandId,
        sourceCode: sourceCode,
        sourceName: sourceName
      })
    }

    function getAuditStatus() {
      return $http.get("/demand-mgmt/getAuditStatus");
    }

    function getPurchaseArea() {
      return $http.get("/demand-mgmt/getPurchaseArea");
    }

    function modifyPurchaseArea(purchaseAreaId, remark, demandId) {
      return $http.post(
          "/demand-mgmt/modifyPurchaseArea?purchaseAreaId=" + purchaseAreaId
          + "&remark=" + remark + "&demandId=" + demandId);
    }

    function getNotInPrivateDemandNum() {
      return $http.get("/demand-mgmt/getNotInPrivateDemandNum");
    }

    function cancelDemand(demandId, cancelReason) {
      return $http.post("/demand-mgmt/cancelDemand?cancelReason=" + cancelReason
          + "&demandId=" + demandId);
    }

    function completeDemand(demandId) {
        return $http.post("/demand-mgmt/completeDemand",{
            demandId: demandId
        });
    }

    function feedbackAuditFail(feedbackId, demandId, callback) {

      SweetAlert.swal({
            title: "",
            text: "是否确认审核不通过?",
            type: "input",
            showCancelButton: true,
            closeOnConfirm: false,
            animation: "slide-from-top",
            inputPlaceholder: "请备注原因，50字以内",
            showLoaderOnConfirm: true,
            confirmButtonText: "确认操作",
            cancelButtonText: "取消",
          },
          function (inputValue) {

            if (inputValue === false) {
              return false;
            }

            if (inputValue === "") {
              swal.showInputError("请备注原因");
              return false;
            }
            var requestObj = {
              feedbackId: feedbackId,
              demandId: demandId,
              auditFailReason: inputValue
            };
            var requestData = JSON.stringify(requestObj);

            $http.post("/demand-mgmt/feedbackAuditFail", {
              requestData: requestData
            }).then(function (resp) {
              if (resp.data.code == 200) {
                SweetAlert.swal("提示信息", "操作成功!", "success");
              } else {
                SweetAlert.swal("提示信息", resp.data.message, "error");
              }
              if (callback != undefined && typeof(callback) == "function") {
                callback(demandId);
              }
            });
          });
    }

      function feedbackAuditSuccess(feedbackId, demandId, callback) {
          SweetAlert.swal({
                  title: "是否确认审核通过？",
                  type: "warning",
                  showCancelButton: true,
                  confirmButtonColor: "#DD6B55",
                  confirmButtonText: "确认操作",
                  cancelButtonText: "取消",
                  closeOnConfirm: false,
                  closeOnCancel: true
              },
              function (isConfirm) {
                  if (isConfirm) {
                      $http.post('/demand-mgmt/feedbackAuditSuccess',{
                          feedbackId: feedbackId,
                          demandId: demandId
                      }).then(function(resp) {
                          if (resp.data.code == 200) {
                              SweetAlert.swal("提示信息", "操作成功!", "success");
                          } else {
                              SweetAlert.swal("提示信息", resp.data.message, "error");
                          }
                          if (callback != undefined && typeof(callback) == "function") {
                              callback(demandId);
                          }
                      });
                  }
              });
      }



      function getCustomerDetail(customerId){
      return $http.get(
          '/web/customer/getCustomerDetail?customerId=' + customerId
      );
    }

  }

  angular
  .module('app.demand-mgmt')
  .factory('demandMgmtService', demandMgmtService);
})();