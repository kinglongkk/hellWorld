/**
 * Created by tom on 15-12-8.
 */
define(['common/BaseEditPage'], function (BaseEditPage) {
    return BaseEditPage.extend({
        init: function () {
            this._super();

        },
        /**
         * 当前对象事件初始化函数
         */
        bindEvent : function() {
            this._super();
            var _this = this;
        },

        onPageLoad: function () {
            this._super();
        },

        validatePermission:function(e,option) {
            var _this = this;
            window.top.topPage.ajax({
                url: root+'/site/detail/validatePermission.html',
                data:window.top.topPage.getCurrentFormData(e),
                cache: false,
                dataType:'json',
                type: "POST",
                success: function (data) {
                    if (data.state){
                        e.returnValue = true;
                        _this.closePage(e,option);
                    } else {
                        e.returnValue = false;
                        window.top.topPage.showErrorMessage(window.top.message.common['permission.error']);
                    }
                }
            });
            $(e.currentTarget).unlock();
        }
    });
});