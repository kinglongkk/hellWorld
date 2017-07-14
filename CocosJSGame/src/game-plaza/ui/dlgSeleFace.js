

DLG_CREATOR[ID_DlgSeleFace] = function() {
	return new DlgSeleFace();
};

var DlgSeleFace = DlgBase.extend({
	ctor: function(){},

	onCreate: function() {
		this.init();

		this.bVerify = false; //验证通过
	},

	onClose: function() {

	},

	init: function() {
		var json = ccs.load(res.dlgSeleFaceScene_json);
		this._rootWidget = json.node;

		//自适应屏幕大小
		var sizeDir = cc.director.getWinSize();
		this._rootWidget.setContentSize(sizeDir);
		ccui.helper.doLayout(this._rootWidget);

		this.ImgBg = this._rootWidget.getChildByName('ImgBg');

		this.BtnClose = this.ImgBg.getChildByName('BtnClose');
		this.BtnClose.setPressedActionEnabled(true);
		this.BtnClose.addTouchEventListener(this.onClickEvent, this);

		this.PanelNormal = this.ImgBg.getChildByName('PanelNormal');
		this.PanelNormal.setVisible(true);
		this.ListViewNormal = this.PanelNormal.getChildByName('ListViewNormal');

		this.PanelVip = this.ImgBg.getChildByName('PanelVip');
		this.PanelVip.setVisible(false);
		this.ListViewVip = this.PanelVip.getChildByName('ListViewVip');
		
		this.addActionNodeMB(this.ImgBg);
		
		this.updateDlg();
	},
	
	

	onClickEvent: function(sender, type) {
		if (ccui.Widget.TOUCH_ENDED == type) {
			var strBtnName = sender.getName();
			cc.log('onClickEvent ' + strBtnName);
			switch (strBtnName) {
			case "BtnClose":
				UIMgr.getInstance().closeDlg(ID_DlgSeleFace);
				break;
			default:
				break;
			}
		}
	},
	
	removeAllSeleTag: function(){
		var itemsNormal = this.ListViewNormal.getItems();
		for(var i=0; i<itemsNormal.length; i++){
			var item = this.ListViewNormal.getItem(i);
			item.removeChildByTag(100, true);
		}
	},
	
	onClickNormalFaceEvent: function(sender, type) {
		if (ccui.Widget.TOUCH_ENDED == type) {
			var faceId = sender.getTag();
			cc.log('onClickNormalFaceEvent faceId = ' + faceId);
			
			this.removeAllSeleTag();
			var size = sender.getSize();
			var imgSele = new ccui.ImageView("dlgSeleFacePlist/img_sele_face_bg_1.png", ccui.Widget.PLIST_TEXTURE);
			imgSele.x = size.width / 2;
			imgSele.y = size.height / 2;
			imgSele.setTag(100);
			sender.addChild(imgSele);
			
			//修改头像
			LogonMsgHandler.getInstance().connect(function(){
				UserServerMsg.getInstance().sendModifyFaceId(faceId);
			});
		}
	},
	
	addFaceListNormal: function(){
		var faceList = LoadFaceCfg.getInstance().getFaceListNormal();
		var len = faceList.length;
		var size = cc.size(110,110);
		
		for(var i=0; i<len; i++){
			var faceInfo = faceList[i];
			var faceId = faceInfo["faceId"];
			var faceFile = faceInfo["facePic"];
			
			var widget = new ccui.Widget();
			widget.setSize(size);
			widget.setTag(faceId);
			widget.setTouchEnabled(true);
			widget.addTouchEventListener(this.onClickNormalFaceEvent, this);

			var imgBg = new ccui.ImageView("dlgSeleFacePlist/img_sele_face_bg_0.png", ccui.Widget.PLIST_TEXTURE);
			imgBg.x = size.width / 2;
			imgBg.y = size.height / 2;
			widget.addChild(imgBg);
			
			var imgFace = new ccui.ImageView(faceFile);
			imgFace.x = size.width / 2;
			imgFace.y = size.height / 2;
			var sizeImg = imgFace.getSize();
			imgFace.setScaleX(100 / sizeImg.width);
			imgFace.setScaleY(100 / sizeImg.height);
			widget.addChild(imgFace);

			this.ListViewNormal.pushBackCustomItem(widget);
		}
	},
	
	addFaceListVip: function(){
		
	},

	updateDlg: function(){
		this.addFaceListNormal();
	},
});