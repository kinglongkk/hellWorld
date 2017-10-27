//模板页面
define(['common/BaseEditPage','bootstrapswitch'], function(BaseEditPage,Bootstrapswitch) {

    return BaseEditPage.extend({
        bootstrapswitch:Bootstrapswitch,
        /**
         * 初始化及构造函数，在子类中采用
         * this._super();
         * 调用
         */
        init: function (title) {
            this.formSelector = "form";
            this._super();
            //switch
            this.unInitSwitch($("[name='my-checkbox']"))
                .bootstrapSwitch();
        },
        /**
         * 页面加载和异步加载时需要重新初始化的工作
         */
        onPageLoad: function () {
            /**
             * super中已经集成了
             *      验证、
             *      chosen Select
             * 控件的初始化
             */
            this._super();
        },
        /**
         * 当前页面所有事件初始化函数
         */
        bindEvent: function () {
            this._super();
            var _this = this;
            //这里初始化所有的事件
            $(this.formSelector).on("switchChange.bootstrapSwitch", "#paramValue", function (event, state) {
                var _this=this;
                var paramId=$("#paramId").val();
                var paramValue = $("#paramValue:checked").val()
                var type=$("#type").val();
                var showMsg="";
                if(state){
                    showMsg=$(_this).attr("close"+type);
                }else{
                    showMsg=$(_this).attr("open"+type);
                }
                $("#showMsg").text(showMsg);
                $("#paramValue").val(state);
            });
            //开和关显示内容不一样

        }
    });
});