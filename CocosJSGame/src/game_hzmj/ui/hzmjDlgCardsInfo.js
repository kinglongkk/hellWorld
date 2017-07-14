/*
 * 红中麻将 牌面
 * Author: 	xjn 
 * Date:	2017.4.26
 *
 * 功能：
 * 
 * */

cc.log("--------ID_DlgHzmjCardsInfo = "  + ID_DlgHzmjCardsInfo);
DLG_CREATOR[ID_DlgHzmjCardsInfo] = function() {
	return new DlgHzmjCardsInfo();
};

var DlgHzmjCardsInfo = DlgBase.extend({
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
		this.cardData=[];	//牌值

		this.bHandGang=false;	//是否有手杠暗杠
		this.gang=0;	//手杠的牌

		this.outCardEnabled = true;	//是否可以出牌

		this.openFCount=0;  //己方历吃碰杠的数量
		this.openTCount=[];	// 对方历吃碰杠的数量
		this.openFCardData=[];	//己方历吃碰杠的数据
		this.openTCardData=[];	//对方历吃碰杠的数据
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
		var json = ccs.load(res.hzmjDlgCardInfo_json);
		this._rootWidget = json.node;

		// 自适应屏幕大小
		var sizeDir = cc.director.getWinSize();
		this._rootWidget.setContentSize(sizeDir);
		ccui.helper.doLayout(this._rootWidget);

		this.Panel_root = this._rootWidget.getChildByName("Panel_root");

		//出牌展示
		this.Panel_cgpTemp = this.Panel_root.getChildByName("Panel_cgpTemp");
		this.Image_cardOutShow = this.Panel_cgpTemp.getChildByName("Image_cardOutShow");

		//出牌列表
		this.Panel_cardPutOut = this.Panel_root.getChildByName("Panel_cardPutOut");

		//动作面板
		this.Panel_operator = this.Panel_root.getChildByName("Panel_operator");
		this.Button_peng = this.setBtnCallBack(this.Panel_operator,"Button_peng",this.onOperatorBtnClick);
		this.Button_gang = this.setBtnCallBack(this.Panel_operator,"Button_gang",this.onOperatorBtnClick);
		this.Button_hu = this.setBtnCallBack(this.Panel_operator,"Button_hu",this.onOperatorBtnClick);
		this.Button_guo = this.setBtnCallBack(this.Panel_operator,"Button_guo",this.onOperatorBtnClick);

		//开牌
		this.Panel_pgNomal = this.Panel_root.getChildByName("Panel_pgNomal");
		this.Panel_pgRight = this.Panel_root.getChildByName("Panel_pgRight");
		this.Panel_pgUp = this.Panel_root.getChildByName("Panel_pgUp");
		this.Panel_pgLeft = this.Panel_root.getChildByName("Panel_pgLeft");
		
		// 初始化牌局信息
		this.Panel_roundInfo = this.Panel_root.getChildByName("Panel_roundInfo");
		var Image_timeBg = this.Panel_roundInfo.getChildByName("Image_timeBg");
		var AtlasLabel_timesLeft = this.Panel_roundInfo.getChildByName("AtlasLabel_timesLeft");
		var AtlasLabel_cardssLeft = this.Panel_roundInfo.getChildByName("AtlasLabel_cardssLeft");
		var AtlasLabel_roundsLeft = this.Panel_roundInfo.getChildByName("AtlasLabel_roundsLeft");
		Image_timeBg.setVisible(false);
		AtlasLabel_timesLeft.string = "0";
		AtlasLabel_cardssLeft.string = "0";
		AtlasLabel_roundsLeft.string = "0";

		AtlasLabel_timesLeft.setContentSize(cc.size(14, 18));
		AtlasLabel_cardssLeft.setContentSize(cc.size(14, 18));
		AtlasLabel_roundsLeft.setContentSize(cc.size(14, 18));
		
		//出牌复原
		this.Panel_outClear =  this.Panel_root.getChildByName("Panel_outClear");
		this.Panel_outClear.addTouchEventListener(this.onClickBtnEvent, this);

		//创建玩家的牌面
		var game = ClientData.getInstance().getGame();
		if(!game){
			return false;
		}
		var meChairID=game.getMeChairId();
		this.imgFOtherCard = [];
		cc.log("------this.imgFOtherCard = []------");
		for(var chairID=0;chairID<CMD_HZMJ.GAME_PLAYER; chairID++){
			var curChairID = (meChairID+chairID)%4;

			switch(chairID){
			case 0:{
				//自己
				this.Panel_cardNomal = this.Panel_root.getChildByName("Panel_cardNomal");
				var Image_cardNomal = this.Panel_root.getChildByName("Image_cardNomal");
				//自己的牌型对象  0-13  13是要打的那个
				this.imgFUserCard=[];

				//创建自己的牌对象
				var cardFrameW = Image_cardNomal.getContentSize().width;
				for(var i=0;i<CMD_HZMJ.MAX_COUNT; i++){
					var cardFrame = Image_cardNomal.clone();
					cardFrame.addTouchEventListener(this.onClickCardCallBack, this);
					cardFrame.setPosition(cc.p(cardFrameW*i,0));
					cardFrame.setVisible(false);
					this.Panel_cardNomal.addChild(cardFrame);
					this.imgFUserCard[i]=cardFrame;
				}

				//设置出牌对象 13的那张
				this.imgFUserCard[13].setPosition(cc.p(13.8*cardFrameW,0));
				this.Panel_cardNomal.setScale(0.8);
				break;
			}
			case 1:{
				//右边
				this.imgFOtherCard[curChairID] = [];

				var Panel_cardRight = this.Panel_root.getChildByName("Panel_cardRight");
				var Image_cardRight = this.Panel_root.getChildByName("Image_cardRight");

				var cardFrameH = 40;
				for(var i=CMD_HZMJ.MAX_COUNT-1;i>=0; i--){
					var cardFrame = Image_cardRight.clone();
					cardFrame.setPosition(cc.p(0,i*cardFrameH));
					cardFrame.setVisible(false);
					Panel_cardRight.addChild(cardFrame);
					this.imgFOtherCard[curChairID][i]=cardFrame;
				}

				//设置出牌对象 13的那张
				this.imgFOtherCard[curChairID][13].setPosition(cc.p(0,14.5*cardFrameH));
				break;
			}
			case 2:{
				//对面
				this.imgFOtherCard[curChairID] = [];

				var Panel_cardUp = this.Panel_root.getChildByName("Panel_cardUp");
				var Image_cardUp = this.Panel_root.getChildByName("Image_cardUp");

				var Panel_cardUpWidth = Panel_cardUp.getContentSize().width;
				var cardFrameW = Image_cardUp.getContentSize().width-3;
				for(var i=0;i<CMD_HZMJ.MAX_COUNT; i++){
					var cardFrame = Image_cardUp.clone();
					var posX = Panel_cardUpWidth-i*cardFrameW;
					cardFrame.setPosition(cc.p(posX,0));
					cardFrame.setVisible(false);
					Panel_cardUp.addChild(cardFrame);
					this.imgFOtherCard[curChairID][i]=cardFrame;
				}

				this.imgFOtherCard[curChairID][13].setPosition(cc.p(Panel_cardUpWidth-13.5*cardFrameW,0));
				break;
			}
			case 3:{
				//左边
				this.imgFOtherCard[curChairID] = [];

				var Panel_cardLeft = this.Panel_root.getChildByName("Panel_cardLeft");
				var Image_cardLeft = this.Panel_root.getChildByName("Image_cardLeft");

				var Panel_cardLeftHeight = Panel_cardLeft.getContentSize().height;
				var cardFrameH = 40;
				for(var i=0;i<CMD_HZMJ.MAX_COUNT; i++){
					var cardFrame = Image_cardLeft.clone();
					var posY = Panel_cardLeftHeight-i*cardFrameH;
					cardFrame.setPosition(cc.p(0,posY));
					cardFrame.setVisible(false);
					Panel_cardLeft.addChild(cardFrame);
					this.imgFOtherCard[curChairID][i]=cardFrame;
				}

				//设置出牌对象 13的那张
				this.imgFOtherCard[curChairID][13].setPosition(cc.p(0,Panel_cardLeftHeight-14.5*cardFrameH));

				break;
			}
			default:
				break;
			}
		}

		cc.log("--------I2222222221 "  );
	},

	doClear: function(){
		//清理出牌列表
		this.clearAllOutList();

		//清除碰杠 数据
		this.clearOpenCard();

		//清理展示牌
		this.Image_cardOutShow.stopAllActions();
		this.Image_cardOutShow.setVisible(false);

		var game = ClientData.getInstance().getGame();
		var meChairID=game.getMeChairId();
		//清理手牌数据
		for(var chairID=0; chairID<4; ++chairID){
			if(meChairID==chairID){
				for(var i=0;i<CMD_HZMJ.MAX_COUNT; i++){
					this.imgFUserCard[i].setVisible(false);
				}
			}
			else{
				for(var i=0;i<CMD_HZMJ.MAX_COUNT; i++){
					this.imgFOtherCard[chairID][i].setVisible(false);
				}
			}
		}
		
		//清理操作提示
		this.showOperator(false, []);
		
		this.reset();
	},

	//发牌消息
	sendCard:function()
	{
		cc.log("----hzmjDlgCardInfo.sendCard----");

		var game=ClientData.getInstance().getGame();
		var value=game.getSendCard();
		var currentUser=game.getCurrentUser();
		var myChair=game.getMeChairId();

		//隐藏展示牌
		this.Image_cardOutShow.setVisible(false);

		//显示发牌者的 第13张手牌
		if(currentUser == myChair)
		{
			this.cardData[13]=value;
			this.displayCard(value,13);
		}
		else
		{
			this.imgFOtherCard[currentUser][13].setVisible(true);
		}

		//设置出牌定时器
		cc.log("setGameClock---sendCard");
		this.setGameClock(currentUser, game.getTimeOutCard());

		if(currentUser == myChair)
		{//检测是否有杠 自摸
			this.outCardEnabled = true;

			//显示操作面板
			var arrOperator = [];

			var actionMask=game.getAcionMasks();

			//自摸
			if(actionMask & CMD_HZMJ.WIK_CHI_HU)
			{
				cc.log("自摸");
				this.zimo=this.cardData[13];

				arrOperator.push(CMD_HZMJ.WIK_CHI_HU);
			}

			var countGang=0;			//计算杠的数量
			var count=12;				//和摸的牌相比的牌
			//手牌 原来就有的杠
			for(var i=0;i<count;i++)
			{//原来手牌有4张
				if(i<count-2)
				{
					if(this.cardData[i]!=0 && this.cardData[i]!=100 && this.cardData[i] == this.cardData[i+3] && this.cardData[i] == this.cardData[i+1] && this.cardData[i] == this.cardData[i+2])				
					{
						cc.log("--暗杠--原来就有的杠  ：value "+this.cardData[i]+" 第几张牌开始"+i);
						countGang++;
						i = i+3;
						this.bHGang(true, this.cardData[i]);
						break;
					}
				}
			}

			if(actionMask & CMD_HZMJ.WIK_GANG)
			{//分析明杠 暗杠
				//如果原来有碰  明杠
				for(var i=0; i<this.openFCardData.length;i++)
				{
					var openCard = this.openFCardData[i];
					if((openCard.cardMask&CMD_HZMJ.WIK_PENG) && openCard.cardValue==value){
						cc.log("--明杠-- 碰杠  value "+value);
						countGang++;
						this.bHGang(true, value);
						break;
					}
				}

				//如果是手牌  则是暗杠 原来手牌有3张 发牌1张
				for(var i=0;i<11;i++){
					if(this.cardData[i]==0 || this.cardData[i]==100){
						break;
					}

					if(value!=this.cardData[i]){
						continue;
					}

					if(this.cardData[i]==this.cardData[i+1] && this.cardData[i]==this.cardData[i+2]){
						cc.log("--暗杠--手杠 value "+value);
						this.bHGang(true, value);
						countGang++;
						break;
					}
				}
			}
			if(countGang!=0){
				//显示操作面板
				arrOperator.push(CMD_HZMJ.WIK_GANG);
			}

			//显示操作面板
			if(arrOperator.length!=0){
				this.showOperator(true, arrOperator);
			}
		}
	},


	//出牌
	outCard:function()
	{
		cc.log("----hzmjDlgCardInfo.outCard----");
		var game=ClientData.getInstance().getGame();

		var wOutCardUser=game.getOutCardUser();
		var cbOutCardData=game.getOutCardData();
		
		var myChair=game.getMeChairId();
		
		//判断声音是男是女
		var sex=0;
		if(wOutCardUser == myChair )
			sex=g_objHero.getGender();
		else{
			cc.log("----.wOutCardUser----"+wOutCardUser);
			var table = ClientData.getInstance().getTable();
			var player = table.getPlayerByChairID(wOutCardUser);

			sex=player.getGender();
		}
		
		var color = ["w", "s", "t"];
		var strCard = "";
		var strSex = "";
		if(cbOutCardData==0x35){
			//红中
			strCard = "f_5";
		}
		else{
			var nCardColor = Math.floor(cbOutCardData/16)
			var nValue = cbOutCardData%16;
			strCard = color[nCardColor]+"_"+nValue;
		}
		strSex = (sex==1)?"boy_":"girl_";
		//报牌声音播放
		var strSoundFile = "hzmj_"+strSex+strCard;
		cc.log("报牌声音播放 strSoundFile"+strSoundFile);
		SoundMgr.getInstance().playEffect(strSoundFile, 0, false);

		//设置出牌列表
		this.addToOutList(wOutCardUser, cbOutCardData);

		//
		if(myChair != wOutCardUser)
		{
			cc.log("wOutCardUser+++++++++"+wOutCardUser);
			//隐藏出牌玩家的第13张 手牌
			this.imgFOtherCard[wOutCardUser][13].setVisible(false);

			//出牌展示
			var arryAction = [];
			var actionInterval = 0.1;

			var strFile = this.getFCard(cbOutCardData);
			var Image_color = this.Image_cardOutShow.getChildByName("Image_color");
			Image_color.loadTexture(strFile, ccui.Widget.PLIST_TEXTURE);

			this.Image_cardOutShow.setPosition(cc.p(400,100));
			this.Image_cardOutShow.setScale(0.5);
			this.Image_cardOutShow.setOpacity(0);
			this.Image_cardOutShow.stopAllActions();
			this.Image_cardOutShow.setVisible(true);
			
			if(!cc.sys.isNative){
				arryAction.push(new cc.scaleTo(actionInterval, 2.0, 2.0));
				arryAction.push(new cc.fadeTo(actionInterval, 255));
				this.Image_cardOutShow.runAction(new cc.spawn(arryAction));
			}
			else{
				arryAction.push(cc.scaleTo(actionInterval, 2.0, 2.0));
				arryAction.push(cc.fadeTo(actionInterval, 255));
				this.Image_cardOutShow.runAction(cc.spawn(arryAction));
			}
		}

		//设置出牌定时器
		cc.log("setGameClock---outCard");
		this.setGameClock((wOutCardUser+1)%4, game.getTimeOutCard());
	},

	//操作结果
	operateResult:function()
	{
		//隐藏展示牌
		this.Image_cardOutShow.setVisible(false);

		var game = ClientData.getInstance().getGame();
		var operateUser=game.getOperateUser();	//操作用户
		var mychairid=game.getMeChairId();
		var operateCard=game.getOperateCard();	
		var operateCode=game.getOperateCode();
		var provideUser=game.getProvideUser();  //供牌用户
		//判断声音男1女0
		var sex=0;
		if(operateUser == mychairid )
			sex=g_objHero.getGender();
		else{
			var table = ClientData.getInstance().getTable();
			var player = table.getPlayerByChairID(operateUser);
			
			sex=player.getGender();
		}
			

		//设置操作 定时器
		cc.log("setGameClock---operateResult");
		this.setGameClock(operateUser, game.getTimeOperateCard());
		var strSex = (sex==1)?"boy":"girl";
		
		if(operateUser == mychairid)
		{
			//当碰的时候赋值0 隐藏
			//碰
			if(operateCode & CMD_HZMJ.WIK_PENG)
			{	cc.log("---碰----");
				this.cardData[13]=100;
				for(var i=1;i<3;i++)
				{
					for(var j=0;j<14;j++)
					{
						if(this.cardData[j]==operateCard[i])
						{
							cc.log("~~~~~operateCard"+operateCard[i]);
							this.cardData[j]=100;		
	
							break;							
						}				
					}					
				}
				//设置13手牌
				var cardTemp = 0;
				for(var i=12;i>=0;i--)
				{
					if(this.cardData[i]!=100&&this.cardData[i]!=0)
					{
						cardTemp = this.cardData[i];
						this.cardData[i] = 100;	
	
						break;							
					}				
				}
				this.updateCard(this.cardData,14);	
				this.cardData[13] = cardTemp;
				this.displayCard(cardTemp, 13);
	
				this.bClickCard=true;
	
				//显示开牌
				cc.log("---碰----显示开牌");
				this.setOpenCard(operateUser, operateCard[0], CMD_HZMJ.WIK_PENG);
	
				//碰 特效
				cc.log("---碰----特效--播放--");
	
				//修改出牌列表
				this.delLastFromOutList(provideUser);
			}

			//杠
			if(operateCode & CMD_HZMJ.WIK_GANG)
			{
				if(provideUser == operateUser){
					//自摸碰杠
					var bGang=false;
					for(var i=0;i<this.openFCardData.length;i++){
						var openCard = this.openFCardData[i];
						if(openCard.cardMask&CMD_HZMJ.WIK_PENG && openCard.cardValue == operateCard[0]){
							//自摸明杠
							bGang = true;
							this.setOpenCard(mychairid, operateCard[0], CMD_HZMJ.WIK_GANG);

							//移除操作玩家第13张手牌
							this.cardData[13] = 100;
							break;
						}
					}
					//自摸暗杠
					if(!bGang){
						//自摸暗杠
						this.setOpenCard(mychairid, operateCard[0], CMD_HZMJ.WIK_ANGANG);

						//移除暗杠的牌
						for(var i=0;i<CMD_HZMJ.MAX_COUNT;i++)
						{
							if(this.cardData[i]==operateCard[0])
							{
								this.cardData[i]=100;
							}
						}
					}
				}
				else{
					//明杠
					this.setOpenCard(operateUser, operateCard[0], CMD_HZMJ.WIK_GANG);

					//移除杠的牌
					for(var i=0;i<CMD_HZMJ.MAX_COUNT;i++)
					{
						if(this.cardData[i]==operateCard[0])
						{
							this.cardData[i]=100;
						}
					}

					//修改出牌列表
					this.delLastFromOutList(provideUser);
				}

				//更新手牌
				this.updateCard(this.cardData,14);	
			}
		}
		//其他玩家
		else
		{
			if(operateCode & CMD_HZMJ.WIK_PENG)
			{
				//显示 操作玩家的 第13张手牌
				this.imgFOtherCard[operateUser][13].setVisible(true);

				//移除操作玩家三张牌
				var tVisibleCard = 0;
				for(var i=12; i>=0 ;i--)
				{
					if(tVisibleCard==3)
						break;

					if(this.imgFOtherCard[operateUser][i].isVisible()){
						this.imgFOtherCard[operateUser][i].setVisible(false);	
						tVisibleCard++;
					}
				}

				//显示开牌
				this.setOpenCard(operateUser, operateCard[0], CMD_HZMJ.WIK_PENG);

				//修改出牌列表
				this.delLastFromOutList(provideUser);
			}	

			//杠
			if(operateCode &CMD_HZMJ.WIK_GANG)
			{
				//判断是否自摸杠碰杠
				if(provideUser == operateUser){
					var bGang=false;
					if(this.openTCardData[operateUser]){
						for(var i=0;i<this.openTCardData[operateUser].length;i++){
							var openCard = this.openTCardData[operateUser][i];
							if(openCard.cardMask&CMD_HZMJ.WIK_PENG && openCard.cardValue == operateCard[0]){
								//自摸明杠
								cc.log("+++++++++自摸明杠+++++++++");
								bGang = true;
								this.setOpenCard(operateUser, operateCard[0], CMD_HZMJ.WIK_GANG);

								//移除操作玩家1张牌
								var tVisibleCard = 0;
								for(var i=12; i>=0 ;i--)
								{
									if(tVisibleCard==1)
										break;

									if(this.imgFOtherCard[operateUser][i].isVisible()){
										this.imgFOtherCard[operateUser][i].setVisible(false);	
										tVisibleCard++;
									}
								}

								break;
							}
						}
					}

					if(!bGang){
						//自摸暗杠
						cc.log("+++++++++自摸暗杠+++++++++");
						this.setOpenCard(operateUser, operateCard[0], CMD_HZMJ.WIK_ANGANG);

						//移除操作玩家3张牌
						var tVisibleCard = 0;
						for(var i=12; i>=0 ;i--)
						{
							if(tVisibleCard==3)
								break;

							if(this.imgFOtherCard[operateUser][i].isVisible()){
								this.imgFOtherCard[operateUser][i].setVisible(false);	
								tVisibleCard++;
							}
						}
					}
				}
				else{
					var bGang=false;
					if(this.openTCardData[operateUser]){
						for(var i=0;i<this.openTCardData[operateUser].length;i++){
							var openCard = this.openTCardData[operateUser][i];
							if(openCard.cardMask&CMD_HZMJ.WIK_PENG && openCard.cardValue == operateCard[0]){
								//自摸明杠
								cc.log("+++++++++自摸明杠+++++++++");
								bGang = true;
								this.setOpenCard(operateUser, operateCard[0], CMD_HZMJ.WIK_GANG);

								//移除操作玩家1张牌
								var tVisibleCard = 0;
								for(var i=12; i>=0 ;i--)
								{
									if(tVisibleCard==1)
										break;

									if(this.imgFOtherCard[operateUser][i].isVisible()){
										this.imgFOtherCard[operateUser][i].setVisible(false);	
										tVisibleCard++;
									}
								}

								break;
							}
						}
					}
					
					if(!bGang){
						cc.log("+++++++++明杠+++++++++");
						//明杠
						this.setOpenCard(operateUser, operateCard[0], CMD_HZMJ.WIK_GANG);

						//移除操作玩家3张牌
						var tVisibleCard = 0;
						for(var i=12; i>=0 ;i--)
						{
							if(tVisibleCard==3)
								break;

							if(this.imgFOtherCard[operateUser][i].isVisible()){
								this.imgFOtherCard[operateUser][i].setVisible(false);	
								tVisibleCard++;
							}
						}

						//修改出牌列表
						this.delLastFromOutList(provideUser);
					}
				}
			}
		}



		//播放操作动画
		cc.log("---播放操作动画---");
		//播放操作 声音
		cc.log("---播放操作 声音---");
		if(operateCode & CMD_HZMJ.WIK_PENG){
			SoundMgr.getInstance().playEffect("hzmj_"+strSex+"_peng", sex, false);
		}
		else if(operateCode & CMD_HZMJ.WIK_GANG){
			SoundMgr.getInstance().playEffect("hzmj_"+strSex+"_gang", sex, false);
		}
		else if(operateCode & CMD_HZMJ.WIK_CHI_HU){
			SoundMgr.getInstance().playEffect("hzmj_"+strSex+"_chi_hu", sex, false);
		}
	},

	//排序手牌
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

		cc.log("排序手牌:"+JSON.stringify(cardData));
		this.cardData=cardData;
		for(var i=cardCount-1;i>=0;i--)
		{
			this.displayCard(this.cardData[i],i);
		}
	},	

	// 设定游戏时钟
	setGameClock: function(nextUser,times){
		this.clockActionUser = nextUser;
		var Image_timeBg = this.Panel_roundInfo.getChildByName("Image_timeBg");
		var AtlasLabel_timesLeft = this.Panel_roundInfo.getChildByName("AtlasLabel_timesLeft");

		if(times==0){
			Image_timeBg.setVisible(false);
			AtlasLabel_timesLeft.string = "0";
			AtlasLabel_timesLeft.setContentSize(cc.size(14*AtlasLabel_timesLeft.string.length, 18));
			return
		}

		var game = ClientData.getInstance().getGame();
		if(!game){
			return false;
		}
		
		game.setUserAction(this.clockActionUser);
		cc.log("-----setGameClock--setUserAction--this.clockActionUser--"+this.clockActionUser);
		
		if(this.scheduleCallBack)
			HzmjUIMgr.getInstance().unschedule(this.scheduleCallBack, this);

		//设置指针指向
		cc.log("-----设置指针指向---");
		var meChairID=game.getMeChairId();
        Image_timeBg.setVisible(true);
		if(meChairID==this.clockActionUser){
            Image_timeBg.runAction(cc.rotateTo(0,90));
			cc.log("-----设置指针指向-自己---"+90);
		}
		else{
			var index = 1;
			while(true){
				if(((meChairID+index)%4)==this.clockActionUser){
					break;
				}
				index++;
			}
			var rotation = (-90)*(index-1);
			cc.log("-----设置指针指向-其他玩家**rotation=*"+rotation);
            Image_timeBg.runAction(cc.rotateTo(0,rotation));
		}
		Image_timeBg.setVisible(true);


		//设置定时器
		AtlasLabel_timesLeft.string = ""+times;
		AtlasLabel_timesLeft.setContentSize(cc.size(14*AtlasLabel_timesLeft.string.length, 18));
		cc.log("---this.clockActionUser--"+this.clockActionUser+"---倒数时间---------------------"+times);
		
		this.curTimes = times;
		if(!this.scheduleCallBack){
			this.scheduleCallBack = function(dt){
				this.curTimes--;
	
				var DlgHzmjMain = UIMgr.getInstance().getDlg(ID_DlgHzmjMain);
				if(!DlgHzmjMain){
					HzmjUIMgr.getInstance().unschedule(this.scheduleCallBack, this);
					return;
				}
				if(this.curTimes==0){
					HzmjUIMgr.getInstance().unschedule(this.scheduleCallBack, this);
				}
				cc.log("---this.clockActionUser--"+this.clockActionUser+"---倒数时间---------------------"+this.curTimes);
				AtlasLabel_timesLeft.string = ""+this.curTimes;
				AtlasLabel_timesLeft.setContentSize(cc.size(14*AtlasLabel_timesLeft.string.length, 18));
	
				if(this.curTimes<=5){
					//播放提示音
					cc.log("----倒数时间 <=5--播放提示音-----");
				}
	
				if(this.curTimes<=0){
					var plaza = ClientData.getInstance().getPlaza();
					var curGameType = plaza.getCurGameType();
					cc.log("curGameType = "+curGameType);
					if(curGameType==GAME_GENRE_PERSONAL){
						return
					}
					
					cc.log("-----倒数时间到:-----this.clockActionUser--"+this.clockActionUser);
					if(this.clockActionUser==meChairID){
						cc.log("-----倒数时间到:-----this.clockActionUser--自己");
						//自己
						var table = ClientData.getInstance().getTable();
						if( g_objHero.getStatus() == US_PLAYING)
						{
							cc.log("g_objHero.getStatus() == US_PLAYING--this.cardData[13]--"+this.cardData[13]);
							var actionMask=game.getAcionMasks();
	
							//可出牌的时候
							if(this.cardData[13]>0 && this.cardData[13]<100)
							{
								cc.log("出牌时间到:");
								
								var data={
										cbCardData: this.cardData[13],	
								};
								HzmjGameMsg.getInstance().sendOutCard(data);
								this.cardData[13]=100;
								this.imgFUserCard[13].setVisible(false);
	
								//隐藏操作提示面板
								this.showOperator(false, []);
	
								this.outCardEnabled = false;
							}
							else if(actionMask!=CMD_HZMJ.WIK_NULL)
							{
								cc.log("操作时间到:");
								var data={
										cbOperateCode: CMD_HZMJ.WIK_NULL,	
										cbOperateCard: [0]
								};
								cc.log("sendOperateCard = " + JSON.stringify(data));
								HzmjGameMsg.getInstance().sendOperateCard(data);
	
								//隐藏操作提示面板
								this.showOperator(false, []);
	
								game.setAcionMasks(CMD_HZMJ.WIK_NULL);
							}
						}
						else
						{
	//						var dlg=UIMgr.getInstance().getDlg(ID_DlgDzqsCellSet);
	//						if(dlg) dlg.backToHall();
						} 
					}
					else{
						//其他玩家
					}
				}
			}
		}
		HzmjUIMgr.getInstance().schedule(this.scheduleCallBack, 1, cc.REPEAT_FOREVER, this);
	},

	// 关闭游戏时钟(用户退出）
	closeGameClock:function(){
		cc.log("关闭游戏时钟(用户退出）");
//		this.imgClock.setVisible(false);
//		this.Clock.setVisible(false);
		// -----------------//


	},

	// 设定本用户是否准备好
	setMeUserReady:function(){
		cc.log("准备好");
//		this.imgFReady.setVisible(true);
//		this.imgClock.setVisible(false);
//		this.Clock.setVisible(false);
	},

	getFCard:function(cardVal){
		if(cardVal==0x35){
			//红中
			return "hzmj_cardAndColor/hongZhong.png";
		}


		//万-索-筒
		var color = ["wan", "suo", "tong"];
		var nCardColor = Math.floor(cardVal/16)
		var nValue = cardVal%16;
		
		if(nValue==0){
			cc.log("牌   error-------------cardVal------- "+cardVal);
			return "hzmj_cardAndColor/hongZhong.png";
		}

		cc.log("牌    "+"hzmj_cardAndColor/"+color[nCardColor]+"/"+color[nCardColor]+"_"+nValue+".png");
		return ("hzmj_cardAndColor/"+color[nCardColor]+"/"+color[nCardColor]+"_"+nValue+".png");
	},
	//绘制手牌
	displayCard:function(cardVal,pos){
		if(cardVal == 0  || cardVal == 100)	
			this.imgFUserCard[pos].setVisible(false);
		else{
			var colorImage = this.imgFUserCard[pos].getChildByName("Image_color");
			colorImage.loadTexture(this.getFCard(cardVal),ccui.Widget.PLIST_TEXTURE);
			this.imgFUserCard[pos].setVisible(true);
		}
	},

	//显示牌面
	showCard: function(){
		//SoundMgr.getInstance().playMusic("dzqs_GAME_START", 0, false);

		//显示自己的牌
		var game = ClientData.getInstance().getGame();
		this.cardData=game.getMeCards();
		cc.log("显示牌面 牌数据 = " + JSON.stringify(this.cardData));
		//为0的都换成100
		for(var i=0;i<CMD_HZMJ.MAX_COUNT;i++)
		{
			//为0的换成100  是为了排序
			if(this.cardData[i] == 0)
				this.cardData[i]=100;
		}

		this.updateCard(this.cardData,CMD_HZMJ.MAX_COUNT);   //更新牌

		//为0的都换成100
		for(var i=0;i<CMD_HZMJ.MAX_COUNT;i++)
		{
			//为0的换成100  是为了排序
			if(this.cardData[i] == 0)
				this.cardData[i]=100;
			this.displayCard(this.cardData[i],i);
		}

		//显示其他玩家的固定手牌
		for(var userID=0; userID<CMD_HZMJ.GAME_PLAYER; userID++){
			if(this.imgFOtherCard[userID]){
				for(var i=0;i<CMD_HZMJ.MAX_COUNT-1;i++)
				{
					this.imgFOtherCard[userID][i].setVisible(true);
				}
			}
		}

		//显示庄家的活动手牌
		var bankerID = game.getBanker();
		var meChairID=game.getMeChairId();
		for(var chairID=0;chairID<CMD_HZMJ.GAME_PLAYER; chairID++){
			if(bankerID==chairID){
				(chairID==meChairID)?this.imgFUserCard[13].setVisible(true):this.imgFOtherCard[chairID][13].setVisible(true);
			}
			else{
				(chairID==meChairID)?this.imgFUserCard[13].setVisible(false):this.imgFOtherCard[chairID][13].setVisible(false);
			}
			
		}
		
		//设置定时器
		cc.log("set game out card time == ", game.getTimeOutCard())
		this.setGameClock(game.getBanker(), game.getTimeOutCard());
	},

	//游戏结束
	onGameEnd:function(result){
		cc.log("----游戏结束---");
		//最后一局不显示准备按钮
		var game = ClientData.getInstance().getGame();
		var curRounds = game.getPlayCount();
		var totalRounds = game.getDrawCountLimit();
		if(curRounds==totalRounds){
			cc.log("显示战绩页");
			//清理界面
			var dlgCardsInf=UIMgr.getInstance().getDlg(ID_DlgHzmjCardsInfo);
			dlgCardsInf.doClear();

			//显示战绩
			var DlgHzmjRankCenter = UIMgr.getInstance().openDlg(ID_DlgHzmjRankCenter);
			DlgHzmjRankCenter.show();
			
			//清理历史数据
			HzmjUIMgr.getInstance().removeGameInfo();
		}
		else{
			cc.log("显示结算界面");
			//显示结算界面
			var dlgSettlement = UIMgr.getInstance().openDlg(ID_DlgHzmjSettlement);
			dlgSettlement.show(result);
		}
	},

	//断线重连
	onBreak:function(){
		this.doClear();
		var game=ClientData.getInstance().getGame();
		var meChairID=game.getMeChairId();
		var currentUser= game.getCurrentUser();
		var wOutCardUser=game.getOutCardUser();
		var cbOutCardData=game.getOutCardData();
		cc.log("断线重连-currentUser-"+currentUser);
		
		var cbActionMask=game.getAcionMasks();
		var actionCard=game.getActionCard();
			
		//显示手牌
		do{
			this.cardData=game.getMeCards();
			cc.log("显示牌面 牌数据 = " + JSON.stringify(this.cardData));
			//为0的都换成100
			for(var i=0;i<CMD_HZMJ.MAX_COUNT;i++)
			{
				//为0的换成100  是为了排序
				if(this.cardData[i] == 0){
					this.cardData[i]=100;
				}
			}
			
			if(cbOutCardData==0){
				for(var i=0;i<CMD_HZMJ.MAX_COUNT;i++)
				{
					//为0的换成100  是为了排序
					if((cbActionMask&CMD_HZMJ.WIK_GANG || cbActionMask&CMD_HZMJ.WIK_CHI_HU) && this.cardData[i]==actionCard){
						this.cardData[i]=100;
						break;
					}
				}
			}
			
			//更新牌
			this.updateCard(this.cardData,CMD_HZMJ.MAX_COUNT);
			
			//显示其他玩家的固定手牌
			var carCount = game.getCardCount();
			for(var chairID=0;chairID<CMD_HZMJ.GAME_PLAYER; chairID++){
				if(chairID!=meChairID){
					var count = carCount[chairID];
					cc.log("chairID  "+chairID+"  count  "+count);
					for(var i=0;i<13;i++){
						if(i<count){
							this.imgFOtherCard[chairID][i].setVisible(true);
						}
						else{
							this.imgFOtherCard[chairID][i].setVisible(false);
						}
					}
				}
			}
			
			//显示活动玩家的活动手牌
			var meChairID=game.getMeChairId();
			for(var chairID=0;chairID<CMD_HZMJ.GAME_PLAYER; chairID++){
				if(currentUser==chairID){
					(chairID==meChairID)?this.imgFUserCard[13].setVisible(true):this.imgFOtherCard[chairID][13].setVisible(true);
				}
				else{
					(chairID==meChairID)?this.imgFUserCard[13].setVisible(false):this.imgFOtherCard[chairID][13].setVisible(false);
				}
			}
			if(cbActionMask==CMD_HZMJ.WIK_CHI_HU)
				cc.log("WIK_CHI_HU--cbActionMask="+cbActionMask);
			else if(cbActionMask==CMD_HZMJ.WIK_FANG_PAO){
				cc.log("WIK_FANG_PAO--cbActionMask="+cbActionMask);
			}
			else{
				cc.log("else--cbActionMask="+cbActionMask);
			}
			//设置自己的第13手牌
			if(cbOutCardData==0 && (cbActionMask&CMD_HZMJ.WIK_GANG || cbActionMask&CMD_HZMJ.WIK_CHI_HU || cbActionMask&CMD_HZMJ.WIK_FANG_PAO) && actionCard!=0){
				this.cardData[13] = actionCard;
				this.displayCard(this.cardData[13],13);
				this.imgFUserCard[13].setVisible(true);
				cc.log("11111111111111111111");
			}
			else if(currentUser==meChairID && (this.cardData[13]==100 || this.cardData[13]==0)){
				for(var i=CMD_HZMJ.MAX_COUNT-1;i>=0;i--)
				{
					var cardValue = this.cardData[i];
					if(cardValue != 100&&cardValue != 0){
						this.cardData[13] = cardValue;
						cc.log("设置自己的第13手牌 cardValue"+cardValue);
						this.cardData[i]=100;
						cc.log("设置自己的第13手牌 cardValue"+cardValue);
						
						this.displayCard(this.cardData[i],i);
						this.displayCard(this.cardData[13],13);
						cc.log("设置自己的第13手牌"+this.cardData[13]);
						
						this.imgFUserCard[13].setVisible(true);
						cc.log("22222222222222222222222222222");
						break;
					}
				}
			}
			else{
				this.imgFUserCard[13].setVisible(false);
				cc.log("33333333333333333333333333333333");
			}
			
			//设置定时器
			cc.log("显示活动玩家的活动手牌+++++++++");
			if(currentUser!=INVALID_CHAIR){
				cc.log("setGameClock---显示活动玩家的活动手牌");
				this.setGameClock(currentUser, game.getTimeOutCard());
			}
			
		}while(false);
		
		//出牌信息
		cc.log("出牌信息+++++++++");
		do{
			var cbDiscardCount = game.getDiscardCount();
			var cbDiscardCard = game.getDiscardCard();
			
			//出牌展示
			if(wOutCardUser!=INVALID_CHAIR && cbOutCardData!=0 && cbOutCardData!=100){
				cc.log("wOutCardUser+++++++++"+wOutCardUser);
				//隐藏出牌玩家的第13张 手牌
				if(wOutCardUser==meChairID){
					this.imgFUserCard[13].setVisible(false);
				}
				else{
					this.imgFOtherCard[wOutCardUser][13].setVisible(false);
				}

				//出牌展示
				var strFile = this.getFCard(cbOutCardData);
				var Image_color = this.Image_cardOutShow.getChildByName("Image_color");
				Image_color.loadTexture(strFile, ccui.Widget.PLIST_TEXTURE);
				this.Image_cardOutShow.setPosition(cc.p(400,100));
				this.Image_cardOutShow.setScale(2.0);
				this.Image_cardOutShow.setOpacity(255);
				this.Image_cardOutShow.setVisible(true);
			}
			//出牌列表
			for(var chairID=0;chairID<CMD_HZMJ.GAME_PLAYER; chairID++){
				for(var countIndex=0; countIndex<cbDiscardCount[chairID]; ++countIndex){
					//设置出牌列表
					this.addToOutList(chairID, cbDiscardCard[chairID][countIndex]);
				}
			}
		}while(false);
		
		//显示碰杠 数据
		do{
			var cbWeaveCount=game.getWeaveCount();
			var WeaveItemArray=game.getWeaveItemArray();
			for(var chairID=0;chairID<CMD_HZMJ.GAME_PLAYER; chairID++){
				for(var j=0;j<cbWeaveCount[chairID];j++)
				{
					var cbOperateData = WeaveItemArray[chairID][j].cbCardData;
					cc.log("WeaveItemArray 组合牌数据" + JSON.stringify(WeaveItemArray));
					cc.log("cbOperateData 组合牌数据" + JSON.stringify(cbOperateData));
					
					var nShowStatus = CMD_HZMJ.WIK_NULL;
					var cbParam = WeaveItemArray[chairID][j].cbPublicCard;
					if(cbParam==CMD_HZMJ.WIK_GANERAL){
						//碰
						nShowStatus = CMD_HZMJ.WIK_PENG;
					}
					else if(cbParam==CMD_HZMJ.WIK_MING_GANG){
						nShowStatus = CMD_HZMJ.WIK_GANG;
					}
					else if(cbParam==CMD_HZMJ.WIK_FANG_GANG){
						nShowStatus = CMD_HZMJ.WIK_GANG;
					}
					else if(cbParam==CMD_HZMJ.WIK_AN_GANG){
						nShowStatus = CMD_HZMJ.WIK_ANGANG;
					}
					
					//显示开牌
					this.setOpenCard(chairID, cbOperateData[0], nShowStatus);
				} 
			}
		}while(false);
		
		//操作显示
		do{
			//
			if(cbActionMask!=0){
				//打开提示面板
				cc.log("--打开操作提示面板-cbActionMask-"+cbActionMask);
				HzmjUIMgr.getInstance().onOperatorTip();
				//cc.log("setGameClock---打开操作提示面板");
				//this.setGameClock(currentUser, game.setTimeOperateCard());
			}
		}while(false);
	},

	//手牌杠
	bHGang:function(bool,value)
	{
		this.bHandGang=bool;
		this.gang=value;
	},

	//清除出牌列表
	clearAllOutList:function(){
		this.Panel_cardPutOut.getChildByName("ListView_nomal").removeAllItems();
		this.Panel_cardPutOut.getChildByName("Panel_right").removeAllChildren();
		this.Panel_cardPutOut.getChildByName("ListView_up").removeAllItems();
		this.Panel_cardPutOut.getChildByName("ListView_left").removeAllItems();
		
		this.Panel_cardPutOut.getChildByName("ListView_nomal_0").removeAllItems();
		this.Panel_cardPutOut.getChildByName("Panel_right_0").removeAllChildren();
		this.Panel_cardPutOut.getChildByName("ListView_up_0").removeAllItems();
		this.Panel_cardPutOut.getChildByName("ListView_left_0").removeAllItems();
	},
	
	//移除最后一张的出牌
	delLastFromOutList: function(actionUser){
		cc.log("+++++++++delLastFromOutList++++++actionUser "+actionUser);
		var game = ClientData.getInstance().getGame();
		if(!game){
			return;
		}
		var meChairID=game.getMeChairId();
		var index = 0
		while(true){
			if(((meChairID+index)%4)==actionUser){
				break;
			}
			index++;
		}
		switch(index){
		case 0:{
			//自己
			var ListView_nomal = this.Panel_cardPutOut.getChildByName("ListView_nomal");
			var ListView_nomal_0 = this.Panel_cardPutOut.getChildByName("ListView_nomal_0");
			if(ListView_nomal.children.length==11 && ListView_nomal_0.children.length>0){
				ListView_nomal = ListView_nomal_0;
			}
			
			ListView_nomal.removeLastItem();
			break;
		}
		case 1:{
			//右边
			var Panel_right = this.Panel_cardPutOut.getChildByName("Panel_right");
			cc.log("Panel_right.children.length1  = "+Panel_right.children.length);
			if(Panel_right.children.length==11){
				Panel_right = this.Panel_cardPutOut.getChildByName("Panel_right_0");
				cc.log("Panel_right.children.length2  = "+Panel_right.children.length);
				if(Panel_right.children.length==0){
					Panel_right = this.Panel_cardPutOut.getChildByName("Panel_right");
					Panel_right.removeChildByName("outCardRight_"+(Panel_right.children.length-1), true);
					return;
				}
			}
			
			cc.log("Panel_right.children.length3  = "+Panel_right.children.length);
			
			Panel_right.removeChildByName("outCardRight_"+(Panel_right.children.length-1), true);
			break;
		}
		case 2:{
			//对面
			var ListView_up = this.Panel_cardPutOut.getChildByName("ListView_up");
			var ListView_up_0 = this.Panel_cardPutOut.getChildByName("ListView_up_0");
			if(ListView_up.children.length==11 && ListView_up_0.children.length>0){
				ListView_up = ListView_up_0;
			}

			ListView_up.removeLastItem();
			break;
		}
		case 3:{
			//左边
			var ListView_left = this.Panel_cardPutOut.getChildByName("ListView_left");
			var ListView_left_0 = this.Panel_cardPutOut.getChildByName("ListView_left_0");
			if(ListView_left.children.length==11 && ListView_left_0.children.length>0){
				ListView_left = ListView_left_0;
			}

			ListView_left.removeLastItem();
			break;
		}
		default:
			break;
		}
	},
	//添加到出牌列表
	addToOutList: function(actionUser, cardValue){
		if(actionUser==INVALID_CHAIR || cardValue==0 || cardValue==100){
			return;
		}
		cc.log("+++++++++addToOutList++++++actionUser "+actionUser+" cardValue "+cardValue);
		var game = ClientData.getInstance().getGame();
		if(!game){
			return;
		}
		var meChairID=game.getMeChairId();
		var index = 0
		while(true){
			if(((meChairID+index)%4)==actionUser){
				break;
			}
			index++;
		}

		switch(index){
		case 0:{
			//自己
			var ListView_nomal = this.Panel_cardPutOut.getChildByName("ListView_nomal");
			var Image_cardNomal = this.Panel_cardPutOut.getChildByName("Image_cardNomal").clone();
			Image_cardNomal.setVisible(true);
			Image_cardNomal.getChildByName("Image_color").loadTexture(this.getFCard(cardValue), ccui.Widget.PLIST_TEXTURE);
			if(ListView_nomal.children.length==11){
				ListView_nomal = this.Panel_cardPutOut.getChildByName("ListView_nomal_0");
			}
			ListView_nomal.pushBackCustomItem(Image_cardNomal);

			break;
		}
		case 1:{
			//右边
			var Panel_right = this.Panel_cardPutOut.getChildByName("Panel_right");
			var Image_cardRight = this.Panel_cardPutOut.getChildByName("Image_cardRight").clone();
			Image_cardRight.setVisible(true);
			var Image_color = Image_cardRight.getChildByName("Image_color");
			Image_color.loadTexture(this.getFCard(cardValue), ccui.Widget.PLIST_TEXTURE);
			
			if(Panel_right.children.length==11){
				Panel_right = this.Panel_cardPutOut.getChildByName("Panel_right_0");
			}
			
			var length = Panel_right.children.length;
			
			cc.log("--------addToOutList--name- "+"outCardRight_"+length);
			
			Image_cardRight.setName("outCardRight_"+length);
			Image_cardRight.setLocalZOrder(20-length);
			Image_cardRight.setPosition(cc.p(0,53*length));
			Panel_right.addChild(Image_cardRight);
			break;
		}
		case 2:{
			//对面
			var ListView_up = this.Panel_cardPutOut.getChildByName("ListView_up");
			var Image_cardUp = this.Panel_cardPutOut.getChildByName("Image_cardUp").clone();
			Image_cardUp.setVisible(true);
			Image_cardUp.getChildByName("Image_color").loadTexture(this.getFCard(cardValue), ccui.Widget.PLIST_TEXTURE);
			if(ListView_up.children.length==11){
				ListView_up = this.Panel_cardPutOut.getChildByName("ListView_up_0");
			}
			ListView_up.pushBackCustomItem(Image_cardUp);
			break;
		}
		case 3:{
			//左边
			var ListView_left = this.Panel_cardPutOut.getChildByName("ListView_left");
			var Image_cardLeft = this.Panel_cardPutOut.getChildByName("Image_cardLeft").clone();
			Image_cardLeft.setVisible(true);
			Image_cardLeft.getChildByName("Image_color").loadTexture(this.getFCard(cardValue), ccui.Widget.PLIST_TEXTURE);
			if(ListView_left.children.length==11){
				ListView_left = this.Panel_cardPutOut.getChildByName("ListView_left_0");
			}
			ListView_left.pushBackCustomItem(Image_cardLeft);
			break;
		}
		default:
			break;
		}
	},
	//出牌
	doOutCard: function(selectCard){
		selectCard.setPositionY(0);

		var game = ClientData.getInstance().getGame();
		if(!game){
			return;
		}
		var meChairID=game.getMeChairId();
		if(meChairID!=game.getUserAction() || !this.outCardEnabled){
			cc.log("--不是自己的操作时间--");
			return;
		}

		for(var i=0;i<CMD_HZMJ.MAX_COUNT;i++)
		{
			if(this.imgFUserCard[i]==selectCard){
				cc.log("--出牌--找到对应的牌型--");
				//获取牌数据
				var cardValue = this.cardData[i];

				//出牌展示
				var strFile = this.getFCard(cardValue);
				//确定开始位置
				var startPos = selectCard.getPosition();
				startPos = this.Panel_cardNomal.convertToWorldSpace(startPos);
				startPos = this.Panel_cgpTemp.convertToNodeSpace(startPos);
				var endPos = cc.p(400,100);

				this.Image_cardOutShow.setPosition(startPos);
				this.Image_cardOutShow.setScale(0.5);
				this.Image_cardOutShow.setOpacity(0);
				var arryAction = [];
				var actionInterval = 0.1;
				
				var run;
				this.Image_cardOutShow.stopAllActions();
				if(!cc.sys.isNative) {
					arryAction.push(new cc.moveTo(actionInterval, endPos));
					arryAction.push(new cc.scaleTo(actionInterval, 2.0, 2.0));
					arryAction.push(new cc.fadeTo(actionInterval, 255));
					run=new cc.CallFunc(function(){
						//do something
					},this);
					
					this.Image_cardOutShow.runAction(new cc.sequence(new cc.spawn(arryAction), run));
				}
				else{
					arryAction.push(cc.moveTo(actionInterval, endPos));
					arryAction.push(cc.scaleTo(actionInterval, 2.0, 2.0));
					arryAction.push(cc.fadeTo(actionInterval, 255));
					run=new cc.CallFunc(function(){
						//do something
					},this);

					this.Image_cardOutShow.runAction(cc.sequence(cc.spawn(arryAction), run));
				}
				
				var Image_color = this.Image_cardOutShow.getChildByName("Image_color");
				Image_color.loadTexture(strFile, ccui.Widget.PLIST_TEXTURE);
				this.Image_cardOutShow.setVisible(true);

				//发送出牌
				var game=ClientData.getInstance().getGame();
				var data={
						cbCardData: cardValue,
				};
				cc.log("--发送出牌--cardValue = "+cardValue);
				HzmjGameMsg.getInstance().sendOutCard(data);
				
				SoundMgr.getInstance().playEffect("hzmj_outCard", 0, false);

				//从新整理牌
				this.cardData[i] = 100;
				this.updateCard(this.cardData, 14);

				//
				this.outCardEnabled = false;

				break;
			}
		}

		selectCard.setPositionY(0);
	},
	
	//牌点击回调
	onClickCardCallBack: function(sender, type){
		switch(type){
		case ccui.Widget.TOUCH_BEGAN:{
			SoundMgr.getInstance().playEffect("hzmj_button", 0, false);
			
			this.clickCardBeganPos = sender.getTouchBeganPosition();
			break;
		}
		case ccui.Widget.TOUCH_MOVED:{
			var curPos = sender.getTouchMovePosition();
			if(this.clickCardBeganPos){
				var disX = curPos.x-this.clickCardBeganPos.x;
				var disY = curPos.y-this.clickCardBeganPos.y;
				if(Math.sqrt(disX*disX+disY*disY)>50){
					if(curPos.y>200){
						cc.log("--------------滑动--出牌---------------");
						this.clickCardBeganPos = null;
						this.moveCard = null;
						this.doOutCard(sender);
						
						SoundMgr.getInstance().playEffect("hzmj_button", 0, false);
					}
				}
				else if(Math.sqrt(disX*disX+disY*disY)>20){
					sender.setPositionY(20);

					if(this.moveCard&&this.moveCard!=sender){
						this.moveCard.setPositionY(0);
					}
					this.moveCard = sender;
					cc.log("--------------滑动--选牌------20---------");
					SoundMgr.getInstance().playEffect("hzmj_selectCard", 0, false);
				}
			}
			break;
		}
		case ccui.Widget.TOUCH_ENDED:{
			cc.log("--------------TOUCH_ENDED---------");
			if(this.moveCard){
				this.moveCard.setPositionY(0);
				this.moveCard = null;
			}
			this.clickCardBeganPos = null;

			if(!this.clickCard){
				this.clickCard = sender;
				sender.setPositionY(20);
				SoundMgr.getInstance().playEffect("hzmj_selectCard", 0, false);
			}
			else if(this.clickCard==sender){
				//出牌
				cc.log("--------------点击--出牌---------------");
				this.doOutCard(sender);
				this.clickCard = null;
				SoundMgr.getInstance().playEffect("hzmj_button", 0, false);
			}
			else{
				this.clickCard.setPositionY(0);
				this.clickCard = sender;
				sender.setPositionY(20);
				
				SoundMgr.getInstance().playEffect("hzmj_selectCard", 0, false);
			}

			break;
		}
		case ccui.Widget.TOUCH_CANCELED:{
			this.clickCardBeganPos = null;
			cc.log("--------------TOUCH_CANCELED---------");
			if(this.moveCard){
				this.moveCard.setPositionY(0);
				this.moveCard = null;
			}
			if(this.clickCard){
				this.clickCard.setPositionY(0);
				this.clickCard = null;
			}

			break;
		}
		default:
			break;

		}
	},

	//清除碰杠 数据
	clearOpenCard: function(){
		var game = ClientData.getInstance().getGame();
		if(!game){
			return;
		}
		var meChairID=game.getMeChairId();

		for(var actionUser=0; actionUser<CMD_HZMJ.GAME_PLAYER; ++actionUser){
			if(actionUser==meChairID){
				for(var i=0; i<this.openFCardData.length; ++i){
					var openCard = this.openFCardData[i];
					openCard.cardTemp.removeFromParent();
					openCard = null;
				}

			}
			else if(this.openTCardData[actionUser]){
				for(var i=0; i<this.openTCardData[actionUser].length; ++i){
					var openCard = this.openTCardData[actionUser][i];
					openCard.cardTemp.removeFromParent();
					openCard = null;
				}
				this.openTCardData[actionUser] = null;
			}
		}

		this.openFCardData = [];
		this.openTCardData = [];
	},

	//设置碰杠 数据
	setOpenCard: function(actionUser, cardValue, cardMask){
		var game = ClientData.getInstance().getGame();
		if(!game){
			return;
		}
		var meChairID=game.getMeChairId();

		//检测是否已经存在
		var cardData = (actionUser==meChairID) ? this.openFCardData : this.openTCardData[actionUser];
		if(cardData){
			for(var i=0; i<cardData.length; ++i){
				var openCard = cardData[i];
				if(openCard.cardValue==cardValue){
					//碰变杠
					openCard.cardMask = cardMask;

					var Image_card_Mid = openCard.cardTemp.getChildByName("Image_card_Mid");
					Image_card_Mid.setVisible(true);
					var Image_color = Image_card_Mid.getChildByName("Image_color");
					Image_color.loadTexture(this.getFCard(openCard.cardValue), ccui.Widget.PLIST_TEXTURE);

					return;
				}
			}
		}

		//添加一个新的开牌数据
		var openCard = {};
		openCard.cardValue = cardValue;
		openCard.cardMask = cardMask;

		if(actionUser==meChairID){
			var index = this.openFCardData.length;
			openCard.cardTemp = this.getOpenCard(actionUser, openCard, index);
			this.openFCardData.push(openCard);
		}
		else{
			if(!this.openTCardData[actionUser])
				this.openTCardData[actionUser] = [];
			var index = this.openTCardData[actionUser].length;
			openCard.cardTemp = this.getOpenCard(actionUser, openCard, index);
			this.openTCardData[actionUser].push(openCard);
		}
	},

	//获取操作的牌
	getOpenCard: function(actionUser, openCard, index){
		//单个刷新
		var game = ClientData.getInstance().getGame();
		if(!game){
			return;
		}

		var meChairID=game.getMeChairId();
		var chairIndex = 0
		while(true){
			if(((meChairID+chairIndex)%4)==actionUser){
				break;
			}
			chairIndex++;
		}

		var cardTemp = null;
		var posX = 0;
		var posY = 0;
		switch(chairIndex){
		case 0:{
			//自己
			if(openCard.cardMask & CMD_HZMJ.WIK_PENG){
				//碰
				cardTemp = this.Panel_root.getChildByName("Panel_mGangNomal").clone();
			}
			else if(openCard.cardMask & CMD_HZMJ.WIK_GANG){
				//明杠
				cardTemp = this.Panel_root.getChildByName("Panel_mGangNomal").clone();
			}
			else if(openCard.cardMask & CMD_HZMJ.WIK_ANGANG){
				//暗杠
				cardTemp = this.Panel_root.getChildByName("Panel_anGangNomal").clone();
			}

			//设置坐标
			posX = this.Panel_pgNomal.getContentSize().width-(index*(cardTemp.getContentSize().width+10));
			posY = 0;
			this.Panel_pgNomal.addChild(cardTemp);

			break;
		}
		case 1:{
			//右边
			if(openCard.cardMask & CMD_HZMJ.WIK_PENG){
				//碰
				cardTemp = this.Panel_root.getChildByName("Panel_mGangRight").clone();
			}
			else if(openCard.cardMask & CMD_HZMJ.WIK_GANG){
				//明杠
				cardTemp = this.Panel_root.getChildByName("Panel_mGangRight").clone();
			}
			else if(openCard.cardMask & CMD_HZMJ.WIK_ANGANG){
				//暗杠
				cardTemp = this.Panel_root.getChildByName("Panel_anGangRight").clone();
			}

			//设置坐标
			posX = 0;
			posY = this.Panel_pgRight.getContentSize().height-(index*(cardTemp.getContentSize().height+10));
			this.Panel_pgRight.addChild(cardTemp);

			break;
		}
		case 2:{
			//对面
			if(openCard.cardMask & CMD_HZMJ.WIK_PENG){
				//碰
				cardTemp = this.Panel_root.getChildByName("Panel_mGangUp").clone();
			}
			else if(openCard.cardMask & CMD_HZMJ.WIK_GANG){
				//明杠
				cardTemp = this.Panel_root.getChildByName("Panel_mGangUp").clone();
			}
			else if(openCard.cardMask & CMD_HZMJ.WIK_ANGANG){
				//暗杠
				cardTemp = this.Panel_root.getChildByName("Panel_anGangUp").clone();
			}

			//设置坐标
			posX = index*(cardTemp.getContentSize().width+10);
			posY = 0;
			this.Panel_pgUp.addChild(cardTemp);

			break;
		}
		case 3:{
			//左边
			if(openCard.cardMask & CMD_HZMJ.WIK_PENG){
				//碰
				cardTemp = this.Panel_root.getChildByName("Panel_mGangLeft").clone();
			}
			else if(openCard.cardMask & CMD_HZMJ.WIK_GANG){
				//明杠
				cardTemp = this.Panel_root.getChildByName("Panel_mGangLeft").clone();
			}
			else if(openCard.cardMask & CMD_HZMJ.WIK_ANGANG){
				//暗杠
				cardTemp = this.Panel_root.getChildByName("Panel_anGangLeft").clone();
			}

			//设置坐标
			posX = 0;
			posY = index*(cardTemp.getContentSize().height+10);
			this.Panel_pgLeft.addChild(cardTemp);

			break;
		}
		default:
			break;
		}

		if(openCard.cardMask & CMD_HZMJ.WIK_PENG){
			for(var i=0; i<3; i++){
				var Image_color = cardTemp.getChildByName("Image_card_"+i).getChildByName("Image_color");
				Image_color.loadTexture(this.getFCard(openCard.cardValue), ccui.Widget.PLIST_TEXTURE);
			}
		}
		else if(openCard.cardMask & CMD_HZMJ.WIK_GANG){
			for(var i=0; i<3; i++){
				var Image_color =cardTemp.getChildByName("Image_card_"+i).getChildByName("Image_color");
				Image_color.loadTexture(this.getFCard(openCard.cardValue), ccui.Widget.PLIST_TEXTURE);
			}

			var Image_card_Mid = cardTemp.getChildByName("Image_card_Mid");
			Image_card_Mid.setVisible(true);
			var Image_color = Image_card_Mid.getChildByName("Image_color");
			Image_color.loadTexture(this.getFCard(openCard.cardValue), ccui.Widget.PLIST_TEXTURE);
		}
		else if(openCard.cardMask & CMD_HZMJ.WIK_ANGANG){
			//暗杠
			if(meChairID==actionUser){
				var Image_card_Mid = cardTemp.getChildByName("Image_card_Mid");
				var Image_color = Image_card_Mid.getChildByName("Image_color");
				Image_color.loadTexture(this.getFCard(openCard.cardValue), ccui.Widget.PLIST_TEXTURE);
			}
		}

		cardTemp.setPosition(cc.p(posX,posY));
		cardTemp.setVisible(true);

		return cardTemp;
	},
	//显示操作面板
	showOperator: function(isShow, arrayShow){
		cc.log("--showOperator: function(isShow, arrayShow){)--");
		if(!isShow || arrayShow.length==0){
			this.Panel_operator.setVisible(false);
			this.Button_peng.setVisible(false);
			this.Button_gang.setVisible(false);
			this.Button_hu.setVisible(false);
			this.Button_guo.setVisible(false);
			cc.log("--showOperator: return--");

			this.outCardEnabled = true;

			return;
		}

		this.outCardEnabled = false;

		cc.log("--showOperator: ok--");

		this.Panel_operator.setVisible(isShow);

		//先排序
		var length = arrayShow.length;
		var last=length-1;
		var bSorted = true;
		do{
			bSorted = true;
			for(var i=0; i<last;i++)
			{
				if(arrayShow[i]>arrayShow[i+1])
				{
					bSorted=false;
					var swichData=arrayShow[i];
					arrayShow[i]=arrayShow[i+1];
					arrayShow[i+1]=swichData;
				}
			}
			last--;
		}while(bSorted == false);

		//过
		this.Button_guo.setVisible(isShow);

		for(var index=length-1; index>=0; index--){
			var posX = 290-(145*(length-1-index));
			switch(arrayShow[index]){
			case CMD_HZMJ.WIK_PENG:{
				//碰
				this.Button_peng.setPositionX(posX);
				this.Button_peng.setVisible(isShow);
				break;
			}
			case CMD_HZMJ.WIK_GANG:{
				//杠
				this.Button_gang.setPositionX(posX);
				this.Button_gang.setVisible(isShow);
				break;
			}
			case CMD_HZMJ.WIK_CHI_HU://吃胡
			case CMD_HZMJ.WIK_FANG_PAO:{//放炮
				cc.log("+++++++++++++++++");
				this.Button_hu.setPositionX(posX);
				this.Button_hu.setVisible(isShow);
				break;
			}
			default:
				break;
			}
		}
	},
	//操作按钮
	onOperatorBtnClick:function(sender, type){
		if (ccui.Widget.TOUCH_ENDED == type)
		{		
			SoundMgr.getInstance().playEffect("hzmj_button", 0, false);
			
			var name=sender.getName();
			var game = ClientData.getInstance().getGame();	
			var actionCard=game.getActionCard();
			var code;
			var operateCard=[];
			operateCard[0]=0;
			operateCard[1]=0;
			operateCard[2]=0;
			switch(name){
			case "Button_gang":
				code=CMD_HZMJ.WIK_GANG;
				if(this.bHandGang)
				{
					cc.log("手牌杠");
					operateCard[0]=this.gang;

					this.bHGang(false, 100);
				}
				else{
					operateCard[0]=actionCard;
				}

				break;
			case "Button_peng":
				code=CMD_HZMJ.WIK_PENG;
				operateCard[0]=actionCard;
				operateCard[1]=actionCard;
				operateCard[2]=actionCard;
				break;
			case "Button_hu":
				code=CMD_HZMJ.WIK_CHI_HU;
				operateCard[0]=actionCard;
				break;
			case "Button_guo":
				cade=CMD_HZMJ.WIK_NULL;
				break;
			default:
				break;
			};

			var data={
					cbOperateCode: code,	
					cbOperateCard: operateCard
			};
			cc.log("sendOperateCard = " + JSON.stringify(data));
			HzmjGameMsg.getInstance().sendOperateCard(data);
			this.showOperator(false, []);
		}
	},
	onClickBtnEvent: function(sender, type){
		//var tempAmrPath = ((jsb.fileUtils ? jsb.fileUtils.getWritablePath() : "/") + "record.amr");

		if (ccui.Widget.TOUCH_BEGAN == type) {
			SoundMgr.getInstance().playEffect("hzmj_button", 0, false);
			
			var strBtnName = sender.getName();
			switch (strBtnName) {
			case "Panel_outClear":
				// 出牌复原
				cc.log("----出牌复原---");
				this.clickCardBeganPos = null;
				if(this.moveCard){
					this.moveCard.setPositionY(0);
					this.moveCard = null;
				}
				if(this.clickCard){
					this.clickCard.setPositionY(0);
					this.clickCard = null;
				}
				break;
			default:
				break;
			}
		}
	},
});  
