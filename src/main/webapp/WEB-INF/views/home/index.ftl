<!DOCTYPE html>
<html ng-app="app">

<head>
<#assign user=((data.data.user)!{})>
<#assign loginUrl=((data.data.loginUrl)!'/')>
<#assign appName=((data.data.appName)!'')>
<#assign authButtonList=((data.data.authButtonList)!'')>
<#assign clientVersion=((data.data.clientVersion)!'')>
<#assign isOnlineEnv=((data.data.isOnlineEnv)!false)>
<#assign staticFileSuffix=((data.data.staticFileSuffix)!'')>
<#assign hasBindCardPermission=((data.data.hasBindCardPermission)!false)>

  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
  <!-- Page title set in pageTitle directive -->
  <title page-title></title>

  <!-- Bootstrap -->
  <link href="css/bootstrap.min.css?v=${clientVersion}" rel="stylesheet">

  <!-- Font awesome -->
  <link href="//cdn.bootcss.com/font-awesome/4.5.0/css/font-awesome.min.css?v=${clientVersion}" rel="stylesheet">

  <!-- Toastr style -->
  <link href="css/plugins/toastr/toastr.min.css?v=${clientVersion}" rel="stylesheet">
  <link href="css/plugins/iCheck/custom.css?v=${clientVersion}" rel="stylesheet">


  <!-- Main Inspinia CSS files -->
  <link href="css/animate.css?v=${clientVersion}" rel="stylesheet">
  <link href="css/plugins/chosen/chosen.css?v=${clientVersion}" rel="stylesheet">
  <link href="css/plugins/datapicker/angular-datapicker.css?v=${clientVersion}" rel="stylesheet">
  <link href="css/plugins/daterangepicker/daterangepicker-bs3.css?v=${clientVersion}" rel="stylesheet">

  <link id="loadBefore" href="css/style.css?v=${clientVersion}" rel="stylesheet">

  <!-- Data Tables -->
  <link href="css/plugins/dataTables/dataTables.bootstrap.css?v=${clientVersion}" rel="stylesheet">
  <link href="css/plugins/dataTables/dataTables.responsive.css?v=${clientVersion}" rel="stylesheet">
 <#--<link href="css/plugins/dataTables/dataTables.tableTools.min.css?v=${clientVersion}" rel="stylesheet">-->
 <#--<link href="css/plugins/dataTables/dataTables.fixedColumns.css?v=${clientVersion}" rel="stylesheet">-->


  <!-- Admin Related CSS files -->
  <link href="css/sites/common.css?v=${clientVersion}" rel="stylesheet">
<#--<link href="css/sites/navigation.css" rel="stylesheet">-->
  <link href="css/sites/user.css?v=${clientVersion}" rel="stylesheet">
  <link rel="shortcut icon" href="/favicon.ico"/>
  <script src="js/bj-report/bj-report-tryjs.min.js"></script>
  <#-- badjs配置 -->
<script type="text/javascript">
    var __reportUrl__ = "";
    <#if isOnlineEnv>
      __reportUrl__ = '//badjs.lianshang.com/badjs';
    <#else >
      __reportUrl__ = 'http://10.21.11.152:9005/badjs';
    </#if>
      BJ_REPORT.init({
          //上报 id, 不指定 id 将不上报
          id: 17,
          // 指定用户 id
          uin: 1,
          // combo 是否合并上报， 0 关闭， 1 启动（默认）
          combo: 0,
          // 当 combo 为 true 可用，延迟多少毫秒，合并缓冲区中的上报（默认）
          delay: 1000,
          // 指定上报地址
          url: __reportUrl__,
          // 忽略某个错误
          //ignore: [/Script error/i],
          // 抽样上报，1~0 之间数值，1为100%上报（默认 1）
          random: 1,
          // 重复上报次数(对于同一个错误超过多少次不上报)  避免出现单个用户同一错误上报过多的情况
          repeat: 3
          // 扩展属性，后端做扩展处理属性。例如：存在 msid 就会分发到 monitor
          //ext: {}
      });
      //绑定所有异常场景 例如 SpyJquery , SpyModule , SpySystem
      BJ_REPORT.tryJs().spyAll();
  </script>
  <script src="js/jquery/jquery-2.1.1.min.js?v=${clientVersion}"></script>
</head>

<!-- ControllerAs syntax -->
<!-- Main controller with serveral data used in Inspinia theme on diferent view -->
<body class="{{$state.current.data.specialClass}} mini-navbar" landing-scrollspy id="page-top">

<!-- Toaster Container -->
<toaster-container toaster-options="{'animation-class': 'slideDown'}"></toaster-container>

<!-- Main view  -->
<div ui-view></div>

<!-- jQuery and Bootstrap -->

<script src="js/plugins/jquery-ui/jquery-ui.js?v=${clientVersion}"></script>
<script src="js/bootstrap/bootstrap.min.js?v=${clientVersion}"></script>

<!-- MetsiMenu -->
<script src="js/plugins/metisMenu/jquery.metisMenu.js?v=${clientVersion}"></script>

<!-- SlimScroll -->
<script src="js/plugins/slimscroll/jquery.slimscroll.min.js?v=${clientVersion}"></script>
<script src='http://localhost:8000/CLodopfuncs.js'></script>


<!-- Peace JS -->
<script src="js/plugins/pace/pace.min.js?v=${clientVersion}"></script>

<!-- Custom and plugin javascript -->

