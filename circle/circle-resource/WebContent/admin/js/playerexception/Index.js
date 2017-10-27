/**
 * 异常玩家查询
 * Created by black on 2017/2/15.
 */
define(['common/BaseListPage'], function(BaseListPage) {

    return BaseListPage.extend({
        /**
         * 初始化及构造函数，在子类中采用
         * this._super();
         * 调用
         */
        init: function () {
            this.formSelector = "#mainFrame form";
            this._super("formSelector");
            $('.help-popover').popover();

            //将日期添加为必填项
            $("#searchDate").attr("required","required");
            $("#searchDate").attr("title", "此为必填项");
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
         * 执行查询
         * @param event         事件对象
         */
        query : function(event,option) {

            var username = $("input[name='search.username']").val();
            var winRates = $("input[name='search.winRates']").val();
            var winRound = $("input[name='search.winRound']").val();
            var winPercent = $("input[name='search.winPercent']").val();
            var withdrawCount = $("input[name='search.withdrawCount']").val();
            var withdrawTotal = $("input[name='search.withdrawTotal']").val();
            if (username == "" && winRates == "" && winRound == "" &&
                winPercent == "" && withdrawCount == "" && withdrawTotal == "") {

            } else {
                $(":input").removeAttr("required","required");
                $(":input").removeAttr("title", "请再填写一个搜索条件");

                _super.query(event, option);
            }
        },
    });
});