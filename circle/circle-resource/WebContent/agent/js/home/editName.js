/**
 * Created by fly on 15-10-26.
 */
define(['common/BaseEditPage'], function(BaseEditPage) {
    return BaseEditPage.extend({
        /**
         * 初始化及构造函数，在子类中采用
         * this._super();
         * 调用
         */
        init: function () {
            this._super();
        },
        onPageLoad: function () {
            this._super();
        },
        /**
         * 当前对象事件初始化函数
         */
        bindEvent: function () {
            this._super();
        },
        /**
         * 绑定表单验证规则
         * @private
         */
        bindFormValidation : function() {
            this._super();
        },
        checkForm: function(e, opt) {
            console.log('result = ' + this.validateForm(e));
            if (!this.validateForm(e)) {
                return false;
            }
            return true;
        },
        /**
         * 设置姓名下一步
         */
        nextStep: function(e) {
            $('input[name="realNameAffirm"]').removeClass('ignore');
            $('input[name="sysUser.permissionPwd"]').removeClass('ignore');
            $('input[name="securePwdAffirm"]').removeClass('ignore');
            var $title = parent.document.getElementsByClassName('bootstrap-dialog-title');
            var size = $('[name="hasppwd"]').val();
            var title = window.top.message.agent['index.securepwd.guide'];
            if (size == 1) {
                title = window.top.message.agent['index.realname.guide'];
            }
            $($title).html(title);

            $('.body-step1').hide(function() {
                $('.footer-step1').hide();
            });
            $('.body-step2').show(function() {
                $('.footer-step2').show();
            });
            this.resizeDialog();

            $(e.currentTarget).unlock();
        },
        /**
         * 上一步
         */
        prevStep: function(e) {
            $('input[name="realNameAffirm"]').addClass('ignore');
            $('input[name="sysUser.permissionPwd"]').addClass('ignore');
            $('input[name="securePwdAffirm"]').addClass('ignore');
            var title = parent.document.getElementsByClassName('bootstrap-dialog-title');
            $(title).html(window.top.message.agent['index.realname.guide']);

            $('.body-step2').hide(function() {
                $('.footer-step2').hide();
            });
            $('.body-step1').show(function() {
                $('.footer-step1').show();
            });
            $(e.currentTarget).unlock();
            this.resizeDialog();
        },
        /**
         * 保存姓名
         */
        saveName: function(event) {
            window.top.topPage.ajax({
                url: root + "/agent/saveName.html",
                type: "post",
                dataType: "json",
                data: window.top.topPage.getCurrentFormData(event),
                cache: false,
                async: false,
                success: function (data) {
                    console.log('operation = ' + data.operation);
                    if (data.operation) {
                        window.top.topPage.showSuccessMessage(window.top.message.common['save.success'], function(){
                            window.top.topPage.closeDialog();
                        });
                    }
                },
                error: function (err) {
                    console.info(err);
                }
            });
        }
    })
})
