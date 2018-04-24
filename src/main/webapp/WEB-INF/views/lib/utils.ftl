<#---------------------------------------
    TODO:宏引用汇总模板

----------------------------------------->
<#include "functions.ftl">



<#--批量输出样式  base:基础路径 version:资源版本号 cssLinks 样式路径组 isPlugin是否插件地址,插件默认放在另外一台机器-->
<#macro cssLinks base version cssLinks isPlugin=true>

    <#if cssLinks?? && (cssLinks?size>0)>
        <#list cssLinks as cssFile>
        <link href="${isPlugin?string(base,"")}${cssFile}?v=${version}" rel="stylesheet" type="text/css"/>
        </#list>
    </#if>
</#macro>

<#--批量输出脚本  base:基础路径 version:资源版本号 scrpts 脚本路径组-->
<#macro scripts base version scripts isPlugin=true>
    <#if scripts?? && (scripts?size>0)>
        <#list scripts as jsFile>
        <script type="text/javascript" src="${isPlugin?string(base,"")}${jsFile}?v=${version}" type="text/javascript"></script>
        </#list>
    </#if>
</#macro>

<#--开始输出内容包裹-->
<#macro beginMainWrap location="" mainWrap=true>

</#macro>

<#--结束正文包裹-->
<#macro endMainWrap location="" mainWrap=true>
</#macro>

<#--隐藏用户敏感信息-->
<#macro userInfHide userName="">
    <#if (userName?length==0)>
    <#elseif (userName?length==1)>
    *
    <#elseif (userName?length==2)>
    ${userName?substring(0,1)}*
    <#elseif (userName?length>2&&userName?length<=5)>
    ${userName?substring(0,1)}**${userName? substring((userName?length-1),userName?length)}
    <#elseif (userName?length>5&&userName?length<=10)>
    ${userName?substring(0,2)}**${userName? substring((userName?length-2),userName?length)}
    <#else>
    ${userName?substring(0,3)}****${userName? substring((userName?length-4),userName?length)}
    </#if>
</#macro>
