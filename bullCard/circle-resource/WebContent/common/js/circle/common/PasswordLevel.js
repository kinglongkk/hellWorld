/**
 * 密码强度
 * Created by jeff on 15-11-24.
 */
define([], function () {
    return Class.extend({
        level1:new RegExp('^[a-zA-Z]+$'),/*单一形式字母或数字*/
        level2:new RegExp('^[0-9]+$'),
        level3:new RegExp('^[0-9a-zA-Z]+$'),/*单一形式字母+数字*/
        level4:new RegExp('^[A-Za-z0-9~!@#$%^&*()_+\\{\\}\\[\\]|\\:;\'\"<>,./?]+$'),/*大小写字母+数字+字符*/
        levelClass:'passafegreen',
        //level:0,
        //weakPwdArray : ["123456", "123456789", "111111", "5201314", "12345678", "123123", "password", "1314520",
        //                "123321", "7758521", "1234567", "5211314", "666666", "520520", "woaini", "520131", "11111111",
        //               ],

        init: function () {
            var that = this;
            var $passwordLevel = $("._password_level");
            if($passwordLevel.length){
                var selector = $passwordLevel.data().selector;
                $('input[name="'+selector+'"]').on("keyup",function(){
                    var value = $(this).val();

                    //if(value.length >=8) {
                    //    if(that.level3.test(value)) {
                    //        that.level++;
                    //    }
                    //    if(that.level2.test(value)) {
                    //        that.level++;
                    //    }
                    //    if(that.level1.test(value)) {
                    //        that.level++;
                    //    }
                    //    if(that.level > 3) {
                    //        that.level = 3;
                    //    }
                    //    that.changeLevel($passwordLevel,that.level);
                    //    $('input',$passwordLevel).val(that.level*10)
                    //}
                    var level = that.pwdLevel(value);
                    that.changeLevel($passwordLevel,level);
                    $('input',$passwordLevel).val(level*10)
                });
            }
        },
        changeLevel:function(obj,level){
            var $levels = $('.controls .passafe',obj);
            $levels.removeClass(this.levelClass);
            if(level > 0) {
                $levels.eq(level-1).prevAll().andSelf().addClass(this.levelClass);
            }
        },

        pwdLevel:function(value){
            var that = this;
            var level = 0;
            if(value.length>=7) {
                if(this.level1.test(value) || this.level2.test(value)){
                    level = 1;
                }else if(this.level3.test(value)){
                    level = 2;
                }else if(this.level4.test(value)){
                    level = 3;
                }
            }
            return level;
        },

        //weakPwd:function(str){
        //    var that = this;
        //    for (var i = 0; i < that.weakPwdArray.length; i++) {
        //        if (that.weakPwdArray[i] == str) {
        //            return true;
        //        }
        //    }
        //    return false;
        //}


    });
});