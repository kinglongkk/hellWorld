/**
 * 商户信息修改
 * Created by black on 2016/11/30.
 */
define(['common/BaseEditPage'], function (BaseEditPage) {
    return BaseEditPage.extend({

        init: function () {
            this._super("form");
        },

        /**
         * 当前页面所有事件初始化函数
         */
        bindEvent: function () {
            var _this=this;
            this._super();
        },

        /**
         * 执行查询
         * @param event 事件对象
         */
        query : function(event,option) {
            var $form = $(window.top.topPage.getCurrentForm(event));
            if(!$form.valid || $form.valid()) {
                window.top.topPage.ajax({
                    loading:true,
                    url:window.top.topPage.getCurrentFormAction(event),
                    headers: {
                        "Soul-Requested-With":"XMLHttpRequest"
                    },
                    type:"post",
                    data:this.getCurrentFormData(event),
                    success:function(data){
                        $("#tab-content2").html(data);
                        event.page.onPageLoad();
                        $(event.currentTarget).unlock()},
                    error:function(data, state, msg){
                        window.top.topPage.showErrorMessage(window.top.message.common["server.error"]);
                        $(event.currentTarget).unlock();
                    }});
            } else {
                $(event.currentTarget).unlock();
            }
        }

    });
});