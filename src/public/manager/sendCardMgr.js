/**
 * Created by admin on 14-3-6.
 */
var s_SendCardMgr = null;

var SendCardMgr = cc.Class.extend({
	ctor: function () {
		this._layer = null;
		this._sendCardQueue = [];
		this._bSendDeal = false;

		this._sendTime = 0.2;  //一张牌时间
		this._interval = 0.1; //设置发牌间隔（秒）
		this._startPt = cc.p(480, 320);
		this._startR = 0;
		this._startS = 0.50; //初始大小
		this._endR = 0; //旋转圈，360为1圈
	},

	getSendCardLayer: function () {
		this._layer = new cc.Layer();
		
		this.listCards = CardGroup.create(0, false);
		this._layer.addChild(this.listCards, 0);
		
		return this._layer;
	},
	
	getListCards: function(){
		return this.listCards;
	},
	
	setStartPt: function(pt){
		this._startPt = pt;
	},
	getStartPt: function(){
		return new cc.p(this._startPt.x, this._startPt.y);
	},

	setParameter: function(info){		
		this._sendTime = info.sendTime;  //一张牌时间
		this._interval = info.interval; //设置发牌间隔（秒）
		this._startPt = info.startPt;
		this._startR = info.startR;
		this._startS = info.startS; //初始大小
		this._endR = info.endR; //旋转圈，360为1圈
		
		this.listCards.setScale(this._startS);
	},
	
	exitSendCard: function()
	{
		if (this._bSendDeal){
			this._bSendDeal = false;
			while (SendCardMgr.getInstance()._sendCardQueue.length > 0) {
				SendCardMgr.getInstance()._sendCardQueue.pop();
			}
		}
	},
	sendCard: function (ptEnd, scale, value, bFace, funEnd, funStart) {
		if (this._bSendDeal) {
			var dataQue = {
					ptEnd: ptEnd,
					scale: scale,
					value: value,
					bFace: bFace,
					funEnd: funEnd,
					funStart: funStart
			};
			this._sendCardQueue.push(dataQue);
			return;
		}
		console.log("---callFun funStart---");
		if(funStart){
			funStart();
		}
		
		var allChild = this._layer.getChildren();
		for(var i=0; i<allChild.length; i++){
			var node = allChild[i];
			var order = node.getLocalZOrder();
			if(order >= 10){
				node.setLocalZOrder(order + 1);
			}
			
		}

		this._bSendDeal = true;

		var card = CardSprite.create(value, 0);
		card.setFace(bFace);
		card.setRotation(this._startR);
		card.setScale(this._startS);
		card.x = this._startPt.x;
		card.y = this._startPt.y;
		this._layer.addChild(card, 10);

		//发牌动画
		var rate = 3;
		var seqCard = cc.Sequence.create(
				cc.Spawn.create(
						cc.MoveTo.create(this._sendTime, ptEnd),
						cc.ScaleTo.create(this._sendTime, scale),
						cc.RotateTo.create(this._sendTime, this._endR)
				),
				cc.CallFunc.create(function (node, value) {
					node.setVisible(false);
					if (funEnd) {
						funEnd();
					}
				}, this)
		);

		var seqTime = cc.Sequence.create(
				cc.DelayTime.create(this._interval),
				cc.CallFunc.create(this.onOutInterval, this)
		);

		var spa = cc.Spawn.create(seqCard, seqTime);
		var endCallFunc = cc.CallFunc.create(function(node, value){
			node.removeAllChildren(true);
			node.removeFromParent(true);
		}, this);
		var action = cc.Sequence.create(spa, endCallFunc);

		card.runAction(action);
		//card.runAction(cc.EaseInOut.create(action, rate));
		//SoundMgr.getInstance().playEffect("send_card", 0, false);
	},

	//超出发牌间隔，才可以发另一张牌
	onOutInterval: function (node, value) {
		this._bSendDeal = false;
		if (this._sendCardQueue.length > 0) {
			var data = this._sendCardQueue.shift();
			this.sendCard(data.ptEnd, data.scale, data.value, data.bFace, data.funEnd, data.funStart);
			//this.sendCardDeal(data);
		}
	}
});

SendCardMgr.getInstance = function () {
	if (!s_SendCardMgr) {
		s_SendCardMgr = new SendCardMgr();
	}
	return s_SendCardMgr;
};