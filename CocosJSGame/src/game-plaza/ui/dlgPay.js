

DLG_CREATOR[ID_DlgPay] = function() {
	return new DlgPay();
};

var DlgPay = DlgBase.extend({
	ctor: function(){},

	onCreate: function() {
		this.init();
	},

	onClose: function() {

	},

	init: function() {
		var json = ccs.load(res.dlgPayScene_json);
		this._rootWidget = json.node;

		//自适应屏幕大小
		var sizeDir = cc.director.getWinSize();
		this._rootWidget.setContentSize(sizeDir);
		ccui.helper.doLayout(this._rootWidget);

		this.ImgBg = this._rootWidget.getChildByName('ImgBg');

		this.BtnBack = this._rootWidget.getChildByName('BtnBack');
		this.BtnBack.setPressedActionEnabled(true);
		this.BtnBack.addTouchEventListener(this.onClickEvent, this);
		
		this.ListView = this._rootWidget.getChildByName('ListView');
		
		this.updateDlg();
	},

	onClickEvent: function(sender, type) {
		if (ccui.Widget.TOUCH_ENDED == type) {
			var strBtnName = sender.getName();
			cc.log('onClickEvent ' + strBtnName);
			switch (strBtnName) {
			case "BtnBack":
				UIMgr.getInstance().closeDlg(ID_DlgPay);
				break;
			default:
				break;
			}
		}
	},
	
	addGoodsList: function(){
		//一屏显示3.5个
		var sizeDir = cc.director.getWinSize();
		var size = cc.size(sizeDir.width / 3.5, 320);
		
		var widget = new ccui.Widget();
		widget.setSize(size);
		
		var json = ccs.load(res.goodsNode_json);
		var node = json.node;
		var imgBg = node.getChildByName('ImgBg');
		var newBg = imgBg.clone();
		
		newBg.x = size.width / 2;
		newBg.y = size.height / 2;
		widget.addChild(newBg);
		
		this.ListView.setItemModel(widget);
		
		
		for(var i=0; i<10; i++){
			this.ListView.pushBackDefaultItem();
		}
	},
	
	updateDlg: function(){
		this.addGoodsList();
	},
});