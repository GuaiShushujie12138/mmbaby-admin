/**
 * Created by dell on 2016/12/19.
 */
(function () {

    'use strict';

    FunctionPrivilegeMgmtCtrl.$inject = ['$scope' , '$http' , '$compile' , 'DTOptionsBuilder' , 'DTColumnBuilder' , 'FunctionPrivilegeMgmtService' , '$uibModal' , 'toaster' ];

    function FunctionPrivilegeMgmtCtrl($scope , $http , $compile , DTOptionsBuilder , DTColumnBuilder , FunctionPrivilegeMgmtService , $uibModal , toaster){
        var vm = this;
        $scope.dtInstance = {};
        $scope.dtOptions =  DTOptionsBuilder
            .fromSource('')
            .withFnServerData(serverData)
            .withDataProp('data')
            .withOption('serverSide', true)
            .withOption('searching', false)
            .withOption('lengthChange', true)
            .withOption('autoWidth', false)
            .withOption('scrollX', true)
            .withDOM('frtlip')
            .withOption('lengthMenu', [10, 25, 50,100])
            .withOption('displayLength', 10)
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
            DTColumnBuilder.newColumn('id').withTitle('权限编号'),
            DTColumnBuilder.newColumn('createId').withTitle('创建人编号'),
            DTColumnBuilder.newColumn('updateId').withTitle('修改人编号'),
            DTColumnBuilder.newColumn('createTime').withTitle('创建时间'),
            DTColumnBuilder.newColumn('updateTime').withTitle('修改时间'),
            DTColumnBuilder.newColumn('validity').withTitle('是否有效').renderWith(
                function(data , type , full , meta){
                    if(data == 1){
                        return '<span class="label label-success">有效</span>';
                    }else{
                        return '<span class="label label-danger">无效</span>'
                    }
                }
            ),
            DTColumnBuilder.newColumn('code').withTitle('权限编码'),
            DTColumnBuilder.newColumn('functionName').withTitle('权限功能名'),
            DTColumnBuilder.newColumn('parentId').withTitle('上级权限编号'),
            DTColumnBuilder.newColumn('isLeafNode').withTitle('是否为叶子节点').renderWith(
                function(data , type , full , meta){
                    if(data == 1){
                        return '<span class="label label-success">是</span>';
                    }else{
                        return '<span class="label label-danger">否</span>'
                    }
                }
            ),
            DTColumnBuilder.newColumn('subSystemId').withTitle('所属系统'),
            DTColumnBuilder.newColumn(null).withTitle('操作').notSortable().withClass('text-center p-w-xxs-i')
                .renderWith(operateHtml)];

        /**新增权限*/
        $scope.addNewPrivilege = function(){
            var rowObj = {};
            rowObj.id = 0;
            rowObj.code = '';
            rowObj.functionName = '';
            rowObj.parentId = 0;
            rowObj.isLeafNode = 0;
            rowObj.subSystemId = 0;
            rowObj.isHidden = 0;
            rowObj.functionIcon = '';
            rowObj.orderBy = 0;

            openModal('app/function-privilege-mgmt/modal/add-or-update-new-privilege.html?v=' + LG.appConfig.clientVersion , "新增成功" , rowObj);
        }

        /**编辑权限*/
        $scope.editPrivilege = function (row , rowId){
            var rowObj = vm.tableData[row];
            openModal('app/function-privilege-mgmt/modal/add-or-update-new-privilege.html?v=' + LG.appConfig.clientVersion , "编辑成功" , rowObj);

        }

        function serverData(sSource, aoData, fnCallback, oSettings){
            console.log('_aoData');
            console.log(aoData);
            console.log('_oSettings');
            console.log(oSettings);


            var draw = aoData[0].value;
            var sortColumn = $scope.dtColumns[parseInt(aoData[2].value[0].column)].mData;
            var sortDir = aoData[2].value[0].dir;
            var start = aoData[3].value;
            var limit = aoData[4].value;

            var form = $(oSettings.nTableWrapper).closest('#gridcontroller').find('form');
            var queryConditionObject = getQueryParams(form, vm.tabFilter);

            var where = JSON.stringify(queryConditionObject);

            return FunctionPrivilegeMgmtService.functionPrivilegeQuery(draw, sortColumn, sortDir, start, limit, where).then(function (resp) {
                console.log(resp);
                fnCallback(resp.data);
                vm.tableData = resp.data.data
            }).finally(function () {
                $scope.queryBtnDisabled = false;
            });
        }

        function operateHtml(data , type , full , meta){
            return '<button id="btn-to-receive-' + full.id + '" class="btn btn-xs btn-blue"' + 'ng-if="' + data.validity + '==1"' + ' ng-click="editPrivilege(' + meta.row + ',' + escapeHTML(full.id) + ')">' + '编辑' + '</button>';
        }


        function openModal(url , title , rowObj){
            var opener = $scope;
            $uibModal.open({
                templateUrl:url,
                controller:function ($scope, $uibModalInstance , FunctionPrivilegeMgmtService,opener){

                    $scope.modalId = rowObj.id;
                    $scope.modalCode = rowObj.code;
                    $scope.modalFunctionName = rowObj.functionName;
                    $scope.modalParentId = rowObj.parentId;
                    $scope.modalIsLeafNode = rowObj.isLeafNode;
                    $scope.modalSubSystemId = rowObj.subSystemId;
                    $scope.modalIsHidden = rowObj.isHidden;
                    $scope.modalFunctionIcon = rowObj.functionIcon;
                    $scope.modalOrderBy = rowObj.orderBy;


                    //初始化
                    $scope.title='';
                    if(rowObj.code == 0){
                        $scope.title = "新增权限";

                    }else{
                        $scope.title = "修改权限-" + rowObj.id;
                    }

                    $scope.cancel = function () {
                        $uibModalInstance.dismiss('cancel');
                    };

                    $scope.ok = function(){
                        $scope.okBtnDisabled = true;
                        FunctionPrivilegeMgmtService.addOrUpdatePrivilege($scope.modalId , $scope.modalCode , $scope.modalFunctionName , $scope.modalParentId
                            ,$scope.modalIsLeafNode , $scope.modalSubSystemId , $scope.modalIsHidden , $scope.modalFunctionIcon , $scope.modalOrderBy).then(function successCallback(response) {
                                toaster.pop({
                                    type:response.data.code == 200 ? 'success' : 'error',
                                    title:title,
                                    body:response.data.message,
                                    showCloseButton:true,
                                    timeout:5000
                                });
                                if(response.data.code == 200){
                                    opener.dtInstance.reloadData();
                                }
                            })
                            .finally(function () {
                                $uibModalInstance.close();
                                $scope.okBtnDisabled = false;
                            });
                    }
                },
                resolve: {
                    FunctionPrivilegeMgmtService:function () {
                       return FunctionPrivilegeMgmtService;
                   },
                    opener:function () {
                        return opener;
                    }
                }
            });
        }

        $scope.submit = function () {
            $scope.queryBtnDisabled = true;
            $scope.dtInstance.reloadData();
        }
    }

    angular
        .module('app.function-privilege-mgmt')
        .controller('FunctionPrivilegeMgmtCtrl', FunctionPrivilegeMgmtCtrl);

})();