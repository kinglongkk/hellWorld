DLG_CREATOR[ID_ddzDlgOpenCard] = function() {
    return new ddzDlgOpenCard();
};

var ddzDlgOpenCard = DlgBase.extend({
    ctor: function(){},

    onCreate: function() {
        this.init();
    },

    onClose: function() {

    },

    init: function() {
        var json = ccs.load(res.ddzOutcomeScene_json);
        this._rootWidget = json.node;
        var sizeDir = cc.director.getWinSize();
        this._rootWidget.setContentSize(sizeDir);
        ccui.helper.doLayout(this._rootWidget);
        var game = ClientData.getInstance().getGame();
        var operateUser=game.getCurrentUser();
        var mychairid = g_objHero.getChairID;
        //判断声音男1女0
        var sex=0;
        if(operateUser == mychairid )
            sex=g_objHero.getGender();
        else{
            var table = ClientData.getInstance().getTable();
            var player = table.getPlayerByChairID(operateUser);

            sex=player.getGender();
        }

        var strSex = (sex==1)?"women_":"men_";
        this.Buttonming = this._rootWidget.getChildByName("Button_ming");
        this.Buttonming.addTouchEventListener(function (sender, type) {
            if (ccui.Widget.TOUCH_ENDED == type) {

                SoundMgr.getInstance().playEffect(strSex+"mingpai", 0, false);
                DdzGameMsg.getInstance().sendDeals();
                this.Buttonming.setVisible(false);
            }
        }, this);

    }
});