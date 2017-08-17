/**
 * Created by lingjianfeng on 15/4/2.
 */

var GPToolLayer = cc.Layer.extend({
    toolBar : null,
    moneyLab : null,
    groupIndexLab : null,
    gameManager     : null,
    maxHp : 0,
    ctor : function () {
        this._super();
        this.loadConfig();
        this.loadToolBar();
        this.loadMoney();
        this.loadGroupIndex();
        this.loadPlayHpBar();
        return true;
    },
    loadConfig : function(){
        this.gameManager = GameManager.getInstance();
        this.maxHp = this.gameManager.getCurrHp(); // 首次保存下血量的最大值
    },
    loadToolBar : function(){
        var node = new cc.Sprite("#gp_toolBg.png");
        this.addChild(node);
        node.setAnchorPoint(0.5, 1);
        node.setPosition(GC.w2, GC.h);

        this.toolBar = node;
    },
    loadMoney : function(){
        var node = new cc.LabelBMFont("", "res/fonts/bitmapFontChinese.fnt");
        this.toolBar.addChild(node);
        node.setPosition(this.toolBar.getContentSize().width / 8, this.toolBar.getContentSize().height / 2);
        node.setAnchorPoint(0, 0.5);
        node.setString(this.gameManager.getMoney());

        this.moneyLab = node;
    },
    loadGroupIndex : function(){
        var idxNode = new cc.LabelBMFont("", "res/fonts/bitmapFontChinese.fnt");
        this.toolBar.addChild(idxNode);
        idxNode.setPosition(this.toolBar.getContentSize().width / 8 * 3, this.toolBar.getContentSize().height / 2);
        idxNode.setAnchorPoint(0, 0.5);
        idxNode.setString("1");

        var sumNode = new cc.LabelBMFont("", "res/fonts/bitmapFontChinese.fnt");
        this.toolBar.addChild(sumNode);
        sumNode.setPosition(this.toolBar.getContentSize().width / 2, this.toolBar.getContentSize().height / 2);
        sumNode.setAnchorPoint(0.5, 0.5);
        sumNode.setString(GameManager.getInstance().getGroupNum());

        this.groupIndexLab = idxNode;
    },
    loadPlayHpBar : function(){
        var bar = new cc.ProgressTimer(new cc.Sprite("#gp_playHp.png"));
        this.toolBar.addChild(bar);
        bar.setPosition(this.toolBar.getContentSize().width / 5 * 4, this.toolBar.getContentSize().height / 2);
        bar.setType(cc.ProgressTimer.TYPE_BAR);
        bar.setMidpoint(cc.p(0, 0.5));
        bar.setBarChangeRate(cc.p(1, 0));
        bar.setPercentage(100);

        this.hpBar = bar;

        var barBg = new cc.Sprite("#gp_playStar.png");
        barBg.setPosition(this.toolBar.getContentSize().width / 5 * 4, this.toolBar.getContentSize().height / 2);
        this.toolBar.addChild(barBg);
    },
    getGroupIndexLabel : function(){
        return this.groupIndexLab;
    },
    onSubHp : function(value){
        var newHp =  this.gameManager.getCurrHp() - value;
        this.hpBar.setPercentage(newHp / this.maxHp * 100);
        this.gameManager.setCurrHp(newHp);
    },
    onSubMoney : function(value){
        var newMoney =  this.gameManager.getMoney() - value;
        this.moneyLab.setString(newMoney + "");
        this.gameManager.setMoney(newMoney);
    },
    onAddMoney : function(value){
        var newMoney =  this.gameManager.getMoney() + value;
        this.moneyLab.setString(newMoney + "");
        this.gameManager.setMoney(newMoney);
    }
});




