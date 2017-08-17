DLG_CREATOR[ID_DlgSSSItems] = function() {
	return new DlgSSSItems();
};

var DlgSSSItems = DlgBase.extend({
	ctor: function () {
	},

	onCreate: function() {
		this.init();

	},

	onClose: function() {

	},

	init: function(){
		cc.spriteFrameCache.addSpriteFrames(res.sssdlgMainScene_plist);//功能模块资源在主场景中
		var json = ccs.load(res.sssdlgItems_json);
		this._rootWidget = json.node;

        var game = ClientData.getInstance().getGame();
        if(!game){
            return;
        }

		//自适应屏幕大小
		var sizeDir = cc.director.getWinSize();
		this._rootWidget.setContentSize(sizeDir);
		ccui.helper.doLayout(this._rootWidget);	

		this.Panel_main = this._rootWidget.getChildByName('Panel_main');


        // 初始化房间信息
        this.Panel_roomInfo = this.Panel_main.getChildByName("Panel_roomInfo");
        this.Panel_roomInfoBg = this.Panel_roomInfo.getChildByName("Panel_roomInfoBg");

        // 房间信息扩展
        var roomSpecialInfo = game.getGameRoomOhterInfo();
        var payType = game.getGameRoomPayType();

        if(roomSpecialInfo!=undefined)
        {
            this.Image_PayType = this.Panel_roomInfo.getChildByName("Image_PayType");
            var bAA = (payType == 2 ? true: false);
            this.Image_PayType.loadTexture(bAA==true ? res.payType_AA : res.payType_Zhuang, ccui.Widget.LOCAL_TEXTURE);

            // 开关 res.info_Close  资源是开
            this.openCb = function (sender, type) {
                if (ccui.Widget.TOUCH_ENDED == type){
                    this.btnOpen +=1;
                    this.Panel_roomInfoBg.setVisible(this.btnOpen%2==0?false:true);
                    this.Panel_content.setVisible(this.btnOpen%2==0?false:true);
                    this.Button_roomInfo.loadTextureNormal(this.btnOpen%2==0 ?  res.info_Open : res.info_Close , ccui.Widget.LOCAL_TEXTURE);
                    this.btnOpen = this.btnOpen%2;
                }
            };

            this.btnOpen = 0;
            this.Button_roomInfo = this.setBtnCallBack(this.Panel_roomInfo,"Button_roomInfo",this.openCb);
            this.Panel_content = this.Panel_roomInfo.getChildByName("Panel_content");
            this.Panel_roomInfoBg.setVisible(false);
            this.Panel_content.setVisible(false);
            var ListBgSize = this.Panel_roomInfoBg.getContentSize();
            var testH =  20;
            var info = [];

            if(roomSpecialInfo.wanFa!=undefined){
                info.push(roomSpecialInfo.wanFa == 0 ? "经典场":"癞子场");
            }

            if(roomSpecialInfo.jiaYiSe == true){
                info.push("加一色");
            }
            if(roomSpecialInfo.jiaGongGong == true){
                info.push("加公共牌");
            }
            if(roomSpecialInfo.jiaDaXiaoWan == true){
                info.push("加大小王");
            }

            for(var i = 0;i<info.length;i++) {

                var func = function (index,tempthis) {
                    cc.log("index:"+index);
                    var widget = new ccui.TextField();
                    widget.setAnchorPoint(0,1);
                    widget.setFontSize(20);
                    widget.string = info[i];
                    widget.setColor(cc.color(102, 255, 255));
                    widget.setPosition(cc.p(10,0 -((testH+10)*index)));
                    tempthis.Panel_content.addChild(widget);

                }(i,this);
            }
            ListBgSize = this.Panel_roomInfoBg.getContentSize();
            this.Panel_roomInfoBg.setContentSize(ListBgSize.width,(testH+10)*info.length +testH);
        }

	},

    setBtnCallBack: function(btnParent, btnName, listener){
        if(btnParent==null){
            cc.log("qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq");
            return null;
        }

        var btn = btnParent.getChildByName(btnName);
        if(btn==null){
            cc.log("1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq");
            return null;
        }
        btn.setPressedActionEnabled(true);
        btn.addTouchEventListener(listener, this);

        return btn;
    },
});
