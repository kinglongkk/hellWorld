var s_sharedClientData = null;

var ClientData = cc.Class.extend({
    ctor: function () {
        this.reset();
    },

    reset: function(){
    	//登录标记
    	this.bLogonFirst = true;
        
        this.curAccountInfo = {
        	account: "",
        	password: ""
        };

        // this.plaza = new Plaza();
        // this.insure = new Insure();
        // this.signIn = new SignIn();
        this.player = new Player();
        // this.mail = new Mail();
        // this.exAward = new ExAward();
        // this.task = new Task();
        // this.timingGiftInfo = new TimingGiftInfo();
        // this.room = new Room();
        // this.match = new Match();
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
});

ClientData.getInstance = function() {
    if (!s_sharedClientData) {
        s_sharedClientData = new ClientData();
    }
    return s_sharedClientData;
};