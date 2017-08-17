
DLG_CREATOR[ID_DlgGameRecordCenter] = function() {
	return new DlgGameRecordCenter();
};

var DlgGameRecordCenter = DlgBase.extend({
	ctor: function(){},

	onCreate: function() {
		this.init();
	},

	onClose: function() {

	},

	init: function() {
		var json = ccs.load(res.dlgRecordCenterScene_json);
		this._rootWidget = json.node;

		//自适应屏幕大小
		var sizeDir = cc.director.getWinSize();
		this._rootWidget.setContentSize(sizeDir);
		ccui.helper.doLayout(this._rootWidget);
		
		this.Panel_root = this._rootWidget.getChildByName('Panel_root');
		var Button_share = this.Panel_root.getChildByName('Button_share');
		Button_share.addTouchEventListener(this.onClickEvent, this);
		var Button_exitRoom = this.Panel_root.getChildByName('Button_exitRoom');
		Button_exitRoom.addTouchEventListener(this.onClickEvent, this);

		this.Button_restart = this.Panel_root.getChildByName('Button_restart');
		this.Button_restart.addTouchEventListener(this.onClickEvent, this);
		this.Button_close = this.Panel_root.getChildByName("Button_close");
        this.Button_close.addTouchEventListener(this.onClickEvent, this);
        var room = ClientData.getInstance().getRoom();
        // room.getRenew() 默认 false
        if(room.getRenew()){
            this.Button_restart.setVisible(false);
            this.Button_close.setVisible(true);
        }
        else{
            this.Button_restart.setVisible(true);
            this.Button_close.setVisible(false);
		}
		
		//init playerInfo
		var Panel_playerInfo = this.Panel_root.getChildByName('Panel_playerInfo');
		var table = ClientData.getInstance().getTable();
		for(var chairID=0; chairID<6; ++chairID){
			
			var player = table.getPlayerByChairID(chairID);
			if(player){
				var Panel_player = Panel_playerInfo.getChildByName('Panel_player_'+chairID);
				var Text_nickName = Panel_player.getChildByName('Text_nickName');
				var Image_head = Panel_player.getChildByName('Image_head');
				var Button_zan = Panel_player.getChildByName('Button_zan');
				Text_nickName.setVisible(true);
				Image_head.setVisible(true);
				Button_zan.setVisible(true);
				
				//玩家昵称
				var name = player.getNickName();
                if(name.replace(/[\u4e00-\u9fa5]/g,"zz").length > 12){
                    name = name.substring(0, 6) + "...";
                };
                Text_nickName.string = name;

				if(chairID==g_objHero.getChairID()){
					//自己
                    Text_nickName.setColor(cc.color(255,255,0,255));
                    //隐藏自己的点赞按钮
                    Button_zan.setVisible(false);
                }
				//玩家头像
                player.loadUrlImage(function (imagePath) {
                    Image_head.loadTexture(imagePath, ccui.Widget.LOCAL_TEXTURE);
                });
				//点赞回调
                Button_zan.addTouchEventListener(this.onClickEvent, this);
			}
		}

		this._rootWidget.setLocalZOrder(50);

		this.isBtnRestart = false;
	},
	
	doRefresh:function(){
		var Panel_recordTemp = this.Panel_root.getChildByName('Panel_recordTemp');
		var Panel_total = this.Panel_root.getChildByName('Panel_total');
		var ListView_record = this.Panel_root.getChildByName('ListView_record');
		var DetailScore = this.recordInfo.DetailScore;
        //ListView_record.removeAllItems();
		for(var index=0; index<DetailScore.length; ++index){
			var scoreInfo = DetailScore[index];
			var item = Panel_recordTemp.clone();

			//
            var Image_bg = item.getChildByName('Image_bg');
            Image_bg.setVisible((index%2)==0);

			//setItem
			var Text_rounds = item.getChildByName('Text_rounds');
			Text_rounds.string = "第"+(index+1)+"局";
			
			//积分
			for(var chairID=0; chairID<scoreInfo.length; ++chairID){
				var Text_score = item.getChildByName('Text_total_'+chairID);
				Text_score.string = scoreInfo[chairID];

				if(scoreInfo[chairID] < 0) Text_score.setColor(cc.color(102,225,225,225));
				else Text_score.setColor(cc.color(255,225,225,225));

				// if(chairID==g_objHero.getChairID()){
				//		自己
				//		Text_score.setColor(cc.color(255,0,0,255));
                // }
			}

			item.setVisible(true);
			ListView_record.pushBackCustomItem(item);
		}

		// 文档需求 bug:1112   liquan
		if(DetailScore.length < 8){
			for(var index=DetailScore.length; index<8; ++index){
                var item = Panel_recordTemp.clone();
                var Image_bg = item.getChildByName('Image_bg');
                Image_bg.setVisible((index%2)==0);
                var Text_rounds = item.getChildByName('Text_rounds');
                Text_rounds.string = "";
                for(var i=0; i<6; ++i){
                    var Text_score = item.getChildByName('Text_total_'+i);
                    Text_score.string = "";
				}
                item.setVisible(true);
                ListView_record.pushBackCustomItem(item);
			}
		}

		ccui.ScrollView.prototype.scrollToTop.call(ListView_record,0.01, false);
		
		//set Panel_total
		var AllScore = this.recordInfo.AllScore;
		for(var chairID=0; chairID<AllScore.length; ++chairID){
			var Text_total = Panel_total.getChildByName('Text_total_'+chairID);
			Text_total.string = AllScore[chairID];

			if(AllScore[chairID] < 0) Text_total.setColor(cc.color(102,225,225,225));

			// if(chairID==g_objHero.getChairID()){
			// 	//自己
             //    Text_total.setColor(cc.color(255,0,0,255));
			// }
		}

        var Button_restart = this.Panel_root.getChildByName('Button_restart');
		if(this.recordInfo && 2 == this.recordInfo.Reason){
            Button_restart.setVisible(false)
		}
		else
		{
            Button_restart.setVisible(true)
		}
	},
	/*
	 *recordInfo = {
	 *	"DetailScore":[
	 *		[],
	 *		[],
	 *		[]
	 *	],
	 *	"AllScore":[]
	 *}
	 *
	 */
	/*

	 */
	setInit: function(recordInfo, exitRoomCB , reStartCB, shareCB){
		this.recordInfo = recordInfo;
		this.exitRoomCB = exitRoomCB;//退出房间回调
		this.shareCB = shareCB;		//分享成功回调
		this.reStartCB = reStartCB;	// 续费成功的回调

		this.doRefresh();
	},
	// 收到房间续费消息时改变 this.isBtnReset 的状态
	onRenew: function () {
		this.isBtnRestart = false;
    },

	// 如果收到房间解散消息则隐藏再来一把按钮,以及确定按钮
	reSetStartBtn:function () {
        this.Button_restart.setVisible(false);
        this.Button_close.setVisible(false);
    },

	// 收到房间续费成功消息隐藏再来一把按钮显示确定按钮
	onRenewSuccess: function (data) {
		this.onRenew();

		var table = ClientData.getInstance().getTable();
		var player = table.getPlayerByUserId(data.UserID);
		var chairID = player.getChairID();

		if(g_objHero.getChairID()!=chairID){
			this.Button_restart.setVisible(false);
			this.Button_close.setVisible(true);
		}
		else {
            this.Button_restart.setVisible(true);
            this.Button_close.setVisible(false);
            var self = this;
            DlgTip.openSysTip("房间续费成功!", function (target) {
                target.closeTip();
                self.reStartCB();
            });
		}
    },

	onClickEvent: function(sender, type) {
		if (ccui.Widget.TOUCH_ENDED == type) {
			var tName = sender.getName();
			switch(tName){
			case "Button_exitRoom":{
				//退出房间
				UIMgr.getInstance().closeDlg(ID_DlgGameRecordCenter);
				if(this.exitRoomCB)
					this.exitRoomCB();
				break;
			}
			case "Button_share":{
				//炫耀
				var dlgGameShare = UIMgr.getInstance().openDlg(ID_DlgGameShare);
				if(dlgGameShare){
                    dlgGameShare.Panel_root.setVisible(true);
                    dlgGameShare.shareSet(WXShare.SHARE_TYPE_CAPTURESCREEN, this.shareCB);
				}

				break;
			}
			case "Button_restart":{
                //再来一把
				if(!this.isBtnRestart){
                    UserServerMsg.getInstance().sendRestart();
					this.isBtnRestart = true;
                }
                break;
            }
            case "Button_zan":{
                var parentName = sender.getParent().getName();
                var chairID = parentName.replace("Panel_player_","");
                var table = ClientData.getInstance().getTable();
                var player = table.getPlayerByChairID(chairID);

                //发送点赞
                UserServerMsg.getInstance().sendClickZan(player.getUserId());
                sender.setVisible(false);
                break;
            }
			case "Button_close":
                this.reStartCB();
				break;
			default:
				break;
			}
		}
	}
	
});