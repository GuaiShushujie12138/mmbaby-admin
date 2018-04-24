<#---------------------------------------
    TODO:自定义函数模板

----------------------------------------->
<#--获取上下文的必要参数-->
<#function getContext>
    <#assign env=(runEnv!"product")>
    <#assign release=(["prelease","product"]?seq_contains(env))>

    <#assign context={
    "title":(title!""),
    "keywords":(keywords!""),
    "description":(description!""),
    "location":(location!""),
    "staticUrl":(staticUrl!"//img.lianshang.cn/ls-backend/admin"),
    "appBaseUrl":(appBaseUrl!""),
    "runEnv":env,
    "release":release,
    "isProduct":(env=='product'),
    "clientVersion":(clientVersion!"201509024001"),
    "extraLoadCss":(extraLoadCss![]),
    "extraLoadCssPlugin":(extraLoadCssPlugin![]),
    "extraLoadJS":(extraLoadJS![]),
    "isShowNavBar":(isShowNavBar!true),
    "extraLoadJSPlugin":(extraLoadJSPlugin![]),
    "headerBlock":(headerBlock!""),
    "footerBlock":(footerBlock!""),
    "user":((userInfo)!{}),
    "bodyAdditionCss":(bodyAdditionCss!"")<#--补充样式-->
    }
    >
    <#return context>
</#function>
<#--
 格式化:当传入值为null或者空字符串 则使用默认值
-->
<#function ifn obj,def="">
    <#assign tmp=((obj!"")?string?trim)>
    <#assign v =tmp>
    <#if (tmp=="")>
        <#assign v = def>
    </#if>
    <#return v>
</#function>

<#--
 格式化:判断当前值是否为空或者空字符串
-->
<#function isEmpty obj>
    <#assign tmp=((obj!"")?string?trim)>
    <#return (tmp=="")>
</#function>

<#--
    根据货币类型货物货币名称
-->
<#function getCurrencyName currencyId>
    <#assign currencyUnitMap = {"1":"$","2":"¥","3":"€","4":"JPY¥
    ","5":"₩","6":"HK$","7":"NT$
    "}>
    <#assign currencyName=currencyUnitMap[currencyId?string]>;
    <#return currencyName>
</#function>
<#--
    键值对拆分返回keyValue的map
-->
<#function splitToKeyValue str splitChar>
    <#assign temp=(str!"")>
    <#assign keyValue={key:"",value:""} >
    <#list temp?split(splitChar!';') as kvs>
        <#assign keyValue={key:((kvs[0])!""),value:((kvs[1])!"")} >
    </#list>
    <#return keyValue>
</#function>