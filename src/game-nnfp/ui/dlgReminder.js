DLG_CREATOR[ID_DlgNnFpReminder] = function () {
    return new DlgNnFpReminder();
};

var DlgNnFpReminder = DlgBase.extend({
    ctor: function () {
    },

    onCreate: function () {
        this.init();
    },

    onClose: function () {
    },

    init: function () {
        cc.log("加载温馨提示弹窗");
        var json = ccs.load(res.nnFpReminder_json);
        this._rootWidget = json.node;

        //自适应屏幕大小
        var sizeDir = cc.director.getWinSize();
        this._rootWidget.setContentSize(sizeDir);
        ccui.helper.doLayout(this._rootWidget);

        this.Image_2 = this._rootWidget.getChildByName("Image_2");
        this.Image_3 = this.Image_2.getChildByName("Image_3");

        this.Text_tittle = this.Image_3.getChildByName("Text_tittle");
        this.Text_content = this.Image_3.getChildByName("Text_content");

        this.Btn_refuse = this.Image_2.getChildByName("Btn_refuse");
        this.Btn_refuse.setTouchEnabled(true);
        this.Btn_refuse.addTouchEventListener(this.onClickEvent, this);
        this.Btn_agree = this.Image_2.getChildByName("Btn_agree");
        this.Btn_agree.setTouchEnabled(true);
        this.Btn_agree.addTouchEventListener(this.onClickEvent, this);
    },

    setTextTittle: function (str) {
        this.Text_tittle.setString(str);
    },

    setTextContent: function (str) {
        this.Text_content.setString(str);
    },

    onClickEvent: function (sender, type) {
        if (ccui.Widget.TOUCH_ENDED === type) {
            var strBtnName = sender.getName();
            cc.log('onClickEvent ' + strBtnName);
            switch (strBtnName) {
                case "Btn_refuse":
                    break;
                case "Btn_agree":
                    break;
                default:
                    break;
            }
        }
    }
});