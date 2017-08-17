var GameLogic = {
//成员数据//////////////////-
		//牌库数目
		FULL_COUNT: 112,
		MAGIC_DATA: 0x35,//53
		MAGIC_INDEX: 32,
		NORMAL_DATA_MAX: 0x29,//41
		NORMAL_INDEX_MAX: 27,

		//显示类型
		SHOW_NULL: 0, //无操作
		SHOW_CHI: 1,//吃
		SHOW_PENG: 2,//碰
		SHOW_MING_GANG: 3,//明杠（碰后再杠）
		SHOW_FANG_GANG: 4,//放杠
		SHOW_AN_GANG: 5,//暗杠

		//动作标志
		WIK_NULL: 0x00,//没有类型//0
		WIK_LEFT: 0x01,//左吃类型//1
		WIK_CENTER: 0x02,//中吃类型//2
		WIK_RIGHT: 0x04,//右吃类型//4
		WIK_PENG: 0x08,//碰牌类型//8
		WIK_GANG: 0x10,//杠牌类型//16
		WIK_LISTEN: 0x20,//听牌类型//32
		WIK_CHI_HU: 0x40,//吃胡类型//64
		WIK_FANG_PAO: 0x80,//放炮//128

		//动作类型
		WIK_GANERAL: 0x00,//普通操作
		WIK_MING_GANG: 0x01,//明杠（碰后再杠）
		WIK_FANG_GANG: 0x02,//放杠
		WIK_AN_GANG: 0x03,//暗杠

		//牌数据
		LocalCardData:[
						0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09,
						0x11, 0x12, 0x13, 0x14, 0x15, 0x16, 0x17, 0x18, 0x19,
						0x21, 0x22, 0x23, 0x24, 0x25, 0x26, 0x27, 0x28, 0x29,
						0x31, 0x32, 0x33, 0x34, 0x35, 0x36, 0x37
		               ],
		TotalCardData:[
						0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09,
						0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09,
						0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09,
						0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09,
						0x11, 0x12, 0x13, 0x14, 0x15, 0x16, 0x17, 0x18, 0x19,
						0x11, 0x12, 0x13, 0x14, 0x15, 0x16, 0x17, 0x18, 0x19,
						0x11, 0x12, 0x13, 0x14, 0x15, 0x16, 0x17, 0x18, 0x19,
						0x11, 0x12, 0x13, 0x14, 0x15, 0x16, 0x17, 0x18, 0x19,
						0x21, 0x22, 0x23, 0x24, 0x25, 0x26, 0x27, 0x28, 0x29,
						0x21, 0x22, 0x23, 0x24, 0x25, 0x26, 0x27, 0x28, 0x29,
						0x21, 0x22, 0x23, 0x24, 0x25, 0x26, 0x27, 0x28, 0x29,
						0x21, 0x22, 0x23, 0x24, 0x25, 0x26, 0x27, 0x28, 0x29,
						0x35, 0x35, 0x35, 0x35
						],
	
//成员函数//////////////////-
	SwitchToCardIndex: function(cardValue){
		var index=0;
		for(i=0; i<GameLogic.LocalCardData.length; ++i){
			if(GameLogic.LocalCardData[i]==cardValue){
				index = i;
				break;
			}
		}
		
		var strError = "The card " + cardValue + " is error!";
		assert(index != 0, "");
		
		return index;
	},
	
	SwitchToCardData: function(index){
		assert(index >= 0 && index <= 33, "The card index is error!")
		return GameLogic.LocalCardData[index];
	},
	
	DataToCardIndex: function(cbCardData){
		//初始化
		var cbCardIndex = [];
		for(i=0; i<34; ++i){
			cbCardIndex[i] = 0;
		}
		//累加
		for(i=0; i<cbCardData.length; ++i){
			var bCardExist = false;
			for(i=0; i<34; ++i){
				if(cbCardData[i] == GameLogic.LocalCardData[j]){
					cbCardIndex[j]++;
					bCardExist = true;
				}
				
			}
			assert(bCardExist, "This card is not exist!")
		}
		return cbCardIndex;
	},
	
	//删除扑克
	RemoveCard: function(cbCardData, cbRemoveCard){
		var cbCardCount = cbCardData.length;
		var cbRemoveCount = cbRemoveCard.length;
		assert(cbRemoveCount <= cbCardCount);

		//置零扑克
		for(i=0; i<cbRemoveCount; ++i){
			for(j=0; j<cbCardCount; ++j){
				if(cbRemoveCard[i] == cbCardData[j]){
					cbCardData[j] = 0;
					break;
				}
			}
		}

		//清理扑克
		var resultData = [];
		var cbCardPos = 1;
		for(i=0; i<cbCardCount; ++j){
			if(cbCardData[i] != 0){
				resultData[cbCardPos] = cbCardData[i];
				cbCardPos = cbCardPos + 1;
			}
		}

		return resultData;
	},
	
	//混乱扑克
	RandCardList: function(cbCardData){
		//混乱准备
		var cbCardCount = cbCardData.length;
		var cbCardTemp = cbCardData.concat();
		
		var cbCardBuffer = [];
		//开始
		var cbRandCount = 0;
		var cbPosition = 0;
		
		//返回n-m的随机整数
		var getRandom = function(n,m){
			return parseInt((Math.random()*(m-n)+n), 10);
		}
		while(cbRandCount < cbCardCount){
			cbPosition = getRandom(1,(cbCardCount - cbRandCount))-1;
			cbCardBuffer[cbRandCount] = cbCardTemp[cbPosition];
			cbCardTemp[cbPosition] = cbCardTemp[cbCardCount - cbRandCount];
			cbRandCount = cbRandCount;
		}
		
		return cbCardBuffer
	},
	
	//排序
	SortCardList: function(cbCardData){
		assert(cbCardData.length > 0);
		
		var cbCardCount = cbCardData.length;
		
		//排序操作
		var bSorted = false;
		var cbLast = cbCardCount - 1;
		while(bSorted==false){
			bSorted = true;
			for(i=0; i<cbLast; ++i){
				if(cbCardData[i] > cbCardData[i + 1]){
					bSorted = false;
					cbCardData[i], cbCardData[i + 1] = cbCardData[i + 1], cbCardData[i];
				}
			}
			cbLast = cbLast - 1;	
		}
	},
	
	//分析打哪一张牌后听哪张牌
	AnalyseListenCard: function(cbCardData){
		var cbCardCount = cbCardData.length;
		
		assert((cbCardCount - 2)%3 == 0);

		var cbListenList = [];
		var cbListenData = {
				cbOutCard:0, 
				cbListenCard:[],
		};
		
		var tempCard = 0;
		var bWin = false;
		for(i=0; i<cbCardCount; ++i){
			//过滤重复牌
			if(tempCard != cbCardData[i]){
				cbListenData.cbOutCard = cbCardData[i];
				cbListenData.cbListenCard = [];
				var cbTempData = cbCardData.concat();
				
				//table.remove(cbTempData, i)
				for(j=0; j<GameLogic.NORMAL_INDEX_MAX; ++j){
					var varCard = GameLogic.LocalCardData[j];
					var insertData = cbTempData.concat();
					
					//table.insert(insertData, GameLogic.LocalCardData[j])
					insertData[i] = varCard;
					GameLogic.SortCardList(insertData);
					
					if(GameLogic.AnalyseChiHuCard(insertData, true)){
						table.insert(cbListenData.cbListenCard, varCard)
						if(cbCardData[i] == GameLogic.LocalCardData[j]){
							bWin = true;//胡牌
							break;
						}
					}
				}
				
				if(cbListenData.cbListenCard.length > 0){
					cbListenList.push(cbListenData);
					//cc.log("听牌");
				}
				if(bWin){
					break;
				}
			}
		}
	},
	
	//分析是否胡牌(带红中)
	AnalyseChiHuCard: function(cbCardData, bNoneThePair){
		var cbCardCount = cbCardData.length;
		//红中统计
		var cbCardIndex = GameLogic.DataToCardIndex(cbCardData);
		var cbMagicCardCount = cbCardIndex[GameLogic.MAGIC_INDEX];
		//成功，全部合格
		if(cbCardCount == 0){
			//cc.log("这个时候已经算胡了！")
			return true
		}
		var cbRemoveData = [0, 0, 0];
		
		//三张相同
		if( cbCardData[0] == cbCardData[1] &&
			cbCardData[0] == cbCardData[2]) {
			//cc.log("三张相同");
			bThree = true;
			cbRemoveData[0] = cbCardData[0];
			cbRemoveData[1] = cbCardData[1];
			cbRemoveData[2] = cbCardData[2];
			var cbTempData = GameLogic.RemoveCard(clone(cbCardData), cbRemoveData);
			//递归
			if(GameLogic.AnalyseChiHuCard(cbTempData, bNoneThePair) ){
				return true
			}
		}
		
		//三张相连
		var index = GameLogic.SwitchToCardIndex(cbCardData[0]);
		if((index%9) + 2 <= 9 &&
			cbCardIndex[index] != 0 &&
			cbCardIndex[index + 1] != 0 ){
			//cc.log("三张相连");
			cbRemoveData[0] = cbCardData[0];
			cbRemoveData[1] = GameLogic.SwitchToCardData(index);
			cbRemoveData[2] = GameLogic.SwitchToCardData(index + 1);
			var cbTempData = GameLogic.RemoveCard(clone(cbCardData), cbRemoveData);
			//递归
			if(GameLogic.AnalyseChiHuCard(cbTempData, bNoneThePair) ){
				return true;
			}
		}
		
		//两张相同组成一对将（不使用红中代替）
		if(cbCardData[0] == cbCardData[1] && bNoneThePair ){
			//cc.log("两张相同组成一对将（不使用红中代替）")
			bNoneThePair = false
			cbRemoveData[0] = cbCardData[0];
			cbRemoveData[1] = cbCardData[1];
			cbRemoveData[2] = 0;
			 cbTempData = GameLogic.RemoveCard(clone(cbCardData), cbRemoveData);
			//递归
			 if(GameLogic.AnalyseChiHuCard(cbTempData, bNoneThePair) ){
				return true
			}
		}
		
		//有红中时使用红中代替
		if( cbMagicCardCount > 0 ){
			//两张相同
			if( cbCardData[0] == cbCardData[1] ){
				//print("两张相同")
				cbRemoveData[0] = cbCardData[0];
				cbRemoveData[1] = cbCardData[1];
				cbRemoveData[2] = GameLogic.MAGIC_DATA;
				var cbTempData = GameLogic.RemoveCard(clone(cbCardData), cbRemoveData);
				//递归
				if( GameLogic.AnalyseChiHuCard(cbTempData, bNoneThePair) ){ 		
					return true;
				}
			}
			//两张相邻
			if( cbCardData[0] + 1 == cbCardData[1] ){
				//print("两张相邻")
				cbRemoveData[0] = cbCardData[0];
				cbRemoveData[1] = cbCardData[1];
				cbRemoveData[2] = GameLogic.MAGIC_DATA;
				var cbTempData = GameLogic.RemoveCard(clone(cbCardData), cbRemoveData);
				//递归
				if( GameLogic.AnalyseChiHuCard(cbTempData, bNoneThePair) ){ 		
					return true;
				}
			}
			//两张相隔
			if( cbCardData[0] + 2 == cbCardData[2] ){
				//print("两张相隔")
				cbRemoveData[0] = cbCardData[0];
				cbRemoveData[1] = cbCardData[1];
				cbRemoveData[2] = GameLogic.MAGIC_DATA;
				var cbTempData = GameLogic.RemoveCard(clone(cbCardData), cbRemoveData);
				//递归
				if( GameLogic.AnalyseChiHuCard(cbTempData, bNoneThePair) ){ 		
					return true;
				}
			}
			//一张组成一对将
			if( bNoneThePair ){
				//print("一张组成一对将")
				bNoneThePair = false
				var cbRemoveData = [];
				cbRemoveData[0] = cbCardData[0];
				cbRemoveData[1] = GameLogic.MAGIC_DATA;
				cbRemoveData[2] = 0;
				var cbTempData = GameLogic.RemoveCard(clone(cbCardData), cbRemoveData);
				//递归
				if( GameLogic.AnalyseChiHuCard(cbTempData, bNoneThePair) ){ 		
					return true
				}
			}
		}

		return false
	},
	
	//胡牌分析(在不考虑红中的情况下)
	AnalyseHuPai: function(cbCardData){
		//校验
		var cbCardCount = cbCardData.length;
		assert((cbCardCount-2)%3==0);
		
		//成功，剩一对酱
		if( cbCardCount == 2 && cbCardData[1] == cbCardData[2] ){
			//print("这个时候已经算胡了")
			return true;
		}
		
		//转换成牌下标
		var cbCardIndex = GameLogic.DataToCardIndex(cbCardData);
		
		//遍历
		for(i=0; i<(cbCardCount-2); ++i){
			//三张相同
			if( cbCardData[i] == cbCardData[i + 1] &&
				cbCardData[i] == cbCardData[i + 2] ){
				//print("三张相同")
				var cbRemoveData = [cbCardData[i], cbCardData[i + 1], cbCardData[i + 2]];
				var cbTempData = GameLogic.RemoveCard(cbCardData.contat(), cbRemoveData);
				if( GameLogic.AnalyseHuPai(cbTempData) ){ 		//递归
					return true;
				}
			}
		
			//三张相连
			var index = GameLogic.SwitchToCardIndex(cbCardData[i])
			if( math.mod(index, 9) + 2 <= 9 &&
				cbCardIndex[index + 1] != 0 &&
				cbCardIndex[index + 2] != 0 ){
				//print("三张相连")
				var data1 = GameLogic.SwitchToCardData(index + 1);
				var data2 = GameLogic.SwitchToCardData(index + 2);
				var cbRemoveData = [cbCardData[i], data1, data2];
				var cbTempData = GameLogic.RemoveCard(clone(cbCardData), cbRemoveData);
				if( GameLogic.AnalyseHuPai(cbTempData) ){ 		//递归
					return true;
				}
			}
			//也不是一对将
			if( cbCardData[i] != cbCardData[i + 1] && cbCardData[i] != cbCardData[i - 1] ){
				//print("这样走不通")
				return false;
			}
		}

		return false;
	},
	
	//临近牌统计
	NearCardGether: function(cbCardData){
		var nearCardData = [];
		for(i=0; i<cbCardData.length;++i){
			assert(cbCardData[i] != GameLogic.MAGIC_DATA)
			for (j = cbCardData[i] - 1; j<cbCardData[i] + 1; ++j ){
				var num = math.mod(j, 16);
				if(num >= 1 && num <= 9 ){
					able.insert(nearCardData, j);
				}
			}
		}

		return GameLogic.RemoveRepetition(nearCardData);
	},
	
	//去除重复元素
	RemoveRepetition: function(cbCardData){
	},
};