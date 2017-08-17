/*
 *聊天气泡语选择页面
 * Author: 	YangJiazhen
 * Date:	2017.4.26
 *
 * 功能：
 *
 * */

DLG_CREATOR[ID_DlgWordChatList] = function() {
    return new DlgWordChatList();
};

var DlgWordChatList = DlgBase.extend({
    ctor: function () {
        this.msgList  = [];
    },

    onCreate: function () {
        this.init();
    },

    onClose: function () {

    },

    init: function () {
        // 从文件载入
        var json = ccs.load(res.dlgChooseTextChatSecene_json);
        this._rootWidget = json.node;

        //自适应屏幕大小
        var sizeDir = cc.director.getWinSize();
        this._rootWidget.setContentSize(sizeDir);
        ccui.helper.doLayout(this._rootWidget);

        this.msgBg = this._rootWidget.getChildByName("Panel_bg");
        this.msgBg.setTouchEnabled(true);
        this.msgBg.addTouchEventListener(function (sender, type) {
            if (ccui.Widget.TOUCH_ENDED == type) {
                UIMgr.getInstance().closeDlg(ID_DlgNNMsgList);
            }
        }, this);

        this.msgListView = this.msgBg.getChildByName("ListView_Msg");
    },

    updateMsgList: function (data) {
        if (!data || !data.length) {
            return;
        }

        this.msgList = data;
        this.msgListView.removeAllChildren();

        for (var i = 0; i < data.length; i++) {
            var msgWidget = new ccui.ImageView("default/img_nntb_chat_select_bg.png", ccui.Widget.PLIST_TEXTURE);
            msgWidget.setTag(i);
            msgWidget.setTouchEnabled(true);
            msgWidget.addTouchEventListener(function (sender, type) {
                if (ccui.Widget.TOUCH_ENDED == type) {
                	GameFrameMsg.getInstance().sendWordsMsg(this.msgList[sender.getTag()], sender.getTag());
                    UIMgr.getInstance().closeDlg(ID_DlgNNMsgList);
                }
            }, this);

            var msgText = new ccui.Text();
            msgText.setFontSize(30);
            msgText.setTextVerticalAlignment(cc.VERTICAL_TEXT_ALIGNMENT_CENTER);
            msgText.setTextHorizontalAlignment(cc.TEXT_ALIGNMENT_CENTER);
            msgText.setContentSize(msgWidget.getContentSize());
            msgText.setString(data[i]);
            msgText.setAnchorPoint(cc.p(0, 0));
            msgText.x = 0;
            msgText.y = 0;
            msgWidget.addChild(msgText);
            this.msgListView.pushBackCustomItem(msgWidget);
        }
    }
});