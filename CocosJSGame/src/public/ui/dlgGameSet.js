
DLG_CREATOR[ID_DlgGameSet] = function() {
	return new DlgGameSet();
};

var DlgGameSet = DlgBase.extend({
	ctor: function(){},

	onCreate: function() {
		this.init();
	},

	onClose: function() {

	},

	init: function() {
		var json = ccs.load(res.dlgGameSetScene_json);
		this._rootWidget = json.node;

		//自适应屏幕大小
		var sizeDir = cc.director.getWinSize();
		this._rootWidget.setContentSize(sizeDir);
		ccui.helper.doLayout(this._rootWidget);
		
		this.PanelBg = this._rootWidget.getChildByName('PanelBg');
		this.PanelBg.addTouchEventListener(this.onClickClose, this);

		this._rootWidget.setLocalZOrder(50);

		this.ImgSetBg = this._rootWidget.getChildByName('ImgSetBg');
		this.ImgSetBg.setTouchEnabled(true);
		
		this.PanelMusic = this.ImgSetBg.getChildByName('PanelMusic');
		this.PanelSound = this.ImgSetBg.getChildByName('PanelSound');
		
		//btn music
		this.BtnMusic = new MyBtnSlider();
		this.BtnMusic.addOnOffListener(this.onClickMusic, this);
		this.PanelMusic.addChild(this.BtnMusic);
		var sizeMusic = this.PanelMusic.getSize();
		this.BtnMusic.x = sizeMusic.width / 2;
		this.BtnMusic.y = sizeMusic.height / 2;

		//btn sound
		this.BtnSound = new MyBtnSlider();
		this.BtnSound.addOnOffListener(this.onClickSound, this);
		this.PanelSound.addChild(this.BtnSound);
		var sizeSound = this.PanelSound.getSize();
		this.BtnSound.x = sizeSound.width / 2;
		this.BtnSound.y = sizeSound.height / 2;

		this.updateData();
	},

	updateData: function(){
		var bMusic = LocalStorageMgr.getInstance().getMusicItem();
		var bSound = LocalStorageMgr.getInstance().getSoundItem();

		this.BtnMusic.setOnOff(bMusic);
		this.BtnSound.setOnOff(bSound);

		SoundMgr.getInstance().setPlayMusic(bMusic);
		SoundMgr.getInstance().setPlayEffect(bSound);
	},

	onClickClose: function(sender, type) {
		if (ccui.Widget.TOUCH_ENDED == type) {
			cc.log('onClickClose');

			UIMgr.getInstance().closeDlg(ID_DlgGameSet);
		}
	},
	
	onClickMusic: function(sender, type) {
		if ("on" == type) {
			cc.log("onClickMusic on");
			LocalStorageMgr.getInstance().setMusicItem(true);
			SoundMgr.getInstance().setPlayMusic(true);
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

			SoundMgr.getInstance().setPlayEffect(true);
		}else if("off" == type){
			cc.log("onClickSound off");
			LocalStorageMgr.getInstance().setSoundItem(false);

			SoundMgr.getInstance().setPlayEffect(false);
		}
	},
});