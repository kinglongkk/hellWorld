

DLG_CREATOR[ID_DdzDlgCallScore] = function() {
	return new DdzDlgCallScore();
};

var DdzDlgCallScore = DlgBase.extend({
	ctor: function(){
		this.btn = [];
	},

	onCreate: function() {

		this.init();
	},

	onClose: function() {

	},

	init: function() {
		var json = ccs.load(res.dlgCallScore_ddz_json);
		this._rootWidget = json.node;

		//自适应屏幕大小
		var sizeDir = cc.director.getWinSize();
		this._rootWidget.setContentSize(sizeDir);
		ccui.helper.doLayout(this._rootWidget);

	 	// 按钮
		for (var i = 0; i < 4; i++) {
            this.btn[i] = this._rootWidget.getChildByName("Btn_point"+i);
            this.btn[i].setTag(i);
            this.btn[i].addTouchEventListener(function (sender, type) {
				if (type == ccui.Widget.TOUCH_ENDED) {
                    DdzGameMsg.getInstance().sendCallScore(sender.getTag());
				}
            }, this);
		}
		this.updateCallScoreBtn();
	},

	updateCallScoreBtn: function () {
        var game = ClientData.getInstance().getGame();
        var nMinScore = game.getBankerScore();
		cc.log(nMinScore+"得到分")
		for (var i = 1; i < 4; i++) {
			this.btn[i].setBright(i > nMinScore);
			this.btn[i].setTouchEnabled(i > nMinScore);
		}
    }
});