var g_LoadTaskCfg = null;
//{
//	//任务ID 作为KEY
//	"taskID_1000":{
//		"taskType":0,//任务类型1...9
//		"taskIcon":"",//任务图标
//		"taskTitleIcon":"",//标题图标
//		"taskExplain":"",//任务说明
//		"taskStatus":0,//0:未完成 1：已完成  2：已领取
//		"operation":{
//			"btnTexture":"",//操作按钮纹理
//			"textTexture":"",//操作按钮文字纹理
//			"toDlgID":1000//跳转的界面ID
//		}
//	},
//}
var LoadTaskCfg = cc.Class.extend({
	ctor:function(){
		this.taskCfg = cc.loader.getRes(res.taskCfg_cfg);
	},
    getTaskCfg: function(){
        return this.taskCfg;
    },
	getTaskByID: function(taskID){
		return this.taskCfg["taskID_"+taskID];
	}
	////////////////////////////////////////////////////////////////////////////
});

LoadTaskCfg.getInstance = function(){
	if(g_LoadTaskCfg == null){
		g_LoadTaskCfg = new LoadTaskCfg();
	}
	return g_LoadTaskCfg;
}