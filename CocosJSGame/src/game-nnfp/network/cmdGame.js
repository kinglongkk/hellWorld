//通比牛牛
var CMD_NIUNIU_TB = {
		KIND_ID:						28,										//游戏 I D
		GAME_PLAYER:					4,										//游戏人数
		GAME_NAME:						"通比牛牛",								//游戏名字
		MAXCOUNT:						5,										//扑克最大数目
	
		VERSION_SERVER:					PROCESS_VERSION(1,0,0),					//程序版本
		VERSION_CLIENT:					PROCESS_VERSION(1,0,0),					//程序版本

		GAME_GENRE:						(GAME_GENRE_GOLD|GAME_GENRE_MATCH),		//游戏类型
		
		//结束原因
		GER_NO_PLAYER:					0x10,									//没有玩家

		SERVER_LEN:						32,										//房间名称长度 

		//游戏状态
		GS_TK_FREE:						GAME_STATUS_FREE,                       //等待开始
		GS_TK_CALL:						GAME_STATUS_PLAY,						//叫庄状态
		GS_TK_SCORE:					GAME_STATUS_PLAY+1,						//下注状态
		GS_TK_PLAYING:					GAME_STATUS_PLAY+2,						//游戏进行
		
		//服务器命令结构
		SUB_S_GAME_START:				100,									//游戏开始
		SUB_S_ADD_SCORE:				101,									//加注结果
		SUB_S_PLAYER_EXIT:				102,									//用户强退
		SUB_S_SEND_CARD:				103,									//发牌消息
		SUB_S_GAME_END:					104,									//游戏结束
		SUB_S_OPEN_CARD:				105,									//用户摊牌
		SUB_S_CALL_BANKER:				106,									//用户叫庄
		SUB_S_ALL_CARD:					107,									//发牌消息
		SUB_S_AMDIN_COMMAND:			108,									//系统控制
		SUB_S_SEND_STORAGE_START:		110,									//发送库存值
		SUB_S_SEND_STORAGE_DEDUCT:		111,									//查询衰减值
		SUB_S_SEND_ACCOUNT:				112,									//发送账号
		SUB_S_ADMIN_CHEAK:				113,									//查询账号
		SUB_S_BUQIANG:					109,									//抢不抢
		SUB_S_SET_BASESCORE:			11279,									//设置基数
		
		//客户端命令结构
		SUB_C_CALL_BANKER:				1,										//用户叫庄
		SUB_C_ADD_SCORE:				2,										//用户加注
		SUB_C_OPEN_CARD:				3,										//用户摊牌
		SUB_C_SPECIAL_CLIENT_REPORT:    4,                                  	//特殊终端
		SUB_C_AMDIN_COMMAND:			5,										//系统控制

		SUB_C_QIANG:					6,										//抢不抢
		SUB_C_DONG_HUA:   				7,										//动画结束
		SUB_C_GET_ACCOUNT:				8,										//获取昵称
		SUB_C_CHEAK_ACCOUNT:			13,										//获取昵称
		SUB_C_GET_STORAGE_START:		9,										//获取库存值
		SUB_C_GET_STORAGE_DEDUCT:		10,										//获取衰减值
		SUB_C_SET_STORAGE_START:		11,										//获取库存值
		SUB_C_SET_STORAGE_DEDUCT:		12,										//获取衰减值
		SUB_C_CALL_CELLSCORE:			11278,							    	//用户设置底注
		SUB_C_GAME_END:					11280,									//游戏结束


		//底分设置
		CELL_SET:						1,
		CELL_SET_WAIT:					2,
		CELL_MEET:						3,
		CELL_NOT_MEET:					4

};