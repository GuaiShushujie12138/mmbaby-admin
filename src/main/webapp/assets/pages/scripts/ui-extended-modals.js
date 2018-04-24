var UIExtendedModals = function () {
    var handleChangePassword = function () {


        function submitLogin() {


            var mobile=$('[name="mobile"]').val();
            var loginUrl=$('[name="loginUrl"]').val();

            var oriPassword = $('[name="currentPassword"]').val(),
                newPassword = $('[name="newPassword1"]').val();


            $.post("/web/user/change-password.do", {"mobile":mobile,"oriPassword": oriPassword, "newPassword": newPassword}, function (data) {
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


                if (data.code == 200) {
                    var shortCutFunction = 'info';
                    toastr[shortCutFunction]("密码修改成功,请请用新密码登录! 5秒后自动跳转到登录页", "温馨提示");
                    setTimeout(function () {
                        window.location.href = decodeURIComponent(loginUrl);
                    },5000);

                }
                else {
                    var shortCutFunction = 'error';
                    toastr[shortCutFunction](data.message, "温馨提示");

                }
            }, "json");
        }

        $('#change-password-form').validate({
            errorElement: 'span', //default input error message container
            errorClass: 'help-block', // default input error message class
            focusInvalid: false, // do not focus the last invalid input
            ignore: "",
            rules: {
                currentPassword: {
                    minlength: 6,
                    maxlength: 16,
                    required: true
                },
                newPassword1: {
                    minlength: 6,
                    maxlength: 16,
                    required: true
                },
                newPassword2: {
                    equalTo: "#newPassword1"
                }

            },

            messages: {
                currentPassword: {
                    minlength: "最少6个字符",
                    maxlength: "最少16个字符",
                    required: "请输入您的当前密码"
                },
                newPassword1: {
                    minlength: "最少6个字符",
                    maxlength: "最少16个字符",
                    required: "请输入您新的密码"
                },
                newPassword2: {
                    equalTo: "两次密码输入不一致"
                }
            },

            invalidHandler: function (event, validator) { //display error alert on form submit

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


                submitLogin();
            }
        });
        $('#change-password-form input').keypress(function (e) {
            if (e.which == 13) {
                if ($('#change-password-form').validate().form()) {
                    $('#change-password-form').submit();
                }
                return false;
            }
        });

    }

    return {
        //main function to initiate the module
        init: function () {
            handleChangePassword();
        },


    };

}();


jQuery(document).ready(function () {
    UIExtendedModals.init();
});