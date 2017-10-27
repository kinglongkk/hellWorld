define(['common/BaseEditPage','bootstrapswitch'], function(BaseEditPage) {
    return BaseEditPage.extend({
        /**
         * 初始化及构造函数，在子类中采用
         * this._super();
         * 调用
         */
        init: function () {
            this.formSelector = "#mainFrame form";
            this._super();
        },
        /**
         * 页面加载事件函数
         */
        onPageLoad: function () {
            /**
             * super中已经集成了
             *      验证、
             *      排序、
             *      分页、
             *      chosen Select
             * 控件的初始化
             */
            this._super();
        },
        /**
         * 当前对象事件初始化函数
         */
        bindEvent: function () {
            this._super();
        },

        /**
         * 安全密码
         * @param e
         * @param option
         */
        checkPwd:function(e,option) {
            var _this = this;
            window.top.topPage.ajax({
                url: root+'/site/detail/checkPermission.html',
                data:window.top.topPage.getCurrentFormData(e),
                cache: false,
                type: "POST",
                success: function (data) {
                    $("[name=editor]",_this.formSelector).remove();
                    $("div.oneFoot").remove();
                    $("div.modal-body").append(data);
                    $("div.secFoot").show();
                    page.resizeDialog();
                    e.page.onPageLoad();
                }
            });
            $(e.currentTarget).unlock();
        },

    });
});