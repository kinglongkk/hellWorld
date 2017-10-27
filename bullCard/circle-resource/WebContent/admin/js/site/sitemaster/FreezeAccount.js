define(['common/BaseEditPage'], function (BaseEditPage) {

    return BaseEditPage.extend({
        /**
         * 初始化及构造函数，在子类中采用
         * this._super();
         * 调用
         */
        init: function () {
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
            $('.help-popover').popover();
        },

        /** 当前对象事件初始化函数 */
        bindEvent: function () {
            this._super();
        },
        /**
         * 提交预览冻结
         * @param e
         * @param option
         */
        previewFreezeAccount: function (e, option) {
            var _this = this;
            window.top.topPage.ajax({
                url: root + "/vMasterManage/previewFreezeAccount.html",
                data: window.top.topPage.getCurrentFormData(e),
                cache: false,
                type: "POST",
                success: function (data) {
                    $("[name=editor]",_this.formSelector).hide();
                    $("div.addFoot").hide();
                    $("div.modal-body").append(data);
                    $("div.preFoot").show();
                    page.resizeDialog();
                    e.page.onPageLoad();
                },
                error: function (data) {
                    $(e.currentTarget).unlock();
                }
            });
            $(e.currentTarget).unlock();
        },

        /**
         * 取消预览
         * @param e
         * @param option
         */
        cancelPreview:function(e,option) {
            $("[name=editor]",this.formSelector).show();
            $("[name=preview]",this.formSelector).remove();
            $("div.addFoot").show();
            $("div.preFoot").hide();
            page.resizeDialog();
            $(e.currentTarget).unlock();
        },

        /**
         * 提交
         * @param e
         * @param btnOption
         */
        submit:function(e,btnOption){//提交
            this.cancelPreview(e,btnOption);
            this.saveFreezeAccount();
        },

        /**
         * 提交信息
         */
        saveFreezeAccount:function(){
            var url=root+"/vMasterManage/saveFreezeAccount.html";
            var _this=this;
            window.top.topPage.ajax({
                url: url,
                data:$(this.formSelector).serialize(),
                cache: false,
                type: "POST",
                dataType:"json",
                success: function (data) {
                    if(data.state){
                        _this.returnValue=true;
                        _this.closePage();
                        window.top.topPage.showSuccessMessage(data.msg,null);
                    }else{
                        window.top.topPage.showErrorMessage(data.msg,null);
                    }
                }
            });
        },
    });
});