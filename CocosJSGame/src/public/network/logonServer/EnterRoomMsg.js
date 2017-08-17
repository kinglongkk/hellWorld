/*
 * 加入房间 网络接口
 * Author: 	xjn 
 * Date:	2017.4.1
 * 
 * 功能：
 * 发送查询房间接口 sendSearchRoom(data)
 * 处理查询结果
 * */

var g_enterRoomMsg = null;
var EnterRoomMsg = cc.Class.extend({

	ctor: function(){},
	
	onMsgMainPCMBEnterRoom: function(subCmd, data){
		
		switch (subCmd) {
		//查询房间结果
		case SUB_MB_SEARCH_RESULT:
			this.onSubSearchResult(data);
			break;
		default:
			break;
		}
	},

	//请求房间列表结果
	onGetPublicRoomListResult: function(data){
        cc.log("请求房间列表结果 data = " + JSON.stringify(data));
        PlazaUIMgr.getInstance().getPublicRoomListResult(data);
	},

    //查询房间结果
    onSubMatchResult: function(data){
        //查询失败  提示 房间ID不存在  请重新输入
        DlgTip.openSysTip("加入匹配成功", function(target){
            target.closeTip();
        });
    },

    //快速加入匹配
    onQuickMatchOk: function(data){
        cc.log("快速加入匹配parseData = " + JSON.stringify(data));
        var countDownTimes = data.MatchTime;

        showWaiting(true, countDownTimes, "游戏匹配中...");
    },

	//查询房间结果
	onSubSearchResult: function(data){
        showWaiting(false);
		cc.log("查询房间结果parseData = " + JSON.stringify(data));
		if (data.TableID == INVALID_TABLE) {
            //查询失败  提示 房间ID不存在  请重新输入
            DlgTip.openSysTip(" 没有匹配到房间,请稍后再试", function(target){
                target.closeTip();
            });

            PlazaUIMgr.getInstance().onEnterRoomResult(false);
		}else if(data.ServerIP == ""){
			//查询失败  提示 房间ID不存在  请重新输入
			DlgTip.openSysTip(" 房间ID不存在  请重新输入", function(target){
				target.closeTip();
			});
			
			PlazaUIMgr.getInstance().onEnterRoomResult(false);
		}
		else{
			//查询成功 
			cc.log("查询成功 " + JSON.stringify(data));
			cc.log("查询成功 TableId-----"+data.TableID);
			
			//是否是当前游戏的房间
			var plaza = ClientData.getInstance().getPlaza();
			if(data.KindID)
            	plaza.setCurKindID(data.KindID);
			// var kindId = plaza.getCurKindID();
			// var listServer = plaza.getListServerByKindID(kindId);
			// var roomServerInfo = listServer[0];
			//g_objHero.setTableId(data.TableID);
			PlazaUIMgr.getInstance().onEnterRoomResult(true, data.ServerIP);
		}

	}
});

EnterRoomMsg.getInstance = function(){
	if(g_enterRoomMsg == null){
		g_enterRoomMsg = new EnterRoomMsg();
	}
	return g_enterRoomMsg;
}