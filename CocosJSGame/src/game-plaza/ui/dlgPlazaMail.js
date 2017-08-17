/*
 *大厅消息、邮件界面
 * Author: 	YangJiazhen
 * Date:	2017.4.6
 *
 * 功能：
 * 大厅邮件控件交互
 * */
 DLG_CREATOR[ID_DlgPlazaMail] = function() {
     return new DlgPlazaMail();
 };

 var DlgPlazaMail = DlgBase.extend({
     ctor: function() {

     },

     onCreate: function() {
         this.init();
     },

     onClose: function() {

     },

     init: function() {

         // 初始化数组
         this.msgList = [];

         // 从文件载入
         var json = ccs.load(res.dlgPlazaMsgNode_json);
         this._rootWidget = json.node;

         //自适应屏幕大小
         var sizeDir = cc.director.getWinSize();
         this._rootWidget.setContentSize(sizeDir);
         ccui.helper.doLayout(this._rootWidget);

         // 窗口
         this._rootWidget.x = sizeDir.width / 2;
         this._rootWidget.y = sizeDir.height / 2;

         var panel_msg = this._rootWidget.getChildByName("Panel_Root").getChildByName("Image_bg");
         var btn_close = panel_msg.getChildByName("Button_Close");
         btn_close.addTouchEventListener(function(sender, type){
             if (ccui.Widget.TOUCH_ENDED == type) {
                 UIMgr.getInstance().closeDlg(ID_DlgPlazaMail, false);
             }
         }, this);

         this.msgListView = panel_msg.getChildByName("ListView_Msg");

         PlazaMailMsg.getInstance().sendQueryMailListData(null);
         // this.updateMsgListView();
     },

     updateMailListData: function (data) {
        if (data == null) return 1;
        var count = this.msgList.length;
        this.msgList[count] = data;

        if (this.msgList[count].dwMsgNum == this.msgList.length) {
            this.updateMsgListView();
            return 1;
        }

        return 0;
     },

     updateMsgListView: function () {

         // 先移除
         this.msgListView.removeAllChildren();

         // 载入自定义cell
         var json = ccs.load(res.dlgMsgListViewCellNode_json);
         var msgNode = json.node;

         var listViewSize = this.msgListView.getSize();

         for (var i = 0; i < this.msgList.length; i++) {
             var panel;
             if (this.selectCell == i) {
                 panel = msgNode.getChildByName("Panel_OpenCell");
             }
             else {
                 panel = msgNode.getChildByName("Panel_CloseCell");
             }
             var msgWidget = panel.clone();

             msgWidget.x = listViewSize.width / 2;

             msgWidget.Text_Title = msgWidget.getChildByName("Text_Title");
             msgWidget.Text_Title.setString(this.msgList[i].sTitle);
             msgWidget.Text_Detail = msgWidget.getChildByName("Text_Detail");
             msgWidget.Text_Detail.setString(this.msgList[i].sContent);
             msgWidget.Text_Time = msgWidget.getChildByName("Text_Time");

             var timeJson = this.msgList[i].tConcludeTime;
             msgWidget.Text_Time.setString(timeJson.wYear+"."+timeJson.wMonth+"."+timeJson.wDay+"."+timeJson.wHour+"."+timeJson.wMinute);

             msgWidget.setTag(i);
             msgWidget.setTouchEnabled(true);
             msgWidget.addTouchEventListener(this.cellDidSelect, this);

             this.msgListView.pushBackCustomItem(msgWidget);
         }
     },

     cellDidSelect: function(sender, type) {
         if (ccui.Widget.TOUCH_ENDED == type) {
             if (this.selectCell == sender.getTag()) {
                 this.selectCell = -1;
             }
             else {
                 this.selectCell = sender.getTag();
             }

             this.updateMsgListView();
         }
     },
 });
