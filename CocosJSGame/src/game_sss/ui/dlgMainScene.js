DLG_CREATOR[ID_DlgSSSMainScene] = function() {
	return new DlgSSSMainScene();
};

var DlgSSSMainScene = DlgBase.extend({
	ctor: function () {
		this.dissolutionTime = 40;
		this.nClockStatus = false;
	},

	onCreate: function() {
		this.init();

	},

	onClose: function() {

	},

	init: function() {
        cc.spriteFrameCache.addSpriteFrames(res.sssdlgMainScene_plist);
        var json = ccs.load(res.sssdlgMainScene_json);
        this._rootWidget = json.node;

        var game = ClientData.getInstance().getGame();
        if (!game) {
            return;
        }

        //自适应屏幕大小
        var sizeDir = cc.director.getWinSize();
        this._rootWidget.setContentSize(sizeDir);
        ccui.helper.doLayout(this._rootWidget);

        this.Panel_main = this._rootWidget.getChildByName('Panel_main');

        //帮助按钮
        this.Button_help = this.Panel_main.getChildByName('Button_help');
        this.Button_help.addTouchEventListener(this.onClickBtnEvent, this);
        //设置按钮
        this.Button_set = this.Panel_main.getChildByName('Button_set');
        this.Button_set.addTouchEventListener(this.onClickBtnEvent, this);

        this.Panel_room = this.Panel_main.getChildByName('Panel_room');
        this.Text_room = this.Panel_room.getChildByName('Text_room');

        this.Panel_gnum = this.Panel_main.getChildByName('Panel_gnum');
        this.Text_gnum = this.Panel_gnum.getChildByName('Text_gnum');
        //时钟
        this.Image_clock = this.Panel_main.getChildByName('Image_clock');
        this.labTime = this.Image_clock.getChildByName('AtlasLabel_Time');
        this.Image_clock.setVisible(false);
        //底分背景
        this.BaseScore = this.Panel_main.getChildByName('BaseScore');
        //底分
        this.Text_BaseScore = this.Panel_main.getChildByName('Text_BaseScore');

        //添加文字聊天监听
        var calcu = function (thisObj) {
            return function (even) {
                thisObj.setWordMsg(even._userData);
            }
        }
        g_objHero.addListenerWordMsg(calcu(this));

        //聊天;语音按钮 位置
        var dlgChatScene = UIMgr.getInstance().openDlg(ID_DlgChatScene);
        var btnMsgPos = dlgChatScene.BtnSendMsg.getPosition();
        var btnSoundPos = dlgChatScene.BtnSounds.getPosition();
        dlgChatScene.BtnSendMsg.setPosition(cc.p(btnMsgPos.x + 4, btnMsgPos.y - 80));
        dlgChatScene.BtnSounds.setPosition(cc.p(btnSoundPos.x + 4, btnSoundPos.y - 100));
        // dlgChatScene.setChatPos(500,200);
        // dlgChatScene.setVoicePos(500,160);
        dlgChatScene.setDidalogZorder(ID_DlgGameSet);

    },
    //文字信息回调
    setWordMsg: function(data){
//		var parseData = dataParser.parse([
//		["wChatLength", "WORD"],			// 信息长度
//		["dwChatColor", "DWORD"],			// 信息颜色
//		["dwSendUserID", "DWORD"],			// 发送用户
//		["dwTargetUserID", "DWORD"],		// 目标用户
//		["wClientID", "WORD"],				// 客户端ID
//		["szChatString", "TCHARS", 128],	// 聊天信息
//		]);
    cc.log("设置 文字消息" + JSON.stringify(data));
    var wChatLength = data.wChatLength;
    var dwChatColor = data.dwChatColor;
    var dwSendUserID = data.dwSendUserID;
    var dwTargetUserID = data.dwTargetUserID;
    var wClientID = data.wClientID;
    var szChatString = data.szChatString;

    var table = ClientData.getInstance().getTable();
    if(!table){
        return;
    }

    var player = table.getPlayerByUserId(data.dwSendUserID);
    var meChairID = g_objHero.getChairID();
    var chairID = player.getChairID();

    var index = 0
    while(true){ if(((meChairID+index)%4)==chairID) break; index++; }
    var strWho = "My";
    switch(index){
        case 0:{ strWho = "My"; 	break; }//自己
        case 1:{ strWho = "Right"; 	break; }//右边
        case 2:{ strWho = "Up"; 	break; }//对面
        case 3:{ strWho = "Left"; 	break; }//左边
        default: break;
    }
    var userInfoNodeName = "Node_userInfo"+strWho;
    var userInfoNode = this.Panel_playerInfo.getChildByName(userInfoNodeName);
    var Panel_msg = userInfoNode.getChildByName("Panel_msg");
    var Text_msg = Panel_msg.getChildByName("Text_msg");
    Text_msg.string = szChatString;
    Text_msg.setColor(cc.color(128, 0, 128));

    var action=[];

    if(cc.sys.isNative){
        var delay = cc.DelayTime(3);
        var run=cc.CallFunc(function(){
            Panel_msg.setVisible(false);
        },this);
        action.push(delay);
        action.push(run);

        Panel_msg.runAction(cc.Sequence(action));
    }
    else{
        var delay = new cc.DelayTime(3);
        var run=new cc.CallFunc(function(){
            Panel_msg.setVisible(false);
        },this);
        action.push(delay);
        action.push(run);

        Panel_msg.runAction(new cc.Sequence(action));
    }

    Panel_msg.setVisible(true);
},

	onSetImageclockStatus:function(status){
		cc.log("status = " + status);
		//this.Image_clock.setVisible(status);
		//this.nClockStatus = status;
	},
	onGetImageclockStatus:function(){
		return this.nClockStatus;
	},
	onStartCountDownTime: function () {
		cc.director.getScheduler().scheduleCallbackForTarget(this, this.updateCountDownTime,1, cc.REPEAT_FOREVER, 0, false, "keyCountDownTime");
	},
	//更新当前时间
	updateCountDownTime : function() {
		// this.dissolutionTime =this.dissolutionTime-1;
		// if(this.labTime){
		// 	this.labTime.setString(this.dissolutionTime);
        //
		// 	var slem = this.labTime.getString().length;
		// 	this.labTime.setContentSize(39 * slem, 60);
		// }else {
		// 	cc.director.getScheduler().unscheduleCallbackForTarget(this,this.updateCountDownTime);
		// }
		// if(this.dissolutionTime<=0){
		// 	cc.director.getScheduler().unscheduleCallbackForTarget(this,this.updateCountDownTime);
		// 	this.labTime.setString(0);
        //
		// 	var slem = this.labTime.getString().length;
		// 	this.labTime.setContentSize(39 * slem, 60);
		// }
	},
	//设置房间号
	onSetRoomNum : function(num) {
		this.Text_room.setString(num);
	},
	//设置底分
	onSetBasePoint : function(num) {
		this.Text_BaseScore.setString(num);
	},
	//设置游戏局数
	onSetGameNum : function(num,allnum) {
		this.Text_gnum.setString(num+"/"+allnum);
	},
	onClickBtnEvent: function(sender, type) {
	    cc.log("onClickBtnEvent");
		if (ccui.Widget.TOUCH_ENDED == type) {
			var strBtnName = sender.getName();
			switch (strBtnName) {
			case "Button_help":
				UIMgr.getInstance().openDlg(ID_DlgGameRule);
				break;
			case "Button_set":
                UIMgr.getInstance().openDlg(ID_DlgGameSet);
				break;
			default:
				break;
			}
		}
	}
});
