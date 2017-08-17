function RegistLoginFunc(event, fn) {
    g_msgMgr.getLogonSocket().addHandler(event, fn)
}

function RegistGameFunc(event, fn) {
    g_msgMgr.getGameSocket().addHandler(event, fn)
}

function RegistChatFunc(event, fn) {
    g_msgMgr.getMsgSocket().addHandler(event, fn)
}

//////////////////////// logon ///////////////////////////////////////////////

RegistLoginFunc("L2C_LogonSuccess",  LoginRegisterMsg.getInstance().onSubLogonSuccess)
RegistLoginFunc("L2C_LogonFailure", LoginRegisterMsg.getInstance().onSubLogonFailure)
RegistLoginFunc("L2C_UpdateUserAttr", LoginRegisterMsg.getInstance().onUpdateUserAttr)

RegistLoginFunc("L2C_ActivityInfo",  function(data){})

RegistLoginFunc("L2C_ServerList", ServerListMsg.getInstance().onListServer)
RegistLoginFunc("L2C_ServerListFinish", ServerListMsg.getInstance().onListFinish)

RegistLoginFunc("ShowErrCode", GameUserMsg.getInstance().onSubRequestFailure)

RegistLoginFunc("L2C_UserIndividual",UserServerMsg.getInstance().onSubUserIndividual)
RegistLoginFunc("L2C_RenewalFeesRsp",UserServerMsg.getInstance().onRestartFail)

RegistLoginFunc("L2C_DianZhanRsp",UserServerMsg.getInstance().onClickZanResult) // 点赞结果
RegistLoginFunc("L2C_BeStar", UserServerMsg.getInstance().onBaStar) // 通知被别人点赞了

RegistLoginFunc("L2C_ActivityInfo",UserServerMsg.getInstance().onGetTaskInfo)
RegistLoginFunc("L2C_GMNotice",UserServerMsg.getInstance().onGeNotice)
RegistLoginFunc("L2C_SetElectResult",UserServerMsg.getInstance().onSetElectResult)
RegistLoginFunc("L2C_SetPhoneNumberRsp",UserServerMsg.getInstance().onBindMbResult)
RegistLoginFunc("L2C_KickOut",UserServerMsg.getInstance().onHallUserKickOut)
RegistLoginFunc("L2C_ChangeUserNameRsp",UserServerMsg.getInstance().onModifyNickResult)
RegistLoginFunc("L2C_ChangeSignRsp",UserServerMsg.getInstance().onModifyUnderWriteResult)
RegistLoginFunc("L2C_ReqBindMaskCodeRsp",UserServerMsg.getInstance().onGetMbValidateResult)

RegistLoginFunc("L2C_CreatorRoomRecord",OpenRoomMsg.getInstance().onGetMyRoomListResult)
RegistLoginFunc("L2C_CreateTableFailure",OpenRoomMsg.getInstance().onSubCreateFailed)
RegistLoginFunc("L2C_CreateTableSucess",OpenRoomMsg.getInstance().onSubCreateOK)
RegistLoginFunc("L2C_DeleteRoomResult",OpenRoomMsg.getInstance().deleteRoomResult_plaza)
RegistLoginFunc("L2C_RoomPlayerBrief", OpenRoomMsg.getInstance().onRoomPlayerInfo)

RegistLoginFunc("L2C_QuickMatchOk",EnterRoomMsg.getInstance().onQuickMatchOk)
RegistLoginFunc("L2C_SearchResult",EnterRoomMsg.getInstance().onSubSearchResult)
RegistLoginFunc("L2C_GetRoomList",EnterRoomMsg.getInstance().onGetPublicRoomListResult)
RegistLoginFunc("L2C_RechangerOk", payMgr.getInstance().onL2C_RechangerOk)
RegistLoginFunc("L2C_TimeSync", OpenRoomMsg.getInstance().syncServerTime); // 服务端当前时间

