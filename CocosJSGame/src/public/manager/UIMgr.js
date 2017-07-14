var s_sharedUIMgr = null;
var UI_MSG_CLOSE_DLG = "UI_MSG_CLOSE_DLG";
var DLG_CREATOR = {};
var _dlg_table_ = {};

//模态要求窗口根节点是ccs.UILayout 设置成屏幕大小 touchable: true
var DlgBase = cc.Class.extend({
	_isModal: false,
	_rootWidget: null,
	_dlgId: null,

	onCreate: function () {
		
	},

	onClose: function () {

	},
	setDlgMiddle: function(){
		if (this._rootWidget) {
			var sizeDir = cc.director.getWinSize();
			var anchorPoint = this._rootWidget.getAnchorPoint();

			this._rootWidget.x = sizeDir.width * anchorPoint.x;
			this._rootWidget.y = sizeDir.height * anchorPoint.y;
		}
	},

	setDlgID: function (id) {
		this._dlgId = id;
	},

	getDlgID: function (id) {
		return this._dlgId;
	},

	getDlgWidget: function () {
		return this._rootWidget;
	},

	setDlgWidget: function (widget) {
		this._rootWidget = widget;
	},

	setModal: function (bModal) {
		this._isModal = bModal;
	},

	isModal: function () {
		return this._isModal;
	},
	
	///////////////////////////////////////////////////////////////////////////
	//打开界面时，节点动画
	
	//从左到右
	addActionNodeLR: function(node){
		if(!this.actionListLR){
			this.actionListLR = [];
		}
		
		this.actionListLR.push(node);
	},
	runActionNodeLR: function(){
		if(!this.actionListLR){
			return;
		}
		
		for(var i=0; i<this.actionListLR.length; i++){
			var node = this.actionListLR[i];
			var speed = 900 / 1;

			var desX = node.x;
			var desY = node.y;
			var dexScale = 1;

			var pt = node.convertToNodeSpaceAR(cc.p(-100, 0));
			
			var scrX = node.x + pt.x;
			var scrY = node.y;
			var scrScale = 0.3;

			var posTime = Math.abs(scrX - desX) / speed;
			var sizeTime = posTime + 0.2;

			node.x = scrX;
			node.y = scrY;
			
			//node.setScale(scrScale);

			var moveTo = cc.moveTo(posTime, cc.p(desX, desY));
			var scaleTo = cc.scaleTo(sizeTime, dexScale);
			var spawn = cc.spawn(moveTo, scaleTo);

			node.runAction(moveTo);
		}
	},
	
	//从右到左
	addActionNodeRL: function(node){
		if(!this.actionListRL){
			this.actionListRL = [];
		}

		this.actionListRL.push(node);
	},
	runActionNodeRL: function(){
		if(!this.actionListRL){
			return;
		}
		
		var sizeDir = cc.director.getWinSize();
		
		for(var i=0; i<this.actionListRL.length; i++){
			var node = this.actionListRL[i];
			var speed = 900 / 1;

			var desX = node.x;
			var desY = node.y;
			var dexScale = 1;

			var pt = node.convertToNodeSpaceAR(cc.p(sizeDir.width + 100, 0));

			var scrX = node.x + pt.x;
			var scrY = node.y;
			var scrScale = 0.3;

			var posTime = Math.abs(scrX - desX) / speed;
			var sizeTime = posTime + 0.2;

			node.x = scrX;
			node.y = scrY;
			//node.setScale(scrScale);

			var moveTo = cc.moveTo(posTime, cc.p(desX, desY));
			var scaleTo = cc.scaleTo(sizeTime, dexScale);
			var spawn = cc.spawn(moveTo, scaleTo);

			node.runAction(moveTo);
		}
	},
	
	//从上到下
	addActionNodeTB: function(node){
		if(!this.actionListTB){
			this.actionListTB = [];
		}

		this.actionListTB.push(node);
	},
	runActionNodeTB: function(){
		if(!this.actionListTB){
			return;
		}
		
		for(var i=0; i<this.actionListTB.length; i++){
			var node = this.actionListTB[i];
			var speed = 900 / 1;

			var desX = node.x;
			var desY = node.y;
			var dexScale = 1;
			
			var pt = node.convertToNodeSpaceAR(cc.p(0, 700));

			var scrX = node.x;
			var scrY = node.y + pt.y;
			var scrScale = 0.3;

			var posTime = Math.abs(scrY - desY) / speed;
			var sizeTime = posTime + 0.2;

			node.x = scrX;
			node.y = scrY;
			node.setScale(scrScale);

			var moveTo = cc.moveTo(posTime, cc.p(desX, desY));
			var scaleTo = cc.scaleTo(sizeTime, dexScale);
			var spawn = cc.spawn(moveTo, scaleTo);

			node.runAction(spawn);
		}
	},
	
	//从下到上
	addActionNodeBT: function(node){
		if(!this.actionListBT){
			this.actionListBT = [];
		}

		this.actionListBT.push(node);
	},
	runActionNodeBT: function(){
		if(!this.actionListBT){
			return;
		}
		
		for(var i=0; i<this.actionListBT.length; i++){
			var node = this.actionListBT[i];
			var speed = 900 / 1;

			var desX = node.x;
			var desY = node.y;
			var dexScale = 1;

			var pt = node.convertToNodeSpaceAR(cc.p(0, -60));

			var scrX = node.x;
			var scrY = node.y + pt.y;
			var scrScale = 0.3;

			var posTime = Math.abs(scrY - desY) / speed;
			var sizeTime = posTime + 0.2;

			node.x = scrX;
			node.y = scrY;
			node.setScale(scrScale);

			var moveTo = cc.moveTo(posTime, cc.p(desX, desY));
			var scaleTo = cc.scaleTo(sizeTime, dexScale);
			var spawn = cc.spawn(moveTo, scaleTo);

			node.runAction(spawn);
		}
	},
	
	//从小到大
	addActionNodeMB: function(node){
		if(!this.actionListMB){
			this.actionListMB = [];
		}

		this.actionListMB.push(node);
	},
	runActionNodeMB: function(){
		if(!this.actionListMB){
			return;
		}
		
		for(var i=0; i<this.actionListMB.length; i++){
			var node = this.actionListMB[i];
			
			node.setScale(0.3);
			var scaleTo1 = cc.scaleTo(0.2, 1.2);
			var scaleTo2 = cc.scaleTo(0.3, 1);
			
			var seq = cc.sequence(scaleTo1, scaleTo2);

			node.runAction(seq);
		}
	},
	
	runOpenAction: function(){
		this.runActionNodeLR();
		this.runActionNodeRL();
		this.runActionNodeTB();
		this.runActionNodeBT();
		
		this.runActionNodeMB();
	},
});

