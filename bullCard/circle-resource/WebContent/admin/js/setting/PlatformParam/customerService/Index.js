define(['common/BaseListPage', 'bootstrap-dialog'], function(BaseListPage,BootstrapDialog) {
    var _this ;
    return BaseListPage.extend({
        bootstrapDialog: BootstrapDialog,
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
            $("#li_top_2").addClass("active");
        }
    });
});