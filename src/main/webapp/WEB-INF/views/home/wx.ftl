<#assign title="登录">
<#assign location="login">
<#assign url =((url)) >

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

<div style="margin-left:45%; margin-top:10%;text-align: center;width:100px">
  <a href="${url}">
    <img src="./assets/pages/img/wechat.png" style="height:80px"/>
    <p style="font-size:20px;color:#fff">微信登陆</p>
  </a>
</div>
<!-- END LOGIN -->
</@p.layout>