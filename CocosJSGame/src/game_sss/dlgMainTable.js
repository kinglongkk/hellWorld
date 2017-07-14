DLG_CREATOR[ID_DlgCNGameStart] = function() {
	return new DlgCNGameStart();
};

var SSSBeginLayer = cc.Layer.extend({
	init: function () {
		var json = ccs.load(res.dlgCNsysword_json);
		this._rootWidget = json.node;
		this.List_word = this._rootWidget.getChildByName('List_word');
		
		this.Panel_cell = this.List_word.getChildByName('Panel_cell');
		this.Button_word1 = this.Panel_cell.getChildByName('Button_word1');
		this.Button_word1.addTouchEventListener(this.onClickEvent, this);
		
		this.addChild(this._rootWidget);
	},
	
	onClickEvent: function(sender, type) {
		if (ccui.Widget.TOUCH_ENDED == type) {
			var strBtnName = sender.getName();
			cc.log('onClickEvent ' + strBtnName);
			switch (strBtnName) {
			case "Button_word1":
				this.removeChild(this._rootWidget);
				break;
			default:
				break;
			}
		}
	},
});

var DlgCNGameStart = DlgBase.extend({
	ctor: function () {
		this.AllGame = 8;
		this.dissolutionTime = 40;
		this.nClockStatus = false;
		
		this.ruleStr = 
		"普通玩法\n" +
		"*游戏使用52张牌（无大小王），每名玩家分配13张牌。\n" +
		"*13张牌分为三道牌（头道：3张牌 中道：5张牌 尾道：5张牌）。\n" +
		"*头道必须小于中道，中道必须小于尾道，否则为[相公]。\n" +
		"*牌型大小，同花顺>铁支>葫芦>同花>顺子>三条>两对>对子>乌龙\n" +
		"*同一道若牌型相同，则比点数。\n" +
		"*同一道若点数相同，则视为大小相同，不比花色\n" +
		"术语解析:\n" +
		"*道数：玩家手中十三张牌按照三张、五张、五张分为三组，分别成为头、中、尾道，之后其他三家对比牌型、牌面。较大的则为赢一分。特殊牌型没有额外墩数计算。\n" +
		"*比牌：全部玩家理牌结束后，按照头、中、尾道顺序比大小的过程成为比牌。\n"+
		"*打枪：普通比牌结束后，其中一位玩家三道全部胜过另外一位玩家，则为打枪。\n"+
		"*全垒打：比牌结束后，其中一位玩家三道全部胜过其他玩家，即对三家打枪，为全垒打。\n";
	},

	onCreate: function() {
		this.init();

	},

	onClose: function() {

	},

	init: function(){
		cc.spriteFrameCache.addSpriteFrames(res.dlgCNPoke_plist);
		var json = ccs.load(res.dlgCNMainScene_json);
		this._rootWidget = json.node;

		//自适应屏幕大小
		var sizeDir = cc.director.getWinSize();
		this._rootWidget.setContentSize(sizeDir);
		ccui.helper.doLayout(this._rootWidget);	

		this.Panel_main = this._rootWidget.getChildByName('Panel_main');		
			
		//返回房间按钮
		this.Button_back = this.Panel_main.getChildByName('Button_back');
		this.Button_back.addTouchEventListener(this.onClickBtnEvent, this);
		
		//帮助按钮
		this.Button_help = this.Panel_main.getChildByName('Button_help');
		this.Button_help.addTouchEventListener(this.onClickBtnEvent, this);
		//设置按钮
		this.Button_set = this.Panel_main.getChildByName('Button_set');
		this.Button_set.addTouchEventListener(this.onClickBtnEvent, this);	
		
		this.Panel_room = this.Panel_main.getChildByName('Panel_room');
		this.Text_room = this.Panel_room.getChildByName('Text_room');
		
		this.Panel_gnum = this.Panel_main.getChildByName('Panel_gnum');
		this.Text_gnum = this.Panel_gnum.getChildByName('Text_gnum');
		//时钟
		this.Image_clock = this.Panel_main.getChildByName('Image_clock');		
		this.labTime = this.Image_clock.getChildByName('AtlasLabel_Time');
		this.Image_clock.setVisible(false);
		
		this.Text_BaseScore = this.Panel_main.getChildByName('Text_BaseScore');
		
		
	},
	onSetImageclockStatus:function(status){
		cc.log("status = " + status);
		this.Image_clock.setVisible(status);
		this.nClockStatus = status;
	},
	onGetImageclockStatus:function(){
		return this.nClockStatus;
	},
	onStartCountDownTime: function () {
		cc.director.getScheduler().scheduleCallbackForTarget(this, this.updateCountDownTime,1, cc.REPEAT_FOREVER, 0, false, "keyCountDownTime");
	},
	updateCountDownTime : function() {
		this.dissolutionTime =this.dissolutionTime-1;
		if(this.labTime){
			this.labTime.setString(this.dissolutionTime);
			
			var slem = this.labTime.getString().length;
			this.labTime.setContentSize(39 * slem, 60);
		}else {
			cc.director.getScheduler().unscheduleCallbackForTarget(this,this.updateCountDownTime);
		}
		if(this.dissolutionTime<=0){
			cc.director.getScheduler().unscheduleCallbackForTarget(this,this.updateCountDownTime);
			this.labTime.setString(0);
			
			var slem = this.labTime.getString().length;
			this.labTime.setContentSize(39 * slem, 60);
		}
	},
	
	onSetRoomNum : function(num) {
		this.Text_room.setString(num);
	},
	
	onSetBasePoint : function(num) {
		this.Text_BaseScore.setString(num);
	},
	
	onSetGameNum : function(num,game) {
		this.Text_gnum.setString(num+"/"+game);
	},
	
	onLoadsysword : function() {
		this.syslayer = new SSSBeginLayer();
		this.syslayer.init();
		cc.log('111t ' + this.syslayer);
		this._rootWidget.addChild(this.syslayer);
	},
	
	onClickBtnEvent: function(sender, type) {
		if (ccui.Widget.TOUCH_ENDED == type) {
			var strBtnName = sender.getName();
			cc.log('onClickEvent ' + strBtnName);
			switch (strBtnName) {
			case "Button_talk":

				break;
			case "Button_word":
				this.onLoadsysword();
				break;
			case "Button_back":
				var outRoomStr = "";
				var game = ClientData.getInstance().getGame();
				if (g_objHero.getUserId() == game.getTableOwnerUserID()) outRoomStr = "游戏已经开始，\r\n 现在解散房间，房卡无法返还！";
				else outRoomStr = "游戏已经开始，\r\n 您确定要解散房间！";
				var status = g_objHero.getStatus();
				
				if(game.getPlayCount()>0){					
					DlgTip.openGameTip("解散房间", outRoomStr, function () {
						OpenRoomMsg.getInstance().sendCancelRoom();
						var dlg = UIMgr.getInstance().openDlg(ID_DlgDialogScene);
						dlg.setTitle("房间解散提示");
						var dText = new ccui.Text();
						dText.setContentSize(dlg.detailBg.getContentSize());
						dText.setFontSize(48);
						dText.string = "等待其他玩家确认解散房间！";
						dlg.setDetailView(dText);
					});
				}
				else{
					GameKindMgr.getInstance().backPlazaScene();
				}
				break;
			case "Button_help":
				var nRule = UIMgr.getInstance().openDlg(ID_DlgGameRule);
				nRule.onSetTextString(this.ruleStr);
				break;
			case "Button_set":
				var plazaSet = UIMgr.getInstance().openDlg(ID_DlgPlazaSet);
				var game = ClientData.getInstance().getGame();
				if(game){
					var roomOwnerId = game.getTableOwnerUserID();
					if(g_objHero.getUserId() == roomOwnerId){
						plazaSet.onSetBtnstatus(true);
					}
					else{
						plazaSet.onSetBtnstatus(false);
					}
				}
				
				
				break;

			default:
				break;
			}
		}
	},
});
