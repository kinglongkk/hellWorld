//牌组显示方式
var _CGT_FLASH_H = 0; //水平
var _CGT_FLASH_V = 1; //垂直
var _CGT_FLASH_F = 2; //扇形  this._ptCardSpace = cc.p(6,200);
var _CGT_FLASH_S = 3; //斜线  this._ptCardSpace = cc.p(22,-15);

//一组牌
var CardGroup = ccui.Widget.extend({
    _cards: null,
    _ptCardSpace: null,
    _cardStyle: null,
    _flashType: null,
    _angleSpace: null,
    _radiusSpace: null,

    ctor: function (style, bTouchEnable) {
        this._cards = [];
        this._ptCardSpace = cc.p(100,0);//牌偏移位置；扇形时x角度，y半径
        this._cardStyle = 0;
        this._flashType = _CGT_FLASH_H;//_CGT_FLASH_F,//_CGT_FLASH_H,
        this._angleSpace = 15;
        this._radiusSpace = 50;

        ccui.Widget.prototype.ctor.call(this);
        this._cardStyle = style;
        this.setTouchEnabled(bTouchEnable);
        this.addTouchEventListener(this.touchEvent ,this);
        
        this._cbTouchBagan = null;
        this._cbTouchMove = null;
        this._cbTouchEnded = null;
    },

    init:function (){
        if (ccui.Widget.prototype.init.call(this)){
            return true;
        }
        return false;
    },

    addCard:function(value, bFace, bFlash){
        var card = CardSprite.create(value, this._cardStyle, false);
        card.setFace(bFace);
        this.addChild(card);
        this._cards.push(card);

        if(bFlash == null || bFlash){
        	this.flashCardList();
        }
        
        return card;
    },

    addCardList:function(values, bFace, bFlash){
        for(var i=0; i<values.length; i++){
            var card = CardSprite.create(values[i], this._cardStyle, false);
            card.setFace(bFace);
            this.addChild(card);
            this._cards.push(card);
        }

        if(bFlash == null || bFlash){
        	this.flashCardList();
        }
    },
    
    setAllFace: function(bFace){
    	for(var i=0; i<this._cards.length; i++){
    		var card = this._cards[i];
    		if(card){
    			card.setFace(bFace)
    		}
    	}
    },
    
    open: function(duration){
    	for(var i=0; i<this._cards.length; i++){
    		var card = this._cards[i];
    		card.open(duration);
    	}
    },

    //翻牌动画
    runFlip: function(){
        for(var i=0; i<this._cards.length; i++){
            var card = this._cards[i];
            card.runFlipAction(0.02 * i);
        }
    },

    //展开动画
    runUnfold: function(cb){
    	var i;
    	var len = this._cards.length;
    	
    	if(len <= 0){
    		return;
    	}
    	
    	this.cancelAllUp();
    	
    	var sizeCard = this._cards[0].getSize();
    	var sizeCards = cc.size(sizeCard.width + this._ptCardSpace.x * (len - 1), sizeCard.height);
    	this.ignoreContentAdaptWithSize(false);
    	this.setSize(sizeCards);
    	this.setContentSize(sizeCards);
    	
    	for(i=0; i<len; i++){
    		var card = this._cards[i];
    		if(card){
    			card.x = sizeCards.width / 2;
    			card.y = sizeCard.height / 2;
    		}
    	}
    	
    	var speed = 200 / 0.2;
    	for(i=0; i<len; i++){
    		var card = this._cards[i];
    		var distance = Math.abs( sizeCards.width / 2 - (this._ptCardSpace.x * i + sizeCard.width / 2) );
    		var time = distance / speed;
    		var endX = this._ptCardSpace.x * i + sizeCard.width / 2;
    		var addEndX = endX;
    		if(addEndX < sizeCards.width / 2){
    			addEndX -= 20;
    		}else if(addEndX > sizeCards.width / 2){
    			addEndX += 20;
    		}
    		
    		var addEndPos = cc.p( addEndX, card.y );
    		var endPos = cc.p( endX, card.y );
    		
    		var actions = [];
    		var moveToAdd = cc.MoveTo.create(time, addEndPos);
    		actions.push(moveToAdd);
    		var moveTo = cc.MoveTo.create(0.1, endPos);
    		actions.push(moveTo);
    		if( i == (len - 1) ){
    			var callFunc = cc.CallFunc.create(function(){
    				if(cb){
    					cb();
    				}
    			}, this);
    			
    			actions.push(callFunc);
    		}
    		var seq = cc.Sequence.create(actions);
    		card.runAction(seq);
    	}
    },

    runFlidUnfold: function(){
        var size = this.getSize();
        for(var i=0; i<this._cards.length; i++){
            var card = this._cards[i];
            var moveTime = i * 0.02 + 0.1;
            var maxTime = (this._cards.length - 1) * 0.02 + 0.1;
            var cardSize = card.getSize();
            var moveTo1 = cc.MoveTo.create(moveTime, cc.p(cardSize.width/2, card.getPositionY()));
            var delay = cc.DelayTime.create(maxTime - moveTime + 0.1);
            var moveTo2 = cc.MoveTo.create(moveTime, card.getPosition());
            var call = cc.CallFunc.create( function(nodeCard, value){
                nodeCard.runFlipAction();
            }, this);
            //var moveToBack = moveTo.reverse();
            var seq = cc.Sequence.create(moveTo1, delay, moveTo2, call);
            card.runAction(seq);
        }
    },

    removeCardByIndex:function(index){
        var card = this._cards[index];
        if (card){
            this.removeChild(card, true);
            this._cards.splice(index, 1);
        }

        this.flashCardList();
    },

    removeCardByValue:function(value){
    	for(var i=0; i<this._cards.length; i++){
    		var card = this._cards[i];
    		if(card.getCardValue() == value){
    			this.removeChild(card, true);
    			this._cards.splice(i, 1);
    			break;
    		}
    	}
    },
    
    removeCardByValues:function(values){
    	for(var i=0; i<values.length; i++){
    		this.removeCardByValue(values[i]);
    	}
    },

    clearAllCard:function(){
    	if(this._cards.length > 0){
    		this.removeAllChildren(true);
    	}
        
        this._cards = [];
        this.ignoreContentAdaptWithSize(false);
        this.setSize(cc.size(0,0));
    },

    getCardStyle:function(){
        return this._cardStyle;
    },

    getCardByIndex:function(index){
        return this._cards[index];
    },

    getCardGroupLen:function(){
        return this._cards.length;
    },

    getCardSpace:function(){
        return this._ptCardSpace;
    },

    setCardSpace:function(ptCardSpace){
        this._ptCardSpace = ptCardSpace;
        this.flashCardList();
    },

    getCardDatas:function(){
        var datas = [];
        for(var idx in this._cards){
            var card = this._cards[idx];
            if (card){
                var cardValue = card.getCardValue();
                datas.push(cardValue);
            }
        }
        return datas;
    },

    setMaskColor:function(ccc4){},

    setFlashType:function(type){
        this._flashType = type;
        this.flashCardList();
    },

    flashCardList:function(){
        var count = this._cards.length;
        //cc.log("card list length = %d", count);
        if (count <= 0) {
            return;
        }

        switch (this._flashType)
        {
            case _CGT_FLASH_H: //水平
            {
                var cardSize = this._cards[0].getSize();
                //cc.log("cardSize size.w=%d  size.h=%d", cardSize.width, cardSize.height);
                var width = (this._cards.length - 1) * this._ptCardSpace.x + cardSize.width;
                var thisSize = cc.size(width, cardSize.height);

                for (var i=0; i<this._cards.length; i++){
                    var card = this._cards[i];
                    card.setPosition(cc.p( (cardSize.width / 2 + i * this._ptCardSpace.x), cardSize.height/2));

                    if (card.testStatusFlag(_CSF_UP)){
                        card.setPositionY(card.getPositionY() + 20);
                    }
                }

                this.ignoreContentAdaptWithSize(false);
                this.setSize(thisSize);
                this.setContentSize(thisSize);

                //test
                var size = this.getSize();
                //cc.log("flashCardList size.w=%d size.h=%d", size.width, size.height);
            }
                break;
            case _CGT_FLASH_V: //垂直
                break;
            case _CGT_FLASH_F: //扇形
                var angle = this._ptCardSpace.x;      //角度
                var radian = angle * Math.PI / 180;     //弧度
                var r = this._ptCardSpace.y;        //半径

                for(var i = 0; i < count; i++){
                    var a = ( i - (count - 1) / 2 ) * angle;
                    var card = this._cards[i];
                    card.setRotation(a);

                    var ptX = - Math.sin((count-1-2*i)*radian*0.5)*r;
                    var ptY = - ( 1 - Math.cos( (count-1-2*i)*radian*0.5 ) ) * r;
                    card.setPosition( cc.p(ptX,ptY));
                }

                break;
            case _CGT_FLASH_S: //斜线
            {
                var cardSize = this._cards[0].getSize();

                for (var i=0; i<this._cards.length; i++){
                    var card = this._cards[i];
                    var ptX = cardSize.width / 2 + i * this._ptCardSpace.x;
                    var ptY = cardSize.height/2 + i * this._ptCardSpace.y;
                    card.setPosition(cc.p(ptX, ptY));
                }

                this.ignoreContentAdaptWithSize(false);
                this.setSize(cardSize);
                this.setContentSize(cardSize);
            }
                break;
            default :
                break;
        }
    },

    getCardUpCount: function(){
        var upCount = 0;

        for(var i=0; i<this._cards.length; i++){
            var card = this._cards[i];
            if(card){
                var bUp = card.testStatusFlag(_CSF_UP);
                if(bUp){
                    upCount++;
                }
            }
        }

        return upCount;
    },
    
    getAllUpCardData: function(){
    	var data = [];
    	
    	for(var i=0; i<this._cards.length; i++){
    		var card = this._cards[i];
    		if(card){
    			var bUp = card.testStatusFlag(_CSF_UP);
    			if(bUp){
    				var value = card.getCardValue();
    				data.push(value);
    			}
    		}
    	}
    	
    	return data;
    },
    
    upCardByValue:function(value){
    	for(var i=0; i<this._cards.length; i++){
    		var card = this._cards[i];
    		if(card.getCardValue() == value){
    			card.onCardUp(true);
    			break;
    		}
    	}
    },

    upCardByValues:function(values){
    	for(var i=0; i<values.length; i++){
    		this.upCardByValue(values[i]);
    	}
    },
    
    cancelAllUp: function(){
    	for(var i=0; i<this._cards.length; i++){
    		var card = this._cards[i];
    		if(card){
    			card.onCardUp(false);
    		}
    	}
    },

    touchEvent: function (sender, type) {
        cc.log("CardGroup touch Event");
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
    
    setTouchBaganListener: function (fun) {
    	this._cbTouchBagan = fun;
    },
    
    setTouchMoveListener: function (fun) {
    	this._cbTouchMove = fun;
    },

    setTouchEndedListener: function (fun) {
    	this._cbTouchEnded = fun;
    },

    //Touch Down
    touchStart:function(){
        var pt = this.getTouchBeganPosition();
        cc.log("CardGroup touch Down x=%d, y=%d", pt.x, pt.y);
        if(this._cbTouchBagan){
        	this._cbTouchBagan(pt);
        }
    },

    //Touch Move
    touchMove:function(){
        var pt = this.getTouchMovePosition();
        cc.log("CardGroup touch Move x=%d, y=%d", pt.x, pt.y);
        
        if(this._cbTouchMove){
        	this._cbTouchMove(pt);
        }
    },

    //Touch Up
    touchEnd:function(){
        var pt = this.getTouchEndPosition();
        cc.log("CardGroup touch Up x=%d, y=%d", pt.x, pt.y);
        if(this._cbTouchEnded){
        	this._cbTouchEnded(pt);
        }
    },

    //Touch Cancelled
    touchCancelled:function(){
        cc.log("CardGroup touch Cancelled");
        if(this._cbTouchEnded){
        	this._cbTouchEnded();
        }
    },
    
    hideAllMaskColor: function(){
    	var len = this._cards.length;
    	for(var i=0; i<len; i++){
    		var card = this._cards[i];
    		card.hideMaskColor();
    	}
    },
    
    seleCards: function(ptStart, ptEnd, bSetUp){
    	this.hideAllMaskColor();
    	
    	var ptMinX = ptStart.x;
    	var ptMaxX = ptEnd.x;
    	if(ptStart.x > ptEnd.x){
    		ptMinX = ptEnd.x;
    		ptMaxX = ptStart.x;
    	}
    	
    	var len = this._cards.length;
    	var size = this.getSize();
    	
    	for(var i=0; i<len; i++){
    		var minX = this._ptCardSpace.x * i;
    		var minY = this._ptCardSpace.x * (i + 1);
    		if( i == (len - 1) ){
    			minY = size.width;
    		}
    		
    		if( (minY >= ptMinX) && (minX <= ptMaxX) ){
    			this.seleCard(i, bSetUp);
    		}
    	}
    },
    
    seleCard: function(index, bSetUp){
    	var card = this._cards[index];
    	if(!card){
    		return;
    	}
    	
    	if(bSetUp){
    		var bUp = card.testStatusFlag(_CSF_UP);
    		card.onCardUp(!bUp);
    	}else{
    		card.setCardMaskColor(cc.color(0,128,255,80));
    	}
    },
});

CardGroup.create = function (style, bTouchEnable) {
    var cardGroup = new CardGroup(style, bTouchEnable);
    if (cardGroup && cardGroup.init()) {
        return cardGroup;
    }
    return null;
};