define([], function () {

    return Class.extend({
        init: function () {
            this.bindEvent();
        },
        _getWin : function(content,date,winType){
            return "<div class=\"inform-"+winType+" clearfix shadow\"><div class=\"btn-close\"><a href=\"javascript:void(0)\" class=\"\">×</a></div>"+
                "<div class=\"in-details\"><span class=\"hint-text\">"+content+"</span>"+
                "<span class=\"hint-time al-right\">"+date+"</span></div></div>";
        },
        bindEvent : function(){
            $(".unfold").on("click",function (){
                $(".max-ccc").children().first().nextAll().slideToggle(300);
                $(this).toggleClass("open");
            });
        },
        pop : function(content,date,winType){
            var win = this._getWin(content,date,winType)
            var isShow = $(".real-time-inform").hasClass("open");
            if($(".max-ccc").children().length==0) {
                $(".max-ccc").append(win);
            }else {
                $(win).insertBefore($(".max-ccc").children().first());
            }
            if(isShow){
                if($(".unfold").hasClass("open")) {
                    $(".max-ccc").children().first().next().slideToggle(300);
                }
            }else{
                $(".real-time-inform").toggleClass("open");
                $(".real-time-inform").slideToggle();
            }
            $(".btn-close>a").on("click",function (){
                $(this).parents(".clearfix").next().show();
                $(this).parents(".clearfix").remove();
            });
            if($.browser && $.browser.version=='8.0'){
                //本来这里用的是<bgsound src="system.wav"/>,结果IE8不播放声音,于是换成了embed
                $('#newMessageDIV').html('<embed src="http://192.168.0.88:8080/fserver/files/settingTone/59/1440061861757.wav"/>');
            }else{
                //IE9+,Firefox,Chrome均支持<audio/>
                $('#newMessageDIV').html('<audio autoplay="autoplay"><source src="http://192.168.0.88:8080/fserver/files/settingTone/59/1440061861757.wav"'
                    + 'type="audio/wav"/></audio>');
            }
        },
        showDialog :function(opt){
            window.top.topPage.openDialog(opt);
        }

    });
});