define(['common/BaseListPage'], function(BaseListPage) {
    var _this=this;
    return BaseListPage.extend({
        /**
         * 初始化及构造函数，在子类中采用
         * this._super();
         * 调用
         */
        noRecordMessage:window.top.message.common["find.norecord"],
        init: function (title) {
            this.formSelector = "#mainFrame form";
            this._super("formSelector");
            this.noRecordMessage = window.top.message.common["find.norecord"];
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
            $(".tab-pane").css("display","block");
            $("ul li a","div.panel").on("click",function(e){
                var $href = $(this).data("href");
                $("#mainFrame").load(root+$href);
            });
            $("div.tab-center").css("display","block");
        },
        /**
         * 当前对象事件初始化函数
         */
        bindEvent: function () {
            this._super();

            $("a","div.sale").on("click",function(){
                var that = this;
                var _data = {'siteId':$("#siteId").val()};
                window.top.topPage.ajax({
                        loading:true,
                        url:root+$(that).attr("data-href"),
                        data:_data,
                        headers: {
                            "Soul-Requested-With":"XMLHttpRequest"
                        },
                        type:"get",
                        success:function(data){
                            $(that).siblings().removeClass("current");
                            $(that).addClass("current");
                            $("div.tab-center").remove();
                            $(that).parents("div.tab-pane").append(data);
                            $("div.tab-center").css("display","block");
                        },
                        error:function(data, state, msg){
                            window.top.topPage.showErrorMessage(window.top.message.common["server.error"]);
                        }}
                );
            });

            $("a.languageA").on("click",function(){
                $(this).parents("div.dlang").find("a").addClass("btn-outline");
                $(this).removeClass("btn-outline");
                var aname = $(this).attr("name");
                $("div.langx").css("display","none");
                $("div."+aname).css("display","block");
            });
        },

        requery:function(event,option) {
            $("#mainFrame").load(window.top.topPage.getCurrentFormAction(event));
        },

        /**
         * 搜索查询
         * @param event
         * @param option
         */
        searchQuery:function(event,option) {
            var $form = $(window.top.topPage.getCurrentForm(event));
            if(!$form.valid || $form.valid()) {
                window.top.topPage.ajax({
                    loading:true,
                    url:window.top.topPage.getCurrentFormAction(event),
                    headers: {
                        "Soul-Requested-With":"XMLHttpRequest"
                    },
                    type:"post",
                    data:this.getCurrentFormData(event),
                    success:function(data){
                        $("#mainFrame").html(data);
                        event.page.onPageLoad();
                        event.page.toolBarCheck(event);
                        $(event.currentTarget).unlock()},
                    error:function(data, state, msg){
                        window.top.topPage.showErrorMessage(window.top.message.common["server.error"]);
                        $(event.currentTarget).unlock();
                    }});
            } else {
                $(event.currentTarget).unlock();
            }
        },

        /**
         * 白名单查询
         * @param event
         * @param option
         */
        query:function(event,option) {
            window.top.topPage.ajax({
                loading:true,
                url:window.top.topPage.getCurrentFormAction(event),
                headers: {
                    "Soul-Requested-With":"XMLHttpRequest"
                },
                type:"post",
                data:this.getCurrentFormData(event),
                success:function(data){
                    $("#mainFrame").html(data);
                    event.page.onPageLoad();
                    $(event.currentTarget).unlock()},
                error:function(data, state, msg){
                    window.top.topPage.showErrorMessage(window.top.message.common["server.error"]);
                    $(event.currentTarget).unlock();
                }});
        }
    });
});