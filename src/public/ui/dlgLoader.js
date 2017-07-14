
DLG_CREATOR[ID_DlgLoader] = function() {
	return new DlgLoader();
};

var DlgLoader = DlgBase.extend({
	ctor: function () {
		this._percent = 0;
		this._finishCb = null;
		this._timeoutCb = null;
		this._updateCb = null;

        this._taskTotal = 0;
        this._completeTaskCount = 0;

		this._time = 0;
		this._timeout = 10;
	},

	onCreate: function() {
		this.init();
	},

	onClose: function() {
        cc.log("--onExit---");
        this._rootWidget.unscheduleAllCallbacks();
	},

	init: function() {
		var json = ccs.load(res.dlgLoaderScene_json);
		this._rootWidget = json.node;

		//自适应屏幕大小
		var sizeDir = cc.director.getWinSize();
		this._rootWidget.setContentSize(sizeDir);
		ccui.helper.doLayout(this._rootWidget);
		
		this.ImgBg = this._rootWidget.getChildByName('ImgBg');

		this.PanelBg = this._rootWidget.getChildByName('PanelBg');

		this.ProgressBar = this.PanelBg.getChildByName('ProgressBar');
		this.ProgressBar.setPercent(0);

		this.LabPercent = this.PanelBg.getChildByName('LabPercent');
		this.LabPercent.string = 0 + "%";

		this.LabTip = this.PanelBg.getChildByName('LabTip');
		
		this.WaitNode = this.PanelBg.getChildByName('WaitNode');
		
		var json = ccs.load(res.waitNode_json);
		var widget = json.node;
		var action = json.action;
		this.WaitNode.addChild(widget);
		widget.runAction(action);
		action.gotoFrameAndPlay(0, 60, true);

		this._rootWidget.schedule(this.update.bind(this));

		// this._rootWidget.setOnExitCallback(function(){
		// 	this._rootWidget.unscheduleAllCallbacks();
		// }.bind(this));
		
		//淡入
		this.ImgBg.setOpacity(0)
		this.ImgBg.runAction(cc.fadeIn(0.4));
		
		/*
		this.addActionNodeBT(this.WaitNode);
		this.addActionNodeBT(this.ProgressBar);
		this.addActionNodeBT(this.LabPercent);
		this.addActionNodeBT(this.LabTip);
		*/
	},

	setProgress: function(percent){
		this._percent = percent;
	},
	getProgress: function(){
		return this._percent;
	},

	setContent: function(str){
		this.LabTip.string = str;
	},

	setFinishCallBack: function(cb){
		this._finishCb = cb;
	},
	
	setTimeOutCallBack: function(cb, time){
		this._timeoutCb = cb;
		this._timeout = time;
	},

	setUpdateCallBack: function(cb){
		this._updateCb = cb;
	},

    setTaskTotal: function(taskTotal){
        taskTotal = taskTotal || 0;
        this._taskTotal = taskTotal;
    },

    addCompleteTaskCount: function(){
        this._completeTaskCount++;
    },

	update: function (time) {
		if(this._updateCb){
			this._updateCb();
		}

		this._time += time;
		//timeout
		if(this._time >= this._timeout){
			if(this._timeoutCb){
				this._rootWidget.unscheduleAllCallbacks();
				
				this._timeoutCb();
				
				UIMgr.getInstance().closeDlg(ID_DlgLoader);
			}
			return;
		}
		
		var barPercent = this.ProgressBar.getPercent();

		if(barPercent < this._percent){			
			barPercent += 1;
			if(barPercent > 100){
				barPercent = 100;
			}
		}

		var complete = barPercent + this._completeTaskCount;
        var total = 100 + this._taskTotal;
        var percent = complete * 100 / total;
        percent = Math.min(percent, 100);
        percent = Math.floor(percent);
			
		this.ProgressBar.setPercent(percent);
		this.LabPercent.string = percent + "%";

		//完成
		if( (barPercent == 100) && (this._completeTaskCount >= this._taskTotal) ){
			if(this._finishCb){
				this._finishCb();
			}
		}
	},
});
