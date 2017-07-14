

DLG_CREATOR[ID_DlgResult] = function() {
	return new DlgResult();
};

var DlgResult = DlgBase.extend({
	ctor: function(){
        var plaza = ClientData.getInstance().getPlaza();
        if(plaza.getCurKindID() === CMD_NIUNIU_TB.KIND_ID) {
        	var game = ClientData.getInstance().getGame();
            this.gamenum = game.getCurentCount();
        } else {
            //对阵局数
        	var game = ClientData.getInstance().getGame();
        	this.gamenum = game.getPlayCount();
		}
		cc.log("DlgResult对阵局数= " + this.gamenum);
		
		if(this.gamenum == 0){//没有局数不显示战绩页，如有则至少显示一局
			this.gamenum = 1;
		}
		//玩游戏的人数
		this.gamekind = g_outcome.playerDatas.length;	
		cc.log("DlgResult玩游戏的人数 " + this.gamekind);
		this.playerDatas = [];
		
		this.playerDatas = g_outcome.playerDatas;
		cc.log("DlgResult玩家数据parseData = " + JSON.stringify(this.playerDatas));
		
		this.Master = false;
	},

	onCreate: function() {
		this.init();
	},

	onClose: function() {

	},

	init: function() {
		cc.spriteFrameCache.addSpriteFrames(res.dlgRestultScene_Plist);
		var json = ccs.load(res.dlgRestultScene_json);
		this._rootWidget = json.node;


		//自适应屏幕大小
		var sizeDir = cc.director.getWinSize();
		this._rootWidget.setContentSize(sizeDir);
		ccui.helper.doLayout(this._rootWidget);

        //弹窗置顶100
        this._rootWidget.setLocalZOrder(100);

		this.Panel_bg = this._rootWidget.getChildByName('Panel_bg');
		this.Image_bg = this._rootWidget.getChildByName('Image_bg');

		this.Image_bg.setTouchEnabled(true);
		this.Image_bg.addTouchEventListener(this.onClickEvent, this);

		this.Room_Master = this._rootWidget.getChildByName('Room_Master');

		this.Btn_delRoom = this.Room_Master.getChildByName('Btn_delRoom');
		this.Btn_share = this.Room_Master.getChildByName('Btn_share');
		this.Btn_paymore = this.Room_Master.getChildByName('Btn_paymore');

		this.Btn_delRoom.setTouchEnabled(true);
		this.Btn_delRoom.addTouchEventListener(this.onClickMasterEvent, this);
		this.Btn_share.setTouchEnabled(true);
		this.Btn_share.addTouchEventListener(this.onClickMasterEvent, this);

		// this.Btn_paymore.setTouchEnabled(true);
		// this.Btn_paymore.addTouchEventListener(this.onClickMasterEvent, this);
		this.Btn_paymore.setVisible(false);//暂定取消

		this.Room_player = this._rootWidget.getChildByName('Room_player');

		this.Player_share = this.Room_player.getChildByName('Btn_share');
		this.Player_back = this.Room_player.getChildByName('Btn_back');
		this.Player_share.setTouchEnabled(true);
		this.Player_share.addTouchEventListener(this.onClickPlayerEvent, this);
		this.Player_back.setTouchEnabled(true);
		this.Player_back.addTouchEventListener(this.onClickPlayerEvent, this);

		this.onIsMaster(this.Master);

		this.Image_main = this.Image_bg.getChildByName('Image_main');
		this.ListView_result = this.Image_main.getChildByName('ListView_result');
		this.Panel_result = this.ListView_result.getChildByName('Panel_result');
		this.setonResultView(this.gamenum);

		// 显示个人头像名字
		this.setImageView();

		this.addActionNodeMB(this.Panel_bg);
		this.addActionNodeMB(this.Image_bg);
	},

	onIsMaster : function(Master) {
		if(Master == true){
			this.Room_Master.setVisible(true);
			this.Room_player.setVisible(false);
		}
		else{
			this.Room_Master.setVisible(false);
			this.Room_player.setVisible(true);
		}
	},

	//设置续费按钮不可用
	setPayMoreBtnEnable: function (dlgTip) {
		var dlg = UIMgr.getInstance().getDlg(ID_DlgResult);
        dlg.Btn_paymore.setTouchEnabled(false);
        dlgTip.closeTip();
    },

	setonResultView : function(gamenum){
		var Listsize = this.ListView_result.getSize();
		var Panelsize = this.Panel_result.getSize();
		var sizeMain = this.Image_main.getSize();

		this.Text_allresult = new Array();
		var Panel_Arr = new Array();
		Panel_Arr[0] = this.Panel_result;

		this.Text_allresult[0] = this.Image_main.getChildByName('Text_allresult');
        this.Text_allresult[0].setVisible(false);
		//64-74  计算总成绩个数 this.Text_allresult
		if(this.gamekind>1){
			for(var num =1 ; num<(this.gamekind) ; num++){
                this.Text_allresult[0].setVisible(true);
				this.Text_allresult[num] = this.Text_allresult[0].clone();
				this.Image_main.addChild(this.Text_allresult[num]);
			}
		}
		for(var num =0 ; num<this.gamekind ; num++){
			this.Text_allresult[num].x = (sizeMain.width/(this.gamekind+1))*(num + 1);
			this.Text_allresult[num].y = this.Text_allresult[0].y;
		}

		// 76-88 计算总局数Panel_Arr
		var itemsNum;
		if(gamenum>9){
			itemsNum=gamenum;
		}else{
			itemsNum=9;
		}
		if(itemsNum>1){
			for(var num =1;num<itemsNum;num++ ){
				Panel_Arr[num] = this.Panel_result.clone();
				var Text_number = Panel_Arr[num].getChildByName('Text_number');
                Text_number.string = "第"+(num+1)+"局";
				if (num + 1 > gamenum) {
                    Text_number.string = "";
				}
				if(num%2>0){
					var Image_2 = Panel_Arr[num].getChildByName('Image_2');
					Image_2.setVisible(false);
				}
				this.ListView_result.pushBackCustomItem(Panel_Arr[num]);
			}
		}

		// 每一局分数赋值
		var result = new Array();

		for(var num = 0;num<this.gamekind;num++){
			result[num]=0;
		}
		for(var Inum =0;Inum<gamenum;Inum++ ){
			var Text_player = new Array();
			Text_player[0] = Panel_Arr[Inum].getChildByName('Text_player1');
			for(var Jnum =1; Jnum<this.gamekind ; Jnum++){
				Text_player[Jnum] = Text_player[0].clone();
				Panel_Arr[Inum].addChild(Text_player[Jnum]);
			}
			for(var pos = 0;pos<this.gamekind;pos++){

                var plaza = ClientData.getInstance().getPlaza();
                var temp = 0;
                if(plaza.getCurKindID() === CMD_NIUNIU_TB.KIND_ID) {
                    temp = (this.playerDatas[pos] && this.playerDatas[pos].gNumPoint &&this.playerDatas[pos].gNumPoint[Inum]) || 0;
				} else {
					if(this.playerDatas[pos].gNumPoint[Inum] == null){
						temp = 0;
					}
					else{
						temp = this.playerDatas[pos].gNumPoint[Inum];
					}
                    
				}
				cc.log("战绩页显示中心="+temp);
				Text_player[pos].string = temp;
				result[pos] = result[pos]+temp;
				Text_player[pos].x = (Panelsize.width/(this.gamekind+1))*(pos + 1);
			}
		}


		for(var pos = 0;pos<this.gamekind;pos++){
			this.Text_allresult[pos].string = result[pos];
		}

	},

	setImageView : function(){
        this.Image_main.getChildByName('Panel_player1').setVisible(false);

        this.Image_player = new Array ();

        var gamekind = this.playerDatas.length;
        sizeMain = this.Image_main.getSize();
        var Panel_player = this.Image_main.getChildByName('Panel_player1');
        for (var pos = 0; pos < gamekind; pos++) {
            Panel_player.setVisible(true);
        	// player层
            var PanelPlayer = (pos == 0)? Panel_player : Panel_player.clone();
            PanelPlayer.x = (sizeMain.width / (gamekind + 1)) * (pos + 1);
            PanelPlayer.y = sizeMain.height * 0.83;
            if (pos != 0) this.Image_main.addChild(PanelPlayer);

            // 头像层
            this.Image_player[pos] = PanelPlayer.getChildByName('Image_player');
            var Text_name = PanelPlayer.getChildByName('Text_name');

            var player = this.playerDatas[pos].nPlayer;

            if (player) {
                Text_name.string = player.getNickName();
                var imageThum = this.Image_player[pos];
                player.loadUrlImage(function (imagePath) {
					imageThum.loadTexture(imagePath, ccui.Widget.LOCAL_TEXTURE);
                });

			}
		}

	},

	onClickMasterEvent: function(sender, type) {
		if (ccui.Widget.TOUCH_ENDED == type) {
			var strBtnName = sender.getName();
			cc.log('onClickEvent ' + strBtnName);
			switch (strBtnName) {
			case "Btn_delRoom":
                // OpenRoomMsg.getInstance().sendReturnPlaza();//与续费相关
                GameUserMsg.getInstance().sendStandUp(true);
                GameKindMgr.getInstance().backPlazaScene();
				break;
			case "Btn_share":
				this.shareResult();
				break;
			case "Btn_paymore":
                var game = ClientData.getInstance().getGame();
                if (game.getCancelRoomSign && game.getCancelRoomSign()) {
                    DlgTip.openSysTip("此房间已解散请返回大厅", function (target) {
						target.closeTip();
                    });
				} else {
					var intoRoomData,
					 plaza = ClientData.getInstance().getPlaza();
					 if (plaza.getCreateRoomData()) {
					 	intoRoomData = plaza.getCreateRoomData();
					 } else {
						 if (game) {
							 var data = {
								 dwRounds: game.getGameCount(),	//局数
								 dwBaseScore: game.getCellScore(),	//底分
								 settlementType: 1//结算方式
							 };
						 }
					 	intoRoomData = data;
					 }
					 OpenRoomMsg.getInstance().sendRenewRoom(intoRoomData);
				}
				break;
			default:
				break;
			}
		}
	},
	onClickPlayerEvent: function(sender, type) {
		if (ccui.Widget.TOUCH_ENDED == type) {
			var strBtnName = sender.getName();
			cc.log('onClickEvent ' + strBtnName);
			switch (strBtnName) {
			case "Btn_share":
                this.shareResult();
				break;
			case "Btn_back":
                GameUserMsg.getInstance().sendStandUp(true);
                GameKindMgr.getInstance().backPlazaScene();
				break;
			default:
				break;
			}
		}
	},
	onClickEvent: function(sender, type) {
		if (ccui.Widget.TOUCH_ENDED == type) {

			var strBtnName = sender.getName();
			cc.log('onClickEvent ' + strBtnName);
			switch (strBtnName) {
			case "Image_bg":
				// UIMgr.getInstance().closeDlg(ID_DlgResult);
				break;
			default:
				break;
			}
		}
	},

	shareResult: function () {
        if(cc.sys.isNative) {
            //截屏
            var target = WXShare.SHARE_TARGET_CIRCLE;
            WXShare.getInstance().shareCaptureScreen(target, function () {
                cc.log("++++++战绩中心界面----分享+++成功+++");
                WXShare.getInstance().showSysTip("---分享成功---");
            });
        }
    },

});
