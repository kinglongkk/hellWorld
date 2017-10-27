define(['common/BaseEditPage'], function(BaseEditPage) {
    var _this=this;
    return BaseEditPage.extend({
        /**
         * 初始化及构造函数，在子类中采用
         * this._super();
         * 调用
         */
        init: function (title) {
            this._super();
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
            $("a.languageA").on("click",function(){
                $(this).parents("div.dlang").find("a").addClass("btn-outline");
                $(this).removeClass("btn-outline");
                var aname = $(this).attr("name");
                $("div.langx").css("display","none");
                $("div."+aname).css("display","block");
            });
        },
        /**
         * 当前对象事件初始化函数
         */
        bindEvent: function () {
            this._super();
        },
    });
});