//////////////////////////////// game  //////////////////////////////////////
RegistGameFunc("G2C_RoomDissume",UserServerMsg.getInstance().onRoomDissume) // 房间解散消息
RegistGameFunc("G2C_KickOut",UserServerMsg.getInstance().onGameUserKickOut)   // 断开GAme游戏服务器消息
RegistGameFunc("ShowErrCode", GameUserMsg.getInstance().onSubRequestFailure)
RegistGameFunc("G2C_LogonFinish",GameLogonMsg.getInstance().onSubLogonFinish)
RegistGameFunc("G2C_LogonFailure",GameLogonMsg.getInstance().onSubLogonFailure)
RegistGameFunc("L2C_CreateTableFailure",OpenRoomMsg.getInstance().onSubCreateFailed)
RegistGameFunc("G2C_UserSitDownRst", GameUserMsg.getInstance().onSubSitDownRst.bind(GameUserMsg.getInstance()))
RegistGameFunc("G2C_UserStatus",GameUserMsg.getInstance().onSubUserStatus.bind(GameUserMsg.getInstance())) // 绑定this !!!!!!!
RegistGameFunc("G2C_PersonalTableTip",OpenRoomMsg.getInstance().personalTableTip)
RegistGameFunc("G2C_StatusFree",GameFrameMsg.getInstance().onSubGFGameScene)
RegistGameFunc("G2C_StatusPlay",GameFrameMsg.getInstance().onSubGFGameScenePlay)
RegistGameFunc("G2C_GameStatus",g_gameFrameMsg.onSubGFGameStatus)
RegistGameFunc("G2C_ConfigServer",GameConfigMsg.getInstance().onSubConfigServer)
RegistGameFunc("G2C_ConfigFinish",GameConfigMsg.getInstance().onSubConfigFinish)
RegistGameFunc("G2C_UserEnter",GameUserMsg.getInstance().onSubUserEnter)
RegistGameFunc("G2C_Hu_Data", function(data){cc.log("read G2C_Hu_Data", data)}) //没处理
RegistGameFunc("G2C_Record",function(data){cc.log("read G2C_Record", data)})//没处理
RegistGameFunc("G2C_HZMJ_Trustee",function(data){cc.log("read G2C_HZMJ_Trustee", data)})//没处理
RegistGameFunc("SysMsg",GameFrameMsg.getInstance().onSubGFSystemMessage)
RegistGameFunc("G2C_CancelTable",OpenRoomMsg.getInstance().OnCancelTable)
RegistGameFunc("G2C_PersonalTableEnd",OpenRoomMsg.getInstance().OnPersonalTableEnd)
RegistGameFunc("G2C_RenewalFeesSuccess", OpenRoomMsg.getInstance().onRenewalFeesSuccess)//游戏续费成功
RegistGameFunc("G2C_GameChart_ToAll", GameFrameMsg.getInstance().onSubGFUserChat)

//解散房间
RegistGameFunc("G2C_ReplyRsp",OpenRoomMsg.getInstance().onG2C_ReplyRsp.bind(OpenRoomMsg.getInstance()))//别人同意或拒绝的结果通知
RegistGameFunc("G2C_LeaveRoomBradcast",OpenRoomMsg.getInstance().onG2C_LeaveRoomBradcast.bind(OpenRoomMsg.getInstance()))//别人退出房间的广播
RegistGameFunc("G2C_LeaveRoomRsp",OpenRoomMsg.getInstance().onG2C_LeaveRoomRsp)//请求退出房间结果
/*
 //请求退出房间
 type C2G_LeaveRoom struct {
 }

 //请求退出房间结果
 type G2C_LeaveRoomRsp struct {
 Code int //非0为失败
 }

 //别人退出房间的广播
 type G2C_LeaveRoomBradcast struct {
 UserID int64 //用户id
 }

 //同意还是拒绝解散房间
 type C2G_ReplyLeaveRoom struct {
 Agree bool //true是同意玩家退出， false 是拒绝
 }

 //别人同意或拒绝的结果通知
 type G2C_ReplyRsp struct {
 UserID   int64 //谁同意或者拒绝你了
 ReplyUid int64 //发起人id
 Agree    bool  //ture 是同意你了， false 是拒绝你了
 }
* */

//hzmj
RegistGameFunc("G2C_HZMG_GameStart", HzmjGameMsg.getInstance().OnSubGameStart)
RegistGameFunc("G2C_GameConclude", HzmjGameMsg.getInstance().OnSubGameEnd)
RegistGameFunc("G2C_HZMJ_SendCard", HzmjGameMsg.getInstance().OnSubSendCard)
RegistGameFunc("G2C_HZMJ_OperateNotify", HzmjGameMsg.getInstance().OnSubOperateNotify)
RegistGameFunc("G2C_HZMJ_OutCard", HzmjGameMsg.getInstance().OnSubOutCard)
RegistGameFunc("G2C_HZMJ_OperateResult", HzmjGameMsg.getInstance().OnSubOperateResult)


