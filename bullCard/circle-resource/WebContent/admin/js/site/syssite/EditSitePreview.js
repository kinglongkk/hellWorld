/**
 * Created by tom on 15-11-19.
 */
define(['common/BaseEditPage'], function (BaseEditPage) {

    return BaseEditPage.extend({
        init: function () {
            this._super();
        },

        bindEvent: function () {
            this._super();

        },

        onPageLoad: function () {
            this._super();
        },

        goSiteTemplate:function(e,option) {
            var url = root+'/vSysSiteManage/siteTemplate.html';
            var data = window.top.topPage.getCurrentFormData(e);
            var _this = this;
            window.top.topPage.ajax({
                type: "POST",
                data:{'search.step':3},
                url: url,
                success: function(data) {
                    $("#mainFrame").html(data);
                },
                error: function(data) {
                    window.top.topPage.showConfirmMessage(window.top.message.common['build.failed']);
                }
            });
            $(e.currentTarget).unlock();
        },

        submit:function(e,option) {
            var url = root+'/vSysSiteManage/submit.html';
            var data = window.top.topPage.getCurrentFormData(e);
            var _this = this;
            window.top.topPage.ajax({
                type: "POST",
                data:{'search.step':5},
                url: url,
                success: function(data) {
                    $("#mainFrame").html(data);
                },
                error: function(data) {
                    window.top.topPage.showConfirmMessage(window.top.message.common['build.failed']);
                }
            });
            $(e.currentTarget).unlock();
        },

        /**
         * 图片预览
         * @param e
         * @param opt
         */
        imageSilde:function(e,opt) {
            var ary = [];
            ary.push($(e.currentTarget).next().attr("src"))
            e.imgs = ary;
            window.top.topPage.imageSilde(e,opt);
        }
    });
});