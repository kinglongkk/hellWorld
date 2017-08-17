

DLG_CREATOR[ID_DlgExAwardRecord] = function() {
	return new DlgExAwardRecord();
};

var DlgExAwardRecord = DlgBase.extend({
	ctor: function(){
		this._exAwardInfo = null;
	},

	onCreate: function() {
		this.init();
	},

	onClose: function() {

	},

	init: function() {
		var json = ccs.load(res.dlgExAwardRecord_json);
		this._rootWidget = json.node;

		//自适应屏幕大小
		var sizeDir = cc.director.getWinSize();
		this._rootWidget.setContentSize(sizeDir);
		ccui.helper.doLayout(this._rootWidget);

		this.ImgBg = this._rootWidget.getChildByName('ImgBg');
		
		this.BtnClose = this.ImgBg.getChildByName('BtnClose');
		this.BtnClose.setPressedActionEnabled(true);
		this.BtnClose.addTouchEventListener(this.onClickEvent, this);
		
		this.PanelList = this.ImgBg.getChildByName('PanelList');
		var size = this.PanelList.getSize();
		var tableView = new cc.TableView(this, size);
		tableView.setDirection(cc.SCROLLVIEW_DIRECTION_VERTICAL);
		tableView.setDelegate(this);
		tableView.setVerticalFillOrder(cc.TABLEVIEW_FILL_TOPDOWN);
		this.PanelList.addNode(tableView);
		this.tableView = tableView;
		
		var exAward = ClientData.getInstance().getExAward();
		var exAwardRecords = exAward.getExAwardRecords();
		this.recordCount = exAwardRecords.length;
		this.tableView.reloadData();
		
		this.addActionNodeMB(this.ImgBg);
	},
	
	onClickEvent: function(sender, type) {
		if (ccui.Widget.TOUCH_ENDED == type) {
			var strBtnName = sender.getName();
			cc.log('onClickEvent ');
			UIMgr.getInstance().closeDlg(ID_DlgExAwardRecord);
		}
	},

	///////////////////////////////////////////////////////////////
	scrollViewDidScroll:function (view) {
	},
	scrollViewDidZoom:function (view) {
	},

	tableCellTouched:function (table, cell) {
		//cc.log("cell touched at index: " + cell.getIdx());
	},

	tableCellSizeForIndex:function (table, idx) {
		return cc.size(518, 50);
	},

	tableCellAtIndex:function (table, idx) {
		var index = idx.toFixed(0);
		cc.log("------------------------------ idx = " + index);
		var cell = table.dequeueCell();
		if (!cell) {
			cell = new cc.TableViewCell();
			
			var labTime = new cc.LabelTTF("", "Arial", 22.0);
			labTime.x = 0;
			labTime.y = 25;
			labTime.anchorX = 0;
			labTime.anchorY = 0.5;
			labTime.tag = 100;
			labTime.setColor(cc.color(160,99,22));
			cell.addChild(labTime);
			
			var labState = new cc.LabelTTF("", "Arial", 22.0);
			labState.x = 518;
			labState.y = 25;
			labState.anchorX = 1;
			labState.anchorY = 0.5;
			labState.tag = 200;
			labState.setColor(cc.color(160,99,22));
			cell.addChild(labState);
		}

		var labTime =  cell.getChildByTag(100);
		var labState =  cell.getChildByTag(200);
		
		var exAward = ClientData.getInstance().getExAward();
		var exAwardRecords = exAward.getExAwardRecords();
		var record = exAwardRecords[index];
		
		var strTime = record['ExchangeData'] + ' 兑换[' + record['PrizeTile'] + ']'
		labTime.setString(strTime);
		
		var strState = '';
		if(record['state'] == '0'){
			strState = '【待处理】';
			labState.setColor(cc.color(255,0,0));
		}else if(record['state'] == '1'){
			strState = '【成功】';
			labState.setColor(cc.color(160,99,22));
		}
		
		labState.setString(strState);

		return cell;
	},

	numberOfCellsInTableView:function (table) {
		return this.recordCount;
	},
	////////////////////////////////////////////////////////////
});