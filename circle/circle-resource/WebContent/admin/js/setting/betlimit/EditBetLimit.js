/**
 * Created by tom on 16-04-26.
 */
define(['common/BaseEditPage'], function (BaseEditPage) {

    return BaseEditPage.extend({
        init: function () {
            this._super();
        },

        bindEvent: function () {
            this._super();
        },

        onPageLoad: function () {
            var _this = this;
            this._super();
        },

        myValidateForm:function(e,btnOption){
            var valid = true;
            $("tbody").find("tr").each(function(index,item){
                var betMin = $(item).find("[name$='betMin']").val();
                var betMax = $(item).find("[name$='betMax']").val();
                var minusNum = parseInt(betMax)-parseInt(betMin);
                if (minusNum<=0) {
                    $(item).find("[name$='betMax']").addClass("error");
                    valid = false;
                    $(item).find("[name$='betMax']").formtip(window.top.message.setting['betmax.more.than.betmin']);
                }
            })
            if (!valid) {
                return false;
            }
            if (!this.validateForm(e)) {
                return false;
            }
            return true;
        },
    });
});