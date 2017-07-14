//保险柜数据
var Insure = cc.Class.extend({
	ctor: function () {
		this.reset();
	},

	reset: function(){
		//保险柜打开状态
		this.bOpen = false;
		
		//保险柜游戏币
		this.scoreInsure = 0;
		//取钱税收，千分比
		this.revenueTake = 0;
		//转账税收，千分比
		this.revenueTransfer = 0;
		
		//游戏币
		this.scoreGame = 0;
		
		//转账最低限制
		this.giveLimit = 1;
		
		this.records = [];
		this.queryRecordTime = null;
	},
	
	//保险柜金币
	setScoreInsure: function(score){
		this.scoreInsure = score;
	},
	getScoreInsure: function(){
		return this.scoreInsure;
	},
	
	//取钱税收，千分比
	setRevenueTake: function(revenueTake){
		this.revenueTake = revenueTake;
	},
	getRevenueTake: function(){
		return this.revenueTake;
	},
	
	//转账税收，千分比
	setRevenueTransfer: function(revenueTransfer){
		this.revenueTransfer = revenueTransfer;
	},
	getRevenueTransfer: function(){
		return this.revenueTransfer;
	},
	
	//游戏金币
	setScoreGame: function(score){
		this.scoreGame = score;
	},
	getScoreGame: function(){
		return this.scoreGame;
	},
	
	//转账最低限制
	setGiveLimit: function(score){
		this.giveLimit = score;
	},
	getGiveLimit: function(){
		return this.giveLimit;
	},
	
	//请求转账记录时的时间
	setQueryRecordTime: function(){
		this.queryRecordTime = new Date();
	},
	getQueryRecordTime: function(){		
		return this.queryRecordTime;
	},
	
	addTransferRecord: function(record){
		var bNoFind = true;
		for(var i=0; i<this.records.length; i++){
			if(record.dwRecordID == this.records[i].dwRecordID){
				this.records[i] = record;
				bNoFind = false;
				break;
			}
		}
		
		if(bNoFind){
			this.records.push(record);
		}
	},
	clearRecords: function(){
		this.records = [];
	},
	getRecords: function(){
		return this.records;
	},
	//记录类型，0赠送，1接收
	getRecordType: function(record){
		var type = 0;
		//接受
		if(g_objHero.getGameId() != record.dwSourceGameID){
			type = 1;
		}
		
		return type;
	},
	//对方昵称
	getRecordOtherNick: function(record){
		var strNick = record.szSourceNickName;
		if(g_objHero.getGameId() == record.dwSourceGameID){
			strNick = record.szTargetNickName;
		}
		
		return strNick;
	},
	//对方ID
	getRecordOtherId: function(record){
		var id = record.dwSourceGameID;
		if(g_objHero.getGameId() == record.dwSourceGameID){
			id = record.dwTargetGameID;
		}

		return id;
	},
	//排序类型
	getSortRecordsByType: function(bDesc){
		var self = this;
		
		this.records.sort(function(a, b){
			var record1 = a;
			var record2 = b;
			if(bDesc){
				record1 = b;
				record2 = a;
			}
			return self.getRecordType(record2) - self.getRecordType(record1);
		});
		
		return this.records;
	},
	//排序对方昵称
	getSortRecordsByNick: function(bDesc){
		var self = this;

		this.records.sort(function(a, b){
			var strNick1 = self.getRecordOtherNick(a);
			var strNick2 = self.getRecordOtherNick(b);
			if(bDesc){
				strNick1 = self.getRecordOtherNick(b);
				strNick2 = self.getRecordOtherNick(a);
			}
			
			return strNick2.localeCompare(strNick1);
		});

		return this.records;
	},
	//排序id
	getSortRecordsById: function(bDesc){
		var self = this;

		this.records.sort(function(a, b){
			var record1 = a;
			var record2 = b;
			if(bDesc){
				record1 = b;
				record2 = a;
			}
			return self.getRecordOtherId(record2) - self.getRecordOtherId(record1);
		});

		return this.records;
	},
	//排序金币
	getSortRecordsByGold: function(bDesc){
		var self = this;

		this.records.sort(function(a, b){
			var record1 = a;
			var record2 = b;
			if(bDesc){
				record1 = b;
				record2 = a;
			}
			return record2.lSwapScore - record1.lSwapScore;
		});

		return this.records;
	},
	//排序
	getSortRecordsByTime: function(bDesc){
		this.records.sort(function(a, b){
			var sub = 0;
			var time1 = a.time;
			var time2 = b.time;
			if(bDesc){
				time1 = b.time;
				time2 = a.time;
			}
			
			sub = time2.wYear - time1.wYear;
			if(sub == 0){
				sub = time2.wMonth - time1.wMonth;
				if(sub == 0){
					sub = time2.wDay - time1.wDay;
					if(sub == 0){
						sub = time2.wHour - time1.wHour;
						if(sub == 0){
							sub = time2.wMinute - time1.wMinute;
							if(sub == 0){
								sub = time2.wSecond - time1.wSecond;
								if(sub == 0){
									sub = time2.wMilliseconds - time1.wMilliseconds;
								}
							}
						}
					}
				}
			}
			
			return sub;
		});

		return this.records;
	},
});