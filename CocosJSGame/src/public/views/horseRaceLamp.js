//跑马灯
var g_horseRaceLamp = null;
var horseRaceLamp = cc.Node.extend({
	ctor: function () {
        cc.Node.prototype.ctor.call(this);
		this.init();
	},

	init:function (){
        cc.Node.prototype.init.call(this);

        var sizeDir = cc.director.getWinSize();

        var clipNode = MyClip.createPic("res/public/mask.png");
        clipNode.setPosition(cc.p(sizeDir.width/2.0,sizeDir.height-20));
        this.clipSize = clipNode.getContentSize();

        var bg = new ccui.ImageView();
        bg.loadTexture("res/public/mask.png",ccui.Widget.LOCAL_TEXTURE);
        var bgSize = bg.getContentSize();
        clipNode.addClipChild(bg);

        // var testImage = new ccui.ImageView();
        // testImage.loadTexture("res/public/faceBoy.jpg",ccui.Widget.LOCAL_TEXTURE);
        // testImage.setPosition(cc.p(0,20));
        // clipNode.addClipChild(testImage);
        // var seq = cc.Sequence([
        //         cc.moveTo(5,cc.p(500,20)),
        //     	cc.moveTo(5,cc.p(0,20))
        //     ]);
        // testImage.runAction(seq.repeatForever());

        this.notifyText = new ccui.Text();
        clipNode.addClipChild(this.notifyText);
        this.notifyText.setAnchorPoint(cc.p(0,0.5));
        this.notifyText.setTextHorizontalAlignment(cc.TEXT_ALIGNMENT_LEFT);
        this.notifyText.setTextVerticalAlignment(cc.VERTICAL_TEXT_ALIGNMENT_CENTER);

        this.notifyText.setPosition(cc.p(this.clipSize.width,this.clipSize.height/2.0));
        this.notifyText.setContentSize(bgSize);
        this.notifyText.setFontSize(28);
        this.notifyText.string = "";

        var textSize = this.notifyText.getContentSize();

        this.addChild(clipNode);

        this.msgList = [];
        this.isRuningAction = false;
        //this.setVisible(false);
        this.schedule(this.update.bind(this));

        //this.pushMsg(" fdlaklfdsakls考虑对方吉林大街发讲课费接口",0.2,28,cc.color(255,0,0,255));
        // this.pushMsg("凯乐科技弗兰克多打开拉夫放大发附近开了就发呆啦发放健康啦发送",0.2,30,cc.color(255,255,0,255));
        // this.pushMsg(" 发大发发建档立卡积分大家发动机艾弗森的范德萨拉开了几个定时关机",0.2,20,cc.color(255,0,255,255));
        // this.pushMsg(" gdksla gdjalklkdfakljflkdj大街发讲课费接口",0.2,35,cc.color(0,255,0,255));
        // this.pushMsg("d多凯乐科技弗兰克打开拉凯乐科技弗兰克夫放大发附kls考虑对方吉林大街发讲课费接口",0.2,40,cc.color(0,0,255,255));

        // this.pushMsg(" fdlaklfdsakls考虑对方吉林大街发讲课费接口");
        // this.pushMsg("凯乐科技弗兰克多打开拉夫放大发附近开了就发呆啦发放健康啦发送");
        // this.pushMsg(" 发大发发建档立卡积分大家发动机艾弗森的范德萨拉开了几个定时关机");
        // this.pushMsg(" gdksla gdjalklkdfakljflkdj大街发讲课费接口");
        // this.pushMsg("d多凯乐科技弗兰克打开拉凯乐科技弗兰克夫放大发附kls考虑对方吉林大街发讲课费接口");

        // var self = this;
        // var seq = cc.Sequence([
        //     cc.delayTime(Math.floor( Math.random() * 5 )+1),
        //     cc.CallFunc(function(){
        //         var str = "";
        //         var max = Math.floor( Math.random() * 4 )+1;
        //         for(var index=0; index<max; ++index){
        //             str = str+"跑马灯测试..";
        //         }
        //
        //         var speed = Math.random()/3.0+0.15;
        //         var fontSize = Math.floor( Math.random() * 20 )+20;
        //
        //         self.pushMsg(str,speed,fontSize,cc.color(Math.floor( Math.random() * 255 ),Math.floor( Math.random() * 255 ),Math.floor( Math.random() * 255 ),255));
        //     }, this)
        // ]);
        //
        // bg.runAction(seq.repeatForever());

        this.setVisible(false);

		return true;
	},
    update: function(dt){
	    if(this.msgList.length>0){
	        if(!this.isRuningAction){
                var msgInfo = this.msgList[0];

                this.notifyText.setFontSize(msgInfo.fontSize);
                this.notifyText.setColor(msgInfo.fontColor);

                this.notifyText.string = msgInfo.strMsg;
                var textSize = this.notifyText.getContentSize();
                textSize.width = msgInfo.strMsg.length*msgInfo.fontSize/2.0;
                var runTimes = msgInfo.strMsg.length*msgInfo.runTimes;
                cc.log("msgInfo.strMsg.length--"+msgInfo.strMsg.length+"--textSize.width--"+textSize.width);

                this.notifyText.setContentSize(textSize);
                this.notifyText.setPosition(cc.p(this.clipSize.width,this.clipSize.height/2.0));

                var self = this;
                var seq = cc.Sequence([
                    cc.moveTo(runTimes,cc.p(0-this.notifyText.getContentSize().width,this.clipSize.height/2.0)),
                    cc.CallFunc(function(){
                        cc.log("self.msgList.length----"+self.msgList.length);
                        self.isRuningAction = false;
                        if(self.msgList.length==0)
                            self.setVisible(false);
                    }, this)
                ]);
                this.notifyText.runAction(seq);
                this.setVisible(true);
                this.isRuningAction = true;
                this.msgList.splice(0,1);
                cc.log("this.msgList.length----++++++++"+this.msgList.length);
            }
        }
    },

	start: function(){

	},
	pushMsg: function(strMsg, runTimes, fontSize, fontColor){
	    var msgInfo = {};
        msgInfo.strMsg = strMsg;
        msgInfo.runTimes = runTimes || 0.35;
        msgInfo.fontSize = fontSize || 28;
        msgInfo.fontColor = fontColor || cc.color(255,255,255,255);

        this.msgList.push(msgInfo);
	},

	end:function(){}
});

///////////////////////////////////////////////////////////
horseRaceLamp.getInstance = function(){
    if (!g_horseRaceLamp) {
        g_horseRaceLamp = new horseRaceLamp();
        if (g_horseRaceLamp) {
            cc.director.setNotificationNode(g_horseRaceLamp);
            return g_horseRaceLamp;
        }
    }
    return g_horseRaceLamp;
}