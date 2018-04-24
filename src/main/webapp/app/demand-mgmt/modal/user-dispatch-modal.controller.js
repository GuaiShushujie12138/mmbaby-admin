/**
 * user-dispatch-modal.controller
 */
(function () {

    'use strict';

    UserDispatchModalCtrl.$inject = ['$scope', '$uibModal', '$uibModalInstance', '$compile', 'demandMgmtService', 'toaster', 'rowObj','userList', 'DTOptionsBuilder', 'DTColumnBuilder'];

    function UserDispatchModalCtrl($scope, $uibModal, $uibModalInstance, $compile, demandMgmtService, toaster, rowObj,userList, DTOptionsBuilder, DTColumnBuilder) {

        var vm = $scope;
        var vm2= this;
        //vm.resuserList = $scope.$parent.resuserList;

        vm.demandId = rowObj.demandId;
        vm.initUserList = [];
        //alert($scope.dispatchButtonOnShow);
        $scope.belongUserName = rowObj.belongUserName;
        $scope.belongUserPhone = rowObj.belongUserPhone;
        $scope.userList = userList;
        $scope.modal = {};
        $scope.modal.userName = "";
        $scope.checked={};
        vm.selected = {};
        vm2.draw = 0;
        vm.selectAll = false;
        var titleHtml = '<input type="checkbox" ng-model="selectAll" ng-click="toggleAll(selectAll, selected)" />';

        $scope.toggleAll = function(selectAll, selectedItems) {
            for (var id in selectedItems) {
                if (selectedItems.hasOwnProperty(id)) {
                    selectedItems[id] = selectAll;
                }
            }
        }

        $scope.toggleOne = function(selectedItems) {
            for (var id in selectedItems) {
                if (selectedItems.hasOwnProperty(id)) {
                    if (!selectedItems[id]) {
                        vm.selectAll = false;
                        return;
                    }
                }
            }
            vm.selectAll = true;
        }

        $scope.dtInstance = {};

        $scope.dtOptions = DTOptionsBuilder
            .fromSource('')
            .withFnServerData(serverData)
            .withDataProp('data')
            .withDOM('frtlip')
            .withOption('serverSide', true)
            .withOption('searching', false)
            .withOption('lengthChange', true)
            .withOption('autoWidth', false)
            .withOption('scrollX', false)
            .withOption('lengthMenu', [10, 20, 30, 50, 100])
            .withOption('displayLength', 10)
            //.withOption('rowCallback', rowCallback)
            .withPaginationType('full_numbers')
            .withOption('createdRow', function (row, data, dataIndex) {
                $compile(angular.element(row).contents())($scope);
            })
            .withOption('headerCallback', function (header) {
                if (!vm.headerCompiled) {
                    vm.headerCompiled = true;
                    $compile(angular.element(header).contents())($scope);
                }
            });

        $scope.dtColumns = [
            DTColumnBuilder.newColumn(null).withTitle(titleHtml).notSortable().withClass('text-center p-w-xxs-i choose-th').withOption('width', '40px')
                .renderWith(function (data, type, full, meta) {
                    //for (var i=0; i < userList.length;i++ ) {
                    for (var i=0; i < userList.length;++i) {
                        var user = userList[i];

                        if  (user.id == full.id &&(user.sourceType == 1 || user.sourceType ==2))
                        {
                            //alert(2);
                            vm.initUserList.push(user.id);
                            vm.selected[full.id] = true;
                            return '<input type="checkbox" ng-model="selected[\'' + full.id + '\']"     ng-click="toggleOne(selected)" />';

                        }else{
                            vm.selected[full.id] = false;

                        }

                    }

                    return '<input type="checkbox" ng-model="selected[\'' + full.id + '\']"     ng-click="toggleOne(selected)" />';


                }),
            DTColumnBuilder.newColumn('id').withTitle('ID').notSortable(),
            

            DTColumnBuilder.newColumn('realName').withTitle('姓名').notSortable(),
            DTColumnBuilder.newColumn('mobile').withTitle('手机号').notSortable(),
            DTColumnBuilder.newColumn('departmentFullName').withTitle('部门').notSortable(),
            DTColumnBuilder.newColumn('roleName').withTitle('角色').notSortable(),
            DTColumnBuilder.newColumn('privateNum').withTitle('私海需求数').notSortable(),
            // DTColumnBuilder.newColumn('innerNum').withTitle('内环抢单数').notSortable(),
             DTColumnBuilder.newColumn('unfeedbackNum').withTitle('近7日未反馈需求数').notSortable(),

            DTColumnBuilder.newColumn('sourceType').withTitle('状态').renderWith(function (data, type, full, meta) {
                        switch (data) {
                            case 1:
                                return "公海抢入";
                            case 2:
                                return "后台分配";
                        }
                return "未分配";
            })
        ];


        function serverData(sSource, aoData, fnCallback, oSettings) {

            vm2.draw = aoData[0].value;
            var start = aoData[3].value;
            var limit = aoData[4].value;

            var newUserList = [];

            if($scope.modal.userName == null || $scope.modal.userName == undefined){
                $scope.modal.userName = '';
            }
            userList.forEach(function (val) {

                if (val["realName"].indexOf($scope.modal.userName) != -1){
                    newUserList.push(val);
                }
            });
            var data ={};
            var total = newUserList.length;
            var startIndex = start;
            var endIndex = (startIndex+limit)>total?total:(startIndex+limit);
            data.data = newUserList.slice(startIndex,endIndex);
            data.draw = vm2.draw;
            data.recordsTotal = limit;
            data.recordsFiltered = total;

            fnCallback(data);
        };




        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };

        $scope.grepUser = function () {
            vm2.draw++;
            $scope.dtInstance.reloadData();
        }



        $scope.ok = function () {

            var userIds = [];
            for (var id in vm.selected) {
                if (vm.selected[id]) {
                    userIds.push(id)
                }
            }

            demandMgmtService.dispatchTask(vm.demandId,userIds,vm.initUserList).then(function successCallback(response) {
                if (response.data.code == 200) {
                    toaster.pop({
                        type: response.data.code == 200 ? 'success' : 'error',
                        title: '提示信息',
                        body: response.data.message,
                        showCloseButton: true,
                        timeout: 5000
                    });
                    $uibModalInstance.close();
                }

            });

        };

    }

    angular
        .module('app.demand-mgmt')
        .controller('UserDispatchModalCtrl', UserDispatchModalCtrl);

})();