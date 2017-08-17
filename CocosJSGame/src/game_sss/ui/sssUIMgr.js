var s_sharedSssUIMgr = null;

var SssUIMgr = GameUIMgr.extend({
	resetData: function () {
	},

	startGame: function () {

		cc.log("#### SssUIMgr startGame ");
// SoundMgr.getInstance().playMusic("sss_bg",0,true);
		this.resetData();

		//push -- spriteFrameCache
        cc.spriteFrameCache.addSpriteFrames(res.huaiFengCardPlist_plist);

		//open -- sssMainScene
		var mainScene = UIMgr.getInstance().openDlg(ID_DlgSSSMainScene);
		var game = ClientData.getInstance().getGame();
		var roomNum = g_objHero.getRoomID();

		//open -- sssItems
        var items = UIMgr.getInstance().openDlg(ID_DlgSSSItems);

		//设置房间号;底分;游戏局数
        mainScene.onSetRoomNum(roomNum);
        mainScene.onSetBasePoint(game.getCellScore());
        mainScene.onSetGameNum(game.getCurentCount(),game.getDrawCountLimit());

        //open -- ChatScene
		//UIMgr.getInstance().openDlg(ID_DlgChatScene);


        //open -- PlayerData
        UIMgr.getInstance().openDlg(ID_DlgSSSPlayerData);

		this.onUpdateAllPlayerInfo(CMD_SSS.SSS_UIMGR);

	},

	// //////////////////////////////////实现父类中包含的函数/////////////////////////////////////////////
	
	// 比牌
	
	onCompareResult:function(bCardData,cbCompareResult,lGameScore,playerCount){
		if(bCardData==null || cbCompareResult==null){
			return false;
		}
		cc.log("比牌内容:"+bCardData+"分数;"+lGameScore+"玩家人数:"+playerCount);
		cc.log("onCompareResult"+cbCompareResult+"bCardData"+bCardData);
		cc.log("cbCompareResult.length:"+cbCompareResult.length);
		// 玩家单水总水分数背景可见
        var game = ClientData.getInstance().getGame();
        if(game == null){//test
            game = new SssGameModel();
		}
		var dlgPlayer = UIMgr.getInstance().getDlg(ID_DlgSSSPlayerData);
		if( dlgPlayer == undefined){
            dlgPlayer = UIMgr.getInstance().openDlg(ID_DlgSSSPlayerData);
		}
		dlgPlayer.WaterBg[0].setVisible(true);
		
		var cardCompareResult= [];//[cbCompareResult[0][0],cbCompareResult[1][0],cbCompareResult[2][0],cbCompareResult[3][0]];
		for(var i = 0;i < playerCount;i++){
            cardCompareResult[i] = cbCompareResult[i][0];
			cc.log("onePlayerResult:"+cardCompareResult[i]);
		}
		var card=[];
		var cardData=[];
		var nSpecialnum = 0;
		for(var num = 0;num<playerCount;num++){
			card = [bCardData[num][0],bCardData[num][1],bCardData[num][2]];
			cardData[num]=card;
			if(game.playerDatas[num].nSpecial == true){
				nSpecialnum++;
			}
		}
		// 第一道比较
		if(nSpecialnum<playerCount){
			var nSpecialone = nSpecialnum;
			this.calcul0 = function(thisobj,cardData,cardCompareResult,nSpecialone){
				return function(){
					cc.log("第一道开始比");
					thisobj.onCompareFirstResult(cardData,cardCompareResult,nSpecialone,playerCount);
				}
			};

			cc.log("第一道："+cardData+"Result"+cbCompareResult+"long:"+nSpecialone);
			setTimeout(this.calcul0(this,cardData,cardCompareResult,nSpecialone), 500);
			// 延时几秒

			cardCompareResult=[];
			card=[];
			var cardData=[];

			//cardCompareResult = [cbCompareResult[0][1],cbCompareResult[1][1],cbCompareResult[2][1],cbCompareResult[3][1]];
            for(var i = 0;i < playerCount;i++){
                cardCompareResult[i] = cbCompareResult[i][1];
            }
			for(var num = 0;num<playerCount;num++){
				card = [bCardData[num][3],bCardData[num][4],bCardData[num][5],bCardData[num][6],bCardData[num][7]];
				cardData[num]=card;
			}

			// 第二道比较
			var nSpecialtwo = nSpecialnum;
			this.calcul1 = function(thisobj,cardData,cardCompareResult,nSpecialtwo){
				return function(){
					cc.log("第二道开始比");
					dlgPlayer = UIMgr.getInstance().getDlg(ID_DlgSSSPlayerData);
					dlgPlayer.removeCardShow();
					thisobj.onCompareSecondResult(cardData,cardCompareResult,nSpecialtwo,playerCount);
				}
			};
			var tesTime = 2000+1000*(playerCount-nSpecialnum);
			cc.log("延迟="+tesTime+"开始第二道开始比");
            cc.log("第二道："+cardData+"Result"+cbCompareResult+"long:"+nSpecialone);
			setTimeout(this.calcul1(this,cardData,cardCompareResult,nSpecialtwo), 1000+1000*(playerCount-nSpecialnum));

			cardCompareResult=[];
			card=[];
			var cardData=[];

			//cardCompareResult = [cbCompareResult[0][2],cbCompareResult[1][2],cbCompareResult[2][2],cbCompareResult[3][2]];
            for(var i = 0;i < playerCount;i++){
                cardCompareResult[i] = cbCompareResult[i][2];
            }
			for(var num = 0;num<playerCount;num++){
				card = [bCardData[num][8],bCardData[num][9],bCardData[num][10],bCardData[num][11],bCardData[num][12]];
				cardData[num]=card;
			}

			var nSpecialthree = nSpecialnum;
			this.calcul2 = function(thisobj,cardData,cardCompareResult,nSpecialthree){
				return function(){
					cc.log("第三道开始比");
					dlgPlayer = UIMgr.getInstance().getDlg(ID_DlgSSSPlayerData);
					dlgPlayer.removeCardShow();
					thisobj.onCompareThirdResult(cardData,cardCompareResult,nSpecialthree,playerCount);
				}
			};
			tesTime = 2000+2000*(playerCount-nSpecialnum);
			cc.log("延迟="+tesTime+"开始第三道开始比");
            cc.log("第三道："+cardData+"Result"+cbCompareResult+"long:"+nSpecialone);
			setTimeout(this.calcul2(this,cardData,cardCompareResult,nSpecialthree), 2000+2000*(playerCount-nSpecialnum));
		}
		
		// 判断是否为特殊牌
		var timeSpec = 0;
		
		for(var pos=0;pos<playerCount;pos++){
			if(game.playerDatas[pos].nSpecial == true){
				timeSpec++;				
			}	
		}
		var time = 0;
		if(timeSpec>3){
			time = 500;
		}
		else{
			time = 3000+3000*(playerCount-timeSpec)
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
                var game = ClientData.getInstance().getGame();
                if(game == null){
                	game = new SssGameModel();
				}
				var nGan = [];
				var ganPlayer = UIMgr.getInstance().getDlg(ID_DlgSSSPlayerData);
				var nQuan = 0;
				var nQuanArr = [];
				var playerPos = 0;
				for(var pos = 0;pos<CMD_SSS.GAME_PLAYER;pos++){
                    //如果只有我一个人并且 pos == 0 才画我自己
                    if(SssUIMgr.getInstance().getPlayerCount() == 1 && pos != 0){
                        continue;
                    }
					//如果玩家两个并且 pos == 0 才画我自己
                    if(SssUIMgr.getInstance().getPlayerCount() == 2 && (pos != 0 && pos != 3)){
                        continue;
                    }
					//如果玩家三个并且 pos == 0 才画我自己
                    if(SssUIMgr.getInstance().getPlayerCount() == 3 && (pos != 0 && pos != 2 && pos != 3)){
                        continue;
                    }
					//如果玩家四个并且 pos == 0 才画我自己
                    if(SssUIMgr.getInstance().getPlayerCount() == 4 && (pos != 0 && pos != 2 && pos != 3 && pos != 4)){
                        continue;
                    }
					//如果玩家五个并且 pos == 0 才画我自己
                    if(SssUIMgr.getInstance().getPlayerCount() == 5 && (pos != 0 && pos != 2 && pos != 3 && pos != 4 && pos != 5)){
                        continue;
                    }

					ganPlayer.removeCardShow();
					var nGan = [];
					var nGaNum = 0;
					var playerPos1 = 0;
					for(var num = 0;num<CMD_SSS.GAME_PLAYER;num++){
                        //如果只有我一个人并且 pos == 0 才画我自己
                        if(SssUIMgr.getInstance().getPlayerCount() == 1 && num != 0){
                            continue;
                        }
                        //如果玩家两个并且 pos == 0 才画我自己
                        if(SssUIMgr.getInstance().getPlayerCount() == 2 && (num != 0 && num != 3)){
                            continue;
                        }
                        //如果玩家三个并且 pos == 0 才画我自己
                        if(SssUIMgr.getInstance().getPlayerCount() == 3 && (num != 0 && num != 2 && num != 3)){
                            continue;
                        }
                        //如果玩家四个并且 pos == 0 才画我自己
                        if(SssUIMgr.getInstance().getPlayerCount() == 4 && (num != 0 && num != 2 && num != 3 && num != 4)){
                            continue;
                        }
                        //如果玩家五个并且 pos == 0 才画我自己
                        if(SssUIMgr.getInstance().getPlayerCount() == 5 && (num != 0 && num != 2 && num != 3 && num != 4 && num != 5)){
                            continue;
                        }
						if(num!=pos){
							if(game.playerDatas[playerPos].nSpecial == false){
								if((cbCompareResult[playerPos][0]>cbCompareResult[playerPos1][0]) &&(cbCompareResult[playerPos][1]>cbCompareResult[playerPos1][1]) &&
										(cbCompareResult[playerPos][2]>cbCompareResult[playerPos1][2])&&(game.playerDatas[playerPos1].nSpecial == false)){

									nGan[nGaNum] = num;
									nGaNum++;
								}
							}				
						}
                        playerPos1++;
					}

					if(nGaNum>0){
						if(nGaNum >= playerCount - 1 && playerCount >= 4){
							nQuan = pos;
							nQuanArr = nGan;
							cc.log("时间到了谁全垒打="+nQuan+"打谁="+JSON.stringify(nQuanArr));
						}
						else{
							var calcug = function(thisObj,nGan,pos){
								return function(){
									SoundMgr.getInstance().playEffect("sss_daqiang1", 0, false);
									cc.log("时间到了谁打枪="+pos+"谁被打="+JSON.stringify(nGan));
									cc.log(game.playerDatas[nQuan].nSpecial);
									if(game.playerDatas[pos].nSpecial == false){
										cc.log("2");
										ganPlayer.ShowShootAni(pos,nGan);
									}				
								}
							}
							setTimeout(calcug(this,nGan,pos), (thisObj.timeGan)*1500);	
							(thisObj.timeGan)++;
						}
					}
					
					if(playerPos== playerCount - 1 /*pos == 3*/){
						if(nQuanArr[2]){
							var calcug1 = function(thisObj,nQuanArr,nQuan){
								return function(){
									SoundMgr.getInstance().playEffect("sss_special1", 0, false);
									cc.log("时间到了谁全垒打="+nQuan+"打谁="+JSON.stringify(nQuanArr));
									cc.log(game.playerDatas[nQuan].nSpecial);
									if(game.playerDatas[nQuan].nSpecial == false){
										cc.log("1");
										ganPlayer.ShowShootAni(nQuan,nQuanArr);
									}				
								}
							}
							setTimeout(calcug1(this,nQuanArr,nQuan), (thisObj.timeGan)*1500);
							(thisObj.timeGan)++;
						}
					}

                    playerPos++;
				}			
			}
		}
		cc.log("延迟="+time+"开始显打枪");
		setTimeout(this.calcumg(this,cbCompareResult), time);	
		
		var nGaNum = 0;
		for(var pos = 0;pos<playerCount;pos++){
			for(var num = 0;num<playerCount;num++){
				if(num!=pos){
					if(game.playerDatas[pos].nSpecial == false){
						if((cbCompareResult[pos][0]>cbCompareResult[num][0]) &&(cbCompareResult[pos][1]>cbCompareResult[num][1]) &&
								(cbCompareResult[pos][2]>cbCompareResult[num][2])&&(game.playerDatas[num].nSpecial == false)){
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
                //设置游戏局数
				var game = ClientData.getInstance().getGame();
				if(game == null){
                    game =  new SssGameModel();
				}
				log("结算游戏局数"+game.getCurentCount()+"游戏总局数"+game.getDrawCountLimit());
				if(game.getCurentCount() >= game.getDrawCountLimit()){
                    //跳出战绩页
                    var calcuend = function () {
                        var dlgGameRecordCenter = UIMgr.getInstance().getDlg(ID_DlgGameRecordCenter);
                        if(dlgGameRecordCenter == undefined){
                            dlgGameRecordCenter = UIMgr.getInstance().openDlg(ID_DlgGameRecordCenter);
						}
                        dlgGameRecordCenter.getDlgWidget().setVisible(true);
                    };
                    setTimeout(calcuend(),10000);
				}
				else{
                    // 准备按钮可见
                    var dlgBegin = UIMgr.getInstance().getDlg(DlgSSSBeginScene );
                    if(dlgBegin == null){
                        dlgBegin = UIMgr.getInstance().openDlg(ID_DlgSSSBegin);
                    }
                    dlgBegin.setReadyButPos(1);
                    dlgBegin.onSetInvfriendbtn(false);
				}
                	
                cc.log("sss数据重置");
				var gameFlag = game.gameFlag;
				var gameNum = game.getCurentCount();
				var gameLimit = game.getDrawCountLimit();
				cc.log("sss数据重置gameFlag = "+gameFlag+"sss数据重置gameFlag =");
				
				game.reset();
				dlgPlayer = UIMgr.getInstance().getDlg(ID_DlgSSSPlayerData);
				dlgPlayer.setEndShow(lGameScore);
				// game.gameComping = false;
				if(gameFlag == true || gameNum>=gameLimit){
					cc.log("game.getCurentCount() = "+game.getCurentCount());
					if(game && !(game.getCurentCount() == 0 || game.getCurentCount() == null)||(game.getCurentCount()>=game.getDrawCountLimit())||
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
								game.reset();
								game.gameComping = false;
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

		var arrLen = arry.length
		var testArr = [];
		for(var i = 0;i < len;i++){
			testArr[i] = i;
		}
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
	onCompareFirstResult:function(cardata,Result,nSpenialone,playerCount){
		cc.log("第一道比较牌数据" + JSON.stringify(cardata));
		cc.log("第一道比较结果数据" + JSON.stringify(Result));
		var dlgPlayer = UIMgr.getInstance().getDlg(ID_DlgSSSPlayerData);
		var chairID = 0;
		var table = ClientData.getInstance().getTable();
        var game = ClientData.getInstance().getGame();
        if(game == null){
        	game = new SssGameModel();
		}
		var player = null;
		var isMe = false;
		var temp = nSpenialone;
		var testResult = [];
		for(var i = 0;i < playerCount;i++){
            testResult[i] = Result[i];
		}
		var posArr = this.onBubbleSort(testResult,playerCount);
		cc.log("第一道比较结果排序" + JSON.stringify(posArr));

		var playerPos = 0;
		for(var pos = 0;pos<CMD_SSS.GAME_PLAYER;pos++){

            //如果只有我一个人并且 pos == 0 才画我自己
            if(SssUIMgr.getInstance().getPlayerCount() == 1 && pos != 0){
                continue;
            }
            //如果玩家两个并且 pos == 0 才画我自己
            if(SssUIMgr.getInstance().getPlayerCount() == 2 && (pos != 0 && pos != 3)){
                continue;
            }
            //如果玩家三个并且 pos == 0 才画我自己
            if(SssUIMgr.getInstance().getPlayerCount() == 3 && (pos != 0 && pos != 2 && pos != 3)){
                continue;
            }
            //如果玩家四个并且 pos == 0 才画我自己
            if(SssUIMgr.getInstance().getPlayerCount() == 4 && (pos != 0 && pos != 2 && pos != 3 && pos != 4)){
                continue;
            }
            //如果玩家五个并且 pos == 0 才画我自己
            if(SssUIMgr.getInstance().getPlayerCount() == 5 && (pos != 0 && pos != 2 && pos != 3 && pos != 4 && pos != 5)){
                continue;
            }

            // ////---
            chairID = this.getChairIdByPlayerPos(pos);
            player = table.getPlayerByChairID(chairID);
            if(player == null){
                player=game.playerDatas[posArr[playerPos]].nPlayer;
            }
            if(player.getUserId() == g_objHero.getUserId()){
            	isMe = true;
            }
            else{
            	isMe = false;
            }

            // ////---test
            // chairID = playerPos;
            // player = chairID;
            // if(player == 0){
            //     isMe = true;
            // }
            // else{
				// isMe = false;
            // }
            // ////---

			cc.log("第一道比较结果数据isMe=" + isMe);
			
			if(game.playerDatas[posArr[playerPos]].nSpecial == false){
				
				var calcu5 = function(thisObj,cardata,Result,posArr,pos,isMe){
					return function(){
						cc.log("时间到了"+pos);
						dlgPlayer.setCardShowFirst(cardata,Result,posArr,pos,isMe);
					}
				}
				setTimeout(calcu5(this,cardata,Result,posArr[playerPos],pos,isMe), 1000*(nSpenialone-temp));
				temp--;
			}
            playerPos++;
		}
		
	},
	onCompareSecondResult:function(cardata,Result,nSpecialtwo,playerCount){
		cc.log("第二道比较牌数据" + JSON.stringify(cardata));
		cc.log("第二道比较结果数据" + JSON.stringify(Result));
		var dlgPlayer = UIMgr.getInstance().getDlg(ID_DlgSSSPlayerData);
		var chairID = 0;
		var table = ClientData.getInstance().getTable();
        var game = ClientData.getInstance().getGame();
        if(game == null){
            game = new SssGameModel();
        }
		var player = null;
		var isMe = false;
		var temp = nSpecialtwo;

		var testResult = [];
        for(var i = 0;i < playerCount;i++){
            testResult[i] = Result[i];
        }
		var posArr = this.onBubbleSort(testResult,playerCount);
		cc.log("第二道比较结果排序" + JSON.stringify(posArr));

		var playerPos = 0;//玩家数据
		for(var pos = 0;pos<CMD_SSS.GAME_PLAYER;pos++){
            //如果只有我一个人并且 pos == 0 才画我自己
            if(SssUIMgr.getInstance().getPlayerCount() == 1 && pos != 0){
                continue;
            }
            //如果玩家两个并且 pos == 0 才画我自己
            if(SssUIMgr.getInstance().getPlayerCount() == 2 && (pos != 0 && pos != 3)){
                continue;
            }
            //如果玩家三个并且 pos == 0 才画我自己
            if(SssUIMgr.getInstance().getPlayerCount() == 3 && (pos != 0 && pos != 2 && pos != 3)){
                continue;
            }
            //如果玩家四个并且 pos == 0 才画我自己
            if(SssUIMgr.getInstance().getPlayerCount() == 4 && (pos != 0 && pos != 2 && pos != 3 && pos != 4)){
                continue;
            }
            //如果玩家五个并且 pos == 0 才画我自己
            if(SssUIMgr.getInstance().getPlayerCount() == 5 && (pos != 0 && pos != 2 && pos != 3 && pos != 4 && pos != 5)){
                continue;
            }

            ////---

            chairID = this.getChairIdByPlayerPos(pos);
            player = table.getPlayerByChairID(chairID);
            if(player == null){
               player=game.playerDatas[posArr[playerPos]].nPlayer;
            }
            if(player.getUserId() == g_objHero.getUserId()){
            	isMe = true;
            }
            else{
            	isMe = false;
            }

            ////---test
            // chairID = playerPos;
            // player = chairID;
            // if(player == 0){
            //     isMe = true;
            // }
            // else{
            //     isMe = false;
            // }
            ////---

			cc.log("第二道比较结果数据isMe=" + isMe);
			// dlgPlayer.setCardShowSecond(pos,cardata,Result,isMe);
			if(game.playerDatas[posArr[playerPos]].nSpecial == false){
				var calcu6 = function(thisObj,cardata,Result,posArr,pos,isMe){
					return function(){
						cc.log("时间到了"+pos);
						dlgPlayer.setCardShowSecond(cardata,Result,posArr,pos,isMe);
					}
				}
				setTimeout(calcu6(this,cardata,Result,posArr[playerPos],pos,isMe), (nSpecialtwo-temp)*1000);
				temp--;
			}
            playerPos++;
		}
	},
	onCompareThirdResult:function(cardata,Result,nSpecialthree,playerCount){
		cc.log("第三道比较牌数据" + JSON.stringify(cardata));
		cc.log("第三道比较结果数据" + JSON.stringify(Result));
		var dlgPlayer = UIMgr.getInstance().getDlg(ID_DlgSSSPlayerData);
		var chairID = 0;
		var table = ClientData.getInstance().getTable();
        var game = ClientData.getInstance().getGame();
        if(game == null){
            game = new SssGameModel();
        }
		var player = null;
		var isMe = false;
		var temp = nSpecialthree;
		
		var testResult = [];
        for(var i = 0;i < playerCount;i++){
            testResult[i] = Result[i];
        }
		var posArr = this.onBubbleSort(testResult,playerCount);
		cc.log("第三道比较结果排序" + JSON.stringify(posArr));

		var playerPos = 0;
		for(var pos = 0;pos<CMD_SSS.GAME_PLAYER;pos++){
            //如果只有我一个人并且 pos == 0 才画我自己
            if(SssUIMgr.getInstance().getPlayerCount() == 1 && pos != 0){
                continue;
            }
            //如果玩家两个并且 pos == 0 才画我自己
            if(SssUIMgr.getInstance().getPlayerCount() == 2 && (pos != 0 && pos != 3)){
                continue;
            }
            //如果玩家三个并且 pos == 0 才画我自己
            if(SssUIMgr.getInstance().getPlayerCount() == 3 && (pos != 0 && pos != 2 && pos != 3)){
                continue;
            }
            //如果玩家四个并且 pos == 0 才画我自己
            if(SssUIMgr.getInstance().getPlayerCount() == 4 && (pos != 0 && pos != 2 && pos != 3 && pos != 4)){
                continue;
            }
            //如果玩家五个并且 pos == 0 才画我自己
            if(SssUIMgr.getInstance().getPlayerCount() == 5 && (pos != 0 && pos != 2 && pos != 3 && pos != 4 && pos != 5)){
                continue;
            }

            ////---

            chairID = this.getChairIdByPlayerPos(pos);
            player = table.getPlayerByChairID(chairID);
            if(player == null){
               player=game.playerDatas[posArr[playerPos]].nPlayer;
            }
            if(player.getUserId() == g_objHero.getUserId()){
            	isMe = true;
            }
            else{
            	isMe = false;
            }

            ////---test
            // chairID = playerPos;
            // player = chairID;
            // if(player == 0){
            //     isMe = true;
            // }
            // else{
            //     isMe = false;
            // }
            ////---

			cc.log("第三道比较结果数据isMe=" + isMe);
// dlgPlayer.setCardShowThird(pos,cardata,Result,isMe);
			
			if(game.playerDatas[posArr[playerPos]].nSpecial == false){
				var calcu7 = function(thisObj,cardata,Result,posArr,pos,isMe){
					return function(){
						cc.log("时间到了"+pos);
						if(game.playerDatas[pos].nSpecial == false){
							dlgPlayer.setCardShowThird(cardata,Result,posArr,pos,isMe);
						}
					}
				}
				setTimeout(calcu7(this,cardata,Result,posArr[playerPos],pos,isMe), (nSpecialthree-temp)*1000);
				temp--;
			}
            playerPos++;
		}
	},
	
	onCompareSpecialResult:function(){
		var nTempnum = 0;
        var game = ClientData.getInstance().getGame();
		for(var pos=0;pos<CMD_SSS.GAME_PLAYER;pos++){
            //如果只有我一个人并且 pos == 0 才画我自己
            if(SssUIMgr.getInstance().getPlayerCount() == 1 && pos != 0){
                continue;
            }
            //如果玩家两个并且 pos == 0 才画我自己
            if(SssUIMgr.getInstance().getPlayerCount() == 2 && (pos != 0 && pos != 3)){
                continue;
            }
            //如果玩家三个并且 pos == 0 才画我自己
            if(SssUIMgr.getInstance().getPlayerCount() == 3 && (pos != 0 && pos != 2 && pos != 3)){
                continue;
            }
            //如果玩家四个并且 pos == 0 才画我自己
            if(SssUIMgr.getInstance().getPlayerCount() == 4 && (pos != 0 && pos != 2 && pos != 3 && pos != 4)){
                continue;
            }
            //如果玩家五个并且 pos == 0 才画我自己
            if(SssUIMgr.getInstance().getPlayerCount() == 5 && (pos != 0 && pos != 2 && pos != 3 && pos != 4 && pos != 5)){
                continue;
            }
			if(game.playerDatas[pos].nSpecial == true){
				var table = ClientData.getInstance().getTable();
				chairID = this.getChairIdByPlayerPos(pos);
				player = table.getPlayerByChairID(chairID);
				if(player == null){
					player=game.playerDatas[pos].nPlayer;
				}
				if(player.getUserId() == g_objHero.getUserId()){
					isMe = true;
				}
				else{
					isMe = false;
				}
				
				var nSpecCardData=game.playerDatas[pos].cardone;
				nSpecCardData=nSpecCardData.concat(game.playerDatas[pos].cardtwo);
				nSpecCardData=nSpecCardData.concat(game.playerDatas[pos].cardthree);

				var dlgPlayer = UIMgr.getInstance().getDlg(ID_DlgSSSPlayerData);
				var calcu8 = function(thisObj,pos,nSpecCardData,isMe){
					return function(){
						cc.log("特殊时间到了0"+pos+"特殊牌组="+JSON.stringify(nSpecCardData));
						dlgPlayer.setCardShowSpecial(nSpecCardData,pos,isMe);
					}
				}
				setTimeout(calcu8(this,pos,nSpecCardData,isMe), nTempnum*1000);
				nTempnum++;

			}	
		}
	},

	// 更新所有玩家
	onUpdateAllPlayerInfo: function(nSource){
        var game = ClientData.getInstance().getGame();
        if(!game)return;
        cc.log("sss更新玩家信息"+JSON.stringify(game.playerDatas,null,2)+"nSource="+nSource);

		if(game.gameComping == false || nSource!=null){
			if(game.gameComping == false){
				var sssPlayer = UIMgr.getInstance().getDlg(ID_DlgSSSPlayerData);
				if(sssPlayer){
					sssPlayer.setPlayerBoxStatus(true);
				}

				var MainScene = UIMgr.getInstance().getDlg(ID_DlgSSSMainScene);

				//更新玩家底数 当前局数 总局数
				if(MainScene){
                    MainScene.onSetBasePoint(game.getCellScore());
                    MainScene.onSetGameNum(game.getCurentCount(),game.getDrawCountLimit());
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

				cc.log("g_objHero.getStatus = " + g_objHero.getStatus());
				if(g_objHero.getStatus()==US_PLAYING){

					var dlgStart = UIMgr.getInstance().getDlg(ID_DlgSSSMainScene);
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
					var dlgStart = UIMgr.getInstance().getDlg(ID_DlgSSSMainScene);
					var status = dlgStart.onGetImageclockStatus();
					if(status == true){
						dlgStart.dissolutionTime=0;
						dlgStart.updateCountDownTime;
						dlgStart.onSetImageclockStatus(false);
					}
				}

                var chairId0 = this.getChairIdByPlayerPos(0);
                var chairId1 = this.getChairIdByPlayerPos(1);
                var chairId2 = this.getChairIdByPlayerPos(2);
                var chairId3 = this.getChairIdByPlayerPos(3);
                var chairId4 = this.getChairIdByPlayerPos(4);
                var chairId5 = this.getChairIdByPlayerPos(5);
                var Player0 = game.isPlayByChairId(chairId0);
                var Player1 = game.isPlayByChairId(chairId1);
                var Player2 = game.isPlayByChairId(chairId2);
                var Player3 = game.isPlayByChairId(chairId3);
                var Player4 = game.isPlayByChairId(chairId4);
                var Player5 = game.isPlayByChairId(chairId5);
				cc.log("所有ChairId"+chairId0+Player0+chairId1+Player1+chairId2+Player2+chairId3+Player3+chairId4+Player4+chairId5+Player5);
				var pos;
				for(pos=0; pos< CMD_SSS.GAME_PLAYER; pos++){

                    var chairId = this.getChairIdByPlayerPos(pos);
                    var bPlayer = game.isPlayByChairId(chairId);
                    if(this._endPhase && bPlayer){
                        continue;
                    }
                    cc.log("111");
                    //如果只有我一个人并且 pos == 0 才画我自己
					if(SssUIMgr.getInstance().getPlayerCount() == 1 && pos != 0){
						continue;
					}
                    cc.log("222");
                    //如果玩家两个并且 pos == 0 才画我自己
                    if(SssUIMgr.getInstance().getPlayerCount() == 2 && (pos != 0 && pos != 3)){
                        continue;
                    }
                    cc.log("333");
                    //如果玩家三个并且 pos == 0 才画我自己
                    if(SssUIMgr.getInstance().getPlayerCount() == 3 && (pos != 0 && pos != 2 && pos != 3)){
                        continue;
                    }
                    cc.log("444");
					//如果玩家四个并且 pos == 0 才画我自己
                    if(SssUIMgr.getInstance().getPlayerCount() == 4 && (pos != 0 && pos != 2 && pos != 3 && pos != 4)){
                        continue;
                    }
                    cc.log("555");
                    //如果玩家五个并且 pos == 0 才画我自己
                    if(SssUIMgr.getInstance().getPlayerCount() == 5 && (pos != 0 && pos != 2 && pos != 3 && pos != 4 && pos != 5)){
                        continue;
                    }
                    cc.log("666");
                    var player = table.getPlayerByChairID(chairId);
                    var userID = 0;
                    var ready = 0;
                    var isMe = false;

					cc.log("获取玩家"+player+"通过座子号"+chairId+"Pos"+pos);

					if(player){
						game.playerDatas[pos].nPlayer = player;
						var userID = player.getUserId();
						ready= player.getStatus();
					}
					if(userID == g_objHero.getUserId()){
						isMe = true;
					}
					cc.log("ready = " + ready);
					var dlgPlayer = UIMgr.getInstance().getDlg(ID_DlgSSSPlayerData);

					if(dlgPlayer){
						dlgPlayer.updatePlayerInfo(pos, player);
						dlgPlayer.setPlayerReadystatus(pos,false);
						if(ready == US_READY){
							dlgPlayer.setPlayerReadystatus(pos,true);
							cc.log("US_READY isMe= " + isMe);
							if(isMe == true){
								UIMgr.getInstance().closeDlg(ID_DlgSSSBegin);
							}
						}
						else if(ready == US_SIT){
							cc.log("US_SITisMe= " + isMe);
							if(isMe == true){
								// UIMgr.getInstance().getDlg(ID_DlgCNpokeoutcome);
								if(/* dlgOutcome == null && */(game.gameComping==false)){
									var dlgBegin = UIMgr.getInstance().getDlg(DlgSSSBeginScene);
									cc.log("dlgBegin= " + dlgBegin);

									if(dlgBegin == null){
										dlgBegin = UIMgr.getInstance().openDlg(ID_DlgSSSBegin);
									}
                                    cc.log("dlgBegin==null " + dlgBegin);
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
							var gamePlayer = UIMgr.getInstance().getDlg(ID_DlgSSSPlayerData);
							var usrInfo = UIMgr.getInstance().getDlg(ID_DlgPlazaUserInfo);
							dlgPlayer.removeCardShow();

							if(isMe == false){
								cc.log("*1112");
								if(game.playerDatas[pos].bOverCard == true){
									if(gamePlayer){
										gamePlayer.ShowPlayerCardOverBg(pos);
									}
								}
							}
							else{
                                cc.log("20170522SssGameModel.playerDatas[pos].bPlay  = " + game.playerDatas[pos].bPlay);
                                cc.log("20170522SssGameModel.playerDatas[pos].bOverCard  = " + game.playerDatas[pos].bOverCard);
                                cc.log("pos = " + pos);
                                if (game.playerDatas[pos].bOverCard == false) {//直接进入组牌界面
									if(gamePlayer){
                                        if (game.playerDatas[pos].bPlay == true) {//断线回来
                                            var gameCard = UIMgr.getInstance().openDlg(ID_DlgSSSCombination);
                                            cc.log("*1113");
                                            if(game.PublicCards.length != 0){//如果有三张公共牌
                                                cc.log("有公共牌");
                                                game.playerDatas[0].card[13] = game.PublicCards[0];
                                                game.playerDatas[0].card[14] = game.PublicCards[1];
                                                game.playerDatas[0].card[15] = game.PublicCards[2];
                                            }
                                            //gameCard.dissolutionTime = 40断线时间后面加入;
                                            //gameCard.onStartCountDownTime();
                                            cc.log("组合牌的牌数据： = " + JSON.stringify(game.playerDatas[0].card));
                                            gameCard.pokecard = gameCard.onBubbleSort(game.playerDatas[0].card, game.playerDatas[0].card.length);
                                            gameCard.onSetcardOnMid(gameCard.pokecard, game.playerDatas[0].card.length);
                                            gameCard.onIsPair(gameCard.pokecard);
                                            //显示所有玩家暗在桌面手牌
                                            gamePlayer.showPlayerCardBg();
                                        }else{
                                            var gameCard = UIMgr.getInstance().getDlg(ID_DlgSSSCombination);
                                            // 创建自己手牌
                                            if(game.PublicCards.length != 0){//如果有三张公共牌
                                                cc.log("有公共牌");
                                                game.playerDatas[0].card[13] = game.PublicCards[0];
                                                game.playerDatas[0].card[14] = game.PublicCards[1];
                                                game.playerDatas[0].card[15] = game.PublicCards[2];
                                            }
                                            gamePlayer.CreateMyTableCards(game.playerDatas[0].card, game.playerDatas[0].card.length);
                                            var callCombiniton = function () {
                                                return function () {
                                                    gameCard = UIMgr.getInstance().openDlg(ID_DlgSSSCombination);
                                                    gameCard.dissolutionTime = 40;
                                                    gameCard.onStartCountDownTime();
                                                    cc.log("组合牌的牌数据： = " + JSON.stringify(game.playerDatas[0].card));
                                                    gameCard.pokecard = gameCard.onBubbleSort(game.playerDatas[0].card, game.playerDatas[0].card.length);
                                                    gameCard.onSetcardOnMid(gameCard.pokecard, game.playerDatas[0].card.length);
                                                    gameCard.onIsPair(gameCard.pokecard);
                                                    // 移除玩家自己的发牌
                                                    cc.log("移除自己的发牌");
                                                    gamePlayer.RemoveMyTabelCards();
                                                    //显示所有玩家暗在桌面手牌
                                                    gamePlayer.showPlayerCardBg();
                                                }
                                            }
                                            // 加载组牌相关数据
                                            cc.log("显示桌面牌： = " + JSON.stringify(game.playerDatas[pos].card));
                                            if (gameCard == null && game.gameComping == false) {
                                                if (game.playerDatas[pos].card[0]) {
                                                    setTimeout(callCombiniton(),2000);
                                                }
                                            }
                                            else {
                                                cc.log("没有操作不知道什么状态。");
                                            }
                                        }
									}
                                }
                                else {
                                    if (gamePlayer) {
										gamePlayer.ShowPlayerCardOverBg(pos);
                                    }
                                    else if (ready == CMD_SSS.GS_TK_CARDSHOW) {
                                        dlgPlayer.setPlayerReadystatus(pos, false);
                                        if (isMe == false) {
                                            var gamePlayer = UIMgr.getInstance().getDlg(ID_DlgSSSPlayerData);

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
			}
			// else{
			// 	var game = ClientData.getInstance().getGame();
			// 	if(g_outcome.playerDatas[0].gNumPoint.length<game.getDrawCountLimit()){
			// 		this.onOutComeShow();
			// 	}
			// }
		}

	},
	// 改变玩家状态
	onChangePlayerStatus:function(status){
		
		var table = ClientData.getInstance().getTable();
        var game = ClientData.getInstance().getGame();
		if(table){
			for(var pos = 0;pos<4;pos++){
				var chairID = this.getChairIdByPlayerPos(pos);
				var player = table.getPlayerByChairID(chairID);
				if(player == null){
					player=game.playerDatas[pos].nPlayer;
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
        var game = ClientData.getInstance().getGame();
		var outcome = UIMgr.getInstance().openDlg(ID_DlgCNpokeoutcome);
		var result = 0;
		var isMe = false;
		for(var pos  = 0;pos<CMD_SSS.GAME_PLAYER;pos++){
			var chairId = this.getChairIdByPlayerPos(pos);
			var player = table.getPlayerByChairID(chairId);
			if(lGameScore == null){
				result = game.playerDatas[pos].addScore;
			}
			else{
				result = lGameScore[pos];
			}
			cc.log("player =" + JSON.stringify(game.playerDatas[pos]));

			if(player == null){
				player=game.playerDatas[pos].nPlayer;
			}
			
			if(player){
				if(player.getUserId() == g_objHero.getUserId()){
					isMe = true;				
				}
				else{
					isMe = false;
				}
			}

			var card = game.playerDatas[pos].cardone;
			card = card.concat(game.playerDatas[pos].cardtwo);
			card = card.concat(game.playerDatas[pos].cardthree);

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
			player.setTableId(parseData.TableID);
		}

		player.setChairID(parseData.ChairID);
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
        var dataBuilder = data;
		// var dataBuilder = new DataBuilder();
		// dataBuilder.init(28);
		var  dataone = [data[0],data[1],data[2]];
		var datatwo = [data[3],data[4],data[5],data[6],data[7]];
		var datathree = [data[8],data[9],data[10],data[11],data[12]];

		var SpecialData = [0,0,0,0,0,0,0,0,0,0,0,0,0];
		var bDragon = false;
		// dataBuilder.build([
		//                    ["bFrontCard", "BYTE[]", dataone,3],// 椅子位置
		//                    ["bMidCard", "BYTE[]", datatwo,5],// 桌子位置
		//                    ["wUserID", "BYTE[]", datathree,5],// USERID
		//                    ["bSpecialType", "BOOL", specal],
		//                    ["btSpecialData ", "BYTE[]", [0,0,0,0,0,0,0,0,0,0,0,0,0]],
		//                    ["bDragon", "BOOL", false]
		//                    ]);

		if(g_gameSocket.status == SOCKET_STATUS._SS_CONNECTED){
			cc.log("sss###用户组牌完成，发送牌数据 .");
			//g_gameSocket.sendData(MDM_GF_GAME, CMD_SSS.SUB_C_SHOWCARD, dataBuilder.getData());
            g_gameSocket.sendData("C2G_SSS_Open_Card", {
                FrontCard :dataone,
                MidCard :datatwo,
                BackCard :datathree,
                SpecialType  :specal,
                SpecialData  :SpecialData,
                Dragon  :bDragon,
            });
		}
	},
	//获取玩家组完牌消息
	onGetCardReady:function (currentUser) {
		if(currentUser >=0 && currentUser < CMD_SSS.GAME_PLAYER){

			var playerPos = 0;
            var pos =  this.getPlayerPosByChairId(currentUser);
            if(pos == 1){
				playerPos = 3;
            }else if(pos == 2){
                playerPos = 4;
            }else if(pos == 3){
                playerPos = 2;
            }else if(pos == 4){
                playerPos = 5;
            }else if(pos == 5){
                playerPos = 1;
            }

            var gamePlayer = UIMgr.getInstance().getDlg(ID_DlgSSSPlayerData);
			gamePlayer.ShowPlayerCardOverBg(playerPos);
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
    },

    getPlayersNick: function(){
		if(!this._bInit){
			return;
		}

		return this.playersNick;
	}
});

SssUIMgr.getInstance = function() {
	if (!s_sharedSssUIMgr) {
		s_sharedSssUIMgr = new SssUIMgr();
	}
	return s_sharedSssUIMgr;
};
