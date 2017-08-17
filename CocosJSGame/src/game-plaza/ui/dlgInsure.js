

DLG_CREATOR[ID_DlgInsure] = function() {
	return new DlgInsure();
};

var DlgInsure = DlgBase.extend({
	ctor: function(){
		this._bDescType = true;
		this._bDescNick = true;
		this._bDescId = true;
		this._bDescGold = true;
		this._bDescTime = true;

		this._btnTabSrcPos = [];
	},

	onCreate: function() {
		this.init();
	},

	onClose: function() {

	},

	init: function() {
		var json = ccs.load(res.dlgInsureScene_json);
		this._rootWidget = json.node;

		//自适应屏幕大小
		var sizeDir = cc.director.getWinSize();
		this._rootWidget.setContentSize(sizeDir);
		ccui.helper.doLayout(this._rootWidget);

		this.ImgBg = this._rootWidget.getChildByName('ImgBg');

		this.BtnBack = this._rootWidget.getChildByName('BtnBack');
		this.BtnBack.setPressedActionEnabled(true);
		this.BtnBack.addTouchEventListener(this.onClickEvent, this);

		//登录		
		this.PanelLogonInsure = this._rootWidget.getChildByName('PanelLogonInsure');
		this.PanelLogonInsure.setVisible(true);
		this.EditLogonPassword = this.PanelLogonInsure.getChildByName('EditLogonPassword');
		this.BtnLogonOk = this.PanelLogonInsure.getChildByName('BtnLogonOk');
		this.BtnLogonOk.addTouchEventListener(this.onClickEvent, this);
		this.LabLogonTip = this.PanelLogonInsure.getChildByName('LabLogonTip');
		if(g_objHero.loginType==1){
			this.LabLogonTip.setString("温馨提示：请输入保险柜登录密码，默认为123456");
		}
		
		//菜单
		this.PanelMenu = this._rootWidget.getChildByName('PanelMenu');
		this.PanelMenu.setVisible(false);
		this.LabSele = [];
		this.ImgSele = [];
		for(var i=0; i<5; i++){
			var name = "LabSele_" + i;
			this.LabSele[i] = this.PanelMenu.getChildByName(name);
			this.LabSele[i].addTouchEventListener(this.onClickSeleEvent, this);

			name = "ImgSele_" + i;
			this.ImgSele[i] = this.LabSele[i].getChildByName(name);

			if(i == 0){
				this.LabSele[i].setColor(cc.color(255,243,212));
				this.ImgSele[i].setVisible(true);
			}else{
				this.LabSele[i].setColor(cc.color(221,141,92));
				this.ImgSele[i].setVisible(false);
			}

			this._btnTabSrcPos[i] = cc.p(this.LabSele[i].x, this.LabSele[i].y);
		}
		
		//信息
		this.PanelInfo = this._rootWidget.getChildByName('PanelInfo');
		this.PanelInfo.setVisible(false);
		this.ImgInfoBg = this.PanelInfo.getChildByName('ImgInfoBg');
		this.NodeFace = this.ImgInfoBg.getChildByName('NodeFace');
		this.LabAccount = this.ImgInfoBg.getChildByName('LabAccount');
		this.LabGold = this.ImgInfoBg.getChildByName('LabGold');
		this.LabInsure = this.ImgInfoBg.getChildByName('LabInsure');
		this.BtnUpdate = this.ImgInfoBg.getChildByName('BtnUpdate');
		this.BtnUpdate.setPressedActionEnabled(true);
		this.BtnUpdate.addTouchEventListener(this.onClickEvent, this);
		
		//存取
		this.PanelSaveTake = this._rootWidget.getChildByName('PanelSaveTake');
		this.PanelSaveTake.setVisible(false);
		this.PanelSaveTakeBg = this.PanelSaveTake.getChildByName('PanelSaveTakeBg');
		this.EditSaveTakeGold = this.PanelSaveTakeBg.getChildByName('EditSaveTakeGold');
		this.BtnSave = this.PanelSaveTakeBg.getChildByName('BtnSave');
		this.BtnSave.setPressedActionEnabled(true);
		this.BtnSave.addTouchEventListener(this.onClickEvent, this);
		this.BtnTake = this.PanelSaveTakeBg.getChildByName('BtnTake');
		this.BtnTake.setPressedActionEnabled(true);
		this.BtnTake.addTouchEventListener(this.onClickEvent, this);
		this.LabSaveTakeTip_1 = this.PanelSaveTakeBg.getChildByName('LabSaveTakeTip_1');
		this.LabSaveTakeTip_2 = this.PanelSaveTakeBg.getChildByName('LabSaveTakeTip_2');
		
		//赠送
		this.PanelGive = this._rootWidget.getChildByName('PanelGive');
		this.PanelGive.setVisible(false);
		this.PanelGiveBg = this.PanelGive.getChildByName('PanelGiveBg');
		this.CheckBoxID = this.PanelGiveBg.getChildByName('CheckBoxID');
		this.CheckBoxID.setSelected(false);
		this.CheckBoxID.addEventListener(this.onSelectedId,this);
		this.CheckBoxNick = this.PanelGiveBg.getChildByName('CheckBoxNick');
		this.CheckBoxNick.addEventListener(this.onSelectedNick,this);
		this.LabNickTitle = this.PanelGiveBg.getChildByName('LabNickTitle');
		this.EditId = this.PanelGiveBg.getChildByName('EditId');
		this.EditGold = this.PanelGiveBg.getChildByName('EditGold');
		this.BtnGive = this.PanelGiveBg.getChildByName('BtnGive');
		this.BtnGive.setPressedActionEnabled(true);
		this.BtnGive.addTouchEventListener(this.onClickEvent, this);
		this.LabGiveTip = this.PanelGiveBg.getChildByName('LabGiveTip');
		
		//记录
		this.PanelGiveRecord = this._rootWidget.getChildByName('PanelGiveRecord');
		this.PanelGiveRecord.setVisible(false);
		this.ImgRecordTitleBg = this.PanelGiveRecord.getChildByName('ImgRecordTitleBg');
		this.LabSortType = this.ImgRecordTitleBg.getChildByName('LabSortType');
		this.LabSortNick = this.ImgRecordTitleBg.getChildByName('LabSortNick');
		this.LabSortId = this.ImgRecordTitleBg.getChildByName('LabSortId');
		this.LabSortGold = this.ImgRecordTitleBg.getChildByName('LabSortGold');
		this.LabSortTime = this.ImgRecordTitleBg.getChildByName('LabSortTime');
		this.LabSortType.addTouchEventListener(this.onClickSortEvent, this);
		this.LabSortNick.addTouchEventListener(this.onClickSortEvent, this);
		this.LabSortId.addTouchEventListener(this.onClickSortEvent, this);
		this.LabSortGold.addTouchEventListener(this.onClickSortEvent, this);
		this.LabSortTime.addTouchEventListener(this.onClickSortEvent, this);
		this.PanelRecord = this.PanelGiveRecord.getChildByName('PanelRecord');
		var size = this.PanelRecord.getSize();
		var tableView = new cc.TableView(this, size);
		tableView.setDirection(cc.SCROLLVIEW_DIRECTION_VERTICAL);
		tableView.setDelegate(this);
		tableView.setVerticalFillOrder(cc.TABLEVIEW_FILL_TOPDOWN);
		this.PanelRecord.addNode(tableView);
		this.tableView = tableView;

		//修改密码
		this.PanelModifyPassword = this._rootWidget.getChildByName('PanelModifyPassword');
		this.PanelModifyPassword.setVisible(false);
		this.EditOldPassword = this.PanelModifyPassword.getChildByName('EditOldPassword');
		this.EditNewPassword_0 = this.PanelModifyPassword.getChildByName('EditNewPassword_0');
		this.EditNewPassword_1 = this.PanelModifyPassword.getChildByName('EditNewPassword_1');
		this.BtnModify = this.PanelModifyPassword.getChildByName('BtnModify');
		this.BtnModify.setPressedActionEnabled(true);
		this.BtnModify.addTouchEventListener(this.onClickEvent, this);

		//点卡充值
		this.PanelPointCard = this._rootWidget.getChildByName('PanelPointCard');
		this.PanelPointCard.setVisible(false);
		this.EditPointCardNum = this.PanelPointCard.getChildByName('EditPointCardNum');
		this.EditPointCardPassword = this.PanelPointCard.getChildByName('EditPointCardPassword');
		this.BtnRecharge = this.PanelPointCard.getChildByName('BtnRecharge');
		this.BtnRecharge.setPressedActionEnabled(true);
		this.BtnRecharge.addTouchEventListener(this.onClickEvent, this);
		this.LabRepeat = this.PanelPointCard.getChildByName('LabRepeat');
		this.LabRepeat.setVisible(false);

		//更新信息
		LogonMsgHandler.getInstance().connect(function(){
			UserServerMsg.getInstance().sendQueryInsureInfo();
		});

		var plaza = ClientData.getInstance().getPlaza();
		var bLogonInsure = plaza.getLogonInsure();
		if(bLogonInsure){
			this.logonSuccess();
		}

		//IOS屏蔽功能
		if(cc.sys.isNative && (cc.sys.os == cc.sys.OS_IOS) && _CONFIG_.IOS_HIDE){
			//this.LabSele[1].setVisible(false);
			//this.LabSele[2].setVisible(false);
			this.LabSele[4].setVisible(false);
		}
		this.resetTabBtnPos();
	},

	resetTabBtnPos: function(){
		var showIndex = 0;
		this._btnTabSrcPos[i]
		for(var i=0; i<5; i++){
			if(this.LabSele[i].isVisible()){
				this.LabSele[i].x = this._btnTabSrcPos[showIndex].x;
				this.LabSele[i].y = this._btnTabSrcPos[showIndex].y;
				showIndex++;
			}			
		}
	},

	onSelectedId: function (sender, type) {
		switch (type) {
		case ccui.CheckBox.EVENT_SELECTED:
			this.CheckBoxNick.setSelected(false);
			this.LabNickTitle.string = '赠送玩家ID';
			this.EditId.string = "";
			break;
		case ccui.CheckBox.EVENT_UNSELECTED:
			this.CheckBoxNick.setSelected(true);
			this.LabNickTitle.string = '赠送玩家昵称';
			this.EditId.string = "";
			break;
		default:
			break;
		}
	},
	
	onSelectedNick: function (sender, type) {
		switch (type) {
		case ccui.CheckBox.EVENT_SELECTED:
			this.CheckBoxID.setSelected(false);
			this.LabNickTitle.string = '赠送玩家昵称';
			this.EditId.string = "";
			break;
		case ccui.CheckBox.EVENT_UNSELECTED:
			this.CheckBoxID.setSelected(true);
			this.LabNickTitle.string = '赠送玩家ID';
			this.EditId.string = "";
			break;
		default:
			break;
		}
	},

	checkGiveData: function(strEdit, bNick, gold){
		var regExp = null;

		if(!bNick){
			regExp = new RegExp("^[1-9][0-9]*$");
			if(!regExp.test(strEdit)){
				DlgTip.openSysTip("输入有误，对方ID为不以0开头的数字，请重试！");
				return false;
			}
		}

		regExp = new RegExp("^[1-9][0-9]{0,8}$");
		if(!regExp.test(gold)){
			DlgTip.openSysTip("输入有误，赠送数目为不以0开头的1到9位数字，请重试！");
			return false;
		}

		return true;
	},

	checkModifyPassword: function(strOld, strNew, strNew1){
		if(strOld === ""){
			DlgTip.openSysTip("请输入旧密码！");
			return false;
		}
		if(strNew === ""){
			DlgTip.openSysTip("请输入新密码！");
			return false;
		}
		if(strNew1 === ""){
			DlgTip.openSysTip("请再次输入新密码！");
			return false;
		}

		if(strOld == strNew){
			DlgTip.openSysTip("您输入的新密码和原密码一致，请重新修改！");
			return false;
		}

		var regExp = new RegExp("^[a-zA-Z_0-9]{6,15}$");
		if(!regExp.test(strNew)){
			DlgTip.openSysTip("请输入6-15位字母、数字或下划线！");
			return false;
		}

		if(strNew != strNew1){
			DlgTip.openSysTip("两次密码输入不一致，请重新输入！");
			return false;
		}
		
		return true;
	},

	checkPointCard: function(strCard, strPassword){
		if(strCard === ""){
			DlgTip.openSysTip("请输入充值卡号！");
			return false;
		}
		if(strPassword === ""){
			DlgTip.openSysTip("请输入充值卡密码！");
			return false;
		}
		
		return true;
	},
	
	onClickEvent: function(sender, type) {
		if (ccui.Widget.TOUCH_ENDED == type) {
			var strBtnName = sender.getName();
			cc.log('onClickEvent ' + strBtnName);
			switch (strBtnName) {
			case "BtnBack":
				UIMgr.getInstance().closeDlg(ID_DlgInsure);
				break;
			case "BtnLogonOk":
				//登录
				cc.log('onClickEvent name = ' + strBtnName);

				var strPass = this.EditLogonPassword.string;
				var strMd5 = CryptoUtil.md5(strPass);

				var plaza = ClientData.getInstance().getPlaza();
				if(plaza){
					plaza.setInsureMd5Pass(strMd5);
				}

				LogonMsgHandler.getInstance().connect(function(){
					UserServerMsg.getInstance().sendUserInsureLogon(strMd5);
				});

				break;
			case 'BtnUpdate':
				LogonMsgHandler.getInstance().connect(function(){
					UserServerMsg.getInstance().sendQueryInsureInfo();
				});
				break;
			case 'BtnSave':
				var strGold = this.EditSaveTakeGold.string;
				var regExp = new RegExp("^[0-9]{1,9}$");

				if(!regExp.test(strGold)){
					DlgTip.openSysTip("请输入1到9位数字！");
				}else{
					var gold = parseInt(strGold);
					LogonMsgHandler.getInstance().connect(function(){
						UserServerMsg.getInstance().touchSender = sender;
						sender.setTouchEnabled(false);
						UserServerMsg.getInstance().sendUserSaveScore(gold);
					});
				}			
				
				break;
			case 'BtnTake':
				var strGold = this.EditSaveTakeGold.string;
				var regExp = new RegExp("^[0-9]{1,9}$");

				if(!regExp.test(strGold)){
					DlgTip.openSysTip("请输入1到9位数字！");
				}else{
					var gold = parseInt(strGold);
					LogonMsgHandler.getInstance().connect(function(){
						UserServerMsg.getInstance().sendUserTakeScore(gold);
					});
				}
				
				break;
			case 'BtnGive':
				var bSeleNick = this.CheckBoxNick.isSelected();
				var bByNick = 0;
				if(bSeleNick){
					bByNick = 1;
				}
				
				var strId = this.EditId.string;
				var strGold = this.EditGold.string;

				var bCheckGive = this.checkGiveData(strId, bByNick, strGold);
				if(bCheckGive){
					this._giveGold = parseInt(strGold);
					LogonMsgHandler.getInstance().connect(function(){
						UserServerMsg.getInstance().touchSender = sender;
						sender.setTouchEnabled(false);
						UserServerMsg.getInstance().sendQueryUserInfoReq(bByNick, strId);
					});
				}
				break;
			case 'BtnModify':
				console.log("-----BtnModify");
				var passWord = this.EditOldPassword.string;
				var passWord_0 = this.EditNewPassword_0.string;
				var passWord_1 = this.EditNewPassword_1.string;
				var bCheckModify = this.checkModifyPassword(passWord,passWord_0,passWord_1);
				if(bCheckModify){
					var desMd5 = CryptoUtil.md5(passWord_0);
					var scrMd5 = CryptoUtil.md5(passWord);
					
					LogonMsgHandler.getInstance().connect(function(){
						UserServerMsg.getInstance().sendModifyInsurePass(desMd5, scrMd5);
					});
				}
				break;
			case 'BtnRecharge':
				cc.log("-----");
				var pointCardNum = this.EditPointCardNum.string;
				var pointCardPassword = this.EditPointCardPassword.string;
				var bCheckPointCard = this.checkPointCard(pointCardNum, pointCardPassword);
				if(bCheckPointCard){
					LogonMsgHandler.getInstance().connect(function(){
						UserServerMsg.getInstance().sendQueryPointCard(pointCardNum, pointCardPassword);
					});
					
					this.LabRepeat.string = "5秒后重试";
					this.LabRepeat.setVisible(true);
					this.BtnRecharge.setVisible(false);
					var time = 5;
					var self = this;
					var funTime = function(){
						time--;
						if(time <= 0){
							self.LabRepeat.setVisible(false);
							self.BtnRecharge.setVisible(true);
						}else{
							self.LabRepeat.setVisible(true);
							self.BtnRecharge.setVisible(false);
							var strTime = time + "秒后重试";
							self.LabRepeat.string = strTime;
						}
					};
					var actions = [];
					for(var i=0; i<5; i++){
						actions.push(cc.delayTime(1));
						actions.push(cc.callFunc(funTime, this));
					}
					this.LabRepeat.runAction(cc.sequence(actions));
				}
				break;
			default:
				break;
			}
		}
	},
	
	onClickSortEvent: function(sender, type) {
		if (ccui.Widget.TOUCH_ENDED == type) {
			var insure = ClientData.getInstance().getInsure();
			
			var strBtnName = sender.getName();
			cc.log('onClickSortEvent ' + strBtnName);
			switch (strBtnName) {
			case 'LabSortType':
				insure.getSortRecordsByType(this._bDescType);
				this._bDescType = !this._bDescType;
				if(this._bDescType){
					sender.string = '状态↓';
				}else{
					sender.string = '状态↑';
				}
				break;
			case 'LabSortNick':
				insure.getSortRecordsByNick(this._bDescNick);
				this._bDescNick = !this._bDescNick;
				if(this._bDescNick){
					sender.string = '对方昵称↓';
				}else{
					sender.string = '对方昵称↑';
				}
				break;
			case 'LabSortId':
				insure.getSortRecordsById(this._bDescId);
				this._bDescId = !this._bDescId;
				if(this._bDescId){
					sender.string = '对方ID↓';
				}else{
					sender.string = '对方ID↑';
				}
				break;
			case 'LabSortGold':
				insure.getSortRecordsByGold(this._bDescGold);
				this._bDescGold = !this._bDescGold;
				if(this._bDescGold){
					sender.string = '金币数量↓';
				}else{
					sender.string = '金币数量↑';
				}
				break;
			case 'LabSortTime':
				insure.getSortRecordsByTime(this._bDescTime);
				this._bDescTime = !this._bDescTime;
				if(this._bDescTime){
					sender.string = '时间↓';
				}else{
					sender.string = '时间↑';
				}
				break;
			default:
				break;
			}
			
			var records = insure.getRecords();
			this.listCount = records.length;
			this.tableView.reloadData();
		}
	},
	
	logonSuccess: function(){
		var plaza = ClientData.getInstance().getPlaza();
		if(plaza){
			plaza.setLogonInsure(true);
		}

		this.PanelLogonInsure.setVisible(false);
		this.PanelMenu.setVisible(true);
		this.PanelInfo.setVisible(true);
		this.PanelSaveTake.setVisible(true);

		this.updateInfo();
	},
	
	giveScore: function(targetName, gameId){
		var gold = this._giveGold;
		var tipCfg = {
				title: "系统提示",
				content: "您确定要给 " + targetName + ", ID:" + gameId + " 赠送 " + gold + " 游戏币吗?",
				btnL_Enable: true,
				btnL_cb: function(target){target.closeTip();},
				btnR_Enable: true,
				btnR_cb: function(target){
					LogonMsgHandler.getInstance().connect(function(){
						UserServerMsg.getInstance().sendUserTransferScore(1, targetName, gold);
					});
					target.closeTip();
				}
		};

		DlgTip.openTip(tipCfg);
	},
	
	updateInfo: function(){
		var faceId = g_objHero.getFaceId();
		var faceFile = LoadFaceCfg.getInstance().getFileByFaceId(faceId);
		var imgFace = new ccui.ImageView(faceFile);
		var sizeImg = imgFace.getSize();
		imgFace.setScaleX(100 / sizeImg.width);
		imgFace.setScaleY(100 / sizeImg.height);
		
		this.NodeFace.addChild(imgFace);
		this.LabAccount.string = g_objHero.getAccount();
		this.LabGold.string = g_objHero.getMoney();
		this.LabInsure.string = g_objHero.getInsureMoney();

		//取出税提示
		var insure = ClientData.getInstance().getInsure();
		var revenueTake = insure.getRevenueTake();
		var strTakeTip = "取出将扣除" + revenueTake + "‰手续费。";
		if(revenueTake === 0){
			strTakeTip = "取出免手续费。";
		}
		this.LabSaveTakeTip_2.string = strTakeTip;
	},
	
	

	onClickSeleEvent: function(sender, type) {
		if (ccui.Widget.TOUCH_ENDED == type) {
			this.PanelLogonInsure.setVisible(false);
			this.PanelMenu.setVisible(false);
			this.PanelInfo.setVisible(false);
			this.PanelSaveTake.setVisible(false);
			this.PanelGive.setVisible(false);
			this.PanelGiveRecord.setVisible(false);
			this.PanelModifyPassword.setVisible(false);
			this.PanelPointCard.setVisible(false);
			
			for(var i=0; i<5; i++){
				this.LabSele[i].setColor(cc.color(221,141,92));
				this.ImgSele[i].setVisible(false);				
			}

			var strBtnName = sender.getName();

			switch (strBtnName) {
			case "LabSele_0":
				this.LabSele[0].setColor(cc.color(255,243,212));
				this.ImgSele[0].setVisible(true);

				//游戏存取
				cc.log('onClickSeleEvent 游戏存取');
				this.PanelMenu.setVisible(true);
				this.PanelInfo.setVisible(true);
				this.PanelSaveTake.setVisible(true);
				break;
			case "LabSele_1":
				this.LabSele[1].setColor(cc.color(255,243,212));
				this.ImgSele[1].setVisible(true);

				//好友赠送
				cc.log('onClickSeleEvent 好友赠送');
				this.PanelMenu.setVisible(true);
				this.PanelInfo.setVisible(true);
				this.PanelGive.setVisible(true);

				//赠送出税
				var insure = ClientData.getInstance().getInsure();
				var revenueTransfer = insure.getRevenueTransfer();
				var strGiveTip = "温馨提示:赠送将扣除" + revenueTransfer + "‰手续费。";
				if(revenueTransfer === 0){
					strGiveTip = "温馨提示:赠送免手续费。";
				}
				this.LabGiveTip.string = strGiveTip;
				break;
			case "LabSele_2":
				this.LabSele[2].setColor(cc.color(255,243,212));
				this.ImgSele[2].setVisible(true);

				//赠送日志
				cc.log('onClickSeleEvent 赠送日志');
				this.PanelMenu.setVisible(true);
				this.PanelGiveRecord.setVisible(true);
				
				LogonMsgHandler.getInstance().connect(function(){
					UserServerMsg.getInstance().sendQueryTransferRecord(0, 0);
				});
				break;
			case "LabSele_3":
				this.LabSele[3].setColor(cc.color(255,243,212));
				this.ImgSele[3].setVisible(true);

				//密码修改
				cc.log('onClickSeleEvent 密码修改');
				this.PanelMenu.setVisible(true);
				this.PanelModifyPassword.setVisible(true);
				break;
			case "LabSele_4":
				this.LabSele[4].setColor(cc.color(255,243,212));
				this.ImgSele[4].setVisible(true);

				//点卡充值
				console.log('onClickSeleEvent 点卡充值');
				this.PanelMenu.setVisible(true);
				this.PanelInfo.setVisible(true);
				this.PanelPointCard.setVisible(true);
				this.BtnRecharge.setVisible(true);
				
				break;
			default:
				break;
			}
		}
	},

	onUpdateRecord: function(){
		var insure = ClientData.getInstance().getInsure();
		var records = insure.getSortRecordsByTime();
		
		this.listCount = records.length;
		this.tableView.reloadData();
	},
	
	////////////////////////////////////////////////////////////
	scrollViewDidScroll:function (view) {
	},
	scrollViewDidZoom:function (view) {
	},

	tableCellTouched:function (table, cell) {
		cc.log("cell touched at index: " + cell.getIdx());
	},

	tableCellSizeForIndex:function (table, idx) {
		var sizeDir = cc.director.getWinSize();
		return cc.size(sizeDir.width, 50);
	},

	tableCellAtIndex:function (table, idx) {
		var strValue = idx.toFixed(0);
		var cell = table.dequeueCell();
		var item = null;
		if (!cell) {
			cell = new cc.TableViewCell();
			
			//4 8 6 8 8
			var sizeDir = cc.director.getWinSize();
			var w = sizeDir.width;

			var strLineRes = "dlgInsurePlist/img_insure_record_line.png";

			var imgLine = new ccui.ImageView(strLineRes, ccui.Widget.PLIST_TEXTURE);
			imgLine.x = w / 2;
			imgLine.y = 1;
			imgLine.setScaleX( (w - 60)/2 );
			cell.addChild(imgLine);
			
			var labType = new cc.LabelTTF("", "Arial", 30.0);
			labType.x = w * 2 / 32;
			labType.y = 25;
			labType.tag = 100;
			cell.addChild(labType);
			
			var labNick = new cc.LabelTTF("", "Arial", 30.0);
			labNick.x = w * 8 / 32;
			labNick.y = 25;
			labNick.tag = 200;
			labNick.setColor(cc.color(221,141,92));
			cell.addChild(labNick);

			var labId = new cc.LabelTTF("", "Arial", 30.0);
			labId.x = w * 15 / 32;
			labId.y = 25;
			labId.tag = 300;
			labId.setColor(cc.color(221,141,92));
			cell.addChild(labId);

			var labGold = new cc.LabelTTF("", "Arial", 30.0);
			labGold.x = w * 22 / 32;
			labGold.y = 25;
			labGold.tag = 400;
			labGold.setColor(cc.color(221,141,92));
			cell.addChild(labGold);
			
			var labTime = new cc.LabelTTF("", "Arial", 30.0);
			labTime.x = w * 29 / 32;
			labTime.y = 25;
			labTime.tag = 500;
			labTime.setColor(cc.color(221,141,92));
			cell.addChild(labTime);
		}

		var labType =  cell.getChildByTag(100);
		var labNick =  cell.getChildByTag(200);
		var labId =  cell.getChildByTag(300);
		var labGold =  cell.getChildByTag(400);
		var labTime =  cell.getChildByTag(500);
		
		var insure = ClientData.getInstance().getInsure();
		var records = insure.getRecords();
		var record = records[strValue];
		var type = insure.getRecordType(record);//0赠送，1接收
		
		var strType = "赠送";
		labType.setColor(cc.color(244,196,56));
		if(type == 1){
			strType = "接收";
			labType.setColor(cc.color(223,105,24));
		}
		labType.setString(strType);
		
		var strNick = insure.getRecordOtherNick(record);
		labNick.setString(strNick);
		
		var strId = insure.getRecordOtherId(record);
		labId.setString(strId);
		
		var strGold = record.lSwapScore;
		labGold.setString(strGold);
		
		var strDate = record.time.wYear + '-' + record.time.wMonth + '-' + record.time.wDay;
		labTime.setString(strDate);

		return cell;
	},

	numberOfCellsInTableView:function (table) {
		return this.listCount;
	},
	////////////////////////////////////////////////////////////
});