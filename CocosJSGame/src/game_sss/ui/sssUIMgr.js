var s_sharedSssUIMgr = null;

var SssUIMgr = GameUIMgr.extend({
	resetData: function () {
		this._bDealGameScene = false;
		this._endPhase = false;
	},

	startGame: function () {

		cc.log("#### SssUIMgr startGame ");
// SoundMgr.getInstance().playMusic("sss_bg",0,true);
		this.resetData();	
		// 设置游戏人数
		this.setPlayerCount(CMD_SSS.GAME_PLAYER);

		var startScene = UIMgr.getInstance().openDlg(ID_DlgCNGameStart);
		var game = ClientData.getInstance().getGame();
		
		var roomNum = g_objHero.getRoomID();
		cc.log("sssUiMgr.roomNum="+roomNum);
		startScene.onSetRoomNum(roomNum);
		startScene.onSetBasePoint(game.getCellScore());
		startScene.onSetGameNum(game.getPlayCount(),game.getDrawCountLimit());
		
// startScene.onSetGameNum(gamePlayed,gameNum);
// UIMgr.getInstance().openDlg(ID_NnTbDlgSystem);
		
		UIMgr.getInstance().openDlg(ID_DlgChatScene);
		
		UIMgr.getInstance().openDlg(ID_DlgCNPokePlayer);
		
		var game = ClientData.getInstance().getGame();
		cc.log("1sssUiMgr="+g_outcome.playerDatas[0].gNumPoint.length);
		cc.log("2sssUiMgr="+game.getDrawCountLimit());
		cc.log("3sssUiMgr="+game.getPlayCount());

		if(g_outcome.playerDatas[0].gNumPoint.length>=game.getDrawCountLimit()){
			SssUIMgr.getInstance().onUnscheduleAllSelectors();
			var dlg = UIMgr.getInstance().openDlg(ID_DlgResult);
			dlg.onIsMaster(g_objHero.getUserId() == game.getTableOwnerUserID());
			g_outcome.reset();
			cc.log("g_outcome = " + JSON.stringify(g_outcome));
			nSssGameModel.reset();
			nSssGameModel.gameComping = false;
		}
		else{
			this.onUpdateAllPlayerInfo(CMD_SSS.SSS_UIMGR);

			if(!this._bDealGameScene){
				cc.log("sssUiMgr.on game scene");
				this.onGameScene();
			}
		}
// SoundMgr.getInstance().playMusic("_bg", 0, true);
	},

	// //////////////////////////////////实现父类中包含的函数/////////////////////////////////////////////
	
	// 比牌
	
	onCompareResult:function(bCardData,cbCompareResult,lGameScore){
		if(bCardData==null || cbCompareResult==null){
			return false;
		}
		// 玩家分数背景可见
		var dlgPlayer = UIMgr.getInstance().getDlg(ID_DlgCNPokePlayer);
		dlgPlayer.WaterBg[0].setVisible(true);
		
		var cardCompareResult=[cbCompareResult[0][0],cbCompareResult[1][0],cbCompareResult[2][0],cbCompareResult[3][0]];
		var card=[];
		var cardData=[];
		var nSpecialnum = 0;
		for(var num = 0;num<4;num++){
			card = [bCardData[num][0],bCardData[num][1],bCardData[num][2]];
			cardData[num]=card;
			if(nSssGameModel.playerDatas[num].nSpecial == true){
				nSpecialnum++;
			}
		}
		// 第一道比较
		if(nSpecialnum<4){
			var nSpecialone = nSpecialnum;
			this.calcul0 = function(thisobj,cardData,cardCompareResult,nSpecialone){
				return function(){
					cc.log("第一道开始比");
					thisobj.onCompareFirstResult(cardData,cardCompareResult,nSpecialone);				
				}
			};

			setTimeout(this.calcul0(this,cardData,cardCompareResult,nSpecialone), 500);
			// 延时几秒

			cardCompareResult=[];
			card=[];
			var cardData=[];

			cardCompareResult = [cbCompareResult[0][1],cbCompareResult[1][1],cbCompareResult[2][1],cbCompareResult[3][1]];
			for(var num = 0;num<4;num++){
				card = [bCardData[num][3],bCardData[num][4],bCardData[num][5],bCardData[num][6],bCardData[num][7]];
				cardData[num]=card;
			}

			// 第二道比较
			var nSpecialtwo = nSpecialnum;
			this.calcul1 = function(thisobj,cardData,cardCompareResult,nSpecialtwo){
				return function(){
					cc.log("第二道开始比");
					dlgPlayer = UIMgr.getInstance().getDlg(ID_DlgCNPokePlayer);
					dlgPlayer.removeCardShow();
					thisobj.onCompareSecondResult(cardData,cardCompareResult,nSpecialtwo);
				}
			};
			var tesTime = 2000+1000*(4-nSpecialnum);
			cc.log("延迟="+tesTime+"开始第二道开始比");
			setTimeout(this.calcul1(this,cardData,cardCompareResult,nSpecialtwo), 1000+1000*(4-nSpecialnum));

			cardCompareResult=[];
			card=[];
			var cardData=[];

			cardCompareResult = [cbCompareResult[0][2],cbCompareResult[1][2],cbCompareResult[2][2],cbCompareResult[3][2]];
			for(var num = 0;num<4;num++){
				card = [bCardData[num][8],bCardData[num][9],bCardData[num][10],bCardData[num][11],bCardData[num][12]];
				cardData[num]=card;
			}

			var nSpecialthree = nSpecialnum;
			this.calcul2 = function(thisobj,cardData,cardCompareResult,nSpecialthree){
				return function(){
					cc.log("第三道开始比");
					dlgPlayer = UIMgr.getInstance().getDlg(ID_DlgCNPokePlayer);
					dlgPlayer.removeCardShow();
					thisobj.onCompareThirdResult(cardData,cardCompareResult,nSpecialthree);
				}
			};
			tesTime = 2000+2000*(4-nSpecialnum);
			cc.log("延迟="+tesTime+"开始第三道开始比");
			setTimeout(this.calcul2(this,cardData,cardCompareResult,nSpecialthree), 2000+2000*(4-nSpecialnum));
		}
		
		// 判断是否为特殊牌
		var timeSpec = 0;
		
		for(var pos=0;pos<4;pos++){
			if(nSssGameModel.playerDatas[pos].nSpecial == true){
				timeSpec++;				
			}	
		}
		var time = 0;
		if(timeSpec>3){
			time = 500;
		}
		else{
			time = 3000+3000*(4-timeSpec)
		}
		if(timeSpec>0){
			this.calculter = function(thisobj){
				return function(){
					cc.log("显示特殊");
					thisobj.onCompareSpecialResult();
				}
			};
			cc.log("延迟="+time+"开始显示特殊牌");
			setTimeout(this.calculter(this), time);
			
		}
		
		// 打枪效果

		if(time == 500){
			time = 4500;
		}
		else{
			time = time+timeSpec*1000;
		}
		this.timeGan = 0;
		this.calcumg = function(thisObj,nGan,pos){
			return function(){
				cc.log("打枪时间到了");
				var table = ClientData.getInstance().getTable();
				var nGan = [];
				var ganPlayer = UIMgr.getInstance().getDlg(ID_DlgCNPokePlayer);
				var nQuan = 0;
				var nQuanArr = [];
				for(var pos = 0;pos<4;pos++){
					ganPlayer.removeCardShow();
					var nGan = [];
					var nGaNum = 0;
					for(var num = 0;num<4;num++){
						if(num!=pos){
							if(nSssGameModel.playerDatas[pos].nSpecial == false){
								if((cbCompareResult[pos][0]>cbCompareResult[num][0]) &&(cbCompareResult[pos][1]>cbCompareResult[num][1]) &&
										(cbCompareResult[pos][2]>cbCompareResult[num][2])&&(nSssGameModel.playerDatas[num].nSpecial == false)){
									nGan[nGaNum] = num;
									nGaNum++;
								}
							}				
						}
					}
					if(nGaNum>0){
						if(nGaNum >= 3){
							nQuan = pos;
							nQuanArr = nGan;
							cc.log("时间到了谁全垒打="+nQuan+"打谁="+JSON.stringify(nQuanArr));
						}
						else{
							var calcug = function(thisObj,nGan,pos){
								return function(){
									SoundMgr.getInstance().playEffect("sss_daqiang1", 0, false);
									cc.log("时间到了谁打枪="+pos+"谁被打="+JSON.stringify(nGan));
									if(nSssGameModel.playerDatas[pos].nSpecial == false){
										ganPlayer.ShowShootAni(pos,nGan);
									}				
								}
							}
							setTimeout(calcug(this,nGan,pos), (thisObj.timeGan)*1500);	
							(thisObj.timeGan)++;
						}				
					}
					
					if(pos==3){
						if(nQuanArr[2]){
							var calcug1 = function(thisObj,nQuanArr,nQuan){
								return function(){
									SoundMgr.getInstance().playEffect("sss_special1", 0, false);
									cc.log("时间到了谁全垒打="+nQuan+"打谁="+JSON.stringify(nQuanArr));
									if(nSssGameModel.playerDatas[nQuan].nSpecial == false){
										ganPlayer.ShowShootAni(nQuan,nQuanArr);
									}				
								}
							}
							setTimeout(calcug1(this,nQuanArr,nQuan), (thisObj.timeGan)*1500);
							(thisObj.timeGan)++;
						}
					}
				}			
			}
		}
		cc.log("延迟="+time+"开始显打枪");
		setTimeout(this.calcumg(this,cbCompareResult), time);	
		
		var nGaNum = 0;
		for(var pos = 0;pos<4;pos++){
			for(var num = 0;num<4;num++){
				if(num!=pos){
					if(nSssGameModel.playerDatas[pos].nSpecial == false){
						if((cbCompareResult[pos][0]>cbCompareResult[num][0]) &&(cbCompareResult[pos][1]>cbCompareResult[num][1]) &&
								(cbCompareResult[pos][2]>cbCompareResult[num][2])&&(nSssGameModel.playerDatas[num].nSpecial == false)){
							nGaNum++;
							break;
						}
					}				
				}
			}
		}
		
		if(time != 4500){
			time = time+nGaNum*1500+1500;
		}
		else{
			time = 6000;
		}
		
		// 跳出结束页 重置数据
		this.calcu = function(thisobj,lGameScore){
			return function(){
				cc.log("=======时间到了=======");
				// thisobj.onOutComeShow(lGameScore);
                // 准备按钮可见
                var dlgBegin = UIMgr.getInstance().getDlg(ID_DlgCNPokeBegin);
                if(dlgBegin == null){
                	dlgBegin = UIMgr.getInstance().openDlg(ID_DlgCNPokeBegin);
                }
                dlgBegin.setReadyButPos(1);
                dlgBegin.onSetInvfriendbtn(false);
                	
                cc.log("sss数据重置");
				var gameFlag = nSssGameModel.gameFlag;
				var game = ClientData.getInstance().getGame();
				var gameNum = game.getPlayCount();
				var gameLimit = game.getDrawCountLimit();
				cc.log("sss数据重置gameFlag = "+gameFlag+"sss数据重置gameFlag =");
				
				nSssGameModel.reset();				
				dlgPlayer = UIMgr.getInstance().getDlg(ID_DlgCNPokePlayer);
				dlgPlayer.setEndShow(lGameScore);
				dlgPlayer.HidePlayerCardBg();
				// nSssGameModel.gameComping = false;
				if(gameFlag == true || gameNum>=gameLimit){
					cc.log("game.getCurentCount() = "+game.getPlayCount());
					if(game && !(game.getPlayCount() == 0 || game.getPlayCount() == null)||(game.getPlayCount()>=game.getDrawCountLimit())||
							((g_outcome.playerDatas[0].gNumPoint)&&(g_outcome.playerDatas[0].gNumPoint.length>=game.getDrawCountLimit()))){
						var dlgoutcome = UIMgr.getInstance().getDlg(ID_DlgCNpokeoutcome);
						dlgoutcome.onSetBtnVisible();
						var calcule = function(thisobj){
							return function(){
								UIMgr.getInstance().closeDlg(ID_DlgCNpokeoutcome);
								thisobj.onUpdateAllPlayerInfo();
								var dlg = UIMgr.getInstance().openDlg(ID_DlgResult);
								dlg.onIsMaster(g_objHero.getUserId() == game.getTableOwnerUserID());
								g_outcome.reset();
								nSssGameModel.reset();
								nSssGameModel.gameComping = false;
							}
						};
						setTimeout(calcule(thisobj), 3000);

					}
					else{
						GameKindMgr.getInstance().backPlazaScene();
					}
				}
			}
		};
		cc.log("延迟="+time+"开始显结束页");
		setTimeout(this.calcu(this,lGameScore), time);
						
	},
	
	onBubbleSort : function(arry,len){ // 排序

		var arrLen = arry.length;
		var testArr = [0,1,2,3]
		var Inum,Jnum;
		for(Inum = 0 ; Inum<len ; Inum++){
			for(Jnum = 0 ;Jnum<len-1 ; Jnum++){
				if(arry[Jnum] > arry[Jnum+1]%16){
					arry[Jnum] = arry[Jnum] + arry[Jnum+1];
					arry[Jnum+1] = arry[Jnum] - arry[Jnum+1];
					arry[Jnum] = arry[Jnum] - arry[Jnum+1];
					testArr[Jnum] = testArr[Jnum] + testArr[Jnum+1];
					testArr[Jnum+1] = testArr[Jnum] - testArr[Jnum+1];
					testArr[Jnum] = testArr[Jnum] - testArr[Jnum+1];
				}
			}
		}
		cc.log("第一道比较结果排序arry" + JSON.stringify(arry));
		return testArr;
	},
	
	onCompareFirstResult:function(cardata,Result,nSpenialone){
		cc.log("第一道比较牌数据" + JSON.stringify(cardata));
		cc.log("第一道比较结果数据" + JSON.stringify(Result));
		var dlgPlayer = UIMgr.getInstance().getDlg(ID_DlgCNPokePlayer);
		var chairID = 0;
		var table = ClientData.getInstance().getTable();
		var player = null;
		var isMe = false;
		var temp = nSpenialone;
		var testResult = []; 
		testResult[0] = Result[0];
		testResult[1] = Result[1];
		testResult[2] = Result[2];
		testResult[3] = Result[3];
		var posArr = this.onBubbleSort(testResult,4);
		cc.log("第一道比较结果排序" + JSON.stringify(posArr));
		
		for(var pos = 0;pos<4;pos++){
			chairID = this.getChairIdByPlayerPos(posArr[pos]);
			player = table.getPlayerByChairID(chairID);
			if(player == null){
				player=nSssGameModel.playerDatas[posArr[pos]].nPlayer;
			}
			if(player.getUserId() == g_objHero.getUserId()){
				isMe = true;
			}
			else{
				isMe = false;
			}
			cc.log("第一道比较结果数据isMe=" + isMe);
			
			if(nSssGameModel.playerDatas[posArr[pos]].nSpecial == false){
				
				var calcu5 = function(thisObj,cardata,Result,pos,isMe){
					return function(){
						cc.log("时间到了"+pos);
						dlgPlayer.setCardShowFirst(pos,cardata,Result,isMe);
					}
				}
				setTimeout(calcu5(this,cardata,Result,posArr[pos],isMe), 1000*(nSpenialone-temp));
				temp--;
			}			
		}
		
	},
	onCompareSecondResult:function(cardata,Result,nSpecialtwo){
		cc.log("第二道比较牌数据" + JSON.stringify(cardata));
		cc.log("第二道比较结果数据" + JSON.stringify(Result));
		var dlgPlayer = UIMgr.getInstance().getDlg(ID_DlgCNPokePlayer);
		var chairID = 0;
		var table = ClientData.getInstance().getTable();
		var player = null;
		var isMe = false;
		var temp = nSpecialtwo;
		
		var testResult = []; 
		testResult[0] = Result[0];
		testResult[1] = Result[1];
		testResult[2] = Result[2];
		testResult[3] = Result[3];
		var posArr = this.onBubbleSort(testResult,4);
		cc.log("第二道比较结果排序" + JSON.stringify(posArr));
		
		for(var pos = 0;pos<4;pos++){
			chairID = this.getChairIdByPlayerPos(posArr[pos]);
			player = table.getPlayerByChairID(chairID);
			if(player == null){
				player=nSssGameModel.playerDatas[posArr[pos]].nPlayer;
			}
			if(player.getUserId() == g_objHero.getUserId()){
				isMe = true;
			}
			else{
				isMe = false;
			}
			cc.log("第二道比较结果数据isMe=" + isMe);
// dlgPlayer.setCardShowSecond(pos,cardata,Result,isMe);
			if(nSssGameModel.playerDatas[posArr[pos]].nSpecial == false){
				var calcu6 = function(thisObj,cardata,Result,pos,isMe){
					return function(){
						cc.log("时间到了"+pos);
						dlgPlayer.setCardShowSecond(pos,cardata,Result,isMe);			
					}
				}
				setTimeout(calcu6(this,cardata,Result,posArr[pos],isMe), (nSpecialtwo-temp)*1000);	
				temp--;
			}	
		}
	},
	onCompareThirdResult:function(cardata,Result,nSpecialthree){
		cc.log("第三道比较牌数据" + JSON.stringify(cardata));
		cc.log("第三道比较结果数据" + JSON.stringify(Result));
		var dlgPlayer = UIMgr.getInstance().getDlg(ID_DlgCNPokePlayer);
		var chairID = 0;
		var table = ClientData.getInstance().getTable();
		var player = null;
		var isMe = false;
		var temp = nSpecialthree;
		
		var testResult = []; 
		testResult[0] = Result[0];
		testResult[1] = Result[1];
		testResult[2] = Result[2];
		testResult[3] = Result[3];
		var posArr = this.onBubbleSort(testResult,4);
		cc.log("第三道比较结果排序" + JSON.stringify(posArr));
		
		for(var pos = 0;pos<4;pos++){
			chairID = this.getChairIdByPlayerPos(posArr[pos]);
			player = table.getPlayerByChairID(chairID);
			if(player == null){
				player=nSssGameModel.playerDatas[posArr[pos]].nPlayer;
			}
			if(player.getUserId() == g_objHero.getUserId()){
				isMe = true;
			}
			else{
				isMe = false;
			}
			cc.log("第三道比较结果数据isMe=" + isMe);
// dlgPlayer.setCardShowThird(pos,cardata,Result,isMe);
			
			if(nSssGameModel.playerDatas[posArr[pos]].nSpecial == false){
				var calcu7 = function(thisObj,cardata,Result,pos,isMe){
					return function(){
						cc.log("时间到了"+pos);
						if(nSssGameModel.playerDatas[pos].nSpecial == false){
							dlgPlayer.setCardShowThird(pos,cardata,Result,isMe);
						}
					}
				}
				setTimeout(calcu7(this,cardata,Result,posArr[pos],isMe), (nSpecialthree-temp)*1000);
				temp--;
			}	
		}
	},
	
	onCompareSpecialResult:function(){
		var nTempnum = 0;
		for(var pos=0;pos<4;pos++){
			if(nSssGameModel.playerDatas[pos].nSpecial == true){
				var table = ClientData.getInstance().getTable();
				chairID = this.getChairIdByPlayerPos(pos);
				player = table.getPlayerByChairID(chairID);
				if(player == null){
					player=nSssGameModel.playerDatas[pos].nPlayer;
				}
				if(player.getUserId() == g_objHero.getUserId()){
					isMe = true;
				}
				else{
					isMe = false;
				}
				
				var nSpecCardData=nSssGameModel.playerDatas[pos].cardone;
				nSpecCardData=nSpecCardData.concat(nSssGameModel.playerDatas[pos].cardtwo);
				nSpecCardData=nSpecCardData.concat(nSssGameModel.playerDatas[pos].cardthree);

				var dlgPlayer = UIMgr.getInstance().getDlg(ID_DlgCNPokePlayer);
				var calcu8 = function(thisObj,pos,nSpecCardData,isMe){
					return function(){
						cc.log("特殊时间到了0"+pos+"特殊牌组="+JSON.stringify(nSpecCardData));
						dlgPlayer.setCardShowSpecial(pos,nSpecCardData,isMe);
					}
				}
				setTimeout(calcu8(this,pos,nSpecCardData,isMe), nTempnum*1000);
				nTempnum++;

			}	
		}
	},

	// 更新所有玩家
	onUpdateAllPlayerInfo: function(nSource){
					
		cc.log("sss更新玩家信息"+JSON.stringify(nSssGameModel.playerDatas)+"nSource="+nSource);
		
		if(nSssGameModel.gameComping == false || nSource!=null){
			if(nSssGameModel.gameComping == false){

				cc.log("sss更新玩家信息");
				var sssPlayer = UIMgr.getInstance().getDlg(ID_DlgCNPokePlayer);
				if(sssPlayer){
					sssPlayer.setPlayerBoxStatus(true);
					if(sssPlayer.Text_Result){
						sssPlayer.Text_Result.setString("");
					}
					
				}
// var startScene = UIMgr.getInstance().openDlg(ID_DlgCNGameStart);
				var startScene = UIMgr.getInstance().getDlg(ID_DlgCNGameStart);
				var game = ClientData.getInstance().getGame();

				if(startScene){
					startScene.onSetBasePoint(game.getCellScore());
					startScene.onSetGameNum(game.getPlayCount(),game.getDrawCountLimit());
				}

				if(!this._bInit){
					return;
				}

				if(this._endPhase){
					// return;
				}

				var table = ClientData.getInstance().getTable();
				var room = ClientData.getInstance().getRoom();
				if(!table){
					return;
				}

				var game = ClientData.getInstance().getGame();
				if(!game){
					return;
				}
				cc.log("g_objHero.getStatus = " + g_objHero.getStatus());
				if(g_objHero.getStatus()==US_PLAYING){

					var dlgStart = UIMgr.getInstance().getDlg(ID_DlgCNGameStart);
					if(dlgStart){
						var status = dlgStart.onGetImageclockStatus();
						cc.log("status = " + status);
						if(status == false){					
							dlgStart.onSetImageclockStatus(true);
							dlgStart.dissolutionTime=40;
							dlgStart.onStartCountDownTime();
						}
					}
				}
				else{
					var dlgStart = UIMgr.getInstance().getDlg(ID_DlgCNGameStart);
					var status = dlgStart.onGetImageclockStatus();
					if(status == true){
						dlgStart.dissolutionTime=0;
						dlgStart.updateCountDownTime;
						dlgStart.onSetImageclockStatus(false);
					}

				}
// UIMgr.getInstance().closeDlg(ID_DlgCNPokeBegin);
				var pos;
				for(pos=0; pos<CMD_SSS.GAME_PLAYER; pos++){
					var chairId = this.getChairIdByPlayerPos(pos);
					var bPlay = game.isPlayByChairId(chairId);
					if(this._endPhase && bPlay){
						continue;
					}		
					var player = table.getPlayerByChairID(chairId);
					var userID = 0;
					var ready = 0;
					var isMe = false;
					
					if(player){						
						nSssGameModel.playerDatas[pos].nPlayer = player;
						var userID = player.getUserId();
						ready= player.getStatus();
					}
					if(userID == g_objHero.getUserId()){
						isMe = true;
					}
					cc.log("ready = " + ready);			
					var dlgPlayer = UIMgr.getInstance().getDlg(ID_DlgCNPokePlayer);
// if(dlgPlayer == null){
// dlgPlayer = UIMgr.getInstance().openDlg(ID_DlgCNPokePlayer);
// }
					if(dlgPlayer){
						dlgPlayer.updatePlayerInfo(pos, player);
						dlgPlayer.setPlayerReadystatus(pos,false);
						if(ready == US_READY){
							dlgPlayer.setPlayerReadystatus(pos,true);
							cc.log("US_READY isMe= " + isMe);
							if(isMe == true){
								UIMgr.getInstance().closeDlg(ID_DlgCNPokeBegin);						
							}			
						}
						else if(ready == US_SIT){					
							cc.log("US_SITisMe= " + isMe);
							if(isMe == true){
								// var dlgOutcome =
								// UIMgr.getInstance().getDlg(ID_DlgCNpokeoutcome);
								if(/* dlgOutcome == null && */(nSssGameModel.gameComping==false)){
									var dlgBegin = UIMgr.getInstance().getDlg(ID_DlgCNPokeBegin);
									cc.log("dlgBegin= " + dlgBegin);

									if(dlgBegin == null){
										dlgBegin = UIMgr.getInstance().openDlg(ID_DlgCNPokeBegin);									
									}
									
									if(room.getPlayers().length>3){
										dlgBegin.onSetInvfriendbtn(false);
									}
									else{
										dlgBegin.onSetInvfriendbtn(true);
									}
									
								}	
							}else{
							
								dlgPlayer.HidePlayerCardBg(pos);
							}	
						}
						else if(ready == US_PLAYING){
							dlgPlayer.setPlayerReadystatus(pos,false);
							var gamePlayer = UIMgr.getInstance().getDlg(ID_DlgCNPokePlayer);
							var usrInfo = UIMgr.getInstance().getDlg(ID_DlgPlazaUserInfo);
							dlgPlayer.removeCardShow();

							if(isMe == false){

								if(nSssGameModel.playerDatas[pos].bPlay == true){							
									if(gamePlayer){							
										cc.log("不是我pos==" + pos);							
// gamePlayer.setCardonoutBox(pos);
										gamePlayer.HidePlayerCardBg(pos);
										gamePlayer.ShowPlayerCardOverBg(pos);
									}
								}
								else{
									if(gamePlayer){
										cc.log("===其他玩家背景手牌显示");
										gamePlayer.showPlayerCardBg(pos);
									}
								}
							}
							else {
                                var dlgInfo = UIMgr.getInstance().getDlg(ID_DlgPlazaUserInfo);
                                var dlgRule = UIMgr.getInstance().getDlg(ID_DlgGameRule);
                                var dlgSet = UIMgr.getInstance().getDlg(ID_DlgPlazaSet);

                                if (dlgInfo) {
                                    UIMgr.getInstance().closeDlg(ID_DlgPlazaUserInfo);
                                }
                                if (dlgRule) {
                                    UIMgr.getInstance().closeDlg(ID_DlgGameRule);
                                }
                                if (dlgSet) {
                                    UIMgr.getInstance().closeDlg(ID_DlgPlazaSet);
                                }
                                cc.log("20170522nSssGameModel.playerDatas[pos].bPlay  = " + nSssGameModel.playerDatas[pos].bPlay);
                                cc.log("pos = " + pos);
                                if (nSssGameModel.playerDatas[pos].bPlay == true) {
                                    if (gamePlayer) {

                                        var poke = nSssGameModel.playerDatas[pos].cardone.concat(nSssGameModel.playerDatas[pos].cardtwo);
                                        poke = poke.concat(nSssGameModel.playerDatas[pos].cardthree);

                                        for (var num = 0; num < 13; num++) {
                                            cc.log("poke[" + num + "]" + poke[num]);
                                        }
                                        // gamePlayer.setHandCardOnPanelcardbox(poke,pos);
                                        gamePlayer.ShowPlayerCardOverBg(pos);
                                    }
                                }
                                else {
                                    cc.log("玩家手牌显示");
                                    if (gamePlayer) {
                                        cc.log("gamePlayer = " + gamePlayer);
                                        var gameCard = UIMgr.getInstance().getDlg(ID_DlgCNCardSetPlanB);
                                        // 创建自己手牌
                                        gamePlayer.CreateMyTableCards(nSssGameModel.playerDatas[pos].card, 13);

                                        var callSetPlanB = function () {
                                            return function () {
												gameCard = UIMgr.getInstance().openDlg(ID_DlgCNCardSetPlanB);
												gameCard.dissolutionTime = 40;
												gameCard.onStartCountDownTime();
												cc.log("组合牌的牌数据： = " + JSON.stringify(nSssGameModel.playerDatas[0].card));
                                                gameCard.pokecard = gameCard.onBubbleSort(nSssGameModel.playerDatas[0].card, 13);
												gameCard.onSetcardOnMid(gameCard.pokecard, 13);
												gameCard.onIsPair(gameCard.pokecard);
												// 移除玩家自己的发牌
												cc.log("移除自己的发牌");
												gamePlayer.RemoveMyTabelCards();
                                            }
                                        }
										// 加载比牌相关数据
										cc.log("显示桌面牌： = " + JSON.stringify(nSssGameModel.playerDatas[pos].card));
										if (gameCard == null && nSssGameModel.gameComping == false) {
											if (nSssGameModel.playerDatas[pos].card[0]) {
												setTimeout(callSetPlanB(),800);
											}
										}
										else {
											cc.log("没有操作不知道什么状态。");
										}
                                    }
                                    else if (ready == CMD_SSS.GS_TK_CARDSHOW) {
                                        dlgPlayer.setPlayerReadystatus(pos, false);
                                        if (isMe == false) {
                                            var gamePlayer = UIMgr.getInstance().getDlg(ID_DlgCNPokePlayer);
                                            if (gamePlayer) {
// nSssGameModel.playerDatas[];
                                            }
                                        }
                                    }
                                }
                            }
						}
						else{
							dlgPlayer.setPlayerReadystatus(pos,false);
						}

					}
				}
// var nChairID = g_objHero.getChairID();
// var dlgBegin = UIMgr.getInstance().getDlg(ID_DlgCNPokeBegin);
// if(dlgBegin){
// if(nChairID == 0){
// dlgBegin.onSetbuttonstatus(true);
// }
// else{
// dlgBegin.onSetbuttonstatus(false);
// }
// }

			}
			else{	
				var game = ClientData.getInstance().getGame();
				if(g_outcome.playerDatas[0].gNumPoint.length<game.getDrawCountLimit()){
					this.onOutComeShow();

				}		
			}
		}

	},
	// 改变玩家状态
	onChangePlayerStatus:function(status){
		
		var table = ClientData.getInstance().getTable();
		if(table){
			for(var pos = 0;pos<4;pos++){
				var chairID = this.getChairIdByPlayerPos(pos);
				player = table.getPlayerByChairID(chairID);
				if(player == null){
					player=nSssGameModel.playerDatas[pos].nPlayer;
				}
				if(player){
					if(player.getUserId() == g_objHero.getUserId()){
						player.setStatus(status);
					}
					else{
						var nStatus = player.getStatus();
						if(nStatus>3){
							player.setStatus(2);
						}
					}
				}
				
			}
		}
		
	},
	
	onUnscheduleAllSelectors:function(){
		clearInterval(this.calcul0); 
		clearInterval(this.calcul1); 
		clearInterval(this.calcul2); 
		clearInterval(this.calculter); 
		clearInterval(this.calcumg); 
		clearInterval(this.calcu); 
	},
	// 结算显示
	onOutComeShow:function(lGameScore){
		if(lGameScore == null){
			this.onUnscheduleAllSelectors();
		}
		cc.log("sss### 比牌结束 显示结束页");
		var table = ClientData.getInstance().getTable();
		var outcome = UIMgr.getInstance().openDlg(ID_DlgCNpokeoutcome);
		var result = 0;
		var isMe = false;
		for(pos  = 0;pos<CMD_SSS.GAME_PLAYER;pos++){
			var chairId = this.getChairIdByPlayerPos(pos);
			var player = table.getPlayerByChairID(chairId);
			if(lGameScore == null){
				result = nSssGameModel.playerDatas[pos].addScore;
			}
			else{
				result = lGameScore[pos];
			}
			cc.log("player =" + JSON.stringify(nSssGameModel.playerDatas[pos]));

			if(player == null){
				player=nSssGameModel.playerDatas[pos].nPlayer;
			}
			
			if(player){
				if(player.getUserId() == g_objHero.getUserId()){
					isMe = true;				
				}
				else{
					isMe = false;
				}
			}

			var card = nSssGameModel.playerDatas[pos].cardone;
			card = card.concat(nSssGameModel.playerDatas[pos].cardtwo);
			card = card.concat(nSssGameModel.playerDatas[pos].cardthree);

			cc.log("sss### 比牌结束  pos = "+pos);
			cc.log("sss### 比牌结束结果  result = "+result);
			cc.log("显示结束页数据bCardData= " + JSON.stringify(card));

			if(isMe == true){
				cc.log("sss### 比牌结束我是  pos = "+pos);
				cc.log("sss### 比牌我的结果  result = "+result);
				outcome.onSetPlayerResult(result);
			}
			if(lGameScore != null){
				cc.log("结束游戏 增加玩家"+pos+"数据");
				var arrLen = g_outcome.playerDatas[pos].gNumPoint.length;
				g_outcome.playerDatas[pos].nPlayer = player;
				g_outcome.playerDatas[pos].gNumPoint[arrLen] = result;	
			}

			cc.log("sss### 比牌结束我是  pos = "+pos+"player="+player);
			cc.log("sss### 比牌我的结果  lGameScore = "+ JSON.stringify(lGameScore));
			outcome.onSetPlayerOutcome(pos,result,player,card);		
	
		}		
	},
	// 用户进入 100
	onSubUserEnter: function(data){

		cc.log("sss### 游戏服务器，（用户命令 /用户状态）用户进入");
		var table = ClientData.getInstance().getTable();
		if(!table){
			return;
		}

		var room = ClientData.getInstance().getRoom();
		if(!room){
			return;
		}

		var dataParser = new DataParser();
		dataParser.init(data);
		var parseData = dataParser.parse([
		                                  // 用户属性
		                                  ["dwGameID", "DWORD"],// 游戏I D
		                                  ["dwUserID", "DWORD"],// 用户I D
		                                  // 头像信息
		                                  ["wFaceID", "WORD"],// 头像索引
		                                  ["dwCustomID", "DWORD"],// 自定标识
		                                  // 用户属性
		                                  ["cbGender", "BYTE"],// 用户性别
		                                  ["cbMemberOrder", "BYTE"],// 会员等级
		                                  // 用户状态
		                                  ["wTableID", "WORD"],// 桌子索引
		                                  ["wChairID", "WORD"],// 椅子索引
		                                  ["cbUserStatus", "BYTE"],// 用户状态
		                                  // 积分信息
		                                  ["lScore", "INT64_NUMBER"],// 用户分数
		                                  // 游戏信息
		                                  ["dwWinCount", "DWORD"],// 胜利盘数
		                                  ["dwLostCount", "DWORD"],// 失败盘数
		                                  ["dwDrawCount", "DWORD"],// 和局盘数
		                                  ["dwFleeCount", "DWORD"],// 逃跑盘数
		                                  ["dwExperience", "DWORD"],// 用户经验
		                                  // ----------------------解析叠加信息--------------------------
		                                  // 扩展昵称（数据为：用户信息 + 叠加信息，叠加信息中包含玩家昵称）
		                                  ["dataDescribe", "STRUCT", [
		                                                              ["wDataSize", "WORD"],// 数据大小
		                                                              ["wDataDecribe", "WORD"],// 数据描述
		                                                              ]],
		                                                              ]);

		// 扩展昵称（数据为：用户信息 + 叠加信息，叠加信息中包含玩家昵称）
		var strMutil = "";
		if(parseData.dataDescribe.wDataDecribe == DTP_GR_NICK_NAME){
			strMutil = dataParser.readTCharArray(parseData.dataDescribe.wDataSize);
		}
		var diStr = "*http*";
		var endIndex = strMutil.indexOf(diStr);
		if(endIndex==-1){
			// 不带URL
			cc.log("sss不带URL strMutil = " + strMutil + " endIndex "+endIndex);
			parseData.nickName = strMutil;
			parseData.url = "";
		}
		else{
			// 带URL
			cc.log("sss带URL strMutil = " + strMutil + " endIndex "+endIndex);
			parseData.nickName = strMutil.substring(0, endIndex);
			cc.log("sssnickName = " + parseData.nickName);
			parseData.url = strMutil.substring(endIndex+diStr.length);
			cc.log("sssnickName = " + parseData.url);
		}
		cc.log("sssparseData = " + JSON.stringify(parseData));

		// 旁观暂时不处理
		if(parseData.cbUserStatus == US_LOOKON){
			return;
		}

		// 自己进入消息
		var isHeroEnter = false;
		if(parseData.dwUserID == g_objHero.getUserId()){
			isHeroEnter = true;
		}

		if (!isHeroEnter) {
			// 发送请求位置
			Cmd4GCUser.getInstance().sendGcGetNearuser(parseData.dwUserID);
		}

		var player = null;
		// 自己进入
		if(isHeroEnter){
			player = g_objHero;
		}else{
			player = new Player();
			player.setHeaderUrl(parseData.url);
		}
		player.setNickName(parseData.nickName);

		player.setGameId(parseData.dwGameID);
		player.setUserId(parseData.dwUserID);
		player.setFaceId(parseData.wFaceID);
		player.setGender(parseData.cbGender);
		player.setMemberOrder(parseData.cbMemberOrder);
		if(parseData.wTableID!=INVALID_TABLE){
			player.setTableId(parseData.wTableID);
		}

		player.setChairID(parseData.wChairID);
		player.setStatus(parseData.cbUserStatus);

		var plaza = ClientData.getInstance().getPlaza();
		var curGameType = plaza.getCurGameType();	// 设置游戏类型 1：房卡 其他：金币
		if(curGameType==GAME_GENRE_PERSONAL){
			// 房卡
			player.setScore(parseData.lScore);
		}
		else{
			// 金币场
			player.setMoney(parseData.lScore);
		}
		// 玩家进入房间
		room.addPlayer(player);

		// 自己进入
		if(isHeroEnter){
			cc.log("ssstable.addPlayer(player)------isHeroEnter");
			table.addPlayer(player);
			table.removeOtherPlayer();

			if(g_objHero.getStatus() >= US_SIT && g_objHero.getTableId() != INVALID_TABLE && !g_objHero.isEnter/* test */){
				GameUserMsg.getInstance().sendRequestUserInfo(g_objHero.getTableId());

				// test
				g_objHero.isEnter = true;
			}
		}else{
			// 同桌（自己已经坐下）
			if( g_objHero.getStatus() >= US_SIT && g_objHero.getTableId() != INVALID_TABLE && g_objHero.getChairID() != INVALID_CHAIR ){
				if(parseData.wTableID == g_objHero.getTableId()){
					// 玩家进入自己所在桌子
					cc.log("ssstable.addPlayer(player)------玩家进入自己所在桌子");
					table.addPlayer(player);
				}
			}else{
				var tableCount = room.getTableCount();
				// 如果就一张桌子
				if(tableCount == 1){
					cc.log("ssstable.addPlayer(player)------如果就一张桌子");
					table.addPlayer(player);
				}
			}
		}

		// this.sendRequestUserInfo(parseData.wTableID);

		// //////////////////////////////////////////////////////////////////////////////////////////////////
		// 处理UI

		var runScene = cc.director.getRunningScene();

		// 自己进入
		if(isHeroEnter){
			// 启动游戏
			if(runScene && runScene.isPlazaScene && runScene.isPlazaScene()){
				// GameKindMgr.getInstance().runGameScene();
			}

			// 更新玩家信息
			if(runScene && runScene.isGameScene && runScene.isGameScene()){
				GameKindMgr.getInstance().getGameUIMgr().onUpdateAllPlayerInfo();
			}
		}else{
			// 同桌
			if( g_objHero.getStatus() >= US_SIT && g_objHero.getTableId() != INVALID_TABLE && g_objHero.getChairID() != INVALID_CHAIR ){
				if(parseData.wTableID == g_objHero.getTableId()){
					// 更新玩家信息
					if(runScene && runScene.isGameScene && runScene.isGameScene()){
						GameKindMgr.getInstance().getGameUIMgr().onUpdateAllPlayerInfo();
					}
				}
			}
		}

		cc.log("SSSpalyerCounts = "+ table.getPlayers().length);

	},

	
	// 玩家发送组完了消息
	
	onSendCardReady:function(data,nSpecial){
		var specal = false;
		if(nSpecial>0){
			specal = true;
		}
		var dataBuilder = new DataBuilder();
		dataBuilder.init(28);
		var  dataone = [data[0],data[1],data[2]];
		var datatwo = [data[3],data[4],data[5],data[6],data[7]];
		var datathree = [data[8],data[9],data[10],data[11],data[12]];
		dataBuilder.build([
		                   ["bFrontCard", "BYTE[]", dataone,3],// 椅子位置
		                   ["bMidCard", "BYTE[]", datatwo,5],// 桌子位置
		                   ["wUserID", "BYTE[]", datathree,5],// USERID
		                   ["bSpecialType", "BOOL", specal],
		                   ["btSpecialData ", "BYTE[]", [0,0,0,0,0,0,0,0,0,0,0,0,0]],
		                   ["bDragon", "BOOL", false]
		                   ]);

		if(g_gameSocket.status == SOCKET_STATUS._SS_CONNECTED){
			cc.log("sss###用户组牌完成，发送牌数据 .");
			g_gameSocket.sendData(MDM_GF_GAME, CMD_SSS.SUB_C_SHOWCARD, dataBuilder.getData());
		}
	},
	
	// 玩家主动退出
	onSendplayerOut:function(){
		
		var dataBuilder = new DataBuilder();
		dataBuilder.init(6);
		dataBuilder.build([
		                   ["wChairID", "WORD", g_objHero.getChairID()],// 椅子位置
		                   ["wTablePos", "WORD", g_objHero.getTableID()],// 桌子位置
		                   ["wUserID", "WORD", g_objHero.getUserId()],// USERID
		                   ["bEnterExit", "BOOL", true],
		                   ]);
		
		if(g_gameSocket.status == SOCKET_STATUS._SS_CONNECTED){
			cc.log("SSS###发送用户离开 .");
			g_gameSocket.sendData(MDM_GF_GAME, CMD_SSS.SUB_C_USEREXIT, dataBuilder.getData());
		}
		
	},
	
	openTimer: function(strId, subTime){

		if(!this._bInit){
			return;
		}

		var heroStatus = g_objHero.getStatus();


		var time = 15;
		var callBack = function(){};

		var table = ClientData.getInstance().getTable();
		if(!table){
			return;
		}

		var game = ClientData.getInstance().getGame();
		if(!game){
			return;
		}

		var gameStatus = table.getGameStatus();

		switch (strId) {
		case "ready":
			time = 15;
			if(subTime){
				time -= subTime;
			}

			callBack = function(){
				GameKindMgr.getInstance().backPlazaScene();
			};
			break;
		case "callScore": // 叫分

			break;
		case "callBanker":

			break;
		case "bet":


			break;
		case "open":
			if(gameStatus == CMD_SSS.GS_TK_PLAYING){
				time = 60;
				callBack = function(){
					var game = ClientData.getInstance().getGame();
					var cardType = game.getCardTypeByChairId(g_objHero.getChairID());
					var bOx = false;
					if(cardType > 0){
						bOx = true;
					}
					SssGameMsg.getInstance().sendOpenCard(bOx);
					/*
					 * SXH UIMgr.getInstance().closeDlg(ID_NnTbDlgOpen);
					 */
				};
			}

			break;
		default:
			break;
		}
		/*
		 * SXH UIMgr.getInstance().closeDlg(ID_NnTbDlgClock);
		 * UIMgr.getInstance().openDlg(ID_NnTbDlgClock);
		 * 
		 * var dlgClock = UIMgr.getInstance().getDlg(ID_NnTbDlgClock);
		 * if(dlgClock){ dlgClock.openTimer(time, callBack);
		 * dlgClock.setTimerName(strId); }
		 */

	},

	closeTimer: function(strId){
		/*
		 * var dlgClock = UIMgr.getInstance().getDlg(ID_NnTbDlgClock);
		 * if(!dlgClock){ return; }
		 * 
		 * var timerName = dlgClock.getTimerName(); if(strId == timerName){
		 * UIMgr.getInstance().closeDlg(ID_NnTbDlgClock); }
		 */
	},

	// 换桌成功
	onChangeTableSucc: function(){
		/*
		 * if(!this._bInit){ return; }
		 * 
		 * UIMgr.getInstance().closeDlg(ID_NnTbDlgClock);
		 * 
		 * var dlgSystem = UIMgr.getInstance().getDlg(ID_NnTbDlgSystem);
		 * if(dlgSystem){ dlgSystem.updateDlg(); }
		 * 
		 * var dlgPlayer = UIMgr.getInstance().getDlg(ID_NnTbDlgPlayer);
		 * if(dlgPlayer){ dlgPlayer.resetDlg(); }
		 */
	},

	// /////////////////////////////////////////////////////////////

	// 设置底注
	onCallScore: function() {
		/*
		 * if (!this._bInit) { return; };
		 * 
		 * var game = ClientData.getInstance().getGame(); if (!game) { return; };
		 * 
		 * var ctrlFlag = game.getCtrlFlag(); if (ctrlFlag) { cc.log("金币场模式");
		 * UIMgr.getInstance().openDlg(ID_NnTbDlgCallScore);
		 * UIMgr.getInstance().closeDlg(ID_NnTbDlgReady); } else {
		 * cc.log("房卡模式"); UIMgr.getInstance().openDlg(ID_NnTbDlgReady); }
		 */
	},

	onCallBanker: function(){
		/*
		 * if(!this._bInit){ return; }
		 * 
		 * var game = ClientData.getInstance().getGame(); if(!game){ return; }
		 * 
		 * var bPlayHero = game.isPlayByChairId(g_objHero.getChairID());
		 * if(bPlayHero){ UIMgr.getInstance().closeDlg(ID_NnTbDlgReady); }
		 * 
		 * var bFirst = game.isFirstTimesCallBanker(); var callBanker =
		 * game.getCallBankerChairId();
		 * 
		 * var pos = this.getPlayerPosByChairId(callBanker); var dlgPlayer =
		 * UIMgr.getInstance().getDlg(ID_NnTbDlgPlayer); if(dlgPlayer){
		 * dlgPlayer.setBanker(pos); }
		 * 
		 * cc.log("onCallBanker ------ 5" + g_objHero.getChairID());
		 * 
		 * this.openTimer("callBanker");
		 * 
		 * //自己抢庄 if(callBanker == g_objHero.getChairID()){ if(bFirst){
		 * SoundMgr.getInstance().playEffect("nndz_push_bank", 0, false); }
		 * 
		 *  }
		 */
	},

	onSetBanker: function(){
		/*
		 * if(!this._bInit){ return; }
		 * 
		 * var game = ClientData.getInstance().getGame(); if(!game){ return; }
		 * 
		 * var bPlayHero = game.isPlayByChairId(g_objHero.getChairID());
		 * if(bPlayHero){ UIMgr.getInstance().closeDlg(ID_NnTbDlgReady);
		 * UIMgr.getInstance().closeDlg(ID_NnTbDlgClock); }
		 * 
		 */
	},

	// 玩家加注
	onAddScore: function(chairId, addScore){
		/*
		 * if(!this._bInit){ return; }
		 * 
		 * var table = ClientData.getInstance().getTable();
		 * 
		 * var game = ClientData.getInstance().getGame(); if(!game){ return; }
		 * 
		 * var bPlayHero = game.isPlayByChairId(g_objHero.getChairID());
		 * if(bPlayHero){ UIMgr.getInstance().closeDlg(ID_NnDzDlgReady);
		 * 
		 * if(chairId == g_objHero.getChairID()){
		 * UIMgr.getInstance().closeDlg(ID_NnTbDlgClock); } }
		 * 
		 * UIMgr.getInstance().closeDlg(ID_NnDzDlgCallBanker); if(chairId ==
		 * g_objHero.getChairID()){ UIMgr.getInstance().closeDlg(ID_NnDzDlgBet); }
		 * 
		 * cc.log("### chair [" + chairId + "] 加注 " + addScore); var pos =
		 * this.getPlayerPosByChairId(chairId);
		 * 
		 * var dlgPlayer = UIMgr.getInstance().getDlg(ID_NnTbDlgPlayer);
		 * if(dlgPlayer){ var player = table.getPlayerByChairID(chairId); if
		 * (player) { var leaveMoney = player.getMoney() - addScore;
		 * dlgPlayer.betValue(pos, addScore, leaveMoney); } }
		 */
	},

	heroSendEnd: function(){
		/*
		 * if(!this._bInit){ return; }
		 * 
		 * UIMgr.getInstance().openDlg(ID_NnTbDlgGetType);
		 * UIMgr.getInstance().openDlg(ID_NnTbDlgOpen); this.openTimer("open");
		 * 
		 * var table = ClientData.getInstance().getTable();
		 * 
		 * var game = ClientData.getInstance().getGame(); if(!game){ return; }
		 * 
		 * var dlgPlayer = UIMgr.getInstance().getDlg(ID_NnTbDlgPlayer);
		 * if(dlgPlayer){ var heroChairId = g_objHero.getChairID(); var
		 * tipCardValue = game.getOxCardByChairId(heroChairId);
		 * if(tipCardValue){ dlgPlayer.tipCard(0, tipCardValue); } }
		 *  // cc.log("@@@@@发牌结束"+game.getCellScore()); for(var i=0; i<CMD_NIUNIU_TB.GAME_PLAYER;
		 * i++){ var chairId = this.getChairIdByPlayerPos(i); var bPlay =
		 * game.isPlayByChairId(chairId); if(bPlay){ var dlgPlayer =
		 * UIMgr.getInstance().getDlg(ID_NnTbDlgPlayer); if(dlgPlayer){ var
		 * player = table.getPlayerByChairID(chairId); var addScore =
		 * game.getCellScore(); var leaveMoney = player.getMoney() - addScore;
		 * if(leaveMoney < 0){ leaveMoney = 0; } dlgPlayer.betValue(i, addScore,
		 * leaveMoney); } } }
		 */
	},

	onOpenCard: function(chairId){
		/*
		 * if(!this._bInit){ return; }
		 * 
		 * var game = ClientData.getInstance().getGame(); if(!game){ return; }
		 * 
		 * var bPlayHero = game.isPlayByChairId(g_objHero.getChairID());
		 * if(bPlayHero){ UIMgr.getInstance().closeDlg(ID_DdzDlgReady);
		 * if(chairId == g_objHero.getChairID()){
		 * //UIMgr.getInstance().closeDlg(ID_NnTbDlgClock);
		 * 
		 * UIMgr.getInstance().closeDlg(ID_DdzDlgCardOp); } }
		 * 
		 * 
		 * var pos = this.getPlayerPosByChairId(chairId);
		 * 
		 * var dlgPlayer = UIMgr.getInstance().getDlg(ID_DdzDlgPlayer);
		 * if(dlgPlayer){ var cardValue = game.getHandCardValues(chairId);
		 * dlgPlayer.openCard(pos, cardValue); }
		 * 
		 * if (!game.isNoType()) { var type =
		 * game.getCardTypeByChairId(chairId);
		 * 
		 * var dlgPlayer = UIMgr.getInstance().getDlg(ID_DdzDlgPlayer);
		 * if(dlgPlayer){ dlgPlayer.setNiuType(pos, type); } } else { var
		 * dlgPlayer = UIMgr.getInstance().getDlg(ID_DdzDlgPlayer);
		 * if(dlgPlayer){ dlgPlayer.setNiuType(pos, 0); } };
		 */

	},

	onGameEnd: function(){
		/*
		 * if(!this._bInit){ return; }
		 * 
		 * this._endPhase = true;
		 * 
		 * 
		 * var game = ClientData.getInstance().getGame(); if(!game){ return; }
		 * 
		 * for(var i=0; i<CMD_DDZ.GAME_PLAYER; i++){ var bPlay =
		 * game.isPlayByChairId(i); if(bPlay){ //得分 var score =
		 * game.getScore(i); var pos = this.getPlayerPosByChairId(i);
		 * 
		 * var dlgPlayer = UIMgr.getInstance().getDlg(ID_DdzDlgPlayer);
		 * if(dlgPlayer){ dlgPlayer.scoreValue(pos, score); } } }
		 * 
		 * 
		 * var delay = cc.DelayTime.create(3); var callFunc =
		 * cc.CallFunc.create(function(){
		 * SoundMgr.getInstance().playEffect("game_end", 0, false);
		 * 
		 * 
		 * var heroChairId = g_objHero.getChairID(); var bHeroPlay =
		 * game.isPlayByChairId(heroChairId); cc.log("游戏我结束了"+bHeroPlay);
		 * if(bHeroPlay){ UIMgr.getInstance().openDlg(ID_DdzDlgResult); }else{
		 * this.againGame(); } }, this);
		 * 
		 * var seq = cc.Sequence.create(delay, callFunc);
		 * this._uiLayer.runAction(seq);
		 * 
		 * this.onUpdateAllPlayerInfo();
		 */
	},

	againGame: function(){
		/*
		 * cc.log("jinru again"); if(!this._bInit){ return; } cc.log("jinru
		 * again000000000000"); var bForceExitGame = this.checkForceExit();
		 * if(bForceExitGame){ return; }
		 * 
		 * this._endPhase = false; this.onUpdateAllPlayerInfo();
		 * 
		 * UIMgr.getInstance().closeDlg(ID_DdzDlgOpen);
		 * UIMgr.getInstance().closeDlg(ID_DdzDlgResult);
		 * 
		 * var dlgPlayer = UIMgr.getInstance().getDlg(ID_DdzDlgPlayer);
		 * if(dlgPlayer){ dlgPlayer.resetDlg(); }
		 * 
		 * if(g_objHero.getStatus() < US_READY){ cc.log("jinru
		 * again1111111111111111"); var dlgCallScore =
		 * UIMgr.getInstance().getDlg(ID_DdzDlgCallScore); if(!dlgCallScore){
		 * cc.log("jinru again2222222222");
		 * UIMgr.getInstance().openDlg(ID_DdzDlgReady); this.openTimer("ready",
		 * 5); } }
		 */
	},

	getPlayersNick: function(){
		if(!this._bInit){
			return;
		}

		return this.playersNick;
	},

	onGameScene: function(){
		cc.log("sssUimgr.js onGameScene");
		/*
		 * cc.log("onGameScene000000"); if(!this._bInit){ return; }
		 * cc.log("onGameScene11111111"); var table =
		 * ClientData.getInstance().getTable(); if(!table){ return; }
		 * cc.log("onGameScene22222222"); var game =
		 * ClientData.getInstance().getGame(); if(!game){ return; }
		 * 
		 * var i; var gameStatus = table.getGameStatus();
		 * cc.log("onGameScenepp"+gameStatus); switch (gameStatus) { case
		 * CMD_NIUNIU_TB.GS_TK_FREE: // cc.log("@@@@ 叫分
		 * CMD_NIUNIU_TB.GS_TK_FREE"); //叫分 this.onCallScore(); break; case
		 * CMD_NIUNIU_TB.GS_TK_CALL: //叫庄
		 * 
		 * break; case CMD_NIUNIU_TB.GS_TK_SCORE: //庄家
		 * 
		 * break; case CMD_NIUNIU_TB.GS_TK_PLAYING: cc.log("@@@@
		 * CMD_NIUNIU_TB.GS_TK_PLAYING"); //庄家 this.onSetBanker();
		 * 
		 * //下注 for(i=0; i<CMD_NIUNIU_TB.GAME_PLAYER; i++){ var bPlay =
		 * game.isPlayByChairId(i); var banker = game.getBankerChairId();
		 * if(!bPlay || i == banker){ continue; }
		 * 
		 * var addScore = game.getAddScore(i); if(addScore > 0){
		 * this.onAddScore(i, addScore); } }
		 * 
		 * 
		 * //开牌 for(i=0; i<CMD_NIUNIU_TB.GAME_PLAYER; i++){ var bPlay =
		 * game.isPlayByChairId(i); // cc.log("@@@@@bPlay+"+bPlay); if(!bPlay){
		 * if (i == g_objHero.getChairID()) { //
		 * UIMgr.getInstance().openDlg(ID_NnTbDlgReady); }; continue; }
		 * 
		 * //开牌 var bOpen = game.isOpenCard(i); if(bOpen){ this.onOpenCard(i);
		 * }else{ //手牌 var pos = this.getPlayerPosByChairId(i); var cardsValue =
		 * game.getHandCardValues(i); var dlgPlayer =
		 * UIMgr.getInstance().getDlg(ID_NnTbDlgPlayer); if(dlgPlayer){ for(var
		 * j=0; j<cardsValue.length; j++){ var cardValue = cardsValue[j];
		 * dlgPlayer.addCard(pos, cardValue, false); } }
		 * 
		 * if(i == g_objHero.getChairID()){
		 * UIMgr.getInstance().openDlg(ID_NnTbDlgOpen);
		 * UIMgr.getInstance().openDlg(ID_NnTbDlgGetType); }
		 * 
		 * var game = ClientData.getInstance().getGame(); if(!game){ return; }
		 * 
		 * var dlgPlayer = UIMgr.getInstance().getDlg(ID_NnTbDlgPlayer);
		 * if(dlgPlayer){ var heroChairId = g_objHero.getChairID(); var
		 * tipCardValue = game.getOxCardByChairId(heroChairId); cc.log("@@@@@@@@
		 * tipCardValue="+tipCardValue); if(tipCardValue){ dlgPlayer.tipCard(0,
		 * tipCardValue); } } } }
		 * 
		 * cc.log("---------------- heroChairId === " + heroChairId); var
		 * heroChairId = g_objHero.getChairID(); var bHeroPlay =
		 * game.isPlayByChairId(heroChairId);
		 * 
		 * cc.log("---------------- bHeroPlay === " + bHeroPlay);
		 * if(!bHeroPlay){ this.onCallScore(); } break; default: break; }
		 * 
		 * this._bDealGameScene = true;
		 */
	},
});

SssUIMgr.getInstance = function() {
	if (!s_sharedSssUIMgr) {
		s_sharedSssUIMgr = new SssUIMgr();
	}
	return s_sharedSssUIMgr;
};
