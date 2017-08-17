//一张牌
//思路:可以用cocostudio来配置位置

var _CSF_NORMAL		= 0x0001;	//正常
var _CSF_MOUSEOVER	= 0x0002;	//鼠标悬浮
var _CSF_SELECT		= 0x0004;	//选中
var _CSF_UP			= 0x0008;	//被抬高
var _CSF_BACK		= 0x0010;	//背面

var CardSprite = ccui.Widget.extend({
    ImgBack: null,
    ImgFront: null,
    ImgValue: null,
    ImgSuitSmall: null,
    ImgSuitBig: null,
    ImgMask: null,

    _CardValue: null,
    _CardStyle: null,
    _CardStatusFlag: null,

    _Widget: null,
    _uiLayer: null,

    ctor: function (bTouchEnable) {
        ccui.Widget.prototype.ctor.call(this);
        this.ImgBack = null;
        this.ImgFront = null;
        this.ImgValue = null;
        this.ImgSuitSmall = null;
        this.ImgSuitBig = null;
        this.ImgMask = null;

        this._CardValue = null;
        this._CardStyle = null;
        this._CardStatusFlag = _CSF_NORMAL;

        this._Widget = null;
        this._uiLayer = null;

        this.setTouchEnabled(bTouchEnable);
        this.addTouchEventListener(this.touchEvent ,this);
        
        this._cbTouchBagan = null;
    	this._cbTouchEnded = null;
    },

    loadJson:function (value, style){
    	if (!_CARD_CFG_){
    		return false;
    	}
    	
    	this._CardValue = value;
    	this._CardStyle = style;

        if (value == 0) value = 1;
        if (value == 0x41) value = 0x4e;
        if (value == 0x42) value = 0x4f;

        var cardPath = "huaiFengCardListPlist/Value_" + ((value<0x10)?"0":"") + value.toString(16) + "_Style_" + style.toString() + ".png";
        if (value < 0 || (value > 0x0d && value < 0x11) || (value > 0x1d && value < 0x21) ||
            (value > 0x2d && value < 0x31) || (value > 0x3d && value != 0x4e && value != 0x4f)) {
            cc.log("未知牌"+value);
            cardPath = "huaiFengCardListPlist/img_card_back.png";
        }

        var image_front = new ccui.ImageView(cardPath, ccui.Widget.PLIST_TEXTURE);
        image_front.setAnchorPoint(cc.p(0, 0));
        this.addChild(image_front);
        this.ImgFront = image_front;

        this.ImgMask = image_front.clone();
        this.ImgMask.setAnchorPoint(cc.p(0, 0));
        this.addChild(this.ImgMask);
        this.ImgMask.setVisible(false);

        this.ImgBack = new  ccui.ImageView("huaiFengCardListPlist/img_card_back.png", ccui.Widget.PLIST_TEXTURE);
        this.ImgBack.setAnchorPoint(cc.p(0, 0));
        this.addChild(this.ImgBack);
        this.ImgBack.setVisible(false);

    	// // 旧代码
    	// var strId = "Type_" + ((value<0x10)?"0":"") + value.toString(16) + "_Style_" + style.toString();
    	//
    	// var cardCfg = _CARD_CFG_["cardCfg"];
        //
    	// var cardSize = cc.size(cardCfg['w'], cardCfg['h']);
    	// this.setSize(cardSize);
    	//
    	// var frontCfg = cardCfg['front'];
    	// //cc.log(frontCfg[2]);
    	// var imageFront = new ccui.ImageView(frontCfg[2], ccui.Widget.PLIST_TEXTURE);
    	// imageFront.x = frontCfg[0];
    	// imageFront.y = frontCfg[1];
    	// this.addChild(imageFront);
    	// this.ImgFront = imageFront;
        //
        //
    	//
    	// if(value < 0x40){
    	// 	var valueCfg = frontCfg[3]["value"];
    	// 	var imageValue = new ccui.ImageView(_CARD_CFG_[strId]["value"], ccui.Widget.PLIST_TEXTURE);
    	// 	imageValue.x = valueCfg[0];
    	// 	imageValue.y = valueCfg[1];
    	// 	this.ImgFront.addChild(imageValue);
    	// 	this.ImgValue = imageValue;
        //
    	// 	var smallCfg = frontCfg[3]["small"];
    	// 	var imageSmall = new ccui.ImageView(_CARD_CFG_[strId]["small"], ccui.Widget.PLIST_TEXTURE);
    	// 	imageSmall.x = smallCfg[0];
    	// 	imageSmall.y = smallCfg[1];
    	// 	this.ImgFront.addChild(imageSmall);
    	// 	this.ImgSuitSmall = imageSmall;
        //
    	// 	var bigCfg = frontCfg[3]["big"];
    	// 	var imageBig = new ccui.ImageView(_CARD_CFG_[strId]["big"], ccui.Widget.PLIST_TEXTURE);
    	// 	imageBig.x = bigCfg[0];
    	// 	imageBig.y = bigCfg[1];
    	// 	this.ImgFront.addChild(imageBig);
    	// 	this.ImgSuitBig = imageBig;
    	// }else{
    	// 	var jokerCfg = frontCfg[3]["joker"];
    	// 	var imageJoker = new ccui.ImageView(_CARD_CFG_[strId]["joker"], ccui.Widget.PLIST_TEXTURE);
    	// 	imageJoker.x = jokerCfg[0];
    	// 	imageJoker.y = jokerCfg[1];
    	// 	this.ImgFront.addChild(imageJoker);
    	// 	this.ImgJoker = imageJoker;
    	// }
    	//
    	// var maskCfg = cardCfg['mask'];
    	// var imageMask = new ccui.ImageView(maskCfg[2], ccui.Widget.PLIST_TEXTURE);
    	// imageMask.x = maskCfg[0];
    	// imageMask.y = maskCfg[1];
    	// this.addChild(imageMask);
    	// this.ImgMask = imageMask;
    	// this.ImgMask.setVisible(false);
    	//
    	// var backCfg = cardCfg['back'];
    	// var imageBack = new ccui.ImageView(backCfg[2], ccui.Widget.PLIST_TEXTURE);
    	// imageBack.x = backCfg[0];
    	// imageBack.y = backCfg[1];
    	// this.addChild(imageBack);
    	// this.ImgBack = imageBack;
    	// this.ImgBack.setVisible(false);
    	
    	return true;
    },

    setValue:function(value, style){
    	this.removeAllChildren();
    	
    	this.loadJson(value, style);
    },

    getCardValue:function(){
        return this._CardValue;
    },

    getCardStyle:function(){
        return this._CardStyle;
    },

    getCardSuit:function(){
        return (this._CardValue & 0xf0);
    },

    getCardRank:function(){
        return (this._CardValue & 0x0f);
    },

    setCardMaskColor:function(color){
    	this.ImgMask.setVisible(true);
    	this.ImgMask.setColor(cc.color(color.r,color.g,color.b));
    	this.ImgMask.setOpacity(color.a);
    },
    hideMaskColor: function(){
    	this.ImgMask.setVisible(false);
    },

    isTouchFocus:function(ptThouch){
        var pt = this.convertToNodeSpace(ptThouch);
        var WidgetSize = this._Widget.getContentSize();
        var rect = cc.rect(0, 0, WidgetSize.width, WidgetSize.height);

        return cc.rectContainsPoint(rect, pt);
    },

    testStatusFlag:function(btFlag){
        if (this._CardStatusFlag == btFlag) {
            return true
        }
        else {
            return (this._CardStatusFlag != 0) && ( btFlag == (this._CardStatusFlag & btFlag) );
        }
    },

    addStatusFlag:function(btFlag){
        this._CardStatusFlag |= btFlag;
    },

    removeStatusFlag:function(btFlag){
        this._CardStatusFlag &= (~btFlag);
    },

    onSelected:function(bSelected){
        if (bSelected) {
            // this.setCardMaskColor(cc.Color(0,0,128,50));
            this.addStatusFlag(_CSF_SELECT);
        }
        else{
            // this.setCardMaskColor(cc.Color(0,0,0,0));
            this.removeStatusFlag(_CSF_SELECT);
        }
    },

    onCardUp:function(bUp){
        var bUpNow = this.testStatusFlag(_CSF_UP);

        if (bUp){
            if (!bUpNow){
                this.setPositionY(this.getPositionY() + 20);
                this.addStatusFlag(_CSF_UP);
            }
        }
        else{
            if (bUpNow){
                this.setPositionY(this.getPositionY() - 20);
                this.removeStatusFlag(_CSF_UP);
            }
        }
    },
    
    isUp: function(){
    	var bUp = this.testStatusFlag(_CSF_UP);
    	return bUp;
    },

    setFace:function(bFront){
        if(bFront){
            this.ImgBack.setVisible(false);
            this.removeStatusFlag(_CSF_BACK);
        }else{
            this.ImgBack.setVisible(true);
            this.addStatusFlag(_CSF_BACK);
        }
    },

    isFace:function(){
        return ( !this.ImgBack.isVisible() );
    },

    flipCard: function(node, value){
        var bFace = !this.isFace();
        this.setFace(bFace);
    },

    setChildFlippedX: function(bFilpX){
        this.ImgFront.setFlippedX(bFilpX);
        this.ImgSuitBig.setFlippedX(bFilpX);
        this.ImgValue.setFlippedX(bFilpX);
        this.ImgSuitSmall.setFlippedX(bFilpX);
        var size = this.getSize();
        this.ImgFront.setPositionX( size.width - this.ImgFront.getPositionX() );
        this.ImgSuitBig.setPositionX( size.width - this.ImgSuitBig.getPositionX() );
        this.ImgValue.setPositionX( size.width - this.ImgValue.getPositionX() );
        this.ImgSuitSmall.setPositionX( size.width - this.ImgSuitSmall.getPositionX() );
    },

    flipCardStart: function(node, value){
        var bChildFlipX = !this.isFace();
        this.setChildFlippedX(bChildFlipX);
    },

    flipCardEnd: function(node, value){
        this.getCamera().restore();
        this.setChildFlippedX(false);
    },

    runFlipAction: function(time){
        var callStart = cc.CallFunc.create( this.flipCardStart, this);

        var delay = cc.DelayTime.create(0.15);
        var call = cc.CallFunc.create( this.flipCard, this);

        var size = this.getSize();
        var moveTo1 = cc.MoveBy.create(0.15, cc.p(0, size.height/2));
        var moveTo2 = cc.MoveBy.create(0.15, cc.p(0, -size.height/2));

        var seq1 = cc.Sequence.create(delay, call);
        var seq2 = cc.Sequence.create(moveTo1, moveTo2);
        var orbit = cc.OrbitCamera.create(0.3, 1, 0, 0, -180, 45, 0);

        var spawn = cc.Spawn.create(seq1,seq2,orbit);
        var callEnd = cc.CallFunc.create( this.flipCardEnd, this);

        var action = cc.Sequence.create(
            cc.DelayTime.create(time),
            callStart,
            spawn,
            callEnd
        );

        //this.runAction(cc.RepeatForever.create(action));
        this.runAction(action);

    },
    
    open: function(duration){
    	if(this.isFace()){
    		return;
    	}
    	
    	this.ImgBack.stopAllActions();
    	this.ImgFront.stopAllActions();
    	
    	// 正面z轴起始角度为90度（向左旋转90度），然后向右旋转90度
    	var orbitFront = cc.orbitCamera(duration*0.5,1,0,90,-90,0,0);
    	// 正面z轴起始角度为0度，然后向右旋转90度
    	var orbitBack = cc.orbitCamera(duration*0.5,1,0,0,-90,0,0);
    	
    	this.ImgFront.setVisible(false);
    	
    	var seqFront = cc.sequence(cc.show(), orbitFront);
    	var tagAction = cc.targetedAction(this.ImgFront, seqFront);
    	
    	var seq = cc.sequence(
    			cc.show(),
    			orbitBack,
    			cc.hide(),
    			tagAction
    			);
    	
    	this.ImgBack.runAction(seq);
    },

    playActon: function () {

    },
    
    setTouchBaganListener: function (fun) {
    	this._cbTouchBagan = fun;
    },
    
    setTouchEndedListener: function (fun) {
    	this._cbTouchEnded = fun;
    },

    touchEvent: function (sender, type) {
        cc.log("CardSprite touch Event");
        switch (type) {
            case ccui.Widget.TOUCH_BEGAN:
                this.touchStart();
                break;
            case ccui.Widget.TOUCH_MOVED:
                this.touchMove();
                break;
            case ccui.Widget.TOUCH_ENDED:
                this.touchEnd();
                break;
            case ccui.Widget.TOUCH_CANCELED:
                this.touchCancelled();
                break;
            default:
                break;
        }
    },

    //Touch Down
    touchStart:function(){
    	var pt = this.getTouchBeganPosition();
        cc.log("CardSprite touch Down x=%d, y=%d", pt.x, pt.y);
        if(this._cbTouchBagan){
        	this._cbTouchBagan();
        }
    },

    //Touch Move
    touchMove:function(){
    	var pt = this.getTouchMovePosition();
        cc.log("CardSprite touch Move x=%d, y=%d", pt.x, pt.y);
    },

    //Touch Up
    touchEnd:function(){
    	var pt = this.getTouchEndPosition();
        cc.log("CardSprite touch Up x=%d, y=%d", pt.x, pt.y);
        if(this._cbTouchEnded){
        	this._cbTouchEnded();
        }
    },

    //Touch Cancelled
    touchCancelled:function(){
        cc.log("CardSprite touch Cancelled");
        if(this._cbTouchEnded){
        	this._cbTouchEnded();
        }
    }

});

CardSprite.create = function (value, style, bTouchEnable) {
    var card = new CardSprite(bTouchEnable);
    
    if (card && card.loadJson(value, style)) {
        return card;
    }
    return null;
};
