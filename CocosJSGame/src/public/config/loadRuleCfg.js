var g_RuleCfg = null;
var LoadRuleCfg = cc.Class.extend({
	ctor:function(){
		this.ruleCfg = cc.loader.getRes(res.ruleCfg_cfg);
	},
	
	getRuleContent: function(kindID){
		return this.ruleCfg["rule_"+kindID];
	},
});

LoadRuleCfg.getInstance = function(){
	if(g_RuleCfg == null){
        g_RuleCfg = new LoadRuleCfg();
	}
	return g_RuleCfg;
}