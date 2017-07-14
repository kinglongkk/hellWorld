//邮件数据
var TimingGiftInfo = cc.Class.extend({

	ctor: function () {
		this.reset();
	},

	reset: function(){
		//定时礼包信息
		this._TimingGiftInfos = {};
		
		//时间（当天秒数）：小时*3600+分钟*60+秒
		this._serverTime = 0;
		this._clientStartTime = 0;
	},

	//定时礼包信息
	setTimingGiftInfo: function(info){
		var key = '' + info.dwTimingId;
		this._TimingGiftInfos[key] = info;
	},
	getTimingGiftInfos: function(){
		return this._TimingGiftInfos;
	},
	getTimingGiftInfo: function(TimingId){
		var key = '' + TimingId;
		return this._TimingGiftInfos[key];
	},
	
	//服务器时间
	setServerTime: function(time){
		this._serverTime = time;
	},
	getServerTime: function(){
		var curDate = new Date();
		var curTime = curDate.getTime();
		curTime = Math.floor(curTime / 1000);
		cc.log('this._serverTime = ' + this._serverTime);
		cc.log('curTime = ' + curTime);
		cc.log('this._clientStartTime = ' + this._clientStartTime);
		var time = this._serverTime + curTime - this._clientStartTime;
		cc.log('time = ' + time);
		return time;
	},

	resetClientStartTime: function(){
		var curDate = new Date();
		var curTime = curDate.getTime();
		this._clientStartTime = Math.floor(curTime / 1000);
	},
	getClientStartTime: function(){
		return this._clientStartTime;
	},
	
	getState: function(TimingId){
		var value = 0;
		var data = this.getTimingGiftInfo(TimingId);
		value = data.dwState;

		return value;
	},
	
	getStartTime: function(TimingId){
		var value = 0;
		var data = this.getTimingGiftInfo(TimingId);
		value = data.dwStartTime;

		return value;
	},
	
	getEndTime: function(TimingId){
		var value = 0;
		var data = this.getTimingGiftInfo(TimingId);
		value = data.dwEndTime;

		return value;
	},
	
	getAddScoreById: function(TimingId){
		var value = 0;
		var data = this.getTimingGiftInfo(TimingId);
		value = data.dwAddScore;
		
		return value;
	},
	
	getStrTimeById: function(TimingId){
		var strTime = '';
		var data = this.getTimingGiftInfo(TimingId);
		var startTime = data.dwStartTime;
		var endTime = data.dwEndTime;
		
		var hour = Math.floor(startTime / 3600);
		if(hour < 10){
			hour = '0' + hour;
		}
		var minute = Math.floor( (startTime % 3600) / 60 );
		if(minute < 10){
			minute = '0' + minute;
		}
		
		strTime += hour;
		strTime += ':';
		strTime += minute;
		strTime += '-';
		hour = Math.floor(endTime / 3600);
		if(hour < 10){
			hour = '0' + hour;
		}
		minute = Math.floor( (endTime % 3600) / 60 );
		if(minute < 10){
			minute = '0' + minute;
		}
		strTime += hour;
		strTime += ':';
		strTime += minute;

		return strTime;
	},
});