var PlazaMainLayer = cc.Layer.extend({
    
    init: function () {
    	cc.log("PlazaMainLayer--------------------------------------------------began");
    	var sizeDir = cc.director.getWinSize();

	   	//bg
	   	var imageView = new ccui.ImageView(res.plaza_bg);
	   	imageView.x = sizeDir.width / 2;
	   	imageView.y = sizeDir.height / 2;
	   	var sizeImg = imageView.getSize();
	   	imageView.setScaleX(sizeDir.width / sizeImg.width);
	   	imageView.setScaleY(sizeDir.height / sizeImg.height);
	   	this.addChild(imageView);
//    	
//    	//声音开关
//    	var bMusic = LocalStorageMgr.getInstance().getMusicItem();
//    	var bSound = LocalStorageMgr.getInstance().getSoundItem();
//    	SoundMgr.getInstance().setPlayMusic(bMusic);
//    	SoundMgr.getInstance().setPlayEffect(bSound);
//    	
//    	//声音大小
//    	var musicVolume = LocalStorageMgr.getInstance().getMusicVolumeItem();
//    	var soundVolume = LocalStorageMgr.getInstance().getSoundVolumeItem();
//    	var value = Math.floor(musicVolume) / 100;
//    	console.log(value)
//    	SoundMgr.getInstance().setMusicVolume(value);
//    	value = Math.floor(soundVolume) / 100;
//    	console.log(value)
//    	SoundMgr.getInstance().setEffectsVolume(value);

        cc.log("PlazaMainLayer--------------------------------------------------end");
    },
});


var PlazaScene = cc.Scene.extend({
	ctor:function () {
		this._super();
		this.init();

		this.layer = new PlazaMainLayer();
		this.addChild(this.layer);
		this.layer.init();
	},
	
    onEnter: function () {
        this._super();

    },
    
    onEnterTransitionDidFinish:function () {    	
    	this._super();
    	this.sceneName = "PlazaScene";
    	
    	ClientData.getInstance().setReplaceScene(false);

    	//保证游戏socket是关闭状态
    	if(g_gameSocket.status != SOCKET_STATUS._SS_INVALID){
    		g_gameSocket.close();
    		cc.log("--------g_gameSocket.close()---------");
    	}

    	UIMgr.getInstance().init(this.layer);
    	PlazaUIMgr.getInstance().init(this.layer);
    	
    	this.checkLockInfo();
        cc.log("场景scene加载完毕,去获取服务器当前时间");
        UserServerMsg.getInstance().sendServerTime();
    },
    
    checkLockInfo: function(){

    	//检测是否有锁定
    	var lockInfo = g_objHero.getLockInfo();
    	var plaza = ClientData.getInstance().getPlaza();
        cc.log("get lock info ................... ", lockInfo.ServerIP)
    	if(lockInfo.ServerIP && lockInfo.ServerIP != ""){
    		cc.log("-------直接进入游戏----lockInfo.ServerIP---"+lockInfo.ServerIP);
    		setTimeout(function(){
    			plaza.setRoomOpType(ROOM_OPERATION_ADD);
    			plaza.setCurKindID(lockInfo.dwKindID);
    			var kindId = plaza.getCurKindID();
    			var listServer = plaza.getListServerByKindID(kindId);
    			var roomServerInfo = listServer[0];

    			var room = ClientData.getInstance().getRoom();
    			if(room){
    				room.setCurServer(roomServerInfo);
    			}

    			var addr = lockInfo.ServerIP.split(":")

    			//
    			PlazaUIMgr.getInstance().connectGameServer(addr[0], addr[1]);
    		}, 0);
    	}
    },

    getSceneName: function(){
    	return this.sceneName;
    },
    
    isPlazaScene: function(){
    	return true;
    },
    
    isGameScene: function(){
    	return false;
    },
});