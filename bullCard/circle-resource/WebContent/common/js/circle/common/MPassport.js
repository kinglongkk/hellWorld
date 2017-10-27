/**
 * 登录退出相关脚本
 * author: Longer
 */
define(['common/Passport'], function (Passport) {
    return Passport.extend({
        /**
         * 初始化及构造函数，在子类中采用
         * this._super();
         * 调用
         */
        init : function() {
            this._super();
        },


        _getLogoutUrl: function () {
            return root + "/player" + this.logoutUrl;
        }
    });
});