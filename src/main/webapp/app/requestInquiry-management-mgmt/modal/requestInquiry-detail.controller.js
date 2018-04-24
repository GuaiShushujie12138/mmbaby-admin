/**
 * Created by joey on 2017/8/15.
 */

(function () {

    'use strict';

    inquiryDetailCtrl.$inject = ['$scope', '$http', '$uibModal', '$uibModalInstance', '$filter', '$compile', 'toaster','requestInquiryMgmtService','requestInquiryId'];

    function inquiryDetailCtrl($scope, $http, $uibModal, $uibModalInstance, $filter, $compile, toaster,requestInquiryMgmtService,requestInquiryId) {
        var vm = this;

        requestInquiryMgmtService.getInquiryDetail(requestInquiryId).then(function(resp) {
            if (resp.data.code == 200) {
                $scope.requestInquiry = resp.data.data;
                $scope.fabric = resp.data.data.fabric;
                $scope.accessory = resp.data.data.accessory;
                // 定义材质是面料还是辅料
                if ($scope.fabric) {
                    $scope.material = 1;
                } else {
                    $scope.material = 2;
                }

            } else {
                toaster.pop({
                    type: 'error',
                    title: '提示信息',
                    body:   '请求异常',
                    showCloseButton: true,
                    timeout: 5000
                });
            }
        });

        // 图片放大
        $scope.clickImg = function (event, url) {
            event.stopPropagation();
            var fragment = document.querySelector('.imgFragment');
            if (!fragment) {
                fragment = document.createElement('div');
                var img = document.createElement('img');
                img.src = url;
                img.style.cssText = 'position: absolute; height: 100%; top: 0;left: 50%; transform: translateX(-50%)';
                fragment.appendChild(img);
                fragment.style.cssText = 'position: fixed;width: 800px;height: 600px;left: 50%;top: 50%;margin-top: -300px;margin-left: -400px;background-color: rgba(0,0,0,0.4);z-index: 9999;';
                fragment.className = 'imgFragment';
                document.body.appendChild(fragment);
            }
        }

        document.body.addEventListener('click', function (e) {
            var fragment = document.querySelector('.imgFragment');
            if (fragment) {
                document.body.removeChild(fragment);
            }
        });


        $scope.cancel = function() {
            $uibModalInstance.dismiss('cancel');
        }
    }

    angular
        .module('app.request-inquiry-management')
        .controller('inquiryDetailCtrl', inquiryDetailCtrl)
})();