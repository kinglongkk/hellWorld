/*
 *创建房间界面
 * Author: 	xjn 
 * Date:	2017.4.1
 * 
 * 功能：
 * 创建房间界面控件交互
 * */
DLG_CREATOR[ID_DlgOpenRoom] = function() {
	return new DlgOpenRoom();
};

var DlgOpenRoom = DlgBase.extend({
	ctor: function(){
		this.roundsSelected = null;
		this.baseScoreSelected = null;
		this.settlementSelected = null;
		this.baseScoreInput = 0;
	},

	onCreate: function() {
		this.init();
	},

	onClose: function() {
	},

	init: function() {
		var json = ccs.load(res.dlgOpenRoomScene_json);
		this._rootWidget = json.node;

		// 自适应屏幕大小
		var sizeDir = cc.director.getWinSize();
		this._rootWidget.setContentSize(sizeDir);
		ccui.helper.doLayout(this._rootWidget);
		
		this.Panel_root = this._rootWidget.getChildByName("Panel_root");
		this.Panel_root.addTouchEventListener(function(sender, type){
			if (ccui.Widget.TOUCH_ENDED == type) {
				UIMgr.getInstance().closeDlg(ID_DlgOpenRoom, false)
			}
		}, this);
		
		this.Panel_round = this.Panel_root.getChildByName("Panel_round");
		this.Panel_baseScore = this.Panel_root.getChildByName("Panel_baseScore");
		this.Panel_settlementType = this.Panel_root.getChildByName("Panel_settlementType");
		this.Panel_settlementType.setVisible(false);

		// 提示面板
		this.Panel_tip = this.Panel_root.getChildByName("Panel_tip");
		this.Panel_tip.addTouchEventListener(this.onClickEvent, this);
		this.Text_roomNum = this.Panel_tip.getChildByName("Text_roomNum");
		this.Button_add = this.Panel_tip.getChildByName("Button_add");
		this.Button_add.setPressedActionEnabled(true);
		this.Button_add.addTouchEventListener(this.onClickEvent, this);
		this.Button_invite = this.Panel_tip.getChildByName("Button_invite");
		this.Button_invite.setPressedActionEnabled(true);
		this.Button_invite.addTouchEventListener(this.onClickEvent, this);
		
		// 底分输入
		this.TextField_baseScore = this.Panel_baseScore.getChildByName("CheckBox_baseScore_input").getChildByName("TextField_baseScore");
		this.TextField_baseScore.setTouchEnabled(false);
		this.TextField_baseScore.addEventListener(function(sender, type) {
			switch (type) {
			case ccui.TextField.EVENT_ATTACH_WITH_IME:
				cc.log("attach with IME");
				break;
			case ccui.TextField.EVENT_DETACH_WITH_IME:
				cc.log("detach with IME");
				break;
			case ccui.TextField.EVENT_INSERT_TEXT:
				var baseScore = sender.string;
				var regExp = new RegExp("^[0-9]{1,15}$");

				if(baseScore == "0"){
					DlgTip.openSysTip("底分不能为0！");
					sender.string = "";
				}else if(!regExp.test(baseScore)){
					DlgTip.openSysTip("只能输入数字 ！");
					if(this.baseScoreInput!=0){
						sender.string = ""+this.baseScoreInput;
					}
					else
						sender.string = "";
				}
				else{
					this.baseScoreInput = Number(baseScore);
				}
				
				cc.log("input word");
				break;
			case ccui.TextField.EVENT_DELETE_BACKWARD:
				var baseScore = sender.string;
				this.baseScoreInput = Number(baseScore);
				cc.log("delete word");
				break;
			default:
				break;
			}
		},this);
		
		// 重置开房设置
		var resetType = function(parentPanel, selectedTarget){
			var children = parentPanel.children;
			selectedTarget = children[1];
			for (var index = 2; index < children.length; ++index) {
				var node = children[index];
				node.setSelected(false);
				node.children[0].setColor(cc.color(255,255,255,255));
				if(node.children[0].children.length>0){
					node.children[0].children[0].setColor(cc.color(255,255,255,255));
				}
			}
			
			if(this.baseScoreInput!=0)
				this.baseScoreInput=0;
			
			return children[1];
		}
		this.roundsSelected = resetType(this.Panel_round);
		this.baseScoreSelected = resetType(this.Panel_baseScore);
		this.settlementSelected = resetType(this.Panel_settlementType);

        var children = this.Panel_round.children;
        //设置房间局数和房卡数
		var roundsConfig = {
            
                "391":[//漳浦麻将
                       {
                    	   "rounds":8,
                    	   "roomCards":8
                       },
                       {
                    	   "rounds":16,
                    	   "roomCards":16
                       }
                       ],
                    "389":[//红中麻将
                              {
                            	  "rounds":8,
                            	  "roomCards":8
                              },
                              {
                            	  "rounds":16,
                            	  "roomCards":16
			                }
			                ],
					
            "28":[//通比牛牛
                {
                    "rounds":16,
                    "roomCards":8
                },
                {
                    "rounds":32,
                    "roomCards":16
                }
            ],
            "7":[//十三水
                {
                    "rounds":16,
                    "roomCards":8
                },
                {
                    "rounds":32,
                    "roomCards":16
                }
            ],
            "200":[//斗地主
                {
                    "rounds":8,
                    "roomCards":8
                },
                {
                    "rounds":16,
                    "roomCards":16
                }
            ]
		};
		cc.log("roundsConfig = " + JSON.stringify(roundsConfig));
        var plaza = ClientData.getInstance().getPlaza();
        var roundCFG = roundsConfig[plaza.getCurKindID()];
        var Panel_roundChildren = this.Panel_round.children;
        for(var index=0; index<4; ++index){
        	var roundInfo = roundCFG[index];
        	if(roundInfo){
        		var checkBox = Panel_roundChildren[index+1];
                var Text_rounds = checkBox.getChildByName("Text_rounds");
                var Text_cards = Text_rounds.getChildByName("Text_cards");
                var strRounds = roundInfo.rounds+"局";
                Text_rounds.setString(strRounds);
                Text_rounds.setTag(roundInfo.rounds);
                
                var strCards = "(房卡*"+roundInfo.roomCards+")";
                Text_cards.setContentSize(cc.size(strCards.length*12,50));
                Text_cards.setString(strCards);
                Text_cards.setTag(roundInfo.roomCards);
                Text_cards.setPositionX(100+(strCards.length*10)/2+(strRounds.length-3)*17);
                
                cc.log("sizeW="+strCards.length*15+"  posX="+(100+(strCards.length*12)/2)+(strRounds.length-3)*17);
                
			}
			else{
                Panel_roundChildren[index+1].setVisible(false);
			}
		}
		
		// 设置复选回调
		var children = this.Panel_round.children;
		for (var index = 1; index < children.length; ++index) {
			var checkBox = children[index];
			checkBox.addEventListener(this.onCheckBoxEvent, this);
			if(index==1){
				checkBox.setTouchEnabled(false);
			}
		}
		children = this.Panel_baseScore.children;
		for (var index = 1; index < children.length; ++index) {
			var checkBox = children[index];
			checkBox.addEventListener(this.onCheckBoxEvent, this);
			if(index==1){
				checkBox.setTouchEnabled(false);
			}
		}
		children = this.Panel_settlementType.children;
		for (var index = 1; index < children.length; ++index) {
			var checkBox = children[index];
			checkBox.addEventListener(this.onCheckBoxEvent, this);
			if(index==1){
				checkBox.setTouchEnabled(false);
			}
		}
		
		// ok btn
		this.btnOK = this.Panel_root.getChildByName("Button_ok");
		this.btnOK.setPressedActionEnabled(true);
		this.btnOK.addTouchEventListener(this.onClickEvent, this);
	},

	showTip: function(){
		this.Text_roomNum.string = "房间号:"+g_objHero.getRoomID();
		this.Panel_tip.setVisible(true);
	},
	
	onClickEvent: function(sender, type) {
		if (ccui.Widget.TOUCH_ENDED == type) {
			var strBtnName = sender.getName();
			cc.log('onClickEvent ' + strBtnName);
			switch (strBtnName) {
			case "Panel_tip":
				if(g_gameSocket.status != SOCKET_STATUS._SS_INVALID){
					g_gameSocket.close();
		    		cc.log("--------g_gameSocket.close()---------");
				}
				sender.setVisible(false);
				break;
			case "Button_add":
				LoginRegisterMsg.getInstance().sendLog(1);
				PlazaUIMgr.getInstance().onEnterRoom(g_objHero.getRoomID());
				break;
			case "Button_invite":
				// 邀请好友
				var target = WXShare.SHARE_TARGET_FRIEND;
				var url = _CONFIG_.URL_PART1_INVITE+g_objHero.getUserId()+"-"+"room-"+g_objHero.getRoomID()+_CONFIG_.URL_PART2;
				var title = "一起搓几局，麻雀家乡见！";
				var description = "老牌友在等你（房号："+g_objHero.getRoomID()+"），点击立即加入，一起搓个天昏地暗！";
				
				var tip = this.Panel_tip;
				WXShare.getInstance().shareURL(target, url, title, description, function(){
					cc.log("----邀请好友成功---");
					WXShare.getInstance().showSysTip("---邀请好友成功---");
					// tip.setVisible(false);
				});

				if(g_gameSocket.status != SOCKET_STATUS._SS_INVALID){
					g_gameSocket.close();
					cc.log("--------g_gameSocket.close()---------");
				}
				break;
			case "Button_ok":
				// 准备发送数据
				// 局数
				var Text_rounds = this.roundsSelected.getChildByName("Text_rounds");
				var iRounds = Text_rounds.tag;
				var Text_cards = Text_rounds.getChildByName("Text_cards");
				var iCards = Text_cards.tag;
				// 底分
				var iBaseScore = 1;
				if(this.baseScoreSelected.name!="CheckBox_baseScore_input"){
					var strBaseScoreName = this.baseScoreSelected.name;
					iBaseScore = Number(strBaseScoreName.substring(strBaseScoreName.lastIndexOf("_")+1,strBaseScoreName.length));
				}
				else{
					iBaseScore = this.baseScoreInput;
				}
				if(iBaseScore==0){
					DlgTip.openSysTip("请输入 底分 ！");
					return;
				}
                if(iBaseScore > 10){
                    DlgTip.openSysTip("底分不能超过10 ！");
                    return;
                }
					
				// 结算方式
				var strSettleName = this.settlementSelected.name;
				var SettleType = Number(strSettleName.substring(strSettleName.lastIndexOf("_")+1,strSettleName.length));

				cc.log("发送 开房 局数 "+iRounds+" 底分 "+iBaseScore+" 结算方式 "+SettleType+"--iCards-"+iCards);
				// 发送 开房
				var data = {
						dwRounds: iRounds,	// 局数
						dwBaseScore: iBaseScore,	// 底分
						settlementType: SettleType,// 结算方式
						roomCards: iCards,//房卡数
				};
				
				PlazaUIMgr.getInstance().onOpenRoom(data);
				break;
			default:
				break;
			}
		}
	},
	onCheckBoxEvent: function(sender, type){
		if (ccui.CheckBox.EVENT_SELECTED == type) {
			var setColor = function(node){
				var colore = cc.color(255,255,255,255);
				if(node.isSelected()){
					colore = cc.color(255,165,0,255);
				}
				
				node.children[0].setColor(colore);
				if(node.children[0].children.length>0){
					node.children[0].children[0].setColor(colore);
				}
			}
			// 选中
			var nodeName = sender.name;
			if(nodeName.search("rounds")>0){
				this.roundsSelected.setTouchEnabled(true);
				this.roundsSelected.setSelected(false);
				setColor(this.roundsSelected);
				
				sender.setTouchEnabled(false);
				setColor(sender);
				this.roundsSelected = sender;
			}
			else if(nodeName.search("baseScore")>0){
				this.baseScoreSelected.setTouchEnabled(true);
				this.baseScoreSelected.setSelected(false);
				setColor(this.baseScoreSelected);

				sender.setTouchEnabled(false);
				setColor(sender);
				this.baseScoreSelected = sender;
				
				if(nodeName.search("baseScore_input")>0){
					this.TextField_baseScore.setTouchEnabled(true);
				}
				else{
					this.TextField_baseScore.setTouchEnabled(false);
				}
			}
			else if(nodeName.search("settlementType")>0){
				this.settlementSelected.setTouchEnabled(true);
				this.settlementSelected.setSelected(false);
				setColor(this.settlementSelected);

				sender.setTouchEnabled(false);
				setColor(sender);
				this.settlementSelected = sender;
			}
		}
	},
	// //////////////////////////////////////////////////////////
});
