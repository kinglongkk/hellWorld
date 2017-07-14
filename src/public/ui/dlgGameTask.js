
DLG_CREATOR[ID_DlgGameTask] = function() {
	return new DlgGameTask();
};

var DlgGameTask = DlgBase.extend({
	ctor: function(){},

	onCreate: function() {
		this.init();
	},

	onClose: function() {

	},

	init: function() {
		var json = ccs.load(res.dlgTask_json);
		this._rootWidget = json.node;

		//自适应屏幕大小
		var sizeDir = cc.director.getWinSize();
		this._rootWidget.setContentSize(sizeDir);
		ccui.helper.doLayout(this._rootWidget);

		this._rootWidget.setLocalZOrder(51);
		
		this.PanelNoTask = this._rootWidget.getChildByName('PanelNoTask');
		this.PanelNoTask.addTouchEventListener(this.onClickEvent, this);
		this.PanelNoTask.setVisible(false);
		this.ImgNoTaskBg = this.PanelNoTask.getChildByName('ImgNoTaskBg');
		this.LabWeiXinId = this.ImgNoTaskBg.getChildByName('LabWeiXinId');
		this.LabWeiXinId.string = _CONFIG_["WEIXIN_ID"];
		
		this.PanelTaskProgress = this._rootWidget.getChildByName('PanelTaskProgress');
		this.PanelTaskProgress.addTouchEventListener(this.onClickEvent, this);
		this.PanelTaskProgress.setVisible(false);
		this.ImgTaskProgressBg = this.PanelTaskProgress.getChildByName('ImgTaskProgressBg');
		this.LabProgress = this.ImgTaskProgressBg.getChildByName('LabProgress');
		this.LabAddScoreTip = this.ImgTaskProgressBg.getChildByName('LabAddScoreTip');
		this.LabAddMbTicketTip = this.ImgTaskProgressBg.getChildByName('LabAddMbTicketTip');
		
		this.PanelTaskComplete = this._rootWidget.getChildByName('PanelTaskComplete');
		this.PanelTaskComplete.addTouchEventListener(this.onClickEvent, this);
		this.PanelTaskComplete.setVisible(false);
		this.ImgTaskCompleteBg = this.PanelTaskComplete.getChildByName('ImgTaskCompleteBg');
		this.LabAddScore = this.ImgTaskCompleteBg.getChildByName('LabAddScore');
		this.LabAddMbTicket = this.ImgTaskCompleteBg.getChildByName('LabAddMbTicket');
		this.BtnGetReward = this.ImgTaskCompleteBg.getChildByName('BtnGetReward');
		this.BtnGetReward.addTouchEventListener(this.onClickGetReward, this);
		
		this.BtnOpenTask = this._rootWidget.getChildByName('BtnOpenTask');
		this.BtnOpenTask.addTouchEventListener(this.onClickOpenTask, this);
		this.ImgCompleteTip = this.BtnOpenTask.getChildByName('ImgCompleteTip');
		this.ImgCompleteTip.setVisible(false);
		
		this.updateDlg();
	},

	onClickEvent: function(sender, type) {
		if (ccui.Widget.TOUCH_ENDED == type) {
			var strBtnName = sender.getName();
			cc.log('onClickEvent ' + strBtnName);
			switch (strBtnName) {
			case "PanelNoTask":
				this.PanelNoTask.setVisible(false);
				break;
			case "PanelTaskProgress":
				this.PanelTaskProgress.setVisible(false);
				break;
			case "PanelTaskComplete":
				this.PanelTaskComplete.setVisible(false);
				break;
			default:
				break;
			}
		}
	},
	
	onClickGetReward: function(sender, type) {
		if (ccui.Widget.TOUCH_ENDED == type) {
			cc.log('onClickGetReward');
			var typeId = sender.getTag();
			GameTaskMsg.getInstance().sendGetTaskRewards(typeId, 0);
			this.PanelTaskComplete.setVisible(false);
		}
	},
	
	onClickOpenTask: function(sender, type) {
		if (ccui.Widget.TOUCH_ENDED == type) {
			cc.log('onClickOpenTask');

			this.openTask();
		}
		
		if(ccui.Widget.TOUCH_MOVED == type){
			var ptThouch = sender.getTouchMovePosition();
			var pt = this._rootWidget.convertToNodeSpace(ptThouch);
			sender.setPosition(pt);
		}
	},
	
	openTask: function(){
		this.PanelNoTask.setVisible(false);
		this.PanelTaskProgress.setVisible(false);
		this.PanelTaskComplete.setVisible(false);
		
		var numActive = 0;
		var numDone = 0;

		var task = ClientData.getInstance().getTask();
		if(task){
			var tasksActive = task.getTaskInfosByActive();
			numActive = tasksActive.length;
			var tasksDone = task.getTaskInfosByDone();
			numDone = tasksDone.length;
			
			if(numActive == 0 && numDone == 0){
				this.PanelNoTask.setVisible(true);
			}else{
				if(numDone == 0){
					this.PanelTaskProgress.setVisible(true);
					var taskInfo = tasksActive[0];
					//在线奖励任务
					var bTaskOnline = task.isTaskOnlineReward(taskInfo);
					if(bTaskOnline){
						var strProgress = task.getTaskOnlineStrProgress(taskInfo);
						
						var addScore = LoadTaskCfg.getInstance().getTaskAddScore(taskInfo['typeID']);
						var strAddScore = addScore + '欢乐豆';
						if(addScore == 0){
							strAddScore = "";
						}
						
						var addTicket = LoadTaskCfg.getInstance().getTaskAddTicket(taskInfo['typeID']);
						var strAddTicket = addTicket + '兑换券';
						if(addTicket == 0){
							strAddTicket = "";
						}
						
						this.LabProgress.string = strProgress;
						this.LabAddScoreTip.string = strAddScore;
						this.LabAddMbTicketTip.string = strAddTicket;
					}
				}else{
					this.PanelTaskComplete.setVisible(true);
					var taskInfo = tasksDone[0];
					//在线奖励任务
					var bTaskOnline = task.isTaskOnlineReward(taskInfo);
					if(bTaskOnline){
						var addScore = LoadTaskCfg.getInstance().getTaskAddScore(taskInfo['typeID']);
						var strAddScore = addScore + '欢乐豆';
						if(addScore == 0){
							strAddScore = "";
						}
						
						var addTicket = LoadTaskCfg.getInstance().getTaskAddTicket(taskInfo['typeID']);
						var strAddTicket = addTicket + '兑换券';
						if(addTicket == 0){
							strAddTicket = "";
						}
						
						this.LabAddScore.string = strAddScore;
						this.LabAddMbTicket.string = strAddTicket;
						this.BtnGetReward.tag = taskInfo['typeID'];
					}
				}
			}
		}
	},
	
	updateDlg: function(){
		var count = 0;
		
		var task = ClientData.getInstance().getTask();
		if(task){
			var tasks = task.getTaskInfosByDone();
			count = tasks.length;
			
			if(count > 0){
				var blink = cc.blink(0.4, 1);
				var action = blink.repeatForever();
				this.ImgCompleteTip.runAction(action);
				this.PanelTaskProgress.setVisible(false);
			}else{
				this.ImgCompleteTip.setVisible(false);
			}
		}
	},
});