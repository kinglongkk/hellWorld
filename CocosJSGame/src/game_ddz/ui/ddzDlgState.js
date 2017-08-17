
DLG_CREATOR[ID_DdzDlgState] = function() {
    return new DdzState();
};

var DdzState = DlgBase.extend({
    ctor: function(){},

    onCreate: function() {
        this.init();
    },

    onClose: function() {

    },

    init: function() {
        var json = ccs.load(res.dlgBgImgClock_ddz_json);
        this._rootWidget = json.node;
        var sizeDir = cc.director.getWinSize();
        this._rootWidget.setContentSize(sizeDir);
        this._rootWidget.setLocalZOrder(20);
        ccui.helper.doLayout(this._rootWidget);
        this.ButtonCl = this._rootWidget.getChildByName("Panel_co");
        this.ButtonCl.addTouchEventListener(function (sender, type) {
            if (ccui.Widget.TOUCH_ENDED == type) {
                DdzGameMsg.getInstance().sendTrustee(false);
            }
        }, this);
        this.Buttonck = this.ButtonCl.getChildByName("Button_Clock");
        this.Buttonck.addTouchEventListener(function (sender, type) {
            if (ccui.Widget.TOUCH_ENDED == type) {
                DdzGameMsg.getInstance().sendTrustee(false);
            }
        }, this);

    }
});