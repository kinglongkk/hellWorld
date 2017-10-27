/**
 * Created by jeff on 15-12-29.
 */
define(['cookie'], function (cookie) {

    return Class.extend({
        formSelector:'form',
        cookieKey:"HIDE_HINT_FOR_BROWSER_VERSION",
        init: function () {
            var that = this;
            $(".captcha-code").on("click",function(event){
                that.changeCode();
            });
           that.initCheckBrowser();
        },
        bindEvent: function () {
        },
        onPageLoad: function () {
        },
        changeCode:function (event,option){
            var timestamp = (new Date()).valueOf();
            var src = root + "/captcha/code.html?t=" + timestamp;
            $(".captcha-code").attr("src", src);
            event && $(event.currentTarget).unlock();
        },

        bindButtonEvents: function () {
            window.top.topPage.bindButtonEvents(this,document);
        },
        closeHint:function( event , option ){
            var $this = $(event.currentTarget);
            $this.parents(".hint-content").hide();
            $this.unbind();
            $.cookie(this.cookieKey,true);
        },
        /* 判断ＩＥ版本,仅判断*/
        isIE : function(ver){
            var b = document.createElement('b')
            b.innerHTML = '<!--[if IE ' + ver + ']><i></i><![endif]-->'
            return b.getElementsByTagName('i').length === 1
        },
        showBrowserTip: function(){
            var bol = $.cookie(this.cookieKey);
            if(bol !== 'true'){
                $(".hint-box").show();
            }
        },
        initCheckBrowser:function(){
            var Sys = {};
            var s;
            var ua = navigator.userAgent.toLowerCase();
            (s = ua.match(/rv:([\d.]+)\) like gecko/)) ? Sys.ie = s[1] :
            (s = ua.match(/msie ([\d.]+)/)) ? Sys.ie = s[1] :
            (s = ua.match(/firefox\/([\d.]+)/)) ? Sys.firefox = s[1] :
            (s = ua.match(/chrome\/([\d.]+)/)) ? Sys.chrome = s[1] :0;
            /* boss ccenter tcenter - [ff][chrome]*/
            var $subSysCode = $('[name=subsysCode]');
            if($subSysCode.val() === 'mcenterTopAgent' || $subSysCode.val() === 'ccenter' || $subSysCode.val() == 'boss'){
                if( !Sys.firefox && ! Sys.chrome){
                    this.showBrowserTip();
                }
            }
            /* mcenter - [ff][chrome][10+] */
            if($subSysCode.val() === 'mcenter'){
                if( !Sys.firefox && ! Sys.chrome && (this.isIE(9)||this.isIE(8)||this.isIE(7)||this.isIE(6))){
                    this.showBrowserTip();
                }
            }
            /* agent pcenter msites - [ff][chrome][8+] */
            if($subSysCode.val() === 'pcenter'|| $subSysCode.val() === 'mcenterAgent' ){
                if( !Sys.firefox && ! Sys.chrome && (this.isIE(7)||this.isIE(6))){
                    this.showBrowserTip();
                }
            }
        }
    });
});