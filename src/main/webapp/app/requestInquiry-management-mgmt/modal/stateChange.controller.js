
(function () {

    'use strict';

    stateChangeCtrl.$inject = ['$scope', '$http', '$uibModal', 'SweetAlert', '$uibModalInstance', '$filter', '$compile', 'toaster','requestInquiryMgmtService','DTOptionsBuilder','DTColumnBuilder','inquiryData','opener'];

    function stateChangeCtrl($scope, $http, $uibModal,SweetAlert, $uibModalInstance, $filter, $compile, toaster,requestInquiryMgmtService,DTOptionsBuilder,DTColumnBuilder,inquiryData,opener) {

        var vm = this;

        function initData() {
            if (inquiryData.status === 60) {
                vm.actionList = [{type: 3,name: '使失效'},{type:13,name: '变更为待反馈'}];
            } else {
                vm.actionList = [{type: 3,name: '使失效'}];
            }

            vm.loveList = [{status: 'love-zero'},{status: 'love-zero'},{status: 'love-zero'},{status: 'love-zero'},{status: 'love-zero'}];
            vm.actionStatus = '';
            vm.inValidReason = {
                one:'',
                two:'',
                three:'',
                four:''
            };
            vm.rejectReason = '';
            vm.whichStar = 0;
        }

        initData();


        /**
         * 在点击爱心的时候
         * @param index
         */
        $scope.clickLove = function(index) {
            vm.whichStar = index;
        }

        /**
         * 在悬浮在爱心上
         * @param index
         */
        $scope.hoverLove = function(index) {
            for (var i = 0,j = vm.loveList.length; i < j; i++) {
                if (i <= index) {
                    vm.loveList[i].status = 'love-full';
                } else {
                    vm.loveList[i].status = 'love-zero';
                }
            }
        };

        /**
         * 当离开具体的星星时
         * @param index
         */
        $scope.hoveroutLove = function(index) {
            for (var i = 0,j = vm.loveList.length; i < j; i++) {
                if (i <= vm.whichStar) {
                    vm.loveList[i].status = 'love-full';
                } else {
                    vm.loveList[i].status = 'love-zero';
                }
            }
        }

        /**
         * 再点击确认后的回调函数
         */
        $scope.ok = function() {
            $scope.okBtnDisabled = true;
            var starCount = 0;
            var reason = '';
            var data = {};
            if (!vm.actionStatus) {
                popup('error','请选择变更状态');
                $scope.okBtnDisabled = false;
                return;
            }

            /**
             * 直接变更为待反馈
             */
            if (vm.actionStatus === 13) {
                data = {
                    requestInquiryId:inquiryData.requestInquiryId,
                    actionStatus:vm.actionStatus,
                    star: 0,
                    reason: ''
                };
                requestInquiryMgmtService.changeStatus(data).then(function(resp){
                    $scope.okBtnDisabled = false;
                    if (resp.data.code === 200) {
                        popup('success',resp.data.message);
                        $scope.cancel();
                        opener.dtInstance.reloadData(function () {
                        }, false);
                    } else {
                        popup('error',resp.data.message);
                    }
                },function(){});
            /**
             *  变更为失效状态
             */
            } else if (vm.actionStatus === 3) {
                vm.loveList && vm.loveList.forEach(function(item,index) {
                    if (item.status === 'love-full') {
                        starCount++;
                    }
                });

                if (vm.inValidReason.four && $.trim(vm.rejectReason).length === 0) {
                    popup('error','其他原因必须填写');
                    $scope.okBtnDisabled = false;
                    return;
                }
                if (starCount === 0) {
                    popup('error','必须给销售打分');
                    $scope.okBtnDisabled = false;
                    return;
                }

                for (var key in vm.inValidReason){
                    if (key === 'four') {
                        if (vm.inValidReason[key]) {
                            reason = reason + vm.rejectReason + ';';
                        }
                    } else if (vm.inValidReason[key].length > 0) {
                        reason = reason + vm.inValidReason[key] + ';';
                    }
                }

                data = {
                    requestInquiryId:inquiryData.requestInquiryId,
                    actionStatus:vm.actionStatus,
                    star: starCount,
                    reason: reason
                };
                requestInquiryMgmtService.changeStatus(data).then(function(resp) {
                    // 在操作成功的状态下
                    if (resp.data.code === 200) {
                        popup('success',resp.data.message);
                        $scope.okBtnDisabled = false;
                        $scope.cancel();
                        opener.dtInstance.reloadData(function () {
                        }, false);
                    } else {
                        popup('error',resp.data.message);
                    }
                },function() {

                });
            }
        }

        /**
         * 在点击取消后的回调函数
         */
        $scope.cancel = function() {
            $uibModalInstance.close();
        };

        /**
         * 封装toaster弹出框
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
    }
    angular
        .module('app.request-inquiry-management')
        .controller('stateChangeCtrl', stateChangeCtrl);

})();