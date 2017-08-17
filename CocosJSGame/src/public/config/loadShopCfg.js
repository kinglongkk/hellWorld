var g_LoadShopCfg = null;
var LoadShopCfg = cc.Class.extend({
	ctor:function(){
		this.shopCfg = cc.loader.getRes(res.shopCfg_cfg);
	},
    getShopCfg: function(){
        return this.shopCfg;
    }
	////////////////////////////////////////////////////////////////////////////
});

LoadShopCfg.getInstance = function(){
	if(g_LoadShopCfg == null){
        g_LoadShopCfg = new LoadShopCfg();
	}
	return g_LoadShopCfg;
}