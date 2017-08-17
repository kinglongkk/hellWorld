//斗地主
/*
 sxh 定义一些常用配置
 * */
var CMD_DDZ = {
		KIND_ID:					29,			// 游戏 I D
		GAME_PLAYER:				3,				// 游戏人数
		GAME_NAME:					"斗地主",		// 游戏名字
		MAX_COUNT:					20,				// 扑克最大数目
    	NORMAL_COUNT:				17,				// 未包含底牌的扑克数量
		FULL_COUNT:				54,				// 一副扑克数量
    	DISPATCH_COUNT:			51,				// 派发数目
    	GOOD_CARD_COUTN:			38,				// 好牌数目

		VERSION_SERVER:				PROCESS_VERSION(1,0,0),					// 程序版本
		VERSION_CLIENT:				PROCESS_VERSION(1,0,0),					// 程序版本

		GAME_GENRE:					(GAME_GENRE_GOLD|GAME_GENRE_MATCH),		// 游戏类型

		//结束原因
		GER_NO_PLAYER:				0x10,									// 没有玩家

		SERVER_LEN:					32,										// 房间名称长度
    	INVALID:					0xFFFF,		// 无效的

		//游戏状态
		GS_TK_FREE:					0,                       // 等待开始
		GS_TK_CALL:					1,						// 叫庄状态
		GS_TK_PLAYING:				    2,					// 游戏进行

		//服务器命令结构
		SUB_S_GAME_START:			100,		// 游戏开始 发送扑克
    	SUB_S_CALL_SCORE:			101,		// 用户叫分
    	SUB_S_BANKER_INFO:			102,		// 庄家信息
    	SUB_S_OUT_CARD:			103,		// 用户出牌
    	SUB_S_PASS_CARD:			104,		// 放弃出牌
    	SUB_S_GAME_CONCLUDE:		105,		// 游戏结束
    	SUB_S_SET_BASESCORE:		106,		// 设置基数
		SUB_S_CHEAT_CARD:			107,		// 作弊扑克
    	SUB_S_TRUSTEE:				108,		// 托管

		//客户端命令结构
    	SUB_C_CALL_SCORE:			1,			// 用户叫分
    	SUB_C_OUT_CARD:				2,			// 用户出牌
	 	SUB_C_PASS_CARD:			3,			// 放弃出牌
    	SUB_C_TRUSTEE:				4,			// 用户托管

		// 游戏牌型
		CT_ERROR:			0,	// 空牌
		CT_SINGLE:			1,	// 单牌
    	CT_DOUBLE:			2,	// 对子
    	CT_THREE:			3,	// 三根
    	CT_SINGLE_LINE:		4,	// 单连类型（顺子？）
    	CT_DOUBLE_LINE:		5,	// 连对
    	CT_THREE_LINE:		6,	// 飞机不带任何牌
    	CT_THREE_TAKE_ONE:	7,	// 三带一单
    	CT_THREE_TAKE_TWO:	8,	// 三带一对

		CT_FOUR_TAKE_ONE:	9,	// 四带两单
    	CT_FOUR_TAKE_TWO:	10,	// 四带二对
    	CT_BOMB_CARD:		11,	// 炸弹
		CT_MISSILE_CARD:	12,	// 王炸（火箭）

		// 数值掩码
    	MASK_COLOR:			0xF0,	// 花色掩码
	    MASK_VALUE:			0x0F	// 数值掩码
};