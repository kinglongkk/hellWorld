/*
 *更多游戏界面
 * Author: 	YangJiazhen
 * Date:	2017.4.6
 *
 * 功能：
 *
 * */

DLG_CREATOR[ID_DlgMoreGame] = function() {
    return new DlgMoreGame();
};

var DlgMoreGame = DlgBase.extend({
    ctor: function() {

    },

    onCreate: function() {
        this.init();
    },

    onClose: function() {

    },

    init: function() {

        // 从文件载入
        var json = ccs.load(res.dlgMoreGameScene_json);
        this._rootWidget = json.node;

        //自适应屏幕大小
        var sizeDir = cc.director.getWinSize();
        this._rootWidget.setContentSize(sizeDir);
        ccui.helper.doLayout(this._rootWidget);

        var setBtnCallBack = function(btnParent, btnName, listener){
            if(btnParent == null){
                return null;
            }

            var btn = btnParent.getChildByName(btnName);
            if(btn == null){
                return null;
            }
            btn.setPressedActionEnabled(true);
            btn.addTouchEventListener(listener, this);

            return btn;
        }

        // 当前界面类型
        this.sceneType = 0;

        // 背景
        this.imgBg = this._rootWidget.getChildByName("Image_bg");
        this.imgShadow = [];
        for (var i = 0; i < 3; i++) {
            var name = "Image_bg_" + i;
            this.imgShadow[i] = this._rootWidget.getChildByName(name);
        }

        // 返回按钮
        this.btnBack = this._rootWidget.getChildByName("Button_back");
        this.btnBack.addTouchEventListener(function (sender, type) {
            if (ccui.Widget.TOUCH_ENDED == type) {
                if (this.sceneType == 0) {
                    UIMgr.getInstance().closeDlg(ID_DlgMoreGame, false);
                    var plaza = ClientData.getInstance().getPlaza();
                    if(plaza){
                    	var gameList = GameKindMgr.getInstance().getGameList();
                    	var defaultKindID = gameList[0].gameKindId;
                    	plaza.setCurKindID(defaultKindID);	//设置初始游戏ID 
                    	plaza.setCurGameType(GAME_GENRE_PERSONAL);	
                    }
                }
                else {
                    this.showMoreGameOrCreateRoomScene(this.sceneType - 1);
                }
            }
        }, this);

        // 文本框
        var goldBg = this._rootWidget.getChildByName("Image_gold");
        this.goldText = goldBg.getChildByName("Text_money");
        //增加豆豆
        this.Button_addGold = setBtnCallBack(goldBg, 'Button_addGold', this.onClickOpenSubDlg);

        var diaBg = this._rootWidget.getChildByName("Image_Diamonds");
        this.diamonds = diaBg.getChildByName("Text_money");
        //增加砖石
        this.Button_addDiamonds = setBtnCallBack(diaBg, 'Button_addDiamonds', this.onClickOpenSubDlg);

        var cardBg = this._rootWidget.getChildByName("Panel_roomCardInfo");
        this.roomCards = cardBg.getChildByName("Text_roomCard");
        //增加房卡
        this.Button_addRoomCard = setBtnCallBack(cardBg, 'Button_addRoomCard', this.onClickOpenSubDlg);

        if (this.goldText) this.goldText.setString(g_objHero.getMoney());
        if (this.diamonds) this.diamonds.setString(g_objHero.getMbDiamond());
        if (this.roomCards) this.roomCards.setString(g_objHero.getRoomCard());

        // 头像
        var headBg = this._rootWidget.getChildByName("Image_Title");
        this.imgHead = headBg.getChildByName("Image_3");
        this.imgHead.setTouchEnabled(true);
        this.imgHead.addTouchEventListener(function (sender, type) {
            if (ccui.Widget.TOUCH_ENDED == type) {
                UIMgr.getInstance().openDlg(ID_DlgPlazaUserInfo);
                PlazaUIMgr.getInstance().ongetPlayerInfo(g_objHero.getUserId());
            }
        });

        // 昵称
        this.TextNick = headBg.getChildByName("Text_gold");
        if (this.TextNick) this.TextNick.setString(g_objHero.getNickName());

        var imgHead = this.imgHead;
        g_objHero.loadUrlImage(function(imagePath){
            imgHead.loadTexture(imagePath, ccui.Widget.LOCAL_TEXTURE);
            imgHead.setContentSize(cc.size(76,76));
        });
        // var url = (g_objHero.getHeaderUrl() && g_objHero.getHeaderUrl().length > 0)? g_objHero.getHeaderUrl() : "http://a-ssl.duitang.com/uploads/item/201607/05/20160705130934_MLJzU.jpeg";
        //
        // zutils.ImageDownloader(url, "DlgMoreGame.imageDone");

        // 设置按钮
        this._rootWidget.getChildByName("Button_set").addTouchEventListener(function (sender, type) {
            if (ccui.Widget.TOUCH_ENDED == type) UIMgr.getInstance().openDlg(ID_DlgPlazaSet);
        }, this);

//        // 游戏按钮
//        // 四人牛牛
//        this.fourcow = this._rootWidget.getChildByName("Button_fourcow");
//        this.fourcow.addTouchEventListener(function (sender, type) {
//            if (ccui.Widget.TOUCH_ENDED == type) {
//                this.showMoreGameOrCreateRoomScene(1);
//                var plaza = ClientData.getInstance().getPlaza();
//                if (plaza) {
//                    plaza.setCurKindID(CMD_NIUNIU_TB.KIND_ID);
//                }
//            }
//        }, this);
//        // 红中麻将  暂时用作十三水测试
//        this.redMahjong = this._rootWidget.getChildByName("Button_redMahjong");
//        this.redMahjong.addTouchEventListener(function (sender, type) {
//            if (ccui.Widget.TOUCH_ENDED == type) {
//                //DlgTip.openSysTip("游戏暂未开放，敬请期待！");
//                //return;
//            	this.showMoreGameOrCreateRoomScene(1);
//            	var plaza = ClientData.getInstance().getPlaza();
//            	if (plaza) {
//            		plaza.setCurKindID(CMD_SSS.KIND_ID);
//            	}
//            }
//        }, this);
//        // 斗地主
//        this.land = this._rootWidget.getChildByName("Button_land");
//        this.land.addTouchEventListener(function (sender, type) {
//            if (ccui.Widget.TOUCH_ENDED == type) {
//                DlgTip.openSysTip("斗地主暂未开放，敬请期待！");
//                return;
//                this.showMoreGameOrCreateRoomScene(1);
//                var plaza = ClientData.getInstance().getPlaza();
//                if (plaza) {
//                    plaza.setCurKindID(CMD_DDZ.KIND_ID);
//                }
//            }
//        }, this);

        // 开设房间
        this.createroom = this._rootWidget.getChildByName("Button_create");
        this.createroom.addTouchEventListener(function (sender, type) {
            if (ccui.Widget.TOUCH_ENDED == type) {
                UIMgr.getInstance().openDlg(ID_DlgOpenRoom);
            }
        }, this);

        // 加入房间
        this.jointRoom = this._rootWidget.getChildByName("Button_join");
        this.jointRoom.addTouchEventListener(function (sender, type) {
            if (ccui.Widget.TOUCH_ENDED == type) {
                UIMgr.getInstance().openDlg(ID_DlgEnterRoom);
            }
        }, this);

        // 金币场
        this.moneyRoom = this._rootWidget.getChildByName("Button_money");
        this.moneyRoom.addTouchEventListener(function (sender, type) {
            if (ccui.Widget.TOUCH_ENDED == type) {
                DlgTip.openSysTip("金币场暂未开放，敬请期待！");
                return;
                PlazaUIMgr.getInstance().enterGame(CMD_NIUNIU_TB.KIND_ID);
            }
        }, this);

        // 游戏房间列表
        this.ListViewRoom = this._rootWidget.getChildByName("ListView_RoomList");
        // 游戏列表
        this.ListViewGame = this._rootWidget.getChildByName("ListView_GameList");
        this.Panel_gameTemp = this._rootWidget.getChildByName("Panel_gameTemp");
        this.showGameList();

        // 开始默认显示更多游戏界面
        //this.showMoreGameOrCreateRoomScene(0);
    },
    
    showGameInfo: function(){
    	var plaza = ClientData.getInstance().getPlaza();
    	var curKindID = plaza.getCurKindID();
    	cc.log("showGameInfo--curKindID--"+curKindID);
    	
    	var gameList = GameKindMgr.getInstance().getGameList();
    	for(var index=1; index<gameList.length; ++index){
    		var cfgInfo = gameList[index];
    		if(cfgInfo.gameKindId==curKindID){
    			this.sceneType = 1;
    			this.ListViewRoom.setVisible(false);
    			this.ListViewGame.setVisible(false);
    			this.imgBg.loadTexture(res.img_createroom_bg_jpg, ccui.Widget.LOCAL_TEXTURE);

    			this.jointRoom.loadTextureNormal(cfgInfo.addIcon, ccui.Widget.PLIST_TEXTURE);
    			this.createroom.loadTextureNormal(cfgInfo.openIcon, ccui.Widget.PLIST_TEXTURE);
    			this.moneyRoom.loadTextureNormal(cfgInfo.goldIcon, ccui.Widget.PLIST_TEXTURE);

    			this.jointRoom.setVisible(true);
    			this.createroom.setVisible(true);
    			this.moneyRoom.setVisible(true);
    			
    			break;
    		}
    	}
    },
    showGameList: function(){
    	this.sceneType = 0;
    	this.imgBg.loadTexture(res.img_moregame_bg_jpg, ccui.Widget.LOCAL_TEXTURE);
    	
    	this.jointRoom.setVisible(false);
    	this.createroom.setVisible(false);
    	this.moneyRoom.setVisible(false);
    	
    	if(!this.ListViewGame.isVisible()){
    		this.ListViewGame.setVisible(true);
    		return;
    	}
    	
    	var gameList = GameKindMgr.getInstance().getGameList();
    	for(var index=1; index<gameList.length; ++index){
    		var cfgInfo = gameList[index];
//    		if(cfgInfo.enable==0)
//    			continue;
    		
    		var gameTemp = this.Panel_gameTemp.clone();
    		gameTemp.setVisible(true);
    		var Button_game = gameTemp.getChildByName("Button_game");
    		Button_game.loadTextureNormal(cfgInfo.gameItemPic, ccui.Widget.PLIST_TEXTURE);
    		cc.log("cfgInfo.gameItemPic--"+cfgInfo.gameItemPic);
    		Button_game.setName("gameKind_"+cfgInfo.gameKindId);
    		Button_game.addTouchEventListener(function (sender, type) {
    			if (ccui.Widget.TOUCH_ENDED == type) {
    				var name = sender.getName();
    				var curKindID = Number(name.replace("gameKind_",""));
    				var gameList = GameKindMgr.getInstance().getGameList();
    				for(var index=1; index<gameList.length; ++index){
    					var cfgInfo = gameList[index];
    					if(cfgInfo.gameKindId==curKindID){
    						
    						if(cfgInfo.enable==0){
    							DlgTip.openSysTip("游戏暂未开放，敬请期待！");
    							break;
    						}
    						
    						var plaza = ClientData.getInstance().getPlaza();
    						if (plaza) {
    							plaza.setCurKindID(curKindID);
    						}

    						this.showGameInfo();

    						break;
    					}
    				}
    			}
    		}, this);
    		
    		this.ListViewGame.addChild(gameTemp);
    	}
    },

    onClickOpenSubDlg: function (sender, type) {
        if (ccui.Widget.TOUCH_ENDED == type) {
            var strBtnName = sender.getName();
            cc.log('onClickOpenSubDlg ' + strBtnName);
            switch (strBtnName) {
                case "Button_addGold":
                    //增加豆豆
                    var dlgMall = UIMgr.getInstance().openDlg(ID_DlgPlazaMall);
                    dlgMall.chooseGoodsType(1);
                    break;
                case "Button_addDiamonds":
                    //增加砖石
                    var dlgMall = UIMgr.getInstance().openDlg(ID_DlgPlazaMall);
                    dlgMall.chooseGoodsType(0);
                    break;
                case "Button_addRoomCard":
                    //增加房卡
                    var dlgMall = UIMgr.getInstance().openDlg(ID_DlgPlazaMall);
                    dlgMall.chooseGoodsType(2);
                    break;
                default:
                    break;
            }
        }
    },

    showMoreGameOrCreateRoomScene: function (nType) {
    	this.sceneType = nType;
    	
    	switch(nType){
    	case 0:
    		this.showGameList();
    		break;
    	case 1:
    		this.showGameInfo();
    		break;
    	default:
    			break;
    	}
        
//        // 换背景
//        var imagePath = nType == 1? "more/img_createroom_bg.jpg" : "more/img_moregame_bg.jpg";
//        cc.log(imagePath);
//        this.imgBg.loadTexture(imagePath, ccui.Widget.LOCAL_TEXTURE);
//        // 三个阴影
//        for (var i = 0; i < 3; i++) {
//            this.imgShadow[i].setVisible(nType == 0);
//        }
//        // 功能按钮
//        this.jointRoom.setVisible(nType == 1);
//        this.createroom.setVisible(nType == 1);
//        this.moneyRoom.setVisible(nType == 1);
//
//        // 游戏列表
//        this.ListViewRoom.setVisible(nType == 2);
    },

    // 打开房间列表
    openRoomList: function (kindID) {
        cc.log("打开房间列表"+kindID);
        this.showMoreGameOrCreateRoomScene(2);
        cc.log("open room list, kindID = " + kindID);

        var room = ClientData.getInstance().getRoom();
        room.reset();

        var table = ClientData.getInstance().getTable();
        table.reset();

        var match = ClientData.getInstance().getMatch();
        match.reset();

        this.ListViewRoom.removeAllItems();

        var plaza = ClientData.getInstance().getPlaza();
        var listServer = plaza.getListServerByKindID(kindID);
        var serverCount = listServer.length;

        var sizeDir = this.ListViewRoom.getContentSize();
        for (var i = 0; i < serverCount; i++) {
            var roomInfo = listServer[i];

            var roomWidget = new ccui.ImageView();
            roomWidget.loadTexture(this.getRoomImg(roomInfo.szServerName), ccui.Widget.PLIST_TEXTURE);
            roomWidget.setTag(i);
            roomWidget.setTouchEnabled(true);
            roomWidget.addTouchEventListener(function (sender, type) {
                if (ccui.Widget.TOUCH_ENDED == type) {
                    var tag = sender.getTag();
                    cc.log("onClickEnterRoom tag = " + tag);

                    var plaza = ClientData.getInstance().getPlaza();
                    var kindId = plaza.getCurKindID();
                    var listServer = plaza.getListServerByKindID(kindId);
                    var roomServerInfo = listServer[tag];

                    var money = g_objHero.getMoney();
                    if(money < roomServerInfo.lMinTableScore){
                        var strTip = "加入游戏至少需要 ";
                        strTip += roomServerInfo.lMinTableScore;
                        strTip += " 的欢乐豆，您的欢乐豆不够，不能加入！";
                        DlgTip.openSysTip(strTip);
                        return;
                    }

                    var room = ClientData.getInstance().getRoom();
                    if(room){
                        room.setCurServer(roomServerInfo);
                    }

                    var ip = roomServerInfo.szServerAddr;
                    var port = roomServerInfo.wServerPort;

                    PlazaUIMgr.getInstance().connectGameServer(ip, port);
                }
            }, this);
            this.ListViewRoom.pushBackCustomItem(roomWidget);

            var offsetY = 0;
            // 添加房间拥挤程度
            var imgLoad = new ccui.ImageView();
            imgLoad.loadTexture(this.getRoomLoad(roomInfo.dwOnLineCount, roomInfo.dwFullCount), ccui.Widget.PLIST_TEXTURE);
            imgLoad.setAnchorPoint(cc.p(0.5, 0));
            imgLoad.x = roomWidget.getContentSize().width / 2;
            imgLoad.y = offsetY;
            roomWidget.addChild(imgLoad);

            offsetY += imgLoad.getContentSize().height;

            // 底分
            var imgScore = new ccui.ImageView(this.getRoomMinScore(roomInfo.szServerName), ccui.Widget.PLIST_TEXTURE);
            imgScore.setAnchorPoint(cc.p(0.5, 0));
            imgScore.x = roomWidget.getContentSize().width / 2;
            imgScore.y = offsetY;
            roomWidget.addChild(imgScore);
        }
    },

    // 获取房间图片
    getRoomImg: function (roomName) {
        cc.log("房间名："+roomName);
        switch (roomName) {
            case "初级房":
                return "more/btn_newhand.png";
            case "高级房":
                return "more/btn_ace.png";
            case "民工房":
                return "more/btn_Civilian.png";
            case "中级房":
                return "more/btn_oldhand.png";
            default:
                return "more/btn_newhand.png";
        }
    },

    // 获取拥挤程度
    getRoomLoad: function(onLineCount, fullCount){

        if(fullCount == 0){
            fullCount = 2;
        }

        var percent = (onLineCount * 100) / fullCount;
        if(percent > 40){
            percent = Math.floor( Math.random() * 60 ) + 40;
        }

        if(percent > 80){
            return "more/img_full.png";
        }
        else if(percent > 40){
            return "more/img_crowded.png";
        }
        else if(percent > 20){
            return "more/img_smooth.png";
        }
        else{
            return "more/img_free.png";
        }
    },

    // 获取房间底分
    getRoomMinScore: function (roomName) {
        cc.log("房间名："+roomName);
        switch (roomName) {
            case "初级房":
                return "more/img_MinEnterScore_100.png";
            case "中级房":
                return "more/img_MinEnterScore_800.png";
            case "民工房":
                return "more/img_MinEnterScore_300.png";
            case "高级房":
                return "more/img_MinEnterScore_2000.png";
            default:
                return "more/img_MinEnterScore_100.png";
        }
    },

    // 载入图片
    getImageURL: function (imagePath) {
        cc.log("图片地址="+imagePath);
        this.imgHead.loadTexture(imagePath, ccui.Widget.LOCAL_TEXTURE);
    },
});

DlgMoreGame.imageDone = function (path) {
    var dlgMore = UIMgr.getInstance().getDlg(ID_DlgMoreGame);
    if (dlgMore) {
        dlgMore.getImageURL(path);
    }
}
