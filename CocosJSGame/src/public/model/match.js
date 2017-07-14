var Match = cc.Class.extend({
	ctor: function () {
		this.reset();
	},

	reset: function(){
		this.matchStatus = 0;
		this.matchDesc = null;
		this.matchWaitNum = 0;
		this.matchTotal = 0;
		this.matchInfo = null;
	},
	
	//比赛状态
	setMatchStatus: function(matchStatus){
		this.matchStatus = matchStatus;
	},
	getMatchStatus: function(){
		return this.matchStatus
	},
	
	//比赛描述
	setMatchDesc: function(matchDesc){
		this.matchDesc = matchDesc;
	},
	getMatchDesc: function(){
		return this.matchDesc;
	},
	
	//比赛信息
	setMatchInfo: function(matchInfo){
		this.matchInfo = matchInfo;
	},
	getMatchInfo: function(){
		return this.matchInfo;
	},
	
	//报名等待开始人数
	setMatchWaitNum: function(matchWaitNum){
		this.matchWaitNum = matchWaitNum;
	},
	getMatchWaitNum: function(){
		return this.matchWaitNum;
	},
	
	//满足开始总人数
	setMatchTotal: function(matchTotal){
		this.matchTotal = matchTotal;
	},
	getMatchTotal: function(){
		return this.matchTotal;
	},
});