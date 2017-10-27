define(['common/BaseEditPage'], function(BaseEditPage) {

    return BaseEditPage.extend({

        init : function() {
            this._super();
        },
        /**
         * 当前对象事件初始化函数
         */
        bindEvent : function(formSelector) {
            this.formSelector = "form";
            this._super();
        },
        /**
         * 重置密码确认弹出窗
         * @param e
         * @param opt
         */
        resetPwdByHandConfirm:function(e,opt){
            var that = this;
            var confirmMessage = '';
            if($('#isLogin').val()=='true'){
                confirmMessage = window.top.message.masterResetPwd['resetUserpwdByHandConfirm'].replace('{userName}',$("#userName").val()).replace("{resetTypeName}",$("#resetTypeName").val());
            }else{
                confirmMessage = window.top.message.masterResetPwd['resetUserPwdByMailLoginConfirm'].replace('{userName}',$("#userName").val()).replace("{resetTypeName}",$("#resetTypeName").val());
            }
            window.top.topPage.showConfirmMessage(confirmMessage,function(boo){
                if(boo){
                    that.resetPwd(e,opt);
                }else{
                    that.closePage();
                }
            });
            $(e.currentTarget).unlock();
        },
        resetPwd:function(e,opt){
            var that = this;
            window.top.topPage.ajax({
                url: root+"/vMasterManage/doRestUserPwdByHand.html",
                data:$(that.formSelector).serialize(),
                dataType:'json',
                error: function (data) {
                    $(e.target).unlock();
                },
                success: function (data) {
                    that.closePage();
                    $(e.target).unlock();
                    if (data.state)
                        window.top.topPage.showSuccessMessage(data.msg);
                    else
                        window.top.topPage.showErrorMessage(data.msg);
                }
            });
        }

    })
})