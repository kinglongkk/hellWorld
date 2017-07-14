/**
 * Created by chenxinhai on 2017/4/18.
 */

// 主命令
var  MDM_GC_LOGON                	    =1;

// 子命令
var SUB_GC_MB_LOGON_USERID              = 101;   // 手机登录
var SUB_GC_LOGON_SUCCESS                = 200;   // 登陆成功
var SUB_GC_LOGON_FAILURE                = 210;   // 登陆失败
var SUB_S_LOGON_AFRESH                  = 306;   // 您被迫下线

// 主命令
var MDM_GC_USER 				        = 3;                                        //用户信息

// 子命令
var   SUB_GC_UPDATE_COORDINATE		        = 109;                                  // 更新坐
var   SUB_GC_UPDATE_COORDINATE_NOTIFY	    = 209;							        // 服务端发给客户端
var   SUB_GC_UPDATE_COORDINATE_ECHO		    = 309;							        // 正确或错误反馈命令
var   SUB_GC_QUERY_NEARUSER                 = 111;                                  // 获取附近用户的坐标
var   SUB_GC_QUERY_NEARUSER_RESULT          = 211;                                  // 获取附近用户坐标结果