
cc.log("--------ID_DlgZpmjCardsInfo = "  + ID_DlgZpmjCardsInfo);
DLG_CREATOR[ID_DlgZpmjCardsInfo] = function() {
    return new DlgZpmjCardsInfo();
};

var DlgZpmjCardsInfo = DlgBase.extend({
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
        this.cardData=[];	            //牌值
        this.bHandGang=false;         //是否有手杠暗杠
        this.handGangs=[];	                //手杠的牌 可能多张
        //this.gang=0;	                //手杠的牌
        this.outCardEnabled = true;	//是否可以出牌
        this.openFCount=0;            //己方历吃碰杠的数量
        this.openTCount=[];	        //对方历吃碰杠的数量
        this.openFCardData=[];	    //己方历吃碰杠的数据
        this.openTCardData=[];	    //对方历吃碰杠的数据

        // 调用game rest 的一些重新设置 待续....sxh 听牌数据，托管，补花 等数据
        var game = ClientData.getInstance().getGame();
        if(!game){
            return false;
        }
        //game.reset();


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

    // 设置艺术字大小
    setCurrentArtFontText:function (obj,text) {
        var str = ""+text;
        obj.setContentSize(cc.size(39 * str.length , 60)); // 39,60 分别是艺术字的 宽 高
        obj.string = text;
    },

    // 初始化
    init: function() {
        var json = ccs.load(res.zpmjDlgCardInfo_json);
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

        // 流局
        this.Image_liuju = this.Panel_root.getChildByName("Image_liuju");

        // Panel_Chi_Gang_Choose 列表
        this.Panel_Chi_Gang_Choose = this.Panel_root.getChildByName("Panel_Chi_Gang_Choose");

        //出牌列表
        this.Panel_cardPutOut = this.Panel_root.getChildByName("Panel_cardPutOut");

        // 花牌列表
        this.Panel_cardFlower = this.Panel_root.getChildByName("Panel_cardFlower");

        //动作面板
        this.Panel_operator = this.Panel_root.getChildByName("Panel_operator");
        this.Button_chi = this.setBtnCallBack(this.Panel_operator,"Button_chi",this.onOperatorBtnClick);
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
        for(var chairID=0;chairID<CMD_ZPMJ.GAME_PLAYER; chairID++){
            var curChairID = (meChairID+chairID)%CMD_ZPMJ.GAME_PLAYER;
            switch(chairID){
                case 0:{
                    //自己
                    this.imgFUserCard=[];
                    this.Panel_cardNomal = this.Panel_root.getChildByName("Panel_cardNomal");
                    var Image_cardNomal = this.Panel_root.getChildByName("Image_cardNomal");
                    var cardFrameW = Image_cardNomal.getContentSize().width;

                    //创建自己的牌对象
                    for(var i=0;i<CMD_ZPMJ.MAX_COUNT; i++){
                        var cardFrame = Image_cardNomal.clone();
                        cardFrame.addTouchEventListener(this.onClickCardCallBack, this);
                        cardFrame.setPosition(cc.p(cardFrameW*i,0));
                        cardFrame.setVisible(false);
                        this.Panel_cardNomal.addChild(cardFrame);
                        this.imgFUserCard[i]=cardFrame;
                    }

                    //设置出牌对象 13的那张
                    posit = cc.p(CMD_ZPMJ.MAX_COUNT*cardFrameW,0);
                    this.imgFUserCard[CMD_ZPMJ.MAX_COUNT-1].setPosition(posit); // 默认位置

                    break;
                }
                case 1:{
                    //右边
                    this.imgFOtherCard[curChairID] = [];

                    this.Panel_cardRight = this.Panel_root.getChildByName("Panel_cardRight");
                    var Image_cardRight = this.Panel_root.getChildByName("Image_cardRight");
                    var cardFrameH =  Image_cardRight.getContentSize().height/2 ; //40

                    for(var i=CMD_ZPMJ.MAX_COUNT-1;i>=0; i--){
                        var cardFrame = Image_cardRight.clone();
                        cardFrame.setPosition(cc.p(0,i*cardFrameH));
                        cardFrame.setVisible(false);
                        this.Panel_cardRight.addChild(cardFrame);
                        this.imgFOtherCard[curChairID][i]=cardFrame;
                    }

                    //设置出牌对象 13的那张
                    posit = cc.p(0,CMD_ZPMJ.MAX_COUNT*cardFrameH);
                    this.imgFOtherCard[curChairID][CMD_ZPMJ.MAX_COUNT-1].setPosition(posit); // 默认位置
                    break;
                }
                case 2:{
                    //对面
                    this.imgFOtherCard[curChairID] = [];
                    this.Panel_cardUp = this.Panel_root.getChildByName("Panel_cardUp");
                    var Image_cardUp = this.Panel_root.getChildByName("Image_cardUp");
                    var Panel_cardUpWidth = this.Panel_cardUp.getContentSize().width;
                    var cardFrameW = Image_cardUp.getContentSize().width-3;

                    for(var i=0;i<CMD_ZPMJ.MAX_COUNT; i++){
                        var cardFrame = Image_cardUp.clone();
                        var posX = Panel_cardUpWidth-i*cardFrameW;
                        cardFrame.setPosition(cc.p(posX,0));
                        cardFrame.setVisible(false);
                        this.Panel_cardUp.addChild(cardFrame);
                        this.imgFOtherCard[curChairID][i]=cardFrame;
                    }

                    posit = cc.p(Panel_cardUpWidth-CMD_ZPMJ.MAX_COUNT*cardFrameW,0)
                    this.imgFOtherCard[curChairID][CMD_ZPMJ.MAX_COUNT-1].setPosition(posit); // 默认位置
                    break;
                }
                case 3:{
                    //左边
                    this.imgFOtherCard[curChairID] = [];
                    this.Panel_cardLeft = this.Panel_root.getChildByName("Panel_cardLeft");
                    var Image_cardLeft = this.Panel_root.getChildByName("Image_cardLeft");
                    var Panel_cardLeftHeight = this.Panel_cardLeft.getContentSize().height;
                    var cardFrameH = Image_cardLeft.getContentSize().height/2 + 2;
                    for(var i=0;i<CMD_ZPMJ.MAX_COUNT; i++){
                        var cardFrame = Image_cardLeft.clone();
                        var posY = Panel_cardLeftHeight-i*cardFrameH;
                        cardFrame.setPosition(cc.p(0,posY));
                        cardFrame.setVisible(false);
                        this.Panel_cardLeft.addChild(cardFrame);
                        this.imgFOtherCard[curChairID][i]=cardFrame;
                    }

                    //设置出牌对象 13的那张
                    posit = cc.p(0,Panel_cardLeftHeight- CMD_ZPMJ.MAX_COUNT*cardFrameH);
                    this.imgFOtherCard[curChairID][CMD_ZPMJ.MAX_COUNT-1].setPosition(posit); // 默认位置
                    break;
                }
                default:
                    break;
            }
            this.initPosit13[chairID] = posit; // 保存开始位置
        }

        // 加载动画资源
        this.opFrameCach = cc.spriteFrameCache;
        this.opFrameCach.addSpriteFrames(res.zpmjAnimate_plist);
    },

    // 通过childId取得相对于自己的方位index 
    getUserUIIndex:function (user) {
    	
    	if (user == undefined)
    		return -1;
    	
        var game = ClientData.getInstance().getGame();
        if(!game){
            return false;
        }
        var meChairID = game.getMeChairId();
        var index = 0;
        while(true){
            if(((meChairID+index)%CMD_ZPMJ.GAME_PLAYER)==user){
                break;
            }
            index++;
        }
        return index;
    },

    // user2 相对于user1的左中右
    getUserUIByUserIndex:function (user1,user2) {

    	if (user1 == undefined ||user2 == undefined)
            return -1;

        var index = 0;
        while(true){
        	if(((user1+index)%CMD_ZPMJ.GAME_PLAYER)==user2){
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
            for (var i=0;i<CMD_ZPMJ.MAX_COUNT;i++){
                if (oldCardValue == this.cardData[i]){
                    this.cardData[i] = newCardValue;
                    // 更新牌值：判断是否是开局补花，开局的就得排序，不是开局是打牌的就不用
                    if(game.getIsInisFlower()==true)
                        this.updateCard(this.cardData, CMD_ZPMJ.MAX_COUNT); // 是否做排序，如果是 抓牌位 张就不做排序
                    else
                        this.displayCard(this.cardData[i],i); // 抓牌就是最后一张
                    break;
                }
            }
        }

        // 更新花数
        this.updateFlowerNum(replaceUser);

        // 显示动画效果，补花
        // 播放声音
        // 判断声音是男是女
        var sex=0;
        if(replaceUser == meChairID )
            sex=g_objHero.getGender();
        else{
            cc.log("----.wOutCardUser----"+replaceUser);
            var table = ClientData.getInstance().getTable();
            var player = table.getPlayerByChairID(replaceUser);
            sex=player.getGender();
        }
        var strSex = (sex==1)?"boy_":"girl_";
        SoundMgr.getInstance().playEffect("zpmj_"+ strSex +"replace", 0, false);
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
            this.cardData[CMD_ZPMJ.MAX_COUNT-1] = 100; // 隐藏
            this.imgFUserCard[CMD_ZPMJ.MAX_COUNT-1].setVisible(false);
        }
        else
        {
            this.imgFOtherCard[oldUser][CMD_ZPMJ.MAX_COUNT-1].setVisible(false);
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

        	this.updateCard(this.cardData,CMD_ZPMJ.MAX_COUNT);
       	}
    },

    // 更新某个用户补花的个数
    updateFlowerNum:function (chairID,bHideAll) {

        if(bHideAll==true) {
            this.Panel_cardFlower.getChildByName("Panel_flowerNormal").setVisible(false);
            this.Panel_cardFlower.getChildByName("Panel_flowerRight").setVisible(false);
            this.Panel_cardFlower.getChildByName("Panel_flowerUp").setVisible(false);
            this.Panel_cardFlower.getChildByName("Panel_flowerLeft").setVisible(false);
            return;
        }

        var game = ClientData.getInstance().getGame();
        if(!game){
            return false;
        }
        var flowerRecords = game.getFlowerRecords();
        var flowerNum = flowerRecords[chairID];
        var index = this.getUserUIIndex(chairID);
        var obj;
        if(index==0){
            obj = this.Panel_cardFlower.getChildByName("Panel_flowerNormal");
        }
        else if(index == 1) {
            obj = this.Panel_cardFlower.getChildByName("Panel_flowerRight");
        }
        else if(index==2){
            obj = this.Panel_cardFlower.getChildByName("Panel_flowerUp");
        }
        else if(index==3){
            obj = this.Panel_cardFlower.getChildByName("Panel_flowerLeft");
        }

        obj.setVisible(flowerNum>0?true:false);

        if(flowerNum>0) {
            this.setCurrentArtFontText(obj.getChildByName("atlb_Num"),flowerNum);
        }
    },

    // 更新用户插花个数
    updateInsertFlowerNum:function (chairID,bHideAll) {

        if(bHideAll==true) {
            this.Panel_cardFlower.getChildByName("Img_InsertFlower_Normal").setVisible(false);
            this.Panel_cardFlower.getChildByName("Img_InsertFlower_Right").setVisible(false);
            this.Panel_cardFlower.getChildByName("Img_InsertFlower_Up").setVisible(false);
            this.Panel_cardFlower.getChildByName("Img_InsertFlower_Left").setVisible(false);
            return;
        }

        var game = ClientData.getInstance().getGame();
        if(!game){
            return false;
        }
        var Records = game.getInsertFlowerRecords();
        var Num = Records[chairID];
        var index = this.getUserUIIndex(chairID);

        var obj;
        if(index==0){
            obj = this.Panel_cardFlower.getChildByName("Img_InsertFlower_Normal");
        }
        else if(index==1){
            obj = this.Panel_cardFlower.getChildByName("Img_InsertFlower_Right");
        }
        else if(index==2){
            obj = this.Panel_cardFlower.getChildByName("Img_InsertFlower_Up");
        }
        else if(index==3){
            obj = this.Panel_cardFlower.getChildByName("Img_InsertFlower_Left");
        }

        obj.setVisible(Num>0?true:false);

        if(Num>0) {
          obj.getChildByName("Text_Num").string = Num;
        }
    },

    /*
    *   onObj  ：动画播放的对象
	*	opType ：吃=1 碰=2 杠=3 听=4 胡=5 自摸=6 金=7 胡牌抓花=8 放炮动画=9 胡牌旋转特效=10
	*   cbFun  ：只针对不循环动画
    */
    playingAnimateOnObj:function(bgObj,opType,cbFun,bNotRemove){

        var onObj = bgObj;
    	var name = "";
    	var path = "";
    	var count = 20;
    	var time = 1.0/24;// 一张播放时间
    	var repeat = false;
    	var animFrames = [];
        var x = onObj.getContentSize().width/2;
        var y = onObj.getContentSize().height /2;

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
            var x = onObj.getContentSize().width/2;
            var y = -100;
    	} else if(opType == 6) {// zimo
            name = "tx7_00";
    	} else if (opType==7) {// 金
            count = 15;
            repeat = true;
            name = "tx1_00";
            time = 1.0/15;
        } else if(opType == 8) { //胡牌抓花=8
            count = 2;
            repeat = true;
            name = "catchFlower_";
            time = 1.0/8;
        }
        else if(opType == 9) { //放炮
            name = "tx8dianp00";
        }
        else if(opType == 10) { //胡牌旋转特效
            count = 25;
            repeat = true;
            time = 1.0/30;
            name = "tx9sxian00";
            // 旋转资源要放大2倍
            onObj = bgObj.clone();
            onObj.removeAllChildren();
            onObj.setAnchorPoint(0.5,0.5);
            onObj.setPosition(0,0);
            bgObj.addChild(onObj);
            onObj.setScale(2);
        }
        else {
            cc.log("未定义的动画类型");
            return;
        }

        // 吃碰杠胡 资源放大1.2倍
        if(opType>=1 && opType<=5) {
            // 资源要放大2倍
            onObj = bgObj.clone();
            onObj.removeAllChildren();
            onObj.setAnchorPoint(0.5,0.5);
            onObj.setPosition(0,0);
            bgObj.addChild(onObj);
            onObj.setScale(1.2);
        }

    	var animate = new cc.Sprite();

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
    		animate.runAction(cc.sequence(cc.animate(animation),cc.fadeTo(1.0, 0), cc.CallFunc(function(){
    			animate.removeFromParent();
    			if(cbFun)
                    cbFun();
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
        for(var chairID=0; chairID<CMD_ZPMJ.GAME_PLAYER; ++chairID){
            if(meChairID==chairID){
                for(var i=0;i<CMD_ZPMJ.MAX_COUNT; i++){
                    this.imgFUserCard[i].setVisible(false);
                    //this.imgFUserCard[i].setBackGroundColor({r:0xff ,g:0xff,b:0xff}); // 恢复颜色
                    this.imgFUserCard[i].setColor(cc.color(0xff, 0xff, 0xff));
                }
                // 设置一下13张位置
                this.imgFUserCard[CMD_ZPMJ.MAX_COUNT-1].setPosition(cc.p(this.initPosit13[chairID].x,this.initPosit13[chairID].y));
            }
            else{
                for(var i=0;i<CMD_ZPMJ.MAX_COUNT; i++){
                    this.imgFOtherCard[chairID][i].setVisible(false);
                }
                // 设置一下13张位置
                this.imgFOtherCard[chairID][CMD_ZPMJ.MAX_COUNT-1].setPosition(cc.p(this.initPosit13[chairID].x,this.initPosit13[chairID].y));
            }
        }

        // 清理一下补花数
        this.updateFlowerNum(0,true);

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

    //  用户托管标志更新
    updateTrustee:function () {
        var game = ClientData.getInstance().getGame();
        if(!game){
            return;
        }

       // 托管的话，只关注自己；1：:手牌要变灰；
        var DlgZpmjMain = UIMgr.getInstance().getDlg(ID_DlgZpmjMain);
        if(!DlgZpmjMain){
            return;
        }
        var myChildId = game.getMeChairId();
        var trustee = game.getTrustee();
        DlgZpmjMain.Panel_OnTopTouch.setVisible(trustee[myChildId]);
        // 手牌是否变灰色 待续

    },
    
    // 设置第最后一张牌位置
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

        for(var i = 0;i<CMD_ZPMJ.MAX_COUNT;i++) {
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

        Temp[CMD_ZPMJ.MAX_COUNT-1].setPosition(cc.p( x,y));
    },

    //后台发牌消息 （也有动作掩码，判断 自摸和杠  也需要告知是否有显示操作面板 ）
    sendCard:function() {
        cc.log("----zpmjDlgCardInfo.sendCard----");
        var game=ClientData.getInstance().getGame();
        var value=game.getSendCard();
        var currentUser=game.getCurrentUser();
        var myChair=game.getMeChairId();

        //隐藏出牌展示牌 & 隐藏界面 & 隐藏 操作选择界面
        // this.Image_cardOutShow.setVisible(false);
        this.showOperator(false, []);
        this.Panel_Chi_Gang_Choose.setVisible(false);

        //显示发牌者的 第13张手牌
        if(currentUser == myChair) {
            this.cardData[CMD_ZPMJ.MAX_COUNT-1]=value;
            this.displayCard(value,CMD_ZPMJ.MAX_COUNT-1);
        }
        else {
            this.imgFOtherCard[currentUser][CMD_ZPMJ.MAX_COUNT-1].setVisible(true);
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
            if(actionMask & CMD_ZPMJ.WIK_CHI_HU) {
                cc.log("自摸");
                this.zimo=this.cardData[CMD_ZPMJ.MAX_COUNT-1];
                arrOperator.push(CMD_ZPMJ.WIK_CHI_HU);
            }
            var countGang=0;			//计算杠的数量
            var count = CMD_ZPMJ.MAX_COUNT-2;				//和摸的牌相比的牌

            this.handGangs = []; // 重新清空

            //手牌 原来就有的杠
            for(var i=0;i<count;i++)
            {
                //原来手牌有4 张一样的牌
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
                        //this.bHGang(true, this.cardData[i]);
                        //this.bHandGang = true;
                        var obj = {"type":CMD_ZPMJ.TYPE_GANG_HAND4 , "value":this.cardData[i]};
                        this.handGangs.push(obj);

                        break;
                    }
                }
            }

            if(actionMask & CMD_ZPMJ.WIK_GANG)
            {
                //分析明杠 暗杠
                //如果原来有碰  明杠
                for(var i=0; i<this.openFCardData.length;i++)
                {
                    var openCard = this.openFCardData[i];
                    if((openCard.cardMask&CMD_ZPMJ.WIK_PENG) && openCard.cardValue==value){
                        cc.log("--明杠-- 碰杠  value "+value);
                        countGang++;
                        //this.bHGang(true, value);
                        //this.bHandGang = true;
                        var obj = {"type":CMD_ZPMJ.TYPE_GANG_PENG , "value":value};
                        this.handGangs.push(obj);
                        break;
                    }
                }

                //如果是手牌  则是暗杠 原来手牌有3张 发牌1张
                for(var i=0;i<CMD_ZPMJ.MAX_COUNT-3;i++){
                    if(this.cardData[i]==0 || this.cardData[i]==100){
                        break;
                    }

                    if(value!=this.cardData[i]){
                        continue;
                    }

                    if(this.cardData[i]==this.cardData[i+1] && this.cardData[i]==this.cardData[i+2]){
                        cc.log("--暗杠--手杠 value "+value);
                        //this.bHGang(true, value);
                        countGang++;
                        //this.bHandGang = true;
                        //this.handGangs.push(value);
                        var obj = {"type":CMD_ZPMJ.TYPE_GANG_HAND3_MY , "value":value};
                        this.handGangs.push(obj);
                        break;
                    }
                }
            }
            else
            {
                if(countGang>0)
                {
                    cc.log("注意：后台没有吧暗杠告诉我");
                }
            }

            if(countGang!=0){
                //显示操作面板
                arrOperator.push(CMD_ZPMJ.WIK_GANG);
            }

            /*  这个标志不会再这边 后台不会再发
            // 判断是否听
            if(actionMask & CMD_ZPMJ.WIK_LISTEN) {
                arrOperator.push(CMD_ZPMJ.WIK_LISTEN);
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
    outCard:function() {
        cc.log("----zpmjDlgCardInfo.outCard----");
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

        var color = ["w", "t", "s","f","j"];
        var strCard = "";
        var strSex = "";
        var nCardColor = Math.floor(cbOutCardData/16)
        var nValue = cbOutCardData%16;

        /*
        var nCardColor = Math.floor(cardVal/16);
        var nValue = cardVal%16;
        var color = ["tong","wan", "suo","feng", "hua"];
        if(nCardColor==3) {
            if(cardVal>0x34) {
                color[nCardColor] = "jian";
                nValue -=4;
            }
        }
        */


        strCard = color[nCardColor]+"_"+nValue;
        strSex = (sex==1)?"boy_":"girl_";

        //报牌声音播放
        var strSoundFile = "zpmj_"+strSex+strCard;
        cc.log("报牌声音播放 strSoundFile"+strSoundFile);
        SoundMgr.getInstance().playEffect(strSoundFile, 0, false);

        //出牌动画
        if(myChair != wOutCardUser) {
            cc.log("wOutCardUser+++++++++"+wOutCardUser);
            //隐藏出牌玩家的第13张 手牌
            this.imgFOtherCard[wOutCardUser][CMD_ZPMJ.MAX_COUNT-1].setVisible(false);
            // 显示出牌
            this.showOutPutCard(wOutCardUser,cbOutCardData);
        }
        else {
            var trustees =  game.getTrustee();
            if (trustees[myChair]==true)
            {	// 托管中
                //隐藏自己出牌的第13张手牌
                this.imgFUserCard[CMD_ZPMJ.MAX_COUNT-1].setVisible(false);
                // 显示出牌
                this.showOutPutCard(wOutCardUser,cbOutCardData);
            }
        }

        //设置出牌列表
        this.addToOutList(wOutCardUser, cbOutCardData);

        //设置出牌定时器
        this.setGameClock((wOutCardUser+1)%CMD_ZPMJ.GAME_PLAYER, game.getTimeOutCard());
    },

    // 听牌的时候，暗掉手牌
    showTingCard:function (cardValue,pos) {
        var game = ClientData.getInstance().getGame();
        var canOutCards = game.getTingOutCards();

        if (this.imgFUserCard[pos].isVisible()) {
        	this.imgFUserCard[pos].setColor(cc.color(195, 195, 195));
        	
        	// 不知道cardValue 是怎么排序的，保险的方法还是判断是否存在里面
        	for (var i = 0; i<canOutCards.length;i++) {
        		if(canOutCards[i]>0) {
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
            var DlgZpmjMain = UIMgr.getInstance().getDlg(ID_DlgZpmjMain);
            if(!DlgZpmjMain){
                return;
            }
            var state = DlgZpmjMain.Panel_ready.getChildByName(readyStateNodeName);
            state.setVisible(true);
            var imagePath = "zpmj_main/main_listernState.png";
            state.loadTexture(imagePath, ccui.Widget.LOCAL_TEXTURE);
        }


        cc.log("操作结果 更新第13张位置");
        this.setThe13CardPosist(operateUser);

        //播放操作动画
        cc.log("---播放听操作动画---");
        //播放操作 声音
        cc.log("---播放听操作 声音---");

        SoundMgr.getInstance().playEffect("zpmj_"+strSex+"_ting", sex, false);
    },

    //排序手牌
    updateCard:function(cardData,cardCount){
        for(var i=0; i<CMD_ZPMJ.MAX_COUNT;i++) {
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
            ZpmjUIMgr.getInstance().unschedule(this.scheduleCallBack, this);

        //设置指针指向
        cc.log("-----设置指针指向---");

        var index = this.getUserUIIndex(this.clockActionUser);

        var texture = "";
        if(index==0) {
            texture =  "zpmj_main/main_round_pointer_down.png";
        } else if(index==1) {
            texture =  "zpmj_main/main_round_pointer_right.png";
        } else if(index==2) {
            texture =  "zpmj_main/main_round_pointer_up.png";
        } else if(index==3) {
            texture =  "zpmj_main/main_round_pointer_left.png";
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

        //设置定时器
        this.setCurrentArtFontText(atlb_timesLeft,times);
        
        cc.log("---this.clockActionUser--"+this.clockActionUser+"---倒数时间---------------------"+times);

        this.curTimes = times;
        
        var currentUser = game.getCurrentUser();

        if(!this.scheduleCallBack)
        {
            this.scheduleCallBack = function(dt){
                this.curTimes--;

                var DlgZpmjMain = UIMgr.getInstance().getDlg(ID_DlgZpmjMain);
                if(!DlgZpmjMain){
                    ZpmjUIMgr.getInstance().unschedule(this.scheduleCallBack, this);
                    return;
                }
                if(this.curTimes==0){
                    ZpmjUIMgr.getInstance().unschedule(this.scheduleCallBack, this);
                }
               
               cc.log("---this.clockActionUser--"+this.clockActionUser+"---倒数时间---------------------"+this.curTimes);

                this.setCurrentArtFontText(atlb_timesLeft,this.curTimes);


                if(this.curTimes<=5){
                    //播放提示音
                    cc.log("----倒数时间 <=5--播放提示音-----");
                }

                if (this.curTimes<=0)
                {
                    // 发送 托管请求 成功后直接设置托管标志；（客户端只需要在这边设置就好了，其他都交给服务端来处理）
                    // 经过再次确认，现在这边只是做个保险，可以不发，后台自己维护timer
                    // 如果采用以出牌后，时间指针马上指向下家的话，这个时候下家可能超时（必须保证玩家的操作时间比超时时间短，or 客户端自己判断 ）

                	/* 后台判断了，客户端不需要再发送了
                	var meChairID = game.getMeChairId();

                    if (this.clockActionUser==meChairID)
                    {
                        // 必须是真的是自己操作（自己抓到牌，or 自己操作） 还是让后台判断吧；这样判断也有错误
                    	if (this.Panel_operator.isVisible()==true || currentUser == meChairID )
                        {
                    		var trustee = game.getTrustee();
                            
                            if(trustee[meChairID]==false)
                                ZpmjGameMsg.getInstance().sendbTrustee(true);
                        }
                    }
					*/
                    return;// 房卡类型；直接屏蔽

                }

            }
        }
        
        ZpmjUIMgr.getInstance().schedule(this.scheduleCallBack, 1, cc.REPEAT_FOREVER, this);
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
        var nCardColor = Math.floor(cardVal/16);
        var nValue = cardVal%16;

        var color = ["tong","wan", "suo","feng", "hua"];
        if(nCardColor==3) {
            if(cardVal>0x34) {
                color[nCardColor] = "jian";
                nValue -=4;
            }
        }

        cc.log("牌    "+"zpmj_cardAndColor/"+color[nCardColor]+"/"+color[nCardColor]+"_"+nValue+".png");
        return ("zpmj_cardAndColor/"+color[nCardColor]+"/"+color[nCardColor]+"_"+nValue+".png");
    },

    //绘制手牌
    displayCard:function(cardVal,pos) {
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

                    /* 漳浦没有金 注释掉
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
                    }*/


                    // 如果是听牌的话，就判断是否是在听牌过程中
                   var game = ClientData.getInstance().getGame();
                    var chairID = game.getMeChairId();
                    var hearStatus = game.getHearStatus();
                    if (hearStatus!= undefined && hearStatus[chairID]==1)
                    {
                        cc.log("听牌状态display");
                    	if(pos==CMD_ZPMJ.MAX_COUNT-1)
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
        //为0的换成100  是为了排序
        for(var i=0;i<CMD_ZPMJ.MAX_COUNT;i++) {
            if(this.cardData[i] == 0)
                this.cardData[i]=100;
        }

        this.updateCard(this.cardData,CMD_ZPMJ.MAX_COUNT);   //更新牌

        //为0的都换成100 显示牌
        for(var i=0;i<CMD_ZPMJ.MAX_COUNT;i++) {
            if(this.cardData[i] == 0)
                this.cardData[i]=100;
            this.displayCard(this.cardData[i],i);
        }

        //显示其他玩家的固定手牌
        for(var userID=0; userID<CMD_ZPMJ.GAME_PLAYER; userID++){
            if(this.imgFOtherCard[userID]){
                for(var i=0;i<CMD_ZPMJ.MAX_COUNT-1;i++)
                {
                    this.imgFOtherCard[userID][i].setVisible(true);
                }
            }
        }

        //显示庄家的活动手牌
        var bankerID = game.getBanker();
        var meChairID=game.getMeChairId();
        for(var chairID=0;chairID<CMD_ZPMJ.GAME_PLAYER; chairID++){
            if(bankerID==chairID){
                (chairID==meChairID)?this.imgFUserCard[CMD_ZPMJ.MAX_COUNT-1].setVisible(true):this.imgFOtherCard[chairID][CMD_ZPMJ.MAX_COUNT-1].setVisible(true);
            }
            else{
                (chairID==meChairID)?this.imgFUserCard[CMD_ZPMJ.MAX_COUNT-1].setVisible(false):this.imgFOtherCard[chairID][CMD_ZPMJ.MAX_COUNT-1].setVisible(false);
            }
        }

        //设置定时器
        this.setGameClock(game.getBanker(), game.getTimeOutCard());
    },

    //游戏结束
    onGameEnd:function(resultData){
        this.updateInsertFlowerNum(0,true); // 隐藏插花，放这边
        var game = ClientData.getInstance().getGame();
        var bHu = true;
        var arryAction = [];

        // 结束显示
        var gameEndFun = function () {
        	
        	var dlg=UIMgr.getInstance().getDlg(ID_DlgZpmjCardsInfo);
        	
            var showGameEndDlgs = function (result) {
                cc.log("----游戏结束---");
                //最后一局不显示准备按钮
                var game = ClientData.getInstance().getGame();
                var curRounds = game.getPlayCount();
                var totalRounds = game.getDrawCountLimit();
                if(curRounds==totalRounds){
                    cc.log("显示战绩页");
                    //清理界面
                    var dlgCardsInf=UIMgr.getInstance().getDlg(ID_DlgZpmjCardsInfo);
                    dlgCardsInf.doClear();

                    //显示战绩
                    var dlgZpmjRankCenter = UIMgr.getInstance().openDlg(ID_DlgZpmjRankCenter);
                    dlgZpmjRankCenter.show();

                    //清理历史数据
                    ZpmjUIMgr.getInstance().removeGameInfo();
                }
                else{
                    cc.log("显示结算界面");

                    //显示结算界面
                    var dlgZpmjResult = UIMgr.getInstance().openDlg(ID_DlgZpmjResult);
                    dlgZpmjResult.show(result);
                }
            };
            dlg.showCatchFlowerUI(resultData,showGameEndDlgs);
        };

        // 判断是否是流局
        if(INVALID_CHAIR ==resultData.wProvideUser ) {
            bHu = false;
        }

        /*if(game.getLeftCardCount()==0) {
            for(var i = 0;i<resultData.dwChiHuKind.length;i++) {
                if(resultData.dwChiHuKind[i]!=0) {
                    bHu = true;
                    break;
                }
            }
        }
        else {
            bHu = true;
        }*/

        // 动画
        if(bHu==true) {
            // 胡了
            var endFun = cc.CallFunc(function(){

                this.Image_animal_normal.removeAllChildren();
                this.Image_animal_left.removeAllChildren();
                this.Image_animal_right.removeAllChildren();
                this.Image_animal_up.removeAllChildren();

                this.Panel_root.stopAllActions();
                this.Image_liuju.setVisible(false);
                gameEndFun();
            },this);

            var getShowCardObj = function (userID) {
                var dlg = UIMgr.getInstance().getDlg(ID_DlgZpmjCardsInfo);
                var index_o = dlg.getUserUIIndex(userID);
                var obj = undefined;
               if(index_o == 0)
            	   obj = dlg.Image_animal_normal;
                else if (index_o==1)
                	obj = dlg.Image_animal_right;
                else if (index_o==2 )
                	obj = dlg.Image_animal_up;
                else if (index_o==3 )
                	obj = dlg.Image_animal_left;
                return obj;
            };

            this.Panel_root.stopAllActions();
            var bzimo = false;
            var huCardValue = resultData.cbProvideCard; // 默认是供牌扑克

            // 胡
            for(var i = 0;i<resultData.dwChiHuKind.length;i++)
            {
                if(resultData.dwChiHuKind[i]!=0)
                {
                    var showHuObj = getShowCardObj(i);

                    // 判断是否自摸
                    if(resultData.wProvideUser == i) {
                        bzimo = true;
                        huCardValue = resultData.cbSendCardData
                    }

                    // 1显示show card 不用动画
                    var Image_cardNomal = this.Panel_root.getChildByName("Image_cardNomal").clone();
                    Image_cardNomal.setVisible(true);
                    Image_cardNomal.getChildByName("Image_color").loadTexture(this.getFCard(huCardValue), ccui.Widget.PLIST_TEXTURE);
                    showHuObj.addChild(Image_cardNomal);
                    Image_cardNomal.setAnchorPoint(0.5,0.5);
                    Image_cardNomal.setPosition(0,0);

                    // 涉及到异步得通过 闭包

                    var funcAct = function (huObj,tempthis) {
                        // 2旋转动画
                        var roundAct = cc.CallFunc(function(){
                            tempthis.playingAnimateOnObj(huObj,10);
                        },tempthis);
                        arryAction.push(roundAct);

                        // 3显示 胡 or 自摸 动画        // 自摸胡 肯定只有一个
                        var huTypeAct = cc.CallFunc(function(){
                            tempthis.playingAnimateOnObj(huObj,bzimo==true?6:5);
                        },tempthis);
                        arryAction.push(huTypeAct);

                    }(showHuObj,this);
                }
            }

            // 放炮
            if (bzimo==false) {
                var fangpao = cc.CallFunc(function(){
                    this.playingAnimateOnObj(getShowCardObj(resultData.wProvideUser),9);
                },this);
                arryAction.push(fangpao);
            }

            this.Panel_root.runAction(cc.Sequence.create(cc.spawn(arryAction) ,cc.delayTime(2), endFun)); // 有问题，还没执行完就执行了endFun
        }
        else {
            // 流局动画
            this.Image_liuju.setVisible(true);
            this.Panel_root.runAction(cc.Sequence.create(cc.delayTime(2) , endFun));
        }
    },

    // 显示抓花页面
    showCatchFlowerUI:function (resultData,cb) {
        var cardObjs =  resultData.cbCatchFlowers; // 16个牌对象
        if(cardObjs.length == 0)
            return;

        var DlgZpmjMain = UIMgr.getInstance().getDlg(ID_DlgZpmjMain);
        if(!DlgZpmjMain){
            return;
        }
        var Panel_CatchFlower = DlgZpmjMain.Panel_root.getChildByName("Panel_CatchFlower");
        Panel_CatchFlower.setVisible(true);
        var ListView_Card = Panel_CatchFlower.getChildByName("ListView_Card");
        var Panel_cell =  Panel_CatchFlower.getChildByName("Panel_cell");
        for(var i = 0;i<cardObjs.length;i++) {
            var Panel_cell_Temp = Panel_cell.clone();
            ListView_Card.addChild(Panel_cell_Temp);
        }
        // 显示抓花过程
        Panel_CatchFlower.stopAllActions();
        Panel_CatchFlower.runAction(cc.Sequence.create( cc.DelayTime.create(3), cc.CallFunc.create(function () {

        	var  oPenFun = function(UIObj,CardObj) {
                var dlg = UIMgr.getInstance().getDlg(ID_DlgZpmjCardsInfo);
        		var  Image_CardBack = UIObj.getChildByName("Image_CardBack");
        		Image_CardBack.setVisible(false);
        		var Panel_CardOpen = UIObj.getChildByName("Panel_CardOpen");
        		Panel_CardOpen.setVisible(true);
        		var Atlb_Score = Panel_CardOpen.getChildByName("Atlb_Score");
        		var Image_card = Panel_CardOpen.getChildByName("Image_card");
        		var Image_color = Image_card.getChildByName("Image_color");
        		var Image_effect = Panel_CardOpen.getChildByName("Image_effect");
        		var Image_head = Image_effect.getChildByName("Image_head");
                Image_effect.setVisible( CardObj.IsZhong); // childID 协商+1

        		// 显示牌
        		if(Image_color!=null ) {
        			var texture = dlg.getFCard(CardObj.Card);
        			if (texture != null) {
        				Image_color.loadTexture(texture, ccui.Widget.PLIST_TEXTURE);
        			}
        			else {
        				cc.log(CardObj.Card + "牌 texture");
        			}
        		}

        		// 显示动画和头像
        		if(CardObj.IsZhong) {
                    // 加载头像
                    var player = table.getPlayerByChairID( CardObj.chairID);
                    player.loadUrlImage(function (savePath) {
                        if (savePath != undefined && savePath.length > 0) {
                            Image_head.loadTexture(savePath, ccui.Widget.LOCAL_TEXTURE);
                            Image_head.setContentSize(cc.size(68, 68));
                        }
                    });

                    // 播放动画
                    dlg.playingAnimateOnObj(Image_effect, 8);
        		}
			};

        	var actions = [];

        	for (var i=0;i<cardObjs.length;i++) {
                if(cardObjs[i].Card !=0 ) { // 表示可开牌
                    var children = ListView_Card.getChildren();
                    var fun =  function (UIObj,CardObj) {
                        actions.push(cc.CallFunc.create(function (){
                            oPenFun(UIObj,CardObj);
                        },this));
                        actions.push( cc.DelayTime.create(1));
                    }(children[i],cardObjs[i]);
        		}
        	}

            actions.push(cc.CallFunc.create(function (){
            	if(cb) {
            		cb(resultData);
                }
            },this));

            ListView_Card.runAction(cc.Sequence.create(actions));

        },DlgZpmjMain) ));
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

        if(currentUser == meChairID)
        {
            this.outCardEnabled = true; // 自己断线了，如果是到自己的话，要自己可以出牌
        }

        //显示手牌
        do{
            this.cardData=game.getMeCards();
            cc.log("显示牌面 牌数据 = " + JSON.stringify(this.cardData));
            //为0的都换成100
            for(var i=0;i<CMD_ZPMJ.MAX_COUNT;i++)
            {
                //为0的换成100  是为了排序
                if(this.cardData[i] == 0)
                    this.cardData[i]=100;
            }
            //更新牌
            this.updateCard(this.cardData,CMD_ZPMJ.MAX_COUNT);

            //设置自己的第13手牌
            if(currentUser==meChairID && (this.cardData[CMD_ZPMJ.MAX_COUNT-1]==100 || this.cardData[CMD_ZPMJ.MAX_COUNT-1]==0)){
                for(var i=CMD_ZPMJ.MAX_COUNT-1;i>=0;i--)
                {
                    var cardValue = this.cardData[i];
                    if(cardValue != 100&&cardValue != 0){
                        this.cardData[CMD_ZPMJ.MAX_COUNT-1] = cardValue;
                        cc.log("设置自己的第13手牌 cardValue"+cardValue);
                        this.cardData[i]=100;
                        cc.log("设置自己的第13手牌 cardValue"+cardValue);

                        this.displayCard(this.cardData[i],i);
                        this.displayCard(this.cardData[CMD_ZPMJ.MAX_COUNT-1],CMD_ZPMJ.MAX_COUNT-1);
                        cc.log("设置自己的第13手牌"+this.cardData[CMD_ZPMJ.MAX_COUNT-1]);
                        break;
                    }
                }
            }

            //显示其他玩家的固定手牌
            var carCount = game.getCardCount();
            for(var chairID=0;chairID<CMD_ZPMJ.GAME_PLAYER; chairID++){
                if(chairID!=meChairID){
                    var count = carCount[chairID];
                    cc.log("chairID  "+chairID+"  count  "+count);
                    for(var i=0;i<CMD_ZPMJ.MAX_COUNT-1;i++){
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
            for(var chairID=0;chairID<CMD_ZPMJ.GAME_PLAYER; chairID++){
                if(currentUser==chairID){
                    (chairID==meChairID)?this.imgFUserCard[CMD_ZPMJ.MAX_COUNT-1].setVisible(true):this.imgFOtherCard[chairID][CMD_ZPMJ.MAX_COUNT-1].setVisible(true);
                }
                else{
                    (chairID==meChairID)?this.imgFUserCard[CMD_ZPMJ.MAX_COUNT-1].setVisible(false):this.imgFOtherCard[chairID][CMD_ZPMJ.MAX_COUNT-1].setVisible(false);
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
                    this.imgFUserCard[CMD_ZPMJ.MAX_COUNT-1].setVisible(false);
                }
                else{
                    this.imgFOtherCard[wOutCardUser][CMD_ZPMJ.MAX_COUNT-1].setVisible(false);
                }

                //出牌展示
                var strFile = this.getFCard(cbOutCardData);
                var Image_color = this.Image_cardOutShow.getChildByName("Image_color");
                Image_color.loadTexture(strFile, ccui.Widget.PLIST_TEXTURE);
                /*
                var Image_kin  = this.Image_cardOutShow.getChildByName("Image_kin");
                if (Image_kin) {
                    if (cbOutCardData==game.getGoldCard())
                        Image_kin.setVisible(true);
                    else
                        Image_kin.setVisible(false);
                }
                */
                this.Image_cardOutShow.setPosition(cc.p(668.60,198.98));
                this.Image_cardOutShow.setScale(1.0);//2
                this.Image_cardOutShow.setOpacity(255);
                this.Image_cardOutShow.setVisible(true);
            }
            //出牌列表
            for(var chairID=0;chairID<CMD_ZPMJ.GAME_PLAYER; chairID++){
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
            for(var chairID=0;chairID<CMD_ZPMJ.GAME_PLAYER; chairID++){
                for(var j=0;j<cbWeaveCount[chairID];j++)
                {
                    var cbOperateData = WeaveItemArray[chairID][j].cbCardData;
                    var wProvideUser = WeaveItemArray[chairID][j].wProvideUser;

                    cc.log("WeaveItemArray 组合牌数据" + JSON.stringify(WeaveItemArray));
                    cc.log("cbOperateData 组合牌数据" + JSON.stringify(cbOperateData));

                    var nShowStatus = CMD_ZPMJ.WIK_NULL;
                    var cbParam = WeaveItemArray[chairID][j].cbPublicCard;
                    if(cbParam==CMD_ZPMJ.WIK_GANERAL){
                        //碰
                        nShowStatus = CMD_ZPMJ.WIK_PENG;
                    }
                    else if(cbParam==CMD_ZPMJ.WIK_MING_GANG){
                        nShowStatus = CMD_ZPMJ.WIK_GANG;
                    }
                    else if(cbParam==CMD_ZPMJ.WIK_FANG_GANG){
                        nShowStatus = CMD_ZPMJ.WIK_GANG;
                    }
                    else if(cbParam==CMD_ZPMJ.WIK_AN_GANG){
                        nShowStatus = CMD_ZPMJ.WIK_ANGANG;
                    }

                    //显示开牌
                    this.setOpenCard(chairID,wProvideUser,cbOperateData[0], nShowStatus);
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
                this.imgFUserCard[CMD_ZPMJ.MAX_COUNT-1].setVisible(false);

                //打开提示面板
                cc.log("--打开操作提示面板--");
                ZpmjUIMgr.getInstance().onOperatorTip();
                this.setGameClock(currentUser, game.getTimeOperateCard());
            }
        }while(false);

        // 显示金牌标志
        this.updateGoldMedal();

        // 显示补花个数
        var flowerNum = game.getFlowerRecords();
        if(flowerNum!=undefined)
        {
        	for ( var i = 0;i<flowerNum.length;i++) {
        		if(flowerNum[i]>0){
        			this.updateFlowerNum(i);
        		}
        	}

            cc.log("======补花个数:("+flowerNum[0] +")1:("+flowerNum[1]+")2:("+flowerNum[2]+")3:("+flowerNum[3]+")");
        }
       

        // 显示插花个数
        var insertFlowerNum = game.getInsertFlowerRecords();
        if(insertFlowerNum!=undefined)
        {
            for ( var i = 0;i<insertFlowerNum.length;i++) {
                if(insertFlowerNum[i]>0){
                    this.updateInsertFlowerNum(i);
                }
            }
            cc.log("======插花个数:("+insertFlowerNum[0] +")1:("+insertFlowerNum[1]+")2:("+insertFlowerNum[2]+")3:("+insertFlowerNum[3]+")");
        }



    },

    //手牌杠 （sxh 这样设计有问题,没法统计多少个）
    bHGang:function(bool,value) {
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

        if(meChairID!=nAction) {
            cc.log("--不是自己的操作时间--"+meChairID+"!="+nAction);
            return;
        }

        if(!this.outCardEnabled){
            cc.log("--不是自己的操作时间-- outCardEnabled="+this.outCardEnabled);
            return;
        }

        for(var i=0;i<CMD_ZPMJ.MAX_COUNT;i++)
        {
            if(this.imgFUserCard[i]==selectCard){
                cc.log("--出牌--找到对应的牌型--");
                //获取牌数据
                var cardValue = this.cardData[i];

                // 判断一下是不是花牌
                if (cardValue>= g_Zpmj_Hua_CardValue[0] &&
                    cardValue<= g_Zpmj_Hua_CardValue[7])
                {
                    cc.log("--不就措施，出牌--不能打花牌，请补牌再出牌--");
                    var game=ClientData.getInstance().getGame();
                    var data={
                        cbCardData: cardValue,
                    };
                    ZpmjGameMsg.getInstance().sendReplaceCard(data);
                    return;
                }

                // 判断一下点选的值是不是上次 吃 的牌待续....


                // 出牌展示
               var startPos = selectCard.getPosition();
               this.showOutPutCard(meChairID,cardValue,startPos);

                //发送出牌
                var game=ClientData.getInstance().getGame();
                var data={
                    cbCardData: cardValue,
                };
                cc.log("--发送出牌--cardValue = "+cardValue);
                ZpmjGameMsg.getInstance().sendOutCard(data);

                SoundMgr.getInstance().playEffect("zpmj_outCard", 0, false);

                // 其实这个不应该放这边，应该放到用户出牌的广播那边，得到确认后才做
                //从新整理牌
                this.cardData[i] = 100;
                this.updateCard(this.cardData, CMD_ZPMJ.MAX_COUNT);
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

            if(startPos==undefined)
                startPos = this.imgFUserCard[CMD_ZPMJ.MAX_COUNT-1].getPosition();
            startPos = this.Panel_cardNomal.convertToWorldSpace(startPos);
            startPos = this.Panel_cgpTemp.convertToNodeSpace(startPos);
            endPos = cc.p(668.60,198.98);
        }
        else
        {
            var startPos = this.imgFOtherCard[chairID][CMD_ZPMJ.MAX_COUNT-1].getPosition();
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
         if (color.r != 0xff || color.g != 0xff || color.b != 0xff ) {
             cc.log("灰色按钮不能点击");
             return;
         }

        switch(type){
            case ccui.Widget.TOUCH_BEGAN:{
                SoundMgr.getInstance().playEffect("zpmj_button", 0, false);

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

                            SoundMgr.getInstance().playEffect("zpmj_button", 0, false);
                        }
                    }
                    else if(Math.sqrt(disX*disX+disY*disY)>20){
                        sender.setPositionY(20);

                        if(this.moveCard&&this.moveCard!=sender){
                            this.moveCard.setPositionY(0);
                        }
                        this.moveCard = sender;
                        cc.log("--------------滑动--选牌------20---------");
                        SoundMgr.getInstance().playEffect("zpmj_selectCard", 0, false);
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
                    SoundMgr.getInstance().playEffect("zpmj_selectCard", 0, false);
                }
                else if(this.clickCard==sender){
                    //出牌
                    cc.log("--------------点击--出牌---------------");
                    this.doOutCard(sender);
                    this.clickCard = null;
                    SoundMgr.getInstance().playEffect("zpmj_button", 0, false);
                }
                else{
                    this.clickCard.setPositionY(0);
                    this.clickCard = sender;
                    sender.setPositionY(20);

                    SoundMgr.getInstance().playEffect("zpmj_selectCard", 0, false);
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

        for(var actionUser=0; actionUser<CMD_ZPMJ.GAME_PLAYER; ++actionUser){
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
//==============================================================================
    //设置吃碰杠 数据
    setOpenCard: function(actionUser,provideUser, cardValue, cardMask){
      
    	var game = ClientData.getInstance().getGame();
        if(!game){
            return;
        }
        var meChairID=game.getMeChairId();

        //检测是否已经存在碰 =>碰变杠
        var cardData = (actionUser==meChairID) ? this.openFCardData : this.openTCardData[actionUser];
        if (cardData) {
            for(var i=0; i<cardData.length; ++i) {
                var openCard = cardData[i];
                if(openCard.cardValue==cardValue) {
                    if(CMD_ZPMJ.WIK_PENG == openCard.cardMask) {
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
        }

        //添加一个新的开牌数据
        var openCard = {};
        openCard.cardValue = cardValue;
        openCard.cardMask = cardMask;

        if(actionUser==meChairID){
            var index = this.openFCardData.length;
            openCard.cardTemp = this.getOpenCard(actionUser,provideUser, openCard, index);
            this.openFCardData.push(openCard);
        }
        else{
            if(!this.openTCardData[actionUser])
                this.openTCardData[actionUser] = [];
            var index = this.openTCardData[actionUser].length;
            openCard.cardTemp = this.getOpenCard(actionUser,provideUser, openCard, index);
            this.openTCardData[actionUser].push(openCard);
        }
    },

    //获取操作的牌 到时候得整理一下代码
    getOpenCard: function(actionUser,provideUser, openCard, index){
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
            case 0: {//自己
                var direct = this.getUserUIIndex(provideUser);
                if (openCard.cardMask & CMD_ZPMJ.WIK_LEFT||
                    openCard.cardMask & CMD_ZPMJ.WIK_CENTER||
                    openCard.cardMask & CMD_ZPMJ.WIK_RIGHT) { // 吃
                    var childName= "";
                    if(openCard.cardMask & CMD_ZPMJ.WIK_LEFT)
                        childName = "Panel_mGangNomal_1";
                    else if(openCard.cardMask & CMD_ZPMJ.WIK_CENTER)
                        childName = "Panel_mGangNomal_2";
                    else if(openCard.cardMask & CMD_ZPMJ.WIK_RIGHT)
                        childName = "Panel_mGangNomal_3";
                    cardTemp = this.Panel_root.getChildByName(childName).clone();
                }
                else if (openCard.cardMask & CMD_ZPMJ.WIK_PENG) {//碰
                    var childName= "";
                    if(direct==1)        childName = "Panel_mGangNomal_3";
                    else if(direct==2)  childName = "Panel_mGangNomal_2";
                    else if(direct==3)  childName = "Panel_mGangNomal_1";
                    cardTemp = this.Panel_root.getChildByName(childName).clone();
                }
                else if (openCard.cardMask & CMD_ZPMJ.WIK_GANG) {//明杠
                    cardTemp = this.Panel_root.getChildByName("Panel_mGangNomal").clone();
                    var pos; var obj;
                    if (direct==1)      childName = "Image_card_2";
                    else if(direct==2)  childName = "Image_card_1";
                    else if(direct==3)  childName = "Image_card_0";
                    obj = cardTemp.getChildByName(childName);
                    pos = obj.getPosition();
                    var Image_card_Mid = cardTemp.getChildByName("Image_card_Mid");
                    Image_card_Mid.setPositionX(pos.x);
                }
                else if (openCard.cardMask & CMD_ZPMJ.WIK_ANGANG) {//暗杠
                    cardTemp = this.Panel_root.getChildByName("Panel_anGangNomal").clone();
                }

                //设置坐标
                if (cardTemp) {
                    var childs = this.Panel_pgNomal.getChildren();
                    var count = this.Panel_pgNomal.getChildrenCount();
                    var lastX = 0;
                    if( count > 0 )
                    	lastX = (childs[count-1]).getPositionX()- childs[count-1].getContentSize().width-10;
                    posX =  lastX
                	posY = 0;
                	this.Panel_pgNomal.addChild(cardTemp);

                }
                break;
            }
            case 1:{  //右边

                var direct = this.getUserUIByUserIndex(actionUser,provideUser);

                if (openCard.cardMask & CMD_ZPMJ.WIK_LEFT||
                    openCard.cardMask & CMD_ZPMJ.WIK_CENTER||
                    openCard.cardMask & CMD_ZPMJ.WIK_RIGHT) { // 吃
                    var childName= "";
                    if(openCard.cardMask & CMD_ZPMJ.WIK_LEFT)
                        childName = "Panel_mGangRight_1";
                    else if(openCard.cardMask & CMD_ZPMJ.WIK_CENTER)
                        childName = "Panel_mGangRight_2";
                    else if(openCard.cardMask & CMD_ZPMJ.WIK_RIGHT)
                        childName = "Panel_mGangRight_3";
                    cardTemp = this.Panel_root.getChildByName(childName).clone();
                }
                else if(openCard.cardMask & CMD_ZPMJ.WIK_PENG){//碰
                    var childName= "";
                    if(direct==1)        childName = "Panel_mGangRight_3";
                    else if(direct==2)  childName = "Panel_mGangRight_2";
                    else if(direct==3)  childName = "Panel_mGangRight_1";
                    cardTemp = this.Panel_root.getChildByName(childName).clone();
                } else if(openCard.cardMask & CMD_ZPMJ.WIK_GANG){//明杠
                    cardTemp = this.Panel_root.getChildByName("Panel_mGangRight").clone();
                    var pos; var obj;
                    if (direct==1)      childName = "Image_card_2";
                    else if(direct==2)  childName = "Image_card_1";
                    else if(direct==3)  childName = "Image_card_0";
                    obj = cardTemp.getChildByName(childName);
                    pos = obj.getPosition();
                    var Image_card_Mid = cardTemp.getChildByName("Image_card_Mid");
                    Image_card_Mid.setPositionY(pos.y);

                } else if(openCard.cardMask & CMD_ZPMJ.WIK_ANGANG){//暗杠
                    cardTemp = this.Panel_root.getChildByName("Panel_anGangRight").clone();
                }

                //设置坐标
                if (cardTemp) {

                    var childs = this.Panel_pgRight.getChildren();
                    var count = this.Panel_pgRight.getChildrenCount();
                    var lastY = 0;
                    if( count > 0 )
                        lastY = (childs[count-1]).getPositionY() -  (childs[count-1]).getContentSize().height -10;
                    posY =  lastY;
                    posX = 0;
                    this.Panel_pgRight.addChild(cardTemp);

                }
                break;
            }
            case 2:{//对面

                var direct = this.getUserUIByUserIndex(actionUser,provideUser);

                if (openCard.cardMask & CMD_ZPMJ.WIK_LEFT||
                    openCard.cardMask & CMD_ZPMJ.WIK_CENTER||
                    openCard.cardMask & CMD_ZPMJ.WIK_RIGHT) { // 吃
                    var childName= "";
                    if(openCard.cardMask & CMD_ZPMJ.WIK_LEFT)
                        childName = "Panel_mGangUp_1";
                    else if(openCard.cardMask & CMD_ZPMJ.WIK_CENTER)
                        childName = "Panel_mGangUp_2";
                    else if(openCard.cardMask & CMD_ZPMJ.WIK_RIGHT)
                        childName = "Panel_mGangUp_3";
                    cardTemp = this.Panel_root.getChildByName(childName).clone();
                }
                else if(openCard.cardMask & CMD_ZPMJ.WIK_PENG){//碰
                    var childName= "";
                    if(direct==1)        childName = "Panel_mGangUp_3";
                    else if(direct==2)  childName = "Panel_mGangUp_2";
                    else if(direct==3)  childName = "Panel_mGangUp_1";
                    cardTemp = this.Panel_root.getChildByName(childName).clone();
                } else if(openCard.cardMask & CMD_ZPMJ.WIK_GANG){//明杠
                    cardTemp = this.Panel_root.getChildByName("Panel_mGangUp").clone();
                    var pos; var obj;
                    if (direct==1)      childName = "Image_card_2";
                    else if(direct==2)  childName = "Image_card_1";
                    else if(direct==3)  childName = "Image_card_0";
                    obj = cardTemp.getChildByName(childName);
                    pos = obj.getPosition();
                    var Image_card_Mid = cardTemp.getChildByName("Image_card_Mid");
                    Image_card_Mid.setPositionX(pos.x);
                } else if(openCard.cardMask & CMD_ZPMJ.WIK_ANGANG){//暗杠
                    cardTemp = this.Panel_root.getChildByName("Panel_anGangUp").clone();
                }

                //设置坐标
                if (cardTemp) {
                    var childs = this.Panel_pgUp.getChildren();
                    var count = this.Panel_pgUp.getChildrenCount();
                    var lastX =  0;
                    if( count > 0 )
                        lastX = (childs[count-1]).getPositionX() + (childs[count-1]).getContentSize().width + 10;
                    posX =  lastX ;
                    posY = 0;
                    this.Panel_pgUp.addChild(cardTemp);
                }
                break;
            }
            case 3:{//左边
                var direct = this.getUserUIByUserIndex(actionUser,provideUser);
                if (openCard.cardMask & CMD_ZPMJ.WIK_LEFT||
                    openCard.cardMask & CMD_ZPMJ.WIK_CENTER||
                    openCard.cardMask & CMD_ZPMJ.WIK_RIGHT) { // 吃
                    var childName= "";
                    if(openCard.cardMask & CMD_ZPMJ.WIK_LEFT)
                        childName = "Panel_mGangLeft_1";
                    else if(openCard.cardMask & CMD_ZPMJ.WIK_CENTER)
                        childName = "Panel_mGangLeft_2";
                    else if(openCard.cardMask & CMD_ZPMJ.WIK_RIGHT)
                        childName = "Panel_mGangLeft_3";
                    cardTemp = this.Panel_root.getChildByName(childName).clone();
                }
                else
                if(openCard.cardMask & CMD_ZPMJ.WIK_PENG){//碰
                    var childName= "";
                    if(direct==1)        childName = "Panel_mGangLeft_3";
                    else if(direct==2)  childName = "Panel_mGangLeft_2";
                    else if(direct==3)  childName = "Panel_mGangLeft_1";
                    cardTemp = this.Panel_root.getChildByName(childName).clone();

                }
                else if(openCard.cardMask & CMD_ZPMJ.WIK_GANG){//明杠
                    cardTemp = this.Panel_root.getChildByName("Panel_mGangLeft").clone();
                    var pos; var obj;
                    if (direct==1)      childName = "Image_card_2";
                    else if(direct==2)  childName = "Image_card_1";
                    else if(direct==3)  childName = "Image_card_0";
                    obj = cardTemp.getChildByName(childName);
                    pos = obj.getPosition();
                    var Image_card_Mid = cardTemp.getChildByName("Image_card_Mid");
                    Image_card_Mid.setPositionY(pos.y);
                }
                else if(openCard.cardMask & CMD_ZPMJ.WIK_ANGANG){//暗杠
                    cardTemp = this.Panel_root.getChildByName("Panel_anGangLeft").clone();
                }

                //设置坐标
                if (cardTemp) {

                    var childs = this.Panel_pgLeft.getChildren();
                    var count = this.Panel_pgLeft.getChildrenCount();
                    var lastY = 0;
                    if( count >= 1 )
                        lastY = (childs[count-1]).getPositionY() + (childs[count-1]).getContentSize().height + 10;
                    posY =  lastY ;
                    posX = 0;
                    this.Panel_pgLeft.addChild(cardTemp);
                }
                break;
            }
            default:
                break;
        }

        if(openCard.cardMask & CMD_ZPMJ.WIK_LEFT ||
            openCard.cardMask & CMD_ZPMJ.WIK_CENTER ||
            openCard.cardMask & CMD_ZPMJ.WIK_RIGHT){  // 吃
            for(var i=0; i<3; i++){
                var Image_color = cardTemp.getChildByName("Image_card_"+i).getChildByName("Image_color");
                Image_color.loadTexture(this.getFCard(openCard.cardValue+i), ccui.Widget.PLIST_TEXTURE);
            }
        }
        else if(openCard.cardMask & CMD_ZPMJ.WIK_PENG){
            for(var i=0; i<3; i++){
                var Image_color = cardTemp.getChildByName("Image_card_"+i).getChildByName("Image_color");
                Image_color.loadTexture(this.getFCard(openCard.cardValue), ccui.Widget.PLIST_TEXTURE);
            }
        }
        else if(openCard.cardMask & CMD_ZPMJ.WIK_GANG){
            for(var i=0; i<3; i++){
                var Image_color =cardTemp.getChildByName("Image_card_"+i).getChildByName("Image_color");
                Image_color.loadTexture(this.getFCard(openCard.cardValue), ccui.Widget.PLIST_TEXTURE);
            }

            var Image_card_Mid = cardTemp.getChildByName("Image_card_Mid");
            Image_card_Mid.setVisible(true);
            var Image_color = Image_card_Mid.getChildByName("Image_color");
            Image_color.loadTexture(this.getFCard(openCard.cardValue), ccui.Widget.PLIST_TEXTURE);
        }
        else if(openCard.cardMask & CMD_ZPMJ.WIK_ANGANG){
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

    // 显示吃杠多选界面 回调用户的选择
    showOperator_Chi_Gangs_Choose:function (type,cbfun) {
    	
    	var game = ClientData.getInstance().getGame();
    	
        this.Panel_Chi_Gang_Choose.setVisible(true);
        this.Panel_Chi_Gang_Choose.removeAllChildren();
        this.Panel_operator.setVisible(true);
        this.Button_guo.setVisible(true);

        var showCount=0;
        var bShowMiddle = true;
        var childName = [];
        var cardFrame;
        var actionCard=game.getActionCard();
        var cardValues = [];
        var cardsCount = 0;
        
        if(type==CMD_ZPMJ.WIK_LEFT) {
        	bShowMiddle = false;
            cardsCount = 3;
            var mask = game.getAcionMasks();
            if(mask & CMD_ZPMJ.WIK_RIGHT){
            	childName.push("Panel_mGangNomal_3");
            	showCount += 1;
            }
            if(mask & CMD_ZPMJ.WIK_CENTER){
            	childName.push("Panel_mGangNomal_2");
            	showCount += 1;
            }	
            if(mask & CMD_ZPMJ.WIK_LEFT){
            	childName.push("Panel_mGangNomal_1");
            	showCount += 1;
            }
        }
        else if(type==CMD_ZPMJ.WIK_GANG) {
            cardsCount = 4;
            showCount = this.handGangs.length;
            childName[0] = "Panel_mGangNomal_4";
            bShowMiddle = true;
        }

        //创建自己的牌对象
        var btnGuoPos = this.Panel_operator.convertToWorldSpace(this.Button_guo.getPosition());
        btnGuoPos = this.Panel_Chi_Gang_Choose.convertToNodeSpace(btnGuoPos);
        
        for(var i=0;i<showCount; i++)
        {
            var x = 0;
            var y = 0;
            var cardFrameW = 0;

            if(type == CMD_ZPMJ.WIK_GANG) {
                cardFrame =  this.Panel_root.getChildByName(childName[0]).clone();
                cardFrameW = cardFrame.getContentSize().width;
                if(i<2) {
                	x = btnGuoPos.x - (cardFrameW+10)*i;
                    y = btnGuoPos.y;
                } else {
                	x = btnGuoPos.x - (cardFrameW+10) * (i%2);
                    y = btnGuoPos.y + cardFrame.getContentSize().height+10;
                }
                cardValues[0] = this.handGangs[i].value;
            }
            else {
                cardFrame =  this.Panel_root.getChildByName(childName[i]).clone();
                cardFrameW = cardFrame.getContentSize().width;
                x = btnGuoPos.x -(cardFrameW+10)*i;
                y = btnGuoPos.y;

                // 右中左
                if(childName[i]=="Panel_mGangNomal_3") {
                    cardValues[0] = actionCard-2;
                    cardValues[1] = actionCard-1;
                    cardValues[2] = actionCard;
                } else if(childName[i]=="Panel_mGangNomal_2") {
                    cardValues[0] = actionCard-1;
                    cardValues[1] = actionCard;
                    cardValues[2] = actionCard+1;
                } else if(childName[i]=="Panel_mGangNomal_1") {
                    cardValues[0] = actionCard;
                    cardValues[1] = actionCard+1;
                    cardValues[2] = actionCard+2;
                }
            }

            for(var j=0; j<cardsCount; j++){
                var index = j;
                if(j==3) index = "Mid";
                var Image_color = cardFrame.getChildByName("Image_card_"+index).getChildByName("Image_color");
                var cardVlue = (type == CMD_ZPMJ.WIK_GANG ? cardValues[0]:cardValues[j]);
                Image_color.loadTexture(this.getFCard(cardVlue), ccui.Widget.PLIST_TEXTURE);
            }
            cardFrame.setPosition(cc.p(x,y));
            cardFrame.setVisible(true);
            cardFrame.setTouchEnabled(true);
            cardFrame.setTag(i);
            cardFrame.getChildByName("Image_card_Mid").setVisible(bShowMiddle);
            cardFrame.addTouchEventListener( function(sender, eventType){
                switch(eventType){
                    case ccui.Widget.TOUCH_ENDED: {
                        var tag = sender.getTag();

                        cc.log("tag:" + tag);
                        var code = 0;
                        operateCard = [];

                        if (type == CMD_ZPMJ.WIK_GANG) {
                        	code = CMD_ZPMJ.WIK_GANG;
                            operateCard[0] = this.handGangs[tag].value;
                            cc.log("value:"+operateCard[0]);
                            this.handGangs = []; // 清空数组了
                        }
                        else {
                            if(tag==2) {
                                code = CMD_ZPMJ.WIK_LEFT;
                                operateCard[0]=actionCard; operateCard[1]=actionCard+1; operateCard[2]=actionCard+2;
                            } else if(tag == 1) {
                                code = CMD_ZPMJ.WIK_CENTER;
                                operateCard[0]=actionCard-1; operateCard[1]=actionCard; operateCard[2]=actionCard+1;
                            } else if(tag==0) {
                                code = CMD_ZPMJ.WIK_RIGHT;
                                operateCard[0]=actionCard-2; operateCard[1]=actionCard-1; operateCard[2]=actionCard;
                            }
                        }
                        
                        this.showOperator(false, []);
                        this.Panel_Chi_Gang_Choose.setVisible(false);
                        cbfun(code,operateCard);
                        break;
                    }
                    default:
                        break;
                }
            }, this);

            this.Panel_Chi_Gang_Choose.addChild(cardFrame);
        }
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
            //this.outCardEnabled = true;
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
            for(var i=0; i<last;i++) {
                if(arrayShow[i]>arrayShow[i+1]) {
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
            var obj;
            var Image_effect;
            switch(arrayShow[index]){
                case CMD_ZPMJ.WIK_LEFT:{ // 吃 不管那个吃，界面都用这个来代表；
                    obj =  this.Button_chi;
                    break;
                }case CMD_ZPMJ.WIK_PENG:{//碰
                    obj =  this.Button_peng;
                    break;
                }case CMD_ZPMJ.WIK_GANG:{//杠
                    obj =  this.Button_gang;
                    break;
                }case CMD_ZPMJ.WIK_LISTEN:{//听
                    obj =  this.Button_ting;
                    break;
                }case CMD_ZPMJ.WIK_CHI_HU://吃胡
                 case CMD_ZPMJ.WIK_FANG_PAO:{//放炮
                    obj =  this.Button_hu;
                    break;
                }default:
                    break;
            }

            if(obj!=undefined)
            {
                // 设置位置
                obj.setPositionX(tempPosX);
                obj.setVisible(isShow);
                tempPosX -= obj.getContentSize().width;
                Image_effect = obj.getChildByName("Image_effect");

                // 设置动画
                //target.runAction( cc.repeatForever(arryAction));
                var actionInterval = 1;
                var run = cc.CallFunc(function(){
                    Image_effect.runAction(cc.sequence(cc.rotateBy(actionInterval,180), run));
                },this);
                Image_effect.stopAllActions();
                Image_effect.runAction( cc.sequence(cc.rotateBy(actionInterval,180), run));
            }
        }
    },

    //操作按钮
    onOperatorBtnClick:function(sender, type) {
        if (ccui.Widget.TOUCH_ENDED == type)
        {
            var sendOperateCardFun = function (code,operateCard,codeDetail) {
                var data={
                    cbOperateCode: code,
                    cbOperateCard: operateCard
                };
                cc.log("sendOperateCard = " + JSON.stringify(data));
                ZpmjGameMsg.getInstance().sendOperateCard(data);
            };
            SoundMgr.getInstance().playEffect("zpmj_button", 0, false);
            var name=sender.getName();
            var game = ClientData.getInstance().getGame();
            var actionCard=game.getActionCard();

            var code;
            var operateCard=[];
            operateCard[0]=0;
            operateCard[1]=0;
            operateCard[2]=0;

            var mask = game.getAcionMasks();
             
            switch(name){
                case "Button_chi":
                	var a = mask & CMD_ZPMJ.WIK_LEFT;
                	var b = (mask & CMD_ZPMJ.WIK_CENTER)>>1;
                	var c = (mask & CMD_ZPMJ.WIK_RIGHT)>>2;
                	var count = a+b+c;
                	
                	if(1 < count) {
                       // 先选择后发送
                		this.showOperator(false, []);
                        this.showOperator_Chi_Gangs_Choose(CMD_ZPMJ.WIK_LEFT,sendOperateCardFun);
                        return;
                    }
                    else {
                        // 直接发送
                        if(mask & CMD_ZPMJ.WIK_LEFT) {
                            code = CMD_ZPMJ.WIK_LEFT;
                            operateCard[0]=actionCard; operateCard[1]=actionCard+1; operateCard[2]=actionCard+2;
                        } else if(mask & CMD_ZPMJ.WIK_CENTER) {
                            code = CMD_ZPMJ.WIK_CENTER;
                            operateCard[0]=actionCard-1; operateCard[1]=actionCard; operateCard[2]=actionCard+1;
                        } else if(mask & CMD_ZPMJ.WIK_RIGHT) {
                            code = CMD_ZPMJ.WIK_RIGHT;
                            operateCard[0]=actionCard-2; operateCard[1]=actionCard-1; operateCard[2]=actionCard;
                        }
                    }
                    break;
                case "Button_peng":
                    code=CMD_ZPMJ.WIK_PENG; // 其实发送一张就可以了
                    operateCard[0]=actionCard;
                    operateCard[1]=actionCard;
                    operateCard[2]=actionCard;
                    break;
                case "Button_gang":
                    // 得判断一下，是否有多个杠 得做选择
                    // 如果是杠别人的牌（明杠）直接按原来流程，不需要选择，直接杠你杠的对方的那张牌；杠完还是会继续抓牌
                    // 如果是自己抓的（可能存在多个杠，这个时候得让用户选择，杠哪个）

                    code=CMD_ZPMJ.WIK_GANG;
                    if(this.handGangs.length>0) {	// 自己抓牌得到的；
                        cc.log("抓牌---手牌杠- 暗杠");
                        if (this.handGangs.length>1) {
                        	this.showOperator(false, []);
                        	this.showOperator_Chi_Gangs_Choose(CMD_ZPMJ.WIK_GANG,sendOperateCardFun);
                        	return;
                        } else {
                        	operateCard[0] = this.handGangs[0].value;
                        	this.handGangs = []; // 清空数组了
                        }
                    }
                    else{
                        cc.log("别人出牌：杠别人的牌- 明杠");
                        operateCard[0] = actionCard;

                    }
                    break;

                case "Button_ting":
                    {
                        cc.log("广播听牌命令状态 直接返回,不发后台， 有问题，得后面待讨论");
                        ZpmjGameMsg.getInstance().sendTingOperateCard();
                        this.showOperator(false, []);
                        this.showTingCards();// 变灰
                        return;
                    }

                case "Button_hu":
                    code=CMD_ZPMJ.WIK_CHI_HU;
                    operateCard[0]=actionCard;
                    break;
                case "Button_guo":
                    cade=CMD_ZPMJ.WIK_NULL;
                    this.Panel_Chi_Gang_Choose.setVisible(false);
                    break;
                default:
                    break;
            };

            sendOperateCardFun(code,operateCard);
            this.showOperator(false, []);
        }
    },

    //操作结果 用来做最后的摆牌
    /*
     *  吃：有三个标志，    可以直接传 左中右吃
     *  碰：只有一个碰标志，收到后得自己判断，是 左中右 碰(经过协商，可以让用户)
     *  杠：只有一个杠标志，收到后得判断（明杠，碰杠，还是暗杠）
     */
    operateResult:function() {
        //隐藏展示牌
        this.Image_cardOutShow.setVisible(false);//隐藏provideUser 供牌用户的用户展示牌
        var game = ClientData.getInstance().getGame();
        var operateUser=game.getOperateUser();	//操作用户
        var mychairid=game.getMeChairId();
        var operateCard=game.getOperateCard();
        var operateCode=game.getOperateCode();  //  吃 碰 杠 掩码
        var provideUser=game.getProvideUser();  //供牌用户

        // 因为现在有多个用户  this.showOperator(false, []);

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
            this.outCardEnabled = true; // 出牌，or 自己碰杠吃，sxh

            //碰 or 吃
            if(operateCode & CMD_ZPMJ.WIK_PENG ||
                operateCode & CMD_ZPMJ.WIK_LEFT||
                operateCode & CMD_ZPMJ.WIK_CENTER||
                operateCode & CMD_ZPMJ.WIK_RIGHT)
            {
                var tempOperateCard = operateCard.clone(); // 用来排序一下

                // 播放动画
                if(operateCode & CMD_ZPMJ.WIK_PENG ) {
                    cc.log("---碰----");
                    this.playingAnimateOnObj(this.Image_animal_normal,2);

                }
                else {
                    cc.log("---吃----");
                    this.playingAnimateOnObj(this.Image_animal_normal,1);

                    // WIK_CENTER WIK_RIGHT 需要调整牌值为了隐藏牌做如下调换牌值
                    if(operateCode & CMD_ZPMJ.WIK_CENTER) {
                       var temp = tempOperateCard[0];
                        tempOperateCard[0] = tempOperateCard[1];
                        tempOperateCard[1] = temp;

                    }else if(operateCode & CMD_ZPMJ.WIK_RIGHT){
                        var temp = tempOperateCard[2];
                        tempOperateCard[0] = tempOperateCard[2];
                        tempOperateCard[2] = temp;
                    }
                }

                // 隐藏相应手牌
                this.cardData[CMD_ZPMJ.MAX_COUNT-1]=100;
                for(var i=1;i<3;i++) {
                    for(var j=0;j<CMD_ZPMJ.MAX_COUNT;j++) {
                        if(this.cardData[j]==tempOperateCard[i]) {
                            this.cardData[j]=100;
                            break;
                        }
                    }
                }
                //设置第13張手牌 取最后一张显示的牌来当
                var cardTemp = 0;
                for(var i=CMD_ZPMJ.MAX_COUNT-2;i>=0;i--) {
                    if(this.cardData[i]!=100&&this.cardData[i]!=0) {
                        cardTemp = this.cardData[i];
                        this.cardData[i] = 100;
                        break;
                    }
                }
                this.updateCard(this.cardData,CMD_ZPMJ.MAX_COUNT);
                this.cardData[CMD_ZPMJ.MAX_COUNT-1] = cardTemp;
                this.displayCard(cardTemp, CMD_ZPMJ.MAX_COUNT-1);

                //显示开牌
               if(operateCode & CMD_ZPMJ.WIK_PENG ) {
                   cc.log("---碰----显示开牌");
                   this.setOpenCard(operateUser, provideUser,operateCard[0], CMD_ZPMJ.WIK_PENG);
               }
               else {
                   cc.log("---吃----显示开牌");
                   this.setOpenCard(operateUser, provideUser,operateCard[0], operateCode);
               }

                //修改出牌列表
                this.delLastFromOutList(provideUser);
            }

            //杠
            if(operateCode & CMD_ZPMJ.WIK_GANG)
            {
                // 动画
                this.playingAnimateOnObj(this.Image_animal_normal,3);

                if(provideUser == operateUser){
                    //自摸碰杠
                    var bGang=false;
                    for(var i=0;i<this.openFCardData.length;i++){
                        var openCard = this.openFCardData[i];
                        if(openCard.cardMask&CMD_ZPMJ.WIK_PENG && openCard.cardValue == operateCard[0]){
                            //自摸明杠
                            bGang = true;
                            this.setOpenCard(mychairid,provideUser, operateCard[0], CMD_ZPMJ.WIK_GANG);

                            //移除操作玩家第13张手牌
                            this.cardData[CMD_ZPMJ.MAX_COUNT-1] = 100;
                            break;
                        }
                    }
                    //自摸暗杠
                    if(!bGang){
                        //自摸暗杠
                        this.setOpenCard(mychairid, provideUser,operateCard[0], CMD_ZPMJ.WIK_ANGANG);

                        //移除暗杠的牌
                        for(var i=0;i<CMD_ZPMJ.MAX_COUNT;i++)
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
                    this.setOpenCard(operateUser, provideUser,operateCard[0], CMD_ZPMJ.WIK_GANG);

                    //移除杠的牌
                    for(var i=0;i<CMD_ZPMJ.MAX_COUNT;i++)
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
                this.updateCard(this.cardData,CMD_ZPMJ.MAX_COUNT);
            }
        }
        else
        {   //其他玩家
            var index_o = this.getUserUIIndex(operateUser);
            var obj;
            if (index_o==1)
                obj = this.Image_animal_right;
            else if (index_o==2 )
                obj = this.Image_animal_up;
            else if (index_o==3 )
                obj = this.Image_animal_left;


            // 碰 or 吃
            if(operateCode & CMD_ZPMJ.WIK_PENG||
                operateCode & CMD_ZPMJ.WIK_LEFT||
                operateCode & CMD_ZPMJ.WIK_CENTER||
                operateCode & CMD_ZPMJ.WIK_RIGHT)
            {
                // 动画
                if(operateCode & CMD_ZPMJ.WIK_PENG) {
                    cc.log("---碰----");
                    this.playingAnimateOnObj(obj ,2);
                }
                else {
                    cc.log("---吃----");
                    this.playingAnimateOnObj(this.Image_animal_normal,1);
                }

                //显示 操作玩家的 第13张手牌
                this.imgFOtherCard[operateUser][CMD_ZPMJ.MAX_COUNT-1].setVisible(true);

                //移除操作玩家三张牌
                var tVisibleCard = 0;
                for(var i=CMD_ZPMJ.MAX_COUNT-2; i>=0 ;i--) {
                    if(tVisibleCard==3)
                        break;
                    if(this.imgFOtherCard[operateUser][i].isVisible()){
                        this.imgFOtherCard[operateUser][i].setVisible(false);
                        tVisibleCard++;
                    }
                }

                //显示开牌
                if(operateCode & CMD_ZPMJ.WIK_PENG ) {
                    cc.log("---碰----显示开牌");
                    this.setOpenCard(operateUser, provideUser,operateCard[0], CMD_ZPMJ.WIK_PENG);
                }
                else {
                    cc.log("---吃----显示开牌");
                    this.setOpenCard(operateUser, provideUser,operateCard[0], operateCode);
                }

                //修改出牌列表
                this.delLastFromOutList(provideUser);
            }

            //杠
            if(operateCode &CMD_ZPMJ.WIK_GANG)
            {
                // 动画
                this.playingAnimateOnObj(obj ,3);

                //判断是否自摸杠碰杠
                if(provideUser == operateUser){
                    var bGang=false;
                    if(this.openTCardData[operateUser]){
                        for(var i=0;i<this.openTCardData[operateUser].length;i++){
                            var openCard = this.openTCardData[operateUser][i];
                            if(openCard.cardMask&CMD_ZPMJ.WIK_PENG && openCard.cardValue == operateCard[0]){
                                //自摸明杠
                                cc.log("+++++++++自摸明杠+++++++++");
                                bGang = true;
                                this.setOpenCard(operateUser,provideUser,operateCard[0], CMD_ZPMJ.WIK_GANG);

                                //移除操作玩家1张牌
                                var tVisibleCard = 0;
                                for(var i=CMD_ZPMJ.MAX_COUNT-2; i>=0 ;i--)
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
                        this.setOpenCard(operateUser,provideUser,operateCard[0], CMD_ZPMJ.WIK_ANGANG);

                        //移除操作玩家3张牌
                        var tVisibleCard = 0;
                        for(var i=CMD_ZPMJ.MAX_COUNT-2; i>=0 ;i--)
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
                    this.setOpenCard(operateUser,provideUser,operateCard[0], CMD_ZPMJ.WIK_GANG);

                    //移除操作玩家3张牌
                    var tVisibleCard = 0;
                    for(var i=CMD_ZPMJ.MAX_COUNT-2; i>=0 ;i--)
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
        if(operateCode & CMD_ZPMJ.WIK_LEFT||
            operateCode & CMD_ZPMJ.WIK_CENTER||
            operateCode & CMD_ZPMJ.WIK_RIGHT){
            SoundMgr.getInstance().playEffect("zpmj_"+strSex+"_chi", sex, false);
        }
        else if(operateCode & CMD_ZPMJ.WIK_PENG){
            SoundMgr.getInstance().playEffect("zpmj_"+strSex+"_peng", sex, false);
        }
        else if(operateCode & CMD_ZPMJ.WIK_GANG){
            SoundMgr.getInstance().playEffect("zpmj_"+strSex+"_gang", sex, false);
        }
        else if(operateCode & CMD_ZPMJ.WIK_CHI_HU){
            SoundMgr.getInstance().playEffect("zpmj_"+strSex+"_chi_hu", sex, false);
        }
    },

});
