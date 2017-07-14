

DLG_CREATOR[ID_DlgMail] = function() {
	return new DlgMail();
};

var DlgMail = DlgBase.extend({
	ctor: function(){
		this._seleTag = 0;
		this.recordCount = 0;
		
		this.ptBegan = null;
		this._touchListener = null;
	},

	onCreate: function() {
		this.init();
	},

	onClose: function() {		
		var dlgPlaza = UIMgr.getInstance().openDlg(ID_DlgPlaza);
		dlgPlaza.requestNewMail();	
		
		if(this._touchListener){
			cc.eventManager.removeListener(this._touchListener);
		}
	},

	init: function() {
		var json = ccs.load(res.dlgMailScene_json);
		this._rootWidget = json.node;

		//自适应屏幕大小
		var sizeDir = cc.director.getWinSize();
		this._rootWidget.setContentSize(sizeDir);
		ccui.helper.doLayout(this._rootWidget);

		this.ImgBg = this._rootWidget.getChildByName('ImgBg');

		this.BtnBack = this._rootWidget.getChildByName('BtnBack');
		this.BtnBack.setPressedActionEnabled(true);
		this.BtnBack.addTouchEventListener(this.onClickEvent, this);
		
		this.LabSele = [];
		this.ImgSele = [];
		for(var i=0; i<4; i++){
			var name = "LabSele_" + i;
			this.LabSele[i] = this._rootWidget.getChildByName(name);
			this.LabSele[i].addTouchEventListener(this.onClickSeleEvent, this);
			
			name = "ImgSele_" + i;
			this.ImgSele[i] = this.LabSele[i].getChildByName(name);
			
			if(i == 0){
				this.LabSele[i].setColor(cc.color(255,243,212));
				this.ImgSele[i].setVisible(true);
				this._seleTag = 0;
			}else{
				this.LabSele[i].setColor(cc.color(221,141,92));
				this.ImgSele[i].setVisible(false);
			}
		}
		
		this.PanelList = this._rootWidget.getChildByName('PanelList');
		var size = this.PanelList.getSize();
		var tableView = new cc.TableView(this, size);
		tableView.setDirection(cc.SCROLLVIEW_DIRECTION_VERTICAL);
		tableView.setDelegate(this);
		this.PanelList.addNode(tableView);
		this.tableView = tableView;
		
		var mails = this.getMailList();
		if(mails.length == 0){
			this.requestEmailListFirst();
		}else{
			this.reloadMailList(true);
		}
		
		this.addListenerTableViewTouch();
	},
	
	
	requestEmailListFirst: function(){
		var emailType = this._seleTag;	//邮件类型：0新邮件，1系统邮件，2活动邮件，3好友邮件
		var sendType = 0; 	//发送类型：0：最小邮件ID，1：最大邮件ID
		var page = 5;	//每页数量
		var maxMailID = 0;
		
		MailHttp.getInstance().requestEmailList(emailType, sendType, page, maxMailID);
	},
	requestEmailListT: function(){
		var mail = ClientData.getInstance().getMail();
		var mailList = this.getMailList();
		
		var emailType = this._seleTag;	//邮件类型：0新邮件，1系统邮件，2活动邮件，3好友邮件
		var sendType = 1; 	//发送类型：0：最小邮件ID，1：最大邮件ID
		var page = 5;	//每页数量
		var maxMailID = mail.getMaxMailID(mailList);
		
		MailHttp.getInstance().requestEmailList(emailType, sendType, page, maxMailID);
	},
	
	requestEmailListB: function(){
		var mail = ClientData.getInstance().getMail();
		var mailList = this.getMailList();

		var emailType = this._seleTag;	//邮件类型：0新邮件，1系统邮件，2活动邮件，3好友邮件
		var sendType = 0; 	//发送类型：0：最小邮件ID，1：最大邮件ID
		var page = 5;	//每页数量
		var minMailID = mail.getMinMailID(mailList);
		
		MailHttp.getInstance().requestEmailList(emailType, sendType, page, minMailID);
	},
	
	//监听tableView Touch事件
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
	
	onClickEvent: function(sender, type) {
		if (ccui.Widget.TOUCH_ENDED == type) {
			var strBtnName = sender.getName();
			cc.log('onClickEvent ' + strBtnName);
			switch (strBtnName) {
			case "BtnBack":
				UIMgr.getInstance().closeDlg(ID_DlgMail);
				break;
			default:
				break;
			}
		}
	},

	onClickSeleEvent: function(sender, type) {
		if (ccui.Widget.TOUCH_ENDED == type) {
			for(var i=0; i<4; i++){
				this.LabSele[i].setColor(cc.color(221,141,92));
				this.ImgSele[i].setVisible(false);				
			}
			
			var strBtnName = sender.getName();
			
			switch (strBtnName) {
			case "LabSele_0":
				//新邮件
				cc.log('onClickSeleEvent 新邮件');
				
				this._seleTag = 0;
				this.LabSele[0].setColor(cc.color(255,243,212));
				this.ImgSele[0].setVisible(true);
				break;
			case "LabSele_1":
				//系统邮件
				cc.log('onClickSeleEvent 系统邮件');
				
				this._seleTag = 1;
				this.LabSele[1].setColor(cc.color(255,243,212));
				this.ImgSele[1].setVisible(true);
				break;
			case "LabSele_2":
				//活动邮件
				cc.log('onClickSeleEvent 活动邮件');

				this._seleTag = 2;
				this.LabSele[2].setColor(cc.color(255,243,212));
				this.ImgSele[2].setVisible(true);
				break;
			case "LabSele_3":
				//好友邮件
				cc.log('onClickSeleEvent 好友邮件');
				
				this._seleTag = 3;
				this.LabSele[3].setColor(cc.color(255,243,212));
				this.ImgSele[3].setVisible(true);
				break;
			default:
				break;
			}
			
			//先清空
			this.recordCount = 0;
			this.tableView.reloadData();

			var mails = this.getMailList();
			if(mails.length == 0){
				this.requestEmailListFirst();
			}else{
				this.reloadMailList(true);
			}
		}
	},
	
	getMailList: function(){
		var mails = [];

		var mail = ClientData.getInstance().getMail();
		switch (this._seleTag) {
		case 0:
			mails = mail.getMailsNew();
			cc.log("新邮件 recordCount = " + mails.length);
			break;
		case 1:
			mails = mail.getMailsXT();
			cc.log("系统邮件 recordCount = " + mails.length);
			break;
		case 2:
			mails = mail.getMailsHD();
			cc.log("活动邮件 recordCount = " + mails.length);
			break;
		case 3:
			mails = mail.getMailsHY();
			cc.log("好友邮件 recordCount = " + mails.length);
			break;
		default:
			break;
		}

		return mails;
	},
	
	reloadMailList: function(bAddB){
		var mails = this.getMailList();
		this.recordCount = mails.length;
		
		this.reloadTableView(bAddB);
	},
	
	//bAddB增加底部
	reloadTableView: function(bAddB){
		var container = this.tableView.getContainer();
		var sizeContainer = this.tableView.getContentSize();
		var startY = container.y;
		var startH = sizeContainer.height;

		this.tableView.reloadData();

		container = this.tableView.getContainer();
		sizeContainer = this.tableView.getContentSize();

		var endH = sizeContainer.height;
		var endX = container.x;
		var endY = startY;
		if(bAddB){
			endY = startY - (endH - startH);
		}

		this.tableView.setContentOffset(cc.p(endX, endY), false);
	},
	
	////////////////////////////////////////////////////////////
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
		
		var widget = cell.getChildByTag(1);
		var imgBg_1 = widget.getChildByTag(100);
		var imgBg_2 = widget.getChildByTag(200);
		var imgType_hd = widget.getChildByTag(300);
		var imgType_xt = widget.getChildByTag(400);
		var imgType_hy = widget.getChildByTag(500);
		var labTitle = widget.getChildByTag(600);
		var labSender = widget.getChildByTag(700);
		var labSendTime = widget.getChildByTag(800);
		var imgDele = widget.getChildByTag(900);
		
		var mail = ClientData.getInstance().getMail();
		var mailList = this.getMailList();

		//删除按钮
		var sizeDele = imgDele.getSize();
		var rectDele = cc.rect(0, 0, sizeDele.width, sizeDele.height);
		var ptDele = imgDele.convertToNodeSpace(this.ptBegan);
		var bContainDele = cc.rectContainsPoint(rectDele, ptDele);
		if(bContainDele){
			cc.log('onClick imgDele');
			var seq = cc.Sequence.create(
					cc.scaleTo(0.05, 1.2),
					cc.scaleTo(0.05, 1),
					cc.CallFunc(function(){
						var mailInfo = mailList[index];
						MailHttp.getInstance().requestEmailDelete(mailInfo.mailID);
					}, this)
			);
			imgDele.runAction(seq);
		}
		
		//读邮件
		var sizeRead = widget.getSize();
		var rectRead = cc.rect(0, 0, sizeRead.width, sizeRead.height);
		var ptRead = widget.convertToNodeSpace(this.ptBegan);
		var bContainRead = cc.rectContainsPoint(rectRead, ptRead);
		if(!bContainDele && bContainRead){
			cc.log('onClick widget');
			var seq = cc.Sequence.create(
					cc.scaleTo(0.05, 1.2),
					cc.scaleTo(0.05, 1),
					cc.CallFunc(function(){
						var mailInfo = mailList[index];
						MailHttp.getInstance().requestEmailBody(mailInfo.Title, mailInfo.mailID);
					}, this)
			);
			widget.runAction(seq);
		}
	},

	tableCellSizeForIndex:function (table, idx) {
		var sizeDir = cc.director.getWinSize();
		return cc.size(sizeDir.width, 115);
	},

	tableCellAtIndex:function (table, idx) {
		var sizeDir = cc.director.getWinSize();
		var strBg_1 = "dlgMailPlist/img_mail_item_bg_1.png";
		var strBg_2 = "dlgMailPlist/img_mail_item_bg_2.png";
		var strType_hd = "dlgMailPlist/img_mail_type_hd.png";//活动
		var strType_hy = "dlgMailPlist/img_mail_type_hy.png";//好友
		var strType_xt = "dlgMailPlist/img_mail_type_xt.png";//系统
		var strDele = "dlgMailPlist/btn_mail_dele_1.png";//删除

		var index = idx.toFixed(0);
		
		if(index == 0){
			//
			this.requestEmailListB();
		}else if(index == this.recordCount - 1){
			//
			this.requestEmailListT();
		}
		
		//cc.log("------------------------------ idx = " + strValue);
		var cell = table.dequeueCell();
		var item = null;
		if (!cell) {
			cell = new cc.TableViewCell();
			
			var widgetSize = cc.size(sizeDir.width, 115);
			
			var widget = new ccui.Widget();
			widget.x = widgetSize.width / 2;
			widget.y = widgetSize.height / 2;
			//widget.setTouchEnabled(true);
			widget.setSize(widgetSize);
			widget.tag = 1;
			cell.addChild(widget);
			
			var imgBg_1 = new ccui.ImageView(strBg_1, ccui.Widget.PLIST_TEXTURE);
			imgBg_1.x = widgetSize.width / 2;
			imgBg_1.y = widgetSize.height / 2;
			imgBg_1.setScale9Enabled(true);
			imgBg_1.setContentSize(cc.size(sizeDir.width - 30, 118));
			imgBg_1.ignoreContentAdaptWithSize(false);
			imgBg_1.tag = 100;
			widget.addChild(imgBg_1);
			
			var imgBg_2 = new ccui.ImageView(strBg_2, ccui.Widget.PLIST_TEXTURE);
			imgBg_2.x = widgetSize.width / 2;
			imgBg_2.y = widgetSize.height / 2;
			imgBg_2.setScale9Enabled(true);
			imgBg_2.setContentSize(cc.size(sizeDir.width - 30, 118));
			imgBg_2.ignoreContentAdaptWithSize(false);
			imgBg_2.tag = 200;
			imgBg_2.setVisible(false);
			widget.addChild(imgBg_2);

			//活动
			var imgType_hd = new ccui.ImageView(strType_hd, ccui.Widget.PLIST_TEXTURE);
			imgType_hd.x = 53;
			imgType_hd.y = 80;
			imgType_hd.tag = 300;
			imgType_hd.setVisible(false);
			widget.addChild(imgType_hd);
			
			//系统
			var imgType_xt = new ccui.ImageView(strType_xt, ccui.Widget.PLIST_TEXTURE);
			imgType_xt.x = 53;
			imgType_xt.y = 80;
			imgType_xt.tag = 400;
			imgType_xt.setVisible(false);
			widget.addChild(imgType_xt);
			
			//好友
			var imgType_hy = new ccui.ImageView(strType_hy, ccui.Widget.PLIST_TEXTURE);
			imgType_hy.x = 53;
			imgType_hy.y = 80;
			imgType_hy.tag = 500;
			imgType_hy.setVisible(false);
			widget.addChild(imgType_hy);

			//标题
			var labTitle = new cc.LabelTTF("标题：", "Arial", 30.0);
			labTitle.x = 110;
			labTitle.y = 80;
			labTitle.tag = 600;
			labTitle.anchorX = 0;
			labTitle.anchorY = 0.5;
			labTitle.setColor(cc.color(255,84,0));
			widget.addChild(labTitle);
			
			//发件人
			var labSender = new cc.LabelTTF("发件人：", "Arial", 30.0);
			labSender.x = 110;
			labSender.y = 39;
			labSender.tag = 700;
			labSender.anchorX = 0;
			labSender.anchorY = 0.5;
			labSender.setColor(cc.color(69,31,2));
			widget.addChild(labSender);
			
			//时间
			var labSendTime = new cc.LabelTTF("", "Arial", 30.0);
			labSendTime.x = sizeDir.width - 30 - 140;
			labSendTime.y = 90;
			labSendTime.tag = 800;
			labSendTime.anchorX = 0.5;
			labSendTime.anchorY = 0.5;
			labSendTime.setColor(cc.color(69,31,2));
			widget.addChild(labSendTime);
			
			//删除
			var imgDele = new ccui.ImageView(strDele, ccui.Widget.PLIST_TEXTURE);
			imgDele.x = sizeDir.width - 30 - 140;
			imgDele.y = 41;
			imgDele.tag = 900;
			widget.addChild(imgDele);
		}
		
		

		var widget = cell.getChildByTag(1);
		var imgBg_1 = widget.getChildByTag(100);
		var imgBg_2 = widget.getChildByTag(200);
		var imgType_hd = widget.getChildByTag(300);
		var imgType_xt = widget.getChildByTag(400);
		var imgType_hy = widget.getChildByTag(500);
		var labTitle = widget.getChildByTag(600);
		var labSender = widget.getChildByTag(700);
		var labSendTime = widget.getChildByTag(800);
		var imgDele = widget.getChildByTag(900);
		
		var mail = ClientData.getInstance().getMail();
		var mails = this.getMailList();
		var mailInfo = mails[index];
		//是否已读
		var bRead = mail.isMailRead(mailInfo);
		if(bRead){
			imgBg_1.setVisible(false);
			imgBg_2.setVisible(true);
		}else{
			imgBg_1.setVisible(true);
			imgBg_2.setVisible(false);
		}
		
		//类型
		imgType_hd.setVisible(false);
		imgType_xt.setVisible(false);
		imgType_hy.setVisible(false);
		var type = mailInfo.type;
		if(type == "1"){
			imgType_xt.setVisible(true);
		}else if(type == "2"){
			imgType_hd.setVisible(true);
		}else if(type == "3"){
			imgType_hy.setVisible(true);
		}

		//标题
		var strTitle = '标题：' + mailInfo.Title;
		labTitle.setString(strTitle);

		//发送者昵称
		var strSenderNick = '发件人：' + mailInfo.SenderNickName;
		labSender.setString(strSenderNick);

		//发送日期
		var strSenderdate = mailInfo.Senderdate;//index;
		labSendTime.setString(strSenderdate);

		return cell;
	},

	numberOfCellsInTableView:function (table) {
		return this.recordCount;
	},
	////////////////////////////////////////////////////////////
});