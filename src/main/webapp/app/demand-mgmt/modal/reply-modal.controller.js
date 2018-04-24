/**
 * goods-modal.controller
 */
(function () {

    'use strict';

    ReplyModalCtrl.$inject = ['$scope', '$uibModal',  '$compile', 'demandMgmtService', 'toaster',  'DTOptionsBuilder', 'DTColumnBuilder'];

    function ReplyModalCtrl($scope, $uibModal, $compile, demandMgmtService, toaster, DTOptionsBuilder, DTColumnBuilder) {
        var vm = $scope;
        //$scope.demandId = rowObj.demandId;
        $scope.dtInstance = {};
        vm.demandId = $scope.demandId;

        $scope.dtOptions = DTOptionsBuilder
            .fromSource('')
            .withFnServerData(serverData)
            .withDOM('frtlip')
            .withDataProp('data.list')
            .withOption('serverSide', true)
            .withOption('searching', false)
            .withOption('lengthChange', true)
            .withOption('autoWidth', false)
            .withOption('scrollX', false)
            .withOption('lengthMenu', [10, 20, 50])
            .withOption('displayLength', 10)
            .withPaginationType('full_numbers')
            .withOption('createdRow', function (row, data, dataIndex) {
                $compile(angular.element(row).contents())($scope);
            });

        $scope.dtColumns = [
            DTColumnBuilder.newColumn('itemId').notVisible(),
            DTColumnBuilder.newColumn('mainPic').withTitle('图片').notSortable().withOption('width', '1px').withClass('func-th').renderWith(pictureHtml),
            DTColumnBuilder.newColumn('name').withTitle('商品名称').notSortable().withClass('func-th').renderWith(goodsNameHtml),
            DTColumnBuilder.newColumn('shopName').withTitle('店铺名称').notSortable().withClass('func-th'),
            DTColumnBuilder.newColumn('mobile').withTitle('卖家号码').notSortable().withClass('func-th'),
            DTColumnBuilder.newColumn('sellerRunner').withTitle('对应卖家运营').notSortable().withClass('func-th'),
            DTColumnBuilder.newColumn('replyTime').withTitle('回复时间').notSortable().withClass('func-th')
        ];

        function pictureHtml(data, type, full, meta) {

            var ret = '<carousel class="td-carousel">';
                ret += '<slide class="active"' + '><img src="' + full.mainPic +'" /></slide>';
            ret += '</carousel>';
            return ret;
        }

        function shopHtml(data, type, full, meta) {
            var str = '<a href="'+ domain +'shop/' + full.shopId + '" target="_blank">' + full.shopName + '</a>';
            if (full.shopName != full.createUserId) {
                str += '<span class="badge badge-danger">运营添加</span>';
            }
            if(full.userFromFlag==6){
                str+='&nbsp;&nbsp;<span class="label label-danger">测试帐号</span>';
            }
            return str;
        }

        function goodsNameHtml(data, type, full, meta){
            var str = '<a href="{{itemDomain}}item/' + full.itemId + '" target="_blank">' + full.name + '</a>';
            return str;
        }

        function replyStatusHtml(data, type, full, meta)
        {
            return'<div ng-switch on=' + full.demandReplyStatus + '>' +
                '<span ng-switch-when="0">待审核</span>' +
                '<span ng-switch-when="1">审核不通过</span>' +
                '<span ng-switch-when="2">审核通过</span>' +
                '<span ng-switch-default>未知</span>' +
                '</div>';
        }

        function serverData(sSource, aoData, fnCallback, oSettings) {
            var draw = aoData[0].value;
            var sortColumn = $scope.dtColumns[parseInt(aoData[2].value[0].column)].mData;
            var sortDir = aoData[2].value[0].dir;
            var start = aoData[3].value;
            var limit = aoData[4].value;
            var demandId = vm.demandId;

            return demandMgmtService.queryReplyList(draw, sortColumn, sortDir, start, limit, demandId)
                .then(function (resp) {
                    fnCallback(resp.data);
                    vm.tableData = resp.data.data.list;
                });
        }

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    }

    angular
        .module('app.demand-mgmt')
        .controller('ReplyModalCtrl', ReplyModalCtrl);

})();