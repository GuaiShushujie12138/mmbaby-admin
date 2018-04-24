<#assign title="登录">
<#assign location="login">

<#assign extraLoadCssPlugin=[
'/assets/global/plugins/select2/css/select2.min.css',
'/assets/global/plugins/select2/css/select2-bootstrap.min.css'
]>
<#assign extraLoadCss=[

'/assets/pages/css/login-4.css'
]>

<#assign extraLoadJS=[
'/assets/pages/scripts/login-4.js'
]>
<#assign extraLoadJSPlugin=[
'/assets/global/plugins/jquery-validation/js/jquery.validate.min.js',
'/assets/global/plugins/jquery-validation/js/additional-methods.min.js',
'/assets/global/plugins/select2/js/select2.full.min.js',
'/assets/global/plugins/backstretch/jquery.backstretch.min.js'
]>

<#include "../lib/lib.ftl">
<@p.layout context=getContext()>
<!-- BEGIN LOGO -->
<div class="logo">
    <a href="index.html">
        <img src="./assets/pages/img/logo-big.png" alt=""/> </a>
</div>
<!-- END LOGO -->
<!-- BEGIN LOGIN -->
<div class="content">
    <!-- BEGIN LOGIN FORM -->
    <form class="login-form" action="/web/user/admin-do-login.do" method="post" id="login-form">
        <h3 class="form-title">Login to your account</h3>

        <div class="alert alert-danger display-hide">
            <button class="close" data-close="alert"></button>
                <span>
                    用户名、密码和验证码必须填写! </span>
        </div>
        <div class="form-group">
            <!--ie8, ie9 does not support html5 placeholder, so we just show field title for that-->
            <label class="control-label visible-ie8 visible-ie9">Username</label>

            <div class="input-icon">
                <i class="fa fa-user"></i>
                <input class="form-control placeholder-no-fix" type="text" autocomplete="off"
                       placeholder="用户名" name="username"/>
            </div>
        </div>
        <div class="form-group">
            <label class="control-label visible-ie8 visible-ie9">Password</label>

            <div class="input-icon">
                <i class="fa fa-lock"></i>
                <input class="form-control placeholder-no-fix" type="password" autocomplete="off" placeholder="密码" name="password"/>
            </div>
        </div>

        <#--<div class="form-group">-->
            <#--<div class="row">-->
                <#--<div class="col-md-9">-->
                    <#--<label class="control-label visible-ie8 visible-ie9">验证码</label>-->
                    <#--<div class="input-icon">-->
                        <#--<i class="fa fa-lock"></i>-->
                        <#--<input class="form-control placeholder-no-fix" type="text" autocomplete="off" placeholder="验证码" name="validatecode"/>-->
                    <#--</div>-->
                <#--</div>-->
                <#--<div class="col-md-3">-->
                    <#--<button type="button" data-timeout="120" class="btn red pull-right" id="btn_send">-->
                        <#--发送短信-->
                    <#--</button>-->
                <#--</div>-->
            <#--</div>-->
        <#--</div>-->
        <div class="form-actions">

            <button type="submit" class="btn blue pull-right" id="btn_login">
                登录 <i class="m-icon-swapright m-icon-white"></i>
            </button>
        </div>
    </form>
    <!-- END LOGIN FORM -->
</div>
<!-- END LOGIN -->
</@p.layout>