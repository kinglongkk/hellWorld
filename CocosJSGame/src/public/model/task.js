//任务数据
var Task = cc.Class.extend({
	//task status
	_VALID: 0,		//未接
	_ACTIVE: 2,			//已接
	_DONE: 3,			//完成未领奖
	_COMPLETE: 4,		//完成已领奖
	_END: 5,			//终止 表示不能再执行的任务?
	
	ctor: function () {
		this.reset();
	},

	reset: function(){
		//任务信息
		this.taskInfos = [];
		this.startTime = new Date() / 1000;
	},
	
	addTaskInfo: function(taskInfo){
		var bNoFind = true;

		for(var i=0; i<this.taskInfos.length; i++){
			var info = this.taskInfos[i];
			if(taskInfo.typeID == info.typeID && taskInfo.gameKindID == info.gameKindID){
				this.taskInfos[i] = taskInfo;
				bNoFind = false;
				break;
			}
		}

		//没找到
		if(bNoFind){
			this.taskInfos.push(taskInfo);
		}
	},

	getTaskInfos: function(){
		return this.taskInfos;
	},
	
	getTaskFlg: function(taskInfo){
		var flg = Math.floor(taskInfo['typeID'] / 1000);
		return flg;
	},
	
	resetStartTime: function(){
		this.startTime = new Date() / 1000;
	},
	getSpendTime: function(){
		var curTime = new Date() / 1000;
		var time = curTime - this.startTime;

		return time;
	},
	
	//任务信息
	getTaskInfo: function(typeId, gameKindId){
		var taskInfo = null;

		for(var i=0; i<this.taskInfos.length; i++){
			var info = this.taskInfos[i];
			if(typeId == info.typeID && gameKindId == info.gameKindID){
				taskInfo = info;
				break;
			}
		}

		return taskInfo;
	},
	
	
	
	
	
	//判断是否在线奖励任务
	isTaskOnlineReward: function(taskInfo){
		var flg = this.getTaskFlg(taskInfo);
		var bIs = false;
		if(flg == this._TaskFlag_OnlineReward){
			bIs = true;
		}
		return bIs;
	},
	//在线奖励任务,进度描述
	getTaskOnlineStrProgress: function(taskInfo){
		var str = "还有";
		var timeCfg = LoadTaskCfg.getInstance().getTaskCfgData1(taskInfo['typeID']) * 60;
		var timeTaskInfo = taskInfo['data1'];
		var timeSpend = this.getSpendTime();
		var levelTime = timeCfg - (timeTaskInfo+timeSpend);
		if(levelTime < 0){
			levelTime = 0;
		}
		
		var hour = Math.floor( levelTime / (60*60) );
		var minute = Math.floor( ( levelTime % (60*60) ) / 60 );
		var second = Math.floor( ( levelTime % 60 ) / 60 );
		
		var strHour = hour + ":" ;
		if(hour < 10){
			strHour = "0" + hour + ":" ;
		}
		str += strHour;
		
		var strMinute = minute + ":" ;
		if(minute < 10){
			strMinute = "0" + minute + ":" ;
		}
		str += strMinute;
		
		var strSecond = second;
		if(second < 10){
			strSecond = "0" + second;
		}
		str += strSecond;
		
		str += "可领取";
		
		return str;
	},
	
	
	
	
	
	//任务完成
	taskComplete: function(typeId, gameKindId){
		for(var i=0; i<this.taskInfos.length; i++){
			var info = this.taskInfos[i];
			if(typeId == info.typeID && gameKindId == info.gameKindID){
				cc.log("this._DONE = " + this._COMPLETE);
				this.taskInfos[i]["taskState"] = this._COMPLETE;
				break;
			}
		}
	},
	
	//已接未完成任务
	getTaskInfosByActive: function(){
		var tasksActive = [];
		
		for(var i=0; i<this.taskInfos.length; i++){
			var info = this.taskInfos[i];
			if(this._ACTIVE == info.taskState){
				tasksActive.push(info);
			}
		}
		
		return tasksActive;
	},
	
	//完成未领奖
	getTaskInfosByDone: function(){
		var tasksDone = [];

		for(var i=0; i<this.taskInfos.length; i++){
			var info = this.taskInfos[i];
			if(this._DONE == info.taskState){
				tasksDone.push(info);
			}
		}

		return tasksDone;
	},
	
	
	
	
});