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
        var musicVolume = LocalStorageMgr.getInstance().getMusicVolumeItem();
        var soundVolume = LocalStorageMgr.getInstance().getSoundVolumeItem();
        SoundMgr.getInstance().setMusicVolume(musicVolume / 100.0);
        SoundMgr.getInstance().setEffectsVolume(soundVolume / 100.0);

		var json = ccs.load(res.dlgPlazaScene_json);
		this._rootWidget = json.node;

		//自适应屏幕大小
		var sizeDir = cc.director.getWinSize();
		//this._rootWidget.setContentSize(sizeDir);
		//ccui.helper.doLayout(this._rootWidget);
		
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

		//Text_version
		var Text_version = this.Panel_root.getChildByName("Text_version");
        Text_version.string = "MD"+_CONFIG_.CLIENT_VERSION;

		//加入房间
		this.Button_enteroom = setBtnCallBack(this.Panel_room,'Button_enteroom',this.onClickOpenSubDlg);
        //this.Button_enteroom.setPosition(cc.p(770,272+24));
		//创建房间
		this.Button_openRoom = setBtnCallBack(this.Panel_room,'Button_openRoom',this.onClickOpenSubDlg);
        //this.Button_openRoom.setPosition(cc.p(884,545+24));
		
		// this.Node_animationCreate = this.Button_openRoom.getChildByName("Node_animationCreate");
		// this.Node_animationAdd = this.Button_enteroom.getChildByName("Node_animationAdd");

		//游戏列表
        this.Panel_gameList = this.Panel_root.getChildByName("Panel_gameList");
        var Button_toGameList = this.Panel_gameList.getChildByName("Button_toGameList");
        var curPos = Button_toGameList.getPosition();
        Button_toGameList.runAction(cc.sequence( cc.moveTo(0.8,cc.p(curPos.x-15, curPos.y)), cc.moveTo(0.8,curPos)).repeatForever());
        Button_toGameList.addTouchEventListener(this.onClickOpenSubDlg, this);

        //玩家信息
		this.Panel_userInfo = this.Panel_root.getChildByName("Panel_userInfo");
        this.Image_head = this.Panel_userInfo.getChildByName("Panel_headInfo").getChildByName("Image_head");
        this.Text_nickName = this.Panel_userInfo.getChildByName("Panel_headInfo").getChildByName("Text_nickName");
        this.Text_diamonds = this.Panel_userInfo.getChildByName("Panel_diamondInfo").getChildByName("Text_diamonds");
        var Button_toDiamond = this.Panel_userInfo.getChildByName("Panel_diamondInfo").getChildByName("Button_toDiamond");
        var Image_headFrame = this.Panel_userInfo.getChildByName("Panel_headInfo").getChildByName("Image_headFrame");
        Image_headFrame.addTouchEventListener(this.onClickOpenSubDlg, this);
        Button_toDiamond.addTouchEventListener(this.onClickOpenSubDlg, this);

		//设置默认游戏图标
        var Image_boy = this.Panel_root.getChildByName("Image_bg").getChildByName("Image_boy");
        var gameList = GameKindMgr.getInstance().getGameList();
        Image_boy.loadTexture(gameList[0].plazaBgPic, ccui.Widget.PLIST_TEXTURE);
        Image_boy.setVisible(false);

        cc.log("++++++++++++设置默认游戏图标++++++++++++++++++");
        var spineBoy = new sp.SkeletonAnimation("res/plaza/default/toufap.json", "res/plaza/default/toufap_tex.atlas");
        spineBoy.setPosition(cc.p(sizeDir.width / 2, sizeDir.height / 2));
        var animationName = "toufdong1";
        spineBoy.setAnimation(0, animationName, true);
        this.Panel_root.getChildByName("Image_bg").addChild(spineBoy);

        var Button_quickStart = setBtnCallBack(this.Panel_root,'Button_quickStart',this.onClickOpenSubDlg);
        var Image_curGameIcon = Button_quickStart.getChildByName("Image_curGameIcon")
        Image_curGameIcon.loadTexture(gameList[0].quickAddIcon, ccui.Widget.PLIST_TEXTURE);

        //设置
		setBtnCallBack(this.Panel_root,'Button_toSet',this.onClickOpenSubDlg);
        //分享
        setBtnCallBack(this.Panel_root,'Button_toShare',this.onClickOpenSubDlg);
        //福利社
        setBtnCallBack(this.Panel_root,'Button_toWelfare',this.onClickOpenSubDlg);

        this.setGameList();
		this.updateDlg();
		
		this.doEffect();
		
		cc.log(cc.textureCache.getCachedTextureInfo());
	},
	
	doEffect:function(){
		var size = this.Button_openRoom.getContentSize();
		var json = ccs.load(res.effectCreateRoom_json);
		var wedgit = json.node;
        wedgit.runAction(json.action);
        wedgit.setScale(2.0);
        var tnSize = this.Button_openRoom.getContentSize();
        wedgit.setPosition(cc.p(tnSize.width/2.0, tnSize.height/2.0));
		json.action.gotoFrameAndPlay(0, 102, true);
        this.Button_openRoom.addChild(wedgit);

        var self = this;
        var seq = cc.Sequence([
            cc.delayTime(1),
            cc.CallFunc(function(){
                var json2 = ccs.load(res.effectAddRoom_json);
                var wedgit2 = json2.node;
                wedgit2.setScale(2.0);
                wedgit2.runAction(json2.action);
                var btnSize = self.Button_enteroom.getContentSize();
                wedgit2.setPosition(cc.p(btnSize.width/2.0, btnSize.height/2.0));
                json2.action.gotoFrameAndPlay(0, 102, true);
                self.Button_enteroom.addChild(wedgit2);
            }, this)
        ]);

        self.Button_enteroom.runAction(seq);

	},

	setGameList: function(){
		//
        var Button_gameTemp = this.Panel_gameList.getChildByName("Button_gameTemp");
        var ListView_gameList = this.Panel_gameList.getChildByName("ListView_gameList");
        ListView_gameList.addEventListener(this.onGameListViewEvent, this);
        ccui.ScrollView.prototype.addEventListener.call(ListView_gameList, this.onListViewEvent, this);

		//获取游戏列表配置
        var gameList = GameKindMgr.getInstance().getGameList();
        this.gameEnableCounts = 1;
        for(var index=1; index<gameList.length; ++index){
        	var cfgInfo = gameList[index];
        	if(cfgInfo.enable==0)
        		continue;

            this.gameEnableCounts++;
        	var item = Button_gameTemp.clone();
            item.loadTextureNormal(cfgInfo.gameItemIcon, ccui.Widget.PLIST_TEXTURE);
            item.setName(String(cfgInfo.gameKindId));
            item.setVisible(true);
            ListView_gameList.addChild(item);
		}

        var Image_pullDownTip = this.Panel_gameList.getChildByName("Image_pullDownTip");
        Image_pullDownTip.setVisible(this.gameEnableCounts>4);
	},

	setHeadFace: function(){
		var headsize = this.Image_head.getSize();
		var self = this;
		g_objHero.loadUrlImage(function(savePath){
            self.Image_head.loadTexture(savePath, ccui.Widget.LOCAL_TEXTURE);
            self.Image_head.setContentSize(cc.size(headsize.width,headsize.height));
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
    onGameListViewEvent: function(sender, type) {
		if(type==ccui.ListView.ON_SELECTED_ITEM_END){
			var selectedItem = sender.getItem(sender.getCurSelectedIndex());
            cc.log("onGameListViewEvent--selectedItem.getName()--"+selectedItem.getName());
			var kindID = Number(selectedItem.getName());
			cc.log("onGameListViewEvent--kindID--"+kindID);
			//设置
            var plaza = ClientData.getInstance().getPlaza();
            plaza.setCurKindID(kindID);

			//打开创建房间界面
            UIMgr.getInstance().openDlg(ID_DlgOpenRoom);
		}
	},
    onListViewEvent: function(sender, type){
        switch (type) {
            case ccui.ScrollView.EVENT_SCROLL_TO_BOTTOM://滑动到底部
                cc.log("SCROLL_TO_BOTTOM");

				var Image_pullDownTip = this.Panel_gameList.getChildByName("Image_pullDownTip");
                Image_pullDownTip.setVisible(false);
                break;
            default:
                var Image_pullDownTip = this.Panel_gameList.getChildByName("Image_pullDownTip");
                Image_pullDownTip.setVisible(this.gameEnableCounts>4);
                break;
        }
    },

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
			case "Button_quickStart":
                 //快速加入房间
                 PlazaUIMgr.getInstance().onQuickEnter();
                 break;
			case "Button_toGameList":{
                var curPanelPos = this.Panel_gameList.getPosition();
                if(curPanelPos.x>1334){
                    var seq = cc.sequence(
                        cc.moveTo(0.2,cc.p(1334, curPanelPos.y)),
                        cc.CallFunc(function(){
                        	sender.stopAllActions();
                            sender.setFlippedX(true);
                            sender.setPositionX(52);
                            var curPos = sender.getPosition();
                            sender.runAction(cc.sequence( cc.moveTo(0.8,cc.p(curPos.x+15, curPos.y)), cc.moveTo(0.8,curPos)).repeatForever());
                        }, this)
                    );
					this.Panel_gameList.runAction(seq);
				}
				else{
                    var seq = cc.sequence(
                        cc.moveTo(0.2,cc.p(1574, curPanelPos.y)),
                        cc.CallFunc(function(){
                        	sender.stopAllActions();
                            sender.setFlippedX(false);
                            sender.setPositionX(52);
                            var curPos = sender.getPosition();
                            sender.runAction(cc.sequence( cc.moveTo(0.8,cc.p(curPos.x-15, curPos.y)), cc.moveTo(0.8,curPos)).repeatForever());
                        }, this)
                    );
                    this.Panel_gameList.runAction(seq);
				}

				break;
			}
			case "Image_headFrame":{
                //个人中心
                //UIMgr.getInstance().openDlg(ID_DlgPlazaUserInfo);
				UIMgr.getInstance().openDlg(ID_DlgUserInfo);
                PlazaUIMgr.getInstance().ongetPlayerInfo();
                
				break;
			}
			case "Button_toWelfare":
				//福利社
				cc.log("--------Button_toWelfare-----------");
				UIMgr.getInstance().openDlg(ID_DlgGameWelfare);
				break;
			case "Button_toSet":
                //设置
				cc.log("--------Button_toSet-----------");
                UIMgr.getInstance().openDlg(ID_DlgGameSet);
                break;
			case "Button_toShare":
				//分享
                var dlgGameShare = UIMgr.getInstance().openDlg(ID_DlgGameShare);
                dlgGameShare.shareSet(WXShare.SHARE_TYPE_NOMAL, function(){
                        LocalStorageMgr.getInstance().setShareEveryDay();
                        LocalStorageMgr.getInstance().setShareFirst(true);
				},
				"革新力作，麻将至上体验", "正宗玩法，漳浦地道配音，精致画面，唯一的遗憾就是：我为什么没有早点下载这游戏！？！");
//				var newUI = UIMgr.getInstance().openDlg(ID_DlgGameRecordCenter);
//
//				var recordInfo = {
//						"DetailScore":[
//						               [121,515,4545,777],
//						               [121,515,4545,777],
//						               [121,515,4545,777],
//						               [121,515,4545,777]
//						               ],
//						"AllScore":[121,515,4545,777]
//				};
//
//				newUI.setInit(recordInfo, function(){
//					UIMgr.getInstance().closeDlg(ID_DlgGameRecordCenter);
//				}, function(){
//					UIMgr.getInstance().closeDlg(ID_DlgGameRecordCenter);
//				});
				
                 break;
            case "Button_toDiamond":
                //DlgTip.openSysTip("...功能未开放...");
                //增加钻石
                var dlgGameShop = UIMgr.getInstance().openDlg(ID_DlgGameShop);
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
		//var strNick = MyUtil.strCut(nickName, 12, true); // 中文只显示4个字
		var strNick = nickName;
		// 策划说超过12个字符就要显示成 10个字符加 ...
		if(strNick.replace(/[\u4e00-\u9fa5]/g,"zz").length > 12){
			strNick = strNick.substring(0, 6) + "...";
		};
		var mDiamonds = g_objHero.getMbDiamond();
		this.setHeadFace(faceId);
		this.Text_nickName.string = strNick;
		this.Text_diamonds.string = mDiamonds;
	},
});