//sss
RegistGameFunc("G2C_SSS_StatusFree", SssGameMsg.getInstance().onSssGameFreeScene);
RegistGameFunc("G2C_SSS_StatusPlay", SssGameMsg.getInstance().onSssGamePlayScene);
RegistGameFunc("G2C_SSS_SendCard", SssGameMsg.getInstance().onGameMsgGameStart);
RegistGameFunc("G2C_SSS_Open_Card", SssGameMsg.getInstance().onGameMsgGetConbinCard);
RegistGameFunc("G2C_SSS_COMPARE", SssGameMsg.getInstance().onGameoverMsg);
RegistGameFunc("G2C_SSS_Record", SssGameMsg.getInstance().onGameMsgRecord);
// RegistGameFunc("G2C_DDZ_GameConclude", SssGameMsg.getInstance().onGameMsgGameEndddz);
// RegistGameFunc("G2C_DDZ_StatusCall", SssGameMsg.getInstance().onGameMsgStatusCall);
// RegistGameFunc("G2C_DDZ_CallScore", SssGameMsg.getInstance().onGameMsgCallScoreddz);
// RegistGameFunc("G2C_DDZ_StatusPlay", SssGameMsg.getInstance().onGameMsgGameStartd);

/////////////////////////////////// TBNN ////////////////////////////////////////
RegistGameFunc("G2C_TBNN_GameStart",  NiuniuFPGameMsg.getInstance().onGameMsgGameStart);
RegistGameFunc("G2C_TBNN_PublicCard", NiuniuFPGameMsg.getInstance().onGameMsgSendPublicCard);
RegistGameFunc("G2C_TBNN_SendCard",   NiuniuFPGameMsg.getInstance().onGameMsgSendCard);
RegistGameFunc("G2C_TBNN_CallScore",   NiuniuFPGameMsg.getInstance().onGameMsgCallScore);
RegistGameFunc("G2C_TBNN_CallScoreEnd",   NiuniuFPGameMsg.getInstance().onGameMsgResultCallScore);
RegistGameFunc("G2C_TBNN_AddScore",   NiuniuFPGameMsg.getInstance().onGameMsgAddScore);
RegistGameFunc("G2C_TBNN_LastCard",   NiuniuFPGameMsg.getInstance().onGameMsgSendLastCard);
RegistGameFunc("G2C_TBNN_Open_Card",   NiuniuFPGameMsg.getInstance().onGameMsgOpenCard);
RegistGameFunc("G2C_TBNN_CalScore",   NiuniuFPGameMsg.getInstance().onGameMsgGameEnd);
RegistGameFunc("G2C_TBNN_GameEnd",   NiuniuFPGameMsg.getInstance().onGameMsgOneEnd);

RegistGameFunc("G2C_PKCOMMON_StatusFree",  NiuniuFPGameMsg.getInstance().onGameSceneMsg.bind(NiuniuFPGameMsg.getInstance()));
RegistGameFunc("G2C_PKCOMMON_StatusPlay",  NiuniuFPGameMsg.getInstance().onGameSceneMsg.bind(NiuniuFPGameMsg.getInstance()));





///////////////////////////////////ddz //////////////////////////////////////////
RegistGameFunc("G2C_DDZ_StatusFree", DdzGameMsg.getInstance().onGameSceneMsgFree); 
RegistGameFunc("G2C_DDZ_GameStart", DdzGameMsg.getInstance().onGameMsgGameStartddz); 
RegistGameFunc("G2C_DDZ_BankerInfo", DdzGameMsg.getInstance().onGameMsgBankerInfo); 
RegistGameFunc("G2C_DDZ_GameConclude", DdzGameMsg.getInstance().onGameMsgGameEndddz);
RegistGameFunc("G2C_DDZ_StatusCall", DdzGameMsg.getInstance().onGameMsgStatusCall); 
RegistGameFunc("G2C_DDZ_CallScore", DdzGameMsg.getInstance().onGameMsgCallScore);
RegistGameFunc("G2C_DDZ_PassCard", DdzGameMsg.getInstance().onGameMsgPassCard);
RegistGameFunc("G2C_DDZ_OutCard", DdzGameMsg.getInstance().onGameMsgSendCardddz); 
RegistGameFunc("G2C_DDZ_StatusPlay", DdzGameMsg.getInstance().onGameMsgStatusPlay);
RegistGameFunc("G2C_DDZ_TRUSTEE", DdzGameMsg.getInstance().onGameMsgTrustee);         
RegistGameFunc("G2C_DDZ_ShowCard", DdzGameMsg.getInstance().onGameMsgopende);         
/////////////////////////////////// chat ////////////////////////////////////////
RegistChatFunc("ShowErrCode", GameUserMsg.getInstance().onSubRequestFailure)



