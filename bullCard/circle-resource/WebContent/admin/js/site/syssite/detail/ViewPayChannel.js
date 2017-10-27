define(['common/BaseEditPage'], function(BaseEditPage) {
    var _this=this;
    return BaseEditPage.extend({
        /**
         * 初始化及构造函数，在子类中采用
         * this._super();
         * 调用
         */
        init: function (title) {
            this.formSelector = "#viewPayChannelForm";
            this._super();

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
            $(".tab-pane").css("display","block");
        },

        /**
         * 当前对象事件初始化函数
         */
        bindEvent: function () {
            this._super();
            var _this = this;

            $("a","div.apitype").on("click",function(){
                var that = this;
                var _data = {'apiTypeId':$(this).attr("data-value"),'siteId':$("#siteId").val()};
                window.top.topPage.ajax({
                        loading:true,
                        url:root+'/site/detail/loadSiteGame.html',
                        data:_data,
                        headers: {
                            "Soul-Requested-With":"XMLHttpRequest"
                        },
                        type:"post",
                        success:function(data){
                            $(that).parents("div.apitype").find("a").addClass("btn-outline");
                            $(that).removeClass("btn-outline");
                            $("tbody").html(data);
                        },
                        error:function(data, state, msg){
                            window.top.topPage.showErrorMessage(window.top.message.common["server.error"]);
                        }}
                );
            });
        },

    });
});