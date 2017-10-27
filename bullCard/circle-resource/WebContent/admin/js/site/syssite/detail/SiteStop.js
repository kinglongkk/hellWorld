define(['common/BaseEditPage'], function(BaseEditPage) {
    var _this=this;
    return BaseEditPage.extend({
        /**
         * 初始化及构造函数，在子类中采用
         * this._super();
         * 调用
         */
        init: function (title) {
            this.formSelector = "#mainFrame form";
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
            this._super();
        },

        /**
         * 预览账号停用
         * @param e
         * @param option
         */
        previewSiteStop:function(e,option) {
            var _this = this;
            //var data = {'search.id':$("[name='result.id']").val(),'password':$("[name='password']").val()};
            window.top.topPage.ajax({
                url: root+'/sysSite/previewSiteStop.html',
                data:window.top.topPage.getCurrentFormData(e),
                cache: false,
                type: "POST",
                success: function (data) {
                    $("[name=editor]",_this.formSelector).remove();
                    $(_this.formSelector).append(data);
                    page.resizeDialog();
                },
                error:function(data, state, msg){
                    window.top.topPage.showErrorMessage(window.top.message.common["permission.error"]);
                    $(event.currentTarget).unlock();
                }
            });
            $(e.currentTarget).unlock();
        },

        /**
         * 确认预览
         * @param e
         * @param option
         */
        sureSiteStop:function(e,option) {
            var _this = this;
            var data = {'result.id':$("[name='result.id']").val()};
            window.top.topPage.ajax({
                url: root+'/sysSite/sureSiteStop.html',
                data:data,
                cache: false,
                type: "POST",
                success: function (data) {
                    $("[name=preview]",_this.formSelector).remove();
                    $(_this.formSelector).append(data);
                    page.resizeDialog();
                }
            });
            $(e.currentTarget).unlock();
        },

        /**
         * 提交信息
         */
        saveSiteStop:function(){
            var url=root+"/sysSite/saveSiteStop.html";
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
        }

    });
});