define(['common/BaseListPage'], function(BaseListPage) {
     return BaseListPage.extend({

         init : function() {
            this._super();
             var _this = this;
         },

         /**
          * 页面加载和异步加载时需要重新初始化的工作
          */
         onPageLoad: function () {
             this._super();
             var _this = this;
         },

         bindEvent : function() {
             var _this = this;
             this._super();
         },
         /**
          * 回调,重新加载页面
          * @param e
          * @param option
          */
         reload:function(e,option) {
             if(e.returnValue){
                 $("[name=returnValue]").click();
             }
         },
         /**
          * 恢复默认参数
          * @param e
          * @param p
          */
         defaultParam: function (e,p) {
             var dataIds = "";
             $("tbody tr").each(function (e, p) {
                 if(dataIds!=""){
                     dataIds+=",";
                 }
                 dataIds +=$(this).attr("data-id");
             });
             window.top.topPage.ajax({
                 type:"post",
                 url:root+"/parameterConfig/defaultParam.html",
                 data:{"dataIds":dataIds},
                 success: function (data) {
                     var data = eval('('+data+')');
                     if (data.state) {
                         window.top.topPage.showSuccessMessage(data.msg, function (result) {
                             $("[name=returnValue]").click();
                         });
                     }
                 },
                 error: function (data) {
                     var data = eval('('+data+')');
                     window.top.topPage.showSuccessMessage(data.msg, function (result) {
                         $("[name=returnValue]").click();
                     });
                 }
             })
         }
    });
});
