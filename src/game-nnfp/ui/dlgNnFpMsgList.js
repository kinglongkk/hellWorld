DLG_CREATOR[ID_DlgNnFpMsgList] = function() {
    return new DlgNnFpMsgList();
};

var DlgNnFpMsgList = DlgBase.extend({
    ctor: function () {
        this.msgList  = [];
    },

    onCreate: function () {
        this.init();
    },

    onClose: function () {},

    init: function () {
        // 从文件载入
        var json = ccs.load(res.dlgNnFpChooseTextChatScene_json);
        this._rootWidget = json.node;

        //自适应屏幕大小
        var sizeDir = cc.director.getWinSize();
        this._rootWidget.setContentSize(sizeDir);
        ccui.helper.doLayout(this._rootWidget);

        this.msgBg = this._rootWidget.getChildByName("Panel_bg");
        this.msgBg.setTouchEnabled(true);
        this.msgBg.addTouchEventListener(function (sender, type) {
            if (ccui.Widget.TOUCH_ENDED === type) {
                UIMgr.getInstance().closeDlg(ID_DlgNnFpMsgList);
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
        this.selectBg = "gameNnFpPlist/nnui0034b.png";
        this.selectedBg = "gameNnFpPlist/nnui0034c.png";
        for (var i = 0; i < data.length; i++) {
            var msgWidget = new ccui.ImageView(this.selectBg, ccui.Widget.PLIST_TEXTURE);
            msgWidget.setTag(i);
            msgWidget.setAnchorPoint(cc.p(0.5, 0.5));
            msgWidget.setTouchEnabled(true);
            msgWidget.addTouchEventListener(function (sender, type) {
                if (ccui.Widget.TOUCH_ENDED === type) {
                    sender.loadTexture(this.selectedBg, ccui.Widget.PLIST_TEXTURE);
                	GameFrameMsg.getInstance().sendWordsMsg(this.msgList[sender.getTag()], sender.getTag());
                    UIMgr.getInstance().closeDlg(ID_DlgNnFpMsgList);
                }
            }, this);

            var msgText = new ccui.Text();
            msgText.setFontSize(26);
            msgText.setTextVerticalAlignment(cc.VERTICAL_TEXT_ALIGNMENT_CENTER);
            msgText.setTextHorizontalAlignment(cc.TEXT_ALIGNMENT_CENTER);
            msgText.setContentSize(msgWidget.getContentSize());
            msgText.setString(data[i]);
            msgText.setAnchorPoint(cc.p(0.5, 0.5));
            msgText.x = msgWidget.width / 2;
            msgText.y = msgWidget.height / 2;
            msgWidget.addChild(msgText);
            this.msgListView.pushBackCustomItem(msgWidget);
        }
    }
});