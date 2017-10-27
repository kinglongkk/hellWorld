/**
 * 资金管理-提现管理列表
 */
define(['common/BaseListPage', 'gb/share/ListFiltersPage'], function (BaseListPage) {

    return BaseListPage.extend({
        /**
         * 初始化及构造函数，在子类中采用
         * this._super();
         * 调用
         */
        init: function () {
            this._super();
            this.initShowTab();
        },

        /**
         * 当前对象事件初始化函数
         */
        bindEvent : function() {
            this._super();
            this.initShowDetail();
        },

        /**
         * 重写query中onPageLoad方法，为了查询回调函数带上下拉框样式
         * @param form
         */
        onPageLoad: function () {
            this._super();
        },
        /**
         * 刷新
         * @param e
         */
        queryWithdrawRemark:function(e){
            var target = e.currentTarget;
            var data_href = $(target).parents('.col-lg-12').prev().find("a[name=returnView]");
            $(data_href).click();
        },
        /**
         * 提现审核前先判断订单是否已锁定详情页面  和  提现审核详情页面
         *
         * @param vo
         * @return
         */
        withdrawAuditView: function (e) {
            var _this = e.currentTarget;
            var id = $(_this).prev("input[name=id]").val();
            window.top.topPage.ajax({
                type:"post",
                url:root+"/fund/withdraw/isAuditPerson.html",
                data:{'search.id':id},
                success: function (data) {
                    if(data=="true"){
                        window.top.topPage.ajax({
                            type:"post",
                            url:root+"/fund/withdraw/withdrawAuditView.html",
                            data:{'search.id':id},
                            success: function (data) {
                                $("#mainFrame").html(data);
                            }
                        })
                    }else{
                        var username = data;
                        window.top.topPage.showWarningMessage(username+"正在对该订单正在进行审核！");
                        $(e.currentTarget).unlock();
                    }
                }
            });
        }
        /**
         * 资金管理中的备注
         *
         * @param e
         */
        /*queryWithdrawRemark: function(e) {
            var target = e.currentTarget;
            var refresh = $(target).parents('.blank-panel').parent();
            var data_href;
            if(target.parentNode.tagName == 'DIV') {
                data_href = target.parentNode;//点击添加备注的时候找到data-href
            } else {
                data_href = $(target).parent().parent().parent().parent().next();//点击修改/删除/查看的时候找到data-href
            }
            var url = $(data_href).attr("data-href");

            window.top.topPage.ajax({
                url: url,
                headers: {
                    "Soul-Requested-With":"XMLHttpRequest"
                },
                success: function(data) {
                    $(refresh).html(data);
                },
                error: function(data) {

                }
            });
        }*/
    });
});