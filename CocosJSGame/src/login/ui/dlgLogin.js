/*
 * 登录界面
 * Author: 	xjn 
 * Date:	2017.4.1
 * 
 * 功能：
 * 	登录界面控件 交互
 * */
DLG_CREATOR[ID_DlgLogin] = function() {
    return new DlgLogin();
};

var DlgLogin = DlgBase.extend({
    ctor: function () {
    },

    onCreate: function() {
        this.init();
    },

    onClose: function() {

    },

    init: function(){
        var json = ccs.load(res.LoginScene_json);
        this._rootWidget = json.node;

        //自适应屏幕大小
        var sizeDir = cc.director.getWinSize();
        this._rootWidget.setContentSize(sizeDir);
        ccui.helper.doLayout(this._rootWidget);

        this.login_mainLayer = this._rootWidget.getChildByName('login_mainLayer');
        this.login_btnWx = this.login_mainLayer.getChildByName('login_btnWx');
        this.login_btnWx.addTouchEventListener(this.onClickWxLogin, this);

        this.login_buttomLayer = this.login_mainLayer.getChildByName('login_buttomLayer');
        this.Text_tip = this.login_buttomLayer.getChildByName('Text_tip');
        this.Text_company = this.login_buttomLayer.getChildByName('Text_company');
        this.Text_approval = this.login_buttomLayer.getChildByName('Text_approval');

        this.Text_tip.setFontSize(32);
        this.Text_company.setFontSize(28);
        this.Text_approval.setFontSize(28);
        this.Text_tip.setScale(1);
        this.Text_company.setScale(1);
        this.Text_approval.setScale(1);
        var password = LocalStorageMgr.getInstance()._locarStorage.getItem("_passwd_")
        var account = LocalStorageMgr.getInstance()._locarStorage.getItem("_account_")

        this.EditAccount = this.login_mainLayer.getChildByName('TextField_account');
        this.EditPassword = this.login_mainLayer.getChildByName('TextField_password');
        cc.log("_locarStorage  accoutn ", account, password)
        this.EditAccount.setString(account)
        this.EditPassword.setString(password)

//		var rootWidget = this._rootWidget;
//		var spineBoy = new sp.SkeletonAnimation('res/dxclian1.json', 'res/dxclian1_tex.atlas');
//		spineBoy.setPosition(cc.p(sizeDir.width / 2, sizeDir.height / 2 - 150));
//		spineBoy.setMix('walk', 'jump', 0.2);
//		spineBoy.setMix('jump', 'run', 0.2);
//		spineBoy.setAnimation(0, 'flycl', true);
//		//spineBoy.setAnimationListener(this, this.animationStateEvent);
//		//spineBoy.setScale(0.5);
//		rootWidget.addChild(spineBoy, 4);

//		var handler1 = function(Armature, MovementEventType, name){
//			if(MovementEventType == ccs.MovementEventType.complete){
//				cc.log("Complete...");
//			}
//		}
//		
//		var rootWidget = this._rootWidget;
//		var callback = function(percent){
//			if(percent == 1){
//				var armture = ccs.Armature.create("bear");
//				armture.setPosition(cc.p(sizeDir.width-200,sizeDir.height-200));
//				armture.setAnchorPoint(cc.p(0,0));
//				armture.getAnimation().setMovementEventCallFunc(handler1);
//				armture.getAnimation().playWithIndex(0,0,1);
//				rootWidget.addChild(armture);
//			}
//			
//		}
//
//		var armatureDataManager = ccs.ArmatureDataManager.getInstance();
//		armatureDataManager.addArmatureFileInfoAsync("res/login/bear0.png", "res/login/bear0.plist", "res/login/bear.ExportJson",callback, this);

    },

    onExit : function () {
        this._super();
    },

    onClickWxLogin: function(sender, type) {
        switch (type) {
            case ccui.Widget.TOUCH_BEGAN:
                SoundMgr.getInstance().playMusic("button_press",0,false);
                break;
            case ccui.Widget.TOUCH_MOVED:
                break;
            case ccui.Widget.TOUCH_ENDED:
                //acounts test
                var account = this.EditAccount.string;
                var password = this.EditPassword.string;

                if(account === "" || password === ""){
                    DlgTip.openSysTip("账号、密码不能为空！");
                    return;
                }
                cc.log("1111111111111 ", password, account)
                LocalStorageMgr.getInstance()._locarStorage.setItem("_passwd_", password)
                LocalStorageMgr.getInstance()._locarStorage.setItem("_account_", account)
                LoginSceneUIMgr.getInstance().sendLogon(account, password);
                if(cc.sys.os == cc.sys.OS_WINDOWS){
                    //LoginSceneUIMgr.getInstance().sendLogon("jiangweilian888", "j12345678");
                    //LoginSceneUIMgr.getInstance().sendLogon("jiangweilian999", "j12345678");
                    //LoginSceneUIMgr.getInstance().sendLogon("huaifeng1", "j12345678");//.1.37
                    // LoginSceneUIMgr.getInstance().sendLogon("tang002", "a123456");//.1.37
                    //LoginRegisterMsg.getInstance().sendMBRegister("tang002", "a123456");

                    //return;
//				var account = this.EditAccount.string;
//				var password = this.EditPassword.string;
//
//				if(account == "" || password == ""){
//					DlgTip.openSysTip("账号、密码不能为空！");
//					return;
//				}
//                cc.log("1111111111111 ", password, account)
//                LocalStorageMgr.getInstance()._locarStorage.setItem("_passwd_", password)
//                LocalStorageMgr.getInstance()._locarStorage.setItem("_account_", account)
//				LoginSceneUIMgr.getInstance().sendLogon(account, password);

                }
                else{

                    if(cc.sys.isNative){
                        cc.log('onClickWxLogin');
                        gg.WxSdkMgr.getInstance().sendWxLogin();
                    }
                    cc.log("BtnLoginWX - open");

                    //LoginSceneUIMgr.getInstance().sendLogon("huaifeng1", "j12345678");//.1.37
                }

                //LoginSceneUIMgr.getInstance().sendLogon("jiangweilian888", "j12345678");
                //LoginSceneUIMgr.getInstance().sendLogon("jiangweilian999", "j12345678");
                //LoginSceneUIMgr.getInstance().sendLogon("huaifeng1", "j12345678");//.1.37

                break;
            default:
                break;
        }
    }
});
