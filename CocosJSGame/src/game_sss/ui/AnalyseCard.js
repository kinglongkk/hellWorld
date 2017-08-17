var s_AnalyseCard = null;

var SceneAnalyseCard = cc.Class.extend({
	ctor: function () {
		this.tagAnalyseData = {
			bOneCount:0,							//单张数目
			bTwoCount:0,							//两张数目 
			bThreeCount:0,							//三张数目
			bFourCount:0,							//四张数目
			bFiveCount:0,							//五张数目
			bOneFirst:[],							//单牌位置
			bTwoFirst:[],							//对牌位置
			bThreeFirst:[],							//三条位置
			bFourFirst:[],							//四张位置
			bFiveFirst:[],							//五张位置
			bStraight:false,						//是否顺子
			
		};
		
	},
	
	reset: function(){
		this.tagAnalyseData = {
			bOneCount:0,							//单张数目
			bTwoCount:0,								//两张数目 
			bThreeCount:0,							//三张数目
			bFourCount:0,							//四张数目
			bFiveCount:0,							//五张数目
			bOneFirst:[],							//单牌位置
			bTwoFirst:[],							//对牌位置
			bThreeFirst:[],							//三条位置
			bFourFirst:[],							//四张位置
			bFiveFirst:[],							//五张位置
			bStraight:false,						//是否顺子
		};
	},

	init:function(layer){

	},
	
	RemoveCard:function(bRemoveCard,bRemoveCount,bCardData,bCardCount){
		if(bRemoveCount>bCardCount){
			return false;
		}
		if(bCardCount>13){
			return false;
		}
		var bDeleteCount=0,bTempCardData = [];
		
		bTempCardData = bCardData;
		
		//置零扑克
		for (var i=0;i<bRemoveCount;i++)
		{
			for (var j=0;j<bCardCount;j++)
			{
				if (bRemoveCard[i]==bTempCardData[j])
				{
					bDeleteCount++;
					bTempCardData[j]=0;
					break;
				}
			}
		}
		
		if (bDeleteCount!=bRemoveCount) return false;
		
		//清理扑克
		var bCardPos=0;
		for (var i=0;i<bCardCount;i++)
		{
			if (bTempCardData[i]!=0) bCardData[bCardPos++]=bTempCardData[i];
		}

		return bCardData;
		
	},
	
	AnalyseCard:function(bCardDataList,bCardCount){
		cc.log("bCardDataList = " + JSON.stringify(bCardDataList));	
		var bCardData = bCardDataList;
		
		var bSameCount = 1,
		bCardValueTemp=0,
		bSameColorCount = 1 ,
		bFirstCardIndex = 0 ;	//记录下标
		
		var bLogicValue = bCardData[0]%16;
		var bCardColor = parseInt(bCardData[0]/16);
		
		this.reset();
		
		for(var i =1;i<bCardCount;i++){
			bCardValueTemp = bCardData[i]%16;
			if (bCardValueTemp==bLogicValue) {
				bSameCount++;
			}
			//保存结果
			if ((bCardValueTemp!=bLogicValue)||(i==(bCardCount-1)))
			{
				switch (bSameCount)
				{
				case 1:		//一张
					break; 
				case 2:		//两张
				{
					this.tagAnalyseData.bTwoFirst[this.tagAnalyseData.bTwoCount]	 = bFirstCardIndex ;
					this.tagAnalyseData.bTwoCount++ ;
					break;
				}
				case 3:		//三张
				{
					this.tagAnalyseData.bThreeFirst[this.tagAnalyseData.bThreeCount] = bFirstCardIndex ;
					this.tagAnalyseData.bThreeCount++ ;
					break;
				}
				case 4:		//四张
				{
					this.tagAnalyseData.bFourFirst[this.tagAnalyseData.bFourCount]   = bFirstCardIndex ;
					this.tagAnalyseData.bFourCount++ ;
					break;
				}
				case 5:		//五张
				{
					this.tagAnalyseData.bFiveFirst[this.tagAnalyseData.bFiveCount]   = bFirstCardIndex ;
					this.tagAnalyseData.bFiveCount++ ;
					break;
				}
				default:
					var str ;
				//str.Format("AnalyseCard：错误扑克！: %d" , bSameCount) ;
				// #ifdef _DEBUG
				// 				AfxMessageBox(str) ;
				// #endif				
				break;
				}
			}
			
			//设置变量
			if (bCardValueTemp!=bLogicValue)
			{
				if(bSameCount==1)
				{
					if(i!=bCardCount-1)
					{
						this.tagAnalyseData.bOneFirst[this.tagAnalyseData.bOneCount]	= bFirstCardIndex ;
						this.tagAnalyseData.bOneCount++ ;
					}
					else
					{
						this.tagAnalyseData.bOneFirst[this.tagAnalyseData.bOneCount]	= bFirstCardIndex ;
						this.tagAnalyseData.bOneCount++ ;
						this.tagAnalyseData.bOneFirst[this.tagAnalyseData.bOneCount]	= i ;
						this.tagAnalyseData.bOneCount++ ;				
					}
				}
				else
				{
					if(i==bCardCount-1)
					{
						this.tagAnalyseData.bOneFirst[this.tagAnalyseData.bOneCount]	= i ;
						this.tagAnalyseData.bOneCount++ ;
					}
				}
				bSameCount=1;
				bLogicValue=bCardValueTemp;
				bFirstCardIndex = i ;

			}
			if(parseInt(bCardData[i]/16)!=bCardColor){
				bSameColorCount = 1 ;
			} 
			else{
				++bSameColorCount ;
			}									  		
		}
		this.tagAnalyseData.bStraight = (bCardCount==bSameColorCount) ? true : false ;
		
		return this.tagAnalyseData;
	}


});


SceneAnalyseCard.getInstance = function(){
	if(!s_AnalyseCard){
		s_AnalyseCard = new SceneAnalyseCard();
	}
	return s_AnalyseCard;
};
