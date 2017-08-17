/*
 *创建房间界面
 * Author: 	xjn 
 * Date:	2017.4.1
 * 
 * 功能：
 * 创建房间界面控件交互
 * */
DLG_CREATOR[ID_DlgOpenRoom] = function() {
	return new DlgOpenRoom();
};

var DlgOpenRoom = DlgBase.extend({
	ctor: function(){
		this.roundsSelected = null;
		this.baseScoreSelected = null;
		this.settlementSelected = null;
		this.baseScoreInput = 0;
	},

	onCreate: function() {
		this.init();
	},

	onClose: function() {
	},
	
	initCreate: function() {
		var plaza = ClientData.getInstance().getPlaza();
		var curKindID = plaza.getCurKindID();
        cc.log("initCreate--curKindID--"+curKindID);
		//cfgCheckBox selected
		this.cfgCBSelected = {};
		
		//loadCfg
		var createRoomCfg = LoadCreateRoomCfg.getInstance().getCreateRoomCfg(curKindID);
		if(createRoomCfg==null || createRoomCfg==undefined){
            var gameList = GameKindMgr.getInstance().getGameList();
            var defaultKindID = gameList[0].gameKindId;
            if(plaza.getCurKindID()!=defaultKindID)
                plaza.setCurKindID(defaultKindID);

            DlgTip.openSysTip("房间配置加载失败...", function(){
                UIMgr.getInstance().closeDlg(ID_DlgOpenRoom, false);
                this.closeTip();
			});

            return;
		}
		
		//set GameIcon
		var Image_gameIcon = this.Panel_bg.getChildByName("Image_gameIcon");
		var Image_gameNameIcon = Image_gameIcon.getChildByName("Image_gameNameIcon");
		Image_gameIcon.loadTexture(createRoomCfg.gameIcon, ccui.Widget.PLIST_TEXTURE);
		if(createRoomCfg.gameNameIcon!=""){
			Image_gameNameIcon.loadTexture(createRoomCfg.gameNameIcon, ccui.Widget.PLIST_TEXTURE);
			Image_gameNameIcon.setVisible(true);
		}
		else{
			Image_gameNameIcon.setVisible(false);
		}

        //房间名
        var Panel_roomInfo = this.Panel_setInfo.getChildByName("Panel_roomInfo");
        this.TextField_roomName = Panel_roomInfo.getChildByName("TextField_roomName");
        
        //公开房间
        var checkBox = Panel_roomInfo.getChildByName("CheckBox_public");
        this.cfgCBSelected.CheckBox_public = checkBox;
        this.cfgCBSelected.CheckBox_public.addEventListener(this.onSingleCheckBoxEvent, this);

        var Button_tip = checkBox.getChildByName("Button_tip");
        var Image_tipBg = checkBox.getChildByName("Image_tipBg");
        Button_tip.addTouchEventListener(function(sender, type) {
            	if (ccui.Widget.TOUCH_ENDED == type) {
                    Image_tipBg.setVisible(!Image_tipBg.isVisible());
				}
            }, this);
        
        //全付，AA
        checkBox = Panel_roomInfo.getChildByName("CheckBox_payTotal");
        checkBox.addEventListener(this.onCheckBoxEvent, this);
        this.cfgCBSelected.payType = checkBox;
        checkBox.setTouchEnabled(false);
        checkBox.setSelected(true);
        
        checkBox = Panel_roomInfo.getChildByName("CheckBox_payAA");
        checkBox.setTouchEnabled(true);
        checkBox.setSelected(false);
        checkBox.addEventListener(this.onCheckBoxEvent, this);
		
		//load Layer_createRoom json
		// var json = ccs.load(res.layer_createRoom_json);
        // this.layerCreateRoom = json.node.getChildByName("Panel_"+curKindID);
        // this.layerCreateRoom.removeFromParent();
        // this.layerCreateRoom.setPosition(cc.p(0,0));

        if(createRoomCfg==null || createRoomCfg==undefined){
            var gameList = GameKindMgr.getInstance().getGameList();
            var defaultKindID = gameList[0].gameKindId;
            if(plaza.getCurKindID()!=defaultKindID)
                plaza.setCurKindID(defaultKindID);

            DlgTip.openSysTip("房间配置加载失败...", function(){
                UIMgr.getInstance().closeDlg(ID_DlgOpenRoom, false);
                this.closeTip();
            });

            return;
        }

		//add layerCreateRoom to rootPanel
		var Node_roomCfg = this.Panel_setInfo.getChildByName("Node_roomCfg");
        var json = ccs.load("res/plaza/Node_roomCfg_"+curKindID+".json");
        this.layerCreateRoom = json.node.getChildByName("Panel_root");
        Node_roomCfg.removeAllChildren();
        Node_roomCfg.addChild(json.node);

		for(var index in createRoomCfg){
			if(index=="zhuaHua"){
                var objCfg = createRoomCfg[index];
				//抓花
                var parentPanel = this.layerCreateRoom.getChildByName("Panel_zhuaHua");
				var Text_flowers = parentPanel.getChildByName("Text_flowers");
                Text_flowers.string = 0;
                this.cfgCBSelected[index] = Text_flowers;

                //--
                var btn = parentPanel.getChildByName("Button_reduce");
                btn.addTouchEventListener(function(sender, type) {
                    if (ccui.Widget.TOUCH_ENDED == type) {
                        var flowers = Number(Text_flowers.string);
                        cc.log(flowers+"flowers---Button_reduce-----"+objCfg.min);
                        if(flowers>objCfg.min)
                            Text_flowers.string = flowers-1;
                    }
                }, this);
                //++
                btn = parentPanel.getChildByName("Button_add");
                btn.addTouchEventListener(function(sender, type) {
                    if (ccui.Widget.TOUCH_ENDED == type) {
                        var flowers = Number(Text_flowers.string);
                        cc.log(flowers+"flowers---Button_add-----"+objCfg.max);
                        if(flowers<objCfg.max)
                            Text_flowers.string = flowers+1;
                    }
                }, this);
			}
			else if(index!="gameIcon" && index!="gameNameIcon"){
                cc.log("index-----"+index);
				//正常配置
				var parentPanel = this.layerCreateRoom.getChildByName("Panel_"+index);
				var arrCfg = createRoomCfg[index];
				if(arrCfg.length==1){
                    this.cfgCBSelected[index] = parentPanel.getChildByName("0");
                    this.cfgCBSelected[index].addEventListener(this.onSingleCheckBoxEvent, this);
				}
				else{
                    for(var arrIndex=0; arrIndex<arrCfg.length; ++arrIndex){
                        var checkBox = parentPanel.getChildByName(arrIndex);
                        checkBox.addEventListener(this.onCheckBoxEvent, this);
                        checkBox.setTouchEnabled(true);
                        checkBox.setSelected(false);
                    }
                    var checkBox = parentPanel.getChildByName("0");
                    checkBox.setTouchEnabled(false);
                    checkBox.setSelected(true);
                    this.cfgCBSelected[index] = checkBox;
				}
                if(index=="rounds"){
                    for(var count=0; count<arrCfg.length; ++count){
                        var Text_rounds = parentPanel.getChildByName(count).getChildByName("Text_rounds");
                        Text_rounds.string = arrCfg[count] + "局";
                    }
                }
			}
		}

		//

        this.setDiamond(1);
	},

	//设置钻石
	setDiamond: function(payType){
        var plaza = ClientData.getInstance().getPlaza();
        var curKindID = plaza.getCurKindID();
		var panel_Rounds = this.cfgCBSelected["rounds"].getParent();
		var childList = panel_Rounds.getChildren();
		var payInfo = LoadCreateRoomCfg.getInstance().getPayCfg(curKindID,payType);
        for(var arrIndex=0; arrIndex<childList.length; ++arrIndex){
            var checkBox = panel_Rounds.getChildByName(arrIndex);
            if(checkBox){
            	var Text_diamonds = checkBox.getChildByName("Text_diamonds");
                Text_diamonds.string = "×"+payInfo[arrIndex];
			}
        }
	},

	init: function() {
		var json = ccs.load(res.dlgCreateRoomScene_json);
		this._rootWidget = json.node;

		// 自适应屏幕大小
		var sizeDir = cc.director.getWinSize();
		this._rootWidget.setContentSize(sizeDir);
		ccui.helper.doLayout(this._rootWidget);
		
		this.Panel_root = this._rootWidget.getChildByName("Panel_root");
		var btnCtrl = this.Panel_root.getChildByName("Button_close");
        btnCtrl.addTouchEventListener(this.onClickEvent, this);
        btnCtrl = this.Panel_root.getChildByName("Button_roomList");
        btnCtrl.addTouchEventListener(this.onClickEvent, this);
        btnCtrl = this.Panel_root.getChildByName("Button_record");
        btnCtrl.addTouchEventListener(this.onClickEvent, this);
        btnCtrl = this.Panel_root.getChildByName("Button_create");
        btnCtrl.addTouchEventListener(this.onClickEvent, this);
        btnCtrl = this.Panel_root.getChildByName("Button_quickAdd");
        btnCtrl.addTouchEventListener(this.onClickEvent, this);
		
		//初始化创建界面
		this.Panel_setInfo = this.Panel_root.getChildByName("Panel_setInfo");
		this.Panel_bg = this.Panel_root.getChildByName("Panel_bg");
		this.initCreate();
	},

	doCreateRoom: function(){
        //获取KINDID
        var plaza = ClientData.getInstance().getPlaza();
        var curKindID = plaza.getCurKindID();
		var createTable = {
            "DrawCountLimit":0,
            "Password":"",
            "Kind":curKindID,
            "ServerId":1,
            "PayType":1,
            "Public":false,
            "RoomName":"",
            "OtherInfo":{}
        };

		//获取房间名称
        createTable.RoomName = this.TextField_roomName.string;

        // //检测房间名称
        // if(createTable.RoomName==""){
        //     DlgTip.openSysTip("---请输入房间名称---");
        //     return;
        // }
		//是否公开
        createTable.Public = this.cfgCBSelected.CheckBox_public.isSelected();
        //createTable.Public = true  //测试用
        //支付类型
        if(this.cfgCBSelected.payType.name=="CheckBox_payAA"){
        	createTable.PayType = 2;
        }
        
		//otherConfig
        var createRoomCfg = LoadCreateRoomCfg.getInstance().getCreateRoomCfg(curKindID);
        for(var index in createRoomCfg){
            if(index=="zhuaHua"){
                createTable.OtherInfo[index] = Number(this.cfgCBSelected[index].string);
            }
            else if(index!="gameIcon" && index!="gameNameIcon"){
            	var arrCfg = createRoomCfg[index];
            	if(index=="rounds"){
            		//局数限制
            		var selectedIndex = Number(this.cfgCBSelected[index].name);
            		cc.log("selectedIndex----"+selectedIndex);
            		createTable.DrawCountLimit = arrCfg[selectedIndex];
            	}
            	else{
            		if(arrCfg.length==1){
            			createTable.OtherInfo[index] = this.cfgCBSelected[index].isSelected();
            		}
            		else{
            			createTable.OtherInfo[index] = Number(this.cfgCBSelected[index].name);
            		}
            	}
            }
        }
        cc.log("createTable = " + JSON.stringify(createTable));
        if(curKindID == 392){
            createTable.OtherInfo.chaHua = false;
            createTable.OtherInfo.zhuaHua = 0;
            createTable.Kind = 391;
            plaza.setCurKindID(391);
        }
        //send createRoom
		//if(curKindID == 392) return;//392暂定为云霄麻将的kindID,没有云霄麻将服务端先return掉

        PlazaUIMgr.getInstance().onOpenRoom(createTable);
	},

	onClickEvent: function(sender, type) {
		if (ccui.Widget.TOUCH_ENDED == type) {
			var strBtnName = sender.getName();
			cc.log('onClickEvent ' + strBtnName);
			switch (strBtnName) {
			case "Button_close":
                var plaza = ClientData.getInstance().getPlaza();
                if(plaza){
                    var gameList = GameKindMgr.getInstance().getGameList();
                    var defaultKindID = gameList[0].gameKindId;
                    if(plaza.getCurKindID()!=defaultKindID)
                    	plaza.setCurKindID(defaultKindID);
                }

				UIMgr.getInstance().closeDlg(ID_DlgOpenRoom, false);
				break;
			case "Button_roomList":
				//打开加入房间界面
                UIMgr.getInstance().openDlg(ID_DlgEnterRoom);
				break;
			case "Button_record":
				//打开已开房间记录
                UIMgr.getInstance().openDlg(ID_DlgRoomRecord);
				break;
			case "Button_create":
				this.doCreateRoom();
				break;
			case "Button_quickAdd":
                PlazaUIMgr.getInstance().onQuickEnter();
				break;
			// case "Panel_tip":
			// 	if(g_gameSocket.status != SOCKET_STATUS._SS_INVALID){
			// 		g_gameSocket.close();
		    	// 	cc.log("--------g_gameSocket.close()---------");
			// 	}
			// 	sender.setVisible(false);
			// 	break;
			// case "Button_add":
			// 	LoginRegisterMsg.getInstance().sendLog(1);
			// 	PlazaUIMgr.getInstance().onEnterRoom(g_objHero.getRoomID());
			// 	break;
			// case "Button_ok":
			// 	// 准备发送数据
			// 	// 局数
			// 	var Text_rounds = this.roundsSelected.getChildByName("Text_rounds");
			// 	var iRounds = Text_rounds.tag;
			// 	var Text_cards = Text_rounds.getChildByName("Text_cards");
			// 	var iCards = Text_cards.tag;
			// 	// 底分
			// 	var iBaseScore = 1;
			// 	if(this.baseScoreSelected.name!="CheckBox_baseScore_input"){
			// 		var strBaseScoreName = this.baseScoreSelected.name;
			// 		iBaseScore = Number(strBaseScoreName.substring(strBaseScoreName.lastIndexOf("_")+1,strBaseScoreName.length));
			// 	}
			// 	else{
			// 		iBaseScore = this.baseScoreInput;
			// 	}
			// 	if(iBaseScore==0){
			// 		DlgTip.openSysTip("请输入 底分 ！");
			// 		return;
			// 	}
             //    if(iBaseScore > 10){
             //        DlgTip.openSysTip("底分不能超过10 ！");
             //        return;
             //    }
			//
			// 	// 结算方式
			// 	var strSettleName = this.settlementSelected.name;
			// 	var SettleType = Number(strSettleName.substring(strSettleName.lastIndexOf("_")+1,strSettleName.length));
            //
			// 	cc.log("发送 开房 局数 "+iRounds+" 底分 "+iBaseScore+" 结算方式 "+SettleType+"--iCards-"+iCards);
			// 	// 发送 开房
			// 	var data = {
			// 			dwRounds: iRounds,	// 局数
			// 			dwBaseScore: iBaseScore,	// 底分
			// 			settlementType: SettleType,// 结算方式
			// 			roomCards: iCards,//房卡数
			// 		    Public:true,
			// 	};
			//
			// 	PlazaUIMgr.getInstance().onOpenRoom(data);
			// 	break;
			default:
				break;
			}
		}
	},
    onSingleCheckBoxEvent: function(sender, type){
        if (ccui.CheckBox.EVENT_SELECTED == type) {
            sender.loadTextureBackGround("default/dating0024a.png",ccui.Widget.PLIST_TEXTURE);
        }
        else if (ccui.CheckBox.EVENT_UNSELECTED == type){
            sender.loadTextureBackGround("default/dating0024.png",ccui.Widget.PLIST_TEXTURE);
        }
    },
	onCheckBoxEvent: function(sender, type){
		if (ccui.CheckBox.EVENT_SELECTED == type) {
			var nodeName = sender.name;
			cc.log("onCheckBoxEvent---"+nodeName);
			if(-1!=nodeName.search("CheckBox_pay")){
				//支付方式
                this.cfgCBSelected.payType.setTouchEnabled(true);
                this.cfgCBSelected.payType.setSelected(false);

                sender.setTouchEnabled(false);

                if(sender.name=="CheckBox_payAA"){
                    this.setDiamond(2);
                }
                else{
                    this.setDiamond(1);
				}


                this.cfgCBSelected.payType = sender;
			}
			else{
				var parent = sender.getParent();
                var parentName = parent.name;
                parentName = parentName.replace("Panel_","");
                cc.log("parentName-----"+parentName);
                this.cfgCBSelected[parentName].setTouchEnabled(true);
                this.cfgCBSelected[parentName].setSelected(false);
                this.cfgCBSelected[parentName] = sender;

                sender.setTouchEnabled(false);
			}
		}
	}
	// //////////////////////////////////////////////////////////
});
