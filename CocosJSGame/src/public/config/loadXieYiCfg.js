var g_xieYiCfg = null;
var LoadXieYiCfg = cc.Class.extend({
    ctor:function(){
        this.xieYiCfg = cc.loader.getRes(res.xieYiCfg_cfg);
    },

    getXieYiContent: function(kindID){
        //cc.log(this.xieYiCfg["xieYi"]);
        return this.xieYiCfg["xieYi"];
    },
});

LoadXieYiCfg.getInstance = function(){
    if(g_xieYiCfg == null){
        g_xieYiCfg = new LoadXieYiCfg();
    }
    return g_xieYiCfg;
}