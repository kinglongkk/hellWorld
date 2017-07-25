var g_createRoomCfg = null;
var LoadCreateRoomCfg = cc.Class.extend({
	ctor:function(){
		this.createRoomCfg = cc.loader.getRes(res.createRoom_cfg);
		cc.log("createRoomCfg = " + JSON.stringify(this.createRoomCfg));
	},
	
	getCreateRoomCfg: function(kindID){
		return this.createRoomCfg["gameKindId_"+kindID];
	},
});

LoadCreateRoomCfg.getInstance = function(){
	if(g_createRoomCfg == null){
		g_createRoomCfg = new LoadCreateRoomCfg();
	}
	return g_createRoomCfg;
}