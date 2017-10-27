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
            /*$("ul li a","div.panel").on("click",function(e){
                var $href = $(this).data("href");
                $("#mainFrame").load(root+$href);
            });*/
        },
        /**
         * 当前对象事件初始化函数
         */
        bindEvent: function () {
            this._super();
        },

        /*requery:function(event,option) {
            $("#mainFrame").load(window.top.topPage.getCurrentFormAction(event));
        },

        reloadView:function(e,option){
            if(e.returnValue){
                var id = $("[name=id]").val();
                $("#mainFrame").load(root+"/vSiteMasterManage/viewBasic.html?search.id="+id);
            }
        },*/

        getSelectIdsArray:function(e,option)
        {
            var checkedItems = [],counter = 0;
            $("table tbody input[type=checkbox]",this.getCurrentForm(e)).not("[name=my-checkbox]").each(function(node,obj) {
                if(obj.checked) {
                    checkedItems[counter] = obj.value;
                    counter++;
                }
            });

            return checkedItems;
        },

        getSelectIds:function(e,option)
        {
            return {ids:this.getSelectIdsArray(e,option).join(",")};
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
                    url:root+$("div.panel ul li.active a").attr("data-href"),
                    headers: {
                        "Soul-Requested-With":"XMLHttpRequest"
                    },
                    type:"post",
                    data:this.getCurrentFormData(event),
                    success:function(data){
                        $("div.search-list-container").html(data);
                        event.page.onPageLoad();
                        $(event.currentTarget).unlock()},
                    error:function(data, state, msg){
                        window.top.topPage.showErrorMessage(window.top.message.common["server.error"]);
                        $(event.currentTarget).unlock();
                    }});
            } else {
                $(event.currentTarget).unlock();
            }
        },

        accountSaveCallBack:function(event,option) {
            if (event.returnValue==true) {
                this.query(event,option);
            } else if (event.returnValue) {
                $("#mainFrame").load(root+"/vSysSiteManage/siteBasic.html?search.step=1&search.sysUserId="+event.returnValue);
            }
        },

    });
});