/*
 * LoginSceneUIMgr
 * Author: 	xjn 
 * Date:	2017.4.1
 * 
 * 功能：
 * 登录界面 操作支持
 * 
 * */
var s_sharedLoginSceneUIMgr = null;

var LoginSceneUIMgr = SceneUIMgr.extend({

	startGame: function () {
		cc.log("startGame");
		cc.log("this._bInit = " + this._bInit);
		if(!this._bInit){
			return;
		}
		
		UIMgr.getInstance().openDlg(ID_DlgLogin);
	},
	
	getName: function(){
		cc.log("###name : LoginSceneUIMgr!");
	},
	
	//connect failure
	onConnectFailure: function(){
		if(!this._bInit){
			return;
		}
		
		UIMgr.getInstance().closeDlg(ID_DlgLoader);
		
		var dlgLogin = UIMgr.getInstance().getDlg(ID_DlgLogin);
		var dlgRegister = UIMgr.getInstance().getDlg(ID_DlgRegister);
		
		if(!dlgLogin && !dlgRegister){
			UIMgr.getInstance().openDlg(ID_DlgLogin);
		}
	},
	
	sendLogon: function(account, password){
		if(!this._bInit){
			return;
		}

		g_objHero.loginType = 0;
		ClientData.getInstance().setCurAccountInfo(account, password);
		var md5Pass = CryptoUtil.md5(password);
		g_objHero.setAccount(account);
		g_objHero.setMd5Pass(md5Pass);
		this.sendLogonMsg(account, md5Pass);
		
	},

	sendLogonMsg: function(account, md5Pass){
		if(!this._bInit){
			return;
		}
		
		//加载界面
		UIMgr.getInstance().openDlg(ID_DlgLoader);
		var dlgLoader = UIMgr.getInstance().getDlg(ID_DlgLoader);
		if(dlgLoader){
			dlgLoader.setProgress(25);

			dlgLoader.setFinishCallBack(function(){
				dlgLoader.setTimeOutCallBack(function(){});
				UIMgr.getInstance().closeDlg(ID_DlgLoader);
				
				if(cc.sys.isNative) {
                    var scene = new cc.TransitionPageTurn(0.5, new PlazaScene(), false);
                    cc.director.runScene(scene);
				}
				else{
                    cc.director.runScene(new PlazaScene());
				}
			}.bind(this));

			dlgLoader.setTimeOutCallBack(function(){
				DlgTip.openTip(DLG_TIP_CFG.LOGON_OUT_TIME, function(target){
					UIMgr.getInstance().openDlg(ID_DlgLogin);
					target.closeTip();
				});
			}, 20);
		}
		
		//发送登录消息
		cc.log("正在登录。。。。。。。。。。。。");
		LogonMsgHandler.getInstance().connect(function(){
			LoginRegisterMsg.getInstance().sendLogon(account, md5Pass);
		});
	},
	
	onLogonResult: function(bResult){
		var curAccountInfo = ClientData.getInstance().getCurAccountInfo();
			ClientData.getInstance().saveRecordLogn(curAccountInfo.account, curAccountInfo.password);
		
		var dlgLogin = UIMgr.getInstance().getDlg(ID_DlgLogin);
		if(dlgLogin){
			//dlgLogin.setBtnLoginEnabled(true);
		}

		if(bResult){
			UIMgr.getInstance().closeDlg(ID_DlgLogin);

			/*//记录
			var curAccountInfo = ClientData.getInstance().getCurAccountInfo();    		

			//var md5Pass = CryptoUtil.md5(curAccountInfo.password);
			g_objHero.setAccount(curAccountInfo.account);
		
			g_objHero.setMd5Pass(curAccountInfo.password);*/
				

			var dlgLoader = UIMgr.getInstance().getDlg(ID_DlgLoader);
			if(dlgLoader){
				dlgLoader.setProgress(50);
			}
		}else{
			UIMgr.getInstance().closeDlg(ID_DlgLoader);
		}
	},
	
	onListServer: function(){
		var dlgLoader = UIMgr.getInstance().getDlg(ID_DlgLoader);
		if(dlgLoader){
			dlgLoader.setProgress(75);
		}
	},
	
	onListFinish: function(){
		var dlgLoader = UIMgr.getInstance().getDlg(ID_DlgLoader);
		if(dlgLoader){
			dlgLoader.setProgress(100);
		}
	},
});

LoginSceneUIMgr.getInstance = function() {
	if (!s_sharedLoginSceneUIMgr) {
		s_sharedLoginSceneUIMgr = new LoginSceneUIMgr();
	}
	return s_sharedLoginSceneUIMgr;
};
