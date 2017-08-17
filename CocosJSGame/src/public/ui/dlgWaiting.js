/*
 * 网络等待界面
 * Author: 	xjn 
 * Date:	2017.4.1
 * 
 * */
DLG_CREATOR[ID_DlgLoader] = function() {
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
        this._rootWidget.setBackGroundColorType(ccui.Layout.BG_COLOR_SOLID);
        this._rootWidget.setBackGroundColor(cc.color(0,0,0,255));
        this._rootWidget.setBackGroundColorOpacity(120);
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
		action.gotoFrameAndPlay(0, 72, true);
        this.Text_tip = widget.getChildByName("Text_tip");
        this.Text_tip.string = "请稍候...";
        this.Text_tip.setVisible(true);

        this._taskTotal = 0;
        this._completeTaskCount = 0;
        this.barPercent = 0;

        cc.log(this.Text_tip.string+this.barPercent+"%");

		this._rootWidget.schedule(this.update.bind(this));
		cc.log("===============");
		
		// this._rootWidget.setOnExitCallback(function(){
		// 	this._rootWidget.unscheduleAllCallbacks();
		// }.bind(this));
	},

	setTipText: function(strTip){
		this.strTip = strTip;
        this.Text_tip.string = strTip || "";
	},

    setProgress: function(percent){
        this._percent = percent;
    },
    getProgress: function(){
        return this._percent;
    },
    setFinishCallBack: function(cb){
        this._finishCb = cb;
    },

	setTimeOutCallBack: function(cb, time){
		this._timeoutCb = cb;
		this._timeout = time;
	},

	update: function (time) {
		if(this._percent){
			//进度 提示
            if(this.barPercent < this._percent){
                this.barPercent += 1;
                if(this.barPercent > 100){
                    this.barPercent = 100;
                }
            }

            var complete = this.barPercent + this._completeTaskCount;
            var total = 100 + this._taskTotal;
            var percent = complete * 100 / total;
            percent = Math.min(percent, 100);
            percent = Math.floor(percent);

            this.Text_tip.string = "正在努力加载..."+percent + "%";
            // cc.log(this.Text_tip.string);
            //完成
            if( (this.barPercent == 100) && (this._completeTaskCount >= this._taskTotal) ){
                if(this._finishCb){
                    this._finishCb();
                }
            }
		}
		else{
			//倒计时 提示
            this._time += time;

            if(this.strTip){
                this.Text_tip.string = this.strTip+Math.ceil(this._timeout-this._time);
                cc.log(this.Text_tip.string);
            }

            //timeout
            if(this._time >= this._timeout){
                if(this._timeoutCb){
                    this._rootWidget.unscheduleAllCallbacks();
                    this.strTip = null;
                    this.Text_tip.string = "请稍候...";
                    //this.Text_tip.setVisible(false);
                    this._timeoutCb();

                    UIMgr.getInstance().closeDlg(ID_DlgLoader);
                }
                return;
            }
		}
	},
});

//网络等待界面 使用
var showWaiting = function(isShow, times, strTip){
    UIMgr.getInstance().closeDlg(ID_DlgLoader);

	if(isShow==true){
		var dlgWinting = UIMgr.getInstance().openDlg(ID_DlgLoader);
		if(dlgWinting){
            dlgWinting._percent = null;
			dlgWinting.setTimeOutCallBack(function(){}, (times || 20));
			if(strTip)
            	dlgWinting.setTipText(strTip);
		}
	}
}