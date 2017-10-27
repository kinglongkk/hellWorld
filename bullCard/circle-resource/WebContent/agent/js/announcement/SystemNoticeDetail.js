/**
 * Created by Orange on 2015-11-17
 */

define(['common/BaseEditPage'], function (BaseEditPage) {

    return BaseEditPage.extend({
        init: function () {
            this._super();
        },

        onPageLoad: function () {
            this._super();
        },
        //系统公告弹窗
        systemNoticeDetail: function (e,option) {
            var _this = e.currentTarget;
            var apiId = $(_this).parent().attr("apiId");
            this.returnValue={isDetail:true,apiId:apiId};
            window.top.topPage.closeDialog();
        }
    });

});
