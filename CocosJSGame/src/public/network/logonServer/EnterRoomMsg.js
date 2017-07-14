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
		showWaiting(false);
		
		switch (subCmd) {
		//查询房间结果
		case SUB_MB_SEARCH_RESULT:
			this.onSubSearchResult(data);
			break;
		default:
			break;
		}
	},

	//查询房间结果
	onSubSearchResult: function(data){
		cc.log("查询房间结果parseData = " + JSON.stringify(data));
		if(data.ServerID == 0){
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
			var kindId = plaza.getCurKindID();
			var listServer = plaza.getListServerByKindID(kindId);
			var roomServerInfo = listServer[0];
			g_objHero.setTableId(data.TableID);
			PlazaUIMgr.getInstance().onEnterRoomResult(true, data.ServerIP);
		}
        //关闭连接
        //LogonMsgHandler.getInstance().close();
	},
});

EnterRoomMsg.getInstance = function(){
	if(g_enterRoomMsg == null){
		g_enterRoomMsg = new EnterRoomMsg();
	}
	return g_enterRoomMsg;
}