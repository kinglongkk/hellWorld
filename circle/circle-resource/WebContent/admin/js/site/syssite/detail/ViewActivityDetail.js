/**
 *
 */
define(['common/BaseViewPage'], function(BaseViewPage) {

    return BaseViewPage.extend({
        init: function () {
            this._super();

        },
        /**
         * 页面加载事件函数
         */
        onPageLoad: function () {
            this._super();
        },

        /**
         * 当前对象事件初始化函数
         */
        bindEvent: function () {
            this._super();
            var _this = this;
            $(_this.formSelector).on("click",".activityTag", function () {
                var lang=$(this).attr("name");
                $(".contentDiv").hide();
                $("#content"+lang).removeClass("hide");
                $("#content"+lang).show();
                $(".activityTag").removeClass("btn-outline");
                $(".activityTag").addClass("btn-outline");
                $(this).removeClass("btn-outline");
            });
        }
    })


});