var s_sharedUiActionMgr = null;

var UiActionMgr = cc.Class.extend({

    ctor: function () {

    },

    openMove: function (dlgID, ptStart, fun) {
        UIMgr.getInstance().openDlg(dlgID);
        var widget = UIMgr.getInstance().getWidget(dlgID);
        var ptEnd = new cc.p(widget.x, widget.y);
        widget.setPosition(ptStart);
        
        var pt = cc.pAdd(ptEnd, cc.p(0, -20));

        var seq = cc.Sequence.create(
            cc.MoveTo.create(0.3, pt),
            cc.MoveTo.create(0.1, ptEnd),
            cc.CallFunc.create(function () {
                if (fun) {
                    fun();
                }
            }, this)
        );

        widget.runAction(seq);
    },

    closeMove: function (dlgID, pos, fun) {
        var widget = UIMgr.getInstance().getWidget(dlgID);
        if (!widget || !widget.isVisible()) {
            return;
        }

        var seq = cc.Sequence.create(
            cc.MoveTo.create(0.3, pos),
            cc.CallFunc.create(function () {
                UIMgr.getInstance().closeDlg(dlgID);
                if (fun) {
                    fun();
                }
            }, this)
        );

        widget.runAction(seq);
    },

    //从又到左替换界面
    replaceDlgsRL: function(closeDlgIds, openDlgIds){
        var size = cc.director.getWinSize();
        var i = 0;

        for(i=0; i<closeDlgIds.length; i++){
        	this.closeDlgToTop(closeDlgIds[i]);
        }

        for(i=0; i<openDlgIds.length; i++){
        	this.openDlgFromTop(openDlgIds[i], null);
        }
    },

    openDlgFromTop: function(openDlgId, callBack){
        var size = cc.director.getWinSize();0
        UiActionMgr.getInstance().openMove(openDlgId, cc.p(0, size.height), callBack);
    },

    closeDlgToTop: function(closeDlgId){
        var size = cc.director.getWinSize();0
        UiActionMgr.getInstance().closeMove(closeDlgId, cc.p(0, size.height), null);
    }
});

UiActionMgr.getInstance = function () {
    if (!s_sharedUiActionMgr) {
        s_sharedUiActionMgr = new UiActionMgr();
    }
    return s_sharedUiActionMgr;
};

