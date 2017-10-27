define(['common/BasePage'], function(BasePage) {

    return BasePage.extend({
        /**
         * 初始化及构造函数，在子类中采用
         * this._super();
         * 调用
         */
        init: function (title) {
            this.formSelector = "#agentDetail";
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
            $(this.formSelector).on("click", ".propormpt", function () {
                alert("该链接内容开发中！");
            });
            $(this.formSelector).on("click", ".funds", function () {
                $("#funds").click();
            });
            var _this = this;
            //这里初始化所有的事件
            /*有标签页时调用*/
            this.initShowTab();

        },
        toTmpl:function(e,btnOption){
            if(e.returnValue){
                $("#tot").attr('href','/noticeTmpl/tmpIndex.html');
                $("#tot").click();
            }
        },
        reloadView:function( event , option){
            if(event.returnValue){
                $("#reloadView").click();
            }
        },
        reloadViewWithoutReturnValue:function( event , option){
            $("#reloadView").click();
        },
        returnPage : function (e) {
            if(e.returnValue==true){
                $("#reloadView").click();
            }
        }

    });
});