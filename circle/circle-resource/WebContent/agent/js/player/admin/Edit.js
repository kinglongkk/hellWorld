/**
 * Created by orange .
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
        queryPlayer: function (e,q) {
            $("[name=returnView]").click();
        }
    });
});