/*******************************************************
 * 名称：可拖动 ng-drag
 * 描述：将制定元素设置成可拖动组件
 *******************************************************/
(function () {
    'use strict';
    //本地数据名称
    var LOCAL = "imgzoom";

    /**
     * 名称：UI组件模板构造函数
     */
    function ImageZoomUIClass(options) {
        this.options  = $.extend({},this.defaultOptions,options);
        this.loadUIParams();
        this.loadUIEvents();
        this.loadUIContent();
        this.loadUIHandlers();
    }

    //元素操作框架
    var $ = window.jQuery;

    //默认配置参数
    ImageZoomUIClass.prototype.defaultOptions = {
        areaWidth: 350,//放大区域显示宽度
        areaHeight: 350,//放大区域显示高度
        imageUrls: null,//图片列表 例如:[{src:'',zoom:''}]
        target: null,//原始图片元素
        rate: 3,//默认截屏元素缩小倍数
        zoomSize: null, //放大镜的宽高,如果使用rate则使用rate根据small图片的宽高按照比例换算
        viewportAuto:false//是否控制viewport位置
    };

    //移动放大镜的宽高数据
    ImageZoomUIClass.prototype.loupeRect = {width: 0, height: 0};

    //移动放大镜能移动的范围坐标
    ImageZoomUIClass.prototype.rangeRect = {left: 0, top: 0, right: 0, bottom: 0};


    /**
     * 名称：加载UI组件事件类型  在initialize->initComponents中被调用
     */
    ImageZoomUIClass.prototype.loadUIEvents = function () {
        //this.registerEvents('created', 'open', 'close', 'resize');
    }

    /**
     * 名称：渲染UI组件参数 在initialize->initComponents中被调用
     */
    ImageZoomUIClass.prototype.loadUIParams = function () {
        this.$target = $(this.options.target);
    }

    /**
     * 名称：加载UI组件内容，并且返回内容容器  在initialize->initComponents中被调用
     */
    ImageZoomUIClass.prototype.loadUIContent = function () {
        var htmlContents = [
            '<div class="image-zoom zoom-disabled">',
            '   <div class="image-zoom-viewport">',
            '       <div class="image-zoom-area">',
            '           <img src="" class="big-img" />',
            '       </div>',
            '   </div>',
            '   <div class="image-zoom-small">',
            '       <div class="zoom-loupe"></div>',
            '   </div>',
            '</div>'
        ];
        var container = $(htmlContents.join('\n'));
        container.appendTo(this.$target);
        this.$container = container;
        this.$target.addClass("image-zoom-origin");
        this.initZoomUrls();

        this.$container.find(".image-zoom-viewport").css({
            width: this.options.areaWidth,
            height: this.options.areaHeight
        });
    }

    /**
     * 通过配置生成data-zoom项
     */
    ImageZoomUIClass.prototype.initZoomUrls = function (clear) {
        var imageUrls = this.options.imageUrls;
        var htmls = [];
        if(clear){
            this.$container.find(".small-img").remove();
        }
        if (Object.prototype.toString.apply(imageUrls)=="[object Array]"){
            var imgItem = null;
            for (var i = 0, k = imageUrls.length; i < k; i++) {
                imgItem = imageUrls[i];
                htmls.push('<img class="small-img" src="' + imgItem.src + '" data-zoom="' + imgItem.zoom + '" />');
            }
        }
        //将原有的html data-zoom img元素添加到缩放容器中去
        this.$target.find("img[data-zoom]").addClass("small-img").appendTo(this.$container.find(".image-zoom-small"));
        //将设置的imageUrls添加small区域
        this.$container.find(".image-zoom-small").append(htmls.join('\n'));
        //默认激活第一张图片
        this.$container.find("[data-zoom]:eq(0)").addClass("active");
    }

    /**
     * 名称：绑定UI组件事件  在initialize->initComponents中被调用
     */
    ImageZoomUIClass.prototype.loadUIHandlers = function () {
        this.$container.on('mouseenter.image-zoom', '.image-zoom-small', this.bind(this.startZoom));
        this.$container.on('mousemove.image-zoom', '.image-zoom-small', this.bind(this.zooming));
        this.$container.on('mouseout.image-zoom', '.image-zoom-small', this.bind(this.endZoom));
    }

    /**
     * dcall  use self
     */
    ImageZoomUIClass.prototype.bind  =function(handler,paras){
        var context=  this;
        return function(){
            var args = Array.prototype.slice.apply(arguments);
            args.push(paras);
           return  handler.apply(context,args);
        }
    }

    /**
     * 名称：加载UI是否有启动操作,并且设置UI组件启动操作  在initialize->initComponents中被调用
     */
    ImageZoomUIClass.prototype.startupUI = function (ev) {
        this.$target.data(LOCAL, this);
        this.$container.data(LOCAL, this);
    }

    /**
     * 拖动视角开始进行图片放大
     */
    ImageZoomUIClass.prototype.startZoom = function (ev) {
        var $container = this.$container;
        var $img = $container.find(".active");
        var $big = $container.find(".big-img");
        $big.attr("src", $img.data('zoom'));
        this.sync($img);
        this.ensure($img, $big);
        $container.removeClass("zoom-disabled");
    }


    /**
     * 拖动视角图片放大中
     */
    ImageZoomUIClass.prototype.zooming = function (ev) {
        var range = this.rangeRect;
        var point = this.getCoords(ev);
        var $container = this.$container;
        var $loupe = $container.find(".zoom-loupe");
        var $viewport = $container.find(".big-img");
        var zoomPoint = {
            left: -(point.left - range.left) * this.widthRate,
            top: -(point.top - range.top) * this.heightRate
        };
        $loupe.css(point);
        $viewport.css(zoomPoint);
    }

    /**
     * 拖动视角图片放大结束
     */
    ImageZoomUIClass.prototype.endZoom = function (ev) {
        if (this.mouseTriggerOfChild(ev) || $(ev.toElement || ev.relatedTarget).is(".zoom-loupe")) {
            return;
        }
        this.$container.addClass("zoom-disabled");
    }

    /**
     * 名称：判断在触发mouseover 与mouseout时，是不是由子元素导致
     */
    ImageZoomUIClass.prototype.mouseTriggerOfChild = function (ev) {
        var type = ev.type;
        var related = null;
        var currentTarget = ev.currentTarget;
        switch (type) {
            case 'mouseover':
                related = ev.fromElement || ev.relatedTarget;
                break;
            case 'mouseout':
                related = ev.toElement || ev.relatedTarget;
                break;
            default:
                break;
        }
        return this.isChild(related,currentTarget);
    }

    /**
     * 名称:判断指定元素是否为目标元素的子元素
     * @param child 子元素
     * @param parent 可能的父元素
     */
    ImageZoomUIClass.prototype.isChild = function(child,parent){
        if (parent.contains) {
            return parent.contains(child);
        } else if (parent.compareDocumentPosition) {
            return parent.compareDocumentPosition(child) == 20;
        }
    }

    /**
     * 获取坐标
     */
    ImageZoomUIClass.prototype.getCoords = function (ev) {
        var offset = this.$container.offset();
        var rangeRect = this.rangeRect;
        var loupeRect = this.loupeRect;
        var x = ev.pageX - offset.left;
        var y = ev.pageY - offset.top;
        var vx = (x - (loupeRect.width / 2));
        var vy = (y - (loupeRect.height / 2));
        if (vx < rangeRect.left) {
            vx = rangeRect.left;
        } else if (vx > rangeRect.right) {
            vx = rangeRect.right;
        }
        if (vy < rangeRect.top) {
            vy = rangeRect.top;
        } else if (vy > rangeRect.bottom) {
            vy = rangeRect.bottom;
        }
        return {left: vx, top: vy};
    }

    /**
     * 同步尺寸与 配置
     */
    ImageZoomUIClass.prototype.sync = function ($img) {
        var $container = this.$container;
        var $small = $container.find(".image-zoom-small");
        var offset = $img.offset();
        var offsetParent = $img.offsetParent().offset();
        var diffX = (offset.left - offsetParent.left);
        var diffY = (offset.top - offsetParent.top);
        var size = this.getZoomSize($img);
        this.loupeRect = {width: size, height: size};
        this.rangeRect = {
            left: diffX,
            top: diffY,
            right: $small.width() - this.loupeRect.width - diffX,
            bottom: $small.height() - this.loupeRect.height - diffY
        };
        $container.find(".zoom-loupe").css(this.loupeRect);
        if(this.options.viewportAuto){
            $container.find(".image-zoom-viewport").css({'left': $small.width()});
        }
    }

    /**
     * 获取放大镜的宽高
     */
    ImageZoomUIClass.prototype.getZoomSize = function ($img) {
        var width = $img.width();
        var height = $img.height();
        var options = this.options;
        var size = options.zoomSize;
        if (!size) {
            size = Math.max(width, height) / (options.rate || 2);
        }
        return size;
    }

    /**
     * 渲染大图尺寸,以及确定放大位置比例
     */
    ImageZoomUIClass.prototype.ensure = function ($img, $big) {
        var options = this.options;
        var loupeRect = this.loupeRect;
        this.widthRate = (options.areaWidth / loupeRect.width);
        this.heightRate = (options.areaHeight / loupeRect.height);
        $big.css({width: $img.width() * this.widthRate, height: $img.height() * this.heightRate});
    }

    /**
     * 名称：强制销毁组件
     */
    ImageZoomUIClass.prototype.destroy = function () {
        this.defaultDestroy();
        this.$container.remove();
        this.$target = this.$container = null;
    };

    /***
     * angular-js ng-image-zoom
     */
    (function(){
        angular.module("ng-image-zoom", [])
            .directive('ngZoom', ['$rootScope','$parse',function ($rootScope, $parse,$dragger){
                return {
                    restrict: 'A',
                    link: function ($scope, element, attrs) {
                        var options = {target:element,imgUrls:$scope[attrs.ngZoom]};
                        var zoom = new ImageZoomUIClass($.extend({},attrs,options));
                        var release =$scope.$watch(attrs.ngZoom,function(newImgUrls){
                            zoom.options.imageUrls = newImgUrls;
                            zoom.initZoomUrls(true);
                        });
                        $scope.$on('$destroy',function() {
                            release();
                            release = null;
                        })
                    }
                }
            }]);
    }());
}());

