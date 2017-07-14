///////////////////////////////////////////////////////////////////////////
//登录命令
var MDM_GR_LOGON = 1111;									//登录信息

//登录模式
var SUB_GR_LOGON_USERID = 111;									//I D 登录
var SUB_GR_LOGON_MOBILE = 112;									//手机登录
var SUB_GR_LOGON_ACCOUNTS = 113;									//帐户登录

//登录结果
var SUB_GR_LOGON_SUCCESS = 1100;									//登录成功
var SUB_GR_LOGON_FAILURE = 1101;									//登录失败
var SUB_GR_LOGON_FINISH = 1102;									//登录完成
//登录命令
///////////////////////////////////////////////////////////////////////////

//升级提示
var SUB_GR_UPDATE_NOTIFY = 200;									//升级提示



///////////////////////////////////////////////////////////////////////////
//配置命令
var MDM_GR_CONFIG = 1112;									//配置信息

var SUB_GR_CONFIG_COLUMN = 1100;									//列表配置
var SUB_GR_CONFIG_SERVER = 1101;									//房间配置
var SUB_GR_CONFIG_PROPERTY = 1102;									//道具配置
var SUB_GR_CONFIG_FINISH = 1103;									//配置完成
var SUB_GR_CONFIG_USER_RIGHT = 1104;								//玩家权限
///////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////
//用户命令
var MDM_GR_USER = 1113;									//用户信息

//用户动作
var SUB_GR_USER_RULE 				= 1;	//用户规则
var	SUB_GR_USER_LOOKON 				= 2;	//旁观请求
var	SUB_GR_USER_SITDOWN 			= 3;	//坐下请求
var	SUB_GR_USER_STANDUP 			= 4;	//起立请求
var SUB_GR_USER_INVITE 				= 5;	//用户邀请
var SUB_GR_USER_INVITE_REQ 			= 6;	//邀请请求
var SUB_GR_USER_REPULSE_SIT 		= 7;	//拒绝玩家坐下
var SUB_GR_USER_KICK_USER 			= 8;	//踢出用户
var SUB_GR_USER_INFO_REQ 			= 9;	//请求用户信息
var SUB_GR_USER_CHAIR_REQ 			= 10;	//请求更换位置
var SUB_GR_USER_CHAIR_INFO_REQ 		= 11;	//请求椅子用户信息
var SUB_GR_USER_WAIT_DISTRIBUTE 	= 12;	//等待分配
var SUB_GR_GAME_MANAGER_ID 			= 13;	//ID管理

//用户状态
var	SUB_GR_USER_ENTER 				= 1100;	//用户进入
var	SUB_GR_USER_SCORE 				= 1101;	//用户分数
var SUB_GR_USER_STATUS 				= 1102;	//用户状态
var	SUB_GR_REQUEST_FAILURE 			= 1103;	//请求失败

//聊天命令
var	SUB_GR_USER_CHAT 				= 2101;	//聊天信息
var	SUB_GR_USER_EXPRESSION 			= 2102;	//表情消息
var SUB_GR_WISPER_CHAT 				= 2103;	//私聊消息
var	SUB_GR_WISPER_EXPRESSION 		= 2104;	//私聊表情
var SUB_GR_COLLOQUY_CHAT 			= 2105;	//会话消息
var	SUB_GR_COLLOQUY_ERPRESSION 		= 2106;	//会话表情

//道具命令
var SUB_GR_PROPERTY_BUY 			= 300;	//购买道具
var SUB_GR_PROPERTY_SUCCESS 		= 301;	//道具成功
var SUB_GR_PROPERTY_FAILURE 		= 302;	//道具失败
var SUB_GR_PROPERTY_MESSAGE 		= 303;	//道具消息
var SUB_GR_PROPERTY_EFFECT 			= 304;	//道具效应
var SUB_GR_PROPERTY_TRUMPET 		= 305;	//用户喇叭
//用户命令
///////////////////////////////////////////////////////////////////////////

//规则标志
var UR_LIMIT_SAME_IP				= 0x01;	//限制地址
var UR_LIMIT_WIN_RATE				= 0x02;	//限制胜率
var UR_LIMIT_FLEE_RATE				= 0x04;	//限制逃率
var UR_LIMIT_GAME_SCORE				= 0x08;	//限制积分

///////////////////////////////////////////////////////////////////////////
//状态命令
var MDM_GR_STATUS 					= 1114;	//状态信息

