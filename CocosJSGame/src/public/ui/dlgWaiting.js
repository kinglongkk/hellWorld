/*
 * 网络等待界面
 * Author: 	xjn 
 * Date:	2017.4.1
 * 
 * */
DLG_CREATOR[ID_DlgWaiting] = function() {
	return new DlgWaiting();
};

var DlgWaiting = DlgBase.extend({
	ctor: function () {
		this._timeoutCb = null;

		this._time = 0;
		this._timeout = 10;
	},

	onCreate: function() {
		this.init();
	},

	onClose: function() {
	this._rootWidget.unscheduleAllCallbacks();	},

	init: function() {
		this._rootWidget = new ccui.Layout();
		this._rootWidget.setTouchEnabled(true);
		//自适应屏幕大小
		var sizeDir = cc.director.getWinSize();
		this._rootWidget.setContentSize(sizeDir);
		ccui.helper.doLayout(this._rootWidget);
		
		var json = ccs.load(res.waitNode_json);
		var widget = json.node;
		var action = json.action;
		this._rootWidget.addChild(widget);
		widget.setPosition(sizeDir.width/2.0, sizeDir.height/2.0);
		widget.runAction(action);
		action.gotoFrameAndPlay(0, 60, true);

		this._rootWidget.schedule(this.update.bind(this));
		
		// this._rootWidget.setOnExitCallback(function(){
		// 	this._rootWidget.unscheduleAllCallbacks();
		// }.bind(this));
	},

	setTimeOutCallBack: function(cb, time){
		this._timeoutCb = cb;
		this._timeout = time;
	},


	update: function (time) {

		this._time += time;
		//timeout
		if(this._time >= this._timeout){
			if(this._timeoutCb){
				this._rootWidget.unscheduleAllCallbacks();
				
				this._timeoutCb();
				
				UIMgr.getInstance().closeDlg(ID_DlgWaiting);
			}
			return;
		}
	},
});

//网络等待界面 使用
var showWaiting = function(isShow,strTip){
	if(isShow==true){
        cc.log("+++++++showWaiting+++++++isShow==true++++666++++++++");
		UIMgr.getInstance().openDlg(ID_DlgWaiting);
        cc.log("+++++++showWaiting+++++++isShow==true++++222++++++++");
		var dlgWinting = UIMgr.getInstance().getDlg(ID_DlgWaiting);
        cc.log("+++++++showWaiting+++++++isShow==true++++111++++++++");
		if(dlgWinting){
			dlgWinting.setTimeOutCallBack(function(){}, 20);
		}
        cc.log("+++++++showWaiting+++++++isShow==true+++323+++++++++");
	}
	else{
		var dlgWinting = UIMgr.getInstance().getDlg(ID_DlgWaiting);
		if(dlgWinting){
			UIMgr.getInstance().closeDlg(ID_DlgWaiting);
		}
	}
}