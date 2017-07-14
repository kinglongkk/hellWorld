//保险柜数据
var SignIn = cc.Class.extend({
	ctor: function () {
		this.reset();
	},

	reset: function(){
		//签到信息
		this.signInInfo = null;
		
		//签到结果
		this.signInResult = null;
		
		//当天是否已经签到
		this.bCurDaySignIn = false;
	},

	//签到信息
	setSignInInfo: function(info){
		this.signInInfo = info;
		
		//已连续签到天数
		var nSignInDays = this.signInInfo.dwSignInCount;
		//最后签到时间
		var SignInDate = this.signInInfo.CollectDate;
		//当前服务器时间
		var ServerDate = this.signInInfo.ServerDate;

		//判断是否同一天
		var nServer = ServerDate.wYear * 100 * 100 + ServerDate.wMonth * 100 + ServerDate.wDay;
		var nSignIn = SignInDate.wYear * 100 * 100 + SignInDate.wMonth * 100 + SignInDate.wDay;
		if(nSignInDays > 0 && nServer == nSignIn){
			this.bCurDaySignIn = true;
		}else{
			this.bCurDaySignIn = false;
		}
	},
	getSignInInfo: function(){
		return this.signInInfo;
	},
	
	//签到结果
	setSignInResult: function(info){
		this.signInResult = info;
		this.bCurDaySignIn = true;
		
		//
		this.signInInfo.dwSignInCount = this.signInResult.dwSignInCount;
		this.signInInfo.CollectDate = this.signInInfo.ServerDate;
		this.signInInfo.dwScoreTotal = this.signInResult.lScoreTotal;
		this.signInInfo.dwAddScore = this.signInResult.dwNextAddScore;
	},
	getSignInResult: function(){
		return this.signInResult;
	},
	
	//当天是否已签到
	isCurDaySignIn: function(){
		return this.bCurDaySignIn;
	},
});