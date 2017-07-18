/*
* 桌面倒计时
* */
DLG_CREATOR[ID_NnFpDlgClock] = function () {
    return new NnFpDlgClock();
};

var NnFpDlgClock = DlgBase.extend({
    ctor: function () {
        this.time = 15;
        this.remainTime = 15;
        this._stop = true;
        this._timerName = "";
    },

    onCreate: function () {
        this.init();
    },

    onClose: function () {
        this._stop = true;
        this._rootWidget.unscheduleAllCallbacks();
    },

    init: function () {
        var json = ccs.load(res.dlgNnFpClock_json);
        this._rootWidget = json.node;

        //自适应屏幕大小
        var sizeDir = cc.director.getWinSize();
        this._rootWidget.setContentSize(sizeDir);
        ccui.helper.doLayout(this._rootWidget);

        this.ImgClockBg = this._rootWidget.getChildByName('ImgClockBg');
        this.LabTime = this.ImgClockBg.getChildByName('LabTime');
        this.LabTime.ignoreContentAdaptWithSize(true);
    },
    onExit: function () {
        this._stop = true;
        this._rootWidget.unscheduleAllCallbacks();
        this.onExit.bind(this)
    },

    openTimer: function (time, outTimeFun, modifyTime) {
        this.time = time;
        this.remainTime = time;
        this.LabTime.string = time;

        if (modifyTime) {
            this.time = modifyTime;
        }

        this._startTime = Date.now() / 1000;
        this._outTimeFun = outTimeFun;

        if (this._stop) {
            this._stop = false;
            this._rootWidget.schedule(this.update.bind(this));
        }
    },

    setTimerName: function (timerName) {
        this._timerName = timerName;
    },

    getTimerName: function () {
        return this._timerName;
    },

    closeTimer: function () {
        this._stop = true;
        this._rootWidget.unscheduleAllCallbacks();
        UIMgr.getInstance().closeDlg(ID_NnFpDlgClock);
    },

    update: function () {
        //从后台切回前台处理
        if (UIMgr.getInstance().isPauseSchedule()) {
            return;
        }

        if (this._stop) {
            return;
        }

        var curTime = Date.now() / 1000;
        //超出2秒直接停止
        var timeSpend = curTime - this._startTime;
        if (timeSpend > (2 + this._outTime)) {
            this.closeTimer();
            return;
        }

        var remain = this.time - Math.floor(timeSpend);
        if (remain < 0) {
            remain = 0;
        }

        //同一秒内不处理
        if (this.remainTime === remain) {
            return;
        }

        this.remainTime = remain;

        var strTime = this.remainTime + "";
        this.LabTime.string = strTime;

        if (this.remainTime <= 5) {
            // SoundMgr.getInstance().playEffect("game_warn", 0, false);
        }

        if (this.remainTime <= 0) {
            this._outTimeFun();
            this.closeTimer();
        }
    }
});