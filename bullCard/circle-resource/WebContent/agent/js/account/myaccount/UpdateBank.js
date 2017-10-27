/**
 * Created by cj on 15-8-24.
 */
define(['common/BaseEditPage' ], function (BaseEditPage) {

    return BaseEditPage.extend({
        init: function (title) {
            var that = this;
            this._super();
            this.formSelector = "form";
            $("#bankNo").on("change",function(){
                var $this = $(this);
                if(!$this.hasClass("error")){
                    window.top.topPage.ajax({
                        url:root+"/agentAccount/getBankInfo.html",
                        data:{
                            "search.bankCardBegin":$this.val()
                        },
                        success:function(data){
                            data = eval("("+data+")");
                            select.setValue($("._bank-select"),data.bankName);
                        }

                    })
                }
            });
        },
        onPageLoad: function () {
            this._super();
        },
        /**
         * 当前页面所有事件初始化函数
         */
        bindEvent: function () {
            this._super();
            //这里初始化所有的事件
            $("#reset_id").click(function(){
                $("#reset_div").find("input").val("");
            })
        },
        callBackQuery: function (event) {
            if (event.returnValue) {
                window.top.topPage.showPage();
            }
        },
        myCallbak: function (e, option) {
            if(option.data.state){
                this.returnValue = true;
                window.top.topPage.closeDialog();
            }
        },


    });
});