/**
 * Created by tom on 15-11-19.
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
        },

        /**
         * 选择使用模板
         * @param e
         * @param option
         */
        chooseTemplate:function(e,option) {
            var $tmp = $("[name='siteTemplate.code']");
            if (!!$tmp.val()) {
                $("span.hint-badge").remove();
            }
            var jsonRel = eval("(" + $(e.currentTarget).data('rel') + ")");
            $tmp.val(jsonRel.code);
            $("[name='siteTemplate.picPath']").val(jsonRel.picPath);
            $(e.currentTarget).parents("div.change-logo").children(":first").append("<span class='hint-badge'>已选</span>");
            $(e.currentTarget).unlock();
            //window.top.topPage.showSuccessMessage("选择模板成功!");
        },

        goSiteNetScheme:function(e,option) {
            var url = root+'/vSysSiteManage/siteNetScheme.html';
            var data = window.top.topPage.getCurrentFormData(e);
            var _this = this;
            window.top.topPage.ajax({
                type: "POST",
                data:data,
                url: url,
                success: function(data) {
                    $("#mainFrame").html(data);
                },
                error: function(data) {
                    $(e.currentTarget).unlock();
                }
            });
        },

        goSitePreview:function(e,option) {
            var url = root+'/vSysSiteManage/sitePreview.html';
            var data = window.top.topPage.getCurrentFormData(e);
            var _this = this;
            window.top.topPage.ajax({
                type: "POST",
                data:data,
                url: url,
                success: function(data) {
                    $("#mainFrame").html(data);
                },
                error: function(data) {
                    $(e.currentTarget).unlock();
                }
            });
        },

        imageSilde:function(e,opt)
        {
            var ary = [];
            $.each($("img.preview"),function(index,item){
                ary.push($(item).attr("src"));
            });
            e.imgs = ary;
            window.top.topPage.imageSilde(e,opt);
        },

        /**
         * 保存或更新前验证
         * @param e   事件对象
         * @return 验证是否通过
         */
        validateForm: function(e) {
            var $form = $(window.top.topPage.getCurrentForm(e));
            return !$form.valid || $form.valid();
        }
    });
});