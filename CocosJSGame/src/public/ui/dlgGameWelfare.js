DLG_CREATOR[ID_DlgGameWelfare] = function() {
	cc.log("DLG_CREATOR[ID_DlgGameWelfare]");
	return new DlgGameWelfare();
};

var DlgGameWelfare = DlgBase.extend({
	ctor: function(){
	},

	onCreate: function() {
		this.init();
	},

	onClose: function() {

	},

	init: function() {
		var json = ccs.load(res.dlgWelfareScene_json);
		this._rootWidget = json.node;

		//自适应屏幕大小
		var sizeDir = cc.director.getWinSize();
		this._rootWidget.setContentSize(sizeDir);
		ccui.helper.doLayout(this._rootWidget);
		
		this._rootWidget.setGlobalZOrder(100);

		this.Panel_root = this._rootWidget.getChildByName('Panel_root');
        this.Panel_root.addTouchEventListener(this.onClickClose, this);
        var Button_close = this.Panel_root.getChildByName('Button_close');
        Button_close.addTouchEventListener(this.onClickClose, this);

        this.ListView_task = this.Panel_root.getChildByName('ListView_task');
        this.Panel_taskTemp = this.Panel_root.getChildByName('Panel_taskTemp');

        //加载任务配置
		this.taskCfg = LoadTaskCfg.getInstance().getTaskCfg();
		//初始化任务列表
		//this.doReFreshTaskList();
        UserServerMsg.getInstance().sendC2L_ReqTimesInfo();
        showWaiting(true);
	},

    doGetTaskInfo: function(data){
        // DayTimes  map[int]int64 //每日次数信息
        // Times     map[int]int64 //永久次数信息
        // WeekTimes map[int]int64 //周次数信息
        for(var key in data.DayTimes){
            var taskInfo = this.taskCfg["taskID_"+key];
            taskInfo.taskStatus = data.DayTimes[key]+1;
        }
        for(var key in data.Times){
            var taskInfo = this.taskCfg["taskID_"+key];
            taskInfo.taskStatus = data.Times[key]+1;
        }
        for(var key in data.WeekTimes){
            var taskInfo = this.taskCfg["taskID_"+key];
            taskInfo.taskStatus = data.WeekTimes[key]+1;
        }

        //每日分享检测
        var lastShareTime = LocalStorageMgr.getInstance().getShareEveryDay();
        var newDate = new Date();
        newDate.setTime(lastShareTime);
        var lastYear = newDate.getFullYear();
        var lastMonth = newDate.getMonth();
        var lastDay = newDate.getDate();

        var curLocalTime = Date.parse(new Date());
        newDate.setTime(curLocalTime);
        var curYear = newDate.getFullYear();
        var curMonth = newDate.getMonth();
        var curDay = newDate.getDate();
        var taskInfo = this.taskCfg["taskID_1"];
        if(taskInfo.taskStatus==0 && curYear==lastYear && curMonth==lastMonth && curDay==lastDay){
            taskInfo.taskStatus=1;
        }

        //首次分享
        var isShared = LocalStorageMgr.getInstance().getShareFirst();
        taskInfo = this.taskCfg["taskID_5"];
        if(taskInfo.taskStatus==0 && isShared==true){
            taskInfo.taskStatus=1;
        }

        this.doReFreshTaskList();
        showWaiting(false);
    },

// {
//     //任务ID 作为KEY
//     "taskID_1000":{
//     "taskType":0,//任务类型1...9
//         "taskIcon":"",//任务图标
//         "taskTitleIcon":"",//标题图标
//         "taskExplain":"",//任务说明
//         "taskStatus":0,//0:未完成 1：已完成  2：已领取
//         "operation":{
//         "btnTexture":"",//操作按钮纹理
//             "textTexture":"",//操作按钮文字纹理
//             "toDlgID":1000//跳转的界面ID
//     }
// },
// }
	doReFreshTaskList: function(){
	    cc.log("this.taskCfg length-------"+this.taskCfg.length);
		for(var key in this.taskCfg){
            var taskID = Number(key.replace("taskID_",""));
            var taskInfo = this.taskCfg[key];

			var item = this.Panel_taskTemp.clone();
            item.setName(String(taskID));

			var Image_typeIcon = item.getChildByName("Image_typeIcon");
            var Image_typeTitle = item.getChildByName("Image_typeTitle");
            var Text_content = item.getChildByName("Text_content");
            Image_typeIcon.loadTexture(taskInfo.taskIcon, ccui.Widget.PLIST_TEXTURE);
            Image_typeTitle.loadTexture(taskInfo.taskTitleIcon, ccui.Widget.PLIST_TEXTURE);
            Text_content.string = taskInfo.taskExplain;

            var Button_operation = item.getChildByName("Button_operation");
            var Image_operationText = Button_operation.getChildByName("Image_operationText");
            Button_operation.addTouchEventListener(this.onOperationEvent, this);
            var taskStatus = taskInfo.taskStatus;
            if(taskStatus==2){
                //已领取  按钮不可用，变灰
                Button_operation.loadTextureNormal("default/dating0088a.png", ccui.Widget.PLIST_TEXTURE);
                Image_operationText.loadTexture("default/dating0088c.png", ccui.Widget.PLIST_TEXTURE);
                Button_operation.setTouchEnabled(false);
            }
            else if(taskStatus==1){
                //已完成
                Button_operation.loadTextureNormal("default/dating0088.png", ccui.Widget.PLIST_TEXTURE);
                Image_operationText.loadTexture("default/dating0088b.png", ccui.Widget.PLIST_TEXTURE);
            }
            else{
                //
                Button_operation.loadTextureNormal(taskInfo.operation.btnTexture, ccui.Widget.PLIST_TEXTURE);
                Image_operationText.loadTexture(taskInfo.operation.textTexture, ccui.Widget.PLIST_TEXTURE);
            }

            item.setVisible(true);
            this.ListView_task.pushBackCustomItem(item);
		}
	},
    onOperationEvent: function(sender, type){
        if (ccui.Widget.TOUCH_ENDED == type) {
            var parent = sender.getParent();
            var parentName = parent.getName();
            var taskInfo = this.taskCfg["taskID_"+parentName];
            var taskStatus = taskInfo.taskStatus;
            if(taskStatus==0){
            	//未完成，获取前往的界面ID 打开
                var sucessCB = function(){
                    taskInfo.taskStatus = 1;
                    sender.loadTextureNormal("default/dating0088.png", ccui.Widget.PLIST_TEXTURE);
                    sender.getChildByName("Image_operationText").loadTexture("default/dating0088b.png", ccui.Widget.PLIST_TEXTURE);
                };

                switch(Number(parentName)){
                    case 1:{
                        //每日分享
                        var dlgShare = UIMgr.getInstance().openDlg(ID_DlgGameShare);
                        dlgShare.shareSet(null, function(){
                            taskInfo.taskStatus = 1;
                            sender.loadTextureNormal("default/dating0088.png", ccui.Widget.PLIST_TEXTURE);
                            sender.getChildByName("Image_operationText").loadTexture("default/dating0088b.png", ccui.Widget.PLIST_TEXTURE);

                            //记录每日分享
                            LocalStorageMgr.getInstance().setShareEveryDay();
                        });
                        break;
                    }
                    case 5:{
                        //首次分享
                        var dlgShare = UIMgr.getInstance().openDlg(ID_DlgGameShare);
                        dlgShare.shareSet(null, function(){
                            taskInfo.taskStatus = 1;
                            sender.loadTextureNormal("default/dating0088.png", ccui.Widget.PLIST_TEXTURE);
                            sender.getChildByName("Image_operationText").loadTexture("default/dating0088b.png", ccui.Widget.PLIST_TEXTURE);

                            //记录首次分享
                            LocalStorageMgr.getInstance().setShareFirst(true);
                        });
                        break;
                    }
                    case 3:{
                        //绑定手机
                        openBindPhone(sucessCB);
                        break;
                    }
                    case 4:{
                        //设置推荐人
                        openSetRecommender(sucessCB);
                        break;
                    }
                    default:
                        DlgTip.openSysTip("功能未开放，敬请期待...");
                        break;
                }

			}
			else if(taskStatus==1){
            	//已完成未领取 发送领取奖励
                if(this.getRewardCB==null){
                    this.getRewardCB = function(){
                        sender.loadTextureNormal("default/dating0088a.png", ccui.Widget.PLIST_TEXTURE);
                        sender.getChildByName("Image_operationText").loadTexture("default/dating0088c.png", ccui.Widget.PLIST_TEXTURE);
                        sender.setTouchEnabled(false);
                        taskInfo.taskStatus = 2;
                    }
                }
                UserServerMsg.getInstance().sendGetRewards(Number(parentName));
                cc.log("领取奖励...");
			}
        }
	},
    onClickClose: function(sender, type) {
        if (ccui.Widget.TOUCH_ENDED == type) {
            UIMgr.getInstance().closeDlg(ID_DlgGameWelfare);
        }
    }
});
