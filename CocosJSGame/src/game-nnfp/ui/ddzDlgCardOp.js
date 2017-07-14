
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
				if (this.ResultSearchData.cbSearchCount <= 0) {
                    DdzGameMsg.getInstance().sendPassCard();
					return;
				}

				// 有可出的牌就进行提示
                var dlg = UIMgr.getInstance().openDlg(ID_DdzDlgPlayer);
                if (dlg) {
                	var arr = [];
                	for (var i = 0; i < this.ResultSearchData.cbCardCount[this.ShowIndex]; i++) {
                		arr[i] = this.ResultSearchData.cbResultCard[this.ShowIndex][i];
					}
                    dlg.prompt(arr);
                    this.ShowIndex = (this.ShowIndex >= this.ResultSearchData.cbSearchCount - 1)? 0 : this.ShowIndex + 1;
                }
            }
        }, this);

		// 提示语
		this.TextPrompt = this._rootWidget.getChildByName("Text_Prompt");
	},

	// 选牌
	checkCard: function () {
        
		
		// 取出当前可出的牌数组
        if (!this.ResultSearchData) {
            var game = ClientData.getInstance().getGame();
            if (!game) return;

            this.ResultSearchData = DdzModel.prototype.MakeTagSearchCardResult();
            this.ShowIndex = 0;

            var handCardData = game.getHandCardValues(g_objHero.getChairID());
            var turnCardData = [];
            var lastSendUser = game.getLastSendCardUser();
            if (lastSendUser != g_objHero.getChairID()) {
                turnCardData = game.getTurnCardData(lastSendUser);
			}

            DdzModel.prototype.SearchOutCard(handCardData, turnCardData, this.ResultSearchData);
            cc.log("cbSearchCount="+this.ResultSearchData.cbSearchCount);
            cc.log("cbCardCount="+this.ResultSearchData.cbCardCount);
            for (var i = 0; i < CMD_DDZ.MAX_COUNT; i++) {
                cc.log("cbResultCard"+i+"="+this.ResultSearchData.cbResultCard[i]);
            }
        }

        this.BtnOut.setBright(false);
        this.BtnOut.setTouchEnabled(false);
		this.TextPrompt.setVisible(this.ResultSearchData.cbSearchCount <= 0);
    },
});