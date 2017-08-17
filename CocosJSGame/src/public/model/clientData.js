var s_sharedClientData = null;

var ClientData = cc.Class.extend({
    ctor: function () {
        this.reset();
    },

    reset: function(){
        cc.log("game.rest了-----------------------");
    	//登录标记
    	this.bLogonFirst = true;
        
        this.curAccountInfo = {
        	account: "",
        	password: ""
        };

        /*this.plaza = new Plaza();
        this.insure = new Insure();
        this.signIn = new SignIn();*/
        this.player = new Player();
        /*this.mail = new Mail();
        this.exAward = new ExAward();
        this.task = new Task();
        this.timingGiftInfo = new TimingGiftInfo();
        this.room = new Room();
        this.match = new Match();*/
        this.table = new Table();
        this.game = null;

        this.bServerConnected = false;
        
        //行为标记，作为登录游戏服务器的参数
        this.wBehaviorFlags = 0;
        
        //是否正在替换场景
        this.isReplaceScene = false;
        
        //强制退出游戏
        this.forceExitGame = false;
        this.forceStr = "";

        this.deviationTime = null;
    },
    
    setDeviationTime: function (serverTime) {
        var localTime = Date.parse(new Date())/1000;
        // 计算出 服务器和本地时间的偏差
        if(!serverTime) this.deviationTime = localTime;
        else this.deviationTime = serverTime - localTime;
    },
    getServerTime: function () {
        var localTime = Date.parse(new Date())/1000;
        // 用偏差值计算出服务器的时间, 这样想要拿到服务端时间就不要每次都去请求
        return localTime + this.deviationTime;
    },
    setReplaceScene: function(bReplace){
    	this.isReplaceScene = bReplace;
    },
    getReplaceScene: function(){
    	return this.isReplaceScene;
    },
    
    setLogonFirst: function(bFirst){
    	this.bLogonFirst = bFirst;
    },
    isLogonFirst: function(){
    	return this.bLogonFirst;
    },
    
    getPlaza: function(){
    	return this.plaza;
    },
    
    getMail: function(){
    	return this.mail;
    },
    
    getExAward: function(){
    	return this.exAward;
    },
     
    getPlayer: function(){
    	return this.player;
    },
    
    getSignIn: function(){
    	return this.signIn;
    },
    
    getTask: function(){
    	return this.task;
    },
    
    getTimingGiftInfo: function(){
    	return this.timingGiftInfo;
    },
    
    getInsure: function(){
    	return this.insure;
    },

    getRoom: function(){
    	return this.room;
    },
    
    getMatch: function(){
    	return this.match;
    },
    
    getTable: function(){
    	return this.table;
    },
    
    setGame: function(game){
    	this.game = game;
    },
    getGame: function(){
    	return this.game;
    },
    
    ////////////////////////////////////////////////////////////////////////////
    //登录记录
    getRecordLogins: function(){
    	var strRecord = LocalStorageMgr.getInstance().getLoginRecordItem();
    	var recordLogins = JSON.parse(strRecord);

    	return recordLogins;
    },

    saveRecordLogn: function(account, pass){
    	var recordLogins = this.removeRecordLogin(account);

    	var info = {
    			account: account,
    			password: pass,
    	};
    	
    	recordLogins.unshift(info);

    	var strRecord = JSON.stringify(recordLogins);
    	LocalStorageMgr.getInstance().setLoginRecordItem(strRecord);
    },

    getRecordLoginById: function(id){
    	var recordLogins = this.getRecordLogins();

    	for(var i=0; i<recordLogins.length; i++){
    		if(i == id){
    			return recordLogins[i];
    		}
    	}

    	return null;
    },

    getRecordLogin: function(account){
    	var recordLogins = this.getRecordLogins();

    	for(var i=0; i<recordLogins.length; i++){
    		var info = recordLogins[i];
    		if(account == info.account){
    			return info;
    		}
    	}

    	return null;
    },

    clearRecordLogins: function(){
    	LocalStorageMgr.getInstance().setLoginRecordItem("[]");
    },

    removeRecordLoginById: function(id, bSave){
    	var recordLogins = this.getRecordLogins();

    	for(var i=0; i<recordLogins.length; i++){
    		if(i == id){
    			recordLogins.splice(i, 1);
    			break;
    		}
    	}

    	if(bSave){
    		var strRecord = JSON.stringify(recordLogins);
    		LocalStorageMgr.getInstance().setLoginRecordItem(strRecord);
    	}

    	return recordLogins;
    },

    removeRecordLogin: function(account, bSave){
    	var recordLogins = this.getRecordLogins();

    	for(var i=0; i<recordLogins.length; i++){
    		var info = recordLogins[i];
    		if(account == info.account){
    			recordLogins.splice(i, 1);
    			break;
    		}
    	}

    	if(bSave){
    		var strRecord = JSON.stringify(recordLogins);
    		LocalStorageMgr.getInstance().setLoginRecordItem(strRecord);
    	}

    	return recordLogins;
    },
    ////////////////////////////////////////////////////////////////////////////
    
    ////////////////////////////////////////////////////////////////////////////
    //当前登录账号信息
    setCurAccountInfo: function(account, password){
    	this.curAccountInfo.account = account;
    	this.curAccountInfo.password = password;
    },
    
    getCurAccountInfo: function(){
    	return this.curAccountInfo;
    },
    ////////////////////////////////////////////////////////////////////////////
    
    
    //强制退出
    setForceExitGame: function(bForce, str){
    	this.forceExitGame = bForce;
    	this.forceStr = str;
    },

    isForceExitGame: function(){
    	return this.forceExitGame
    },

    getForceStr: function(){
    	return this.forceStr;
    },

    clearForce: function(){
    	this.forceExitGame = false;
    	this.forceStr = "";
    },
    //加载网络图片并保存
    loadUrlImage: function(cb, headImageUrl, playerID){
        if(!cc.sys.isNative) {
            //var url = "http://wx.qlogo.cn/mmopen/Q3auHgzwzM7LqYpEaJsibOoThdeh2S41GHJeK6q3e3pUSlObWribnqerx1Ihm4OV9rhW28Bf3freicZvYIbncV4Mw/0"; //测试url 默认图片
            var url = "http://wx.qlogo.cn/mmopen/vkweL0Rj3715r8W1flsibICNQEJ4pvvuMFd9MuqavTM0UecCgWqA8X5qMRUYqmD99WgRQDPq4kRHc2QAKulUC8Eg8Mx0fKShia/0"; //测试url 默认图片
            cc.loader.loadImg(url, {isCrossOrigin : true}, function(err,img){
                if(err) {
                    cc.log("loadUrlImage---"+err);
                }
                else{
                    cc.log("loadUrlImage-++++++++++++++++++++--");
                    cb(url);
                }
            });
            return;
        }

        if(!headImageUrl || headImageUrl.length==0){
            //无网络头像 启用本地默认头像
            //url = "http://a-ssl.duitang.com/uploads/item/201607/05/20160705130934_MLJzU.jpeg"; //测试url 默认图片
            var headFile = "res/public/faceGirl.jpg";
            headFile = jsb.fileUtils.fullPathForFilename(headFile);
            cc.log("1"+"headFile--"+headFile);
            cb(headFile);
            return;
        }

        var start = headImageUrl.lastIndexOf("/", headImageUrl.length)+1;
        var end = headImageUrl.lastIndexOf(".", headImageUrl.length);
        if(end<start){
            end = headImageUrl.length;
        }
        var fileName = headImageUrl.substring(start, end);
        cc.log("URL----fileName-------"+fileName);
        var savePath = jsb.fileUtils.getWritablePath()+"headImage_"+playerID+"_"+fileName+".jpg";
        cc.log("savePath="+savePath);
        if(jsb.fileUtils.isFileExist(savePath) && cb){
            cb(savePath);
            return;
        }

        cc.log("****url***"+headImageUrl);
        var xhr = new XMLHttpRequest();
        xhr.open("get", headImageUrl, true);
        xhr.responseType = "arraybuffer";
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status <= 207)) {
                var httpStatus = xhr.statusText;
                var arrayBuffer = xhr.response;

                if (arrayBuffer) {
                    var byteArray = new Uint8Array(arrayBuffer);
                    if(zutils.saveToFile(savePath,byteArray)){
                        //保存成功
                        cc.log("保存成功");
                        if(cb)
                            cb(savePath);
                        delete byteArray;
                    }
                }
            }
        };
        xhr.send();
    },
});

ClientData.getInstance = function() {
    if (!s_sharedClientData) {
        s_sharedClientData = new ClientData();
    }
    return s_sharedClientData;
};