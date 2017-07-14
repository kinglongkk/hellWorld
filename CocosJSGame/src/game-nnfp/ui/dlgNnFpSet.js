DLG_CREATOR[ID_DlgNnFpSet] = function() {
    return new DlgNnFPSet();
};

var DlgNnFPSet = DlgBase.extend({
    ctor: function(){},

    onCreate: function() {
        this.init();
    },

    onClose: function() {},

    init: function() {
        var json = ccs.load(res.nnFpSet_json);
        this._rootWidget = json.node;

        //自适应屏幕大小
        var sizeDir = cc.director.getWinSize();
        this._rootWidget.setContentSize(sizeDir);

        ccui.helper.doLayout(this._rootWidget);

        this.Panel_back = this._rootWidget.getChildByName('Panel_back');
        this.Image_blueBack = this.Panel_back.getChildByName('Image_blueBack');

        this.BtnClose = this.Image_blueBack.getChildByName('BtnClose');
        this.BtnClose.setPressedActionEnabled(true);
        this.BtnClose.addTouchEventListener(this.onColseDlg, this);

        //解散房间
        this.BtnOtherLogin = this.Image_blueBack.getChildByName('BtnOutRoom');
        this.BtnOtherLogin.addTouchEventListener(this.onClickEvent, this);
        this.BtnOtherLogin.setVisible(true);

        this.ImgBg = this.Image_blueBack.getChildByName('ImgBg');
        //音量
        this.Slider_voice = this.ImgBg.getChildByName('Slider_voice');
        this.Slider_voice.addTouchEventListener(this.onClickEvent, this);
        this.Img_closeVice = this.ImgBg.getChildByName('Img_closeVice');
        this.Img_closeVice.setVisible(false);

        //音效
        this.Slider_sound = this.ImgBg.getChildByName('Slider_sound');
        this.Slider_sound.addTouchEventListener(this.onClickEvent, this);
        this.Img_closeSound = this.ImgBg.getChildByName('Img_closeSound');
        this.Img_closeSound.setVisible(false);

        this.Panel_back.setOpacity(0.5);
        this.Panel_back.runAction(cc.fadeIn(0.3));
        this.addActionNodeMB(this.Panel_back);

        this.updateData();
    },
    onSetBtnstatus: function(status) {
        this.BtnOtherLogin.setVisible(status);
    },

    onColseDlg: function(sender, type) {
        if (ccui.Widget.TOUCH_ENDED === type) {
            UIMgr.getInstance().closeDlg(ID_DlgNnFpSet);
        }
    },

    updateData: function() {
        var musicVolume = LocalStorageMgr.getInstance().getMusicVolumeItem();
        var soundVolume = LocalStorageMgr.getInstance().getSoundVolumeItem();

        this.Slider_voice.setPercent(musicVolume);
        if (musicVolume === 0) {
            this.Img_closeVice.setVisible(true);
        } else {
            this.Img_closeVice.setVisible(false);
        }

        this.Slider_sound.setPercent(soundVolume);
        if (soundVolume === 0) {
            this.Img_closeSound.setVisible(true);
        } else {
            this.Img_closeSound.setVisible(false);
        }
    },

    onClickEvent: function(sender, type) {
        if (ccui.Widget.TOUCH_ENDED === type) {
            var strBtnName = sender.getName();
            cc.log('onClickEvent ' + strBtnName);
            switch (strBtnName) {
                case "BtnOutRoom":
/*                    var game = ClientData.getInstance().getGame();
                    if (game && !(game.getCurentCount() === 0)) {
                        OpenRoomMsg.getInstance().sendCancelRoom();
                    } else {
                        GameUserMsg.getInstance().sendStandUp(true);
                        GameKindMgr.getInstance().backPlazaScene();
                    }*/
                    OpenRoomMsg.getInstance().sendDissumeTalbe();
                    break;
                case "Slider_voice":
                    var percent = sender.getPercent();
                    percent = Math.floor(percent);

                    LocalStorageMgr.getInstance().setMusicVolumeItem(percent);

                    var value = percent / 100;
                    value === 0 ? this.Img_closeVice.setVisible(true) : this.Img_closeVice.setVisible(false);
                    SoundMgr.getInstance().setMusicVolume(value);
                    break;
                case "Slider_sound":
                    var percent = sender.getPercent();
                    percent = Math.floor(percent);

                    LocalStorageMgr.getInstance().setSoundVolumeItem(percent);

                    var value = percent / 100;
                    value === 0 ? this.Img_closeSound.setVisible(true) : this.Img_closeSound.setVisible(false);
                    SoundMgr.getInstance().setEffectsVolume(value);
                    break;
                default:
                    break;
            }
        }
    }
});