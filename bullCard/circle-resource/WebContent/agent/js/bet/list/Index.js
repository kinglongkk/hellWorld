//模板页面
define(['common/BaseListPage'], function(BaseListPage) {
    var _this=this;
    return BaseListPage.extend({
        /**
         * 初始化及构造函数，在子类中采用
         * this._super();
         * 调用
         */
       // selectPure:null,
        init: function (title) {
            this.formSelector = "#mainFrame form";
            this._super("formSelector");
            $('.help-popover').popover();
        },
        /**
         * 页面加载事件函数
         */
        onPageLoad: function () {
            /**
             * super中已经集成了
             *      验证、
             *      排序、
             *      分页、
             *      chosen Select
             * 控件的初始化
             */
            this._super();
            $('.help-popover').popover();
        },
        /**
         * 当前对象事件初始化函数
         */
        bindEvent: function () {
            /**
             * super中已经集成了
             *      列头全选，全不选
             *      自定义列
             *      自定义查询下拉
             * 事件的初始化
             */
            this._super();
            var _this = this;


        },
        /**
         * 检查是否选中了记录
         * @param e
         * @returns {boolean}
         */
        valiSelected: function (e,opt) {
            var selectIds = this.getSelectIds(e);
            if (selectIds.ids) {
                window.top.topPage.doAjax(e,opt);
                return false;
            } else {
                window.top.topPage.showErrorMessage(window.top.message.common['record.choose.first']);
            }

        }
    });
});