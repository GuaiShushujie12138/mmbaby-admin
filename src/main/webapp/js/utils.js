function strlen(str) {

  return str.length;
};

function getDate(timestamp) {
  var ts = arguments[0] || 0;
  var t, y, m, d;
  t = ts ? new Date(ts) : new Date();
  y = t.getFullYear();
  m = t.getMonth() + 1;
  d = t.getDate();
  // 可根据需要在这里定义时间格式
  return y + '-' + (m < 10 ? '0' + m : m) + '-' + (d < 10 ? '0' + d : d);
};
var escape = document.createElement('textarea');
function escapeHTML(html) {
  escape.textContent = html;
  return escape.innerHTML;
};

function unescapeHTML(html) {
  escape.innerHTML = html;
  return escape.textContent;
}

function getTime(timestamp) {
  var ts = arguments[0] || 0;
  var t, y, m, d, h, i, s;
  t = ts ? new Date(ts) : new Date();
  y = t.getFullYear();
  m = t.getMonth() + 1;
  d = t.getDate();
  h = t.getHours();
  i = t.getMinutes();
  s = t.getSeconds();
  // 可根据需要在这里定义时间格式
  return y + '-' + (m < 10 ? '0' + m : m) + '-' + (d < 10 ? '0' + d : d) + ' '
      + (h < 10 ? '0' + h : h) + ':' + (i < 10 ? '0' + i : i) + ':' + (s < 10
          ? '0' + s : s);
}

var isNullOrEmpty = function (s) {
  return !(s !== null && s !== '' && s !== undefined);
}

var ifn = function (v, bv) {
  if (v === null || v === undefined) {
    return bv;
  } else if (typeof v === 'string') {
    var isWhitespace = (v === '') || (v.replace(/\s/g, '') === '');
    return isWhitespace ? bv : v;
  } else {
    return v;
  }
}

var undef = function (v, dv) {
  if (v === null || v === undefined) {
    return dv;
  } else {
    return v;
  }
}

var isType = function (obj, type) {
  return Object.prototype.toString.call(obj) == "[object " + type + "]";
}

//检测传入对象是否为数组
function isArray(a) {
  return isType(a, "Array");
}

//检测传入对象是否为字符串
function isString(s) {
  return isType(s, "String");
}

//检测传入对象是否为对象
function isObject(o) {
  return isType(o, "Object");
}

var isFunction = function (obj) {
  return this.isType(obj, "Function");
}

var ensureArray = function (itemOrArray) {
  if (this.isArray(itemOrArray)) {
    return itemOrArray;
  } else if (itemOrArray != null) {
    return [itemOrArray];
  } else {
    return [];
  }
}

var buildQuery = function (container) {
  var forms = $(container).find("[data-op]");
  var formItem = null, formOp = null, formName, formValue = null;
  var andQueryBuilder = new LG.QueryBuilder('and');

  forms.each(function () {
    formItem = $(this);
    formName = formItem.attr("name");
    formOp = formItem.attr("data-op");
    formValue = formItem.val();
    if (isNullOrEmpty(formName) || isNullOrEmpty(formValue)) {
      return;
    }
    var val = formItem.val();
    if (formItem[0].nodeName == 'SELECT') {
      val = formItem.val().replace('string:', '');
    } else {
      val = formItem.val();
    }
    if (isNullOrEmpty(val)) {
      return;
    }

    andQueryBuilder.rule(formName, formOp, val);
  });
  return andQueryBuilder.data;
}

function getGridActiveTabRules(container) {
  var activeTab = container.find(".active");
  var json = decodeURIComponent(activeTab.attr("data-filter"));
  var rule = [];
  if (!isNullOrEmpty(json)) {
    rule = JSON.parse(json);
  }
  return rule;
}

var getQueryParams = function (form, rule2) {
  var rule = buildQuery(form);
  //var rule2 = getGridActiveTabRules(container);
  rule.rules.push.apply(rule.rules, rule2);
  return rule;
}

function formClear(form) {
  form[0].reset();
  form.find("[data-op],[ng-column-combobox]").each(defaultValueRender);
  var ctrElement = form.parents("#gridcontroller");
  if (ctrElement.length > 0) {
    revertActiveNavTabs(ctrElement);
  }
}

