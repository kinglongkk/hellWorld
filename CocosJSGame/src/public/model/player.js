var Player = cc.Class.extend({
    ctor: function () {
        this.reset();
    },
    
    reset: function(){
    	this.userId = INVALID_USERID;
    	this.gameId = -1;
    	this.tableID = INVALID_TABLE;
    	this.chairID = INVALID_CHAIR;
    	this.roomID = INVALID_TABLE;
    	this.account = "";
    	this.md5Pass = "";
    	this.nickName = "";
    	this.gender = 0; //男1女0
    	this.money = 0;
    	this.score = 0;	//积分-房卡
    	this.szSpreader = 0;	//推广ID
    	
    	this.insureMoney = 0;
    	this.experience = 0;
    	this.faceId = 0;
    	this.memberOrder = 0;
    	this.status = 0;
    	this.underWrite = "";
    	this.winCount = 0;
    	this.lostCount = 0;
    	this.drawCount = 0;
    	this.fleeCount = 0;
    	this.registerDate = {};
    	this.Sign = "" ;   //个性签名
		this.data ={};

    	this.mDiamond = 0;
    	this.mbTicket = 0;
    	this.mbPayTotal = 0;
    	this.mbVipLevel = 0;
    	this.payMbVipUpgrade=0;
    	this.loginType = 0;
    	this.lRoomCard = 0;//房卡数量
        this.headerUrl = "";

        this.dwDrawCountLimit = 0;  // 局数限制
        this.dwDrawTimeLimit = 0;   // 时间限制
        
        //是否请求过同桌用户信息
        this.isEnter = false;

        // 用户位置信息
        this.nearUserInfo = null;
    },

	setPlayerInfo:function(info){
		this.data =info;
	},

	getPlayerInfo:function(){
		return this.data;
	},
//    setPlayerInfo:function(info){
//    	var dlgUserInfo = UIMgr.getInstance().getDlg(ID_DlgUserInfo);
//    	if(dlgUserInfo==null){
//            dlgUserInfo = UIMgr.getInstance().openDlg(ID_DlgUserInfo);
//    	}
//
//        dlgUserInfo.doReFresh();
//
////  	dlgInfo.faceId = g_objHero.getFaceId(); //头像
//        dlgUserInfo.nickName = info.NickName;
//        dlgUserInfo.userId = info.dwUserID;
//        dlgUserInfo.money = info.lScore;
//        dlgUserInfo.level = info.MemberOrder;
//        dlgUserInfo.wingame = info.dwWinCount;
//        dlgUserInfo.gameTotal = info.dwWinCount+info.dwLostCount+info.dwDrawCount;
//        dlgUserInfo.diamond = info.dwMedal;
//        dlgUserInfo.roomcard = info.dwRoomCard;
//    	if(info.HeadImgUrl){
//    		this.setHeaderUrl(info.HeadImgUrl);
//    	}
//    	cc.log("setPlayerInfo---"+this.getSpreaderID());
//    	//var self = this;
////        if (info.dwUserID == g_objHero.getUserId()) {
////        	self = null;
////		} else {
////            self = this;
////		}
//        dlgUserInfo.updateDlg(this);
//    	console.log("playerInfo = " + JSON.stringify(info));
//
//    },

    // 位置信息
    setNearUserInfo: function (nearUserInfo) {
        this.nearUserInfo = nearUserInfo;
    },

    getNearUserInfo: function () {
        return this.nearUserInfo;
    },

    //roomID
    getRoomID: function(){
    	return this.roomID;
    },
    setRoomID: function(roomID){
    	this.roomID = roomID;
    },
    
    getSpreaderID: function(){
    	return this.szSpreader;
    },
    setSpreaderID: function(szSpreader){
    	this.szSpreader = szSpreader;
    },
    
    //房卡数量
    getRoomCard: function(){
    	return this.lRoomCard;
    },
    setRoomCard: function(lRoomCard){
    	this.lRoomCard = lRoomCard;
    	this.emitChangeMoney();
    },

    //房卡数量
    getHallNodeID: function(){
        return this.HallNodeID;
    },
    setHallNodeID :function(HallNodeID){
        this.HallNodeID = HallNodeID;
    },
    
    //UID
    getUserId: function(){
        return this.userId;
    },
    setUserId: function(userId){
    	this.userId = userId;
    },
    
    getGameId: function(){
    	return this.gameId;
    },
    setGameId: function(gameId){
    	this.gameId = gameId;
    },

    //tableId
    getTableId: function(){
    	cc.log("getTableId-----"+this.tableID);
        return this.tableID;
    },
    setTableId: function(tableID){
    	cc.log("setTableId-----++++"+tableID);
        this.tableID = tableID;
        cc.log("setTableId-----++++"+this.tableID);
    },

    //chairID
    getChairID: function(){
        return this.chairID;
    },
    setChairID: function(chairID){
        this.chairID = chairID;
    },

    //账号
    getAccount: function(){
        return this.account;
    },
    setAccount: function(account){
    	this.account = account;
    },
    
    //密码MD5
    getMd5Pass: function(){
    	return this.md5Pass;
    },
    setMd5Pass: function(md5Pass){
    	this.md5Pass = md5Pass;
    },

    //玩家昵称
    getNickName: function(){
    	return this.nickName;
    },
    setNickName: function(nickName){
    	this.nickName = nickName;
        this.emitChangeMoney();
    },

    //玩家性别，男1女0
    getGender: function(){
        return this.gender;
    },
    setGender: function(gender){
        this.gender = gender;
    },

    //金币
    getMoney: function(){
        return this.money;
    },
    setMoney: function(money){
    	cc.log("------setMoney------"+money);
        this.money = money;
        
        this.emitChangeMoney(money);
    },
    //积分
    getScore: function(){
    	return this.score;
    },
    setScore: function(score){
    	cc.log("------setscore------"+score);
    	this.score = score;

    	this.emitChangeScore(score);
    },
    
    //银行金币
    getInsureMoney: function(){
    	return this.insureMoney;
    },
    setInsureMoney: function(money){
    	this.insureMoney = money;
    },
    
    //经验
    getExperience: function(){
    	return this.experience;
    },
    getExpPercent: function(){
    	var exePercent = 0;
    	if (this.experience > 0){
    		//变量定义
    		var dwIncrease = 0;
    		var dwLevelValue = 0;
    		var levelExp = 0;

    		//等级计算
    		var wUserLevel;
    		for (wUserLevel=1; wUserLevel<60; wUserLevel++){
    			dwIncrease += wUserLevel * 30;
    			levelExp = dwLevelValue;
    			dwLevelValue = dwLevelValue+dwIncrease;
    			
    			if (this.experience < dwLevelValue) {
    				exePercent = 100*(this.experience-levelExp)/(dwLevelValue-levelExp);
    				break;
    			}
    		}
    	}
    	
    	return exePercent;
    },
    setExperience: function(experience){
    	this.experience = experience;
    },
    //经验等级
    getExperienceLevel: function(){
    	if (this.experience > 0){
    		//变量定义
    		var dwIncrease = 0;
    		var dwLevelValue = 0;

    		//等级计算
    		var wUserLevel;
    		for (wUserLevel=1; wUserLevel<60; wUserLevel++){
    			dwIncrease += wUserLevel * 30;
    			dwLevelValue = dwLevelValue+dwIncrease;
    			if (this.experience < dwLevelValue) break;
    		}
    		return wUserLevel;
    	}

    	return 0;
    },

    //头像ID
    getFaceId: function(){
        return this.faceId;
    },
    setFaceId: function(faceId){
    	this.faceId = faceId;
    },
    getFacePicName: function(){
    	var faceId = this.faceId % 10;
    	var fileName = "img_male_";
    	if(faceId < 5){
    		fileName = "img_female_";
    	}else{
    		faceId -= 5;
    	}

    	fileName += faceId;
    	fileName += ".png";
    	
    	return fileName;
    },
    
    //会员等级
    getMemberOrder: function(){
    	return this.memberOrder;
    },
    setMemberOrder: function(memberOrder){
    	this.memberOrder = memberOrder;
    },
    
    //underWrite
    getUnderWrite: function(){
    	return this.underWrite;
    },
    setUnderWrite: function(str){
    	this.underWrite = str;
    },
    
    //winCount
    getWinCount: function(){
    	return this.winCount;
    },
    setWinCount: function(winCount){
    	this.winCount = winCount;
    },

    //lostCount
    getLostCount: function(){
    	return this.lostCount;
    },
    setLostCount: function(lostCount){
    	this.lostCount = lostCount;
    },

    //drawCount
    getDrawCount: function(){
    	return this.drawCount;
    },
    setDrawCount: function(drawCount){
    	this.drawCount = drawCount;
    },

    //fleeCount
    getFleeCount: function(){
    	return this.fleeCount;
    },
    setFleeCount: function(fleeCount){
    	this.fleeCount = fleeCount;
    },

    //game total
    getGameTotal: function(){
    	var total = this.winCount + this.lostCount + this.drawCount + this.fleeCount;
    	return total;
    },

	//个性签名
	setSign:function(Sign){
		this.Sign =Sign;
	},

	getSign:function(){
		return this.Sign;
	},
    //registerDate
    getRegisterDate: function(){
    	return this.registerDate;
    },
    setRegisterDate: function(registerDate){
    	this.registerDate = registerDate;
    },
    
    //兑换券
    getMbTicket: function(){
    	return this.mbTicket;
    },
    setMbTicket: function(mbTicket){
    	this.mbTicket = mbTicket;
    },
    //钻石
    getMbDiamond: function(){
    	return this.mDiamond;
    },
    setMbDiamond: function(mDiamond){
    	this.mDiamond = mDiamond;
    	this.emitChangeMoney();
    },

    //手机充值累计
    getMbPayTotal: function(){
    	return this.mbPayTotal;
    },
    setMbPayTotal: function(mbPayTotal){
    	this.mbPayTotal = mbPayTotal;
    },

    //手机VIP等级
    getMbVipLevel: function(){
    	return this.mbVipLevel;
    },
    setMbVipLevel: function(mbVipLevel){
    	this.mbVipLevel = mbVipLevel;
    },

    //手机VIP升级需充值数
    getPayMbVipUpgrade: function(){
    	return this.payMbVipUpgrade;
    },
    setPayMbVipUpgrade: function(payMbVipUpgrade){
    	this.payMbVipUpgrade = payMbVipUpgrade;
    },

    //玩家状态
    getStatus: function(){
        return this.status;
    },

    setStatus: function(status){
    	this.status = status;
    },
    // 玩家头像URL
    getHeaderUrl: function(){
        return this.headerUrl;
    },
                             
    setHeaderUrl: function(url){
    	cc.log("setHeaderUrl--"+url);
    	this.headerUrl = url;
    },
    //积分
    emitChangeScore: function(data){
    	if(this.userId == INVALID_USERID){
    		return;
    	}

    	var eventName = "_CHANGE_SCORE_" + this.userId;
    	var eventCustom = new cc.EventCustom(eventName);
    	eventCustom.setUserData(data);
    	cc.eventManager.dispatchEvent(eventCustom);
    },

    addListenerChangeScore: function(cb){
    	if(this.userId == INVALID_USERID){
    		return;
    	}
    	var eventName = "_CHANGE_SCORE_" + this.userId;
    	var listener = cc.EventListener.create({
    		event: cc.EventListener.CUSTOM,
    		eventName: eventName,
    		callback: cb
    	});
    	cc.eventManager.addListener(listener, 1);

    	return listener;
    },  
    //金币
    emitChangeMoney: function(data){
    	if(this.userId == INVALID_USERID){
    		return;
    	}
    	
    	var eventName = "_CHANGE_MONEY_" + this.userId;
    	var eventCustom = new cc.EventCustom(eventName);
    	eventCustom.setUserData(data);
    	cc.eventManager.dispatchEvent(eventCustom);
    },
    
    addListenerChangeMoney: function(cb){
    	if(this.userId == INVALID_USERID){
    		return;
    	}
    	
    	var eventName = "_CHANGE_MONEY_" + this.userId;
    	var listener = cc.EventListener.create({
    		event: cc.EventListener.CUSTOM,
    		eventName: eventName,
    		callback: cb
    	});
    	cc.eventManager.addListener(listener, 1);
    	
    	return listener;
    },

    //文字消息
    emitWordMsg: function(data){
    	var eventName = "_RECV_WORDMSG_";
    	var eventCustom = new cc.EventCustom(eventName);
    	eventCustom.setUserData(data);
    	cc.eventManager.dispatchEvent(eventCustom);
    },

    addListenerWordMsg: function(cb){
    	var eventName = "_RECV_WORDMSG_";
    	
    	var listener = cc.EventListener.create({
    		event: cc.EventListener.CUSTOM,
    		eventName: eventName,
    		callback: cb
    	});
    	
    	cc.eventManager.removeCustomListeners(eventName);
    	cc.eventManager.addListener(listener, 1);

    	return listener;
    },
    
    //加载网络图片并保存
    loadUrlImage: function(cb){
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
    	var target = this;
    	
    	var url = this.getHeaderUrl();
    	if(!url || url.length==0){
    		//无网络头像 启用本地默认头像
    		//url = "http://a-ssl.duitang.com/uploads/item/201607/05/20160705130934_MLJzU.jpeg"; //测试url 默认图片
    		var headFile = "res/public/faceGirl.jpg";
    		if(this.getGender()==1){
    			headFile = "res/public/faceBoy.jpg";
    		}
    		headFile = jsb.fileUtils.fullPathForFilename(headFile);
    		cc.log(this.getGender()+"headFile--"+headFile);
    		cb(headFile);
    		return;
    	}
    	var start = url.lastIndexOf("/", url.length)+1;
    	var end = url.lastIndexOf(".", url.length);
    	if(end<start){
    		end = url.length;
    	}
    	var fileName = url.substring(start, end);
    	cc.log("URL----fileName-------"+fileName);
    	var savePath = jsb.fileUtils.getWritablePath()+"headImage_"+target.getUserId()+"_"+fileName+".jpg";
    	if(jsb.fileUtils.isFileExist(savePath) && cb){
    		cb(savePath);
    		return;
    	}
    	
    	cc.log("****url***"+url);
    	var xhr = new XMLHttpRequest();    
    	xhr.open("get", url, true);
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

