

DLG_CREATOR[ID_DlgCNCardSet] = function() {
	return new DlgCNCardSet();
};

var DlgCNCardSet = DlgBase.extend({
	ctor: function(){
		this.pokecard = [0x0a,0x0b,0x0c,0x0d,0x09,0x14,0x11,0x12,0x13,0x15,0x16,0x19,0x1a];//十三张牌
		this.flagOne=[0,0,0];
		this.flagTwo=[0,0,0,0,0];
		this.flagThree=[0,0,0,0,0];
		this.flagAll = [0,0,0,0,0,0,0,0,0,0,0,0,0];
	},

	onCreate: function() {
		this.init();
	},

	onClose: function() {

	},

	init: function() {
		cc.spriteFrameCache.addSpriteFrames(res.dlgCNPoke_plist);
		var json = ccs.load(res.dlgCNPokeSet_json);
		this._rootWidget = json.node;

		//自适应屏幕大小
		var sizeDir = cc.director.getWinSize();
		this._rootWidget.setContentSize(sizeDir);
		ccui.helper.doLayout(this._rootWidget);

		this.panel_cardbox = this._rootWidget.getChildByName('panel_cardbox');
		this.Panel_cardkind = this._rootWidget.getChildByName('Panel_cardkind');
		this.panel_cardset = this._rootWidget.getChildByName('panel_cardset');
		this.Cardbox = [];
		for(var num = 0 ;num<13;num++){
			this.Cardbox[num] = this.panel_cardset.getChildByName('Panel_card'+num);
			this.Cardbox[num].setTouchEnabled(true);
			this.Cardbox[num].addTouchEventListener(this.onClickCardboxEvent, this);
		}

		this.onSetcardOnMid(this.pokecard, 13);
		//返回
//		this.Button_return = this.Image_bg.getChildByName('Button_return');
//		this.Button_return.addTouchEventListener(this.onClickEvent, this);


		//淡入
//		this.Image_bg.setOpacity(0)
//		this.Image_bg.runAction(cc.fadeIn(0.4));
	},
	
	//设置头墩Cardnum 底牌有多少张
	onSetcardOnOne : function(Cardnum,Count) {
		var cardsize = this.Cardbox[0].getSize();
		var temp= 0;					
			for(var num = 0;num<Cardnum;num++){
				if(this.flagAll[Cardnum-num-1]==1&&Count<3&&this.flagOne[Count]==0){
					
					var Vcard = this.onCreatCard(this.pokecard[Cardnum-num-1], 0);
					Vcard.x = cardsize.width/2;
					Vcard.y = cardsize.height/2;			
					
					this.flagAll[Cardnum-num-1]=0;
					this.Card[Cardnum-num-1].setVisible(false);
					cc.log('1this.Cardbox[Count].addChild(Vcard); '+Count);				
					Vcard.setScaleY(cardsize.height/(Vcard.getSize().height));
					if(this.flagOne[0]==0){
						Vcard.setName("Cardbox0");
						this.Cardbox[0].addChild(Vcard);
						this.flagOne[0]=1;
						Count = 0;
					}
					else if(this.flagOne[1]==0){
						Vcard.setName("Cardbox1");
						this.Cardbox[1].addChild(Vcard);
						this.flagOne[1]=1;
						Count = 1;
						
					}
					else if(this.flagOne[2]==0){
						Vcard.setName("Cardbox2");
						this.Cardbox[2].addChild(Vcard);
						this.flagOne[2]=1;
						Count = 2;
					}					
				
					Count=Count+1;
					this.flagAll[Cardnum-num-1]==0
				}
			}
	},
	reMovecard : function() {
		
	},
	//放牌到底部box
	onSetcardOnMid : function(poke,CardCount) {
		this.cardboxSize = this.panel_cardbox.getSize();
		this.Card = [];
		var testCard = CardSprite.create(poke[0],0,true);
		var sizeCard = testCard.ImgFront.getSize();
		
		for(var temp = 0; temp<CardCount;temp++){
			
			this.Card[temp] = this.onCreatCard(poke[temp], 0);
			this.Card[temp].setName("card"+temp);
//			this.Card[temp]._setWidth(sizeCard.width);
//			this.Card[temp]._setHeight(sizeCard.height);
			this.Card[temp].setTouchEnabled(true);
			
			this.Card[temp].x = (this.cardboxSize.width/13)*(temp+0.8);
			this.Card[temp].y = this.cardboxSize.height/2;
			this.Card[temp].addTouchEventListener(this.onClickCardEvent, this);


			this.Card[temp].setScaleX(1);						
			this.Card[temp].setScaleY(((this.cardboxSize.height) / (sizeCard.height)));

			this.panel_cardbox.addChild(this.Card[temp]);
//			this.Card[temp].setTouchEndedListener(this.onClickCardEvent);

		}
	},
	onChoiceCardmove :function(card){
		cc.log('move up');
		if(card.y == this.cardboxSize.height/2){
			card.setPositionY((this.cardboxSize.height/2)+20);
			for(var num = 0;num<13;num++){
				if(this.Card[num] == card){
					cc.log('***************1');
					this.flagAll[num]=1;
				}
			}
			cc.log('move up1');
		}
	  else{
		  for(var num = 0;num<13;num++){
			  if(this.Card[num] == card){
				  cc.log('***************2');
				  this.flagAll[num]=0;
			  }
		  }
			card.setPositionY(this.cardboxSize.height/2);;
			cc.log('move up2');
			}
//		for(var num = 0;num<13;num++){
//			cc.log('flagAll[num]='+ this.flagAll[num]);
//			
//		}
		
		},
	
	onClickCardEvent: function(sender, type) {
//		cc.log('onClickEvent ');
		if (ccui.Widget.TOUCH_ENDED == type) { 
			var strBtnName = sender.getName();
			cc.log('onClickEvent111 ' + strBtnName);
			this.onChoiceCardmove(sender);
		}
	},
	
	onDelecardfrombox : function(strBtnName,Cardbox) {
			if(strBtnName=="Panel_card0"){
				this.Cardbox[0].removeChild(Cardbox);
				this.flagOne[0]=0;
				cc.log('1delete ' + strBtnName);
			}
			else if(strBtnName=="Panel_card1"){
				this.Cardbox[1].removeChild(Cardbox);
				cc.log('2delete ' + strBtnName);
				this.flagOne[1]=0;
			}
			else if(strBtnName=="Panel_card2"){
				this.Cardbox[2].removeChild(Cardbox);
				cc.log('3delete ' + strBtnName);
				this.flagOne[2]=0;
			}
			//排序
			if(strBtnName == "Panel_card0"){
//				this.Cardbox[0]=this.Cardbox[1];
//				this.Cardbox[1]=this.Cardbox[2];
//				this.Cardbox[2].removeChild(this.Cardbox[2].getChildByName("Cardbox2"));
			}
	},
	
	onClickCardboxEvent : function(sender, type) {
		if (ccui.Widget.TOUCH_ENDED == type) {
			var strBtnName = sender.getName();
			cc.log('onClickEvent ' + strBtnName);
			var arrSize = this.Card.length;
			var CardboxTemp;
			if((strBtnName == "Panel_card0"&&(this.Cardbox[0].getChildByName("Cardbox0")==null))
					||(strBtnName == "Panel_card1"&&(this.Cardbox[1].getChildByName("Cardbox1")==null))
					||(strBtnName == "Panel_card2"&&(this.Cardbox[2].getChildByName("Cardbox2")==null))){
				var nCount = 0;
				
				if(strBtnName == "Panel_card1"){
					nCount = 1;
				}
				if(strBtnName == "Panel_card2"){
					nCount = 2;
				}
				cc.log('onClickEventif'+arrSize+"   "+nCount);
				this.onSetcardOnOne(arrSize,nCount);
			}
			
			else if((strBtnName == "Panel_card0"&&(CardboxTemp=this.Cardbox[0].getChildByName("Cardbox0")))||
					(strBtnName == "Panel_card1"&&(CardboxTemp=this.Cardbox[1].getChildByName("Cardbox1")))||
					((strBtnName == "Panel_card2"&&(CardboxTemp=this.Cardbox[2].getChildByName("Cardbox2"))))){
				
				this.onDelecardfrombox(strBtnName, CardboxTemp);
			}

		}
	},

	onClickEvent: function(sender, type) {
		if (ccui.Widget.TOUCH_ENDED == type) {
			var strBtnName = sender.getName();
			cc.log('onClickEvent ' + strBtnName);
			switch (strBtnName) {
			case "Button_return":
				UIMgr.getInstance().closeDlg(ID_DlgGameRule);
				break;

			default:
				break;
			}
		}
	},
	
	//创建扑克牌
	onCreatCard : function(value,style){
		if (value == 0) value = 1;
		if (value == 0x41) value = 0x4e;
		if (value == 0x42) value = 0x4f;
		
		var cardPath = "huaiFengCardListPlist/Value_" + ((value<0x10)?"0":"") + value.toString(16) + "_Style_" + style.toString() + ".png";
		cc.log("3cardPath"+cardPath);
		if (value < 0 || (value > 0x0d && value < 0x11) || (value > 0x1d && value < 0x21) ||
				(value > 0x2d && value < 0x31) || (value > 0x3d && value != 0x4e && value != 0x4f)) {
			cc.log("未知牌"+value);
			cardPath = "huaiFengCardListPlist/img_card_back.png";
		}
		cc.log("cardPath="+cardPath);
		var image_front = new ccui.ImageView(cardPath, ccui.Widget.PLIST_TEXTURE);
		return image_front;
	}

});
