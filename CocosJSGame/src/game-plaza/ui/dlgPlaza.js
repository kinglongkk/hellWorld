/*
 * 大厅界面
 * Author: 	xjn 
 * Date:	2017.4.1
 * 
 * 功能：
 * 大厅界面控件交互处理
 * */


DLG_CREATOR[ID_DlgPlaza] = function() {
	return new DlgPlaza();
};

var DlgPlaza = DlgBase.extend({
	ctor: function(){
		var sizeDir = cc.director.getWinSize();
		
		this.sizeListGame = cc.size(sizeDir.width, 400);
		this.sizeListRoom = cc.size((sizeDir.width - 40), 410);
	},
	
	onCreate: function() {
		this.init();
	},

	onClose: function() {
		this.removeListerShareResult();
	},
	
	init: function() {
		cc.log("ID_DlgPlaza");
		SoundMgr.getInstance().playMusic("game_plaza",0,true);//循环播放大厅音乐
		var MusicVolume = LocalStorageMgr.getInstance().getMusicVolumeItem();
		console.log("MusicVolume="+ MusicVolume);
		var value = MusicVolume / 100;

		if(MusicVolume <100){	
			SoundMgr.getInstance().setMusicVolume(value/2);
		}
		else SoundMgr.getInstance().setMusicVolume(value);
		
		var json = ccs.load(res.dlgPlazaScene_json);
		this._rootWidget = json.node;

		//自适应屏幕大小
		var sizeDir = cc.director.getWinSize();
		this._rootWidget.setContentSize(sizeDir);
		ccui.helper.doLayout(this._rootWidget);
		
		var setBtnCallBack = function(btnParent, btnName, listener){
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
		}
		
		this.Panel_root = this._rootWidget.getChildByName("Panel_root");
		this.Panel_room = this.Panel_root.getChildByName("Panel_room");
		//加入房间
		this.Button_enteroom = setBtnCallBack(this.Panel_room,'Button_enteroom',this.onClickOpenSubDlg);
		//创建房间
		this.Button_openRoom = setBtnCallBack(this.Panel_room,'Button_openRoom',this.onClickOpenSubDlg);
		
		//设置图标
		var gameList = GameKindMgr.getInstance().getGameList();
		var defaultGameCfg = gameList[0];
		this.Button_openRoom.loadTextureNormal(defaultGameCfg.openIcon, ccui.Widget.PLIST_TEXTURE);
		this.Button_enteroom.loadTextureNormal(defaultGameCfg.addIcon, ccui.Widget.PLIST_TEXTURE);
		
		this.Panel_fieldsAndMore = this.Panel_root.getChildByName("Panel_fieldsAndMore");
		//菜鸟场
		this.Button_fieldCaiNiao = setBtnCallBack(this.Panel_fieldsAndMore,'Button_fieldCaiNiao',this.onClickOpenSubDlg);
		//平民场
		this.Button_fieldPingMin = setBtnCallBack(this.Panel_fieldsAndMore,'Button_fieldPingMin',this.onClickOpenSubDlg);
		//土豪场
		this.Button_fieldTuHao = setBtnCallBack(this.Panel_fieldsAndMore,'Button_fieldTuHao',this.onClickOpenSubDlg);
		//更多游戏
		this.Button_gameMore = setBtnCallBack(this.Panel_fieldsAndMore,'Button_gameMore',this.onClickOpenSubDlg);

		this.Panel_operation = this.Panel_root.getChildByName("Panel_operation");
		//商城
		this.Button_toShop = setBtnCallBack(this.Panel_operation,'Button_toShop',this.onClickOpenSubDlg);
		//邮件
		this.Button_toMail = setBtnCallBack(this.Panel_operation,'Button_toMail',this.onClickOpenSubDlg);
		//签到
		this.Button_toSign = setBtnCallBack(this.Panel_operation,'Button_toSign',this.onClickOpenSubDlg);
		//背包
		this.Button_toBag = setBtnCallBack(this.Panel_operation,'Button_toBag',this.onClickOpenSubDlg);
		//任务
		this.Button_toTask = setBtnCallBack(this.Panel_operation,'Button_toTask',this.onClickOpenSubDlg);

		this.Panel_userInfo = this.Panel_root.getChildByName("Panel_userInfo");
		//个人中心
		this.Panel_headInfo = this.Panel_userInfo.getChildByName("Panel_headInfo");
		this.Button_toUserInfo = setBtnCallBack(this.Panel_headInfo,'Button_toUserInfo',this.onClickOpenSubDlg);
		this.Image_headFrame = this.Panel_headInfo.getChildByName("Image_headFrame");
		var Image_head = this.Panel_headInfo.getChildByName("Image_head");
		g_objHero.loadUrlImage(function(imagePath){
            if (imagePath != undefined && imagePath.length > 0) {
                Image_head.loadTexture(imagePath, ccui.Widget.LOCAL_TEXTURE);
                Image_head.setContentSize(cc.size(76, 76));
            }
		});
		
		//增加金豆
		this.Panel_goldInfo = this.Panel_userInfo.getChildByName("Panel_goldInfo");
		this.Button_toGold = setBtnCallBack(this.Panel_goldInfo,'Button_toGold',this.onClickOpenSubDlg);
		//增加钻石
		this.Panel_diamondInfo = this.Panel_userInfo.getChildByName("Panel_diamondInfo");
		this.Button_toDiamond = setBtnCallBack(this.Panel_diamondInfo,'Button_toDiamond',this.onClickOpenSubDlg);
		//增加房卡
		this.Panel_roomCardInfo = this.Panel_userInfo.getChildByName("Panel_roomCardInfo");
		this.Button_toRoomCard = setBtnCallBack(this.Panel_roomCardInfo,'Button_toRoomCard',this.onClickOpenSubDlg);
		
		//排行榜
		this.Button_toRank = setBtnCallBack(this.Panel_root,'Button_toRank',this.onClickOpenSubDlg);
		//设置
		this.Button_toSet = setBtnCallBack(this.Panel_root,'Button_toSet',this.onClickOpenSubDlg);
		
		//userInfo
		this.Text_nickName = this.Panel_headInfo.getChildByName("Text_nickName");
		var Panel_headInfoSize = this.Panel_headInfo.getSize();
		var size=cc.size(Panel_headInfoSize.width,Panel_headInfoSize.height);
		this.Text_nickName.setTextAreaSize(size)
		this.Text_nickName.x = Panel_headInfoSize.width/1.2;
		
		this.Text_golds = this.Panel_goldInfo.getChildByName("Text_golds");
		var Panel_goldInfoSize = this.Panel_goldInfo.getSize();
		size=cc.size(Panel_goldInfoSize.width,Panel_goldInfoSize.height);
		this.Text_golds.setTextAreaSize(size);
		
		this.Text_diamonds = this.Panel_diamondInfo.getChildByName("Text_diamonds");
		var Panel_diamondInfoSize = this.Panel_diamondInfo.getSize();
		size=cc.size(Panel_diamondInfoSize.width,Panel_diamondInfoSize.height);
		this.Text_diamonds.setTextAreaSize(size);
		
		//房卡数
		this.Text_roomCards = this.Panel_roomCardInfo.getChildByName("Text_roomCards");
		var Panel_roomCardInfoSize = this.Panel_roomCardInfo.getSize();
		size=cc.size(Panel_roomCardInfoSize.width,Panel_roomCardInfoSize.height);
		this.Text_roomCards.setTextAreaSize(size);
		
		this.updateDlg();
	},

	setHeadFace: function(){
		var Image_head = this.Panel_headInfo.getChildByName("Image_head");
		var headsize = Image_head.getSize();
		g_objHero.loadUrlImage(function(savePath){
            if (savePath != undefined && savePath.length > 0) {
                Image_head.loadTexture(savePath, ccui.Widget.LOCAL_TEXTURE);
                Image_head.setContentSize(cc.size(headsize.width, headsize.height));
            }
		});	
		
	},	
	
//	stopRequestNewMail: function(){
//		this.BtnMail.stopAllActions();
//	},
//	requestNewMail: function(){
//		//请求邮件数量（每隔10秒请求一次）
//		var delay = cc.delayTime(10);
//		var seq = cc.sequence(
//				cc.callFunc(function(){
//					MailHttp.getInstance().requestMailNum();
//				},this),
//				cc.delayTime(10));
//		var actionMail = seq.repeatForever();
//		this.BtnMail.runAction(actionMail);
//	},
//	updateNewMailCount: function(){
//		var mail = ClientData.getInstance().getMail();
//		if(mail){
//			var newMailNum = mail.getNewMailNum();
//			if(newMailNum > 0){
//				this.ImgMailCountBg.setVisible(true);
//				var strNum = newMailNum + '';
//				if(newMailNum > 99){
//					strNum = '99';
//				}
//				this.LabMailCount.string = strNum;
//			}else{
//				this.ImgMailCountBg.setVisible(false);
//				this.LabMailCount.string = "0";
//			}
//		}
//		
//	},

	onClickOpenSubDlg: function(sender, type) {
		if (ccui.Widget.TOUCH_ENDED == type) {
			var strBtnName = sender.getName();
			cc.log('onClickOpenSubDlg ' + strBtnName);
			switch (strBtnName) {
////////////////////////////////////////////////////////////////////////////
//			//TEMP
//			case "BtnExchange":
//			ExAwardHttp.getInstance().requestExAwardList();
//			break;
////////////////////////////////////////////////////////////////////////////
			case "Button_openRoom":
				//开设房间
				UIMgr.getInstance().openDlg(ID_DlgOpenRoom);
				break;
			case "Button_enteroom":
				//加入房间
				UIMgr.getInstance().openDlg(ID_DlgEnterRoom);
				break;
////////////////////////////////////////////////////////////////////////////
			case "Button_fieldCaiNiao":
				//菜鸟场
				cc.log('onClickOpenSubDlg 菜鸟场');
				//提示界面
				DlgTip.openSysTip("金币场尚未开放，敬请期待!");
				break;
			case "Button_fieldPingMin":
				//平民场
				//提示界面
				DlgTip.openSysTip("金币场尚未开放，敬请期待!");
				break;
			case "Button_fieldTuHao":
				//土豪场
				//提示界面
				DlgTip.openSysTip("金币场尚未开放，敬请期待!");
				break;
////////////////////////////////////////////////////////////////////////////
			case "Button_gameMore":
				//更多游戏
				UIMgr.getInstance().openDlg(ID_DlgMoreGame);
				break;
////////////////////////////////////////////////////////////////////////////
			case "Button_toShop":
				//商城
				UIMgr.getInstance().openDlg(ID_DlgPlazaMall);
				break;
			case "Button_toMail":
				//邮件
				UIMgr.getInstance().openDlg(ID_DlgPlazaMail);
				break;
			case "Button_toSign":
				//签到
                console.log("点击签到");
                UIMgr.getInstance().openDlg(ID_DlgSignIn);
                PlazaUIMgr.getInstance().querySignInInfo();
				break;
			case "Button_toBag":
				//背包
				//提示界面
				DlgTip.openSysTip("功能尚未开放，敬请期待!");
				break;
			case "Button_toTask":
				//任务
				UIMgr.getInstance().openDlg(ID_DlgWelfare);
				break;
////////////////////////////////////////////////////////////////////////////
			case "Button_toRank":
				//排行榜
				//UIMgr.getInstance().openDlg(ID_DlgPlazaSet);
				break;
////////////////////////////////////////////////////////////////////////////
			case "Button_toSet":
				//设置
                UIMgr.getInstance().openDlg(ID_DlgPlazaSet);
				break;
			case "Button_toUserInfo":
				//个人中心
				UIMgr.getInstance().openDlg(ID_DlgPlazaUserInfo);
				PlazaUIMgr.getInstance().ongetPlayerInfo();
				
				break;
			case "Button_toGold":
				//增加金豆
				var dlgMall = UIMgr.getInstance().openDlg(ID_DlgPlazaMall);
				if(dlgMall)
					dlgMall.chooseGoodsType(1);
				break;
			case "Button_toDiamond":
				//增加钻石
				var dlgMall = UIMgr.getInstance().openDlg(ID_DlgPlazaMall);
				if(dlgMall)
					dlgMall.chooseGoodsType(0);
				break;
			case "Button_toRoomCard":
				//增加房卡
				var dlgMall = UIMgr.getInstance().openDlg(ID_DlgPlazaMall);
				if(dlgMall)
					dlgMall.chooseGoodsType(2);
				break;
			default:
				break;
			}
		}
	},
	
	updateDlg: function(){
		//玩家信息
		var faceId = g_objHero.getFaceId();
		var gender = g_objHero.getGender();
		var nickName = g_objHero.getNickName();
		var strNick = MyUtil.strCut(nickName, 10, true);
		var gameId = g_objHero.getGameId();
		var money = g_objHero.getMoney();
		var mDiamonds = g_objHero.getMbDiamond();
		var lRoomCards = g_objHero.getRoomCard();

		this.setHeadFace(faceId);
		this.Text_nickName.string = strNick;
		this.Text_golds.string = money;
		this.Text_diamonds.string = mDiamonds;
		if(lRoomCards!=undefined)
		this.Text_roomCards.string = lRoomCards;
	},
});

