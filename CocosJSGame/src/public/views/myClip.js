//裁切实心圆
var ClipCircle = ccui.Widget.extend({

	ctor: function (radius) {
		ccui.Widget.prototype.ctor.call(this);
		
		this._radius = radius;
		
		this.ignoreContentAdaptWithSize(false);
		this.setSize(cc.size(radius*2, radius*2));
	},

	init:function (){
		if (ccui.Widget.prototype.init.call(this)){
			var r = this._radius;
			
			var stencil = new cc.DrawNode();
			stencil.drawDot(cc.p(r, r), r, cc.color(0, 0, 0, 255));
			
			this.clip = new cc.ClippingNode();
			this.clip.stencil = stencil;
			this.clip.setInverted(false);
			this.clip.setAlphaThreshold(0);
			
			this.addNode(this.clip);
			
			var clipClone = new cc.ClippingNode();
			clipClone.stencil = new cc.Node();
			clipClone.setInverted(true);
			clipClone.setAlphaThreshold(0);
			this.addNode(clipClone);

			return true;
		}

		return false;
	},
	
	addClipChild: function(node){
		node.setAnchorPoint(cc.p(0.5,0.5));
		node.x = this._radius;
		node.y = this._radius;
		
		this.clip.addChild(node);
	},
});

//裁切线断
/////////////////////////////////////////////////////////////
var ClipSegment = ccui.Widget.extend({

	ctor: function (w, h) {
		ccui.Widget.prototype.ctor.call(this);

		this._w = w;
		this._h = h;

		this.ignoreContentAdaptWithSize(false);
		this.setSize(cc.size(w, h));
	},

	init:function (){
		if (ccui.Widget.prototype.init.call(this)){
			var w = this._w;
			var h = this._h;

			var stencil = new cc.DrawNode();
			stencil.drawSegment( cc.p(h/2, h/2), cc.p(w-h/2, h/2), h/2, cc.color(0, 0, 0, 255) );

			this.clip = new cc.ClippingNode();
			this.clip.stencil = stencil;
			this.clip.setInverted(false);
			this.clip.setAlphaThreshold(0);

			this.addNode(this.clip);
			
			var clipClone = new cc.ClippingNode();
			clipClone.stencil = new cc.Node();
			clipClone.setInverted(true);
			clipClone.setAlphaThreshold(0);
			this.addNode(clipClone);

			return true;
		}

		return false;
	},

	addClipChild: function(node){
		node.setAnchorPoint(cc.p(0.5,0.5));
		node.x = this._w / 2;
		node.y = this._h / 2;

		this.clip.addChild(node);
	},
});

//裁切图片
/////////////////////////////////////////////////////////////
var ClipPic = ccui.Widget.extend({

	ctor: function (picFile) {
		ccui.Widget.prototype.ctor.call(this);

		this._picFile = picFile;
		var sprite = new cc.Sprite(picFile);
		var size = sprite.getContentSize();

		this.ignoreContentAdaptWithSize(false);
		this.setSize(size);
	},

	init:function (){
		if (ccui.Widget.prototype.init.call(this)){
			var sprite = new cc.Sprite(this._picFile);	
			var size = sprite.getContentSize();
			sprite.x = size.width / 2;
			sprite.y = size.height / 2;
			
			this.clip = new cc.ClippingNode();
			this.clip.stencil = sprite;
			this.clip.setInverted(false);
			this.clip.setAlphaThreshold(0);
			
			this.addNode(this.clip);

			var clipClone = new cc.ClippingNode();
			clipClone.stencil = new cc.Node();
			clipClone.setInverted(true);
			clipClone.setAlphaThreshold(0);
			this.addNode(clipClone);

			return true;
		}

		return false;
	},

	addClipChild: function(node){
		node.setAnchorPoint(cc.p(0.5,0.5));
		
		var size = this.getSize();
		node.x = size.width / 2;
		node.y = size.height / 2;
		this.clip.addChild(node);
	},
});

///////////////////////////////////////////////////////////
var MyClip = function(){};

MyClip.createCircle = function (radius) {
	var clip = new ClipCircle(radius);
	if (clip && clip.init()) {
		return clip;
	}
	return null;
};

MyClip.createSegment = function (w, h) {
	var clip = new ClipSegment(w, h);
	if (clip && clip.init()) {
		return clip;
	}
	return null;
};

MyClip.createPic = function (picFile) {
	var clip = new ClipPic(picFile);
	if (clip && clip.init()) {
		return clip;
	}
	return null;
};
