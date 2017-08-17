/**
 * 聊天界面，包括语音和文字按钮
 *
 * **/

DLG_CREATOR[ID_DlgChatScene] = function() {
    return new DlgChatScene();
};

var DlgChatScene = DlgBase.extend({
    ctor: function () {

    },

    onCreate: function () {
        this.init();
    },

    onClose: function () {

    },

    init: function () {

        // 从文件载入
        var json = ccs.load(res.dlgLayer_chat_json);
        this._rootWidget = json.node;
        this._rootWidget.setLocalZOrder(40);
        var self = this;

        //自适应屏幕大小
        var sizeDir = cc.director.getWinSize();
        this._rootWidget.setContentSize(sizeDir);
        ccui.helper.doLayout(this._rootWidget);
        this.Panel_root = this._rootWidget.getChildByName("Panel_root");
        this.Panel_root.addTouchEventListener(function (sender, type) {
            if (ccui.Widget.TOUCH_ENDED == type){
                self.Panel_textChat.setVisible(false);
                self.Panel_root.setTouchEnabled(false);
            }
        }, this);

        this.Panel_btn = this.Panel_root.getChildByName("Panel_btn");
        this.BtnSounds = this.Panel_btn.getChildByName("Button_Sounds");
        this.BtnSounds.addTouchEventListener(function (sender, type) {
            var tempAmrPath = ((jsb.fileUtils ? jsb.fileUtils.getWritablePath() : "/") + "record.amr");
            if (ccui.Widget.TOUCH_ENDED == type ||
                ccui.Widget.TOUCH_CANCELED == type) {
                // 结束录音
                var dlg = UIMgr.getInstance().getDlg(ID_DlgSoundAnimation);
                if (!dlg) return;
                self.soundsEnd(type);
            }
            else if (ccui.Widget.TOUCH_BEGAN == type) {
                //关闭背景音乐
                cc.log("//关闭背景音乐")
                SoundMgr.getInstance().setPlayMusic(false);
                //播放录音动画
                showSoundAnimation(true);
                // 开始录音
                if(cc.sys.isNative){

                    if(cc.sys.os == cc.sys.OS_IOS) {
                        // 设置录制语音的路径
                        //jsb.reflection.callStaticMethod("HFAudio", "setRecordAmrPath:",tempAmrPath);

                        // 开始录制语音 2
                        //jsb.reflection.callStaticMethod("HFAudio", "startRecord");
                        yayaSdkMgr.getInstance().starRecord(tempAmrPath,1);
                    }
                    else if(cc.sys.os == cc.sys.OS_ANDROID){

                        // cc.log("开始调用android"+tempAmrPath);
                        // // 设置录制语音的路径
                        // jsb.reflection.callStaticMethod(
                        //     "org/cocos2dx/javascript/HFAudio",
                        //     "setRecordAmrPath",
                        //     "(Ljava/lang/String;)V",
                        //     tempAmrPath
                        // );
                        // // 开始录制语音 2
                        // jsb.reflection.callStaticMethod(
                        //     "org/cocos2dx/javascript/HFAudio",
                        //     "startRecord",
                        //     "()V"
                        // );
                        cc.log("//开始牙牙录音");
                        yayaSdkMgr.getInstance().starRecord(tempAmrPath,1);
                    }
                    else
                    {
                        cc.log("//开始牙牙录音");
                        yayaSdkMgr.getInstance().starRecord(tempAmrPath,1);
                    }
                }
            }
        }, this);


        this.BtnSendMsg = this.Panel_btn.getChildByName("Button_SendMsg");
        this.BtnSendMsg.addTouchEventListener(function (sender, type) {
            if (ccui.Widget.TOUCH_ENDED == type) {
                var Panel_textChat = sender.getChildByName("Panel_textChat");
                Panel_textChat.setVisible(!Panel_textChat.isVisible());
                self.Panel_root.setTouchEnabled(Panel_textChat.isVisible());
            }
        }, this);

        //
        this.Panel_textChat = this.BtnSendMsg.getChildByName("Panel_textChat");
        this.msgListView = this.Panel_textChat.getChildByName("ListView_Msg");

        var plaza = ClientData.getInstance().getPlaza();
        this.updateMsgList(LoadWordChatCfg.getInstance().getWordList(g_objHero.getGender(), plaza.getCurKindID()));
        this.Panel_textChat.setVisible(false);
    },

    setChatPos: function(posX, posY){
        var curPos = this.BtnSendMsg.getPosition();
        curPos.x = posX || curPos.x;
        curPos.y = posY || curPos.y;

        this.BtnSendMsg.setPosition(curPos);
    },
    setVoicePos: function(posX, posY){
        var curPos = this.BtnSounds.getPosition();
        curPos.x = posX || curPos.x;
        curPos.y = posY || curPos.y;

        this.BtnSounds.setPosition(curPos);
    },
    setDidalogZorder: function(localZorder){
        var zOrder = localZorder || 100;
        this._rootWidget.setLocalZOrder(zOrder);
    },

    soundsEnd: function (type) {
        // 结束录音
        //关闭录音动画
        var tempAmrPath = ((jsb.fileUtils ? jsb.fileUtils.getWritablePath() : "/") + "record.amr");
        showSoundAnimation(false);
        if(cc.sys.isNative){
            if(cc.sys.os == cc.sys.OS_IOS) {
                //jsb.reflection.callStaticMethod("HFAudio", "stopRecord");
            }
            else if(cc.sys.os == cc.sys.OS_ANDROID) {
                // jsb.reflection.callStaticMethod(
                //     "org/cocos2dx/javascript/HFAudio",
                //     "stopRecord",
                //     "()V"
                // );
                // 停止呀呀录音
                //yayaSdkMgr.getInstance().stopRecord();
            }
            else
            {
               // yayaSdkMgr.getInstance().stopRecord();
            }
        }

        if (ccui.Widget.TOUCH_CANCELED == type) {
            cc.log("录音结束重新设置声音 = ");
            SoundMgr.getInstance().setPlayMusic(LocalStorageMgr.getInstance().getMusicItem());
            yayaSdkMgr.getInstance().stopRecord();
        } else {
            // 发送录音
            if (jsb.fileUtils.isFileExist(tempAmrPath)) {
              //  GameFrameMsg.getInstance().sendVoiceReq(tempAmrPath);
            }
            else {
                cc.log("没有找到目录"+tempAmrPath);
            }

            var bMusic = LocalStorageMgr.getInstance().getMusicItem();
            cc.log("录音结束重新设置声音 = " + bMusic);
            //SoundMgr.getInstance().setPlayMusic(bMusic);
            yayaSdkMgr.getInstance().stopRecord();
        }
    },

    updateMsgList: function (data) {
        if (!data || !data.length) {
            return;
        }

        this.msgList = data;
        this.msgListView.removeAllChildren();

        var Image_msgTemp = this.Panel_textChat.getChildByName("Image_msgTemp");
        for (var i = 0; i < data.length; i++) {
            var msgWidget = Image_msgTemp.clone();
            msgWidget.setTag(i);
            msgWidget.setTouchEnabled(true);
            msgWidget.addTouchEventListener(function (sender, type) {
                if (ccui.Widget.TOUCH_ENDED == type) {
                    sender.loadTexture("default/img_nntb_chat_select_bg.png", ccui.Widget.PLIST_TEXTURE);
                    GameFrameMsg.getInstance().sendWordsMsg(this.msgList[sender.getTag()], sender.getTag());
                    this.Panel_textChat.setVisible(false);
                }
                else if (ccui.Widget.TOUCH_BEGAN == type){
                    sender.loadTexture("default/nnui0034c.png", ccui.Widget.PLIST_TEXTURE);
                }
                else{
                    sender.loadTexture("default/img_nntb_chat_select_bg.png", ccui.Widget.PLIST_TEXTURE);
                }
            }, this);

            var msgText = msgWidget.getChildByName("Text_msg");
            var strMsg = data[i];
            var wSize = msgWidget.getContentSize();
            var strLen = MyUtil.getStrLen(strMsg);
            cc.log("strMsg.length-------"+strLen);
            if(strLen>42){
                wSize.height += 30;
            }
            msgWidget.setContentSize(wSize);
            msgText.setPosition(cc.p(wSize.width/2.0,wSize.height/2.0));
            msgText.setContentSize(cc.size(420,150));
            msgText.setString(strMsg);



            msgWidget.setVisible(true);
            this.msgListView.pushBackCustomItem(msgWidget);
        }
    }
});