//还原列表界面活动tab也
function revertActiveNavTabs(ctrElement) {
  var tab = ctrElement.find("#dataGridTabs");
  tab.find(".active").removeClass("active");
  tab.find("li:first").addClass("active");
}

//默认值渲染
function defaultValueRender(i, item) {
  var target = $(item);
  var data = target.data();
  var control = data.control;
  control = target.is("[ng-column-combobox]") ? "combobox" : control;
  switch (control) {
    case 'combobox':
      target.select2('val', data.defaultvalue);
      break;
    default:
      target.val(data.defaultvalue);
      break;
  }
}

function Html5notification() {
  var h5n = new Object();

  h5n.issupport = function () {
    var is = !!window.webkitNotifications;
    if (is) {
      if (window.webkitNotifications.checkPermission() > 0) {
        window.onclick = function () {
          window.webkitNotifications.requestPermission();
        }
      }
    }
    return is;
  };

  h5n.shownotification = function (replaceid, url, imgurl, subject, message) {
    if (window.webkitNotifications.checkPermission() > 0) {
      window.webkitNotifications.requestPermission();
    } else {
      var notify = window.webkitNotifications.createNotification(imgurl,
          subject, message);
      notify.replaceId = replaceid;
      notify.onclick = function () {
        window.focus();
        window.location.href = url;
        notify.cancel();
      };
      notify.show();
    }
  };

  return h5n;
}

function isEmpty(obj) {
  for (var name in obj) {
    return false;
  }
  return true;
}

function sleep(d) {
  for (var t = Date.now(); Date.now() - t <= d;) {
    ;
  }
}

function arrRepeat(arr) {

  var nary = arr.sort();

  for (var i = 0; i < arr.length; i++) {

    if (nary[i] == nary[i + 1]) {
      return true;
    }
  }

  return false;
}

function deepCopy(source) {
  var result = {};
  for (var key in source) {
    result[key] = (typeof source[key] === 'object') ? deepCopy(source[key])
        : source[key];
  }
  return result;
}

function buildPictureUrl(imgs, size) {
  var ret = '';
  if (!isNullOrEmpty(imgs)) {
    var picArr = "";
    if ((typeof imgs == 'object') && imgs.constructor == Array) {
      picArr = imgs;
    } else {
      picArr = imgs.split(",");
    }

    ret += '<uib-carousel class="td-carousel" style="max-width: 100px">';
    for (var i = 0; i < picArr.length; ++i) {
      ret += '<uib-slide' + (i === 0 ? ' class="active"' : '')
          + '><a href="' + picArr[i]
          + '?x-oss-process=style/p_800" data-gallery=""><img src="'
          + picArr[i] + size + '" /></a></uib-slide>';
    }
    ret += '</uib-carousel>';

  } else {
    ret += "<img src='https://img.lianshang.cn/lsweb/resources/images/default/ml_demand.jpg"
        + size + "'/>"

  }
  return ret;
}

/**
 * 提示弹出框（确认取消）
 * @param title    提示标题  默认'温馨提示'
 * @param content  提示内容
 * @param callback 点确定回调
 * @param errorCallback 点取消回调
 * 2017-07－13   by Mao
 */
;function isCanclePopByMao(title,content,callback,errorCallback) {
  var html_ = '<div id="isCanclePopMao" class="isCanclePopMao">' +
      '<div class="panel panel-primary"> ' +
      '<div class="panel-heading"> ' +
      title +
      '   <a href="javascript:;" class="cancel-mao"><i class="fa fa-times"></i></a>' +
      '</div> ' +
      '<div class="panel-body">' +
      content +
      '</div> ' +
      '<div style="text-align: right; padding: 10px;"> ' +
      '   <a href="javascript:;" class="btn btn-primary ok-mao">确 定</a>' +
      '   <a href="javascript:;" class="btn btn-default cancel-mao" style="margin-left: 10px;">取 消</a>' +
      '</div> ' +
      '</div>' +
      '<div class="mask_mao"></div>' +
      '</div>';
  $('body').append(html_);
  $('#isCanclePopMao .cancel-mao').click(function () {
    $('#isCanclePopMao').remove();
    errorCallback&&errorCallback();
  });
  $('#isCanclePopMao .ok-mao').click(function () {
    $('#isCanclePopMao').remove();
    callback&&callback();
  });
};

