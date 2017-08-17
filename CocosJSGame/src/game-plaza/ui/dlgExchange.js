

DLG_CREATOR[ID_DlgExchange] = function() {
	return new DlgExchange();
};

var DlgExchange = DlgBase.extend({
	ctor: function(){
		this.recordCount = 0;
		
		this._exAwardList = [];
	},

	onCreate: function() {
		this.init();

		this.bVerify = false; //验证通过
	},

	onClose: function() {

	},

	init: function() {
		var json = ccs.load(res.dlgExchangeScene_json);
		this._rootWidget = json.node;

		//自适应屏幕大小
		var sizeDir = cc.director.getWinSize();
		this._rootWidget.setContentSize(sizeDir);
		ccui.helper.doLayout(this._rootWidget);

		this.ImgBg = this._rootWidget.getChildByName('ImgBg');

		this.BtnClose = this.ImgBg.getChildByName('BtnClose');
		this.BtnClose.setPressedActionEnabled(true);
		this.BtnClose.addTouchEventListener(this.onClickEvent, this);
		
		this.BtnSele_0 = this.ImgBg.getChildByName('BtnSele_0');
		this.BtnSele_0.addTouchEventListener(this.onClickEvent, this);
		this.Text_0 = this.BtnSele_0.getChildByName('Text_0');
		
		this.BtnSele_1 = this.ImgBg.getChildByName('BtnSele_1');
		this.BtnSele_1.addTouchEventListener(this.onClickEvent, this);
		this.Text_1 = this.BtnSele_1.getChildByName('Text_1');
		
		this.BtnSele_2 = this.ImgBg.getChildByName('BtnSele_2');
		this.BtnSele_2.addTouchEventListener(this.onClickEvent, this);
		this.Text_2 = this.BtnSele_2.getChildByName('Text_2');
		
		this.BtnSele_3 = this.ImgBg.getChildByName('BtnSele_3');
		this.BtnSele_3.addTouchEventListener(this.onClickEvent, this);
		this.Text_3 = this.BtnSele_3.getChildByName('Text_3');
		
		this.BtnSele_4 = this.ImgBg.getChildByName('BtnSele_4');
		this.BtnSele_4.addTouchEventListener(this.onClickEvent, this);
		this.Text_4 = this.BtnSele_4.getChildByName('Text_4');
		
		this.BtnSele_5 = this.ImgBg.getChildByName('BtnSele_5');
		this.BtnSele_5.addTouchEventListener(this.onClickEvent, this);
		this.Text_5 = this.BtnSele_5.getChildByName('Text_5');
		
		
		
		this.ImgFaceBg = this.ImgBg.getChildByName('ImgFaceBg');
		
		this.ImgGoldBg = this.ImgBg.getChildByName('ImgGoldBg');
		
		var ImgGoldBgNode = this.ImgGoldBg.getChildByName('Node');
		var json = ccs.load(res.goldLightNode_json);
		var node = json.node;
		var action = json.action;
		ImgGoldBgNode.addChild(node);
		node.runAction(action);
		action.gotoFrameAndPlay(0, 120, true);
		
		this.LabGold = this.ImgBg.getChildByName('LabGold');
		this.LabReel = this.ImgBg.getChildByName('LabReel');
		this.LabNick = this.ImgBg.getChildByName('LabNick');

		this.BtnRecord = this.ImgBg.getChildByName('BtnRecord');
		this.BtnRecord.addTouchEventListener(this.onClickEvent, this);
		
		this.PanelList = this.ImgBg.getChildByName('PanelList');
		var size = this.PanelList.getSize();
		var tableView = new cc.TableView(this, size);
		tableView.setDirection(cc.SCROLLVIEW_DIRECTION_HORIZONTAL);
		tableView.setDelegate(this);
		this.PanelList.addNode(tableView);
		this.tableView = tableView;
		
		this.reloadHot();
		this.BtnSele_0.setBright(false);
		this.Text_0.setColor(cc.color(255,255,255));
		
		this.addActionNodeMB(this.ImgBg);
		
		this.updateDlg();
	},
	
	setBrightAllBtnSele: function(bBright){
		this.BtnSele_0.setBright(bBright);
		this.BtnSele_1.setBright(bBright);
		this.BtnSele_2.setBright(bBright);
		this.BtnSele_3.setBright(bBright);
		this.BtnSele_4.setBright(bBright);
		this.BtnSele_5.setBright(bBright);
		this.Text_0.setColor(cc.color(133,85,34));
		this.Text_1.setColor(cc.color(133,85,34));
		this.Text_2.setColor(cc.color(133,85,34));
		this.Text_3.setColor(cc.color(133,85,34));
		this.Text_4.setColor(cc.color(133,85,34));
		this.Text_5.setColor(cc.color(133,85,34));
	},

	onClickEvent: function(sender, type) {
		if (ccui.Widget.TOUCH_ENDED == type) {
			this.setBrightAllBtnSele(true);
			
			var strBtnName = sender.getName();
			cc.log('onClickEvent ' + strBtnName);
			switch (strBtnName) {
			case "BtnClose":
				UIMgr.getInstance().closeDlg(ID_DlgExchange);
				break;
			case "BtnSele_0":
				this.reloadHot();
				this.BtnSele_0.setBright(false);
				this.Text_0.setColor(cc.color(255,255,255));
				break;
			case "BtnSele_1":
				this.reloadByType(1);
				this.BtnSele_1.setBright(false);
				this.Text_1.setColor(cc.color(255,255,255));
				break;
			case "BtnSele_2":
				this.reloadByType(2);
				this.BtnSele_2.setBright(false);
				this.Text_2.setColor(cc.color(255,255,255));
				break;
			case "BtnSele_3":
				this.reloadByType(3);
				this.BtnSele_3.setBright(false);
				this.Text_3.setColor(cc.color(255,255,255));
				break;
			case "BtnSele_4":
				this.reloadByType(4);
				this.BtnSele_4.setBright(false);
				this.Text_4.setColor(cc.color(255,255,255));
				break;
			case "BtnSele_5":
				this.reloadAll();
				this.BtnSele_5.setBright(false);
				this.Text_5.setColor(cc.color(255,255,255));
				break;
			case "BtnRecord": //兑换记录
				ExAwardHttp.getInstance().requestExAwardRecords();
				break;
			default:
				break;
			}
		}
	},

	updateDlg: function(){		
		//玩家信息
		var faceId = g_objHero.getFaceId();
		var nickName = g_objHero.getNickName();
		var money = g_objHero.getMoney();
		var ticket = g_objHero.getMbTicket();

		this.setFaceByFaceId(faceId);
		this.LabNick.string = nickName;
		this.LabGold.string = money;
		this.LabReel.string = ticket;
	},

	setFaceByFaceId: function(id){
		var size = this.ImgFaceBg.getSize();
		var faceFile = LoadFaceCfg.getInstance().getFileByFaceId(id);
		if(faceFile != ""){
			var imgFace = new ccui.ImageView(faceFile);
			imgFace.x = size.width / 2;
			imgFace.y = size.height / 2;
			var sizeImg = imgFace.getSize();
			imgFace.setScaleX(72 / sizeImg.width);
			imgFace.setScaleY(72 / sizeImg.height);
			this.ImgFaceBg.addChild(imgFace);
		}
	},
	
	reloadHot: function(){
		var exAward = ClientData.getInstance().getExAward();
		var exAwardList = exAward.getExAwardHot();

		this._exAwardList = exAwardList;

		this.recordCount = exAwardList.length;
		this.tableView.reloadData();
	},
	reloadByType: function(type){
		var exAward = ClientData.getInstance().getExAward();
		var exAwardList = exAward.getExAwardByType(type);

		this._exAwardList = exAwardList;

		this.recordCount = exAwardList.length;
		this.tableView.reloadData();
	},
	reloadAll: function(){
		var exAward = ClientData.getInstance().getExAward();
		var exAwardList = exAward.getExAwardList();
		
		this._exAwardList = exAwardList;
		
		this.recordCount = exAwardList.length;
		this.tableView.reloadData();
	},
	
	///////////////////////////////////////////////////////////////////////////////
	scrollViewDidScroll:function (view) {
	},
	scrollViewDidZoom:function (view) {
	},

	tableCellTouched:function (table, cell) {
		cc.log("cell touched at index: " + cell.getIdx());

		var index = cell.getIdx();
		var exAwardItem = this._exAwardList[index];
		
		var id = exAwardItem['id'];
		
		var dlgExAward = UIMgr.getInstance().openDlg(ID_DlgExAward);
		dlgExAward.setExAwardInfo(exAwardItem);
	},

	tableCellSizeForIndex:function (table, idx) {
		return cc.size(230, 320);
	},

	tableCellAtIndex:function (table, idx) {
		var index = idx.toFixed(0);
		cc.log("------------------------------ idx = " + index);
		var cell = table.dequeueCell();
		if (!cell) {
			cell = new cc.TableViewCell();
			var json = ccs.load(res.exchangeNode_json);
			var node = json.node;
			node.x = 115;
			node.y = 160;
			cell.addChild(node, 0, 100);
		}

		var item =  cell.getChildByTag(100);
		
		var ImgBg = item.getChildByName('ImgBg');
		ImgBg.setEnabled(false);
		var ImgPic = ImgBg.getChildByName('ImgPic');
		var LabTitle = ImgBg.getChildByName('LabTitle');
		var ImgHot = ImgBg.getChildByName('ImgHot');
		var LabPrice_0 = ImgBg.getChildByName('LabPrice_0');
		var LabPrice_1 = ImgBg.getChildByName('LabPrice_1');

		var exAwardItem = this._exAwardList[index];
		
		ImgBg.removeChildByTag(111, true);
		//根据id设置奖品图片
		var id = exAwardItem['id'];
		var picName = LoadExAwardImgCfg.getInstance().getImgFileById(id);
		if(picName){
			var sizePic = ImgBg.getSize();
			var sprite = new cc.Sprite(picName);
			if(sprite){
				sprite.x = sizePic.width / 2;
				sprite.y = sizePic.height / 2 + 1;
				sprite.tag = 111;
				ImgBg.addChild(sprite);
			}			
		}		
		
		//
		var title = exAwardItem['PrizeTile'];
		LabTitle.string = title;
		
		//价格
		var price = exAwardItem['PrizeValue'];
		var strPrece = price + '张';
		LabPrice_0.string = strPrece;
		LabPrice_1.string = strPrece;
		
		//
		var state = exAwardItem['PrizeState'];
		if(state == '1'){
			ImgHot.setVisible(true);
		}else{
			ImgHot.setVisible(false);
		}

		return cell;
	},

	numberOfCellsInTableView:function (table) {
		return this.recordCount;
	},
	////////////////////////////////////////////////////////////
});