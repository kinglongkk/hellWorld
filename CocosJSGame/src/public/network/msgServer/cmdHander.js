/**
 * Created by chenxinhai on 2017/4/18.
 */
var g_CmdHandler = null;
var CmdHandler = cc.Class.extend({

    ctor: function(){
        this.callBacks = [];

        this.reConnectTimes = 0;
    },

    close: function(){
        g_msgSocket.close();
    },

    connect: function(cb){
        //已经链接
        if(g_msgSocket.status != SOCKET_STATUS._SS_INVALID){
            if(cb){
                cb();
            }
        }else{
            MsgMgr.getInstance().connectMsgServer(_CONFIG_.MSGServer_IP, _CONFIG_.MSGServer_PORT);
            this.callBacks.push(cb);
        }
    },

    //掉线
    onOffLine: function(){
        this.callBacks = [];
    },

    onConnectResult: function(bResult){
        //链接成功
        if(bResult){
            for(var i=0; i<this.callBacks.length; i++){
                var cb = this.callBacks[i];
                if(cb){
                    cb();
                }
            }
            this.callBacks = [];
            this.reConnectTimes = 0;
        }else{
            if(this.reConnectTimes > 10){
                DlgTip.openTip(DLG_TIP_CFG.CONNECT_SERVER_FAILURE, function(target){
                    target.closeTip();
                    LoginSceneUIMgr.getInstance().onConnectFailure();
                });
            }else{
                MsgMgr.getInstance().connectMsgServer(_CONFIG_.MSGServer_IP, _CONFIG_.MSGServer_PORT);
                this.reConnectTimes++;
            }
        }
    },

    onMessage: function(msg){
        //cc.log("### LogonMsgHandler onMessage() : msg = " + JSON.stringify(msg));
        var mainCmd = msg.mainCmd;
        var subCmd = msg.subCmd;
        var data = msg.data;

        switch (mainCmd) {
            // 登陆
            case MDM_GC_LOGON:
                Cmd4GCLogon.getInstance().onRecvCmd4GCLogon(subCmd, data);
                break;

            // 位置
            case MDM_GC_USER:
                Cmd4GCUser.getInstance().onRecvCmd4GCUser(subCmd, data);
                break;

            default:
                break;
        }
    },
});

CmdHandler.getInstance = function(){
    if(g_CmdHandler == null){
        g_CmdHandler = new CmdHandler();
    }
    return g_CmdHandler;
}