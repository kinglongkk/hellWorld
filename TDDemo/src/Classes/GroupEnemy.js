/**
 * Created by lingjianfeng on 15/4/2.
 */

var GroupEnemy = cc.Class.extend({
    type1Num    : 0,
    type1Hp     : 0,
    type2Num    : 0,
    type2Hp     : 0,
    type3Num    : 0,
    type3Hp     : 0,
    enemySum    : 0,
    // [TODO] : 超过5个参数， 改用配置方式
    ctor : function(type1Num, type1Hp, type2Num, type2Hp, type3Num, type3Hp){
        this.loadConfig(type1Num, type1Hp, type2Num, type2Hp, type3Num, type3Hp);
        return true;
    },
    loadConfig : function(type1Num, type1Hp, type2Num, type2Hp, type3Num, type3Hp){
        this.type1Num = type1Num;
        this.type1Hp = type1Hp;
        this.type2Num = type2Num;
        this.type2Hp = type2Hp;
        this.type3Num = type3Num;
        this.type3Hp = type3Hp;
        this.enemySum = type1Num + type2Num + type3Num;
    }
});