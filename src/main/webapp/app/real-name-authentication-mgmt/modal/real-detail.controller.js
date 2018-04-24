(function () {

  'use strict';

  RealDetailMgmtCtrl.$inject = ['$scope', '$uibModal', 'RealService', '$uibModalInstance','rowObj']
  function RealDetailMgmtCtrl($scope, $uibModal, RealService, $uibModalInstance,rowObj) {
    var vm = this;

    $scope.mobile = rowObj.mobile;
    $scope.dtInstance = {};
    $scope.rowObj = rowObj;

    vm.datas = [];
      function init() {
          RealService.detail(rowObj.id).then(function successCallback(response) {
               $scope.data = response.data.data;
          });
      }
      init();

      $scope.showFullImg = function (ev) {
          var $this = $(ev.currentTarget);
          var index = $this.index();
          var title = $this.data('title');
          var $parents = $this.parents('.imgBox');
          var $img = $parents.find('img');
          var imgLen = $img.length;
          var imgArr = [];
          for(var n = 0; n < imgLen; n++){
              var img = {
                  src: $img.eq(n).attr('src'),
                  w: 800,
                  h: 800,
                  title: title + (n+1)
              };
              imgArr.push(img);
          }
          var option = {
              index: index,
              closeOnScroll: false
          };
          var pswp = new PhotoSwipe($('#pswp')[0], PhotoSwipeUI_Default, imgArr, option);
          pswp.init();
      };

    $scope.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };

    // 拒绝
    $scope.refuse = function () {
        var $parsentUibModalInstance = $uibModalInstance;
      var modalInstance = $uibModal.open(
          {
            templateUrl: 'app/real-name-authentication-mgmt/modal/refuse.html?v=' + LG.appConfig.clientVersion,
            keyboard: false,
            controller: function ($scope, $uibModal,
                                  $uibModalInstance,
                                  $compile,
                                  RealService, toaster) {
              $scope.refuseType = "10";
              $scope.ok = function () {
                  if($scope.refuseType=='900'){
                      if(!$scope.refuseReason){
                          toaster.pop(
                              {
                                  type: 'error',
                                  title: '操作提示',
                                  body: '请输入其他原因',
                                  showCloseButton: true,
                                  timeout: 5000
                              });
                      }else{
                          RealService.audit(rowObj.id,30,$(".refuseReason").find("option:selected").val(),$(".refuseReason").find("option:selected").html(),$(".reasonContent").val())
                              .then(
                                  function successCallback(response) {
                                      toaster.pop(
                                          {
                                              type: response.data.code == 200 ? 'success'
                                                  : 'error',
                                              title: '操作提示',
                                              body: response.data.message,
                                              showCloseButton: true,
                                              timeout: 5000
                                          });

                                  }).finally(function () {
                              $uibModalInstance.close();
                              $parsentUibModalInstance.close();
                          });
                      }
                  }else{
                      RealService.audit(rowObj.id,30,$(".refuseReason").find("option:selected").val(),$(".refuseReason").find("option:selected").html(),$(".reasonContent").val())
                          .then(
                              function successCallback(response) {
                                  toaster.pop(
                                      {
                                          type: response.data.code == 200 ? 'success'
                                              : 'error',
                                          title: '操作提示',
                                          body: response.data.message,
                                          showCloseButton: true,
                                          timeout: 5000
                                      });

                              }).finally(function () {
                          $uibModalInstance.close();
                          $parsentUibModalInstance.close();
                      });
                  }

              };

              $scope.cancel = function () {
                $uibModalInstance.dismiss('cancel');
              };
            }
          });

      modalInstance.result.then(function (result) {

      }, function (reason) {

      });
    }

    // 通过
    $scope.pass = function () {
        var $parsentUibModalInstance = $uibModalInstance;
      var modalInstance = $uibModal.open(
          {
            templateUrl: 'app/real-name-authentication-mgmt/modal/pass.html?v=' + LG.appConfig.clientVersion,
            keyboard: false,
            controller: function ($scope, $uibModal,
                                  $uibModalInstance,
                                  $compile,
                                  RealService, toaster) {

                var auditStatus = 20;
              $scope.ok = function () {
                  var id = rowObj.id;
                RealService.audit(id,auditStatus,'','','')
                    .then(
                        function successCallback(response) {
                          toaster.pop(
                              {
                                type: response.data.code == 200 ? 'success'
                                    : 'error',
                                title: '操作提示',
                                body: response.data.message,
                                showCloseButton: true,
                                timeout: 5000
                              });

                        }).finally(function () {
                            $uibModalInstance.close();
                            $parsentUibModalInstance.close();
                });
              };

              $scope.cancel = function () {
                $uibModalInstance.dismiss('cancel');
              };
            },
            resolve: {
              layerId: function () {
                return 123;
              }
            }
          });

      modalInstance.result.then(function (result) {

      }, function (reason) {

      });
    }

  }

  angular
      .module('app.real-name-authentication-mgmt')
      .controller('RealDetailMgmtCtrl', RealDetailMgmtCtrl)

})();