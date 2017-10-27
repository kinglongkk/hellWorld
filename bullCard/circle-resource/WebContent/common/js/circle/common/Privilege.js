/**
 * Created by cj on 15-6-18.
 */
define(['common/BaseEditPage'], function (BaseEditPage) {
    return BaseEditPage.extend({
        init: function () {
            this.formSelector = "form";
            this._super();
            this.initPage();
        },
        /**
         * 当前对象事件初始化函数
         */
        bindEvent : function() {
            this._super();
            //this.bindButtonEvents();
        },
        /**
         * init page content
         */
        initPage: function () {
            //$('.modal-body > div:eq(2)').hide();
            /*
             $('#privilegeCode').togglePassword({
             el: '#togglePassword'
             });
             */
            var times = $('#7f1a3d0c-f15e-4e7a-8836-fc7182298af9').val();
            if (times < 4) {
                this.showVali(times);
            }
        },
        /**
         * 显示验证码
         * @param t
         */
        showVali: function (t) {
            var _this=this;
            $('[name=requiedValiCode]').val(1);
            $('#privilegeTipDiv span:last').text(t);
            $('#privilegeTipDiv').removeClass('hide');
            _this.resizeDialog();
        },
        /**
         * 回调判断验证状态
         * @param e
         * @param option
         * @returns {boolean}
         */
        showTips: function (e, option) {
            var _this=this;
            var result = option.data;
            var PrivilegeStatusEnum = {};
            PrivilegeStatusEnum.ALLOW_ACCESS = 100;
            PrivilegeStatusEnum.LOCKED = 99;
            PrivilegeStatusEnum.WRONG_VALICODE = 97;
            if (result.stateCode == PrivilegeStatusEnum.ALLOW_ACCESS) {
                _this.closePage();
                /*if (window.top.page.parentTarget != undefined) {
                    $(window.top.page.parentTarget).click();
                }*/
                _this.returnValue=true;
            } else if (result.stateCode == PrivilegeStatusEnum.LOCKED) {
                location.href = root + "/privilege/showLockPrivilege.html";
            } else {
                $(window.top.topPage.getCurrentForm(e))[0].reset();
                $('#privilegeCode').focus();
                if (result.stateCode == PrivilegeStatusEnum.WRONG_VALICODE) {
                    _this.refreshCode();
                }
                if (result.leftTimes < 4) {
                    _this.showVali(result.leftTimes);
                }
            }
            $(e.currentTarget).unlock();
            return false;
        },
        /**
         * 验证密码
         * @returns {boolean}
         */
        validate: function () {
            var $privilegeCode = $('#privilegeCode');
            var v = $privilegeCode.val();
            if (!v) {
                $privilegeCode.focus();
                return false;
            }
            var $valiCode = $('input[name=valiCode]');
            if ($valiCode && $valiCode.is(":visible")) {
                v = $valiCode.val();
                if (!v) {
                    $($valiCode).focus();
                    return false;
                }
            }
            return true;
        },
        /**
         * 刷新
         */
        refreshCode: function () {
            var url = null;
            var img = $('#privilegeTipDiv img');
            if (!url) {
                url = $(img).attr('src');
            }
            $(img).attr('src', url + '?t=' + Math.random());
            $(this.formSelector+" input[name='valiCode']").val("");
            $('#privilegeTipDiv a').unlock();
        },
        closePrivilege: function (e, opt) {
            window.top.topPage.closeDialog();
        }
    })
});