/*
 * 红中麻将 结算界面
 * Author: 	xjn 
 * Date:	2017.4.26
 *
 * 功能：
 * 
 * */

cc.log("--------ID_DlgHzmjSettlement = "  + ID_DlgHzmjSettlement);
DLG_CREATOR[ID_DlgHzmjSettlement] = function() {
	return new DlgHzmjSettlement();
};

var DlgHzmjSettlement = DlgBase.extend({
	//成员函数
	ctor: function(){	
	
	},
	onCreate: function() {
		this.init();
		
	},
	onClose: function() {
		//关闭
		//UIMgr.getInstance().closeDlg(ID_DlgHzmjSettlement);
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
		var json = ccs.load(res.hzmjDlgSettlement_json);
		this._rootWidget = json.node;
		
		// 自适应屏幕大小
		var sizeDir = cc.director.getWinSize();
		this._rootWidget.setContentSize(sizeDir);
		ccui.helper.doLayout(this._rootWidget);
		cc.log("创建 结算界面...");
		
		this.Panel_root = this._rootWidget.getChildByName("Panel_root");
	},
	updateCard:function(cardData,cardCount){
		for(var i=0; i<CMD_HZMJ.MAX_COUNT;i++)
		{
			if(cardData[i]==0)
				cardData[i] = 100;
		}

		var bSorted=true;
		var swichData=0;
		var last=cardCount-1;
		do{
			bSorted=true;
			for(var i=0; i<last;i++)
			{
				if(cardData[i]>cardData[i+1])
				{
					bSorted=false;
					swichData=cardData[i];
					cardData[i]=cardData[i+1];
					cardData[i+1]=swichData;
				}
			}
			last--;
		}while(bSorted == false);
	},
	
	//显示结算界面
	show: function(result){
		var varResult = result;
		//cc.log("游戏结束 varResult = " + JSON.stringify(varResult));
		
		var dlgCardsInf=UIMgr.getInstance().getDlg(ID_DlgHzmjCardsInfo);
		var game = ClientData.getInstance().getGame();
		var table = ClientData.getInstance().getTable();
		if(!game || !table || !dlgCardsInf){
			return false;
		}
		
		//初始化 列表
		var Panel_disTemp = this.Panel_root.getChildByName("Panel_disTemp");
		var Panel_mGang = this.Panel_root.getChildByName("Panel_mGang");
		var Panel_anGang = this.Panel_root.getChildByName("Panel_anGang");
		var isDraw = true; 	//是否和局
		for(var chairID=0; chairID<CMD_HZMJ.GAME_PLAYER; ++chairID){
			var Panel_settle = this.Panel_root.getChildByName("Panel_settle_"+chairID);
			
			//玩家信息
			var player = table.getPlayerByChairID(chairID);
			var Image_userInfo = Panel_settle.getChildByName("Image_userInfo");
			var Image_head = Image_userInfo.getChildByName("Image_head");
			var Text_nickName = Image_userInfo.getChildByName("Text_nickName");
			Text_nickName.string = player.getNickName();
			
			//头像
			player.loadUrlImage(function(savePath){
				Image_head.loadTexture(savePath, ccui.Widget.LOCAL_TEXTURE);
				Image_head.setContentSize(cc.size(76,76));
			});
			//胡牌信息
			var Text_settleInfo = Panel_settle.getChildByName("Text_settleInfo");
			Text_settleInfo.setVisible(false);

			//牌信息
			//手牌
			var ListView_card = Panel_settle.getChildByName("ListView_card");
			//排序手牌
			this.updateCard(varResult.cbHandCardData[chairID],CMD_HZMJ.MAX_COUNT);
			//画手牌
			for(var i=0; i<CMD_HZMJ.MAX_COUNT; ++i){
				var cardValue = varResult.cbHandCardData[chairID][i];
				if(cardValue!=0&&cardValue!=100){
					cc.log("++++手牌+++cardValue = "+cardValue);
					var Image_cardTemp = Panel_settle.getChildByName("Image_cardTemp").clone();
					Image_cardTemp.getChildByName("Image_color").loadTexture(dlgCardsInf.getFCard(cardValue), ccui.Widget.PLIST_TEXTURE);
					Image_cardTemp.setVisible(true);
					ListView_card.pushBackCustomItem(Image_cardTemp);
				}
			}
			//间隔控件
			ListView_card.pushBackCustomItem(Panel_disTemp.clone());
			ListView_card.pushBackCustomItem(Panel_disTemp.clone());
			
			//杠碰
			if(varResult.cbBpBgCardData[chairID]){
				for(var i=0; i<varResult.cbBpBgCardData[chairID].length; ++i){
					var openCard = varResult.cbBpBgCardData[chairID][i];
					var cardValue = openCard.cardValue;
					if(openCard.cardMask&CMD_HZMJ.WIK_PENG){
						//碰
						cc.log("++++碰+++cardValue = "+cardValue);
						var cardTemp = Panel_mGang.clone();
						for(var index=0; index<3; ++index){
							var Image_cardTemp = cardTemp.getChildByName("Image_cardTemp_"+index);
							Image_cardTemp.getChildByName("Image_color").loadTexture(dlgCardsInf.getFCard(cardValue), ccui.Widget.PLIST_TEXTURE);
						}

						cardTemp.setVisible(true);
						ListView_card.pushBackCustomItem(cardTemp);
					}
					else if(openCard.cardMask&CMD_HZMJ.WIK_GANG){
						//明杠
						cc.log("++++明杠+++cardValue = "+cardValue);
						var cardTemp = Panel_mGang.clone();
						for(var index=0; index<3; ++index){
							var Image_cardTemp = cardTemp.getChildByName("Image_cardTemp_"+index);
							Image_cardTemp.getChildByName("Image_color").loadTexture(dlgCardsInf.getFCard(cardValue), ccui.Widget.PLIST_TEXTURE);
						}
						var Image_cardTemp_Mid = cardTemp.getChildByName("Image_cardTemp_Mid");
						Image_cardTemp_Mid.setVisible(true);
						Image_cardTemp_Mid.getChildByName("Image_color").loadTexture(dlgCardsInf.getFCard(cardValue), ccui.Widget.PLIST_TEXTURE);

						cardTemp.setVisible(true);
						ListView_card.pushBackCustomItem(cardTemp);
					}
					else if(openCard.cardMask&CMD_HZMJ.WIK_ANGANG){
						//暗杠
						if(cardValue!=0){
							cc.log("++++暗杠+++cardValue = "+cardValue);
							var cardTemp = Panel_anGang.clone();
							var Image_cardTemp_Mid = cardTemp.getChildByName("Image_cardTemp_Mid");
							Image_cardTemp_Mid.getChildByName("Image_color").loadTexture(dlgCardsInf.getFCard(cardValue), ccui.Widget.PLIST_TEXTURE);
							cardTemp.setVisible(true);
							ListView_card.pushBackCustomItem(cardTemp);
						}
					}

					//间隔控件
					ListView_card.pushBackCustomItem(Panel_disTemp.clone());
				}
			}
			
			//胡的牌
			if(varResult.dwChiHuKind[chairID]==CMD_HZMJ.WIK_CHI_HU){
				var cardValue = varResult.cbSendCardData;
				var Image_cardTemp = Panel_settle.getChildByName("Image_cardTemp").clone();
				Image_cardTemp.getChildByName("Image_color").loadTexture(dlgCardsInf.getFCard(cardValue), ccui.Widget.PLIST_TEXTURE);
				Image_cardTemp.setVisible(true);
				ListView_card.pushBackCustomItem(Image_cardTemp);
			}
			
			//分数
			var AtlasLabel_win = Panel_settle.getChildByName("AtlasLabel_win");
			if(varResult.lGameScore[chairID]>0){
				AtlasLabel_win.setProperty("."+varResult.lGameScore[chairID], res.rank_numY, 30, 30, ".");
			}
			else if(varResult.lGameScore[chairID]<0){
				AtlasLabel_win.setProperty("/"+Math.abs(varResult.lGameScore[chairID]), res.rank_numB, 30, 30, ".");
			}
			else{
				AtlasLabel_win.setProperty("0", res.rank_numB, 30, 30, ".");
			}
			AtlasLabel_win.setContentSize(cc.size(30*AtlasLabel_win.string.length,30));
			
			if(chairID!=g_objHero.getChairID()){
				Panel_settle.setColor(cc.color(200, 200, 200, 255));
			}
			
			//输赢标识
			var Image_winTag = Panel_settle.getChildByName("Image_winTag");
			if(varResult.dwChiHuKind[chairID]!=CMD_HZMJ.WIK_CHI_HU){
				//输了
				Image_winTag.setVisible(false);
				
				//设置你输了
				if(chairID==g_objHero.getChairID() && varResult.lGameScore[chairID]<=0){
					var Image_title = this.Panel_root.getChildByName("Image_titleBg").getChildByName("Image_title");
					Image_title.loadTexture("hzmj_settleAndRank/settle_failed.png", ccui.Widget.PLIST_TEXTURE);
					
					SoundMgr.getInstance().playEffect("hzmj_settleLose", 0, false);
				}
			}
			else{
				//有人胡牌
				isDraw = false;
				
				//码牌
				var Panel_ma = Panel_settle.getChildByName("Panel_ma");
				var cardCounts = 0;
				for(var i=0; i<7; ++i){
					var cardValue = varResult.cbMaData[i];
					if(cardValue!=0 && cardValue!=100){
						var Image_cardTemp = Panel_settle.getChildByName("Image_cardTemp").clone();
						cc.log("码牌+++++index "+i+" value "+varResult.cbMaData[i])
						Image_cardTemp.getChildByName("Image_color").loadTexture(dlgCardsInf.getFCard(cardValue), ccui.Widget.PLIST_TEXTURE);
						Image_cardTemp.setPosition(cc.p(46+92*i,0));
						Image_cardTemp.setVisible(true);
						Panel_ma.addChild(Image_cardTemp);
						cardCounts++;
					}
				}

				//码数
//				var maCount = AtlasLabel_win.clone();
//				maCount.setPosition(cc.p(Panel_ma.getContentSize().width*(cardCounts/2.0),130));
//				maCount.setProperty("."+varResult.cbMaCount[chairID], res.rank_numY, 30, 30, ".");
//				maCount.setContentSize(cc.size(30*maCount.string.length,30));
//				Panel_ma.addChild(maCount);
				
				if(chairID==g_objHero.getChairID() && varResult.lGameScore[chairID]>0){
					SoundMgr.getInstance().playEffect("hzmj_settleWin", 0, false);
				}
			}
		}
		
		if(isDraw){
			var Image_title = this.Panel_root.getChildByName("Image_titleBg").getChildByName("Image_title");
			Image_title.loadTexture("hzmj_settleAndRank/settle_draw.png", ccui.Widget.PLIST_TEXTURE);
		}

		//分享按钮
		var Button_fenXiang = this.setBtnCallBack(this.Panel_root, "Button_fenXiang", this.onClickEvent);

		//准备按钮
		var Button_ready = this.setBtnCallBack(this.Panel_root, "Button_ready", this.onClickEvent);
	},
	
	onClickEvent: function(sender, type){
		if (ccui.Widget.TOUCH_ENDED == type){		
			SoundMgr.getInstance().playEffect("hzmj_button", 0, false);
			
			var name=sender.getName();
			switch(name){
			case "Button_fenXiang":
				cc.log("++++++结算界面----分享++++++");
				if(cc.sys.isNative){
					//截屏
					var target = WXShare.SHARE_TARGET_CIRCLE;
					WXShare.getInstance().shareCaptureScreen(target, function(){
						cc.log("++++++结算界面----分享+++成功+++");
						WXShare.getInstance().showSysTip("---分享成功---");
					});
				}
				break;
			case "Button_ready":
				cc.log("++++++结算界面----准备++++++");
				//关闭结算界面
				UIMgr.getInstance().closeDlg(ID_DlgHzmjSettlement);
				
				var dlgCardsInf=UIMgr.getInstance().getDlg(ID_DlgHzmjCardsInfo);
				//清理界面
				dlgCardsInf.doClear();
				
				var game = ClientData.getInstance().getGame();
				if(!game){
					return;
				}
				var curRounds = game.getPlayCount();
				var totalRounds = game.getDrawCountLimit();
				if(curRounds==totalRounds){
					GameUserMsg.getInstance().sendStandUp(true);
					GameKindMgr.getInstance().backPlazaScene();
				}
				else{
					//发送开始
					GameFrameMsg.getInstance().sendReady();
				}
				break;
			default:
				break;
			}
		}
	},
});  

























































