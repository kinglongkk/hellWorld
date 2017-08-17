var DdzMainLayer = cc.Layer.extend({
	init: function () {
		// 从文件载入
		
		var json = ccs.load(res.ddzLandlordScene_json);
		this._rootWidget = json.node;
		this.addChild(this._rootWidget);

		cc.log("Panel_main="+this._rootWidget.getChildByName("Panel_main"));
		// 文本
		this.Text_Num = this._rootWidget.getChildByName("Panel_main").getChildByName("Panel_gnum").getChildByName("Text_gnum");
		this.Text_node = this._rootWidget.getChildByName("Panel_main").getChildByName("Text_BaseScore");
		this.Text_roomNum = this._rootWidget.getChildByName("Panel_main").getChildByName("Panel_room").getChildByName("Text_room");

		this.Text_roomNum.string = g_objHero.getRoomID();

		g_objHero.setBackPlazaSign(false);

		var game = ClientData.getInstance().getGame();
		if(game){
			this.Text_node.string =  game.getCellScore();
			this.allNum = game.getGameCount() || game.getDrawCountLimit();
			this.curentNum = game.getPlayCount(); // 当前局数
			if (this.curentNum <= this.allNum) {
				this.Text_Num.string = this.curentNum + "/" + this.allNum ;
				game.setCurentCount(this.curentNum);
			}
		}


	},
	// 更新已玩局数
	updateNode: function () {
		this.curentNum++;
		if (this.curentNum <= this.allNum) {
			this.Text_Num.string = this.curentNum + "/" + this.allNum;
			var game = ClientData.getInstance().getGame();
			if (game) {
				game.setCurentCount(this.curentNum);
			}
		}
	},
	//掉线后显示局数
	resetNumberOfGames: function () {
		var game = ClientData.getInstance().getGame();
		if (game) {
			this.Text_Num.string = game.getCurentCount() + "/" + this.allNum;
			this.curentNum = game.getCurentCount();
		}
	},

	resetRounds: function () {
		this.curentNum = 0;
		this.Text_Num.string = this.curentNum + "/" + this.allNum;
	},

	// 是否局数到了
	isFinished: function () {
		return this.curentNum >= this.allNum;
	}
});


var DdzGameScene = cc.Scene.extend({
	ctor:function () {
		this._super();
		this.init();

		this.layer = new DdzMainLayer();
		this.addChild(this.layer);
		this.layer.init();

		//游戏管理
		var gameUIMgr = DdzUIMgr.getInstance();
		GameKindMgr.getInstance().setGameUIMgr(gameUIMgr);
	},

	onEnter: function () {
		this._super();
	},

	onEnterTransitionDidFinish:function () {
		this._super();

		this.sceneName = "DdzGameScene";

		ClientData.getInstance().setReplaceScene(false);

		cc.log("DdzGameScene onEnterTransitionDidFinish");
		UIMgr.getInstance().init(this.layer);
		DdzUIMgr.getInstance().init(this.layer);
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

    // 更新位置信息
    updateLoaction: function (data) {
        var dlg = UIMgr.getInstance().getDlg(ID_DdzDlgPlayer);
        if (dlg) {
            dlg.updatePlayersLocation();
        }
    }
});
