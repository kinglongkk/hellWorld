
DLG_CREATOR[ID_DlgRoomRecord] = function() {
	return new DlgRoomRecord();
};

var DlgRoomRecord = DlgBase.extend({
	ctor: function(){
	},

	onCreate: function() {
		this.init();
	},

	onClose: function() {
	},

	init: function() {
		var json = ccs.load(res.dlgRoomListScene_json);
		this._rootWidget = json.node;

		// 自适应屏幕大小
		var sizeDir = cc.director.getWinSize();
		this._rootWidget.setContentSize(sizeDir);
		ccui.helper.doLayout(this._rootWidget);

		this.Panel_root = this._rootWidget.getChildByName("Panel_root");

        //btnClose
        this.Panel_root = this._rootWidget.getChildByName("Panel_root");
        var btnCtrl = this.Panel_root.getChildByName("Button_close");
        btnCtrl.addTouchEventListener(this.onClickEvent, this);

        this.Panel_roomPlayerList = this.Panel_root.getChildByName("Panel_roomPlayerList");
        this.Panel_roomPlayerList.addTouchEventListener(this.onClickEvent, this);
        // 阻止子节点被触摸产生的事件传递到父节点引发界面被关闭
        this.Panel_roomPlayerList.getChildByName("bg").addTouchEventListener(this.onClickEvent, this);
        var btn_close = this.Panel_roomPlayerList.getChildByName("btn_close");
        btn_close.addTouchEventListener(this.onClickEvent, this);

        //获取已开房间记录
        PlazaUIMgr.getInstance().doGetMyselfRoomList();

        // 查询指定roomID内的玩家时,服务端没有返回房间对应的游戏类型
        // 所以需要客户端自己记录查询的是哪个游戏类型和房间号
        this.clickGameName = "";
        this.clickRoomID = "";
	},
    doFreshRoomList: function(data){
        var Panel_roomListTemp = this.Panel_root.getChildByName("Panel_roomListTemp");
        var ListView_room = this.Panel_root.getChildByName("ListView_room");
        var newDate = new Date();
        // CreatorTime int64  //创建时间
        // RoomID      int    //房号
        // KindID    int //游戏
        // Status      int    //状态 RoomStatusReady    = 0  RoomStatusStarting = 1  RoomStatusEnd      = 2
       var stateCfg = [
		   { "strText":"空闲", "color":[102,255,255] },
           { "strText":"游戏中", "color":[255,255,0] },
           { "strText":"结束", "color":[255,255,255] }
	   ];
        var arrRoomRecords = data.Records;


        arrRoomRecords.sort(function(a, b){
            return (a.CreatorTime-b.CreatorTime)
        });

        ListView_room.removeAllItems();
        for(var index=0; index<arrRoomRecords.length; ++index){
        	var item = Panel_roomListTemp.clone();
            item.getChildByName("btn").addTouchEventListener(this.onClickEvent, this);
            var roomInfo = arrRoomRecords[index];

        	//创建时间
            newDate.setTime(roomInfo.CreatorTime * 1000);
            var createDate = newDate.getFullYear()+"-"+(newDate.getMonth()+1)+"-"+newDate.getDate();
            var createTime = newDate.toLocaleTimeString();
			var Text_time = item.getChildByName("Text_time");
            Text_time.string = createDate+" "+createTime;
            console.log(Text_time.string);

            //房号
            var Text_roomID = item.getChildByName("Text_roomID");
            Text_roomID.string = roomInfo.RoomID;
            item.setName(Text_roomID.string);

            //游戏名称
            var Text_gameName = item.getChildByName("Text_gameName");
            var gameCfg = GameKindMgr.getInstance().getGameCfg(roomInfo.KindID);
            Text_gameName.string = gameCfg.gameName;

            //状态
            var Text_state = item.getChildByName("Text_state");
            Text_state.string = stateCfg[roomInfo.Status].strText;
            var color = stateCfg[roomInfo.Status].color;
            Text_state.setColor(cc.color(color[0],color[1],color[2],255));

            //操作
            var Button_enter = item.getChildByName("Button_enter");
            var Button_operation = item.getChildByName("Button_operation");
            Button_enter.addTouchEventListener(this.onClickEvent, this);
            Button_operation.addTouchEventListener(this.onClickEvent, this);
            switch (roomInfo.Status){
				case 0:
                    Button_operation.setName("Button_operation_dissolution");
                	break;
                case 1:
                    Button_enter.setVisible(false);
                    Button_operation.setTouchEnabled(false);
                    Button_operation.loadTextureNormal("default/dating0021g.png",ccui.Widget.PLIST_TEXTURE);
                    var Image_19 = Button_operation.getChildByName("Image_19");
                    Image_19.setVisible(false);
                    break;
                case 2:
                    Button_enter.setVisible(false);
                    Button_operation.setName("Button_operation_del");
                    Button_operation.loadTextureNormal("default/dating0006.png",ccui.Widget.PLIST_TEXTURE);
                    var Image_19 = Button_operation.getChildByName("Image_19");
                    Image_19.loadTexture("default/dating0006d.png",ccui.Widget.PLIST_TEXTURE);
                    break;
                default:
                    break;
			}

            item.setVisible(true);
            ListView_room.pushBackCustomItem(item);
		}

		// 移动接口的调用时机不能与pushBackCustomItem类似添加元素的放在同一帧
        // 放在同一帧是没有效果的,所以这里延迟0.1秒操作
        ListView_room.runAction(cc.sequence(cc.delayTime(0.1), cc.callFunc(function () {
            // ListView 的三种移动效果
            // ListView_room.scrollToTop(0.1, false);
            ListView_room.jumpToPercentVertical(0.0);
            // ListView_room.scrollToPercentVertical(0, 0.1, true);
        })));
    },
    showPlayerInfo: function (data) {
        var gameName = this.Panel_roomPlayerList.getChildByName("bg").getChildByName("gameName");
        var roomID = this.Panel_roomPlayerList.getChildByName("bg").getChildByName("roomID");
        var playerInfoBg = this.Panel_roomPlayerList.getChildByName("bg").getChildByName("playerInfoBg");
        var playerInfoNode = playerInfoBg.getChildByName("playerInfo");

        gameName.string = this.clickGameName;
        roomID.string = this.clickRoomID;

        // 假如查询到的玩家信息为空则表示房间还未有人加入显示提示信息
        var playerInfoList = data.Players;
        if(!playerInfoList){
            playerInfoBg.getChildByName("text_tip").setVisible(true);
            this.Panel_roomPlayerList.setVisible(true);
            return;
        }

        var playerCount = playerInfoList.length;
        if(playerCount <= 4){
            var playerNode_2 = playerInfoBg.getChildByName("2");
            var posX = playerNode_2.getContentSize().width/(playerCount+1);
            var posY = playerNode_2.getContentSize().height/2;
            for(var index=0; index<playerCount; ++index){
                var playerInfo = playerInfoList[index];
                var player = playerInfoNode.clone();
                player.getChildByName("playerName").string = playerInfo.Name;
                var headImage = player.getChildByName("headImage");
                var headImageContentSize = headImage.getContentSize();
                ClientData.getInstance().loadUrlImage(function (savePath) {
                    headImage.loadTexture(savePath, ccui.Widget.LOCAL_TEXTURE);
                    // headImage.setContentSize(cc.size(headsize.width,headsize.height));
                    headImage.setContentSize(headImageContentSize);
                }, playerInfo.HeadUrl, playerInfo.UID);
                headImage.setContentSize(headImageContentSize);
                player.setVisible(true);
                playerNode_2.addChild(player);
                player.setPosition(posX*(index+1),posY);
            }
        }
        else {
            var playerCount_0 = Math.ceil(playerCount/2);
            var playerCount_1 = playerCount - playerCount_0;

            var playerNode_0 = playerInfoBg.getChildByName("0");
            var posX_0 = playerNode_0.getContentSize().width/(playerCount_0+1);
            var posY_0 = playerNode_0.getContentSize().height/2 + 12;
            var playerNode_1 = playerInfoBg.getChildByName("1");
            var posX_1 = playerNode_1.getContentSize().width/(playerCount_1+1);
            var posY_1 = playerNode_1.getContentSize().height/2 + 12;

            for(var index=0; index<playerCount_0; ++index){
                var playerInfo = playerInfoList[index];
                var player = playerInfoNode.clone();
                player.getChildByName("playerName").string = playerInfo.Name;
                var headImage = player.getChildByName("headImage");
                var headImageContentSize = headImage.getContentSize();
                ClientData.getInstance().loadUrlImage(function (savePath) {
                    headImage.loadTexture(savePath, ccui.Widget.LOCAL_TEXTURE);
                    // headImage.setContentSize(cc.size(headsize.width,headsize.height));
                    headImage.setContentSize(headImageContentSize);
                }, playerInfo.HeadUrl, playerInfo.UID);
                player.setVisible(true);
                playerNode_0.addChild(player);
                player.setPosition(posX_0*(index+1),posY_0);
            }
            for(var index=0; index<playerCount_1; ++index){
                var playerInfo = playerInfoList[playerCount_0+index];
                var player = playerInfoNode.clone();
                player.getChildByName("playerName").string = playerInfo.Name;
                var headImage = player.getChildByName("headImage");
                var headImageContentSize = headImage.getContentSize();
                ClientData.getInstance().loadUrlImage(function (savePath) {
                    headImage.loadTexture(savePath, ccui.Widget.LOCAL_TEXTURE);
                    // headImage.setContentSize(cc.size(headsize.width,headsize.height));
                    headImage.setContentSize(headImageContentSize);
                }, playerInfo.HeadUrl, playerInfo.UID);
                headImage.setContentSize(headImageContentSize);
                player.setVisible(true);
                playerNode_1.addChild(player);
                player.setPosition(posX_1*(index+1),posY_1);
            }
        }

        this.Panel_roomPlayerList.setVisible(true);
    },
    doDeleteRoom: function(){
            if(this.delItem){
            var ListView_room = this.Panel_root.getChildByName("ListView_room");
            ListView_room.removeItem(ListView_room.getIndex(this.delItem));
            this.delItem = null;
        }
    },
	onClickEvent: function(sender, type) {
		if (ccui.Widget.TOUCH_ENDED == type) {
			var strBtnName = sender.getName();
			switch (strBtnName) {
			case "Button_enter":
				//进入
				var parent = sender.getParent();
				var roomID = Number(parent.getName());
                PlazaUIMgr.getInstance().onEnterRoom(roomID);
				break;
			case "Button_operation_dissolution":
				//解散
                var parent = sender.getParent();
                var roomID = Number(parent.getName());
                OpenRoomMsg.getInstance().sendDeleteRoom_plaza(roomID);
                this.delItem = parent;
                break;
			case "Button_operation_del":
                //删除
                break;
            case "Button_close":
            	UIMgr.getInstance().closeDlg(ID_DlgRoomRecord, false)
				break;
            case "btn":
                this.clickGameName = sender.getParent().getChildByName("Text_gameName").string;
                this.clickRoomID = sender.getParent().getChildByName("Text_roomID").string;
                cc.log(" ------ 获取 gameType=%s roomID=%s 房间内的玩家信息 ------", this.clickGameName, this.clickRoomID);
                var data = {RoomId : parseInt(this.clickRoomID)};
                OpenRoomMsg.getInstance().sendQueryRoomPlayerInfo(data);
                break;
            case "Panel_roomPlayerList":// Panel_roomPlayerList 和 btn_close 要做的事情是一样的
            case "btn_close":           // 所以Panel_roomPlayerList就不写break了，直接进入btn_close的事件
                // 每次关闭界面都要清除掉子节点
                var playerInfoBg = this.Panel_roomPlayerList.getChildByName("bg").getChildByName("playerInfoBg");
                playerInfoBg.getChildByName("0").removeAllChildren();
                playerInfoBg.getChildByName("1").removeAllChildren();
                playerInfoBg.getChildByName("2").removeAllChildren();
                playerInfoBg.getChildByName("text_tip").setVisible(false);
                this.Panel_roomPlayerList.setVisible(false);
                break;
			default:
				break;
			}
		}
	},

	onCheckBoxEvent: function(sender, type){
		if (ccui.CheckBox.EVENT_SELECTED == type) {
			var nodeName = sender.name;
			cc.log("onCheckBoxEvent---"+nodeName);
			if(-1!=nodeName.search("CheckBox_pay")){
			}
			else{
			}
		}
	}
	// //////////////////////////////////////////////////////////
});
