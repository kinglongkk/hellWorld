/*
 * 大厅界面 UI管理
 * Author: 	xjn 
 * Date:	2017.4.1
 * 
 * 功能：
 * 大厅控件操作支持
 * */
var s_sharedPlazaUIMgr = null;

var PlazaUIMgr = SceneUIMgr.extend({

    startGame: function () {
        cc.log("---------------------PlazaUIMgr:startGame()-------------------");
        cc.log(this._bInit);
        if(!this._bInit){
            return;
        }

        var dlgPlaza = UIMgr.getInstance().openDlg(ID_DlgPlaza);
        //dlgPlaza.requestNewMail();

        //首次登录
		/*var bFirstLogin = ClientData.getInstance().isLogonFirst();
		 if(bFirstLogin){
		 PlazaUIMgr.getInstance().querySignInInfo();
		 }*/


        var plaza = ClientData.getInstance().getPlaza();
        if(plaza){
            var gameList = GameKindMgr.getInstance().getGameList();
            var defaultKindID = gameList[0].gameKindId;
            cc.log("--------------PlazaUIMgrs 设置 defaultKindID---="+defaultKindID);
            plaza.setCurKindID(defaultKindID);	//设置初始游戏ID
            plaza.setCurGameType(GAME_GENRE_PERSONAL);

            LocalStorageMgr.getInstance().setLeaveCounts(0);
        }

        g_objHero.addListenerChangeMoney(function(even){
            PlazaUIMgr.getInstance().updateHeroMoney();
        });
    },

    getName: function(){
        cc.log("###name : LoginSceneUIMgr!");
    },

    updateHeroMoney: function(){
        if(!this._bInit){
            return;
        }

        var dlgPlaza = UIMgr.getInstance().getDlg(ID_DlgPlaza);
        if(dlgPlaza){
            dlgPlaza.updateDlg();
        }
    },

    enterGame: function(gameKindId){
        var plaza = ClientData.getInstance().getPlaza();
        if(plaza){
            var listServer = plaza.getListServerByKindID(gameKindId);
            if(listServer && listServer.length > 0){
                plaza.setCurKindID(gameKindId);

                var dlgPlaza = UIMgr.getInstance().getDlg(ID_DlgMoreGame);
                if (dlgPlaza) {
                    dlgPlaza.openRoomList(gameKindId);
                }
            }else{
                DlgTip.openTip(DLG_TIP_CFG.GAME_NULL);
            }
        }


        //更新在线数据请求
        var serverCount = plaza.getServerCountByKindID(gameKindId);
        if(serverCount > 0){
            var server = plaza.getListServerByKindID(gameKindId);
            var serverId = [];
            for(var i=0; i<serverCount; i++){
                serverId.push(server[i].wServerID);
            }

            var data = {
                wServerCount: serverCount,
                wOnLineServerID: serverId,
            };

            LogonMsgHandler.getInstance().connect(function(){
                ServerListMsg.getInstance().sendUpdateOnLineReq(data);
            });
        }
    },

    connectGameServer: function(ip, port){
//		if(!this._bInit){
//		cc.log("--链接游戏服务器---return---------");
//		return;
//		}

        cc.log("----------plazaUIMmr 链接游戏服务器------------");
        MsgMgr.getInstance().connectGameServer(ip, port);

        //
        UIMgr.getInstance().openDlg(ID_DlgLoader);
        var dlgLoader = UIMgr.getInstance().getDlg(ID_DlgLoader);
        if(dlgLoader){
            dlgLoader.setProgress(10);

            dlgLoader.setFinishCallBack(function(){
                UIMgr.getInstance().closeDlg(ID_DlgLoader);
                cc.log("----------------链接游戏服务器完成  进入游戏场景 GameKindMgr.getInstance().runGameScene()------------");
                GameKindMgr.getInstance().runGameScene();
                cc.log("---setProgress 100%---runGameScene()------------");
            }.bind(this));

            dlgLoader.setTimeOutCallBack(function(){
                //保证游戏socket是关闭状态
                if(g_gameSocket.status != SOCKET_STATUS._SS_INVALID){
                    MsgMgr.getInstance().closeGameSocket()
                    cc.log("--------g_gameSocket.close()---------");
                }

                DlgTip.openTip(DLG_TIP_CFG.LOGON_OUT_TIME, function(target){
                    //UIMgr.getInstance().openDlg(ID_DlgLogin);
                    target.closeTip();
                });
            }, 20);
        }
    },

    //连接游戏服务器
    onConnectGameResult: function(bResult){
        if(!this._bInit){
            return;
        }

        //链接成功
        if(bResult){
            var dlgLoader = UIMgr.getInstance().getDlg(ID_DlgLoader);
            if(dlgLoader) {
                //连接游戏服务器
                dlgLoader.setProgress(25);
            }
            cc.log("--链接游戏服务器--成功----------");
            //直接登录游戏服务器
            GameLogonMsg.getInstance().sendLogon();
        }else{
            cc.log("--链接游戏服务器--失败----------");
            if(curGameType!=1){
                DlgTip.openTip(DLG_TIP_CFG.CONNECT_SERVER_FAILURE, function(target){
                    UIMgr.getInstance().closeDlg(ID_DlgLoader);
                    target.closeTip();
                });
            }
            else{
                DlgTip.openTip(DLG_TIP_CFG.CONNECT_SERVER_FAILURE, function(target){
                    target.closeTip();
                });
            }

            var plaza = ClientData.getInstance().getPlaza();
            var curGameType = plaza.getCurGameType();	//设置游戏类型 1：房卡 其他：金币

            if(curGameType==GAME_GENRE_PERSONAL){
                var roomOpType = plaza.getRoomOpType();
                if(roomOpType!=ROOM_OPERATION_CREATE){
                    //查询房间  失败
                    var dlgEnterRoom = UIMgr.getInstance().getDlg(ID_DlgEnterRoom);
                    if(dlgEnterRoom){
                        dlgEnterRoom.doClear();
                    }
                }
            }
        }
    },

    //房间配置
    onConfigServer: function(){
        if(!this._bInit){
            return;
        }

        cc.log("--房间配置----------");
        var dlgLoader = UIMgr.getInstance().getDlg(ID_DlgLoader);
        if(dlgLoader){
            dlgLoader.setProgress(40);
        }
    },

    //配置完成
    onConfigFinish: function(){
        if(!this._bInit){
            return;
        }
        cc.log("--配置完成----------");
        var dlgLoader = UIMgr.getInstance().getDlg(ID_DlgLoader);
        if(dlgLoader){
            dlgLoader.setProgress(60);
        }
    },

    //登录完成
    onLogonFinish: function(){
        // if(!this._bInit){
        // 	return;
        // }
        cc.log("--登录完成----------");
        //获取游戏类型
        var plaza = ClientData.getInstance().getPlaza();
        var curGameType = plaza.getCurGameType();	//设置游戏类型 1：房卡 其他：金币

        if(curGameType==GAME_GENRE_PERSONAL){
            g_objHero.setLockInfo({
                lRoomCard: g_objHero.getLockInfo().lRoomCard,
                dwLockServerID: 0,
                dwKindID: 0,
            });
            var roomOpType = plaza.getRoomOpType();
            if(roomOpType==ROOM_OPERATION_CREATE){
                //创建房间
                cc.log("--创建房间 第二步 发送创建房间------------");
                //this.onSendOpenRoom();
            }
            else{
                var status = g_objHero.getStatus();
                cc.log("--加入房间第二步--坐下---------status---"+status);
                var serverType = null;
                var room = ClientData.getInstance().getRoom();
                if(room){
                    serverType = room.getServerType();
                }

                var plaza = ClientData.getInstance().getPlaza();
                var roomOpType = plaza.getRoomOpType();

                //空闲状态
                if(status <= US_FREE)
                {
                    //坐下
                    var data = {
                        TableID: g_objHero.getTableId(),
                        ChairID: INVALID_CHAIR,
                        Password: "",
                    };
                    cc.log("case Button_add: tableID"+g_objHero.getTableId());
                    GameUserMsg.getInstance().sendUserSitDown(data);
                    // UIMgr.getInstance().openDlg(ID_DlgLoader);

                }

                //请求游戏规则
                GameFrameMsg.getInstance().sendGameOption();

                var dlgLoader = UIMgr.getInstance().getDlg(ID_DlgLoader);
                if(dlgLoader){
                    dlgLoader.setProgress(85);
                }
            }
        }
        else{
            var dlgLoader = UIMgr.getInstance().getDlg(ID_DlgLoader);
            if(dlgLoader){
                var room = ClientData.getInstance().getRoom();
                if(room){
                    var serverType = room.getServerType();
                    //比赛
                    if( (serverType & GAME_GENRE_MATCH) != 0){
                        dlgLoader.setProgress(100);
                    }else{
                        dlgLoader.setProgress(75);
                    }
                }
            }
        }
    },

    //请求失败(坐下)
    onRequestFailure: function(){
        //保证游戏socket是关闭状态
        if(g_gameSocket.status != SOCKET_STATUS._SS_INVALID){
            g_gameSocket.close();
            cc.log("--------g_gameSocket.close()---------");
        }

        UIMgr.getInstance().closeDlg(ID_DlgLoader);

        var plaza = ClientData.getInstance().getPlaza();
        var curGameType = plaza.getCurGameType();	//设置游戏类型 1：房卡 其他：金币
        if(curGameType==GAME_GENRE_PERSONAL){
            var roomOpType = plaza.getRoomOpType();
            if(roomOpType!=ROOM_OPERATION_CREATE){
                //查询房间  失败
                var dlgEnterRoom = UIMgr.getInstance().getDlg(ID_DlgEnterRoom);
                if(dlgEnterRoom){
                    dlgEnterRoom.doClear();
                }
            }
        }
    },

    //进入游戏场景
    onEnterGameScene: function(){
        if(!this._bInit){
            return;
        }

        cc.log("--进入游戏场景------------");
        var dlgLoader = UIMgr.getInstance().getDlg(ID_DlgLoader);
        if(dlgLoader){
            var room = ClientData.getInstance().getRoom();
            if(room){
                var serverType = room.getServerType();
                if( (serverType & GAME_GENRE_MATCH) == 0){
                    dlgLoader.setProgress(100);
                }
            }
        }
    },

    //坐下
    onSitDown: function(){
        if(!this._bInit){
            return;
        }
    },

    //登录游戏服务器失败
    onLogonGameFailure: function(){
        if(!this._bInit){
            return;
        }

        UIMgr.getInstance().closeDlg(ID_DlgLoader);

        var plaza = ClientData.getInstance().getPlaza();
        var curGameType = plaza.getCurGameType();	//设置游戏类型 1：房卡 其他：金币
        if(curGameType==GAME_GENRE_PERSONAL){
            var roomOpType = plaza.getRoomOpType();
            if(roomOpType!=ROOM_OPERATION_CREATE){
                //查询房间  失败
                var dlgEnterRoom = UIMgr.getInstance().getDlg(ID_DlgEnterRoom);
                if(dlgEnterRoom){
                    dlgEnterRoom.doClear();
                }
            }
        }
    },

    //成功登录保险柜
    onInsureLogonSuccess: function(){
        if(!this._bInit){
            return;
        }

        var dlgInsure = UIMgr.getInstance().getDlg(ID_DlgInsure);
        if(dlgInsure){
            dlgInsure.logonSuccess();
        }
    },

    //修改身份成功（姓名、身份证）
    onModifyAuthSucc: function(){
        UIMgr.getInstance().closeDlg(ID_DlgAuth);
    },

    //修改密码成功
    onModifyLogonPassSucc: function(){
        UIMgr.getInstance().closeDlg(ID_DlgModifyPass);
    },

    updateInsureInfo: function(){
        if(!this._bInit){
            return;
        }

        var dlgInsure = UIMgr.getInstance().getDlg(ID_DlgInsure);
        if(dlgInsure){
            dlgInsure.updateInfo();
        }
    },

    //赠送确认
    onTransferScore: function(targetName, gameId){
        if(!this._bInit){
            return;
        }

        var dlgInsure = UIMgr.getInstance().getDlg(ID_DlgInsure);
        if(dlgInsure){
            dlgInsure.giveScore(targetName, gameId);
        }
    },

    onUpdateRecord: function(){
        if(!this._bInit){
            return;
        }

        var dlgInsure = UIMgr.getInstance().getDlg(ID_DlgInsure);
        if(dlgInsure){
            dlgInsure.onUpdateRecord();
        }
    },
    //发送创建房间
    onOpenRoom: function(data){
        OpenRoomMsg.getInstance().sendCreateRoom(data);
    },
    //创建房间 成功
    onOpenRoomOK: function(roomID){
        cc.log("--创建房间 成功------------");

        var strTitle = "创建房间成功";
        var strContent = "房间号:"+roomID+"\n\r"+"快快邀请好友加入";
        //创建房间成功提示
        var tip = null;
        var self = this;
        tip = DlgTip.openCreateRoomTip(strTitle,strContent,function(){
            //邀请好友回调
            var target = WXShare.SHARE_TARGET_FRIEND;
            var url = _CONFIG_.URL_PART1_INVITE+g_objHero.getUserId()+"-"+"room-"+g_objHero.getRoomID()+_CONFIG_.URL_PART2;
            var title = "一键约局，等你来战";
            var description = "玩游戏，找老友，（房间号："+g_objHero.getRoomID()+"），我就在家乡麻雀游，你呢老友？";
            WXShare.getInstance().shareURL(target, url, title, description, function(){
                WXShare.getInstance().showSysTip("---邀请好友成功---");
            });
        },function(){
            //加入房间
            self.onEnterRoom(roomID);
            tip.closeTip();
        });
    },
    //快速加入
    onQuickEnter: function(){
        //获取当前kindID
        var plaza = ClientData.getInstance().getPlaza();
        //发送房间查询
        LogonMsgHandler.getInstance().send("C2L_QuickMatch",{
            KindID: plaza.getCurKindID()
        });

        //showWaiting(true);
    },

    //加入房间
    onEnterRoom: function(roomID){
        cc.log("--加入房间第一步--发送房间查询------------");
        //获取当前kindID
        var plaza = ClientData.getInstance().getPlaza();
        //发送房间查询
        LogonMsgHandler.getInstance().send("C2L_SearchServerTable",{
            TableID: parseInt(roomID),
            KindID: 0//plaza.getCurKindID()
        });

    },
    //加入房间 结果
    onEnterRoomResult: function(isResult, serverAddr){
        if(!isResult){
            //查询房间  失败
            cc.log("--查询房间  失败 ------------");
            var dlgEnterRoom = UIMgr.getInstance().getDlg(ID_DlgEnterRoom);
            if(dlgEnterRoom){
                dlgEnterRoom.doClear();
            }

            return;
        }
        cc.log("--加入房间结果  连接服务器------------");
        //连接服务器
        var plaza = ClientData.getInstance().getPlaza();
        plaza.setRoomOpType(ROOM_OPERATION_ADD);

        var kindId = plaza.getCurKindID();
        var listServer = plaza.getListServerByKindID(kindId);
        var roomServerInfo = listServer[0];

        var room = ClientData.getInstance().getRoom();
        if(room){
            room.setCurServer(roomServerInfo);
        }

        var addr = serverAddr.split(":")
        this.connectGameServer(addr[0], addr[1]);
    },

    doGetPublicRoomList: function(curListCounts){
        cc.log("--获取房间列表------------");
        var curNum = curListCounts;
        if(curNum>60){
            curNum = 60;
        }

        //获取当前kindID
        var plaza = ClientData.getInstance().getPlaza();
        //发送房间查询
        LogonMsgHandler.getInstance().send("C2L_GetRoomList",{
            KindID: plaza.getCurKindID(),
            Num: curNum
        });

    },
    getPublicRoomListResult: function(data){
        var dlgEnterRoom = UIMgr.getInstance().getDlg(ID_DlgEnterRoom);
        if(dlgEnterRoom){
            dlgEnterRoom.doFreshRoomList(data);
        }
    },
    doGetMyselfRoomList: function(){
        //请求已开房间内记录
        LogonMsgHandler.getInstance().send("C2L_ReqCreatorRoomRecord",{});
    },
    getMyselfRoomListResult: function(data){
        var dlgRoomRecord = UIMgr.getInstance().getDlg(ID_DlgRoomRecord);
        if(dlgRoomRecord){
            dlgRoomRecord.doFreshRoomList(data);
        }
    },

    doDelRoom: function(roomID){
        LogonMsgHandler.getInstance().send("C2L_ReqCreatorRoomRecord",{});
    },
    doDissolutionRoom: function(roomID){
        OpenRoomMsg.getInstance().send_C2G_LeaveRoom();
    },

    //修改头像
    onModifyFace: function(){
        if(!this._bInit){
            return;
        }

        var dlgPlaza = UIMgr.getInstance().getDlg(ID_DlgPlaza);
        if(dlgPlaza){
            dlgPlaza.updateDlg();
        }

        var dlgPlazaUserInfo = UIMgr.getInstance().getDlg(ID_DlgPlazaUserInfo);
        if(dlgPlazaUserInfo){
            dlgPlazaUserInfo.updateDlg();
        }
    },

    //获取个人信息
    ongetPlayerInfo:function(PlayerID){
        if(PlayerID && PlayerID!=g_objHero.getUserId()){
            var MeUserID =g_objHero.getUserId();
            var DlgUserInfo =UIMgr.getInstance().getDlg(ID_DlgUserInfo);
            if(MeUserID!=PlayerID)
            {
                DlgUserInfo.Button_bindPhone.setVisible(false);
                DlgUserInfo.Button_recommender.setVisible(false);
            }
            else{
                DlgUserInfo.Button_bindPhone.setVisible(true);
                DlgUserInfo.Button_recommender.setVisible(true);
            }
        }
        var data = {
            dwUserID:PlayerID,
        };
        console.log("sendQuerySignInInfo(data)");
        UserServerMsg.getInstance().sendQueryIndividual(data);
    },

    //获取签到信息
    querySignInInfo: function(){
        var data = {
            dwUserID: g_objHero.getUserId(),
            cbDeviceType: DEVICE_TYPE
        };
        console.log("sendQuerySignInInfo(data)");
        LogonMsgHandler.getInstance().connect(function(){
            SignInMsg.getInstance().sendQuerySignInInfo(data);
        });

    },

    //签到信息
    onGetSignInInfo: function(){
		/*//签到提示
		 var dlgPlaza = UIMgr.getInstance().getDlg(ID_DlgPlaza);
		 if(dlgPlaza){
		 dlgPlaza.updateSignTag();
		 }

		 //判断是否打开签到界面
		 var bOpen = true;
		 var bFirstLogin = ClientData.getInstance().isLogonFirst();

		 //首次登录
		 if(bFirstLogin){
		 ClientData.getInstance().setLogonFirst(false);

		 var signIn = ClientData.getInstance().getSignIn();
		 var bSignIn = signIn.isCurDaySignIn();
		 if(bSignIn){
		 bOpen = false;
		 }
		 }

		 if(bOpen){
		 //签到
		 //var dlgSignIn = UIMgr.getInstance().openDlg(ID_DlgSignIn);
		 //dlgSignIn.onGetSignInInfo();
		 }else{
		 //延时1秒,
		 var delayTime = cc.delayTime(1);
		 var callFunc = cc.callFunc(function(){
		 //定时在线奖励
		 PlazaUIMgr.getInstance().queryTimingGiftInfo();
		 }, this);
		 var seq = cc.sequence(delayTime, callFunc);
		 this._uiLayer.runAction(seq);


		 }*/
    },

    //签到结果
    onSignInResult: function(){
		/*var dlgPlaza = UIMgr.getInstance().getDlg(ID_DlgPlaza);
		 if(dlgPlaza){
		 dlgPlaza.updateSignTag();
		 }

		 var dlgSignIn = UIMgr.getInstance().getDlg(ID_DlgSignIn);
		 if(dlgSignIn){
		 dlgSignIn.onSignInResult();
		 }*/
    },

    //查询定时礼包信息
    queryTimingGiftInfo: function(){
		/*LogonMsgHandler.getInstance().connect(function(){
		 UserServerMsg.getInstance().sendQueryTimingGiftInfo();
		 });*/

    },

    onTimingGiftInfoEnd: function(){
        //this.openDlgTimingGift();
    },

    openDlgTimingGift: function(){
		/*var timingGiftInfo = ClientData.getInstance().getTimingGiftInfo();
		 var serverTime = timingGiftInfo.getServerTime();
		 var info = null;
		 for(var i=1; i<=3; i++){
		 var state = timingGiftInfo.getState(i);
		 //已领取
		 if(state != 0){
		 continue;
		 }

		 var startTime = timingGiftInfo.getStartTime(i);
		 var endTime = timingGiftInfo.getEndTime(i);

		 //领取时段
		 if(serverTime >= startTime && serverTime <= endTime){
		 info = timingGiftInfo.getTimingGiftInfo(i);
		 }
		 }

		 if(info){
		 var dlgTimingGift = UIMgr.getInstance().openDlg(ID_DlgTimingGift);
		 dlgTimingGift.setTimingGiftInfo(info);
		 }else{
		 UIMgr.getInstance().openDlg(ID_DlgTimingGiftList);
		 }*/
    },

    onUserTaskInfoEnd: function(){
        //UIMgr.getInstance().openDlg(ID_DlgTaskList);
    },

    //data={typeID: typeID, gameKindID: gameKindID}
    onGetTaskRewardsSuccess: function(data){
        var task = ClientData.getInstance().getTask();
        task.taskComplete(data.typeID, data.gameKindID);

        //更新界面
        var addScore = LoadTaskCfg.getInstance().getTaskAddScore(data.typeID);
        //var addTicket = LoadTaskCfg.getInstance().getTaskAddTicket(data.typeID);

        var money = g_objHero.getMoney();
        money += addScore;
        g_objHero.setMoney(money);

        var ticket = g_objHero.getMbTicket();
        ticket += addTicket;
        g_objHero.setMbTicket(ticket);

        //var dlgTaskList = UIMgr.getInstance().getDlg(ID_DlgTaskList);
        //dlgTaskList.updateTaskState();

        var dlgPlaza = UIMgr.getInstance().getDlg(ID_DlgPlaza);
        if(dlgPlaza){
            dlgPlaza.updateDlg();
        }
    },

    onModifyNickSucc: function(){
        var nick = g_objHero.getNickName();
        var dlgPlaza = UIMgr.getInstance().getDlg(ID_DlgPlaza);
        if(dlgPlaza){
            dlgPlaza.updateDlg();
        }
    },
});

PlazaUIMgr.getInstance = function() {
    if (!s_sharedPlazaUIMgr) {
        s_sharedPlazaUIMgr = new PlazaUIMgr();
    }
    return s_sharedPlazaUIMgr;
};