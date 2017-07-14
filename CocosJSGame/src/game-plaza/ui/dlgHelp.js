
//var ID_DlgHelp = 1010;

DLG_CREATOR[ID_DlgHelp] = function() {
	return new DlgHelp();
};

var DlgHelp = DlgBase.extend({
	ctor: function(){
		this.bAddSR= false;
		this.bAddDZ= false;
		this.bAddTB= false;
		this.bAddFK= false;
		this.bAddSHDZ = false;
		this.bAddHLZZ = false;
	},

	onCreate: function() {
		this.init();
	},

	onClose: function() {

	},

	init: function() {
		this._rootWidget = ccs.uiReader.widgetFromJsonFile(res.contact_json);
		//背景
//		this._rootWidget.setBackGroundImage(res.img_bg_2);
//		this._rootWidget.setBackGroundImageScale9Enabled(true);
//		this._rootWidget.setBackGroundImageCapInsets(cc.rect(100, 50, 760, 540));
		
		this.imgBg = this._rootWidget.getChildByName('ImgBg');
		
		this.BtnClose = this.imgBg.getChildByName('BtnClose');
		this.BtnClose.setPressedActionEnabled(true);
		this.BtnClose.addTouchEventListener(this.onClickClose, this);
		
		this.labPhone = this.imgBg.getChildByName("LabPhone");
		if(_CONFIG_){
			this.labPhone.string = _CONFIG_.CONTACT_PHONE;
		}
		
//		this.PanelAbsolute = this._rootWidget.getChildByName('PanelAbsolute');
//
//		this.BtnNiuniuSR = this.PanelAbsolute.getChildByName('BtnNiuniuSR');
//		this.BtnNiuniuSR.setPressedActionEnabled(true);
//		this.BtnNiuniuSR.addTouchEventListener(this.onClickSR, this);
//		
//		this.BtnNiuniuDZ = this.PanelAbsolute.getChildByName('BtnNiuniuDZ');
//		this.BtnNiuniuDZ.setPressedActionEnabled(true);
//		this.BtnNiuniuDZ.addTouchEventListener(this.onClickDZ, this);
//		
//		this.BtnNiuniuTB = this.PanelAbsolute.getChildByName('BtnNiuniuTB');
//		this.BtnNiuniuTB.setPressedActionEnabled(true);
//		this.BtnNiuniuTB.addTouchEventListener(this.onClickTB, this);
//		
//		this.BtnNiuniuFK = this.PanelAbsolute.getChildByName('BtnNiuniuFK');
//		this.BtnNiuniuFK.setPressedActionEnabled(true);
//		this.BtnNiuniuFK.addTouchEventListener(this.onClickFK, this);
//		
//		this.BtnShowHandDZ = this.PanelAbsolute.getChildByName('BtnShowHandDZ');
//		this.BtnShowHandDZ.setPressedActionEnabled(true);
//		this.BtnShowHandDZ.addTouchEventListener(this.onClickSHDZ, this);
//		
//		this.BtnHlzz = this.PanelAbsolute.getChildByName('BtnHlzz');
//		this.BtnHlzz.setPressedActionEnabled(true);
//		this.BtnHlzz.addTouchEventListener(this.onClickHLZZ, this);
//		
//		this.ListViewSR = this.PanelAbsolute.getChildByName('ListViewSR');
//		this.ListViewSR.setEnabled(true);
//		this.ListViewDZ = this.PanelAbsolute.getChildByName('ListViewDZ');
//		this.ListViewDZ.setEnabled(false);
//		this.ListViewTB = this.PanelAbsolute.getChildByName('ListViewTB');
//		this.ListViewTB.setEnabled(false);
//		this.ListViewFK = this.PanelAbsolute.getChildByName('ListViewFK');
//		this.ListViewFK.setEnabled(false);
//		this.ListViewSHDZ = this.PanelAbsolute.getChildByName('ListViewSHDZ');
//		this.ListViewSHDZ.setEnabled(false);
//		this.ListViewHLZZ = this.PanelAbsolute.getChildByName('ListViewHLZZ');
//		this.ListViewHLZZ.setEnabled(false);
//		
//		this.BtnNiuniuSR.setBright(false);
//		this.addHelpSR();
	},

	onClickClose: function(sender, type) {
		if (ccui.Widget.TOUCH_ENDED == type) {
			UIMgr.getInstance().closeDlg(ID_DlgHelp);
		}
	},
	
	disableAllGame: function(){
		this.BtnNiuniuSR.setBright(true);
		this.BtnNiuniuDZ.setBright(true);
		this.BtnNiuniuTB.setBright(true);
		this.BtnNiuniuFK.setBright(true);
		this.BtnShowHandDZ.setBright(true);
		this.BtnHlzz.setBright(true);
		
		this.ListViewSR.setEnabled(false);
		this.ListViewDZ.setEnabled(false);
		this.ListViewTB.setEnabled(false);
		this.ListViewFK.setEnabled(false);
		this.ListViewSHDZ.setEnabled(false);
		this.ListViewHLZZ.setEnabled(false);

		this.ListViewSR.setVisible(false);
		this.ListViewDZ.setVisible(false);
		this.ListViewTB.setVisible(false);
		this.ListViewFK.setVisible(false);
		this.ListViewSHDZ.setVisible(false);
		this.ListViewHLZZ.setVisible(false);
	},
	
	onClickSR: function(sender, type) {
		if (ccui.Widget.TOUCH_ENDED == type) {
			this.disableAllGame();
			
			this.BtnNiuniuSR.setBright(false);
			this.ListViewSR.setEnabled(true);
			this.ListViewSR.setVisible(true);
			
			this.addHelpSR();
		}
	},
	
	onClickDZ: function(sender, type) {
		if (ccui.Widget.TOUCH_ENDED == type) {
			this.disableAllGame();

			this.BtnNiuniuDZ.setBright(false);
			this.ListViewDZ.setEnabled(true);
			this.ListViewDZ.setVisible(true);
			
			this.addHelpDZ();
		}
	},
	
	onClickTB: function(sender, type) {
		if (ccui.Widget.TOUCH_ENDED == type) {
			this.disableAllGame();

			this.BtnNiuniuTB.setBright(false);
			this.ListViewTB.setEnabled(true);
			this.ListViewTB.setVisible(true);
			
			this.addHelpTB();
		}
	},
	
	onClickFK: function(sender, type) {
		if (ccui.Widget.TOUCH_ENDED == type) {
			this.disableAllGame();

			this.BtnNiuniuFK.setBright(false);
			this.ListViewFK.setEnabled(true);
			this.ListViewFK.setVisible(true);
			
			this.addHelpFK();
		}
	},
	
	onClickSHDZ: function(sender, type) {
		if (ccui.Widget.TOUCH_ENDED == type) {
			this.disableAllGame();

			this.BtnShowHandDZ.setBright(false);
			this.ListViewSHDZ.setEnabled(true);
			this.ListViewSHDZ.setVisible(true);

			this.addHelpShowHandDZ();
		}
	},
	
	onClickHLZZ: function(sender, type) {
		if (ccui.Widget.TOUCH_ENDED == type) {
			this.disableAllGame();

			this.BtnHlzz.setBright(false);
			this.ListViewHLZZ.setEnabled(true);
			this.ListViewHLZZ.setVisible(true);

			this.addHelpHLZZ();
		}
	},
	
	addHelp: function(listView, count, imgId){
		for(var i=0; i<count; i++){
			var key = "" + imgId + i;
			var imgRes = res[key];
			
			var imageView = new ccui.ImageView();
			imageView.loadTexture(imgRes);
			
			listView.pushBackCustomItem(imageView);
		}
	},
	
	addHelpSR: function(){
		if(this.bAddSR){
			return;
		}
		
		if(_help_cfg){
			var cfg = _help_cfg["nnsr"];
			var count = cfg[0];
			var imgId = cfg[1];
			this.addHelp(this.ListViewSR, count, imgId);
		}
		
		this.bAddSR= true;
	},
	
	addHelpDZ: function(){
		if(this.bAddDZ){
			return;
		}

		if(_help_cfg){
			var cfg = _help_cfg["nndz"];
			var count = cfg[0];
			var imgId = cfg[1];
			this.addHelp(this.ListViewDZ, count, imgId);
		}

		this.bAddDZ= true;
	},
	
	addHelpTB: function(){
		if(this.bAddTB){
			return;
		}

		if(_help_cfg){
			var cfg = _help_cfg["nntb"];
			var count = cfg[0];
			var imgId = cfg[1];
			this.addHelp(this.ListViewTB, count, imgId);
		}

		this.bAddTB= true;
	},
	
	addHelpFK: function(){
		if(this.bAddFK){
			return;
		}

		if(_help_cfg){
			var cfg = _help_cfg["nnfk"];
			var count = cfg[0];
			var imgId = cfg[1];
			this.addHelp(this.ListViewFK, count, imgId);
		}

		this.bAddFK= true;
	},
	
	addHelpShowHandDZ: function(){
		if(this.bAddSHDZ){
			return;
		}

		if(_help_cfg){
			var cfg = _help_cfg["shdz"];
			var count = cfg[0];
			var imgId = cfg[1];
			this.addHelp(this.ListViewSHDZ, count, imgId);
		}

		this.bAddSHDZ = true;
	},
	
	addHelpHLZZ: function(){
		if(this.bAddHLZZ){
			return;
		}

		if(_help_cfg){
			var cfg = _help_cfg["hlzz"];
			var count = cfg[0];
			var imgId = cfg[1];
			this.addHelp(this.ListViewHLZZ, count, imgId);
		}

		this.bAddHLZZ = true;
	},
});