/*
 * 通用弹窗界面
 * Author: 	YangJiazhen
 * Date:	2017.4.27
 *
 * 功能：
 *
 * */
DLG_CREATOR[ID_DlgDialogScene] = function() {
    return new DlgDialogScene();
};

var DlgDialogScene = DlgBase.extend({
    ctor: function () {

    },

    onCreate: function () {
        this.init();
    },

    onClose: function () {

    },

    init: function () {

        // 从文件载入
        var json = ccs.load(res.dlgDialogScene_json);
        this._rootWidget = json.node;

        // 自适应屏幕大小
        var sizeDir = cc.director.getWinSize();
        this._rootWidget.setContentSize(sizeDir);
        ccui.helper.doLayout(this._rootWidget);

        //弹窗置顶100
        this._rootWidget.setLocalZOrder(100);

        // 关闭按钮
        this.btnClose = this._rootWidget.getChildByName("Button_Close");
        this.btnClose.addTouchEventListener(function (sender, type) {
            if (ccui.Widget.TOUCH_ENDED == type) {
                UIMgr.getInstance().closeDlg(ID_DlgDialogScene);
                if (this.closeCallback) this.closeCallback();
            }
        }, this);
        // 标题
        this.TextTitle = this._rootWidget.getChildByName("Text_Title");
        // 详情
        this.detailBg = this._rootWidget.getChildByName("Image_Detail");
    },

    setTitle: function (sTitle) {
        this.TextTitle.string = sTitle;
    },

    setDetailView: function (detailView) {
        this.detailBg.removeAllChildren();
        var detailSize = this.detailBg.getContentSize();
        detailView.setAnchorPoint(cc.p(0.5, 0.5));
        detailView.x = detailSize.width / 2;
        detailView.y = detailSize.height / 2;
        this.detailBg.addChild(detailView);
    },

    setCloseFunc: function (func) {
        this.closeCallback = func;
    },
});