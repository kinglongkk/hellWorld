/**
 * Created by snekey on 15-8-13.
 */
define(['common/BaseListPage'], function (BaseListPage) {
    return BaseListPage.extend({
        init: function () {
            this._super();
        },

        bindEvent: function () {
            this._super();
        },
        onPageLoad: function () {
            this._super();
            var _this = this;
        },

        /**
         * 批量删除
         * @param e
         * @param opt
         * @returns {boolean}
         */
        deleteConfirm : function(e,opt){
            return false;
        },
        /**
         * 检查是否选中了记录
         * @param e
         * @returns {boolean}
         */
        valiSelected: function (e,opt) {
            var _target = e.currentTarget;
            var selectIds = this.getSelectIds(e);
            if (selectIds.ids) {
                window.top.topPage.doAjax(e,opt);
                return false;
            } else {
                window.top.topPage.showErrorMessage(window.top.message.share['record.choose.first']);
            }

        }
    })
})
