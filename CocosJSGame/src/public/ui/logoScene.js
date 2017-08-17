
var LogoMainLayer = cc.LayerColor.extend({
	init: function (color) {
	    this._super(color);
		cc.log("LogoMainLayer--------------------------------------------------began");
		var sizeDir = cc.director.getWinSize();
		//logoIcon
		this.logoIcon = new ccui.ImageView("res/public/logoIcon.png");
		this.logoIcon.x = sizeDir.width / 2;
		this.logoIcon.y = sizeDir.height / 2 + this.logoIcon.height / 2;
        // var sizeImg = imageView.getSize();
        // logoIcon.setScaleX(sizeDir.width / sizeImg.width);
        // logoIcon.setScaleY(sizeDir.height / sizeImg.height);
		this.addChild(this.logoIcon);

		this.logoIcon.setOpacity(0);
//        seq = cc.Sequence([
//                cc.FadeIn(1),
//                cc.delayTime(3),
//                cc.FadeOut(1)
//            ]
//        );

        this.logoIcon.runAction(cc.FadeIn(1));

		//
        var iconSize = this.logoIcon.getContentSize();
        this.logoIcon0 = new ccui.ImageView("res/public/logoIcon0.png");
        this.logoIcon0.x = sizeDir.width / 2;
        this.logoIcon0.y = sizeDir.height / 2 - iconSize.height / 2;
        // var sizeImg = logoIcon0.getSize();
        // logoIcon0.setScaleX(sizeDir.width / sizeImg.width);
        // logoIcon0.setScaleY(sizeDir.height / sizeImg.height);
        this.addChild(this.logoIcon0);

        this.logoIcon0.setOpacity(0);
//        seq = cc.Sequence([
//                cc.FadeIn(1),
//                cc.delayTime(3),
//                cc.FadeOut(1)
//            ]
//        );

        this.logoIcon0.runAction(cc.FadeIn(1));


		cc.log("LogoMainLayer--------------------------------------------------end");
	},
});


var LogoScene = cc.Scene.extend({
	ctor:function () {
		this._super();
		this.init();

		this.layer = new LogoMainLayer();
		this.addChild(this.layer);
		this.layer.init(cc.color(255, 255, 255, 255));
	},
	
	onEnter: function () {
		this._super();
	},

	onEnterTransitionDidFinish:function () {
		this._super();
		this.sceneName = "LogoScene";

        var seq = cc.Sequence([
                cc.delayTime(5),
                cc.CallFunc(this.finishCb,this)
			]
            );

        this.layer.runAction(seq);
	},

	setCallBack: function(cb){
        this.finishCb = cb;
	}
});
