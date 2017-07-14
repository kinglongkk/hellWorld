/**
 * Created by chenxinhai on 2017/4/18.
 */
/**
 * Created by chenxinhai on 2017/4/18.
 */
var g_Cmd4GCLogon = null;
var Cmd4GCLogon = cc.Class.extend({

    ctor: function(){
        this.operateTag = null;
        this.operateData = null;
        this.touchSender = null;
        this.cbLogon = null;
    },

    setOperate: function(tag, data){
        this.operateTag = tag;
        this.operateData = data;
    },
    clearOperate: function(){
        this.operateTag = null;
        this.operateData = null;
    },
    getOperateTag: function(){
        return this.operateTag;
    },
    getOperateData: function(){
        return this.operateData;
    },

    // 服务命令
    onRecvCmd4GCLogon: function(subCmd, data){

        cc.log("命令 "+subCmd);

        switch (subCmd) {

            //  登陆成功
            case SUB_GC_LOGON_SUCCESS:
                this.onSubGcLogonSuccess(data);
                break;
            //  登陆失败
            case SUB_GC_LOGON_FAILURE:
                this.onSubGcLogonFailure(data);
                break;
            //  您被迫下线
            case SUB_S_LOGON_AFRESH:
                this.onSubSLogonAfresh(data);
                break;
            default:
                break;
        }

        if(this.touchSender!=null){
            this.touchSender.setTouchEnabled(true)
        }
    },


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /**
     * 子命令接收处理
     */
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    onSubGcLogonSuccess: function(data){
        cc.log("### onSubGcLogonSuccess");

        var dataParser = new DataParser();
        dataParser.init(data);
        var parseData = dataParser.parse([
            ["lErrorCode", "LONG"], //错误代码
            ["szDescribeString", "TCHARS", 128], // 描述消息
        ]);

        cc.log("parseData = " + JSON.stringify(parseData));

        // /////////////////////////////////先数据处理//////////////////////////////////////////

        // /////////////////////////////////后UI处理
        // 回调

        if(this.cbLogon){
            this.cbLogon(parseData);
        }

        // 关闭连接
        // CmdHandler.getInstance().close(); 不能关，因为位置会一直发送过来
    },


    onSubGcLogonFailure: function(data){
        cc.log("### onSubGcLogonFailure");
        var dataParser = new DataParser();
        dataParser.init(data);
        var parseData = dataParser.parse([
            ["lErrorCode", "LONG"], //错误代码
            ["szDescribeString", "TCHARS", 128], // 描述消息
        ]);

        cc.log("parseData = " + JSON.stringify(parseData));

        // /////////////////////////////////先数据处理//////////////////////////////////////////

        // /////////////////////////////////后UI处理
        // 回调
        if(this.cbLogon){
            this.cbLogon(parseData);
        }

        // 关闭连接
        // CmdHandler.getInstance().close(); 不能关，因为位置会一直发送过来
    },

    onSubSLogonAfresh: function(data){
        cc.log("### onSubSLogonAfresh");
        var dataParser = new DataParser();
        dataParser.init(data);
        var parseData = dataParser.parse([

            ["wNotifyMessage", "TCHARS", 128], // 描述消息
        ]);

        cc.log("parseData = " + JSON.stringify(parseData));

        // /////////////////////////////////先数据处理//////////////////////////////////////////

        // /////////////////////////////////后UI处理
        // 回调
        if(this.cbLogon){
            this.cbLogon(parseData);
        }

        // 关闭连接
        // CmdHandler.getInstance().close(); 不能关，因为位置会一直发送过来
    },

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    /**
     * 发送命令
     */
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



    //登录消息服务器
    sendGcLogon: function(phoneMode, md5Pass,cb){

        var dwUserID = g_objHero.getUserId();
        cc.log("userid:"+dwUserID);
        var dataBuilder = new DataBuilder();
        dataBuilder.init(4+33*2+21*2);
        dataBuilder.build([
            ["dwUserID", "DWORD", dwUserID],
            ["szPassword[33]", "TCHARS", md5Pass, 33],
            ["szPhoneMode[21]", "TCHARS", phoneMode, 21],//手机型号
        ]);

        if (cb){
            this.cbLogon = cb;
        }

        if(g_msgSocket.status == SOCKET_STATUS._SS_CONNECTED){
            g_msgSocket.sendData(MDM_GC_LOGON, SUB_GC_MB_LOGON_USERID, dataBuilder.getData());
        }
    },

});


// //////////////////////////////////////////////////////////////////////////////////////////

Cmd4GCLogon.getInstance = function(){
    if(g_Cmd4GCLogon == null){
        g_Cmd4GCLogon = new Cmd4GCLogon();
    }
    return g_Cmd4GCLogon;
}
