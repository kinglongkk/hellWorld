
DLG_CREATOR[ID_DlgPlazaSet] = function() {
    return new DlgPlazaSet();
};

var DlgPlazaSet = DlgBase.extend({
    ctor: function(){
    	
    	this.isInPlaza = 1;
    },

    onCreate: function() {
        this.init();
    },

    onClose: function() {

    },

    init: function() {
        cc.spriteFrameCache.addSpriteFrames(res.dlgPlazaSetPlist_plist);
        cc.spriteFrameCache.addSpriteFrames(res.dlgPublic_Plist);
        var json = ccs.load(res.dlgPlazaSetScene_json);
        this._rootWidget = json.node;

        //自适应屏幕大小
        var sizeDir = cc.director.getWinSize();
        this._rootWidget.setContentSize(sizeDir);

        ccui.helper.doLayout(this._rootWidget);

        this.Panel_back = this._rootWidget.getChildByName('Panel_back');
        this.Image_blueback = this.Panel_back.getChildByName('Image_blueback');

        this.BtnClose = this.Image_blueback.getChildByName('BtnClose');
        this.BtnClose.setPressedActionEnabled(true);
        this.BtnClose.addTouchEventListener(this.onColseDlg, this);

        //切换账号
        this.BtnOtherLogin = this.Image_blueback.getChildByName('BtnOtherLogin');
        this.BtnOtherLogin.addTouchEventListener(this.onClickEvent, this);
        this.BtnOtherLogin.setVisible(false);
        if(this.isInPlaza){
        	this.BtnOtherLogin.setVisible(false);
        }
        else this.BtnOtherLogin.setVisible(true);
        
        this.ImgBg = this.Image_blueback.getChildByName('ImgBg');
        //音量
        this.Slider_voice = this.ImgBg.getChildByName('Slider_voice');
        this.Slider_voice.addTouchEventListener(this.onClickEvent, this);

        //音效
        this.Slider_sound = this.ImgBg.getChildByName('Slider_sound');
        this.Slider_sound.addTouchEventListener(this.onClickEvent, this);

        this.Panel_back.setOpacity(0.5)
        this.Panel_back.runAction(cc.fadeIn(0.3));
        this.addActionNodeMB(this.Panel_back);

        this.updateData();
    },
    onSetBtnstatus: function(status) {
    	this.BtnOtherLogin.setVisible(status);
	},
	
    onColseDlg: function(sender, type) {
        if (ccui.Widget.TOUCH_ENDED == type) {
            UIMgr.getInstance().closeDlg(ID_DlgPlazaSet);
        }
    },

    updateData: function(){

        var musicVolume = LocalStorageMgr.getInstance().getMusicVolumeItem();
        var soundVolume = LocalStorageMgr.getInstance().getSoundVolumeItem();

        this.Slider_voice.setPercent(musicVolume);
        this.Slider_sound.setPercent(soundVolume);

        //账号
//		var strAccount = g_objHero.getAccount();
//		strAccount += " (v" + _CONFIG_.CLIENT_VERSION + ")"
//		this.LabAccount.string = strAccount;

        //头像
//		var faceId = g_objHero.getFaceId();
//		var gender = g_objHero.getGender();
//		this.setFaceByFaceId(faceId);
    },

//	setFaceByFaceId: function(id){
//		var size = this.ImgFaceBg.getSize();
//		var faceFile = LoadFaceCfg.getInstance().getFileByFaceId(id);
//		if(faceFile != ""){
//			var imgFace = new ccui.ImageView(faceFile);
//			imgFace.x = size.width / 2;
//			imgFace.y = size.height / 2;
//			var sizeImg = imgFace.getSize();
//			imgFace.setScaleX(72 / sizeImg.width);
//			imgFace.setScaleY(72 / sizeImg.height);
//			this.ImgFaceBg.addChild(imgFace);
//		}
//	},

    onClickEvent: function(sender, type) {
        if (ccui.Widget.TOUCH_ENDED == type) {
            var strBtnName = sender.getName();
            cc.log('onClickEvent ' + strBtnName);
            switch (strBtnName) {
                case "BtnClose":
                    UIMgr.getInstance().closeDlg(ID_DlgPlazaSet);
                    break;
                case "BtnOtherLogin":
                	var table = ClientData.getInstance().getTable();
                	var playernum = 0;
                	for(var num = 0;num<4;num++){
                		var player = table.getPlayerByChairID(num);
                		if(player!=null){
                			playernum++;
                		}
                	}
                	cc.log("playernum="+playernum);
                	if(playernum<=1){
                		GameKindMgr.getInstance().backPlazaScene();
                	}
                	else{
                		OpenRoomMsg.getInstance().sendCancelRoom();
                	}
                	            	
                    break;
                case "Slider_voice":
                    var percent = sender.getPercent();
                    percent = Math.floor(percent);

                    LocalStorageMgr.getInstance().setMusicVolumeItem(percent);

                    var value = percent / 100;
                    SoundMgr.getInstance().setMusicVolume(value);
                    break;
                case "Slider_sound":
                    var percent = sender.getPercent();
                    percent = Math.floor(percent);

                    LocalStorageMgr.getInstance().setSoundVolumeItem(percent);

                    var value = percent / 100;
                    SoundMgr.getInstance().setEffectsVolume(value);
                    break;
                case "ImgFaceBg":

                    break;
                default:
                    break;
            }
        }
    },

    onClickMusic: function(sender, type) {
        if ("on" == type) {
            cc.log("onClickMusic on");
            LocalStorageMgr.getInstance().setMusicItem(true);
            //SoundMgr.getInstance().setPlayMusic(true);
        }else if("off" == type){
            cc.log("onClickMusic off");
            LocalStorageMgr.getInstance().setMusicItem(false);

            SoundMgr.getInstance().setPlayMusic(false);
        }
    },

    onClickSound: function(sender, type) {
        if ("on" == type) {
            cc.log("onClickSound on");
            LocalStorageMgr.getInstance().setSoundItem(true);

            //SoundMgr.getInstance().setPlayEffect(true);
        }else if("off" == type){
            cc.log("onClickSound off");
            LocalStorageMgr.getInstance().setSoundItem(false);

            SoundMgr.getInstance().setPlayEffect(false);
        }
    },
});