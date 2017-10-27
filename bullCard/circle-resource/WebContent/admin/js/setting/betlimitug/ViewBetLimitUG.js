define(['common/BasePage'], function(BasePage) {
    return BasePage.extend({
        pagination : null,
        /**
         * 初始化及构造函数，在子类中采用
         * this._super();
         * 调用
         */
        init: function (formSelector) {
            this._super(formSelector||"form");
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
         * 执行查询
         * @param event         事件对象
         */
        query : function(event,option) {
            window.top.topPage.ajax({
                loading:true,
                url:window.top.topPage.getCurrentFormAction(event),
                type:"get",
                data:this.getCurrentFormData(event),
                success:function(data){
                    $("#mainFrame").html(data);
                    $(event.currentTarget).unlock()},
                error:function(data, state, msg){
                    window.top.topPage.showErrorMessage(window.top.message.common["server.error"]);
                    $(event.currentTarget).unlock();
                }});
        },

    });
});