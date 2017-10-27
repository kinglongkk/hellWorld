/**
 * Created by ke on 15-7-1.
 */
define(['common/BaseEditPage'], function (BaseEditPage) {
    return BaseEditPage.extend({
        init: function () {
            this._super();

        },

        bindEvent: function () {
            this._super();
            var _this = this;
            _this.initCaptcha();
        },

        onPageLoad:function() {
            this._super();
        },

    });
});