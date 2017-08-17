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
        this.checkBox = this.login_mainLayer.getChildByName('CheckBox_xieyi');
        this.checkBox.addEventListener(this.onCheckBoxEvent, this);
        this.isAgree = false;

        this.Image_tip = this.login_mainLayer.getChildByName('Image_tip');

        this.Button_toXieYi = this.login_mainLayer.getChildByName('Image_xieYiBg').getChildByName('Button_toXieYi');
        this.Button_toXieYi.addTouchEventListener(this.onClickToXieYi, this);

        this.login_buttomLayer = this.login_mainLayer.getChildByName('login_buttomLayer');
        this.Text_company = this.login_buttomLayer.getChildByName('Text_company');
        this.Text_approval = this.login_buttomLayer.getChildByName('Text_approval');

        this.Text_company.setFontSize(28);
        this.Text_approval.setFontSize(28);
        this.Text_company.setScale(1);
        this.Text_approval.setScale(1);

        this.Panel_xieyi = this._rootWidget.getChildByName('Panel_xieyi');
        this.Button_ok = this.Panel_xieyi.getChildByName('Button_ok');
        this.Button_ok.addTouchEventListener(this.onClickXieYiOK, this);
        this.ListView_text = this.Panel_xieyi.getChildByName('ListView_text');
        this.Text_content = this.ListView_text.getChildByName('Text_content');

        var password = LocalStorageMgr.getInstance()._locarStorage.getItem("_passwd_");
        var account = LocalStorageMgr.getInstance()._locarStorage.getItem("_account_");

        this.EditAccount = new ccui.TextField("input words here", "Thonburi", 24);
        this.EditPassword = new ccui.TextField("input words here", "Thonburi", 24);
        this.EditAccount.setColor(new cc.color(127,127,127));
        this.EditPassword.setColor(new cc.color(127,127,127));
        this.EditAccount.setPosition(cc.p(50, 500));
        this.EditPassword.setPosition(cc.p(250, 500));

        this.login_mainLayer.addChild(this.EditAccount);
        this.login_mainLayer.addChild(this.EditPassword);

        cc.log("_locarStorage  accoutn ", account, password);
        this.EditAccount.setString(account);
        this.EditPassword.setString(password);


    },

    onExit : function () {
        this._super();
    },
    onClickToXieYi: function(sender, type) {
        if(type==ccui.Widget.TOUCH_ENDED){
            this.Panel_xieyi.setVisible(true);
            //加载协议配置
            var xieYiConfig = LoadXieYiCfg.getInstance().getXieYiContent();
            cc.log(xieYiConfig);
            this.Text_content.string = xieYiConfig;
            var arrStr = xieYiConfig.split("\n");
            this.Text_content.setContentSize(cc.size(775.00,arrStr.length*25));

            this.ListView_text.refreshView();
        }
    },
    onClickWxLogin: function(sender, type) {
        switch (type) {
            case ccui.Widget.TOUCH_BEGAN:
                SoundMgr.getInstance().playMusic("button_press",0,false);
                break;
            case ccui.Widget.TOUCH_MOVED:
                break;
            case ccui.Widget.TOUCH_ENDED:

                if(!this.isAgree){
                    if(this.Image_tip.isVisible())
                        return;

                    //提示查看协议
                    var action=[];
                    var delay = cc.DelayTime(3);
                    var Image_tip = this.Image_tip;
                    var run=cc.CallFunc(function(){
                        Image_tip.setVisible(false);
                    },this);
                    action.push(delay);
                    action.push(run);

                    this.Image_tip.runAction(cc.Sequence(action));
                    this.Image_tip.setVisible(true);

                    // return;
                }

                var account = this.EditAccount.string;
                var password = this.EditPassword.string;

                if(account === "" || password === ""){
                    DlgTip.openSysTip("账号、密码不能为空！");
                    return;
                }
                cc.log("1111111111111 ", password, account);
                LocalStorageMgr.getInstance()._locarStorage.setItem("_passwd_", password);
                LocalStorageMgr.getInstance()._locarStorage.setItem("_account_", account);
                LoginSceneUIMgr.getInstance().sendLogon(account, password);

                //acounts test
                if(cc.sys.os == cc.sys.OS_WINDOWS){
                    // LoginSceneUIMgr.getInstance().sendLogon("sd1", "123456");//.1.37
                    // LoginSceneUIMgr.getInstance().sendLogon("sd2", "123456");//.1.37
                    // LoginSceneUIMgr.getInstance().sendLogon("sd3", "123456");//.1.37
                    // LoginSceneUIMgr.getInstance().sendLogon("sd4", "123456");//.1.37
                    // LoginSceneUIMgr.getInstance().sendLogon("sd5", "123456");//.1.37

                    // LoginSceneUIMgr.getInstance().sendLogon("xm1", "123456");//.1.37
                    // LoginSceneUIMgr.getInstance().sendLogon("xm2", "123456");//.1.37
                    // LoginSceneUIMgr.getInstance().sendLogon("xm3", "123456");//.1.37
                    // LoginSceneUIMgr.getInstance().sendLogon("xm4", "123456");//.1.37
                    // LoginSceneUIMgr.getInstance().sendLogon("xm5", "123456");//.1.37
//				LogonMsgHandler.getInstance().connect(function(){
//					LoginRegisterMsg.getInstance().sendMBRegister("huaifeng1", "j12345678");
//				});
                }
                else{

//				if(cc.sys.isNative){
//                    cc.log('onClickWxLogin');
//					gg.WxSdkMgr.getInstance().sendWxLogin();
//				}
//				cc.log("BtnLoginWX - open");
//                 LoginSceneUIMgr.getInstance().sendLogon("xm2", "123456");//.1.37
                    // LoginSceneUIMgr.getInstance().sendLogon("huaifeng123", "j12345678");//.1.37
                }

                break;
            default:
                break;
        }
    },
    onClickXieYiOK:function(sender, type){
        if (ccui.Widget.TOUCH_ENDED == type) {
            this.Panel_xieyi.setVisible(false);
        }
    },
    onCheckBoxEvent: function(sender, type){
        if (ccui.CheckBox.EVENT_SELECTED == type) {
            cc.log("onCheckBoxEvent-----");
            this.isAgree = !this.isAgree;
        }
    },
});
