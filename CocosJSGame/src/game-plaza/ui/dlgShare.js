

DLG_CREATOR[ID_DlgShare] = function() {
	return new DlgShare();
};

var DlgShare = DlgBase.extend({
	ctor: function(){},

	onCreate: function() {
		this.init();
	},

	onClose: function() {

	},

	init: function() {
		var json = ccs.load(res.dlgShareScene_json);
		this._rootWidget = json.node;

		//自适应屏幕大小
		var sizeDir = cc.director.getWinSize();
		this._rootWidget.setContentSize(sizeDir);
		ccui.helper.doLayout(this._rootWidget);

		this.ImgBg = this._rootWidget.getChildByName('ImgBg');

		

		this.BtnClose = this.ImgBg.getChildByName('BtnClose');
		this.BtnClose.setPressedActionEnabled(true);
		this.BtnClose.addTouchEventListener(this.onClickEvent, this);
		
		this.BtnShareWx = this.ImgBg.getChildByName('BtnShareWx');
		this.BtnShareWx.setPressedActionEnabled(true);
		this.BtnShareWx.addTouchEventListener(this.onClickEvent, this);
		
		this.BtnShareWxFriend = this.ImgBg.getChildByName('BtnShareWxFriend');
		this.BtnShareWxFriend.setPressedActionEnabled(true);
		this.BtnShareWxFriend.addTouchEventListener(this.onClickEvent, this);
		
		this.BtnShareSina = this.ImgBg.getChildByName('BtnShareSina');
		this.BtnShareSina.setPressedActionEnabled(true);
		this.BtnShareSina.addTouchEventListener(this.onClickEvent, this);
		this.BtnShareSina.setVisible(false);
		
		this.BtnShareQQ = this.ImgBg.getChildByName('BtnShareQQ');
		this.BtnShareQQ.setPressedActionEnabled(true);
		this.BtnShareQQ.addTouchEventListener(this.onClickEvent, this);
		this.BtnShareQQ.setVisible(false);
		
		this.BtnShareQQSpace = this.ImgBg.getChildByName('BtnShareQQSpace');
		this.BtnShareQQSpace.setPressedActionEnabled(true);
		this.BtnShareQQSpace.addTouchEventListener(this.onClickEvent, this);
		this.BtnShareQQSpace.setVisible(false);
		
		this.addActionNodeMB(this.ImgBg);
	},

	onClickEvent: function(sender, type) {
		if (ccui.Widget.TOUCH_ENDED == type) {
			var strBtnName = sender.getName();
			cc.log('onClickEvent ' + strBtnName);
			switch (strBtnName) {
			case "BtnClose":
				UIMgr.getInstance().closeDlg(ID_DlgShare);
				break;
			case "BtnShareWx":
				this.wxsdkShare(true);
				break;
			case "BtnShareWxFriend":
                this.wxsdkShare(false);
				break;
			case "BtnShareSina":
			case "BtnShareQQ":
			case "BtnShareQQSpace":
				break;
			default:
				break;
			}
		}
	},

	//分享链接
	/*
	例子：
	if(cc.sys.isNative){
		var shareUrl = "http://wap.91236.com";
		var title = "【91236游戏中心】";
		var description = "【91236游戏中心】我的手机棋牌游戏中心，一起来玩吧！";

		var dlgShare = UIMgr.getInstance().openDlg(ID_DlgShare);
		if(dlgShare){
			dlgShare.setShareUrlInfo(shareUrl, title, description);
		}
	}
	*/
    setShareUrlInfo: function(shareUrl, title, description){
        this._shareUrl = shareUrl;
        this._title = title;
        this._description = description;

        this._shareType = "url";
    },

    //分享图片, imgPath：图片在手机sd卡上的路径
    /*
    例子：
    if(cc.sys.isNative){
	    //截屏
	    zutils.captureScreen("share.jpg", function(bSucc, outputFile){
	    	//outputFile 截屏图片在手机上的路径
	        //cc.log("bSucc == " + bSucc + "   outputFile === " + outputFile);
	        if(bSucc){
	            var dlgShare = UIMgr.getInstance().openDlg(ID_DlgShare);
	            dlgShare.setShareImgInfo(outputFile);
	        }
	    });
	}
    */
    setShareImgInfo: function(imgPath){
        this._shareImgPath = imgPath;

        this._shareType = "img";
    },

    //分享到微信/朋友圈
    wxsdkShare: function(isSession){
        if(!cc.sys.isNative){
            return;
        }

        if(this._shareType == "url"){
            gg.WxSdkMgr.getInstance().wxSdkShareUrl(
                this._shareUrl,
                this._title,
                this._description,
                isSession
            );
        }

        if(this._shareType == "img"){
            gg.WxSdkMgr.getInstance().wxSdkShareImg(
                isSession,
                this._shareImgPath
            );
        }
    },
});
