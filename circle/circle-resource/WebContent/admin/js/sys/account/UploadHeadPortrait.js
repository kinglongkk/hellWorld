/**
 * Created by jeff on 15-11-22.
 */
define(['common/BaseEditPage','jqFileInput', 'css!themesCss/fileinput/fileinput'], function (BaseEditPage,Fileinput) {

    return BaseEditPage.extend({
        init: function () {
            this._super();
        },
        bindEvent: function () {
            this._super();
        },
        onPageLoad: function () {
            this._super();
            var $fileInput = $('.file');
            this.unInitFileInput($fileInput)
                .fileinput({
                    showUpload: false,
                    maxFileCount: 1,
                    maxFileSize: 1024,
                    minImageWidth: 200,
                    minImageHeight: 190,
                    maxImageWidth: 200,
                    maxImageHeight: 190,
                    mainClass: "input-group",
                    removeLabel: '删除',
                    browseLabel:  '浏览&hellip;',
                    allowedFileExtensions: ['jpg', 'jpeg', 'png', 'gif'],
                    msgInvalidFileExtension: '仅支持"{extensions}"等类型的文件',
                    msgValidationError: '图片上传失败',
                    msgSizeTooLarge: '您上传的图片大于1M，无法上传，请重新选择.',
                    msgImageWidthSmall: '頭像的宽度尺寸錯誤，必須為200x190',
                    msgImageHeightSmall: '頭像的高度尺寸錯誤，必須為200x190',
                    msgImageWidthLarge: '頭像的宽度尺寸錯誤，必須為200x190',
                    msgImageHeightLarge: '頭像的高度尺寸錯誤，必須為200x190'
                });
            $fileInput.bind("filecleared", function (e) {
                e.fileInput.$container.prev().show();
                e.fileInput.$container.next().val(e.fileInput.$container.next().next().val());
                page.resizeDialog();
            }).bind("fileloaded", function (e) {
                e.fileInput.$container.prev().hide();
                e.fileInput.$container.next().val("hasUploaded");
                e.fileInput.$container.parent().removeClass("error");
                page.resizeDialog();
            }).on("fileerror", function (e) {
                page.resizeDialog();
                e.fileInput.$container.prev().hide();
            });
        },
        /**
         * 上传头像
         * @param e
         * @param opt
         * @returns {boolean}
         */
        uploadFile: function (e, opt) {
            if ($('.file-error-message:visible').length > 0) {
                return false;
            }
            e.objId = 1;
            e.catePath = 'headImage';
            return this.uploadAllFiles(e, opt);
        },

        myValidateForm:function(e,opt){
            if (!this.validateForm(e)) {
                return false;
            }

            return this.uploadFile(e,opt);

        },
        /**
         * 根据日期获取星座
         * @param e
         */
        chooseConstellation: function (e) {
            var v = e.currentTarget.value.toString();
            var month = v.substring(v.indexOf('-') + 1, v.lastIndexOf('-'));
            var day = v.substring(v.lastIndexOf('-') + 1);
            var constell = this._getAstro(month, day);
            select.setValue($('[name="result.constellation"]'), constell);
        },
        /**
         * 根据month和day获取星座code
         * @param month
         * @param day
         * @returns {*}
         * @private
         */
        _getAstro: function (month, day) {
            var code = month - (day < "102223444433".charAt(month - 1) - -19);
            switch(code) {
                case 0:
                case 12:
                    return 'capricorn';
                case 1:
                    return 'aquarius';
                case 2:
                    return 'pisces';
                case 3:
                    return 'aries';
                case 4:
                    return 'taurus';
                case 5:
                    return 'gemini';
                case 6:
                    return 'cancer';
                case 7:
                    return 'leo';
                case 8:
                    return 'virgo';
                case 9:
                    return 'libra';
                case 10:
                    return 'scorpio';
                case 11:
                    return 'sagittarius';
            }
        }
    });
});