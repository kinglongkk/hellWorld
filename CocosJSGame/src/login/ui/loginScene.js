/*
 * LoginScene && LoginMainLayer
 * Author: 	xjn 
 * Date:	2017.4.1
 * 
 * 功能：
 * */
var LoginMainLayer = cc.Layer.extend({

	init: function () {
		cc.log("LoginMainLayer--------------------------------------------------began");		
		var sizeDir = cc.director.getWinSize();
		
		//bg
		var imageView = new ccui.ImageView(res.login_bg);
		imageView.x = sizeDir.width / 2;
		imageView.y = sizeDir.height / 2;
		var sizeImg = imageView.getSize();
		imageView.setScaleX(sizeDir.width / sizeImg.width);
		imageView.setScaleY(sizeDir.height / sizeImg.height);
		this.addChild(imageView);
		
		// cc.spriteFrameCache.addSpriteFrames(res.facePlist_plist);
		// cc.spriteFrameCache.addSpriteFrames(res.cardPlist_plist);
		//cc.spriteFrameCache.addSpriteFrames(res.nntbCardPlist_plist);
       // cc.spriteFrameCache.addSpriteFrames(res.huaiFengCardPlist_plist);

		cc.log("LoginMainLayer--------------------------------------------------end");
	},
});


var LoginScene = cc.Scene.extend({
	ctor:function () {
        yayaSdkMgr.getInstance().initYaYaSDK();

		this._super();
		this.init();

		this.layer = new LoginMainLayer();
		this.addChild(this.layer);
		this.layer.init();
	},
	
	onEnter: function () {
		this._super();

	},

	onEnterTransitionDidFinish:function () {
		this._super();
		this.sceneName = "LoginScene";
		
		UIMgr.getInstance().init(this.layer);
		LoginSceneUIMgr.getInstance().init(this.layer);

        horseRaceLamp.getInstance();
	},

	getSceneName: function(){
		return this.sceneName;
	},

	isLoginScene: function(){
		return true;
	},
	
	isPlazaScene: function(){
		return false;
	},

	isGameScene: function(){
		return false;
	},
});
