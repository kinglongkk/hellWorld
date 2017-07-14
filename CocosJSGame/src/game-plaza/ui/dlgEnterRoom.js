/*
 *加入房间界面
 * Author: 	xjn 
 * Date:	2017.4.1
 * 
 * 功能：
 * 加入房间界面控件交互
 * */
DLG_CREATOR[ID_DlgEnterRoom] = function() {
	return new DlgEnterRoom();
};

var DlgEnterRoom = DlgBase.extend({
	ctor: function(){
		this.strRoomNum = "";
	},

	onCreate: function() {
		this.init();
	},

	onClose: function() {
	},

	init: function() {
		var json = ccs.load(res.dlgEnterRoomScene_json);
		this._rootWidget = json.node;

		//自适应屏幕大小
		var sizeDir = cc.director.getWinSize();
		this._rootWidget.setContentSize(sizeDir);
		ccui.helper.doLayout(this._rootWidget);
		
		this.Panel_root = this._rootWidget.getChildByName("Panel_root");
		this.Panel_root.addTouchEventListener(function(sender, type){
			if (ccui.Widget.TOUCH_ENDED == type) {
				UIMgr.getInstance().closeDlg(ID_DlgEnterRoom, false)
			}
		}, this);
		
		//输入号码
		this.AtlasLabel_input = this.Panel_root.getChildByName("AtlasLabel_input");
		this.AtlasLabel_input.string = "";
		
		//输入提示
		this.TextField_inPutTip = this.Panel_root.getChildByName("TextField_inPutTip");
		this.TextField_inPutTip.setVisible(true);
		
		//面板按钮回调
		var children = this.Panel_root.children;
		for (var index = 4; index < children.length; ++index) {
			children[index].addTouchEventListener(this.onClickEvent, this);
		}
		
		this.strRoomNum = "";
	},
	doClear: function(){
		//清除
		this.strRoomNum = "";
		this.AtlasLabel_input.setString(this.strRoomNum);
		var size = this.AtlasLabel_input.getContentSize();
		this.AtlasLabel_input.setContentSize(cc.size(0, 56));
		this.TextField_inPutTip.setVisible(true);
	},
	onClickEvent: function(sender, type) {
		if (ccui.Widget.TOUCH_ENDED == type) {
			var strBtnName = sender.getName();
			cc.log('onClickEvent ' + strBtnName);
			switch (strBtnName) {
			case "Button_clear":
				this.doClear();
				break;
			case "Button_del":
				//回删
				var counts = this.strRoomNum.length;
				if(counts>0){
					this.strRoomNum = this.strRoomNum.substring(0, counts-1);
					var size = this.AtlasLabel_input.getContentSize();
					size.width = size.width-48;
					this.AtlasLabel_input.setContentSize(cc.size(size.width, 56));
					this.AtlasLabel_input.setString(this.strRoomNum);
					if(counts==1){
						this.TextField_inPutTip.setVisible(true);
					}
				}
				break;
			default:
				//0-9按键
				if(this.strRoomNum.length==6){
					break;
				}
			
				var AtlasLabel_num = sender.getChildByName("AtlasLabel_num");
				this.strRoomNum = this.strRoomNum+AtlasLabel_num.string;
				this.AtlasLabel_input.setString(this.strRoomNum);
				var size = this.AtlasLabel_input.getContentSize();
				size.width = size.width+48;
				this.AtlasLabel_input.setContentSize(cc.size(size.width, 56));
				this.TextField_inPutTip.setVisible(false);
				
				if(this.strRoomNum.length==6){
					PlazaUIMgr.getInstance().onEnterRoom(this.strRoomNum);
					
//					var plaza = ClientData.getInstance().getPlaza();
//					plaza.setRoomOpType(ROOM_OPERATION_ADD);
//					var kindId = plaza.getCurKindID();
//					var listServer = plaza.getListServerByKindID(kindId);
//					var roomServerInfo = listServer[0];
//
//					var room = ClientData.getInstance().getRoom();
//					if(room){
//						room.setCurServer(roomServerInfo);
//					}
//
//					var ip = roomServerInfo.szServerAddr;
//					var port = roomServerInfo.wServerPort;
//
//					PlazaUIMgr.getInstance().connectGameServer(ip, port);
				}
				break;
			}
		}
	},
});