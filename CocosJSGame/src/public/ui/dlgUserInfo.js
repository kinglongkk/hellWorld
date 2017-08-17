DLG_CREATOR[ID_DlgUserInfo] = function() {
	return new DlgUserInfo();
};

var DlgUserInfo = DlgBase.extend({
	ctor: function(){
	},

	onCreate: function() {
		this.init();
	},

	onClose: function() {

	},

	init: function() {
		var json = ccs.load(res.dlgUserInfoScene_json);
		this._rootWidget = json.node;

		//自适应屏幕大小
		var sizeDir = cc.director.getWinSize();
		this._rootWidget.setContentSize(sizeDir);
		ccui.helper.doLayout(this._rootWidget);
		
		this._rootWidget.setLocalZOrder(1000);

		this.Panel_root = this._rootWidget.getChildByName('Panel_root');
        this.Panel_main = this.Panel_root.getChildByName('Panel_main');
        var Button_close = this.Panel_main.getChildByName('Button_close');
        Button_close.addTouchEventListener(this.onClickClose, this);
        this.Button_bindPhone = this.Panel_main.getChildByName('Button_bindPhone');
        this.Button_bindPhone.addTouchEventListener(this.onClickEvent, this);
        this.Button_recommender = this.Panel_main.getChildByName('Button_recommender');
        this.Button_recommender.addTouchEventListener(this.onClickEvent, this);

        this.Image_head = this.Panel_main.getChildByName('Panel_head').getChildByName('Image_head');
        this.AtlasLabel_zanCounts = this.Panel_main.getChildByName('Image_zan').getChildByName('AtlasLabel_zanCounts');
        this.Text_playerID = this.Panel_main.getChildByName('Image_playerID').getChildByName('Text_playerID');
        this.TextField_nickName = this.Panel_main.getChildByName('Image_nickName').getChildByName('TextField_qianMing');
        this.Image_nickNameWriteIcon = this.Panel_main.getChildByName('Image_nickName').getChildByName('Image_writeIcon');
        this.TextField_qianMing = this.Panel_main.getChildByName('Image_qianMingBg').getChildByName('TextField_qianMing');
        this.Image_qianMingWriteIcon = this.Panel_main.getChildByName('Image_qianMingBg').getChildByName('Image_writeIcon');

        // 设置TextField占位符的字符颜色 设置个性签名上下左右居中显示 liquan
        this.TextField_nickName.setPlaceHolderColor(cc.color(255,255,255));
        this.TextField_qianMing.setPlaceHolderColor(cc.color(255,255,255));
        this.TextField_qianMing.setTextHorizontalAlignment(cc.TEXT_ALIGNMENT_CENTER);
        this.TextField_qianMing.setTextVerticalAlignment(cc.TEXT_ALIGNMENT_CENTER);

        this.Panel_playInfo = this.Panel_main.getChildByName('Panel_playInfo');

        //绑定手机界面
        this.Panel_bindPhone = this.Panel_root.getChildByName('Panel_bindPhone');
        this.Panel_bindPhone.addTouchEventListener(function(sender, type){
            if (ccui.Widget.TOUCH_ENDED == type) {
                sender.setVisible(false);
            }
        }, this);
        var Button_close = this.Panel_bindPhone.getChildByName('Button_close');
        Button_close.addTouchEventListener(function(sender, type){
            if (ccui.Widget.TOUCH_ENDED == type) {
                this.Panel_bindPhone.setVisible(false);
            }
        }, this);

        this.TextField_phoneNum = this.Panel_bindPhone.getChildByName('TextField_phoneNum');
        this.TextField_checkCode = this.Panel_bindPhone.getChildByName('TextField_checkCode');
        this.TextField_phoneNum.setPlaceHolderColor(cc.color(255,255,255));
        this.TextField_checkCode.setPlaceHolderColor(cc.color(255,255,255));


        var Button_bindPhoneOk = this.Panel_bindPhone.getChildByName('Button_bindPhoneOk');
        Button_bindPhoneOk.addTouchEventListener(this.onClickEvent, this);
        this.Button_getCheckCode = this.Panel_bindPhone.getChildByName('Button_getCheckCode');
        this.Button_getCheckCode.addTouchEventListener(this.onClickEvent, this);
        this.Button_getCheckCode.setTitleText("获取验证码");

        //推荐人界面
        this.Panel_setRecommender = this.Panel_root.getChildByName('Panel_setRecommender');
        this.Panel_setRecommender.addTouchEventListener(function(sender, type){
            if (ccui.Widget.TOUCH_ENDED == type) {
                sender.setVisible(false);
            }
        }, this);
        Button_close = this.Panel_setRecommender.getChildByName('Button_close');
        Button_close.addTouchEventListener(function(sender, type){
            if (ccui.Widget.TOUCH_ENDED == type) {
                this.Panel_setRecommender.setVisible(false);
                // var IsGetReferrerID =UserServerMsg.getInstance().IsGetReferrerID();
                // if(IsGetReferrerID)
                // {
                //     UserServerMsg.getInstance().setReferrerID(Number(this.TextField_recommenderID.string));
                //     cc.log("设置了推荐人ID"+Number(this.TextField_recommenderID.string));
                // }
            }
        }, this);
        this.TextField_recommenderID = this.Panel_setRecommender.getChildByName('TextField_recommenderID');
        this.TextField_recommenderID.setPlaceHolderColor(cc.color(255,255,255));
        this.TextField_recommenderID.setTextHorizontalAlignment(cc.TEXT_ALIGNMENT_CENTER);
        var Button_setRecommenderOk = this.Panel_setRecommender.getChildByName('Button_setRecommenderOk');
        Button_setRecommenderOk.addTouchEventListener(this.onClickEvent, this);
        this.Image_writeTip =this.Panel_setRecommender.getChildByName('Image_writeTip');
        this.Image_phoneBg =this.Panel_setRecommender.getChildByName('Image_phoneBg');
        this.Text_tip =this.Panel_setRecommender.getChildByName('Text_tip');
	},

	doReFresh: function(userInfo){
        // type L2C_UserIndividual struct {
        //     //用户信息
        //     UserID      int64  //用户 I D
        //     NickName    string //昵称
        //     Accounts    string //账号
        //     WinCount    int    //赢数
        //     LostCount   int    //输数
        //     DrawCount   int    //平数
        //     Medal       int
        //     RoomCard    int  //房卡
        //     MemberOrder int8 //会员等级
        //     Score       int64
        //     HeadImgUrl  string
        // PhomeNumber  string //电话号码
        // Sign  string //个性签名
        //Star        int    //赞数
        // }
        var table = ClientData.getInstance().getTable();
        var player = table.getPlayerByUserId(userInfo.UserID);;
        if(g_objHero.getUserId()==userInfo.UserID)
            player = g_objHero;


        //
        var isMySelf = (userInfo.UserID==g_objHero.getUserId());
        this.Panel_bindPhone.setTouchEnabled(isMySelf);
        this.Panel_setRecommender.setTouchEnabled(isMySelf);
        isMySelf?this.Panel_bindPhone.setColor(cc.color(255,255,255,255)):this.Panel_bindPhone.setColor(cc.color(100,100,100,255));
        isMySelf?this.Panel_setRecommender.setColor(cc.color(255,255,255,255)):this.Panel_setRecommender.setColor(cc.color(100,100,100,255));

        //基本信息
        this.AtlasLabel_zanCounts.string = ""+userInfo.Star;
        var zanCoutnSize = this.AtlasLabel_zanCounts.getContentSize();
        this.AtlasLabel_zanCounts.setContentSize(cc.size(zanCoutnSize.width*this.AtlasLabel_zanCounts.string.length, zanCoutnSize.height));
        this.Text_playerID.string = ""+userInfo.UserID;
        this.TextField_nickName.setString(userInfo.NickName);
        this.TextField_nickName.setTouchEnabled(isMySelf);
        this.Image_nickNameWriteIcon.setVisible(isMySelf);
        this.TextField_qianMing.setString(userInfo.Sign);
        this.TextField_qianMing.setTouchEnabled(isMySelf);
        this.Image_qianMingWriteIcon.setVisible(isMySelf);

        this.oldNickName = userInfo.NickName;
        this.oldSign = userInfo.Sign;

        var self = this;
        player.loadUrlImage(function (imagePath) {
            self.Image_head.loadTexture(imagePath, ccui.Widget.LOCAL_TEXTURE);
        });

        //比赛信息
        var AtlasLabel_vipLevel = this.Panel_playInfo.getChildByName('AtlasLabel_vipLevel');
        if(userInfo.MemberOrder){
            var strLevel = String(userInfo.MemberOrder);
            AtlasLabel_vipLevel.setContentSize(cc.size(strLevel.length*46,60));
            AtlasLabel_vipLevel.string = strLevel;
        }
        else{
            AtlasLabel_vipLevel.setContentSize(cc.size(46,60));
            AtlasLabel_vipLevel.string = "0";
        }

        var Text_textWinNum = this.Panel_playInfo.getChildByName('Text_textWinNum');
        Text_textWinNum.string = String(userInfo.WinCount);
        var Text_textTotalNum = this.Panel_playInfo.getChildByName('Text_textTotalNum');
        var total = userInfo.WinCount+userInfo.LostCount+userInfo.DrawCount;
        Text_textTotalNum.string = String(total);
        var Text_textWinRateNum = this.Panel_playInfo.getChildByName('Text_textWinRateNum');
        if(total==0)
            Text_textWinRateNum.string = "0%";
        else
            Text_textWinRateNum.string = Math.floor(userInfo.WinCount/total)+"%";

        var Text_textIP = this.Panel_playInfo.getChildByName('Text_textIP');
        if(userInfo.PhomeNumber=="")
            Text_textIP.string = "IP: 未绑定";
        else
            Text_textIP.string = "IP:"+userInfo.PhomeNumber;
	},

    checkMbEdit: function(){
        var strMb = this.TextField_phoneNum.string;

        if(strMb === ""){
            DlgTip.openSysTip("手机号码不能为空，请输入11位手机号码！");
            return false;
        }

        var regExp = new RegExp("^1[0-9]{10}$");
        if(!regExp.test(strMb)){
            DlgTip.openSysTip("手机号码输入有误，请输入11位手机号！！");
            return false;
        }

        return true;
    },

    doCountDown: function(){
        var self = this;
        var seq = null;
        seq = cc.sequence(
            cc.delayTime(1),
            cc.CallFunc(function(){
                if(self.countDownTimes>0){
                    self.countDownTimes--;

                    if(self.countDownTimes>0){
                        self.Button_getCheckCode.setTitleText("获取验证码("+self.countDownTimes+")");
                        cc.log("countDownTimes---------"+self.countDownTimes);
                    }
                    else{
                        self.countDownTimes = null;
                        self.Button_getCheckCode.setTitleText("获取验证码");
                        this.Button_getCheckCode.setTouchEnabled(true);
                        this.Button_getCheckCode.setColor(cc.color(255,255,255,255));
                        // 倒计时结束如果界面是关闭的时候才把phoneNum清空
                        if(!self.Panel_bindPhone.isVisible()){
                            self.TextField_phoneNum.string = "";
                            self.TextField_checkCode.string = "";
                        }
                    }
                }
                else{
                    self.countDownTimes = null;
                    self.Button_getCheckCode.setTitleText("获取验证码");

                    this.Button_getCheckCode.setTouchEnabled(true);
                    this.Button_getCheckCode.setColor(cc.color(255,255,255,255));
                }
            }, this)
        );

        this.countDownTimes = 60;
        this.Button_getCheckCode.stopAllActions();
        this.Button_getCheckCode.runAction(seq.repeat(this.countDownTimes));
        this.Button_getCheckCode.setTitleText("获取验证码("+self.countDownTimes+")");

        this.Button_getCheckCode.setTouchEnabled(false);
        this.Button_getCheckCode.setColor(cc.color(230,230,230,255));
    },

    onClickClose: function(sender, type) {
        if (ccui.Widget.TOUCH_ENDED == type) {
            var curNickName = this.TextField_nickName.getString();
            var curSign = this.TextField_qianMing.getString();
            if(curNickName!=this.oldNickName){
                //发送更改的信息 昵称
                if(!curNickName) {
                    DlgTip.openSysTip("新昵称不能为空!请重新修改!");
                    return;
                }

                if(curNickName.replace(/[\u4e00-\u9fa5]/g,"zz").length > 12){
                    DlgTip.openSysTip("昵称不能超过12个字符/6个汉字!请重新修改!");
                    this.TextField_nickName.string = g_objHero.getNickName();
                    return;
                }
                this.TextField_nickName.string = KeyWordsMgr.getInstance().replaceWords(curNickName);
                UserServerMsg.getInstance().sendModifyNick(this.TextField_nickName.string);
            }
            if(curSign!=this.oldSign){
                //发送更改的信息 个性签名
                if(curSign.replace(/[\u4e00-\u9fa5]/g,"zz").length > 128){
                    DlgTip.openSysTip("个性签名不能超过128个字符/64个汉字!请重新修改!");
                    this.TextField_qianMing.string = g_objHero.getSign();
                    return;
                }
                this.TextField_qianMing.string = KeyWordsMgr.getInstance().replaceWords(curSign);
                UserServerMsg.getInstance().sendModifyUnderWrite(this.TextField_qianMing.string);
            }
            UIMgr.getInstance().closeDlg(ID_DlgUserInfo);
        }
    },

    onClickEvent: function(sender, type) {
        if (ccui.Widget.TOUCH_ENDED == type) {
            var senderName = sender.getName();
            switch(senderName){
                case "Button_bindPhone":{
                    this.Panel_bindPhone.setVisible(true);
                    // 如果还在倒计时则不用清理旧数据
                    if(!this.countDownTimes){
                        this.TextField_phoneNum.string = "";
                        this.TextField_checkCode.string = "";
                        this.Button_getCheckCode.setTitleText("获取验证码");
                    }
                    break;
                }
                case "Button_recommender":{
                    this.Panel_setRecommender.setVisible(true);
                    //清理旧数据
                    this.TextField_recommenderID.string = "";
                    var IsGetReferrerID =UserServerMsg.getInstance().IsGetReferrerID();
                    var ReferrerID =UserServerMsg.getInstance().getReferrerID();
                    if(IsGetReferrerID&&ReferrerID!=undefined)
                    {
                        cc.log("设置了推荐人ID"+ReferrerID);
                        this.TextField_recommenderID.string =ReferrerID;
                        this.Image_writeTip.setVisible(false);
                        this.Image_phoneBg.setVisible(false);
                        this.Text_tip.setVisible(false);
                    }
                    break;
                }
                case "Button_getCheckCode":{
                    //获取验证码
                    if(this.checkMbEdit()){
                        UserServerMsg.getInstance().sendGetMbValidate(this.TextField_phoneNum.string);
                    }
                    break;
                }
                case "Button_bindPhoneOk":{
                    //绑定手机号
                    if(this.checkMbEdit()){
                        var strPhoneNum = this.TextField_phoneNum.string;
                        var maskCode = Number(this.TextField_checkCode.string);
                        UserServerMsg.getInstance().sendBindMb(strPhoneNum, maskCode);
                    }
                    break;
                }
                case "Button_setRecommenderOk":{
                    //设置推荐人
                    var TextField_recommenderID = this.TextField_recommenderID.string;
                    if(TextField_recommenderID === ""){
                        DlgTip.openSysTip("推荐人ID不能为空，请输入推荐人ID！");
                        return false;
                    }
                    var regExp = new RegExp("[0-9]");
                    if(!regExp.test(TextField_recommenderID)){
                        DlgTip.openSysTip("推荐人ID输入有误，请重新输入推荐人ID！！");
                        return false;
                    }

                    UserServerMsg.getInstance().sendSetElect(Number(this.TextField_recommenderID.string));
                    var IsGetReferrerID =UserServerMsg.getInstance().IsGetReferrerID();
                    cc.log("是否设置了推荐人ID"+IsGetReferrerID);
                   // if(IsGetReferrerID)
                    {
                        UserServerMsg.getInstance().setReferrerID(Number(this.TextField_recommenderID.string));
                        cc.log("设置了推荐人ID"+Number(this.TextField_recommenderID.string));
                    }
                    this.Panel_setRecommender.setVisible(false);

                    break;
                }
                default:
                    break;
            }
        }
    }
});

