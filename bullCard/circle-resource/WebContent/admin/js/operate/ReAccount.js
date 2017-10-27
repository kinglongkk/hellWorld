define(['common/BaseEditPage'], function (BaseEditPage) {

    return BaseEditPage.extend({
        init: function () {
            this._super();
        },
        bindEvent: function () {
            this._super();
        },
        onPageLoad: function () {
            this._super();
        },

        /**
         * 比分
         * @param e
         * @param option
         */
        scoreFn: function (e, option) {
            var _this = this;
            var isView = $("[name='isView']").val();
            if (!isView) {
                var _url = "/reaccount/resettlementScore.html";
            } else if(isView=='0') {
                var _url = "/reaccount/reSureScore.html";
            }
            window.top.topPage.ajax({
                url: root + _url,
                data: window.top.topPage.getCurrentFormData(e),
                cache: false,
                type: "POST",
                success: function (data) {
                    $("body").html(data);
                    page.resizeDialog();
                    e.page.onPageLoad();
                },
                error: function (data) {
                    $(e.currentTarget).unlock();
                }
            });
            $(e.currentTarget).unlock();
        }
    });
});