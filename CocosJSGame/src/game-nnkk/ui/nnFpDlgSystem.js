
//var ID_NnTbDlgSystem = 6008;

DLG_CREATOR[ID_NnFpDlgSystem] = function() {
	return new NnFpDlgSystem();
};

var NnFpDlgSystem = DlgBase.extend({
	ctor: function(){},

	onCreate: function() {
		this.init();
	},

	onClose: function() {

	},

	init: function() {
		var json = ccs.load(res.dlgNnFpSystem_json);
		this._rootWidget = json.node;

		//自适应屏幕大小
		var sizeDir = cc.director.getWinSize();
		this._rootWidget.setContentSize(sizeDir);
		ccui.helper.doLayout(this._rootWidget);


		this.PanelSystem = this._rootWidget.getChildByName('PanelSystem');

		this.BtnSystem = this.PanelSystem.getChildByName("Button_System");
		this.BtnSystem.addTouchEventListener(this.onClickSystem, this);

        this.BtnHelp = this.PanelSystem.getChildByName('Button_Help');
        this.BtnHelp.addTouchEventListener(this.onClickHelp, this);
	},

	updateDlg: function(){
		var room = ClientData.getInstance().getRoom();
		if(room){
			var server = room.getCurServer();
			if(server){
				var strTableId = g_objHero.getTableId() + 1 + "";
				var strLocation = "\"" + server.szServerName + "\"" + "-第" + strTableId + "桌";
				cc.log("lablocation="+strLocation);
				// this.LabLocation.string = strLocation;
			}
		}
	},

	onClickSystem: function(sender, type) {
		switch (type) {
		case ccui.Widget.TOUCH_BEGAN:
			break;
		case ccui.Widget.TOUCH_MOVED:
			break;
		case ccui.Widget.TOUCH_ENDED:
			// UIMgr.getInstance().openDlg(ID_DlgPlazaSet);
			UIMgr.getInstance().openDlg(ID_DlgNnFpSet);
			break;
		default:
			break;
		}
	},

	onClickBackPlaza: function(sender, type) {		
		switch (type) {
		case ccui.Widget.TOUCH_BEGAN:
			break;
		case ccui.Widget.TOUCH_MOVED:
			break;
		case ccui.Widget.TOUCH_ENDED:
			var outRoomStr = "";
			var game = ClientData.getInstance().getGame();
			if (g_objHero.getUserId() === game.getTableOwnerUserID()) outRoomStr = "游戏已经开始，\r\n 现在解散房间，房卡无法返还！";
			else outRoomStr = "游戏已经开始，\r\n 您确定要解散房间！";
			var status = g_objHero.getStatus();
            if (status === US_PLAYING || status === US_OFFLINE || game.getCurentCount() > 0) {
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
            } else {//未开始牌局
                //起立，退出到大厅
                GameUserMsg.getInstance().sendStandUp(true);
                GameKindMgr.getInstance().backPlazaScene();
            }
			break;
		default:
			break;
		}
	},

	onClickGameSet: function(sender, type) {		
		switch (type) {
		case ccui.Widget.TOUCH_BEGAN:
			break;
		case ccui.Widget.TOUCH_MOVED:
			break;
		case ccui.Widget.TOUCH_ENDED:
			this.ImgBg.setVisible(false);
			this.BtnOpen.setBright(true);

			var status = g_objHero.getStatus();
			if(status === US_PLAYING || status === US_OFFLINE){
				DlgTip.openTip(DLG_TIP_CFG.CHANGE_TABLE_TIP, function(){
				});
			}else{
				GameKindMgr.getInstance().getGameUIMgr().changeTable();
				UIMgr.getInstance().closeDlg(ID_NnTbDlgCallScore);
			}
			break;
		default:
			break;
		}
	},
                                   
    onClickHelp: function(sender, type) {
       if (ccui.Widget.TOUCH_ENDED === type) {
           var plaza = ClientData.getInstance().getPlaza();
           var gameKind = 200;
           if (plaza) {
               var kindID = plaza.getCurKindID();
               if (kindID === CMD_DDZ.KIND_ID) {
                   gameKind = 300;
			   } else if (kindID === CMD_NIUNIU_TB.KIND_ID) {
                   gameKind = 200;
			   }
           }

           var dlgRule =UIMgr.getInstance().openDlg(ID_DlgNnFpRule);
           // var dlgRule =UIMgr.getInstance().openDlg(ID_DlgGameRule);
           dlgRule.gameKind = gameKind;
           dlgRule.gameStatus = true;
           dlgRule.onWhichplatform();
       }
    }
});