var UIMgr = cc.Class.extend({
	_uiLayer: null,
	_map_dlgs: {},
	
	_bAppHide: false,
	_pauseSchedule: false,
	_hideTime: 0,

	ctor: function () {
		this._closeIds = {};
/*
		
		
		var _self = this;

		//退后台
		var listenerHide = cc.EventListener.create({
			event: cc.EventListener.CUSTOM,
			eventName: cc.game.EVENT_HIDE,
			callback: function(){
				_self._bAppHide = true;
				_self._pauseSchedule = true;
				_self._hideTime = Date.now() / 1000;
				cc.log("退后台");

                var plaza = ClientData.getInstance().getPlaza();
                if (plaza.getCurKindID() === CMD_NIUNIU_TB.KIND_ID && g_gameSocket.status === SOCKET_STATUS._SS_INVALID) {
                    SendCardMgr.getInstance().exitSendCard();
                }
				//ios-native，不处理声音
				if( !(cc.sys.isNative && (cc.sys.os == cc.sys.OS_IOS)) ){
					//退后台关闭声音
					SoundMgr.getInstance().setPlayMusic(false);
				}
			}
		});
		cc.eventManager.addListener(listenerHide, 1);

		//回到前台
		var listenerShow = cc.EventListener.create({
			event: cc.EventListener.CUSTOM,
			eventName: cc.game.EVENT_SHOW,
			callback: function(){
				if(!_self._bAppHide){
					return;
				}
				
				_self._bAppHide = false;
				
				//退后台大于10秒，返回大厅并关闭socket
//				var curTime = Date.now() / 1000;
//				if( (curTime - _self._hideTime) > 10 && cc.sys.os == cc.sys.OS_IOS){
//					cc.log("退后台大于10秒，返回大厅并关闭socket");
//					MsgMgr.getInstance().getGameSocket();
//					GameKindMgr.getInstance().backPlazaScene();
//				}

				_self._pauseSchedule = false;

				//回到前台重新设置声音
				var bMusic = LocalStorageMgr.getInstance().getMusicItem();
				cc.log("回到前台 bMusic = " + bMusic);
        		SoundMgr.getInstance().setPlayMusic(bMusic);
			}
		});
		cc.eventManager.addListener(listenerShow, 1);*/
	},

	init: function (uiLayer) {
		this._uiLayer = uiLayer;
	},

	isPauseSchedule: function(){
		return this._pauseSchedule;
	},

	onCloseDlg: function (obj) {
		if (obj && obj.id) {
			var dlg = this.getDlg(obj.id);
			this.closeDlg(obj.id, true);
		}
	},

	createDlg: function (id) {
		var dlg = DLG_CREATOR[id]();
		if (dlg) {
			dlg.onCreate();
			dlg.setDlgID(id);
			_dlg_table_[id] = dlg;
			dlg.runOpenAction();
		}
		return dlg;
	},

	getDlg: function (id) {
		return _dlg_table_[id];
	},

	getWidget: function (id) {
		var dlg = this.getDlg(id);
		if (dlg) {
			return dlg.getDlgWidget();
		}
		return null;
	},
	openDlg: function (id, bModal) {
		var widget = this.getWidget(id);
		var dlg = null;
		if (!widget) {
			dlg = this.createDlg(id);
			if(dlg){
				widget = dlg.getDlgWidget();
				this._uiLayer.addChild(widget);
			}
		}else{
			dlg = this.getDlg(id);
		}
		
		//设置doModal模式
		if (dlg && dlg.isModal()) {
		}
		
		return dlg;
	},

	closeDlg: function (id, bDelay) {
		var dlg = this.getDlg(id);
		if(!dlg){
			return;
		}
		cc.log(id);
		
		if(bDelay){
			this._uiLayer.scheduleOnce(function(){
				var dlg = this.getDlg(id);
				if(dlg){
					dlg.onClose();
					this._uiLayer.removeChild(this.getWidget(id), true);
					_dlg_table_[id] = undefined;
				}
			}.bind(this), 0.05);
		}else{
			dlg.onClose();
			this._uiLayer.removeChild(this.getWidget(id), true);
			_dlg_table_[id] = undefined;
		}
	},
	
	//从右到左替换界面
	replaceDlgsRL: function(closeDlgIds, openDlgIds){
		var size = cc.director.getWinSize();
		var i = 0;

		for(i=0; i<closeDlgIds.length; i++){
			var dlgId = closeDlgIds[i];
			var widget = this.getWidget(dlgId);
			if (!widget || !widget.isVisible()) {
				continue;
			}
			
			var moveBy = cc.MoveBy(0.5, cc.p(-size.width, 0));
			var callFunc = function(id){
				return cc.CallFunc(function () {
					UIMgr.getInstance().closeDlg(id);
				}, this)
			}(dlgId);

			var seq = cc.Sequence(moveBy, callFunc);
			widget.runAction(seq);
		}

		for(i=0; i<openDlgIds.length; i++){
			var dlgId = openDlgIds[i];
			this.openDlg(dlgId);
			var widget = this.getWidget(dlgId);
			var ptEnd = new cc.p(widget.x, widget.y);
			widget.x += size.width;
			widget.runAction(cc.MoveTo(0.5, ptEnd));
		}
	},
	
	setCloseIds: function(dlgId, dlgCloseIds){
		this._closeIds[dlgId] = dlgCloseIds;
	},
	getCloseIds: function(dlgId){
		return this._closeIds[dlgId];
	},
	
	runClickAction: function(sender, type) {
		switch (type) {
		case ccui.Widget.TOUCH_BEGAN:
			var scaleTo = cc.ScaleTo(0.05, 1.05);
			sender.runAction(scaleTo);
			break;
		case ccui.Widget.TOUCH_MOVED:
			var scaleTo = cc.ScaleTo(0.05, 1);
			sender.runAction(scaleTo);
			break;
		case ccui.Widget.TOUCH_ENDED:
			var scaleTo = cc.ScaleTo(0.05, 1);
			sender.runAction(scaleTo);
			break;
		default:
			break;
		}
	},

	//显示键盘
	keyboardShow: function(widget, editNode){
		if(cc.sys.os == cc.sys.OS_WINDOWS){
			return;
		}

		if(widget.__originalY__ == null){
			widget.__originalY__ = widget.y;
		}

		var widgetOriginalY = widget.__originalY__;
		var widgetAddY = widget.y - widgetOriginalY;

		if(editNode.__addY__ == null){
			//widget位置变化后，editNode的世界坐标
			var worldPos = editNode.getWorldPosition();

			//widget位置变化前，editNode的世界坐标
			var originalWorldPos = cc.p(worldPos.x, worldPos.y - widgetAddY);

			//editNode显示键盘时，widget抬高的位置
			editNode.__addY__ = 500 - originalWorldPos.y;
		}

		widget.y += editNode.__addY__;
		cc.log("+ " + editNode.__addY__);
	},

	//隐藏键盘
	keyboardHide: function(widget, editNode){
		if(cc.sys.os == cc.sys.OS_WINDOWS){
			return;
		}

		if(editNode.__addY__ != null){
			cc.log("- " + editNode.__addY__);
			widget.y -= editNode.__addY__;
		}
	},
});

UIMgr.getInstance = function () {
	if (!s_sharedUIMgr) {
		s_sharedUIMgr = new UIMgr();
	}
	return s_sharedUIMgr;
};

