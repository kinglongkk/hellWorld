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
        },
        searchSelectChange:function(e){
            var val = e.key;
            $("#searchName").attr("name",val);
        },
        /**
         * 删除确认框
         * @param e
         * @param option
         */
        confirmDel:function(e,option) {
            window.top.topPage.showConfirmMessage( "确认删除吗？" , function( bol ){
                if( bol ){
                    window.top.topPage.doAjax(e, option);
                }
            });
        }
    });
});