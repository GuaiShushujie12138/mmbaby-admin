/**
 * Created by lisa
 */

(function () {

    'use strict';

    AddVisitCtrl.$inject = ['$scope', '$uibModal', '$uibModalInstance', 'DTColumnBuilder', 'DTOptionsBuilder', 'DTColumnDefBuilder', 'toaster', 'customerMgmtService','customerId', 'opener'];
    /**
     * AddVisitCtrl
     */
    function AddVisitCtrl($scope, $uibModal, $uibModalInstance, DTColumnBuilder, DTOptionsBuilder, DTColumnDefBuilder, toaster, customerMgmtService, customerId, opener) {
        var vm = $scope;
        vm.visitContentList=[];
        vm.typeList=[{key:10,value:'流失客户回访'},{key:20,value:'金融客户回访'}];
        vm.type=10;
        vm.callResult = '10';
        vm.visitResultList = [{id:110,name:'价格高'},{id:120,name:'履单时间长'},{id:130,name:'找不到版'},{id:140,name:'找版慢'},{id:150,name:'质量差'},
            {id:160,name:'售后问题'},{id:210,name:'无人跟进'},{id:220,name:'无印象下过单'},{id:230,name:'不知道链尚'},{id:240,name:'直接跟销售下单'},
            {id:310,name:'金融账期'},{id:320,name:'需要定制期货'},{id:410,name:'不配合'},{id:420,name:'暂无需求'},{id:430,name:'非行业客户'},
            {id:910,name:'其他'}
            ];

        // 获取回访电话
        init();
        function init(){
            customerMgmtService.getVisitInit(customerId)
                .then(function successCallback(response){
                    console.log(response)
                    vm.registerMobile = response.data.data.registerMobile;
                    vm.contactMobile = response.data.data.contactMobile;
                    vm.mobile = vm.registerMobile;
                })
        }

        $scope.getVisitResultId = function($event,visitResultId) {
            var index = vm.visitContentList.indexOf(visitResultId);
            if(index > -1) {
                vm.visitContentList.splice(index, 1);
            }
            else {
                vm.visitContentList.push(visitResultId);
            }
            var length = vm.visitContentList.length;

            if(length > 5){
                toaster.pop({
                    type: 'error',
                    title: "提示信息",
                    body: '回访结果最多选五项',
                    showCloseButton: true,
                    timeout: 1000
                });
                // $($event.currentTarget).prop('/checked',false)
                $event.currentTarget.checked=false;
                vm.visitContentList.pop()
                return false;
            }

            console.log(vm.visitContentList);
        }

        $scope.changeCallResult = function(){
            vm.visitContentList=[];
            console.log(vm.visitContentList)
        }


        
        $scope.getVisitMobile= function ($event,mobile) {
            if($event.currentTarget.checked){
                vm.mobile = mobile;
            }
        }

        $scope.ok = function () {
            if(vm.visitContentList.length==0 && vm.callResult=='10'){
                toaster.pop({
                    type: 'error',
                    title: "提示信息",
                    body: '请选择回访结果',
                    showCloseButton: true,
                    timeout: 1000
                });
            }else if(vm.csInquiry==undefined && vm.callResult=='10'){
                toaster.pop({
                    type: 'error',
                    title: "提示信息",
                    body: '回访内容必须填写',
                    showCloseButton: true,
                    timeout: 1000
                });
            }else{
                customerMgmtService.addBackVisit(customerId,vm.type,vm.mobile,Number(vm.callResult),vm.visitContentList,vm.csInquiry)
                    .then(function successCallback(response){
                        if(response.data.code==200){
                            opener.dtInstance.reloadData();
                            $uibModalInstance.dismiss('cancel');
                        }
                    })
            }
        }

        $scope.cancel = function () {

            opener.dtInstance.reloadData();
            $uibModalInstance.dismiss('cancel');
        }

    }

    angular
        .module('app.customer-mgmt')
        .controller('AddVisitCtrl', AddVisitCtrl)

})();