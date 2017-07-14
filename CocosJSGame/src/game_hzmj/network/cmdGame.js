/*
 * 红中麻将  网络命令  定义
 * Author: 	xjn 
 * Date:	2017.4.8
 * 
 * 功能：
 * */
//红中麻将
var CMD_HZMJ = {
	KIND_ID:						389,
	GAME_NAME:						"红中麻将",

	//组件属性
	GAME_PLAYER:                            4,                                      //游戏人数
	VERSION_SERVER:                         PROCESS_VERSION(1,0,0),                 //程序版本
	VERSION_CLIENT:                         PROCESS_VERSION(1,0,0),                 //程序版本
	FULL_COUNT:								112,									//牌库数目

	//游戏状态
	GS_MJ_FREE:                             GAME_STATUS_FREE,                       //空闲状态
	GS_MJ_PLAY:                             GAME_STATUS_PLAY,                     //游戏状态
	INVALID_CHAIR:							0xFFFF,									//无效椅子
	//服务端命令
	SUB_S_GAME_START:            			100,									//游戏开始
	SUB_S_OUT_CARD:         				101,									//出牌命令
	SUB_S_SEND_CARD:        				102,									//发送扑克
	SUB_S_OPERATE_NOTIFY:           		103,									//操作提示
	SUB_S_OPERATE_RESULT:           		104,									//操作命令
	SUB_S_LISTEN:           				105,									//用户听牌
	SUB_S_TRUSTEE:          				106,									//用户托管
	SUB_S_REPLACE_CARD:         			107,									//用户补牌
	SUB_S_GAME_END:         				108,									//游戏结束
	
	SUB_S_SET_BASESCORE:					109,									//设置基数
	SUB_S_HU_CARD:							110,									//听牌胡牌数据
	SUB_S_RECORD:							111,									//房卡结算记录
	
	SUB_S_CONFIG_CELLSCORE:         		1099, 
	SUB_S_CTRL_CARD:         				1020, 
	SUB_S_NO_LISTEN:         				1021, 									//牌
	SUB_S_CHALLENGE:        				1022,									//用户挑战
	SUB_S_CHI_HU_FAN:           			1023,									//和牌番数
	SUB_S_LISTEN_FAN:           			1024,									//听牌番数
	SUB_S_MAKESURE:          				1025,									//
	SUB_S_USEREXIST:        				1026,									//用户退出
	SUB_S_USERCLOSEWIN:	            		1027,									//关闭窗口

	//客户端命令结构
	SUB_C_OUT_CARD:          				1,									//出牌命令
	SUB_C_OPERATE_CARD:         			2,								    //操作扑克
	SUB_C_LISTEN:           				3,								    //用户听牌
	SUB_C_TRUSTEE:           				4,								    //用户托管
	SUB_C_REPLACE_CARD:         			5,								    //用户补牌
	SUB_C_SEND_CARD:             			6,									//发送扑克
	
	SUB_C_CONFIG_CELLSCORE:          		609,
	SUB_C_CALL_CELLSCORE:           		709,
	SUB_C_CHALLENGE:        				809,								    //用户挑战
	SUB_C_USERRESULT:           			810,								    //用户退出
	SUB_C_MAKESURE:          				811,								    //确认时间限制开始

	//相关固定变量
	MAX_SICE_MOVE_COUNT:                    9,                                      //骰子动画帧数
	MAX_COUNT:                              14,                                     //扑克张数
	MAX_REPERTORY:           				72,									    //最大库存
	MAX_INDEX:          					42,  									//最大索引
	INDEX_REPLACE_CARD:                     42,                                     //用于财神的转换，如果有牌可以代替财神本身牌使用，则设为该牌索引，否则设为MAX_INDEX. 注:如果替换牌是序数牌,将出错.
	MASK_COLOR:         					0xF0,								    //花色掩码
	MASK_VALUE:         					0x0F,   								//数值掩码
	//定时器ID
	IDI_START_GAME:                         200,                                    //开始定时器
	IDI_OPERATE_CARD:			            201,  									//操作定时器
	IDI_REPLACE_CARD:			            301,									//补牌定时器
	IDI_MAKESURE_START:			            302,									//确认开始定时器

	//定时器时间
	TIME_START_GAME:                        30,                                     //30秒
	USER_MAKESURE_TIME:                     30,                                     //确认底注定时器
	TIME_OPERATE_CARD:                      20,                                     //当前用户操作定时器


	//动作标志
	WIK_NULL:            					0x00,  								//没有类型
//	WIK_LEFT:           					0x01,								//左吃类型
//	WIK_CENTER:          					0x02,   							//中吃类型
//	WIK_RIGHT:             					0x04,  								//右吃类型
	WIK_PENG:            					0x08,  								//碰牌类型
	WIK_GANG:           					0x10,  								//杠牌类型16
	WIK_LISTEN:         					0x20,  								//听牌类型32
	WIK_CHI_HU:         					0x40,  								//吃胡类型64
	WIK_FANG_PAO:           				0x80,    							//放炮--128
	WIK_ANGANG:           					0x100,  							//暗杠

	//动作类型
	WIK_GANERAL:							0x00,								//普通操作（碰 吃）			
	WIK_MING_GANG:							0x01,								//明杠（碰后再杠）
	WIK_FANG_GANG:							0x02,								//放杠
	WIK_AN_GANG:							0x03,								//暗杠
	

	//胡牌定义

	/*
//		1番		10种
	//  花牌每花一番，不再次表述
	 */	
	CHR_ZI_MO:								0x00000001,								//自摸
	CHR_DAN_DIAO_JIANG:						0x00000002,								//单钓将
	CHR_KAN_ZHANG:							0x00000004,								//坎张
	CHR_BIAN_ZHANG:							0x00000008,								//边张
	CHR_MING_GANG:							0x00000010,								//明杠
	CHR_YAO_JIU:							0x00000020,								//幺九刻
	CHR_LAO_SHAO_JIANG:						0x00000040,								//老少副
	CHR_LIAN_LIU:							0x00000080,								//连六
	CHR_YI_BAN_GAO:							0x00000100,								//一般高
	/*
//	2番		7种
	 */
	CHR_DUAN_YAO:						0x00000200,								//断幺
	CHR_AN_GANG:						0x00000400,								//暗杠
	CHR_SHUANG_AN_KE:					0x00000800,								//双暗刻
	CHR_SHI_GUI_YI:						0x00001000,								//四归一
	CHR_PING_HU:						0x00002000,								//平胡
	CHR_MEN_QI_QING:					0x00004000,								//门前清
	CHR_JIAN_KE:						0x00008000,									//箭刻
	/*
//	4番		4种
	 */
	CHR_JUE_ZHANG:							0x00010000,								//绝张
	CHR_SHUANG_MING_GANG:					0x00020000,								//双明杠
	CHR_BU_QIU_REN:							0x00040000,								//不求人
	CHR_QUAN_DAI_YAO:						0x00080000,									//全带幺

	/*
//	6番		5种
	 */
	CHR_SHUANG_JIAN_KE:			0x00100000,									//双箭刻
	CHR_SHUANG_AN_GANG:			0x00200000,									//双暗杠
	CHR_QUAN_QIU_REN:			0x00400000,									//全求人
	CHR_HUN_YI_SE:				0x00800000,									//混一色
	CHR_PENG_PENG:				0x01000000,									//碰碰和

	/*
//	8番		4种
	 */
	CHR_QIANG_GANG:				0x02000000,									//抢杠和
	CHR_GANG_KAI:				0x04000000,									//杠上开花
	CHR_HAI_DI:					0x08000000,									//海底捞月
	CHR_MIAO_SHOU:				0x10000001,									//妙手回春

	/*
//	12番	3种
	 */
	CHR_SAN_FENG_KE:				0x10000002,									//三风刻
	CHR_XIAO_WU:					0x10000004,									//小于五
	CHR_DA_WU:					0x10000008,									//大于五

	/*
//	16番	3种
	 */
	CHR_SAN_AN_KE:				0x10000010,									//三暗刻
	CHR_YI_SE_BU:				0x10000020,									//一色三步高
	CHR_QING_LONG:				0x10000040,									//清龙

	/*
//	24番	4种
	 */

	CHR_YI_SE_JIE:					0x10000080,								//一色三节高
	CHR_YI_SE_TONG:				0x10000100,									//一色三同顺
	CHR_QING_YI_SE:				0x10000200,									//清一色
	CHR_QI_DUI:					0x10000400,									//七对

	/*
//	32番	3种
	 */
	CHR_HUN_YAO:					0x10000800,									//混幺九
	CHR_SAN_GANG:				0x10001000,									//三杠
	CHR_YI_SHI_BU:				0x10002000,									//一色四步高

	/*
//	48番	2种
	 */
	CHR_YI_SHI_JIE:				0x10004000,									//一色四节高
	CHR_YI_SHI_TONG:				0x10008000,									//一色四同顺

	/*
//	64番	5种
	 */
	CHR_YI_SE_SHUANG:			0x10010000,									//一色双龙会
	CHR_SI_AN_KE:				0x10020000,									//四暗刻
	CHR_ZI_YI_SE:				0x10040000,									//字一色
	CHR_XIAO_SAN_YUAN:			0x10080000,									//小三元
	CHR_XIAO_SHI_XI:				0x10100000,									//小四喜

//	88番	5种
	CHR_DA_SHI_XI:							0x12000000,								//大四喜
	CHR_DA_SAN_YUAN:						0x11000000,								//大三元	
	CHR_JIU_LIAN_DENG:						0x10800000,								//九莲宝灯	
	CHR_SI_GANG:							0x10400000,								//四杠	
	CHR_LIAN_QI_DUI:						0x10200000,								//连七对	
	/*
	//大众番型	4种
	 */
	CHR_TIAN_HU:				0x14000000,									// 天胡	88番
	CHR_DI_HU:					0x18000000,									// 地胡 64番
	CHR_REN_HU:					0x20000001,									// 人胡 32番
	CHR_TIAN_TING:				0x20000002,									// 天听 32番

	/*
	//听牌
	 */
	CHR_LISTEN_HU:				0x20000004,									//听牌 1番

};

var g_DZQS_CardDataArray=[
                          0x01,0x02,0x03,0x04,0x05,0x06,0x07,0x08,0x09,						//万子
                          0x01,0x02,0x03,0x04,0x05,0x06,0x07,0x08,0x09,						//万子
                          0x01,0x02,0x03,0x04,0x05,0x06,0x07,0x08,0x09,						//万子
                          0x01,0x02,0x03,0x04,0x05,0x06,0x07,0x08,0x09,						//万子
                          0x31,0x32,0x33,0x34,0x35,0x36,0x37,							    //番子（东南西北中发白）
                          0x31,0x32,0x33,0x34,0x35,0x36,0x37,							    //番子（东南西北中发白）
                          0x31,0x32,0x33,0x34,0x35,0x36,0x37,								//番子（东南西北中发白）
                          0x31,0x32,0x33,0x34,0x35,0x36,0x37,								//番子（东南西北中发白）
                          0x38,0x39,0x3a,0x3b,0x3c,0x3d,0x3e,0x3f							//春夏秋冬梅兰竹菊
                          ];