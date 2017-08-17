

DLG_CREATOR[ID_DlgTaskList] = function() {
	return new DlgTaskList();
};

var DlgTaskList = DlgBase.extend({
	ctor: function(){
		this.recordCount = 0;

		this.ptBegan = null;
		this._touchListener = null;
	},

	onCreate: function() {
		this.init();
	},

	onClose: function() {
		if(this._touchListener){
			cc.eventManager.removeListener(this._touchListener);
		}
	},

	init: function() {
		var json = ccs.load(res.dlgTaskList_json);
		this._rootWidget = json.node;

		//自适应屏幕大小
		var sizeDir = cc.director.getWinSize();
		this._rootWidget.setContentSize(sizeDir);
		ccui.helper.doLayout(this._rootWidget);

		this.ImgBg = this._rootWidget.getChildByName('ImgBg');

		this.BtnClose = this.ImgBg.getChildByName('BtnClose');
		this.BtnClose.setPressedActionEnabled(true);
		this.BtnClose.addTouchEventListener(this.onClickEvent, this);
		
		this.PanelList = this.ImgBg.getChildByName('PanelList');
		
		var size = this.PanelList.getSize();
		var tableView = new cc.TableView(this, size);
		tableView.setDirection(cc.SCROLLVIEW_DIRECTION_VERTICAL);
		tableView.setDelegate(this);
		tableView.setVerticalFillOrder(cc.TABLEVIEW_FILL_TOPDOWN);
		this.PanelList.addNode(tableView);
		this.tableView = tableView;

		this.addListenerTableViewTouch();
		
		this.reloadTaskList();
		
		this.addActionNodeMB(this.ImgBg);
	},

	onClickEvent: function(sender, type) {
		if (ccui.Widget.TOUCH_ENDED == type) {
			var strBtnName = sender.getName();
			cc.log('onClickEvent ' + strBtnName);
			switch (strBtnName) {
			case "BtnClose":
				UIMgr.getInstance().closeDlg(ID_DlgTaskList);
				break;
			default:
				break;
			}
		}
	},
	
	reloadTaskList: function(){
		var tasksPlaza = LoadTaskCfg.getInstance().getTasksPlaza();
		var tasks = LoadTaskCfg.getInstance().getTasks();
		
		this.recordCount = tasks.length + tasksPlaza.length;
		this.tableView.reloadData();
	},
	
	updateTaskState: function(){		
		var container = this.tableView.getContainer();
		var sizeContainer = this.tableView.getContentSize();
		var startX = container.x;
		var startY = container.y;

		this.tableView.reloadData();

		this.tableView.setContentOffset(cc.p(startX, startY), false);
	},
	
	//////////////////////////////////////////////////////////////////////////////////
	//监听tableView Touch事件
	addListenerTableViewTouch: function(){
		var listener = cc.EventListener.create({
			event: cc.EventListener.TOUCH_ONE_BY_ONE,
			swallowTouches: false,
			onTouchBegan: function (touch, event){
				if(this.tableView.isVisible()){
					var ptThouch = touch.getLocation();
					this.ptBegan = ptThouch;
				}

				return true;
			}.bind(this),
			onTouchMoved: function (touch, event){},
			onTouchEnded: function (touch, event){}
		});

		this._touchListener = listener;
		cc.eventManager.addListener(listener, this.tableView);
	},
	
	scrollViewDidScroll:function (view) {
	},
	scrollViewDidZoom:function (view) {
	},

	tableCellTouched:function (table, cell) {
		cc.log("cell touched at index: " + cell.getIdx());

		if(!this.ptBegan){
			return;
		}

		var index = cell.getIdx();

		var item = cell.getChildByTag(100);
		
		var BtnLook = item.getChildByName('BtnLook');
		var BtnStart = item.getChildByName('BtnStart');
		var BtnGet = item.getChildByName('BtnGet');

		var tasksPlaza = LoadTaskCfg.getInstance().getTasksPlaza();
		var tasks = LoadTaskCfg.getInstance().getTasks();

		//删除按钮
		var sizeDele = BtnLook.getSize();
		var rectDele = cc.rect(0, 0, sizeDele.width, sizeDele.height);
		var ptDele = BtnLook.convertToNodeSpace(this.ptBegan);
		var bContainDele = cc.rectContainsPoint(rectDele, ptDele);
		
		if(bContainDele){
			var BtnTemp = null;
			if(BtnLook.isVisible()){
				BtnTemp = BtnLook;
			}
			
			if(BtnStart.isVisible()){
				BtnTemp = BtnStart;
			}
			
			if(BtnGet.isVisible()){
				BtnTemp = BtnGet;
			}
			
			if(BtnTemp != null){
				cc.log('onClick btn');
				var seq = cc.Sequence.create(
						cc.scaleTo(0.05, 1.2),
						cc.scaleTo(0.05, 1),
						cc.CallFunc(function(){
							if(index < tasksPlaza.length){
								var info = tasksPlaza[index];
								var name = info['Name'];
								if(name == '每日签到'){
									PlazaUIMgr.getInstance().querySignInInfo();
									UIMgr.getInstance().closeDlg(ID_DlgTaskList);
								}else if(name == '在线礼包'){
									PlazaUIMgr.getInstance().queryTimingGiftInfo();
									UIMgr.getInstance().closeDlg(ID_DlgTaskList);
								}else if(name == '充值中心'){
									UIMgr.getInstance().openDlg(ID_DlgTopUp);
									UIMgr.getInstance().closeDlg(ID_DlgTaskList);
								}
							}else{
								var key = index - tasksPlaza.length;
								var info = tasks[key];
								var typeId = info['TypeId'];
								var gameKindId = info['GameKindId'];
								
								if(BtnTemp == BtnStart){
									PlazaUIMgr.getInstance().enterGame(gameKindId);
								}
								
								if(BtnTemp == BtnGet){
									LogonMsgHandler.getInstance().connect(function(){
										UserServerMsg.getInstance().sendGetRewards(typeId, gameKindId);
									});
								}
							}
						}, this)
				);
				BtnTemp.runAction(seq);
			}
		}
	},

	tableCellSizeForIndex:function (table, idx) {
		return cc.size(710, 130);
	},

	tableCellAtIndex:function (table, idx) {
		var index = idx.toFixed(0);
		var cell = table.dequeueCell();
		if (!cell) {
			cell = new cc.TableViewCell();
			var json = ccs.load(res.NodeTask_json);
			var node = json.node;
			node.x = 355;
			node.y = 65;
			cell.addChild(node, 0, 100);
		}

		var item =  cell.getChildByTag(100);
		
		var ImgIcon = item.getChildByName('ImgIcon');
		
		var BtnLook = item.getChildByName('BtnLook');
		BtnLook.setEnabled(false);
		BtnLook.setVisible(false);
		
		var BtnStart = item.getChildByName('BtnStart');
		BtnStart.setEnabled(false);
		BtnStart.setVisible(false);
		
		var BtnGet = item.getChildByName('BtnGet');
		BtnGet.setEnabled(false);
		BtnGet.setVisible(false);
		
		var LabName = item.getChildByName('LabName');
		
		var LabText = item.getChildByName('LabText');
		
		var LabProgres = item.getChildByName('LabProgres');
		LabProgres.string = '';
		
		var tasksPlaza = LoadTaskCfg.getInstance().getTasksPlaza();
		var tasks = LoadTaskCfg.getInstance().getTasks();
		
		//大厅功能
		if(index < tasksPlaza.length){
			var info = tasksPlaza[index];
			var name = info['Name'];
			var contents = info['Contents'];
			
			if(name == '每日签到'){
				ImgIcon.loadTexture("NodeTaskPlist/img_task_icon_signin.png", ccui.Widget.PLIST_TEXTURE);
			}else if(name == '在线礼包'){
				ImgIcon.loadTexture("NodeTaskPlist/img_task_icon_gift.png", ccui.Widget.PLIST_TEXTURE);
			}else if(name == '充值中心'){
				ImgIcon.loadTexture("NodeTaskPlist/img_task_icon_topup.png", ccui.Widget.PLIST_TEXTURE);
			}
			
			LabName.string = name;
			
			LabText.string = contents;
			
			BtnLook.setVisible(true);
		}else{
			var key = index - tasksPlaza.length;
			var info = tasks[key];
			var typeId = info['TypeId'];
			var name = info['Name'];
			var contents = info['Contents'];
			var gameKindId = info['GameKindId'];
			var data1 = info['Condition']['Data1'];
			
			if(gameKindId == 27){
				ImgIcon.loadTexture("NodeTaskPlist/img_task_icon_dznn.png", ccui.Widget.PLIST_TEXTURE);
			}else if(gameKindId == 28){
				ImgIcon.loadTexture("NodeTaskPlist/img_task_icon_tbnn.png", ccui.Widget.PLIST_TEXTURE);
			}else if(gameKindId == 104){
				ImgIcon.loadTexture("NodeTaskPlist/img_task_icon_brnn.png", ccui.Widget.PLIST_TEXTURE);
			}
			
			LabName.string = name;

			LabText.string = contents;
			
			var task = ClientData.getInstance().getTask();
			var taskInfo = task.getTaskInfo(typeId, gameKindId);
			if(taskInfo == null){
				if(typeId == 1001 || typeId == 1011){
					var strProgres = "局数(0/" + data1 + ")";
					LabProgres.string = strProgres;
					BtnStart.setVisible(true);
				}else{
					var strProgres = "未触发";
					LabProgres.string = strProgres;
				}
			}else{
				var flg = task.getTaskFlg(taskInfo);
				//游戏局数任务
				if(flg == 1){
					var strProgres = "";
					switch (taskInfo['taskState']) {
					case 0://无效
						strProgres = "无效任务";
						break;
					case 1://未接
						strProgres = "未触发";
						break;
					case 2://已接未完成
						strProgres = "局数(" + taskInfo['data1'] + "/" + data1 + ")";
						BtnStart.setVisible(true);
						break;
					case 3://完成未领奖
						strProgres = "完成未领奖";
						BtnGet.setVisible(true);
						break;
					case 4://完成已领奖
						strProgres = "完成已领奖";
						break;
					case 5://终止
						strProgres = "任务已终止";
						break;
					default:
						break;
					}

					LabProgres.string = strProgres;
				}				
			}			
		}

		return cell;
	},

	numberOfCellsInTableView:function (table) {
		return this.recordCount;
	},
	////////////////////////////////////////////////////////////
});