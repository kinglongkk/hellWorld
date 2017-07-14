//邮件数据
var ExAward = cc.Class.extend({

	ctor: function () {
		this.reset();
	},

	reset: function(){
		//是否已经请求列表
		//{"id":"3","PrizeTile":"测试商品3","PrizeValue":"11","PrizeType":"3","PrizeState":"1"}
		//PrizeTile奖品名称；
		//PrizeValue需兑换券；
		//PrizeType奖品类型（卡类1，电子2，实物3，其他4）；
		//PrizeState奖品状态（0：普通商品，1：热门商品，2：打折商品，3：下架）
		this._bRequestList = false;
		
		//兑换奖品列表
		this._exAwardList = [];
		
		
		//是否已经请求记录
		this._bRequestRecord = false;
		//兑换记录列表
		this._exAwardRecords = [];
	},
	
	//是否已经请求列表
	setRequestList: function(bRequest){
		this._bRequestList = bRequest;
	},
	isRequestList: function(){
		return this._bRequestList;
	},

	//兑换奖品列表
	setExAwardList: function(list){
		this._exAwardList = list;
	},
	getExAwardList: function(){
		//排序
		this._exAwardList.sort(function(a, b){
			return a['PrizeSort'] - b['PrizeSort'];
		});
		
		return this._exAwardList;
	},
	getExAwardHot: function(){
		var list = [];
		for(var i=0; i<this._exAwardList.length; i++){
			var info = this._exAwardList[i];
			if(info['PrizeState'] == '1'){
				list.push(info);
			}
		}
		
		list.sort(function(a, b){
			return a['PrizeSort'] - b['PrizeSort'];
		});
		
		return list;
	},
	getExAwardByType: function(type){
		var strType = '' + type;
		var list = [];
		for(var i=0; i<this._exAwardList.length; i++){
			var info = this._exAwardList[i];
			if(info['PrizeType'] == strType){
				list.push(info);
			}
		}
		
		list.sort(function(a, b){
			return a['PrizeSort'] - b['PrizeSort'];
		});

		return list;
	},
	
	//是否已经请求记录
	setRequestRecord: function(bRequest){
		this._bRequestRecord = bRequest;
	},
	isRequestRecord: function(){
		return this._bRequestRecord;
	},
	
	//兑换记录列表
	setExAwardRecords: function(records){
		this._exAwardRecords = records;
	},
	getExAwardRecords: function(){
		return this._exAwardRecords;
	},
});