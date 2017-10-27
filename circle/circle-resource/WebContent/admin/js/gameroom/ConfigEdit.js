define(['common/BaseEditPage','UE'], function (BaseEditPage) {

    return BaseEditPage.extend({
        init: function () {
            this._super();
        },

        // onPageLoad: function () {
        //     this._super();
        // },

        /**
         * 示例删除回调函数
         * 取消关闭窗口
         * @param e             事件对象
         * @param option        Button标签的参数
         */
        // saveCallbak: function (e, option) {
        //     this.returnValue = true;
        //     // window.top.topPage.closeDialog();
        // }

    });
});
