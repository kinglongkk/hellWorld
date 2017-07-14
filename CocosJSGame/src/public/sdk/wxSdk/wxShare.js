var WXShare = cc.Class.extend({
    ctor: function () {
        this.reset();
        this._bInit = false;
        this.init();
    },
    reset: function(){},
    init: function(){ this._bInit = true; },
    
    //分享URL
    /*target:分享目标 (SHARE_TARGET_CIRCLE: false,	//分享到朋友圈) (SHARE_TARGET_FRIEND: true,	//分享给好友 )
     * url: 分享的链接地址
     * title：分享的标题
     * description：分享的内容
     * shareCallBack：分享成功回调
     * taskType：分享的任务类型
     * taskCallBack：分享的任务回调 默认为显示提示框taskCallBack = function(data){}
     * */
    shareURL: function(target, url, title, description, shareCallBack, taskType, taskCallBack){
    	this.shareCallBack = shareCallBack;
    	if(taskType){
    		this.taskType = taskType;
    		this.taskCallBack = taskCallBack;
    	}
    	gg.WxSdkMgr.getInstance().wxSdkShareUrl( url, title, description, target);
    },
    
    //分享图片
    shareImage: function(target, imagePath, shareCallBack, taskType, taskCallBack){
    	this.shareCallBack = shareCallBack;
    	if(taskType){
    		this.taskType = taskType;
    		this.taskCallBack = taskCallBack;
    	}
    	
    	gg.WxSdkMgr.getInstance().wxSdkShareImg(
    			target,
    			imagePath
    	);
    },
    
    //截屏分享
    shareCaptureScreen: function(target, shareCallBack, taskType, taskCallBack){
    	var self = this;
    	//var outputFile = jsb.fileUtils.getWritablePath();
    	zutils.captureScreen("share.jpg", function(bSucc, outputFile){
    		if(bSucc){
    			self.shareImage(target, outputFile, shareCallBack, taskType, taskCallBack);
    		}
    	});
    },
    
    //微信分享回调
    wxShareOKCallBack: function(){
    	if(this.taskType){
    		var self = this;
    		var cb = function (parseData){
    			if(self.taskCallBack){
    				self.taskCallBack(parseData);
    				self.taskCallBack = null;
    			}
    			else{
    				cc.log("测试分享获取金币 cb calling 2");
    				DlgTip.openSysTip(parseData.szDescribeString);
    			}
    			
    			self.taskType = null;
    		};
    		
    		LogonMsgHandler.getInstance().connect(function(){
    			UserServerMsg.getInstance().sendWXShareOKReq(taskType,cb);
    		});
    	}
    	
    	if(this.shareCallBack){
    		this.shareCallBack();
    		this.shareCallBack = null;
    	}
    },
    
    //安卓 系统提示
    showSysTip: function(strTip){
    	if(cc.sys.isNative){
    		if(cc.sys.os == cc.sys.OS_ANDROID){
    			jsb.reflection.callStaticMethod(
    					"org/cocos2dx/javascript/AppActivity",
    					"onShowTip",
    					"(Ljava/lang/String;)V",
    					"分享给好友 true"
    			);
    		}
    	}
    },
});

//分享目标
WXShare.SHARE_TARGET_CIRCLE = false;	//分享到朋友圈
WXShare.SHARE_TARGET_FRIEND = true; //分享给好友 true

//分享任务类型 有任务奖励
WXShare.SHARE_TASKTYPE_INVITE = 92;	//邀请好友
WXShare.SHARE_TASKTYPE_CIRCLE = 93;	//分享朋友圈

var g_WXShare = null;
WXShare.getInstance = function() {
	if (!g_WXShare) {
		g_WXShare = new WXShare();
	}
	return g_WXShare;
};