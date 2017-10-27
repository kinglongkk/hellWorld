/**
 * 玩家信息-地址
 */
define(['common/BasePage'], function (BasePage) {

    return BasePage.extend({
        select: null,
        /**
         * 初始化及构造函数，在子类中采用
         * this._super();
         * 调用
         */
        init: function () {

        },
        queryBankCard: function (e, option) {
           if(e.returnValue) {
               var userId = option.userId;
               var refresh = $(e.currentTarget).parent().parent().parent().parent();
               $(refresh).html('<img src="'+resRoot+'/images/022b.gif">');
               $(refresh).load(root + '/player/view/bankCard.html?search.userId=' + userId);
           }
        }
    });

});