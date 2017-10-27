/**
 * Created by jeff on 15-12-20.
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

        /**
         * 设置冻结原因内容
         * @param event
         * @param option
         */
        setFreezeContent: function (event, option) {
            var $this = $(event.currentTarget);
            if ($this.attr('holder') != undefined && $this.attr('holder') != "") {
                $('._freeze_content').html($this.attr('holder'));
                $('[name=groupCode]').val($this.attr('groupCode'));
                $("[name='search.freezeContent']").val($this.attr('holder'));
            } else {
                $('._freeze_content').html("");
                $('[name=groupCode]').val("");
            }
        },

        /**
         * 预览编辑页面切换
         * @param event
         * @param option
         */
        previewOrEdit: function (event, option) {
            var that = this;
            var edit = !!option.edit;
            if (edit) {
                $(".btn-default").removeClass("disabled");
                $('._preview').addClass('hide');
                $('._edit').removeClass('hide');
            } else {
                $(".btn-default").addClass("disabled");
                $('._edit').addClass('hide');
                $('._preview').removeClass('hide');
                that._changePreviewInner();
            }
            /*解锁按钮*/
            $(event.currentTarget).unlock();
            this.resizeDialog();
        },
        /**
         * 将编辑框里面的内容填充到预览标签中
         */
        _changePreviewInner: function () {
            $('[data-preview]').each(function () {
                var $this = $(this);
                $($this.data().preview).html($this.val());
            });
        },
        previewMore: function (event, option) {
            if ($("[name=groupCode]").val()) {
                option.target === 'true' ? $(".previewMore_some").removeClass("hide") : $(".previewMore_some").addClass("hide");
                this.reasonPreviewMore.previewMore(event, option);
            }
            $(event.currentTarget).unlock();
        }


    });
});