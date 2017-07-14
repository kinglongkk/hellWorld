var g_LoadExAwardImgCfg = null;
var LoadExAwardImgCfg = cc.Class.extend({
	ctor:function(){
		var cfg = cc.loader.getRes(res.exAwardImg_cfg);
		this._mapImg = cfg["AwardImg"];
	},

	getImgFileById: function(exAwardID){
		var strFile = null;
		
		if(this._mapImg[exAwardID]){
			strFile = this._mapImg[exAwardID];
		}
		
		return strFile;
	},
});

LoadExAwardImgCfg.getInstance = function(){
	if(g_LoadExAwardImgCfg == null){
		g_LoadExAwardImgCfg = new LoadExAwardImgCfg();
	}
	return g_LoadExAwardImgCfg;
}

LoadExAwardImgCfg.getInstance();