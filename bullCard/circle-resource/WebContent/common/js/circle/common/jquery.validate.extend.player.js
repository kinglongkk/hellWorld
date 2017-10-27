/**
 * Created by Kevice on 2015/1/22.
 */
(function( factory ) {
    if ( typeof define === "function" && define.amd ) {
        define( ["jquery", "jqValidate"], factory );
    } else {
        factory( jQuery );
    }
}(function( $ ) {


    //============================================ formtip===================================
    $.fn.formtip = function(message,second,ele) {
        message = "<span class=\"tips orange\"><i class=\"mark plaintsmall\"></i>"+message+"</span>";
        var _this = this;
        if(typeof(ele) != "undefined") {
            _this = ele;
        }
        var tipObj =$("[tipsName=\'"+_this[0].name+"-tips\']")
        _this = tipObj.length>0?tipObj:_this;
        this._setTips(message,_this);
    }

    $.fn._setTips = function(message,_this){
        if(_this.next().hasClass("tips")){
            _this.next().remove();
        }
        if(_this.next().hasClass("mark")){
            _this.next().remove();
        }
        $(message).insertAfter(_this);
    }

    $.fn.showSuccMsg = function() {
        var isShowSuccMsg = $(this[0]).attr("showSuccMsg");
        var message = "<i class='mark successsmall'></i>";
        if(isShowSuccMsg&&isShowSuccMsg=="false") {
            message = "";
        }
        var tipObj =$("[tipsName=\'"+this[0].name+"-tips\']")
        var _this = tipObj.length>0?tipObj:this;
        if(this.is(":hidden")&&tipObj.length<=0) {
            return ;
        }
        this._setTips(message,_this);
    }

}));
