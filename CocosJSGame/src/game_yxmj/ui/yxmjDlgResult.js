

cc.log("--------ID_DlgYxmjResult = "  + ID_DlgYxmjResult);
DLG_CREATOR[ID_DlgYxmjResult] = function() {
	return new DlgYxmjResult();
};

var DlgYxmjResult = DlgBase.extend({
	//成员函数
	ctor: function(){
        cc.log(" ---------- 云霄麻将DlgYxmjResult.ctor() ---------- ");
	},
	onCreate: function() {
		this.init();
		
	},
	onClose: function() {
		//关闭
		//UIMgr.getInstance().closeDlg(ID_DlgZpmjResult);
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
		var json = ccs.load(res.yxmjDlgResult_json);
		this._rootWidget = json.node;
		
		// 自适应屏幕大小
		var sizeDir = cc.director.getWinSize();
		this._rootWidget.setContentSize(sizeDir);
		ccui.helper.doLayout(this._rootWidget);
		cc.log("创建 结算界面...");
		
		this.Panel_root = this._rootWidget.getChildByName("Panel_root");
	},
	
	updateCard:function(cardData,cardCount){
		for(var i=0; i<CMD_YXMJ.MAX_COUNT;i++)
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
		
		var dlgCardsInf=UIMgr.getInstance().getDlg(ID_DlgYxmjCardsInfo);
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
		/*
        for(var chairID=0; chairID<CMD_ZPMJ.GAME_PLAYER; ++chairID) {
            var Panel_settle = this.Panel_root.getChildByName("Panel_result_" + chairID);

            //玩家信息
            var player = table.getPlayerByChairID(chairID);
            var Image_head = Panel_settle.getChildByName("Image_head");
            var Text_nickName = Panel_settle.getChildByName("Text_nickName");
            Text_nickName.string = player.getNickName();
            if (chairID == g_objHero.getChairID()) {
                Text_nickName.setColor(cc.color(0xff, 0xff, 0));
            }

            //头像
            player.loadUrlImage(function (savePath) {
                if (savePath != undefined && savePath.length > 0) {
                    Image_head.loadTexture(savePath, ccui.Widget.LOCAL_TEXTURE);
                    Image_head.setContentSize(cc.size(68, 68));
                }
            });
            //胡牌信息
            var Text_settleInfo = Panel_settle.getChildByName("Text_settleInfo");
            Text_settleInfo.setVisible(false);

            //牌信息
            //手牌
            var ListView_card = Panel_settle.getChildByName("ListView_card");
            //排序手牌
            this.updateCard(varResult.cbHandCardData[chairID], CMD_ZPMJ.MAX_COUNT);
            //画手牌
            cc.log("画手牌===== ");
            for (var i = 0; i < varResult.cbHandCardData[chairID].length; ++i) {
                var cardValue = varResult.cbHandCardData[chairID][i];
                if (cardValue!=undefined && cardValue != 0 && cardValue != 100) {
                    cc.log("++++手牌+++cardValue = " + cardValue);
                    var Image_cardTemp = Panel_settle.getChildByName("Image_cardTemp").clone();
                    Image_cardTemp.getChildByName("Image_color").loadTexture(dlgCardsInf.getFCard(cardValue), ccui.Widget.PLIST_TEXTURE);
                    Image_cardTemp.setVisible(true);
                    ListView_card.pushBackCustomItem(Image_cardTemp);
                }
            }
            //间隔控件

            //杠碰
            if (varResult.cbBpBgCardData[chairID]) {
                for (var i = 0; i < varResult.cbBpBgCardData[chairID].length; ++i) {
                    var openCard = varResult.cbBpBgCardData[chairID][i];
                    var cardValue = openCard.cardValue;
                    if (cardValue!=undefined && cardValue != 0 && cardValue != 100) {
                        if (openCard.cardMask & CMD_ZPMJ.WIK_PENG) {
                            //碰
                            cc.log("++++碰+++cardValue = " + cardValue);
                            var cardTemp = Panel_mGang.clone();
                            for (var index = 0; index < 3; ++index) {
                                var Image_cardTemp = cardTemp.getChildByName("Image_cardTemp_" + index);
                                Image_cardTemp.getChildByName("Image_color").loadTexture(dlgCardsInf.getFCard(cardValue), ccui.Widget.PLIST_TEXTURE);
                            }
                            cardTemp.setVisible(true);
                            ListView_card.pushBackCustomItem(cardTemp);
                        }
                        else if (openCard.cardMask & CMD_ZPMJ.WIK_GANG) {
                            //明杠
                            cc.log("++++明杠+++cardValue = " + cardValue);
                            var cardTemp = Panel_mGang.clone();
                            for (var index = 0; index < 3; ++index) {
                                var Image_cardTemp = cardTemp.getChildByName("Image_cardTemp_" + index);
                                Image_cardTemp.getChildByName("Image_color").loadTexture(dlgCardsInf.getFCard(cardValue), ccui.Widget.PLIST_TEXTURE);
                            }
                            var Image_cardTemp_Mid = cardTemp.getChildByName("Image_cardTemp_Mid");
                            Image_cardTemp_Mid.setVisible(true);
                            Image_cardTemp_Mid.getChildByName("Image_color").loadTexture(dlgCardsInf.getFCard(cardValue), ccui.Widget.PLIST_TEXTURE);

                            cardTemp.setVisible(true);
                            ListView_card.pushBackCustomItem(cardTemp);
                        }
                        else if (openCard.cardMask & CMD_ZPMJ.WIK_ANGANG) {
                            //暗杠
                            if (cardValue != 0) {
                                cc.log("++++暗杠+++cardValue = " + cardValue);
                                var cardTemp = Panel_anGang.clone();
                                var Image_cardTemp_Mid = cardTemp.getChildByName("Image_cardTemp_Mid");
                                Image_cardTemp_Mid.getChildByName("Image_color").loadTexture(dlgCardsInf.getFCard(cardValue), ccui.Widget.PLIST_TEXTURE);
                                cardTemp.setVisible(true);
                                ListView_card.pushBackCustomItem(cardTemp);
                            }
                        }
                    }
                }
            }

            //胡的牌
            if (varResult.dwChiHuKind[chairID] == CMD_ZPMJ.WIK_CHI_HU) {
                var cardValue = varResult.cbSendCardData;
                if (cardValue != 0 && cardValue != 100) {
                    {
                        var Image_cardTemp = Panel_settle.getChildByName("Image_cardTemp").clone();
                        Image_cardTemp.getChildByName("Image_color").loadTexture(dlgCardsInf.getFCard(cardValue), ccui.Widget.PLIST_TEXTURE);
                        Image_cardTemp.setVisible(true);
                        ListView_card.pushBackCustomItem(Image_cardTemp);
                    }
                }
            }

                //分数
                var Text_score = Panel_settle.getChildByName("Image_score_bg").getChildByName("Text_score");
                if (varResult.lGameScore[chairID] > 0) {
                    Text_score.string = "+" + varResult.lGameScore[chairID];
                } else if (varResult.lGameScore[chairID] < 0) {
                    Text_score.string = varResult.lGameScore[chairID];
                } else {
                    Text_score.string = 0;
                }

                //输赢标识
                var Image_winTag = Panel_settle.getChildByName("Image_winTag");
                if (varResult.dwChiHuKind[chairID] != CMD_ZPMJ.WIK_CHI_HU) 
                {
                    //输了
                    Image_winTag.setVisible(false);

					if (chairID == g_objHero.getChairID())
					{
                        var Image_title = this.Panel_root.getChildByName("Image_title");
                        if(Image_title!=undefined)
                        {
                            if (varResult.lGameScore[chairID] < 0)
                            { // 你输了
                                Image_title.loadTexture("zpmj_result_rank/result_title_1.png", ccui.Widget.PLIST_TEXTURE);
                                SoundMgr.getInstance().playEffect("zpmj_settleLose", 0, false);
                            }
                            else  if ( varResult.lGameScore[chairID] == 0)
                            {
                                // 平局
                                Image_title.loadTexture("zpmj_result_rank/result_title_1.png", ccui.Widget.PLIST_TEXTURE);
                                SoundMgr.getInstance().playEffect("zpmj_settleLose", 0, false);
                            }
                        }

					}
                }
                else 
                {
                    // 更具胡牌类型来显示
                    var huType =[
                            "zpmj_main/hu_specil_type/hu_1y.png",
                             "zpmj_main/hu_specil_type/hu_2y.png",
                             "zpmj_main/hu_specil_type/hu_3y.png",
                             "zpmj_main/hu_specil_type/hu_4y.png",
                             "zpmj_main/hu_specil_type/hu_gjqj.png",
                             "zpmj_main/hu_specil_type/hu_gsgkh.png",
                             "zpmj_main/hu_specil_type/hu_gskh.png",
							 "zpmj_main/hu_specil_type/hu_qj.png",
                             "zpmj_main/hu_specil_type/hu_sjd.png",
                             "zpmj_main/hu_specil_type/hu_th.png",
                             "zpmj_main/hu_specil_type/hu_zm.png"];

                    var  nType = 1;// 假设 胡牌的类型从结果中得到待续
                    if(Image_title!=undefined)
                    {
                        Image_title.loadTexture(huType[nType], ccui.Widget.PLIST_TEXTURE);
                    }

                    if (chairID == g_objHero.getChairID() && varResult.lGameScore[chairID] > 0) 
                    {
                        SoundMgr.getInstance().playEffect("zpmj_settleWin", 0, false);
                    }
                }
            }

         */
	},
	
	onClickEvent: function(sender, type){
		if (ccui.Widget.TOUCH_ENDED == type){		
			SoundMgr.getInstance().playEffect("yxmj_button", 0, false);
			
			var name=sender.getName();
			switch(name){
				case "Button_quit":

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
                    break;

			case "Button_share":

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
				UIMgr.getInstance().closeDlg(ID_DlgYxmjResult);
				
				var dlgCardsInf=UIMgr.getInstance().getDlg(ID_DlgYxmjCardsInfo);
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

























































