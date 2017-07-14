
//游戏层
var ApkUpdateLayer = cc.Layer.extend({
	ctor:function () {
		this._super();

		this._SprBarR_LX = 169;

		var json = ccs.load("res/update/updateScene.json");
		this.widgetLoad = json.node;
		//自适应屏幕大小
		var sizeDir = cc.director.getWinSize();
		this.widgetLoad.setContentSize(sizeDir);
		ccui.helper.doLayout(this.widgetLoad);
		
		this.addChild(this.widgetLoad);

		this.PanelBg = this.widgetLoad.getChildByName('PanelBg');
		this.PanelSub = this.PanelBg.getChildByName('PanelSub');

		this.BarUpdate = this.PanelSub.getChildByName('BarUpdate');
		this.BarUpdate.setPercent(0);

		this.SprBarR = this.PanelSub.getChildByName('SprBarR');
		this.SprBarR.x = this._SprBarR_LX;

		this.BFLabPercent = this.PanelSub.getChildByName('BFLabPercent');
        this.BFLabPercent.ignoreContentAdaptWithSize(true);
		this.BFLabPercent.string = "0%";

		this.TextTip = this.PanelSub.getChildByName('TextTip');
		this.TextTip.string = "正在检查更新，请耐心等待……";

		this.BtnReUpdate = this.PanelSub.getChildByName('BtnReUpdate');
		this.BtnReUpdate.addTouchEventListener(this.onClickReUpdate, this);
		this.BtnReUpdate.setEnabled(false);
		this.BtnReUpdate.setVisible(false);

		this.schedule(this.updateProgress, 0.5);
	},

	onClickReUpdate: function(sender, type) {
		if (ccui.Widget.TOUCH_ENDED == type) {
			this.BtnReUpdate.setEnabled(false);
			this.BtnReUpdate.setVisible(false);
			this.reStartUpdate();
		}
	},

	reStartUpdate: function(){
		this.TextTip.string = "尝试再次更新！";
		this.TextTip.setColor(cc.color(243, 172, 110));
		this.BarUpdate.setPercent(0);
		this.SprBarR.x = this._SprBarR_LX;

		gg.androidCheckUpdate();
	},

	updateFail: function(){
		//更新失败提示
		this.BtnReUpdate.setEnabled(true);
		this.BtnReUpdate.setVisible(true);
	},

	updateProgress : function (dt) {
		if(gg.apkUpdateFail){
			this.TextTip.string = "下载失败！";
			this.TextTip.setColor(cc.color(255, 0, 0));
			this.updateFail();
			return;
		}

		var progress = gg.apkUpdateProgress;	
		cc.log("-------------updateProgress = " + progress);
		this.BarUpdate.setPercent(progress);

		var sizeBar = this.BarUpdate.getSize();
		this.SprBarR.x = this._SprBarR_LX + sizeBar.width * progress / 100;

		var strPercent = Math.floor(progress) + "%";
		this.BFLabPercent.string = strPercent;

		this.TextTip.string = "正在更新！";
		this.TextTip.setColor(cc.color(243, 172, 110));

		if(progress == 100){
			gg.apkUpdateCheck = false;
			cc.LoaderScene.preload(g_resources, function () {
                cc.director.runScene(new LoginScene());
            }, this);
		}
	},

	onExit : function () {
		this._super();
	}
});

var ApkUpdateScene = cc.Scene.extend({
	ctor:function () {
		this._super();
		this.init();

		this.layer = new ApkUpdateLayer();
		this.addChild(this.layer);
	},
	
	onEnter:function () {
		this._super();	
	},

	isUpdateApk: function(){
		return true;
	},
});