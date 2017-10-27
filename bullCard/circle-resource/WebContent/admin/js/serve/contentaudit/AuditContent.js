//模板页面
define(['common/BaseEditPage','bootstrapswitch','nestable','css!themesCss/jquery/plugins/jquery.nestable/jquery.nestable.css'], function(BaseEditPage,Bootstrapswitch,nestable) {

    return BaseEditPage.extend({
        /**
         * 初始化及构造函数，在子类中采用
         * this._super();
         * 调用
         */
        sw:true,

        init: function (title) {
            this.formSelector = "form";
            this._super();
            /*$('.help-popover').popover();*/
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
            $(this.formSelector).on("click",".langtag", function () {
                var lang=$(this).attr("name");
                $(".contentDiv").hide();
                $("#content"+lang).removeClass("hide");
                $("#content"+lang).show();
                $(".langtag").removeClass("current");
                $(this).addClass("current");
            });
            $(this.formSelector).on("click",".activityTag", function () {
                var lang=$(this).attr("name");
                $(".contentDiv").hide();
                $("#content"+lang).removeClass("hide");
                $("#content"+lang).show();
                $(".activityTag").removeClass("btn-outline");
                $(".activityTag").addClass("btn-outline");
                $(this).removeClass("btn-outline");
            });
        },
        auditPass:function(e,opt,msg){
            var _this = this;
            var data;
            if(opt.data){
                data = opt.data;
            }else{
                data = e.returnValue;
            }
            if(!data){
                _this.refreshPage(data);
                return;
            }
            if(data.success){
                _this.showSuccessMsg(data);

            }else{
                _this.showErrorMsg(data)
            }
            $(e.currentTarget).unlock();
        },
        showSuccessMsg :function(data){
            var _this = this;
            window.top.topPage.showSuccessMessage("操作成功!",function(){
                _this.refreshPage(data);
            });
        },
        showErrorMsg:function(data){
            var _this = this;
            if(data.errMsg!=""){
                //window.top.topPage.showErrorMessage(data.errMsg);
                window.top.topPage.showConfirmDynamic("提示消息",data.errMsg,"下一条","取消", function (state) {
                    if(state){
                        _this.refreshPage(data);
                    }
                });
            }else{
                window.top.topPage.showErrorMessage("操作失败", function (state) {
                    if(state){
                        _this.refreshPage(data);
                    }
                });
            }
        },
        refreshPage: function (data) {
            var type = data.result.contentType;
            var url = "/siteContent/toAuditLogo.html";
            if(type=="2"){
                url = "/siteContent/toAuditDocument.html";
            }else if(type=="3"){
                url = "/siteContent/toAuditActivity.html";
            }
            $("#mainFrame").load(root + url + "?siteId="+data.result.siteId+"&showIndex="+$("#currentPage").val());
        }
    });
});