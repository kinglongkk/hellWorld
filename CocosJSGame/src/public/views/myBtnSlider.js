var MyBtnSlider = ccui.Widget.extend({
	ctor: function () {
		ccui.Widget.prototype.ctor.call(this);
		
		this._bOn = false;
	},

	init: function () {
		if (ccui.Widget.prototype.init.call(this)) {
			var json = ccs.load(res.BtnSlider_json);
			var node = json.node;
			
			this.addChild(node);
			
			this.PanelBtn = node.getChildByName('PanelBtn');
			this.PanelBtn.addTouchEventListener(this._onClickEvent, this);
			
			this.PanelClip = this.PanelBtn.getChildByName('PanelClip');
			this.Img_1 = this.PanelClip.getChildByName('Img_1');
			
			this.Img_2 = this.PanelBtn.getChildByName('Img_2');
			
			this.PanelTop = this.PanelBtn.getChildByName('PanelTop');
			this.Img_3 = this.PanelTop.getChildByName('Img_3');
			this.Img_3.setTouchEnabled(true);
			this.Img_3.addTouchEventListener(this._onClickEvent, this);

			return true;
		}
		return false;
	},
	
	_onClickEvent: function(sender, type) {
		if (ccui.Widget.TOUCH_BEGAN == type) {
			sender.setEnabled(false);
			this._bOn = !this._bOn;
			
			var size = this.PanelClip.getSize();
			var ptEnd = cc.p(size.width, size.height / 2);
			if(this._bOn){
				ptEnd = cc.p(0, size.height / 2);
			}
			
			if(this._bOn){
				this._btnOn();
			}else{
				this._btnOff();
			}
		
			this.Img_1.runAction(cc.moveTo(0.2, ptEnd));
			
			var moveTo = cc.moveTo(0.2, ptEnd);
			var callFunc = cc.CallFunc(function(){
				sender.setEnabled(true);
			}, this);
			var seq = cc.Sequence(moveTo, callFunc);
			this.Img_3.runAction(seq);
		}
	},
	
	_btnOn: function(){
		if (this._selector && this._eventListener)
			this._selector.call(this._eventListener, this, "on");
	},
	
	_btnOff: function(){
		if (this._selector && this._eventListener)
			this._selector.call(this._eventListener, this, "off");
	},
	
	addOnOffListener: function(selector, target){
		this._selector = selector;
		this._eventListener = target;
	},
	
	setOnOff: function(bOn){
		this._bOn = bOn;

		var size = this.PanelClip.getSize();
		var ptEnd = cc.p(size.width, size.height / 2);
		if(this._bOn){
			ptEnd = cc.p(0, size.height / 2);
		}

		this.Img_1.x = ptEnd.x;
		this.Img_1.y = ptEnd.y;

		this.Img_3.x = ptEnd.x;
		this.Img_3.y = ptEnd.y;
	},
});