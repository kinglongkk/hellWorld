/**
 * 备注js
 */
define(['common/BaseListPage'], function (BaseListPage) {

    return BaseListPage.extend({

        /**
         * 初始化及构造函数，在子类中采用
         * this._super();
         * 调用
         */
        init: function () {
            this.formSelector = "form";
            this._super();
        },

        /**
         * 当前对象事件初始化函数
         */
        bindEvent : function() {
            this._super();
        },

        /**
         * 玩家列表中的备注
         * @param e
         */
        queryRemark: function (event,option) {
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
                        $("#tab-content5").html(data);
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