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
            $("[name$='betMax']","table:first").each(function(index,item){
                var uBetMaxValue = parseInt($(item).val());
                var betMinValue = parseInt($(item).prev().val());
                var betMaxValue = parseInt($(item).next().val());
                if (uBetMaxValue<=betMinValue || uBetMaxValue>=betMaxValue) {
                    $(item).addClass('error');
                    valid = false;
                    $(item).formtip(window.top.message.setting['input.right.userbetmax']);
                }
            });
            $("[name$='itemMax']","table:first").each(function(index,item){
                var uItemMaxValue = parseInt($(item).val());
                var itemMaxValue = parseInt($(item).next().val());
                if (uItemMaxValue>=itemMaxValue) {
                    $(item).addClass('error');
                    valid = false;
                    $(item).formtip(window.top.message.setting['input.right.useritemmax']);
                }
            });
            $("[name$='betMax']","table:eq(1)").each(function(index,item){
                var uBetMaxValue = parseInt($(item).val());
                var betMaxValue = parseInt($(item).next().val());
                if (uBetMaxValue>=betMaxValue) {
                    $(item).addClass('error');
                    valid = false;
                    $(item).formtip(window.top.message.setting['input.right.usermultiplebetmax']);
                }
            });
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