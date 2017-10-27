define(['common/BasePage'], function(BasePage) {

    return BasePage.extend({
        /**
         * 初始化及构造函数，在子类中采用
         * this._super();
         * 调用
         */
        init : function() {
            this._super("form");
            this.bindFormValidation();
        },
        /**
         * 页面加载事件函数
         */
        onPageLoad: function () {
            this._super();
        },
        /**
         * 当前对象事件初始化函数
         */
        bindEvent : function() {
            this._super();
        },
        /**
         * 绑定表单验证规则
         * @private
         */
        bindFormValidation : function() {
            var $form = $(this.formSelector);
            var rule = this.getValidateRule($form);
            if (rule) {
                $form.validate(rule);
            }
        }
    });

});