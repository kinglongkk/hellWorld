/*
* 牛几显示
* */
DLG_CREATOR[ID_NnFpDlgGetType] = function() {
	return new NnFpDlgGetType();
};

var NnFpDlgGetType = DlgBase.extend({
	ctor: function(){},

	onCreate: function() {
		this.init();
	},

	onClose: function() {},

	init: function() {
		var json = ccs.load(res.dlgNnFpGetType_json);
		this._rootWidget = json.node;

		//自适应屏幕大小
		var sizeDir = cc.director.getWinSize();
		this._rootWidget.setContentSize(sizeDir);
		ccui.helper.doLayout(this._rootWidget);
		
		this.ImgBg = this._rootWidget.getChildByName('ImgBg');

		this.Lab_0 = this.ImgBg.getChildByName('Lab_0');
        this.Lab_0.ignoreContentAdaptWithSize(true);
		this.Lab_0.string = "";
		
		this.Lab_1 = this.ImgBg.getChildByName('Lab_1');
        this.Lab_1.ignoreContentAdaptWithSize(true);
		this.Lab_1.string = "";

		this.Lab_2 = this.ImgBg.getChildByName('Lab_2');
        this.Lab_2.ignoreContentAdaptWithSize(true);
		this.Lab_2.string = "";

		this.Lab_num = this.ImgBg.getChildByName('Lab_num');
        this.Lab_num.ignoreContentAdaptWithSize(true);
		this.Lab_num.string = "";

		this.updateDlg();
	},
	
	updateDlg: function(){
		var heroChairId = g_objHero.getChairID();
		var game = ClientData.getInstance().getGame();
		var info = game.getCardTypeInfo(heroChairId);

		this.Lab_0.string = info.value0;
		this.Lab_1.string = info.value1;
		this.Lab_2.string = info.value2;
		this.Lab_num.string = info.valueNum;
	}
});