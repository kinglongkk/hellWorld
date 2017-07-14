/*
 * 大厅邮件 网络接口
 * Author: 	YangJiazhen
 * Date:	2017.4.6
 *
 * 功能：邮件相关网络接口处理
 * */

 var g_plazaMailMsg = null;
 var  PlazaMailMsg = cc.Class.extend({
     ctor: function(){},

     // 发送指令获取邮件列表
     sendQueryMailListData: function(data) {
         var dataBuilder = new DataBuilder();
         dataBuilder.init(24);

         dataBuilder.build([
             ["dwUserID", "DWORD", g_objHero.getUserId()],  // 用户ID
             ["dwMsgNum", "DWORD", 10],                      // 一次请求的条数
             ["tConcludeTime", "SYSTEMTIME", 0]
         ]);

         LogonMsgHandler.getInstance().connect(function () {
             if (g_logonSocket.status == SOCKET_STATUS._SS_CONNECTED) {
                 console.log("准备发送请求消息指令");
                 g_logonSocket.sendData(MDM_CS_MANAGER_SERVICE, SUB_LOGON_CS_C_SYSTEM_MESSAGE, dataBuilder.getData());
             }
         });
     },

     // 邮件指令返回
     onMsgGetMailListRet: function(subCmd, data) {

         console.log("消息列表指令返回了");
         switch (subCmd) {
             case SUB_LOGON_CS_S_SYSTEM_MESSAGE:
                 this.onSubMailList(data);
                 break;
             default:
                 break;
         }
     },

     // 处理系统消息列表
     onSubMailList: function(data) {
         var dataParser = new DataParser();
         dataParser.init(data);
         var parseData = dataParser.parse([
             ["dwMsgID", "DWORD"],          // 消息ID
             ["dwMsgIndex", "DWORD"],       // 消息索引
             ["dwMsgNum", "DWORD"],         // 时间
             ["tConcludeTime", "SYSTEMTIME"],    // 时间
             ["sTitle", "TCHARS", 1024],    // 标题
             ["sContent", "TCHARS", 1024]   // 详情

         ]);

         cc.log("返回json数据 = " + JSON.stringify(parseData));

         var dlgMail = UIMgr.getInstance().getDlg(ID_DlgPlazaMail);
         if (dlgMail) {
             var nRet = dlgMail.updateMailListData(parseData);
             if (nRet == 1) {
                 cc.log("数据已取完，关闭socket");
                 //关闭连接
                 LogonMsgHandler.getInstance().close();
             }
         }
     },
 });

 PlazaMailMsg.getInstance = function() {
     if (g_plazaMailMsg == null) {
         g_plazaMailMsg = new PlazaMailMsg();
     }
     return g_plazaMailMsg;
 }