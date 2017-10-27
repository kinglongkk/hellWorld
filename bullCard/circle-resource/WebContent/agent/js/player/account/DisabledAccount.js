/**
 * Created by jeff on 15-12-20.
 */
define(['common/BaseEditPage'], function (BaseEditPage) {

    return BaseEditPage.extend({
        init: function () {
            this._super();
        },
        bindEvent: function () {
            this._super();
        },
        onPageLoad: function () {
            this._super();

        },
        /**
         * 预览编辑切换
         * @param event
         * @param option
         */
        toPreview : function( event , option ){
            var that = this;
            var edit = !!option.edit;
            if(edit){
                /*改变为编辑状态*/
                $("._preview").addClass("hide");
                $("._edit").removeClass("hide");
                //select.enable('.reason-select');
            }else{
                /*切换为预览状态*/
                $("._edit").addClass("hide");
                $("._preview").removeClass("hide");
                //select.disable('.reason-select');
                that._changePreviewInner();
            }

            /*解锁按钮*/
            $(event.currentTarget).unlock();
            //that.resizeDialog();
        },
        /**
         * 根据下拉设置值 内容值
         * @param event
         * @param option
         */
        setDisabledReason:function( event , option ){
            var $this = $(event.currentTarget);
            if($this.attr('holder')!=undefined && $this.attr('holder')!=""){
                $(".reason-content").html($this.attr('holder'));
                $("[name=groupCode]").val($this.attr('groupCode'));
            }else{
                $(".reason-content").html("");
                $("[name=groupCode]").val("");
            }
            this.reasonPreviewMore.viewFailureDetail(event);
            this.resizeDialog();
            $this.unlock();

        },
        /**
         * 将编辑框里面的内容填充到预览标签中
         */
        _changePreviewInner:function(){
            $('[data-preview]').each(function(){
                var $this = $(this);
                $($this.data().preview).html($this.val());
            });
        },
        previewMore:function(event,option){
            if($("[name=groupCode]").val()){
                option.target === 'true' ? $(".previewMore_some").removeClass("hide"):$(".previewMore_some").addClass("hide");
                this.reasonPreviewMore.previewMore(event,option);
            }
            $(event.currentTarget).unlock();
        },
        toConfirm:function(e){
            var _this = this;
            window.top.topPage.closeDialog();
            var _page = window.top.topPage;
            window.top.topPage.showConfirmDynamic(window.top.message.account['master.account.disabled.tipsTitle'],
                window.top.message.account['master.account.disabled.content'],window.top.message.common['OK'],
                window.top.message.common['cancel'],function(result){
                    if(result){
                        _page.ajax({
                            type:"POST",
                            url:root+'/share/account/setAccountDisabled.html',
                            data:_page.getCurrentFormData(e),
                            dataType:"JSON",
                            sync:false,
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