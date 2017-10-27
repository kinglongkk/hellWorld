/**
 * 登录退出相关脚本
 * author: Longer
 */
define([], function () {
    return Class.extend({
        loginUrl: "/passport/Login.html",
        logoutUrl: "/passport/logout.html",

        /**
         * 初始化及构造函数，在子类中采用
         * this._super();
         * 调用
         */
        init : function() {
            this.bindLogin();
            this.bindLogout();

        },

        /**
         * 绑定登录按钮事件
         */
        bindLogin : function(){

        },

        /**
         * 绑定退出按钮事件
         */
        bindLogout : function(){
            var _this = this;
            $(".off").children('a').click( function(){
                _this.logout();
            });
        },

        /**
         * 退出系统方法
         */
        logout : function(){
            var url = this._getLogoutUrl();
            window.top.location.href = url;
        },

        _getLogoutUrl: function () {
            return root + this.logoutUrl;
        }
    });
});