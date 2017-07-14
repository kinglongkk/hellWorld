/**
 * Created by chenxinhai on 2017/4/18.
 */
var g_Cmd4GCUser = null;
var Cmd4GCUser = cc.Class.extend({

    ctor: function(){
        this.operateTag = null;
        this.operateData = null;
        this.touchSender = null;

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
    onRecvCmd4GCUser: function(subCmd, data){

        cc.log("命令 "+subCmd);
        switch (subCmd) {

            //  正确或错误反馈命令
            case SUB_GC_UPDATE_COORDINATE_ECHO:
                this.onSubGcUpdateCoordinateEcho(data);
                break;
            //  用户位置信息更新了
            case SUB_GC_UPDATE_COORDINATE_NOTIFY:
                this.onSubGcUpdateCoordinateNotify(data);
                break;
            // 获取用户坐标信息
            case SUB_GC_QUERY_NEARUSER_RESULT:
                this.gcGetNearuserResult(data);
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

    onSubGcUpdateCoordinateEcho: function(data){
        cc.log("### onSubGcUpdateCoordinateEcho");

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
        var cb = this.getOperateData();
        if(cb){
            cb(parseData);
        }

        // 关闭连接
        //CmdHandler.getInstance().close(); 不能关，因为位置会一直发送过来
    },


    onSubGcUpdateCoordinateNotify: function(data){
        cc.log("### onSubGcUpdateCoordinateNotify");

        var dataParser = new DataParser();
        dataParser.init(data);
        var parseData = dataParser.parse([
            ["dLongitude", "DOUBLE"],
            ["dLatitude", "DOUBLE"],
            ["cbCoordinate", "BYTE"],
            ["dwClientAddr", "DWORD"],
            ["szFromWhere", "TCHARS", 128], // 描述消息
        ]);

        cc.log("parseData = " + JSON.stringify(parseData));

        // /////////////////////////////////先数据处理//////////////////////////////////////////

        // /////////////////////////////////后UI处理

        // 做过滤
        // if (parseData.dwClientAddr == )
        // {
        //
        // }

        // 回调
        var cb = this.getOperateData();
        if(cb){
            cb(parseData);
        }
        // 存储信息
        var nearUserInfo = new NearUserInfo();
        nearUserInfo.setLongitude(parseData.dLongitude);
        nearUserInfo.setLatitude(parseData.dLatitude);
        nearUserInfo.setClientAddr(parseData.dwClientAddr);
        g_objHero.setNearUserInfo(nearUserInfo);

        // 上传完成更新界面，防止自己后进入无更新位置的情况
        var runScene = cc.director.getRunningScene();
        if (runScene && runScene.updateLoaction) {
            runScene.updateLoaction(parseData);
        }
        // 关闭连接
        //CmdHandler.getInstance().close(); 不能关，因为位置会一直发送过来
    },

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    /**
     * 发送命令
     */
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    // 更新位置信息
    sendGcUpdateCoordinateReq: function(latiude,longitude,address,cb)
    {
        //定位功能
    	/*if(!address || !longitude || !latiude){
    		cc.log(" 更新位置信息 error");
    		return;
    	}
    		
        cc.log(" 更新位置信息 "+address+","+longitude+","+latiude);

        var dwUserID = g_objHero.getUserId();
        var dataBuilder = new DataBuilder();
        dataBuilder.init(4+128*2+8*2);
        dataBuilder.build([
            ["dwUserID", "DWORD", dwUserID],// 用户 I D
            ["szFromWhere[128]", "TCHARS", address, 128],
            ["dwLongitude", "DOUBLE", longitude],
            ["dwLatiude", "DOUBLE", latiude],
        ]);

        if(g_msgSocket.status == SOCKET_STATUS._SS_CONNECTED){

             if (cb){
                 Cmd4GCUser.getInstance().setOperate(SUB_GC_UPDATE_COORDINATE_ECHO, cb);
             }
             g_msgSocket.sendData(MDM_GC_USER, SUB_GC_UPDATE_COORDINATE, dataBuilder.getData());
        }*/
    },

    // 获取某一个用户的坐标
    sendGcGetNearuser: function (userID) {
        //定位功能
        /*CmdHandler.getInstance().connect(function(){
            if (g_msgSocket.status == SOCKET_STATUS._SS_CONNECTED) {
                cc.log("准备获取用户坐标userID=" + userID);
                var dataBuilder = new DataBuilder();
                dataBuilder.init(8);
                dataBuilder.build([
                    ["dwUserID", "DWORD", g_objHero.getUserId()],   // 当前用户ID
                    ["dwNearuserUserID", "DWORD", userID]           // 需要获取的附近用户ID
                ]);
                g_msgSocket.sendData(MDM_GC_USER, SUB_GC_QUERY_NEARUSER, dataBuilder.getData());
            }
        });*/
    },

    // 服务端返回用户坐标信息
    gcGetNearuserResult: function (data) {
    	if(gg.WxSdkMgr.getInstance().hGetPosInfo){
    		//取消定时器
    		clearInterval(gg.WxSdkMgr.getInstance().hGetPosInfo);
    	}
    	
        var dataParser = new DataParser();
        dataParser.init(data);

        var parserData = dataParser.parse([
            ["cbUserCount", "BYTE"],    // 用户数目
            ["dwUserID", "DWORD"],      // 用户 I D
            ["dwGameID", "DWORD"],      // 游戏 I D
            ["szNickName", "TCHARS", 32],// 用户昵称
            ["dwFaceID", "DWORD"],      // 头像 I D
            ["dwCustomID", "DWORD"],    // 头像 I D
            ["cbGender", "BYTE"],       // 用户性别
            ["wMemberOrder", "WORD"],   // 会员等级
            ["wGrowLevel", "WORD"],     // 用户等级
            ["szUnderWrite", "TCHARS", 32],  // 个性签名
            ["dLongitude", "DOUBLE"],   // 坐标经度
            ["dLatitude", "DOUBLE"],    // 坐标纬度
            ["dwDistance", "DWORD"],    // 目标距离
            ["dwClientAddr", "DWORD"],  // 用户地址
        ]);

        cc.log("服务端返回的用户坐标信息"+JSON.stringify(parserData));
        var table = ClientData.getInstance().getTable();
        if(table){
            var player = table.getPlayerByUserId(parserData.dwUserID);
            if (player) {
                var nearUserInfo = new NearUserInfo();
                nearUserInfo.setUserCount(parserData.cbUserCount);
                nearUserInfo.setUserID(parserData.dwUserID);
                nearUserInfo.setGameID(parserData.dwGameID);
                nearUserInfo.setNickName(parserData.szNickName);
                nearUserInfo.setFaceID(parserData.dwFaceID);
                nearUserInfo.setCustomID(parserData.dwCustomID);
                nearUserInfo.setGender(parserData.cbGender);
                nearUserInfo.setMemberOrder(parserData.wMemberOrder);
                nearUserInfo.setGrowLevel(parserData.wGrowLevel);
                nearUserInfo.setUnderWrite(parserData.szUnderWrite);
                nearUserInfo.setLongitude(parserData.dLongitude);
                nearUserInfo.setLatitude(parserData.dLatitude);
                nearUserInfo.setDistance(parserData.dwDistance);
                nearUserInfo.setClientAddr(parserData.dwClientAddr);

                player.setNearUserInfo(nearUserInfo);
            }
        }

        var runScene = cc.director.getRunningScene();
        if (runScene && runScene.updateLoaction) {
            runScene.updateLoaction(parserData);
        }
    },

    // 封装获取本地经纬度
    requestCurrenLocation: function () {
        if(cc.sys.isNative){
            if(cc.sys.os == cc.sys.OS_ANDROID){
                jsb.reflection.callStaticMethod(
                    "org/cocos2dx/javascript/AppActivity",
                    "requestLocation",
                    "()V"
                );
            }
            else if(cc.sys.os == cc.sys.OS_IOS){

                jsb.reflection.callStaticMethod(
                    "AppController",
                    "requestLocation"
                );
            }
        }
    },
});


// //////////////////////////////////////////////////////////////////////////////////////////

Cmd4GCUser.getInstance = function(){
    if(g_Cmd4GCUser == null){
        g_Cmd4GCUser = new Cmd4GCUser();
    }
    return g_Cmd4GCUser;
}