var SUB_GR_TABLE_INFO 				= 1100;	//桌子信息
var	SUB_GR_TABLE_STATUS 			= 1101;	//桌子状态
//状态命令 end
///////////////////////////////////////////////////////////////////////////


///////////////////////////////////////////////////////////////////////////
//银行命令
var MDM_GR_INSURE 					= 1115;	//用户信息

//银行命令
var SUB_GR_QUERY_INSURE_INFO 		= 101;	//查询银行
var SUB_GR_SAVE_SCORE_REQUEST 		= 102;	//存款操作
var SUB_GR_TAKE_SCORE_REQUEST 		= 103;	//取款操作
var SUB_GR_TRANSFER_SCORE_REQUEST 	= 104;	//取款操作
var SUB_GR_QUERY_USER_INFO_REQUEST 	= 105;	//查询用户
var SUB_GR_INSURE_GAME_MANAGER_ID 	= 106;	//操作ID管理

var SUB_GR_USER_INSURE_INFO 		= 1100;	//银行资料
var SUB_GR_USER_INSURE_SUCCESS 		= 1101;	//银行成功
var SUB_GR_USER_INSURE_FAILURE 		= 1102;	//银行失败
var SUB_GR_USER_TRANSFER_USER_INFO 	= 1103;	//用户资料
//银行命令 end

///////////////////////////////////////////////////////////////////////////
//管理命令
var MDM_GR_MANAGE					= 1116;	//管理命令

var SUB_GR_SEND_WARNING				= 1001;	//发送警告
var SUB_GR_SEND_MESSAGE				= 1002;	//发送消息
var SUB_GR_LOOK_USER_IP				= 1003;	//查看地址
var SUB_GR_KILL_USER				= 1004;	//踢出用户
var SUB_GR_LIMIT_ACCOUNS			= 1005;	//禁用帐户
var SUB_GR_SET_USER_RIGHT			= 1006;	//权限设置

//房间设置
var SUB_GR_QUERY_OPTION				= 1007;	//查询设置
var SUB_GR_OPTION_SERVER			= 1008;	//房间设置
var SUB_GR_OPTION_CURRENT			= 1009;	//当前设置

var SUB_GR_LIMIT_USER_CHAT			= 10010;	//限制聊天

var SUB_GR_KICK_ALL_USER			= 10011;	//踢出用户
var SUB_GR_DISMISSGAME		   		= 10012;	//解散游戏

///////////////////////////////////////////////////////////////////////////
//设置标志
var OSF_ROOM_CHAT				= 1;	//大厅聊天
var OSF_GAME_CHAT				= 2;	//游戏聊天
var OSF_ROOM_WISPER				= 3;	//大厅私聊
var OSF_ENTER_TABLE				= 4;	//进入游戏
var OSF_ENTER_SERVER			= 5;	//进入房间
var OSF_SEND_BUGLE				= 12;	//发送喇叭
var OSF_HIDE_CHAT				= 13;	//屏蔽发言


///////////////////////////////////////////////////////////////////////////////////
//比赛命令
var MDM_GR_MATCH = 1117;									//比赛命令
//s->c and c->s (mainCmd: MDM_GR_MATCH)
var SUB_GR_MATCH_FEE = 4100;									//报名费用
//s->c (mainCmd: MDM_GR_MATCH)
var SUB_GR_MATCH_NUM = 4101;									//等待人数
//c->s (mainCmd: MDM_GR_MATCH)
var SUB_GR_LEAVE_MATCH = 4102;									//退出比赛
//s->c (mainCmd: MDM_GF_FRAME)
var SUB_GR_MATCH_INFO = 4103;									//比赛信息
//s->c (mainCmd: MDM_GF_FRAME)
var SUB_GR_MATCH_WAIT_TIP = 4104;									//等待提示
//s->c (mainCmd: MDM_GF_FRAME)
var SUB_GR_MATCH_RESULT = 4105;									//比赛结果
//s->c (mainCmd: MDM_GR_MATCH)
var SUB_GR_MATCH_STATUS = 4106;									//比赛状态
//s->c (mainCmd: MDM_GR_MATCH)
var SUB_GR_MATCH_DESC = 4108;									//比赛描述

////////////////改动以下时 请将游戏里面CMD_GAME.H的同时改动////////////////////////////
var SUB_GR_MATCH_INFO_ER_SPARROWS = 410									//比赛信息(2人麻将)


