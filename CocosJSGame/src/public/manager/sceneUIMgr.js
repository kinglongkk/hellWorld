var s_sharedSceneUIMgr = null;

var SceneUIMgr = cc.Class.extend({
	ctor: function () {
		this._uiLayer = null;
		this._bInit = false;
	},

	reset: function(){
		this._uiLayer = null;
		this._bInit = false;
	},
	
	init:function(layer){
		this._uiLayer = layer;
		_dlg_table_ = {};		
		SceneUIMgr.setInstance(this);
		
		this._bInit = true;
		this.startGame();
	},
	
	getUILayer: function(){
		return this._uiLayer;
	},

	startGame: function(){
		if(!this._bInit){
			return;
		}
	},
});

SceneUIMgr.setInstance = function(instance){
	var dlgMgr = SceneUIMgr.getInstance();
	if(dlgMgr){
		//重置前一个实例
		dlgMgr.reset();
	}
	
	s_sharedSceneUIMgr = instance;
};

SceneUIMgr.getInstance = function(){	
	return s_sharedSceneUIMgr;
};
