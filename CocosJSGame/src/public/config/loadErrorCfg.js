var g_errorCfg = null;
var LoadErrorCfg = cc.Class.extend({
    ctor:function(){
        this.errorCfg = cc.loader.getRes(res.errorCfg_cfg);
    },

    getStrErrTip: function(errCode){
    	return this.errorCfg[String(errCode)];
    },
});

LoadErrorCfg.getInstance = function(){
	if(g_errorCfg == null){
		g_errorCfg = new LoadErrorCfg();
    }
    return g_errorCfg;
}