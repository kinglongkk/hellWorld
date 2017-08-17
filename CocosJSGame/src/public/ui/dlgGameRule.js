DLG_CREATOR[ID_DlgGameRule] = function() {
	cc.log("DLG_CREATOR[ID_DlgGameRule]");
	return new DlgGameRule();
};

var DlgGameRule = DlgBase.extend({
	ctor: function(){
	},

	onCreate: function() {
		this.init();
	},

	onClose: function() {

	},

	init: function() {
		var json = ccs.load(res.dlgRuleScene_json);
		this._rootWidget = json.node;

		//自适应屏幕大小
		var sizeDir = cc.director.getWinSize();
		this._rootWidget.setContentSize(sizeDir);
		ccui.helper.doLayout(this._rootWidget);
		
		this._rootWidget.setLocalZOrder(1000);

		this.Panel_root = this._rootWidget.getChildByName('Panel_root');
        this.Panel_root.addTouchEventListener(this.onClickClose, this);
        var Button_close = this.Panel_root.getChildByName('Button_close');
        Button_close.addTouchEventListener(this.onClickClose, this);

        var ListView_content = this.Panel_root.getChildByName('ListView_content');
        var Text_content = ListView_content.getChildByName('Text_content');
        var plaza = ClientData.getInstance().getPlaza();
        //加载规则配置
        var ruleConfig = LoadRuleCfg.getInstance().getRuleContent(plaza.getCurKindID());
        Text_content.string = ruleConfig;
        var arrStr = ruleConfig.split("\n");
        Text_content.setContentSize(cc.size(800,arrStr.length*25));
        ListView_content.refreshView();
	},

    onClickClose: function(sender, type) {
        if (ccui.Widget.TOUCH_ENDED == type) {
            UIMgr.getInstance().closeDlg(ID_DlgGameRule);
        }
    }
});
