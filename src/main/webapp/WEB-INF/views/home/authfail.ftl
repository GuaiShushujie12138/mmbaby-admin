<#assign title="授权失败">
<#assign location="authfail">
<#assign isShowNavBar=false>


<#assign headerBlock=''>
<#if ((redirectUrl!'')!='')>
    <#assign headerBlock= '<meta http-equiv=refresh content="5;url=${redirectUrl}">'>
</#if>


<#assign extraLoadCssPlugin=[
'/assets/global/plugins/cubeportfolio/css/cubeportfolio.css'
]>

<#assign extraLoadCss=[

'assets/pages/css/portfolio.min.css'
]>

<#assign extraLoadJS=[
'assets/pages/scripts/portfolio-1.min.js'
]>
<#assign extraLoadJSPlugin=[
'/assets/global/plugins/cubeportfolio/js/jquery.cubeportfolio.min.js'
]>

<#include "../lib/lib.ftl">
<@p.layout context=getContext()>
    <#assign BASEPATH=context.staticUrl>


<!-- BEGIN PAGE BAR -->
<div class="page-bar">
    <ul class="page-breadcrumb">

        <li>
            <i class="fa fa-circle"></i>
            <span>链尚网单点登录系统-授权失败</span>
        </li>
    </ul>
</div>
<!-- END PAGE BAR -->
<h3 class="page-title">
</h3>
<!-- END PAGE HEADER-->
<div class="portlet light bordered">
    <div class="portlet-title">
        <div class="caption">
            <i class="icon-bubble font-green-sharp"></i>
            <span class="caption-subject font-green-sharp sbold">很抱歉，出错了！</span>
        </div>
    </div>
    <div class="portlet-body">
        <div class="note note-danger ">
            <p>
                错误信息: ${errorMsg!"空"}
            </p>

            <p>
                错误码：invalid_request
            </p>

        </div>
        <#if ((redirectUrl!'')!='')>
            <p>
                网页将会跳转到${redirectUrlTitle!''}页面,请稍候...
            </p>

            <p>
                如果您的浏览器没有自动跳转,请<a href="${redirectUrl}">点击这里</a>
            </p>
        </#if>

    </div>
</div>

</@p.layout>