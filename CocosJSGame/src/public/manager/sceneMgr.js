var s_sharedSceneMgr = null;

var SceneMgr = cc.Class.extend({

	ctor: function () {
		this.bLoadLogin = false;
	},

	reset: function(){
	},
	
});

SceneMgr.getInstance = function() {
	if (!s_sharedSceneMgr) {
		s_sharedSceneMgr = new SceneMgr();
	}
	return s_sharedSceneMgr;
};
