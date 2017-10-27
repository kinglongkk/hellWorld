define(['common/BaseEditPage'], function(BaseEditPage) {
    var _this;
    return BaseEditPage.extend({
        /**
         * 初始化及构造函数，在子类中采用
         * this._super();
         * 调用
         */
        init: function () {
            _this=this;
            this._super();
        },
        /**
         * 当前对象事件初始化函数
         */
        bindEvent: function () {
            this._super();
        },
        /**
         * 重新加载职位下拉框
         */
        reselect:function(){
            select.ajaxList($("[name='result.positionId']"));
        }
    })
});