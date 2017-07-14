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
	ctor: function(){},
	
	onMsgMainPCMBOpenRoom: function(subCmd, data){
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

	OnCancelTable:function (data) {
        var dlg = UIMgr.getInstance().openDlg(ID_DlgDialogScene);
        dlg.setTitle("房间解散提示");

        var dText = new ccui.Text();
        dText.setContentSize(dlg.detailBg.getContentSize());
        dText.setFontSize(48);

        dText.string = "您已退出房间";

        dlg.setCloseFunc(function () {
            GameKindMgr.getInstance().backPlazaScene();
        });
        dlg.setDetailView(dText);
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
		if(g_objHero.getScore()==0){
			g_objHero.setScore(data.IniScore);
		}

		var plaza = ClientData.getInstance().getPlaza();
		if(data.IsGoldOrGameScore==1)
			plaza.setCurGameType(GAME_GENRE_PERSONAL);//金币场还是积分场 0 标识 金币场 1 标识 积分场
		else
			plaza.setCurGameType(GAME_GENRE_GOLD);//金币场还是积分场 0 标识 金币场 1 标识 积分场
	},
	
	//创建房间失败
	onSubCreateFailed: function(data){
		//关闭游戏服务器
			g_gameSocket.close();
			cc.log("--------g_gameSocket.close()---------");

		//提示界面
        DlgTip.openSysTip(data.DescribeString + "error : " + data.ErrorCode);
		showWaiting(false);
	},
	
	//登录服创建成功创建房间成功
	onSubCreateOK: function(data){
        g_objHero.setRoomID(data.TableID);

        var obj = data.ServerIP.split( ":")
        MsgMgr.getInstance().connectGameServer(obj[0], obj[1]);
	},

	SendToGameServerCreater: function () {
		g_gameSocket.sendData("C2G_LoadRoom", {
            RoomID:g_objHero.getRoomID()
		})
    },

	OnGameServerCreateOK :function (data) {
        g_objHero.setChairID(0);

        //g_objHero.setMoney(data.Beans);
        g_objHero.setRoomCard(data.RoomCard);
        g_objHero.dwDrawCountLimit = data.DrawCountLimit;
        g_objHero.dwDrawTimeLimit = data.DrawTimeLimit;

        //
        showWaiting(false);
        PlazaUIMgr.getInstance().onOpenRoomOK();
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
	
	//发送创建房间
	sendCreateRoom: function(data){
		//游戏规则 弟 0 位标识 是否设置规则 0 代表未设置 1 代表设置
        var plaza = ClientData.getInstance().getPlaza();
        var listServer = plaza.getListServerByKindID(plaza.getCurKindID());
        var roomServerInfo = listServer[0];
        g_logonSocket.sendData("C2L_CreateTable", {
			CellScore: data.dwBaseScore,						    //底分设置
			DrawCountLimit:data.dwRounds,					//局数限制
			DrawTimeLimit:0,					//时间限制
			JoinGamePeopleCount:CMD_HZMJ.GAME_PLAYER,			//参与游戏的人数
			Password:"",	//密码设置
            Kind:  plaza.getCurKindID(),
            ServerId : roomServerInfo.wServerID,
            PayType:data.settlementType,  //1是自己付钱， 2是AA
		});

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
		g_gameSocket.sendData("C2G_HostlDissumeRoom",{});
	},
	
	// 客户端发送请求解散房间
	sendCancelRoom: function () {
		
		var dataBuilder = new DataBuilder();
		dataBuilder.init(12);

		dataBuilder.build([
			["dwUserID", "DWORD", g_objHero.getUserId()],	// 当前登陆者ID
			["dwTableID", "DWORD", g_objHero.getTableId()],		// 当前游戏桌子号
			["dwChairID", "DWORD", g_objHero.getChairID()]	// 当前椅子号
		]);

		cc.log("发送请求解散房间参数{dwUserID："+g_objHero.getUserId()+",dwTableID:"+g_objHero.getTableId()+",dwChairID:"+g_objHero.getChairID()+"}");
		if (g_gameSocket.status == SOCKET_STATUS._SS_CONNECTED) {
			g_gameSocket.sendData(MDM_GR_PERSONAL_TABLE, SUB_GR_CANCEL_REQUEST, dataBuilder.getData());
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
        GameUserMsg.getInstance().sendStandUp(true);
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
  					GameUserMsg.getInstance().sendStandUp(true);
  					GameKindMgr.getInstance().backPlazaScene();
  					});
    			}
    		}
    		dlg.setDetailView(dText);
    	}
    	break;
    	}
    }
});

OpenRoomMsg.getInstance = function(){
	if(g_openRoomMsg == null){
		g_openRoomMsg = new OpenRoomMsg();
	}
	return g_openRoomMsg;
}
