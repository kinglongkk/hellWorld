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
        queryTemp : function(event,option) {
            var $form = $(window.top.topPage.getCurrentForm(event));
            var betViewLink = $("[name='search.betViewLink']").val();
            var _url = '';
            if (betViewLink=='re') {
                _url = '/vMatchHistory/list.html';
            } else if (betViewLink=='pd') {
                _url = '/vMatchHistoryBd/list.html';
            } else if (betViewLink=='hf') {
                _url = '/vMatchHistoryHf/list.html';
            } else if (betViewLink=='to') {
                _url = '/vMatchHistoryTotal/list.html';
            } else {
                _url = '/vMatchHistory/list.html';
            }
            if(!$form.valid || $form.valid()) {
                window.top.topPage.ajax({
                    loading:true,
                    url:root+_url,
                    type:"post",
                    data:this.getCurrentFormData(event),
                    success:function(data){
                        var $result=$("#mainFrame");
                        $result.html(data);
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
    });
});