//斗地主
/*
 sxh 定义一些常用配置
 * */
var CMD_SSS = {
		KIND_ID:						30,										//游戏 I D
		GAME_PLAYER:					6,										//游戏人数
		GAME_NAME:						"十三水",								//游戏名字
		MAXCOUNT:						13,										//扑克最大数目

		VERSION_SERVER:					PROCESS_VERSION(1,0,0),					//程序版本
		VERSION_CLIENT:					PROCESS_VERSION(1,0,0),					//程序版本

		GAME_GENRE:						(GAME_GENRE_GOLD|GAME_GENRE_MATCH),		//游戏类型

		//结束原因
		GER_NO_PLAYER:					   0x10,									//没有玩家

		SERVER_LEN:						32,										//房间名称长度 

		//游戏状态
		GS_TK_FREE:					GAME_STATUS_FREE,                         //等待开始
		GS_TK_CALL:					GAME_STATUS_PLAY,							//叫庄状态
		GS_TK_SCORE:					GAME_STATUS_PLAY+1,						//下注状态
		GS_TK_PLAYING:					GAME_STATUS_PLAY+2,						//游戏进行
		GS_TK_CARD:					GAME_STATUS_PLAY+3,						//组牌完成
		GS_TK_CARDSHOW:					GAME_STATUS_PLAY+4,						//比牌
		GS_TK_PLAYERECORD:				GAME_STATUS_PLAY+11,						//断线回来玩家局数详情

		//服务器命令结构
		SUB_S_SEND_CARD:				100,									//游戏开始 发送扑克
		
		SUB_S_SETSEGMENT:				102,									//设置分段
		SUB_S_SHOW_CARD:				103,									//玩家摊牌		
		SUB_S_GAME_END:					104,									//游戏结束
		SUB_S_GAME_COMPARE:             105,                                    //游戏比牌
		SUB_S_PLAYER_LEFT:				106,									//玩家强退
		SUB_S_SCORE_RESULT:            	107,                                	//游戏结算
		SUB_S_USEREXIT:                 108,                                	//玩家退出
		SUB_S_AMDIN_COMMAND:			109,							 		//管理员命令

		//客户端命令结构
		SUB_C_SEGCARD:					301,									//分段命令
		SUB_C_SHOWCARD:					302,									//用户出牌
		SUB_C_USEREXIT:					304,									//用户离开
		
		//更新来源
		SSS_UIMGR:						500,				
		SSS_GAMEMSG:					501,
		SSS_SCENE:						503,


};