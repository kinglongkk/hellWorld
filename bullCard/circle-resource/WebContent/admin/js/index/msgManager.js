define(['common/BasePage'],function(BasePage) {
   return BasePage.extend({
       /**
        * 初始化及构造函数，在子类中采用
        * this._super();
        * 调用
        */
       init : function() {
           this._super();
           this.showMsg();
           this.permissionPwdExistence();
           //this.updateIsReminderMsg();
       },
       /**
        * 显示/关闭消息下拉框
        */
       //FixMe Add By Tony 使用bindEvent
       showMsg : function() {
           $('.informations').children('a').click(function(){
               var href = $(this).attr("data-href");
               $(this).parent().find('dl').load(href);
               $(this).unlock();
           });
       },
       /**
        * 消息提醒
        */
       msgTip : function() {
           var span = $('.informations').children().children('span')[0];
           var msgCount = $(span).text();
           $('.informations').children().children('span').text(parseInt(msgCount)+1);
       },
       /**
        * 判断是否有未读消息(提示消息声音的条件：1、是否提醒消息标识为true;2、未读消息数量>0)
        * @returns {boolean}
        */
       hasMsg : function() {
           var span = $('.informations').children().children('span')[0];
           var msgCount = parseInt($(span).text());
           var isReminderMsg = $('#isReminderMsg').val();
           if(msgCount > 0 && isReminderMsg == 'true') {
               return true;
           } else {
               return false;
           }
       },
       /**
        * 修改是否提醒消息session值
        */
       updateIsReminderMsg : function() {
           window.top.topPage.ajax({
               url: root + '/index/updateIsReminderMsg.html',
               success: function(data) {

               },
               error : function(data) {

               }
           })
       },
       //判断权限密码是否已设置，未设置时弹窗设置框
       permissionPwdExistence: function () {
           var _this=this;
           window.top.topPage.ajax({
               url: root + '/index/permissionPwdExistence.html',
               dataType: "json",
               async:false,
               success: function (data) {
                   if(data){
                       window.top.topPage.doDialog({page:this},{text:window.top.message.privilege['title'],target: root + "/index/AddPrivilegesPassword.html",callback:""});
                   }
               }
           })
       }
   });
});