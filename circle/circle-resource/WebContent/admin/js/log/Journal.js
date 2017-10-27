/**
 * 玩家信息-日志
 */
define(['common/BaseListPage', 'common/Pagination'], function (BaseListPage, Pagination) {

    return BaseListPage.extend({
        /**
         * 初始化及构造函数，在子类中采用
         * this._super();
         * 调用
         */
        init: function () {
            this.formSelector = "form[name=journalForm]";
            this.pagination = new Pagination(this.formSelector);
            this._super();
        },
        bindEvent: function () {
            this._super();
            var _this = this;
        },
        onPageLoad: function () {
            this._super();
            this.pagination.processOrderColumnTag(this, $(this.formSelector));
        },
        /*query: function (e, option) {
            var form = this.getCurrentForm(e);
            var _this = this;
            window.top.topPage.ajax({
                url: this.getCurrentFormAction(e),
                data: this.getCurrentFormData(e),
                headers: {
                    "Soul-Requested-With":"XMLHttpRequest"
                },
                type: 'POST',
                success: function (data) {
                    $(form).html(data);
                    _this.onPageLoad();
                    //_this.pagination.processOrderColumnTag(_this, $(_this.formSelector));
                },
                error: function (data) {

                }
            });
        }*/
    });

});