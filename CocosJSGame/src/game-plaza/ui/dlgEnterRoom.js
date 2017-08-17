/*
 *加入房间界面
 * Author: 	xjn 
 * Date:	2017.4.1
 * 
 * 功能：
 * 加入房间界面控件交互
 * */
DLG_CREATOR[ID_DlgEnterRoom] = function() {
	return new DlgEnterRoom();
};

var DlgEnterRoom = DlgBase.extend({
	ctor: function(){
		this.strRoomNum = "";
	},

	onCreate: function() {
		this.init();
	},

	onClose: function() {
	},

	init: function() {
		var json = ccs.load(res.dlgEnterRoomScene_json);
        if(!json)
        return;

		this._rootWidget = json.node;

		//自适应屏幕大小
		var sizeDir = cc.director.getWinSize();
		this._rootWidget.setContentSize(sizeDir);
		ccui.helper.doLayout(this._rootWidget);
		
		this.Panel_root = this._rootWidget.getChildByName("Panel_root");

		//置换游戏图标
        var plaza = ClientData.getInstance().getPlaza();
        if(!plaza)
            return
        var curKindID = plaza.getCurKindID();
        this.Panel_bg = this.Panel_root.getChildByName("Panel_bg");
        var createRoomCfg = LoadCreateRoomCfg.getInstance().getCreateRoomCfg(curKindID);
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

		//btnClose
        this.Panel_root = this._rootWidget.getChildByName("Panel_root");
        var btnCtrl = this.Panel_root.getChildByName("Button_close");
        btnCtrl.addTouchEventListener(this.onClickEvent, this);

        //输入号码
        this.TextField_roomID = this.Panel_root.getChildByName("TextField_roomID");
        this.TextField_roomID.string = "";
        this.TextField_roomID.setTextHorizontalAlignment(cc.TEXT_ALIGNMENT_CENTER);
        this.TextField_roomID.setTextVerticalAlignment(cc.TEXT_ALIGNMENT_CENTER);

        //面板按钮回调
        this.Panel_input = this.Panel_root.getChildByName("Panel_input");
        var children = this.Panel_input.children;
        for (var index = 0; index < children.length; ++index) {
        	children[index].addTouchEventListener(this.onClickEvent, this);
        }

        //房间列表
		this.Panel_roomList = this.Panel_root.getChildByName("Panel_roomList");
        // Panel_roomListTemp
        var ListView_roomList = this.Panel_roomList.getChildByName("ListView_roomList");

        //ListView_roomList.prototype.addEventListenerScrollView();//addEventListenerScrollView();

		//请求房间列表
		this.curListCounts = 0;
        this.enableRefresh = false;
        PlazaUIMgr.getInstance().doGetPublicRoomList(this.curListCounts+6);
        ListView_roomList.removeAllChildren();
        var self = this;
        var seq = cc.sequence(
            cc.delayTime(1),
            cc.CallFunc(function(){
                ccui.ScrollView.prototype.addEventListener.call(ListView_roomList, self.onListViewEvent, self);
            }, this)
        );
        this.Panel_roomList.runAction(seq);
        
        //
        var self = this;
        var seq = cc.sequence(
        		cc.delayTime(10),
        		cc.CallFunc(function(){
        			PlazaUIMgr.getInstance().doGetPublicRoomList(self.curListCounts);
        		}, this)
        );
        this.Panel_root.runAction(seq.repeatForever());
	},
	doFreshRoomList: function(data){
        this.enableRefresh = true;

		var roomList = data.Lists;
        roomList.sort(function(a,b){
            if(a.CurCnt==a.MaxPlayerCnt && b.CurCnt!=b.MaxPlayerCnt)
                return true;
            if(a.CurCnt!=a.MaxPlayerCnt && b.CurCnt==b.MaxPlayerCnt)
                return false;
            if(a.CurCnt==a.MaxPlayerCnt && b.CurCnt==b.MaxPlayerCnt)
                return a.CreateTime>b.CreateTime;

            if((a.MaxPlayerCnt-a.CurCnt)>(b.MaxPlayerCnt-b.CurCnt))
                return true;

            if((a.MaxPlayerCnt-a.CurCnt)==(b.MaxPlayerCnt-b.CurCnt))
                return a.CreateTime>b.CreateTime;
        });

        cc.log("sort roomList = " + JSON.stringify(roomList));
        //刷新
        // RoomID     int                  //6位房号
		//RoomName    string				//房间名称
        // CurCnt     int                  //当前人数
        // MaxPlayerCnt     int                  //最多多人数
        // PayCnt     int                  //可玩局数
        // PayType    int                  //支付类型
        // CurPayCnt  int                  //已玩局数
        //this.Panel_roomList = this.Panel_root.getChildByName("Panel_roomList");
        var Panel_roomListTemp = this.Panel_roomList.getChildByName("Panel_roomListTemp");
        var ListView_roomList = this.Panel_roomList.getChildByName("ListView_roomList");
        var self = this;
        var doSetItem = function(item, index){
            var roomInfo = roomList[index];
            if(!roomInfo || !item)
                return false;

            var Text_roomID = item.getChildByName("Text_roomID");
            Text_roomID.string = roomInfo.RoomID;
            var Text_roomName = item.getChildByName("Text_roomName");
            Text_roomName.string = roomInfo.RoomName;

            var Image_payInfo = item.getChildByName("Image_payInfo");
            var Text_rounds = Image_payInfo.getChildByName("Text_rounds");
            var res = [
            	"default/dating0021c.png",
				"default/dating0021d.png"
			];
            Image_payInfo.loadTexture(res[roomInfo.PayType-1],ccui.Widget.PLIST_TEXTURE);
            Text_rounds.string = roomInfo.PayCnt;

            var isPlaying = (roomInfo.Status!=0);
            var Panel_waiting = item.getChildByName("Panel_waiting");
            var Panel_playing = item.getChildByName("Panel_playing");
            var Button_add = item.getChildByName("Button_add");
            Panel_playing.setVisible(isPlaying);
            Panel_waiting.setVisible(!isPlaying);
            Button_add.setVisible(!isPlaying);

            if(isPlaying){
                var Text_rounds = Panel_playing.getChildByName("Text_rounds");
                Text_rounds.string = roomInfo.CurPayCnt+"/"+roomInfo.PayCnt;
			}
			else{
                var Text_players = Panel_waiting.getChildByName("Text_players");
                Text_players.string = roomInfo.CurCnt+"/"+roomInfo.MaxPlayerCnt;

                Button_add.addTouchEventListener(self.onClickEvent, self);
                Button_add.setTouchEnabled(!(roomInfo.CurCnt==roomInfo.MaxPlayerCnt));
                if(roomInfo.CurCnt==roomInfo.MaxPlayerCnt){
                    Button_add.setColor(cc.color(100,100,100,255));
                }
			}

            item.setName(String(roomInfo.RoomID));

            return true;
		}

		var maxCounts = (this.curListCounts>data.Count)?this.curListCounts:data.Count;
        var minCounts = (this.curListCounts>data.Count)?data.Count:this.curListCounts;
        cc.log("this.curListCounts----",this.curListCounts);
        cc.log("data.Count----",data.Count);
        cc.log("maxCounts-----",maxCounts);
        cc.log("minCounts-----",minCounts);
        //更新
        for(var index=0; index<minCounts; index++) {
            var item = ListView_roomList.getItem(index);
            doSetItem(item, index);
            cc.log("更新-------------");
        }

        //移除,新增
		if(this.curListCounts>data.Count){
            //移除
            for(var index=0; index<maxCounts-minCounts; index++) {
                ListView_roomList.removeLastItem();
                cc.log("移除-------------");
                // var item = ListView_roomList.getItem(index);
                // if(item){
                //     ListView_roomList.removeItem(index);
                //
                // }
            }
		}
		else{
			//新增
            for(var index=minCounts; index<maxCounts; index++) {
                var item  = Panel_roomListTemp.clone();
                if(doSetItem(item, index)){
                    item.setVisible(true);
                    ListView_roomList.pushBackCustomItem(item);
                    cc.log("新增-------------");
                }
            }
		}
		if(this.curListCounts==0)
             ccui.ScrollView.prototype.scrollToTop.call(ListView_roomList,0.01, false);
        this.curListCounts = data.Count;
    },
	doClear: function(){
		//清除
		this.strRoomNum = "";
		this.TextField_roomID.string = "";
		// var size = this.TextField_roomID.getContentSize();
		// this.AtlasLabel_input.setContentSize(cc.size(0, 56));
		// this.TextField_inPutTip.setVisible(true);
	},

    onListViewEvent: function(sender, type){
        if(!this.enableRefresh){
            cc.log("onListViewEvent---------!this.enableRefresh");
            return;
        }

        switch (type) {
            case ccui.ScrollView.EVENT_SCROLL_TO_BOTTOM://滑动到底部
                this.enableRefresh = false;

                //请求房间列表
                PlazaUIMgr.getInstance().doGetPublicRoomList(this.curListCounts+6);

                var self = this;
                var seq = cc.sequence(
                    cc.delayTime(1),
                    cc.CallFunc(function(){
                        self.enableRefresh = true;
                    }, this)
                );
                sender.runAction(seq);
                cc.log("SCROLL_TO_BOTTOM");
                break;
            case ccui.ScrollView.EVENT_SCROLL_TO_TOP://滑动到头部
                this.enableRefresh = false;
                //请求房间列表
                PlazaUIMgr.getInstance().doGetPublicRoomList(6);

                var self = this;
                var seq = cc.sequence(
                    cc.delayTime(1),
                    cc.CallFunc(function(){
                        self.enableRefresh = true;
                    }, this)
                );
                sender.runAction(seq);
                cc.log("SCROLL_TO_TOP");
                break;
            default:
                break;
        }
	},

	onClickEvent: function(sender, type) {
		if (ccui.Widget.TOUCH_ENDED == type) {
			var strBtnName = sender.getName();
			cc.log('onClickEvent ' + strBtnName);
			switch (strBtnName) {
			case "Button_add":
                //加入房间
				var parent = sender.getParent();
                PlazaUIMgr.getInstance().onEnterRoom(Number(parent.getName()));
				break;
			case "Button_close":
                UIMgr.getInstance().closeDlg(ID_DlgEnterRoom, false)
				break;
			case "Button_clear":
				this.doClear();
				break;
			case "Button_del":
				//回删
				var counts = this.TextField_roomID.string.length;
				if(counts>0){
                    this.TextField_roomID.string = this.TextField_roomID.string.slice(0,counts-1);
				}
				else{
                    this.TextField_roomID.string = "";
				}
				break;
			default:
				if(strBtnName.search("Button_key_")==-1 || this.TextField_roomID.string.length==6)
					break;

                this.TextField_roomID.string = this.TextField_roomID.string+strBtnName.replace("Button_key_","");
				if(this.TextField_roomID.string.length==6){
					PlazaUIMgr.getInstance().onEnterRoom(Number(this.TextField_roomID.string));
				}
				break;
			}
		}
	},
});