/**
 *  名称：datatables 头部固定指令
 *  日期：2017-02-07
 *  描述：
 *       <table scrollfixed></table>
 *       注意一个页面只使用一个
 */
(function () {
    'use strict';

    var DATA = "__fixedcolumn";

    /**
     * 指令工厂函数
     */
    function dataTablesFixedHeader($rootScope, $timeout) {
        return {
            restrict: 'A',
            link: function (scope, $element, attrs) {
                var $scrollX = getScrollTop($element[0], 'overflowX');
                var paddingLeft = 0;
                if ($scrollX) {
                    $scrollX.scroll(bind(onHorizonScrolling, $element));
                    paddingLeft = $element.offset().left - $scrollX.offset().left;
                }
                $(window).scroll(bind(onVerticalScrolling, $element, $scrollX, paddingLeft));
            }
        };
    }

    /**
     * 绑定事件回调
     * @param handler
     * @param paras
     * @returns {Function}
     */
    function bind(handler, paras) {
        var argv = Array.prototype.slice.call(arguments, 1);
        return function () {
            var args = Array.prototype.slice.apply(arguments);
            args.push.apply(args, argv);
            handler.apply(this, args)
        }
    }

    /**
     * 滚动条滚动事件
     * @param ev  事件上下文
     * @param $element datatables对应的元素
     * @param $scrollX 父容器水平滚动元素
     */
    function onVerticalScrolling(ev, $element, $scrollX, paddingLeft) {
        var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        var offset = $element.offset();
        var elementTop = offset.top;
        if (scrollTop >= elementTop) {
            showFixedColumn($element, $scrollX, offset, paddingLeft);
        } else {
            cancelFixedColumn($element);
        }
    }

    /**
     * 水平滚动
     */
    function onHorizonScrolling(ev, $element) {
        var $fixed = $element.data(DATA);
        if ($fixed) {
            $fixed.scrollLeft((ev.target.scrollLeft));
        }
    }

    /**
     * 显示固定列头
     */
    function showFixedColumn($element, $scrollX, offset, paddingLeft) {
        var $fixed = $element.data(DATA);
        if (!$fixed) {
            var $tableColumn = $($element[0].outerHTML);
            var hasScrollX = $scrollX != null;
            var scrollLeft = hasScrollX ? $scrollX[0].scrollLeft : 0;
            var $tds = $element.find("thead th");
            var $columns = $tableColumn.find("thead th");
            var totalWidth = 0;
            var fixedCss = {
                top: 0,
                left: hasScrollX ? $scrollX.offset().left : offset.left,
                width: hasScrollX ? $scrollX.width() : $element.width(),
                paddingLeft: paddingLeft
            };
            $tds.each(function (i) {
                var $this = $(this);
                totalWidth = this.offsetWidth + totalWidth;
                var width = $this.width();
                $this.data('__origin__css',this.style.cssText);
                $columns.eq(i).css("width",width + 'px');
                $this.css('width',width+'px');
            });
            $element.css("table-layout","fixed");
            $fixed = $("<div></div>");
            $fixed.append($tableColumn);
            $fixed.addClass("datatables-fixed");
            $fixed.css(fixedCss);
            $tableColumn.find("tbody").remove();
            $fixed.appendTo(document.body);
            $fixed.scrollLeft(scrollLeft);
            $element.css("width",totalWidth);
            $element.data(DATA, $fixed);
        }
    }

    /**
     * 取消固定列头
     */
    function cancelFixedColumn($element) {
        var $fixed = $element.data(DATA);
        if ($fixed) {
            $fixed.hide();
            $fixed.remove();
            $element.data(DATA, null);
            var $tds = $element.find("thead th");
            $tds.each(function (i) {
                this.style.cssText = $(this).data('__origin__css');
            });
        }
    }

    function getScrollTop(element, direct) {
        var parent = element.parentElement;
        var scrollParent = null, overflow = "";
        while (parent) {
            overflow = $(parent).css(direct);
            if (overflow == "auto" || overflow == "scroll" || (parent === document.documentElement && overflow === 'visible')) {
                scrollParent = parent;
                break;
            }
            parent = parent.parentElement;
        }
        return scrollParent ? $(scrollParent) : null;
    }

    //注册指令
    angular
        .module('app')
        .directive('scrollfixed', dataTablesFixedHeader);

})();

