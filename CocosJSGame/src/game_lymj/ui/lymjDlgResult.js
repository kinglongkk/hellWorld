

cc.log("--------ID_DlgLymjResult = "  + ID_DlgLymjResult);
DLG_CREATOR[ID_DlgLymjResult] = function() {
	return new DlgLymjResult();
};

var DlgLymjResult = DlgBase.extend({
	//成员函数
	ctor: function(){	
	
	},
	onCreate: function() {
		this.init();
		
	},
	onClose: function() {
		//关闭
		//UIMgr.getInstance().closeDlg(ID_DlgLymjResult);
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
		var json = ccs.load(res.lymjDlgResult_json);
		this._rootWidget = json.node;
		
		// 自适应屏幕大小
		var sizeDir = cc.director.getWinSize();
		this._rootWidget.setContentSize(sizeDir);
		ccui.helper.doLayout(this._rootWidget);
		cc.log("创建 结算界面...");
		
		this.Panel_root = this._rootWidget.getChildByName("Panel_root");
	},
	
	updateCard:function(cardData,cardCount){
		for(var i=0; i<CMD_LYMJ.MAX_COUNT;i++)
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
		
		var dlgCardsInf=UIMgr.getInstance().getDlg(ID_DlgLymjCardsInfo);
		var game = ClientData.getInstance().getGame();
		var table = ClientData.getInstance().getTable();
		if(!game || !table || !dlgCardsInf){
			return false;
		}

        //退出按钮
        var Button_quit = this.setBtnCallBack(this.Panel_root, "Button_quit", this.onClickEvent);
        //分享按钮
        var Button_share = this.setBtnCallBack(this.Panel_root, "Button_share", this.onClickEvent);
        //准备按钮
        var Button_ready = this.setBtnCallBack(this.Panel_root, "Button_ready", this.onClickEvent);

		//初始化 列表

		var Panel_mGang = this.Panel_root.getChildByName("Panel_mGang");
		var Panel_anGang = this.Panel_root.getChildByName("Panel_anGang");
		var isDraw = true; 	//是否和局
		for(var chairID=0; chairID<CMD_LYMJ.GAME_PLAYER; ++chairID){
			var Panel_settle = this.Panel_root.getChildByName("Panel_result_"+chairID);
			
			//玩家信息
			var player = table.getPlayerByChairID(chairID);
			var Image_head = Panel_settle.getChildByName("Image_head");
			var Text_nickName = Panel_settle.getChildByName("Text_nickName");
            Text_nickName.string = player.getNickName();
            if(chairID == g_objHero.getChairID()){
                Text_nickName.setFontColor(cc.color(0xff,0xff,0));
            }
			
			//头像
			player.loadUrlImage(function(savePath){
				if(savePath!=undefined && savePath.length>0)
				{
                    Image_head.loadTexture(savePath, ccui.Widget.LOCAL_TEXTURE);
                    Image_head.setContentSize(cc.size(76,76));
				}
			});
			//胡牌信息
			var Text_settleInfo = Panel_settle.getChildByName("Text_settleInfo");
			Text_settleInfo.setVisible(false);

			//牌信息
			//手牌
			var ListView_card = Panel_settle.getChildByName("ListView_card");
			//排序手牌
			this.updateCard(varResult.cbHandCardData[chairID],CMD_LYMJ.MAX_COUNT);
			//画手牌
            cc.log("画手牌===== ");
			for(var i=0; i<CMD_LYMJ.MAX_COUNT; ++i){
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

			//杠碰
			if(varResult.cbBpBgCardData[chairID]){
				for(var i=0; i<varResult.cbBpBgCardData[chairID].length; ++i){
					var openCard = varResult.cbBpBgCardData[chairID][i];
					var cardValue = openCard.cardValue;
					if(openCard.cardMask&CMD_LYMJ.WIK_PENG){
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
					else if(openCard.cardMask&CMD_LYMJ.WIK_GANG){
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
					else if(openCard.cardMask&CMD_LYMJ.WIK_ANGANG){
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
				}
			}
			
			//胡的牌
			if(varResult.dwChiHuKind[chairID]==CMD_LYMJ.WIK_CHI_HU){
				var cardValue = varResult.cbSendCardData;
				var Image_cardTemp = Panel_settle.getChildByName("Image_cardTemp").clone();
				Image_cardTemp.getChildByName("Image_color").loadTexture(dlgCardsInf.getFCard(cardValue), ccui.Widget.PLIST_TEXTURE);
				Image_cardTemp.setVisible(true);
				ListView_card.pushBackCustomItem(Image_cardTemp);
			}
			
			//分数
			var Text_score = Panel_settle.getChildByName("Image_score_bg").getChildByName("Text_score");
			if (varResult.lGameScore[chairID]>0){
				Text_score.string = "+"+varResult.lGameScore[chairID];
			} else if(varResult.lGameScore[chairID]<0){
               Text_score.string = varResult.lGameScore[chairID];
			} else{
              	Text_score.string = 0;
			}

			//输赢标识
			var Image_winTag = Panel_settle.getChildByName("Image_winTag");
			if(varResult.dwChiHuKind[chairID]!=CMD_LYMJ.WIK_CHI_HU){
				//输了
				Image_winTag.setVisible(false);
				
				//设置你输了
				if(chairID==g_objHero.getChairID() && varResult.lGameScore[chairID]<=0){
					var Image_title = this.Panel_root.getChildByName("Image_title");
					Image_title.loadTexture("lymj_result_rank/result_title_1.png", ccui.Widget.PLIST_TEXTURE);
					
					SoundMgr.getInstance().playEffect("lymj_settleLose", 0, false);
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

				
				if(chairID==g_objHero.getChairID() && varResult.lGameScore[chairID]>0){
					SoundMgr.getInstance().playEffect("lymj_settleWin", 0, false);
				}
			}
		}
		
		// if(isDraw){
		// 	var Image_title = this.Panel_root.getChildByName("Image_title");
		// 	Image_title.loadTexture("lymj_result_rank/result_title_0.png", ccui.Widget.PLIST_TEXTURE);
		// }

	},
	
	onClickEvent: function(sender, type){
		if (ccui.Widget.TOUCH_ENDED == type){		
			SoundMgr.getInstance().playEffect("lymj_button", 0, false);
			
			var name=sender.getName();
			switch(name){
				case "Button_quit":
                    cc.log("++++++结果页----");
                    OpenRoomMsg.getInstance().sendDissumeTalbe();
                    GameKindMgr.getInstance().backPlazaScene();
                    break;
			case "Button_share":
				
				var game = ClientData.getInstance().getGame();
				var table = ClientData.getInstance().getTable();
				var status = g_objHero.getStatus();
				var players = table.getPlayers();
				//游戏中
				if(status == US_PLAYING || status == US_OFFLINE || game.getPlayCount()>0){
					cc.log("游戏中---sendCancelRoom");
					DlgTip.openGameTip("解散房间","游戏已经开始，\r\n 现在解散房间，房卡无法返还！", function(){
						OpenRoomMsg.getInstance().sendCancelRoom();
					});
				}
				//未开始牌局
				else{
					//起立
					GameUserMsg.getInstance().sendStandUp(true);
					//退出到大厅
					//GameKindMgr.getInstance().backPlazaScene();
				}
				
				/*
				cc.log("++++++结算界面----分享++++++");
				if(cc.sys.isNative){
					//截屏
					var target = WXShare.SHARE_TARGET_CIRCLE;
					WXShare.getInstance().shareCaptureScreen(target, function(){
						cc.log("++++++结算界面----分享+++成功+++");
						WXShare.getInstance().showSysTip("---分享成功---");
					});
				}*/
				break;
			case "Button_ready":
				cc.log("++++++结算界面----准备++++++");
				//关闭结算界面
				UIMgr.getInstance().closeDlg(ID_DlgLymjResult);
				
				var dlgCardsInf=UIMgr.getInstance().getDlg(ID_DlgLymjCardsInfo);
				//清理界面
				dlgCardsInf.doClear();
				
				var game = ClientData.getInstance().getGame();
				if(!game){
					return;
				}
				var curRounds = game.getPlayCount();
				var totalRounds = game.getDrawCountLimit();
				if(curRounds==totalRounds){
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

























































