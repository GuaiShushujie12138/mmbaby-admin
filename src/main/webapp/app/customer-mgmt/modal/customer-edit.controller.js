/**
 * buyer-modal.controller
 */
(function () {

    'use strict';

    CustomerEditCtrl.$inject = ['$scope', '$uibModal', '$uibModalInstance', '$compile', 'customerMgmtService', 'toaster', 'rowObj', 'customerInfo', 'rootScope', 'DTOptionsBuilder', 'DTColumnBuilder'];

    function CustomerEditCtrl($scope, $uibModal, $uibModalInstance, $compile, customerMgmtService, toaster, rowObj, customerInfo, rootScope, DTOptionsBuilder, DTColumnBuilder) {

        var vm = this;
        vm.info = customerInfo;
        vm.attchInfo = {};
        //vm.levelList = [{key:0, value:'普通'}, {key:1, value:'种子'}, {key:2, value:'VIP'}, {key:3, value:'优质'}];
        vm.natureList = [{key:1, value:'生产商'}, {key:2, value:'一级代理'}, {key:3, value:'二级代理'}, {key:4, value:'国际代理'}, {key:5, value:'其他'}];
        vm.comOutputList = [{id: 10,name: '300万以下'},{id: 20,name: '300-500万'},{id: 30,name: '500-1000万'},{id: 40,name: '1000-2000万'},{id: 900,name: '2000万以上'}];
        vm.comScaleList = [{id: 10,name: '10人以下'},{id: 20,name: '10-50人'},{id: 30,name: '50-100人'},{id: 40,name: '100-200人'},{id: 900,name: '200人以上'}];
        vm.companyTypeList = [{id: 10,name: '品牌'},{id: 20,name: '批发市场'},{id: 30,name: 'OEM/ODM'},{id: 40,name: '电商供货/电商自产自销'},{id: 900,name: '独立设计师品牌'}];
        vm.sourceTypeList = [{id: 10,name: '陌生拜访'},{id: 20,name: '网络查找'},{id: 30,name: '转介绍'},{id: 40,name: '商业协会'},{id: 900,name: '其他'}];
        vm.buyerBusinessNameList = [{id: 10,name: '男装'},{id: 20,name: '女装'},{id: 30,name: '童装'},{id: 40,name: '老年装'},{id: 50,name: '孕妇装'},{id: 60,name: '婴儿服饰'},{id: 70,name: '家纺家居'},{id: 900,name: '通用'}];
        $scope.imageShowSrc = [];
        $scope.uploadImgageURL = [];

        //初始化照片URL，保存修改后的照片地址，提交时再赋值

        //店铺LOGO
        $scope.uploadImgageURL[0] = $scope.imageShowSrc[0] = vm.info.shopLogo;
        //营业执照照片
        $scope.uploadImgageURL[1] = $scope.imageShowSrc[1] = vm.info.licensePic;
        //商家名片图片
        $scope.uploadImgageURL[2] = $scope.imageShowSrc[2] = vm.info.businessCardPic;
        //门店招牌图片
        $scope.uploadImgageURL[3] = $scope.imageShowSrc[3] = vm.info.shopPic;
        //合同图片
        $scope.uploadImgageURL[4] = $scope.imageShowSrc[4] = vm.info.contractPic;
        //身份证图片
        $scope.uploadImgageURL[5] = $scope.imageShowSrc[5] = vm.info.identityCardPic;
        //手持身份证图片
        $scope.uploadImgageURL[6] = $scope.imageShowSrc[6] = vm.info.handIdentityCardPic;


        //主营产品数目
        $scope.tagNum = 0;
        $scope.tagArr = [];

        vm.compnayNameEdit = 0;

        init();

        function init() {

            if (vm.info.buyerBusinessNames === '' || vm.info.buyerBusinessNames === null) {
                vm.info.buyerBusinessNames = [];
            } else {
                vm.info.buyerBusinessNames = JSON.parse(vm.info.buyerBusinessNames);
            }

            if (vm.info.bindUserId == 0 || vm.info.companyName == ''){
                vm.compnayNameEdit = 1;
            }

            customerMgmtService.getLevelList()
                .then(function (resp) {
                    vm.levelList = resp.data.data.data;
                });

            $scope.tagNum = vm.info.tags.length;
            $scope.tagArr = vm.info.tags;

            //公司地址初始化
            customerMgmtService.getProvinceList()
                .then(function (resp) {
                    vm.comProviceList = resp.data.data.list;
                    vm.shopProviceList = resp.data.data.list;
                });

            if(vm.info.cityId > 0)
            {
                customerMgmtService.getCityList(vm.info.provinceId)
                    .then(function (resp) {
                        vm.comCityList = resp.data.data.list;
                    });
            }

            if(vm.info.districtId > 0)
            {
                customerMgmtService.getDistrictList(vm.info.cityId)
                    .then(function (resp) {
                        vm.comDistrictList = resp.data.data.list;
                    });
            }

            //店铺地址初始化
            if(vm.info.shopCityId > 0)
            {
                customerMgmtService.getCityList(vm.info.shopProvinceId)
                    .then(function (resp) {
                        vm.shopCityList = resp.data.data.list;
                    });
            }

            if(vm.info.shopDistrictId > 0)
            {
                customerMgmtService.getDistrictList(vm.info.shopCityId)
                    .then(function (resp) {
                        vm.shopDistrictList = resp.data.data.list;
                    });
            }

            //主营行业列表
            customerMgmtService.getCompanyClassList().then(function(resp){
               vm.attchInfo.companyClassList = resp.data.data.list;
            });

        }

        $scope.addTag = function($event){
            if($scope.tagNum < 8) {
                var $div = $("<div>", {class:'col-md-2 customerTagClass'});
                var $input = $("<input>", {type: 'text', style:'width:75%;', name: 'tag'});
                var $delBt = $("<button>", {type:'button', class:'close', 'aria-label':'Close'});
                $delBt.bind("click", function ($event) {
                    var curP = $($event.target);
                    var p1 = null;
                    if(curP.is('button'))
                    {
                        p1 = curP.parent();
                        p1.remove();
                    }
                    else if(curP.is('i'))
                    {
                        p1 = curP.parent().parent();
                        p1.remove();
                    }

                    $scope.tagNum--;
                });
                var $li = $("<i>", {class:'fa fa-times'});

                $delBt.append($li);
                $div.append($input);
                $div.append($delBt);

                $("#customerTagDiv").append($div);

                $scope.tagNum ++ ;
            }
        };

        $scope.delTag = function($event)
        {
            var curP = $($event.target);
            var p1  = null;

            if(curP.is('button'))
            {
                p1 = curP.parent();
                p1.remove();
            }
            else if(curP.is('i'))
            {
                p1 = curP.parent().parent();
                p1.remove();
            }

            $scope.tagNum--;
        }

        //判断主营行业是否选中
        $scope.isSelCompanyClassModel = function(modelId) {
            if(vm.info.companyClass.indexOf(modelId) > -1)
                return true;
            else
                return false;
        }

        //更新主营行业
        $scope.updateCompanyClassModel = function(modelId) {
            var index = vm.info.companyClass.indexOf(modelId);
            if(index > -1) {
                vm.info.companyClass.splice(index, 1);
            }
            else {
                vm.info.companyClass.push(modelId);
            }
        }

        // 判断买家主营是否选中

        $scope.isBusinessNameChecked = function(modelId) {
            if(vm.info.buyerBusinessNames.indexOf(modelId) > -1)
                return true;
            else
                return false;
        }

        // 更新买家主营

        $scope.updateBuyerBusinessName = function(modelId) {
            var index = vm.info.buyerBusinessNames.indexOf(modelId);
            if(index > -1) {
                vm.info.buyerBusinessNames.splice(index, 1);
            }
            else {
                vm.info.buyerBusinessNames.push(modelId);
            }
        }


        $scope.comProviceChange = function(proviceId)
        {
            customerMgmtService.getCityList(proviceId)
                .then(function (resp) {
                    vm.comCityList = resp.data.data.list;
                });

            vm.info.cityId = 0;
            vm.comDistrictList = [];
            vm.info.district = 0;
        }

        $scope.comCityChange = function(cityId)
        {
            customerMgmtService.getDistrictList(cityId)
                .then(function (resp) {
                    vm.comDistrictList = resp.data.data.list;
                });

            vm.info.district = 0;
        }

        $scope.shopProviceChange = function(proviceId)
        {
            customerMgmtService.getCityList(proviceId)
                .then(function (resp) {
                    vm.shopCityList = resp.data.data.list;
                });

            vm.info.shopCityId = 0;
            vm.shopDistrictList = [];
            vm.info.shopDistrict = 0;
        }

        $scope.shopCityChange = function(cityId)
        {
            customerMgmtService.getDistrictList(cityId)
                .then(function (resp) {
                    vm.shopDistrictList = resp.data.data.list;
                });

            vm.info.shopDistrict = 0;
        }


        //上传图片方法1
        $scope.getFile = function (myFile, myScope, num) {

            customerMgmtService.readAsDataURLTest(myFile, myScope)
                .then(function(result) {
                    myScope.imageShowSrc[num] = result;
                });
        };

        //上传图片方法2
        $scope.postMultipart = function(file, num)
        {
            customerMgmtService.postMultipartService(file, "general")
                .then(function(resp){
                    if(resp.data.code == 200)
                    {
                        //保存修改后的身份照片URL，保存时再赋值给contactInfo.identityPic
                        $scope.uploadImgageURL[num] = resp.data.data.path;
                    }
                });
        }

        $scope.submit = function () {
            // 验证客户来源选择其他,必填其他内容
            if (vm.info.sourceType == 900 && (vm.info.sourceTypeOther == null || vm.info.sourceTypeOther == '')) {
                toaster.pop({
                    type: 'error' ,
                    title: '提示信息',
                    body: '其他客户来源不能为空',
                    showCloseButton: true,
                    timeout: 5000
                });
                return;
            }

            //客户标签
            var tagArr = [];
            var tagInputs = $("input[name='tag']");

            if(tagInputs != null && tagInputs != undefined)
            {
                if( tagInputs.length > 0)
                {
                    for(var x = 0; x <  tagInputs.length; x++)
                    {
                        var $tag = $(tagInputs[x]);
                        var val = $tag.val();
                        if(val != null && val != "")
                        {
                            tagArr.push(val);
                        }
                    }
                }

            }
            vm.info.tags = tagArr;

            var buyerBusinessNamesContent = '';

            vm.info.buyerBusinessNames.forEach(function(item,index) {
                vm.buyerBusinessNameList.forEach(function(item2,index2) {
                    if(vm.buyerBusinessNameList[index2].id === item) {
                        buyerBusinessNamesContent += vm.buyerBusinessNameList[index2].name;
                    }
                });
            });

            //买家主营字段
            vm.info.buyerBusinessNamesContent = buyerBusinessNamesContent;
            //店铺LOGO
            vm.info.shopLogo = $scope.uploadImgageURL[0];
            //营业执照照片
            vm.info.licensePic = $scope.uploadImgageURL[1];
            //商家名片图片
            vm.info.businessCardPic = $scope.uploadImgageURL[2];
            //门店招牌图片
            vm.info.shopPic =  $scope.uploadImgageURL[3];
            //合同图片
            vm.info.contractPic = $scope.uploadImgageURL[4];
            //身份证图片
            vm.info.identityCardPic = $scope.uploadImgageURL[5];
            //手持身份证图片
            vm.info.handIdentityCardPic = $scope.uploadImgageURL[6];

            if(vm.info.companyRegDate!=undefined){
                vm.info.companyRegDate = moment(vm.info.companyRegDate,"YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD HH:mm:ss");
            }

            var customerInfo = JSON.stringify(vm.info);
            customerMgmtService.editCustomer(rowObj.id, customerInfo)
                .then(function (resp) {
                    if(resp.data.code == 200 )
                    {
                        toaster.pop({
                            type: 'success' ,
                            title: '提示信息',
                            body: '修改成功！',
                            showCloseButton: true,
                            timeout: 5000
                        });

                        $uibModalInstance.close();
                    }
                });

        }

        $scope.cancel = function () {
            $uibModalInstance.close();
        }

    }

    angular
        .module('app.customer-mgmt')
        .controller('CustomerEditCtrl', CustomerEditCtrl);

    angular
        .module('app.customer-mgmt').directive('fileModel', ['$parse', function ($parse) {
            return {
                restrict: 'A',
                link: function(scope, element, attrs, ngModel) {
                    var model = $parse(attrs.fileModel);
                    var modelSetter = model.assign;
                    element.bind('change', function(event){
                        scope.$apply(function(){
                            modelSetter(scope, element[0].files[0]);
                        });
                        var num = $(element).attr("num");
                        //附件预览
                        scope.file = (event.srcElement || event.target).files[0];
                        scope.getFile(scope.file, scope, num);
                        scope.postMultipart(scope.file, num);
                    });
                }
            };
        }]);

})();