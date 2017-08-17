
var ZpmjMainLayer = cc.Layer.extend({
	init: function () {
		
		 
		
		cc.log("ZpmjMainLayer--------------------------------------------------began");
		
		var sizeDir = cc.director.getWinSize();
		
		var bg = new ccui.ImageView();
		bg.loadTexture(res.zpmjMainBg_image, ccui.Widget.LOCAL_TEXTURE); // 没必要感觉
		bg.setPosition(sizeDir.width/2.0, sizeDir.height/2.0);
		this.addChild(bg);


	

		cc.log("ZpmjMainLayer--------------------------------------------------end");
	},

	update: function(dt){
		this._super(dt);
		cc.log("-------------------------ZpmjMainLayer update");
	},
});


var ZpmjScene = cc.Scene.extend({
	ctor:function () {
		this._super();
		this.init();

		this.layer = new ZpmjMainLayer();
		this.addChild(this.layer);
		this.layer.init();
		
		//游戏管理
		var gameUIMgr = ZpmjUIMgr.getInstance();
		GameKindMgr.getInstance().setGameUIMgr(gameUIMgr);

		//JSB中是在C++层注册的scheduleUpdate
		//C++层的update函数中没有检查js层是否有重载，也不会主动调用js层的函数
		//但是unscheduleUpdate之后会取消C++层的注册，再调用scheduleUpdate应该就会成功
		//需要注意的是，如果想保留原本的update逻辑，需要在js中的update函数中调用 this._super() 
		this.unscheduleUpdate();
		this.scheduleUpdate();
	},

	onEnter: function () {
		this._super();
	},

	update: function(dt){
		this._super(dt);

		//ZpmjUIMgr.getInstance().update(dt);
	},

	updateLoaction:function(parserData){
		var DlgZpmjMain = UIMgr.getInstance().getDlg(ID_DlgZpmjMain);
		if(!DlgZpmjMain)
			return;
		
		DlgZpmjMain.updateUserPosInfo();
	},

	onEnterTransitionDidFinish:function () {
		this._super();

		this.sceneName = "ZpmjScene";
		
		ClientData.getInstance().setReplaceScene(false);

		UIMgr.getInstance().init(this.layer);
		ZpmjUIMgr.getInstance().init(this.layer);
	},

	getSceneName: function(){
		return this.sceneName;
	},

	isPlazaScene: function(){
		return false;
	},

	isGameScene: function(){
		cc.log("--isGameScene: function(){");
		return true;
	},
	
	onExit : function () {
		cc.Scene.prototype.onExit.call(this);

//		Zpmj.BezierPath = {};
//		Zpmj.BezierCalcuCount = 0;
//		ZpmjCacheFishMgr.getInstance().clearAllData();
		
		cc.pool.drainAllPools();

		SoundMgr.getInstance().stopMusic();
	},
});