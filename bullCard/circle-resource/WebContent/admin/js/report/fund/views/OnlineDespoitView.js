/**
 * 资金管理-充值审核
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
         * 回调：审核通过后回调到充值记录列表页面
         */
        back: function (e, option) {
            if(window.top.page.status) {
                $("a[data-rel*='goToLastPage']").click();
                window.top.page.status = false;
            }
        }
    });
});