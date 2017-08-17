/**
 * Created by lingjianfeng on 15/4/2.
 */

var LevelLoader = cc.Class.extend({
    levelInfo : null,
    resources : null,
    ctor : function(level){
        // 加载[plist关卡文件]
        this.loadPlist(level);
        // 载入[等级信息到GameManager单例对象]
        this.loadLevelInfo();
        return true;
    },
    // 加载[plist关卡文件]
    loadPlist : function(level){
        var self = this;
        var plist = "res/levelInfo_" + level + ".plist";
        // TODO 知识点。 加载plist文件， 可以批量加载， 保存在results数组中
        cc.loader.load([plist], function(err, results){
            if(err){
                cc.error("Failed to load %s, %s .", plist);
                return;
            }
            self.levelInfo = results[0].levelInfo;
            self.resources = results[0].resources;
        });

        cc.log("=======尼玛。- - ========");
        cc.log(self.levelInfo);
        cc.log(self.resources);
        cc.log("=======尼玛。- - ========");

    },
    loadLevelInfo : function(){
        // 从plist中获取金钱等，并加入到GameManager单例对象中
        var instance = GameManager.getInstance();
        instance.clear();

        var currBgName  = this.resources.image;
        var currMapName = this.resources.map;
        var money      = parseInt(this.levelInfo.money);
        var currLevelFile  = this.levelInfo.currlevel;
        var nextLevelFile  = this.levelInfo.nextlevel;
        var group = this.levelInfo.group;

        instance.currBgName = currBgName;
        instance.currMapName = currMapName;
        instance.money = money;
        instance.currLevelFile = currLevelFile;
        instance.nextLevelFile = nextLevelFile;

        // 获取多少组怪物
        var length = 0;
        for (var iter in group){
            length++;
        }

        cc.log(group);
        instance.groupNum = length;

        for (var i = 0; i < length; i++){
            var enemyConfig = group[i + 1 + ""];
            var type1Num = parseInt(enemyConfig.type1Num);
            var type1Hp = parseInt(enemyConfig.type1Hp);

            var type2Num = parseInt(enemyConfig.type2Num);
            var type2Hp = parseInt(enemyConfig.type2Hp);

            var type3Num = parseInt(enemyConfig.type3Num);
            var type3Hp = parseInt(enemyConfig.type3Hp);

            var groupEnemy = new GroupEnemy(type1Num, type1Hp, type2Num, type2Hp, type3Num, type3Hp);
            instance.groupVector.push(groupEnemy);
        }
    }
});
