var g_createRoomCfg = null;
var LoadCreateRoomCfg = cc.Class.extend({
	ctor:function(){
		this.createRoomCfg = cc.loader.getRes(res.createRoom_cfg);
		cc.log("createRoomCfg = " + JSON.stringify(this.createRoomCfg));
	},
	
	getCreateRoomCfg: function(kindID){
		return this.createRoomCfg["gameKindId_"+kindID];
	},
    getPayCfg: function(kindID, payType, limitIndex){
		var payInfo = this.createRoomCfg["pay_"+kindID];
		if(payType==1){
			//
            payInfo = payInfo["ALL"];
		}
		else if(payType==2){
			//AA
            payInfo = payInfo["AA"];
		}

		if(limitIndex)
			return payInfo[limitIndex];

		return payInfo
    }
});

LoadCreateRoomCfg.getInstance = function(){
	if(g_createRoomCfg == null){
		g_createRoomCfg = new LoadCreateRoomCfg();
	}
	return g_createRoomCfg;
}