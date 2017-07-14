DLG_CREATOR[ID_DlgSignIn] = function() {
	return new DlgSignIn();
};

var DlgSignIn = DlgBase.extend({

	ctor: function(){
		this.dwSignInDays = new Array(31);
		this.dwSignInGiftList = new Array(31);

		for(var mum = 0;mum<31;mum++ ){
			this.dwSignInDays[mum] = 0;
			this.dwSignInGiftList[mum]=1;
		}
		this.ServerTime = 0;
		
	},

	onCreate: function() {
		this.init();
	},

	onClose: function() {

	},

	init: function() {
		this.str="每日签到~"
		cc.spriteFrameCache.addSpriteFrames(res.dlgSignPlist_plist);
		cc.spriteFrameCache.addSpriteFrames(res.dlgPublic_Plist);
		var json = ccs.load(res.dlgSignScene_json);
		this._rootWidget = json.node;

		//自适应屏幕大小
		var sizeDir = cc.director.getWinSize();
		this._rootWidget.setContentSize(sizeDir);
		ccui.helper.doLayout(this._rootWidget);

		this.Panel_background = this._rootWidget.getChildByName('Panel_signon');
		var Panel_Vbg = this._rootWidget.getChildByName('Panel_signon');
		Panel_Vbg.setPosition(cc.winSize.width / 2, cc.winSize.height / 2 );

		this.plaza_sign_back_2 = this._rootWidget.getChildByName('plaza_sign_back_2');

		this.sign_success = this.plaza_sign_back_2.getChildByName('sign_success');
		this.sign_success.setVisible(true);
		this.sign_success.setString(this.str);

		this.SignBtn = this.plaza_sign_back_2.getChildByName('Signing_btn1');
		this.SignBtn.setPressedActionEnabled(false);
		this.SignBtn.setTouchEnabled(false);

		this.Panel_signwordback =  this.plaza_sign_back_2.getChildByName('Panel_signwordback');

		this.Sign_listview = this.plaza_sign_back_2.getChildByName('Sign_listview');
		this.signDays = new Array();

		this.signDays[0]= this.Sign_listview.getChildByName('cell_sign0');
		for(var count= 0;count<30;count++){
			var str = "cell_sign0_"+count;
			this.signDays[count+1] = this.Sign_listview.getChildByName("cell_sign0_"+count);
		}
       
		//this.setNumberDaysStauts();
		this.SignBtn.addTouchEventListener(this.onClickdoSignDlg,this); 

		this.SignBtnBack = this.plaza_sign_back_2.getChildByName('Sign_return_btn1');
		this.SignBtnBack.setPressedActionEnabled(true);
		this.SignBtnBack.addTouchEventListener(this.onClickCloseSignDlg, this);
		this.addActionNodeMB(this.Panel_background);

	},

	
	setTitleForSignOk:function()
	{
		this.sign_success.setString("您今天已经签到啦~");
	},
	
	setNumberDaysStauts : function() {
		console.log("this.ServerTime"+ this.ServerTime);
		this.Sign_listview.jumpToPercentHorizontal(4.173*(this.ServerTime-1));
		console.log("############1111111 ");
		if(this.signDays){
			for(var num = 0;num<31;num ++){
				
				console.log("############1111111 ");
//				console.log("############ ");
//				console.log("dwSignInDays == "+ this.dwSignInDays[num]);
//				console.log("dwSignInGiftList == "+ this.dwSignInGiftList[num]);
//				console.log("             ");

				this.plaza_sign_wordback = this.signDays[num].getChildByName('plaza_sign_wordback_1');

				this.plaza_sign_nosback = this.plaza_sign_wordback.getChildByName('plaza_sign_nosback_1');

				this.plaza_sign_signedback = this.plaza_sign_nosback.getChildByName('plaza_sign_signedback_0');
				this.plaza_sign_todaywordback = this.plaza_sign_nosback.getChildByName('plaza_sign_todaywordback_1');
				this.plaza_sign_outtime = this.plaza_sign_nosback.getChildByName('plaza_sign_outtime');
				
				if(this.dwSignInDays[num] >0){//已签到
					
					console.log("############1222222 ");
				
					this.setTitleForSignOk();
					
					if(this.ServerTime == num+1){
						this.SignBtn.setEnabled(false);
						//this.sign_success.setVisible(true);
						//this.sign_success.setString(this.str);
						//this.sign_daily.setVisible(false);
						//console.log("怎么说"+sign_daily);
					}
					this.plaza_sign_signedback.setVisible(true);
					this.plaza_sign_todaywordback.setVisible(false);
					this.plaza_sign_outtime.setVisible(false);
					
				}
				else{
					if(this.ServerTime == num+1 && this.dwSignInGiftList[num]>1){//今天可签
						this.plaza_sign_signedback.setVisible(false);
						this.plaza_sign_todaywordback.setVisible(true);
						this.plaza_sign_outtime.setVisible(false);
						this.SignBtn.setPressedActionEnabled(true);
						this.SignBtn.setTouchEnabled(true);
					}
					else if(this.dwSignInGiftList[num]<1){//隐藏 this.signDays[count]
						this.signDays[num].setVisible(false);
					}
					else if(this.ServerTime > num+1){//过期
						this.plaza_sign_signedback.setVisible(false);
						this.plaza_sign_todaywordback.setVisible(false);
						this.plaza_sign_outtime.setVisible(true);
					}
					else{//还未到签到日期
						this.plaza_sign_signedback.setVisible(false);
						this.plaza_sign_todaywordback.setVisible(false);
						this.plaza_sign_outtime.setVisible(false);
					}

				}

				this.plaza_sign_goldenbeanback = this.plaza_sign_wordback.getChildByName('plaza_sign_goldenbeanback_1');
				this.Sign_giftcount = this.plaza_sign_goldenbeanback.getChildByName('Sign_giftcount1');
				this.Sign_giftcount.setString(this.dwSignInGiftList[num]);
				this.Sign_giftcount.setFontSize(24);//设置字体大小

			}
		}
	},

	
	setTextSuccessStatus:function (status) {
		cc.log("dwd"+status);
		if(status){
			//this.str="父亲写的散文诗"
			this.sign_success.setVisible(status);
			}
        
    },
	setSomeDayStauts: function(day) {
		if(day >0){
			console.log("今天是"+day+"号，已经签到成功");
			var plaza_sign_wordback = this.signDays[day-1].getChildByName('plaza_sign_wordback_1');

			var plaza_sign_nosback = plaza_sign_wordback.getChildByName('plaza_sign_nosback_1');

			var plaza_sign_signedback = plaza_sign_nosback.getChildByName('plaza_sign_signedback_0');
			var plaza_sign_todaywordback = plaza_sign_nosback.getChildByName('plaza_sign_todaywordback_1');
			var plaza_sign_outtime = plaza_sign_nosback.getChildByName('plaza_sign_outtime');
			plaza_sign_signedback.setVisible(true);
			plaza_sign_todaywordback.setVisible(false);
			plaza_sign_outtime.setVisible(false);
			this.SignBtn.setEnabled(false);
			this.SignBtn.setTouchEnabled(false);
			
			
		}	
	},
	onClickCloseSignDlg: function(sender,type) {
		if (ccui.Widget.TOUCH_ENDED == type){
			console.log("onClickCloseSignDlg TOUCH_BEGAN == "+ type);
			UIMgr.getInstance().closeDlg(ID_DlgSignIn);
		}

	},
	onClickdoSignDlg: function(sender,type) {
		var strBtnName = sender.getName();
		console.log('onClickEvent ' + strBtnName);

		var machineId = LocalStorageMgr.getInstance().getUuidItem();
		var data = {
				dwUserID: g_objHero.getUserId(),
				cbDeviceType: DEVICE_TYPE,
				szMachineID: machineId
		};
		console.log('ID ' + data.dwUserID);
		console.log('Type' + data.cbDeviceType);
		console.log('machineId' + data.szMachineID);

		LogonMsgHandler.getInstance().connect(function(){
			SignInMsg.getInstance().sendSignIn(data);
		});

	}

});
