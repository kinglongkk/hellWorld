/**
 * 登录退出相关脚本
 * author: Longer
 */
define([], function () {
    return Class.extend({

        /**
         * 初始化及构造函数，在子类中采用
         * this._super();
         * 调用
         */
        init : function() {
        },

        /**
         * 弹出结算页面事件
         */
        settlement : function(matchId,rtype){
            window.top.topPage.doDialog({page:this},{text:window.top.message.common['msg'],target: root+"/Settlement/matchStatistics.html?search.matchId="+matchId+"&search.rType="+rtype,callback:""});
        },
    });
});
function initChecked(){
       // $(".navbar-left").find(":last-child").trigger("click");alert("11");
    $("#navbar .navbar-left").find(":first-child").trigger("click");alert("11");


}
