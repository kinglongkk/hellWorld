define(['common/BaseListPage', 'common/Pagination'], function (BaseListPage, Pagination) {

    return BaseListPage.extend({
        /**
         * 初始化及构造函数，在子类中采用
         * this._super();
         * 调用
         */
        init: function () {
            this.formSelector = "form[name=playerdetailForm]";
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
        }
    });

});