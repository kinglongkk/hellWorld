

DLG_CREATOR[ID_DlgPlazaUserInfo] = function() {
	return new DlgPlazaUserInfo();
};

var DlgPlazaUserInfo = DlgBase.extend({
	ctor: function(){
		this.faceId = 0; //头像
		this.nickName = 0; //昵称
		this.userId = 0; //ID
		this.money = 0; //金币数
		this.level = 0;//等级
		this.wingame = 0;//赢局数
		this.gameTotal = 0; //总对局
		this.diamond = 0;
		this.roomcard = 0;
	},

	onCreate: function() {
		this.init();
	},

	onClose: function() {

	},

	init: function() {
		cc.spriteFrameCache.addSpriteFrames(res.dlgPlazaUserInfoPlist_plist);
		cc.spriteFrameCache.addSpriteFrames(res.dlgPublic_Plist);
		var json = ccs.load(res.dlgPlazaUserInfoScene_json);
		this._rootWidget = json.node;

		this._rootWidget.setLocalZOrder(30);	// 暂时把个人信息提前几层

		//自适应屏幕大小
		var sizeDir = cc.director.getWinSize();
		this._rootWidget.setContentSize(sizeDir);
		ccui.helper.doLayout(this._rootWidget);

		this.Panel_back = this._rootWidget.getChildByName('Panel_back');
		this.Panel_back.setVisible(true);

		this.Panel_work = this._rootWidget.getChildByName('Panel_work');
		this.Panel_work.setVisible(true);

		//返回
		this.Button_back = this.Panel_work.getChildByName('Button_back');
		this.Button_back.setPressedActionEnabled(true);
		this.Button_back.addTouchEventListener(this.onClickEvent, this);

		this.Image_bg = this.Panel_work.getChildByName('Image_bg');

		//昵称
		this.Text_NickName = this.Image_bg.getChildByName('Text_NickName');
		this.Text_NickName.setTouchEnabled(true);
		this.Text_NickName.addTouchEventListener(this.onClickEvent, this);

		//用户ID	
		this.Text_userID = this.Image_bg.getChildByName('Text_userID');

		//钻石数 金币 房卡 等级
		this.Button_diamond = this.Image_bg.getChildByName('Button_diamond');
		this.Text_diamond = this.Image_bg.getChildByName('Text_diamond');

		this.Button_bean = this.Image_bg.getChildByName('Button_bean');
		this.Text_bean = this.Image_bg.getChildByName('Text_bean');

		this.Button_roomcard = this.Image_bg.getChildByName('Button_roomcard');
		this.Text_roomcard = this.Image_bg.getChildByName('Text_roomcard');

		this.Button_level = this.Image_bg.getChildByName('Button_level');
		this.Button_level.setVisible(true);

		//赢局数 总局数 胜率
		this.AtlasLabel_winNum = this.Image_bg.getChildByName('AtlasLabel_winNum');
		this.AtlasLabel_Countgame = this.Image_bg.getChildByName('AtlasLabel_Countgame');
		this.AtlasLabel_Gameper = this.Image_bg.getChildByName('AtlasLabel_Gameper');

		//切换账号
		this.Button_otherplay = this.Image_bg.getChildByName('Button_otherplay');
		this.Button_otherplay.setTouchEnabled(true);
		this.Button_otherplay.addTouchEventListener(this.onClickEvent, this);
		this.Button_otherplay.setVisible(true);

		//设置头像
		this.Image_thumb = this.Image_bg.getChildByName('Image_thumb');
		this.Image_thumb.setTouchEnabled(true);
		this.Image_thumb.addTouchEventListener(this.onClickEvent, this);


		//淡入
		this.Panel_work.setOpacity(0)
		this.Panel_work.runAction(cc.fadeIn(0.4));

		//this.updateDlg();
	},

	onClickEvent: function(sender, type) {
		if (ccui.Widget.TOUCH_ENDED == type) {
			var strBtnName = sender.getName();
			cc.log('onClickEvent ' + strBtnName);
			switch (strBtnName) {
			case "Button_back":
				UIMgr.getInstance().closeDlg(ID_DlgPlazaUserInfo);
				break;
			case "Button_otherplay":
				ClientData.getInstance().reset();
				LocalStorageMgr.getInstance().setAutoLoginItem(false);
				UIMgr.getInstance().closeDlg(ID_DlgPlazaUserInfo);
				var scene = new cc.TransitionPageTurn(0.5, new LoginScene(), false);
				cc.director.runScene(scene);
				break;
			default:
				break;
			}
		}
	},

	setFaceByFaceId: function(player){

		if (player == null) player = g_objHero;

		if(player.getUserId() != g_objHero.getUserId()){
			this.Button_otherplay.setVisible(false);
		}

		var Image_thumb = this.Image_bg.getChildByName('Image_thumb');
		var headSize = Image_thumb.getSize();
		player.loadUrlImage(function(savePath){
			if(savePath!=undefined&&savePath.length>0)
			{
                Image_thumb.loadTexture(savePath, ccui.Widget.LOCAL_TEXTURE);
                Image_thumb.setContentSize(cc.size(headSize.width,headSize.height));
			}
		});	
	},

//	getImageURL: function (imagePath) {
//	cc.log("图片地址="+imagePath);
//	var Image_thumb = this.Image_bg.getChildByName('Image_thumb');
//	Image_thumb.loadTexture(imagePath, ccui.Widget.LOCAL_TEXTURE);
//	},

	updateDlg: function(player){
		//玩家信息	
		if(this.nickName){
			this.Text_NickName.setString(this.nickName);
		}
		else this.Text_NickName.setString("无名氏");
		
		//cc.log("getSpreaderID---"+player.getGameId());
		var id = player.getSpreaderID() || player.getGameId();
		this.Text_userID.setString("(ID:"+id+")");

		this.Text_diamond = this.Image_bg.getChildByName('Text_diamond');
		this.Text_diamond.setString(this.diamond);
		this.Text_bean = this.Image_bg.getChildByName('Text_bean');
		this.Text_bean.setString(this.money);
		this.Text_roomcard = this.Image_bg.getChildByName('Text_roomcard');
		this.Text_roomcard.setString(this.roomcard);

		this.Button_level.setTitleText("LV."+this.level);
		this.AtlasLabel_winNum.setString(this.wingame);
		this.AtlasLabel_Countgame.setString(this.gameTotal);

		var perInt = parseInt((this.wingame/this.gameTotal)*100);
		if(perInt){
			this.AtlasLabel_Gameper.setString(perInt+'/');
		}
		else this.AtlasLabel_Gameper.setString('0'+'/');


		var wingamelen = this.AtlasLabel_winNum.getString().length;
		var gameTotalen = this.AtlasLabel_Countgame.getString().length;
		var Gameperlen = this.AtlasLabel_Gameper.getString().length;

		this.AtlasLabel_winNum.setContentSize(18*wingamelen,30);
		this.AtlasLabel_Countgame.setContentSize(18*gameTotalen,30);
		this.AtlasLabel_Gameper.setContentSize(18*Gameperlen,30);	

		this.setFaceByFaceId(player);

	},
});

//DlgPlazaUserInfo.imageGet = function(strPath){
//var dlgMore = UIMgr.getInstance().getDlg(ID_DlgPlazaUserInfo);
//if (dlgMore) {
//dlgMore.getImageURL(strPath);
//}
//}