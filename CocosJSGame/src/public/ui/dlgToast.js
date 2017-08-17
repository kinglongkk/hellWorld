/**
 * Created by Administrator on 2017/8/3.
 */

var Length_Short = 1.5
var Length_Long  = 3
var Toast = cc.Node.extend({
    ctor:function () {
        this._super();
        cc.log("--------------toast init()")
        var json = ccs.load("res/public/dlg_toast.json");
        this._rootWidget = json.node;
        this.addChild(this._rootWidget)

        var template = this._rootWidget.getChildByName("template");
        template.setVisible(false)
        var label = template.getChildByName("label")
        label.removeFromParent(true)
        this.offsetWidth = 100

        template.removeFromParent(false)
        template.retain()
        this.template = template

        var pt = template.getPosition()
        this.templatePt = pt
    },

    onEnter: function () {
        this._super();
    },

    onExit : function () {
        cc.log("-----------------退出了toast")
        this._super();
        if (this._rootWidget) {
            this._rootWidget.stopAllActions()
            this._rootWidget.removeAllChildren()
            this.template.release()
        }
    },

    update: function(dt){
        this._super(dt);

    },
    onEnterTransitionDidFinish:function () {
        this._super();
    },

    show:function (str,color, t) {
        var runScene = cc.director.getRunningScene();
        if (this.getParent() != runScene)
        {
            cc.log("-----------父亲没了 ：")
        }

        var height = this.template.getContentSize().height + 1
        var _children = this._rootWidget.getChildren(); // 将原来的节点向上推一个高度
        for(var i = 0, len = _children.length; i < len; i++)
        {
            var child = _children[i]
            child.setPositionY(child.getPositionY() + height)
        }

        var showT = t || Length_Long;
        var showColor = color || cc.color(255,255,255)
        var toastNode = this.template.clone()
        toastNode.setVisible(true)
        toastNode.setPosition(this.templatePt)
        toastNode.setName("toastNode")
        var label = new cc.LabelTTF(str, "Arial", 22)
        label.setColor(showColor);
        var size = label.getContentSize()
        size.width = size.width + 40
        toastNode.setContentSize(size)
        var pt = cc.p(size.width * 0.5, size.height*0.5)
        label.setPosition(pt)
        toastNode.addChild(label)
        this._rootWidget.addChild(toastNode)
        var fadeIn = cc.FadeIn(0.3)
        var fadeOut = cc.FadeOut(0.3)
        var delayTime = cc.DelayTime(showT - 0.6)
        toastNode.runAction(cc.sequence(fadeIn,delayTime, fadeOut))
        var action = cc.Sequence( cc.DelayTime(showT), cc.RemoveSelf(true))
        toastNode.runAction(action)
    },
});

var SHOWTIP = function (str, color, t) {
    var runScene = cc.director.getRunningScene();
    if(runScene){
        var toast = runScene.getChildByName("toast")
        if (!toast)
        {
            toast = new Toast()
            runScene.addChild(toast, 1000, "toast")
        }
        toast.show(str, color, t)
    }
};
var SHOWERROR = function (str, t) {
    SHOWTIP(str,cc.color(255, 10,10, t))
};
cc.log("----------载入了toast------------")

