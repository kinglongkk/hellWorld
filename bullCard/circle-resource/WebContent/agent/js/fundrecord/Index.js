define(['common/BaseListPage'], function(BaseListPage) {
    var _this ;
    return BaseListPage.extend({
        /**
         * 初始化及构造函数，在子类中采用
         * this._super();
         * 调用
         */
        init : function() {
            this._super();
            _this=this;
        },
        bindEvent:function() {
            this._super();
        }
    });
});