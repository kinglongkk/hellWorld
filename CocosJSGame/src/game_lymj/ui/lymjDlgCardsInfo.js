
cc.log("--------ID_DlgLymjCardsInfo = "  + ID_DlgLymjCardsInfo);
DLG_CREATOR[ID_DlgLymjCardsInfo] = function() {
    return new DlgLymjCardsInfo();
};

var DlgLymjCardsInfo = DlgBase.extend({
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

    setCurrentArtFontText:function (obj,text) {
        var str = ""+text;
        obj.setContentSize(cc.size(39 * str.length , 60)); // 39,60 分别是艺术字的 宽 高
        obj.string = text;
    },

    init: function() {
        var json = ccs.load(res.lymjDlgCardInfo_json);
        this._rootWidget = json.node;
        // 自适应屏幕大小
        var sizeDir = cc.director.getWinSize();
        this._rootWidget.setContentSize(sizeDir);
        ccui.helper.doLayout(this._rootWidget);
        this.Panel_root = this._rootWidget.getChildByName("Panel_root");
        //出牌展示
        this.Panel_cgpTemp = this.Panel_root.getChildByName("Panel_cgpTemp");
        this.Image_cardOutShow = this.Panel_cgpTemp.getChildByName("Image_cardOutShow");
        this.Image_cardOutCheck = this.Panel_cgpTemp.getChildByName("Image_cardOutCheck");
        //出牌列表
        this.Panel_cardPutOut = this.Panel_root.getChildByName("Panel_cardPutOut");
        // 花牌列表
        this.Panel_cardFlower = this.Panel_root.getChildByName("Panel_cardFlower");
        this.Panel_flowerNormal = this.Panel_cardFlower.getChildByName("Panel_flowerNormal");
        this.Panel_flowerRight = this.Panel_cardFlower.getChildByName("Panel_flowerRight");
        this.Panel_flowerUp = this.Panel_cardFlower.getChildByName("Panel_flowerUp");
        this.Panel_flowerLeft = this.Panel_cardFlower.getChildByName("Panel_flowerLeft");
        this.atlb_flowerNum_normal = this.Panel_flowerNormal.getChildByName("atlb_Num");
        this.atlb_flowerNum_right = this.Panel_flowerRight.getChildByName("atlb_Num");
        this.atlb_flowerNum_up = this.Panel_flowerUp.getChildByName("atlb_Num");
        this.atlb_flowerNum_left = this.Panel_flowerLeft.getChildByName("atlb_Num");

        //动作面板
        this.Panel_operator = this.Panel_root.getChildByName("Panel_operator");

        this.Button_peng = this.setBtnCallBack(this.Panel_operator,"Button_peng",this.onOperatorBtnClick);
        this.Button_gang = this.setBtnCallBack(this.Panel_operator,"Button_gang",this.onOperatorBtnClick);
        this.Button_ting = this.setBtnCallBack(this.Panel_operator,"Button_ting",this.onOperatorBtnClick);
        this.Button_hu = this.setBtnCallBack(this.Panel_operator,"Button_hu",this.onOperatorBtnClick);
        this.Button_guo = this.setBtnCallBack(this.Panel_operator,"Button_guo",this.onOperatorBtnClick);
        // 播放操作动画的对象
        this.Image_animal_normal = this.Panel_root.getChildByName("Image_animal_normal");
        this.Image_animal_right = this.Panel_root.getChildByName("Image_animal_right");
        this.Image_animal_up = this.Panel_root.getChildByName("Image_animal_up");
        this.Image_animal_left = this.Panel_root.getChildByName("Image_animal_left");
        //开牌
        this.Panel_pgNomal = this.Panel_root.getChildByName("Panel_pgNomal");
        this.Panel_pgRight = this.Panel_root.getChildByName("Panel_pgRight");
        this.Panel_pgUp = this.Panel_root.getChildByName("Panel_pgUp");
        this.Panel_pgLeft = this.Panel_root.getChildByName("Panel_pgLeft");
        // 初始化牌局信息
        this.Panel_roundInfo = this.Panel_root.getChildByName("Panel_roundInfo");
        this.Panel_roundInfo.setVisible(false); // 开始就隐藏，等开始后再显示
        // 金牌标志
        this.Image_kingCard = this.Panel_roundInfo.getChildByName("Image_kingCard");
        // 时间
        var Image_timeBg = this.Panel_roundInfo.getChildByName("Image_timeBg");
        var atlb_timesLeft = this.Panel_roundInfo.getChildByName("atlb_timesLeft");
        var atlb_cardssLeft = this.Panel_roundInfo.getChildByName("atlb_cardssLeft");
        Image_timeBg.setVisible(false);
        this.setCurrentArtFontText(atlb_timesLeft,"0");
        this.setCurrentArtFontText(atlb_cardssLeft,"0");
        
        // 房间信息，由于比赛开始后才显示，所以放在这边
        this.Text_lCellScore = this.Panel_roundInfo.getChildByName("atlb_scroes");
        this.Text_rounds = this.Panel_roundInfo.getChildByName("Text_roundLeft");

        //创建玩家的牌面
        var game = ClientData.getInstance().getGame();
        if(!game){
            return false;
        }

        var meChairID = game.getMeChairId();
        this.initPosit13 = [];
        var posit;
        this.imgFOtherCard = [];
        for(var chairID=0;chairID<CMD_LYMJ.GAME_PLAYER; chairID++){
            var curChairID = (meChairID+chairID)%4;
            switch(chairID){
                case 0:{
                    //自己
                    this.imgFUserCard=[];
                    this.Panel_cardNomal = this.Panel_root.getChildByName("Panel_cardNomal");
                    var Image_cardNomal = this.Panel_root.getChildByName("Image_cardNomal");
                    var cardFrameW = Image_cardNomal.getContentSize().width;

                    //创建自己的牌对象
                    for(var i=0;i<CMD_LYMJ.MAX_COUNT; i++){
                        var cardFrame = Image_cardNomal.clone();
                        cardFrame.addTouchEventListener(this.onClickCardCallBack, this);
                        cardFrame.setPosition(cc.p(cardFrameW*i,0));
                        cardFrame.setVisible(false);
                        this.Panel_cardNomal.addChild(cardFrame);
                        this.imgFUserCard[i]=cardFrame;
                    }

                    //设置出牌对象 13的那张
                    posit = cc.p(13.8*cardFrameW,0);
                    this.imgFUserCard[13].setPosition(posit); // 默认位置

                    break;
                }
                case 1:{
                    //右边
                    this.imgFOtherCard[curChairID] = [];

                    this.Panel_cardRight = this.Panel_root.getChildByName("Panel_cardRight");
                    var Image_cardRight = this.Panel_root.getChildByName("Image_cardRight");
                    var cardFrameH =  Image_cardRight.getContentSize().height/2 ; //40

                    for(var i=CMD_LYMJ.MAX_COUNT-1;i>=0; i--){
                        var cardFrame = Image_cardRight.clone();
                        cardFrame.setPosition(cc.p(0,i*cardFrameH));
                        cardFrame.setVisible(false);
                        this.Panel_cardRight.addChild(cardFrame);
                        this.imgFOtherCard[curChairID][i]=cardFrame;
                    }

                    //设置出牌对象 13的那张
                    posit = cc.p(0,14.5*cardFrameH);
                    this.imgFOtherCard[curChairID][13].setPosition(posit); // 默认位置
                    break;
                }
                case 2:{
                    //对面
                    this.imgFOtherCard[curChairID] = [];
                    this.Panel_cardUp = this.Panel_root.getChildByName("Panel_cardUp");
                    var Image_cardUp = this.Panel_root.getChildByName("Image_cardUp");
                    var Panel_cardUpWidth = this.Panel_cardUp.getContentSize().width;
                    var cardFrameW = Image_cardUp.getContentSize().width-3;

                    for(var i=0;i<CMD_LYMJ.MAX_COUNT; i++){
                        var cardFrame = Image_cardUp.clone();
                        var posX = Panel_cardUpWidth-i*cardFrameW;
                        cardFrame.setPosition(cc.p(posX,0));
                        cardFrame.setVisible(false);
                        this.Panel_cardUp.addChild(cardFrame);
                        this.imgFOtherCard[curChairID][i]=cardFrame;
                    }

                    posit = cc.p(Panel_cardUpWidth-13.5*cardFrameW,0)
                    this.imgFOtherCard[curChairID][13].setPosition(posit); // 默认位置

                    break;
                }
                case 3:{
                    //左边
                    this.imgFOtherCard[curChairID] = [];

                    this.Panel_cardLeft = this.Panel_root.getChildByName("Panel_cardLeft");
                    var Image_cardLeft = this.Panel_root.getChildByName("Image_cardLeft");
                    var Panel_cardLeftHeight = this.Panel_cardLeft.getContentSize().height;
                    var cardFrameH = Image_cardLeft.getContentSize().height/2 + 2;
                    for(var i=0;i<CMD_LYMJ.MAX_COUNT; i++){
                        var cardFrame = Image_cardLeft.clone();
                        var posY = Panel_cardLeftHeight-i*cardFrameH;
                        cardFrame.setPosition(cc.p(0,posY));
                        cardFrame.setVisible(false);
                        this.Panel_cardLeft.addChild(cardFrame);
                        this.imgFOtherCard[curChairID][i]=cardFrame;
                    }

                    //设置出牌对象 13的那张
                    posit = cc.p(0,Panel_cardLeftHeight-14.5*cardFrameH);
                    this.imgFOtherCard[curChairID][13].setPosition(posit); // 默认位置
                    break;
                }
                default:
                    break;
            }
            
            this.initPosit13[chairID] = posit; // 保存开始位置
        }

        // 加载动画资源
        this.opFrameCach = cc.spriteFrameCache;
        this.opFrameCach.addSpriteFrames(res.lymjAnimate_plist);
    },

    // 通过childId取得相对于自己的方位index 
    getUserUIIndex:function (user) {
        var game = ClientData.getInstance().getGame();
        if(!game){
            return false;
        }
        var meChairID = game.getMeChairId();
        var index = 0;
        while(true){
            if(((meChairID+index)%4)==user){
                break;
            }
            index++;
        }
        return index;
    },

    // 界面ui 补花
    replaceCard:function() {
        cc.log("replaceCard ------ ");
        var game = ClientData.getInstance().getGame();
        if(!game){
            return false;
        }
        var replaceUser = game.getReplaceUser();
        var meChairID = game.getMeChairId();

        if (replaceUser == meChairID) {
            var oldCardValue = game.getReplaceCard();
            var newCardValue = game.getReplaceNewCard();
            for (var i=0;i<CMD_LYMJ.MAX_COUNT;i++){
                if (oldCardValue == this.cardData[i]){
                    this.cardData[i] = newCardValue;
                    // 更新牌值：判断是否是开局补花，开局的就得排序，不是开局是打牌的就不用
                    if(game.getIsInisFlower()==true)
                        this.updateCard(this.cardData, 14); // 是否做排序，如果是第13张就不做排序
                    else
                        this.displayCard(this.cardData[i],i); // 抓牌就是第13张
                    break;
                }
            }
        }

        // 更新花数
        this.updateFlowerNum(replaceUser);

        // 显示动画效果，补花
        // 播放声音
    },

    // 界面7花可查，只针对补花用户，7花用户不做处理，等后台再发牌给他
    replaceCard_7Flower:function () {
        cc.log("--------ui ----replaceCard_7Flower "  );
        var oldUser = game.getReplaceUser(parseData.wOldUser);
        var cardValue = game.getReplaceCard(parseData.cbReplaceCard);
        // 隐藏这个用户这张牌 只针对手牌，不针对开局
        var game = ClientData.getInstance().getGame();
        var meChairID=game.getMeChairId();
        if (meChairID == oldUser)
        {
            this.cardData[13] = 100; // 隐藏
            this.imgFUserCard[13].setVisible(false);
        }
        else
        {
            this.imgFOtherCard[oldUser][13].setVisible(false);
        }
        cc.log("--------ui ----replaceCard_7Flower 2222"  );
    },
    
    // 界面ui 翻金
    updateGoldMedal:function() {
        var game = ClientData.getInstance().getGame();
        if(!game){
            return false;
        }
        // 更新手牌 ，看看是否有金，有金的话，做动画
        var cardValue = game.getGoldCard();
       
        if (cardValue != undefined)
        {
        	// 添加金牌标志花色
        	var strFile = this.getFCard(cardValue);
        	var Image_color = this.Image_kingCard.getChildByName("Image_color");
        	Image_color.loadTexture(strFile, ccui.Widget.PLIST_TEXTURE);
        	Image_color.setVisible(true);

        	this.updateCard(this.cardData,14);
       	}
    },

    // 更新某个用户花的个数
    updateFlowerNum:function (chairID) {
        var game = ClientData.getInstance().getGame();
        if(!game){
            return false;
        }
        var flowerRecords = game.getFlowerRecords();
        var flowerNum = flowerRecords[chairID];
        var index = this.getUserUIIndex(chairID);
        if(index==0){
            this.Panel_flowerNormal.setVisible(true);
            this.setCurrentArtFontText(this.atlb_flowerNum_normal,flowerNum);
        }
        else if(index == 1) {
            this.Panel_flowerRight.setVisible(true);
            this.setCurrentArtFontText(this.atlb_flowerNum_right,flowerNum);
        }
        else if(index==2){
            this.Panel_flowerUp.setVisible(true);
            this.setCurrentArtFontText(this.atlb_flowerNum_up,flowerNum);
        }
        else if(index==3){
            this.Panel_flowerLeft.setVisible(true);
            this.setCurrentArtFontText(this.atlb_flowerNum_left,flowerNum);
        }
    },

    /*
    *   onObj  ：动画播放的对象
	*	opType ：吃 = 1 碰=2 杠=3 听=4 胡=5 自摸=6 金=7
    */
    playingAnimateOnObj:function(onObj,opType){
    	var name = "";
    	var path = "";
    	var count = 20;
    	var time = 1.0/20;// 一张播放时间
    	var repeat = false;
    	var animFrames = [];

        if (opType==1) {// chi
    		name = "tx2_00";
    	} else if (opType==2) {// peng
            name = "tx3_00";
    	} else if (opType==3) {// gang
            name = "tx4_00";
    	} else if (opType==4) {// gang
            name = "tx5_00";
        } else if (opType==5) {// hu
            name = "tx6_00";
    	} else if(opType == 6) {// zimo
            name = "tx7_00";
    	} else if (opType==7) {// 金
            count = 15;
            repeat = true;
            name = "tx1_00";
            time = 1.0/15;
        } else {
            cc.log("错误的动画类型");
            return;
        }
    	
    	var animate = new cc.Sprite();
    	var x = onObj.getContentSize().width/2;
    	var y = onObj.getContentSize().height /2;
    	animate.setPosition(cc.p(x,y));
    	onObj.addChild(animate); 
    	
    	for (var i = 1; i <= count; i++) {
    		path = "animate/"+ name + (i < 10 ? ("0" + i) : i) +".png";
    		var frame = this.opFrameCach.getSpriteFrame(path);
    		animFrames.push(frame);
    	}
    	
    	var animation = new cc.Animation(animFrames, time);  
        
    	if(repeat==true) {
    		animate.runAction(cc.animate(animation).repeatForever());
    	} else {
    		animate.runAction(cc.sequence(cc.animate(animation), cc.CallFunc(function(){
    			animate.removeFromParent();
    		},this)));
    	}
    },
    
    doClear: function(){
        //清理出牌列表
        this.clearAllOutList();

        //清除碰杠 数据
        this.clearOpenCard();

        //清理展示牌
        this.Image_cardOutShow.stopAllActions();
        this.Image_cardOutShow.setVisible(false);

        this.Image_cardOutCheck.setVisible(false);

        var game = ClientData.getInstance().getGame();
        var meChairID=game.getMeChairId();

        // 开始就隐藏，等开始后再显示
        this.Panel_roundInfo.setVisible(false);

        //清理手牌数据
        for(var chairID=0; chairID<4; ++chairID){
            if(meChairID==chairID){
                for(var i=0;i<CMD_LYMJ.MAX_COUNT; i++){
                    this.imgFUserCard[i].setVisible(false);
                    //this.imgFUserCard[i].setBackGroundColor({r:0xff ,g:0xff,b:0xff}); // 恢复颜色
                    this.imgFUserCard[i].setColor(cc.color(0xff, 0xff, 0xff));
                }
                // 设置一下13张位置
                this.imgFUserCard[13].setPosition(cc.p(this.initPosit13[chairID].x,this.initPosit13[chairID].y));
            }
            else{
                for(var i=0;i<CMD_LYMJ.MAX_COUNT; i++){
                    this.imgFOtherCard[chairID][i].setVisible(false);
                }
                // 设置一下13张位置
                this.imgFOtherCard[chairID][13].setPosition(cc.p(this.initPosit13[chairID].x,this.initPosit13[chairID].y));
            }
        }

        // 清理一下补花数
        this.Panel_flowerNormal.setVisible(false);
        this.setCurrentArtFontText(this.atlb_flowerNum_normal,0);
        this.Panel_flowerRight.setVisible(false);
        this.setCurrentArtFontText(this.atlb_flowerNum_right,0);
        this.Panel_flowerUp.setVisible(false);
        this.setCurrentArtFontText(this.atlb_flowerNum_up,0);
        this.Panel_flowerLeft.setVisible(false);
        this.setCurrentArtFontText(this.atlb_flowerNum_left,0);

        this.reset();
    },

    //设置当前局数
    setRoundInfo: function(){
    	var game = ClientData.getInstance().getGame();
    	if(!game){
    		return;
    	}
    	var curRounds = game.getPlayCount();
    	var totalRounds = game.getDrawCountLimit();
    	this.Text_rounds.string =  curRounds+"/"+totalRounds;
    },

    //设置剩余张数
    setCardssLeft: function(){
    	var game = ClientData.getInstance().getGame();
    	if(!game){
    		return;
    	}
    	var atlb_cardssLeft = this.Panel_roundInfo.getChildByName("atlb_cardssLeft");
        this.setCurrentArtFontText(atlb_cardssLeft,game.getLeftCardCount());
    },
    
    // 设置第14个牌位置
    setThe13CardPosist:function (currentUser) {
        var game=ClientData.getInstance().getGame();
        var myChair=game.getMeChairId();
        var temp = [];
        var x = 0;
        var y = 0;
        var nIndex = 0;

        if (currentUser == myChair)
            Temp =  this.imgFUserCard;
        else
            Temp =  this.imgFOtherCard[currentUser];

        for(var i = 0;i<CMD_LYMJ.MAX_COUNT;i++) {
            if ( Temp[i].isVisible() == true) {
                nIndex += 1;
            }
        }

        cc.log("当前有nIndex 张手牌显示 "+nIndex);

        if (currentUser == myChair){
            var Image_cardNormal = this.Panel_root.getChildByName("Image_cardNomal");
            var cardFrameW =  Image_cardNormal.getContentSize().width;
            x = nIndex*cardFrameW - 30;
            y = 0;
        }
        else {
            var index = this.getUserUIIndex(currentUser);
        	
        	if(index==1) {
                var Image_cardRight = this.Panel_root.getChildByName("Image_cardRight");
                var cardFrameH =  Image_cardRight.getContentSize().height/2 ;
                x = 0;
                y = nIndex*cardFrameH + 20;
            }
        	else if(index==2) {
                var Panel_cardUp = this.Panel_root.getChildByName("Panel_cardUp");
                var Image_cardUp = this.Panel_root.getChildByName("Image_cardUp");
                var Panel_cardUpWidth = Panel_cardUp.getContentSize().width;
                var cardFrameW =  Image_cardUp.getContentSize().width;
                x = Panel_cardUpWidth - nIndex*cardFrameW ;
                y = 0;
            }
        	else if(index==3) {
                var Panel_cardLeft = this.Panel_root.getChildByName("Panel_cardLeft");
                var Image_cardLeft = this.Panel_root.getChildByName("Image_cardLeft");
                var Panel_cardLeftHeight = Panel_cardLeft.getContentSize().height;
                var cardFrameH = Image_cardLeft.getContentSize().height/2 ;
                x = 0;
                y = Panel_cardLeftHeight - nIndex*cardFrameH - 20;
            }
        }

        Temp[13].setPosition(cc.p( x,y));
    },

    //后台发牌消息
    sendCard:function() {
        cc.log("----lymjDlgCardInfo.sendCard----");
        var game=ClientData.getInstance().getGame();
        var value=game.getSendCard();
        var currentUser=game.getCurrentUser();
        var myChair=game.getMeChairId();
        //隐藏出牌展示牌
        //this.Image_cardOutShow.setVisible(false);

        //显示发牌者的 第13张手牌
        if(currentUser == myChair) {
            this.cardData[13]=value;
            this.displayCard(value,13);
        }
        else {
            this.imgFOtherCard[currentUser][13].setVisible(true);
        }

        cc.log("发牌消息 更新第13张位置");
        this.setThe13CardPosist(currentUser);

        //设置出牌定时器
        this.setGameClock(currentUser, game.getTimeOutCard());

        if (currentUser == myChair)
        {
            //检测是否有杠 自摸
            this.outCardEnabled = true;
            //显示操作面板
            var arrOperator = [];
            var actionMask=game.getAcionMasks();
            //自摸
            if(actionMask & CMD_LYMJ.WIK_CHI_HU) {
                cc.log("自摸");
                this.zimo=this.cardData[13];
                arrOperator.push(CMD_LYMJ.WIK_CHI_HU);
            }
            var countGang=0;			//计算杠的数量
            var count=12;				//和摸的牌相比的牌
            //手牌 原来就有的杠
            for(var i=0;i<count;i++)
            {
                //原来手牌有4张
                if(i<count-2) {
                    if(this.cardData[i]!=0 &&
                        this.cardData[i]!=100 &&
                        this.cardData[i] == this.cardData[i+3] &&
                        this.cardData[i] == this.cardData[i+1] &&
                        this.cardData[i] == this.cardData[i+2])
                    {
                        cc.log("--暗杠--原来就有的杠  ：value "+this.cardData[i]+" 第几张牌开始"+i);
                        countGang++;
                        i = i+3;
                        this.bHGang(true, this.cardData[i]);
                        break;
                    }
                }
            }

            if(actionMask & CMD_LYMJ.WIK_GANG)
            {
                //分析明杠 暗杠
                //如果原来有碰  明杠
                for(var i=0; i<this.openFCardData.length;i++)
                {
                    var openCard = this.openFCardData[i];
                    if((openCard.cardMask&CMD_LYMJ.WIK_PENG) && openCard.cardValue==value){
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
                arrOperator.push(CMD_LYMJ.WIK_GANG);
            }

            /*  这个标志不会再这边 后台不会再发
            // 判断是否听
            if(actionMask & CMD_LYMJ.WIK_LISTEN) {
                arrOperator.push(CMD_LYMJ.WIK_LISTEN);
            }
            */

            //显示操作面板
            if(arrOperator.length!=0){
                this.showOperator(true, arrOperator);
            }
        }

        // 如果是十三幺查牌，则所有人可以看的牌
        var b131 = false; // 这个标记怎么得到；
        if (b131)
        {
            var strFile = this.getFCard(value);
            var Image_color = this.Image_cardOutCheck.getChildByName("Image_color");
            Image_color.loadTexture(strFile, ccui.Widget.PLIST_TEXTURE);
            this.Image_cardOutCheck.setVisible(true);
        }

    },


    //用户出牌
    outCard:function()
    {
        cc.log("----lymjDlgCardInfo.outCard----");
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
 // 等待修改
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

        //this.getFCard(cbOutCardData);

        strSex = (sex==1)?"boy_":"girl_";
        //报牌声音播放
        var strSoundFile = "lymj_"+strSex+strCard;
        cc.log("报牌声音播放 strSoundFile"+strSoundFile);
        SoundMgr.getInstance().playEffect(strSoundFile, 0, false);

        //设置出牌列表
        this.addToOutList(wOutCardUser, cbOutCardData);

        //
        if(myChair != wOutCardUser)
        {	cc.log("wOutCardUser+++++++++"+wOutCardUser);

            //隐藏出牌玩家的第13张 手牌
            this.imgFOtherCard[wOutCardUser][13].setVisible(false);

            // 显示出牌
            this.showOutPutCard(wOutCardUser,cbOutCardData);
        }

        //设置出牌定时器
        this.setGameClock((wOutCardUser+1)%4, game.getTimeOutCard());
    },

    showTingCard:function (cardValue,pos) {
        var game = ClientData.getInstance().getGame();
        var canOutCards = game.getTingOutCards();

        if (this.imgFUserCard[pos].isVisible()) {
        	this.imgFUserCard[pos].setColor(cc.color(195, 195, 195));
        	
        	// 不知道cardValue 是怎么排序的，保险的方法还是判断是否存在里面
        	for (var i = 0; i<canOutCards.length;i++)
        	{
        		if(canOutCards[i]>0)
                {
                    if(cardValue==canOutCards[i]) {
                        this.imgFUserCard[pos].setColor(cc.color(0xff, 0xff, 0xff));
                        break;
                    }
                }
        	}
        }
    },

    // 听牌后灰掉界面
    showTingCards:function () {
        for (var j = 0;j<this.cardData.length;j++) {
            this.showTingCard(this.cardData[j],j);
        }
    },

    //操作结果
    operateResult:function()
    {
        //隐藏展示牌
        this.Image_cardOutShow.setVisible(false);//隐藏provideUser 供牌用户的用户展示牌

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
        cc.log("---设置操作 定时器----");
        this.setGameClock(operateUser, game.getTimeOperateCard());
        var strSex = (sex==1)?"boy":"girl";

        if(operateUser == mychairid)
        {
            //当碰的时候赋值0 隐藏
            //碰
            if(operateCode & CMD_LYMJ.WIK_PENG)
            {	cc.log("---碰----");

                // 播放动画
                this.playingAnimateOnObj(this.Image_animal_normal,2);

                // 隐藏相应手牌
                this.cardData[13]=100;
                for(var i=1;i<3;i++) {
                    for(var j=0;j<14;j++) {
                        if(this.cardData[j]==operateCard[i]) {
                            cc.log("~~~~~operateCard"+operateCard[i]);
                            this.cardData[j]=100;
                            break;
                        }
                    }
                }
                //设置13手牌 取最后一张显示的牌来当
                var cardTemp = 0;
                for(var i=12;i>=0;i--) {
                    if(this.cardData[i]!=100&&this.cardData[i]!=0) {
                        cardTemp = this.cardData[i];
                        this.cardData[i] = 100;
                        break;
                    }
                }
                this.updateCard(this.cardData,14);
                this.cardData[13] = cardTemp;
                this.displayCard(cardTemp, 13);

                //  设置13牌的位置
                this.bClickCard=true;

                //显示开牌
                cc.log("---碰----显示开牌");
                this.setOpenCard(operateUser, operateCard[0], CMD_LYMJ.WIK_PENG);

                //修改出牌列表
                this.delLastFromOutList(provideUser);
            }

            //杠
            if(operateCode & CMD_LYMJ.WIK_GANG)
            {
                // 动画
                this.playingAnimateOnObj(this.Image_animal_normal,3);

                if(provideUser == operateUser){
                    //自摸碰杠
                    var bGang=false;
                    for(var i=0;i<this.openFCardData.length;i++){
                        var openCard = this.openFCardData[i];
                        if(openCard.cardMask&CMD_LYMJ.WIK_PENG && openCard.cardValue == operateCard[0]){
                            //自摸明杠
                            bGang = true;
                            this.setOpenCard(mychairid, operateCard[0], CMD_LYMJ.WIK_GANG);

                            //移除操作玩家第13张手牌
                            this.cardData[13] = 100;
                            break;
                        }
                    }
                    //自摸暗杠
                    if(!bGang){
                        //自摸暗杠
                        this.setOpenCard(mychairid, operateCard[0], CMD_LYMJ.WIK_ANGANG);

                        //移除暗杠的牌
                        for(var i=0;i<CMD_LYMJ.MAX_COUNT;i++)
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
                    this.setOpenCard(operateUser, operateCard[0], CMD_LYMJ.WIK_GANG);

                    //移除杠的牌
                    for(var i=0;i<CMD_LYMJ.MAX_COUNT;i++)
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
            var index = this.getUserUIIndex(operateUser);

            var obj;
            if (index==1)
                obj = this.Image_animal_right;
            else if (index==2 )
                obj = this.Image_animal_up;
            else if (index==3 )
                obj = this.Image_animal_left;

            if(operateCode & CMD_LYMJ.WIK_PENG)
            {
                // 动画
                this.playingAnimateOnObj(obj ,2);

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
                this.setOpenCard(operateUser, operateCard[0], CMD_LYMJ.WIK_PENG);

                //修改出牌列表
                this.delLastFromOutList(provideUser);
            }

            //杠
            if(operateCode &CMD_LYMJ.WIK_GANG)
            {
                // 动画
                this.playingAnimateOnObj(obj ,3);

                //判断是否自摸杠碰杠
                if(provideUser == operateUser){
                    var bGang=false;
                    if(this.openTCardData[operateUser]){
                        for(var i=0;i<this.openTCardData[operateUser].length;i++){
                            var openCard = this.openTCardData[operateUser][i];
                            if(openCard.cardMask&CMD_LYMJ.WIK_PENG && openCard.cardValue == operateCard[0]){
                                //自摸明杠
                                cc.log("+++++++++自摸明杠+++++++++");
                                bGang = true;
                                this.setOpenCard(operateUser, operateCard[0], CMD_LYMJ.WIK_GANG);

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
                        this.setOpenCard(operateUser, operateCard[0], CMD_LYMJ.WIK_ANGANG);

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
                    cc.log("+++++++++明杠+++++++++");
                    //明杠
                    this.setOpenCard(operateUser, operateCard[0], CMD_LYMJ.WIK_GANG);

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

        cc.log("操作结果 更新第13张位置");
        this.setThe13CardPosist(operateUser);

        //播放操作动画
        cc.log("---播放操作动画---");
        //播放操作 声音
        cc.log("---播放操作 声音---");
        if(operateCode & CMD_LYMJ.WIK_PENG){
            SoundMgr.getInstance().playEffect("lymj_"+strSex+"_peng", sex, false);
        }
        else if(operateCode & CMD_LYMJ.WIK_GANG){
            SoundMgr.getInstance().playEffect("lymj_"+strSex+"_gang", sex, false);
        }
        else if(operateCode & CMD_LYMJ.WIK_CHI_HU){
            SoundMgr.getInstance().playEffect("lymj_"+strSex+"_chi_hu", sex, false);
        }
    },

    //听牌操作结果
    onListenOperateResult:function() {
        //隐藏展示牌
        this.Image_cardOutShow.setVisible(false);//隐藏provideUser 供牌用户的用户展示牌

        var game = ClientData.getInstance().getGame();
        var operateUser = game.getListenOperateUser();// 听牌操作用户
        var mychairid = game.getMeChairId();

        //判断声音男1女0
        var sex = 0;
        if (operateUser == mychairid)
            sex = g_objHero.getGender();
        else {
            var table = ClientData.getInstance().getTable();
            var player = table.getPlayerByChairID(operateUser);
            sex = player.getGender();
        }
        //设置操作 定时器
        cc.log("---设置操作 定时器----");
        this.setGameClock(operateUser, game.getTimeOperateCard());
        var strSex = (sex==1)?"boy":"girl";

        // 显示这个用户听状态
        if (operateUser!=mychairid)
        {
            cc.log("---显示这个用户听状态----");
            var index = this.getUserUIIndex(operateUser);
            var strWho = "My";
            switch(index){
                case 0:{ strWho = "My"; 	break; }//自己
                case 1:{ strWho = "Right"; 	break; }//右边
                case 2:{ strWho = "Up"; 	break; }//对面
                case 3:{ strWho = "Left"; 	break; }//左边
                default: break;
            }
            var readyStateNodeName = "Image_state"+strWho;
            var DlgLymjMain = UIMgr.getInstance().getDlg(ID_DlgLymjMain);
            if(!DlgLymjMain){
                return;
            }
            var state = DlgLymjMain.Panel_ready.getChildByName(readyStateNodeName);
            state.setVisible(true);
            var imagePath = "lymj_main/main_listernState.png";
            state.loadTexture(imagePath, ccui.Widget.LOCAL_TEXTURE);
        }


        cc.log("操作结果 更新第13张位置");
        this.setThe13CardPosist(operateUser);

        //播放操作动画
        cc.log("---播放听操作动画---");
        //播放操作 声音
        cc.log("---播放听操作 声音---");

        //SoundMgr.getInstance().playEffect("lymj_"+strSex+"_ting", sex, false);
    },

    //排序手牌
    updateCard:function(cardData,cardCount){
        for(var i=0; i<CMD_LYMJ.MAX_COUNT;i++) {
            if(cardData[i]==0)
                cardData[i] = 100;
        }
        var bSorted=true;
        var swichData=0;
        var last=cardCount-1;
        do{
            bSorted=true;
            for(var i=0; i<last;i++) {
                if(cardData[i]>cardData[i+1]) {
                    bSorted=false;
                    swichData=cardData[i];
                    cardData[i]=cardData[i+1];
                    cardData[i+1]=swichData;
                }
            }
            last--;
        }while(bSorted == false);

        this.cardData=cardData;
        for(var i=cardCount-1;i>=0;i--) {
            this.displayCard(this.cardData[i],i);
        }
        cc.log("排序手牌====333:"+JSON.stringify(cardData));
        

    },

    // 设定游戏时钟
    setGameClock: function(nextUser,times){
        this.clockActionUser = nextUser;
        var Image_timeBg = this.Panel_roundInfo.getChildByName("Image_timeBg");
        Image_timeBg.setVisible(true);

        var Image_pointer = Image_timeBg.getChildByName("Image_pointer");

        var atlb_timesLeft = this.Panel_roundInfo.getChildByName("atlb_timesLeft");

        if(times==0){
          //  Image_timeBg.setVisible(false);

            this.setCurrentArtFontText(atlb_timesLeft,"0");
            return
        }

        var game = ClientData.getInstance().getGame();
        if(!game){
            return false;
        }

        game.setUserAction(this.clockActionUser);
        cc.log("-----setGameClock--setUserAction--this.clockActionUser--"+this.clockActionUser);

        if(this.scheduleCallBack)
            LymjUIMgr.getInstance().unschedule(this.scheduleCallBack, this);

        //设置指针指向
        cc.log("-----设置指针指向---");

        var index = this.getUserUIIndex(this.clockActionUser);

        var texture = "";
        if(index==0) {
            texture =  "lymj_main/main_round_pointer_down.png";
        }
        else if(index==1) {
            texture =  "lymj_main/main_round_pointer_right.png";
        }
        else if(index==2) {
            texture =  "lymj_main/main_round_pointer_up.png";
        }
        else if(index==3) {
            texture =  "lymj_main/main_round_pointer_left.png";
        }

        Image_pointer.loadTexture(texture,ccui.Widget.PLIST_TEXTURE);
        Image_pointer.setOpacity(0);
        var arryAction =[];
        var actionInterval = 0.5;
        arryAction.push( cc.fadeTo(actionInterval, 255));
        arryAction.push( cc.fadeTo(actionInterval, 255*0.6));

        var run = cc.CallFunc(function(){
            Image_pointer.runAction( cc.sequence(cc.sequence(arryAction), run));
        },this);
        Image_pointer.stopAllActions();
        Image_pointer.runAction( cc.sequence(cc.sequence(arryAction), run));

        //Image_timeBg.setVisible(true);

        //设置定时器

        this.setCurrentArtFontText(atlb_timesLeft,times);
        cc.log("---this.clockActionUser--"+this.clockActionUser+"---倒数时间---------------------"+times);

        this.curTimes = times;
        if(!this.scheduleCallBack){
            this.scheduleCallBack = function(dt){
                this.curTimes--;

                var DlgLymjMain = UIMgr.getInstance().getDlg(ID_DlgLymjMain);
                if(!DlgLymjMain){
                    LymjUIMgr.getInstance().unschedule(this.scheduleCallBack, this);
                    return;
                }
                if(this.curTimes==0){
                    LymjUIMgr.getInstance().unschedule(this.scheduleCallBack, this);
                }
                cc.log("---this.clockActionUser--"+this.clockActionUser+"---倒数时间---------------------"+this.curTimes);

                this.setCurrentArtFontText(atlb_timesLeft,this.curTimes);


                if(this.curTimes<=5){
                    //播放提示音
                    cc.log("----倒数时间 <=5--播放提示音-----");
                }


                if(this.curTimes<=0)
                {
                    return; // 房卡类型；直接屏蔽
                    /*
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
                                LymjGameMsg.getInstance().sendOutCard(data);
                                this.cardData[13]=100;
                                this.imgFUserCard[13].setVisible(false);

                                //隐藏操作提示面板
                                this.showOperator(false, []);

                                this.outCardEnabled = false;
                            }
                            else if(actionMask!=CMD_LYMJ.WIK_NULL)
                            {
                                cc.log("操作时间到:");
                                var data={
                                    cbOperateCode: CMD_LYMJ.WIK_NULL,
                                    cbOperateCard: 0
                                };
                                cc.log("sendOperateCard = " + JSON.stringify(data));
                                LymjGameMsg.getInstance().sendOperateCard(data);

                                //隐藏操作提示面板
                                this.showOperator(false, []);

                                game.setAcionMasks(CMD_LYMJ.WIK_NULL);
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
                    */
                }

            }
        }
        LymjUIMgr.getInstance().schedule(this.scheduleCallBack, 1, cc.REPEAT_FOREVER, this);
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
        var color = ["wan","tong", "suo", "feng","jian","hua"];
        var nCardColor = Math.floor(cardVal/16)
        var nValue = cardVal%16;
        cc.log("牌    "+"lymj_cardAndColor/"+color[nCardColor]+"/"+color[nCardColor]+"_"+nValue+".png");
        return ("lymj_cardAndColor/"+color[nCardColor]+"/"+color[nCardColor]+"_"+nValue+".png");
    },

    //绘制手牌
    displayCard:function(cardVal,pos)
    {
        if(cardVal == 0  || cardVal == 100)
        {
        	cc.log("asdfasdfasd cardVal = "+cardVal);
            this.imgFUserCard[pos].setVisible(false);
        }
        else
        {
            if(this.imgFUserCard[pos]!=null)
            {
                var colorImage = this.imgFUserCard[pos].getChildByName("Image_color");
                if(colorImage!=null )
                {
                    var texture =  this.getFCard(cardVal);
                    if(texture!=null) {
                        colorImage.loadTexture(texture,ccui.Widget.PLIST_TEXTURE);
                    }
                    else {
                        cc.log(cardVal + "牌 texture");
                    }
                    this.imgFUserCard[pos].setVisible(true);

                    // 如果是金， 则显示动画；
                    var Image_kin  = this.imgFUserCard[pos].getChildByName("Image_kin");
                    if (Image_kin) {
                        Image_kin.setVisible(false);  // 默认隐藏
                        Image_kin.removeAllChildren(); // 删除动画
                        var game = ClientData.getInstance().getGame();
                        var goldCardValue = game.getGoldCard();
                        if (goldCardValue != undefined) {
                            if (cardVal == goldCardValue) {
                                cc.log("绘制金牌动画");
                                Image_kin.setVisible(true);
                                this.playingAnimateOnObj(Image_kin,7);
                            }
                        }
                        else {
                            cc.log("还未定出金牌金牌还是空的=========》》》》");
                        }
                    }

                    // 如果是听牌的话，就判断是否是在听牌过程中
                   var game = ClientData.getInstance().getGame();
                    var chairID = game.getMeChairId();
                    var hearStatus = game.getHearStatus();
                    if (hearStatus!= undefined && hearStatus[chairID]==1)
                    {
                        cc.log("听牌状态display");
                    	if(pos==13)
                    		this.imgFUserCard[pos].setColor(cc.color(0xff, 0xff, 0xff)); // 用户已经选牌过了，处于听了；
                    	else {
                    		cc.log("display 属于听牌状态了");
                    		this.imgFUserCard[pos].setColor(cc.color(195, 195, 195)); 
                    	}
                    }

                }
                else {
                    cc.log("牌 是空的");
                }

            }
            else{
                cc.log("牌this.imgFUserCard[pos] = null");
            }

        }
    },

    //显示牌面
    showCard: function(){
        //SoundMgr.getInstance().playMusic("dzqs_GAME_START", 0, false);

        // 开始游戏了，就显示牌局信息
        this.Panel_roundInfo.setVisible(true);


        //显示自己的牌
        var game = ClientData.getInstance().getGame();
        this.cardData=game.getMeCards();
        cc.log("显示牌面 牌数据 = " + JSON.stringify(this.cardData));
        //为0的都换成100
        for(var i=0;i<CMD_LYMJ.MAX_COUNT;i++)
        {
            //为0的换成100  是为了排序
            if(this.cardData[i] == 0)
                this.cardData[i]=100;
        }

        this.updateCard(this.cardData,CMD_LYMJ.MAX_COUNT);   //更新牌

        //为0的都换成100
        for(var i=0;i<CMD_LYMJ.MAX_COUNT;i++)
        {
            //为0的换成100  是为了排序
            if(this.cardData[i] == 0)
                this.cardData[i]=100;
            this.displayCard(this.cardData[i],i);
        }

        //显示其他玩家的固定手牌
        for(var userID=0; userID<CMD_LYMJ.GAME_PLAYER; userID++){
            if(this.imgFOtherCard[userID]){
                for(var i=0;i<CMD_LYMJ.MAX_COUNT-1;i++)
                {
                    this.imgFOtherCard[userID][i].setVisible(true);
                }
            }
        }

        //显示庄家的活动手牌
        var bankerID = game.getBanker();
        var meChairID=game.getMeChairId();
        for(var chairID=0;chairID<CMD_LYMJ.GAME_PLAYER; chairID++){
            if(bankerID==chairID){
                (chairID==meChairID)?this.imgFUserCard[13].setVisible(true):this.imgFOtherCard[chairID][13].setVisible(true);
            }
            else{
                (chairID==meChairID)?this.imgFUserCard[13].setVisible(false):this.imgFOtherCard[chairID][13].setVisible(false);
            }

        }

        //设置定时器
        this.setGameClock(game.getBanker(), game.getTimeOutCard());
    },

    //游戏结束
    onGameEnd:function(result){
        var dlg = UIMgr.getInstance().getDlg(ID_DlgDialogScene);
        if(dlg){
            return;
        }
        cc.log("----游戏结束---");
        //最后一局不显示准备按钮
        var game = ClientData.getInstance().getGame();
        var curRounds = game.getPlayCount();
        var totalRounds = game.getDrawCountLimit();
        if(curRounds==totalRounds){
            cc.log("显示战绩页");
            //清理界面
            var dlgCardsInf=UIMgr.getInstance().getDlg(ID_DlgLymjCardsInfo);
            dlgCardsInf.doClear();

            //显示战绩
            var DlgLymjRankCenter = UIMgr.getInstance().openDlg(ID_DlgLymjRankCenter);
            DlgLymjRankCenter.show();

            //清理历史数据
            LymjUIMgr.getInstance().removeGameInfo();
        }
        else{
            cc.log("显示结算界面");
            //显示结算界面
            var dlgSettlement = UIMgr.getInstance().openDlg(ID_DlgLymjResult);
            dlgSettlement.show(result);
        }
    },

    //断线重连
    onBreak:function(){
        this.doClear();
        
        // 开始游戏了，就显示牌局信息
        this.Panel_roundInfo.setVisible(true);
        
        var game=ClientData.getInstance().getGame();
        var meChairID=game.getMeChairId();
        var currentUser= game.getCurrentUser();
        cc.log("断线重连-currentUser-"+currentUser);

        var cbActionMask=game.getAcionMasks();
        //
        if(cbActionMask!=0 && currentUser==INVALID_CHAIR){
            currentUser = meChairID;
        }

        //显示手牌
        do{
            this.cardData=game.getMeCards();
            cc.log("显示牌面 牌数据 = " + JSON.stringify(this.cardData));
            //为0的都换成100
            for(var i=0;i<CMD_LYMJ.MAX_COUNT;i++)
            {
                //为0的换成100  是为了排序
                if(this.cardData[i] == 0)
                    this.cardData[i]=100;
            }
            //更新牌
            this.updateCard(this.cardData,CMD_LYMJ.MAX_COUNT);

            //设置自己的第13手牌
            if(currentUser==meChairID && (this.cardData[13]==100 || this.cardData[13]==0)){
                for(var i=CMD_LYMJ.MAX_COUNT-1;i>=0;i--)
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
                        break;
                    }
                }
            }

            //显示其他玩家的固定手牌
            var carCount = game.getCardCount();
            for(var chairID=0;chairID<CMD_LYMJ.GAME_PLAYER; chairID++){
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
            for(var chairID=0;chairID<CMD_LYMJ.GAME_PLAYER; chairID++){
                if(currentUser==chairID){
                    (chairID==meChairID)?this.imgFUserCard[13].setVisible(true):this.imgFOtherCard[chairID][13].setVisible(true);
                }
                else{
                    (chairID==meChairID)?this.imgFUserCard[13].setVisible(false):this.imgFOtherCard[chairID][13].setVisible(false);
                }
            }

            //设置定时器
            cc.log("显示活动玩家的活动手牌+++++++++");
            if(currentUser!=INVALID_CHAIR){
                this.setGameClock(currentUser, game.getTimeOutCard());
            }

        }while(false);

        //出牌信息
        cc.log("出牌信息+++++++++");
        do{
            var wOutCardUser=game.getOutCardUser();
            var cbOutCardData=game.getOutCardData();
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
                var Image_kin  = this.Image_cardOutShow.getChildByName("Image_kin");
                if (Image_kin) {
                    if (cbOutCardData==game.getGoldCard())
                        Image_kin.setVisible(true);
                    else
                        Image_kin.setVisible(false);
                }

                this.Image_cardOutShow.setPosition(cc.p(668.60,198.98));
                this.Image_cardOutShow.setScale(1.0);//2
                this.Image_cardOutShow.setOpacity(255);
                this.Image_cardOutShow.setVisible(true);
            }
            //出牌列表
            for(var chairID=0;chairID<CMD_LYMJ.GAME_PLAYER; chairID++){
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
            for(var chairID=0;chairID<CMD_LYMJ.GAME_PLAYER; chairID++){
                for(var j=0;j<cbWeaveCount[chairID];j++)
                {
                    var cbOperateData = WeaveItemArray[chairID][j].cbCardData;
                    cc.log("WeaveItemArray 组合牌数据" + JSON.stringify(WeaveItemArray));
                    cc.log("cbOperateData 组合牌数据" + JSON.stringify(cbOperateData));

                    var nShowStatus = CMD_LYMJ.WIK_NULL;
                    var cbParam = WeaveItemArray[chairID][j].cbPublicCard;
                    if(cbParam==CMD_LYMJ.WIK_GANERAL){
                        //碰
                        nShowStatus = CMD_LYMJ.WIK_PENG;
                    }
                    else if(cbParam==CMD_LYMJ.WIK_MING_GANG){
                        nShowStatus = CMD_LYMJ.WIK_GANG;
                    }
                    else if(cbParam==CMD_LYMJ.WIK_FANG_GANG){
                        nShowStatus = CMD_LYMJ.WIK_GANG;
                    }
                    else if(cbParam==CMD_LYMJ.WIK_AN_GANG){
                        nShowStatus = CMD_LYMJ.WIK_ANGANG;
                    }

                    //显示开牌
                    this.setOpenCard(chairID, cbOperateData[0], nShowStatus);
                }
            }
        }while(false);

        //操作显示
        do{
            var actionCard=game.getActionCard();
            var cbActionMask=game.getAcionMasks();
            //
            if(cbActionMask!=0){
                //自己的操作提示
                this.imgFUserCard[13].setVisible(false);

                //打开提示面板
                cc.log("--打开操作提示面板--");
                LymjUIMgr.getInstance().onOperatorTip();
                this.setGameClock(currentUser, game.setTimeOperateCard());
            }
        }while(false);

        // 显示金牌标志
        this.updateGoldMedal();

        // 显示补花个数
        var flowerNum = game.getFlowerRecords();
        for ( var i = 0;i<flowerNum.length;i++) {
            if(flowerNum[i]>0){
                this.updateFlowerNum(i);
            }
        }

        cc.log("======补花个数0:("+flowerNum[0] +")1:("+flowerNum[1]+")2:("+flowerNum[2]+")3:("+flowerNum[3]+")");

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
        this.Panel_cardPutOut.getChildByName("ListView_right").removeAllItems();
        this.Panel_cardPutOut.getChildByName("ListView_up").removeAllItems();
        this.Panel_cardPutOut.getChildByName("ListView_left").removeAllItems();

        this.Panel_cardPutOut.getChildByName("ListView_nomal_0").removeAllItems();
        this.Panel_cardPutOut.getChildByName("ListView_right_0").removeAllItems();
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

        var index = this.getUserUIIndex(actionUser);

        switch(index){
            case 0:{
                //自己
                var ListView_nomal = this.Panel_cardPutOut.getChildByName("ListView_nomal_0");
                var ListView_nomal_0 = this.Panel_cardPutOut.getChildByName("ListView_nomal");
                if(ListView_nomal.children.length==10 && ListView_nomal_0.children.length>0){
                    ListView_nomal = ListView_nomal_0;
                }

                ListView_nomal.removeLastItem();
                break;
            }
            case 1:{
                //右边
                var ListView_right = this.Panel_cardPutOut.getChildByName("ListView_right_0");
                var ListView_right_0 = this.Panel_cardPutOut.getChildByName("ListView_right");
                if(ListView_right.children.length==10 && ListView_right_0.children.length>0){
                    ListView_right = ListView_right_0;
                }

                ListView_right.removeLastItem();
                break;
            }
            case 2:{
                //对面
                var ListView_up = this.Panel_cardPutOut.getChildByName("ListView_up_0");
                var ListView_up_0 = this.Panel_cardPutOut.getChildByName("ListView_up");
                if(ListView_up.children.length==10 && ListView_up_0.children.length>0){
                    ListView_up = ListView_up_0;
                }

                ListView_up.removeLastItem();
                break;
            }
            case 3:{
                //左边
                var ListView_left = this.Panel_cardPutOut.getChildByName("ListView_left_0");
                var ListView_left_0 = this.Panel_cardPutOut.getChildByName("ListView_left");
                if(ListView_left.children.length==10 && ListView_left_0.children.length>0){
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
        var bGoldCard = game.getGoldCard() == cardValue ? true:false;

        var index = this.getUserUIIndex(actionUser);

        switch(index){
            case 0:{
                //自己
                var ListView_nomal = this.Panel_cardPutOut.getChildByName("ListView_nomal_0");
                var Image_cardNomal = this.Panel_cardPutOut.getChildByName("Image_cardNomal").clone();
                Image_cardNomal.setVisible(true);
                Image_cardNomal.getChildByName("Image_color").loadTexture(this.getFCard(cardValue), ccui.Widget.PLIST_TEXTURE);
                Image_cardNomal.getChildByName("Image_kin").setVisible(bGoldCard);

                if(ListView_nomal.children.length==10){
                    ListView_nomal = this.Panel_cardPutOut.getChildByName("ListView_nomal");
                }
                ListView_nomal.pushBackCustomItem(Image_cardNomal);

                break;
            }
            case 1:{
                //右边
                var ListView_right = this.Panel_cardPutOut.getChildByName("ListView_right_0");
                var Image_cardRight = this.Panel_cardPutOut.getChildByName("Image_cardRight").clone();
                Image_cardRight.setVisible(true);
                Image_cardRight.getChildByName("Image_color").loadTexture(this.getFCard(cardValue), ccui.Widget.PLIST_TEXTURE);
                Image_cardRight.getChildByName("Image_kin").setVisible(bGoldCard);

                if(ListView_right.children.length==10){
                    ListView_right = this.Panel_cardPutOut.getChildByName("ListView_right");
                }
                ListView_right.pushBackCustomItem(Image_cardRight);
                break;
            }
            case 2:{
                //对面
                var ListView_up = this.Panel_cardPutOut.getChildByName("ListView_up_0");
                var Image_cardUp = this.Panel_cardPutOut.getChildByName("Image_cardUp").clone();
                Image_cardUp.setVisible(true);
                Image_cardUp.getChildByName("Image_color").loadTexture(this.getFCard(cardValue), ccui.Widget.PLIST_TEXTURE);
                Image_cardUp.getChildByName("Image_kin").setVisible(bGoldCard);

                if(ListView_up.children.length==10){
                    ListView_up = this.Panel_cardPutOut.getChildByName("ListView_up");
                }
                ListView_up.pushBackCustomItem(Image_cardUp);
                break;
            }
            case 3:{
                //左边
                var ListView_left = this.Panel_cardPutOut.getChildByName("ListView_left_0");
                var Image_cardLeft = this.Panel_cardPutOut.getChildByName("Image_cardLeft").clone();
                Image_cardLeft.setVisible(true);
                Image_cardLeft.getChildByName("Image_color").loadTexture(this.getFCard(cardValue), ccui.Widget.PLIST_TEXTURE);
                Image_cardLeft.getChildByName("Image_kin").setVisible(bGoldCard);

                if(ListView_left.children.length==10){
                    ListView_left = this.Panel_cardPutOut.getChildByName("ListView_left");
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
        var nAction = game.getUserAction();
        if(meChairID!=nAction || !this.outCardEnabled){

            cc.log("--不是自己的操作时间--"+meChairID+"!="+nAction);
            return;
        }

        // 判断一下不是花...

        for(var i=0;i<CMD_LYMJ.MAX_COUNT;i++)
        {
            if(this.imgFUserCard[i]==selectCard){
                cc.log("--出牌--找到对应的牌型--");
                //获取牌数据
                var cardValue = this.cardData[i];

                // 判断一下是不是花牌
                if (cardValue>= 0x51 && cardValue<= 0x58) {
                    cc.log("--不就措施，出牌--不能打花牌，请补牌再出牌--");
                    var game=ClientData.getInstance().getGame();
                    var data={
                        cbCardData: cardValue,
                    };
                    LymjGameMsg.getInstance().sendReplaceCard(data);
                    return;
                }

                //出牌展示
                var startPos = selectCard.getPosition();
                this.showOutPutCard(meChairID,cardValue,startPos);

                //发送出牌
                var game=ClientData.getInstance().getGame();
                var data={
                    cbCardData: cardValue,
                };
                cc.log("--发送出牌--cardValue = "+cardValue);
                LymjGameMsg.getInstance().sendOutCard(data);

                SoundMgr.getInstance().playEffect("lymj_outCard", 0, false);

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
    // 出牌展示
    showOutPutCard:function (chairID, cardValue,startPos,endPos) {
    	
    	var game = ClientData.getInstance().getGame();
    	if(!game)
    		return;
    	
    	var obj = this.Image_cardOutShow;
    	obj.setVisible(true);
    
        var strFile = this.getFCard(cardValue);
        var Image_color = obj.getChildByName("Image_color");
        Image_color.loadTexture(strFile, ccui.Widget.PLIST_TEXTURE);

        var Image_kin = obj.getChildByName("Image_kin");
        if (Image_kin) {// 判断是否是金
            Image_kin.setVisible(cardValue == game.getGoldCard() ? true : false);
        }

        var x = 0;
        var y = 0;
        var arryAction = [];
        var actionInterval = 0.1;
        var index = this.getUserUIIndex(chairID);

        if (index == 0) {
            startPos = this.Panel_cardNomal.convertToWorldSpace(startPos);
            startPos = this.Panel_cgpTemp.convertToNodeSpace(startPos);
            endPos = cc.p(668.60,198.98);
        }
        else
        {
            var startPos = this.imgFOtherCard[chairID][13].getPosition();
            if (index == 1) {
                x = 1099;
                y = 406.43; // right
                startPos = this.Panel_cardRight.convertToWorldSpace(startPos);
            }
            else if (index == 2) {
                x = 673.27;
                y = 655.13; // up
                startPos = this.Panel_cardUp.convertToWorldSpace(startPos);
            }
            else if (index == 3) {
                x = 245.46;
                y = 425.63; // left
                startPos = this.Panel_cardLeft.convertToWorldSpace(startPos);
            }
           endPos = cc.p(x,y);
        }

        obj.setPosition(startPos);
        obj.setScale(0.46);
        obj.setOpacity(0);
        var arryAction = [];
        var actionInterval = 0.1;
        var run;


       /* if(!cc.sys.isNative) {
            arryAction.push(new cc.moveTo(actionInterval, endPos));
            arryAction.push(new cc.scaleTo(actionInterval, 2.0, 2.0));
            arryAction.push(new cc.scaleTo(actionInterval, 1.0, 1.0));
            arryAction.push(new cc.fadeTo(actionInterval, 255));
            run=new cc.CallFunc(function(){
                //do something
            },this);

            obj.runAction(new cc.sequence(new cc.spawn(arryAction), run));
        }
        else*/
        {
            arryAction.push(cc.moveTo(actionInterval, endPos));
            arryAction.push(cc.scaleTo(actionInterval, 2.0, 2.0));
            arryAction.push(cc.fadeTo(actionInterval, 255));

            var run = cc.CallFunc(function(){
                this.Image_cardOutShow.runAction(cc.sequence(cc.delayTime(2.7),  cc.fadeTo(actionInterval, 0),
                    cc.CallFunc(function(){
                        obj.setVisible(false);
                    },this)));
            },this);

            obj.stopAllActions();
            obj.runAction( cc.sequence(cc.spawn(arryAction),cc.delayTime(0.3),cc.scaleTo(actionInterval, 1, 1), run));
        }
    },
    //牌点击回调
    onClickCardCallBack: function(sender, type){

    	var color = sender.getColor();
         if (color.r != 0xff || color.g != 0xff || color.b != 0xff )
         {
             cc.log("灰色按钮不能点击");
             return;
         }

        switch(type){
            case ccui.Widget.TOUCH_BEGAN:{
                SoundMgr.getInstance().playEffect("lymj_button", 0, false);

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

                            SoundMgr.getInstance().playEffect("lymj_button", 0, false);
                        }
                    }
                    else if(Math.sqrt(disX*disX+disY*disY)>20){
                        sender.setPositionY(20);

                        if(this.moveCard&&this.moveCard!=sender){
                            this.moveCard.setPositionY(0);
                        }
                        this.moveCard = sender;
                        cc.log("--------------滑动--选牌------20---------");
                        SoundMgr.getInstance().playEffect("lymj_selectCard", 0, false);
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
                    SoundMgr.getInstance().playEffect("lymj_selectCard", 0, false);
                }
                else if(this.clickCard==sender){
                    //出牌
                    cc.log("--------------点击--出牌---------------");
                    this.doOutCard(sender);
                    this.clickCard = null;
                    SoundMgr.getInstance().playEffect("lymj_button", 0, false);
                }
                else{
                    this.clickCard.setPositionY(0);
                    this.clickCard = sender;
                    sender.setPositionY(20);

                    SoundMgr.getInstance().playEffect("lymj_selectCard", 0, false);
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

        for(var actionUser=0; actionUser<CMD_LYMJ.GAME_PLAYER; ++actionUser){
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
        var meChairID = game.getMeChairId();
        var chairIndex = this.getUserUIIndex(actionUser);

        var cardTemp = null;
        var posX = 0;
        var posY = 0;
        switch(chairIndex){
            case 0: {
                //自己
                if (openCard.cardMask & CMD_LYMJ.WIK_PENG) {
                    //碰
                    cardTemp = this.Panel_root.getChildByName("Panel_mGangNomal").clone();
                }
                else if (openCard.cardMask & CMD_LYMJ.WIK_GANG) {
                    //明杠
                    cardTemp = this.Panel_root.getChildByName("Panel_mGangNomal").clone();
                }
                else if (openCard.cardMask & CMD_LYMJ.WIK_ANGANG) {
                    //暗杠
                    cardTemp = this.Panel_root.getChildByName("Panel_anGangNomal").clone();
                }

                //设置坐标
                posX = this.Panel_pgNomal.getContentSize().width - (index * (cardTemp.getContentSize().width + 10));
                posY = 0;
                this.Panel_pgNomal.addChild(cardTemp);

                break;
            }
            case 1:{
                //右边
                if(openCard.cardMask & CMD_LYMJ.WIK_PENG){
                    //碰
                    cardTemp = this.Panel_root.getChildByName("Panel_mGangRight").clone();
                }
                else if(openCard.cardMask & CMD_LYMJ.WIK_GANG){
                    //明杠
                    cardTemp = this.Panel_root.getChildByName("Panel_mGangRight").clone();
                }
                else if(openCard.cardMask & CMD_LYMJ.WIK_ANGANG){
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
                if(openCard.cardMask & CMD_LYMJ.WIK_PENG){
                    //碰
                    cardTemp = this.Panel_root.getChildByName("Panel_mGangUp").clone();
                }
                else if(openCard.cardMask & CMD_LYMJ.WIK_GANG){
                    //明杠
                    cardTemp = this.Panel_root.getChildByName("Panel_mGangUp").clone();
                }
                else if(openCard.cardMask & CMD_LYMJ.WIK_ANGANG){
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
                if(openCard.cardMask & CMD_LYMJ.WIK_PENG){
                    //碰
                    cardTemp = this.Panel_root.getChildByName("Panel_mGangLeft").clone();
                }
                else if(openCard.cardMask & CMD_LYMJ.WIK_GANG){
                    //明杠
                    cardTemp = this.Panel_root.getChildByName("Panel_mGangLeft").clone();
                }
                else if(openCard.cardMask & CMD_LYMJ.WIK_ANGANG){
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

        if(openCard.cardMask & CMD_LYMJ.WIK_PENG){
            for(var i=0; i<3; i++){
                var Image_color = cardTemp.getChildByName("Image_card_"+i).getChildByName("Image_color");
                Image_color.loadTexture(this.getFCard(openCard.cardValue), ccui.Widget.PLIST_TEXTURE);
            }
        }
        else if(openCard.cardMask & CMD_LYMJ.WIK_GANG){
            for(var i=0; i<3; i++){
                var Image_color =cardTemp.getChildByName("Image_card_"+i).getChildByName("Image_color");
                Image_color.loadTexture(this.getFCard(openCard.cardValue), ccui.Widget.PLIST_TEXTURE);
            }

            var Image_card_Mid = cardTemp.getChildByName("Image_card_Mid");
            Image_card_Mid.setVisible(true);
            var Image_color = Image_card_Mid.getChildByName("Image_color");
            Image_color.loadTexture(this.getFCard(openCard.cardValue), ccui.Widget.PLIST_TEXTURE);
        }
        else if(openCard.cardMask & CMD_LYMJ.WIK_ANGANG){
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
            this.Button_ting.setVisible(false);
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
        var poxX = this.Button_guo.getPosition().x;
        var tempPosX = poxX-this.Button_guo.getContentSize().width;
        for(var index=length-1; index>=0; index--){
            var bTaret = true;
            var Image_effect;
            switch(arrayShow[index]){
                case CMD_LYMJ.WIK_PENG:{//碰
                    this.Button_peng.setPositionX(tempPosX);
                    this.Button_peng.setVisible(isShow);
                    tempPosX -= this.Button_peng.getContentSize().width;
                    Image_effect = this.Button_peng.getChildByName("Image_effect");
                    break;
                }
                case CMD_LYMJ.WIK_GANG:{//杠
                    this.Button_gang.setPositionX(tempPosX);
                    this.Button_gang.setVisible(isShow);
                    tempPosX -= this.Button_ting.getContentSize().width;
                    Image_effect = this.Button_gang.getChildByName("Image_effect");
                    break;
                }
                case CMD_LYMJ.WIK_LISTEN:{//听
                    this.Button_ting.setPositionX(tempPosX);
                    this.Button_ting.setVisible(isShow);
                    tempPosX -= this.Button_ting.getContentSize().width;
                    Image_effect = this.Button_ting.getChildByName("Image_effect");
                    break;
                }
                case CMD_LYMJ.WIK_CHI_HU://吃胡
                case CMD_LYMJ.WIK_FANG_PAO:{//放炮
                   
                    this.Button_hu.setPositionX(tempPosX);
                    this.Button_hu.setVisible(isShow);
                    tempPosX -= this.Button_hu.getContentSize().width;
                    Image_effect = this.Button_hu.getChildByName("Image_effect");
                    break;
                }

                default:
                    bTaret = false;
                    break;
            }
            // 增加动画效果
            if (bTaret==true)
            {   //target.runAction( cc.repeatForever(arryAction));
                var actionInterval = 1;
                var run = cc.CallFunc(function(){
                    Image_effect.runAction(cc.sequence(cc.rotateBy(actionInterval,90), run));
                },this);
                Image_effect.stopAllActions();
                Image_effect.runAction( cc.sequence(cc.rotateBy(actionInterval,90), run));
            }
        }
    },
    //操作按钮
    onOperatorBtnClick:function(sender, type)
    {
        if (ccui.Widget.TOUCH_ENDED == type)
        {
            SoundMgr.getInstance().playEffect("lymj_button", 0, false);
            var name=sender.getName();
            var game = ClientData.getInstance().getGame();
            var actionCard=game.getActionCard();
            var code;
            var operateCard=[];
            operateCard[0]=0;
            operateCard[1]=0;
            operateCard[2]=0;
            switch(name){
                case "Button_peng":
                    code=CMD_LYMJ.WIK_PENG;
                    operateCard[0]=actionCard;
                    operateCard[1]=actionCard;
                    operateCard[2]=actionCard;
                    break;
                case "Button_gang":
                    code=CMD_LYMJ.WIK_GANG;
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
                case "Button_ting":
                    {
                        cc.log("广播听牌命令状态 直接返回");
                        LymjGameMsg.getInstance().sendTingOperateCard();
                        this.showOperator(false, []);
                        this.showTingCards();// 变灰
                        return;
                    }

                case "Button_hu":
                    code=CMD_LYMJ.WIK_CHI_HU;
                    operateCard[0]=actionCard;
                    break;
                case "Button_guo":
                    cade=CMD_LYMJ.WIK_NULL;
                    break;
                default:
                    break;
            };

            var data={
                cbOperateCode: code,
                cbOperateCard: operateCard
            };
            cc.log("sendOperateCard = " + JSON.stringify(data));
            LymjGameMsg.getInstance().sendOperateCard(data);
            this.showOperator(false, []);
        }
    },
	/*
	 onClickBtnEvent: function(sender, type){
	 if (ccui.Widget.TOUCH_BEGAN == type) {
	 SoundMgr.getInstance().playEffect("lymj_button", 0, false);

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
	 */

});
