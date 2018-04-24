
function timeHtml(data, type, full, meta) {

    if (data == null || data == '') {
        return "";
    }

    return getTime(data);
};

function shopLinkFormatter(data, type, full, meta){

    var shopId=full.shopId||full.shop_id;

    return '<a target="_blank" href="http://www.lianshang.com/shop/'+shopId+'.html">'+shopId+'</a>';
};

function ItemLinkFormatter(data, type, full, meta){
    var itemId=full.itemId||full.item_id;
    var itemName=full.itemName||full.item_name;
    if(!itemName){
        itemName=itemId;
    }
    return '<a target="_blank" href="{{itemDomain}}item/'+itemId+'">'+itemName+'</a>';
};


function platformHtml(data, type, full, meta) {

    if (data == 0) {
        return "未设定"
    }
    else  if (data == 1) {
        return "web"
    }
    else  if (data == 2) {
        return "ios"
    }
    else  if (data == 3) {
        return "android"
    }
    else  if (data == 4) {
        return "h5"
    }
    else  if (data == 5) {
        return "Flow"
    }
    else  if (data == 6) {
        return "管理后台"
    }
    else  if (data == 7) {
        return "CRM"
    }
    else  if (data == 8) {
        return "CRM签约"
    }
    else  if (data == 9) {
        return "CRM快捷开店"
    }
    else  if (data == 9) {
        return "CRM代抢单"
    }
    else {
        return "未知";
    }
};