<script type="text/javascript">

  window.LG = {};
  LG.me = {
    "userName": "${user.realName!""}",
    "trueName": "${user.realName!""}",
    "fullDepartName": "${user.fullDepartName!""}",
    "userId": "${user.userId!0}",
    "roleName": "${user.roleName!""}",
    "usertoken": "${user.token!""}",
    "hasBindCardPermission": "${hasBindCardPermission?string('yes','no')}"
  };
  LG.authButtonList =${authButtonList};
  LG.appConfig = {
    "loginUrl": "${loginUrl}",
    "appName": "${appName}",
    "clientVersion": "${clientVersion}",
    "clientVersion": "${clientVersion}",
    "staticFileSuffix": "${staticFileSuffix}"
  };


</script>
<!-- Custom and plugin javascript -->
<#if isOnlineEnv>
<script type="application/javascript" src="/dist/script/crm-admin-utils${staticFileSuffix}.js?v=${clientVersion}"></script>
<script type="application/javascript" src="/app/lazyLoadConfig.release.js?v=${clientVersion}"></script>
<#else>
<script src="js/admin.js?v=${clientVersion}"></script>
<script src="js/utils.js?v=${clientVersion}"></script>
<script src="js/enum.js?v=${clientVersion}"></script>
<script src="js/queryBuilder.js?v=${clientVersion}"></script>
<script src="app/formatter.js?v=${clientVersion}"></script>
<script type="application/javascript" src="/app/lazyLoadConfig.dev.js?v=${clientVersion}"></script>
</#if>

<!-- Main Angular scripts-->
<script src="js/angular/angular.js?v=${clientVersion}"></script>
<script src="js/angular/angular-cookies.js?v=${clientVersion}"></script>
<script src="js/angular/angular-sanitize.min.js?v=${clientVersion}"></script>
<script src="js/angular/i18n/angular-locale_zh-cn.js?v=${clientVersion}"></script>
<script src="js/plugins/oclazyload/dist/ocLazyLoad.min.js?v=${clientVersion}"></script>
<script src="js/angular-translate/angular-translate.min.js?v=${clientVersion}"></script>
<script src="js/ui-router/angular-ui-router.min.js?v=${clientVersion}"></script>
<script src="js/bootstrap/ui-bootstrap-tpls-1.1.2.min.js?v=${clientVersion}"></script>
<script src="js/plugins/angular-idle/angular-idle.js?v=${clientVersion}"></script>

<script src="js/angular/checklist-model.js?v=${clientVersion}"></script>


<!-- Data Tables -->
<script src="js/plugins/dataTables/jquery.dataTables.js?v=${clientVersion}"></script>
<script src="js/plugins/dataTables/dataTables.bootstrap.js?v=${clientVersion}"></script>
<script src="js/plugins/dataTables/dataTables.responsive.js?v=${clientVersion}"></script>
<script src="js/plugins/dataTables/angular-datatables.js?v=${clientVersion}"></script>
<script src="js/plugins/dataTables/dataTables.fixedColumns.js?v=${clientVersion}"></script>
<script src="js/plugins/dataTables/angular-datatables.fixedcolumns.min.js?v=${clientVersion}"></script>

<!-- toastr -->
<script src="js/plugins/toastr/toastr.min.js?v=${clientVersion}"></script>
<script src="js/plugins/iCheck/icheck.min.js?v=${clientVersion}"></script>

<!--  -->
<script src="js/plugins/chosen/chosen.jquery.js?v=${clientVersion}"></script>
<script src="js/plugins/chosen/chosen.js?v=${clientVersion}"></script>
<script src="js/plugins/moment/moment.min.js?v=${clientVersion}"></script>
<#--<script src="js/plugins/daterangepicker/angular-daterangepicker.js?v=${clientVersion}"></script>-->
<#--<script src="js/plugins/daterangepicker/daterangepicker.zh.js?v=${clientVersion}"></script>-->
<script src="js/plugins/datapicker/angular-datepicker.js?v=${clientVersion}"></script>

<!-- ng draggable -->
<script src="js/plugins/ng-draggable/ng-draggable.js?v=${clientVersion}" type="text/javascript"></script>

<!--ng-file-upload-->
<script src="js/plugins/ng-file-upload-bower/ng-file-upload.min.js?v=${clientVersion}"></script>
<script src="js/plugins/ng-file-upload-bower/ng-file-upload-shim.min.js?v=${clientVersion}"></script>


<!-- Admin Script -->
<#if isOnlineEnv>
<script type="application/javascript" src="/dist/script/crm-admin-index${staticFileSuffix}.js?v=${clientVersion}"></script>
<#else>
<script src="app/app.core.js?v=${clientVersion}"></script>
<script src="app/app.module.js?v=${clientVersion}"></script>

<script src="app/constants.js?v=${clientVersion}"></script>

<#--<script src="app/components/old-site-link.directive.js?v=${clientVersion}"></script>-->
<#--<script src="app/components/page-title.directive.js?v=${clientVersion}"></script>-->
<script src="app/components/minimaliza-sidebar.directive.js?v=${clientVersion}"></script>
<script src="app/components/side-navigation.directive.js?v=${clientVersion}"></script>
<script src="app/components/spinnerbar.directive.js?v=${clientVersion}"></script>
<script src="app/components/permission.check.service.js?v=${clientVersion}"></script>
<script src="app/components/icheck.directive.js"></script>
<script src="app/components/Html5notification.directive.js"></script>
<script src="app/components/scroll.fixed.directive.js"></script>

<script src="app/formatter.js?v=${clientVersion}"></script>
<script src="js/translations.js?v=${clientVersion}"></script>
<script src="app/filters/http.interceptor.js?v=${clientVersion}"></script>
<script src="app/filters/http.filter.js?v=${clientVersion}"></script>
<script src="app/app.config.js?v=${clientVersion}"></script>
</#if>




</body>
</html>
