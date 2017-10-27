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
        queryRemark: function (e) {
            var load = this.getCurrentForm(e).parentNode;
            window.top.topPage.ajax({
                data: this.getCurrentFormData(e),
                url: this.getCurrentFormAction(e),
                success: function(data) {
                    $(load).html(data);
                },
                error: function(data) {

                }
            });
        }
    });

});