/////////////////////////////////// ZPMJ ////////////////////////////////////////
RegistGameFunc("G2C_ZPMG_GameStart", ZpmjGameMsg.getInstance().OnSubGameStart)        // 游戏开始
RegistGameFunc("G2C_MJZP_ReplaceCard", ZpmjGameMsg.getInstance().OnSubDispatchFlower)   // 开局or抓牌 (补花)
RegistGameFunc("G2C_ZPMJ_OutCard",  ZpmjGameMsg.getInstance().OnSubOutCard)          // 用户出牌
RegistGameFunc("G2C_ZPMJ_SendCard", ZpmjGameMsg.getInstance().OnSubSendCard)         // 发牌消息
RegistGameFunc("G2C_MJZP_OperateNotify", ZpmjGameMsg.getInstance().OnSubOperateNotify)    // 打出一张牌的时候通知
RegistGameFunc("G2C_ZPMJ_OperateResult", ZpmjGameMsg.getInstance().OnSubOperateResult)    // 操作结果（吃碰杠胡）
RegistGameFunc("G2C_MJZP_ListenCard", ZpmjGameMsg.getInstance().OnSubListenOperat)     // 听牌的操作结果（其他用户（包括自己）告诉我，他听牌)
RegistGameFunc("G2C_ZPMJ_HuData", ZpmjGameMsg.getInstance().OnTingHuCard)          // 后台告诉我听牌了
RegistGameFunc("G2C_ZPMJ_Trustee", ZpmjGameMsg.getInstance().onGameTrustee)         // 用户托管or取消托管 操作
RegistGameFunc("G2C_ZPMJ_GameConclude", ZpmjGameMsg.getInstance().OnSubGameEnd)          // 游戏结束
RegistGameFunc("G2C_MJZP_NotifiChaHua", ZpmjGameMsg.getInstance().onSubNotifyShowInsertFlowerUI)  // 通知显示插花界面
RegistGameFunc("G2C_MJZP_UserCharHua", ZpmjGameMsg.getInstance().OnSubInsetFlowerCount)  // 广播游戏插花结果


//test
RegistGameFunc("G2C_GameStart", ZpmjGameMsg.getInstance().OnSubGameStart)        // 游戏开始
RegistGameFunc("G2C_MJXS_ReplaceCardRsp", ZpmjGameMsg.getInstance().OnSubDispatchFlower)   // 开局or抓牌 (补花)
//RegistGameFunc("G2C_GameConclude", ZpmjGameMsg.getInstance().OnSubGameEnd)          // 游戏结束
RegistGameFunc("G2C_SendCard", ZpmjGameMsg.getInstance().OnSubSendCard)         // 发牌消息
RegistGameFunc("G2C_OutCard",  ZpmjGameMsg.getInstance().OnSubOutCard)          // 用户出牌
RegistGameFunc("G2C_OperateResult", ZpmjGameMsg.getInstance().OnSubOperateResult)    // 操作结果（吃碰杠胡）
RegistGameFunc("G2C_OperateNotify", ZpmjGameMsg.getInstance().OnSubOperateNotify)    // 打出一张牌的时候通知


/////////////////////////////////// YXMJ ////////////////////////////////////////
// RegistGameFunc("G2C_ZPMG_GameStart", YxmjGameMsg.getInstance().OnSubGameStart)        // 游戏开始
// RegistGameFunc("G2C_MJZP_ReplaceCard", YxmjGameMsg.getInstance().OnSubDispatchFlower)   // 开局or抓牌 (补花)
// RegistGameFunc("G2C_ZPMJ_OutCard",  YxmjGameMsg.getInstance().OnSubOutCard)          // 用户出牌
// RegistGameFunc("G2C_ZPMJ_SendCard", YxmjGameMsg.getInstance().OnSubSendCard)         // 发牌消息
// RegistGameFunc("G2C_MJZP_OperateNotify", YxmjGameMsg.getInstance().OnSubOperateNotify)    // 打出一张牌的时候通知
// RegistGameFunc("G2C_ZPMJ_OperateResult", YxmjGameMsg.getInstance().OnSubOperateResult)    // 操作结果（吃碰杠胡）
// RegistGameFunc("G2C_MJZP_ListenCard", YxmjGameMsg.getInstance().OnSubListenOperat)     // 听牌的操作结果（其他用户（包括自己）告诉我，他听牌)
// RegistGameFunc("G2C_ZPMJ_HuData", YxmjGameMsg.getInstance().OnTingHuCard)          // 后台告诉我听牌了
// RegistGameFunc("G2C_ZPMJ_Trustee", YxmjGameMsg.getInstance().onGameTrustee)         // 用户托管or取消托管 操作
// RegistGameFunc("G2C_ZPMJ_GameConclude", YxmjGameMsg.getInstance().OnSubGameEnd)          // 游戏结束
// //RegistGameFunc("G2C_GameConclude", YxmjGame.getInstance().OnSubGameEnd)          // 游戏结束
// RegistGameFunc("G2C_MJZP_NotifiChaHua", YxmjGameMsg.getInstance().onSubNotifyShowInsertFlowerUI)  // 通知显示插花界面
// RegistGameFunc("G2C_MJZP_UserCharHua", YxmjGameMsg.getInstance().OnSubInsetFlowerCount)  // 广播游戏插花结果
