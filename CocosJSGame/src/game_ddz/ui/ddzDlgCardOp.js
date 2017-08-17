
DLG_CREATOR[ID_DdzDlgCardOp] = function() {
	return new DdzDlgCardOp();
};

var DdzDlgCardOp = DlgBase.extend({
	ctor: function(){
		this.ResultSearchData = null;	// 提示用的存储对象
		this.ShowIndex = 0;		// 当前提示的是第几个
	},

	onCreate: function() {
		this.init();
	},

	onClose: function() {

	},

	init: function() {
		var json = ccs.load(res.dlgCardOp_ddz_json);
		this._rootWidget = json.node;

		//自适应屏幕大小
		var sizeDir = cc.director.getWinSize();
		this._rootWidget.setContentSize(sizeDir);
		ccui.helper.doLayout(this._rootWidget);

		// 不出
		this.BtnNoOut = this._rootWidget.getChildByName("Btn_noOut");
		this.BtnNoOut.addTouchEventListener(function (sender, type) {
			if (ccui.Widget.TOUCH_ENDED == type) {
                DdzGameMsg.getInstance().sendPassCard();
			}
        }, this);

		// 出牌
		this.BtnOut = this._rootWidget.getChildByName("Btn_out");
		this.BtnOut.addTouchEventListener(function (sender, type) {
            if (ccui.Widget.TOUCH_ENDED == type) {
                var dlg = UIMgr.getInstance().openDlg(ID_DdzDlgPlayer);
                if (dlg) {
					cc.log("出牌按钮")
                	dlg.sendCard();
				}
            }
        }, this);

		// 提示
		this.BtnPompt = this._rootWidget.getChildByName("Btn_pompt");
		this.BtnPompt.addTouchEventListener(function (sender, type) {
            if (ccui.Widget.TOUCH_ENDED == type) {
            	if (!this.ResultSearchData) return;
            	// 如果没有可出的牌，直接pass
				if (this.ResultSearchData.length <= 0) {
                    DdzGameMsg.getInstance().sendPassCard();
					return;
				}

				// 有可出的牌就进行提示
				var dlg = UIMgr.getInstance().openDlg(ID_DdzDlgPlayer);
                if (dlg) {

                	var ret = this.ResultSearchData[this.ShowIndex];
                	cc.log("提示符合的牌"+ret);
					cc.log("提示符合"+this.ResultSearchData);
                	if (ret) {
                        var arr = ret.slice(0);
                        dlg.prompt(arr);
					}

                    this.ShowIndex = (this.ShowIndex >= this.ResultSearchData.length - 1)? 0 : this.ShowIndex + 1;
                }
            }
        }, this);

		this.ButtonT = this._rootWidget.getChildByName("Button_T");
		this.ButtonT.addTouchEventListener(function (sender, type) {
			if (ccui.Widget.TOUCH_ENDED == type) {
                DdzGameMsg.getInstance().sendPassCard();
			}
		}, this);
		this.ButtonT.setVisible(false);
		// 提示语
		this.TextPrompt = this._rootWidget.getChildByName("Text_Prompt");
		//this.transparent = this._rootWidget.getChildByName("Panel_transparent");
	},

	// 选牌
	checkCard: function () {
        
		
		// 取出当前可出的牌数组
        if (!this.ResultSearchData) {
            var game = ClientData.getInstance().getGame();
            if (!game) return;

            this.ShowIndex = 0;

            var handCardData = game.getHandCardValues(g_objHero.getChairID());
            var turnCardData = [];
            var turnType = DdzCardType.CT_ERROR;
            var lastSendUser = game.getLastSendCardUser();
            if (lastSendUser != g_objHero.getChairID()) {
                turnCardData = game.getTurnCardData(lastSendUser);
                turnType = game.getCardDatatype(lastSendUser);
			}
			cc.log(turnCardData+"打印1");
			cc.log(turnType+"打印2");
			cc.log( handCardData+"打印3");
			this.ResultSearchData = DdzModel.prototype.DdzSearchOutCard(turnCardData, turnType, handCardData);
            // DdzModel.prototype.SearchOutCard(handCardData, turnCardData, this.ResultSearchData);
            cc.log("搜到的符合牌型有="+this.ResultSearchData.length);

        }
		if (this.ResultSearchData.length <= 0) {
			this.BtnNoOut.setVisible(false);
			this.BtnOut.setVisible(false);
			this.BtnPompt.setVisible(false);
			this.ButtonT.setVisible(true);
		}

        this.BtnOut.setBright(false);
        this.BtnOut.setTouchEnabled(false);
		this.TextPrompt.setVisible(this.ResultSearchData.length <= 0);
		//this.transparent.setVisible(this.ResultSearchData.cbSearchCount <= 0);
    },
});