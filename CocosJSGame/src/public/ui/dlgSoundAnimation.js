/*
 * 录音动画
 * Author: 	huangJinLong
 * Date:	2017.5.31
 *
 * */
DLG_CREATOR[ID_DlgSoundAnimation] = function() {
    return new DlgSoundAnimation();
};

var DlgSoundAnimation = DlgBase.extend({
    ctor: function () {
        this._timeoutCb = null;

        this._time = 0;
        this._timeout = 10;
    },

    onCreate: function() {
        this.init();
    },

    onClose: function() {

    },

    init: function() {
        this._rootWidget = ccui.Layout();
        this._rootWidget.setTouchEnabled(true);

        //自适应屏幕大小
        var sizeDir = cc.director.getWinSize();
        this._rootWidget.setContentSize(sizeDir);
        ccui.helper.doLayout(this._rootWidget);

        var json = ccs.load(res.soundNode_json);
        var widget = json.node;
        var action = json.action;
        this._rootWidget.addChild(widget);
        widget.setPosition(sizeDir.width/2.0, sizeDir.height/2.0);
        widget.runAction(action);
        action.gotoFrameAndPlay(0, 60, true);

        this._rootWidget.schedule(this.update.bind(this));

        /*this._rootWidget.setOnExitCallback(function(){
            this._rootWidget.unscheduleAllCallbacks();
        }.bind(this));*/
    },

    setTimeOutCallBack: function(cb, time){
        this._timeoutCb = cb;
        this._timeout = time;
    },


    update: function (time) {

        this._time += time;
        //timeout
        if(this._time >= this._timeout){
            if(this._timeoutCb){
                this._rootWidget.unscheduleAllCallbacks();
                this._timeoutCb();
            }
        }
    }
});

//录音动画 使用
var showSoundAnimation = function(isShow){
    if (isShow) {
        UIMgr.getInstance().openDlg(ID_DlgSoundAnimation);
        var dlgSoundAnimation = UIMgr.getInstance().getDlg(ID_DlgSoundAnimation);
        if(dlgSoundAnimation){
            dlgSoundAnimation.setTimeOutCallBack(function(){
                var dlg = UIMgr.getInstance().getDlg(ID_DlgChatScene);
                if (dlg) {
                    dlg.soundsEnd();
                }
            }, 15);
        }
    } else{
        var dlgSoundAnimation = UIMgr.getInstance().getDlg(ID_DlgSoundAnimation);
        if(dlgSoundAnimation){
            dlgSoundAnimation._timeoutCb = null;
            UIMgr.getInstance().closeDlg(ID_DlgSoundAnimation);
        }
    }
}
