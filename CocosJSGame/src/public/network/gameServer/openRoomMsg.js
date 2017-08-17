/*
 * 创建房间 网络接口
 * Author: 	xjn 
 * Date:	2017.4.1
 * 
 * 功能：
 * */

var g_openRoomMsg = null;
var g_isShowRank = null;
var OpenRoomMsg = cc.Class.extend({
	ctor: function(){

	    this.tipNames = []
        this.nNamesIndex = 0
    },
	
	onMsgMainPCMBOpenRoom: function(subCmd, data){
		cc.log("-------------------收到房间命令 cmd = " + subCmd + "----------------");
		switch (subCmd) {
			//创建房间成功
			case SUB_GR_CREATE_SUCCESS:
				this.onSubCreateOK(data);
				break;
			case SUB_GR_CREATE_FAILURE:
				this.onSubCreateFailed(data);
				break;
			case SUB_GR_CANCEL_REQUEST:		// 请求解散房间消息
				this.recCancelRoom(data);
				break;
			case SUB_GR_REQUEST_RESULT:		// 解散房间请求结果
				this.recCancelRoomResult(data);
				break;
			case SUB_GR_PERSONAL_TABLE_TIP:
				this.personalTableTip(data);
				break;
            case SUB_GR_PERSONAL_TABLE_END:	// 局数已到
            	cc.log("--局数已到--");
				this.OnPersonalTableEnd(data)
                break;
            case SUB_GR_RENEW_TABLE:      //游戏结束后续费成功
                this.onRenewRoomOK(data);
                break;
            case SUB_GR_RENEW_TABLE_OVERTIME:  //游戏结束后房主长时间未续费
                this.noRenewBackToPlaza();
                break;
            case SUB_GR_CANCEL_TABLE://
				this.OnCancelTable(data)
            	break;
		default:
			break;
		}
	},

    // 下发 G2C_XXX_GameConclude 后下发G2C_CancelTable
	  OnCancelTable:function (data) {
	    cc.log("------------------G2C_CancelTable 的侦听回调 （）")
        // var dlg = UIMgr.getInstance().openDlg(ID_DlgDialogScene);
        // dlg.setTitle("房间解散提示");
        // cc.log("------------------G2C_CancelTable 房间解散提示创建好了")
        // var dText = new ccui.Text();
        // dText.setContentSize(dlg.detailBg.getContentSize());
        // dText.setFontSize(48);
        //
        // dText.string = "您已退出房间";
        //
        // dlg.setCloseFunc(function () {
        //     GameKindMgr.getInstance().backPlazaScene();
        // });
        // dlg.setDetailView(dText);
        // var strTip = "房间已解散"
        // DlgTip.openSysTip(strTip, function(target){
        //     target.closeTip();
        //     //GameKindMgr.getInstance().backLoginScene();
        // });
    },

	OnPersonalTableEnd:function (data) {
        var runScene = cc.director.getRunningScene();
        if (runScene && runScene.showResult) {
            // 各个游戏自己重写showResult
            runScene.showResult();
        }
    },
    personalTableTip: function(data){
        cc.log("personalTableTip = " + JSON.stringify(data));
        var game = ClientData.getInstance().getGame();
        game.setTableOwnerUserID(data.TableOwnerUserID);//桌主 I D
        game.setDrawCountLimit(data.DrawCountLimit);//局数限制
        game.setPlayCount(data.PlayCount);//已玩局数
        game.setCurentCount(data.PlayCount);//记录局数
        game.setCellScore(data.CellScore);//游戏底分
        g_objHero.setRoomID(data.ServerID);//房间编号

        var plaza = ClientData.getInstance().getPlaza();

        //if(data.IsGoldOrGameScore==1) {
            plaza.setCurGameType(GAME_GENRE_PERSONAL);//金币场还是积分场 0 标识 金币场 1 标识 积分场
            if(g_objHero.getScore()==0){
                g_objHero.setScore(data.IniScore);
            }
        // }
        // else {
        //     cc.log("---------------------------");
        //     plaza.setCurGameType(GAME_GENRE_GOLD);//金币场还是积分场 0 标识 金币场 1 标识 积分场
        //     if(g_objHero.getMoney()==0){
        //         cc.log("personalTableTip 设置初始积分"+data.IniScore);
        //         g_objHero.setMoney(data.IniScore);
        //     }
        // }

        if(data.OtherInfo!=undefined && game.setGameRoomOhterInfo!=undefined) {
            game.setGameRoomOhterInfo(data.OtherInfo); // 各个游戏房间的扩展信息sxh
        }
		
		if( game.setGameRoomPayType!=undefined){
			game.setGameRoomPayType(data.PayType);// 支付方式
		}
		
        game.LeaveInfo = data.LeaveInfo;

        // //恢复请求解散的等待面板
        // var game = ClientData.getInstance().getGame();
        // game.LeaveInfo = data.LeaveInfo;
        // var  LeaveInfo = game.LeaveInfo;
        // if(LeaveInfo.length!=0) {
        //     var leftTimes = LeaveInfo.leftTimes;
        //     showLeavRoomWaiting(true, leftTimes);
        //
        //     var agreeInfo = LeaveInfo.agreeInfo;
        //     var dlgSet = UIMgr.getInstance().getDlg(ID_DlgGameSet);
        //     if(dlgSet){
        //         for(var index=0; index<agreeInfo.length; ++index){
        //             dlgSet.setWaitingStatus(agreeInfo[index], true);
        //         }
        //     }
        // }
    },

	//创建房间失败
	onSubCreateFailed: function(data){
		//关闭游戏服务器
		//g_gameSocket.close();
		//cc.log("--------g_gameSocket.close()---------");

		//提示界面
        // DlgTip.openSysTip(data.DescribeString + "error : " + data.ErrorCode);

        // 开设房间和加入房间  在砖石不足的情况下服务端都是放回ErrorCode：106
        // 暂时先这样 等教文服务端添加完在改成可配置的   liquan
        var strTip = LoadErrorCfg.getInstance().getStrErrTip(data.ErrorCode)
        DlgTip.openSysTip(strTip, function (target) {
            target.closeTip();
        });
	},
	
	//登录服创建成功创建房间成功
	onSubCreateOK: function(data){
        g_objHero.setRoomID(data.TableID);

        PlazaUIMgr.getInstance().onOpenRoomOK(data.TableID);
        // var obj = data.ServerIP.split( ":")
        // MsgMgr.getInstance().connectGameServer(obj[0], obj[1]);
	},


    OnLoadRoomOk :function (data) {
        g_objHero.setChairID(0);

        //g_objHero.setMoney(data.Beans);
        g_objHero.setRoomCard(data.RoomCard);
        g_objHero.dwDrawCountLimit = data.DrawCountLimit;
        g_objHero.dwDrawTimeLimit = data.DrawTimeLimit;

    },

    //续费房间成功   更新房间消息
    onRenewRoomOK: function (data) {
        var dataParser = new DataParser();
        dataParser.init(data);

        var parseData = dataParser.parse([
            								["lResultCode", "LONG"],//错误代码   0成功
											["wJoinGamePeopleCount", "WORD"],//参与游戏的人数
            								["dwDrawCountLimit", "DWORD"],//局数限制
											["dwDrawTimeLimit", "DWORD"],//时间限制
											["lCellScore", "LONGLONG"],//底分设置
											["szDescribeString", "TCHARS", 128]//错误描述
        ]);
        cc.log("onRenewRoomOK server return = " + JSON.stringify(parseData));

        if (parseData.lResultCode == DB_SUCCESS) {
            //关闭战绩页
            UIMgr.getInstance().closeDlg(ID_DlgResult);

            //重置房间内的信息
            cc.director.getRunningScene().layer.resetRounds();
		} else {
            if (g_objHero.getChairID() == 0) {
            	var dlg = UIMgr.getInstance().getDlg(ID_DlgResult);
            	var callback = dlg.setPayMoreBtnEnable;
                DlgTip.openSysTip(parseData.szDescribeString, callback);
			}
		}
    },


    // 游戏续费成功 (用这个)
    onRenewalFeesSuccess: function (data) {
        var room = ClientData.getInstance().getRoom();
        if(room) room.setRenew(data);

        var dlgGameRecordCenter = UIMgr.getInstance().getDlg(ID_DlgGameRecordCenter);
        if(dlgGameRecordCenter){
            dlgGameRecordCenter.onRenewSuccess(data);
        }
    },

    //请求房间列表结果
    onGetMyRoomListResult: function(data){
        PlazaUIMgr.getInstance().getMyselfRoomListResult(data);
    },

    //发送请求指定roomID房间内的玩家信息
    sendQueryRoomPlayerInfo: function (data) {
        LogonMsgHandler.getInstance().send("C2L_ReqRoomPlayerBrief", data)
    },
    //收到服务端的回包,房间内玩家简要的信息
    onRoomPlayerInfo:function (data) {
        var dlgRoomRecord = UIMgr.getInstance().getDlg(ID_DlgRoomRecord);
        dlgRoomRecord.showPlayerInfo(data);
    },

	//发送创建房间
	sendCreateRoom: function(data){
        LogonMsgHandler.getInstance().send("C2L_CreateTable",data);
	},

    //续费
    sendRenewRoom: function (data) {
        var dataBuilder = new DataBuilder();
        dataBuilder.init(192);

        //游戏规则 弟 0 位标识 是否设置规则 0 代表未设置 1 代表设置
        //其他位游戏自定义规则， 规则协议由游戏服务端和客户端商定
        var cbGameRule = new Array(100);
        cbGameRule[0] = 1;
        cbGameRule[1] = CMD_HZMJ.GAME_PLAYER; //游戏人数必须放在第二位
        cbGameRule[2] = data.dwBaseScore;
        cbGameRule[3] = data.settlementType;
        cbGameRule[4] = data.dwRounds;
        for(var i=5; i<100; i++){
            cbGameRule[i] = 0;
        }

        dataBuilder.build([
							["dwTableID", "DWORD", g_objHero.getTableId()],// 当前游戏桌子号
							["lCellScore", "LONGLONG", data.dwBaseScore],//底分设置
							["dwDrawCountLimit", "DWORD", data.dwRounds],//局数
							["dwDrawTimeLimit", "DWORD", 0],//时间限制
							["wJoinGamePeopleCount", "WORD", 0],//参与游戏的人数
							["dwRoomTax", "DWORD", 0],//单独一个私人房间的税率，千分比
							["szPassword", "TCHARS",33],//密码设置33
							["cbGameRule", "BYTE[]", cbGameRule, 100]//结算方式
        ]);

		cc.log("发送续费请求参数 = " + "{" + "tableId = " + g_objHero.getTableId() + "," + "lCellScore = " + data.dwBaseScore + "," + "lCellScore = " + data.dwRounds +"}");

        if(g_gameSocket.status == SOCKET_STATUS._SS_CONNECTED){
            g_gameSocket.sendData(MDM_GR_PERSONAL_TABLE, SUB_GR_RENEW_TABLE, dataBuilder.getData());
        }
    },

    // 大厅发送请求解散房间
    sendDeleteRoom_plaza: function (roomID) {
        LogonMsgHandler.getInstance().send("C2L_DeleteRoom",{ "RoomId":roomID });
    },

    //请求退出房间
    send_C2G_LeaveRoom : function () {
        g_gameSocket.sendData("C2G_LeaveRoom",{});
        showLeavRoomWaiting(true);
    },

    //同意还是拒绝解散房间
    send_C2G_ReplyLeaveRoom : function (UserID, isAgree) {
        g_gameSocket.sendData("C2G_ReplyLeaveRoom",{ "Agree":isAgree, "UserID":UserID });
    },

    //别人同意或拒绝的结果通知
    onG2C_ReplyRsp: function(data){
        var dlgSet = UIMgr.getInstance().getDlg(ID_DlgGameSet);
        if(dlgSet){
            dlgSet.setWaitingStatus(data.UserID, data.Agree);
        }
        // 提示别人的投票结果
        var table = ClientData.getInstance().getTable();
        var player = table.getPlayerByUserId(data.UserID);
        var nickName = player.getNickName();
        if(!data.Agree){ // 有人不同意了 不用投票了 直接关闭投票界面
            this.deleTipDlg(data.ReplyUid) //直接关闭投票界面  ReplyUid 发起人id
            SHOWTIP(nickName + "投票拒绝解散房间")
        }
        else
        {
            SHOWTIP(nickName + "投票同意解散房间")
        }

    },
    //别人退出房间申请的广播
    onG2C_LeaveRoomBradcast: function(data){
        var table = ClientData.getInstance().getTable();
        var player = table.getPlayerByUserId(data.UserID);
        var nickName = player.getNickName();

        //提示XX请求退出房间  是否同意
        var self = this;
        var tipDlg = DlgTip.openLeaveRoomTip("系统提示",nickName+"，\r\n请求解散房间！",function(target){
            self.send_C2G_ReplyLeaveRoom(data.UserID, false);
            target.closeTip();
            self.deleTipDlg(data.UserID)
        },function (target) {
            self.send_C2G_ReplyLeaveRoom(data.UserID, true);
            target.closeTip();
            self.deleTipDlg(data.UserID)
        },"default/dating0006.png","default/dating0006c.png","default/dating0005.png","default/dating0005c.png", false, 0.8);
        this.addTipDlg(tipDlg, data.UserID)
    },
    //请求退出房间结果  最终结果，
    // type  G2C_LeaveRoomRsp  struct  {
    //     Code      int  //非0为失败
    //     Status  int  //  房间状态  0是没开始，  其他都是开始了
    // }
    onG2C_LeaveRoomRsp: function(data){
        cc.log("---------------退出房间结果G2C_LeaveRoomRsp回调 -----------")
        var Status = data.Status
        var Code = data.Code
        if(Status && Status != 0) { // 开始退出房间
            if (Code && 0 != Code) { // 请求退出房间失败
                cc.log("--------申请退出房间失败 -----------")
                showLeavRoomWaiting(false);
            }
            else { // 申请退出房间成功
                cc.log("--------申请退出房间结果成功 -----------")
                showLeavRoomWaiting(false);
            }
        }
        else { // 未开始退出房间
            cc.log("--------自动退出房间操作 -----------")
            if (Code && 0 != Code) { // 请求退出房间失败
                var strTip = "退出房间出错"
                DlgTip.openSysTip(strTip, function(target){
                    target.closeTip();
                    GameKindMgr.getInstance().backPlazaScene();
                });
            }
            else { // 返回大厅
                GameKindMgr.getInstance().backPlazaScene();
            }
        }

        // showLeavRoomWaiting(false);
        //
        // if(data.Code==0){
        //     //成功
        //     DlgTip.openSysTip("所有玩家已同意，确定退出", function(target){
        //         GameUserMsg.getInstance().sendStandUp(true);
        //         GameKindMgr.getInstance().backPlazaScene();
        //         target.closeTip();
        //     }, false);
        // }
        // else{
        //     DlgTip.openSysTip("有玩家未同意退出，请稍候在试", function(target){
        //         target.closeTip();
        //     }, false);
        // }
    },

    // 房间解散消息
    onRoomDissume:function (data) {
        this.deleAllTipDlg()
    },

    //四人牛牛游戏结束后房主解散房间返回大厅
    sendReturnPlaza: function () {
        var dataBuilder = new DataBuilder();
        dataBuilder.init(8);

        dataBuilder.build([
            ["dwUserID", "DWORD", g_objHero.getUserId()],	// 当前登陆者ID
            ["dwTableID", "DWORD", g_objHero.getTableId()]		// 当前游戏桌子号
        ]);

        cc.log("发送请求返回大厅参数{dwUserID：" + g_objHero.getUserId() + ",dwTableID:" + g_objHero.getTableId() + "}");
        if (g_gameSocket.status == SOCKET_STATUS._SS_CONNECTED) {
            g_gameSocket.sendData(MDM_GR_PERSONAL_TABLE, SUB_GR_EXIT_TABLE, dataBuilder.getData());
        }
    },

	//房主发送强制解散房间
	sendDissumeTalbe: function(){
        OpenRoomMsg.getInstance().send_C2G_LeaveRoom();
	},
	
	// 游戏发送请求解散房间
    sendCancelRoom: function () {
    },

    //大厅解散结果 L2C_DeleteRoomResult L2C_DeleteRoomResult
    deleteRoomResult_plaza: function(data){
	    var strTip = (data.Code==0)?"解散房间成功":"解散房间失败";
        DlgTip.openSysTip(strTip);

        if(data.Code==0){
            //删除一条记录
            var dlgRoomRecord = UIMgr.getInstance().getDlg(ID_DlgRoomRecord);
            if(dlgRoomRecord){
                dlgRoomRecord.doDeleteRoom();
            }
        }
    },

	// 服务端响应解散房间
	recCancelRoom: function (data) {
        var dataParser = new DataParser();
        dataParser.init(data);

        var parseData = dataParser.parse([
            ["dwUserID", "DWORD"],	// 当前登陆者ID
            ["dwTableID", "DWORD"],	// 当前游戏桌子号
            ["dwChairID", "DWORD"]	// 当前椅子号
		]);

        cc.log("服务端响应解散房间数据="+JSON.stringify(parseData));

        this.cancelRoomResult(SUB_GR_CANCEL_REQUEST, parseData);
    },

	// 客户端答复解散房间请求
	sendReplyCancelRoom: function (isAgree) {
        var dataBuilder = new DataBuilder();
        dataBuilder.init(9);

        dataBuilder.build([
            ["dwUserID", "DWORD", g_objHero.getUserId()],	// 当前登陆者ID
            ["dwTableID", "DWORD", g_objHero.getTableId()],		// 当前游戏桌子号
            ["cbAgree", "BYTE", isAgree]		// 是否解散房间
		]);

        cc.log("客户端答复解散房间请求入参{dwUserID"+g_objHero.getUserId()+",dwTableID:"+g_objHero.getTableId()+",cbAgree:"+isAgree+"}");

        if (g_gameSocket.status == SOCKET_STATUS._SS_CONNECTED) {
            g_gameSocket.sendData(MDM_GR_PERSONAL_TABLE, SUB_GR_REQUEST_REPLY, dataBuilder.getData());
        }
    },
	// 请求结果
	recCancelRoomResult: function (data) {
        var dataParser = new DataParser();
        dataParser.init(data);

        var parseData = dataParser.parse([
            ["dwTableID", "DWORD"],	// 当前游戏桌子号
            ["cbResult", "BYTE"]	// 请求结果
        ]);

        cc.log("服务端响应解散房间结果="+JSON.stringify(parseData));

        this.cancelRoomResult(SUB_GR_REQUEST_RESULT, parseData);
    },

    //房主长时间没有续费玩家返回大厅并弹窗显示
    noRenewBackToPlaza: function () {
        var str = "因长时间未续费，返回大厅！";
        DlgTip.openSysTip(str, this.backToPlaza);
    },

    backToPlaza: function () {
        GameKindMgr.getInstance().backPlazaScene();
    },
    
    cancelRoomResult: function (subCmd, data) {
    	switch (subCmd) {
    	case SUB_GR_CANCEL_REQUEST:	// 收到请求解散房间
    	{
    		var table = ClientData.getInstance().getTable();
    		if(!table){
    			return;
    		}

    		var player = table.getPlayerByUserId(data.dwUserID);
    		NNTBBreakRoomScene.show(player.getNickName());
    	}
    	break;
    	case SUB_GR_REQUEST_RESULT:	// 解散房间结果
    	{
    		var dlg = UIMgr.getInstance().openDlg(ID_DlgDialogScene);
    		dlg.setTitle("房间解散提示");

    		var dText = new ccui.Text();
    		dText.setContentSize(dlg.detailBg.getContentSize());
    		dText.setFontSize(48);

    		dText.string = (data.cbResult == 1)? "您已退出房间" : "有人未同意，解散失败";

    		if (data.cbResult == 1) {
                var plaza = ClientData.getInstance().getPlaza();
                if (plaza.getCurKindID() === CMD_NIUNIU_TB.KIND_ID) {
                    //清理桌子
                    var dlgPlayer = UIMgr.getInstance().getDlg(ID_NnTbDlgPlayer);
                    if (dlgPlayer) dlgPlayer.resetDlg();
                    UIMgr.getInstance().closeDlg(ID_NnTbDlgReady);
                    UIMgr.getInstance().closeDlg(ID_NnTbDlgClock);
                    UIMgr.getInstance().closeDlg(ID_NnTbDlgGetType);
                    UIMgr.getInstance().closeDlg(ID_NnTbDlgOpen);
				}
                if (plaza.getCurKindID() === CMD_SSS.KIND_ID) {
                	var dlg = UIMgr.getInstance().openDlg(ID_DlgResult);
                }
    			if(plaza.getCurKindID()!=CMD_HZMJ.KIND_ID && plaza.getCurKindID() !== CMD_NIUNIU_TB.KIND_ID) {
    				dlg.setCloseFunc(function () {
  					GameKindMgr.getInstance().backPlazaScene();
  					});
    			}
    		}
    		dlg.setDetailView(dText);
    	}
    	break;
    	}
    },

    // 同步服务端当前时间
    syncServerTime:function (data) {
        ClientData.getInstance().setDeviationTime(data.ServerTime);
        cc.log("服务端时间:"+data.ServerTime);
    },

    // 管理弹出提示窗口
    addTipDlg:function (dlg, dlgId) {
        if (!dlg || !dlgId) return
        var rootNode = dlg.getDlgWidget()
        if (rootNode){
            var dlgName = dlgId.toString()
            rootNode.setName(dlgName)
            this.tipNames.push(dlgName)
           // cc.log("-------------------弹出提示窗口 添加了:", dlgName)
        }
    },

    deleTipDlg:function (dlgId) {
        if (!dlgId) return
        var name = dlgId.toString()
        if (name.length <= 0) return
        var root = UIMgr.getInstance().getRootLayer()
        if (root){
           // cc.log("-------------------删除提示窗口了:", dlgId)
            root.removeChildByName(name, true)
        }

        var index = this.tipNames.indexOf(name)
        if(index > -1){
            this.tipNames.splice(index, 1)
            //cc.log("---------提示窗口数量：", this.tipNames.length)
        }
    },

    deleAllTipDlg:function () {
        var root = UIMgr.getInstance().getRootLayer()
        if (!root) return
        for (var i = 0; i < this.tipNames.length; i ++)
        {
            var name = this.tipNames[i]
            //cc.log("-------------------删除提示窗口:", name)
            root.removeChildByName(name, true)
        }
        this.tipNames = []
    }

});

OpenRoomMsg.getInstance = function(){
	if(g_openRoomMsg == null){
		g_openRoomMsg = new OpenRoomMsg();
	}
	return g_openRoomMsg;
}
