/**
 * INSPINIA - Responsive Admin Theme
 * 2.3
 *
 * Custom scripts
 */

$(document).ready(function () {

    // Append config box / Only for demo purpose
    //$.get("views/skin-config.html", function (data) {
    //    $('body').append(data);
    //});

    // Full height of sidebar
    function fix_height() {
        var heightWithoutNavbar = $("body > #wrapper").height() - 61;
        $(".sidebard-panel").css("min-height", heightWithoutNavbar + "px");

        var navbarHeigh = $('nav.navbar-default').height();
        var wrapperHeigh = $('#page-wrapper').height();

        if(navbarHeigh > wrapperHeigh){
            $('#page-wrapper').css("min-height", navbarHeigh + "px");
        }

        if(navbarHeigh < wrapperHeigh){
            $('#page-wrapper').css("min-height", $(window).height()  + "px");
        }

        if ($('body').hasClass('fixed-nav')) {
            $('#page-wrapper').css("min-height", $(window).height() - 60 + "px");
        }
    }




    $(window).bind("load resize scroll", function() {
        if(!$("body").hasClass('body-small')) {
            fix_height();
        }
    });

    // Move right sidebar top after scroll
    $(window).scroll(function(){
        if ($(window).scrollTop() > 0 && !$('body').hasClass('fixed-nav') ) {
            $('#right-sidebar').addClass('sidebar-top');
        } else {
            $('#right-sidebar').removeClass('sidebar-top');
        }
    });


    setTimeout(function(){
        fix_height();
    })


    $("body").on("click","div a.chevron-up",function(event) {
        var ele=$(this);

        var ibox = ele.closest('div.ibox');
        var icon = ele.find('i:first');
        var content = ibox.find('div.ibox-content');
        content.slideToggle(200);
        // Toggle icon from up to down
        icon.toggleClass('fa-chevron-up').toggleClass('fa-chevron-down');
        ibox.toggleClass('').toggleClass('border-bottom');
        window.setTimeout(function () {
            ibox.resize();
            ibox.find('[id^=map-]').resize();
        }, 50);
    });

    $("body").on("click","i.icon-op",function(event){
        var target = $(this);
        var formItem = target.parent().find("[data-op]");
        var colmnType = formItem.attr("data-columntype");
        var op = formItem.attr("data-op");
        var opCls = 'op-' + opCls;
        var currents = getOpTypes(colmnType);
        var index = (currents.indexOf(op) || 0);
        index++;
        op = currents[index] || currents[0];
        formItem.attr("data-op", op);
        target.attr("class", "icon-op op-" + op);
    });



    //字段匹配模式
    var ops = {
        'number': ['equal', 'greaterorequal', 'lessorequal'],
        'string': ['equal', 'like']
    }


    function getOpTypes(type) {
        if(type=='number'){
            return ops.number;
        }else{
            return ops.string;
        }
    }







});

// Minimalize menu when screen is less than 768px
$(function() {
    $(window).bind("load resize", function() {
        if ($(this).width() < 769) {
            $('body').addClass('body-small')
        } else {
            $('body').removeClass('body-small')
        }
    })


});
