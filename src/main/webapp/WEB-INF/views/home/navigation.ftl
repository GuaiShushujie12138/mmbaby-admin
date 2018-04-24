<#assign appName=((data.data.appName)!'')>
<#assign authMenuList=((data.data.authMenuList)![])>

<nav class="navbar-default navbar-static-side" role="navigation" style="z-index: 120">
    <div class="sidebar-collapse">
        <ul class="nav metismenu">
            <li class="nav-header">
                <div class="dropdown profile-element" dropdown>
                    <img alt="image" class="img-circle" src="img/profile_small.jpg"/>
                    <a class="dropdown-toggle" dropdown-toggle href>
                        <span class="clear">
                            <span class="block m-t-xs">
                                 <strong class="font-bold">{{user.trueName}}({{user.fullDepartName}})</strong>
                            </span>
                        </span>
                    </a>
                    <!-- <ul class="dropdown-menu animated fadeInRight m-t-xs">
                        <li><a href="#">登出</a></li>
                    </ul> -->
                </div>
                <div class="logo-element">
                    <a href="#">${appName}</a>
                </div>
            </li>
        </ul>


        <ul side-navigation class="nav metismenu" id="side-menu">

        <#list authMenuList as menu>
            <li ng-class="{active: $state.includes('${menu.nodeContent.functionUrl}')}">
                <a href=""><i class="${menu.nodeContent.functionIcon!''}"></i> <span class="nav-label">${menu.nodeContent.functionName}</span><span
                        class="fa arrow"></span></a>
                <ul class="nav nav-second-level collapse" ng-class="{in: $state.includes('${menu.nodeContent.functionUrl}')}">
                    <#list menu.sons as submenu>
                        <li ui-sref-active="active">

                            <a ui-sref="${submenu.nodeContent.functionUrl!''}">${submenu.nodeContent.functionName}<span
                                    class="label label-info pull-right">NEW</span></a>
                        </li>
                    </#list>
                </ul>
            </li>
        </#list>
        </ul>


    </div>
</nav>