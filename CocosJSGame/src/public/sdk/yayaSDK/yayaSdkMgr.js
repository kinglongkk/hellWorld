//ZSocket API
// sendData  发送消息
// connect  连接socket
// close  关闭socket

var g_yayaSdkMgr = null;
var yayaSdkMgr = cc.Class.extend({
    _yayaSDK:null,
    _bSDKInit: false,
    ctor:function() {

    },

    initYaYaSDK :function(){
        cc.log("-----呀呀SDK初始化--------");
        if (!this._bSDKInit)
        {
            this._yayaSDk = new cc.yayaSDKMgr();
            this._yayaSDk.initYaYaSdk(_CONFIG_.YAYA_APPID);
            this._bSDKInit = true;

            this._yayaSDk.onUpLoadFileRespond = function(params){
                cc.log("-----呀呀SDK上传录音回调--------");
                cc.log(JSON.stringify(params));
                var result = params.result;
                var msg = params.msg;
                var fileurl = params.fileurl;
                var fileid = params.fileid;
                var percent = params.percent;
                if (0 == result)
                {
                    // 发送录音URL
                    cc.log("呀呀录音上传");
                    GameFrameMsg.getInstance().sendVoiceReqMsg(fileurl);
                }
                else
                {
                    cc.log("呀呀录音上传失败");
                    SoundMgr.getInstance().setPlayMusic(true);
                }
                yayaSdkMgr.getInstance().playRecord(fileurl, "");
            };
            this._yayaSDk.onPlayVoiceRespond = function(params){
            	cc.log("-----呀呀播放结束回调--------");
            	cc.log(JSON.stringify(params));
            	var result = params.result;
            	var describe = params.describe;
                SoundMgr.getInstance().setPlayMusic(true);
            };

            this._yayaSDk.onRecordStopNotify = function(params){
                cc.log("-----呀呀结束录音回调--------");
                cc.log(JSON.stringify(params));
                var result = params.result;
                var strfilepath = params.strfilepath;
                SoundMgr.getInstance().setPlayMusic(true);
            };
        }
    },

    // 登录YAYA
    loginYaYa:function(nickname, uid){
        cc.log("-----调用牙牙帐号登陆接口--------");
        this._yayaSDk.loginYaYa(nickname, uid);
    },

    // 退出YAYA
    logoutYaYa:function( ){
        cc.log("-----调用牙牙帐号退出接口--------");
        this._yayaSDk.logoutYaYa();
    },

// 开始录音
    starRecord:function(savePath, speech){
        cc.log("-----调用录音接口--------");
        this._yayaSDk.startYaYaRecord(savePath, speech);
    },

    // 结束录音
    stopRecord:function(){
        cc.log("-----调用结束录音接口--------");
        this._yayaSDk.stopYaYaRecord();
    },

    // 播放录音：
    playRecord:function(Url, path){
        cc.log("-----调用播放录音接口--------");
        this._yayaSDk.playYaYaRecord(Url, "");
    },

    // 停止播放录音
    stopPlayRecord:function () {
        cc.log("-----调用停止播放接口--------");
        this._yayaSDk.stopYaYaPlay();
    },

});

yayaSdkMgr.getInstance = function(){
    if (!g_yayaSdkMgr) {
        g_yayaSdkMgr = new yayaSdkMgr();
    }
    return g_yayaSdkMgr;
}