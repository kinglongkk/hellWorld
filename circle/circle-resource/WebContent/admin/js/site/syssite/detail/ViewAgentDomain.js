define(['common/BasePage', 'common/Pagination'], function(BasePage,Pagination) {
    var _this=this;
    return BasePage.extend({
        pagination : null,
        /**
         * 初始化及构造函数，在子类中采用
         * this._super();
         * 调用
         */
        init: function (formSelector) {
            this.formSelector = "#viewAgentDomainForm";
            this.pagination = new Pagination(this.formSelector);
            this._super(this.formSelector);
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
            this.pagination.processOrderColumnTag(this);
            $(".tab-content > .tab-pane").css("display","block");
            $("div.tab-center").css("display","block");
        },
        /**
         * 当前对象事件初始化函数
         */
        bindEvent: function () {
            this._super();
            var _this = this;
            $(this.formSelector).on("click","table tbody input[type=checkbox]", function (e) {
                var $funMoreMenu= $(".function-menu-show",window.top.topPage.getCurrentForm(e));
                if(!_this.getSelectIdsArray(e).length)
                {
                    $funMoreMenu.css("display","").removeClass('show').addClass('hide');
                }
                else
                {
                    $funMoreMenu.css("display","").removeClass('hide').addClass('show');
                }
            });

            $("a","#two-detail").on("click",function(){
                var $href = $(this).attr("data-href");
                $(this).parents("div.tab-content").load(root + $href);
            })
        },

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

        /**
         * 执行查询
         * @param event         事件对象
         */
        query : function(event,option) {
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

    });
});