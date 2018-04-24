var Login = function () {

    function onSubmit() {
        resetSubmitBtn(false);
        submitLogin();
    }

    function resetSubmitBtn(flag) {

        var _ele = $('#btn_login');

        //flag==true为可用
        if (flag) {
            _ele.removeClass("disabled");
            _ele.html('登录<i class="m-icon-swapright m-icon-white"></i>');


        }
        else {
            _ele.addClass("disabled");
            _ele.text("登录中,请稍后......");
        }

    }

//根据指定的url获取其参数数组
    function getQueryStringByName2(url, name) {
        url = url == null ? "" : url;
        var result = url.match(new RegExp("[\?\&]" + name + "=([^\&]+)", "i"));
        if (result == null || result.length < 1) {
            return "";
        }
        return result[1];
    }

    function submitLogin() {
        var loginname = $('[name="username"]').val(),
            pwd = $('[name="password"]').val(),
            _csrf = $('[name="_csrf"]').val();

        //$.post("/site/login.html", {"validatecode": validatecode, "username": loginname, "password": pwd}, function (data) {
        $.post("/web/user/admin-do-login.do", {"mobile": loginname, "password": pwd}, function (data) {
            if (data.code == 200) {

                window.location.href = decodeURIComponent(data.data.url);
            }
            else {


                toastr.options = {
                    "closeButton": true,
                    "debug": false,
                    "positionClass": "toast-top-center",
                    "onclick": null,
                    "showDuration": "1000",
                    "hideDuration": "1000",
                    "timeOut": "5000",
                    "extendedTimeOut": "1000",
                    "showEasing": "swing",
                    "hideEasing": "linear",
                    "showMethod": "fadeIn",
                    "hideMethod": "fadeOut"
                };

                var shortCutFunction = 'error';
                toastr[shortCutFunction](data.message, "温馨提示")
                resetSubmitBtn(true);
            }
        }, "json") ;
    }


    var handleLogin = function () {
        $('#login-form').validate({
            errorElement: 'span', //default input error message container
            errorClass: 'help-block', // default input error message class
            focusInvalid: false, // do not focus the last invalid input
            rules: {
                username: {
                    required: true
                },
                password: {
                    required: true
                }

            },
            messages: {
                username: {
                    required: "用户名必填哦!"
                },
                password: {
                    required: "密码是必填的!"
                }
            },
            invalidHandler: function (event, validator) { //display error alert on form submit
                $('.alert-danger', $('#login-form')).show();
            },
            highlight: function (element) { // hightlight error inputs
                $(element)
                    .closest('.form-group').addClass('has-error'); // set error class to the control group
            },
            success: function (label) {
                label.closest('.form-group').removeClass('has-error');
                label.remove();
            },
            errorPlacement: function (error, element) {
                error.insertAfter(element.closest('.input-icon'));
            },
            submitHandler: function (form) {
                onSubmit();
            }
        });

        $('#login-form input').keypress(function (e) {
            if (e.which == 13) {
                if ($('#login-form').validate().form()) {
                    $('#login-form').submit();
                }
                return false;
            }
        });

        $("#btn_send").data('origin', $("#btn_send").html());
        $("#btn_send").click(sendSMS);
    }

    function sendSMS() {
        if (validateUser()) {
            var btn = $(this);
            var stopHandler = sendingSMS(btn);
            ajaxSendSMS(stopHandler);
        }
    }

    function validateUser() {
        var valid = true;
        var userName = $("#Username").val() || "";
        var password = $("#password").val() || "";
        if (userName.replace(/\s/g, '') == '') {
            showMessage("请填写用户名!", true);
            valid = false;
        } else if (password.replace(/\s/g, '') == '') {
            showMessage("请填写密码!", true);
            valid = false;
        } else {
            $(".alert").hide();
        }
        return valid;
    }

    function ajaxSendSMS(stopHandler) {
        $.ajax({
            url: '/site/dosendvalidatecode.html',
            type: 'POST',
            dataType: 'json',
            data: {username: $("#Username").val(), password: $("#password").val()},
            success: function (d) {
                ajaxSendSMSFinal(d, stopHandler);
            },
            error: function () {
                ajaxSendSMSFinal({code: 500, message: '发送异常，请联系管理员'}, stopHandler);
            }
        });
    }

    function ajaxSendSMSFinal(d, stopHandler) {
        if (d.code != 200) {
            stopHandler();
        }
        showMessage(d.message, d.code != 200);
    }

    function showMessage(message, error) {
        $(".alert").hide();
        if (error) {
            $(".alert-danger").show().find("span").html(message);
        } else {
            $(".alert-success").show().find("span").html("发送成功");
        }
    }

    function sendingSMS(btn) {
        btn.unbind("click");
        var timeout = btn.data().timeout || 60
        return countDown(
            timeout,
            function (v) {
                btn.html(v + "秒后重试!");
            },
            function () {
                btn.bind("click", sendSMS);
                btn.html(btn.data('origin'));
                btn = null;
            }
        );
    }

    function countDown(timeout, iterator, finalHandler) {
        function handler() {
            if (timeout <= 0) {
                finalHandler();
                handler = iterator = finalHandler = stopHandler;
            } else {
                iterator(timeout);
                timeout--;
                setTimeout(function () {
                    handler();
                }, 1000);
            }
            return stopHandler;
        }

        function stopHandler() {
            timeout = 0;
        }

        return handler();
    }

    return {
        //main function to initiate the module
        init: function () {

            handleLogin();

            // init background slide images
            $.backstretch([
                    "./assets/pages/media/bg/1.png",
                    "./assets/pages/media/bg/2.png",
                    "./assets/pages/media/bg/3.png",
                    "./assets/pages/media/bg/4.png"
                ], {
                    fade: 1000,
                    duration: 8000
                }
            );
        }
    };

}();

jQuery(document).ready(function () {
    Login.init();
});