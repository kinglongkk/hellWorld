define(['common/BasePage', 'validate','validateExtend'], function(BasePage) {

    return BasePage.extend({
        $delBtn:null,
        /**
         * 初始化及构造函数，在子类中采用
         * this._super();
         * 调用
         */
        init : function(formSelector) {
            this._super(formSelector||"form");
            this.$delBtn = $('#delBtn');
            this.$delBtn.length && !this.getUrlParam("id") && this.$delBtn.attr("disabled", true);
        },
        /**
         * 页面加载事件函数
         */
        onPageLoad: function () {
            this._super();
            this.bindFormValidation();
        },
        /**
         * 当前对象事件初始化函数
         */
        bindEvent : function() {
            this._super();
        },

        /**
         * 绑定表单验证规则
         * @private
         */
        bindFormValidation : function() {
            var $form = $(this.formSelector);
            var rule = this.getValidateRule($form);
            if (rule) {
                if($.data($form[0], "validator")) {
                    $.data($form[0], "validator", null);
                }
                $form.validate(rule);
            }
        },

        /**
         * 自定义验证提示消息内容，传入需求替换的提示内容。
         * @param customMsg
         * customMsg参数格式示例：
         * {
         * "result.name":{required:"你好，我是不能为空自定义验证提示内容。"},
         * "result.startTime":{remote:"你好，我是远程验证自定义验证提示内容。"},
         * "result.endTime":{remote:"你好，我是远程验证自定义验证提示内容。"}
         * }
         * @param $form 要更改的form的jquery对象，适用于一个页面有多个form时使用。
         */
        extendValidateMessage : function(customMsg,$form){
            if(!$form){
                $form = $(this.formSelector);
            }
            var validate = $form.validate();
            $.extend(true, validate.settings.messages,customMsg);
        },
        /**
         * 保存前先上传所以已选择的文件
         * @param objId     当前的ID
         * @param catePath  保存文件的类别路径
         * @returns {boolean}   True:成功，False:失败
         */
        uploadAllFiles:function(e,option)
        {
            var _this = this;
            var result = true;
            var files = $("input[type=file]", _this.formSelector);
            for (var index = 0; index < files.length; index++) {
                var $file = $(files[index]);
                var $hid = $("input[type=hidden][name='" + $file.attr("target") + "']", _this.formSelector);
                if (files[index].files.length == 0) {
                    continue;
                }
                if ($hid.attr("fileName") == files[index].files[0].name) {
                    continue;
                }
                var formData = new FormData();
                formData.append($file.attr("target"), files[index].files[0]);
                $.ajax({
                    url: root + "/ueditor/jsp/index.html?action=uploadfile&objId=" + e.objId + "&catePath=" + e.catePath,
                    type: 'POST',
                    data: formData,
                    async: false,
                    cache: false,
                    contentType: false,
                    enctype: 'multipart/form-data',
                    processData: false,
                    success: function (data) {
                        var _data = (new Function("return " + data))();
                        if(_data.url) {
                            $hid.attr("fileName", files[index].files[0].name);
                            $hid.val(_data.url);
                        }
                        else{
                            result=false;
                        }
                    },
                    error: function (data) {
                        result = false;
                        $hid.removeAttr("fileName");
                    }
                });
                if (!result) {
                    window.top.topPage.showErrorMessage(window.top.message.common['uploadFile.failed']);
                    break;
                }
            }
            return result;
        },
        /**
         * 示例删除回调函数
         * @param e             事件对象
         * @param option        Button标签的参数
         */
        deleteCallbak:function(e,option)
        {
            this.returnValue = true;
            window.top.topPage.closeDialog();
        },
        /**
         * 示例删除回调函数
         * @param e             事件对象
         * @param option        Button标签的参数
         */
        saveCallbak: function (e, option) {
            this.returnValue = true;
            window.top.topPage.closeDialog();
        },
        /**
         * 保存返回回调函数
         * @param e             事件对象
         * @param option        Button标签的参数
         */
        saveReturnCallbak: function (e, option) {
            window.top.topPage.goToLastPage(true);
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