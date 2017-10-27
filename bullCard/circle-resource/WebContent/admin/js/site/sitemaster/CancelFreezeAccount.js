define(['common/BaseEditPage'], function (BaseEditPage) {

    return BaseEditPage.extend({
        /**
         * 初始化及构造函数，在子类中采用
         * this._super();
         * 调用
         */
        init: function (formSelector) {
            this.formSelector = "form";
            this._super(this.formSelector);
        },
        /** 当前对象事件初始化函数 */
        bindEvent: function () {
            this._super();
        },

        /**
         * 确认取消冻结
         * @param e
         * @param option
         */
        cancelFreezeAccount: function (e, option) {
            var _this=this;
            window.top.topPage.ajax({
                url: window.top.topPage.getCurrentFormAction(e),
                data:$(this.formSelector).serialize(),
                cache: false,
                type: "POST",
                dataType:"json",
                success: function (data) {
                    if(data.state){
                        _this.returnValue=true;
                        _this.closePage();
                        window.top.topPage.showSuccessMessage(data.msg,null);
                    }else{
                        window.top.topPage.showErrorMessage(window.top.message.common['permission.error']);
                    }
                }
            });
            $(e.currentTarget).unlock();
        }
    });
});