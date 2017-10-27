//账号冻结
define(['common/BaseEditPage', 'bootstrapswitch'], function (BaseEditPage, Bootstrapswitch) {

    return BaseEditPage.extend({
        /**
         * 初始化及构造函数，在子类中采用
         * this._super();
         * 调用
         */
        init: function (formSelector) {
            this.formSelector = "form";
            this._super(this.formSelector);
        },
        /** 当前对象事件初始化函数 */
        bindEvent: function () {
            this._super();
        },

        /**
         * 确认停用
         * @param e
         * @param option
         */
        disabled: function (e, option) {
            var url = this.getCurrentFormAction(e);
            window.location.href = url;
        },

        /**
         * 安全密码
         * @param e
         * @param option
         */
        sureStop:function(e,option) {
            var _this = this;
            window.top.topPage.ajax({
                url: root+'/accountManage/confirmDisabled.html',
                data:window.top.topPage.getCurrentFormData(e),
                cache: false,
                type: "POST",
                success: function (data) {
                    $("[name=editor]",_this.formSelector).remove();
                    $("div.oneFoot").remove();
                    $("div.modal-body").append(data);
                    $("div.secFoot").show();
                    page.resizeDialog();
                    e.page.onPageLoad();
                }
            });
            $(e.currentTarget).unlock();
        },

        toConfirm:function(e){
            var _this = this;
            window.top.topPage.closeDialog();
            var _page = window.top.topPage;
            window.top.topPage.showConfirmDynamic(window.top.message.account['player.account.disabled.tipsTitle'],
                window.top.message.account['player.account.disabled.content'],window.top.message.setting['common.ok'],
                window.top.message.setting['common.cancel'],function(result){
                    if(result){
                        _page.ajax({
                            type:"POST",
                            url:root+'/accountManage/saveAccountDisabled.html',
                            data:_page.getCurrentFormData(e),
                            dataType:"JSON",
                            error:function(data){
                            },
                            success: function (data) {
                                if(data.state){
                                    _page.showSuccessMessage("操作成功!",function(){
                                        _page.showPage();
                                    });
                                }else{
                                    _page.showErrorMessage(data.msg,null);
                                }
                            },
                        });
                    }else{
                        _page.closeDialog();
                    }
                });
        }
    });
});