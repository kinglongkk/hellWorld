/**
 * Created by lingjianfeng on 15/4/2.
 */



var LEVEL_ROW = 2;  // 行
var LEVEL_COL = 3;  // 列

var LevelPage = cc.Node.extend({
    bgName : null,
    level : 0,
    bg : null,
    ctor : function(bgName, level){
        this._super();
        this.loadConfig(bgName, level);
        this.loadBg();
        this.loadSelectItem();
        return true;
    },
    loadConfig : function(bgName, level){
        this.bgName = bgName;
        this.level = level;
    },
    loadBg : function(){
        var node = new cc.Sprite(this.bgName);
        this.addChild(node);
        node.setPosition(GC.w2, GC.h2);

        this.bg = node;
    },

    loadSelectItem : function(){
        var size = new cc.Sprite("#cl_card_0.png").getContentSize();
        var offset = size.width / 4;

        // TODO
        var startX = (GC.w - (LEVEL_COL * size.width + (LEVEL_COL - 1) * offset)) / 2 + size.width / 2;
        var startY = (GC.h - (LEVEL_ROW * size.height + (LEVEL_ROW - 1) * offset)) / 2 + (LEVEL_ROW - 1) * (size.height + offset) + size.height / 2;

        var menuItem = [];
        for (var row = 0; row < LEVEL_ROW; row++){
            var y =  startY - (size.height + offset) * row;

            for (var col = 0; col < LEVEL_COL; col++){
                var x = startX + (size.width + offset) * col;

                var nodeNormal = new cc.Sprite("#cl_card_0.png");
                var nodeSelected = new cc.Sprite("#cl_card_1.png");
                var nodeDisabled = new cc.Sprite("#cl_card_2.png");

                var node = new cc.MenuItemSprite(
                    nodeNormal,
                    nodeSelected,
                    nodeDisabled,
                    this.onGameStart,
                    this
                );
                menuItem.push(node);
                node.setPosition(x, y);

                var tag = row * LEVEL_ROW + col + this.level * LEVEL_ROW * LEVEL_COL;
                if (row == LEVEL_ROW - 1){
                    tag += 1;
                }
                node.setTag(tag);

                var levelStr = cc.sys.localStorage.getItem("maxLevelNum");
                var levelNum = levelStr ?  parseInt(levelStr) : 0;

                // 如果不存在， 则开始第一关
                if (!levelStr){
                    cc.sys.localStorage.setItem("maxLevelNum", 0);
                }

                if(levelNum < row * LEVEL_ROW + col + this.level * LEVEL_ROW * LEVEL_COL){
                    node.setEnabled(false);
                }
            }
        }

        var menu = new cc.Menu(menuItem);
        this.addChild(menu);
        menu.setPosition(0, 0);
    },
    onGameStart : function(sender){
        var node = sender;
        // 设置下一关
        cc.sys.localStorage.setItem("nextLevel", node.getTag());

        // 加载一下关卡
        new LevelLoader(node.getTag());

        GameManager.getInstance().setCurrLevel(node.getTag());

        var scene = new LevelInfoScene();
        cc.director.runScene(new cc.TransitionFade(GC.TransitionTime, scene));
    }
});