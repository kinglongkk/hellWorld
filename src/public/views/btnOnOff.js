//裁切线断
/////////////////////////////////////////////////////////////
var BtnOnOff = ccui.Widget.extend({

	ctor: function () {
		ccui.Widget.prototype.ctor.call(this);
		
		this._bOn = true;
		this._cbOn = null;
		this._cbOff = null;
	},

	initView:function (clipPic, picOnOff, picBorder, picButton, texType){
		this.clipPic = clipPic;
		this._picOnOff = picOnOff;
		this._picBorder = picBorder;
		this._picButton = picButton;
		this._texType = texType || ccui.Widget.LOCAL_TEXTURE;

		
		
		//onOff
		var onOff = new ccui.ImageView();
		onOff.loadTexture(this._picOnOff, this._texType);
		this.ImgOnOff = onOff;
		var size = onOff.getSize();
		size = cc.size(size.width / 2, size.height);
		this.ignoreContentAdaptWithSize(false);
		this.setSize(size);

		//border
		var border = new ccui.ImageView();
		border.loadTexture(this._picBorder, this._texType);
		border.x = size.width / 2;
		border.y = size.height / 2;
		this.addChild(border, 2);
		this.ImgBorder = border;

		//chip
		var clip = MyClip.createPic(this.clipPic);
		clip.x = size.width / 2;
		clip.y = size.height / 2;
		this.addChild(clip, 1);
		this.clip = clip;

		this.clip.addClipChild(this.ImgOnOff);
		this.ImgOnOff.x = size.width;
		this.ImgOnOff.y = size.height / 2;

		//button
		var button = new ccui.Button();
		button.setTouchEnabled(true);
		button.loadTextures(this._picButton, this._picButton, this._picButton, this._texType);
		button.x = size.width;
		button.y = size.height / 2;
		button.addTouchEventListener(this.onClick, this);
		this.addChild(button, 3);
		this.Button = button;
	},
	
	onClick: function(sender, type) {
		if (ccui.Widget.TOUCH_BEGAN == type) {
			var size = this.getSize();
			var ptEnd = cc.p(0, size.height / 2);
			if(!this._bOn){
				ptEnd = cc.p(size.width, size.height / 2);
			}
			
			//img onOff
			var moveTo1 = cc.moveTo(0.1, ptEnd);			
			this.ImgOnOff.runAction(moveTo1);
			
			//button
			var callFunc1 = cc.CallFunc(function(){
				this.Button.setEnabled(false);
				this._bOn = !this._bOn;
				if(this._bOn){
					if(this._cbOn){
						this._cbOn();
					}
				}else{
					if(this._cbOff){
						this._cbOff();
					}
				}
			}, this);
			var moveTo2 = cc.moveTo(0.1, ptEnd);
			var callFunc2 = cc.CallFunc(function(){
				this.Button.setEnabled(true);
			}, this);
			var seq = cc.Sequence(callFunc1, moveTo2, callFunc2);
			this.Button.runAction(seq);
		}
	},
	
	setOnOff: function(bOn){
		this._bOn = bOn;
		
		var size = this.getSize();
		var ptEnd = cc.p(0, size.height / 2);
		if(this._bOn){
			ptEnd = cc.p(size.width, size.height / 2);
		}
		
		this.ImgOnOff.x = ptEnd.x;
		this.ImgOnOff.y = ptEnd.y;
		
		this.Button.x = ptEnd.x;
		this.Button.y = ptEnd.y;
	},
	
	setOnCallBack: function(cb){
		this._cbOn = cb;
	},
	
	setOffCallBack: function(cb){
		this._cbOff = cb;
	},
});

//BtnOnOff.create("res/pic/btn_on_off_1.png", "res/pic/btn_on_off_2.png", "res/pic/btn_on_off_3.png");
BtnOnOff.create = function (clipPic, picOnOff, picBorder, picButton, texType) {
	var btn = new BtnOnOff();
	
	if (btn && btn.init()) {
		btn.initView(clipPic, picOnOff, picBorder, picButton, texType);
		return btn;
	}
	return null;
};