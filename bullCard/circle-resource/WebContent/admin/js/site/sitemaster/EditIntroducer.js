//管理介绍人js
define(['common/BaseEditPage'], function (BaseEditPage) {

    return BaseEditPage.extend({
        /**
         * 初始化及构造函数，在子类中采用
         * this._super();
         * 调用
         */
        init: function (formSelector) {
            this.formSelector = "form";
            this._super(this.formSelector);
        },
        /** 当前对象事件初始化函数 */
        bindEvent: function () {
            this._super();
        },
        /**
         * 删除联系人
         * @param e
         * @param option
         */
        deleteIntorducer: function (e, option) {
            var name = $(e.currentTarget).next().val();
            var _this = this;
            window.top.topPage.ajax({
                url: root + "/siteIntroducer/checkUsed.html",
                data: {"result.name": name},
                dataType: 'json',
                type: 'POST',
                success: function (data) {
                    if (data.usedNum==0) {
                        $.each($("form").validate().errorList, function (index, item) {
                            $(item.element).poshytip('disable');
                            $(item.element).poshytip('destroy');
                        });
                        $(e.currentTarget).parent().remove();
                        _this.resizeKey();
                        $(e.currentTarget).unlock();
                        page.resizeDialog();
                    } else {
                        window.top.topPage.showWarningMessage(data.msg);
                    }
                    $(e.currentTarget).unlock();
                },
                error: function (data) {
                    $(e.currentTarget).unlock();
                }
            })
        },
        /**
         * 新增联系人
         * @param e
         * @param option
         */
        addIntroducer: function (e, option) {
            $(e.currentTarget).parent().prev().after($("div[name=add]").children().clone());
            this.resizeKey();
            $(e.currentTarget).unlock();
        },
        resizeKey: function () {
            var count = 1;
            $("div.input-group").each(function () {
                $($(this).children("input:not('[type=hidden]')")).attr("name", "name[" + count + "]");
                count++;
            });
            $("input[name=len]").val(count-2);
        }
    });
});