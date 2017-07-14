DLG_CREATOR[ID_DlgWelfare] = function() {
	return new DlgWelfare();
};

var DlgWelfare = DlgBase.extend({
	ctor: function(){
		this.recordCount = 0;
		this.ptBegan = null;
		this._touchListener = null;
	},

	onCreate: function() {
		this.init();
	},

	onClose: function() {
		if(this._touchListener){
			cc.eventManager.removeListener(this._touchListener);
		}
	},

	init: function() {
		var json = ccs.load(res.dlgWelfareScene_json);
                                
		this._rootWidget = json.node;
		var sizeDir = cc.director.getWinSize();// 自适应屏幕大小
		this._rootWidget.setContentSize(sizeDir);
		ccui.helper.doLayout(this._rootWidget);

		this.ImgBg = this._rootWidget.getChildByName('Image_bg');
		this.BtnClose = this.ImgBg.getChildByName('Button_close');
		this.BtnClose.setPressedActionEnabled(true);
		this.BtnClose.addTouchEventListener(this.onClickEvent, this);
		this.PanelList = this.ImgBg.getChildByName('Panel_List');
		var size = this.PanelList.getSize();
		var tableView = new cc.TableView(this, size);
		tableView.setDirection(cc.SCROLLVIEW_DIRECTION_VERTICAL);
		tableView.setDelegate(this);
		tableView.setVerticalFillOrder(cc.TABLEVIEW_FILL_TOPDOWN);
		this.PanelList.addNode(tableView);
         
		this.tableView = tableView;

		this.addListenerTableViewTouch();
		this.reloadTaskList();
	},

	onClickEvent:function(sender, type) {
		if (ccui.Widget.TOUCH_ENDED == type) {
			var strBtnName = sender.getName();
			cc.log('onClickEvent ' + strBtnName);
			switch (strBtnName) {
			case "Button_close":
				UIMgr.getInstance().closeDlg(ID_DlgWelfare);
				break;
			default:
				break;
			}
		}
	},
//	加载数据
	reloadTaskList: function(){
		this.recordCount = 4;
		this.tableView.reloadData();
	},


	// 监听tableView Touch事件
	addListenerTableViewTouch: function(){
		var listener = cc.EventListener.create({
			event: cc.EventListener.TOUCH_ONE_BY_ONE,
			swallowTouches: false,
			onTouchBegan: function (touch, event){
				if(this.tableView.isVisible()){
					var ptThouch = touch.getLocation();
					this.ptBegan = ptThouch;
				}
				return true;
			}.bind(this),
			onTouchMoved: function (touch, event){},
			onTouchEnded: function (touch, event){}
		});

		this._touchListener = listener;
		cc.eventManager.addListener(listener, this.tableView);
	},

	scrollViewDidScroll:function (view) {
	},
	scrollViewDidZoom:function (view) {
	},

	tableCellTouched:function (table, cell) {
		cc.log("cell touched at index: " + cell.getIdx());

		if(!this.ptBegan){
			return;
		}
		var index = cell.getIdx();
		var item = cell.getChildByTag(100);
		var BtnFun = item.getChildByName('Btn_fun');
		var sizeFun = BtnFun.getSize();
		var rectFun = cc.rect(0, 0, sizeFun.width, sizeFun.height);
		var ptFun = BtnFun.convertToNodeSpace(this.ptBegan);
		var bContainFun = cc.rectContainsPoint(rectFun, ptFun);
		var BtnTemp = null;

		if (bContainFun){
			if(BtnFun.isVisible()){
				BtnTemp = BtnFun;
				var cb = null;
				// 区分按钮反应
				if(0 == index){

					cb = function (bl,parseData){
						if (true==bl) {
							cc.log("低保福利已领取成功 sucess  calling 1");

						}
						else {
							cc.log("低保福利已领取失败 fail  calling 1");
						}

                        DlgTip.openSysTip(parseData.szNotifyContent);
					}
					LogonMsgHandler.getInstance().connect(function(){
						UserServerMsg.getInstance().sendBasicEnsureReq(cb);
					});




                    // 测试定位
/*
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
*/
				}
				else if(1 == index){
					/*var taskID = 0; 	// 充值类型 （0，金币 1，钻石）
					var kindID = 0;	// 充值数量
					cb = function (parseData){
						cc.log("首充充值 cb calling 2");

                        DlgTip.openSysTip(parseData.szDescribeString);
					}
					LogonMsgHandler.getInstance().connect(function(){
						UserServerMsg.getInstance().sendFirstPayReq(taskID,kindID,cb);
					});*/
                    DlgTip.openSysTip("暂未开放，敬请期待！");
				}
				else if(2 == index){
				 	cc.log("邀请界面");
				 	var shareUrl = _CONFIG_.URL_PART1_INVITE+g_objHero.getUserId()+"-"+"room-000000"+_CONFIG_.URL_PART2;
				 	var title = "一起搓几局，麻雀家乡见！";
				 	var description = "老牌友在等你，点击立即加入，一起搓个天昏地暗！";
					this.setShareUrlInfo(shareUrl, title, description);
					this.wxsdkShare(true);
				}
				else if(3 == index){

					cc.log("分享界面");
					var shareUrl = _CONFIG_.URL_PART1_SHARE+g_objHero.getUserId()+_CONFIG_.URL_PART2;
					var title = "一起搓几局，麻雀家乡见！";
					var description = "老牌友在等你，点击立即加入，一起搓个天昏地暗！";
                    this.setShareUrlInfo(shareUrl, title, description);
					this.wxsdkShare(false);

					
					/*
                    // 测试截屏分享ok
					var tempThis = this;
					zutils.captureScreen("share.jpg", function(bSucc, outputFile){
						if(bSucc){
							tempThis.setShareImgInfo(outputFile);
							tempThis.wxsdkShare(false); // false 朋友圈 ture 朋友
						}
					});     	
                     */ 
					/*
					// 微信支付测试
					var goodsInfo={goodsId:null,price:null,count:null,goodsName:null};
                    goodsInfo.goodsId = 1;
                    goodsInfo.price = 1;
                    goodsInfo.count = 1;
                    goodsInfo.goodsName = "zs";

					gg.WxSdkMgr.getInstance().wxSdkPay(goodsInfo);
					*/
				}
			}
		}
	},

	tableCellSizeForIndex:function (table, idx) {
		return cc.size(890, 110);
	},

	tableCellAtIndex:function (table, idx) {
		var index = idx.toFixed(0);
		var cell = table.dequeueCell();
		if (!cell) {
			cell = new cc.TableViewCell();
			var json = ccs.load(res.NodeWelfare_json);
			var node = json.node;
			node.x = 450;
			node.y = 65;
			cell.addChild(node, 0, 100);
		}

		var item =  cell.getChildByTag(100);
		var ImgHeader = item.getChildByName('Img_header');
		var ImgContent = item.getChildByName('Img_content');
		var LabTextDetail = item.getChildByName('Text_detail');
		var BtnFun = item.getChildByName('Btn_fun');

		cc.log("%d",index);

		if (index == 0) // 领取低保 
		{
			ImgHeader.loadTexture("welfare/Icon_baseEnsure.png", ccui.Widget.PLIST_TEXTURE);
			ImgContent.loadTexture("welfare/text_baseEnsure.png", ccui.Widget.PLIST_TEXTURE);
			BtnFun.loadTextureNormal("welfare/btn_ensure.png", ccui.Widget.PLIST_TEXTURE);
			LabTextDetail.string = "游戏币数量低于500，每次可以领取1000（限制3次/天）";
		}
		else if (index == 1) // 首冲 -微信支付
		{
			ImgHeader.loadTexture("welfare/icon_firstday.png", ccui.Widget.PLIST_TEXTURE);
			ImgContent.loadTexture("welfare/text_firstday.png", ccui.Widget.PLIST_TEXTURE);
			BtnFun.loadTextureNormal("welfare/btn_firstday.png", ccui.Widget.PLIST_TEXTURE);
			LabTextDetail.string = "每日一冲，就那么任性！";
		}
		else if (index == 2) // 邀请好友
		{
			ImgHeader.loadTexture("welfare/icon_invite.png", ccui.Widget.PLIST_TEXTURE);
			ImgContent.loadTexture("welfare/text_invite.png", ccui.Widget.PLIST_TEXTURE);
			BtnFun.loadTextureNormal("welfare/btn_invite.png", ccui.Widget.PLIST_TEXTURE);
			LabTextDetail.string = "觉得我们做的好，就分享给你的朋友，即可获得1000游戏币！";
		}
		else if (index == 3) //分享朋友圈
		{
			ImgHeader.loadTexture("welfare/icon_share.png", ccui.Widget.PLIST_TEXTURE);
			ImgContent.loadTexture("welfare/text_shareWx.png", ccui.Widget.PLIST_TEXTURE);
			BtnFun.loadTextureNormal("welfare/btn_share.png", ccui.Widget.PLIST_TEXTURE);
			LabTextDetail.string = "觉得我们做的好，就分享给你的朋友，即可获得1000游戏币！";
		}
		return cell;
	},

	numberOfCellsInTableView:function (table) {
		return this.recordCount;
	},

    /*******************************about wx *************************************/

    setShareUrlInfo: function(shareUrl, title, description){
        this._shareUrl = shareUrl;
        this._title = title;
        this._description = description;
        this._shareType = "url";
    },

    setShareImgInfo: function(imgPath){
        this._shareImgPath = imgPath;
        this._shareType = "img";
    },

    //分享到微信/朋友圈
    wxsdkShare: function(isSession){

        if(!cc.sys.isNative){
            cc.log("cc.sys.isNativ = false");
            return;
        }

        if(this._shareType == "url"){
            cc.log("分享url类型");
            gg.WxSdkMgr.getInstance().wxSdkShareUrl(
                this._shareUrl,
                this._title,
                this._description,
                isSession
            );
        }

        if(this._shareType == "img"){
            cc.log("分享img类型");
            gg.WxSdkMgr.getInstance().wxSdkShareImg(
                isSession,
                this._shareImgPath
            );
        }
    },

    // 分享朋友圈成功的回掉函数
    WXShareCBSucc:function(){
        cc.log("微信分享成功 直接调用后台接口");
        var taskType = 92; //任务类型 92邀请好友，93分享朋友圈
        cb = function (parseData){
            cc.log("测试分享获取金币 cb calling 2");
            DlgTip.openSysTip(parseData.szDescribeString);
        }
        LogonMsgHandler.getInstance().connect(function(){
            UserServerMsg.getInstance().sendWXShareOKReq(taskType,cb);
        });
        
        WXShare.getInstance().showSysTip("---邀请好友成功---");
    },
    
    
    // 支付成功回调
    WXPaySuccess:function(){
    	cc.log("微信支付成功回调"); 
    },

                                

	// //////////////////////////////////////////////////////////
});