var openBindPhone = function(bindPhoneCB){
    var dlgUserInfo = UIMgr.getInstance().openDlg(ID_DlgUserInfo);
    if(dlgUserInfo){
        dlgUserInfo.Panel_bindPhone.addTouchEventListener(function(sender, type){
            if (ccui.Widget.TOUCH_ENDED == type) {
                UIMgr.getInstance().closeDlg(ID_DlgUserInfo);
            }
        }, dlgUserInfo);
        var Button_close = dlgUserInfo.Panel_bindPhone.getChildByName('Button_close');
        Button_close.addTouchEventListener(function(sender, type){
            if (ccui.Widget.TOUCH_ENDED == type) {
                UIMgr.getInstance().closeDlg(ID_DlgUserInfo);
            }
        }, dlgUserInfo);

        dlgUserInfo.bindPhoneCB = bindPhoneCB;
        dlgUserInfo.Panel_main.setVisible(false);
        dlgUserInfo.Panel_bindPhone.setVisible(true);
    }
}

var openSetRecommender = function(setRecommenderCB){
    var dlgUserInfo = UIMgr.getInstance().openDlg(ID_DlgUserInfo);
    if(dlgUserInfo){
        dlgUserInfo.Panel_setRecommender.addTouchEventListener(function(sender, type){
            if (ccui.Widget.TOUCH_ENDED == type) {
                UIMgr.getInstance().closeDlg(ID_DlgUserInfo);

            }
        }, dlgUserInfo);
        var Button_close = dlgUserInfo.Panel_setRecommender.getChildByName('Button_close');
        Button_close.addTouchEventListener(function(sender, type){
            if (ccui.Widget.TOUCH_ENDED == type) {
                UIMgr.getInstance().closeDlg(ID_DlgUserInfo);
            }
        }, dlgUserInfo);

        dlgUserInfo.setRecommenderCB = setRecommenderCB;
        dlgUserInfo.Panel_main.setVisible(false);
        dlgUserInfo.Panel_setRecommender.setVisible(true);
    }
}
