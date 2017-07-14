///////////////////////////////////////////////////////////////////////////////////////////////////////
//PC

//-----------------------------------------登录命令-----------------------------------------
var MDM_GP_LOGON 				= 1;				//广场登录

//登录模式
var SUB_GP_LOGON_GAMEID 		= 1;		//I D 登录
var SUB_GP_LOGON_ACCOUNTS 		= 2;		//帐号登录
var SUB_GP_REGISTER_ACCOUNTS 	= 263;	//注册帐号
var SUB_GP_CHECK_ACCOUNTS 		= 4;									//检测账号

//登录结果
var SUB_GP_LOGON_SUCCESS 		= 100;		//登录成功
var SUB_GP_LOGON_FAILURE 		= 101;		//登录失败
var SUB_GP_LOGON_FINISH 		= 102;		//登录完成
var SUB_GP_VALIDATE_MBCARD 		= 103;		//登录失败


//升级提示
var SUB_GR_UPDATE_NOTIFY = 200;									//升级提示

//-----------------------------------------列表命令-----------------------------------------
var MDM_GP_SERVER_LIST 			= 2;									//列表信息

//获取命令
var SUB_GP_GET_LIST 			= 1;									//获取列表
var SUB_GP_GET_SERVER 			= 2;									//获取房间
var SUB_GP_GET_ONLINE 			= 3;									//获取在线
var SUB_GP_GET_COLLECTION 		= 4;									//获取收藏
var SUB_GP_GET_LAST_PLAY_GAME	= 5;									//最近玩过游戏

//列表信息
var SUB_GP_LIST_TYPE 			= 100;									//类型列表
var SUB_GP_LIST_KIND 			= 101;									//种类列表
var SUB_GP_LIST_NODE 			= 102;									//节点列表
var SUB_GP_LIST_PAGE 			= 103;									//定制列表
var SUB_GP_LIST_SERVER 			= 104;									//房间列表
var SUB_GP_VIDEO_OPTION 		= 105;									//视频配置
var SUB_GP_LAST_PLAY_GAME		= 106;									//最近玩过游戏

//完成信息
var SUB_GP_LIST_FINISH 			= 200;									//发送完成
var SUB_GP_SERVER_FINISH 		= 201;									//房间完成

//在线信息
var SUB_GR_KINE_ONLINE 			= 300;									//类型在线
var SUB_GR_SERVER_ONLINE 		= 301;									//房间在线


///////////////////////////////////////////////////////////////////////////
//服务命令
var MDM_GP_USER_SERVICE 		= 3;									//用户服务

//账号服务
var SUB_GP_MODIFY_MACHINE 		= 100;									//修改机器
var SUB_GP_MODIFY_LOGON_PASS 	= 101;									//修改密码
var SUB_GP_MODIFY_INSURE_PASS 	= 102;									//修改密码
var SUB_GP_MODIFY_UNDER_WRITE 	= 103;									//修改签名
var SUB_GP_MODIFY_GENDER		= 104;									//修改性别
var SUB_GP_MODIFY_NICK			= 105;									//修改昵称
var SUB_GP_MODIFY_MOBILE_PHONE	= 106;									//修改手机号码
var SUB_GP_MODIFY_AUTH			= 107;									//修改身份证
var SUB_GP_GETMOBILE_VALIDATE	= 108;									//获取验证码
var SUB_GP_CHECK_MOBILE			= 109;									//绑定手机

//修改头像
var SUB_GP_USER_FACE_INFO 		= 200;									//头像信息
var SUB_GP_SYSTEM_FACE_INFO 	= 201;									//系统头像
var SUB_GP_CUSTOM_FACE_INFO 	= 202;									//自定头像

//个人资料
var SUB_GP_USER_INDIVIDUAL 		= 301;									//个人资料
var	SUB_GP_QUERY_INDIVIDUAL 	= 302;									//查询信息
var SUB_GP_MODIFY_INDIVIDUAL 	= 303;									//修改资料
var SUB_MB_USER_INDIVIDUAL 		= 306;									//个人资料
var SUB_MB_S_USER_INDIVIDUAL    = 307;                                  //玩家资料
//银行服务
var SUB_GP_USER_SAVE_SCORE 				= 400;									//存款操作
var SUB_GP_USER_TAKE_SCORE 				= 401;									//取款操作
var SUB_GP_USER_TRANSFER_SCORE 			= 402;									//转账操作
var SUB_GP_USER_INSURE_INFO 			= 403;									//银行资料
var SUB_GP_QUERY_INSURE_INFO 			= 404;									//查询银行
var SUB_GP_USER_INSURE_SUCCESS 			= 405;									//银行成功
var SUB_GP_USER_INSURE_FAILURE 			= 406;									//银行失败
var SUB_GP_QUERY_USER_INFO_REQUEST 		= 407;								//查询用户
var SUB_GP_QUERY_USER_INFO_RESULT 		= 408;								//用户信息
var SUB_GP_FREE_TAKE_GAME_SCORE			= 409;								//领取豆豆
var SUB_GP_FREE_TAKE_GAME_SCORE_RESULT	= 410;								//领取豆豆
var SUB_GP_USER_INSURE_LOGON			= 411;									//银行登录
var SUB_GP_USER_INSURE_LOG				= 412;									//赠送日志
var SUB_GP_USER_INSURE_LOG_RESULT		= 413;							//赠送日志结果
var SUB_GP_USER_INSURE_LOG_RESULT_END   = 414;							//赠送日志结果
var SUB_GP_USER_POINT_CARD				= 418;	//点卡充值

