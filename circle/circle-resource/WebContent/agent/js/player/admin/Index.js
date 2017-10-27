define(['common/BaseListPage'], function (BaseListPage) {

    return BaseListPage.extend({
        playerTag: null,
        /**
         * 初始化及构造函数，在子类中采用
         * this._super();
         * 调用
         */
        init: function () {
            this.noRecordMessage = window.top.message.common["find.norecord"];
            this._super();
        },

        /**
         * 当前对象事件初始化函数
         */
        bindEvent: function () {
            this._super();
            this.initShowTab();
            var that = this;
        },
        onPageLoad: function () {
            this._super();
        },
        reloadView: function (event, option) {
            if (event.returnValue) {
                $("#reloadView").click();
            }
        },
        reloadViewWithoutReturnValue: function (event, option) {
            $("#reloadView").click();
        }
    });

});