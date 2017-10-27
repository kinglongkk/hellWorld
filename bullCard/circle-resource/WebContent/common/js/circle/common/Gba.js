/**
 * Created by longer on 9/8/15.
 * TODO:Longer 一般只需要site站点使用，需要修改成非define
 */
define(['uuid','cookie'], function (uuid,cookie) {
    return Class.extend({

        gbaUrl : root + '/sysSiteVisitor/gba.html',

        init : function() {
            setTimeout( this.main(),1000 );
        },

        main : function() {
            var data = this.collect();
            var _this = this;
            if (this.isNeedCollect(data)) {
                $.ajax( this.gbaUrl,{
                    data : data,
                    type: 'POST',
                    dataType:'json',
                    async: true,
                    cache: false,
                    success : function() {
                        _this.toCookie(data);
                    },
                    error : function(err){

                    }
                });
            }
        },

        /**
         * 是否需要收集
         */
        isNeedCollect : function(data){
            var isNew = data['result.isNew'];
            var source = data['result.source'];
            var hostname = window.location.hostname;
            var isReferer = false;
            if (source == "") {
                isReferer = false;
            } else if (!source.startsWith("http://"+hostname) || !source.startsWith("https://"+hostname)){
                isReferer = true;
            }
            if (isReferer || isNew) {
                return true;
            } else {
                return false;
            }
        },

        /**
         * 收集数据
         */
        collect : function(){
            var referer = document.referrer;
            var accessPage = window.location.href;
            var visitor = $.cookie("GBA");
            var isNew = false;
            if (visitor == undefined) {
                visitor = $.uuidShort();
                isNew = true;
            }
            return { 'result.source':referer,'result.visitor':visitor,'result.isNew':isNew,'result.accessPage':accessPage};
        },

        /**
         * 记录到cookie
         */
        toCookie : function(data){
            var expires = this._expiresDate();
            $.cookie("GBA",data['result.visitor'],{expires:expires,path : "/"}); //一天
        },

        /**
         * 过期日期
         * @private
         */
        _expiresDate : function(){
            var day = new Date();
            day.setHours(23);
            day.setMinutes(59);
            day.setSeconds(59);
            day.setMilliseconds(999);
            return day;
        }
    });
});


