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
RegistLoginFunc("ShowErrCode", GameUserMsg.getInstance().onSubRequestFailure)
RegistLoginFunc("L2C_LogonSuccess",  LoginRegisterMsg.getInstance().onSubLogonSuccess)
RegistLoginFunc("L2C_LogonFailure", LoginRegisterMsg.getInstance().onSubLogonFailure)
RegistLoginFunc("L2C_ServerList", ServerListMsg.getInstance().onListServer)
RegistLoginFunc("L2C_ServerListFinish", ServerListMsg.getInstance().onListFinish)
RegistLoginFunc("L2C_SearchResult",EnterRoomMsg.getInstance().onSubSearchResult)
RegistLoginFunc("L2C_UserIndividual",GameFrameMsg.getInstance().onSubUserIndividual)
RegistLoginFunc("L2C_CreateTableFailure",OpenRoomMsg.getInstance().onSubCreateFailed)
RegistLoginFunc("L2C_CreateTableSucess",OpenRoomMsg.getInstance().onSubCreateOK)


//////////////////////////////// game  //////////////////////////////////////
RegistGameFunc("ShowErrCode", GameUserMsg.getInstance().onSubRequestFailure)
RegistGameFunc("G2C_LogonFinish",GameLogonMsg.getInstance().onSubLogonFinish)
RegistGameFunc("G2C_LogonFailur",GameLogonMsg.getInstance().onSubLogonFailure)
RegistGameFunc("L2C_CreateTableFailure",OpenRoomMsg.getInstance().onSubCreateFailed)
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
RegistGameFunc("G2C_LoadRoomOk",OpenRoomMsg.getInstance().OnGameServerCreateOK)
//hzmj
RegistGameFunc("G2C_HZMG_GameStart", HzmjGameMsg.getInstance().OnSubGameStart)
RegistGameFunc("G2C_HZMJ_GameConclude", HzmjGameMsg.getInstance().OnSubGameEnd)
RegistGameFunc("G2C_HZMJ_SendCard", HzmjGameMsg.getInstance().OnSubSendCard)
RegistGameFunc("G2C_HZMJ_OperateNotify", HzmjGameMsg.getInstance().OnSubOperateNotify)
RegistGameFunc("G2C_HZMJ_OutCard", HzmjGameMsg.getInstance().OnSubOutCard)
RegistGameFunc("G2C_HZMJ_OperateResult", HzmjGameMsg.getInstance().OnSubOperateResult)
RegistGameFunc("G2C_GameChart_ToAll", GameFrameMsg.getInstance().onSubGFUserChat)

/////////////////////////////////// TBNN ////////////////////////////////////////
RegistGameFunc("G2C_TBNN_GameStart",  NiuniuFPGameMsg.getInstance().onGameMsgGameStart);
RegistGameFunc("G2C_TBNN_StatusFree",  NiuniuFPGameMsg.getInstance().onGameSceneMsg.bind(NiuniuFPGameMsg.getInstance()));
RegistGameFunc("G2C_TBNN_PublicCard", NiuniuFPGameMsg.getInstance().onGameMsgSendPublicCard);
RegistGameFunc("G2C_TBNN_SendCard",   NiuniuFPGameMsg.getInstance().onGameMsgSendCard);
RegistGameFunc("G2C_TBNN_CallScore",   NiuniuFPGameMsg.getInstance().onGameMsgCallScore);
RegistGameFunc("G2C_TBNN_CallScoreEnd",   NiuniuFPGameMsg.getInstance().onGameMsgResultCallScore);
RegistGameFunc("G2C_TBNN_AddScore",   NiuniuFPGameMsg.getInstance().onGameMsgAddScore);
RegistGameFunc("G2C_TBNN_LastCard",   NiuniuFPGameMsg.getInstance().onGameMsgSendLastCard);
RegistGameFunc("G2C_TBNN_Open_Card",   NiuniuFPGameMsg.getInstance().onGameMsgOpenCard);





/////////////////////////////////// chat ////////////////////////////////////////
RegistChatFunc("ShowErrCode", GameUserMsg.getInstance().onSubRequestFailure)


