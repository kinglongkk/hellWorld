var g_LoadFaceCfg = null;
var LoadFaceCfg = cc.Class.extend({
	ctor:function(){
		var faceCfg = cc.loader.getRes(res.faceCfg_cfg);
		this._faceList = faceCfg["faceList"];
	},
	
	getFileByFaceId: function(faceId){
		var strFile = "";
		
		for(var i=0; i<this._faceList.length; i++){
			if(faceId == this._faceList[i]["faceId"]){
				strFile = this._faceList[i]["facePic"];
				break;
			}
		}
		
		if(strFile == ""){
			strFile = this._faceList[0]["facePic"];
		}
		
		return strFile;
	},
	
	getFaceListNormal: function(){
		var faceList = [];
		
		for(var i=0; i<this._faceList.length; i++){
			if(this._faceList[i]["faceId"] < 1100){
				var faceInfo = this._faceList[i];
				faceList.push(faceInfo);
			}
		}
		
		return faceList;
	},
	
	getFaceListVip: function(){
		var faceList = [];

		for(var i=0; i<this._faceList.length; i++){
			if(this._faceList[i]["faceId"] >= 1100){
				var faceInfo = this._faceList[i];
				faceList.push(faceInfo);
			}
		}

		return faceList;
	},
});

LoadFaceCfg.getInstance = function(){
	if(g_LoadFaceCfg == null){
		g_LoadFaceCfg = new LoadFaceCfg();
	}
	return g_LoadFaceCfg;
}