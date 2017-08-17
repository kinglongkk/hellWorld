

DLG_CREATOR[ID_DlgSSSCombination] = function() {
	return new DlgSSSCombination();
};
var dlgSetCard = null;
var DlgSSSCombination = DlgBase.extend({
	ctor: function(){
//      总牌组
//		const BYTE  CGameLogic::m_bCardListData[52]=
//		{
//				0x01 ,0x02 ,0x03,0x04,0x05,0x06,0x07,0x08,0x09, 0x0A,0x0B,0x0C,0x0D,  //方块 A - K   1 - 14
//				0x11 ,0x12 ,0x13,0x14,0x15,0x16,0x17,0x18,0x19, 0x1A,0x1B,0x1C,0x1D,  //梅花 A - K  17 - 29
//				0x21 ,0x22 ,0x23,0x24,0x25,0x26,0x27,0x28,0x29, 0x2A,0x2B,0x2C,0x2D,  //红桃 A - K  33 - 45
//				0x31 ,0x32,0x33,0x34,0x35,0x36,0x37,0x38 ,0x39, 0x3A,0x3B,0x3C,0x3D,  //黑桃 A - K  49 - 61
//				0x4e ,0x4f														      //大小王
//		};

        this.publicpoker = [];
		this.laipocker = [];
		this.pokecard = [];


        this.dissolutionTime = 40;
		this.Sendpoke = [0,0,0,0,0,0,0,0,0,0,0,0,0];//要发送给服务端的牌
		this.SavepockeArr = [0,0,0,0,0,0,0,0,0,0,0,0,0];//摆上去癞子的变换前储存
		this.flagOne=[0,0,0];//第一墩是否发牌  1有0无
		this.flagTwo=[0,0,0,0,0];
		this.flagThree=[0,0,0,0,0];
		//this.flagAll = [0,0,0,0,0,0,0,0,0,0,0,0,0];//手牌的状态 0未点击 1是点击状态y+20； 2 该牌放到组牌界面里面 3 该牌排序后放入牌组
        this.flagAll = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
        //this.flagTouch = [0,0,0,0,0,0,0,0,0,0,0,0,0];//手牌的点击事件
		this.flagTouch = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];//手牌的点击事件
		this.flagPair = [0,0,0,0,0,0,0,0,0,0,0,0,0];
		//当前标记普通牌型的弹起位置
		this.nPair = 0;
		this.nDPair = [0,0];
		this.nGourd = [0,0];
		this.nThree = 0;
        this.nTShun = [];
        this.nTShunPosition = [];
        this.nTonghuashun = 0;
        this.nShunNum = 0;
		this.nShunPosition = [0,0,0,0,0];
		this.nPosition = [0,0,0,0,0];
		this.nShunStatu = 0;
		this.nTong = 0;//同花标记
		this.nIron = 0;//铁枝标记
		this.nFive = 0;//五同标记
		this.nFiveCount = 0;//五同张数标记
		this.nGhost = 0;//鬼牌标记


		this.firtMax = 0;
        this.fPairValue = [0,0];
        this.fnothing = [0,0,0,0,0];
		this.secondMax = 0;
		this.thirdMax = 0;
		this.sDPairValue = [0,0,0];
        this.tDPairValue = [0,0,0];
        this.sPairValue = [0,0,0,0];
        this.tPairValue = [0,0,0,0];

        //储存已知手牌的相同张数(同花数.顺子数)
        this.nFiveArr = [];
        this.nFourArr = [];
        this.nThreeArr = [];
        this.nTwoArr = [];
        this.nOneArr = [];

        this.nSign = 0;	//内容标记(当前第几个)
		this.nType = 0;//类型标记(点击的是否是该类型)

        this.nSpecial = 0;//特殊牌类型
		this.nPockerMax = 13;//手牌数量

        //组合牌下方划牌
        this.DrawMaxposX = 0;
        this.TouchCardBeginPos = [];
        this.TouchCardMovePos = [];
        //组合牌区域选取
        this.BoxCardLightBg = [];
        this.BoxCardDarkBg = [];
	},

	onCreate: function() {
		this.init();
	},

	onClose: function() {

	},
	//初始化函数
	init: function() {
		
		cc.spriteFrameCache.addSpriteFrames(res.sssdlgCombin_plist);
		var json = ccs.load(res.sssdlgCombin_json);
		this._rootWidget = json.node;

		//自适应屏幕大小
		var sizeDir = cc.director.getWinSize();
		this._rootWidget.setContentSize(sizeDir);
		ccui.helper.doLayout(this._rootWidget);

		//放牌容器
		this.panel_cardbox = this._rootWidget.getChildByName('panel_cardbox');
        this.panel_cardbox.setTouchEnabled(true);
		this.panel_cardbox.setLocalZOrder(1100);

		this.Panel_sure = this._rootWidget.getChildByName('Panel_sure');
		this.Panel_sure.setVisible(false);
        this.Panel_sure.setLocalZOrder(1101);
		//取消组牌按钮
		this.Btn_cancel = this.Panel_sure.getChildByName('Btn_cancel');
		this.Btn_cancel.setTouchEnabled(true);
		this.Btn_cancel.addTouchEventListener(this.onClickEvent, this);
        this.Btn_cancel.setLocalZOrder(1101);
        this.Image_canncel = this.Panel_sure.getChildByName('Image_canncel');
        this.Image_canncel.setLocalZOrder(1101);
		//确定组好按钮
		this.Btn_sure = this.Panel_sure.getChildByName('Btn_sure');
		this.Btn_sure.setTouchEnabled(true);
		this.Btn_sure.addTouchEventListener(this.onClickEvent, this);
        this.Btn_sure.setLocalZOrder(1100);
        this.Image_sure = this.Panel_sure.getChildByName('Image_sure');
        this.Image_sure.setLocalZOrder(1100);
        
        this.Image_errRule = this._rootWidget.getChildByName('Image_errRule');
        this.Image_errRule.setVisible(false);
        this.Image_errRule.setLocalZOrder(1100);
        
		this.Panel_cardkind = this._rootWidget.getChildByName('Panel_cardkind');
		
		this.Btn_pair = this.Panel_cardkind.getChildByName('Btn_pair');
		this.Btn_pair.setEnabled(false);
		this.Btn_pair.setBright(false); 
		this.Btn_pair.addTouchEventListener(this.onClickCardKind, this);
		
		this.Btn_pair_double = this.Panel_cardkind.getChildByName('Btn_pair_double');
		this.Btn_pair_double.setEnabled(false);
		this.Btn_pair_double.setBright(false); 
		this.Btn_pair_double.addTouchEventListener(this.onClickCardKind, this);
		
		this.Btn_three = this.Panel_cardkind.getChildByName('Btn_three');
		this.Btn_three.setEnabled(false);
		this.Btn_three.setBright(false); 
		this.Btn_three.addTouchEventListener(this.onClickCardKind, this);
		
		this.Btn_shunzi = this.Panel_cardkind.getChildByName('Btn_shunzi');
        this.Btn_shunzi.setEnabled(false);
        this.Btn_shunzi.setBright(false);
        this.Btn_shunzi.addTouchEventListener(this.onClickCardKind, this);

		this.Btn_tonghua = this.Panel_cardkind.getChildByName('Btn_tonghua');
        this.Btn_tonghua.setEnabled(false);
        this.Btn_tonghua.setBright(false);
        this.Btn_tonghua.addTouchEventListener(this.onClickCardKind, this);

		this.Btn_gourd = this.Panel_cardkind.getChildByName('Btn_gourd')
        this.Btn_gourd.setEnabled(false);
        this.Btn_gourd.setBright(false);
        this.Btn_gourd.addTouchEventListener(this.onClickCardKind, this);
        ;
		this.Btn_iron = this.Panel_cardkind.getChildByName('Btn_iron');
        this.Btn_iron.setEnabled(false);
        this.Btn_iron.setBright(false);
        this.Btn_iron.addTouchEventListener(this.onClickCardKind, this);

		this.Btn_tonghuashun = this.Panel_cardkind.getChildByName('Btn_tonghuashun');
        this.Btn_tonghuashun.setEnabled(false);
        this.Btn_tonghuashun.setBright(false);
        this.Btn_tonghuashun.addTouchEventListener(this.onClickCardKind, this);
        //五同
        this.Btn_wutong = this.Panel_cardkind.getChildByName('Btn_wutong');
        this.Btn_wutong.setEnabled(false);
        this.Btn_wutong.setBright(false);
        this.Btn_wutong.addTouchEventListener(this.onClickCardKind, this);
        //特殊牌按钮
		this.Btn_fourthree = this.Panel_cardkind.getChildByName('Btn_fourthree');
        //this.Btn_fourthree.setEnabled(false);
        //this.Btn_fourthree.setBright(false);
        this.Btn_fourthree.addTouchEventListener(this.onClickCardKind, this);
        //特殊牌类型
        this.SprTes = [];
        for(var i = 0;i < 15;i++){
        	this.SprTes[i] = this.Btn_fourthree.getChildByName('Sprite_'+(i + 1));
        	this.SprTes[i].setVisible(false);
        }
        
		this.panel_cardset = this._rootWidget.getChildByName('panel_cardset');
		
		this.Btn_closeone = this.panel_cardset.getChildByName('Btn_closeone');
		this.Btn_closeone.setTouchEnabled(true);
		this.Btn_closeone.addTouchEventListener(this.onClickEvent, this);
		this.Btn_closetwo = this.panel_cardset.getChildByName('Btn_closetwo')
		this.Btn_closetwo.setTouchEnabled(true);
		this.Btn_closetwo.addTouchEventListener(this.onClickEvent, this);
		this.Btn_closethree = this.panel_cardset.getChildByName('Btn_closethree')
		this.Btn_closethree.setTouchEnabled(true);
		this.Btn_closethree.addTouchEventListener(this.onClickEvent, this);	
		
		this.Image_Clock = this.panel_cardset.getChildByName('Image_Clock');
		this.LabTime = this.Image_Clock.getChildByName('LabTime');
		this.Panel_me = this._rootWidget.getChildByName('Panel_me');

		//牌的暗框
		var CardDarkBg = [];
		cardPath = "res/game-sss/Chinesepoke/BoxCardDarkBg.png";
		for(var num = 0 ;num<13;num++){
			CardDarkBg[num] = new ccui.ImageView(cardPath, ccui.Widget.LOCAL_TEXTURE);
			//CardDarkBg[num].setVisible(false);
			CardDarkBg[num].setScale(0.89);
			CardDarkBg[num].setLocalZOrder(1000 + num);
			this._rootWidget.addChild(CardDarkBg[num]);
			this.BoxCardDarkBg[num] = CardDarkBg[num];
		}
		//牌的亮框
		var CardLightBg = [];
		var cardPath = "res/game-sss/Chinesepoke/BoxCardLightBg.png";
		for(var num = 0 ;num<13;num++){
			CardLightBg[num] = new ccui.ImageView(cardPath, ccui.Widget.LOCAL_TEXTURE);
			CardLightBg[num].setVisible(false);
			CardLightBg[num].setScale(0.89);
			CardLightBg[num].setLocalZOrder(1000 + num);
			this._rootWidget.addChild(CardLightBg[num]);
			this.BoxCardLightBg[num] = CardLightBg[num];
		}
		//编辑器的暗底亮框;
		this.Cardbox = [];
		this.BoxMingCard = [];
		for(var num = 0 ;num<13;num++){
			this.Cardbox[num] = this._rootWidget.getChildByName('box'+num);
			this.Cardbox[num].setTouchEnabled(true);
			this.Cardbox[num].addTouchEventListener(this.onClickCardboxEvent, this);	
			
			this.BoxMingCard[num] = this.Cardbox[num].getChildByName('toumingbg_02');
			//this.BoxMingCard[num].setVisible(false);
			this.BoxMingCard[num].setLocalZOrder(2000);
					
			cc.log("X:"+this.Cardbox[num].getPositionX()+ "y:"+this.Cardbox[num].getPositionY());
			this.BoxCardDarkBg[num].setPosition(this.Cardbox[num].getPosition());
			this.BoxCardLightBg[num].setPosition(this.Cardbox[num].getPosition());
			//this.BoxCardLightBg[num].setPosition(500,500);//this.BoxMingCard[num].getPosition()
		}
        //摆牌背景添加监听
        this.Panel_me.setTouchEnabled(true);
        this.Panel_me.addTouchEventListener(function (sender, type) {
            if (ccui.Widget.TOUCH_ENDED == type) {
            	//相公提示不可见
                if(this.Image_errRule.isVisible()){
                    this.Image_errRule.setVisible(false);
				}
				//所有手牌下落
				if(this.Panel_sure.isVisible() == false){
                    this.onResetPoke(0);
				}
            }
        }, this);

        //		const BYTE  CGameLogic::m_bCardListData[52]=
//		{
//				0x01 ,0x02 ,0x03,0x04,0x05,0x06,0x07,0x08,0x09, 0x0A,0x0B,0x0C,0x0D,  //方块 A - K   1 - 14
//				0x11 ,0x12 ,0x13,0x14,0x15,0x16,0x17,0x18,0x19, 0x1A,0x1B,0x1C,0x1D,  //梅花 A - K  17 - 29
//				0x21 ,0x22 ,0x23,0x24,0x25,0x26,0x27,0x28,0x29, 0x2A,0x2B,0x2C,0x2D,  //红桃 A - K  33 - 45
//				0x31 ,0x32,0x33,0x34,0x35,0x36,0x37,0x38 ,0x39, 0x3A,0x3B,0x3C,0x3D,  //黑桃 A - K  49 - 61
//				0x4e ,0x4f														      //大小王
//		};

        //this.pokecard = [0x11,0x3c,0x3b,0x3a,0x39,0x09,0x18,0x16,0x15,0x05,0x34,0x12,0x02];//十三张牌测试数据（三同花）
        //this.pokecard = [0x31 ,0x21,0x23,0x33,0x37,0x27,0x29,0x39 ,0x2B, 0x3B,0x2D,0x2D,0x2D];//十三张牌测试数据（五对三条）
        //this.pokecard = [0x16 ,0x12,0x13,0x14,0x15,0x08,0x09,0x0A ,0x0B, 0x07,0x06,0x05,0x04];//十三张牌测试数据（同花顺）1111
        //this.pokecard = [0x01 ,0x01,0x11,0x01,0x01,0x09,0x39,0x19 ,0x06, 0x06,0x36,0x26,0x16];//十三张牌测试数据（五同测试）
        //this.pokecard = [0x01 ,0x12,0x23,0x32,0x09,0x27,0x29,0x39 ,0x3C, 0x3B,0x3B,0x2D,0x1D];//十三张牌测试数据（普通牌型）
        //this.pokecard = [0x02 ,0x12,0x23,0x02,0x02/*0x09*/,0x27,0x29,0x3C ,0x3B, 0x3B,0x2D,0x4e,0x4f];//十三张牌测试数据（有王牌型）
        //this.pokecard = [0x01 ,0x11,0x21,0x31,0x02,0x12,0x22,0x32 ,0x03, 0x13,0x23,0x33,0x0D];//十三张牌测试数据（铁枝牌型）
        //this.pokecard = [0x31 ,0x32,0x23,0x13,0x15,0x36,0x07,0x17 ,0x37, 0x3B,0x2B,0x0B,0x0D];//十三张牌测试数据（铁枝牌型）
        //this.pokecard = [0x4e ,0x4f,0x21,0x04,0x14,0x24,0x08,0x18 ,0x28, 0x2A,0x3A,0x3A,0x0A];//十三张牌测试数据（三条牌型）
        //test
        // //三张公共牌(待加入)
        //this.publicpoker = [0x4e,0x4f,0x02];
        //this.publicpoker = [0x01,0x11,0x21];
        // 癞子牌
        // this.laipocker = [0x02,0x12,0x22,0x32];
        // //三张公共牌
        //  this.nPockerMax = 16;
        //
        // this.pokecard[13] = 0x01;
        // this.pokecard[14] = 0x11;
        // this.pokecard[15] = 0x21;
        // //
        // cc.log("模拟手牌排序值="+JSON.stringify(this.pokecard));
        // this.pokecard = this.onBubbleSort(this.pokecard,this.nPockerMax,this.laipocker);
        // cc.log("模拟手牌排序值="+JSON.stringify(this.pokecard));
        // this.onSetcardOnMid(this.pokecard, this.nPockerMax,this.laipocker);
        // this.onIsPair(this.pokecard);

        //0x4e ,0x4f
        // // //普通牌
        // cc.log("模拟手牌排序值="+JSON.stringify(this.pokecard));
        // this.pokecard = this.onBubbleSort(this.pokecard,this.nPockerMax);
        // cc.log("模拟手牌排序值="+JSON.stringify(this.pokecard));
        // this.onSetcardOnMid(this.pokecard, this.nPockerMax);
        // this.onIsPair(this.pokecard);
	},
    ////////////////上部牌操作//////////////////
	//设置上面组合牌亮框
	ShowCardLight:function(){
		//亮框牌不可见
		for(var num = 0;num < 13;num++){
			this.BoxCardLightBg[num].setVisible(false);
		}

		//获取点击弹起的手牌
		var upCard = 0;
		for(var num = 0;num < this.nPockerMax;num++){
			if(this.flagAll[num]==1){
				upCard++;
			}
		}
		//获取每墩的空位
		var oneTrickCount = 0;
		for(var num = 0;num < 13;num++){
			if(this.flagOne[num]==0){
				oneTrickCount++;
			}
		}
		var twoTrickCount = 0;
		for(var num = 0;num < 13;num++){
			if(this.flagTwo[num]==0){
				twoTrickCount++;
			}
		}
		var threeTrickCount = 0;
		for(var num = 0;num < 13;num++){
			if(this.flagThree[num]==0){
				threeTrickCount++;
			}
		}
		//设置组合框区域的框亮
		if(upCard <= 5 && upCard > 0){
			if(upCard <= 3 && upCard <= oneTrickCount){
				var oneLightCount = 0;
				for(var num = 0;num < 3;num++){
					if(this.flagOne[num] == 0){
						this.BoxCardLightBg[num].setVisible(true);
						oneLightCount++;
						if(oneLightCount >= upCard){
							break;
						}
					}
				}
			}
			if(upCard <= twoTrickCount){
				var twoLightCount = 0;
				for(var num = 3;num < 8;num++){
					if(this.flagTwo[num - 3] == 0){
						this.BoxCardLightBg[num].setVisible(true);
						twoLightCount++;
						if(twoLightCount >= upCard){
							break;
						}
					}
				}
			}
			if(upCard <= threeTrickCount){
				var threeLightCount = 0;
				for(var num = 8;num < 13;num++){
					if(this.flagThree[num - 8] == 0){
						this.BoxCardLightBg[num].setVisible(true);
						threeLightCount++;
						if(threeLightCount >= upCard){
							break;
						}
					}
				}
			}
		}

	},
    //所有牌的排序
    onBubbleSort : function(arry,len,laipocker){ //排序 从大到小

        cc.log("1打印癞子扑克"+JSON.stringify(laipocker));
        if(len>=13){
            for(var num = 0;num<len;num++){
                if(arry[num]%16 == 1){
                    arry[num] = arry[num]+13;
                }
            }
        }

        var nLaiPocker = [];
        var nKingPocker = [];
        var nKingCount = 0;
        var nLaiCount = 0;
        if(len>=13 && laipocker != null){//癞子排序
            for(var num = 0;num<len;num++){
                if(laipocker[0] == arry[num] || laipocker[1] == arry[num]
                    || laipocker[2] == arry[num] || laipocker[3] == arry[num]){
                    nLaiPocker[nLaiCount++] = arry[num];
                    arry[num] = 15;
                }
            }
        }
        //大小王排序
        for(var num = 0;num<len;num++){
            if(arry[num] == 0x4e || arry[num] == 0x4f){
                nKingPocker[nKingCount++] = arry[num];
                arry[num] = 15;
            }
        }

        cc.log("2打印癞子扑克"+JSON.stringify(nLaiPocker));
        cc.log("打印扑克"+JSON.stringify(arry));
        var arrLen = arry.length;
        var Inum,Jnum;
        for(Inum = 0 ; Inum<arrLen ; Inum++){
            for(Jnum = 0 ;Jnum<arrLen-1 ; Jnum++){
                if(arry[Jnum]%16 == 1){
                    arry[Jnum] = arry[Jnum] + arry[Jnum+1];
                    arry[Jnum+1] = arry[Jnum] - arry[Jnum+1];
                    arry[Jnum] = arry[Jnum] - arry[Jnum+1];
                }
                if((arry[Jnum]%16) < (arry[Jnum+1]%16)){
                    arry[Jnum] = arry[Jnum] + arry[Jnum+1];
                    arry[Jnum+1] = arry[Jnum] - arry[Jnum+1];
                    arry[Jnum] = arry[Jnum] - arry[Jnum+1];
                }
                if((arry[Jnum]%16) == (arry[Jnum+1]%16)){
                    if((arry[Jnum]/16)<(arry[Jnum+1]/16)){
                        arry[Jnum] = arry[Jnum] + arry[Jnum+1];
                        arry[Jnum+1] = arry[Jnum] - arry[Jnum+1];
                        arry[Jnum] = arry[Jnum] - arry[Jnum+1];
                    }
                }
            }
        }
        cc.log("打印扑克"+JSON.stringify(arry));
        //癞子牌前移
        var nylaiCount = 0;
        var nyKingCount = 0;
        if(laipocker != null){
            for(var num = 0;num<len;num++){
                if(arry[num] == 15){
                    arry[num] = nLaiPocker[nylaiCount++] ;
                }
                if(nylaiCount >= nLaiCount){
                    break;
                }
            }
        }
        //大小王
        for(var num = 0;num<len;num++){
            if(arry[num] == 15){
                arry[num] = nKingPocker[nyKingCount++] ;
            }
            if(nyKingCount >= nKingCount){
                break;
            }
        }

        return arry;
    },
	//组牌牌点击到上面排序(每墩)
    onMoundSort : function(arry,len) { //排序 从大到小
        var arrLen = 0;
        var Inum,Jnum;

        var nLaiPocker = [];
        var nKingPocker = [];
        var nKingCount = 0;
        var nLaiCount = 0;
        //癞子排序
        if(this.laipocker != null){
			if(len < 3){
                for(var num = 0;num< 3;num++){
                    if(this.laipocker[0] == arry[num] || this.laipocker[1] == arry[num]
                        || this.laipocker[2] == arry[num] || this.laipocker[3] == arry[num]){
                        nLaiPocker[nLaiCount++] = arry[num];
                        arry[num] = 15;
                    }
                }
			}else if(len >= 3 && len < 8){
                for(var num = 3;num< 8;num++){
                    if(this.laipocker[0] == arry[num] || this.laipocker[1] == arry[num]
                        || this.laipocker[2] == arry[num] || this.laipocker[3] == arry[num]){
                        nLaiPocker[nLaiCount++] = arry[num];
                        arry[num] = 15;
                    }
                }
			}
            else if(len >= 8){
                for(var num = 8;num< 13;num++){
                    if(this.laipocker[0] == arry[num] || this.laipocker[1] == arry[num]
                        || this.laipocker[2] == arry[num] || this.laipocker[3] == arry[num]){
                        nLaiPocker[nLaiCount++] = arry[num];
                        arry[num] = 15;
                    }
                }
            }

        }
        //大小王排序
        if(len < 3){
            for(var num = 0;num< 3;num++){
                if(arry[num] == 0x4e || arry[num] == 0x4f){
                    nKingPocker[nKingCount++] = arry[num];
                    arry[num] = 15;
                }
            }
        }else if(len >= 3 && len < 8){
            for(var num = 3;num< 8;num++){
                if(arry[num] == 0x4e || arry[num] == 0x4f){
                    nKingPocker[nKingCount++] = arry[num];
                    arry[num] = 15;
                }
            }
        }
        else if(len >= 8){
            for(var num = 8;num< 13;num++){
                if(arry[num] == 0x4e || arry[num] == 0x4f){
                    nKingPocker[nKingCount++] = arry[num];
                    arry[num] = 15;
                }
            }
        }

		if(len < 3){
            arrLen = 3;
            for(Inum = 0 ; Inum<arrLen ; Inum++){
                for(Jnum = 0 ;Jnum<arrLen-1 ; Jnum++){

                    if(arry[Jnum]%16 == 1){
                        arry[Jnum] = arry[Jnum] + arry[Jnum+1];
                        arry[Jnum+1] = arry[Jnum] - arry[Jnum+1];
                        arry[Jnum] = arry[Jnum] - arry[Jnum+1];
                    }
                    if((arry[Jnum]%16) < (arry[Jnum+1]%16)){
                        arry[Jnum] = arry[Jnum] + arry[Jnum+1];
                        arry[Jnum+1] = arry[Jnum] - arry[Jnum+1];
                        arry[Jnum] = arry[Jnum] - arry[Jnum+1];
                    }
                    if((arry[Jnum]%16) == (arry[Jnum+1]%16)){
                        if((arry[Jnum]/16)<(arry[Jnum+1]/16)){
                            arry[Jnum] = arry[Jnum] + arry[Jnum+1];
                            arry[Jnum+1] = arry[Jnum] - arry[Jnum+1];
                            arry[Jnum] = arry[Jnum] - arry[Jnum+1];
                        }
                    }
                }
            }
		}
		else if(len >= 3 && len < 8){
            arrLen = 8;
            for(Inum = 3 ; Inum<arrLen ; Inum++){
                for(Jnum = 3 ;Jnum<arrLen-1 ; Jnum++){
                    if(arry[Jnum]%16 == 1){
                        arry[Jnum] = arry[Jnum] + arry[Jnum+1];
                        arry[Jnum+1] = arry[Jnum] - arry[Jnum+1];
                        arry[Jnum] = arry[Jnum] - arry[Jnum+1];
                    }
                    if((arry[Jnum]%16) < (arry[Jnum+1]%16)){
                        arry[Jnum] = arry[Jnum] + arry[Jnum+1];
                        arry[Jnum+1] = arry[Jnum] - arry[Jnum+1];
                        arry[Jnum] = arry[Jnum] - arry[Jnum+1];
                    }
                    if((arry[Jnum]%16) == (arry[Jnum+1]%16)){
                        if((arry[Jnum]/16)<(arry[Jnum+1]/16)){
                            arry[Jnum] = arry[Jnum] + arry[Jnum+1];
                            arry[Jnum+1] = arry[Jnum] - arry[Jnum+1];
                            arry[Jnum] = arry[Jnum] - arry[Jnum+1];
                        }
                    }
                }
            }
		}
		else if(len >= 8){
            arrLen = 13;
            for(Inum = 8 ; Inum<arrLen ; Inum++){
                for(Jnum = 8 ;Jnum<arrLen-1 ; Jnum++){
                    if(arry[Jnum]%16 == 1){
                        arry[Jnum] = arry[Jnum] + arry[Jnum+1];
                        arry[Jnum+1] = arry[Jnum] - arry[Jnum+1];
                        arry[Jnum] = arry[Jnum] - arry[Jnum+1];
                    }
                    if((arry[Jnum]%16) < (arry[Jnum+1]%16)){
                        arry[Jnum] = arry[Jnum] + arry[Jnum+1];
                        arry[Jnum+1] = arry[Jnum] - arry[Jnum+1];
                        arry[Jnum] = arry[Jnum] - arry[Jnum+1];
                    }
                    if((arry[Jnum]%16) == (arry[Jnum+1]%16)){
                        if((arry[Jnum]/16)<(arry[Jnum+1]/16)){
                            arry[Jnum] = arry[Jnum] + arry[Jnum+1];
                            arry[Jnum+1] = arry[Jnum] - arry[Jnum+1];
                            arry[Jnum] = arry[Jnum] - arry[Jnum+1];
                        }
                    }
                }
            }
		}

        //癞子牌前移
        var nylaiCount = 0;
        var nyKingCount = 0;
        //癞子排序
        if(this.laipocker != null){
            if(len < 3){
                for(var num = 0;num< 3;num++){
                    if(arry[num] == 15){
                        arry[num] = nLaiPocker[nylaiCount++] ;
                    }
                    if(nylaiCount >= nLaiCount){
                        break;
                    }
                }
            }else if(len >= 3 && len < 8){
                for(var num = 3;num< 8;num++){
                    if(arry[num] == 15){
                        arry[num] = nLaiPocker[nylaiCount++] ;
                    }
                    if(nylaiCount >= nLaiCount){
                        break;
                    }
                }
            }
            else if(len >= 8){
                for(var num = 8;num< 13;num++){
                    if(arry[num] == 15){
                        arry[num] = nLaiPocker[nylaiCount++] ;
                    }
                    if(nylaiCount >= nLaiCount){
                        break;
                    }
                }
            }

        }
        //大小王排序
        if(len < 3){
            for(var num = 0;num< 3;num++){
                if(arry[num] == 15){
                    arry[num] = nKingPocker[nyKingCount++] ;
                }
                if(nyKingCount >= nKingCount){
                    break;
                }
            }
        }
        else if(len >= 3 && len < 8){
            for(var num = 3;num< 8;num++){
                if(arry[num] == 15){
                    arry[num] = nKingPocker[nyKingCount++] ;
                }
                if(nyKingCount >= nKingCount){
                    break;
                }
            }
        }
        else if(len >= 8){
            for(var num = 8;num< 13;num++){
                if(arry[num] == 15){
                    arry[num] = nKingPocker[nyKingCount++] ;
                }
                if(nyKingCount >= nKingCount){
                    break;
                }
            }
        }

		return arry;
    },
	//点下去之前牌的类型
	onreSetCardonOTT : function(num) {
		var testCard = CardSprite.create(this.pokecard[0],0,true);
		var sizeCard = testCard.ImgFront.getSize();
		var cardCount = 13;
		var cardNum = 0;
		var resNum = 0;
		cc.log("点下去之前牌的类型 this.Sendpoke= " + JSON.stringify(this.Sendpoke));

		//获取癞子张数
		var laiCount = this.getGhostCardCount();
		//如果点击的牌为空不做操作
		if(this.Card[num] == 0){
			return;
		}

		if(num<3){
			cc.log('num<3');
			cardNum = this.flagOne[num]-3;

			this.flagOne[num]=0;
			this.Card[cardNum].x = (this.PanelmeSize.width/15)*(13-cardNum+0.5);
			this.Card[cardNum].y = this.cardboxSize.height*0.6;
			//this.Card[cardNum].setScaleY(((this.cardboxSize.height) / (sizeCard.height)));
			this.Card[cardNum].setScale(0.94);
			this.Card[cardNum].setLocalZOrder(1000 + cardCount - cardNum);
			this.Card[cardNum].setTouchEnabled(true);
			cc.log('点击下去第'+num+"牌");
			if(num<2){
				for(var temp=num+1;temp<3;temp++){
					cc.log('flagOne[temp]'+this.flagOne[temp]+"temp"+temp);
					if(this.flagOne[temp]>0){
						this.flagOne[temp-1]=this.flagOne[temp];
						this.Sendpoke[temp-1]=this.Sendpoke[temp];
                        this.Sendpoke[temp] = 0;
                        if(this.flagThree[temp-8]-3 < laiCount){
                            var value = this.SavepockeArr[temp-1]%16 == 14?this.SavepockeArr[temp-1] - 13:this.SavepockeArr[temp-1];
                            var imagePath = "huaiFengCardListPlist/Value_" + ((value<0x10)?"0":"") + value.toString(16) + "_Style_0.png";
                            this.Card[this.flagThree[temp-8]-3].loadTexture(imagePath,ccui.Widget.PLIST_TEXTURE);
                            this.SavepockeArr[temp-1] = 0;
                        }
						this.Card[this.flagOne[temp]-3].x = this.Cardbox[temp-1].x;
						this.Card[this.flagOne[temp]-3].setLocalZOrder(1000 + temp-1);
						this.flagOne[temp]=0;
						resNum = resNum+1;
					}
					else if(this.flagOne[temp] == 0 && temp == num + 1){
                        this.Sendpoke[num] = 0;
					}
				}
			}
			else{
                this.Sendpoke[num] = 0;
			}
		}
		if(num>2&&num<8){
			cardNum = this.flagTwo[num-3]-3;
			this.flagTwo[num-3]=0;
			this.Card[cardNum].x = (this.PanelmeSize.width/15)*(13-cardNum+0.5);
			this.Card[cardNum].y = this.cardboxSize.height*0.6;
			//this.Card[cardNum].setScaleY(((this.cardboxSize.height) / (sizeCard.height)));
			this.Card[cardNum].setScale(0.94);
			this.Card[cardNum].setLocalZOrder(1000 + cardCount - cardNum);
			this.Card[cardNum].setTouchEnabled(true);
			
			cc.log('点击下去第'+num+"牌");
			if(num<7){
				for(var temp=num+1;temp<8;temp++){
					if(this.flagTwo[temp-3]>0){
						this.flagTwo[temp-4]=this.flagTwo[temp-3];
						this.Sendpoke[temp-1]=this.Sendpoke[temp];
                        this.Sendpoke[temp] = 0;
                        if(this.flagThree[temp-8]-3 < laiCount){
                            var value = this.SavepockeArr[temp-1]%16 == 14?this.SavepockeArr[temp-1] - 13:this.SavepockeArr[temp-1];
                            var imagePath = "huaiFengCardListPlist/Value_" + ((value<0x10)?"0":"") + value.toString(16) + "_Style_0.png";
                            this.Card[this.flagThree[temp-8]-3].loadTexture(imagePath,ccui.Widget.PLIST_TEXTURE);
                            this.SavepockeArr[temp-1] = 0;
                        }
						this.Card[this.flagTwo[temp-3]-3].x = this.Cardbox[temp-1].x;
						this.Card[this.flagTwo[temp-3]-3].setLocalZOrder(1000 + temp-1);
						this.flagTwo[temp-3]=0;
						resNum = resNum+1;
					}
                    else if(this.flagTwo[temp-3] == 0 && temp == num + 1){
                        this.Sendpoke[num] = 0;
                    }
				}
			}
            else{
                this.Sendpoke[num] = 0;
            }
		}
		if(num>7){
			cardNum = this.flagThree[num-8]-3;
			this.flagThree[num-8]=0;
			this.Card[cardNum].x = (this.PanelmeSize.width/15)*(13-cardNum+0.5);
			this.Card[cardNum].y = this.cardboxSize.height*0.6;
			//this.Card[cardNum].setScaleY(((this.cardboxSize.height) / (sizeCard.height)));
			this.Card[cardNum].setScale(0.94);
			this.Card[cardNum].setLocalZOrder(1000 + cardCount - cardNum);
			this.Card[cardNum].setTouchEnabled(true);			
			if(num<12){
				for(var temp=num+1;temp<13;temp++){
					if(this.flagThree[temp-8]>0){
						this.flagThree[temp-9]=this.flagThree[temp-8];
						this.Sendpoke[temp-1]=this.Sendpoke[temp];
                        this.Sendpoke[temp] = 0;
                        if(this.flagThree[temp-8]-3 < laiCount){
                            var value = this.SavepockeArr[temp-1]%16 == 14?this.SavepockeArr[temp-1] - 13:this.SavepockeArr[temp-1];
                            var imagePath = "huaiFengCardListPlist/Value_" + ((value<0x10)?"0":"") + value.toString(16) + "_Style_0.png";
                            this.Card[this.flagThree[temp-8]-3].loadTexture(imagePath,ccui.Widget.PLIST_TEXTURE);
                            this.SavepockeArr[temp-1] = 0;
						}
						this.Card[this.flagThree[temp-8]-3].x = this.Cardbox[temp-1].x;
						this.Card[this.flagThree[temp-8]-3].setLocalZOrder(1000 + temp-1);
						this.flagThree[temp-8]=0;
						resNum = resNum+1;
					}
                    else if(this.flagThree[temp-8] == 0 && temp == num + 1){
                        this.Sendpoke[num] = 0;
                    }
				}
			}
            else{
                this.Sendpoke[num] = 0;
            }
		}
		this.flagAll[cardNum]=0;
		
		var total = 0;
		for(var num = 0;num<this.nPockerMax;num++){
			if(this.flagAll[num]>1){
				total = total+1;
			}
		}
		cc.log("点下去之后 this.Sendpoke= " + JSON.stringify(this.Sendpoke));
		for(var i = 0;i < 3;i++){
			cc.log("flagOne"+this.flagOne[i]);
		}
		cc.log("VVVVtotal = "+total);
		if(total<13 && total>0){
			var leftcardnum = 0;
			
			var nSum = (this.nPockerMax-total)/2;
			if(nSum%1==0){
				nSum=nSum+0.5;
			}

            for (var temp = 0; temp < this.nPockerMax; temp++) {
                if (this.flagAll[temp] < 2) {
                    this.Card[temp].x = 2.5*this.Card[temp].width/2*0.94 + (leftcardnum - nSum)*(this.cardboxSize.width/this.nPockerMax - 4) + (this.cardboxSize.width / 2);
                    this.Card[temp].setLocalZOrder(1000 + temp);
                    leftcardnum = leftcardnum + 1;
                }
            }
        }
        else if(total == 0){
            for(var temp = 0; temp<this.nPockerMax;temp++){
                this.Card[temp].x = 3*this.Card[temp].width/2*0.94 + temp*(this.cardboxSize.width/this.nPockerMax - 4);
                this.Card[temp].setLocalZOrder(1000 + temp);
            }
        }

		if(resNum>0){
			this.Image_errRule.setVisible(false);
		}
		
	},
	//点上去之前牌的类型旧
	onSetCardonOTT : function(num) {
		cc.log("点上去之前 this.Sendpoke= " + JSON.stringify(this.Sendpoke));
		var testCard = CardSprite.create(this.pokecard[0],0,true);
		var sizeCard = testCard.ImgFront.getSize();

        // //如果弹起牌多余点击区域不做操作
        // if(num < 3 && this.getFlagCount(1) < this.getFlagAllCount()){
        // 	return;
        // }
        // else if (num >= 3 && num<8 && this.getFlagCount(2) < this.getFlagAllCount()){
        //     return;
        // }
        // else if (num >= 8 && this.getFlagCount(3) < this.getFlagAllCount()){
        //     return;
        // }

		if(num < 3 /*&& this.getFlagCount(1) >= this.getFlagAllCount()*/){
			var oneCardnum = 0;
			for(var Jnum =0 ;Jnum<3;Jnum++){
				if(this.flagOne[Jnum]>0){
					oneCardnum = oneCardnum+1;	
				}
			}
			cc.log("SSSoneCardnum="+oneCardnum);
			if(oneCardnum < 3){//头墩有地方没有
				var nCount = oneCardnum;
				for(var pCard =0;pCard<13;pCard++){
					if(this.flagAll[pCard] ==1 && nCount<3){
						var CardboxSize = this.Cardbox[nCount+3].getSize();
						this.Card[pCard].x = this.Cardbox[nCount].x;
						this.Card[pCard].y = this.Cardbox[nCount].y;
						//this.Card[pCard].setScaleY(((CardboxSize.height) / (sizeCard.height)));
						this.Card[pCard].setScale(0.89);
						this.Card[pCard].setTouchEnabled(false);
						this.flagAll[pCard] =2;
						this.flagOne[nCount]=pCard+3;
						this.Sendpoke[nCount]=this.pokecard[pCard];
						
						//设置上墩层级
						this.Card[pCard].setLocalZOrder(1000+nCount);
						
						nCount = nCount+1;	
						this.nPair = 0;
						this.nThree = 0;
						this.nShunPosition = [0,0,0,0,0];
						this.nPosition = [0,0,0,0,0];
						this.nTong = 0;
						this.nIron = 0;
                        this.nFive = 0;

					}
					if(this.flagOne[nCount] ==1){
						nCount = nCount+1;
					}	
				}
			}
		}
		else if(num>=3 && num<8 && this.getFlagCount(2) >= this.getFlagAllCount()){//中墩
			var oneCardnum = 0;
			for(var Jnum =3 ;Jnum<8;Jnum++){
				if(this.flagTwo[Jnum-3]>0){
					oneCardnum = oneCardnum+1;
				}
			}
			if(oneCardnum <5){
				var nCount = oneCardnum;
				cc.log('***num='+nCount);
				for(var pCard =0;pCard<13;pCard++){
					if(this.flagAll[pCard] ==1 && nCount<5){
						var CardboxSize = this.Cardbox[nCount+8].getSize();
						this.Card[pCard].x = this.Cardbox[nCount+3].x;
						this.Card[pCard].y = this.Cardbox[nCount+3].y;
						//this.Card[pCard].setScaleY(((CardboxSize.height) / (sizeCard.height)));
						this.Card[pCard].setScale(0.89);
						this.Card[pCard].setTouchEnabled(false);
						this.flagAll[pCard] =2;
						this.flagTwo[nCount]=pCard+3;
						this.Sendpoke[nCount+3]=this.pokecard[4-pCard];
						
						//设置中墩层级
						this.Card[pCard].setLocalZOrder(1000+ 3 + nCount);
						
						nCount = nCount+1;
						this.nPair = 0;
						this.nThree = 0;
						this.nShunPosition = [0,0,0,0,0];
						this.nPosition = [0,0,0,0,0];
						this.nTong = 0;
						this.nIron = 0;
                        this.nFive = 0;
					}
					if(this.flagTwo[nCount] ==1){
						nCount = nCount+1;
					}
				}
			}
		}
		else if(num>=8 && this.getFlagCount(3) >= this.getFlagAllCount()){
			var oneCardnum = 0;
			for(var Jnum =8 ;Jnum<13;Jnum++){
				if(this.flagThree[Jnum-8]>0){
					oneCardnum = oneCardnum+1;
				}
				cc.log('1***oneCardnum='+oneCardnum);
			}
			if(oneCardnum <5){
				for(var pCard =0;pCard<13;pCard++){
					if(this.flagAll[pCard] ==1 && oneCardnum<5){
						var CardboxSize = this.Cardbox[oneCardnum].getSize();
						this.Card[pCard].x = this.Cardbox[oneCardnum+8].x;
						this.Card[pCard].y = this.Cardbox[oneCardnum+8].y;
						//this.Card[pCard].setScaleY(((CardboxSize.height) / (sizeCard.height)));
						this.Card[pCard].setScale(0.89);
						this.Card[pCard].setTouchEnabled(false);
						this.flagAll[pCard] =2;
						this.flagThree[oneCardnum]=pCard+3;
						this.Sendpoke[oneCardnum+8]=this.pokecard[pCard];
						
						//设置下墩层级
						this.Card[pCard].setLocalZOrder(1000+ 8 + oneCardnum);
						
						oneCardnum = oneCardnum+1;
						this.nPair = 0;
						this.nThree = 0;
						this.nShunPosition = [0,0,0,0,0];
						this.nPosition = [0,0,0,0,0];
						this.nTong = 0;
						this.nIron = 0;
                        this.nFive = 0;
					}
				}
			}
		}
		cc.log("点上去之后 this.Sendpoke= " + JSON.stringify(this.Sendpoke));
		var total = 0;
		for(var num =0;num<5;num++){
			
			if(this.flagTwo[num]>0){
				total = total +1;
			}
			if(this.flagThree[num]>0){
				total = total + 1;
			}
			if(num<3){
				if(this.flagOne[num]>0){
					total = total + 1;
				}
			}
		}
		if(total == 13){
			
			if(this.nSpecial==0){
				var cardone = [this.Sendpoke[0],this.Sendpoke[1],this.Sendpoke[2]];
				var cardtwo = [this.Sendpoke[3],this.Sendpoke[4],this.Sendpoke[5],this.Sendpoke[6],this.Sendpoke[7]];
				var cardthree = [this.Sendpoke[8],this.Sendpoke[9],this.Sendpoke[10],this.Sendpoke[11],this.Sendpoke[12]];
				//对每一墩牌排序
				cc.log("每墩排序");
				cc.log("要发送的牌" + JSON.stringify(this.Sendpoke));

				cardone = this.onBubbleSort(cardone,3);
				cardtwo = this.onBubbleSort(cardtwo,5);
				cardthree = this.onBubbleSort(cardthree,5);
				//重新赋值
				this.Sendpokebefore = cardone.concat(cardtwo.concat(cardthree));
				cc.log("重新排序要发送的牌" + JSON.stringify(this.Sendpokebefore));
				//判断组牌是否符合规则

				var valueCard = this.Sendpoke;
				var oneValue = this.onGetFirstCards(valueCard,0);
				var twoValue = this.onGetSecondThirdCards(valueCard, 3);
				var threeValue = this.onGetSecondThirdCards(valueCard, 8);

				cc.log("oneValue = " + oneValue);
				cc.log("twoValue = " + twoValue);
				cc.log("threeValue = " + threeValue);

				var isTrue = true;
				var str0 = "第一墩牌组比第二墩牌组大，不符合规则，请重新组牌~";
				var str1 = "第一墩牌组比第三墩牌组大，不符合规则，请重新组牌~";
				var str2 = "第二墩牌组比第三墩牌组大，不符合规则，请重新组牌~";
				var strMsg = "";
				//不符合规则
				if(oneValue>twoValue ||oneValue>threeValue || twoValue>threeValue){
					if(oneValue>twoValue){
						//strMsg=str0;
						this.Image_errRule.setVisible(true);
					}
					if(oneValue>threeValue){
						//strMsg=str1;
						this.Image_errRule.setVisible(true);
					}
					if(twoValue>threeValue){
						//strMsg=str2;
						this.Image_errRule.setVisible(true);
					}
					isTrue = false;
				}
				if(oneValue == twoValue){//头墩和第二墩都是一种牌组
					if(oneValue==3){
						if(this.firtMax>this.secondMax){
							isTrue = false;
							//strMsg = str0;
							this.Image_errRule.setVisible(true);
						}
					}
					else if(oneValue == 2){
						if(this.fPairValue[0]>this.sPairValue[0]){
							isTrue = false;
							//strMsg = str0;
							this.Image_errRule.setVisible(true);
						}
						else if(this.fPairValue[0]>this.sPairValue[0]){
							if(this.fPairValue[1]>this.sPairValue[1]){
								isTrue = false;
								//strMsg = str0;
								this.Image_errRule.setVisible(true);
							}
						}
					}
					else if(oneValue == 0){
						if(cardone[2]%16>cardtwo[4]%16){
							isTrue = false;
							//strMsg = str0;
							this.Image_errRule.setVisible(true);
						}
						else if(cardone[2]%16 == cardtwo[4]%16){
							if(cardone[1]%16>cardtwo[3]%16){
								isTrue = false;
								//strMsg = str0;
								this.Image_errRule.setVisible(true);
							}
							else if(cardone[1]%16 == cardtwo[3]%16){
								if(cardone[0]%16>cardtwo[2]%16){
									isTrue = false;
									//strMsg = str0;
									this.Image_errRule.setVisible(true);
								}
							}
						}
					}
				}
				if(twoValue == threeValue){//第三墩和第二墩都是一种牌组
					if(twoValue == 8){
						if(this.secondMax>this.thirdMax){
							isTrue = false;
							//strMsg=str2;
							this.Image_errRule.setVisible(true);
						}
					}
					else if(twoValue == 7){
						if(this.secondMax>this.thirdMax){
							isTrue = false;
//							strMsg=str2;
							this.Image_errRule.setVisible(true);
						}
					}
					else if(twoValue == 6){
						if(this.secondMax>this.thirdMax){
							isTrue = false;
							//strMsg=str2;
							this.Image_errRule.setVisible(true);
						}
					}
					else if(twoValue == 5){
						if(this.secondMax>this.thirdMax){
							isTrue = false;
							//strMsg=str2;
							this.Image_errRule.setVisible(true);
						}
					}
					else if(twoValue == 4){
						if(this.secondMax>this.thirdMax){
							isTrue = false;
							//strMsg=str2;
							this.Image_errRule.setVisible(true);
						}
					}
					else if(twoValue == 3){
						if(this.secondMax>this.thirdMax){
							isTrue = false;
							//strMsg=str2;
							this.Image_errRule.setVisible(true);
						}
					}
					else if(twoValue == 2){
						if(this.sDPairValue[1]>this.tDPairValue[1]){
							isTrue = false;
							//strMsg=str2;
							this.Image_errRule.setVisible(true);
						}
						else if(this.sDPairValue[1]==this.tDPairValue[1]){						
							if(this.sDPairValue[0]>this.tDPairValue[0]){
								isTrue = false;
								//strMsg=str2;
								this.Image_errRule.setVisible(true);
							}
							else if(this.sDPairValue[0]==this.tDPairValue[0]){
								if(this.sDPairValue[2]>this.tDPairValue[2]){
									isTrue = false;
									//strMsg=str2;
									this.Image_errRule.setVisible(true);
								}
							}
						}
					}
					else if(twoValue == 1){
						if(this.sPairValue[0]>this.tPairValue[0]){
							isTrue = false;
							//strMsg=str2;
							this.Image_errRule.setVisible(true);
						}
						else if(this.sPairValue[0]==this.tPairValue[0]){
							if(this.sPairValue[3]>this.tPairValue[3]){
								isTrue = false;
								//strMsg=str2;
								this.Image_errRule.setVisible(true);
							}
							else if(this.sPairValue[3]==this.tPairValue[3]){
								if(this.sPairValue[2]>this.tPairValue[2]){
									isTrue = false;
									//strMsg=str2;
									this.Image_errRule.setVisible(true);
								}
								else if(this.sPairValue[2]==this.tPairValue[2]){
									if(this.sPairValue[1]>this.tPairValue[1]){
										isTrue = false;
										//strMsg=str2;
										this.Image_errRule.setVisible(true);
									}
								}
							}

						}
					}
					else if(twoValue == 0){
						if(cardtwo[4]%16>cardthree[4]%16){
							isTrue = false;
							//strMsg=str2;
							this.Image_errRule.setVisible(true);
						}
						else if(cardtwo[4]%16==cardthree[4]%16){
							if(cardtwo[3]>cardthree[3]){
								isTrue = false;
								//strMsg=str2;
								this.Image_errRule.setVisible(true);
							}
							else if(cardtwo[3]%16==cardthree[3]%16){
								if(cardtwo[2]%16>cardthree[2]%16){
									isTrue = false;
									//strMsg=str2;
									this.Image_errRule.setVisible(true);
								}
								else if(cardtwo[2]%16==cardthree[2]%16){
									if(cardtwo[1]%16>cardthree[1]%16){
										isTrue = false;
										//strMsg=str2;
										this.Image_errRule.setVisible(true);
									}
									else if(cardtwo[1]%16==cardthree[1]%16){
										if(cardtwo[0]%16>cardthree[0]%16){
											isTrue = false;
											//strMsg=str2;
											this.Image_errRule.setVisible(true);
										}
									}
								}
							}
						}
					}
				}

				if(isTrue == true){
					this.Panel_sure.setVisible(true);
                    this.Btn_sure.setTouchEnabled(true);
                    this.Btn_cancel.setTouchEnabled(true);
					this.Panel_cardkind.setVisible(false);
				}
				else{
					this.Image_errRule.setVisible(true);
				}
			}
			else{
				this.Panel_sure.setVisible(true);
                this.Btn_sure.setTouchEnabled(true);
                this.Btn_cancel.setTouchEnabled(true);
				this.Panel_cardkind.setVisible(false);
			}
						
		}
		else if(total<13 && total>0){//如果十三张没有全部放到卡组  重新排列
			cc.log("total="+total);
			var leftcardnum = 0;
			var nSum = (13-total)/2;
			if(nSum%1==0){
				nSum=nSum+0.5;
			}
			
			for(var temp = 0;temp<13;temp++){
				if(this.flagAll[temp]<2){		
					if(leftcardnum<nSum){
						this.Card[temp].x = (this.PanelmeSize.width/2)+(nSum-leftcardnum-1)*(this.PanelmeSize.width/15);
					}
					else{
						this.Card[temp].x = (this.PanelmeSize.width/2)+(nSum-leftcardnum-1)*(this.PanelmeSize.width/15);
					}					
					leftcardnum=leftcardnum+1;
				}			
			}
		}
		this.onIsPair(this.pokecard);
	},
	//点击上方区域放入当前墩牌组
	setCardInUpGroup:function (num) {
        cc.log("点击"+ num +"放入上方区域当墩牌组 this.Sendpoke= " + JSON.stringify(this.Sendpoke));
        cc.log("初始数据" + JSON.stringify(this.SavepockeArr));
        if(this.Image_errRule.isVisible()){
        	this.Image_errRule.setVisible(false);
        }

        //牌组标记为3的放入全部降级2
		for(var i = 0;i < this.nPockerMax;i++){
        	if(this.flagAll[i] == 3){
        		this.flagAll[i] = 2;
			}
		}

        if(num < 3){
			for (var Jnum = 0; Jnum < 3; Jnum++) {
				for (var pCard = 0; pCard < this.nPockerMax; pCard++) {
					if (this.flagAll[pCard] == 1 && this.Sendpoke[Jnum] != 0 && this.SavepockeArr[Jnum] != 0 && this.pokecard[pCard] == this.SavepockeArr[Jnum]) {
						this.Card[pCard].x = this.Cardbox[Jnum].x;
						this.Card[pCard].y = this.Cardbox[Jnum].y;
                        var value = this.Sendpoke[Jnum]%16 == 14?this.Sendpoke[Jnum] - 13:this.Sendpoke[Jnum];
                        var imagePath = "huaiFengCardListPlist/Value_" + ((value<0x10)?"0":"") + value.toString(16) + "_Style_0.png";
                        this.Card[pCard].loadTexture(imagePath,ccui.Widget.PLIST_TEXTURE);
						this.Card[pCard].setScale(0.89);
						this.Card[pCard].setTouchEnabled(false);
						this.flagAll[pCard] = 2;
						this.flagOne[Jnum] = pCard + 3;
						this.Card[pCard].setLocalZOrder(1000 + Jnum);
						this.nPair = 0;
						this.nThree = 0;
						this.nShunPosition = [0, 0, 0, 0, 0];
						this.nPosition = [0, 0, 0, 0, 0];
						this.nTong = 0;
						this.nIron = 0;
						this.nFive = 0;
						break;
					}
				}
			}
        }
        else if(num>=3 && num<8 ){//中墩
			cc.log("1");
            for (var Jnum = 3; Jnum < 8; Jnum++) {
                cc.log("2:"+Jnum);
                for (var pCard = 0; pCard < this.nPockerMax; pCard++) {
                    cc.log("3:"+pCard);
                    if ( this.flagAll[pCard] == 1 &&this.Sendpoke[Jnum] != 0 && this.SavepockeArr[Jnum] != 0 && this.pokecard[pCard] == this.SavepockeArr[Jnum]) {
                        this.Card[pCard].x = this.Cardbox[Jnum].x;
                        this.Card[pCard].y = this.Cardbox[Jnum].y;
                        var value = this.Sendpoke[Jnum]%16 == 14?this.Sendpoke[Jnum] - 13:this.Sendpoke[Jnum];
                        var imagePath = "huaiFengCardListPlist/Value_" + ((value<0x10)?"0":"") + value.toString(16) + "_Style_0.png";
                        this.Card[pCard].loadTexture(imagePath,ccui.Widget.PLIST_TEXTURE);
                        this.Card[pCard].setScale(0.89);
                        this.Card[pCard].setTouchEnabled(false);
                        this.flagAll[pCard] = 2;
                        this.flagTwo[Jnum - 3] = pCard + 3;
                        this.Card[pCard].setLocalZOrder(1000 + Jnum);
                        this.nPair = 0;
                        this.nThree = 0;
                        this.nShunPosition = [0, 0, 0, 0, 0];
                        this.nPosition = [0, 0, 0, 0, 0];
                        this.nTong = 0;
                        this.nIron = 0;
                        this.nFive = 0;
                        break;
                    }
                }
            }
        }
        else if(num>=8 ){
            for (var Jnum = 8; Jnum < 13; Jnum++) {
                for(var pCard = 0;pCard < this.nPockerMax;pCard++){
                    if (this.flagAll[pCard] == 1&&this.Sendpoke[Jnum] != 0 && this.pokecard[pCard] == this.SavepockeArr[Jnum]) {
                        this.Card[pCard].x = this.Cardbox[Jnum].x;
                        this.Card[pCard].y = this.Cardbox[Jnum].y;
                        var value = this.Sendpoke[Jnum]%16 == 14?this.Sendpoke[Jnum] - 13:this.Sendpoke[Jnum];
                        var imagePath = "huaiFengCardListPlist/Value_" + ((value<0x10)?"0":"") + value.toString(16) + "_Style_0.png";
                        this.Card[pCard].loadTexture(imagePath,ccui.Widget.PLIST_TEXTURE);
                        this.Card[pCard].setScale(0.89);
                        this.Card[pCard].setTouchEnabled(false);
                        this.flagAll[pCard] =2;
                        this.flagThree[Jnum - 8]=pCard+3;
                        this.Card[pCard].setLocalZOrder(1000 + Jnum);
                        this.nPair = 0;
                        this.nThree = 0;
                        this.nShunPosition = [0,0,0,0,0];
                        this.nPosition = [0,0,0,0,0];
                        this.nTong = 0;
                        this.nIron = 0;
                        this.nFive = 0;
                        break;
                    }
                }
            }
        }

        //旧的写法
        // if(num < 3){
        //     var oneCardnum = 0;
        //     for(var Jnum =0 ;Jnum<3;Jnum++){
        //         if(this.flagOne[Jnum]>0){
        //             oneCardnum = oneCardnum+1;
        //         }
        //     }
        //     cc.log("SSSoneCardnum="+oneCardnum);
        //     if(oneCardnum < 3){//头墩有地方没有
        //         var nCount = oneCardnum;
        //         for(var pCard =0;pCard<13;pCard++){
        //             if(this.flagAll[pCard] ==1 && nCount<3){
        //                 var CardboxSize = this.Cardbox[nCount+3].getSize();
        //                 this.Card[pCard].x = this.Cardbox[nCount].x;
        //                 this.Card[pCard].y = this.Cardbox[nCount].y;
        //                 //this.Card[pCard].setScaleY(((CardboxSize.height) / (sizeCard.height)));
        //                 this.Card[pCard].setScale(0.89);
        //                 this.Card[pCard].setTouchEnabled(false);
        //                 this.flagAll[pCard] =2;
        //                 this.flagOne[nCount]=pCard+3;
        //                 //this.Sendpoke[nCount]=this.pokecard[pCard];
        //                 this.Card[pCard].setLocalZOrder(1000+nCount);
        //                 nCount = nCount+1;
        //                 this.nPair = 0;
        //                 this.nThree = 0;
        //                 this.nShunPosition = [0,0,0,0,0];
        //                 this.nPosition = [0,0,0,0,0];
        //                 this.nTong = 0;
        //                 this.nIron = 0;
        //
        //             }
        //             if(this.flagOne[nCount] ==1){
        //                 nCount = nCount+1;
        //             }
        //         }
        //     }
        // }
        // else if(num>=3 && num<8 ){//中墩
        //     var twoCardnum = 0;
        //     for(var Jnum =3 ;Jnum<8;Jnum++){
        //         if(this.flagTwo[Jnum-3]>0){
        //             twoCardnum = twoCardnum+1;
        //         }
        //     }
        //     if(twoCardnum <5){
        //         var nCount = twoCardnum;
        //         cc.log('***num='+nCount);
        //         for(var pCard =0;pCard<13;pCard++){
        //             if(this.flagAll[pCard] ==1 && nCount<5){
        //                 var CardboxSize = this.Cardbox[nCount+8].getSize();
        //                 this.Card[pCard].x = this.Cardbox[nCount+3].x;
        //                 this.Card[pCard].y = this.Cardbox[nCount+3].y;
        //                 //this.Card[pCard].setScaleY(((CardboxSize.height) / (sizeCard.height)));
        //                 this.Card[pCard].setScale(0.89);
        //                 this.Card[pCard].setTouchEnabled(false);
        //                 this.flagAll[pCard] =2;
        //                 this.flagTwo[nCount]=pCard+3;
        //                 //this.Sendpoke[nCount+3]=this.pokecard[4-pCard];
        //                 this.Card[pCard].setLocalZOrder(1000+ 3 + nCount);
        //                 nCount = nCount+1;
        //                 this.nPair = 0;
        //                 this.nThree = 0;
        //                 this.nShunPosition = [0,0,0,0,0];
        //                 this.nPosition = [0,0,0,0,0];
        //                 this.nTong = 0;
        //                 this.nIron = 0;
        //             }
        //             if(this.flagTwo[nCount] ==1){
        //                 nCount = nCount+1;
        //             }
        //         }
        //     }
        // }
        // else if(num>=8 ){
        //     var threeCardnum = 0;
        //     for(var Jnum =8 ;Jnum<13;Jnum++){
        //         if(this.flagThree[Jnum-8]>0){
        //             threeCardnum = threeCardnum+1;
        //         }
        //         cc.log('1***oneCardnum='+threeCardnum);
        //     }
        //     if(threeCardnum <5){
        //         for(var pCard =0;pCard<13;pCard++){
        //             if(this.flagAll[pCard] ==1 && threeCardnum<5){
        //                 var CardboxSize = this.Cardbox[threeCardnum].getSize();
        //                 this.Card[pCard].x = this.Cardbox[threeCardnum+8].x;
        //                 this.Card[pCard].y = this.Cardbox[threeCardnum+8].y;
        //                 //this.Card[pCard].setScaleY(((CardboxSize.height) / (sizeCard.height)));
        //                 this.Card[pCard].setScale(0.89);
        //                 this.Card[pCard].setTouchEnabled(false);
        //                 this.flagAll[pCard] =2;
        //                 this.flagThree[threeCardnum]=pCard+3;
        //                 //this.Sendpoke[oneCardnum+8]=this.pokecard[pCard];
        //                 this.Card[pCard].setLocalZOrder(1000+ 8 + threeCardnum);
        //                 threeCardnum = threeCardnum+1;
        //                 this.nPair = 0;
        //                 this.nThree = 0;
        //                 this.nShunPosition = [0,0,0,0,0];
        //                 this.nPosition = [0,0,0,0,0];
        //                 this.nTong = 0;
        //                 this.nIron = 0;
        //				   this.nFive = 0;
        //             }
        //         }
        //     }
        // }

        cc.log(" 1墩牌组this.Sendpoke= " + JSON.stringify(this.Sendpoke));
        //上方位置重新排列
        if(num < 3){
            for (var Jnum = 0; Jnum < 3; Jnum++) {
                for (var pCard = 0; pCard < this.nPockerMax; pCard++) {
                    if (this.flagAll[pCard] == 2 && this.Sendpoke[Jnum] != 0 && this.SavepockeArr[Jnum] != 0 && this.pokecard[pCard] == this.SavepockeArr[Jnum]) {
                        this.Card[pCard].x = this.Cardbox[Jnum].x;
                        this.Card[pCard].y = this.Cardbox[Jnum].y;
                        //this.Card[pCard].setScaleY(((CardboxSize.height) / (sizeCard.height)));
                        this.Card[pCard].setScale(0.89);
                        this.Card[pCard].setTouchEnabled(false);
                        this.flagAll[pCard] = 3;
                        this.flagOne[Jnum] = pCard + 3;
                        //this.Sendpoke[nCount]=this.pokecard[pCard];
                        this.Card[pCard].setLocalZOrder(1000 + Jnum);
                        this.nPair = 0;
                        this.nThree = 0;
                        this.nShunPosition = [0, 0, 0, 0, 0];
                        this.nPosition = [0, 0, 0, 0, 0];
                        this.nTong = 0;
                        this.nIron = 0;
                        this.nFive = 0;
                        break;
                    }
                }
            }
        }
        else if(num>=3 && num<8 ){//中墩
            for (var Jnum = 3; Jnum < 8; Jnum++) {
                for (var pCard = 0; pCard < this.nPockerMax; pCard++) {
                    if ( this.flagAll[pCard] == 2 &&this.Sendpoke[Jnum] != 0 && this.SavepockeArr[Jnum] != 0 && this.pokecard[pCard] == this.SavepockeArr[Jnum]) {
                        this.Card[pCard].x = this.Cardbox[Jnum].x;
                        this.Card[pCard].y = this.Cardbox[Jnum].y;
                        //this.Card[pCard].setScaleY(((CardboxSize.height) / (sizeCard.height)));
                        this.Card[pCard].setScale(0.89);
                        this.Card[pCard].setTouchEnabled(false);
                        this.flagAll[pCard] = 3;
                        this.flagTwo[Jnum - 3] = pCard + 3;
                        //this.Sendpoke[nCount+3]=this.pokecard[4-pCard];
                        this.Card[pCard].setLocalZOrder(1000 + Jnum);
                        this.nPair = 0;
                        this.nThree = 0;
                        this.nShunPosition = [0, 0, 0, 0, 0];
                        this.nPosition = [0, 0, 0, 0, 0];
                        this.nTong = 0;
                        this.nIron = 0;
                        this.nFive = 0;
                        break;
                    }
                }
            }
        }
        else if(num>=8 ){
            for (var Jnum = 8; Jnum < 13; Jnum++) {
                for(var pCard = 0;pCard < this.nPockerMax;pCard++){
                    if (this.flagAll[pCard] == 2&&this.Sendpoke[Jnum] != 0 && this.SavepockeArr[Jnum] != 0 && this.pokecard[pCard] == this.SavepockeArr[Jnum]) {
                        this.Card[pCard].x = this.Cardbox[Jnum].x;
                        this.Card[pCard].y = this.Cardbox[Jnum].y;
                        //this.Card[pCard].setScaleY(((CardboxSize.height) / (sizeCard.height)));
                        this.Card[pCard].setScale(0.89);
                        this.Card[pCard].setTouchEnabled(false);
                        this.flagAll[pCard] =3;
                        this.flagThree[Jnum - 8]=pCard+3;
                        //this.Sendpoke[oneCardnum+8]=this.pokecard[pCard];
                        this.Card[pCard].setLocalZOrder(1000 + Jnum);
                        this.nPair = 0;
                        this.nThree = 0;
                        this.nShunPosition = [0,0,0,0,0];
                        this.nPosition = [0,0,0,0,0];
                        this.nTong = 0;
                        this.nIron = 0;
                        this.nFive = 0;
                        break;
                    }
                }
            }
        }
		//下方位置重新排列
        var total = 0;
        var leftcardnum = 0;
        for(var num =0;num<5;num++){

            if(this.flagTwo[num]>0){
                total = total +1;
            }
            if(this.flagThree[num]>0){
                total = total + 1;
            }
            if(num<3){
                if(this.flagOne[num]>0){
                    total = total + 1;
                }
            }
        }

        if(total<13 && total>0) {//如果十三张没有全部放到卡组  重新排列
            cc.log("total=" + total);
            var leftcardnum = 0;
            var nSum = (this.nPockerMax - total) / 2;
            if (nSum % 1 == 0) {
                nSum = nSum + 0.5;
            }

            for (var temp = 0; temp < this.nPockerMax; temp++) {
                if (this.flagAll[temp] < 2) {
                    this.Card[temp].x = 2.5*this.Card[temp].width/2*0.94 + (leftcardnum - nSum)*(this.cardboxSize.width/this.nPockerMax - 4) + (this.cardboxSize.width / 2);
                    this.Card[temp].y = this.cardboxSize.height*0.6;
                    this.Card[temp].setScale(0.94);
                    this.Card[temp].setLocalZOrder(1000 + temp);
                    leftcardnum = leftcardnum + 1;
                }
            }
        }
        else if(total == 0){
            for(var temp = 0; temp<this.nPockerMax;temp++){
                this.Card[temp].x = 3*this.Card[temp].width/2*0.94 + temp*(this.cardboxSize.width/this.nPockerMax - 4);
                this.Card[temp].setLocalZOrder(1000 + temp);
            }
        }

        if(total == 13){
			//放满剩三张排序
			if(this.nPockerMax >= 16){
				var num = -1;
                for(var temp = 0; temp<this.nPockerMax;temp++){
                    if(this.flagAll[temp] < 2){
                        this.Card[temp].x = 2.5*this.Card[temp].width/2*0.94 + (8+num)*(this.cardboxSize.width/this.nPockerMax - 4);
                        //this.Card[temp].y = this.cardboxSize.height*0.6;
                        this.Card[temp].setLocalZOrder(1000 + temp);
                        num++;
                    }
                }
			}

            this.Panel_sure.setVisible(true);
            this.Btn_sure.setTouchEnabled(true);
            this.Btn_cancel.setTouchEnabled(true);
            this.Panel_cardkind.setVisible(false);
		}

        cc.log("点上去之 this.Sendpoke= " + JSON.stringify(this.Sendpoke));
    },
	//判断点击数量是否成立
	bJudgeTouchUpCount:function (num) {
        //如果弹起牌多余点击区域不做操作
        if(num < 3 && this.getFlagCount(1) < this.getFlagAllCount()){
        	return false;
        }
        else if (num >= 3 && num<8 && this.getFlagCount(2) < this.getFlagAllCount()){
            return false;
        }
        else if (num >= 8 && this.getFlagCount(3) < this.getFlagAllCount()){
            return false;
        }
        return true;
    },
	//判断上部点击是否倒水
    bJudgeTouchUpPour:function(clickWhich){
		//判断规则
		var bRule = true;
        cc.log("是否倒水的牌前" + JSON.stringify(this.Sendpoke));
        //获取弹起手牌值
		var handCounts= this.getFlagAllCount();
		cc.log("弹起数量"+handCounts);
        var handup = this.getFlagAllCard();
        for(var num = 0;num < 5;num++){
        	if(handup[num] == null){
        		handup[num] = 0;
			}
		}
        cc.log("点击"+clickWhich+"获取的手牌" + JSON.stringify(handup));
		var handCount = 0;
        //加入弹起手牌
		if(clickWhich < 3){
			for(var n = 0;n < 3;n++){
				if(this.Sendpoke[n] == 0){
                    this.Sendpoke[n] = handup[handCount];
                    handCount++;
				}
			}
		}
		else if(clickWhich >= 3 && clickWhich < 8){
            for(var n = 3;n < 8;n++){
                if(this.Sendpoke[n] == 0){
                    this.Sendpoke[n] = handup[handCount];
                    handCount++;
                }
            }
		}
        else if(clickWhich >= 8){
            for(var n = 8;n < this.nPockerMax;n++){
                if(this.Sendpoke[n] == 0 ){
                    this.Sendpoke[n] = handup[handCount];
                    handCount++;
                }
            }
		}
        //保存之前的牌值
		var tempSavep = [];
		for(var num = 0;num < 13;num++){
            tempSavep[num] =  this.Sendpoke[num];
		}
        this.SavepockeArr = tempSavep;
        cc.log("保存的牌值" + JSON.stringify(this.SavepockeArr));
        //如果有癞子进行变换操作
		this.bJudgeTouchUpChange(this.Sendpoke,clickWhich);
        cc.log("变换的的牌值" + JSON.stringify(this.Sendpoke));
		//判断墩数是否为空
		var bOneIsNull = true;
        var bTwoIsNull = true;
        var bThreeIsNull = true;
        for(var num = 0;num < 3;num++){
			if(this.Sendpoke[num] == 0) {
                bOneIsNull = false;
                cc.log("第一墩牌未满");
                break;
            }
        }
        for(var num = 3;num < 8;num++){
			if(this.Sendpoke[num] == 0) {
				bTwoIsNull = false;
                cc.log("第二墩牌未满");
				break;
			}
        }
		for(var num = 8;num < 13;num++){
			if(this.Sendpoke[num] == 0) {
				bThreeIsNull = false;
				cc.log("第三墩牌未满");
				break;
			}
		}
		//排序手牌
        this.Sendpoke = this.onMoundSort(this.Sendpoke,clickWhich);
		//排序后的原始牌
		this.SavepockeArr = this.onMoundSort(this.SavepockeArr,clickWhich);
        cc.log("排序后的手牌" + JSON.stringify(this.Sendpoke));
        cc.log("排序后的原始牌" + JSON.stringify(this.SavepockeArr));
        var oneValue = this.onGetFirstCards(this.Sendpoke,0);
        var twoValue = this.onGetSecondThirdCards(this.Sendpoke, 3);
        var threeValue = this.onGetSecondThirdCards(this.Sendpoke, 8);
        cc.log("第一墩牌" + JSON.stringify(oneValue));
        cc.log("第二墩牌" + JSON.stringify(twoValue));
        cc.log("第三墩牌" + JSON.stringify(threeValue));

        var cardone = [this.Sendpoke[0],this.Sendpoke[1],this.Sendpoke[2]];
        var cardtwo = [this.Sendpoke[3],this.Sendpoke[4],this.Sendpoke[5],this.Sendpoke[6],this.Sendpoke[7]];
        var cardthree = [this.Sendpoke[8],this.Sendpoke[9],this.Sendpoke[10],this.Sendpoke[11],this.Sendpoke[12]];
        //不符合规则
		if(oneValue>twoValue && bOneIsNull == true && bTwoIsNull == true){
			bRule = false;
		}
		if(oneValue>threeValue && bOneIsNull == true && bThreeIsNull == true){
			bRule = false;
		}
		if(twoValue>threeValue && bTwoIsNull == true && bThreeIsNull == true){
			bRule = false;
		}

        if(oneValue == twoValue && bOneIsNull == true && bTwoIsNull == true){//头墩和第二墩都是一种牌组
            if(oneValue==3){
                if(this.firtMax>this.secondMax){
                    bRule = false;
                }
            }
            else if(oneValue == 2){
                if(this.fPairValue[0]>this.sPairValue[0]){
                    bRule = false;
                }
                else if(this.fPairValue[0]>this.sPairValue[0]){
                    if(this.fPairValue[1]>this.sPairValue[1]){
                        bRule = false;
                    }
                }
            }
            else if(oneValue == 0){
                if(cardone[2]%16>cardtwo[4]%16){
                    bRule = false;
                }
                else if(cardone[2]%16 == cardtwo[4]%16){
                    if(cardone[1]%16>cardtwo[3]%16){
                        bRule = false;
                    }
                    else if(cardone[1]%16 == cardtwo[3]%16){
                        if(cardone[0]%16>cardtwo[2]%16){
                            bRule = false;
                        }
                    }
                }
            }
        }
        if(twoValue == threeValue && bTwoIsNull == true && bThreeIsNull == true){//第三墩和第二墩都是一种牌组
            if(twoValue == 8){
                if(this.secondMax>this.thirdMax){
                    bRule = false;
                }
            }
            else if(twoValue == 7){
                if(this.secondMax>this.thirdMax){
                    bRule = false;
                }
            }
            else if(twoValue == 6){
                if(this.secondMax>this.thirdMax){
                    bRule = false;
                }
            }
            else if(twoValue == 5){
                if(this.secondMax>this.thirdMax){
                    bRule = false;
                }
            }
            else if(twoValue == 4){
                if(this.secondMax>this.thirdMax){
                    bRule = false;
                }
            }
            else if(twoValue == 3){
                if(this.secondMax>this.thirdMax){
                    bRule = false;
                }
            }
            else if(twoValue == 2){
                if(this.sDPairValue[1]>this.tDPairValue[1]){
                    bRule = false;
                }
                else if(this.sDPairValue[1]==this.tDPairValue[1]){
                    if(this.sDPairValue[0]>this.tDPairValue[0]){
                        bRule = false;
                    }
                    else if(this.sDPairValue[0]==this.tDPairValue[0]){
                        if(this.sDPairValue[2]>this.tDPairValue[2]){
                            bRule = false;
                        }
                    }
                }
            }
            else if(twoValue == 1){
                if(this.sPairValue[0]>this.tPairValue[0]){
                    bRule = false;
                }
                else if(this.sPairValue[0]==this.tPairValue[0]){
                    if(this.sPairValue[3]>this.tPairValue[3]){
                        bRule = false;
                    }
                    else if(this.sPairValue[3]==this.tPairValue[3]){
                        if(this.sPairValue[2]>this.tPairValue[2]){
                            bRule = false;
                        }
                        else if(this.sPairValue[2]==this.tPairValue[2]){
                            if(this.sPairValue[1]>this.tPairValue[1]){
                                bRule = false;
                            }
                        }
                    }

                }
            }
            else if(twoValue == 0){
                if(cardtwo[4]%16>cardthree[4]%16){
                    bRule = false;
                }
                else if(cardtwo[4]%16==cardthree[4]%16){
                    if(cardtwo[3]>cardthree[3]){
                        bRule = false;
                    }
                    else if(cardtwo[3]%16==cardthree[3]%16){
                        if(cardtwo[2]%16>cardthree[2]%16){
                            bRule = false;
                        }
                        else if(cardtwo[2]%16==cardthree[2]%16){
                            if(cardtwo[1]%16>cardthree[1]%16){
                                bRule = false;
                            }
                            else if(cardtwo[1]%16==cardthree[1]%16){
                                if(cardtwo[0]%16>cardthree[0]%16){
                                    bRule = false;
                                }
                            }
                        }
                    }
                }
            }
        }

        if(bRule == false){
            this.Image_errRule.setVisible(true);
			//倒水去除点入的牌
            handCount = 0;
            if(num < 3){
                for(var n = 0;n < 3;n++){
                    if(this.Sendpoke[n] == handup[handCount]){
                        this.Sendpoke[n] = 0;
                        handCount++;
                    }
                }
            }
            else if(num >= 3 && num < 8){
                for(var n = 3;n < 8;n++){
                    if(this.Sendpoke[n] == handup[handCount]){
                        this.Sendpoke[n] = 0;
                        handCount++;
                    }
                }
            }
            else if(num > 8){
                for(var n = 8;n < 13;n++){
                    if(this.Sendpoke[n] == handup[handCount]){
                        this.Sendpoke[n] = 0;
                        handCount++;
                    }
                }
            }
		}

		return bRule;
	},
    //判断癞子的变换操作
	bJudgeTouchUpChange:function(sendpoker,clickWhich){
    	cc.log("-------------------开始变换---------------");
    	//是否有癞子
		var laiArr = [];
		var curArr = [];
		var tempPocker = [0,0,0,0,0,0,0,0,0,0,0,0,0];

		if(clickWhich < 3){
            for(var num = 0;num < 3;num++){
                if(sendpoker[num] == 0){
                    return;
                }
                if(sendpoker[num] == 0x4e || sendpoker[num] == 0x4f || sendpoker[num] == this.laipocker[0]
                    || sendpoker[num] == this.laipocker[1] || sendpoker[num] == this.laipocker[2] || sendpoker[num] == this.laipocker[3]){
                    laiArr.push(sendpoker[num]);
                }else{
                    curArr.push(sendpoker[num]);
                }
            }
		}else if( clickWhich >= 3 && clickWhich < 8){
            for(var num = 3;num < 8;num++){
                if(sendpoker[num] == 0){
                    return;
                }
                if(sendpoker[num] == 0x4e || sendpoker[num] == 0x4f || sendpoker[num] == this.laipocker[0]
                    || sendpoker[num] == this.laipocker[1] || sendpoker[num] == this.laipocker[2] || sendpoker[num] == this.laipocker[3]){
                    laiArr.push(sendpoker[num]);
                }else{
                    curArr.push(sendpoker[num]);
                }
            }
        }else if( clickWhich >= 8 && clickWhich < 13){
            for(var num = 8;num < 13;num++){
                if(sendpoker[num] == 0){
                    return;
                }
                if(sendpoker[num] == 0x4e || sendpoker[num] == 0x4f || sendpoker[num] == this.laipocker[0]
                    || sendpoker[num] == this.laipocker[1] || sendpoker[num] == this.laipocker[2] || sendpoker[num] == this.laipocker[3]){
                    laiArr.push(sendpoker[num]);
                }else{
                    curArr.push(sendpoker[num]);
                }
            }
        }

        cc.log("真实数据牌："+curArr);
        if(laiArr.length <= 0){
            return;
        }
		// if(clickWhich < 3 && curArr.length + laiArr.length < 3){
         //    return;
        // }else if(clickWhich >= 3 && clickWhich < 8 && curArr.length + laiArr.length < 5){
         //    return;
		// }else if(clickWhich >= 8 && clickWhich < 13 && curArr.length + laiArr.length < 5){
        	// return;
		// }

		if(clickWhich < 3){
			if(curArr.length < 3){
				return;
			}
			if(laiArr.length == 3){
				var maxNum = 0;
				for(var num = 0;num < 3;num++){
					if(laiArr[num] != 0x4e && laiArr[num] != 0x4f ){
						maxNum = laiArr[num];
						break;
					}
				}
                tempPocker[0] = maxNum;
                tempPocker[1] = maxNum;
                tempPocker[2] = maxNum;
			}else if(laiArr.length == 2){
                tempPocker[0] = curArr[0];
                tempPocker[1] = curArr[0];
                tempPocker[2] = curArr[0];
			}else if (laiArr.length == 1 ){
                tempPocker[0] = curArr[0];
                tempPocker[1] = curArr[0];
                tempPocker[2] = curArr[1];
			}
		}
		else {
            if(laiArr.length == 5){
                cc.log("lai5.");
                var maxNum = 0;
                for(var num = 0;num < 5;num++){
                    if(laiArr[num] != 0x4e && laiArr[num] != 0x4f ){
                        maxNum = laiArr[num];
                        break;
                    }
                }
                tempPocker[3] = maxNum;
                tempPocker[4] = maxNum;
                tempPocker[5] = maxNum;
                tempPocker[6] = maxNum;
                tempPocker[7] = maxNum;
            }
            else if(laiArr.length == 4){
                cc.log("lai4.");
                tempPocker[3] = curArr[0];
                tempPocker[4] = curArr[0];
                tempPocker[5] = curArr[0];
                tempPocker[6] = curArr[0];
                tempPocker[7] = curArr[0];
            }
            else if(laiArr.length == 3){
                cc.log("lai3.");
            	if(curArr[0]%16 == curArr[1]%16){
                    tempPocker[3] = curArr[0];
                    tempPocker[4] = curArr[0];
                    tempPocker[5] = curArr[0];
                    tempPocker[6] = curArr[0];
                    tempPocker[7] = curArr[1];
				}
				else if(parseInt(curArr[0]/16) == parseInt(curArr[1]/16) && curArr[0]%16 != curArr[1]%16
				&& ((curArr[0]%16 == 1 && curArr[1]%16 < 6) || (curArr[0]%16 == 1 && curArr[1]%16 > 9) || (curArr[0]%16 - curArr[1]%16 < 5) ) ){
            		if(curArr[0]%16 == 1 && curArr[1]%16 < 6) {
                        tempPocker[3] = curArr[0];
                        tempPocker[4] = curArr[0]  + 4;
                        tempPocker[5] = curArr[0]  + 3;
                        tempPocker[6] = curArr[0]  + 2;
                        tempPocker[7] = curArr[0]  + 1;
						// for(var num = 4;num < 8;num++){
						// 	if(tempPocker[num]%16 == curArr[1] % 16){
                         //        tempPocker[num] = curArr[1];
                         //        break;
						// 	}
						// }
                    }
            		if(curArr[0]%16 == 1 && curArr[1]%16 > 9){
                        tempPocker[3] = curArr[0];
                        tempPocker[4] = curArr[0]  + 12;
                        tempPocker[5] = curArr[0]  + 11;
                        tempPocker[6] = curArr[0]  + 10;
                        tempPocker[7] = curArr[0]  + 9;
					}
					else if(curArr[0]%16 > 9 && curArr[1]%16 > 9){
            			var pockerNum = curArr[1]/16 << 4 + 10;
                        tempPocker[3] = curArr[1]/16 << 4 + 1;
                        tempPocker[4] = curArr[1]/16 << 4 + 10;
                        tempPocker[5] = curArr[1]/16 << 4 + 11;
                        tempPocker[6] = curArr[1]/16 << 4 + 12;
                        tempPocker[7] = curArr[1]/16 << 4 + 13;
					}
					else{
                        tempPocker[3] = curArr[1]  + 4;
                        tempPocker[4] = curArr[1]  + 3;
                        tempPocker[5] = curArr[1]  + 2;
                        tempPocker[6] = curArr[1]  + 1;
                        tempPocker[7] = curArr[1];
					}
				}
				else {
                    tempPocker[3] = curArr[0];
                    tempPocker[4] = curArr[1];
                    tempPocker[5] = curArr[1];
                    tempPocker[6] = curArr[1];
                    tempPocker[7] = curArr[1];
				}

            }
            else if(laiArr.length == 2){
                cc.log("lai2.");
				if(curArr[0]%16 == curArr[1]%16 && curArr[0]%16 == curArr[2]%16){
                    tempPocker[3] = curArr[0];
                    tempPocker[4] = curArr[0];
                    tempPocker[5] = curArr[0];
                    tempPocker[6] = curArr[1];
                    tempPocker[7] = curArr[2];
				}//五条
				else if(parseInt(curArr[0]/16) == parseInt(curArr[1]/16) && parseInt(curArr[0]/16) == parseInt(curArr[2]/16)
					&& curArr[0]%16 != curArr[1]%16 && curArr[0]%16 != curArr[2]%16 && curArr[1]%16 != curArr[2]%16
					&& (curArr[0]%16 == 1 && curArr[1]%16 < 6 && curArr[2]%16 < 6) || (curArr[0]%16 == 1 && curArr[1]%16 > 9 && curArr[2]%16 > 9) || (curArr[0]%16 - curArr[2]%16 < 5) ){//同花顺
                    if(curArr[0]%16 == 1 && curArr[1]%16 < 6 && curArr[2]%16 < 6) {
                        tempPocker[3] = curArr[0];
                        tempPocker[4] = curArr[0]  + 4;
                        tempPocker[5] = curArr[0]  + 3;
                        tempPocker[6] = curArr[0]  + 2;
                        tempPocker[7] = curArr[0]  + 1;
                    }
                    if(curArr[0]%16 == 1 && curArr[1]%16 > 9 && curArr[2]%16 > 9){
                        tempPocker[3] = curArr[0];
                        tempPocker[4] = curArr[0]  + 12;
                        tempPocker[5] = curArr[0]  + 11;
                        tempPocker[6] = curArr[0]  + 10;
                        tempPocker[7] = curArr[0]  + 9;
                    }
                    else if(curArr[0]%16 > 9 && curArr[1]%16 > 9 && curArr[2]%16 > 9){
                        tempPocker[3] = curArr[2]/16 << 4 + 1;
                        tempPocker[4] = curArr[2]/16 << 4 + 10;
                        tempPocker[5] = curArr[2]/16 << 4 + 11;
                        tempPocker[6] = curArr[2]/16 << 4 + 12;
                        tempPocker[7] = curArr[2]/16 << 4 + 13;
                    }
                    else{
                        tempPocker[3] = curArr[2]  + 4;
                        tempPocker[4] = curArr[2]  + 3;
                        tempPocker[5] = curArr[2]  + 2;
                        tempPocker[6] = curArr[2]  + 1;
                        tempPocker[7] = curArr[2];
                    }
				}
                else if(curArr[0]%16 == curArr[1]%16 || curArr[1]%16 == curArr[2]%16) {//是否铁枝
					if(curArr[0]%16 == curArr[1]%16){
                        tempPocker[3] = curArr[0];
                        tempPocker[4] = curArr[0];
                        tempPocker[5] = curArr[0];
                        tempPocker[6] = curArr[1];
                        tempPocker[7] = curArr[2];
					}else {
                        tempPocker[3] = curArr[0];
                        tempPocker[4] = curArr[1];
                        tempPocker[5] = curArr[1];
                        tempPocker[6] = curArr[1];
                        tempPocker[7] = curArr[2];
					}
                }//是否同花
				else if(parseInt(curArr[0]/16) == parseInt(curArr[1]/16) && parseInt(curArr[0]/16) == parseInt(curArr[2]/16)){
                    tempPocker[3] = curArr[0];
                    tempPocker[4] = curArr[0];
                    tempPocker[5] = curArr[0];
                    tempPocker[6] = curArr[1];
                    tempPocker[7] = curArr[2];
            	}
            	//是否顺子
            	else if(curArr[0]%16 == 1 && curArr[1]%16 < 6 && curArr[2]%16 < 6 && curArr[1]%16 != curArr[2]%16 && curArr[1]%16 != 1 ) {
                    tempPocker[3] = curArr[0];
                    tempPocker[4] = curArr[0]  + 4;
                    tempPocker[5] = curArr[0]  + 3;
                    tempPocker[6] = curArr[0]  + 2;
                    tempPocker[7] = curArr[0]  + 1;
                    for(var num = 4;num < 8;num++){
                    	if(tempPocker[num]%16 == curArr[0] % 16){
                            tempPocker[num] = curArr[0];
                    	}
                        if(tempPocker[num]%16 == curArr[1] % 16){
                            tempPocker[num] = curArr[1];
                        }
                        if(tempPocker[num]%16 == curArr[2] % 16){
                            tempPocker[num] = curArr[2];
                        }
                    }
                }
                else if(curArr[0]%16 == 1 && curArr[1]%16 > 9 && curArr[2]%16 > 9 && curArr[1]%16 != curArr[2]%16 && curArr[1]%16 != 1){
                    tempPocker[3] = curArr[0];
                    tempPocker[4] = curArr[0]  + 12;
                    tempPocker[5] = curArr[0]  + 11;
                    tempPocker[6] = curArr[0]  + 10;
                    tempPocker[7] = curArr[0]  + 9;
                    for(var num = 4;num < 8;num++){
                        if(tempPocker[num]%16 == curArr[0] % 16){
                            tempPocker[num] = curArr[0];
                        }
                        if(tempPocker[num]%16 == curArr[1] % 16){
                            tempPocker[num] = curArr[1];
                        }
                        if(tempPocker[num]%16 == curArr[2] % 16){
                            tempPocker[num] = curArr[2];
                        }
                    }
                }
                else if(curArr[0]%16 - curArr[2]%16 < 5 && curArr[0]%16 != curArr[1]%16 && curArr[1]%16 != curArr[2]%16){
                    tempPocker[3] = curArr[2] + 4;
                    tempPocker[4] = curArr[2] + 3;
                    tempPocker[5] = curArr[2] + 2;
                    tempPocker[6] = curArr[2] + 1;
                    tempPocker[7] = curArr[2];
                    for(var num = 4;num < 8;num++){
                        if(tempPocker[num]%16 == curArr[0] % 16){
                            tempPocker[num] = curArr[0];
                        }
                        if(tempPocker[num]%16 == curArr[1] % 16){
                            tempPocker[num] = curArr[1];
                        }
                        if(tempPocker[num]%16 == curArr[2] % 16){
                            tempPocker[num] = curArr[2];
                        }
                    }
                }
                //三条
                else{
                    tempPocker[3] = curArr[0];
                    tempPocker[4] = curArr[0];
                    tempPocker[5] = curArr[0];
                    tempPocker[6] = curArr[1];
                    tempPocker[7] = curArr[2];
                }
			}
            else if(laiArr.length == 1){
                cc.log("lai1.");
                if(curArr[0]%16 == curArr[1]%16 && curArr[0]%16 == curArr[2]%16 && curArr[0]%16 == curArr[3]%16 ){
                    cc.log("五条");
                    tempPocker[3] = curArr[0];
                    tempPocker[4] = curArr[0];
                    tempPocker[5] = curArr[1];
                    tempPocker[6] = curArr[2];
                    tempPocker[7] = curArr[3];
                }
                else if(parseInt(curArr[0]/16) == parseInt(curArr[1]/16) && parseInt(curArr[0]/16) == parseInt(curArr[2]/16)
                    && parseInt(curArr[0]/16) == parseInt(curArr[3]/16) && curArr[0]%16 != curArr[1]%16 && curArr[1]%16 != curArr[2]%16
					&& curArr[2]%16 != curArr[3]%16 && ( (curArr[0]%16 == 1 && curArr[1]%16 < 6 && curArr[2]%16 < 6 && curArr[3]%16 < 6) ||
					(curArr[0]%16 == 1 && curArr[1]%16 > 9 && curArr[2]%16 > 9 && curArr[3]%16 > 9) || (curArr[0]%16 - curArr[3]%16 < 5)) ){
                	cc.log("同花顺");
                    if(curArr[0]%16 == 1 && curArr[1]%16 < 6 && curArr[2]%16 < 6 && curArr[3]%16 < 6) {
                        tempPocker[3] = curArr[0];
                        tempPocker[4] = curArr[0]  + 4;
                        tempPocker[5] = curArr[0]  + 3;
                        tempPocker[6] = curArr[0]  + 2;
                        tempPocker[7] = curArr[0]  + 1;
                    }
                    else if(curArr[0]%16 == 1 && curArr[1]%16 > 9 && curArr[2]%16 > 9 && curArr[3]%16 > 9){
                        tempPocker[3] = curArr[0];
                        tempPocker[4] = curArr[0]  + 12;
                        tempPocker[5] = curArr[0]  + 11;
                        tempPocker[6] = curArr[0]  + 10;
                        tempPocker[7] = curArr[0]  + 9;
                    }
                    else if(curArr[0]%16 > 9 && curArr[1]%16 > 9 && curArr[2]%16 > 9 && curArr[3]%16 > 9){
                        tempPocker[3] = curArr[2]/16 << 4 + 1;
                        tempPocker[4] = curArr[2]/16 << 4 + 10;
                        tempPocker[5] = curArr[2]/16 << 4 + 11;
                        tempPocker[6] = curArr[2]/16 << 4 + 12;
                        tempPocker[7] = curArr[2]/16 << 4 + 13;
                    }
                    else {
                        tempPocker[3] = curArr[3]  + 4;
                        tempPocker[4] = curArr[3]  + 3;
                        tempPocker[5] = curArr[3]  + 2;
                        tempPocker[6] = curArr[3]  + 1;
                        tempPocker[7] = curArr[3];
                    }
                }
                else if((curArr[0]%16 == curArr[1]%16 && curArr[0]%16 == curArr[2]%16)
					|| (curArr[1]%16 == curArr[2]%16 && curArr[1]%16 == curArr[3]%16) ) {
                    cc.log("铁枝");
                    if(curArr[0]%16 == curArr[1]%16){
                        tempPocker[3] = curArr[0];
                        tempPocker[4] = curArr[0];
                        tempPocker[5] = curArr[1];
                        tempPocker[6] = curArr[2];
                        tempPocker[7] = curArr[3];
                    }else {
                        tempPocker[3] = curArr[0];
                        tempPocker[4] = curArr[1];
                        tempPocker[5] = curArr[1];
                        tempPocker[6] = curArr[2];
                        tempPocker[7] = curArr[3];
                    }
                }
                else if(curArr[0]%16 == curArr[1]%16 && curArr[2]%16 == curArr[3]%16){
                    tempPocker[3] = curArr[0];
                    tempPocker[4] = curArr[0];
                    tempPocker[5] = curArr[1];
                    tempPocker[6] = curArr[2];
                    tempPocker[7] = curArr[3];
				}
                else if(parseInt(curArr[0]/16) == parseInt(curArr[1]/16) && parseInt(curArr[0]/16) == parseInt(curArr[2]/16)
                    && parseInt(curArr[0]/16) == parseInt(curArr[3]/16)){
                    tempPocker[3] = curArr[0];
                    tempPocker[4] = curArr[0];
                    tempPocker[5] = curArr[1];
                    tempPocker[6] = curArr[2];
                    tempPocker[7] = curArr[3];
                }
                //是否顺子
                else if(curArr[0]%16 == 1 && curArr[1]%16 < 6 && curArr[2]%16 < 6 && curArr[3]%16 < 6
					&& curArr[1]%16 != curArr[2]%16 && curArr[2]%16 != curArr[3]%16 && curArr[1]%16 != 1 ) {
                    tempPocker[3] = curArr[0];
                    tempPocker[4] = curArr[0]  + 4;
                    tempPocker[5] = curArr[0]  + 3;
                    tempPocker[6] = curArr[0]  + 2;
                    tempPocker[7] = curArr[0]  + 1;
                    for(var num = 4;num < 8;num++){
                        if(tempPocker[num]%16 == curArr[0] % 16){
                            tempPocker[num] = curArr[0];
                        }
                        if(tempPocker[num]%16 == curArr[1] % 16){
                            tempPocker[num] = curArr[1];
                        }
                        if(tempPocker[num]%16 == curArr[2] % 16){
                            tempPocker[num] = curArr[1];
                        }
                        if(tempPocker[num]%16 == curArr[3] % 16){
                            tempPocker[num] = curArr[1];
                        }
                    }
                }
                else if(curArr[0]%16 == 1 && curArr[1]%16 > 9 && curArr[2]%16 > 9 && curArr[3]%16 > 9
					&& curArr[1]%16 != curArr[2]%16 && curArr[2]%16 != curArr[3]%16 && curArr[1]%16 != 1){
                    tempPocker[3] = curArr[0];
                    tempPocker[4] = curArr[0]  + 12;
                    tempPocker[5] = curArr[0]  + 11;
                    tempPocker[6] = curArr[0]  + 10;
                    tempPocker[7] = curArr[0]  + 9;
                    for(var num = 4;num < 8;num++){
                        if(tempPocker[num]%16 == curArr[0] % 16){
                            tempPocker[num] = curArr[0];
                        }
                        if(tempPocker[num]%16 == curArr[1] % 16){
                            tempPocker[num] = curArr[1];
                        }
                        if(tempPocker[num]%16 == curArr[2] % 16){
                            tempPocker[num] = curArr[2];
                        }
                        if(tempPocker[num]%16 == curArr[3] % 16){
                            tempPocker[num] = curArr[3];
                        }
                    }
                }
                else if(curArr[0]%16 == curArr[1]%16 + 1 && curArr[1]%16 == curArr[2]%16 + 1 && curArr[2]%16 == curArr[3]%16 + 1 ){
                    tempPocker[3] = curArr[3] + 4;
                    tempPocker[4] = curArr[3] + 3;
                    tempPocker[5] = curArr[3] + 2;
                    tempPocker[6] = curArr[3] + 1;
                    tempPocker[7] = curArr[3];
                    for(var num = 4;num < 8;num++){
                        if(tempPocker[num]%16 == curArr[0] % 16){
                            tempPocker[num] = curArr[0];
                        }
                        if(tempPocker[num]%16 == curArr[1] % 16){
                            tempPocker[num] = curArr[1];
                        }
                        if(tempPocker[num]%16 == curArr[2] % 16){
                            tempPocker[num] = curArr[2];
                        }
                        if(tempPocker[num]%16 == curArr[3] % 16){
                            tempPocker[num] = curArr[3];
                        }
                    }
                }
                else if(curArr[0]%16 == curArr[1]%16 || curArr[1]%16 == curArr[2]%16 || curArr[2]%16 == curArr[3]%16){//三条
					if(curArr[0]%16 == curArr[1]%16){
                        tempPocker[3] = curArr[0];
                        tempPocker[4] = curArr[0];
                        tempPocker[5] = curArr[1];
                        tempPocker[6] = curArr[2];
                        tempPocker[7] = curArr[3];
					}else if(curArr[1]%16 == curArr[2]%16){
                        tempPocker[3] = curArr[0];
                        tempPocker[4] = curArr[1];
                        tempPocker[5] = curArr[1];
                        tempPocker[6] = curArr[2];
                        tempPocker[7] = curArr[3];
					}else{
                        tempPocker[3] = curArr[0];
                        tempPocker[4] = curArr[1];
                        tempPocker[5] = curArr[2];
                        tempPocker[6] = curArr[2];
                        tempPocker[7] = curArr[3];
					}

                }
                else{
                    tempPocker[3] = curArr[0];
                    tempPocker[4] = curArr[1];
                    tempPocker[5] = curArr[2];
                    tempPocker[6] = curArr[3];
                    tempPocker[7] = curArr[4];
				}
            }

		}

		cc.log("变换后的手牌："+ tempPocker);
		if(clickWhich < 3){
            for(var num = 0;num < 3;num++){
                this.Sendpoke[num] = tempPocker[num];
            }
		}else if(clickWhich >= 3 && clickWhich < 8){
            for(var num = 3;num < 8;num++){
                this.Sendpoke[num] = tempPocker[num];
            }
		}
        else if(clickWhich >= 8 && clickWhich < 13){
			for(var num = 3;num < 8;num++){
                this.Sendpoke[num + 5] = tempPocker[num];
			}
		}
	},
    //获取上方组牌区域数量
    getFlagUpAllCount:function(){
        var flagNum = 0;

		for(var num = 0;num < 13;num++){
			if(this.flagAll[num] == 2){
				flagNum += 1;
			}
		}

        return flagNum;
    },
	//获取上方组牌区域某墩部数量
	getFlagCount:function(flagCount){
		var flagNum = 0;
		if(flagCount == 1){
			for(var num = 0;num < 3;num++){
                if(this.flagOne[num] == 0){
                    flagNum += 1;
                }
			}
		}
		else if(flagCount == 2){
            for(var num = 0;num < 5;num++){
                if(this.flagTwo[num] == 0){
                    flagNum += 1;
                }
            }
		}
		else if(flagCount == 3){
            for(var num = 0;num < 5;num++){
                if(this.flagThree[num] == 0){
                    flagNum += 1;
                }
            }
		}

		return flagNum;
	},
    ////////////////底部牌操作//////////////////
    //获取组合下方弹起的手牌数量
    getFlagAllCount:function () {
        var flagUpCount = 0;
        for(var num = 0;num < this.nPockerMax;num++){
            if(this.flagAll[num] == 1){
                flagUpCount += 1;
            }
        }

        return flagUpCount;
    },
    //获取组合下方弹起的手牌数值
    getFlagAllCard:function () {

        cc.log("真实手牌："+JSON.stringify(this.pokecard));
        var flagUpCount = 0;
        var flagUpCards = [];
        cc.log("弹起的牌：");
        for(var num = 0;num < this.nPockerMax;num++){
            if(this.flagAll[num] == 1){
                cc.log(""+num+".");
                flagUpCards[flagUpCount] = this.pokecard[num];
                flagUpCount++;
            }
        }

        return flagUpCards;
    },
    //放牌到底部box
    onSetcardOnMid : function(poke,CardCount,laipocker) {
		cc.log("1onSetcardOnMid");
        this.PanelmeSize = this.Panel_me.getSize();
        this.cardboxSize = this.panel_cardbox.getSize();
        this.Card = [];
        cc.log("11onSetcardOnMid");
        for(var temp = 0; temp<CardCount;temp++){
            if(poke[temp]%16 == 14){
                this.Card[temp] = this.onCreatCard(poke[temp]-13, 0);
            }
            else{
                this.Card[temp] = this.onCreatCard(poke[temp], 0);
            }
            this.Card[temp].setName("card"+temp);
            //this.Card[temp].setTouchEnabled(true);
            //牌的距离 == 容器的大小等分 - 4(偏差)  + 一个半的牌的大小;
            this.Card[temp].x = 3*this.Card[temp].width/2*0.94 + temp*(this.cardboxSize.width/(CardCount) - 4);
            this.Card[temp].y = this.cardboxSize.height*0.6;
            //this.Card[temp].addTouchEventListener(this.onClickCardEvent, this);//单张牌的touch事件（废弃）;
            this.Card[temp].setScale(0.94);
            this._rootWidget.addChild(this.Card[temp]);
            this.Card[temp].setOpacity(0)
            this.Card[temp].runAction(cc.fadeIn(0.5));
            this.Card[temp].setLocalZOrder(1000+temp);
            var ceng = this.Card[temp].getLocalZOrder();
            cc.log("ceng"+temp+"="+ceng);
        }
        cc.log("2onSetcardOnMid");
        //添加癞子标识
        if(laipocker != null){//显示癞子闪烁
            for(var num = 0;num < poke.length;num++){
                if(laipocker[0] ==  poke[num] || laipocker[1] ==  poke[num]
                    || laipocker[2] ==  poke[num] || laipocker[3] ==  poke[num]){
                    var laiSprite = new cc.Sprite("res/game-sss/Chinesepoke/FrameLai01.png");
                    var laiSize = laiSprite.getContentSize();
                    laiSprite.setAnchorPoint(0,0);
                    laiSprite.setName("laiSprite");
                    laiSprite.setVisible(true);

                    //重复癞子动画
                    var animateFrame = [];
                    var animPath = "";
                    for (var i = 1; i < 3; i++) {
                        animPath = "ddzsouces/FrameLai0"+i+".png";
                        var frame = cc.spriteFrameCache.getSpriteFrame(animPath);
                        animateFrame.push(frame);
                    }
                    var animation = new cc.Animation(animateFrame, 0.2);

                    laiSprite.runAction(cc.animate(animation).repeatForever());

                    this.Card[num].addChild(laiSprite);
                }
            }
        }
        cc.log("3onSetcardOnMid");
        //添加牌的监听
        this.onTouchListener();

    },
    //上面手牌的每墩重置到下部Box
    onResetPoke : function(kind) {
        var testCard = CardSprite.create(0,0,true);
        var sizeCard = testCard.ImgFront.getSize();
        var CardCount = 13;//这里后面要传参过来hcmg
        var cardNum = 0;
        if(kind == 1){

            for(var num = 0;num<3;num++){
                this.Sendpoke[num] = 0;
                if(this.flagOne[num]>0){
                    cardNum = this.flagOne[num]-3;
                    cc.log('cardNum ' + cardNum);
                    this.flagOne[num]=0;
                    if(this.SavepockeArr[num] != 0){
                        var value = this.SavepockeArr[num]%16 == 14?this.SavepockeArr[num] - 13:this.SavepockeArr[num];
                        var imagePath = "huaiFengCardListPlist/Value_" + ((value<0x10)?"0":"") + value.toString(16) + "_Style_0.png";
                        this.Card[cardNum].loadTexture(imagePath,ccui.Widget.PLIST_TEXTURE);
                    }
                    this.Card[cardNum].x = (this.PanelmeSize.width/15)*(1 + cardNum+0.5);
                    this.Card[cardNum].y = this.cardboxSize.height*0.6;
                    this.Card[cardNum].setScale(0.94);
                    this.Card[cardNum].setLocalZOrder(1000 + cardNum);
                    this.Card[cardNum].setTouchEnabled(true);
                    this.flagAll[cardNum]=0;
                    this.SavepockeArr[num] = 0;
                }

            }
        }
        else if(kind == 2){
            for(var num = 3;num<8;num++){
                this.Sendpoke[num] = 0;
                if(this.flagTwo[num-3]>0){
                    cardNum = this.flagTwo[num-3]-3;
                    cc.log('cardNum ' + cardNum);
                    this.flagTwo[num-3]=0;
                    if(this.SavepockeArr[num] != 0){
                        var value = this.SavepockeArr[num]%16 == 14?this.SavepockeArr[num] - 13:this.SavepockeArr[num];
                        var imagePath = "huaiFengCardListPlist/Value_" + ((value<0x10)?"0":"") + value.toString(16) + "_Style_0.png";
                        this.Card[cardNum].loadTexture(imagePath,ccui.Widget.PLIST_TEXTURE);
					}
                    this.Card[cardNum].x = (this.PanelmeSize.width/15)*(1 + cardNum+0.5);
                    this.Card[cardNum].y = this.cardboxSize.height*0.6;
                    this.Card[cardNum].setScale(0.94);
                    this.Card[cardNum].setLocalZOrder(1000 + cardNum);
                    this.Card[cardNum].setTouchEnabled(true);
                    this.flagAll[cardNum]=0;
                    this.SavepockeArr[cardNum] = 0;
                }
            }
        }
        else if(kind == 3){
            for(var num = 8;num<13;num++){
                this.Sendpoke[num] = 0;
                if(this.flagThree[num-8]>0){
                    cardNum = this.flagThree[num-8]-3;
                    cc.log('cardNum ' + cardNum);
                    this.flagThree[num-8]=0;
                    if(this.SavepockeArr[num] != 0){
                        var value = this.SavepockeArr[num]%16 == 14?this.SavepockeArr[num] - 13:this.SavepockeArr[num];
                        var imagePath = "huaiFengCardListPlist/Value_" + ((value<0x10)?"0":"") + value.toString(16) + "_Style_0.png";
                        this.Card[cardNum].loadTexture(imagePath,ccui.Widget.PLIST_TEXTURE);
                    }
                    this.Card[cardNum].x = (this.PanelmeSize.width/15)*(1 + cardNum+0.5);
                    this.Card[cardNum].y = this.cardboxSize.height*0.6;
                    this.Card[cardNum].setScale(0.94);
                    this.Card[cardNum].setLocalZOrder(1000 + cardNum);
                    this.Card[cardNum].setTouchEnabled(true);
                    this.flagAll[cardNum]=0;
                    this.SavepockeArr[cardNum] = 0;
                }
            }
        }
        else{
            for(var num = 0;num<13;num++){
                this.Sendpoke[num] = 0;
                if(num<3){
                    if(this.flagOne[num]>0){
                        if(this.flagOne[num]>0){
                            cardNum = this.flagOne[num]-3;
                            cc.log('cardNum ' + cardNum);
                            this.flagOne[num]=0;
                            if(this.SavepockeArr[num] != 0){
                                var value = this.SavepockeArr[num]%16 == 14?this.SavepockeArr[num] - 13:this.SavepockeArr[num];
                                var imagePath = "huaiFengCardListPlist/Value_" + ((value<0x10)?"0":"") + value.toString(16) + "_Style_0.png";
                                this.Card[cardNum].loadTexture(imagePath,ccui.Widget.PLIST_TEXTURE);
                            }
                            this.Card[cardNum].x = (this.PanelmeSize.width/15)*(1 + cardNum+0.5);
                            this.Card[cardNum].y = this.cardboxSize.height*0.6;
                            this.Card[cardNum].setScale(0.94);
                            this.Card[cardNum].setLocalZOrder(1000 + cardNum);
                            this.Card[cardNum].setTouchEnabled(true);
                            this.flagAll[cardNum]=0;
                            this.SavepockeArr[cardNum] = 0;
                        }
                    }
                }
                else if(num>=3 && num<8){
                    if(this.flagTwo[num-3]>0){
                        cardNum = this.flagTwo[num-3]-3;
                        cc.log('cardNum ' + cardNum);
                        this.flagTwo[num-3]=0;
                        if(this.SavepockeArr[num] != 0){
                            var value = this.SavepockeArr[num]%16 == 14?this.SavepockeArr[num] - 13:this.SavepockeArr[num];
                            var imagePath = "huaiFengCardListPlist/Value_" + ((value<0x10)?"0":"") + value.toString(16) + "_Style_0.png";
                            this.Card[cardNum].loadTexture(imagePath,ccui.Widget.PLIST_TEXTURE);
                        }
                        this.Card[cardNum].x = (this.PanelmeSize.width/15)*(13-cardNum+0.5);
                        this.Card[cardNum].y = this.cardboxSize.height*0.6;
                        this.Card[cardNum].setScale(0.94);
                        this.Card[cardNum].setLocalZOrder(1000 + cardNum);
                        this.Card[cardNum].setTouchEnabled(true);
                        this.flagAll[cardNum]=0;;
                        this.SavepockeArr[cardNum] = 0;
                    }
                }
                else{
                    if(this.flagThree[num-8]>0){
                        cardNum = this.flagThree[num-8]-3;
                        cc.log('cardNum ' + cardNum);
                        this.flagThree[num-8]=0;
                        if(this.SavepockeArr[num] != 0){
                            var value = this.SavepockeArr[num]%16 == 14?this.SavepockeArr[num] - 13:this.SavepockeArr[num];
                            var imagePath = "huaiFengCardListPlist/Value_" + ((value<0x10)?"0":"") + value.toString(16) + "_Style_0.png";
                            this.Card[cardNum].loadTexture(imagePath,ccui.Widget.PLIST_TEXTURE);
                        }
                        this.Card[cardNum].x = (this.PanelmeSize.width/15)*(13-cardNum+0.5);
                        this.Card[cardNum].y = this.cardboxSize.height*0.6;
                        this.Card[cardNum].setScale(0.94);
                        this.Card[cardNum].setLocalZOrder(1000 + cardNum);
                        this.Card[cardNum].setTouchEnabled(true);
                        this.flagAll[cardNum]=0;
                        this.SavepockeArr[cardNum] = 0;
                    }
                }
            }
        }

        var total = 0;
        for(var num = 0;num<13;num++){
            if(this.flagAll[num]>1){
                total = total+1;
            }
        }
        cc.log("CCCCtotal = "+total);
        if(total<13 && total>0){
            var leftcardnum = 0;

            var nSum = (this.nPockerMax-total)/2;
            if(nSum%1==0){
                nSum=nSum+0.5;
            }

            for(var temp = 0;temp<this.nPockerMax;temp++){
                if(this.flagAll[temp]<2){
                    //this.Card[temp].x = (this.PanelmeSize.width/2)+(leftcardnum - nSum  + 1)*(this.PanelmeSize.width/15);
                    this.Card[temp].x = 2.5*this.Card[temp].width/2*0.94 + (leftcardnum - nSum)*(this.cardboxSize.width/this.nPockerMax - 4) + (this.cardboxSize.width / 2);
                    this.Card[temp].setScale(0.94);
                    cc.log("下排序"+nSum+","+leftcardnum+","+(nSum-leftcardnum-1));
                    leftcardnum=leftcardnum+1;
                }
            }
        }
        else if(total == 0){
            for(var temp = 0; temp<this.nPockerMax;temp++){
                this.Card[temp].x = 3*this.Card[temp].width/2*0.94 + temp*(this.cardboxSize.width/this.nPockerMax - 4);
                this.Card[temp].setLocalZOrder(1000 + temp);
            }
        }
        cc.log("flagone = "+ JSON.stringify(this.flagOne));
        cc.log("flagtwo = "+ JSON.stringify(this.flagTwo));
        cc.log("flagthree = "+ JSON.stringify(this.flagThree));
        this.nPair = 0;
        this.nThree = 0;
        this.nShunPosition = [0,0,0,0,0];
        this.nPosition = [0,0,0,0,0];
        this.nTShun = [];
        this.nTShunPosition = [];
        this.nTong = 0;
        this.nIron = 0;
        this.nFive = 0;
        this.nDPair = [0,0];
        this.nGourd = [0,0];
        this.onIsPair(this.pokecard);
        this.Panel_sure.setVisible(false);
        this.Btn_sure.setTouchEnabled(false);
        this.Btn_cancel.setTouchEnabled(false);
        this.Panel_cardkind.setVisible(true);
        this.Image_errRule.setVisible(false);
    },
    ////////////////时钟操作////////////////////
    //设置开始比牌界面时间
    onStartCountDownTime: function () {
        cc.director.getScheduler().scheduleCallbackForTarget(this, this.updateCountDownTime,1, cc.REPEAT_FOREVER, 0, false, "keyCountDownTime");
    },
    //更新比牌界面时间
    updateCountDownTime : function() {
        this.dissolutionTime =this.dissolutionTime-1;
        if(this.LabTime && this.dissolutionTime>0){
            this.LabTime.setString(this.dissolutionTime);

            var slem = this.LabTime.getString().length;
            this.LabTime.setContentSize(39 * slem, 60);
        }
        else if(this.LabTime == null) {
            cc.director.getScheduler().unscheduleCallbackForTarget(this,this.updateCountDownTime);
        }
        if(this.dissolutionTime<=0){
            cc.director.getScheduler().unscheduleCallbackForTarget(this,this.updateCountDownTime);
            this.LabTime.setString(0);

            var slem = this.LabTime.getString().length;
            this.LabTime.setContentSize(39 * slem, 60);
        }
    },
    ////////////////逻辑操作////////////////////
    //该亮哪个特殊牌型
    onIsPair : function(arry) {//判断各色牌是否存在

        var sPCard = [];
        cc.log("this.pokecard = " + JSON.stringify(this.pokecard));
        for(var num  = 0;num<13;num++){
            sPCard[12-num] = this.pokecard[num];
        }
        var nSpec = this.onGetSpecialcard(sPCard,13);
        if(nSpec!=false){
            cc.log(" nSpec = "+nSpec);

            // this.Btn_fourthree.setVisible(true);
            // this.Btn_fourthree.setEnabled(true);
            // this.Btn_fourthree.setBright(true);
            if(nSpec == 23){
                //this.Text_teshu.setString("至尊清龙");
                this.SprTes[14].setVisible(true);
            }
            else if(nSpec == 22){
                //this.Text_teshu.setString("一条龙");
                this.SprTes[13].setVisible(true);
            }
            else if(nSpec == 21){
                //this.Text_teshu.setString("四套三冲");
                this.SprTes[12].setVisible(true);
            }
            else if(nSpec == 20){
                //this.Text_teshu.setString("三炸弹");("三分天下");
                this.SprTes[11].setVisible(true);
            }
            else if(nSpec == 19){
                //this.Text_teshu.setString("三黄五帝");
                this.SprTes[10].setVisible(true);
            }
            else if(nSpec == 18){
                //this.Text_teshu.setString("十二皇族");
                this.SprTes[9].setVisible(true);
            }
            else if(nSpec == 17){
                //this.Text_teshu.setString("三同花顺");
                this.SprTes[8].setVisible(true);
            }
            else if(nSpec == 16){
                //this.Text_teshu.setString("全大");
                this.SprTes[7].setVisible(true);
            }
            else if(nSpec == 15){
                //this.Text_teshu.setString("全小");
                this.SprTes[6].setVisible(true);
            }
            else if(nSpec == 14){
                //this.Text_teshu.setString("凑一色");
                this.SprTes[5].setVisible(true);
            }
            else if(nSpec == 13){
                //this.Text_teshu.setString("五对三条");
                this.SprTes[4].setVisible(true);
            }
            else if(nSpec == 12){
                //this.Text_teshu.setString("六对半");
                this.SprTes[3].setVisible(true);
            }
            else if(nSpec == 11){
                //this.Text_teshu.setString("三同花");
                this.SprTes[1].setVisible(true);
                //this.onSetThreeTonghuaUp(this.pokecard,13);
            }
            else if(nSpec == 10){
                //this.Text_teshu.setString("三顺子");
                this.SprTes[2].setVisible(true);
            }

            this.nSpecial = nSpec;

        }
        else {
            this.SprTes[0].setVisible(true);
            this.nSpecial = 0;
        }

        var arrLen = arry.length;
        var Inum,Jnum;
        var nTemp = 1;
        var nCount = 1;

        for(Jnum = 0 ;Jnum<arrLen-1 ; Jnum++){
            if((arry[Jnum]%16) == (arry[Jnum+1]%16)){
                cc.log(" Jnum = "+Jnum+"   nCount=" + nCount);
                nTemp = nTemp+1;
                this.flagPair[Jnum] = nCount;
                this.flagPair[Jnum+1] = nCount;
                if(nTemp>2){
                    if((arry[Jnum-1]%16) == (arry[Jnum]%16)){
                        this.flagPair[Jnum-1] = nCount;
                        this.flagPair[Jnum] = nCount;
                        this.flagPair[Jnum+1] = nCount;
                    }
                    else{
                        nTemp = 1;
                        nCount = nCount+1;
                        continue;
                    }
                }
                if((arry[Jnum]%16) != (arry[Jnum+2]%16)){
                    nTemp = 1;
                    nCount = nCount+1;
                    continue;
                }
            }
            else{
                this.flagPair[Jnum+1]=0;
            }
        }

        //if(this.onSetPairUp(1) == true){//判断有没有对子
        if(this.onSetGhostUp(1,1)==true){
            this.Btn_pair.setTouchEnabled(true);
            this.Btn_pair.setEnabled(true);
            this.Btn_pair.setBright(true);
        }
        else{
            this.Btn_pair.setTouchEnabled(false);
            this.Btn_pair.setEnabled(false);
            this.Btn_pair.setBright(false);
        }
        if(this.onSetGhostUp(1,2)==true){//判断有没有两对
            this.Btn_pair_double.setTouchEnabled(true);
            this.Btn_pair_double.setEnabled(true);
            this.Btn_pair_double.setBright(true);
        }
        else{
            this.Btn_pair_double.setTouchEnabled(false);
            this.Btn_pair_double.setEnabled(false);
            this.Btn_pair_double.setBright(false);
        }

        if(this.onSetGhostUp(1,3)==true){
            this.Btn_three.setTouchEnabled(true);
            this.Btn_three.setEnabled(true);
            this.Btn_three.setBright(true);
        }
        else{
            this.Btn_three.setTouchEnabled(false);
            this.Btn_three.setEnabled(false);
            this.Btn_three.setBright(false);
        }

        this.nTShun = [];
        this.nTShunPosition = [];
        this.nTonghuashun = 0;
        this.nShunNum = 0;
        this.nShunPosition = [0,0,0,0,0];
        this.nPosition = [0,0,0,0,0];

        cc.log("顺子是否要亮起");
        if(this.onSetGhostUp(1,4)==true){
            this.Btn_shunzi.setTouchEnabled(true);
            this.Btn_shunzi.setEnabled(true);
            this.Btn_shunzi.setBright(true);
        }
        else{
            this.Btn_shunzi.setTouchEnabled(false);
            this.Btn_shunzi.setEnabled(false);
            this.Btn_shunzi.setBright(false);
        }

        this.nTShun = [];
        this.nTShunPosition = [];
        this.nTonghuashun = 0;
        this.nShunNum = 0;
        this.nShunPosition = [0,0,0,0,0];
        this.nPosition = [0,0,0,0,0];

        cc.log("同花是否要亮起");
        if(this.onSetGhostUp(1,5)==true){
            this.Btn_tonghua.setEnabled(true);
            this.Btn_tonghua.setBright(true);
        }
        else{
            this.Btn_tonghua.setEnabled(false);
            this.Btn_tonghua.setBright(false);
        }

        this.nTShun = [];
        this.nTShunPosition = [];
        this.nTonghuashun = 0;
        this.nShunNum = 0;
        this.nShunPosition = [0,0,0,0,0];
        this.nPosition = [0,0,0,0,0];

        if(this.onSetGhostUp(1,8)==true){
            this.Btn_tonghuashun.setEnabled(true);
            this.Btn_tonghuashun.setBright(true);
            this.Btn_tonghua.setEnabled(true);
            this.Btn_tonghua.setBright(true);
        }
        else{
            this.Btn_tonghuashun.setEnabled(false);
            this.Btn_tonghuashun.setBright(false);
        }


        this.nGourd = [0,0];
        if(this.onSetGhostUp(1,6)==true){
            this.Btn_gourd.setEnabled(true);
            this.Btn_gourd.setBright(true);
        }
        else{
            this.Btn_gourd.setEnabled(false);
            this.Btn_gourd.setBright(false);
        }

        if(this.onSetGhostUp(1,7)==true){
            this.Btn_iron.setEnabled(true);
            this.Btn_iron.setBright(true);
        }
        else{
            this.Btn_iron.setEnabled(false);
            this.Btn_iron.setBright(false);
        }

        if(this.onSetGhostUp(1,9)==true){
            this.Btn_wutong.setEnabled(true);
            this.Btn_wutong.setBright(true);
        }
        else{
            this.Btn_wutong.setEnabled(false);
            this.Btn_wutong.setBright(false);
        }

        return ;
    },
    //所有牌的排序
    onBubbleSort : function(arry,len,laipocker){ //排序 从大到小

        cc.log("1打印癞子扑克"+JSON.stringify(laipocker));
        if(len>=13){
            for(var num = 0;num<len;num++){
                if(arry[num]%16 == 1){
                    arry[num] = arry[num]+13;
                }
            }
        }

        var nLaiPocker = [];
        var nKingPocker = [];
        var nKingCount = 0;
        var nLaiCount = 0;
        if(len>=13 && laipocker != null){//癞子排序
            for(var num = 0;num<len;num++){
                if(laipocker[0] == arry[num] || laipocker[1] == arry[num]
                    || laipocker[2] == arry[num] || laipocker[3] == arry[num]){
                    nLaiPocker[nLaiCount++] = arry[num];
                    arry[num] = 15;
                }
            }
        }
        //大小王排序
        for(var num = 0;num<len;num++){
            if(arry[num] == 0x4e || arry[num] == 0x4f){
                nKingPocker[nKingCount++] = arry[num];
                arry[num] = 15;
            }
        }

        cc.log("2打印癞子扑克"+JSON.stringify(nLaiPocker));
        cc.log("打印扑克"+JSON.stringify(arry));
        var arrLen = arry.length;
        var Inum,Jnum;
        for(Inum = 0 ; Inum<arrLen ; Inum++){
            for(Jnum = 0 ;Jnum<arrLen-1 ; Jnum++){
                if(arry[Jnum]%16 == 1){
                    arry[Jnum] = arry[Jnum] + arry[Jnum+1];
                    arry[Jnum+1] = arry[Jnum] - arry[Jnum+1];
                    arry[Jnum] = arry[Jnum] - arry[Jnum+1];
                }
                if((arry[Jnum]%16) < (arry[Jnum+1]%16)){
                    arry[Jnum] = arry[Jnum] + arry[Jnum+1];
                    arry[Jnum+1] = arry[Jnum] - arry[Jnum+1];
                    arry[Jnum] = arry[Jnum] - arry[Jnum+1];
                }
                if((arry[Jnum]%16) == (arry[Jnum+1]%16)){
                    if((arry[Jnum]/16)<(arry[Jnum+1]/16)){
                        arry[Jnum] = arry[Jnum] + arry[Jnum+1];
                        arry[Jnum+1] = arry[Jnum] - arry[Jnum+1];
                        arry[Jnum] = arry[Jnum] - arry[Jnum+1];
                    }
                }
            }
        }
        cc.log("打印扑克"+JSON.stringify(arry));
        //癞子牌前移
        var nylaiCount = 0;
        var nyKingCount = 0;
        if(laipocker != null){
            for(var num = 0;num<len;num++){
                if(arry[num] == 15){
                    arry[num] = nLaiPocker[nylaiCount++] ;
                }
                if(nylaiCount >= nLaiCount){
                    break;
                }
            }
        }
        //大小王
        for(var num = 0;num<len;num++){
            if(arry[num] == 15){
                arry[num] = nKingPocker[nyKingCount++] ;
            }
            if(nyKingCount >= nKingCount){
                break;
            }
        }

        return arry;
    },
    //设置特殊牌
    onSetCardonSpecial:function(num){
        // var testCard = CardSprite.create(this.pokecard[0],0,true);
        // var sizeCard = testCard.ImgFront.getSize();
        cc.log("gothis.Sendpoke="+this.Sendpoke);
        if(num < 3){
            var oneCardnum = 0;
            for(var Jnum =0 ;Jnum<3;Jnum++){
                if(this.flagOne[Jnum]>0){
                    oneCardnum = oneCardnum+1;
                }
            }
            if(oneCardnum < 3){//头墩有地方没有
                var nCount = oneCardnum;
                for(var pCard =0;pCard<13;pCard++){

                    if(this.flagAll[pCard] ==1 && nCount<3){
                        var CardboxSize = this.Cardbox[nCount+3].getSize();
                        this.Card[pCard].x = this.Cardbox[nCount].x;
                        this.Card[pCard].y = this.Cardbox[nCount].y;
                        //this.Card[pCard].setScaleY(((CardboxSize.height) / (sizeCard.height)));
                        this.Card[pCard].setScale(0.89);
                        this.Card[pCard].setTouchEnabled(false);
                        this.flagAll[pCard] =2;
                        this.flagOne[nCount]=pCard+3;
                        this.Sendpoke[nCount]=this.pokecard[pCard];

                        //设置上墩层级
                        this.Card[pCard].setLocalZOrder(1000+nCount);

                        nCount = nCount+1;
                        this.nGourd = [0,0];
                        this.nPair = 0;
                        this.nThree = 0;
                        this.nTong = 0;
                        this.nIron = 0;
                        this.nFive = 0;
                        this.nDPair = [0,0];
                        this.nShunPosition = [0,0,0,0,0];
                        this.nPosition = [0,0,0,0,0];
                        this.nTShun = [];
                        this.nTShunPosition = [];
                    }
                    if(this.flagOne[nCount] ==1){
                        nCount = nCount+1;
                    }
                }
            }
        }
        else if(num>=3 && num<8){//中墩
            var oneCardnum = 0;
            for(var Jnum =3 ;Jnum<8;Jnum++){
                if(this.flagTwo[Jnum-3]>0){
                    oneCardnum = oneCardnum+1;
                }
            }
            if(oneCardnum <5){
                var nCount = oneCardnum;
                cc.log('***num='+nCount);
                for(var pCard =0;pCard<13;pCard++){
                    if(this.flagAll[pCard] ==1 && nCount<5){
                        var CardboxSize = this.Cardbox[nCount+8].getSize();
                        this.Card[pCard].x = this.Cardbox[nCount+3].x;
                        this.Card[pCard].y = this.Cardbox[nCount+3].y;
                        //this.Card[pCard].setScaleY(((CardboxSize.height) / (sizeCard.height)));
                        this.Card[pCard].setScale(0.89);
                        this.Card[pCard].setTouchEnabled(false);
                        this.flagAll[pCard] =2;
                        this.flagTwo[nCount]=pCard+3;
                        this.Sendpoke[nCount+3]=this.pokecard[pCard];

                        //设置中墩层级
                        this.Card[pCard].setLocalZOrder(1000+nCount + 3);
                        nCount = nCount+1;
                        this.nGourd = [0,0];
                        this.nPair = 0;
                        this.nThree = 0;
                        this.nTong = 0;
                        this.nIron = 0;
                        this.nFive = 0;
                        this.nDPair = [0,0];
                        this.nShunPosition = [0,0,0,0,0];
                        this.nPosition = [0,0,0,0,0];
                        this.nTShun = [];
                        this.nTShunPosition = [];
                    }
                    if(this.flagTwo[nCount] ==1){
                        nCount = nCount+1;
                    }
                }
            }
        }
        else if(num>=8){
            var oneCardnum = 0;
            for(var Jnum =8 ;Jnum<13;Jnum++){
                if(this.flagThree[Jnum-8]>0){
                    oneCardnum = oneCardnum+1;
                }
                cc.log('1***oneCardnum='+oneCardnum);
            }
            if(oneCardnum <5){
                for(var pCard =0;pCard<13;pCard++){
                    if(this.flagAll[pCard] ==1 && oneCardnum<5){
                        var CardboxSize = this.Cardbox[oneCardnum].getSize();
                        this.Card[pCard].x = this.Cardbox[oneCardnum+8].x;
                        this.Card[pCard].y = this.Cardbox[oneCardnum+8].y;
                        //this.Card[pCard].setScaleY(((CardboxSize.height) / (sizeCard.height)));
                        this.Card[pCard].setScale(0.89);
                        this.Card[pCard].setTouchEnabled(false);
                        this.flagAll[pCard] =2;
                        this.flagThree[oneCardnum]=pCard+3;
                        this.Sendpoke[oneCardnum+8]=this.pokecard[pCard];

                        //设置下墩层级
                        this.Card[pCard].setLocalZOrder(1000+oneCardnum + 8);

                        oneCardnum = oneCardnum+1;
                        this.nGourd = [0,0];
                        this.nPair = 0;
                        this.nThree = 0;
                        this.nTong = 0;
                        this.nIron = 0;
                        this.nFive = 0;
                        this.nDPair = [0,0];
                        this.nShunPosition = [0,0,0,0,0];
                        this.nPosition = [0,0,0,0,0];
                        this.nTShun = [];
                        this.nTShunPosition = [];
                    }
                }
            }
        }

        this.Panel_sure.setVisible(true);
        this.Btn_sure.setTouchEnabled(true);
        this.Btn_cancel.setTouchEnabled(true);
        this.Panel_cardkind.setVisible(false);
    },
    //最优算法遍历
    AlgorithmTraversal:function () {

        //有没有五同
        if(this.onSetWuTongUp(1)==true){
            this.onSetWuTongUp(0);

            if(this.getFlagCount(3) == 5){
                this.bJudgeTouchUpPour(8);
                this.setCardInUpGroup(8);

                this.AlgorithmTraversal();
                return;
            }
            else if(this.getFlagCount(2) == 5){
                this.bJudgeTouchUpPour(3);
                this.setCardInUpGroup(3);

                this.AlgorithmTraversal();
            }
        }
        //有没有同花顺
        this.nTShun = [];
        this.nTShunPosition = [];
        this.nTonghuashun = 0;
        this.nShunNum = 0;
        this.nShunPosition = [0,0,0,0,0];
        this.nPosition = [0,0,0,0,0];
        if(this.onSetTonghuaShunUp(1)==true){
            this.onSetTonghuaShunUp(0);

            if(this.getFlagCount(3) == 5){
                this.bJudgeTouchUpPour(8);
                this.setCardInUpGroup(8);

                this.AlgorithmTraversal();
            }
            else if(this.getFlagCount(2) == 5){
                this.bJudgeTouchUpPour(3);
                this.setCardInUpGroup(3);

                this.AlgorithmTraversal();
            }
        }
        //有没有铁枝
        if(this.onSetIronUp(1)==true){
            this.onSetIronUp(0);

            if(this.getFlagCount(3) >= 4){
                this.bJudgeTouchUpPour(8);
                this.setCardInUpGroup(8);

                this.AlgorithmTraversal();
            }
            else if(this.getFlagCount(2) >= 4){
                this.bJudgeTouchUpPour(3);
                this.setCardInUpGroup(3);

                this.AlgorithmTraversal();
            }
        }
        //有没有葫芦
        this.nGourd = [0,0];
        if(this.onSetGourdUp(1)==true){
            this.onSetGourdUp(0);

            if(this.getFlagCount(3) == 5){
                this.bJudgeTouchUpPour(8);
                this.setCardInUpGroup(8);

                this.AlgorithmTraversal();
            }
            else if(this.getFlagCount(2) == 5){
                this.bJudgeTouchUpPour(3);
                this.setCardInUpGroup(3);

                this.AlgorithmTraversal();
            }
        }
        //有没有同花
        if(this.onSetTonghuaUP(1)==true){
            this.onSetTonghuaUP(0);

            if(this.getFlagCount(3) == 5){
                this.bJudgeTouchUpPour(8);
                this.setCardInUpGroup(8);

                this.AlgorithmTraversal();
            }
            else if(this.getFlagCount(2) == 5){
                this.bJudgeTouchUpPour(3);
                this.setCardInUpGroup(3);

                this.AlgorithmTraversal();
            }
        }
        //有没有顺子
        if(this.onSetShunziUp(1) == true){
            this.onSetShunziUp(0);

            if(this.getFlagCount(3) == 5){
                this.bJudgeTouchUpPour(8);
                this.setCardInUpGroup(8);

                this.AlgorithmTraversal();
            }
            else if(this.getFlagCount(2) == 5){
                this.bJudgeTouchUpPour(3);
                this.setCardInUpGroup(3);

                this.AlgorithmTraversal();
            }
        }
        //有没有三条
        if(this.onSetThreeUp(1)== true){
            this.onSetThreeUp(0);

            if(this.getFlagCount(3) >= 3){
                this.bJudgeTouchUpPour(8);
                this.setCardInUpGroup(8);

                this.AlgorithmTraversal();
            }
            else if(this.getFlagCount(2) >= 3){
                this.bJudgeTouchUpPour(8);
                this.setCardInUpGroup(3);

                this.AlgorithmTraversal();
            }
        }
        //有没有两对
        if(this.onSetDoublePairUp(1)==true){//判断有没有两对
            this.onSetDoublePairUp(0);

            if(this.getFlagCount(3) >= 4){
                this.bJudgeTouchUpPour(8);
                this.setCardInUpGroup(8);

                this.AlgorithmTraversal();
            }
            else if(this.getFlagCount(2) >= 4){
                this.bJudgeTouchUpPour(3);
                this.setCardInUpGroup(3);

                this.AlgorithmTraversal();
            }
        }
        //有没有对子
        if(this.onSetPairUp(1) == true){//判断有没有对子
            this.onSetPairUp(0);

            if(this.getFlagCount(3) >= 2){
                this.bJudgeTouchUpPour(8);
                this.setCardInUpGroup(8);

                this.AlgorithmTraversal();
            }
            else if(this.getFlagCount(2) >= 2){
                this.bJudgeTouchUpPour(3);
                this.setCardInUpGroup(3);

                this.AlgorithmTraversal();
            }
        }
        //单张另外处理
        for(var num = 0;num < 13;num++){
            if(this.flagAll[num] == 0){
                this.flagAll[num] = 1;
                break;
            }
        }

        if(this.getFlagCount(1) >= 1){
            this.bJudgeTouchUpPour(1);
            this.setCardInUpGroup(1);

            this.AlgorithmTraversal();
        }
        else if(this.getFlagCount(2) >= 1){
            this.bJudgeTouchUpPour(3);
            this.setCardInUpGroup(3);

            this.AlgorithmTraversal();
        }
        else if(this.getFlagCount(3) >= 1){
            this.bJudgeTouchUpPour(8);
            this.setCardInUpGroup(8);

            this.AlgorithmTraversal();
        }
    },
    //自动摆牌调用
    onSetAutoCard:function () {
        cc.log("自动摆牌牌组 this.Sendpoke= " + JSON.stringify(this.pokecard));

        if(this.Image_errRule.isVisible()){
            this.Image_errRule.setVisible(false);
        }

        //牌组清空
        this.Sendpoke = [0,0,0,0,0,0,0,0,0,0,0,0,0];
        //牌的弹起
        for(var num = 0;num<this.nPockerMax;num++){
            // if(this.flagAll[num]<2){
            //     this.Card[num].y = (this.cardboxSize.height*0.6)+20;
            //     this.flagAll[num]=1;
            // }
            this.flagAll[num]=0;
        }

        //上面内容清空
        for(var num =0 ;num<3;num++){
            if(this.flagOne[num]>0){
                this.flagOne[num] = 0;
            }
        }
        for(var num =0 ;num<5;num++){
            if(this.flagTwo[num]>0){
                this.flagTwo[num] = 0;
            }
            if(this.flagThree[num]>0){
                this.flagThree[num] = 0;
            }
        }

        //排序出所有牌
        cc.log("1."+this.getFlagUpAllCount());
        //while (this.getFlagUpAllCount() == 0/*this.getFlagUpAllCount() >= 0 && this.getFlagAllCount() < 13*/){
        if(this.getFlagUpAllCount() == 0){
            cc.log("2.");
            this.AlgorithmTraversal();
        }
    },
    //特殊牌调用
    onSetSpecialCard:function(){
        cc.log("go this.nSpecial="+this.nSpecial);

//		//三同花
//		if(this.nSpecial == 11){
//			for(var num = 0;num<3;num++){
//				if(this.flagAll[this.santonghuaP[num]]<2){
//					cc.log("go this.santonghuaP[num]="+this.santonghuaP[num]);
//					this.Card[this.santonghuaP[num]].y = (this.cardboxSize.height*0.6)+20;
//					this.flagAll[this.santonghuaP[num]]=1;
//				}
//			}
//			this.onSetCardonSpecial(2);
//			for(var num = 3;num<8;num++){
//				if(this.flagAll[this.santonghuaP[num]]<2){
//					cc.log("go this.santonghuaP[num]="+this.santonghuaP[num]);
//					this.Card[this.santonghuaP[num]].y = (this.cardboxSize.height*0.6)+20;
//					this.flagAll[this.santonghuaP[num]]=1;
//				}
//			}
//			this.onSetCardonSpecial(3);
//			for(var num = 8;num<13;num++){
//				if(this.flagAll[this.santonghuaP[num]]<2){
//					this.Card[this.santonghuaP[num]].y = (this.cardboxSize.height*0.6)+20;
//					this.flagAll[this.santonghuaP[num]]=1;
//				}
//			}
//			this.onSetCardonSpecial(8);
//		}

        //三同花顺
        if(this.nSpecial == 17){
            for(var num = 0;num<3;num++){
                if(this.flagAll[this.santonghuashunP[num]]<2){
                    this.Card[this.santonghuashunP[num]].y = (this.cardboxSize.height*0.6)+20;
                    this.flagAll[this.santonghuashunP[num]]=1;
                }
            }
            this.onSetCardonSpecial(2);
            for(var num = 3;num<8;num++){
                if(this.flagAll[this.santonghuashunP[num]]<2){
                    cc.log("go this.santonghuashunP[num]="+this.santonghuashunP[num]);
                    this.Card[this.santonghuashunP[num]].y = (this.cardboxSize.height*0.6)+20;
                    this.flagAll[this.santonghuashunP[num]]=1;
                }
            }
            this.onSetCardonSpecial(3);
            for(var num = 8;num<13;num++){
                if(this.flagAll[this.santonghuashunP[num]]<2){
                    this.Card[this.santonghuashunP[num]].y = (this.cardboxSize.height*0.6)+20;
                    this.flagAll[this.santonghuashunP[num]]=1;
                }
            }
            this.onSetCardonSpecial(8);
        }
        //如果不是三同花顺      /* 或  三同花*/
        if(this.nSpecial!=17 /*&& this.nSpecial!=11*/){

            for(var num = 0;num<13;num++){
                if(this.flagAll[num]<2){
                    this.Card[num].y = (this.cardboxSize.height*0.6)+20;
                    this.flagAll[num]=1;
                }
            }
            //如果是至尊青龙 一条龙 三炸弹 四套三条 六对半  （ 三皇五帝 十二皇族 全大全小 凑一色 五对三条）
            if(this.nSpecial == 23 || this.nSpecial ==22 || this.nSpecial ==21 || this.nSpecial ==20 || this.nSpecial ==12 ||
                this.nSpecial ==19 || this.nSpecial == 18||	this.nSpecial ==15 || this.nSpecial ==16 || this.nSpecial ==13 || this.nSpecial ==14	){
                this.onSetCardonSpecial(2);
                this.onSetCardonSpecial(3);
                this.onSetCardonSpecial(8);
            }
            else{//三顺子  三同花

                this.onSetCardonSpecial(2);
                this.onSetCardonSpecial(3);
                this.onSetCardonSpecial(8);

            }
        }

        cc.log("this.specialflagAll="+JSON.stringify(this.flagAll))
    },
    ////////////////特殊牌型//////////////////
	//特殊牌型
	onGetSpecialcard:function(bCardData,bCardCount){
		if(bCardCount!=13 || bCardData == null){
			return false;
		}	
		var AnalyseData = SceneAnalyseCard.getInstance().AnalyseCard(bCardData,bCardCount);
		cc.log("AnalyseData = " + JSON.stringify(AnalyseData));		
		var TwelveKing=false;
		var btSpecialCard = [];
		//至尊清龙
		if(13==AnalyseData.bOneCount&&true==AnalyseData.bStraight){
			
			return 23;
		}
		//一条龙
		if(13==AnalyseData.bOneCount){ 
			return 22;
		}
			
		var cardspec = [];
		for(var num  = 0;num<13;num++){
			cardspec[12-num] = bCardData[num];
		}	
		if(true == this.onSetThreeTonghuashunUp(cardspec)){
			return 17;
		}
        //三同花顺
		var btCardData = [0,0,0,0,0,0,0,0,0,0,0,0,0];
		var RbtCardData = [0,0,0,0,0,0,0,0,0,0,0,0,0];
		btCardData = bCardData;
		
		var StraightFlush1=false;
		var StraightFlush2=false;
		var StraightFlush3=false;		
		var StraightFlush=1;
		var Number=0;
		var Count1=0;
		var Count2=0;
		var Count3=0;
		
		var FCardData=btCardData[0]%16;
		var SColor=parseInt(btCardData[0]/16);
		
		RbtCardData[Number++]=btCardData[0];
		
		for(var i=1;i<13;i++)
		{
			if(FCardData==((btCardData[i]%16)+1)&&SColor==parseInt(btCardData[i]/16))
			{
				StraightFlush++;  
				FCardData=btCardData[i]%16;
				RbtCardData[Number++]=btCardData[i];
			}
			
			if(FCardData!=((btCardData[i]%16)+1)&&SColor==parseInt(btCardData[i]/16))
			{
				if(3==StraightFlush)
				{
					StraightFlush1=true;
					Count1=3;
					var temp = SceneAnalyseCard.getInstance().RemoveCard(RbtCardData,3,btCardData,13);
					if(temp!=false){
						btCardData = temp;
					}
					RbtCardData = [0,0,0,0,0,0,0,0,0,0,0,0,0];
				}
				break;
			}
			if(5==StraightFlush)
			{
				StraightFlush1=true;
				Count1=5;
				var temp = SceneAnalyseCard.getInstance().RemoveCard(RbtCardData,5,btCardData,13);
				if(temp!=false){
					btCardData = temp;
				}
				RbtCardData = [0,0,0,0,0,0,0,0,0,0,0,0,0];
				break;
			}
		}
		
		if(StraightFlush1)
		{
			StraightFlush=1;
			Number=0;
			FCardData=btCardData[0]%16;
			SColor=parseInt(btCardData[0]/16);
			RbtCardData[Number++]=btCardData[0];
			for(var i=1;i<13-Count1;i++)
			{
				if((FCardData==(btCardData[i]%16)+1)&&(SColor==parseInt(btCardData[i]/16)))
				{
					StraightFlush++;
					FCardData=btCardData[i]%16;
					RbtCardData[Number++]=btCardData[i];
				}
				if(FCardData!=((btCardData[i]%16)+1)&&FCardData!=btCardData[i]%16)
				{
					if(3==StraightFlush)
					{
						StraightFlush1=true;
						Count2=3;
						var temp = SceneAnalyseCard.getInstance().RemoveCard(RbtCardData,3,btCardData,13-Count1);
						if(temp!=false){
							btCardData = temp;
						}
						RbtCardData = [0,0,0,0,0,0,0,0,0,0,0,0,0];
					}
					break;
				}
				if(5==StraightFlush)
				{
					StraightFlush2=true;
					Count2=5;
					var temp = SceneAnalyseCard.getInstance().RemoveCard(RbtCardData,5,btCardData,13-Count1);
					if(temp!=false){
						btCardData = temp;
					}
					RbtCardData = [0,0,0,0,0,0,0,0,0,0,0,0,0];
					break;
				}
			}
		}
		
		if(StraightFlush2)
		{
			StraightFlush=1;
			Number=0;
			FCardData=btCardData[0]%16;
			SColor=parseInt(btCardData[0]/16);
			RbtCardData[Number++]=btCardData[0];
			for(var i=1;i<13-Count1-Count2;i++)
			{
				if((FCardData==(btCardData[i]%16)+1)&&SColor==parseInt(btCardData[i]/16))
				{
					StraightFlush++;
					FCardData=btCardData[i]%16;
					RbtCardData[Number++]=btCardData[i];
				}
				if((FCardData!=(btCardData[i]%16)+1)&&(FCardData!=btCardData[i]%16))
				{
					if(3==StraightFlush)
					{
						StraightFlush1=true;
						Count3=3;
						var temp = SceneAnalyseCard.getInstance().RemoveCard(RbtCardData,3,btCardData,13-Count1-Count2);
						if(temp!=false){
							btCardData = temp;
						}
						RbtCardData = [0,0,0,0,0,0,0,0,0,0,0,0,0];
					}
					break;
				}
				if(5==StraightFlush)
				{
					StraightFlush3=true;
					Count3=5;
					var temp = SceneAnalyseCard.getInstance().RemoveCard(RbtCardData,5,btCardData,13-Count1-Count2);
					if(temp!=false){
						btCardData = temp;
					}
					RbtCardData = [0,0,0,0,0,0,0,0,0,0,0,0,0];
					break;
				}
			}
		}
		if(StraightFlush1&&StraightFlush2&&StraightFlush3&&Count1+Count2+Count3==13)
		{
			return 17;//疑惑点
		}
		
		//四套三条
		if(4==AnalyseData.bThreeCount)
		{
			return 21;
		}
		
		//三炸弹 
		if(3==AnalyseData.bFourCount)
		{
			return 20;
		}

		// //用于加一色
        // //三皇五帝
		// if(2 == AnalyseData.bFiveCount && 1 == AnalyseData.bThreeCount){
		// 	return 19;
		// }
        // //十二皇族
		// var hzCardData = [0,0,0,0,0,0,0,0,0,0,0,0,0];
		// hzCardData = bCardData;
		// var hzCardCount = 0;
		// for(var i=0;i<13;i++)
		// {
		// 	//花色为 JQKA
		// 	if((bCardData[i]%16) == 1 || (bCardData[i]%16) > 10 )
		// 	{
		// 		hzCardCount++;
		// 	}
		// }
		// if(hzCardCount == 13){
		// 	return 18;
		// }
        // //全大
		// var qdCardData = [0,0,0,0,0,0,0,0,0,0,0,0,0];
		// qdCardData = bCardData;
		// var qdCardCount = 0;
        //
		// for(var i=0;i<13;i++)
		// {
		// 	//十三张牌数字都为8—A
		// 	if((bCardData[i]%16) == 1 || (bCardData[i]%16) >= 8 )
		// 	{
		// 		qdCardCount++;
		// 	}
		// }
		// if(qdCardCount == 13){
		// 	return 16;
		// }
        // //全小
		// var qxCardData = [0,0,0,0,0,0,0,0,0,0,0,0,0];
		// qxCardData = bCardData;
		// var qxCardCount = 0;
        //
		// for(var i=0;i<13;i++)
		// {
		// 	//十三张牌数字都为2—8
		// 	if((bCardData[i]%16) >= 2 && (bCardData[i]%16) <= 8 )
		// 	{
		// 		qxCardCount++;
		// 	}
		// }
		// if(qxCardCount == 13){
		// 	return 15;
		// }
        // //凑一色
		// var ysCardData = [0,0,0,0,0,0,0,0,0,0,0,0,0];
		// ysCardData = bCardData;
		// var ysCardCount=0;
		// var SColor=parseInt(bCardData[0]/16)%2;
		// for(var i=1;i<13;i++)
		// {
		// 	//如果花色都为黑或红
		// 	if(SColor==parseInt(bCardData[i]/16)%2)
		// 	{
		// 		ysCardCount++;
		// 	}
		// }
		// if(ysCardCount == 12){
		// 	return 14;
		// }
        //
        // //五对三条
		// if(5 ==AnalyseData.bTwoCount && 1 ==AnalyseData.bThreeCount)
		// {
		// 	return 13;
		// }
		//六对半
		if(6==AnalyseData.bTwoCount||(4==AnalyseData.bTwoCount&&1==AnalyseData.bFourCount)||(2==AnalyseData.bTwoCount&&2==AnalyseData.bFourCount)
				||(3==AnalyseData.bFourCount))
		{
			return 12;
		}
		
		//三同花
		var Flush1=false;
		var Flush2=false;
		var Flush3=false;
		Flush=1;
		Count1=0;
		Count2=0;
		Count3=0;
		Number=0;
		RbtCardData = [0,0,0,0,0,0,0,0,0,0,0,0,0];
		btCardData = bCardData;//CopyMemory(btCardData,bCardData,sizeof(btCardData));
		RbtCardData[Number++]=btCardData[0];
		SColor=parseInt(btCardData[0]/16);
		for(var i=1;i<13;i++)
		{
			if(SColor==parseInt(btCardData[i]/16))
			{
				Flush++;
				RbtCardData[Number++]=btCardData[i];
			}
			if(3==Flush&&i==12)
			{
				Flush1=true;
				Count1=3;
				btSpecialCard[10]=RbtCardData[0];
				btSpecialCard[11]=RbtCardData[1];
				btSpecialCard[12]=RbtCardData[2];
				
				var temp = SceneAnalyseCard.getInstance().RemoveCard(RbtCardData,3,btCardData,13);
				if(temp!=false){
					btCardData = temp;
				}
				RbtCardData = [0,0,0,0,0,0,0,0,0,0,0,0,0];
				break;
			}
			if(5==Flush)
			{
				Flush1=true;
				Count1=5;
				btSpecialCard[5]=RbtCardData[0];
				btSpecialCard[6]=RbtCardData[1];
				btSpecialCard[7]=RbtCardData[2];
				btSpecialCard[8]=RbtCardData[3];
				btSpecialCard[9]=RbtCardData[4];

				var temp = SceneAnalyseCard.getInstance().RemoveCard(RbtCardData,5,btCardData,13);
				if(temp!=false){
					btCardData = temp;
				}
				RbtCardData = [0,0,0,0,0,0,0,0,0,0,0,0,0];
				break;
			}
		}
		if(Flush1)
		{
			Flush=1;
			Number=0;
			RbtCardData[Number++]=btCardData[0];
			SColor=parseInt(btCardData[0]/16);
			for(var i=1;i<13-Count1;i++)
			{
				if(SColor==parseInt(btCardData[i]/16))
				{
					Flush++;
					RbtCardData[Number++]=btCardData[i];
				}
				if(3==Flush&&i==13-Count1-1&&Count1!=3)
				{
					Flush2=true;
					Count2=3;
					btSpecialCard[10]=RbtCardData[0];
					btSpecialCard[11]=RbtCardData[1];
					btSpecialCard[12]=RbtCardData[2];
					var temp = SceneAnalyseCard.getInstance().RemoveCard(RbtCardData,3,btCardData,13-Count1);
					if(temp!=false){
						btCardData = temp;
					}
					RbtCardData = [0,0,0,0,0,0,0,0,0,0,0,0,0];
					break;
				}
				if(5==Flush)
				{
					Flush2=true;
					Count2=5;
					if(Count1==5)
					{
						btSpecialCard[0]=RbtCardData[0];
						btSpecialCard[1]=RbtCardData[1];
						btSpecialCard[2]=RbtCardData[2];
						btSpecialCard[3]=RbtCardData[3];
						btSpecialCard[4]=RbtCardData[4];
					}
					else if(Count1==3)
					{
						btSpecialCard[5]=RbtCardData[0];
						btSpecialCard[6]=RbtCardData[1];
						btSpecialCard[7]=RbtCardData[2];
						btSpecialCard[8]=RbtCardData[3];
						btSpecialCard[9]=RbtCardData[4];
					}

					var temp = SceneAnalyseCard.getInstance().RemoveCard(RbtCardData,5,btCardData,13-Count1);
					if(temp!=false){
						btCardData = temp;
					}
					RbtCardData = [0,0,0,0,0,0,0,0,0,0,0,0,0];
					break;
				}
			}
		}
		if(Flush2)
		{
			Flush=1;
			Number=0;
			RbtCardData[Number++]=btCardData[0];
			SColor=parseInt(btCardData[0]/16);
			for(var i=1;i<13-Count1-Count2;i++)
			{
				if(SColor==parseInt(btCardData[i]/16))
				{
					Flush++;
					RbtCardData[Number++]=btCardData[i];
				}
				if(3==Flush&&i==13-Count1-Count2-1&&Count1!=3&&Count2!=3)
				{
					Flush3=true;
					Count3=3;
					btSpecialCard[10]=RbtCardData[0];
					btSpecialCard[11]=RbtCardData[1];
					btSpecialCard[12]=RbtCardData[2];
					var temp = SceneAnalyseCard.getInstance().RemoveCard(RbtCardData,3,btCardData,13-Count1-Count2);
					if(temp!=false){
						btCardData = temp;
					}
					RbtCardData = [0,0,0,0,0,0,0,0,0,0,0,0,0];
					break;
				}
				if(5==Flush)
				{
					Flush3=true;
					Count3=5;
					btSpecialCard[0]=RbtCardData[0];
					btSpecialCard[1]=RbtCardData[1];
					btSpecialCard[2]=RbtCardData[2];
					btSpecialCard[3]=RbtCardData[3];
					btSpecialCard[4]=RbtCardData[4];
					var temp = SceneAnalyseCard.getInstance().RemoveCard(RbtCardData,5,btCardData,13-Count1-Count2);
					if(temp!=false){
						btCardData = temp;
					}
					RbtCardData = [0,0,0,0,0,0,0,0,0,0,0,0,0];
					break;
				}
			}
		}
		if(Flush1&&Flush2&&Flush3&&Count1+Count2+Count3==13)
		{
			return 11;//三同花
		}
		
		//三顺子
		var nCount=0;
		while(nCount<4)
		{
			nCount++;
			var Straight1=false;
			var Straight2=false;
			var Straight3=false;
			var Straight=1;
			Count1=0;
			Count2=0;
			Count3=0;
			Number=0;
			RbtCardData = [0,0,0,0,0,0,0,0,0,0,0,0,0];
			btCardData = bCardData;
			
			RbtCardData[Number++]=btCardData[0];
			FCardData=btCardData[0]%16;
			for(var i=1;i<13;i++)
			{
				if(FCardData==(btCardData[i]%16+1)||(FCardData==14&&(btCardData[i]%16)==5)||(FCardData==14&&(btCardData[i]%16)==3))
				{
					Straight++;
					RbtCardData[Number++]=btCardData[i];
					FCardData=btCardData[i]%16;

				}
				else if(FCardData!=btCardData[i]%16)
				{
					if(3==Straight)
					{
						Straight1=true;
						Count1=3;
						btSpecialCard[10]=RbtCardData[0];
						btSpecialCard[11]=RbtCardData[1];
						btSpecialCard[12]=RbtCardData[2];
						var temp = SceneAnalyseCard.getInstance().RemoveCard(RbtCardData,3,btCardData,13);
						if(temp!=false){
							btCardData = temp;
						}
						RbtCardData=[0,0,0,0,0,0,0,0,0,0,0,0,0];
						break;
					}
					Straight=1;
					Number=0;
					FCardData=btCardData[i]%16;
					RbtCardData[Number++]=btCardData[i];

				}
				if(nCount==0||nCount==1)
				{
					if(i==12&&3==Straight)
					{

						Straight1=true;
						Count1=3;
						btSpecialCard[10]=RbtCardData[0];
						btSpecialCard[11]=RbtCardData[1];
						btSpecialCard[12]=RbtCardData[2];					
						var temp = SceneAnalyseCard.getInstance().RemoveCard(RbtCardData,3,btCardData,13);
						if(temp!=false){
							btCardData = temp;
						}
						RbtCardData=[0,0,0,0,0,0,0,0,0,0,0,0,0];
						break;

					}
				}
				else if(nCount==2||nCount==3)
				{
					if(3==Straight)
					{

						Straight1=true;
						Count1=3;
						btSpecialCard[10]=RbtCardData[0];
						btSpecialCard[11]=RbtCardData[1];
						btSpecialCard[12]=RbtCardData[2];
						var temp = SceneAnalyseCard.getInstance().RemoveCard(RbtCardData,3,btCardData,13);
						if(temp!=false){
							btCardData = temp;
						}
						RbtCardData=[0,0,0,0,0,0,0,0,0,0,0,0,0];
						break;
					}
				}
				if(5==Straight)
				{
					Straight1=true;
					Count1=5;
					btSpecialCard[5]=RbtCardData[0];
					btSpecialCard[6]=RbtCardData[1];
					btSpecialCard[7]=RbtCardData[2];
					btSpecialCard[8]=RbtCardData[3];
					btSpecialCard[9]=RbtCardData[4];
					var temp = SceneAnalyseCard.getInstance().RemoveCard(RbtCardData,5,btCardData,13);
					if(temp!=false){
						btCardData = temp;
					}
					RbtCardData=[0,0,0,0,0,0,0,0,0,0,0,0,0];
					break;

				}
			}
			if(Straight1)
			{
				Straight=1;
				Number=0;
				RbtCardData[Number++]=btCardData[0];
				FCardData=btCardData[0]%16;
				for(var i=1;i<13-Count1;i++)
				{
					if(FCardData==((btCardData[i]%16)+1)||(FCardData==14&&(btCardData[i]%16)==5)||(FCardData==14&&(btCardData[i]%16)==3))
					{
						Straight++;
						RbtCardData[Number++]=btCardData[i];
						FCardData=btCardData[i]%16;

					}
					else if(FCardData!=btCardData[i]%16)
					{
						if(3==Straight&&Count1!=3)
						{
							Straight2=true;
							Count2=3;
							btSpecialCard[10]=RbtCardData[0];
							btSpecialCard[11]=RbtCardData[1];
							btSpecialCard[12]=RbtCardData[2];
							var temp = SceneAnalyseCard.getInstance().RemoveCard(RbtCardData,3,btCardData,13-Count1);
							if(temp!=false){
								btCardData = temp;
							}
							RbtCardData=[0,0,0,0,0,0,0,0,0,0,0,0,0];
							break;
						}
						Straight=1;
						Number=0;
						FCardData=btCardData[i]%16;
						RbtCardData[Number++]=btCardData[i];
					}
					if(nCount==0||nCount==2)
					{
						if(i==13-Count1-1&&3==Straight&&Count1!=3)
						{
							Straight2=true;
							Count2=3;
							btSpecialCard[10]=RbtCardData[0];
							btSpecialCard[11]=RbtCardData[1];
							btSpecialCard[12]=RbtCardData[2];
							var temp = SceneAnalyseCard.getInstance().RemoveCard(RbtCardData,3,btCardData,13-Count1);
							if(temp!=false){
								btCardData = temp;
							}
							RbtCardData=[0,0,0,0,0,0,0,0,0,0,0,0,0];
							break;

						}
					}
					else if(nCount==1||nCount==3)
					{
						if(3==Straight&&Count1!=3)
						{
							Straight2=true;
							Count2=3;
							btSpecialCard[10]=RbtCardData[0];
							btSpecialCard[11]=RbtCardData[1];
							btSpecialCard[12]=RbtCardData[2];
							var temp = SceneAnalyseCard.getInstance().RemoveCard(RbtCardData,3,btCardData,13-Count1);
							if(temp!=false){
								btCardData = temp;
							}
							RbtCardData=[0,0,0,0,0,0,0,0,0,0,0,0,0];
							break;

						}
					}
					if(5==Straight)
					{
						Straight2=true;
						Count2=5;
						if(Count1==5)
						{
							btSpecialCard[0]=RbtCardData[0];
							btSpecialCard[1]=RbtCardData[1];
							btSpecialCard[2]=RbtCardData[2];
							btSpecialCard[3]=RbtCardData[3];
							btSpecialCard[4]=RbtCardData[4];
						}
						else 
						{
							btSpecialCard[5]=RbtCardData[0];
							btSpecialCard[6]=RbtCardData[1];
							btSpecialCard[7]=RbtCardData[2];
							btSpecialCard[8]=RbtCardData[3];
							btSpecialCard[9]=RbtCardData[4];;
						}

						var temp = SceneAnalyseCard.getInstance().RemoveCard(RbtCardData,5,btCardData,13-Count1);
						if(temp!=false){
							btCardData = temp;
						}
						RbtCardData=[0,0,0,0,0,0,0,0,0,0,0,0,0];
						break;
					}
				}
			}
			if(Straight2)
			{
				Straight=1;
				Number=0;
//				SortCardList(btCardData,13-Count1-Count2);
				RbtCardData[Number++]=btCardData[0];
				FCardData=btCardData[0]%16;
				for(var i=1;i<13-Count1-Count2;i++)
				{
					if(FCardData==(btCardData[i]%16)+1||(FCardData==14&&(btCardData[i]%16)==3)||(FCardData==14&&(btCardData[i]%16)==5))
					{
						Straight++;
						RbtCardData[Number++]=btCardData[i];
						FCardData=btCardData[i]%16;
					}
					else if(FCardData!=btCardData[i]%16)
					{
						if(3==Straight&&Count1!=3&&Count2!=3)
						{
							Straight3=true;
							Count3=3;
							btSpecialCard[10]=RbtCardData[0];
							btSpecialCard[11]=RbtCardData[1];
							btSpecialCard[12]=RbtCardData[2];
							var temp = SceneAnalyseCard.getInstance().RemoveCard(RbtCardData,3,btCardData,13-Count1-Count2);
							if(temp!=false){
								btCardData = temp;
							}
							RbtCardData=[0,0,0,0,0,0,0,0,0,0,0,0,0];
							break;
						}
						Straight=1;
						Number=0;
						FCardData=btCardData[i]%16;
						RbtCardData[Number++]=btCardData[i];
					}
					if(i==13-Count1-Count2-1&&3==Straight&&Count1!=3&&Count2!=3)
					{
						Straight3=true;
						Count3=3;
						btSpecialCard[10]=RbtCardData[0];
						btSpecialCard[11]=RbtCardData[1];
						btSpecialCard[12]=RbtCardData[2];
						var temp = SceneAnalyseCard.getInstance().RemoveCard(RbtCardData,3,btCardData,13-Count1-Count2);
						if(temp!=false){
							btCardData = temp;
						}
						RbtCardData=[0,0,0,0,0,0,0,0,0,0,0,0,0];
						break;
					}
					if(5==Straight)
					{
						Straight3=true;
						Count3=5;
						btSpecialCard[0]=RbtCardData[0];
						btSpecialCard[1]=RbtCardData[1];
						btSpecialCard[2]=RbtCardData[2];
						btSpecialCard[3]=RbtCardData[3];
						btSpecialCard[4]=RbtCardData[4];
						var temp = SceneAnalyseCard.getInstance().RemoveCard(RbtCardData,5,btCardData,13-Count1-Count2);
						if(temp!=false){
							btCardData = temp;
						}
						RbtCardData=[0,0,0,0,0,0,0,0,0,0,0,0,0];
						break;
					}
				}
			}
			if(Straight1&&Straight2&&Straight3&&Count1+Count2+Count3==13)
			{
				return 10;
			}
		}
		
		return false;
	},
	//三顺子
	onSetThreeShunziUp : function(isHave) {
		for(var num = 0 ;num<13;num++){
			cc.log("判断三顺子="+this.pokecard[num]);
		}
		
		
		
	},
	//三同花
	onSetThreeTonghuaUp : function(cardData) {
		var colorone = parseInt(cardData[0]/16);
		this.santonghuaP = [0,0,0,0,0,0,0,0,0,0,0,0,0];
		var position = [];
		position[0] = 0;
		var nCount = 1;
		var nPeA = 0;
		
		for(var num = 1 ;num<13;num++){
			if(parseInt(cardData[num]/16)==colorone){
				position[nCount] = num;
				nCount++;
			}
		}

		if(nCount!=3 && nCount!=10 && nCount!=5 && nCount!=8){
			return false;
		}
		if(nCount == 3){
			this.santonghuaP[0]=position[0];
			this.santonghuaP[1]=position[1];
			this.santonghuaP[2]=position[2];
			var colortwo = 0;
			var positiontwo = [];
			var nCountwo = 0;
			for(var num = 1 ;num<13;num++){
				if(parseInt(cardData[num]/16)!=colorone){
					colortwo = parseInt(cardData[num]/16);
					nCountwo = 1;
					positiontwo[0] = num;
					break;
				}
			}
			for(var num = positiontwo[0]+1 ;num<13;num++){
				if(parseInt(cardData[num]/16)==colortwo){
					positiontwo[nCountwo] = num;
					nCountwo++;
				}
			}
			if((nCountwo!=5) && (nCountwo !=10)){
				return false;
			}
			else if(nCountwo == 5){
				this.santonghuaP[3]=positiontwo[0];
				this.santonghuaP[4]=positiontwo[1];
				this.santonghuaP[5]=positiontwo[2];
				this.santonghuaP[6]=positiontwo[3];
				this.santonghuaP[7]=positiontwo[4];
				var colorthree = 0;
				var positionthree = [];
				var nCounthree = 0;
				for(var num = positiontwo[0]+1 ;num<13;num++){
					if(parseInt(cardData[num]/16)!=colortwo && parseInt(cardData[num]/16)!=colorone){
						colorthree = parseInt(cardData[num]/16);
						nCounthree = 1;
						positionthree[0] = num;
						break;
					}
				}
				for(var num = positionthree[0]+1 ;num<13;num++){
					if(parseInt(cardData[num]/16)==colorthree){
						positionthree[nCounthree] = num;
						nCounthree++;
					}
				}
				if(nCounthree != 5){
					return false;
				}
				this.santonghuaP[8]=positionthree[0];
				this.santonghuaP[9]=positionthree[1];
				this.santonghuaP[10]=positionthree[2];
				this.santonghuaP[11]=positionthree[3];
				this.santonghuaP[12]=positionthree[4];
				return true;
			}
			else if(nCountwo ==10){
				this.santonghuaP[3]=positiontwo[0];
				this.santonghuaP[4]=positiontwo[1];
				this.santonghuaP[5]=positiontwo[2];
				this.santonghuaP[6]=positiontwo[3];
				this.santonghuaP[7]=positiontwo[4];
				this.santonghuaP[8]=positiontwo[5];
				this.santonghuaP[9]=positiontwo[6];
				this.santonghuaP[10]=positiontwo[7];
				this.santonghuaP[11]=positiontwo[8];
				this.santonghuaP[12]=positiontwo[9];
				return true;
			}
		}
		else if(nCount == 10){
			this.santonghuaP[3]=position[0];
			this.santonghuaP[4]=position[1];
			this.santonghuaP[5]=position[2];
			this.santonghuaP[6]=position[3];
			this.santonghuaP[7]=position[4];
			this.santonghuaP[8]=position[5];
			this.santonghuaP[9]=position[6];
			this.santonghuaP[10]=position[7];
			this.santonghuaP[11]=position[8];
			this.santonghuaP[12]=position[9];
			var colortwo = 0;
			var positiontwo = [];
			var nCountwo = 0;
			var nPeAtwo = 0;
			for(var num = 1 ;num<13;num++){
				if(parseInt(cardData[num]/16)!=colorone){
					colortwo = parseInt(cardData[num]/16);
					nCountwo = 1;
					positiontwo[0] = num;
					break;
				}
			}
			for(var num = positiontwo[0]+1 ;num<13;num++){
				if(parseInt(cardData[num]/16)==colortwo){
					positiontwo[nCountwo] = num;
					nCountwo++;
				}
			}

			if(nCountwo!=3){
				return false;
			}
			this.santonghuaP[0]=positiontwo[0];
			this.santonghuaP[1]=positiontwo[1];
			this.santonghuaP[2]=positiontwo[2];
			return true;
		}
		else if(nCount == 8){
			this.santonghuaP[0]=position[0];
			this.santonghuaP[1]=position[1];
			this.santonghuaP[2]=position[2];
			this.santonghuaP[3]=position[3];
			this.santonghuaP[4]=position[4];
			this.santonghuaP[5]=position[5];
			this.santonghuaP[6]=position[6];
			this.santonghuaP[7]=position[7];
			var colortwo = 0;
			var positiontwo = [];
			var nCountwo = 0;
			for(var num = 1 ;num<13;num++){
				if(parseInt(cardData[num]/16)!=colorone){
					colortwo = parseInt(cardData[num]/16);
					nCountwo = 1;
					positiontwo[0] = num;
					break;
				}
			}

			for(var num = positiontwo[0]+1 ;num<13;num++){
				if(parseInt(cardData[num]/16)==colortwo){
					positiontwo[nCountwo] = num;
					nCountwo++;
				}
			}

			if(nCountwo!=5){
				return false;
			}
			this.santonghuaP[8]=positiontwo[0];
			this.santonghuaP[9]=positiontwo[1];
			this.santonghuaP[10]=positiontwo[2];
			this.santonghuaP[11]=positiontwo[3];
			this.santonghuaP[12]=positiontwo[4];
			return true;

		}
		else if(nCount == 5){
			this.santonghuaP[8]=position[0];
			this.santonghuaP[9]=position[1];
			this.santonghuaP[10]=position[2];
			this.santonghuaP[11]=position[3];
			this.santonghuaP[12]=position[4];
			var colortwo = 0;
			var positiontwo = [];
			var nCountwo = 0;
			for(var num = 1 ;num<13;num++){
				if(parseInt(cardData[num]/16)!=colorone){
					colortwo = parseInt(cardData[num]/16);
					nCountwo = 1;
					positiontwo[0] = num;
					break;
				}
			}


			for(var num = positiontwo[0]+1 ;num<13;num++){
				if(parseInt(cardData[num]/16)==colortwo){
					positiontwo[nCountwo] = num;
					nCountwo++;
				}
			}

			if(nCountwo!=8 && nCountwo!=3 && nCountwo!=5){
				return false;
			}

			if(nCountwo == 8){
				this.santonghuaP[0]=positiontwo[0];
				this.santonghuaP[1]=positiontwo[1];
				this.santonghuaP[2]=positiontwo[2];
				this.santonghuaP[3]=positiontwo[3];
				this.santonghuaP[4]=positiontwo[4];
				this.santonghuaP[5]=positiontwo[5];
				this.santonghuaP[6]=positiontwo[6];
				this.santonghuaP[7]=positiontwo[7];
				return true;
			}

			if(nCountwo == 5){
				this.santonghuaP[3]=positiontwo[0];
				this.santonghuaP[4]=positiontwo[1];
				this.santonghuaP[5]=positiontwo[2];
				this.santonghuaP[6]=positiontwo[3];
				this.santonghuaP[7]=positiontwo[4];
				var colorthree = 0;
				var positionthree = [];
				var nCounthree = 0;
				for(var num = positiontwo[0]+1 ;num<13;num++){
					if(parseInt(cardData[num]/16)!=colortwo && parseInt(cardData[num]/16)!=colorone){
						colorthree = parseInt(cardData[num]/16);
						nCounthree = 1;
						positionthree[0] = num;
						break;
					}
				}

				for(var num = positionthree[0]+1 ;num<13;num++){
					if(parseInt(cardData[num]/16)==colorthree){
						positionthree[nCounthree] = num;
						nCounthree++;
					}
				}
				if(nCounthree != 3){
					return false;
				}
				this.santonghuaP[0]=positionthree[0];
				this.santonghuaP[1]=positionthree[1];
				this.santonghuaP[2]=positionthree[2];
				return true;
			}

			if(nCountwo == 3){
				this.santonghuaP[0]=positiontwo[0];
				this.santonghuaP[1]=positiontwo[1];
				this.santonghuaP[2]=positiontwo[2];
				var colorthree = 0;
				var positionthree = [];
				var nCounthree = 0;
				for(var num = positiontwo[0]+1 ;num<13;num++){
					if(parseInt(cardData[num]/16)!=colortwo && parseInt(cardData[num]/16)!=colorone){
						colorthree = parseInt(cardData[num]/16);
						nCounthree = 1;
						positionthree[0] = num;
						break;
					}
				}

				for(var num = positionthree[0]+1 ;num<13;num++){
					if(parseInt(cardData[num]/16)==colorthree){
						positionthree[nCounthree] = num;
						nCounthree++;
					}
				}

				if(nCounthree != 5){
					return false;
				}
				this.santonghuaP[3]=positionthree[0];
				this.santonghuaP[4]=positionthree[1];
				this.santonghuaP[5]=positionthree[2];
				this.santonghuaP[6]=positionthree[3];
				this.santonghuaP[7]=positionthree[4];
				return true;
			}
		}

		return false;

	},
	//六对半
	onSetSixPairUp : function(isHave) {
	},
	//四套三条
	onSetFourSantiaoUp : function(isHave) {
	},
	//三分天下
	onSetSanFentianxiaUp : function(isHave) {
	},
	//三同花顺
	onSetThreeTonghuashunUp : function(cardData) {
		var colorone = parseInt(cardData[0]/16);
		this.santonghuashunP = [0,0,0,0,0,0,0,0,0,0,0,0,0];
		var position = [];
		position[0] = 0;
		var nCount = 1;
		var nPeA = 0;
		for(var num = 1 ;num<13;num++){
			var temp = (cardData[num]%16);
			
			if(cardData[position[0]]%16 == 2){
				for(var temp = position[0]+1;temp<13;temp++){
					if((cardData[temp]%16) == 14 && (parseInt(cardData[temp]/16)) == colorone){
						nPeA = temp;
					}
				}
			}
			
			if(((cardData[num]%16)-1 == cardData[position[nCount-1]]%16)&& (parseInt(cardData[num]/16)==colorone)){
				position[nCount] = num;
				nCount++;
			}
		}
		if(nPeA>0){
			position[nCount] = nPeA;
			nCount++;
		}
		if(nCount!=3 && nCount!=10 && nCount!=5 && nCount!=8){
			return false;
		}
		if(nCount == 3){
			this.santonghuashunP[0]=position[0];
			this.santonghuashunP[1]=position[1];
			this.santonghuashunP[2]=position[2];
			var colortwo = 0;
			var positiontwo = [];
			var nCountwo = 0;
			var nPeAtwo = 0;
			for(var num = 1 ;num<13;num++){
				if(parseInt(cardData[num]/16)!=colorone){
					colortwo = parseInt(cardData[num]/16);
					nCountwo = 1;
					positiontwo[0] = num;
					break;
				}
			}
			for(var num = positiontwo[0]+1 ;num<13;num++){
				
				if(cardData[positiontwo[0]]%16 == 2){
					for(var temps = positiontwo[0]+1;temps<13;temps++){
						if((cardData[temps]%16) == 14 && (parseInt(cardData[temps]/16)) == colortwo){
							nPeAtwo = temps;
						}
					}
				}
				
				var temp = cardData[num]%16-1;
				var sump = cardData[positiontwo[nCountwo -1]];
				if(((cardData[num]%16)-1 == cardData[positiontwo[nCountwo -1]]%16)&& (parseInt(cardData[num]/16)==colortwo)){
					positiontwo[nCountwo] = num;
					nCountwo++;
				}
			}
			if(nPeAtwo>0){
				positiontwo[nCountwo] = nPeAtwo;
				nCountwo++;
			}
			if((nCountwo!=5) && (nCountwo !=10)){
				return false;
			}
			else if(nCountwo == 5){
				this.santonghuashunP[3]=positiontwo[0];
				this.santonghuashunP[4]=positiontwo[1];
				this.santonghuashunP[5]=positiontwo[2];
				this.santonghuashunP[6]=positiontwo[3];
				this.santonghuashunP[7]=positiontwo[4];
				var colorthree = 0;
				var positionthree = [];
				var nCounthree = 0;
				var nPeAthree = 0;
				for(var num = positiontwo[0]+1 ;num<13;num++){
					if(parseInt(cardData[num]/16)!=colortwo && num != position[0] && num != position[1] && num != position[2]){
						colorthree = parseInt(cardData[num]/16);
						nCounthree = 1;
						positionthree[0] = num;
						break;
					}
				}
				if(cardData[positionthree[0]]%16 == 2){
					for(var temps = positionthree[0]+1;temps<13;temps++){
						if((cardData[temps]%16) == 14 && (parseInt(cardData[temps]/16)) == colortwo){
							nPeAthree = temps;
						}
					}
				}
				for(var num = positionthree[0]+1 ;num<13;num++){
					if(((cardData[num]%16)-1 == cardData[positionthree[positionthree.length -1]]%16)&& parseInt(cardData[num]/16)==colorthree){
						positionthree[nCounthree] = num;
						nCounthree++;
					}
				}
				if(nPeAthree>0){
					positionthree[nCounthree] = nPeAthree;
					nCounthree++;
				}
				if(nCounthree != 5){
					return false;
				}
				this.santonghuashunP[8]=positionthree[0];
				this.santonghuashunP[9]=positionthree[1];
				this.santonghuashunP[10]=positionthree[2];
				this.santonghuashunP[11]=positionthree[3];
				this.santonghuashunP[12]=positionthree[4];
				return true;
			}
			else if(nCountwo ==10){
				this.santonghuashunP[3]=positiontwo[0];
				this.santonghuashunP[4]=positiontwo[1];
				this.santonghuashunP[5]=positiontwo[2];
				this.santonghuashunP[6]=positiontwo[3];
				this.santonghuashunP[7]=positiontwo[4];
				this.santonghuashunP[8]=positiontwo[5];
				this.santonghuashunP[9]=positiontwo[6];
				this.santonghuashunP[10]=positiontwo[7];
				this.santonghuashunP[11]=positiontwo[8];
				this.santonghuashunP[12]=positiontwo[9];
				return true;
			}
		}
		else if(nCount == 10){
			this.santonghuashunP[3]=position[0];
			this.santonghuashunP[4]=position[1];
			this.santonghuashunP[5]=position[2];
			this.santonghuashunP[6]=position[3];
			this.santonghuashunP[7]=position[4];
			this.santonghuashunP[8]=position[5];
			this.santonghuashunP[9]=position[6];
			this.santonghuashunP[10]=position[7];
			this.santonghuashunP[11]=position[8];
			this.santonghuashunP[12]=position[9];
			var colortwo = 0;
			var positiontwo = [];
			var nCountwo = 0;
			var nPeAtwo = 0;
			for(var num = 1 ;num<13;num++){
				if(parseInt(cardData[num]/16)!=colorone){
					colortwo = parseInt(cardData[num]/16);
					nCountwo = 1;
					positiontwo[0] = num;
					break;
				}
			}
			
			if(cardData[positiontwo[0]]%16 == 2){
				for(var temps = positiontwo[0]+1;temps<13;temps++){
					if((cardData[temps]%16) == 14 && (parseInt(cardData[temps]/16)) == colortwo){
						nPeAtwo = temps;
					}
				}
			}
			
			for(var num = positiontwo[0]+1 ;num<13;num++){
				if(((cardData[num]%16)-1 == cardData[positiontwo[positiontwo.length -1]]%16)&& parseInt(cardData[num]/16)==colortwo){
					positiontwo[nCountwo] = num;
					nCountwo++;
				}
			}	
			
			if(nPeAtwo>0){
				positiontwo[nCountwo] = nPeAtwo;
				nCountwo++;
			}
			
			if(nCountwo!=3){
				return false;
			}
			this.santonghuashunP[0]=positiontwo[0];
			this.santonghuashunP[1]=positiontwo[1];
			this.santonghuashunP[2]=positiontwo[2];
			return true;
		}
		else if(nCount == 8){
			this.santonghuashunP[0]=position[0];
			this.santonghuashunP[1]=position[1];
			this.santonghuashunP[2]=position[2];
			this.santonghuashunP[3]=position[3];
			this.santonghuashunP[4]=position[4];
			this.santonghuashunP[5]=position[5];
			this.santonghuashunP[6]=position[6];
			this.santonghuashunP[7]=position[7];
			var colortwo = 0;
			var positiontwo = [];
			var nCountwo = 0;
			var nPeAtwo = 0;
			for(var num = 1 ;num<13;num++){
				if(parseInt(cardData[num]/16)!=colorone){
					colortwo = parseInt(cardData[num]/16);
					nCountwo = 1;
					positiontwo[0] = num;
					break;
				}
			}
			
			if(cardData[positiontwo[0]]%16 == 2){
				for(var temps = positiontwo[0]+1;temps<13;temps++){
					if((cardData[temps]%16) == 14 && (parseInt(cardData[temps]/16)) == colortwo){
						nPeAtwo = temps;
					}
				}
			}
			
			for(var num = positiontwo[0]+1 ;num<13;num++){
				if(((cardData[num]%16)-1 == cardData[positiontwo[positiontwo.length -1]]%16)&& parseInt(cardData[num]/16)==colortwo){
					positiontwo[nCountwo] = num;
					nCountwo++;
				}
			}	
			
			if(nPeAtwo>0){
				positiontwo[nCountwo] = nPeAtwo;
				nCountwo++;
			}

			if(nCountwo!=5){
				return false;
			}
			this.santonghuashunP[8]=positiontwo[0];
			this.santonghuashunP[9]=positiontwo[1];
			this.santonghuashunP[10]=positiontwo[2];
			this.santonghuashunP[11]=positiontwo[3];
			this.santonghuashunP[12]=positiontwo[4];
			return true;

		}
		else if(nCount == 5){
			this.santonghuashunP[8]=position[0];
			this.santonghuashunP[9]=position[1];
			this.santonghuashunP[10]=position[2];
			this.santonghuashunP[11]=position[3];
			this.santonghuashunP[12]=position[4];
			var colortwo = 0;
			var positiontwo = [];
			var nCountwo = 0;
			var nPeAtwo = 0;
			for(var num = 1 ;num<13;num++){
				if(parseInt(cardData[num]/16)!=colorone){
					colortwo = parseInt(cardData[num]/16);
					nCountwo = 1;
					positiontwo[0] = num;
					break;
				}
			}
			
			if(cardData[positiontwo[0]]%16 == 2){
				for(var temps = positiontwo[0]+1;temps<13;temps++){
					if((cardData[temps]%16) == 14 && (parseInt(cardData[temps]/16)) == colortwo){
						nPeAtwo = temps;
					}
				}
			}

			for(var num = positiontwo[0]+1 ;num<13;num++){
				if(((cardData[num]%16)-1 == cardData[positiontwo[positiontwo.length -1]]%16)&& parseInt(cardData[num]/16)==colortwo){
					positiontwo[nCountwo] = num;
					nCountwo++;
				}
			}	
			
			if(nPeAtwo>0){
				positiontwo[nCountwo] = nPeAtwo;
				nCountwo++;
			}
			
			if(nCountwo!=8 && nCountwo!=3 && nCountwo!=5){
				return false;
			}
			
			if(nCountwo == 8){
				this.santonghuashunP[0]=positiontwo[0];
				this.santonghuashunP[1]=positiontwo[1];
				this.santonghuashunP[2]=positiontwo[2];
				this.santonghuashunP[3]=positiontwo[3];
				this.santonghuashunP[4]=positiontwo[4];
				this.santonghuashunP[5]=positiontwo[5];
				this.santonghuashunP[6]=positiontwo[6];
				this.santonghuashunP[7]=positiontwo[7];
				return true;
			}
			
			if(nCountwo == 5){
				this.santonghuashunP[3]=positiontwo[0];
				this.santonghuashunP[4]=positiontwo[1];
				this.santonghuashunP[5]=positiontwo[2];
				this.santonghuashunP[6]=positiontwo[3];
				this.santonghuashunP[7]=positiontwo[4];
				var colorthree = 0;
				var positionthree = [];
				var nCounthree = 0;
				var nPeAthree = 0;
				for(var num = positiontwo[0]+1 ;num<13;num++){
					if(parseInt(cardData[num]/16)!=colortwo){
						colorthree = parseInt(cardData[num]/16);
						nCounthree = 1;
						positionthree[0] = num;
						break;
					}
				}
				
				if(cardData[positionthree[0]]%16 == 2){
					for(var temps = positionthree[0]+1;temps<13;temps++){
						if((cardData[temps]%16) == 14 && (parseInt(cardData[temps]/16)) == colortwo){
							nPeAthree = temps;
						}
					}
				}
				
				for(var num = positionthree[0]+1 ;num<13;num++){
					if(((cardData[num]%16)-1 == cardData[positionthree[positionthree.length -1]]%16)&& parseInt(cardData[num]/16)==colorthree){
						positionthree[nCounthree] = num;
						nCounthree++;
					}
				}
				if(nPeAthree>0){
					positionthree[nCounthree] = nPeAthree;
					nCounthree++;
				}
				if(nCounthree != 3){
					return false;
				}
				this.santonghuashunP[0]=positionthree[0];
				this.santonghuashunP[1]=positionthree[1];
				this.santonghuashunP[2]=positionthree[2];
				return true;
			}
			
			if(nCountwo == 3){
				this.santonghuashunP[0]=positiontwo[0];
				this.santonghuashunP[1]=positiontwo[1];
				this.santonghuashunP[2]=positiontwo[2];
				var colorthree = 0;
				var positionthree = [];
				var nCounthree = 0;
				var nPeAthree = 0;
				for(var num = positiontwo[0]+1 ;num<13;num++){
					if(parseInt(cardData[num]/16)!=colortwo){
						if(position[4]>num){
							if(parseInt(cardData[num]/16)!=colorone){
								colorthree = parseInt(cardData[num]/16);
								nCounthree = 1;
								positionthree[0] = num;
								break;
							}
						}
						else{
							colorthree = parseInt(cardData[num]/16);
							nCounthree = 1;
							positionthree[0] = num;
							break;
						}
					}
				}
				if(cardData[positionthree[0]]%16 == 2){
					for(var temps = positionthree[0]+1;temps<13;temps++){
						if((cardData[temps]%16) == 14 && (parseInt(cardData[temps]/16)) == colorthree){
							nPeAthree = temps;
						}
					}
				}
				
				for(var num = positionthree[0]+1 ;num<13;num++){
					if(((cardData[num]%16)-1 == cardData[positionthree[nCounthree-1]]%16)&& parseInt(cardData[num]/16)==colorthree){
						positionthree[nCounthree] = num;
						nCounthree++;
					}
				}
				
				if(nPeAthree>0){
					positionthree[nCounthree] = nPeAthree;
					nCounthree++;
				}

				if(nCounthree != 5){
					return false;
				}
				this.santonghuashunP[3]=positionthree[0];
				this.santonghuashunP[4]=positionthree[1];
				this.santonghuashunP[5]=positionthree[2];
				this.santonghuashunP[6]=positionthree[3];
				this.santonghuashunP[7]=positionthree[4];
				return true;
			}
		}
		
		return false;
	},
	//一条龙
	onSetYitiaolongUp : function(isHave) {
	},
	//清龙
	onSetQinglongUp : function(isHave) {
	},
	////////////////普通牌型//////////////////
	//对子弹起
	onSetPairUp : function(isHave) {
		var nCount = 1;
		
		if(this.nPair >this.nPockerMax - 2){
			this.nPair = 0;
			for(var num = this.nPair+1;num<this.nPockerMax;num++){
				if(this.flagAll[num] == 1){
					this.Card[num].setPositionY(this.cardboxSize.height*0.6);
					this.flagAll[num] = 0;
				}
			}	
		}
		cc.log('this.nPair='+this.nPair);
//		for(var num = 0;num<13;num++){
//			cc.log('this.flagAll ' + this.flagAll[num]);
//		}
		cc.log('this.flagPair[this.nPair]=' + this.nPair);
		for(var num = this.nPair+1;num<this.nPockerMax;num++){
			if(this.flagPair[this.nPair]>0){
				
				if(this.flagPair[this.nPair] == this.flagPair[num]){
					if(this.nPair == num){
						this.nPair = 0;
					}
					
					if((this.flagAll[this.nPair]<2)&&(this.flagAll[num]<2)){
						cc.log('this.nPair' + this.nPair + 'num' + num);
						cc.log('this.flagAll[this.nPair]=' + this.flagAll[this.nPair] + 'this.flagAll[num]='+this.flagAll[num]);
						if(this.nPair>0){
							for(var temp = 0 ; temp<this.nPair ; temp++){
								if(this.flagAll[temp]==1){
									this.Card[temp].setPositionY(this.cardboxSize.height*0.6);
									this.flagAll[temp] = 0;
								}
							}
						}
						
											
						for(var wnum =0;wnum<this.nPockerMax;wnum++){
							if((wnum!=num)&&(wnum!=this.nPair)){
								if(this.flagAll[wnum] == 1){
									this.Card[wnum].setPositionY(this.cardboxSize.height*0.6);
									this.flagAll[wnum]=0;
								}		
							}
						}
						if(isHave == 1){
							this.nPair = 0;
							return true;
						}
						else{
							this.Card[num].setPositionY((this.cardboxSize.height*0.6)+20);
							this.Card[this.nPair].setPositionY((this.cardboxSize.height*0.6)+20);
							this.flagAll[num]=1;
							this.flagAll[this.nPair]=1;
						}
						
						this.flagAll[this.nPair]=1;
						this.nPair = this.nPair+1;
						
						if(num<this.nPockerMax - 2){
							var qnum = 0;
//							cc.log('111num=' + num);
							for(var temp =num;temp<this.nPockerMax;temp++){
								if(this.flagPair[temp]>0 && this.flagAll[temp]<2){
									for(var sum =temp +1 ; sum<this.nPockerMax;sum++){
										if(this.flagPair[temp]==this.flagPair[sum]){
											if(this.flagAll[sum]<2){
												qnum =qnum+1;
											}	
										}
									}
								}
							}
							cc.log('111num=' + num + 'qnum'+qnum);
							if(qnum == 0){
								cc.log('2222num=' + num);
								this.nPair = 0;
							}	
						}
						
						return;
					}
					else{
						if(this.flagAll[this.nPair]>1){
							this.nPair = this.nPair+1;
							if(this.nPair>this.nPockerMax - 2){
								if(isHave == 1){
									this.nPair = 0;
									return false;
								}
								this.nPair = 0;
							}
							num = this.nPair;
						}
					}
				}
				else{
					this.nPair = this.nPair+1;
					if(this.nPair> this.nPockerMax - 2){
						if(isHave == 1){
							this.nPair = 0;
							return false;
						}
						this.nPair = 0;
					}
					num = this.nPair;
					
				}
			}
			else{
				this.nPair = this.nPair+1;
				if(this.nPair> this.nPockerMax - 2){
					if(isHave == 1){
						this.nPair = 0;
						return false;
					}
					this.nPair = 0;
				}
				num = this.nPair;
			}
		}
	
	},
    //两对
    onSetDoublePairUp: function(isHave) {//两对
        cc.log('000this.nDPair[0]='+this.nDPair[0]);
        cc.log('000this.nDPair[1]='+this.nDPair[1]);
        var Position = [0,0,0,0,0];//记录两对的位置
        for(var num = this.nDPair[0]+1;num<this.nPockerMax;num++){
            cc.log('AAAthis.nDPair[0]='+this.nDPair[0]+"num="+num);
            if(this.nDPair[0]>this.nPockerMax -4){
                this.nDPair=[0,0];
                num = this.nDPair[0]+1;
            }
            if(num>this.nPockerMax -2){
                this.nDPair=[0,0];
                if(isHave == 1){
                    return false;
                }
                num = this.nDPair[0]+1;
            }
            cc.log('this.flagPair[this.nDPair[0]]='+this.flagPair[this.nDPair[0]]+'this.flagPair[num]='+this.flagPair[num]);
            if(this.flagPair[this.nDPair[0]] == this.flagPair[num] &&(this.flagPair[this.nDPair[0]]>0)){
                if((this.flagAll[this.nDPair[0]]<2)&&(this.flagAll[num]<2)){

//					if(isHave == 0){
//						this.Card[num].setPositionY((this.cardboxSize.height*0.6)+20);
//						this.Card[this.nDPair[0]].setPositionY((this.cardboxSize.height*0.6)+20);
//						this.flagAll[num]=1;
//						this.flagAll[this.nDPair[0]]=1;
//					}

                    Position[0] = this.nDPair[0];
                    Position[1] = num;

                    cc.log('BBBthis.nDPair[0]='+this.nDPair[0]+'this.nDPair[1]='+this.nDPair[1]);
                    cc.log("num="+num);
                    if(this.nDPair[1]<=this.nDPair[0]){
                        this.nDPair[1] = num+1;
//						cc.log('000this.nDPair[1]='+this.nDPair[1]);
                    }
                    else if(this.nDPair[1]>this.nPockerMax -2){
                        if(isHave == 1){
                            this.nDPair=[0,0];
                            return false;
                        }
                        else{
                            this.nDPair[0]=num;
                            this.nDPair[1]=0;
                        }

                    }

                    if(this.nDPair[1]>this.nPockerMax -2){
                        if(isHave == 1){
                            this.nDPair=[0,0];
                            return false;
                        }
                        else{
                            this.nPair[0] = this.nPair[0]+1;
                        }
                    }
                    else{
                        cc.log('111this.nDPair[1]='+this.nDPair[1]);
                        for(var Jnum = this.nDPair[1];Jnum<this.nPockerMax -1;Jnum++){
                            for(var Knum = Jnum+1;Knum<this.nPockerMax;Knum++){

                                cc.log('this.flagPair[this.nDPair[1]='+this.flagPair[this.nDPair[1]]+"this.flagPair[Knum]="+this.flagPair[Knum]);
                                if((this.flagPair[Jnum] == this.flagPair[Knum])&&(this.flagPair[Jnum]>this.flagPair[this.nDPair[0]])){

                                    if((this.flagAll[Jnum]<2)&&(this.flagAll[Knum]<2)){
                                        Position[2]=this.nDPair[1];
                                        Position[3]=Knum;
                                        cc.log('1this.nDPair[1]'+this.nDPair[1]);
                                        cc.log('Position0='+Position[0]);
                                        cc.log('Position1='+Position[1]);
                                        cc.log('Position2='+Position[2]);
                                        cc.log('Position3='+Position[3]);

                                        if(isHave == 0){
                                            this.Card[Position[0]].setPositionY((this.cardboxSize.height*0.6)+20);
                                            this.Card[Position[1]].setPositionY((this.cardboxSize.height*0.6)+20);
                                            this.flagAll[Position[0]]=1;
                                            this.flagAll[Position[1]]=1;

                                            this.Card[Position[2]].setPositionY((this.cardboxSize.height*0.6)+20);
                                            this.Card[Position[3]].setPositionY((this.cardboxSize.height*0.6)+20);
                                            this.flagAll[Position[2]]=1;
                                            this.flagAll[Position[3]]=1;
                                        }

                                        for(var cFlag = 0; cFlag<this.nPockerMax;cFlag++){
                                            if(this.flagAll[cFlag]==1){
                                                if((cFlag!=Position[0]) && (cFlag!=Position[1]) && (cFlag!=Position[2]) && (cFlag!=Position[3])){
                                                    cc.log('cFlag='+cFlag);
                                                    this.Card[cFlag].setPositionY(this.cardboxSize.height*0.6);
                                                    this.flagAll[cFlag]=0;
                                                }
                                            }
                                        }
                                        this.nDPair[1]=this.nDPair[1]+1;
                                        cc.log('2this.nDPair[1]'+this.nDPair[1]);
                                        if(isHave == 1){
                                            this.nDPair=[0,0];
                                            return true;
                                        }
                                        if(this.nDPair[1]>this.nPockerMax -2){
                                            this.nDPair[0]=this.nDPair[0]+1;
                                        }
                                        return true;
                                    }
                                }
                            }
                            this.nDPair[1]=this.nDPair[1]+1;
                            cc.log('3this.nDPair[1]'+this.nDPair[1]);
                            if(this.nDPair[1]>this.nPockerMax -2){
                                if(isHave == 1){
                                    this.nDPair=[0,0];
                                    return false;
                                }
                                this.nDPair[1] = 0;
                                break;
                            }
                        }
                    }

                    var nCount = 0;
                    for(var cFlag = 0; cFlag<this.nPockerMax;cFlag++){
                        if(this.flagAll[cFlag]==1){
                            nCount=nCount+1;
                        }
                    }
                    if(nCount=2){
                        this.Card[this.nDPair[0]].setPositionY(this.cardboxSize.height*0.6);
                        this.flagAll[this.nDPair[0]]=0;
                        this.Card[num].setPositionY(this.cardboxSize.height*0.6);
                        this.flagAll[num]=0;

                        this.nDPair[0]=this.nDPair[0]+1;
                        this.nDPair[1]=0;
                        if(isHave == 1){
                            this.nDPair=[0,0];
                            return false;
                        }
                    }
                }
                else{

                    this.nDPair[0]=this.nDPair[0]+1;
                    num = this.nDPair[0];
                    cc.log('DDDthis.nDPair[0]'+this.nDPair[0] + "isHave = "+isHave);
                    if(this.nDPair[0]>this.nPockerMax -4){
                        if(isHave == 1){
                            this.nDPair=[0,0];
                            return false;
                        }
                        else{
                            this.nPair=0;
                        }
                    }
                }
            }
            else{
                this.nDPair[0]=this.nDPair[0]+1;
                num = this.nDPair[0];
                cc.log('CCCthis.nDPair[0]'+this.nDPair[0] + "isHave = "+isHave);
                if(this.nDPair[0]>this.nPockerMax -4){
                    this.nDPair=[0,0];
                    num = this.nDPair[0];
                    if(isHave == 1){
                        this.nDPair=[0,0];
                        return false;
                    }
                }
            }
        }
        return false;
    },
	//三条弹起
	onSetThreeUp : function(isHave) {
		var nCount = 1;
		cc.log('0this.nThree=' + this.nThree);
		for(var num = this.nThree+1;num<this.nPockerMax;num++){
			if(num+1<this.nPockerMax){
				if(this.flagPair[this.nThree]>0){
					if((this.flagPair[this.nThree] == this.flagPair[num]) && (this.flagPair[num] == this.flagPair[num+1])){
						if(this.nThree == num){
							this.nThree = 0;
						}
						cc.log('1this.nThree' + this.nThree + 'num' + num);
						
						cc.log('this.flagPair[this.nThree]' + this.flagPair[this.nThree]);
						cc.log('this.flagPair[num]' + this.flagPair[num]);
						cc.log('this.flagPair[num+1]' + this.flagPair[num+1]);
						if(this.flagAll[this.nThree]<2 && this.flagAll[num]<2 && this.flagAll[num+1]<2){
							if(this.nThree>0){
								for(var temp = 0 ; temp<this.nThree ; temp++){
									if(this.flagAll[temp]==1){
										this.Card[temp].setPositionY(this.cardboxSize.height*0.6);
										this.flagAll[temp] = 0;
									}
								}
							}
							if(isHave == 0){
								this.Card[num].setPositionY((this.cardboxSize.height*0.6)+20);
								this.Card[num+1].setPositionY((this.cardboxSize.height*0.6)+20);
								this.Card[this.nThree].setPositionY((this.cardboxSize.height*0.6)+20);
								this.flagAll[num]=1;
								this.flagAll[num+1]=1;
								this.flagAll[this.nThree]=1;

							}
							
							if(isHave == 1){
								this.nThree = 0;
								return true;
							}
							if(this.nThree >this.nPockerMax - 3){
								this.nThree = 0;
								return;
							}
							
							var rnum = 0;
							for(var wnum =0;wnum<this.nPockerMax;wnum++){
								if((wnum!=num)&&(wnum!=this.nThree)&&(wnum!=num+1)){
									if(this.flagAll[wnum] == 1){
										cc.log('wnum====' + wnum + 'num=' + num + 'nthree=' + this.nThree);
										this.Card[wnum].setPositionY(this.cardboxSize.height*0.6);
										this.flagAll[wnum]=0;
									}
								}
							}
							this.flagAll[this.nThree]=1;
							this.nThree = this.nThree+1;
							
							cc.log('3this.nThree' + this.nThree + 'num' + num);
							if(num<this.nPockerMax - 3){
								var qnum = 0;
								for(var temp =num;temp<this.nPockerMax;temp++){
									for(var sum =temp +1 ; sum<this.nPockerMax;sum++){
										if((this.flagPair[temp]==this.flagPair[sum])){
											if(this.flagAll[temp]<2 && this.flagAll[sum]<2){
												for(var dnum = sum+1;dnum<this.nPockerMax;dnum++){
													if(this.flagPair[sum] == this.flagPair[dnum]){
														if(this.flagAll[dnum]<2){
															qnum =qnum+1;
														}
													}
												}
											}	
										}
									}
								}
								if(qnum == 0){
									cc.log('this.nThree');
									this.nThree = 0;
								}	
							}
							return;
						}
						else{
							cc.log('222nThree='+this.nThree);
							if(this.flagAll[this.nThree]>1){								
								this.nThree = this.nThree+1;
								cc.log('aaaanThree=' + this.nThree);
								num=this.nThree;
							}
//							else if(this.flagAll[num+1]>1){
//								num=num+1;
//							}
							
							cc.log('555nThree='+this.nThree + "num"+num);
						}
					}
					else{
						cc.log('666-1nThree='+this.nThree + "num"+num);
						this.nThree = this.nThree+1;
						num = this.nThree;
						if(this.nThree>this.nPockerMax -3){
							this.nThree = 0;
							if(isHave == 1){
								return false;
							}
							num = this.nThree;
						}
						cc.log('666-2nThree='+this.nThree + "num"+num);
					}
				}
				else{
					cc.log('777nThree='+this.nThree + "num"+num);
					this.nThree = this.nThree+1;
					num = this.nThree;
					if(this.nThree>this.nPockerMax - 3){
						this.nThree = 0;
						if(isHave == 1){
							return false;
						}
						num = this.nThree;
					}
				}
			}
			else{
				cc.log('888nThree='+this.nThree + "num"+num);
				this.nThree = this.nThree+1;
				num = this.nThree;
				if(this.nThree>this.nPockerMax -3){
					this.nThree = 0;
					if(isHave == 1){
						return false;
					}
					num = this.nThree;
				}
			}
		}
	},
	//同花
	onSetTonghuaUP :function(isHave){
		cc.log("判断同花"+"this.nTong="+this.nTong);
		for(var num = this.nTong;num<this.nPockerMax - 4;num++){
			var Count = 0;
			if(this.flagAll[num]<2){
				cc.log("num="+num+"this.nTong="+this.nTong);
				var Position = [0,0,0,0,0];//记录同花的位置
				Position[0] = num;
				for(var Jnum = num+1;Jnum<this.nPockerMax;Jnum++){
					if((parseInt(this.pokecard[num]/16)== parseInt(this.pokecard[Jnum]/16))&&(this.flagAll[Jnum]<2)){
						
						this.Card[num].setPositionY((this.cardboxSize.height*0.6)+20);
						this.Card[Jnum].setPositionY((this.cardboxSize.height*0.6)+20);
						this.flagAll[num] = 1;
						this.flagAll[Jnum] = 1;
						
						Position[Count+1]=Jnum;
						Count = Count +1;
						cc.log("num="+num+"Jnum="+Jnum+"Count="+Count);
						if(Count ==4){
							for(var mmm = 0 ; mmm<5;mmm++){
								cc.log("Position="+Position[mmm]);
							}
							if(isHave == 0){								
								for(var Lnum = 0 ;Lnum<this.nPockerMax;Lnum++){
									if(this.flagAll[Lnum]==1){
										if(Lnum!=Position[0]&&Lnum!=Position[1]&&Lnum!=Position[2]&&Lnum!=Position[3]&&Lnum!=Position[4]){
											this.Card[Lnum].setPositionY(this.cardboxSize.height*0.6);
											this.flagAll[Lnum] = 0;
										}	
									}
								}
								this.nTong =this.nTong+1;
								cc.log("nTong="+this.nTong);
								if(this.nTong >this.nPockerMax - 5){
									this.nTong = 0;
								}
								return;
							}
							else if(isHave == 1){//只是判断有没有同花
								for(var Lnum = 0 ;Lnum<this.nPockerMax;Lnum++){
									if(this.flagAll[Lnum]==1){
										this.Card[Lnum].setPositionY(this.cardboxSize.height*0.6);
										this.flagAll[Lnum] = 0;
									}
								}
								this.nTong = 0;
								return true;
							}
							
						}
					}
				}
				if(Count<4){
					if(Count>0){
						for(var Lnum = 0 ;Lnum<this.nPockerMax;Lnum++){
							if(this.flagAll[Lnum]==1){
								this.Card[Lnum].setPositionY(this.cardboxSize.height*0.6);
								this.flagAll[Lnum] = 0;
							}	
						}
					}
					this.nTong = this.nTong+1;
					cc.log("@@@num="+num+"this.nTong="+this.nTong);
					if(this.nTong >this.nPockerMax - 5){
						if(isHave == 1){
							this.nTong = 0;
							return false;
						}
						else{
							this.nTong = 0;
							num = this.nTong-1;
						}
						
//						return;
					}
				}
			}
			else{
				this.nTong = this.nTong+1;
				if(this.nTong >this.nPockerMax - 5){
					if(isHave == 1){
						this.nTong = 0;
						return false;
					}
					this.nTong = 0;
				}
			} 
		}
		return false;
	},
    //同花顺弹起
	onSetTonghuaShunUpPartTwo : function(isHave){
		var nTshunlen = this.nTShun.length;
		cc.log('nTshunlen='+nTshunlen);
		
		cc.log('nShunNum='+this.nShunNum);
		cc.log('nTonghuashun='+this.nTonghuashun);
		for(var num = this.nTonghuashun;num<nTshunlen;num++){
			
			if((parseInt(this.nTShun[num][0]/16)==parseInt(this.nTShun[num][1]/16))&&(parseInt(this.nTShun[num][1]/16)==parseInt(this.nTShun[num][2]/16))&&
					parseInt(this.nTShun[num][2]/16)==parseInt(this.nTShun[num][3]/16)&&(parseInt(this.nTShun[num][3]/16)==parseInt(this.nTShun[num][4]/16))){
				if(isHave == 0){
					cc.log('num='+num);
					for(var Xnum = 0;Xnum<this.nPockerMax;Xnum++){
						if(this.flagAll[Xnum]==1){
							if((Xnum!=this.nTShunPosition[num][0])&&(Xnum!=this.nTShunPosition[num][1])&&
									(Xnum!=this.nTShunPosition[num][2])&&(Xnum!=this.nTShunPosition[num][3])&&(Xnum!=this.nTShunPosition[num][4]))
								this.Card[Xnum].setPositionY(this.cardboxSize.height*0.6);
							this.flagAll[Xnum] = 0;
						}       
					}
					cc.log('this.nTShunPosition[num][0]='+this.nTShunPosition[num][0]);
					cc.log('this.nTShunPosition[num][1]='+this.nTShunPosition[num][1]);
					cc.log('this.nTShunPosition[num][2]='+this.nTShunPosition[num][2]);
					cc.log('this.nTShunPosition[num][3]='+this.nTShunPosition[num][3]);
					cc.log('this.nTShunPosition[num][4]='+this.nTShunPosition[num][4]);
					this.Card[this.nTShunPosition[num][0]].setPositionY((this.cardboxSize.height*0.6)+20);
					this.flagAll[this.nTShunPosition[num][0]] = 1;
					this.Card[this.nTShunPosition[num][1]].setPositionY((this.cardboxSize.height*0.6)+20);
					this.flagAll[this.nTShunPosition[num][1]] = 1;
					this.Card[this.nTShunPosition[num][2]].setPositionY((this.cardboxSize.height*0.6)+20);
					this.flagAll[this.nTShunPosition[num][2]] = 1;
					this.Card[this.nTShunPosition[num][3]].setPositionY((this.cardboxSize.height*0.6)+20);
					this.flagAll[this.nTShunPosition[num][3]] = 1;
					this.Card[this.nTShunPosition[num][4]].setPositionY((this.cardboxSize.height*0.6)+20);
					this.flagAll[this.nTShunPosition[num][4]] = 1;
					
					this.nTonghuashun = this.nTonghuashun+1;
					if(this.nTonghuashun>=nTshunlen){
						this.nTonghuashun = 0;
					}
					return true;
				}
				else{
					cc.log('this.nTShunPosition[num][0]='+this.nTShunPosition[num][0]);
					cc.log('this.nTShunPosition[num][1]='+this.nTShunPosition[num][1]);
					cc.log('this.nTShunPosition[num][2]='+this.nTShunPosition[num][2]);
					cc.log('this.nTShunPosition[num][3]='+this.nTShunPosition[num][3]);
					cc.log('this.nTShunPosition[num][4]='+this.nTShunPosition[num][4]);
					this.nTonghuashun = 0;
					return true;
				}
				
				
			}
			else{
				this.nTonghuashun = this.nTonghuashun+1;
				cc.log('22nTonghuashun='+this.nTonghuashun);
				if(this.nTonghuashun>=nTshunlen){
					if(isHave == 1){
						return false;
					}
					else{
						this.nTonghuashun = 0;
						num = this.nTonghuashun-1;
					}
				}
			}
		}
	},
	onSetTonghuaShunUp : function(isHave){
		var nCount = 0;		
		for(var num=0;num<this.nPockerMax - 4;num++){
			cc.log('num='+num);
			this.nShunPosition = [num,0,0,0,0];
			this.nPosition = [0,0,0,0,0];
			nCount = nCount+this.onSetShunziUp(2);
			
		}
		cc.log('nCount='+nCount);
//		isHave = 1;
		if(nCount == 0){
			if(isHave == 1){
				this.nShunPosition=[0,0,0,0,0];
				this.nPosition=[0,0,0,0,0];
				return false;
			}
		}
		else{
			if(isHave == 1){
				this.nShunPosition=[0,0,0,0,0];
				this.nPosition=[0,0,0,0,0];
			}
			return this.onSetTonghuaShunUpPartTwo(isHave);
		}
	},
    //顺子弹起
    onSetShunziUp : function(isHave) {
		cc.log("有顺子弹起判断");
    	cc.log('isHave='+isHave);
    	cc.log('this.nShun0='+this.nShunPosition[0]);
    	cc.log('this.nShun1='+this.nShunPosition[1]);
    	cc.log('this.nShun2='+this.nShunPosition[2]);
    	cc.log('this.nShun3='+this.nShunPosition[3]);
    	cc.log('this.nShun4='+this.nShunPosition[4]);

    	var nTcount = 0;

    	var Position = [0,0,0,0,0];
    	var lastn = this.nPockerMax - 4;
    	var num = 0;
    	if(this.nShunPosition[0]>this.nPockerMax - 5){
    		for(var num = 0;num < 5;num++){
                this.nShunPosition[num]=0;
			}
    	}

    	if(this.nShunPosition[1]==0){
    		num = this.nShunPosition[0]+1
    	}
    	else{
    		num = this.nShunPosition[1];
    	}
        cc.log("num = "+num+"模拟手牌排序值="+JSON.stringify(this.pokecard));
    	cc.log("pock[0]="+this.pokecard[this.nShunPosition[0]]%16+"pock[1]="+this.pokecard[num]%16);
    	for(;num<this.nPockerMax - 3;num++){
    		//如果第二个等于第一个（如果第二个跟第一个都没摆上牌墩）
    		if((this.pokecard[this.nShunPosition[0]]%16)==((this.pokecard[num]%16) + 1)){
    			if(this.flagAll[this.nShunPosition[0]]<2 && this.flagAll[num]<2 && this.flagAll[this.nShunPosition[0]]<2){
    				cc.log("2222this.nShun="+this.nShunPosition[0]);
    				cc.log("2222num"+num);
    				if(this.nShunPosition[1]==0||(this.nShunPosition[1]==this.nShunPosition[0]+1)){//+1
    					this.nPosition[1] = num;
    				}
    				this.nPosition[0] = this.nShunPosition[0];
    				this.nShunPosition[0];
    				this.nShunPosition[1]=num;
    				cc.log("2222this.nShun="+this.nShunPosition[1]);
    				cc.log("this.nShunPosition[2]="+this.nShunPosition[2]);
    				cc.log("****");


    				var Jnum =0;
    				if(this.nShunPosition[2]==0){
    					Jnum = this.nShunPosition[1]+1;
    					num = this.nShunPosition[1];
    				}
    				else{
    					Jnum=this.nShunPosition[2];
    				}
    				for(;Jnum<this.nPockerMax;Jnum++){
    					if(this.nShunPosition[0]>this.nPockerMax - 5){
    						break;
    					}
    					cc.log("Find"+this.nShunPosition[1]+"=="+this.pokecard[this.nShunPosition[1]]%16+"&&"+Jnum+"=="+this.pokecard[Jnum]%16);
    					if(((this.pokecard[this.nShunPosition[1]]%16)==((this.pokecard[Jnum]%16)+1))&&(this.flagAll[Jnum]<2)&&this.flagAll[this.nShunPosition[1]]<2){
    						if(this.nShunPosition[2]==0||(this.nShunPosition[2] ==this.nShunPosition[1]+1)){//+1
    							this.nPosition[2] = Jnum;
    						}
    						this.nShunPosition[2]=Jnum;
    						cc.log("3333this.nShunPosition[0]="+this.nShunPosition[0])
    						cc.log("3333this.nShunPosition[1]="+this.nShunPosition[1])
    						cc.log("3333this.nShunPosition[2]="+this.nShunPosition[2])
    						cc.log("3333this.nShunPosition[3]="+this.nShunPosition[3])

    						var Knum = 0;
    						if(this.nShunPosition[3]==0){
    							Knum = this.nShunPosition[2]+1;
    							Jnum = this.nShunPosition[2];
    						}
    						else{
    							Knum = this.nShunPosition[3];
    						}

    						cc.log("3333this.nShunPosition[3]=Knum="+this.nShunPosition[3])
    						for(;Knum<this.nPockerMax;Knum++){
    							if(this.nShunPosition[0]>this.nPockerMax - 5){
    								break;
    							}
    							cc.log("for"+"Knum="+Knum);
    							if(((this.pokecard[this.nShunPosition[2]]%16)==((this.pokecard[Knum]%16)+1))&&(this.flagAll[Knum]<2)&&this.flagAll[this.nShunPosition[2]]<2){
    								if(this.nPosition[3]==0||(this.nShunPosition[3]==this.nShunPosition[2]+1)){//+1
    									this.nPosition[3] = Knum;
    								}
    								this.nShunPosition[3]=Knum;

    								var Pnum = 0;
    								if(this.nShunPosition[4]==0){
    									Pnum = this.nShunPosition[3]+1;
    									Knum = this.nShunPosition[3];
    								}
    								else{
    									Pnum = this.nShunPosition[4];
    								}
    								cc.log("4444this.nShunPosition[3]=Knum="+this.nShunPosition[3])
    								cc.log("4444this.nShunPosition[4]=Knum="+this.nShunPosition[4])

    								for(;Pnum<this.nPockerMax;Pnum++){
    									cc.log("for"+"Pnum="+Pnum);
//    									if(this.pokecard[this.nShunPosition[0]]%16==2){}//特殊的顺子
    									if(this.nShunPosition[0]>this.nPockerMax - 5){
    										break;
    									}
    									if(((this.pokecard[this.nShunPosition[3]]%16)==((this.pokecard[Pnum]%16)+1))&&(this.flagAll[Pnum]<2)&&(this.flagAll[this.nShunPosition[3]]<2)){
    										if(this.nPosition[4]==0||(this.nShunPosition[4]==this.nShunPosition[3]+1)){//+1
    											this.nPosition[4] = Pnum;
    										}
    										this.nShunPosition[4]=Pnum;

    										if(isHave == 0){
    											for(var Xnum = 0;Xnum<this.nPockerMax;Xnum++){
    												if(this.flagAll[Xnum]==1){
    													if((Xnum!=this.nShunPosition[0])&&(Xnum!=this.nShunPosition[1])&&
    															(Xnum!=this.nShunPosition[2])&&(Xnum!=this.nShunPosition[3])&&(Xnum!=this.nShunPosition[4]))
    														this.Card[Xnum].setPositionY(this.cardboxSize.height*0.6);
    													this.flagAll[Xnum] = 0;
    												}
    											}

    											this.Card[this.nShunPosition[0]].setPositionY((this.cardboxSize.height*0.6)+20);
    											this.flagAll[this.nShunPosition[0]] = 1;
    											this.Card[this.nShunPosition[1]].setPositionY((this.cardboxSize.height*0.6)+20);
    											this.flagAll[this.nShunPosition[1]] = 1;
    											this.Card[this.nShunPosition[2]].setPositionY((this.cardboxSize.height*0.6)+20);
    											this.flagAll[this.nShunPosition[2]] = 1;
    											this.Card[this.nShunPosition[3]].setPositionY((this.cardboxSize.height*0.6)+20);
    											this.flagAll[this.nShunPosition[3]] = 1;
    											this.Card[this.nShunPosition[4]].setPositionY((this.cardboxSize.height*0.6)+20);
    											this.flagAll[this.nShunPosition[4]] = 1;
    										}
    										cc.log("add shunzi on nTShun="+this.nShunPosition[0]+this.nShunPosition[1]+this.nShunPosition[2]+this.nShunPosition[3]+this.nShunPosition[4]);
    										cc.log("add shunzi  isHave="+isHave);
    										if(isHave == 1){
    											this.nShunPosition = [0,0,0,0,0];
    											this.nPosition = [0,0,0,0,0];
    											return true;

    										}
    										if(isHave == 2 || isHave ==3){

    											if(this.nTShunPosition[0]!=null){
    												if((this.nTShunPosition[0][0]==this.nShunPosition[0])&&(this.nTShunPosition[0][1]==this.nShunPosition[1])&&
    														(this.nTShunPosition[0][2]==this.nShunPosition[2])&&(this.nTShunPosition[0][3]==this.nShunPosition[3])
    														&&(this.nTShunPosition[0][4]==this.nShunPosition[4])){
    													return nTcount;
    												}
    											}

    											this.nTShun[this.nShunNum] = [this.pokecard[this.nShunPosition[0]],this.pokecard[this.nShunPosition[1]],
    											                        this.pokecard[this.nShunPosition[2]],this.pokecard[this.nShunPosition[3]],
    											                        this.pokecard[this.nShunPosition[4]]];

    											this.nTShunPosition[this.nShunNum]=[this.nShunPosition[0],this.nShunPosition[1],this.nShunPosition[2],
    											this.nShunPosition[3],this.nShunPosition[4]];

    											Pnum=this.nShunPosition[4]-1;

    											nTcount = nTcount+1;
    											this.nShunNum = this.nShunNum +1;

    											cc.log("发现第="+this.nShunNum+"顺子");
    										}


    										if((((this.pokecard[this.nShunPosition[3]]%16)==(this.pokecard[this.nShunPosition[3]+1]%16))&&(this.flagAll[this.nShunPosition[3]+1]<2))||
    												(((this.pokecard[this.nShunPosition[3]]%16)==(this.pokecard[this.nShunPosition[3]+2]%16))&&((this.flagAll[this.nShunPosition[3]+2]<2)))||
    												(((this.pokecard[this.nShunPosition[3]]%16)==(this.pokecard[this.nShunPosition[3]+3]%16))&&(this.flagAll[this.nShunPosition[3]+3]<2))){
    											cc.log(")))");
    											this.nShunPosition[3]=this.nShunPosition[3]+1;
//    											this.nShunPosition[4] = this.nPosition[4];

    											cc.log("this.nShunPosition[3]="+this.nShunPosition[3]);
    										}
    										else{
    											if((((this.pokecard[this.nShunPosition[2]]%16)==(this.pokecard[this.nShunPosition[2]+1]%16))&&(this.flagAll[this.nShunPosition[2]+1]<2))||
    													(((this.pokecard[this.nShunPosition[2]]%16)==(this.pokecard[this.nShunPosition[2]+2]%16))&&((this.flagAll[this.nShunPosition[2]+2]<2)))||
    													(((this.pokecard[this.nShunPosition[2]]%16)==(this.pokecard[this.nShunPosition[2]+3]%16))&&((this.flagAll[this.nShunPosition[2]+3]<2)))){
    												cc.log("AAA");

    												if(((this.pokecard[this.nShunPosition[2]]%16)==(this.pokecard[this.nShunPosition[2]+1]%16))&&(this.flagAll[this.nShunPosition[2]+1]<2)){
    													cc.log("AAA-1");
    													this.nShunPosition[2] = this.nShunPosition[2]+1;
    												}
    												else if(((this.pokecard[this.nShunPosition[2]]%16)==(this.pokecard[this.nShunPosition[2]+2]%16))&&(this.flagAll[this.nShunPosition[2]+2]<2)){
    													cc.log("AAA-2");
    													this.nShunPosition[2] = this.nShunPosition[2]+2;
    												}
    												else if(((this.pokecard[this.nShunPosition[2]]%16)==(this.pokecard[this.nShunPosition[2]+3]%16))&&(this.flagAll[this.nShunPosition[2]+3]<2)){
    													cc.log("AAA-3");
    													this.nShunPosition[2] = this.nShunPosition[2]+3;
    												}
//    												this.nShunPosition[2] = this.nShunPosition[2]+1;
    												this.nShunPosition[3] = this.nPosition[3];
//    												this.nShunPosition[4] = this.nPosition[4];
    											}
    											else if((((this.pokecard[this.nShunPosition[1]]%16)==(this.pokecard[this.nShunPosition[1]+1]%16))&&(this.flagAll[this.nShunPosition[1]+1]<2))||
    													(((this.pokecard[this.nShunPosition[1]]%16)==(this.pokecard[this.nShunPosition[1]+2]%16))&&(this.flagAll[this.nShunPosition[1]+2]<2))||
    													(((this.pokecard[this.nShunPosition[1]]%16)==(this.pokecard[this.nShunPosition[1]+3]%16))&&(this.flagAll[this.nShunPosition[1]+3]<2))){
    												cc.log("bbb");

    												if(((this.pokecard[this.nShunPosition[1]]%16)==(this.pokecard[this.nShunPosition[1]+1]%16))&&(this.flagAll[this.nShunPosition[1]+1]<2)){
    													cc.log("AAA-1");
    													this.nShunPosition[1] = this.nShunPosition[1]+1;
    												}
    												else if(((this.pokecard[this.nShunPosition[1]]%16)==(this.pokecard[this.nShunPosition[1]+2]%16))&&(this.flagAll[this.nShunPosition[1]+2]<2)){
    													cc.log("AAA-2");
    													this.nShunPosition[1] = this.nShunPosition[1]+2;
    												}
    												else if(((this.pokecard[this.nShunPosition[1]]%16)==(this.pokecard[this.nShunPosition[1]+3]%16))&&(this.flagAll[this.nShunPosition[1]+3]<2)){
    													cc.log("AAA-3");
    													this.nShunPosition[1] = this.nShunPosition[1]+3;
    												}
    												cc.log("bbbthis.nPosition[2] = "+this.nPosition[2]);
    												cc.log("bbbthis.nPosition[3] = "+this.nPosition[3]);
    												this.nShunPosition[2]=this.nPosition[2];
    												this.nShunPosition[3] = this.nPosition[3];

//    												this.nShunPosition[4] = this.nPosition[4];
    											}
    											else if((((this.pokecard[this.nShunPosition[4]]%16)==(this.pokecard[this.nShunPosition[4]+1]%16))&&(this.flagAll[this.nShunPosition[4]+1]<2))||
    													(((this.pokecard[this.nShunPosition[4]]%16)==(this.pokecard[this.nShunPosition[4]+2]%16))&&(this.flagAll[this.nShunPosition[4]+2]<2))||
    													(((this.pokecard[this.nShunPosition[4]]%16)==(this.pokecard[this.nShunPosition[4]+3]%16))&&(this.flagAll[this.nShunPosition[4]+3]<2))){
    													cc.log("DDD");

    													if(((this.pokecard[this.nShunPosition[4]]%16)==(this.pokecard[this.nShunPosition[4]+1]%16))&&(this.flagAll[this.nShunPosition[4]+1]<2)){
    														cc.log("AAA-1");
    														this.nShunPosition[4] = this.nShunPosition[4]+1;
    													}
    													else if(((this.pokecard[this.nShunPosition[4]]%16)==(this.pokecard[this.nShunPosition[4]+2]%16))&&(this.flagAll[this.nShunPosition[4]+2]<2)){
    														cc.log("AAA-2");
    														this.nShunPosition[4] = this.nShunPosition[4]+2;
    													}
    													else if(((this.pokecard[this.nShunPosition[4]]%16)==(this.pokecard[this.nShunPosition[4]+3]%16))&&(this.flagAll[this.nShunPosition[4]+3]<2)){
    														cc.log("AAA-3");
    														this.nShunPosition[4] = this.nShunPosition[4]+3;
    													}

    													this.nShunPosition[1]=this.nPosition[1];
    													this.nShunPosition[2] = this.nPosition[2];
    													this.nShunPosition[3] = this.nPosition[3];
    													if(isHave ==2||isHave == 3){
    														Pnum=this.nShunPosition[4]-1;
    													}
    											}
    											else{
    												cc.log("EEE");
    												this.nShunPosition[0]=this.nShunPosition[0]+1;
    												this.nShunPosition[1]=this.nShunPosition[0]+1;
    												this.nShunPosition[2]=this.nShunPosition[1]+1;
    												this.nShunPosition[3]=this.nShunPosition[2]+1;
    												this.nShunPosition[4]=this.nShunPosition[3]+1;
    												this.nPosition=[this.nShunPosition[0],0,0,0,0];
    												if(this.nShunPosition[0]>this.nPockerMax - 5){
    													this.nShunPosition = [0,0,0,0,0];
    													num=0;
    													if(isHave==1){
    														return false;
    													}
    													if(isHave ==2 || isHave ==3){
    														cc.log("1strlen="+nTcount);
    														return 0;
    													}
    													this.nShunPosition = [lastn,0,0,0,0];
    												}
    												if(isHave ==2||isHave == 3){
    													return  nTcount;
    												}
    											}
    										}

    										if(isHave == 1){
    											this.nShunPosition=[0,0,0,0,0];
    											this.nPosition=[0,0,0,0,0];
    											return true;
    										}
    										else if(isHave == 0){
    											return true;
    										}
    									}
    								}

    							}
    							if(Knum>this.nPockerMax - 2){
    								cc.log("d-Knum>10-1");
    								cc.log("4444this.nShunPosition[2]="+this.nShunPosition[2])
    								if((this.pokecard[this.nShunPosition[2]]%16)==(this.pokecard[this.nShunPosition[2]+1]%16)){
    									cc.log("d-Knum>10-2");
    									this.nShunPosition[2] = this.nShunPosition[2]+1;
    									Knum = this.nShunPosition[2];
    									Jnum = this.nShunPosition[2];
    									if(this.nShunPosition[2]>this.nPockerMax - 3){
    										if((this.pokecard[this.nShunPosition[1]]%16)==(this.pokecard[this.nShunPosition[1]+1]%16)){
    											cc.log("d-Knum>10-3");
    											this.nShunPosition[1] = this.nShunPosition[1]+1;
    											Jnum = this.nShunPosition[1];
    											num = this.nShunPosition[1];
    											if(this.nShunPosition[1]>this.nPockerMax - 4){
    												this.nShunPosition[0] = this.nShunPosition[0]+1;
    												this.nShunPosition[1]=this.nShunPosition[0]+1;
    												this.nShunPosition[2]=this.nShunPosition[1]+1;
    												this.nShunPosition[3]=this.nShunPosition[2]+1;
    												this.nShunPosition[4]=this.nShunPosition[3]+1;
    												this.nPosition=[this.nShunPosition[0],0,0,0,0];
    												num = this.nShunPosition[0];
    												if(this.nShunPosition[0]>8){
    													this.nShunPosition = [0,0,0,0,0];
    													num=0;
    													if(isHave==1){
    														return false;
    													}
    													if(isHave ==2 || isHave ==3){
    														cc.log("1strlen="+nTcount);
    														return 0;
    													}
    													this.nShunPosition = [lastn,0,0,0,0];
    												}
    											}
    										}
    										else{
    											cc.log("d-Knum>10-4");
    											this.nShunPosition[0] = this.nShunPosition[0]+1;
    											cc.log("d-Knum>10-4this.nShunPosition[0] ="+this.nShunPosition[0]);
    											this.nShunPosition[1]=this.nShunPosition[0]+1;
    											this.nShunPosition[2]=this.nShunPosition[1]+1;
    											this.nShunPosition[3]=this.nShunPosition[2]+1;
    											this.nShunPosition[4]=this.nShunPosition[3]+1;
    											this.nPosition=[this.nShunPosition[0],0,0,0,0];
    											num = this.nShunPosition[0];
    											if(this.nShunPosition[0]>8){
    												this.nShunPosition = [0,0,0,0,0];
    												num=0;
    												if(isHave==1){
    													return false;
    												}
    												if(isHave==2 || isHave ==3){
    													cc.log("2strlen="+nTcount);
    													return 0;
    												}
    												this.nShunPosition = [lastn,0,0,0,0];
    												break;
    											}
    										}

    									}

    								}
    								else{
    									cc.log("d-Knum>10-5");
    									if((this.pokecard[this.nShunPosition[1]]%16)==(this.pokecard[this.nShunPosition[1]+1]%16)){
    										this.nShunPosition[1] = this.nShunPosition[1]+1;
    										Jnum = this.nShunPosition[1];
    										num = this.nShunPosition[1];
    										if(this.nShunPosition[1]>9){
    											this.nShunPosition[0] = this.nShunPosition[0]+1;
    											this.nShunPosition[1]=this.nShunPosition[0]+1;
    											this.nShunPosition[2]=this.nShunPosition[1]+1;
    											this.nShunPosition[3]=this.nShunPosition[2]+1;
    											this.nShunPosition[4]=this.nShunPosition[3]+1;
    											this.nPosition=[this.nShunPosition[0],0,0,0,0];
    											num = this.nShunPosition[0];
    											if(this.nShunPosition[0]>8){
    												this.nShunPosition = [0,0,0,0,0];
    												num=0;
    												if(isHave==1){
    													return false;
    												}
    												if(isHave==2 || isHave ==3){
    													cc.log("3strlen="+nTcount);
    													return 0;
    												}
    												this.nShunPosition = [lastn,0,0,0,0];
    											}

    										}
    									}
    									else{
    										this.nShunPosition[0] = this.nShunPosition[0]+1;
    										cc.log("qqqqqthis.nShunPosition[0] ="+this.nShunPosition[0]);
    										this.nShunPosition[1]=this.nShunPosition[0]+1;
    										this.nShunPosition[2]=this.nShunPosition[1]+1;
    										this.nShunPosition[3]=this.nShunPosition[2]+1;
    										this.nShunPosition[4]=this.nShunPosition[3]+1;
    										this.nPosition=[this.nShunPosition[0],0,0,0,0];
    										num = this.nShunPosition[0];
    										if(this.nShunPosition[0]>8){
    											this.nShunPosition = [0,0,0,0,0];
    											num=0;
    											if(isHave==1){
    												return false;
    											}
    											if(isHave==2 || isHave ==3){
    												cc.log("4strlen="+nTcount);
    												return 0;
    											}
    											this.nShunPosition = [lastn,0,0,0,0];
    										}

    									}
    								}
    							}

    						}

    					}
    					if(Jnum>this.nPockerMax - 4){
    						cc.log("JM>9this.nShunPosition[0] ="+this.nShunPosition[0]);
    						cc.log("JM>9this.nShunPosition[0] ="+this.nShunPosition[1]);
    						cc.log("JM>9this.nShunPosition[0] ="+this.nShunPosition[2]);
    						cc.log("JM>9this.nShunPosition[0] ="+this.nShunPosition[3]);
    						cc.log("JM>9this.nShunPosition[0] ="+this.nShunPosition[4]);
    						if((this.pokecard[this.nShunPosition[1]]%16)==(this.pokecard[this.nShunPosition[1]+1]%16)){
                                this.nShunPosition[1] = this.nShunPosition[1]+1;
                                Jnum = this.nShunPosition[1];
                                num = this.nShunPosition[1];
                                if(this.nShunPosition[1]>this.nPockerMax - 4){
                                    this.nShunPosition[0] = this.nShunPosition[0]+1;
                                    this.nShunPosition[1]=this.nShunPosition[0]+1;
                                    this.nShunPosition[2]=this.nShunPosition[1]+1;
                                    this.nShunPosition[3]=this.nShunPosition[2]+1;
                                    this.nShunPosition[4]=this.nShunPosition[3]+1;
                                    this.nPosition=[this.nShunPosition[0],0,0,0,0];
                                    num = this.nShunPosition[0];
                                    if(this.nShunPosition[0]>this.nPockerMax - 5){
                                        this.nShunPosition = [0,0,0,0,0];
                                        num=0;
                                        if(isHave==1){
                                        	return false;
                                        }
                                        if(isHave==2 || isHave ==3){
                                        	cc.log("5strlen="+nTcount);
                                        	return 0;
                                        }
                                        this.nShunPosition = [lastn,0,0,0,0];
                                        break;
                                    }
                                }
							}
							else{
                                this.nShunPosition[0] = this.nShunPosition[0]+1;
                                cc.log("XXXXXthis.nShunPosition[0] ="+this.nShunPosition[0]);
                                this.nShunPosition[1]=this.nShunPosition[0]+1;
                                this.nShunPosition[2]=this.nShunPosition[1]+1;
                                this.nShunPosition[3]=this.nShunPosition[2]+1;
                                this.nShunPosition[4]=this.nShunPosition[3]+1;
                                this.nPosition=[this.nShunPosition[0],0,0,0,0];
                                num = this.nShunPosition[0];
                                if(this.nShunPosition[0]>this.nPockerMax - 5){
                                    this.nShunPosition = [0,0,0,0,0];
                                    num=0;
                                    if(isHave==1){
                                    	return false;
                                    }
                                    if(isHave==2 || isHave ==3){
                                    	cc.log("6strlen="+nTcount);
                                    	return 0;
                                    }
                                    this.nShunPosition = [lastn,0,0,0,0];
                                }
                                break;
							}

    					}
    				}
    			}
    			else{
    				if(this.flagAll[this.nShunPosition[0]>1]){
    					this.nShunPosition[0] = this.nShunPosition[0]+1;
    					cc.log("3this.nShunPosition[0] ="+this.nShunPosition[0]);
    					this.nShunPosition[1]=this.nShunPosition[0]+1;
    					this.nShunPosition[2]=this.nShunPosition[1]+1;
    					this.nShunPosition[3]=this.nShunPosition[2]+1;
    					this.nShunPosition[4]=this.nShunPosition[3]+1;
    					this.nPosition=[this.nShunPosition[0],0,0,0,0];
    					num = this.nShunPosition[0];
    					if(this.nShunPosition[0]>this.nPockerMax - 5){
    						this.nShunPosition = [0,0,0,0,0];
    						num=0;
    						if(isHave==1){
    							return false;
    						}
    						if(isHave==2 || isHave ==3){
    							cc.log("7strlen="+nTcount);
    							return 0;
    						}
    						this.nShunPosition = [lastn,0,0,0,0];
    					}
    				}
    			}
    		}

    		if(num>this.nPockerMax - 5){
    			this.nShunPosition[0] = this.nShunPosition[0]+1;
    			cc.log("4this.nShunPosition[0] ="+this.nShunPosition[0]);
    			this.nShunPosition[1]=this.nShunPosition[0]+1;
    			this.nShunPosition[2]=this.nShunPosition[1]+1;
    			this.nShunPosition[3]=this.nShunPosition[2]+1;
    			this.nShunPosition[4]=this.nShunPosition[3]+1;
    			this.nPosition=[this.nShunPosition[0],0,0,0,0];
    			num=this.nShunPosition[0];
    			if(this.nShunPosition[0]>this.nPockerMax - 5){
    				this.nShunPosition = [0,0,0,0,0];
    				num=0;
    				if(isHave==1){
    					return false;
    				}
    				if(isHave==2 || isHave ==3){
    					cc.log("8strlen="+nTcount);
    					return 0;
    				}
    			}
    		}
    	}
    },
    // 葫芦弹起
	onSetGourdPartTwo:function(pos1,pos2,pos3,isHave){
		cc.log('0this.nGourd[1]=' + this.nGourd[1]);
		for(var num = this.nGourd[1]+1;num<this.nPockerMax;num++){
			cc.log('this.flagPair[this.nGourd[1]]='+this.nGourd[1]+num);
			if(this.flagPair[this.nGourd[1]]>0 && (this.flagPair[this.nGourd[1]]!=this.flagPair[this.nGourd[0]])){	
				cc.log('***this.flagPair[this.nGourd[1]]=' + this.flagPair[this.nGourd[1]]);
				cc.log('***this.flagPair[num]=' + this.flagPair[num]+"num="+num);
				if(this.flagPair[this.nGourd[1]] == this.flagPair[num]){
					if((this.flagAll[this.nGourd[1]]<2)&&(this.flagAll[num]<2)){
						if(isHave == 0){
							this.Card[num].setPositionY((this.cardboxSize.height*0.6)+20);
							this.Card[this.nGourd[1]].setPositionY((this.cardboxSize.height*0.6)+20);
							this.flagAll[num]=1;
							this.flagAll[this.nGourd[1]]=1;
							
							cc.log('this.nGourd[1]] = num=' + "*" +this.nGourd[1]+"%"+num);

							for(var wnum =0;wnum<this.nPockerMax;wnum++){
								if((wnum!=num)&&(wnum!=this.nGourd[1])&&(wnum!=pos1)&&(wnum!=pos2)&&(wnum!=pos3)){
									if(this.flagAll[wnum] == 1){
										this.Card[wnum].setPositionY(this.cardboxSize.height*0.6);
										this.flagAll[wnum]=0;
									}		
								}
							}

							this.nGourd[1]=this.nGourd[1]+1;

							if(this.nGourd[0]> this.nPockerMax - 5){
								if(this.nGourd[1]> this.nPockerMax - 6){
									this.nGourd=[this.nGourd[0]+1,0];
								}
							}
							cc.log('PPPPPthis.nGourd[0]] = ' +this.nGourd[0]);
							if(this.nGourd[1]>this.nPockerMax - 2){
								this.nGourd=[this.nGourd[0]+1,0];
								cc.log('PPPPPthis.nGourd[0]] = ' +this.nGourd[0]);
//								this.nGourd[0]=this.nGourd[0]+1;
//								this.nGourd = 0;
							}							
							return true;	
						}
						else{
							cc.log('222this.nGourd[1]] = num=' + "*" +this.nGourd[1]+"%"+num);
							this.nGourd=[0,0];
							return true;
						}
						
					}
					else{
						if(this.flagAll[this.nGourd[1]]>1){
							this.nGourd[1] = this.nGourd[1]+1;
							if(this.nGourd[1]>this.nPockerMax - 2){
								if(isHave == 1){
									this.nGourd[1] = 0;
									return false;
								}
								this.nGourd=[this.nGourd[0]+1,0];
								return 100;
							}
							num = this.nGourd[1];
						}
					}
				}
				else{
					this.nGourd[1] = this.nGourd[1]+1;
					
					if(this.nGourd[1]>this.nPockerMax - 2){
						cc.log('99999this.nGourd[1]]='+this.nGourd[1]+isHave);
						if(isHave == 1){
							this.nGourd = [0,0]; 
							return false;
						}
						this.nGourd=[this.nGourd[0]+1,0];
						
						return 100;
						
					}
					num=this.nGourd[1];
				}
			}
			else{
//				if(this.flagPair[this.nGourd[1]]<1){
					this.nGourd[1] = this.nGourd[1]+1;
					num = this.nGourd[1];
					cc.log('2222***###@@@'+num+this.nGourd[1]);
					if(this.nGourd[1]>this.nPockerMax - 2){
						if(isHave == 1){
							this.nGourd = [0,0]; 
							return false;
						}
						this.nGourd=[this.nGourd[0]+1,0];
						return 100;
						
					}
					num=this.nGourd[1];
//				}
			}
		}
	},
	onSetGourdUp:function(isHave){
		cc.log('this.nGourd[0]=' + this.nGourd[0]);
		cc.log('this.nGourd[1]=' + this.nGourd[1]);
		
		for(var num = this.nGourd[0]+1;num<this.nPockerMax;num++){
			if(num+1<this.nPockerMax){
				if(this.flagPair[this.nGourd[0]]>0){
					if((this.flagPair[this.nGourd[0]] == this.flagPair[num]) && (this.flagPair[num] == this.flagPair[num+1])){

						cc.log('nGourd[0]' + this.nGourd[0] + 'num' + num);

						cc.log('this.flagPair[this.nGourd[0]]' + this.flagPair[this.nGourd[0]]);
						cc.log('this.flagPair[num]' + this.flagPair[num]+"num=");
						cc.log('this.flagPair[num+1]' + this.flagPair[num+1]);
						if(this.flagAll[this.nGourd[0]]<2 && this.flagAll[num]<2 && this.flagAll[num+1]<2){
							if(this.nGourd[0]>0){
								for(var temp = 0 ; temp<this.nGourd[0] ; temp++){
									if(this.flagAll[temp]==1){
										this.Card[temp].setPositionY(this.cardboxSize.height*0.6);
										this.flagAll[temp] = 0;
									}
								}
							}
							if(isHave == 0){
								this.Card[num].setPositionY((this.cardboxSize.height*0.6)+20);
								this.Card[num+1].setPositionY((this.cardboxSize.height*0.6)+20);
								this.Card[this.nGourd[0]].setPositionY((this.cardboxSize.height*0.6)+20);
								this.flagAll[num]=1;
								this.flagAll[num+1]=1;
								this.flagAll[this.nGourd[0]]=1;	
							}
							cc.log('nGourd[0]' + this.nGourd[0] + 'num' + num);
							cc.log('222this.flagPair[this.nGourd[0]]' + this.flagPair[this.nGourd[0]]);
							cc.log('222this.flagPair[num]' + this.flagPair[num]+"num=");
							cc.log('222this.flagPair[num+1]' + this.flagPair[num+1]);
							//
							
							var rnum = 0;
							for(var wnum =0;wnum<this.nPockerMax;wnum++){
								if((wnum!=num)&&(wnum!=this.nGourd[0])&&(wnum!=num+1)){
									if(this.flagAll[wnum] == 1){
										cc.log('wnum====' + wnum + 'num=' + num + 'nthree=' + this.nGourd[0]);
										this.Card[wnum].setPositionY(this.cardboxSize.height*0.6);
										this.flagAll[wnum]=0;
									}
								}
							}
							
							var result = this.onSetGourdPartTwo(this.nGourd[0], num, num+1, isHave);
							cc.log('result='+result);
							if(result==false){
								
								if(isHave == 1){
									this.nGourd=[0,0];
									return false;
								}
								this.Card[this.nGourd[0]].setPositionY(this.cardboxSize.height*0.6);
								this.flagAll[this.nGourd[0]]=0;
								this.Card[num].setPositionY(this.cardboxSize.height*0.6);
								this.flagAll[num]=0;
								this.Card[num+1].setPositionY(this.cardboxSize.height*0.6);
								this.flagAll[num+1]=0;	
								
								if(this.nGourd[0]> this.nPockerMax - 3){
									this.nGourd = [0,0];
									num = this.nGourd[0];
								}
							}
							else{
								if(result == 100){
									if(this.nGourd[0] > this.nPockerMax - 3){
										this.nGourd[0] = 0;
									}
									num = this.nGourd[0];
								}
								else if(result== true){
									if(isHave ==1){
										cc.log('youhulu');
										this.nGourd = [0,0];
									}
									if(this.nGourd[0] > this.nPockerMax - 3){
										this.nGourd[0] = 0;
									}
									return true;
								}
							}
																												
							cc.log('3this.nThree' + this.nGourd[0] + 'num' + num);
							if(num<this.nPockerMax - 3){
								var qnum = 0;
								for(var temp =this.nGourd[0];temp<this.nPockerMax;temp++){
									for(var sum =temp +1 ; sum<this.nPockerMax;sum++){
										if((this.flagPair[temp]==this.flagPair[sum])){
											if(this.flagAll[temp]<2 && this.flagAll[sum]<2){
												for(var dnum = sum+1;dnum<this.nPockerMax;dnum++){
													if(this.flagPair[sum] == this.flagPair[dnum]){
														if(this.flagAll[dnum]<2){
															qnum =qnum+1;
														}
													}
												}
											}	
										}
									}
								}
								if(qnum == 0){
									cc.log('this.nGourd');
									this.nGourd = [0,0];
								}	
							}
//							return;
						}
						else{
							cc.log('222nThree='+this.nGourd[0]);
							if(this.flagAll[this.nGourd[0]]>1){								
								this.nGourd[0] = this.nGourd[0]+1;
								num = this.nGourd[0];
								if(this.nGourd[0]>this.nPockerMax - 3){
									this.nGourd[0] = 0;
									if(isHave == 1){
										this.nGourd = [0,0];
										return false;
									}
									this.nGourd[0] = 0;
									num = this.nGourd[0];
								}
								
								cc.log('aaaanThree=' + this.nGourd[0]);
							}
							else if(this.flagAll[num+1]>1){
								num=num+1;
							}

							cc.log('555nThree='+this.nGourd[0] + "num"+num);
						}
					}
					else{
						this.nGourd[0] = this.nGourd[0]+1;
						num = this.nGourd[0];
						cc.log('666nThree='+this.nGourd[0] + "num"+num);
						if(this.nGourd[0]>this.nPockerMax - 3){
							this.nGourd[0] = 0;
							if(isHave == 1){
								this.nGourd = [0,0];
								cc.log('666return false'+isHave);
								return false;
							}
							num = this.nGourd[0];
						}
					}
				}
				else{
					cc.log('777nGourd[0]='+this.nGourd[0] + "num"+num);
					this.nGourd[0] = this.nGourd[0]+1;
					num = this.nGourd[0];
					if(this.nGourd[0]>this.nPockerMax - 3){
						this.nGourd[0] = 0;
						if(isHave == 1){
							this.nGourd = [0,0];
							return false;
						}
						num = this.nGourd[0];
					}
				}
			}
			else{
				cc.log('888nThree='+this.nGourd[0] + "num"+num);
				this.nGourd[0] = this.nGourd[0]+1;
				num = this.nGourd[0];
				if(this.nGourd[0]> this.nPockerMax - 3){
					this.nThree = 0;
					if(isHave == 1){
						this.nGourd = [0,0];
						return false;
					}
					num = this.nGourd[0];
				}
			}
		}
		return false;
	},
	//设置铁枝弹起
	onSetIronUp:function(isHave){

		if(this.nIron> this.nPockerMax - 4){
			this.nIron = 0;
		}
		
		for(var num = this.nIron+1;num< this.nPockerMax -2;num++){
			if(this.flagAll[this.nIron]<2){
				cc.log("num="+num+"this.nIron="+this.nIron);
				if(num+2<this.nPockerMax){
					cc.log("this.pokecard[this.nIron]%16="+this.pokecard[this.nIron]%16);
					cc.log("this.pokecard[num]%16="+this.pokecard[num]%16);
					cc.log("this.pokecard[num+1]%16="+this.pokecard[num+1]%16);
					cc.log("this.pokecard[num+2]%16="+this.pokecard[num+2]%16);
					if((this.pokecard[this.nIron]%16 == this.pokecard[num]%16) && this.flagAll[num]<2 &&
							(this.pokecard[num]%16 == this.pokecard[num+1]%16)&&this.flagAll[num+1]<2 &&
							(this.pokecard[num+1]%16 ==this.pokecard[num+2]%16) && this.flagAll[num+2]<2){
						cc.log("11num="+num);
						if(isHave == 1){
							this.nIron = 0;
							return true;
						}
						else if(isHave == 0){
							cc.log("22num="+num);
							this.Card[this.nIron].setPositionY((this.cardboxSize.height*0.6)+20);
							this.Card[num].setPositionY((this.cardboxSize.height*0.6)+20);
							this.Card[num+1].setPositionY((this.cardboxSize.height*0.6)+20);
							this.Card[num+2].setPositionY((this.cardboxSize.height*0.6)+20);
							this.flagAll[this.nIron] = 1;
							this.flagAll[num] = 1;
							this.flagAll[num+1] = 1;
							this.flagAll[num+2] = 1;
							
							for(var Lnum = 0 ;Lnum<this.nPockerMax;Lnum++){
								if(this.flagAll[Lnum]==1){
									if((Lnum!=this.nIron)&&(Lnum!=num)&&(Lnum!=num+1)&&(Lnum!=num+2)){
										this.Card[Lnum].setPositionY(this.cardboxSize.height*0.6);
										this.flagAll[Lnum] = 0;
									}	
								}
							}
										
							this.nIron = this.nIron+1;
							cc.log("33num="+num + "this.nIron="+this.nIron);
										
							if(this.nIron >this.nPockerMax - 4){
								this.nIron = 0;
							}
							return;
						}								
					}
					else{
						this.nIron = this.nIron+1;
						if(this.nIron > this.nPockerMax - 4){
							if(isHave == 1){
								this.nIron = 0;
								return false;
							}
							this.nIron = 0;
						}
					}
				}
			}
			else{
				this.nIron = this.nIron+1;
				if(this.nIron >this.nPockerMax -4){
					if(isHave == 1){
						this.nIron = 0;
						return false;
					}
					this.nIron = 0;
				}
			}
		}
	},
    //设置五同弹起
    onSetWuTongUp:function(isHave){
        cc.log("五同中,我的手牌"+this.pokecard+"最大张数"+this.nPockerMax);
        if(this.nFive>(this.nPockerMax - 5)){
            this.nFive = 0;
        }

        for(var num = this.nFive+1;num<this.nPockerMax -2;num++) {
            if (this.flagAll[this.nFive] < 2) {
                cc.log("num=" + num + "this.nFive=" + this.nFive);
                if (num + 2 < this.nPockerMax) {
                    if ((this.pokecard[this.nFive] % 16 == this.pokecard[num] % 16) && this.flagAll[num] < 2 &&
                        (this.pokecard[num] % 16 == this.pokecard[num + 1] % 16) && this.flagAll[num + 1] < 2 &&
                        (this.pokecard[num + 1] % 16 == this.pokecard[num + 2] % 16) && this.flagAll[num + 2] < 2 &&
                        (this.pokecard[num + 2] % 16 == this.pokecard[num + 3] % 16) && this.flagAll[num + 3] < 2) {
                        cc.log("11num=" + num);
                        if (isHave == 1) {
                            this.nFive = 0;
                            return true;
                        }
                        else if (isHave == 0) {
                            cc.log("22num=" + num);
                            this.Card[this.nFive].setPositionY((this.cardboxSize.height * 0.6) + 20);
                            this.Card[num].setPositionY((this.cardboxSize.height * 0.6) + 20);
                            this.Card[num + 1].setPositionY((this.cardboxSize.height * 0.6) + 20);
                            this.Card[num + 2].setPositionY((this.cardboxSize.height * 0.6) + 20);
                            this.Card[num + 3].setPositionY((this.cardboxSize.height * 0.6) + 20);
                            this.flagAll[this.nFive] = 1;
                            this.flagAll[num] = 1;
                            this.flagAll[num + 1] = 1;
                            this.flagAll[num + 2] = 1;
                            this.flagAll[num + 3] = 1;

                            for (var Lnum = 0; Lnum < this.nPockerMax; Lnum++) {
                                if (this.flagAll[Lnum] == 1) {
                                    if ((Lnum != this.nFive) && (Lnum != num) && (Lnum != num + 1) && (Lnum != num + 2) && (Lnum != num + 3)) {
                                        this.Card[Lnum].setPositionY(this.cardboxSize.height * 0.6);
                                        this.flagAll[Lnum] = 0;
                                    }
                                }
                            }

                            this.nFive = this.nFive + 1;
                            cc.log("33num=" + num + "this.nFive=" + this.nFive);

                            if (this.nFive > this.nPockerMax -2) {
                                this.nFive = 0;
                            }
                            return;
                        }
                    }
                        else {
                            this.nFive = this.nFive + 1;
                            if (this.nFive > this.nPockerMax -4) {
                                if (isHave == 1) {
                                    this.nFive = 0;
                                    return false;
                                }
                                this.nFive = 0;
                            }
                        }
                    }
             }else {
                    this.nFive = this.nFive + 1;
                    if (this.nFive >this.nPockerMax -4) {
                        if (isHave == 1) {
                            this.nFive = 0;
                            return false;
                        }
                        this.nFive = 0;
                    }
                }
		}
    },
    ////////////////癞子//////////////////
	//获取鬼牌数量(包括癞子)
	getGhostCardCount:function () {
    	var nCount = 0;
    	//癞子牌数量
		if(this.laipocker.length > 0){
            for(var num = 0;num < this.nPockerMax;num++){
				if(this.pokecard[num] == this.laipocker[0] || this.pokecard[num] == this.laipocker[1]
				||this.pokecard[num] == this.laipocker[2] || this.pokecard[num] == this.laipocker[3]){
                    nCount++;
				}
            }
		}

        //鬼牌数量
        for(var num = 0;num < this.nPockerMax;num++){
            if(this.pokecard[num] == 0x4e || this.pokecard[num] == 0x4f){
                nCount++;
            }
        }

		return nCount;
    },
    //获取下方鬼牌
	getGhostCard:function () {
    	var ghostArr = [];
    	cc.log("获取鬼牌：弹起"+ this.flagAll);
    	cc.log("数值this.pokecard："+ this.pokecard);
        if(this.laipocker.length > 0){
            //癞子数量
            for(var num = 0;num < this.nPockerMax;num++){
            	if(this.flagAll[num] < 2){
                    if(this.pokecard[num] == this.laipocker[0] || this.pokecard[num] == this.laipocker[1]
                        ||this.pokecard[num] == this.laipocker[2] || this.pokecard[num] == this.laipocker[3]){
                        ghostArr.push(num);
                    }
				}
            }
        }
        //鬼牌数量
        for(var num = 0;num < this.nPockerMax;num++){
            if(this.flagAll[num] < 2){
                if(this.pokecard[num] == 0x4e || this.pokecard[num] == 0x4f){
                    ghostArr.push(num);
                }
            }
        }

        return ghostArr;
    },
    //设置掺癞子对子弹起
    onSetGhostPairUp:function(isHave){//"isHave" is 0 are upWutong else isHaveWuton;
        cc.log("癞子对子中,我的手牌"+this.pokecard+"最大张数"+this.nPockerMax);
        //癞子张数
        var nLai = this.getGhostCardCount();
        cc.log("nLaiCount == "+nLai);

        if(this.nPair> (this.nPockerMax - 2 + (nLai>2?2:nLai) )){
            cc.log("this.nPair"+this.nPair+">"+"this.nPockerMax"+(this.nPockerMax - 2 + (nLai>2?2:nLai)));
            this.nPair = 0;
        }

        for(var num = this.nPair;num < this.nPockerMax;num++) {
            if (this.flagAll[this.nPair] < 2) {
                cc.log("num=" + num + "this.nPair=" + this.nPair);
                if (num < this.nPockerMax) {
                    //两张连续相同手牌
                    if ((this.pokecard[this.nPair] % 16 == this.pokecard[num + 1] % 16) && this.flagAll[num + 1] < 2 ) {
                        cc.log("11num=" + num);
                        if (isHave == 1) {
                            this.nPair = 0;
                            return true;
                        }
                        else if (isHave == 0) {
                            cc.log("22num=" + num);
                            this.Card[this.nPair].setPositionY((this.cardboxSize.height * 0.6) + 20);
                            this.Card[num + 1].setPositionY((this.cardboxSize.height * 0.6) + 20);
                            this.flagAll[this.nPair] = 1;
                            this.flagAll[num + 1] = 1;

                            for (var Lnum = 0; Lnum < this.nPockerMax; Lnum++) {
                                if (this.flagAll[Lnum] == 1) {
                                    if ((Lnum != this.nPair) && (Lnum != num + 1) ) {
                                        this.Card[Lnum].setPositionY(this.cardboxSize.height * 0.6);
                                        this.flagAll[Lnum] = 0;
                                    }
                                }
                            }

                            this.nPair = this.nPair + 1;
                            cc.log("33num=" + num + "this.nPair=" + this.nPair);

                            if (this.nPair >= this.nPockerMax) {
                                this.nPair = 0;
                            }
                            return;
                        }
                    }
                    //一张参一鬼牌
                    else
                    if (this.nPair > this.nGhost &&
                        nLai >= 1 && this.flagAll[this.nGhost] < 2) {
                        cc.log("422num=" + num);

                        if (isHave == 1) {
                            this.nPair = 0;
                            return true;
                        }
                        else if (isHave == 0) {
                            cc.log("22num=" + num);
                            this.Card[this.nPair].setPositionY((this.cardboxSize.height * 0.6) + 20);
                            this.Card[this.nGhost].setPositionY((this.cardboxSize.height * 0.6) + 20);
                            this.flagAll[this.nPair] = 1;
                            this.flagAll[this.nGhost] = 1;

                            for (var Lnum = 0; Lnum < this.nPockerMax; Lnum++) {
                                if (this.flagAll[Lnum] == 1) {
                                    if ((Lnum != this.nPair) && (Lnum != this.nGhost)) {
                                        this.Card[Lnum].setPositionY(this.cardboxSize.height * 0.6);
                                        this.flagAll[Lnum] = 0;
                                    }
                                }
                            }

                            this.nGhost = this.nGhost + 1;

                            if(this.nGhost > nLai - 1){
                                this.nPair = this.nPair + 1;
                                this.nGhost = 0;
                            }

                            cc.log("33num=" + num + "this.nPair=" + this.nPair);

                            if (this.nPair >= this.nPockerMax ) {
                                this.nPair = 0;
                            }
                            return;
                        }
                    }
                    ///
                    else {
                        this.nPair = this.nPair + 1;
                        if (this.nPair > this.nPockerMax) {
                            if (isHave == 1) {
                                this.nPair = 0;
                                return false;
                            }
                            this.nPair = 0;
                        }
                    }
                }
            }else {
                this.nPair = this.nPair + 1;
                if (this.nPair >this.nPockerMax) {
                    if (isHave == 1) {
                        this.nPair = 0;
                        return false;
                    }
                    this.nPair = 0;
                }
            }
        }
    },
    //设置掺癞子三条弹起
    onSetGhostThreeUp:function(isHave){//"isHave" is 0 are upWutong else isHaveWuton;
        cc.log("癞子三条中,我的手牌"+this.pokecard+"最大张数"+this.nPockerMax);
        //癞子张数
        var nLai = this.getGhostCardCount();
        cc.log("nLaiCount == "+nLai);


        if(this.nThree> (this.nPockerMax - 3 + (nLai>3?3:nLai) )){
            cc.log("this.nThree"+this.nThree+">"+"this.nPockerMax"+(this.nPockerMax - 3 + (nLai>3?3:nLai)));
            this.nThree = 0;
        }

        for(var num = this.nThree;num < this.nPockerMax;num++) {
            if (this.flagAll[this.nThree] < 2) {
                cc.log("num=" + num + "this.nThree=" + this.nThree);
                if (num < this.nPockerMax) {
                    //三张连续相同手牌
                    if ((this.pokecard[this.nThree] % 16 == this.pokecard[num + 1] % 16) && this.flagAll[num + 1] < 2 &&
                        (this.pokecard[num + 1] % 16 == this.pokecard[num + 2] % 16) && this.flagAll[num + 2] < 2  ) {
                        cc.log("11num=" + num);
                        if (isHave == 1) {
                            this.nThree = 0;
                            return true;
                        }
                        else if (isHave == 0) {
                            cc.log("22num=" + num);
                            this.Card[this.nThree].setPositionY((this.cardboxSize.height * 0.6) + 20);
                            this.Card[num + 1].setPositionY((this.cardboxSize.height * 0.6) + 20);
                            this.Card[num + 2].setPositionY((this.cardboxSize.height * 0.6) + 20);
                            this.flagAll[this.nThree] = 1;
                            this.flagAll[num + 1] = 1;
                            this.flagAll[num + 2] = 1;

                            for (var Lnum = 0; Lnum < this.nPockerMax; Lnum++) {
                                if (this.flagAll[Lnum] == 1) {
                                    if ((Lnum != this.nThree) && (Lnum != num + 1) && (Lnum != num + 2)  ) {
                                        this.Card[Lnum].setPositionY(this.cardboxSize.height * 0.6);
                                        this.flagAll[Lnum] = 0;
                                    }
                                }
                            }

                            this.nThree = this.nThree + 1;
                            cc.log("33num=" + num + "this.nThree=" + this.nThree);

                            if (this.nThree >= this.nPockerMax) {
                                this.nThree = 0;
                            }
                            return;
                        }
                    }
                    //两张连续相同参一鬼牌
                    else
                    if (this.nThree > this.nGhost && (this.pokecard[this.nThree] % 16 == this.pokecard[num + 1] % 16) && this.flagAll[num + 1] < 2 &&
                        nLai >= 1 && this.flagAll[this.nGhost] < 2) {
                        cc.log("422num=" + num);

                        if (isHave == 1) {
                            this.nThree = 0;
                            return true;
                        }
                        else if (isHave == 0) {
                            cc.log("22num=" + num);
                            this.Card[this.nThree].setPositionY((this.cardboxSize.height * 0.6) + 20);
                            this.Card[num + 1].setPositionY((this.cardboxSize.height * 0.6) + 20);
                            this.Card[this.nGhost].setPositionY((this.cardboxSize.height * 0.6) + 20);
                            this.flagAll[this.nThree] = 1;
                            this.flagAll[num + 1] = 1;
                            this.flagAll[this.nGhost] = 1;

                            for (var Lnum = 0; Lnum < this.nPockerMax; Lnum++) {
                                if (this.flagAll[Lnum] == 1) {
                                    if ((Lnum != this.nThree) && (Lnum != num + 1) && (Lnum != this.nGhost)) {
                                        this.Card[Lnum].setPositionY(this.cardboxSize.height * 0.6);
                                        this.flagAll[Lnum] = 0;
                                    }
                                }
                            }

                            this.nGhost = this.nGhost + 1;

                            if(this.nGhost > nLai - 1){
                                this.nThree = this.nThree + 1;
                                this.nGhost = 0;
                            }

                            cc.log("33num=" + num + "this.nThree=" + this.nThree);

                            if (this.nThree >= this.nPockerMax ) {
                                this.nThree = 0;
                            }
                            return;
                        }
                    }
                    //一张参两鬼牌
                    else
                    if (this.nThree > this.nGhost + 1 &&
                        nLai >= 2 && this.flagAll[this.nGhost] < 2 && this.flagAll[this.nGhost + 1] < 2 ) {
                        cc.log("22num=" + num);

                        if (isHave == 1) {
                            this.nThree = 0;
                            return true;
                        }
                        else if (isHave == 0) {
                            cc.log("322num=" + num);
                            this.Card[this.nThree].setPositionY((this.cardboxSize.height * 0.6) + 20);
                            this.Card[this.nGhost].setPositionY((this.cardboxSize.height * 0.6) + 20);
                            this.Card[this.nGhost + 1].setPositionY((this.cardboxSize.height * 0.6) + 20);
                            this.flagAll[this.nThree] = 1;
                            this.flagAll[this.nGhost] = 1;
                            this.flagAll[this.nGhost + 1] = 1;

                            for (var Lnum = 0; Lnum < this.nPockerMax; Lnum++) {
                                if (this.flagAll[Lnum] == 1) {
                                    if ((Lnum != this.nThree)  && (Lnum != this.nGhost) && (Lnum != this.nGhost + 1)) {
                                        this.Card[Lnum].setPositionY(this.cardboxSize.height * 0.6);
                                        this.flagAll[Lnum] = 0;
                                    }
                                }
                            }

                            this.nGhost = this.nGhost + 1;

                            if(this.nGhost + 1 > nLai - 1){
                                this.nThree = this.nThree + 1;
                                this.nGhost = 0;
                            }

                            cc.log("33num=" + num + "this.nThree=" + this.nThree);

                            if (this.nThree >= this.nPockerMax ) {
                                this.nThree = 0;
                            }
                            return;
                        }
                    }
                   ///
                    else {
                        this.nThree = this.nThree + 1;
                        if (this.nThree > this.nPockerMax) {
                            if (isHave == 1) {
                                this.nThree = 0;
                                return false;
                            }
                            this.nThree = 0;
                        }
                    }
                }
            }else {
                this.nThree = this.nThree + 1;
                if (this.nThree >this.nPockerMax) {
                    if (isHave == 1) {
                        this.nThree = 0;
                        return false;
                    }
                    this.nThree = 0;
                }
            }
        }

        if(this.nPair> (this.nPockerMax - 2 + (nLai>2?2:nLai) )){
            cc.log("this.nPair"+this.nPair+">"+"this.nPockerMax"+(this.nPockerMax - 2 + (nLai>2?2:nLai)));
            this.nThree += 1;
        }

        for(var num = this.nPair;num < this.nPockerMax;num++) {
            if (this.flagAll[this.nPair] < 2) {
                cc.log("num=" + num + "this.nPair=" + this.nPair);
                if (num < this.nPockerMax) {
                    //两张连续相同手牌
                    if ((this.pokecard[this.nPair] % 16 == this.pokecard[num + 1] % 16) && this.flagAll[num + 1] < 2 ) {
                        cc.log("11num=" + num);
                        if (isHave == 1) {
                            this.nPair = 0;
                            return true;
                        }
                        else if (isHave == 0) {
                            cc.log("22num=" + num);
                            this.Card[this.nPair].setPositionY((this.cardboxSize.height * 0.6) + 20);
                            this.Card[num + 1].setPositionY((this.cardboxSize.height * 0.6) + 20);
                            this.flagAll[this.nPair] = 1;
                            this.flagAll[num + 1] = 1;

                            for (var Lnum = 0; Lnum < this.nPockerMax; Lnum++) {
                                if (this.flagAll[Lnum] == 1) {
                                    if ((Lnum != this.nPair) && (Lnum != num + 1) ) {
                                        this.Card[Lnum].setPositionY(this.cardboxSize.height * 0.6);
                                        this.flagAll[Lnum] = 0;
                                    }
                                }
                            }

                            this.nPair = this.nPair + 1;
                            cc.log("33num=" + num + "this.nPair=" + this.nPair);

                            if (this.nPair >= this.nPockerMax) {
                                this.nPair = 0;
                            }
                            return;
                        }
                    }
                    //一张参一鬼牌
                    else
                    if (this.nPair > this.nGhost &&
                        nLai >= 1 && this.flagAll[this.nGhost] < 2) {
                        cc.log("422num=" + num);

                        if (isHave == 1) {
                            this.nPair = 0;
                            return true;
                        }
                        else if (isHave == 0) {
                            cc.log("22num=" + num);
                            this.Card[this.nPair].setPositionY((this.cardboxSize.height * 0.6) + 20);
                            this.Card[this.nGhost].setPositionY((this.cardboxSize.height * 0.6) + 20);
                            this.flagAll[this.nPair] = 1;
                            this.flagAll[this.nGhost] = 1;

                            for (var Lnum = 0; Lnum < this.nPockerMax; Lnum++) {
                                if (this.flagAll[Lnum] == 1) {
                                    if ((Lnum != this.nPair) && (Lnum != this.nGhost)) {
                                        this.Card[Lnum].setPositionY(this.cardboxSize.height * 0.6);
                                        this.flagAll[Lnum] = 0;
                                    }
                                }
                            }

                            this.nGhost = this.nGhost + 1;

                            if(this.nGhost > nLai - 1){
                                this.nPair = this.nPair + 1;
                                this.nGhost = 0;
                            }

                            cc.log("33num=" + num + "this.nPair=" + this.nPair);

                            if (this.nPair >= this.nPockerMax ) {
                                this.nPair = 0;
                            }
                            return;
                        }
                    }
                    ///
                    else {
                        this.nPair = this.nPair + 1;
                        if (this.nPair > this.nPockerMax) {
                            if (isHave == 1) {
                                this.nPair = 0;
                                return false;
                            }
                            this.nPair = 0;
                        }
                    }
                }
            }else {
                this.nPair = this.nPair + 1;
                if (this.nPair >this.nPockerMax) {
                    if (isHave == 1) {
                        this.nPair = 0;
                        return false;
                    }
                    this.nPair = 0;
                }
            }
        }
    },
    //设置掺癞子顺子弹起(待解决)
    onSetGhostShunziUp:function(isHave){//"isHave" is 0 are upWutong else isHaveWuton;
        cc.log("癞子顺子中,我的手牌"+this.pokecard+"最大张数"+this.nPockerMax);
        //癞子张数
        var nLai = this.getGhostCardCount();
        cc.log("nLaiCount == "+nLai);

        if(this.nShunNum> (this.nPockerMax - 5 + (nLai>5?5:nLai) )){
            cc.log("this.nShunNum"+this.nShunNum+">"+"this.nPockerMax"+(this.nPockerMax - 5 + (nLai>5?5:nLai)));
            this.nShunNum = 0;
        }

		// //找到顺子组
        // for(var num = this.nShunNum;num < this.nPockerMax;num++) {
         //    if (this.flagAll[this.nShunNum] < 2) {
         //        cc.log("num=" + num + "this.nShunNum=" + this.nShunNum);
        //
         //        var nsesrch = 1;
         //        if (num + nsesrch < this.nPockerMax) {
         //            if () {
        //
         //            }
         //        } else {
         //            break;
         //        }
         //    }
		// }




        // for(var num = this.nShunNum;num < this.nPockerMax;num++) {
        //     if (this.flagAll[this.nShunNum] < 2) {
        //         cc.log("num=" + num + "this.nShunNum=" + this.nShunNum);
        //         if (num < this.nPockerMax) {
        //             //五张连续顺子手牌
        //             if ((this.pokecard[this.nShunNum] % 16 == this.pokecard[num + 1] % 16) && this.flagAll[num + 1] < 2 &&
        //                 (this.pokecard[num + 1] % 16 == this.pokecard[num + 2] % 16) && this.flagAll[num + 2] < 2 &&
        //                 (this.pokecard[num + 2] % 16 == this.pokecard[num + 3] % 16) && this.flagAll[num + 3] < 2 &&
        //                 (this.pokecard[num + 3] % 16 == this.pokecard[num + 4] % 16) && this.flagAll[num + 4] < 2) {
        //                 cc.log("11num=" + num);
        //                 if (isHave == 1) {
        //                     this.nShunNum = 0;
        //                     return true;
        //                 }
        //                 else if (isHave == 0) {
        //                     cc.log("22num=" + num);
        //                     this.Card[this.nShunNum].setPositionY((this.cardboxSize.height * 0.6) + 20);
        //                     this.Card[num + 1].setPositionY((this.cardboxSize.height * 0.6) + 20);
        //                     this.Card[num + 2].setPositionY((this.cardboxSize.height * 0.6) + 20);
        //                     this.Card[num + 3].setPositionY((this.cardboxSize.height * 0.6) + 20);
        //                     this.Card[num + 4].setPositionY((this.cardboxSize.height * 0.6) + 20);
        //                     this.flagAll[this.nShunNum] = 1;
        //                     this.flagAll[num + 1] = 1;
        //                     this.flagAll[num + 2] = 1;
        //                     this.flagAll[num + 3] = 1;
        //                     this.flagAll[num + 4] = 1;
        //
        //                     for (var Lnum = 0; Lnum < this.nPockerMax; Lnum++) {
        //                         if (this.flagAll[Lnum] == 1) {
        //                             if ((Lnum != this.nShunNum) && (Lnum != num + 1) && (Lnum != num + 2) && (Lnum != num + 3) && (Lnum != num + 4)) {
        //                                 this.Card[Lnum].setPositionY(this.cardboxSize.height * 0.6);
        //                                 this.flagAll[Lnum] = 0;
        //                             }
        //                         }
        //                     }
        //
        //                     this.nShunNum = this.nShunNum + 1;
        //                     cc.log("33num=" + num + "this.nShunNum=" + this.nShunNum);
        //
        //                     if (this.nShunNum >= this.nPockerMax) {
        //                         this.nShunNum = 0;
        //                     }
        //                     return;
        //                 }
        //             }
        //             //四张连续顺子参一鬼牌
        //             else
        //             if (this.nShunNum > this.nGhost && (this.pokecard[this.nShunNum] % 16 == this.pokecard[num + 1] % 16) && this.flagAll[num + 1] < 2 &&
        //                 (this.pokecard[num + 1] % 16 == this.pokecard[num + 2] % 16) && this.flagAll[num + 2] < 2 &&
        //                 (this.pokecard[num + 2] % 16 == this.pokecard[num + 3] % 16) && this.flagAll[num + 3] < 2 &&
        //                 nLai >= 1 && this.flagAll[this.nGhost] < 2) {
        //                 cc.log("422num=" + num);
        //
        //                 if (isHave == 1) {
        //                     this.nShunNum = 0;
        //                     return true;
        //                 }
        //                 else if (isHave == 0) {
        //                     cc.log("22num=" + num);
        //                     this.Card[this.nShunNum].setPositionY((this.cardboxSize.height * 0.6) + 20);
        //                     this.Card[num + 1].setPositionY((this.cardboxSize.height * 0.6) + 20);
        //                     this.Card[num + 2].setPositionY((this.cardboxSize.height * 0.6) + 20);
        //                     this.Card[num + 3].setPositionY((this.cardboxSize.height * 0.6) + 20);
        //                     //this.Card[num + 3].setPositionY((this.cardboxSize.height * 0.6) + 20);
        //                     this.Card[this.nGhost].setPositionY((this.cardboxSize.height * 0.6) + 20);
        //                     this.flagAll[this.nShunNum] = 1;
        //                     this.flagAll[num + 1] = 1;
        //                     this.flagAll[num + 2] = 1;
        //                     this.flagAll[num + 3] = 1;
        //                     this.flagAll[this.nGhost] = 1;
        //
        //                     for (var Lnum = 0; Lnum < this.nPockerMax; Lnum++) {
        //                         if (this.flagAll[Lnum] == 1) {
        //                             if ((Lnum != this.nShunNum) && (Lnum != num + 1) && (Lnum != num + 2) && (Lnum != num + 3) && (Lnum != this.nGhost)) {
        //                                 this.Card[Lnum].setPositionY(this.cardboxSize.height * 0.6);
        //                                 this.flagAll[Lnum] = 0;
        //                             }
        //                         }
        //                     }
        //
        //                     this.nGhost = this.nGhost + 1;
        //
        //                     if(this.nGhost > nLai - 1){
        //                         this.nShunNum = this.nShunNum + 1;
        //                         this.nGhost = 0;
        //                     }
        //
        //                     cc.log("33num=" + num + "this.nShunNum=" + this.nShunNum);
        //
        //                     if (this.nShunNum >= this.nPockerMax ) {
        //                         this.nShunNum = 0;
        //                     }
        //                     return;
        //                 }
        //             }
        //             //三张连续相同参两鬼牌
        //             else
        //             if (this.nShunNum > this.nGhost + 1 &&(this.pokecard[this.nShunNum] % 16 == this.pokecard[num + 1] % 16) && this.flagAll[num + 1] < 2 &&
        //                 (this.pokecard[num + 1] % 16 == this.pokecard[num + 2] % 16) && this.flagAll[num + 2] < 2 &&
        //                 nLai >= 2 && this.flagAll[this.nGhost] < 2 && this.flagAll[this.nGhost + 1] < 2 ) {
        //                 cc.log("22num=" + num);
        //
        //                 if (isHave == 1) {
        //                     this.nShunNum = 0;
        //                     return true;
        //                 }
        //                 else if (isHave == 0) {
        //                     cc.log("322num=" + num);
        //                     this.Card[this.nShunNum].setPositionY((this.cardboxSize.height * 0.6) + 20);
        //                     this.Card[num + 1].setPositionY((this.cardboxSize.height * 0.6) + 20);
        //                     this.Card[num + 2].setPositionY((this.cardboxSize.height * 0.6) + 20);
        //                     this.Card[this.nGhost].setPositionY((this.cardboxSize.height * 0.6) + 20);
        //                     this.Card[this.nGhost + 1].setPositionY((this.cardboxSize.height * 0.6) + 20);
        //                     this.flagAll[this.nShunNum] = 1;
        //                     this.flagAll[num + 1] = 1;
        //                     this.flagAll[num + 2] = 1;
        //                     this.flagAll[this.nGhost] = 1;
        //                     this.flagAll[this.nGhost + 1] = 1;
        //
        //                     for (var Lnum = 0; Lnum < this.nPockerMax; Lnum++) {
        //                         if (this.flagAll[Lnum] == 1) {
        //                             if ((Lnum != this.nShunNum) && (Lnum != num + 1) && (Lnum != num + 2) && (Lnum != this.nGhost) && (Lnum != this.nGhost + 1)) {
        //                                 this.Card[Lnum].setPositionY(this.cardboxSize.height * 0.6);
        //                                 this.flagAll[Lnum] = 0;
        //                             }
        //                         }
        //                     }
        //
        //                     this.nGhost = this.nGhost + 1;
        //
        //                     if(this.nGhost + 1 > nLai - 1){
        //                         this.nShunNum = this.nShunNum + 1;
        //                         this.nGhost = 0;
        //                     }
        //
        //                     cc.log("33num=" + num + "this.nShunNum=" + this.nShunNum);
        //
        //                     if (this.nShunNum >= this.nPockerMax ) {
        //                         this.nShunNum = 0;
        //                     }
        //                     return;
        //                 }
        //             }
        //             //两张连续相同参三鬼牌
        //             else
        //             if (this.nShunNum > this.nGhost + 2 &&(this.pokecard[this.nShunNum] % 16 == this.pokecard[num + 1] % 16) && this.flagAll[num + 1] < 2 &&
        //                 nLai >= 3 && this.flagAll[this.nGhost] < 2 && this.flagAll[this.nGhost + 1] < 2 && this.flagAll[this.nGhost + 2] < 2) {
        //                 cc.log("222num=" + num);
        //
        //                 if (isHave == 1) {
        //                     this.nShunNum = 0;
        //                     return true;
        //                 }
        //                 else if (isHave == 0) {
        //                     cc.log("22num=" + num);
        //                     this.Card[this.nShunNum].setPositionY((this.cardboxSize.height * 0.6) + 20);
        //                     this.Card[num + 1].setPositionY((this.cardboxSize.height * 0.6) + 20);
        //                     this.Card[this.nGhost].setPositionY((this.cardboxSize.height * 0.6) + 20);
        //                     this.Card[this.nGhost + 1].setPositionY((this.cardboxSize.height * 0.6) + 20);
        //                     this.Card[this.nGhost + 2].setPositionY((this.cardboxSize.height * 0.6) + 20);
        //                     this.flagAll[this.nShunNum] = 1;
        //                     this.flagAll[num + 1] = 1;
        //                     this.flagAll[this.nGhost] = 1;
        //                     this.flagAll[this.nGhost + 1] = 1;
        //                     this.flagAll[this.nGhost + 2] = 1;
        //
        //                     for (var Lnum = 0; Lnum < this.nPockerMax; Lnum++) {
        //                         if (this.flagAll[Lnum] == 1) {
        //                             if ((Lnum != this.nShunNum) && (Lnum != num + 1) && (Lnum != this.nGhost) && (Lnum != this.nGhost + 1) && (Lnum != this.nGhost + 2)) {
        //                                 this.Card[Lnum].setPositionY(this.cardboxSize.height * 0.6);
        //                                 this.flagAll[Lnum] = 0;
        //                             }
        //                         }
        //                     }
        //
        //                     this.nGhost = this.nGhost + 1;
        //
        //                     if(this.nGhost + 2 > nLai - 1){
        //                         this.nShunNum = this.nShunNum + 1;
        //                         this.nGhost = 0;
        //                     }
        //
        //                     cc.log("33num=" + num + "this.nShunNum=" + this.nShunNum);
        //
        //                     if (this.nShunNum >= this.nPockerMax) {
        //                         this.nShunNum = 0;
        //                     }
        //                     return;
        //                 }
        //             }
        //             //一张参四张鬼牌
        //             else
        //             if (this.nShunNum > this.nGhost + 3 && nLai >= 3 && this.flagAll[this.nGhost] < 2 &&
        //                 this.flagAll[this.nGhost + 1] < 2 && this.flagAll[this.nGhost + 2] < 2 && this.flagAll[this.nGhost + 3] < 2) {
        //                 cc.log("122num=" + num);
        //
        //                 if (isHave == 1) {
        //                     this.nShunNum = 0;
        //                     return true;
        //                 }
        //                 else if (isHave == 0) {
        //                     cc.log("22num=" + num);
        //                     this.Card[this.nShunNum].setPositionY((this.cardboxSize.height * 0.6) + 20);
        //                     this.Card[this.nGhost].setPositionY((this.cardboxSize.height * 0.6) + 20);
        //                     this.Card[this.nGhost + 1].setPositionY((this.cardboxSize.height * 0.6) + 20);
        //                     this.Card[this.nGhost + 2].setPositionY((this.cardboxSize.height * 0.6) + 20);
        //                     this.Card[this.nGhost + 3].setPositionY((this.cardboxSize.height * 0.6) + 20);
        //                     this.flagAll[this.nShunNum] = 1;
        //                     this.flagAll[this.nGhost] = 1;
        //                     this.flagAll[this.nGhost + 1] = 1;
        //                     this.flagAll[this.nGhost + 2] = 1;
        //                     this.flagAll[this.nGhost + 3] = 1;
        //
        //                     for (var Lnum = 0; Lnum < this.nPockerMax; Lnum++) {
        //                         if (this.flagAll[Lnum] == 1) {
        //                             if ((Lnum != this.nShunNum) && (Lnum != this.nGhost) && (Lnum != this.nGhost + 1) && (Lnum != this.nGhost + 2) && (Lnum != this.nGhost + 3)) {
        //                                 this.Card[Lnum].setPositionY(this.cardboxSize.height * 0.6);
        //                                 this.flagAll[Lnum] = 0;
        //                             }
        //                         }
        //                     }
        //
        //                     this.nGhost = this.nGhost + 1;
        //
        //                     if(this.nGhost + 3 > nLai - 1){
        //                         this.nShunNum = this.nShunNum + 1;
        //                         this.nGhost = 0;
        //                     }
        //
        //                     cc.log("33num=" + num + "this.nShunNum=" + this.nShunNum);
        //
        //                     if (this.nShunNum >= this.nPockerMax) {
        //                         this.nShunNum = 0;
        //                     }
        //                     return;
        //                 }
        //             }
        //             ////
        //             else {
        //                 this.nShunNum = this.nShunNum + 1;
        //                 if (this.nShunNum > this.nPockerMax -4) {
        //                     if (isHave == 1) {
        //                         this.nShunNum = 0;
        //                         return false;
        //                     }
        //                     this.nShunNum = 0;
        //                 }
        //             }
        //         }
        //     }else {
        //         this.nShunNum = this.nShunNum + 1;
        //         if (this.nShunNum >this.nPockerMax -4) {
        //             if (isHave == 1) {
        //                 this.nShunNum = 0;
        //                 return false;
        //             }
        //             this.nShunNum = 0;
        //         }
        //     }
        // }
    },
    //设置掺癞子同花弹起
    onSetGhostTonghuaUP :function(isHave){
        cc.log("癞子同花中,我的手牌"+this.pokecard+"最大张数"+this.nPockerMax);
        //癞子张数
        var nLai = this.getGhostCardCount();
        cc.log("nLaiCount == "+nLai+"nTong"+this.nTong);

        if (this.nTong >= this.nPockerMax - 5 + (nLai > 5 ? 5 : nLai)) {
            this.nTong = 0;
        }

        if(this.nSign == 0) {
            this.nSign = nLai;
        }
        if((parseInt(this.pokecard[this.nSign] / 16) != parseInt(this.pokecard[this.nTong] / 16)) && this.nSign != this.nTong ){
            for(var num = this.nSign + 1;num <= this.nTong;num++ ){
                if((parseInt(this.pokecard[num] / 16) == parseInt(this.pokecard[this.nSign] / 16))){
                    this.nSign = num;
                    break;
                }
            }
		}

        for(var num = this.nTong;num<this.nPockerMax;num++){
			if(this.flagAll[num]<2) {
                cc.log("num=" + num + "this.nTong=" + this.nTong+"this.nSign"+this.nSign + "this.nGHost"+this.nGhost);
                var nTongCont = [0, 0, 0, 0, 0];//储存同花数组
                nTongCont[0] = num;
                var nCount = 0;
                var nComeType = 0;
                var nTempSign = 0;

                //五张鬼牌单独处理
                if (nLai >= 5 && this.nGhost + 4 < nLai && this.nTong < nLai && this.flagAll[this.nGhost] < 2 &&  this.flagAll[this.nGhost + 1] < 2 && this.flagAll[this.nGhost + 2] < 2
                    && this.flagAll[this.nGhost + 3] < 2 && this.flagAll[this.nGhost + 4] < 2 ) {
                    nComeType = 5;
                    this.Card[this.nGhost].setPositionY((this.cardboxSize.height * 0.6) + 20);
                    this.Card[this.nGhost + 1].setPositionY((this.cardboxSize.height * 0.6) + 20);
                    this.Card[this.nGhost + 2].setPositionY((this.cardboxSize.height * 0.6) + 20);
                    this.Card[this.nGhost + 3].setPositionY((this.cardboxSize.height * 0.6) + 20);
                    this.Card[this.nGhost + 4].setPositionY((this.cardboxSize.height * 0.6) + 20);
                    this.flagAll[this.nGhost] = 1;
                    this.flagAll[this.nGhost + 1] = 1;
                    this.flagAll[this.nGhost + 2] = 1;
                    this.flagAll[this.nGhost + 3] = 1;
                    this.flagAll[this.nGhost + 4] = 1;

                    nTongCont[nCount] = this.nGhost;
                    nTongCont[nCount + 1] = this.nGhost + 1;
                    nTongCont[nCount + 2] = this.nGhost + 2;
                    nTongCont[nCount + 3] = this.nGhost + 3;
                    nTongCont[nCount + 4] = this.nGhost + 4;

                    nCount = nCount + 4;

                }
                //一张牌加四个鬼牌
                else if (nLai >= 4 && (this.nSign == this.nTong ||  (parseInt(this.pokecard[num] / 16) != parseInt(this.pokecard[this.nSign] / 16) ))
                     && this.nGhost + 3 < nLai && this.flagAll[num] < 2 && this.flagAll[this.nGhost] < 2  && this.flagAll[this.nGhost + 1] < 2 &&
                    this.flagAll[this.nGhost + 2] < 2 && this.flagAll[this.nGhost + 3] < 2  ){
                    nComeType = 4;
                    this.Card[num].setPositionY((this.cardboxSize.height * 0.6) + 20);
                    this.Card[this.nGhost].setPositionY((this.cardboxSize.height * 0.6) + 20);
                    this.Card[this.nGhost + 1].setPositionY((this.cardboxSize.height * 0.6) + 20);
                    this.Card[this.nGhost + 2].setPositionY((this.cardboxSize.height * 0.6) + 20);
                    this.Card[this.nGhost + 3].setPositionY((this.cardboxSize.height * 0.6) + 20);
                    this.flagAll[num] = 1;
                    this.flagAll[this.nGhost] = 1;
                    this.flagAll[this.nGhost + 1] = 1;
                    this.flagAll[this.nGhost + 2] = 1;
                    this.flagAll[this.nGhost + 3] = 1;

                    nTongCont[nCount] = num;
                    nTongCont[nCount + 1] = this.nGhost;
                    nTongCont[nCount + 2] = this.nGhost + 1;
                    nTongCont[nCount + 3] = this.nGhost + 2;
                    nTongCont[nCount + 4] = this.nGhost + 3;

                    nCount = nCount + 4;
                }//两张相连同花加三张鬼牌
                 //三张相连同花加两张鬼牌
                 //四张相连同花加一张鬼牌
                 //////五个相连的同花牌色
				else if(this.nTong >= nLai + 1)//同花的标记至少是第二个
				{
					nComeType = 3;
					for(var Jnum = this.nTong - 1;Jnum >= this.nSign;Jnum--){
						if( this.flagAll[Jnum] < 2 && (parseInt(this.pokecard[num] / 16) == parseInt(this.pokecard[Jnum] / 16)) ){
							this.Card[Jnum].setPositionY((this.cardboxSize.height * 0.6) + 20);
							this.flagAll[Jnum] = 1;
							nTongCont[nCount + 1] = Jnum;
							nCount = nCount + 1;
						}

						if(nCount >= 4){break;};
					}

					this.Card[num].setPositionY((this.cardboxSize.height * 0.6) + 20);
					this.flagAll[num] = 1;

					if(nCount == 3 && nLai >= 1 && this.flagAll[this.nGhost] < 2){
						this.Card[this.nGhost].setPositionY((this.cardboxSize.height * 0.6) + 20);
						this.flagAll[this.nGhost] = 1;
						nTongCont[nCount + 1] = this.nGhost;
						nCount = nCount + 1;
						cc.log("进入nCount == 3");
					}else if(nCount == 2 && nLai >= 2 && this.flagAll[this.nGhost] < 2 && this.flagAll[this.nGhost + 1] < 2){
						this.Card[this.nGhost].setPositionY((this.cardboxSize.height * 0.6) + 20);
						this.Card[this.nGhost + 1].setPositionY((this.cardboxSize.height * 0.6) + 20);
						this.flagAll[this.nGhost] = 1;
						this.flagAll[this.nGhost + 1] = 1;
						nTongCont[nCount + 1] = this.nGhost;
						nTongCont[nCount + 2] = this.nGhost + 1;
						nCount = nCount + 2;
						cc.log("进入nCount == 2");
					}
					else if(nCount == 1 && nLai >= 2 && this.flagAll[this.nGhost] < 2 && this.flagAll[this.nGhost + 1] < 2 && this.flagAll[this.nGhost + 2] < 2){
						this.Card[this.nGhost].setPositionY((this.cardboxSize.height * 0.6) + 20);
						this.Card[this.nGhost + 1].setPositionY((this.cardboxSize.height * 0.6) + 20);
						this.Card[this.nGhost + 2].setPositionY((this.cardboxSize.height * 0.6) + 20);
						this.flagAll[this.nGhost] = 1;
						this.flagAll[this.nGhost + 1] = 1;
						this.flagAll[this.nGhost + 2] = 1;
						nTongCont[nCount + 1] = this.nGhost;
						nTongCont[nCount + 2] = this.nGhost + 1;
						nTongCont[nCount + 3] = this.nGhost + 2;
						nCount = nCount + 3;
						cc.log("进入nCount == 1");
					}
				}

				// 	if (nLai >= 3 && (this.flagAll[Jnum + 1] < 2) && (parseInt(this.pokecard[num] / 16) == parseInt(this.pokecard[Jnum + 1] / 16))
				// 	 ) {
				//     nComeType = 3;
				//     if(nCount < 2){
				//         nCount = nCount + 1;
				//         this.Card[num].setPositionY((this.cardboxSize.height * 0.6) + 20);
				//         this.Card[Jnum + 1].setPositionY((this.cardboxSize.height * 0.6) + 20);
				//         this.flagAll[num] = 1;
				//         this.flagAll[Jnum + 1] = 1;
                //
				//         nTongCont[nCount] = Jnum + 1;
                //
				//     }else{
				//         this.Card[this.nGhost].setPositionY((this.cardboxSize.height * 0.6) + 20);
				//         this.Card[this.nGhost + 1].setPositionY((this.cardboxSize.height * 0.6) + 20);
				//         this.Card[this.nGhost + 2].setPositionY((this.cardboxSize.height * 0.6) + 20);
				//         this.flagAll[this.nGhost] = 1;
				//         this.flagAll[this.nGhost + 1] = 1;
				//         this.flagAll[this.nGhost + 2] = 1;
                //
				//         nTongCont[nCount] = this.nGhost;
				//         nTongCont[nCount + 1] = this.nGhost + 1;
				//         nTongCont[nCount + 2] = this.nGhost + 2;
                //
				//         nCount = nCount + 3;
				//     }
                //
				// }

                // for (var Jnum = nLai; Jnum < this.nTong; Jnum++) {
                //     //一张牌加四个鬼牌
                //     else
                //     	if ( nLai >= 4 && Jnum >= nLai - 1 && this.flagAll[Jnum] < 2 && this.flagAll[this.nGhost] < 2  && this.flagAll[this.nGhost + 1] < 2 &&
					// 		this.flagAll[this.nGhost + 2] < 2 && this.flagAll[this.nGhost + 3] < 2  ){
                //         nComeType = 4;
					// 	this.Card[Jnum].setPositionY((this.cardboxSize.height * 0.6) + 20);
					// 	this.Card[this.nGhost].setPositionY((this.cardboxSize.height * 0.6) + 20);
					// 	this.Card[this.nGhost + 1].setPositionY((this.cardboxSize.height * 0.6) + 20);
					// 	this.Card[this.nGhost + 2].setPositionY((this.cardboxSize.height * 0.6) + 20);
					// 	this.Card[this.nGhost + 3].setPositionY((this.cardboxSize.height * 0.6) + 20);
					// 	this.flagAll[Jnum] = 1;
					// 	this.flagAll[this.nGhost] = 1;
					// 	this.flagAll[this.nGhost + 1] = 1;
					// 	this.flagAll[this.nGhost + 2] = 1;
					// 	this.flagAll[this.nGhost + 3] = 1;
                //
					// 	nTongCont[nCount] = Jnum;
					// 	nTongCont[nCount + 1] = this.nGhost;
					// 	nTongCont[nCount + 2] = this.nGhost + 1;
					// 	nTongCont[nCount + 3] = this.nGhost + 2;
					// 	nTongCont[nCount + 4] = this.nGhost + 3;
                //
					// 	nCount = nCount + 4;
                //     }
                //     //两个相连的顺子加三个鬼牌
                //     //else
                //     // 	if (nLai >= 3 && (this.flagAll[Jnum + 1] < 2) && (parseInt(this.pokecard[num] / 16) == parseInt(this.pokecard[Jnum + 1] / 16))
					// 	// 	 ) {
                //     //     nComeType = 3;
                //     //     if(nCount < 2){
                //     //         nCount = nCount + 1;
                //     //         this.Card[num].setPositionY((this.cardboxSize.height * 0.6) + 20);
                //     //         this.Card[Jnum + 1].setPositionY((this.cardboxSize.height * 0.6) + 20);
                //     //         this.flagAll[num] = 1;
                //     //         this.flagAll[Jnum + 1] = 1;
                //     //
                //     //         nTongCont[nCount] = Jnum + 1;
                //     //
                //     //     }else{
                //     //         this.Card[this.nGhost].setPositionY((this.cardboxSize.height * 0.6) + 20);
                //     //         this.Card[this.nGhost + 1].setPositionY((this.cardboxSize.height * 0.6) + 20);
                //     //         this.Card[this.nGhost + 2].setPositionY((this.cardboxSize.height * 0.6) + 20);
                //     //         this.flagAll[this.nGhost] = 1;
                //     //         this.flagAll[this.nGhost + 1] = 1;
                //     //         this.flagAll[this.nGhost + 2] = 1;
                //     //
                //     //         nTongCont[nCount] = this.nGhost;
                //     //         nTongCont[nCount + 1] = this.nGhost + 1;
                //     //         nTongCont[nCount + 2] = this.nGhost + 2;
                //     //
                //     //         nCount = nCount + 3;
                //     //     }
                //     //
                //     // }
                //
                //
                //     //五个相连的顺子
                //     // else
                //     // if ((this.flagAll[num] < 2) && (this.flagAll[Jnum] < 2) && (parseInt(this.pokecard[num] / 16) == parseInt(this.pokecard[Jnum] / 16) && num != Jnum ) ) {
                //     //     nCount = nCount + 1;
                //     //     nComeType = 0;
                //     //     this.Card[num].setPositionY((this.cardboxSize.height * 0.6) + 20);
                //     //     this.Card[Jnum].setPositionY((this.cardboxSize.height * 0.6) + 20);
                //     //     this.flagAll[num] = 1;
                //     //     this.flagAll[Jnum] = 1;
                //     //
                //     //     nTongCont[nCount] = Jnum;
                //     //
                //     // }
                //
                //     if (nCount >= 4) {
                //         if (isHave == 0) {
                //             for (var Lnum = 0; Lnum < this.nPockerMax; Lnum++) {
                //                 if (this.flagAll[Lnum] == 1) {
                //                     if (Lnum != nTongCont[0] && Lnum != nTongCont[1] && Lnum != nTongCont[2] && Lnum != nTongCont[3] && Lnum != nTongCont[4]) {
                //                         this.Card[Lnum].setPositionY(this.cardboxSize.height * 0.6);
                //                         this.flagAll[Lnum] = 0;
                //                     }
                //                 }
                //             }
                //
                //            if(nComeType == 0){
                //                this.nTong = this.nTong + 4;
                //                if(this.nTong >= this.nPockerMax - 5){
                //                    this.nTong = 0;
					// 		   }
					// 	   }else {
                //                this.nGhost= this.nGhost + 1;
                //                if(this.nGhost  + (nComeType - 1)  > nLai - 1){
                //                    this.nTong = this.nTong + 1;
                //                    this.nGhost = 0;
                //                }
					// 	   }
					// 		cc.log("nTong=" + this.nTong+"nGhost"+this.nGhost+"鬼牌张数"+nComeType);
                //
                //             return;
                //         }
                //         else if (isHave == 1) {//只是判断有没有同花
                //             for (var Lnum = 0; Lnum < this.nPockerMax; Lnum++) {
                //                 if (this.flagAll[Lnum] == 1) {
                //                     this.Card[Lnum].setPositionY(this.cardboxSize.height * 0.6);
                //                     this.flagAll[Lnum] = 0;
                //                 }
                //             }
                //             this.nTong = 0;
                //             this.nGhost = 0;
                //             return true;
                //         }
                //     }
                // }

                if (nCount >= 4) {
                    if (isHave == 0) {
                        for (var Lnum = 0; Lnum < this.nPockerMax; Lnum++) {
                            if (this.flagAll[Lnum] == 1) {
                                if (Lnum != nTongCont[0] && Lnum != nTongCont[1] && Lnum != nTongCont[2] && Lnum != nTongCont[3] && Lnum != nTongCont[4]) {
                                    this.Card[Lnum].setPositionY(this.cardboxSize.height * 0.6);
                                    this.flagAll[Lnum] = 0;
                                }
                            }
                        }
                        cc.log("1nTong=" + this.nTong +"癞子索引" +"num"+num+"nSing"+this.nSign+ this.nGhost+"鬼牌类别"+nComeType);
                        if(nComeType == 0){
                           this.nTong = this.nTong + 1;
                        }else if(nComeType == 3){
                            this.nGhost= this.nGhost + 1;
                            if(this.nGhost  + (nComeType - 1)  > nLai - 1){
                                this.nGhost = 0;
                                if(this.nSign > this.nTong){
                                    this.nTong = this.nTong + 1;
                                    this.nSign = 0;
                                }else {
                                    for(var num = this.nSign + 1;num <= this.nTong;num++){
                                        if((parseInt(this.pokecard[num] / 16) == parseInt(this.pokecard[this.nSign] / 16))){
                                            this.nSign = num;
                                            break;
                                        }
                                    }
								}
                            }
                            //五张都弹起另外处理
							if(num - this.nSign == 4){
                                for(var num = this.nSign + 1;num < this.nTong;num++){
                                    if((parseInt(this.pokecard[num] / 16) == parseInt(this.pokecard[this.nSign] / 16))){
                                        this.nSign = num;
                                        break;
                                    }
                                }

                            	this.nGhost = 0;
							}
                            cc.log("2nTong=" + this.nTong +"癞子索引" +"num"+num+"nSing"+this.nSign+ this.nGhost+"鬼牌类别"+nComeType);

                        }else if(nComeType == 4){
                            this.nGhost= this.nGhost + 1;
                            if(this.nGhost  + (nComeType - 1)  > nLai - 1){
                                this.nTong = this.nTong + 1;
                                this.nSign = 0;
                                this.nGhost = 0;
                            }
                        }else if(nComeType == 5){
                           this.nGhost= this.nGhost + 1;
                           if(this.nGhost  + (nComeType - 1)  > nLai - 1){
                               this.nTong = nLai;
                               this.nSign = 0;
                               this.nGhost = 0;
                           }
                        }

                        // this.nGhost= this.nGhost + 1;
                        // if(this.nGhost  + 4  >= nLai){
                        //     this.nTong = this.nTong + 1;
                        //     this.nGhost = 0;
                        // }

                        // this.nGhost= this.nGhost + 1;
                       //
					   // if(this.nGhost  + nComeType  > nLai ){
						//    this.nTong = num;
						//    this.nGhost = 0;
					   // }

                        cc.log("nTong=" + this.nTong +"癞子索引" +"num"+num+"nSing"+this.nSign+ this.nGhost+"鬼牌类别"+nComeType);

                        return;
                    }
                    else if (isHave == 1) {//只是判断有没有同花
                        for (var Lnum = 0; Lnum < this.nPockerMax; Lnum++) {
                            if (this.flagAll[Lnum] == 1) {
                                this.Card[Lnum].setPositionY(this.cardboxSize.height * 0.6);
                                this.flagAll[Lnum] = 0;
                            }
                        }
                        this.nTong = 0;
                        return true;
                    }
                }

                //最后一张牌还没找到同花重新再来
                if(nCount < 4 && num + 1 >= this.nPockerMax){
                    this.nTong = 0;
                    this.nGhost = 0;
                    this.nSign = 0;
                }
            }else {

                this.nTong = this.nTong + 1;
                if (this.nTong >= this.nPockerMax - 5 + (nLai > 5 ? 5 : nLai)) {
                    if (isHave == 1) {
                        this.nTong = 0;
                        this.nGhost = 0;
                        this.nSign = 0;
                        return false;
                    }
                    this.nTong = 0;
                    this.nGhost = 0;
                    this.nSign = 0;
                }
            }
         }
    },
    // //设置掺癞子同花弹起
    // onSetGhostTonghuaUP :function(isHave){
    //     cc.log("癞子同花中,我的手牌"+this.pokecard+"最大张数"+this.nPockerMax);
    //     //癞子张数
    //     var nLai = this.getGhostCardCount();
    //     cc.log("nLaiCount == "+nLai+"nTong"+this.nTong);
    //
    //     if (this.nTong >= this.nPockerMax - 5 + (nLai > 5 ? 5 : nLai)) {
    //         this.nTong = 0;
    //     }
    //
    //     for(var num = this.nTong;num<this.nPockerMax;num++){
    //         //从最后一张癞子开始算
    //         if(this.nTong == 0){
    //             this.nTong = nLai -1;
    //         }
    //
    //         if(this.flagAll[num]<2) {
    //             cc.log("num=" + num + "this.nTong=" + this.nTong);
    //             var nTongCont = [0, 0, 0, 0, 0];//储存同花数组
    //             nTongCont[0] = num;
    //             var nCount = 0;
    //             var nComeType = 0;
    //
    //             for (var Jnum = num; Jnum < this.nPockerMax; Jnum++) {
    //
    //                 //五个鬼牌
    //                 if (nLai >= 5 && this.nGhost + 4 < nLai && this.nTong == nLai - 1 && this.flagAll[this.nGhost] < 2 &&  this.flagAll[this.nGhost + 1] < 2 && this.flagAll[this.nGhost + 2] < 2
    //                     && this.flagAll[this.nGhost + 3] < 2 && this.flagAll[this.nGhost + 4] < 2 ) {
    //                     nComeType = 5;
    //                     this.Card[this.nGhost].setPositionY((this.cardboxSize.height * 0.6) + 20);
    //                     this.Card[this.nGhost + 1].setPositionY((this.cardboxSize.height * 0.6) + 20);
    //                     this.Card[this.nGhost + 2].setPositionY((this.cardboxSize.height * 0.6) + 20);
    //                     this.Card[this.nGhost + 3].setPositionY((this.cardboxSize.height * 0.6) + 20);
    //                     this.Card[this.nGhost + 4].setPositionY((this.cardboxSize.height * 0.6) + 20);
    //                     this.flagAll[this.nGhost] = 1;
    //                     this.flagAll[this.nGhost + 1] = 1;
    //                     this.flagAll[this.nGhost + 2] = 1;
    //                     this.flagAll[this.nGhost + 3] = 1;
    //                     this.flagAll[this.nGhost + 4] = 1;
    //
    //                     nTongCont[nCount] = this.nGhost;
    //                     nTongCont[nCount + 1] = this.nGhost + 1;
    //                     nTongCont[nCount + 2] = this.nGhost + 2;
    //                     nTongCont[nCount + 3] = this.nGhost + 3;
    //                     nTongCont[nCount + 4] = this.nGhost + 4;
    //
    //                     nCount = nCount + 4;
    //
    //                 }
    //                 //一张牌加四个鬼牌
    //                 else
    //                 if ( nLai >= 4 && Jnum >= nLai - 1 && this.flagAll[Jnum] < 2 && this.flagAll[this.nGhost] < 2  && this.flagAll[this.nGhost + 1] < 2 &&
    //                     this.flagAll[this.nGhost + 2] < 2 && this.flagAll[this.nGhost + 3] < 2  ){
    //                     nComeType = 4;
    //                     this.Card[Jnum].setPositionY((this.cardboxSize.height * 0.6) + 20);
    //                     this.Card[this.nGhost].setPositionY((this.cardboxSize.height * 0.6) + 20);
    //                     this.Card[this.nGhost + 1].setPositionY((this.cardboxSize.height * 0.6) + 20);
    //                     this.Card[this.nGhost + 2].setPositionY((this.cardboxSize.height * 0.6) + 20);
    //                     this.Card[this.nGhost + 3].setPositionY((this.cardboxSize.height * 0.6) + 20);
    //                     this.flagAll[Jnum] = 1;
    //                     this.flagAll[this.nGhost] = 1;
    //                     this.flagAll[this.nGhost + 1] = 1;
    //                     this.flagAll[this.nGhost + 2] = 1;
    //                     this.flagAll[this.nGhost + 3] = 1;
    //
    //                     nTongCont[nCount] = Jnum;
    //                     nTongCont[nCount + 1] = this.nGhost;
    //                     nTongCont[nCount + 2] = this.nGhost + 1;
    //                     nTongCont[nCount + 3] = this.nGhost + 2;
    //                     nTongCont[nCount + 4] = this.nGhost + 3;
    //
    //                     nCount = nCount + 4;
    //                 }
    //                 //两个相连的顺子加三个鬼牌
    //                 //else
    //                 // 	if (nLai >= 3 && (this.flagAll[Jnum + 1] < 2) && (parseInt(this.pokecard[num] / 16) == parseInt(this.pokecard[Jnum + 1] / 16))
    //                 // 	 ) {
    //                 //     nComeType = 3;
    //                 //     if(nCount < 2){
    //                 //         nCount = nCount + 1;
    //                 //         this.Card[num].setPositionY((this.cardboxSize.height * 0.6) + 20);
    //                 //         this.Card[Jnum + 1].setPositionY((this.cardboxSize.height * 0.6) + 20);
    //                 //         this.flagAll[num] = 1;
    //                 //         this.flagAll[Jnum + 1] = 1;
    //                 //
    //                 //         nTongCont[nCount] = Jnum + 1;
    //                 //
    //                 //     }else{
    //                 //         this.Card[this.nGhost].setPositionY((this.cardboxSize.height * 0.6) + 20);
    //                 //         this.Card[this.nGhost + 1].setPositionY((this.cardboxSize.height * 0.6) + 20);
    //                 //         this.Card[this.nGhost + 2].setPositionY((this.cardboxSize.height * 0.6) + 20);
    //                 //         this.flagAll[this.nGhost] = 1;
    //                 //         this.flagAll[this.nGhost + 1] = 1;
    //                 //         this.flagAll[this.nGhost + 2] = 1;
    //                 //
    //                 //         nTongCont[nCount] = this.nGhost;
    //                 //         nTongCont[nCount + 1] = this.nGhost + 1;
    //                 //         nTongCont[nCount + 2] = this.nGhost + 2;
    //                 //
    //                 //         nCount = nCount + 3;
    //                 //     }
    //                 //
    //                 // }
    //
    //
    //                 //五个相连的顺子
    //                 // else
    //                 // if ((this.flagAll[num] < 2) && (this.flagAll[Jnum] < 2) && (parseInt(this.pokecard[num] / 16) == parseInt(this.pokecard[Jnum] / 16) && num != Jnum ) ) {
    //                 //     nCount = nCount + 1;
    //                 //     nComeType = 0;
    //                 //     this.Card[num].setPositionY((this.cardboxSize.height * 0.6) + 20);
    //                 //     this.Card[Jnum].setPositionY((this.cardboxSize.height * 0.6) + 20);
    //                 //     this.flagAll[num] = 1;
    //                 //     this.flagAll[Jnum] = 1;
    //                 //
    //                 //     nTongCont[nCount] = Jnum;
    //                 //
    //                 // }
    //
    //                 if (nCount >= 4) {
    //                     if (isHave == 0) {
    //                         for (var Lnum = 0; Lnum < this.nPockerMax; Lnum++) {
    //                             if (this.flagAll[Lnum] == 1) {
    //                                 if (Lnum != nTongCont[0] && Lnum != nTongCont[1] && Lnum != nTongCont[2] && Lnum != nTongCont[3] && Lnum != nTongCont[4]) {
    //                                     this.Card[Lnum].setPositionY(this.cardboxSize.height * 0.6);
    //                                     this.flagAll[Lnum] = 0;
    //                                 }
    //                             }
    //                         }
    //
    //                         if(nComeType == 0){
    //                             this.nTong = this.nTong + 4;
    //                             if(this.nTong >= this.nPockerMax - 5){
    //                                 this.nTong = 0;
    //                             }
    //                         }else {
    //                             this.nGhost= this.nGhost + 1;
    //                             if(this.nGhost  + (nComeType - 1)  > nLai - 1){
    //                                 this.nTong = this.nTong + 1;
    //                                 this.nGhost = 0;
    //                             }
    //                         }
    //                         cc.log("nTong=" + this.nTong+"nGhost"+this.nGhost+"鬼牌张数"+nComeType);
    //
    //                         return;
    //                     }
    //                     else if (isHave == 1) {//只是判断有没有同花
    //                         for (var Lnum = 0; Lnum < this.nPockerMax; Lnum++) {
    //                             if (this.flagAll[Lnum] == 1) {
    //                                 this.Card[Lnum].setPositionY(this.cardboxSize.height * 0.6);
    //                                 this.flagAll[Lnum] = 0;
    //                             }
    //                         }
    //                         this.nTong = 0;
    //                         this.nGhost = 0;
    //                         return true;
    //                     }
    //                 }
    //             }
    //
    //             // if (nCount >= 4) {
    //             //     if (isHave == 0) {
    //             //         for (var Lnum = 0; Lnum < this.nPockerMax; Lnum++) {
    //             //             if (this.flagAll[Lnum] == 1) {
    //             //                 if (Lnum != nTongCont[0] && Lnum != nTongCont[1] && Lnum != nTongCont[2] && Lnum != nTongCont[3] && Lnum != nTongCont[4]) {
    //             //                     this.Card[Lnum].setPositionY(this.cardboxSize.height * 0.6);
    //             //                     this.flagAll[Lnum] = 0;
    //             //                 }
    //             //             }
    //             //         }
    //             //
    //             //         if(nComeType == 0){
    //             //            this.nTong = this.nTong + 1;
    //             //         }else {
    //             //            this.nGhost= this.nGhost + 1;
    //             //            if(this.nGhost  + (nComeType - 1)  > nLai - 1){
    //             //                this.nTong = this.nTong + 1;
    //             //                this.nGhost = 0;
    //             //            }
    //             //         }
    //             //
    //             //         // this.nGhost= this.nGhost + 1;
    //             //         // if(this.nGhost  + 4  >= nLai){
    //             //         //     this.nTong = this.nTong + 1;
    //             //         //     this.nGhost = 0;
    //             //         // }
    //             //
    //             //         // this.nGhost= this.nGhost + 1;
    //             //        //
    //             //    // if(this.nGhost  + nComeType  > nLai ){
    //             // 	//    this.nTong = num;
    //             // 	//    this.nGhost = 0;
    //             //    // }
    //             //
    //             //         cc.log("nTong=" + this.nTong +"癞子索引" + this.nGhost+"鬼牌张数"+nComeType);
    //             //
    //             //         return;
    //             //     }
    //             //     else if (isHave == 1) {//只是判断有没有同花
    //             //         for (var Lnum = 0; Lnum < this.nPockerMax; Lnum++) {
    //             //             if (this.flagAll[Lnum] == 1) {
    //             //                 this.Card[Lnum].setPositionY(this.cardboxSize.height * 0.6);
    //             //                 this.flagAll[Lnum] = 0;
    //             //             }
    //             //         }
    //             //         this.nTong = 0;
    //             //         return true;
    //             //     }
    //             // }
    //
    //             //最后一张牌还没找到顺子重新再来
    //             if(nCount < 4 && num + 1 >= this.nPockerMax){
    //                 this.nTong = 0;
    //             }
    //         }else {
    //             this.nTong = this.nTong + 1;
    //             if (this.nTong >this.nPockerMax -4) {
    //                 if (isHave == 1) {
    //                     this.nTong = 0;
    //                     return false;
    //                 }
    //                 this.nTong = 0;
    //             }
    //         }
    //     }
    // },
    //设置掺癞子葫芦弹起(待解决)
    onSetGhostGourdPartTwoUp:function(isHave){//"isHave" is 0 are upWutong else isHaveWuton;
        cc.log("癞子葫芦中,我的手牌"+this.pokecard+"最大张数"+this.nPockerMax);
        //癞子张数
        var nLai = this.getGhostCardCount();
        cc.log("nLaiCount == "+nLai);

        //对子
        if(this.nPair> (this.nPockerMax - 2 + (nLai>2?2:nLai) )){
            cc.log("this.nPair"+this.nPair+">"+"this.nPockerMax"+(this.nPockerMax - 2 + (nLai>2?2:nLai)));
            this.nPair = 0;
            this.nThree = this.nThree + 1;
        }
        //三条
        if(this.nThree> (this.nPockerMax - 3 + (nLai>3?3:nLai) )){
            cc.log("this.nThree"+this.nThree+">"+"this.nPockerMax"+(this.nPockerMax - 3 + (nLai>3?3:nLai)));
            this.nThree = 0;
        }

        for(var num = this.nThree;num < this.nPockerMax;num++) {
            if (this.flagAll[this.nThree] < 2) {
                cc.log("num=" + num + "this.nThree=" + this.nThree);
                if (num < this.nPockerMax) {
                    //三张连续相同手牌
                    if ((this.pokecard[this.nThree] % 16 == this.pokecard[num + 1] % 16) && this.flagAll[num + 1] < 2 &&
                        (this.pokecard[num + 1] % 16 == this.pokecard[num + 2] % 16) && this.flagAll[num + 2] < 2  ) {
                        if (isHave == 0) {
                            cc.log("22num=" + num);
                            this.Card[this.nThree].setPositionY((this.cardboxSize.height * 0.6) + 20);
                            this.Card[num + 1].setPositionY((this.cardboxSize.height * 0.6) + 20);
                            this.Card[num + 2].setPositionY((this.cardboxSize.height * 0.6) + 20);
                            this.flagAll[this.nThree] = 1;
                            this.flagAll[num + 1] = 1;
                            this.flagAll[num + 2] = 1;

                            //this.nThree = this.nThree + 1;
                            for(var Jnum = this.nPair;Jnum < this.nPockerMax;Jnum++) {
                                if (this.flagAll[this.nPair] < 1) {
                                    cc.log("Jnum=" + Jnum + "this.nPair=" + this.nPair);
                                    if (Jnum < this.nPockerMax) {
                                        //两张连续相同手牌
                                        if ( (this.pokecard[this.nPair] % 16 == this.pokecard[Jnum + 1] % 16) &&this.flagAll[this.nPair] < 1 && this.flagAll[Jnum + 1] < 1 ) {
                                            cc.log("11Jnum=" + Jnum);
                                            if (isHave == 1) {
                                                this.nPair = 0;
                                                this.nThree = 0;
                                                return true;
                                            }
                                            else if (isHave == 0) {
                                                cc.log("22Jnum=" + Jnum);
                                                this.Card[this.nPair].setPositionY((this.cardboxSize.height * 0.6) + 20);
                                                this.Card[Jnum + 1].setPositionY((this.cardboxSize.height * 0.6) + 20);
                                                this.flagAll[this.nPair] = 1;
                                                this.flagAll[Jnum + 1] = 1;

                                                for (var LJnum = 0; LJnum < this.nPockerMax; LJnum++) {
                                                    if (this.flagAll[LJnum] == 1) {
                                                        if ((Lnum != this.nThree) && (Lnum != num + 1) && (Lnum != num + 2) &&(LJnum != this.nPair) && (LJnum != Jnum + 1) ) {
                                                            this.Card[LJnum].setPositionY(this.cardboxSize.height * 0.6);
                                                            this.flagAll[LJnum] = 0;
                                                        }
                                                    }
                                                }

                                                this.nPair = this.nPair + 1;
                                                cc.log("33Jnum=" + Jnum + "this.nPair=" + this.nPair);

                                                if (this.nPair >= this.nPockerMax) {
                                                    this.nPair = 0;
                                                    this.nThree = this.nThree + 1;
                                                }
                                                return;
                                            }
                                        }
                                        //一张参一鬼牌
                                        else
                                        if (this.nPair > this.nGhost && this.nPair != this.nThree && this.nPair != num + 1 && this.nPair != num + 2 && this.nPair != this.nThree &&
                                            nLai >= 1 && this.flagAll[this.nGhost] < 1) {
                                            cc.log("422Jnum=" + Jnum);

                                            if (isHave == 1) {
                                                this.nPair = 0;
                                                this.nThree = 0;
                                                return true;
                                            }
                                            else if (isHave == 0) {
                                                cc.log("22Jnum=" + Jnum);
                                                this.Card[this.nPair].setPositionY((this.cardboxSize.height * 0.6) + 20);
                                                this.Card[this.nGhost].setPositionY((this.cardboxSize.height * 0.6) + 20);
                                                this.flagAll[this.nPair] = 1;
                                                this.flagAll[this.nGhost] = 1;

                                                for (var LJnum = 0; LJnum < this.nPockerMax; LJnum++) {
                                                    if (this.flagAll[LJnum] == 1) {
                                                        if (Lnum != this.nThree && (Lnum != num + 1) && (Lnum != num + 2) && (LJnum != this.nPair) && (LJnum != this.nGhost)) {
                                                            this.Card[LJnum].setPositionY(this.cardboxSize.height * 0.6);
                                                            this.flagAll[LJnum] = 0;
                                                        }
                                                    }
                                                }

                                                this.nGhost = this.nGhost + 1;

                                                if(this.nGhost > nLai - 1){
                                                    this.nPair = this.nPair + 1;
                                                    this.nGhost = 0;
                                                }

                                                cc.log("33Jnum=" + Jnum + "this.nPair=" + this.nPair);

                                                if (this.nPair >= this.nPockerMax ) {
                                                    this.nPair = 0;
                                                    this.nThree = this.nThree + 1;
                                                }
                                                return;
                                            }
                                        }
                                        ///
                                        else {
                                            this.nPair = this.nPair + 1;
                                            if (this.nPair > this.nPockerMax) {
                                                if (isHave == 1) {
                                                    this.nPair = 0;
                                                    return false;
                                                }
                                                this.nPair = 0;
                                                this.nThree = this.nThree + 1;
                                            }
                                        }
                                    }
                                }else {
                                    this.nPair = this.nPair + 1;
                                    if (this.nPair >this.nPockerMax) {
                                        if (isHave == 1) {
                                            this.nPair = 0;
                                            this.nThree = 0;
                                            return false;
                                        }
                                        this.nPair = 0;
                                        this.nThree = this.nThree + 1;
                                    }
                                }
                            }
                            cc.log("33num=" + num + "this.nThree=" + this.nThree);

                            if (this.nThree >= this.nPockerMax) {
                                this.nThree = 0;
                            }
                            return;
                        }
                    }
                    //两张连续相同参一鬼牌
                    else
                    if (this.nThree > this.nGhost && (this.pokecard[this.nThree] % 16 == this.pokecard[num + 1] % 16) && this.flagAll[num + 1] < 2 &&
                        nLai >= 1 && this.flagAll[this.nGhost] < 2) {
                        cc.log("422num=" + num);

                         if (isHave == 0) {
                            cc.log("22num=" + num);
                            this.Card[this.nThree].setPositionY((this.cardboxSize.height * 0.6) + 20);
                            this.Card[num + 1].setPositionY((this.cardboxSize.height * 0.6) + 20);
                            this.Card[this.nGhost].setPositionY((this.cardboxSize.height * 0.6) + 20);
                            this.flagAll[this.nThree] = 1;
                            this.flagAll[num + 1] = 1;
                            this.flagAll[this.nGhost] = 1;

                            // for (var Lnum = 0; Lnum < this.nPockerMax; Lnum++) {
                            //     if (this.flagAll[Lnum] == 1) {
                            //         if ((Lnum != this.nThree) && (Lnum != num + 1) && (Lnum != this.nGhost)) {
                            //             this.Card[Lnum].setPositionY(this.cardboxSize.height * 0.6);
                            //             this.flagAll[Lnum] = 0;
                            //         }
                            //     }
                            // }

                            this.nGhost = this.nGhost + 1;

                            // if(this.nGhost > nLai - 1){
                            //     this.nThree = this.nThree + 1;
                            //     this.nGhost = 0;
                            // }
                            for(var Jnum = this.nPair;Jnum < this.nPockerMax;Jnum++) {
                                if (this.flagAll[this.nPair] < 1) {
                                    cc.log("Jnum=" + Jnum + "this.nPair=" + this.nPair);
                                    if (Jnum < this.nPockerMax) {
                                        //两张连续相同手牌
                                        if ( (this.pokecard[this.nPair] % 16 == this.pokecard[Jnum + 1] % 16) &&this.flagAll[this.nPair] < 1 && this.flagAll[Jnum + 1] < 1 ) {
                                            cc.log("11Jnum=" + Jnum);
                                            if (isHave == 1) {
                                                this.nPair = 0;
                                                this.nThree = 0;
                                                return true;
                                            }
                                            else if (isHave == 0) {
                                                cc.log("22Jnum=" + Jnum);
                                                this.Card[this.nPair].setPositionY((this.cardboxSize.height * 0.6) + 20);
                                                this.Card[Jnum + 1].setPositionY((this.cardboxSize.height * 0.6) + 20);
                                                this.flagAll[this.nPair] = 1;
                                                this.flagAll[Jnum + 1] = 1;

                                                for (var LJnum = 0; LJnum < this.nPockerMax; LJnum++) {
                                                    if (this.flagAll[LJnum] == 1) {
                                                        if ((Lnum != this.nThree) && (Lnum != num + 1) && (Lnum != num + 2) &&(LJnum != this.nPair) && (LJnum != Jnum + 1) ) {
                                                            this.Card[LJnum].setPositionY(this.cardboxSize.height * 0.6);
                                                            this.flagAll[LJnum] = 0;
                                                        }
                                                    }
                                                }

                                                this.nPair = this.nPair + 1;
                                                cc.log("33Jnum=" + Jnum + "this.nPair=" + this.nPair);

                                                if (this.nPair >= this.nPockerMax) {
                                                    this.nPair = 0;
                                                    this.nThree = this.nThree + 1;
                                                }
                                                return;
                                            }
                                        }
                                        //一张参一鬼牌
                                        else
                                        if (this.nPair > this.nGhost && this.nPair != this.nThree && this.nPair != num + 1 && this.nPair != num + 2 && this.nPair != this.nThree &&
                                            nLai >= 1 && this.flagAll[this.nGhost] < 1) {
                                            cc.log("422Jnum=" + Jnum);

                                            if (isHave == 1) {
                                                this.nPair = 0;
                                                this.nThree = 0;
                                                return true;
                                            }
                                            else if (isHave == 0) {
                                                cc.log("22Jnum=" + Jnum);
                                                this.Card[this.nPair].setPositionY((this.cardboxSize.height * 0.6) + 20);
                                                this.Card[this.nGhost].setPositionY((this.cardboxSize.height * 0.6) + 20);
                                                this.flagAll[this.nPair] = 1;
                                                this.flagAll[this.nGhost] = 1;

                                                for (var LJnum = 0; LJnum < this.nPockerMax; LJnum++) {
                                                    if (this.flagAll[LJnum] == 1) {
                                                        if (Lnum != this.nThree && (Lnum != num + 1) && (Lnum != num + 2) && (LJnum != this.nPair) && (LJnum != this.nGhost)) {
                                                            this.Card[LJnum].setPositionY(this.cardboxSize.height * 0.6);
                                                            this.flagAll[LJnum] = 0;
                                                        }
                                                    }
                                                }

                                                this.nGhost = this.nGhost + 1;

                                                if(this.nGhost > nLai - 1){
                                                    this.nPair = this.nPair + 1;
                                                    this.nGhost = 0;
                                                }

                                                cc.log("33Jnum=" + Jnum + "this.nPair=" + this.nPair);

                                                if (this.nPair >= this.nPockerMax ) {
                                                    this.nPair = 0;
                                                    this.nThree = this.nThree + 1;
                                                }
                                                return;
                                            }
                                        }
                                        ///
                                        else {
                                            this.nPair = this.nPair + 1;
                                            if (this.nPair > this.nPockerMax) {
                                                if (isHave == 1) {
                                                    this.nPair = 0;
                                                    this.nThree = 0;
                                                    return false;
                                                }
                                                this.nPair = 0;
                                                this.nThree = this.nThree + 1;
                                            }
                                        }
                                    }
                                }else {
                                    this.nPair = this.nPair + 1;
                                    if (this.nPair >this.nPockerMax) {
                                        if (isHave == 1) {
                                            this.nPair = 0;
                                            this.nThree = 0;
                                            return false;
                                        }
                                        this.nPair = 0;
                                        this.nThree = this.nThree + 1;
                                    }
                                }
                            }

                            cc.log("33num=" + num + "this.nThree=" + this.nThree);

                            if (this.nThree >= this.nPockerMax ) {
                                this.nThree = 0;
                            }
                            return;
                        }
                    }
                    //一张参两鬼牌
                    else
                    if (this.nThree > this.nGhost + 1 &&
                        nLai >= 2 && this.flagAll[this.nGhost] < 2 && this.flagAll[this.nGhost + 1] < 2 ) {
                        cc.log("22num=" + num);

                        if (isHave == 1) {
                            this.nThree = 0;
                            return true;
                        }
                        else if (isHave == 0) {
                            cc.log("322num=" + num);
                            this.Card[this.nThree].setPositionY((this.cardboxSize.height * 0.6) + 20);
                            this.Card[this.nGhost].setPositionY((this.cardboxSize.height * 0.6) + 20);
                            this.Card[this.nGhost + 1].setPositionY((this.cardboxSize.height * 0.6) + 20);
                            this.flagAll[this.nThree] = 1;
                            this.flagAll[this.nGhost] = 1;
                            this.flagAll[this.nGhost + 1] = 1;

                            for (var Lnum = 0; Lnum < this.nPockerMax; Lnum++) {
                                if (this.flagAll[Lnum] == 1) {
                                    if ((Lnum != this.nThree)  && (Lnum != this.nGhost) && (Lnum != this.nGhost + 1)) {
                                        this.Card[Lnum].setPositionY(this.cardboxSize.height * 0.6);
                                        this.flagAll[Lnum] = 0;
                                    }
                                }
                            }

                            this.nGhost = this.nGhost + 1;

                            if(this.nGhost + 1 > nLai - 1){
                                this.nThree = this.nThree + 1;
                                this.nGhost = 0;
                            }

                            cc.log("33num=" + num + "this.nThree=" + this.nThree);

                            if (this.nThree >= this.nPockerMax ) {
                                this.nThree = 0;
                            }
                            return;
                        }
                    }
                }
            }
        }
    },
    //设置掺癞子铁枝弹起
    onSetGhostIronUp:function(isHave){//"isHave" is 0 are upWutong else isHaveWuton;
        cc.log("癞子铁枝中,我的手牌"+this.pokecard+"最大张数"+this.nPockerMax);
        //癞子张数
        var nLai = this.getGhostCardCount();
        cc.log("nLaiCount == "+nLai);


        if(this.nIron> (this.nPockerMax - 4 + (nLai>4?4:nLai) )){
            cc.log("this.nIron"+this.nIron+">"+"this.nPockerMax"+(this.nPockerMax - 4 + (nLai>4?4:nLai)));
            this.nIron = 0;
        }

        for(var num = this.nIron;num < this.nPockerMax;num++) {
            if (this.flagAll[this.nIron] < 2) {
                cc.log("num=" + num + "this.nIron=" + this.nIron);
                if (num < this.nPockerMax) {
                    //四张连续相同手牌
                    if ((this.pokecard[this.nIron] % 16 == this.pokecard[num + 1] % 16) && this.flagAll[num + 1] < 2 &&
                        (this.pokecard[num + 1] % 16 == this.pokecard[num + 2] % 16) && this.flagAll[num + 2] < 2 &&
                        (this.pokecard[num + 2] % 16 == this.pokecard[num + 3] % 16) && this.flagAll[num + 3] < 2 ) {
                        cc.log("11num=" + num);
                        if (isHave == 1) {
                            this.nIron = 0;
                            return true;
                        }
                        else if (isHave == 0) {
                            cc.log("22num=" + num);
                            this.Card[this.nIron].setPositionY((this.cardboxSize.height * 0.6) + 20);
                            this.Card[num + 1].setPositionY((this.cardboxSize.height * 0.6) + 20);
                            this.Card[num + 2].setPositionY((this.cardboxSize.height * 0.6) + 20);
                            this.Card[num + 3].setPositionY((this.cardboxSize.height * 0.6) + 20);
                            this.flagAll[this.nIron] = 1;
                            this.flagAll[num + 1] = 1;
                            this.flagAll[num + 2] = 1;
                            this.flagAll[num + 3] = 1;

                            for (var Lnum = 0; Lnum < this.nPockerMax; Lnum++) {
                                if (this.flagAll[Lnum] == 1) {
                                    if ((Lnum != this.nIron) && (Lnum != num + 1) && (Lnum != num + 2) && (Lnum != num + 3) ) {
                                        this.Card[Lnum].setPositionY(this.cardboxSize.height * 0.6);
                                        this.flagAll[Lnum] = 0;
                                    }
                                }
                            }

                            this.nIron = this.nIron + 1;
                            cc.log("33num=" + num + "this.nIron=" + this.nIron);

                            if (this.nIron >= this.nPockerMax) {
                                this.nIron = 0;
                            }
                            return;
                        }
                    }
                    //三张连续相同参一鬼牌
                    else
                    if (this.nIron > this.nGhost && (this.pokecard[this.nIron] % 16 == this.pokecard[num + 1] % 16) && this.flagAll[num + 1] < 2 &&
                        (this.pokecard[num + 1] % 16 == this.pokecard[num + 2] % 16) && this.flagAll[num + 2] < 2 &&
                        nLai >= 1 && this.flagAll[this.nGhost] < 2) {
                        cc.log("422num=" + num);

                        if (isHave == 1) {
                            this.nIron = 0;
                            return true;
                        }
                        else if (isHave == 0) {
                            cc.log("22num=" + num);
                            this.Card[this.nIron].setPositionY((this.cardboxSize.height * 0.6) + 20);
                            this.Card[num + 1].setPositionY((this.cardboxSize.height * 0.6) + 20);
                            this.Card[num + 2].setPositionY((this.cardboxSize.height * 0.6) + 20);
                            this.Card[this.nGhost].setPositionY((this.cardboxSize.height * 0.6) + 20);
                            this.flagAll[this.nIron] = 1;
                            this.flagAll[num + 1] = 1;
                            this.flagAll[num + 2] = 1;
                            this.flagAll[this.nGhost] = 1;

                            for (var Lnum = 0; Lnum < this.nPockerMax; Lnum++) {
                                if (this.flagAll[Lnum] == 1) {
                                    if ((Lnum != this.nIron) && (Lnum != num + 1) && (Lnum != num + 2) && (Lnum != this.nGhost)) {
                                        this.Card[Lnum].setPositionY(this.cardboxSize.height * 0.6);
                                        this.flagAll[Lnum] = 0;
                                    }
                                }
                            }

                            this.nGhost = this.nGhost + 1;

                            if(this.nGhost > nLai - 1){
                                this.nIron = this.nIron + 1;
                                this.nGhost = 0;
                            }

                            cc.log("33num=" + num + "this.nIron=" + this.nIron);

                            if (this.nIron >= this.nPockerMax ) {
                                this.nIron = 0;
                            }
                            return;
                        }
                    }
                    //两张连续相同参两鬼牌
                    else
                    if (this.nIron > this.nGhost + 1 &&(this.pokecard[this.nIron] % 16 == this.pokecard[num + 1] % 16) && this.flagAll[num + 1] < 2 &&
                        nLai >= 2 && this.flagAll[this.nGhost] < 2 && this.flagAll[this.nGhost + 1] < 2 ) {
                        cc.log("22num=" + num);

                        if (isHave == 1) {
                            this.nIron = 0;
                            return true;
                        }
                        else if (isHave == 0) {
                            cc.log("322num=" + num);
                            this.Card[this.nIron].setPositionY((this.cardboxSize.height * 0.6) + 20);
                            this.Card[num + 1].setPositionY((this.cardboxSize.height * 0.6) + 20);
                            this.Card[this.nGhost].setPositionY((this.cardboxSize.height * 0.6) + 20);
                            this.Card[this.nGhost + 1].setPositionY((this.cardboxSize.height * 0.6) + 20);
                            this.flagAll[this.nIron] = 1;
                            this.flagAll[num + 1] = 1;
                            this.flagAll[this.nGhost] = 1;
                            this.flagAll[this.nGhost + 1] = 1;

                            for (var Lnum = 0; Lnum < this.nPockerMax; Lnum++) {
                                if (this.flagAll[Lnum] == 1) {
                                    if ((Lnum != this.nIron) && (Lnum != num + 1)  && (Lnum != this.nGhost) && (Lnum != this.nGhost + 1)) {
                                        this.Card[Lnum].setPositionY(this.cardboxSize.height * 0.6);
                                        this.flagAll[Lnum] = 0;
                                    }
                                }
                            }

                            this.nGhost = this.nGhost + 1;

                            if(this.nGhost + 1 > nLai - 1){
                                this.nIron = this.nIron + 1;
                                this.nGhost = 0;
                            }

                            cc.log("33num=" + num + "this.nIron=" + this.nIron);

                            if (this.nIron >= this.nPockerMax ) {
                                this.nIron = 0;
                            }
                            return;
                        }
                    }
                    //一张参三鬼牌
                    else
                    if (this.nIron > this.nGhost + 2 &&
                        nLai >= 3 && this.flagAll[this.nGhost] < 2 && this.flagAll[this.nGhost + 1] < 2 && this.flagAll[this.nGhost + 2] < 2) {
                        cc.log("222num=" + num);

                        if (isHave == 1) {
                            this.nIron = 0;
                            return true;
                        }
                        else if (isHave == 0) {
                            cc.log("22num=" + num);
                            this.Card[this.nIron].setPositionY((this.cardboxSize.height * 0.6) + 20);
                            this.Card[this.nGhost].setPositionY((this.cardboxSize.height * 0.6) + 20);
                            this.Card[this.nGhost + 1].setPositionY((this.cardboxSize.height * 0.6) + 20);
                            this.Card[this.nGhost + 2].setPositionY((this.cardboxSize.height * 0.6) + 20);
                            this.flagAll[this.nIron] = 1;
                            this.flagAll[this.nGhost] = 1;
                            this.flagAll[this.nGhost + 1] = 1;
                            this.flagAll[this.nGhost + 2] = 1;

                            for (var Lnum = 0; Lnum < this.nPockerMax; Lnum++) {
                                if (this.flagAll[Lnum] == 1) {
                                    if ((Lnum != this.nIron)  && (Lnum != this.nGhost) && (Lnum != this.nGhost + 1) && (Lnum != this.nGhost + 2)) {
                                        this.Card[Lnum].setPositionY(this.cardboxSize.height * 0.6);
                                        this.flagAll[Lnum] = 0;
                                    }
                                }
                            }

                            this.nGhost = this.nGhost + 1;

                            if(this.nGhost + 2 > nLai - 1){
                                this.nIron = this.nIron + 1;
                                this.nGhost = 0;
                            }

                            cc.log("33num=" + num + "this.nIron=" + this.nIron);

                            if (this.nIron >= this.nPockerMax) {
                                this.nIron = 0;
                            }
                            return;
                        }
                    }
                    ///
                    else {
                        this.nIron = this.nIron + 1;
                        if (this.nIron > this.nPockerMax -4) {
                            if (isHave == 1) {
                                this.nIron = 0;
                                return false;
                            }
                            this.nIron = 0;
                        }
                    }
                }
            }else {
                this.nIron = this.nIron + 1;
                if (this.nIron >this.nPockerMax -4) {
                    if (isHave == 1) {
                        this.nIron = 0;
                        return false;
                    }
                    this.nIron = 0;
                }
            }
        }
    },
	//设置掺癞子五同弹起
    onSetGhostWuTongUp:function(isHave){//"isHave" is 0 are upWutong else isHaveWuton;
        cc.log("癞子五同中,我的手牌"+this.pokecard+"最大张数"+this.nPockerMax);
        //癞子张数
		var nLai = this.getGhostCardCount();
		cc.log("nLaiCount == "+nLai);

        if(this.nFive> (this.nPockerMax - 5 + (nLai>5?5:nLai) )){
        	cc.log("this.nFive"+this.nFive+">"+"this.nPockerMax"+(this.nPockerMax - 5 + (nLai>5?5:nLai)));
            this.nFive = 0;
        }

        for(var num = this.nFive;num < this.nPockerMax;num++) {
            if (this.flagAll[this.nFive] < 2) {
                cc.log("num=" + num + "this.nFive=" + this.nFive);
                if (num < this.nPockerMax) {
                    //五张连续相同手牌
                    if ((this.pokecard[this.nFive] % 16 == this.pokecard[num + 1] % 16) && this.flagAll[num + 1] < 2 &&
                        (this.pokecard[num + 1] % 16 == this.pokecard[num + 2] % 16) && this.flagAll[num + 2] < 2 &&
                        (this.pokecard[num + 2] % 16 == this.pokecard[num + 3] % 16) && this.flagAll[num + 3] < 2 &&
                        (this.pokecard[num + 3] % 16 == this.pokecard[num + 4] % 16) && this.flagAll[num + 4] < 2) {
                        cc.log("11num=" + num);
                        if (isHave == 1) {
                            this.nFive = 0;
                            return true;
                        }
                        else if (isHave == 0) {
                            cc.log("22num=" + num);
                            this.Card[this.nFive].setPositionY((this.cardboxSize.height * 0.6) + 20);
                            this.Card[num + 1].setPositionY((this.cardboxSize.height * 0.6) + 20);
                            this.Card[num + 2].setPositionY((this.cardboxSize.height * 0.6) + 20);
                            this.Card[num + 3].setPositionY((this.cardboxSize.height * 0.6) + 20);
                            this.Card[num + 4].setPositionY((this.cardboxSize.height * 0.6) + 20);
                            this.flagAll[this.nFive] = 1;
                            this.flagAll[num + 1] = 1;
                            this.flagAll[num + 2] = 1;
                            this.flagAll[num + 3] = 1;
                            this.flagAll[num + 4] = 1;

                            for (var Lnum = 0; Lnum < this.nPockerMax; Lnum++) {
                                if (this.flagAll[Lnum] == 1) {
                                    if ((Lnum != this.nFive) && (Lnum != num + 1) && (Lnum != num + 2) && (Lnum != num + 3) && (Lnum != num + 4)) {
                                        this.Card[Lnum].setPositionY(this.cardboxSize.height * 0.6);
                                        this.flagAll[Lnum] = 0;
                                    }
                                }
                            }

                            this.nFive = this.nFive + 1;
                            cc.log("33num=" + num + "this.nFive=" + this.nFive);

                            if (this.nFive >= this.nPockerMax) {
                                this.nFive = 0;
                            }
                            return;
                        }
                    }
                    //四张连续相同参一鬼牌
                    else
						if (this.nFive > this.nGhost && (this.pokecard[this.nFive] % 16 == this.pokecard[num + 1] % 16) && this.flagAll[num + 1] < 2 &&
                        (this.pokecard[num + 1] % 16 == this.pokecard[num + 2] % 16) && this.flagAll[num + 2] < 2 &&
                        (this.pokecard[num + 2] % 16 == this.pokecard[num + 3] % 16) && this.flagAll[num + 3] < 2 &&
						nLai >= 1 && this.flagAll[this.nGhost] < 2) {
                        cc.log("422num=" + num);

                        if (isHave == 1) {
                            this.nFive = 0;
                            return true;
                        }
                        else if (isHave == 0) {
                            cc.log("22num=" + num);
                            this.Card[this.nFive].setPositionY((this.cardboxSize.height * 0.6) + 20);
                            this.Card[num + 1].setPositionY((this.cardboxSize.height * 0.6) + 20);
                            this.Card[num + 2].setPositionY((this.cardboxSize.height * 0.6) + 20);
                            this.Card[num + 3].setPositionY((this.cardboxSize.height * 0.6) + 20);
                            //this.Card[num + 3].setPositionY((this.cardboxSize.height * 0.6) + 20);
                            this.Card[this.nGhost].setPositionY((this.cardboxSize.height * 0.6) + 20);
                            this.flagAll[this.nFive] = 1;
                            this.flagAll[num + 1] = 1;
                            this.flagAll[num + 2] = 1;
                            this.flagAll[num + 3] = 1;
							this.flagAll[this.nGhost] = 1;

                            for (var Lnum = 0; Lnum < this.nPockerMax; Lnum++) {
                                if (this.flagAll[Lnum] == 1) {
                                    if ((Lnum != this.nFive) && (Lnum != num + 1) && (Lnum != num + 2) && (Lnum != num + 3) && (Lnum != this.nGhost)) {
                                        this.Card[Lnum].setPositionY(this.cardboxSize.height * 0.6);
                                        this.flagAll[Lnum] = 0;
                                    }
                                }
                            }

                            this.nGhost = this.nGhost + 1;

                            if(this.nGhost > nLai - 1){
                                this.nFive = this.nFive + 1;
                                this.nGhost = 0;
                            }

                            cc.log("33num=" + num + "this.nFive=" + this.nFive);

                            if (this.nFive >= this.nPockerMax ) {
                                this.nFive = 0;
                            }
                            return;
                        }
                    }
					//三张连续相同参两鬼牌
					else
					if (this.nFive > this.nGhost + 1 &&(this.pokecard[this.nFive] % 16 == this.pokecard[num + 1] % 16) && this.flagAll[num + 1] < 2 &&
						(this.pokecard[num + 1] % 16 == this.pokecard[num + 2] % 16) && this.flagAll[num + 2] < 2 &&
					 	nLai >= 2 && this.flagAll[this.nGhost] < 2 && this.flagAll[this.nGhost + 1] < 2 ) {
						cc.log("22num=" + num);

						if (isHave == 1) {
							this.nFive = 0;
							return true;
						}
						else if (isHave == 0) {
							cc.log("322num=" + num);
							this.Card[this.nFive].setPositionY((this.cardboxSize.height * 0.6) + 20);
							this.Card[num + 1].setPositionY((this.cardboxSize.height * 0.6) + 20);
							this.Card[num + 2].setPositionY((this.cardboxSize.height * 0.6) + 20);
							this.Card[this.nGhost].setPositionY((this.cardboxSize.height * 0.6) + 20);
                            this.Card[this.nGhost + 1].setPositionY((this.cardboxSize.height * 0.6) + 20);
							this.flagAll[this.nFive] = 1;
							this.flagAll[num + 1] = 1;
							this.flagAll[num + 2] = 1;
                            this.flagAll[this.nGhost] = 1;
							this.flagAll[this.nGhost + 1] = 1;

							for (var Lnum = 0; Lnum < this.nPockerMax; Lnum++) {
								if (this.flagAll[Lnum] == 1) {
									if ((Lnum != this.nFive) && (Lnum != num + 1) && (Lnum != num + 2) && (Lnum != this.nGhost) && (Lnum != this.nGhost + 1)) {
										this.Card[Lnum].setPositionY(this.cardboxSize.height * 0.6);
										this.flagAll[Lnum] = 0;
									}
								}
							}

							this.nGhost = this.nGhost + 1;

							if(this.nGhost + 1 > nLai - 1){
								this.nFive = this.nFive + 1;
								this.nGhost = 0;
							}

							cc.log("33num=" + num + "this.nFive=" + this.nFive);

							if (this.nFive >= this.nPockerMax ) {
								this.nFive = 0;
							}
							return;
						}
					}
                    //两张连续相同参三鬼牌
                    else
                    if (this.nFive > this.nGhost + 2 &&(this.pokecard[this.nFive] % 16 == this.pokecard[num + 1] % 16) && this.flagAll[num + 1] < 2 &&
                        nLai >= 3 && this.flagAll[this.nGhost] < 2 && this.flagAll[this.nGhost + 1] < 2 && this.flagAll[this.nGhost + 2] < 2) {
                        cc.log("222num=" + num);

                        if (isHave == 1) {
                            this.nFive = 0;
                            return true;
                        }
                        else if (isHave == 0) {
                            cc.log("22num=" + num);
                            this.Card[this.nFive].setPositionY((this.cardboxSize.height * 0.6) + 20);
                            this.Card[num + 1].setPositionY((this.cardboxSize.height * 0.6) + 20);
                            this.Card[this.nGhost].setPositionY((this.cardboxSize.height * 0.6) + 20);
                            this.Card[this.nGhost + 1].setPositionY((this.cardboxSize.height * 0.6) + 20);
                            this.Card[this.nGhost + 2].setPositionY((this.cardboxSize.height * 0.6) + 20);
                            this.flagAll[this.nFive] = 1;
                            this.flagAll[num + 1] = 1;
                            this.flagAll[this.nGhost] = 1;
                            this.flagAll[this.nGhost + 1] = 1;
                            this.flagAll[this.nGhost + 2] = 1;

                            for (var Lnum = 0; Lnum < this.nPockerMax; Lnum++) {
                                if (this.flagAll[Lnum] == 1) {
                                    if ((Lnum != this.nFive) && (Lnum != num + 1) && (Lnum != this.nGhost) && (Lnum != this.nGhost + 1) && (Lnum != this.nGhost + 2)) {
                                        this.Card[Lnum].setPositionY(this.cardboxSize.height * 0.6);
                                        this.flagAll[Lnum] = 0;
                                    }
                                }
                            }

                            this.nGhost = this.nGhost + 1;

                            if(this.nGhost + 2 > nLai - 1){
                                this.nFive = this.nFive + 1;
                                this.nGhost = 0;
                            }

                            cc.log("33num=" + num + "this.nFive=" + this.nFive);

                            if (this.nFive >= this.nPockerMax) {
                                this.nFive = 0;
                            }
                            return;
                        }
                    }
                    //一张参四张鬼牌
                    else
                    if (this.nFive > this.nGhost + 3 && nLai >= 3 && this.flagAll[this.nGhost] < 2 &&
						this.flagAll[this.nGhost + 1] < 2 && this.flagAll[this.nGhost + 2] < 2 && this.flagAll[this.nGhost + 3] < 2) {
                        cc.log("122num=" + num);

                        if (isHave == 1) {
                            this.nFive = 0;
                            return true;
                        }
                        else if (isHave == 0) {
                            cc.log("22num=" + num);
                            this.Card[this.nFive].setPositionY((this.cardboxSize.height * 0.6) + 20);
                            this.Card[this.nGhost].setPositionY((this.cardboxSize.height * 0.6) + 20);
                            this.Card[this.nGhost + 1].setPositionY((this.cardboxSize.height * 0.6) + 20);
                            this.Card[this.nGhost + 2].setPositionY((this.cardboxSize.height * 0.6) + 20);
                            this.Card[this.nGhost + 3].setPositionY((this.cardboxSize.height * 0.6) + 20);
                            this.flagAll[this.nFive] = 1;
                            this.flagAll[this.nGhost] = 1;
                            this.flagAll[this.nGhost + 1] = 1;
                            this.flagAll[this.nGhost + 2] = 1;
                            this.flagAll[this.nGhost + 3] = 1;

                            for (var Lnum = 0; Lnum < this.nPockerMax; Lnum++) {
                                if (this.flagAll[Lnum] == 1) {
                                    if ((Lnum != this.nFive) && (Lnum != this.nGhost) && (Lnum != this.nGhost + 1) && (Lnum != this.nGhost + 2) && (Lnum != this.nGhost + 3)) {
                                        this.Card[Lnum].setPositionY(this.cardboxSize.height * 0.6);
                                        this.flagAll[Lnum] = 0;
                                    }
                                }
                            }

                            this.nGhost = this.nGhost + 1;

                            if(this.nGhost + 3 > nLai - 1){
                                this.nFive = this.nFive + 1;
                                this.nGhost = 0;
                            }

                            cc.log("33num=" + num + "this.nFive=" + this.nFive);

                            if (this.nFive >= this.nPockerMax) {
                                this.nFive = 0;
                            }
                            return;
                        }
                    }
                    ////
                    else {
                        this.nFive = this.nFive + 1;
                        if (this.nFive > this.nPockerMax -4) {
                            if (isHave == 1) {
                                this.nFive = 0;
                                return false;
                            }
                            this.nFive = 0;
                        }
                    }
                }
            }else {
                this.nFive = this.nFive + 1;
                if (this.nFive >this.nPockerMax -4) {
                    if (isHave == 1) {
                        this.nFive = 0;
                        return false;
                    }
                    this.nFive = 0;
                }
            }
        }
    },
    //设置掺单癞子五同弹起
    onSetGhostWuTongUp:function(isHave){//"isHave" is 0 are upWutong else isHaveWuton;
        cc.log("单癞子五同中,我的手牌"+this.pokecard+"最大张数"+this.nPockerMax);
        //癞子张数
        var nLai = this.getGhostCardCount();
        cc.log("nLaiCount == "+nLai);

        if(this.nFive> (this.nPockerMax - 5 + (nLai>5?5:nLai) )){
            cc.log("this.nFive"+this.nFive+">"+"this.nPockerMax"+(this.nPockerMax - 5 + (nLai>5?5:nLai)));
            this.nFive = 0;
        }

        for(var num = this.nFive;num < this.nPockerMax;num++) {
            if (this.flagAll[this.nFive] < 2) {
                cc.log("num=" + num + "this.nFive=" + this.nFive);
                if (num < this.nPockerMax - 4) {
                    //五张连续相同手牌
                    if (this.nFiveCount == 5 && (this.pokecard[this.nFive] % 16 == this.pokecard[num + 1] % 16) && this.flagAll[num + 1] < 2 &&
                        (this.pokecard[num + 1] % 16 == this.pokecard[num + 2] % 16) && this.flagAll[num + 2] < 2 &&
                        (this.pokecard[num + 2] % 16 == this.pokecard[num + 3] % 16) && this.flagAll[num + 3] < 2 &&
                        (this.pokecard[num + 3] % 16 == this.pokecard[num + 4] % 16) && this.flagAll[num + 4] < 2) {
                        cc.log("11num=" + num);
                        if (isHave == 1) {
                            this.nFive = 0;
                            return true;
                        }
                        else if (isHave == 0) {
                            cc.log("22num=" + num);
                            this.Card[this.nFive].setPositionY((this.cardboxSize.height * 0.6) + 20);
                            this.Card[num + 1].setPositionY((this.cardboxSize.height * 0.6) + 20);
                            this.Card[num + 2].setPositionY((this.cardboxSize.height * 0.6) + 20);
                            this.Card[num + 3].setPositionY((this.cardboxSize.height * 0.6) + 20);
                            this.Card[num + 4].setPositionY((this.cardboxSize.height * 0.6) + 20);
                            this.flagAll[this.nFive] = 1;
                            this.flagAll[num + 1] = 1;
                            this.flagAll[num + 2] = 1;
                            this.flagAll[num + 3] = 1;
                            this.flagAll[num + 4] = 1;

                            for (var Lnum = 0; Lnum < this.nPockerMax; Lnum++) {
                                if (this.flagAll[Lnum] == 1) {
                                    if ((Lnum != this.nFive) && (Lnum != num + 1) && (Lnum != num + 2) && (Lnum != num + 3) && (Lnum != num + 4)) {
                                        this.Card[Lnum].setPositionY(this.cardboxSize.height * 0.6);
                                        this.flagAll[Lnum] = 0;
                                    }
                                }
                            }

                            this.nFive = this.nFive + 1;
                            cc.log("33num=" + num + "this.nFive=" + this.nFive);

                            if (this.nFive >= this.nPockerMax) {
                                this.nFive = 0;
                            }
                            return;
                        }
                    }
                    else {
                        this.nFive = this.nFive + 1;
                        if (this.nFive > this.nPockerMax -4) {
                            if (isHave == 1) {
                                this.nFive = 0;
                                return false;
                            }
                            this.nFive = 0;
                        }
                    }
                }
            }else {
                this.nFive = this.nFive + 1;
                if (this.nFive >this.nPockerMax -4) {
                    if (isHave == 1) {
                        this.nFive = 0;
                        return false;
                    }
                    this.nFive = 0;
                }
            }
        }
    },

    //设置掺癞子弹起
    onSetGhostUp:function(isHave,touchType){
        cc.log("你点击的牌型是"+touchType+"最大张数"+this.nPockerMax);

        if(touchType != null && touchType != this.nType){
        	cc.log("nSin == 0");
        	this.nType = touchType;
        	this.nSign = 0;
		}
        //癞子数组
        var laiArr = [];
        laiArr = this.getGhostCard();
        cc.log("laiArr == "+laiArr);

     	//清空储存数值
		this.claerStorageCount();
        //数组储存当前相同值
		if(touchType == 1 || touchType == 2 ){//对子
            this.pushEquallyCount(2);
		}
        if(touchType == 3 || touchType == 6 ){//三条
            this.pushEquallyCount(3);
        }
        if( touchType == 7){//四条
            this.pushEquallyCount(4);
        }
        if( touchType == 9){//五条
            this.pushEquallyCount(5);
        }
        //数组储存当前连顺值
        if(touchType == 4){
            this.pushOrderCount(5);
        }
        //数组储存当前同花值
        if(touchType == 5 ){//同花
            this.pushColorCount(5);
        }
        //数组储存当前同花顺值
        if(touchType == 8 ){//同花顺
            this.pushOrderColorCount();
        }

		cc.log("---------------------存下方牌组----------------------");
        cc.log("nOneArr"+JSON.stringify(this.nOneArr))
        cc.log("Two"+JSON.stringify(this.nTwoArr))
        cc.log("Three"+JSON.stringify(this.nThreeArr))
        cc.log("nFour"+JSON.stringify(this.nFourArr))
        cc.log("Five"+JSON.stringify(this.nFiveArr));

        if(isHave == 1){//判断牌型是否存在该亮起
			if(this.showPockerBright(touchType,laiArr)){
				return true;
			};
            return false;

		}else {//点击弹起
            this.showStorageCountDownAll();
            this.searchStorageCount(touchType);
        }
	},
    //压入相同数值张数(下方牌组)//maxNum 为存入相同牌型的最大值
	pushEquallyCount:function(maxNum){
        //癞子数组
        var laiArr = this.getGhostCard();
        //有癞没癞  如果有小王存在强制加 1;
        var nArr = [];
        var nCount = 0;
		var nFirst = laiArr.length;
        //当前没弹起的牌
        var pockerArr = [];
        var valueArr = [];
        for(var num = nFirst;num < this.nPockerMax;num++){
            if (this.flagAll[num] < 2) {
                pockerArr.push(num);
                valueArr.push(this.pokecard[num]);
			}
        }
        cc.log("maxNum"+maxNum);
        cc.log("pockerArr"+pockerArr);
        cc.log("valueArr"+valueArr);
        for (var num = 0; num < pockerArr.length - 1;num++) {
			if(num == 0){
				nArr.push(pockerArr[num]);
			}
			cc.log("num"+num+"pokecard"+valueArr[num]+","+valueArr[num + 1]+","+valueArr[num]%16+","+valueArr[num + 1]%16);
			if(valueArr[num] % 16 == valueArr[num + 1] % 16){
				if(nCount < maxNum){
					nArr.push(pockerArr[num + 1]);
				}
                nCount++;
			}else {
				this.searchArr(nArr.length - 1,nArr);
				nArr = [];
				nCount = 0;
				if(nCount < maxNum){
					nArr.push(pockerArr[num + 1]);
				}
			}
        }

        //旧版
		// for (var num = nFirst; num < this.nPockerMax - 1;num++) {
		// 	if (this.flagAll[num] < 2) {
		// 		if(num == nFirst){
		// 			nArr.push(num);
		// 		}
		// 		if(this.flagAll[num + 1] < 2){
		// 			cc.log("num"+num+"pokecard"+this.pokecard[num]+","+this.pokecard[num + 1]+","+this.pokecard[num]%16+","+this.pokecard[num + 1]%16);
		// 			if(this.pokecard[num] % 16 == this.pokecard[num + 1] % 16){
		// 				if(nCount < maxNum){
		// 					nArr.push(num + 1);
		// 				}
         //                nCount++;
		// 			}else {
		// 				this.searchArr(nArr.length - 1,nArr);
		// 				nArr = [];
		// 				nCount = 0;
         //                if(nCount < maxNum){
         //                    nArr.push(num + 1);
         //                }
		// 			}
		// 		}
		// 	}else {
		// 		nArr = [];
		// 	}
		// }

		cc.log("searchArr"+nArr.length -1+","+nArr)
		this.searchArr(nArr.length - 1,nArr);

	},
    //压入相同花色张数(下方牌组)//maxNum 为存入相同花色的最大值
    pushColorCount:function(maxNum) {
        //癞子数组
        var laiArr = this.getGhostCard();

        for(var num = 0;num < 4;num++){
            var nArr = [];
            var nCount = 0;
            for (var Jnum = laiArr.length; Jnum < this.nPockerMax;Jnum++) {
                if (this.flagAll[Jnum] < 2) {
					cc.log("Jnum" + Jnum + "pokecard" + this.pokecard[Jnum] + "==" + parseInt(this.pokecard[Jnum]/16));
					if (parseInt(this.pokecard[Jnum]/16) == num) {
						if (nCount < maxNum) {
							nArr.push(Jnum);
						}
						nCount++;
					}
					if(Jnum == this.nPockerMax - 1){
                        this.searchArr(nArr.length - 1, nArr);
					}
                 }
            }
        }
	},
    //压入相同连顺张数(下方牌组)//maxNum 为存入相同连顺的最大值
    pushOrderCount:function(maxNum){
        //癞子数组
        var laiArr = this.getGhostCard();
        //有癞没癞  如果有小王存在强制加 1;
        var nArr = [];
        var nCount = 0;
        for (var num = laiArr.length; num < this.nPockerMax - 1;num++) {
            if (this.flagAll[num] < 2) {
                if(num == laiArr.length){
                    nArr.push(num);
                }
                if(this.flagAll[num + 1] < 2){
                    cc.log("num"+num+"pokecard"+this.pokecard[num]+","+this.pokecard[num + 1]+","+this.pokecard[num]%16+","+this.pokecard[num + 1]%16);
                    if(this.pokecard[num] % 16 == this.pokecard[num + 1] % 16 ){
                        cc.log("1"+"Count =="+nCount);
                        continue;
                    }else if(this.pokecard[num] % 16 == (this.pokecard[num + 1] % 16) + 1){
                        cc.log("2"+"Count =="+nCount + 1);
                        nCount++;
                        if(nCount < maxNum){
                            nArr.push(num + 1);
                        }else{
                            this.searchArr(nArr.length - 1,nArr);
                            nArr = [];
                            nCount = 0;
                            nArr.push(num + 1);
						}
                    }else {
                        cc.log("3"+"Count =="+nCount+"nArr"+nArr);
                        this.searchArr(nArr.length - 1,nArr);
                        nArr = [];
                        nCount = 0;
                        if(nCount < maxNum){
                            nArr.push(num + 1);
                        }
                    }
                }
            }else {
                nArr = [];
            }
        }

        cc.log("searchArr"+nArr.length -1+","+nArr)
        this.searchArr(nArr.length - 1,nArr);

    },
    //压入相同连顺张数加同花
    pushOrderColorCount:function(){
    	cc.log("压入同花顺");
        //癞子数组
        var laiArr = this.getGhostCard();
        for(var num = 0;num < 4;num++){
            //有癞没癞  如果有小王存在强制加 1;
			cc.log("---------------num"+num+"-----------");
            var nArr = [];
            var nCount = 0;
            var bFirst = true;
            for (var Jnum = laiArr.length; Jnum < this.nPockerMax - 1;Jnum++) {
                if (this.flagAll[Jnum] < 2) {
                    if(bFirst == true && parseInt(this.pokecard[Jnum]/16) == num ){
                    	cc.log("first"+Jnum);
                        nArr.push(Jnum);
                        bFirst = false;
                    }
                    if(this.flagAll[Jnum + 1] < 2){
                        cc.log("Jnum"+Jnum+"pokecard"+this.pokecard[Jnum]+","+this.pokecard[Jnum + 1]+","+this.pokecard[Jnum]%16+","+this.pokecard[Jnum + 1]%16+"Card"+parseInt(this.pokecard[Jnum]/16)+":"+num);

                        if(this.pokecard[Jnum] % 16 == this.pokecard[Jnum + 1] % 16 && parseInt(this.pokecard[Jnum]/16) != num){
                            cc.log("1"+"Count =="+nCount);
                            continue;
                        }else if(this.pokecard[Jnum] % 16 == (this.pokecard[Jnum + 1] % 16) + 1 && parseInt(this.pokecard[Jnum + 1]/16) == num){
                            cc.log("2"+"Count =="+nCount + 1);
                            nCount = nCount + 1;
                            if(nCount < 5){
                                nArr.push(Jnum + 1);
                            }
                        }else if(this.pokecard[Jnum] % 16 != (this.pokecard[Jnum + 1] % 16) + 1 && parseInt(this.pokecard[Jnum + 1]/16) == num ){
                            this.searchArr(nArr.length - 1,nArr);
                            nArr = [];
                            nCount = 0;
							nArr.push(num + 1);
						}
                        if(Jnum == this.nPockerMax - 2){
                            this.searchArr(nArr.length - 1, nArr);
                        }
                    }
                }
            }
		}
    },
    //搜索张数(下方牌组)
    searchStorageCount:function(nSearchType){
        //癞子数组
        var laiArr = this.getGhostCard();
        cc.log("laiArr"+laiArr);
        //根据索引弹起
        var  nCount = 0;
        var FirstArr = [];
        var curArr = [];
        cc.log("1");
		var haveLai = 0;//所需的癞子(相对应5张4张3张2张1张)
        //相同的牌
        if(nSearchType == 1 ||nSearchType == 2 ||nSearchType == 3 || nSearchType == 4 || nSearchType == 5 ||nSearchType == 6 || nSearchType == 7||  nSearchType == 8|| nSearchType == 9){
			//五
            cc.log("arrr5");
        	if( nSearchType == 4 || nSearchType == 5 || nSearchType == 8|| nSearchType == 9 ){
                if(this.nFiveArr.length > 0){//五同
                    for(var num = 0;num < this.nFiveArr.length;num++){
                        if(FirstArr.length <= 0){
                            FirstArr = this.nFiveArr[num];
                        }
                        cc.log("nSing"+this.nSign);
                        if(this.nSign == nCount){
                            curArr = this.nFiveArr[num];
                            cc.log("5nSign == nCount:"+"curArr"+curArr);
                            this.showStorageCountUp(curArr);
                            this.nSign++;
                            cc.log("3"+this.nSign);
                            return;
                        }
                        nCount++;
                    }
                }
			}
            //四
            cc.log("arrr4");
        	if(nSearchType == 4 || nSearchType == 5 || nSearchType == 8|| nSearchType == 9 ){
        		haveLai = 1;
			}
			if(nSearchType == 4 || nSearchType == 5 || nSearchType == 7|| nSearchType == 8|| nSearchType == 9){
                if(this.nFourArr.length > 0){
                    if(laiArr.length >= haveLai){
                        for(var num = 0;num < this.nFourArr.length;num++){
                            if(FirstArr.length <= 0){
                                FirstArr = this.nFourArr[num];
                            	if( nSearchType == 4 || nSearchType == 5 || nSearchType == 8 ||nSearchType == 9 ){
                                    FirstArr[4] = laiArr[0];
								}
                                if(nSearchType == 7){
                                    //第四张参最小
									var OnArr = [];
									if(this.nOneArr.length > 0){
                                        OnArr = this.nOneArr[this.nOneArr.length - 1];
                                        FirstArr[4] = OnArr[0];
									}else if(this.nTwoArr.length > 0){
                                        OnArr = this.nTwoArr[this.nTwoArr.length - 1];
                                        FirstArr[4] = OnArr[0];
                                    }
                                    else if(this.nThreeArr.length > 0){
                                        OnArr = this.nThreeArr[this.nThreeArr.length - 1];
                                        FirstArr[4] = OnArr[0];
                                    }else if(this.nFourArr.length > 0){

                                    	if(num < this.nFourArr.length - 1){
                                            OnArr = this.nFourArr[this.nFourArr.length - 1];
										}else{
                                            OnArr = this.nFourArr[this.nFourArr.length - 2];
										}
                                        FirstArr[4] = OnArr[0];
                                    }
                                }
                                cc.log("fourlength:"+"FirstArr"+FirstArr);
                            }
                            cc.log("4nSign"+this.nSign+"nCount"+nCount);
                            if(this.nSign == nCount){
                                curArr = this.nFourArr[num];
                                if( nSearchType == 4 || nSearchType == 5 || nSearchType == 8 ||nSearchType == 9 ){
                                    curArr[4] = laiArr[0];
								}
                                if(nSearchType == 7){
                                    //第四张参最小
                                    var OnArr = [];
                                    if(this.nOneArr.length > 0){
                                        OnArr = this.nOneArr[this.nOneArr.length - 1];
                                        curArr[4] = OnArr[0];
                                    }else if(this.nTwoArr.length > 0){
                                        OnArr = this.nTwoArr[this.nTwoArr.length - 1];
                                        curArr[4] = OnArr[0];
                                    }
                                    else if(this.nThreeArr.length > 0){
                                        OnArr = this.nThreeArr[this.nThreeArr.length - 1];
                                        curArr[4] = OnArr[0];
                                    }else if(this.nFourArr.length > 0){

                                        if(num < this.nFourArr.length - 1){
                                            OnArr = this.nFourArr[this.nFourArr.length - 1];
                                        }else{
                                            OnArr = this.nFourArr[this.nFourArr.length - 2];
                                        }
                                        curArr[4] = OnArr[0];
                                    }
                                }
                                cc.log("4nSign == nCount:"+"curArr"+curArr);
                                this.showStorageCountUp(curArr);
                                this.nSign++;
                                cc.log("6"+this.nSign);
                                return;
                            }
                            nCount++;
                        }
                    }
                }
			}
            //三
			cc.log("arrr3");
            if(nSearchType == 4 || nSearchType == 5 || nSearchType == 8|| nSearchType == 9){
                haveLai = 2;
            }
            if(nSearchType == 7){
                haveLai = 1;
            }
            if(nSearchType == 3|| nSearchType == 4 || nSearchType == 5 || nSearchType == 6 || nSearchType == 7|| nSearchType == 8|| nSearchType == 9){
                if(this.nThreeArr.length > 0){
                    if(laiArr.length >= haveLai){
                        for(var num = 0;num < this.nThreeArr.length;num++){
                            if(FirstArr.length <= 0){
                                FirstArr = this.nThreeArr[num];
                                if(nSearchType == 4 || nSearchType == 5 || nSearchType == 8|| nSearchType == 9 ){
                                    FirstArr[3] = laiArr[0];
                                    FirstArr[4] = laiArr[1];
                                }
                                if(nSearchType == 7){
                                    FirstArr[3] = laiArr[0];
                                    //第四张参最小
                                    if(this.nOneArr.length > 0){
                                        FirstArr[4] = this.nOneArr[this.nOneArr.length - 1];
                                    }else if(this.nTwoArr.length > 0){
                                        FirstArr[4] = this.nTwoArr[this.nTwoArr.length - 1];
                                    }
                                    else if(this.nThreeArr.length > 0){
                                        FirstArr[4] = this.nThreeArr[this.nThreeArr.length - 1];
                                    }else if(this.nFourArr.length > 0){
                                        if(num < this.nFourArr.length - 1){
                                            FirstArr[4] = this.nFourArr[this.nFourArr.length - 1];
                                        }else{
                                            FirstArr[4] = this.nFourArr[this.nFourArr.length - 2];
                                        }
                                    }
                                }
                                if(nSearchType == 6){
                                    if(this.nTwoArr.length > 0){
                                        var TwoArr = this.nTwoArr[this.nTwoArr.length - 1];
                                        FirstArr[3] = TwoArr[0];
                                        FirstArr[4] = TwoArr[1];
                                    }else if(this.nThreeArr.length > 1){
                                        var TwoArr = [];
                                        if(num < this.nThreeArr.length - 1){
                                            TwoArr = this.nThreeArr[this.nThreeArr.length - 1];
                                        }else{
                                            TwoArr = this.nThreeArr[this.nThreeArr.length - 2];
                                        }
                                        cc.log("num"+num+"nThree"+this.nThreeArr.length - 1+"TwoArr"+TwoArr);
                                        FirstArr[3] = TwoArr[0];
                                        FirstArr[4] = TwoArr[1];
                                    }else if(this.nOneArr.length > 0 && laiArr.length > 0){
                                        var TwoArr = [];
                                        if(num == this.nThreeArr.length - 1){
                                            TwoArr = this.nThreeArr[this.nThreeArr.length - 2];
                                        }else{
                                            TwoArr = this.nThreeArr[this.nThreeArr.length - 1];
                                        }
                                        FirstArr[3] = this.nOneArr[this.nOneArr.length - 1];
                                        FirstArr[4] = laiArr[0];
                                    }
                                }
                                cc.log("3fourlength:"+"FirstArr"+FirstArr);
                            }
                            if(this.nSign == nCount){
                                curArr = this.nThreeArr[num];
                                if(nSearchType == 4 || nSearchType == 5 || nSearchType == 8|| nSearchType == 9 ){
                                    curArr[3] = laiArr[0];
                                    curArr[4] = laiArr[1];
                                }
                                if(nSearchType == 7){
                                    curArr[3] = laiArr[0];
                                    //第四张参最小
                                    if(this.nOneArr.length > 0){
                                        curArr[4] = this.nOneArr[this.nOneArr.length - 1];
                                    }else if(this.nTwoArr.length > 0){
                                        curArr[4] = this.nTwoArr[this.nTwoArr.length - 1];
                                    }
                                    else if(this.nThreeArr.length > 0){
                                        curArr[4] = this.nThreeArr[this.nThreeArr.length - 1];
                                    }else if(this.nFourArr.length > 0){
                                        if(num < this.nFourArr.length - 1){
                                            curArr[4] = this.nFourArr[this.nFourArr.length - 1];
                                        }else{
                                            curArr[4] = this.nFourArr[this.nFourArr.length - 2];
                                        }
                                    }
                                }
                                if(nSearchType == 6){
                                	if(this.nTwoArr.length > 0){
                                		var TwoArr = this.nTwoArr[this.nTwoArr.length - 1];
                                        curArr[3] = TwoArr[0];
                                        curArr[4] = TwoArr[1];
									}else if(this.nThreeArr.length > 1){
                                        var TwoArr = [];
                                		if(num < this.nThreeArr.length - 1){
                                            TwoArr = this.nThreeArr[this.nThreeArr.length - 1];
										}else{
                                            TwoArr = this.nThreeArr[this.nThreeArr.length - 2];
										}
                                        cc.log("num"+num+"nThree"+this.nThreeArr.length - 1+"TwoArr"+TwoArr);
                                        curArr[3] = TwoArr[0];
                                        curArr[4] = TwoArr[1];
                                    }else if(this.nOneArr.length > 0 && laiArr.length > 0){
                                        var TwoArr = [];
                                        if(num == this.nThreeArr.length - 1){
                                            TwoArr = this.nThreeArr[this.nThreeArr.length - 2];
                                        }else{
                                            TwoArr = this.nThreeArr[this.nThreeArr.length - 1];
                                        }
                                        curArr[3] = this.nOneArr[this.nOneArr.length - 1];
                                        curArr[4] = laiArr[0];
                                    }
                                }
                                cc.log("3nSign == nCount:"+"curArr"+curArr);
                                this.showStorageCountUp(curArr);
                                this.nSign++;
                                cc.log("7"+this.nSign);
                                return;
                            }
                            nCount++;
                        }
                    }
                }
			}
            //二
            cc.log("arrr2");
            if(nSearchType == 4 || nSearchType == 5 || nSearchType == 8|| nSearchType == 9){
                haveLai = 3;
            }
            if(nSearchType == 7){
                haveLai = 2;
            }
            if(nSearchType == 3 || nSearchType == 6){
                haveLai = 1;
            }
            var haveDui = 0;
            if( nSearchType == 2 ){
                if(this.nTwoArr.length - 1 == this.nSign){
                    haveDui = this.nTwoArr.length + 1;
                    // //两对特殊处理
                    // if(this.nSign != 0){
                    //     this.nSign = 0;
                    // }
				}
			}
            if( nSearchType == 1 || nSearchType == 2 ||nSearchType == 3 || nSearchType == 4 || nSearchType == 5 || nSearchType == 6 || nSearchType == 8||  nSearchType == 9) {
                if (this.nTwoArr.length > haveDui) {
                    if (laiArr.length >= haveLai) {
                        for (var num = 0; num < this.nTwoArr.length; num++) {
                            if (FirstArr.length <= 0) {
                                FirstArr = this.nTwoArr[num];
                                if (nSearchType == 4 || nSearchType == 5 || nSearchType == 8|| nSearchType == 9 ) {
                                    FirstArr[2] = laiArr[0];
                                    FirstArr[3] = laiArr[1]
                                    FirstArr[4] = laiArr[2];
                                }
                                if(nSearchType == 6){
                                    if(this.nTwoArr.length > 1){
                                        var TwoArr = [];
                                        if(num == this.nTwoArr.length - 1){
                                            TwoArr = this.nTwoArr[this.nTwoArr.length - 2];
                                        }else{
                                            TwoArr = this.nTwoArr[this.nTwoArr.length - 1];
                                        }
                                        FirstArr[2] = laiArr[0];
                                        FirstArr[3] = TwoArr[0];
                                        FirstArr[4] = TwoArr[1];
                                    }else if(this.nThreeArr.length > 0 && laiArr.length > 0){
                                        var TwoArr = this.nThreeArr[this.nThreeArr.length - 1];
                                        FirstArr[2] = laiArr[0];
                                        FirstArr[3] = TwoArr[0];
                                        FirstArr[4] = TwoArr[1];
                                    }
                                }
                                if(nSearchType == 3){
                                    FirstArr[2] = laiArr[0];
								}
                                if(nSearchType == 2) {
                                    var TwoArr = [];
                                    if (this.nTwoArr.length > 1) {
                                        if (num == this.nTwoArr.length - 1) {
                                            TwoArr = this.nTwoArr[this.nTwoArr.length - 2];
                                        } else {
                                            TwoArr = this.nTwoArr[this.nTwoArr.length - 1];
                                        }
                                        FirstArr[2] = TwoArr[0];
                                        FirstArr[3] = TwoArr[1];
                                    }
                                }
                            }
                            if (this.nSign == nCount) {
                                curArr = this.nTwoArr[num];
                                if (nSearchType == 4 || nSearchType == 5 || nSearchType == 8|| nSearchType == 9) {
                                    curArr[2] = laiArr[0];
                                    curArr[3] = laiArr[1]
                                    curArr[4] = laiArr[2];
                                }
                                if(nSearchType == 6){
                                    if(this.nTwoArr.length > 1){
                                        var TwoArr = [];
                                        if(num == this.nTwoArr.length - 1){
                                            TwoArr = this.nTwoArr[this.nTwoArr.length - 2];
                                        }else{
                                            TwoArr = this.nTwoArr[this.nTwoArr.length - 1];
                                        }
                                        curArr[2] = laiArr[0];
                                        curArr[3] = TwoArr[0];
                                        curArr[4] = TwoArr[1];
                                    }else if(this.nThreeArr.length > 0 && laiArr.length > 0){
                                        var TwoArr = this.nThreeArr[this.nThreeArr.length - 1];
                                        curArr[2] = laiArr[0];
                                        curArr[3] = TwoArr[0];
                                        curArr[4] = TwoArr[1];
                                    }
                                }
                                if(nSearchType == 3){
                                    curArr[2] = laiArr[0];
                                }
                                if(nSearchType == 2) {
                                    var TwoArr = [];
                                    if (this.nTwoArr.length > 1) {
                                        if (num == this.nTwoArr.length - 1) {
                                            TwoArr = this.nTwoArr[this.nTwoArr.length - 2];
                                        } else {
                                            TwoArr = this.nTwoArr[this.nTwoArr.length - 1];
                                        }
                                        curArr[2] = TwoArr[0];
                                        curArr[3] = TwoArr[1];
                                    }
                                }
                                cc.log("2nSign == nCount:"+"curArr"+curArr);
                                this.showStorageCountUp(curArr);
                                this.nSign++;
                                return;
                            }
                            nCount++;
                        }
                    }
                }
            }
            //一
            cc.log("arrr1");
            if(nSearchType == 4 || nSearchType == 5 || nSearchType == 8|| nSearchType == 9){
                haveLai = 4;
            }
            if(nSearchType == 3){
                haveLai = 2;
            }
            if(nSearchType == 2){
                haveLai = 1;
            }
            if(nSearchType == 1  || nSearchType == 2 ||nSearchType == 3 || nSearchType == 4 || nSearchType == 5 || nSearchType == 8|| nSearchType == 9) {
                if (this.nOneArr.length > 0) {
                    if (laiArr.length >= haveLai) {
                        for (var num = 0; num < this.nOneArr.length; num++) {
                        	cc.log("1Sign,num"+num+"FirstArr:"+FirstArr);
                            if (FirstArr.length <= 0) {
                                FirstArr = this.nOneArr[num];
                                if ( nSearchType == 4 || nSearchType == 5 || nSearchType == 8|| nSearchType == 9) {
                                    FirstArr[1] = laiArr[0];
                                    FirstArr[2] = laiArr[1]
                                    FirstArr[3] = laiArr[2];
                                    FirstArr[4] = laiArr[3];
                                }
                                if(nSearchType == 3){
                                	if(laiArr.length > 1){
                                        FirstArr[1] = laiArr[0];
                                        FirstArr[2] = laiArr[1]
									}
								}
                                if(nSearchType == 2){
                                    if(this.nTwoArr.length > 0){
                                    	var TwoArr = [];
                                        TwoArr = this.nTwoArr[0];
                                        FirstArr[1] = TwoArr[0];
                                        FirstArr[2] = TwoArr[1];
                                        FirstArr[3] = laiArr[0];
                                    }
                                }
								if(nSearchType == 1){
									if(laiArr.length > 0){
                                        FirstArr[1] = laiArr[0];
									}
								}

                            }
                            if (this.nSign == nCount) {
                                curArr = this.nOneArr[num];
                                if ( nSearchType == 4 || nSearchType == 5 || nSearchType == 8|| nSearchType == 9) {
                                    curArr[1] = laiArr[0];
                                    curArr[2] = laiArr[1]
                                    curArr[3] = laiArr[2];
                                    curArr[4] = laiArr[3];
                                }
                                if(nSearchType == 3){
                                    if(laiArr.length > 1){
                                        curArr[1] = laiArr[0];
                                        curArr[2] = laiArr[1]
                                    }
                                }
                                if(nSearchType == 2){
                                    if(this.nTwoArr.length > 0){
                                        var TwoArr = [];
                                        TwoArr = this.nTwoArr[0];
                                        curArr[1] = TwoArr[0];
                                        curArr[2] = TwoArr[1];
                                        curArr[3] = laiArr[0];
                                    }
                                }
                                if(nSearchType == 1){
                                    if(laiArr.length > 0){
                                        curArr[1] = laiArr[0];
                                    }
                                }
                                cc.log("1nSign == nCount:"+"num"+num+"curArr"+curArr);
                                this.showStorageCountUp(curArr);
                                this.nSign++;
                                return;
                            }
                            nCount++;
                        }
                    }
                }
            }
            cc.log("arrr0");
            cc.log("nSign "+this.nSign+" nCount:"+"FirstArr"+FirstArr);
            this.showStorageCountUp(FirstArr);
            this.nSign = 1;
            return;
        }

        cc.log("12");
	},
    //下方手牌落下
	showStorageCountDownAll:function () {
        for (var Lnum = 0; Lnum < this.nPockerMax; Lnum++) {
            if (this.flagAll[Lnum] == 1) {
                this.Card[Lnum].setPositionY(this.cardboxSize.height * 0.6);
                this.flagAll[Lnum] = 0
            }
        }
    },
    //牌型的亮起
	showPockerBright:function(bBright,laiArr){
        if(bBright == 9){
            if(this.nFiveArr.length > 0){
                return true;
            }else if(this.nFourArr.length > 0 && laiArr.length >= 1){
                return true;
            }else if(this.nThreeArr.length > 0 && laiArr.length >= 2){
                return true;
            }else if(this.nTwoArr.length > 0 && laiArr.length >= 3){
                return true;
            }else if(this.nOneArr.length > 0 && laiArr.length >= 4){
                return true;
            }
        }
        if(bBright == 8){//同花顺~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
            if(this.nFiveArr.length > 0){
                return true;
            }else if(this.nFourArr.length > 0 && laiArr.length >= 1){
                return true;
            }else if(this.nThreeArr.length > 0 && laiArr.length >= 2){
                return true;
            }else if(this.nTwoArr.length > 0 && laiArr.length >= 3){
                return true;
            }else if(this.nOneArr.length > 0 && laiArr.length >= 4){
                return true;
            }
        }
        if(bBright == 7){//铁枝
            if( this.nFiveArr.length > 0 || this.nFourArr.length > 0){
                return true;
            }else if(( this.nThreeArr.length > 0) && laiArr.length > 0){
                return true;
            }else if(( this.nThreeArr.length > 0|| this.nTwoArr.length > 0) && laiArr.length > 1){
                return true;
            }else if(( this.nThreeArr.length > 0|| this.nTwoArr.length > 0 || this.nOneArr.length > 0) && laiArr.length > 2){
                return true;
            }
        }
        if(bBright == 6){//葫芦~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
            if(this.nThreeArr.length > 1){
                return true;
            }else if((this.nFiveArr.length > 0 || this.nFourArr.length > 0 || this.nThreeArr.length > 0) && this.nTwoArr.length > 0){
                return true;
            }else if((this.nFiveArr.length > 0 || this.nFourArr.length > 0 || this.nThreeArr.length > 0)  && this.nOneArr.length > 0 && laiArr.length > 0){
                return true;
            }else if(this.nTwoArr.length > 1 && laiArr.length >= 1){
                return true;
            }
        }
        if(bBright == 4 || bBright == 5){//同花顺子~~~~~~~~~~~~~~~~~~~~~~~
            if(this.nFiveArr.length > 0){
                return true;
            }else if(this.nFourArr.length > 0 && laiArr.length > 0){
                return true;
            }else if(this.nThreeArr.length > 0 && laiArr.length > 1){
                return true;
            }else if(this.nTwoArr.length > 0 && laiArr.length > 2){
                return true;
            }else if(this.nOneArr.length > 0 && laiArr.length > 3){
                return true;
            }
        }
        if(bBright == 3){//三条~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
            if(this.nThreeArr.length > 0){
                return true;
            }else if(this.nTwoArr.length > 0 && laiArr.length >= 1){
                return true;
            }else if(this.nOneArr.length > 0 && laiArr.length >= 2){
                return true;
            }
        }
        if(bBright == 2){//两对~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
            if(this.nTwoArr.length > 1 ){
                return true;
            }else if(this.nTwoArr.length > 0 && this.nOneArr.length > 0 && laiArr.length >= 1){
                return true;
            }else if(this.nOneArr.length > 1 && laiArr.length >= 2){
                return true;
            }
        }
        if(bBright == 1){//一对~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
            if(this.nTwoArr.length > 0){
                return true;
            }else if(this.nOneArr.length > 0 && laiArr.length >= 1){
                return true;
            }
        }
	},
    //显示弹起手牌
	showStorageCountUp:function (upArr) {
    	cc.log("upArr"+upArr);
        for (var num = 0; num < upArr.length; num++) {
			this.Card[upArr[num]].setPositionY(this.cardboxSize.height * 0.6 + 20);
			this.flagAll[upArr[num]] = 1;
        }
    },
    searchArr:function(num,arry){
		if(num == 0){
			this.nOneArr.push(arry)
		}else if(num == 1){
            this.nTwoArr.push(arry)
		}else if(num == 2){
            this.nThreeArr.push(arry)
        }else if(num == 3){
            this.nFourArr.push(arry)
        }else if(num >= 4){
            this.nFiveArr.push(arry)
        }
	},
    //清空搜索数组
    claerStorageCount:function () {
        this.nFiveArr = [];
        this.nFourArr = [];
        this.nThreeArr = [];
        this.nTwoArr = [];
        this.nOneArr = [];
    },
    //通过返回值取一墩类别用来播声音加载资源
	onGetFirstCards:function(pokecard) {
		var count = 0;
		for(var num = 0;num<2;num++){
			if(pokecard[num]%16==pokecard[num+1]%16 && pokecard[num] != 0){
				count++;
				this.firtMax = pokecard[num+1]%16;
				if(num==0){
					this.fPairValue = [pokecard[num]%16,pokecard[2]%16];
				}
				else{
					this.fPairValue = [pokecard[num]%16,pokecard[0]%16];
				}
			}
		}
		if(count == 2){
			return 3;//三条
		}
		else if(count == 1){
			return 1;//对子
		}
		return 0;
	},
	//通过返回值取二三墩类别用来播声音加载资源
	onGetSecondThirdCards:function(pokecard,num) {
		cc.log("判断是什么牌 pokecard= " + JSON.stringify(pokecard));
		cc.log("个数 num= " + num);

		//判断的牌值必须存
		for(var i = num;i < num+5;i++){
            if(pokecard[i] == 0){
				return 0;
            }
		}

		if((((pokecard[num]%16)+1)==(pokecard[num+1]%16))&&(((pokecard[num+1]%16)+1)==(pokecard[num+2]%16))
				&&(((pokecard[num+2]%16)+1)==(pokecard[num+3]%16))&&(((pokecard[num+3]%16)+1)==(pokecard[num+4]%16))){//顺子
			if((parseInt(pokecard[num]/16)==parseInt(pokecard[num+1]/16))&&(parseInt(pokecard[num+1]/16)==parseInt(pokecard[num+2]/16))&&
					(parseInt(pokecard[num+2]/16)==parseInt(pokecard[num+3]/16))&&(parseInt(pokecard[num+3]/16)==parseInt(pokecard[num+4]/16))){  //同花顺
				if(num==3){
					this.secondMax = pokecard[7];
				}
				else{
					this.thirdMax = pokecard[12];
				}
				return 8;
			}
					
			if(num==3){
				this.secondMax = pokecard[7]%16;
			}
			else{
				this.thirdMax = pokecard[12]%16;;
			}
			
			return 4;
		}
		
		//铁支
		if((pokecard[num]%16==pokecard[num+1]%16)&&(pokecard[num+1]%16==pokecard[num+2]%16)&&(pokecard[num+2]%16==pokecard[num+3]%16)){
			if(num==3){
				this.secondMax = pokecard[6]%16;
			}
			else{
				this.thirdMax = pokecard[11]%16;;
			}
			return 7;
		}
		if((pokecard[num+1]%16==pokecard[num+2]%16)&&(pokecard[num+2]%16==pokecard[num+3]%16)&&(pokecard[num+3]%16==pokecard[num+4]%16)){
			if(num==3){
				this.secondMax = pokecard[7]%16;
			}
			else{
				this.thirdMax = pokecard[12]%16;;
			}
			return 7;
		}
		
		
		if((pokecard[num]%16==pokecard[num+1]%16)&&(pokecard[num+1]%16==pokecard[num+2]%16)){
			if((pokecard[num+3]%16==pokecard[num+4]%16)){//葫芦
				if(num==3){
					this.secondMax = pokecard[5]%16;
				}
				else{
					this.thirdMax = pokecard[10]%16;
				}
				return 6;
			}
			else{//三条
				if(num==3){
					this.secondMax = pokecard[5]%16;
				}
				else{
					this.thirdMax = pokecard[10]%16;
				}
				return 3;
				
			}
		}

		if((parseInt(pokecard[num]/16)==parseInt(pokecard[num+1]/16))&&(parseInt(pokecard[num+1]/16)==parseInt(pokecard[num+2]/16))&&
				(parseInt(pokecard[num+2]/16)==parseInt(pokecard[num+3]/16))&&(parseInt(pokecard[num+3]/16)==parseInt(pokecard[num+4]/16))){//同花
			if(num==3){
				this.secondMax = pokecard[7]%16;
			}
			else{
				this.thirdMax = pokecard[12]%16;
			}
			return 5;
		}
		if((pokecard[num+2]%16==pokecard[num+3]%16)&&(pokecard[num+3]%16==pokecard[num+4]%16)){
			if((pokecard[num]%16==pokecard[num+1]%16)){//葫芦
				if(num==3){
					this.secondMax = pokecard[7]%16;
				}
				else{
					this.thirdMax = pokecard[12]%16;
				}
				return 6;
			}
			else{//三条
				if(num==3){
					this.secondMax = pokecard[7]%16;
				}
				else{
					this.thirdMax = pokecard[12]%16;
				}
				return 3;
			}
		}
		
		//
		if(pokecard[num]%16==pokecard[num+1]%16){
			if(pokecard[num+2]%16==pokecard[num+3]%16){//两对
				if(num==3){
					this.sDPairValue[0]=pokecard[num]%16;
					this.sDPairValue[1]=pokecard[num+2]%16;
					this.sDPairValue[2]=pokecard[num+4]%16;
				}
				else{
					this.tDPairValue[0]=pokecard[num]%16;
					this.tDPairValue[1]=pokecard[num+2]%16;
					this.tDPairValue[2]=pokecard[num+4]%16;
				}
				return 2;
			}
			else if(pokecard[num+3]%16==pokecard[num+4]%16){//两对
				if(num==3){
					this.sDPairValue[0]=pokecard[num]%16;
					this.sDPairValue[1]=pokecard[num+3]%16;
					this.sDPairValue[2]=pokecard[num+2]%16;
				}
				else{
					this.tDPairValue[0]=pokecard[num]%16;
					this.tDPairValue[1]=pokecard[num+3]%16;
					this.tDPairValue[2]=pokecard[num+2]%16;
				}
				return 2;
			}
			else{//一对
				if(num==3){
					this.sPairValue[0]=pokecard[num]%16;
					this.sPairValue[1]=pokecard[num+2]%16;
					this.sPairValue[2]=pokecard[num+3]%16;
					this.sPairValue[3]=pokecard[num+4]%16;
					return 1;
				}
				else{
					this.tPairValue[0]=pokecard[num]%16;
					this.tPairValue[1]=pokecard[num+2]%16;
					this.tPairValue[2]=pokecard[num+3]%16;
					this.tPairValue[3]=pokecard[num+4]%16;
					return 1;
				}
			}
		}
		if((pokecard[num+1]%16==pokecard[num+2]%16)&&(pokecard[num+3]%16==pokecard[num+4]%16)){//两对
			if(num==3){
				this.sDPairValue[0]=pokecard[num+1]%16;
				this.sDPairValue[1]=pokecard[num+3]%16;
				this.sDPairValue[2]=pokecard[num]%16;
			}
			else{
				this.tDPairValue[0]=pokecard[num+1]%16;
				this.tDPairValue[1]=pokecard[num+3]%16;
				this.tDPairValue[2]=pokecard[num]%16;
			}
			return 2;
		}
		//一对
		if(pokecard[num+1]%16==pokecard[num+2]%16){
			if(num==3){
				this.sPairValue[0]=pokecard[num+1]%16;
				this.sPairValue[1]=pokecard[num]%16;
				this.sPairValue[2]=pokecard[num+3]%16;
				this.sPairValue[3]=pokecard[num+4]%16;
				return 1;
			}
			else{
				this.tPairValue[0]=pokecard[num+1]%16;
				this.tPairValue[1]=pokecard[num]%16;
				this.tPairValue[2]=pokecard[num+3]%16;
				this.tPairValue[3]=pokecard[num+4]%16;
				return 1;
			}
		}
		if(pokecard[num+2]%16==pokecard[num+3]%16){
			if(num==3){
				this.sPairValue[0]=pokecard[num+2]%16;
				this.sPairValue[1]=pokecard[num]%16;
				this.sPairValue[2]=pokecard[num+1]%16;
				this.sPairValue[3]=pokecard[num+4]%16;
				return 1;
			}
			else{
				this.tPairValue[0]=pokecard[num+2]%16;
				this.tPairValue[1]=pokecard[num]%16;
				this.tPairValue[2]=pokecard[num+3]%16;
				this.tPairValue[3]=pokecard[num+4]%16;
				return 1;
			}
		}
		if(pokecard[num+3]%16==pokecard[num+4]%16){
			if(num==3){
				this.sPairValue[0]=pokecard[num+3]%16;
				this.sPairValue[1]=pokecard[num]%16;
				this.sPairValue[2]=pokecard[num+1]%16;
				this.sPairValue[3]=pokecard[num+2]%16;
				return 1;
			}
			else{
				this.tPairValue[0]=pokecard[num+3]%16;
				this.tPairValue[1]=pokecard[num]%16;
				this.tPairValue[2]=pokecard[num+1]%16;
				this.tPairValue[3]=pokecard[num+2]%16;
				return 1;
			}
		}
		
		return 0;
		
	},
    ////////////////点击事件//////////////////
    //上部牌的点击box（）
    onClickCardboxEvent : function(sender, type) {
        if (ccui.Widget.TOUCH_ENDED == type) {
            var strBtnName = sender.getName();
            var temp = 0;
            this.Panel_sure.setVisible(false);
            this.Btn_sure.setTouchEnabled(false);
            this.Btn_cancel.setTouchEnabled(false);
            this.Panel_cardkind.setVisible(true);

            for(var num = 0;num<13;num++){
                if(strBtnName == "box"+num){
                    cc.log('***num='+num);
                    if(num<3){//头墩
                        if(this.flagOne[num]<1){
                            if(!this.bJudgeTouchUpCount(num))return;
                            if(!this.bJudgeTouchUpPour(num))return;
                            this.setCardInUpGroup(num);
                        }
                        else{
                            this.onreSetCardonOTT(num);
                        }
                    }
                    if(num>=3 && num <8){//中墩
                        if(this.flagTwo[num-3]<1){
                            cc.log("21.牌"+ JSON.stringify(this.Sendpoke));
                            if(!this.bJudgeTouchUpCount(num))return;
                            cc.log("22.牌"+ JSON.stringify(this.Sendpoke));
                            if(!this.bJudgeTouchUpPour(num))return;
                            cc.log("23.牌"+ JSON.stringify(this.Sendpoke));
                            this.setCardInUpGroup(num);
                            cc.log("24.牌"+ JSON.stringify(this.Sendpoke));
                        }
                        else{
                            this.onreSetCardonOTT(num);
                        }
                    }
                    if(num>=8){//尾墩
                        if(this.flagThree[num-8]<1){
                            cc.log("31.牌"+ JSON.stringify(this.Sendpoke));
                            if(!this.bJudgeTouchUpCount(num))return;
                            cc.log("32.牌"+ JSON.stringify(this.Sendpoke));
                            if(!this.bJudgeTouchUpPour(num))return;
                            cc.log("33.牌"+ JSON.stringify(this.Sendpoke));
                            this.setCardInUpGroup(num);
                            cc.log("34.牌"+ JSON.stringify(this.Sendpoke));
                        }
                        else{
                            this.onreSetCardonOTT(num);
                        }
                    }

                    break;
                }
            }
            cc.log('***********判断**************');
            this.onIsPair(this.pokecard);

            this.ShowCardLight();
        }

    },
    //底部扑克点击事件
    onClickCardEvent: function(sender, type) {
        cc.log('onClickEvent ');
        if (ccui.Widget.TOUCH_ENDED == type) {
            var strBtnName = sender.getName();
            for(var num = 0;num<13;num++){
                if(strBtnName == "card"+num){
                    SoundMgr.getInstance().playEffect("sss_flop", 0, false);
                    cc.log('this.flagAll[num]=' + this.flagAll[num]);
                    if(this.flagAll[num]==0){
                        this.Card[num].setPositionY((this.cardboxSize.height*0.6)+25);
                        this.flagAll[num]=1;
                    }
                    else if(this.flagAll[num]==1){
                        this.Card[num].setPositionY(this.cardboxSize.height*0.6);
                        this.flagAll[num]=0;
                        this.nPair = 0;
                        this.nThree = 0;
                        this.nShunPosition = [0,0,0,0,0];
                        this.nPosition = [0,0,0,0,0];
                        this.nTong = 0;
                        this.nIron = 0;
                        this.nFive = 0;
                    }
                }
            }
            this.ShowCardLight();
        }
    },
	//点击事件
	onClickEvent: function(sender, type) {
		if (ccui.Widget.TOUCH_ENDED == type) {
			var strBtnName = sender.getName();
			cc.log('onClickEvent ' + strBtnName);
			switch (strBtnName) {
			case "Btn_closeone":
				SoundMgr.getInstance().playEffect("sss_cancel", 0, false);
				this.onResetPoke(1);
                this.ShowCardLight();
                cc.log("重新设置后的手牌1." + JSON.stringify(this.Sendpoke));
				break;
			case "Btn_closetwo":
				SoundMgr.getInstance().playEffect("sss_cancel", 0, false);
				this.onResetPoke(2);
                this.ShowCardLight();
                cc.log("重新设置后的手牌2." + JSON.stringify(this.Sendpoke));
				break;
			case "Btn_closethree":
				SoundMgr.getInstance().playEffect("sss_cancel", 0, false);
				this.onResetPoke(3);
                this.ShowCardLight();
                cc.log("重新设置后的手牌3." + JSON.stringify(this.Sendpoke));
				break;
			case "Btn_cancel":
				SoundMgr.getInstance().playEffect("sss_cancel", 0, false);
				this.onResetPoke(0);
                this.ShowCardLight();
                cc.log("重新设置后的手牌4." + JSON.stringify(this.Sendpoke));
				break;
			case "Btn_sure":
				cc.log("gothis.Sendpoke="+this.Sendpoke);
				if(this.Sendpokebefore){
					this.Sendpoke = this.Sendpokebefore;
				}
				for(var num = 0; num<13; num++){
					cc.log('this.sendcard= ' + this.Sendpoke[num]);
					if(this.Sendpoke[num]%16 == 14){
						this.Sendpoke[num] = this.Sendpoke[num]-13;
					}
				}				
				SoundMgr.getInstance().playEffect("sss_cardover", 0, false);

				var table = ClientData.getInstance().getTable();
                var game = ClientData.getInstance().getGame();
				for(var pos = 0;pos<4;pos++){
					var chairID = SssUIMgr.getInstance().getChairIdByPlayerPos(pos);
					var player = table.getPlayerByChairID(chairID);
					if(player == null){
						player=game.playerDatas[pos].nPlayer;
					}
					if(player&&(player.getUserId() == g_objHero.getUserId())){
						game.playerDatas[pos].bOverCard = true;
					}
				}

                //如果桌面手牌存在要移除
                var gameCard = UIMgr.getInstance().getDlg(DlgSSSPlayerData);
				if(gameCard){
                    gameCard.RemoveMyTabelCards();
				}

                //发送牌数据
				SssUIMgr.getInstance().onSendCardReady(this.Sendpoke,this.nSpecial);
				this.dissolutionTime=0;
				this.updateCountDownTime();
				UIMgr.getInstance().closeDlg(ID_DlgSSSCombination);
				break;

			default:
				break;
			}
		}
	},
    //点击普通牌型（对子到五同）
    onClickCardKind:function(sender, type) {
        if (ccui.Widget.TOUCH_ENDED == type) {
            var strBtnName = sender.getName();
            cc.log('onClickEvent ' + strBtnName);
            SoundMgr.getInstance().playEffect("sss_flop", 0, false);
            switch (strBtnName) {
                case "Btn_pair":
                    this.onSetGhostUp(0,1);
                    this.nThree = 0;
                    this.nShunPosition = [0,0,0,0,0];
                    this.nPosition = [0,0,0,0,0];
                    this.nTShun = [];
                    this.nTShunPosition = [];
                    this.nTong = 0;
                    this.nIron = 0;
                    this.nFive = 0;
                    this.nDPair = [0,0];
                    this.nGourd = [0,0];
                    break;
                case "Btn_pair_double":
                    this.onSetGhostUp(0,2);
                    this.nPair = 0;
                    this.nThree = 0;
                    this.nShunPosition = [0,0,0,0,0];
                    this.nPosition = [0,0,0,0,0];
                    this.nTShun = [];
                    this.nTShunPosition = [];
                    this.nTong = 0;
                    this.nIron = 0;
                    this.nFive = 0;
                    this.nGourd = [0,0];
                    break;
                case "Btn_three":
                    this.onSetGhostUp(0,3);
                    this.nPair = 0;
                    this.nShunPosition = [0,0,0,0,0];
                    this.nPosition = [0,0,0,0,0];
                    this.nTShun = [];
                    this.nTShunPosition = [];
                    this.nTong = 0;
                    this.nIron = 0;
                    this.nFive = 0;
                    this.nDPair = [0,0];
                    this.nGourd = [0,0];
                    break;
                case "Btn_tonghua":
                    this.onSetGhostUp(0,5);
                    this.nPair = 0;
                    this.nThree = 0;
                    this.nShunPosition = [0,0,0,0,0];
                    this.nPosition = [0,0,0,0,0];
                    this.nTShun = [];
                    this.nTShunPosition = [];
                    this.nIron = 0;
                    this.nFive = 0;
                    this.nDPair = [0,0];
                    this.nGourd = [0,0];
                    break;
                case "Btn_shunzi":
                    this.onSetGhostUp(0,4);
                    this.nPair = 0;
                    this.nThree = 0;;
                    this.nTong = 0;
                    this.nIron = 0;
                    this.nFive = 0;
                    this.nDPair = [0,0];
                    this.nGourd = [0,0];
                    this.nTShun = [];
                    this.nTShunPosition = [];
                    break;
                case "Btn_iron":
                    this.onSetGhostUp(0,7);
                    this.nPair = 0;
                    this.nThree = 0;
                    this.nFive = 0;
                    this.nShunPosition = [0,0,0,0,0];
                    this.nPosition = [0,0,0,0,0];
                    this.nTShun = [];
                    this.nTShunPosition = [];
                    this.nTong = 0;
                    this.nDPair = [0,0];
                    this.nGourd = [0,0];
                    break;
                case "Btn_tonghuashun":
                    this.nShunNum = 0;
                    this.nTShun = [];
                    this.nTShunPosition = [];
                    this.onSetGhostUp(0,8);
                    this.nPair = 0;
                    this.nThree = 0;
                    this.nTong = 0;
                    this.nIron = 0;
                    this.nFive = 0;
                    this.nDPair = [0,0];
                    this.nGourd = [0,0];
                    break;
                case "Btn_gourd":
                    this.onSetGhostUp(0,6);
                    this.nPair = 0;
                    this.nThree = 0;
                    this.nTong = 0;
                    this.nIron = 0;
                    this.nFive = 0;
                    this.nDPair = [0,0];
                    this.nShunPosition = [0,0,0,0,0];
                    this.nPosition = [0,0,0,0,0];
                    this.nTShun = [];
                    this.nTShunPosition = [];
                    break;
                case "Btn_wutong":
					this.onSetGhostUp(0,9);
                    this.nPair = 0;
                    this.nThree = 0;
                    this.nIron = 0;
                    this.nShunPosition = [0,0,0,0,0];
                    this.nPosition = [0,0,0,0,0];
                    this.nTShun = [];
                    this.nTShunPosition = [];
                    this.nTong = 0;
                    this.nDPair = [0,0];
                    this.nGourd = [0,0];
                    break;
                case "Btn_fourthree":
                    //
                    // cc.log("牌的类型"+this.nSpecial);
                    // if(this.nSpecial != 0){
                    //
                    //    this.onSetSpecialCard();
                    // }
                    // else {
                    //    this.onSetAutoCard();
                    // }
                    this.onSetAutoCard();
                    break;

                default:
                    break;
            }
            //你的牌相公了提示
            if(this.Image_errRule.isVisible()){
                this.Image_errRule.setVisible(false);
            }

            //透明框判断
            this.ShowCardLight();
        }
    },
    //监听事件(主要是牌的弹起与移动)
    onTouchListener:function () {
        // 创建一个事件监听器 OneByOne 为单点触摸

        var that = this;
        var listener1 = cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,                       // 设置是否吞没事件，在 onTouchBegan 方法返回 true 时吞掉事件，不再向下传递。
            onTouchBegan: function (touch, event) {     //实现 onTouchBegan 事件处理回调函数
                var target = event.getCurrentTarget();  // 获取事件所绑定的 target, 通常是cc.Node及其子类
                // 获取当前触摸点相对于按钮所在的坐标
                var locationInNode = target.convertToNodeSpace(touch.getLocation());
                that.TouchCardBeginPos =locationInNode;
                //var rect = cc.rect(this.panel_cardbox.getPositionX(), this.panel_cardbox.getPositionX(), this.cardboxSize.width, this.cardboxSize.height);
                var rect = cc.rect(0,0,1080,176);//点击到划牌区域的矩形位置
                if (cc.rectContainsPoint(rect, locationInNode)) {       // 判断触摸点是否在按钮范围内
                    cc.log("鼠标按下"+that.TouchCardBeginPos.x+","+that.TouchCardBeginPos.y);
                    var sizeW = that.cardboxSize.width/(that.nPockerMax + 1);
                    //点击开始状态控制清空
                    for(var num = 0;num < that.nPockerMax;num++){
                        that.flagTouch[num] = 0;
                    }
                    //遍历所有牌的矩形间距设置弹起
                    for(var i = 0;i < that.nPockerMax;i++){
                        var pos = target.convertToNodeSpace(that.Card[i].getPosition());
                        cc.log("x"+pos.x+"y"+pos.y);
                        var conte = that.Card[i].getContentSize();
                        var cardR = cc.rect(pos.x-conte.width/2,pos.y-conte.height/2,(i == that.nPockerMax - 1 ?conte.width:sizeW),conte.height);
                        cc.log("contex"+conte.width+"contey"+conte.height);
                        cc.log("rect"+JSON.stringify(cardR));
                        if(cc.rectContainsPoint(cardR, locationInNode)){
                            that.flagTouch[i] = 1;
                            if(that.flagAll[i] == 0){
                                that.Card[i].setPositionY((that.cardboxSize.height*0.6)+20);
                                that.flagAll[i] = 1;
                            }
                            else if(that.flagAll[i] == 1){
                                that.Card[i].setPositionY((that.cardboxSize.height*0.6));
                                that.flagAll[i] = 0;
                            }
                        }
                    }

                    return true;
                }
                return false;
            },
            onTouchMoved: function (touch, event) {         //实现onTouchMoved事件处理回调函数, 触摸移动时触发
                var target = event.getCurrentTarget();  // 获取事件所绑定的 target, 通常是cc.Node及其子类
                // 获取当前触摸点相对于按钮所在的坐标
                var locationInNode = target.convertToNodeSpace(touch.getLocation());
                that.TouchCardMovePos =locationInNode;
                var rect = cc.rect(0, 0, 1080, 176);//点击到划牌区域的矩形位置
                if(that.TouchCardBeginPos.x < that.TouchCardMovePos.x && that.DrawMaxposX < that.TouchCardMovePos.x){//滑动最大值赋值
                    that.DrawMaxposX = that.TouchCardMovePos.x;
                }else if(that.TouchCardBeginPos.x > that.TouchCardMovePos.x && that.DrawMaxposX > that.TouchCardMovePos.x){
                    that.DrawMaxposX = that.TouchCardMovePos.x;
                }
                if (cc.rectContainsPoint(rect, locationInNode)) {       // 判断触摸点是否在按钮范围内
                    cc.log("鼠标移动");
                    var conte = that.Card[0].getContentSize();
                    var sizeW = that.cardboxSize.width/(that.nPockerMax + 1);
                    for (var i = 0; i < that.nPockerMax; i++) {
                        var pos = target.convertToNodeSpace(that.Card[i].getPosition());
                        //向右滑动 向左划
                        if(that.TouchCardMovePos.x > that.TouchCardBeginPos.x) {
                            //开始点击的点到移动中的选取范围内全部弹起
                            var RangeR = cc.rect(that.TouchCardBeginPos.x, 0, that.TouchCardMovePos.x - that.TouchCardBeginPos.x + sizeW , conte.height);
                            if (cc.rectContainsPoint(RangeR, pos)) {
                                var CardR = cc.rect(that.TouchCardMovePos.x, 0, that.DrawMaxposX -  that.TouchCardMovePos.x + sizeW , conte.height);
                                if (that.DrawMaxposX  > that.TouchCardMovePos.x && cc.rectContainsPoint(CardR, pos) ) {
                                    for(var j = 0; j < that.nPockerMax; j++){
                                        var Fpos = target.convertToNodeSpace(that.Card[j].getPosition());
                                        if(cc.rectContainsPoint(CardR, Fpos)){
                                            if (that.flagTouch[j] == 2) {
                                                if (that.flagAll[j] == 0) {
                                                    that.Card[j].setPositionY((that.cardboxSize.height * 0.6) + 20);
                                                    that.flagAll[j] = 1;
                                                }
                                                else if (that.flagAll[j] == 1) {
                                                    that.Card[j].setPositionY((that.cardboxSize.height * 0.6));
                                                    that.flagAll[j] = 0;
                                                }

                                                that.flagTouch[j] = 0;
                                            }
                                        }
                                    }
                                }
                                else {
                                    if (that.flagTouch[i] == 0) {
                                        if (that.flagAll[i] == 0) {
                                            that.Card[i].setPositionY((that.cardboxSize.height * 0.6) + 20);
                                            that.flagAll[i] = 1;
                                        }
                                        else if (that.flagAll[i] == 1) {
                                            that.Card[i].setPositionY((that.cardboxSize.height * 0.6));
                                            that.flagAll[i] = 0;
                                        }

                                        that.flagTouch[i] = 2;
                                    }
                                }
                            }
                        }
                        else if(that.TouchCardBeginPos.x > that.TouchCardMovePos.x) {
                            var cardR = cc.rect(that.TouchCardMovePos.x - conte.width*0.2  , 0, that.TouchCardBeginPos.x - that.TouchCardMovePos.x, conte.height);
                            //开始点击的点到移动中的选取范围内全部弹起
                            if (cc.rectContainsPoint(cardR, pos)) {
                                var CardR = cc.rect(that.DrawMaxposX, 0, that.TouchCardMovePos.x -  that.DrawMaxposX , conte.height);
                                if (that.DrawMaxposX  < that.TouchCardMovePos.x && cc.rectContainsPoint(CardR, pos) ) {
                                    for(var j = 0; j < that.nPockerMax; j++){
                                        var Fpos = target.convertToNodeSpace(that.Card[j].getPosition());
                                        if(cc.rectContainsPoint(CardR, Fpos)){
                                            if (that.flagTouch[j] == 2) {
                                                if (that.flagAll[j] == 0) {
                                                    that.Card[j].setPositionY((that.cardboxSize.height * 0.6) + 20);
                                                    that.flagAll[j] = 1;
                                                }
                                                else if (that.flagAll[j] == 1) {
                                                    that.Card[j].setPositionY((that.cardboxSize.height * 0.6));
                                                    that.flagAll[j] = 0;
                                                }

                                                that.flagTouch[j] = 0;
                                            }
                                        }
                                    }
                                }
                                else{
                                    if (that.flagTouch[i] == 0) {
                                        if (that.flagAll[i] == 0) {
                                            that.Card[i].setPositionY((that.cardboxSize.height * 0.6) + 20);
                                            that.flagAll[i] = 1;
                                        }
                                        else if (that.flagAll[i] == 1) {
                                            that.Card[i].setPositionY((that.cardboxSize.height * 0.6));
                                            that.flagAll[i] = 0;
                                        }

                                        that.flagTouch[i] = 2;
                                    }
                                }
                            }
                        }

                        // //向右滑动 向左划
                        // if(that.TouchCardMovePos.x > that.TouchCardBeginPos.x) {
                        // //
                        //     var cardR = cc.rect(that.TouchCardBeginPos.x, 0, that.TouchCardMovePos.x - that.TouchCardBeginPos.x + conte.width*0.5 , conte.height);
                        //     //开始点击的点到移动中的选取范围内全部弹起
                        //     if (cc.rectContainsPoint(cardR, pos)) {
                        //         if (that.flagTouch[i] == 0) {
                        // 		if (that.flagAll[i] == 0) {
                        // 			that.Card[i].setPositionY((that.cardboxSize.height * 0.6) + 20);
                        // 			that.flagAll[i] = 1;
                        // 		}
                        // 		else if (that.flagAll[i] == 1) {
                        // 			that.Card[i].setPositionY((that.cardboxSize.height * 0.6));
                        // 			that.flagAll[i] = 0;
                        // 		}
                        //
                        //             that.flagTouch[i] = 2;
                        //         }
                        //
                        //         // if (that.flagTouch[i] == 2) {
                        //         //     if (that.flagAll[i] == 0) {
                        //         //         that.Card[i].setPositionY((that.cardboxSize.height * 0.6) + 20);
                        //         //         that.flagAll[i] = 1;
                        //         //     }
                        //         //     else if (that.flagAll[i] == 1) {
                        //         //         that.Card[i].setPositionY((that.cardboxSize.height * 0.6));
                        //         //         that.flagAll[i] = 0;
                        //         //     }
                        //         //
                        //         //     that.flagTouch[i] = 0;
                        //         // }
                        //     }
                        // }
                        // else if(that.TouchCardBeginPos.x > that.TouchCardMovePos.x) {
                        //     var cardR = cc.rect(that.TouchCardMovePos.x - conte.width*0.2  , 0, that.TouchCardBeginPos.x - that.TouchCardMovePos.x, conte.height);
                        //     //开始点击的点到移动中的选取范围内全部弹起
                        //     if (cc.rectContainsPoint(cardR, pos)) {
                        //         if (that.flagTouch[i] == 0) {
                        //             if (that.flagAll[i] == 0) {
                        //                 that.Card[i].setPositionY((that.cardboxSize.height * 0.6) + 20);
                        //                 that.flagAll[i] = 1;
                        //             }
                        //             else if (that.flagAll[i] == 1) {
                        //                 that.Card[i].setPositionY((that.cardboxSize.height * 0.6));
                        //                 that.flagAll[i] = 0;
                        //             }
                        //
                        //             that.flagTouch[i] = 2;
                        //         }
                        //
                        //         // if (that.flagTouch[i] == 2) {
                        //         //     if (that.flagAll[i] == 0) {
                        //         //         that.Card[i].setPositionY((that.cardboxSize.height * 0.6) + 20);
                        //         //         that.flagAll[i] = 1;
                        //         //     }
                        //         //     else if (that.flagAll[i] == 1) {
                        //         //         that.Card[i].setPositionY((that.cardboxSize.height * 0.6));
                        //         //         that.flagAll[i] = 0;
                        //         //     }
                        //         //
                        //         //     that.flagTouch[i] = 0;
                        //         // }
                        //     }
                        // }

                    }

                    that.ShowCardLight();
                }
            },
            onTouchEnded: function (touch, event) {         // 实现onTouchEnded事件处理回调函数
                var target = event.getCurrentTarget();  // 获取事件所绑定的 target, 通常是cc.Node及其子类
                // 获取当前触摸点相对于按钮所在的坐标
                var locationInNode = target.convertToNodeSpace(touch.getLocation());

                var rect = cc.rect(0,0,1080,176);//点击到划牌区域的矩形位置

                if (cc.rectContainsPoint(rect, locationInNode)) {// 判断触摸点是否在按钮范围内
                    cc.log("鼠标结束");
                    for(var i = 0;i < that.nPockerMax;i++){
                        var pos = target.convertToNodeSpace(that.Card[i].getPosition());
                        //cc.log("x"+pos.x+"y"+pos.y);
                        var conte = that.Card[i].getContentSize();
                        var cardR = cc.rect(pos.x-conte.width/2,pos.y-conte.height/2,(conte.width*0.65),conte.height);
                        if(cc.rectContainsPoint(cardR, locationInNode)){
                            that.DrawCardMove = i;
                        }
                    }
                }

                that.ShowCardLight();
            }
        });
        cc.eventManager.addListener(listener1, this.panel_cardbox);
    },
    ////////////////创建扑克牌//////////////////
	onCreatCard : function(value,style){
		if (value == 0) value = 1;
		if (value == 0x41) value = 0x4e;
		if (value == 0x42) value = 0x4f;
		cc.log("valuee = "+value);
	
		var cardPath = "huaiFengCardListPlist/Value_" + ((value<0x10)?"0":"") + value.toString(16) + "_Style_" + style.toString() + ".png";
		cc.log("2cardPath"+cardPath);
		if (value < 0 || (value > 0x0d && value < 0x11) || (value > 0x1d && value < 0x21) ||
				(value > 0x2d && value < 0x31) || (value > 0x3d && value != 0x4e && value != 0x4f)) {
			cc.log("未知牌"+value);
			cardPath = "huaiFengCardListPlist/img_card_back.png";
		}

		var image_front = new ccui.ImageView(cardPath, ccui.Widget.PLIST_TEXTURE);
		return image_front;
	}
});

DlgSSSCombination.getInstance = function() {
	if (!dlgSetCard) {
		dlgSetCard = new DlgSSSCombination();
	}
	return dlgSetCard;
};
//特殊牌型的种类 10.三顺子 11.三同花 12.六对半 13.五对三条 14.凑一色 15.全小 16.全大 17.三同花顺 18.十二皇族 19.三皇五帝 20.三炸弹 21.四套三冲 22.一条龙 23.至尊青龙

