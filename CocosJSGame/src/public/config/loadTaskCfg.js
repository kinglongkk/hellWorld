var g_LoadTaskCfg = null;
var LoadTaskCfg = cc.Class.extend({
	ctor:function(){
		var taskCfg = cc.loader.getRes(res.taskCfg_cfg);
		this._TasksPlaza = taskCfg['TasksPlaza'];
		this._Tasks = taskCfg['Tasks'];
	},
	
	//签到、在线礼包、充值
	getTasksPlaza: function(){
		return this._TasksPlaza;
	},
	
	////////////////////////////////////////////////////////////////////////////
	//任务
	getTasks: function(){
		return this._Tasks;
	},

	getTaskCfg: function(typeId){
		var taskCfg = null;

		for(var i=0; i<this._Tasks.length; i++){
			var cfg = this._Tasks[i];
			if(typeId == cfg['TypeId']){
				taskCfg = cfg;
			}
		}

		return taskCfg;
	},
	
	getTaskCfgData1: function(typeId){
		var timeCfg = 0;
		var taskCfg = this.getTaskCfg(typeId);
		if(taskCfg){
			timeCfg = taskCfg['Condition']['Data1'];
		}
		
		return timeCfg;
	},
	
	getTaskCfgData2: function(typeId){
		var timeCfg = 0;
		var taskCfg = this.getTaskCfg(typeId);
		if(taskCfg){
			timeCfg = taskCfg['Condition']['Data2'];
		}

		return timeCfg;
	},
	
	getTaskCfgData3: function(typeId){
		var timeCfg = 0;
		var taskCfg = this.getTaskCfg(typeId);
		if(taskCfg){
			timeCfg = taskCfg['Condition']['Data3'];
		}

		return timeCfg;
	},
	
	getTaskAddScore: function(typeId){
		var Gold = 0;
		var taskCfg = this.getTaskCfg(typeId);
		if(taskCfg){
			Gold = taskCfg['Reward']['Gold'];
		}

		return Gold;
	},
	
	getTaskAddTicket: function(typeId){
		var MbTicket = 0;
		var taskCfg = this.getTaskCfg(typeId);
		if(taskCfg){
			MbTicket = taskCfg['Reward']['MbTicket'];
		}

		return MbTicket;
	},
	////////////////////////////////////////////////////////////////////////////
});

LoadTaskCfg.getInstance = function(){
	if(g_LoadTaskCfg == null){
		g_LoadTaskCfg = new LoadTaskCfg();
	}
	return g_LoadTaskCfg;
}