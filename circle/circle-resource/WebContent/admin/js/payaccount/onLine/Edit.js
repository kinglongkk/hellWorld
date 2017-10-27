//模板页面
define(['common/BaseEditPage'], function (BaseEditPage) {

    return BaseEditPage.extend({
        /**
         * 初始化及构造函数，在子类中采用
         * this._super();
         * 调用
         */
        init: function (title) {
            this.formSelector = "form";
            this._super();
            $('.help-popover').popover();
        },
        /**
         * 页面加载和异步加载时需要重新初始化的工作
         */
        onPageLoad: function () {
            /**
             * super中已经集成了
             *      验证、
             *      chosen Select
             * 控件的初始化
             */
            this._super();
        },
        /**
         * 当前页面所有事件初始化函数
         */
        bindEvent: function () {
            this._super();
            var _this = this;
            //这里初始化所有的事件
            $(this.formSelector).on("change","#fullRank", function () {
                var sta=$(this).is(':checked');
                $("input[name='result.fullRank']").val(sta);
                if(sta){
                    $(".allRank").addClass('hide');
                    $("input[name='rank']").attr('checked',true);
                }else{
                    $(".allRank").removeClass('hide');
                    $("input[name='rank']").attr('checked',false);
                }
            });

            //累计金额和次数恢复
            $(this.formSelector).on("click",".revert", function () {
                var sourceId=$(this).attr('sourceId');
                var targetId=$(this).attr('targetId');
                $("#"+targetId).val($("#"+sourceId).val());
            });
        },
        updatePayAccount: function (e) {
            //拼装货币
            var currencyStr = "";
            $('input[name="currency"]:checked').each(function (index) {
                var val = $(this).val();
                if (index == 0) {
                    currencyStr = currencyStr + val;
                } else {
                    currencyStr = currencyStr + "," + val;
                }
            });
            $("#currencyStr").val(currencyStr);
            //拼装层级
            var rankStr = "";
            $('input[name="rank"]:checked').each(function (index) {
                var val = $(this).val();
                if (index == 0) {
                    rankStr = rankStr + val;
                } else {
                    rankStr = rankStr + "," + val;
                }

            });
            $("#rankStr").val(rankStr);
            var b = this.validateForm(e);
            if (!b) {
                $(e.currentTarget).unlock();
                return false;
            }
            return true;
        },
        savePayAccountAndFlowOrder: function () {
            $("#savePlsyer").click();
        },
        saveCallbak: function() {
            window.top.topPage.goToLastPage(true);
        }
    });
});