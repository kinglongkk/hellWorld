
var LymjMainLayer = cc.Layer.extend({
	init: function () {
		
		 
		
		cc.log("LymjMainLayer--------------------------------------------------began");
		
		var sizeDir = cc.director.getWinSize();
		
		var bg = new ccui.ImageView();
		bg.loadTexture(res.lymjMainBg_image, ccui.Widget.LOCAL_TEXTURE); // 没必要感觉
		bg.setPosition(sizeDir.width/2.0, sizeDir.height/2.0);
		this.addChild(bg);


	

		cc.log("LymjMainLayer--------------------------------------------------end");
	},

	update: function(dt){
		this._super(dt);
		cc.log("-------------------------LymjMainLayer update");
	},
});


var LymjScene = cc.Scene.extend({
	ctor:function () {
		this._super();
		this.init();

		this.layer = new LymjMainLayer();
		this.addChild(this.layer);
		this.layer.init();
		
		//游戏管理
		var gameUIMgr = LymjUIMgr.getInstance();
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

		//LymjUIMgr.getInstance().update(dt);
	},

	updateLoaction:function(parserData){
		var DlgLymjMain = UIMgr.getInstance().getDlg(ID_DlgLymjMain);
		if(!DlgLymjMain)
			return;
		
		DlgLymjMain.updateUserPosInfo();
	},

	onEnterTransitionDidFinish:function () {
		this._super();

		this.sceneName = "LymjScene";
		
		ClientData.getInstance().setReplaceScene(false);

		UIMgr.getInstance().init(this.layer);
		LymjUIMgr.getInstance().init(this.layer);
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

//		Lymj.BezierPath = {};
//		Lymj.BezierCalcuCount = 0;
//		LymjCacheFishMgr.getInstance().clearAllData();
		
		cc.pool.drainAllPools();

		SoundMgr.getInstance().stopMusic();
	},
});