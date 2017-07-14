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
        var json = ccs.load(res.dlgChatScene_json);
        this._rootWidget = json.node;

        //自适应屏幕大小
        var sizeDir = cc.director.getWinSize();
        this._rootWidget.setContentSize(sizeDir);
        ccui.helper.doLayout(this._rootWidget);

        this.BtnSounds = this._rootWidget.getChildByName("Button_Sounds");
        this.BtnSounds.addTouchEventListener(function (sender, type) {
            var tempAmrPath = ((jsb.fileUtils ? jsb.fileUtils.getWritablePath() : "/") + "record.amr");
            if (ccui.Widget.TOUCH_ENDED == type ||
                ccui.Widget.TOUCH_CANCELED == type) {
                // 结束录音
                var dlg = UIMgr.getInstance().getDlg(ID_DlgSoundAnimation);
                if (!dlg) return;
                this.soundsEnd(type);
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
                        jsb.reflection.callStaticMethod("HFAudio", "setRecordAmrPath:",tempAmrPath);

                        // 开始录制语音 2
                        jsb.reflection.callStaticMethod("HFAudio", "startRecord");
                    }
                    else if(cc.sys.os == cc.sys.OS_ANDROID){

                        cc.log("开始调用android"+tempAmrPath);
                        // 设置录制语音的路径
                        jsb.reflection.callStaticMethod(
                            "org/cocos2dx/javascript/HFAudio",
                            "setRecordAmrPath",
                            "(Ljava/lang/String;)V",
                            tempAmrPath
                        );
                        // 开始录制语音 2
                        jsb.reflection.callStaticMethod(
                            "org/cocos2dx/javascript/HFAudio",
                            "startRecord",
                            "()V"
                        );
                    }
                }
            }
        }, this);

        this.BtnSendMsg = this._rootWidget.getChildByName("Button_SendMsg");
        this.BtnSendMsg.addTouchEventListener(function (sender, type) {
            // 发送消息
            if (ccui.Widget.TOUCH_ENDED == type) {
                var dlg = UIMgr.getInstance().openDlg(ID_DlgNNMsgList);
                var plaza = ClientData.getInstance().getPlaza();
                dlg.updateMsgList(LoadWordChatCfg.getInstance().getWordList(g_objHero.getGender(), plaza.getCurKindID()));
            }
        }, this);
    },

    soundsEnd: function (type) {
        // 结束录音
        //关闭录音动画
        var tempAmrPath = ((jsb.fileUtils ? jsb.fileUtils.getWritablePath() : "/") + "record.amr");
        showSoundAnimation(false);
        if(cc.sys.isNative){
            if(cc.sys.os == cc.sys.OS_IOS) {
                jsb.reflection.callStaticMethod("HFAudio", "stopRecord");
            }
            else if(cc.sys.os == cc.sys.OS_ANDROID) {
                jsb.reflection.callStaticMethod(
                    "org/cocos2dx/javascript/HFAudio",
                    "stopRecord",
                    "()V"
                );
            }
        }

        if (ccui.Widget.TOUCH_CANCELED == type) {
            cc.log("录音结束重新设置声音 = ");
            SoundMgr.getInstance().setPlayMusic(LocalStorageMgr.getInstance().getMusicItem());
        } else {
            // 发送录音
            if (jsb.fileUtils.isFileExist(tempAmrPath)) {
                GameFrameMsg.getInstance().sendVoiceReq(tempAmrPath);
            }
            else {
                cc.log("没有找到目录"+tempAmrPath);
            }

            var bMusic = LocalStorageMgr.getInstance().getMusicItem();
            cc.log("录音结束重新设置声音 = " + bMusic);
            SoundMgr.getInstance().setPlayMusic(bMusic);
        }
    },
});