///////////////////////////////////////////////////////////////////////////////
//任务命令
var MDM_GR_TASK							= 1118;									//任务命令
//任务子命令
var SUB_GR_C_TASK_INFO_REQUEST			= 1;								//请求任务信息
var SUB_GR_S_TASK_INFO					= 2;								//任务信息
var SUB_GR_S_TASK_INFO_END				= 3;								//任务信息结束
var SUB_GR_S_TASK_COMPLETE				= 4;								//完成任务
var SUB_GR_C_TASK_GET_REWARDS			= 5;								//领取任务奖励
var SUB_GR_S_TASK_REWARDS_SUCCESS		= 6;								//领取奖励成功
var SUB_GR_S_TASK_REWARDS_FAILURE		= 7;								//领取奖励失败

///////////////////////////////////////////////////////////////////////////////
//框架命令
var	MDM_GF_FRAME = 1100;				//框架命令

//用户命令
var SUB_GF_GAME_OPTION 			= 3001;		//游戏配置
var SUB_GF_USER_READY 			= 3002;		//用户准备
var SUB_GF_LOOKON_CONFIG 		= 3003;		//旁观配置

//聊天命令
var SUB_GF_USER_CHAT 			= 30010;	//用户聊天
var SUB_GF_USER_EXPRESSION 		= 30011;	//用户表情

//游戏信息
var SUB_GF_GAME_STATUS 			= 30100;	//游戏状态
var SUB_GF_GAME_SCENE 			= 30101;	//旁观场景
var SUB_GF_LOOKON_STATUS 		= 30102;	//旁观状态
var SUB_GF_CTRL_SYSTEM_SCORE	= 30103;	//控制系统分

//系统消息
var SUB_GF_SYSTEM_MESSAGE 		= 30200;	//系统消息
var SUB_GF_ACTION_MESSAGE 		= 30201;	//动作消息
//框架命令
///////////////////////////////////////////////////////////////////////////////


///////////////////////////////////////////////////////////////////////////////
//游戏命令
var MDM_GF_GAME = 200;									//游戏命令
//游戏命令  子命令 --> 各个游戏分别定义
///////////////////////////////////////////////////////////////////////////////

//其他信息
var DTP_GR_TABLE_PASSWORD 	= 1;									//桌子密码

//用户属性
var DTP_GR_NICK_NAME 		= 10;									//用户昵称
var DTP_GR_GROUP_NAME 		= 11;									//社团名字
var DTP_GR_UNDER_WRITE 		= 12;									//个性签名
var DTP_GR_WECHAT_URL 		= 13;									//微信头像


//附加信息
var DTP_GR_USER_NOTE 		= 20;									//用户备注
var DTP_GR_CUSTOM_FACE 		= 21;									//自定头像


///////////////////////////////////////////////////////////////////////////////
//请求错误
var REQUEST_FAILURE_NORMAL		= 0;									//常规原因
var REQUEST_FAILURE_NOGOLD		= 1;									//金币不足
var REQUEST_FAILURE_NOSCORE		= 2;									//积分不足
var REQUEST_FAILURE_PASSWORD	= 3;									//密码错误


//-----------------------------------------创建房间命令-----------------------------------------
//主命令
var MDM_GR_PERSONAL_TABLE 				= 210;								//创建房间命令

var SUB_GR_CREATE_TABLE 		= 1;					//创建房间
var SUB_GR_CREATE_SUCCESS 		= 2;				//创建房间 成功
var SUB_GR_CREATE_FAILURE 		= 3;				//创建房间 失败
var SUB_GR_CANCEL_TABLE 		= 4;				//解散桌子的理由
var SUB_GR_CANCEL_REQUEST       = 5;                // 客户端请求解散房间
var SUB_GR_REQUEST_REPLY        = 6;                // 解散房间答复
var SUB_GR_REQUEST_RESULT       = 7;                // 请求结果
var SUB_GR_PERSONAL_TABLE_TIP	= 9;
var SUB_GR_PERSONAL_TABLE_END   = 10;			    //游戏结束，房卡模式局数已到
var SUB_GR_HOSTL_DISSUME_TABLE 	= 11;				//强制解散
var SUB_GR_RENEW_TABLE          = 17;               //游戏结束后续费
var SUB_GR_EXIT_TABLE           = 18;               //结束退出,返回大厅
var SUB_GR_RENEW_TABLE_OVERTIME = 19;               //游戏结束后长时间没有点击续费

//-----------------------------------------语音-----------------------------------------
//主命令
var  MDM_GF_FRAME				= 1100;									//框架命令

var SUB_GF_USER_VOICE			= 12;									//用户语音