//任务
var SUB_GP_C_QUERY_USER_TASK			= 500;									//加载任务
var SUB_GP_S_USER_TASK_INFO				= 501;									//任务信息
var SUB_GP_S_USER_TASK_INFO_END			= 502;									//任务信息结束
var SUB_GP_C_TASK_GET_REWARDS			= 503;								//领取任务奖励

//定时礼包
var SUB_GP_C_QUERY_TIMING_GIFT_INFO		= 510;
var SUB_GP_S_TIMING_GIFT_INFO			= 511;
var SUB_GP_S_TIMING_GIFT_INFO_END		= 512;
var SUB_GP_C_GET_TIMING_GIFT			= 513;
var SUB_GP_S_GET_TIMING_GIFT			= 514;

//操作结果
var SUB_GP_OPERATE_SUCCESS 				= 900;									//操作成功
var SUB_GP_OPERATE_FAILURE 				= 901;									//操作失败
//服务命令
///////////////////////////////////////////////////////////////////////////


//////////////////////////////////////////////////////////////////////////////////
//携带信息 CMD_GP_UserIndividual

var DTP_GP_UI_NICKNAME			= 1;									//用户昵称
var DTP_GP_UI_USER_NOTE			= 2;									//用户说明
var DTP_GP_UI_UNDER_WRITE		= 3;									//个性签名
var DTP_GP_UI_QQ				= 4;									//Q Q 号码
var DTP_GP_UI_EMAIL				= 5;									//电子邮件
var DTP_GP_UI_SEAT_PHONE		= 6;									//固定电话
var DTP_GP_UI_MOBILE_PHONE		= 7;									//移动电话
var DTP_GP_UI_COMPELLATION		= 8;									//真实名字
var DTP_GP_UI_DWELLING_PLACE	= 9;									//联系地址
var DTP_GP_UI_PASSPORT			= 10;									//身份证
var DTP_GP_UI_SAFEEMAIL			= 11;									//身份证

//////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////////////////////////////
//手机

//-----------------------------------------登录命令-----------------------------------------
var MDM_MB_LOGON 				= 100;				//广场登录

var SUB_MB_LOG = 223;	//日志

//登录模式
var SUB_MB_LOGON_GAMEID 		= 1;		//I D 登录
var SUB_MB_LOGON_ACCOUNTS 		= 2;		//帐号登录
var SUB_MB_REGISTER_ACCOUNTS 	= 3;		//注册帐号

//登录结果
var SUB_MB_LOGON_SUCCESS 		= 100;		//登录成功
var SUB_MB_LOGON_FAILURE 		= 101;		//登录失败

//升级提示
var SUB_MB_UPDATE_NOTIFY		= 200;		//升级提示

//-----------------------------------------列表命令-----------------------------------------
var MDM_MB_SERVER_LIST 			= 101;									//列表信息

//列表信息
var SUB_MB_LIST_KIND 			= 100;									//种类列表
var SUB_MB_LIST_SERVER 			= 101;									//房间列表
var SUB_MB_LIST_FINISH 			= 200;									//列表完成

//-----------------------------------------签到命令-----------------------------------------
//签到命令
var MDM_GP_MB_SIGN_IN 				= 200;								//签到命令

var SUB_GP_MB_QUERY_SIGN_IN_INFO 	= 100;					//查询签到信息
var SUB_GP_MB_SIGN_IN_INFO 			= 101;						//签到信息
var SUB_GP_MB_SIGN_IN 				= 102;								//签到
var SUB_GP_MB_SIGN_IN_RESULT 		= 103;						//签到结果

//-----------------------------------------加入房间命令-----------------------------------------
//主命令
var MDM_MB_PERSONAL_SERVICE 				= 201;								//加入房间命令

var SUB_MB_SEARCH_SERVER_TABLE 	= 206;					//查询房间
var SUB_MB_SEARCH_RESULT 		= 207;						//查询房间结果

//-----------------------------------------福利社-----------------------------------------
var SUB_GP_BASEENSURE_TAKE           = 117;                   // 领取低保
var SUB_GP_BASEENSURE_RESULT         = 509;                   // 后台返回 领取低保
var SUB_GP_FIRST_PAY                 = 505;                   // 首冲充值
var SUB_GP_SHARE_AWARD               = 506;					  // 分享成功，送福利

//-----------------------------------------邮件命令-----------------------------------------
// 主命令
var MDM_CS_MANAGER_SERVICE      =   5;

// 子命令
var SUB_LOGON_CS_C_SYSTEM_MESSAGE   =   101;    // 客户端请求系统消息
var SUB_LOGON_CS_S_SYSTEM_MESSAGE 	=   102;    // 服务端响应系统消息

//-----------------------------------------商城命令-----------------------------------------
// 主命令
var MDM_GP_PROPERTY             =   6;

// 子命令
SUB_GP_QUERY_PROPERTY           =   1;          // 客户端请求获取商城商品
SUB_GP_QUERY_PROPERTY_RESULT    =   101;        // 服务端响应商城商品
SUB_GP_PROPERTY_BUY             =   2;          // 客户端请求购买道具
SUB_GP_PROPERTY_BUY_RESULT      =   102;        // 服务端响应购买道具
SUB_GP_PROPERTY_FAILURE         =   404;        // 兑换道具服务端返回失败
