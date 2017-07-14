var CMD = {
    //房间消息============
    ROOM:{
    	PLAYER_LEAVE: 1//玩家离开
    },


    //桌子消息============
    //枚举规则:
   	//通用的两位数以内
   	//游戏相关的: x*100+y x代表游戏 y两位数
    TABLE:{
        PLAYER_SITDOWN: 1,//玩家进入桌子
        PLAYER_STANDUP: 2,//玩家离开桌子
        PLAYER_UPDATE: 3,//玩家状态变化
        PLAYER_READY: 4,
        GAME_START: 5,
        GAME_RESULT: 6,
        PLAYER_CANCEL_READY:7,
        PLAYER_CHAT:8,
        NIUNIU:{    //牛牛消息
            DEALER_CANDIDATE:101,
            SELECT_DEALER:102,
            START_BET:103,
            BET:104,
            DEAL_CARDS:105,//下发牌
            START_OPEN_CARD:106,
            OPEN_CARD:107
        }
    }
};