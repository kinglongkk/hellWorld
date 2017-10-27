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
                    $(item).formtip(window.top.message.group['input.right.userbetmax']);
                }
            });
            $("[name$='itemMax']","table:first").each(function(index,item){
                var uItemMaxValue = parseInt($(item).val());
                var itemMaxValue = parseInt($(item).next().val());
                if (uItemMaxValue>=itemMaxValue) {
                    $(item).addClass('error');
                    valid = false;
                    $(item).formtip(window.top.message.group['input.right.useritemmax']);
                }
            });
            $("[name$='betMax']","table:eq(1)").each(function(index,item){
                var uBetMaxValue = parseInt($(item).val());
                var betMaxValue = parseInt($(item).next().val());
                if (uBetMaxValue>=betMaxValue) {
                    $(item).addClass('error');
                    valid = false;
                    $(item).formtip(window.top.message.group['input.right.usermultiplebetmax']);
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

        goQuery : function(event,option) {
            window.top.topPage.ajax({
                loading:true,
                url: root+'/vUserPlayerGroup/Index.html',
                type:"post",
                data:this.getCurrentFormData(event),
                success:function(data){
                    var $result=$("#mainFrame");
                    $result.html(data);
                    event.page.onPageLoad();
                    $(event.currentTarget).unlock()},
                error:function(data, state, msg){
                    window.top.topPage.showErrorMessage(window.top.message.common["server.error"]);
                    $(event.currentTarget).unlock();
                }}
            );
        }
    });
});