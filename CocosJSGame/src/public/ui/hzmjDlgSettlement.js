/*
 * 红中麻将 结算界面
 * Author: 	xjn
 * Date:	2017.4.26
 *
 * 功能：
 *
 * */

cc.log("--------ID_DlgmjSettlement = "  + ID_DlgmjSettlement);
DLG_CREATOR[ID_DlgmjSettlement] = function() {
	return new DlgmjSettlement();
};

var DlgmjSettlement = DlgBase.extend({ 
	//成员函数
	ctor: function(){

	},
	onCreate: function() {
		this.init();
	},
	onClose: function() {
		//关闭
		//UIMgr.getInstance().closeDlg(ID_DlgmjSettlement);
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
		this._rootWidget.setLocalZOrder(45);
		cc.log("创建 结算界面...");

		this.Panel_root = this._rootWidget.getChildByName("Panel_root");


	},
	updateCard:function(cardData,cardCount){
		for(var i=0; i<cardCount;i++)
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
	show: function(result,CMD_MJ,ID_DlgCardsInfo){
		var varResult = result;
		//cc.log("游戏结束 varResult = " + JSON.stringify(varResult));

		var dlgCardsInf=UIMgr.getInstance().getDlg(ID_DlgCardsInfo);
		cc.log("显示结算页面----");
		var game = ClientData.getInstance().getGame();
		var table = ClientData.getInstance().getTable();
		if(!game || !table || !dlgCardsInf){
			return false;
		}

		var Winsize =cc.director.getWinSize();
		cc.log("Winsize===="+Winsize);
		//初始化 列表
		var Panel_disTemp = this.Panel_root.getChildByName("Panel_disTemp");
		var Panel_mGang = this.Panel_root.getChildByName("Panel_mGang");
		var Panel_anGang = this.Panel_root.getChildByName("Panel_anGang");
		var Image_hufa = this.Panel_root.getChildByName("img_hufa");
		var Img_fan =Image_hufa.getChildByName("img_fan");

		this.Image_kuang = [] ;
		this.ListView_card = [];
		this.Image_kanpai = [];
		this.Panel_hufa =[];
		this.Panel_hufa1 =[];
		this.Panel_hufa2 =[];
		this.isScoreKind =[];
		this.isMohuaScore =[];
		this.Image_mohuaScore = [];
		this.mohua_Score =[];

		var isDraw = true; 	//是否和局
		var hasShowHu =false;
		var isHu=false;
		var meChairID =game.getMeChairId();
		var ChairID =0;
		for(var PlayerCount=0; PlayerCount<CMD_MJ.GAME_PLAYER; PlayerCount++){
			if(meChairID ==0)
			{
				chairID =PlayerCount;
			}
			else if(meChairID ==1)
			{
				if(PlayerCount!=3)
				{
					chairID =PlayerCount +meChairID;
				}
				else
				{
					chairID =0;
				}
			}
			else  if(meChairID ==2)
			{
				if(PlayerCount<=1)
				{
					chairID =meChairID +PlayerCount;
				}
				else
				{
					chairID =PlayerCount - meChairID;
				}
			}
			else
			{
				if(PlayerCount==0)
				{
					chairID =meChairID;
				}
				else {
					chairID =PlayerCount -1;
				}
			}
			cc.log("Panel_settle的ID"+chairID)
			var Panel_settle = this.Panel_root.getChildByName("Panel_settle"+PlayerCount);

			//玩家信息
			var player = table.getPlayerByChairID(chairID);
			cc.log("桌位号==chairID"+chairID)
			cc.log("玩家===player"+player);
			var Button_touXiang = this.setBtnCallBack(Panel_settle, "Button_touxiang_"+PlayerCount, this.onClickEvent);
			var Image_head = Button_touXiang.getChildByName("Image_userInfo");
			var NickName =Panel_settle.getChildByName("Text_NickName");
			var Image_zhuang =Panel_settle.getChildByName("Image_zhuang");
			var Image_lianzhuangfen =Panel_settle.getChildByName("Image_lianzhuangfen");
			var Text_lianzhuangfen =Image_lianzhuangfen.getChildByName("Text_lianzhuangfen");
			var Image_kuang = Panel_settle.getChildByName("img_kuang");
			var Image_kanPai = Panel_settle.getChildByName("img_kanpai");
			var Image_mohuaScore = Panel_settle.getChildByName("img_mohuaScore");
			Image_mohuaScore.setVisible(false)
			var mohua_Score = Image_mohuaScore.getChildByName("mohua_Score");
			var Panel_hufa = Panel_settle.getChildByName("Panel_hufa");
			var Panel_hufa_PosY =Panel_hufa.getPositionY();
			var Panel_hufa1 = Panel_settle.getChildByName("Panel_hufa1");
			var Panel_hufa1_PosY =Panel_hufa1.getPositionY();
			var Panel_hufa2 = Panel_settle.getChildByName("Panel_hufa2");
			var ListView_card = Panel_settle.getChildByName("ListView_card");

			
			for(var i =0 ;i<4;i++)
			{
				if(chairID == i)
				{
					this.Image_kuang[i] = Image_kuang ;
					this.ListView_card[i] = ListView_card;
					this.Image_kanpai[i] = Image_kanPai;
					this.Panel_hufa[i] =Panel_hufa;
					this.Panel_hufa1[i] =Panel_hufa1;
					this.Panel_hufa2[i] =Panel_hufa2;
					this.Image_mohuaScore[i] =Image_mohuaScore;
					this.mohua_Score[i] =mohua_Score;
				}
			}
			
			this.Pos = this.ListView_card[chairID].getPosition();
			
			//番数类型
			if(varResult.ScoreKind != undefined)
			{
				var count = 0;
				var count2 =0;
				for(var i=0;i<varResult.ScoreKind[chairID].length;i++) {
					if (varResult.ScoreKind[chairID][i] != 0 && i!= 1 && i!=5)
						count++;
				}
				cc.log("-------数组Score长度："+count);
				if(count==0)
				{
					this.ListView_card[chairID].setPosition(this.Pos.x,this.Pos.y-100);
				}
				for(var i=0;i<varResult.ScoreKind[chairID].length;i++)
				{
					if(varResult.ScoreKind[chairID][i]!=0)
					{
						this.isScoreKind[chairID] =true;
						cc.log("this.isScoreKind"+chairID+"等于True");
						break;
					}
					else{
						this.isScoreKind[chairID] =false;
						cc.log("this.isScoreKind"+chairID+"false");
					}
				}

				if(this.isScoreKind[chairID])
				{
					for(var j =0;j<varResult.ScoreKind[chairID].length;j++)
					{
						if(varResult.ScoreKind[chairID][j] != 0&&j!= 1 && j!=5)
						{
							count2++;
							var Image_hufaTemp = Image_hufa.clone();
							Image_hufaTemp.setVisible(true);
							var AtlasLabel_fanshuTemp =Image_hufaTemp.getChildByName("AtlasLabel_fanshu");
							var Img_fanTemp = Img_fan.clone();
							AtlasLabel_fanshuTemp.setProperty(varResult.ScoreKind[chairID][j],res.shuz_0002,52,70,".");
							Image_hufaTemp.loadTexture("Scene_hzmj_settlement/fanshuleixing_"+j+".png",ccui.Widget.PLIST_TEXTURE);
							cc.log("有几种胡牌类型"+count2)
							if(count2<5)
							{
								Panel_hufa.pushBackCustomItem(Image_hufaTemp);
								Panel_hufa.setPositionY(Panel_hufa_PosY-30);
							}
							else if(5<=count2 && count2<9)
							{
								Panel_hufa1.pushBackCustomItem(Image_hufaTemp);
								Panel_hufa1.setPositionY(Panel_hufa1_PosY-60);
							}
							else if(count2>=9)
							{
								Panel_hufa2.pushBackCustomItem(Image_hufaTemp);
								Panel_hufa.setPositionY(Panel_hufa_PosY);
								Panel_hufa1.setPositionY(Panel_hufa1_PosY);
							}
							AtlasLabel_fanshuTemp.setContentSize(cc.size(52*AtlasLabel_fanshuTemp.string.length,70));
						}
						else if(j==1)
						{
							Text_lianzhuangfen.string = varResult.ScoreKind[chairID][j];
						}
					}
				}
				else
				{
					Text_lianzhuangfen.string = 0;
				}
			}
			else
			{
				Panel_hufa.setVisible(false);
				this.ListView_card[chairID].setPosition(this.Pos.x,this.Pos.y-100);
			}
			//头像 昵称 庄家标识
			if(player!=null)
			{
				player.loadUrlImage(function(savePath){
					Image_head.loadTexture(savePath, ccui.Widget.LOCAL_TEXTURE);
					//Image_head.setContentSize(cc.size(76,76));
				});

				var nickName =player.getNickName();
				if(nickName.replace(/[\u4e00-\u9fa5]/g,"zz").length > 12){
					nickName = nickName.substring(0, 6) + "...";
				};
				NickName.string =nickName;

				var bankerID = game.getBanker();
				if(chairID ==bankerID)
				{
					Image_zhuang.setVisible(true);
					Image_lianzhuangfen .setVisible(true);
				}
				else {
					Image_zhuang.setVisible(false);
					Image_lianzhuangfen .setVisible(false);
				}
			}

			//牌信息
			//排序手牌
			if(varResult.HandCardData!=undefined)
			{
				this.updateCard(varResult.HandCardData[chairID],varResult.HandCardData[chairID]);
			}

			//杠碰
			if(varResult.cbBpBgCardData[chairID]&&varResult.cbBpBgCardData!=undefined){
				for(var i=0; i<varResult.cbBpBgCardData[chairID].length; i++){
					var openCard = varResult.cbBpBgCardData[chairID][i];
					var cardValue = openCard.cardValue;
					var PengcardTemp = Panel_mGang.clone();
					cc.log("===杠碰cardValue=="+cardValue)
					if(cardValue!=0 && cardValue!=100&&cardValue!=undefined)
					{
						if(openCard.cardMask&CMD_MJ.WIK_GANG){
							//明杠
							cc.log("++++明杠+++cardValue = "+cardValue);
							var cardTemp = Panel_mGang.clone();
							for(var index=0; index<3; index++){
								var Image_cardTemp = cardTemp.getChildByName("Image_cardTemp_"+index);
								Image_cardTemp.getChildByName("Image_color").loadTexture(dlgCardsInf.getFCard(cardValue), ccui.Widget.PLIST_TEXTURE);
							}
							var Image_cardTemp_Mid = cardTemp.getChildByName("Image_cardTemp_Mid");
							Image_cardTemp_Mid.setVisible(true);
							Image_cardTemp_Mid.getChildByName("Image_color").loadTexture(dlgCardsInf.getFCard(cardValue), ccui.Widget.PLIST_TEXTURE);

							cardTemp.setVisible(true);
							ListView_card.pushBackCustomItem(cardTemp);
						}
						else if(openCard.cardMask&CMD_MJ.WIK_ANGANG){
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
						else if(openCard.cardMask&CMD_MJ.WIK_LEFT||openCard.cardMask&CMD_MJ.WIK_CENTER
							||openCard.cardMask&CMD_MJ.WIK_RIGHT){
							//吃
							if(cardValue!=0)
							{
								cc.log("++++吃+++cardValue = "+cardValue)
								var cardTemp = Panel_mGang.clone();

								for(var index=0; index<3; index++) {
									var Image_cardTemp = cardTemp.getChildByName("Image_cardTemp_" + index);
									Image_cardTemp.getChildByName("Image_color").loadTexture(dlgCardsInf.getFCard(cardValue + index), ccui.Widget.PLIST_TEXTURE);
								}
								cardTemp.setVisible(true);
								ListView_card.pushBackCustomItem(cardTemp);
							}
						}
						else if(openCard.cardMask&CMD_MJ.WIK_PENG){
							//碰
							if(cardValue!=0)
							{
								cc.log("++++碰+++cardValue = "+cardValue)
								var cardTemp = Panel_mGang.clone();
								for(var index=0; index<3; index++){
									var Image_cardTemp = cardTemp.getChildByName("Image_cardTemp_"+index);
									Image_cardTemp.getChildByName("Image_color").loadTexture(dlgCardsInf.getFCard(cardValue), ccui.Widget.PLIST_TEXTURE);
								}
								cardTemp.setVisible(true);
								ListView_card.pushBackCustomItem(cardTemp);
							}
						}
					}
					//间隔控件
					ListView_card.pushBackCustomItem(Panel_disTemp.clone());
				}
			}

			//画手牌
			for(var i=0; i<varResult.HandCardData[chairID].length; i++){
				var cardValue = varResult.HandCardData[chairID][i];
				cc.log("===画手牌===cardValue"+cardValue)
				if(cardValue!=0&&cardValue!=100&&cardValue!=undefined){
					var Image_cardTemp = Panel_settle.getChildByName("Image_cardTemp").clone();
					var Cardlength =CMD_MJ.MAX_COUNT;
					if(Cardlength>14)
					{
						cc.log("超过十四张ListView_card左移");
						this.ListView_card[chairID].setPositionX(this.Pos.x-27*(Cardlength-14));
					}
					Image_cardTemp.getChildByName("Image_color").loadTexture(dlgCardsInf.getFCard(cardValue), ccui.Widget.PLIST_TEXTURE);
					Image_cardTemp.setVisible(true);
					ListView_card.pushBackCustomItem(Image_cardTemp);
				}
			}
			//间隔控件
			ListView_card.pushBackCustomItem(Panel_disTemp.clone());
			ListView_card.pushBackCustomItem(Panel_disTemp.clone());
			ListView_card.pushBackCustomItem(Panel_disTemp.clone());
			//胡的牌
			if(varResult.ChiHuKind[chairID]==CMD_MJ.WIK_CHI_HU&&varResult.ChiHuKind!=undefined&&(varResult.SendCardData!=undefined||varResult.ProvideCard!=undefined)){
				var cardValue = varResult.SendCardData;
				var cardValue1 = varResult.ProvideCard;
				var Image_cardTemp = Panel_settle.getChildByName("Image_cardTemp").clone();
				Image_cardTemp.setVisible(true);
				Image_cardTemp.setScale(1.3);
				ListView_card.pushBackCustomItem(Image_cardTemp);
				cc.log("===胡的牌cardValue"+cardValue)
				cc.log("===放炮的牌cardValue"+cardValue1)
				if(cardValue!=0 && cardValue!=100&&cardValue!=undefined)
				{
					Image_cardTemp.getChildByName("Image_color").loadTexture(dlgCardsInf.getFCard(cardValue), ccui.Widget.PLIST_TEXTURE);
				}
				else if(cardValue1!=0 && cardValue1!=100&&cardValue1!=undefined)
				{
					Image_cardTemp.getChildByName("Image_color").loadTexture(dlgCardsInf.getFCard(cardValue1), ccui.Widget.PLIST_TEXTURE);
				}
			}


			//分数
			var AtlasLabel_win = Panel_settle.getChildByName("AtlasLabel_win");
			var AtlasLabel_win_0 = Panel_settle.getChildByName("AtlasLabel_win_0");
			var TextScore =Panel_settle.getChildByName("Text_Score");
			if(varResult.GameScore!=undefined)
			{
					if(varResult.GameScore[chairID]>0){
						AtlasLabel_win.setProperty("."+varResult.GameScore[chairID],res.shuz_0001,39,60,".");
						if(varResult.ChaHuaScore!=undefined&&varResult.ChaHuaScore!=0)
						{
							TextScore.string ="("+(varResult.GameScore[chairID] - varResult.ChaHuaScore[chairID])+"+"+varResult.ChaHuaScore[chairID]+")";
						}
						else {
							TextScore.string = "";
						}

					}
					else if(varResult.GameScore[chairID]<0){
						AtlasLabel_win.setProperty("/"+Math.abs(varResult.GameScore[chairID]),res.shuz_0001B,39,60,".");
						if(varResult.ChaHuaScore!=undefined&&varResult.ChaHuaScore!=0)
						{
							TextScore.string ="("+(Math.abs(varResult.GameScore[chairID]) - Math.abs(varResult.ChaHuaScore[chairID]))+"+"+Math.abs(varResult.ChaHuaScore[chairID])+")";
						}
						else
						{
							TextScore.string = "";
						}
					}
					else{
						AtlasLabel_win.setProperty("0",res.shuz_0001B,39,60,".");
						TextScore.string = "";
					}
					//if(Math.abs(varResult.GameScore[chairID])<10)
					//{
					//	TextScore.setPositionX(TextScore.getPositionX()-10);
					//}
			}
			AtlasLabel_win.setContentSize(cc.size(39*AtlasLabel_win.string.length,60));

			//输赢标识
			var Image_winTag = Panel_settle.getChildByName("Image_winTag");
			var Image_dianpao = Image_winTag.getChildByName("img_dianpao");
			var Image_hupai = Image_winTag.getChildByName("img_hupai");
			var Image_zimo = Image_winTag.getChildByName("img_zimo");

			if(varResult.ChiHuKind!=undefined)
			{
				if(varResult.ChiHuKind[chairID]!=CMD_MJ.WIK_CHI_HU){
					//输了
					ListView_card.setVisible(false);
					Image_winTag.setVisible(false);
					Image_kuang.setVisible(false);
					Image_kanPai.setVisible(true);
					Panel_hufa.setVisible(false);
					Panel_hufa1.setVisible(false);
					Panel_hufa2.setVisible(false);
					this.isMohuaScore[chairID]=false;
					this.Image_mohuaScore[chairID].setVisible(false);
					isDraw = false;
					//设置你输了
					if(varResult.GameScore!=undefined&&chairID==g_objHero.getChairID() && varResult.GameScore[chairID]<=0){
						SoundMgr.getInstance().playEffect("hzmj_settleLose", 0, false);
					}
				}
				else{
					//有人胡牌

					//摸花奖励
					if(this.isScoreKind[chairID])
					{
						if(varResult.ScoreKind[chairID][5]>0 )
						{
							cc.log("摸花分数==="+varResult.ScoreKind[chairID][5])
							this.Image_mohuaScore[chairID].setVisible(true);
							this.mohua_Score[chairID].setProperty("."+varResult.ScoreKind[chairID][5],res.shuz_0001,39,60,".");
							this.isMohuaScore[chairID]=true;
						}
						else
						{
							this.isMohuaScore[chairID]=false;
							this.Image_mohuaScore[chairID].setVisible(false);
						}
					}
					isDraw = false;
					if(!hasShowHu)
					{
						cc.log("已经有人胡牌,不会重复显示")
						hasShowHu =true;
						ListView_card.setVisible(true);
						Image_kuang.setVisible(true);
						Image_kanPai.setVisible(false);
						if(this.isScoreKind[chairID])
						{
							Panel_hufa.setVisible(true);
							Panel_hufa1.setVisible(true);
							Panel_hufa2.setVisible(true);
						}
					}
					else{
						ListView_card.setVisible(false);
						Image_kuang.setVisible(false);
						Image_kanPai.setVisible(true);
						Panel_hufa.setVisible(false);
						Panel_hufa1.setVisible(false);
						Panel_hufa2.setVisible(false);
						//this.isMohuaScore[chairID]=false;
						this.Image_mohuaScore[chairID].setVisible(false);
					}

					//胡牌类型
					if(varResult.ChiHuKind[chairID]==CMD_MJ.WIK_CHI_HU)
					{
						Image_hupai.setVisible(true);
						Image_dianpao.setVisible(false);
						Image_zimo.setVisible(false);
					}
					else if(varResult.ChiHuKind[chairID]==CMD_MJ.WIK_FANG_PAO)
					{
						Image_hupai.setVisible(false);
						Image_dianpao.setVisible(true);
						Image_zimo.setVisible(false);
					}
					else
					{
						Image_hupai.setVisible(false);
						Image_dianpao.setVisible(false);
						Image_zimo.setVisible(true);
					}

					//码牌
					var Panel_ma = Panel_settle.getChildByName("Panel_ma");
					var cardCounts = 0;
					for(var i=0; i<7; i++){
						var cardValue = varResult.MaData[i];
						if(cardValue!=0 && cardValue!=100&&cardValue!=undefined){
							var Image_cardTemp = Panel_settle.getChildByName("Image_cardTemp").clone();
							cc.log("码牌+++++index "+i+" value "+varResult.MaData[i])
							Image_cardTemp.getChildByName("Image_color").loadTexture(dlgCardsInf.getFCard(cardValue), ccui.Widget.PLIST_TEXTURE);
							Image_cardTemp.setPosition(cc.p(46+92*i,0));
							Image_cardTemp.setVisible(false);
							Panel_ma.addChild(Image_cardTemp);
							cardCounts++;
						}
					}

					//码数s
//				var maCount = AtlasLabel_win.clone();
//				maCount.setPosition(cc.p(Panel_ma.getContentSize().width*(cardCounts/2.0),130));
//				maCount.setProperty("."+varResult.MaCount[chairID], res.rank_numY, 30, 30, ".");
//				maCount.setContentSize(cc.size(30*maCount.string.length,30));
//				Panel_ma.addChild(maCount);

				}
				for(var i=0;i<4;i++)
				{
					if(varResult.ChiHuKind[chairID]!=0)
					{
						cc.log("进来了判断是否胡牌的")
						isHu =true;
					}
				}
			}
		}
		//流局默认显示自己的牌
		var MeChairID = game.getMeChairId();
		cc.log("我的座位号：----"+MeChairID);

		if(!isHu&&this.ListView_card!=undefined)
		{
			cc.log("流局========");
			this.ListView_card[MeChairID].setVisible(true);
			this.Image_kanpai[MeChairID].setVisible(false);
			this.Image_kuang[MeChairID].setVisible(true);
		}

		//分享按钮
		var Button_fenXiang = this.setBtnCallBack(this.Panel_root, "Button_fenXiang", this.onClickEvent);
		////准备按钮
		var Button_ready = this.setBtnCallBack(this.Panel_root, "Button_ready", this.onClickEvent);
	},

	setCallBack:function(readyCB,shareCB){
		this.readyCB = readyCB;
		this.shareCB =shareCB;
	},

	onClickEvent: function(sender, type){
		if (ccui.Widget.TOUCH_ENDED == type){
			SoundMgr.getInstance().playEffect("hzmj_button", 0, false);

			var game = ClientData.getInstance().getGame();
			if(!game){
				return;
			}
			var meChairID =game.getMeChairId();
			//var TempID =0;
			var chairID =0;
			var name=sender.getName();
			for(var PlayerCount =0;PlayerCount<4;PlayerCount++)
			{
				switch(name){
					case "Button_fenXiang":
						if(PlayerCount==1)
						{
							if(this.shareCB){
								this.shareCB();
							}
						}
						break;
					case "Button_ready":
						if(PlayerCount==1)
						{
							UIMgr.getInstance().closeDlg(ID_DlgmjSettlement);
							if(this.readyCB){
								this.readyCB();
							}
						}
						break;
					case "Button_touxiang_"+PlayerCount:
						cc.log("-----------点击了头像----------"+PlayerCount);
						for(var TempID=0; TempID<4; TempID++){
							if(meChairID ==0)
							{
								chairID =TempID;
							}
							else if(meChairID ==1)
							{
								if(TempID!=3)
								{
									chairID =TempID +meChairID;
								}
								else
								{
									chairID =0;
								}
							}
							else  if(meChairID ==2)
							{
								if(TempID<=1)
								{
									chairID =meChairID +TempID;
								}
								else
								{
									chairID =TempID - meChairID;
								}
							}
							else
							{
								if(TempID==0)
								{
									chairID =meChairID;
								}
								else {
									chairID =TempID -1;
								}
							}

							if(PlayerCount ==TempID)
							{
								this.Image_kanpai[chairID].setVisible(false);
								this.Image_kuang[chairID].setVisible(true);
								this.ListView_card[chairID].setVisible(true);

								if(this.isScoreKind[chairID])
								{
									this.Panel_hufa[chairID].setVisible(true);
									this.Panel_hufa1[chairID].setVisible(true);
									this.Panel_hufa2[chairID].setVisible(true);
									if(this.isMohuaScore[chairID])
									{
										this.Image_mohuaScore[chairID].setVisible(true);
									}

								}
								else{
									this.Panel_hufa[chairID].setVisible(false);
									this.Panel_hufa1[chairID].setVisible(false);
									this.Panel_hufa2[chairID].setVisible(false);
									this.Image_mohuaScore[chairID].setVisible(false);
								}
							}
							else{
								this.Image_kanpai[chairID].setVisible(true);
								this.Image_kuang[chairID].setVisible(false);
								this.ListView_card[chairID].setVisible(false);
								this.Image_mohuaScore[chairID].setVisible(false);
								this.Panel_hufa[chairID].setVisible(false);
								this.Panel_hufa1[chairID].setVisible(false);
								this.Panel_hufa2[chairID].setVisible(false);
							}
						}

						break;
					default:
						break;
				}
			}

		}
	},
});

























































