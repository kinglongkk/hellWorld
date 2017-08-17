var SssGameScene = cc.Scene.extend({
	ctor:function () {
		this._super();
		this.init();

		this.layer = new cc.Layer();
		this.addChild(this.layer);
		this.layer.init();

		//游戏管理
		var gameUIMgr = SssUIMgr.getInstance();
		GameKindMgr.getInstance().setGameUIMgr(gameUIMgr);
	},

	onEnter: function () {
		this._super();
	},

	onEnterTransitionDidFinish:function () {
		this._super();

		this.sceneName = "SssGameScene";

		ClientData.getInstance().setReplaceScene(false);
		
		cc.log("#### SSSUIMgr UIMgr.getInstance().init(this.layer); ");

		UIMgr.getInstance().init(this.layer);
		SssUIMgr.getInstance().init(this.layer);
	},

	getSceneName: function(){
		return this.sceneName;
	},

	isPlazaScene: function(){
		return false;
	},

	isGameScene: function(){
		return true;
	},

	onExit : function () {
		cc.Scene.prototype.onExit.call(this);

		SoundMgr.getInstance().stopMusic();
	},

    // 战绩中心
    showResult: function (data) {
        var game = ClientData.getInstance().getGame();
        if(game){
            game.gameFlag = true;
        }
        cc.log("--十三水局数已到--SssGameModel.gameFlag="+game.gameFlag);
    },
});
