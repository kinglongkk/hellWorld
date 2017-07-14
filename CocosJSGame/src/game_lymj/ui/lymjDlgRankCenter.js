

cc.log("--------ID_DlgLymjRankCenter = "  + ID_DlgLymjRankCenter);
DLG_CREATOR[ID_DlgLymjRankCenter] = function() {
	return new DlgLymjRankCenter();
};

var DlgLymjRankCenter = DlgBase.extend({
	//成员函数
	ctor: function(){	
	
	},
	onCreate: function() {
		this.init();
		this.reset();
	},
	onClose: function() {

	},
	reset: function() {
		
	},
	setBtnCallBack: function(btnParent, btnName, listener){
		if(btnParent==null){
			return null;
		}

		var btn = btnParent.getChildByName(btnName);
		if(btn==null){
			return null;
		}
		btn.setPressedActionEnabled(true);
		btn.addTouchEventListener(listener, this);

		return btn;
	},
	init: function() {		
		// 初始变量设定
		
		var json = ccs.load(res.lymjDlgRankCenter_json);
		this._rootWidget = json.node;
		
		// 自适应屏幕大小
		var sizeDir = cc.director.getWinSize();
		this._rootWidget.setContentSize(sizeDir);
		ccui.helper.doLayout(this._rootWidget);
		cc.log("创建 战绩中心...");
		
		this.Panel_root = this._rootWidget.getChildByName("Panel_root");
		this.Panel_list = this.Panel_root.getChildByName("Panel_list");
		this.ListView_rankList = this.Panel_list.getChildByName("ListView_rankList");
		this.Panel_userInfo = this.Panel_list.getChildByName("Panel_userInfo");
	},
	show: function(){
		var game = ClientData.getInstance().getGame();
		var table = ClientData.getInstance().getTable();
		if(!game || !table){
			return false;
		}
		
		//分享按钮
		var Button_show = this.setBtnCallBack(this.Panel_root, "Button_show", this.onClickEvent);
		//返回按钮
		var Button_quit = this.setBtnCallBack(this.Panel_root, "Button_quit", this.onClickEvent);
		//再来一把按钮
		var Button_continue = this.setBtnCallBack(this.Panel_root, "Button_continue", this.onClickEvent);
		
		for(var i=0;i<CMD_LYMJ.GAME_PLAYER;i++)
		{
			//玩家信息
			
			var randPanel_root = this.Panel_userInfo.getChildByName("Node_userInfo_"+i).getChildByName("Panel_root");
			
			var player = table.getPlayerByChairID(i);
			
			if(player)
			{
				randPanel_root.getChildByName("Text_nickName").string = player.getNickName() ;

				// 头像
				var Image_head = randPanel_root.getChildByName("Image_head");
				player.loadUrlImage(function(savePath){
					if(savePath!=undefined && savePath.length>=0)
					{
						Image_head.loadTexture(savePath, ccui.Widget.LOCAL_TEXTURE);
						Image_head.setContentSize(cc.size(76,76));
					}
				});
			}

		}
        
		if(player!=null && game.getTableOwnerUserID()!=player.getUserId()){
            Button_continue.setVisible(false);
        }

		var index = [
		             "一","二","三","四","五","六","七","八","九","十",
		             "十一","十二","十三","十四","十五","十六","十七","十八","十九","二十",
		             "二十一","二十二","二十三","二十四","二十五","二十六","二十七","二十八","二十九","三十",
		             "三十一","三十二","三十三","三十四","三十五","三十六","三十七","三十八","三十九","四十",
		             ];
		
		//积分信息
		this.ListView_rankList = this.Panel_list.getChildByName("ListView_rankList");
		var total = [0,0,0,0];
		var totalRounds = game.getPlayCount();
		var settleScore_0 = game.getSettleScore(0);
		var settleScore_1 = game.getSettleScore(1);
		var settleScore_2 = game.getSettleScore(2);
		var settleScore_3 = game.getSettleScore(3);
		cc.log("settleScore_0 = " + JSON.stringify(settleScore_0));
		cc.log("settleScore_1 = " + JSON.stringify(settleScore_1));
		cc.log("settleScore_2 = " + JSON.stringify(settleScore_2));
		cc.log("settleScore_3 = " + JSON.stringify(settleScore_3));
		
		cc.log("totalRounds----"+totalRounds);
		for(var i=0; i<totalRounds; ++i){
			var Panel_rankItem = this.Panel_list.getChildByName("Panel_rankItem").clone();
			if(i%2==1){
				Panel_rankItem.getChildByName("Image_cell_bg").setVisible(false);
			}
			var Text_rank = Panel_rankItem.getChildByName("Text_rank");
			var Text_rank_0 = Panel_rankItem.getChildByName("Text_rank_0");
			var Text_rank_1 = Panel_rankItem.getChildByName("Text_rank_1");
			var Text_rank_2 = Panel_rankItem.getChildByName("Text_rank_2");
			var Text_rank_3 = Panel_rankItem.getChildByName("Text_rank_3");
			
			Text_rank.string = "第"+index[i]+"局";
			
			total[0] = total[0]+settleScore_0[i];
			total[1] = total[1]+settleScore_1[i];
			total[2] = total[2]+settleScore_2[i];
			total[3] = total[3]+settleScore_3[i];
			
			cc.log("total----"+total[0]+"/"+total[1]+"/"+total[2]+"/"+total[3]+"/");
			cc.log("settleScore_0----"+settleScore_0[i]+"/"+settleScore_1[i]+"/"+settleScore_2[i]+"/"+settleScore_3[i]+"/");
			
			if(settleScore_0[i]>=0)
				Text_rank_0.string = "+"+Math.abs(settleScore_0[i]);
			else if(settleScore_0[i]<0)
				Text_rank_0.string = "-"+Math.abs(settleScore_0[i]);
			
			if(settleScore_1[i]>=0)
				Text_rank_1.string = "+"+Math.abs(settleScore_1[i]);
			else if(settleScore_1[i]<0)
				Text_rank_1.string = "-"+Math.abs(settleScore_1[i]);
			
			if(settleScore_2[i]>=0)
				Text_rank_2.string = "+"+Math.abs(settleScore_2[i]);
			else if(settleScore_2[i]<0)
				Text_rank_2.string = "-"+Math.abs(settleScore_2[i]);
			
			if(settleScore_3[i]>=0)
				Text_rank_3.string = "+"+Math.abs(settleScore_3[i]);
			else if(settleScore_3[i]<0)
				Text_rank_3.string = "-"+Math.abs(settleScore_3[i]);
			
			Panel_rankItem.setVisible(true);
			this.ListView_rankList.addChild(Panel_rankItem);
		}
		
		var Panel_rankTotal = this.Panel_list.getChildByName("Panel_rankTotal");
		for(var i=0;i<CMD_LYMJ.GAME_PLAYER;i++)
		{//总积分
			var totalScore = total[i];
			var Text_rank = Panel_rankTotal.getChildByName("Text_rank_"+i);
			
			if(totalScore>=0)
				Text_rank.string = "+"+Math.abs(totalScore);
				
			if(totalScore<0)
				Text_rank.string = "-"+Math.abs(totalScore);
			
			if(i==g_objHero.getChairID()){
				if(totalScore<=0)
					SoundMgr.getInstance().playEffect("lymj_rankLose", 0, false);
				else
					SoundMgr.getInstance().playEffect("lymj_rankWin", 0, false);
			}
		}
	},
	
	onClickEvent: function(sender, type){
		if (ccui.Widget.TOUCH_ENDED == type){	
			SoundMgr.getInstance().playEffect("lymj_button", 0, false);
			
			var name=sender.getName();
			switch(name){
			case "Button_show":
				cc.log("++++++战绩中心界面----分享++++++");
				if(cc.sys.isNative){
					//截屏
					var target = WXShare.SHARE_TARGET_CIRCLE;
					WXShare.getInstance().shareCaptureScreen(target, function(){
						cc.log("++++++战绩中心界面----分享+++成功+++");
						WXShare.getInstance().showSysTip("---分享成功---");
					});
				}
				
				break;
			case "Button_quit":
				cc.log("++++++战绩中心界面----返回++++++");
				//关闭战绩中心
				UIMgr.getInstance().closeDlg(ID_DlgLymjRankCenter);
				
				var game = ClientData.getInstance().getGame();
				var curRounds = game.getPlayCount();
				var totalRounds = game.getDrawCountLimit();
				if(curRounds==totalRounds){
					//返回大厅
					GameUserMsg.getInstance().sendStandUp(true);
					GameKindMgr.getInstance().backPlazaScene();
					OpenRoomMsg.getInstance().sendReturnPlaza();
				}
				
				break;
			case "Button_continue":
				cc.log("++++++战绩中心界面----续费++++++");
				DlgTip.openSysTip("功能尚未开放，敬请期待!");
				
//				//关闭战绩中心
//				UIMgr.getInstance().closeDlg(ID_DlgLymjRankCenter);
//
//				var dlgCardsInf=UIMgr.getInstance().getDlg(ID_DlgLymjCardsInfo);
//				//清理界面
//				dlgCardsInf.doClear();
//				
//				var intoRoomData,
//				plaza = ClientData.getInstance().getPlaza();
//				if (plaza.getCreateRoomData()) {
//					intoRoomData = plaza.getCreateRoomData();
//				} else {
//					var game = ClientData.getInstance().getGame();
//					if (game) {
//						var data = {
//						dwRounds: game.getDrawCountLimit(),	//局数
//								dwBaseScore: game.getCellScore(),	//底分
//								settlementType: 1//结算方式
//						};
//					}
//					intoRoomData = data;
//				}
//				OpenRoomMsg.getInstance().sendRenewRoom(intoRoomData);
				break;
			default:
				break;
			}
		}
	},
});  
