/**
 * 创建优惠活动-活动分类管理js
 */

define(['common/BaseEditPage'], function (BaseEditPage) {

    return BaseEditPage.extend({
        maxRange: 10,

        init: function () {
            this._super();
        },
        /**
         * 删除活动分类
         *
         * @param e
         * @param option
         */
        deleteClassfication: function (e, option) {
            $.each($("form").validate().errorList, function (index, item) {
                $(item.element).poshytip('disable');
                $(item.element).poshytip('destroy');
            });
            var key = option.data;
            if (key == null) {
                $(e.currentTarget).parent().parent().remove();
                this.resizeDialog();//重新定义弹窗窗口大小
                this.resetKey();//重新定义输入框角标
                $(e.currentTarget).unlock();
                return;
            }
            ;
            var _this = this;
            window.top.topPage.ajax({
                url: root + '/vSysSiteManage/deleteClassificationManager.html',
                data: {"key": key},
                dataType: "json",
                success: function (data) {
                    if (data.isDefault || data.hasActivity) {//默认分类
                        window.top.topPage.showWarningMessage(data.msg);
                        $(e.currentTarget).unlock();
                        return;
                    } else {   //无优惠活动的分类
                        if (data.state) {
                            window.top.topPage.showSuccessMessage(data.msg);
                            $(e.currentTarget).parent().parent().remove();
                            _this.resizeDialog();//重新定义弹窗窗口大小
                            _this.resetKey();//重新定义输入框角标
                            _this.returnValue = true;
                        } else {
                            window.top.topPage.showErrorMessage(data.msg);
                        }
                    }
                    $(e.currentTarget).unlock();
                },
                error: function () {
                    $(e.currentTarget).unlock();
                }
            });
        },
        /**
         * 新增分类
         * @param e
         * @param option
         */
        addClassfication: function (e, option) {
            var _div_len = $(".add-players").children("div").length;
            var canCreate = _div_len < this.maxRange;
            if (canCreate) {
                $(e.currentTarget).prev().after($('#addClassfication').children().clone());
                this.resizeDialog();//重新定义弹窗窗口大小
                this.resetKey();//重新定义输入框角标
            } else {
                var _message = '最多新增10项';
                window.top.topPage.showInfoMessage(_message);
            }
            $(e.currentTarget).unlock();
        },
        /**
         * 保存活动分类的ajax data
         * @param e
         */
        saveClassificationData: function (e) {
            var jsonData = [];
            $(this.formSelector + " .category-list-wrap").each(function () {
                var data = {};
                var array = [];
                var key = $(this).attr("data-key");
                data.key = key;
                $(this).children(".form-group").children().children("input").each(function () {
                    var children = {};
                    children.locale = $(this).attr("data-locale");
                    children.value = encodeURIComponent($(this).val());
                    children.key = key;
                    children.id = $(this).attr("data-id");
                    array.push(children);
                });
                data.list = array;
                jsonData.push(data);
            });
            return this.getCurrentFormData(e) + "&data=" + JSON.stringify(jsonData);
        },
        /**
         * 重新定义角标
         */
        resetKey: function () {
            var count = 0;
            $(".category-list-wrap").each(function () {
                $(this).children(".form-group").children().children("input").each(function () {
                    $(this).attr("name", $(this).attr("data-name").replace('{n}', count));
                });
                count++;
            });
        }
    });

});
