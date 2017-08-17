/*
 * 游戏主场景
 * Author: 	xjn 
 * Date:	2017.4.8
 * 
 * 功能：
 * */

var HzmjMainLayer = cc.Layer.extend({
	init: function () {
		cc.log("HzmjMainLayer--------------------------------------------------began");
		
		var sizeDir = cc.director.getWinSize();
		
		var bg = new ccui.ImageView();
		bg.loadTexture(res.hzmjMainBg_image, ccui.Widget.LOCAL_TEXTURE);
		bg.setPosition(sizeDir.width/2.0, sizeDir.height/2.0);
		
		this.addChild(bg);
		
		cc.log("HzmjMainLayer--------------------------------------------------end");
	},

	update: function(dt){
		this._super(dt);
		cc.log("-------------------------HzmjMainLayer update");
	},
});


var HzmjScene = cc.Scene.extend({
	ctor:function () {
		this._super();
		this.init();

		this.layer = new HzmjMainLayer();
		this.addChild(this.layer);
		this.layer.init();
		
		//游戏管理
		var gameUIMgr = HzmjUIMgr.getInstance();
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

		//HzmjUIMgr.getInstance().update(dt);
	},

	updateLoaction:function(parserData){
		var DlgHzmjMain = UIMgr.getInstance().getDlg(ID_DlgHzmjMain);
		if(!DlgHzmjMain)
			return;
		
		DlgHzmjMain.updateUserPosInfo();
	},

	onEnterTransitionDidFinish:function () {
		this._super();

		this.sceneName = "HzmjScene";
		
		ClientData.getInstance().setReplaceScene(false);

		UIMgr.getInstance().init(this.layer);
		HzmjUIMgr.getInstance().init(this.layer);
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

//		Hzmj.BezierPath = {};
//		Hzmj.BezierCalcuCount = 0;
//		HzmjCacheFishMgr.getInstance().clearAllData();
		
		cc.pool.drainAllPools();

		SoundMgr.getInstance().stopMusic();
	},

    // 战绩中心
    showResult: function (data) {
        var game = ClientData.getInstance().getGame();
        if (game && game.getPlayCount() != 0 && game.getPlayCount()<game.getDrawCountLimit() ) {
            //显示战绩
			cc.log("--------显示战绩界面----------------------")
            var DlgHzmjRankCenter = UIMgr.getInstance().openDlg(ID_DlgHzmjRankCenter);
            DlgHzmjRankCenter.show();
            g_isShowRank = true;
        }
    },
});