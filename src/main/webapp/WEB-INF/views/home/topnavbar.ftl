<div class="row border-bottom">
    <nav class="navbar navbar-static-top" role="navigation" style="margin-bottom: 0">
        <div class="navbar-header">
            <span minimalizaSidebar></span>
            <div class="minimalize-styl-2" style="margin-left: 0px;">
                <strong>{{pageTitle}}</strong>
            </div>
        </div>
        <ul class="nav navbar-top-links navbar-right">


            <li uib-dropdown="" class="dropdown">
                <a class="count-info dropdown-toggle" href="" uib-dropdown-toggle="" aria-haspopup="true"
                   aria-expanded="false">
                    <img alt="" class="img-circle" src="/assets/pages/img/avatar3_small.jpg">
                    <strong class="font-bold">{{user.trueName}}<i class="fa fa-angle-down"></i></strong>
                </a>
                <ul uib-dropdown-menu="" class="animated fadeInRight m-t-xs ng-scope dropdown-menu">
                    <li><a  href="/change-password.xhtml"><i class="fa fa-pencil-square-o"></i>修改密码</a></li>
                    <#if hasbindPermission>
                        <li><a  href="/bind-card.xhtml"><i class="fa fa-credit-card"></i>绑定银行卡</a></li>
                    </#if>
                    <li>
                        <a  href="/logout.xhtml">
                            <i class="fa fa-sign-out"></i> 注销
                        </a>
                    </li>
                </ul>
            </li>
        </ul>

    </nav>
</div>