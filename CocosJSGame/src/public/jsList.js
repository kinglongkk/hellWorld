var g_jsList = [
    //libs
    "src/libs/CryptoJS/components/core-min.js",
    "src/libs/CryptoJS/components/enc-base64-min.js",
    "src/libs/CryptoJS/components/md5-min.js",
    "src/libs/CryptoJS/components/sha256-min.js",
    "src/libs/CryptoJS/rollups/tripledes.js",
    "src/libs/CryptoJS/components/mode-ecb.js",
    "src/libs/CryptoJS/components/pad-zeropadding-min.js",

    "src/libs/cryptoUtil.js",
    "src/libs/MyUtil.js",
    "src/libs/uuid.js",
    "src/libs/js-md5.js",
    
    //public
    "src/public/resource.js",
    
    //public config
    "src/public/config/loadConfig.js",
    "src/public/config/loadFaceCfg.js",
    "src/public/config/loadTaskCfg.js",
    "src/public/config/loadWordChatCfg.js",
    "src/public/config/loadXieYiCfg.js",
    "src/public/config/loadCreateRoomCfg.js",
    "src/public/config/loadRuleCfg.js",
    "src/public/config/loadErrorCfg.js",
    "src/public/config/platform.js",
    "src/public/config/loadShopCfg.js",

    //public consts
    "src/public/consts/consts.js",
    "src/public/consts/define.js",
    "src/public/consts/cmdCommom.js",
    "src/public/consts/cmdLogonServer.js",
    "src/public/consts/cmdGameServer.js",
    "src/public/consts/cmdMsgServer.js",

    //public model
    "src/public/model/player.js",
    "src/public/model/hero.js",
    "src/public/model/card.js",
    "src/public/model/plaza.js",
    "src/public/model/insure.js",
    "src/public/model/signIn.js",
    "src/public/model/mail.js",
    "src/public/model/exAward.js",
    "src/public/model/task.js",
    "src/public/model/timingGiftInfo.js",
    "src/public/model/room.js",
    "src/public/model/match.js",
    "src/public/model/table.js",
    "src/public/model/clientData.js",
    "src/public/model/outcome.js",
    "src/public/model/nearUserInfo.js",
    //public manager
    "src/public/manager/UIMgr.js",
    "src/public/manager/sceneUIMgr.js",
    "src/public/manager/localStorageMgr.js",
    "src/public/manager/soundMgr.js",
    "src/public/manager/sendCardMgr.js",
    "src/public/manager/uiActionMgr.js",
    "src/public/manager/gameUIMgr.js",
    "src/public/manager/gameKindMgr.js",
    "src/public/manager/gameMsgMgr.js",
    "src/public/manager/keyWordsMgr.js",
    
    //public sdk
    "src/public/sdk/anysdkConst.js",
    "src/public/sdk/wxSdk/wxsdkMgr.js",
    "src/public/sdk/wxSdk/wxShare.js",
    "src/public/sdk/yayaSDK/yayaSdkMgr.js",
    "src/public/sdk/payMgr/payMgr.js",
    
    //public network
    "src/public/network/dataHelp.js",
    "src/public/network/crypto.js",
    "src/public/network/WSSocket.js",
    "src/public/network/msgMgr.js",
    "src/public/network/httpRequest.js",
    "src/public/network/networkDefine.js",
    "src/public/network/logonServer/logonMsgHandler.js",
    "src/public/network/logonServer/loginRegisterMsg.js",
    "src/public/network/logonServer/serverListMsg.js",
    "src/public/network/logonServer/userServerMsg.js",
    "src/public/network/logonServer/signInMsg.js",
    "src/public/network/logonServer/EnterRoomMsg.js",
    
    "src/public/network/gameServer/gameMsgHandler.js",
    "src/public/network/gameServer/gameLogonMsg.js",
    "src/public/network/gameServer/gameConfigMsg.js",
    "src/public/network/gameServer/gameUserMsg.js",
    "src/public/network/gameServer/gameFrameMsg.js",
    "src/public/network/gameServer/gameMatchMsg.js",
    "src/public/network/gameServer/gameUserInsureMsg.js",
    "src/public/network/gameServer/gameTaskMsg.js",
    "src/public/network/gameServer/gameMsg.js",
    "src/public/network/gameServer/openRoomMsg.js",

    "src/public/network/msgServer/cmdHander.js",
    "src/public/network/msgServer/cmd4GCUser.js",
    "src/public/network/msgServer/cmd4GCLogon.js",

    //public view
    "src/public/views/cardSprite.js",
    "src/public/views/cardGroup.js",
    "src/public/views/myClip.js",
    "src/public/views/btnOnOff.js",
    "src/public/views/horseRaceLamp.js",
    //public ui
    "src/public/ui/indexDlgId.js",
    "src/public/ui/dlgLoader.js",
    "src/public/ui/cfgDlgTip.js",
    "src/public/ui/dlgTip.js",    
    "src/public/ui/dlgGameSet.js",
    "src/public/ui/dlgGameShare.js",
    "src/public/ui/dlgGameWelfare.js",

    //"src/public/ui/dlgGameTask.js",
    //"src/public/ui/dlgGameInsure.js",
    "src/public/ui/dlgWaiting.js",  
    "src/public/ui/dlgSoundAnimation.js",
    //"src/public/ui/dlgDialogScene.js",
    "src/public/ui/dlgChatScene.js",
    "src/public/ui/dlgWordChatList.js",
    "src/public/ui/dlgGameRecordCenter.js",
    "src/public/ui/dlgUserInfo.js",
    "src/public/ui/dlgGameShop.js",
    "src/public/ui/dlgGameRule.js",
    //"src/public/ui/dlgResult.js",
    //"src/public/ui/dlgDDZScore.js",
	 "src/public/ui/hzmjDlgSettlement.js",
     "src/public/ui/dlgToast.js",

    //public sdk
    "src/public/sdk/anysdkConst.js",
    "src/public/sdk/wxSdk/wxsdkMgr.js",
    "src/public/sdk/wxSdk/wxShare.js",
    
    //login   
    "src/login/ui/indexDlgId.js",
    "src/login/ui/loginScene.js",    
    "src/login/ui/loginSceneUIMgr.js",
    "src/login/ui/dlgLogin.js",
    
    
    //plaza  
    //"src/game-plaza/network/mailHttpRequest.js",
    "src/game-plaza/ui/indexDlgId.js",
    //"src/game-plaza/ui/dlgShare.js",
    "src/game-plaza/ui/plazaScene.js",
    "src/game-plaza/ui/plazaUIMgr.js",
    "src/game-plaza/ui/dlgPlaza.js",
    "src/game-plaza/ui/dlgEnterRoom.js",
    "src/game-plaza/ui/dlgOpenRoom.js",
    "src/game-plaza/ui/dlgRoomRecord.js",
    //"src/game-plaza/ui/dlgRank.js",
    //"src/game-plaza/ui/dlgWelfare.js",
    //"src/game-plaza/ui/dlgPlazaSet.js",
    //"src/game-plaza/ui/dlgPlazaUserInfo.js",
    //"src/game-plaza/ui/dlgSignIn.js",

    //game_nnfp   新牛牛
    "src/game-nnfp/model/niuniuFP.js",
    "src/game-nnfp/model/niuniuFPGame.js",
    "src/game-nnfp/network/cmdGame.js",
    "src/game-nnfp/network/niuniuFPGameMsg.js",
    "src/game-nnfp/ui/niuniuFPScene.js",
    "src/game-nnfp/ui/niuniuFPUIMgr.js",
    "src/game-nnfp/ui/indexDlgId.js",
    "src/game-nnfp/ui/nnFpDlgPlayer.js",
    "src/game-nnfp/ui/nnFpDlgClock.js",
    "src/game-nnfp/ui/nnFpDlgOpen.js",
    "src/game-nnfp/ui/nnFpDlgReady.js",
    "src/game-nnfp/ui/nnFpDlgRobBanker.js",
    "src/game-nnfp/ui/nnFpDlgAddChip.js",
    

   //game-hzmj
   "src/game_hzmj/ui/indexDlgId.js",
    "src/game_hzmj/model/hzmjGame.js",
    "src/game_hzmj/network/cmdGame.js",
    "src/game_hzmj/network/hzmjGameMsg.js",
    "src/game_hzmj/ui/hzmjDlgCardsInfo.js",
    "src/game_hzmj/ui/hzmjDlgMain.js",
    "src/game_hzmj/ui/hzmjDlgRankCenter.js",
    "src/game_hzmj/ui/hzmjScene.js",
    "src/game_hzmj/ui/hzmjUIMgr.js",
	
	//game-zpmj
    "src/game_zpmj/ui/indexDlgId.js",
    "src/game_zpmj/model/zpmjGame.js",
    "src/game_zpmj/network/cmdGame.js",
    "src/game_zpmj/network/zpmjGameMsg.js",
    "src/game_zpmj/ui/zpmjDlgCardsInfo.js",
    "src/game_zpmj/ui/zpmjDlgMain.js",
    "src/game_zpmj/ui/zpmjDlgResult.js",
    "src/game_zpmj/ui/zpmjDlgRankCenter.js",
    "src/game_zpmj/ui/zpmjScene.js",
    "src/game_zpmj/ui/zpmjUIMgr.js",

    //game-sss
    "src/game_sss/ui/sssUIMgr.js",
    "src/game_sss/ui/sssGameScene.js",
    "src/game_sss/ui/dlgMainScene.js",
    "src/game_sss/ui/dlgItemsLayer.js",
    "src/game_sss/ui/dlgBeginScene.js",
    "src/game_sss/ui/dlgPlayerData.js",
    "src/game_sss/ui/dlgCombinScene.js",
    "src/game_sss/ui/AnalyseCard.js",
    "src/game_sss/network/cmdGame.js",
    "src/game_sss/network/sssGameMsg.js",
    "src/game_sss/model/sssGameModel.js",

    // game_ddz
    "src/game_ddz/ui/indexDlgId.js",
    "src/game_ddz/ui/ddzGameScene.js",
    "src/game_ddz/ui/ddzDlgScene.js",
    "src/game_ddz/ui/ddzDlgReady.js",
    "src/game_ddz/ui/ddzDlgCardOp.js",
    "src/game_ddz/ui/ddzDlgPlayer.js",
    "src/game_ddz/ui/ddzDlgResult.js",
    "src/game_ddz/ui/ddzDlgQuit.js",
    "src/game_ddz/ui/ddzDlgCallScore.js",
    "src/game_ddz/ui/ddzDlgMsg.js",
    "src/game_ddz/ui/ddzUIMgr.js",
    "src/game_ddz/ui/ddzDlgState.js",
    "src/game_ddz/ui/ddzDlgOpenCard.js",
    "src/game_ddz/network/cmdGame.js",
    "src/game_ddz/network/ddzGameMsg.js",
    "src/game_ddz/model/ddzModel.js",
    "src/game_ddz/model/ddzGameModel.js",

    //game-zpmj
    "src/game_yxmj/ui/indexDlgId.js",
    "src/game_yxmj/model/yxmjGame.js",
    "src/game_yxmj/network/cmdGame.js",
    "src/game_yxmj/network/yxmjGameMsg.js",
    "src/game_yxmj/ui/yxmjDlgCardsInfo.js",
    "src/game_yxmj/ui/yxmjDlgMain.js",
    "src/game_yxmj/ui/yxmjDlgResult.js",
    "src/game_yxmj/ui/yxmjDlgRankCenter.js",
    "src/game_yxmj/ui/yxmjScene.js",
    "src/game_yxmj/ui/yxmjUIMgr.js",

    //last regist
    "src/public/network/RegistFunc.js"
];

if(cc.sys.os == cc.sys.OS_ANDROID){
    g_jsList = ["src/load/apkUpdateScene.js"].concat(g_jsList);
}
