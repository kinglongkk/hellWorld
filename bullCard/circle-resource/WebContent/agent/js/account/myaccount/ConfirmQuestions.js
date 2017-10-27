define(['common/BaseEditPage'], function (BaseEditPage) {

    return BaseEditPage.extend({
        /**
         * 初始化及构造函数，在子类中采用
         * this._super();
         * 调用
         */
        init: function (title) {
            this.formSelector = "form";
            this._super();
        },
        /**
         * 页面加载和异步加载时需要重新初始化的工作
         */
        onPageLoad: function () {
            this._super();
        },
        /**
         * 当前页面所有事件初始化函数
         */
        bindEvent: function () {
            //这里初始化所有的事件
            $(".answer").on("change",function(){
                var bo = false;
                $(".answer").each(function(){
                    var val = $(this).val();
                    var attr = $(this).attr("tt");
                    var answer = $("#" + attr).val();
                    if(answer==val.trim()){
                        bo=true;
                    }else{
                        bo =false;
                    }
                });
                if(!bo){
                    $(".answer_bt").addClass("disabled")
                }else{
                    $(".answer_bt").removeClass("disabled")
                }
            })
        },
        /**
         * 操作回调，event.returnValue==true时才执行 showPage方法，
         * 其他的操作回调，请参考这里，不要任何时候都执行刷新操作
         * @param event
         */
        callBackQuery: function (event) {
            if (event.returnValue) {
                window.top.topPage.showPage();
            }
        },
        myCallbak: function (e, option) {
            this.returnValue = true;
            window.top.topPage.closeDialog();
        },
        myValidateForm:function(e,btnOption){
            if (!this.validateForm(e)) {
                return false;
            }
            var serialize = $(this.getFirstParentByTag(e, 'form')).serialize();
            btnOption.target = btnOption.target.replace('{xxx}',serialize);
            return true;
        }

    });
});