/**
 * 资金管理-提现管理列表
 */
define(['common/BaseListPage'], function (BaseListPage) {

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

        updateAnnouncementStatus: function (e,p) {
            var this_ = this;
            var _this = e.currentTarget;
            var id = $(_this).parent().attr("data-id");
            var data = $(_this).attr("data-rel");
            var datas = eval('('+data+')');
            window.top.topPage.ajax({
                type: 'POST',
                url: root + "/vGameAnnouncement/updateAnnouncementStatus.html",
                data:{'result.id':id,"result.status":datas.dataVal},
                dataType:"json",
                success: function (data) {
                    if (data.state) {
                        window.top.topPage.showSuccessMessage(data.msg, function () {
                            this_.query(e,p);
                        });
                    } else {
                        window.top.topPage.showErrorMessage(data.msg);
                    }
                },
                error: function (data) {
                    $(e.currentTarget).unlock();
                }
            });
        }

    });
});