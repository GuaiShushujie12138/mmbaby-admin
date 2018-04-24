<#assign title="强制修改密码">
<#assign location="changepassword">
<#assign isShowNavBar=false>


<#assign headerBlock=''>


<#assign extraLoadCssPlugin=[
'/assets/global/plugins/cubeportfolio/css/cubeportfolio.css'
]>

<#assign extraLoadCss=[

'assets/pages/css/portfolio.min.css'
]>

<#assign extraLoadJS=[
'assets/pages/scripts/portfolio-1.min.js',
'assets/pages/scripts/ui-extended-modals.js'
]>
<#assign extraLoadJSPlugin=[
'/assets/global/plugins/cubeportfolio/js/jquery.cubeportfolio.min.js',
'/assets/global/plugins/jquery-validation/js/jquery.validate.min.js'
]>

<#include "../lib/lib.ftl">
<@p.layout context=getContext()>
    <#assign BASEPATH=context.staticUrl>


<!-- BEGIN PAGE BAR -->
<div class="page-bar">
    <ul class="page-breadcrumb">

        <li>
            <i class="fa fa-circle"></i>
            <span>为了您的帐号安全,请经常修改您的登录密码</span>
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
            <span class="caption-subject font-green-sharp sbold">修改密码</span>
        </div>
    </div>
    <div class="portlet-body">
        <form class="change-password-form" id="change-password-form" action="/web/user/change-password.do"
              method="post">
            <input type="hidden" value="${mobile!""}" name="mobile"/>
            <input type="hidden" value="${loginUrl!"/"}" name="loginUrl"/>
            <div class="form-group">
                <label class="control-label">当前密码</label>

                <div class="input-icon">
                    <i class="fa fa-unlock-alt"></i>
                    <input type="password" class="form-control" name="currentPassword" autocomplete="off"/>
                </div>
            </div>
            <div class="form-group">
                <label class="control-label">新密码</label>

                <div class="input-icon">
                    <i class="fa fa-user-secret"></i>
                    <input type="password" class="form-control" name="newPassword1" id="newPassword1"
                           autocomplete="off"/>
                </div>
            </div>
            <div class="form-group">
                <label class="control-label">确认新密码</label>

                <div class="input-icon">
                    <i class="fa fa-user-secret"></i>
                    <input type="password" class="form-control" name="newPassword2" autocomplete="off"/>
                </div>
            </div>

            <div class="form-actions">
                <div class="row">
                    <div class="col-md-offset-5 col-md-4">
                        <a href="/login.xhtml" class="btn btn-outline dark">返回登录页</a>
                        <button type="submit" class="btn green">确认修改密码</button>

                    </div>
                </div>
            </div>
        </form>
    </div>
</div>

</@p.layout>