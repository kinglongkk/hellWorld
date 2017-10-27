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

        clearAnswer:function(e,option) {
            $("[name='sysUserProtection.answer2']").val('');
        },

        saveAccount: function (e, option) {
            var _this = this;
            window.top.topPage.ajax({
                url: root + "/vSiteMasterManage/persist.html",
                type: "post",
                data:window.top.topPage.getCurrentFormData(e),
                dataType: "json",
                cache: false,
                success: function (data) {
                    _this.returnValue = data.id;
                    window.top.topPage.closeDialog();
                },
                error: function (err) {
                }
            });
            $(e.currentTarget).unlock();
        },

        /**
         * 介绍人管理回调
         * @param e
         * @param option
         */
        introducerCallback: function (e, option) {
            if (e.returnValue) {
                var $selectDiv = $(e.currentTarget).parent().prev();
                window.top.topPage.ajax({
                    url: root + '/siteIntroducer/seachIntroducer.html',
                    dataType: 'json',
                    success: function (data) {
                        select.clearOption($selectDiv);
                        if (data && data.length > 0) {
                            for (var i = 0; data[i]; i++) {
                                select.addOption($selectDiv, data[i].name, data[i].name);
                            }
                        }
                        $selectDiv.find("[prompt='prompt']").html($selectDiv.attr("initprompt"))
                    },
                    error: function (data) {

                    }
                });
            }
        },

        chooseConstellation: function (Start, End, Label) {
            var array = Start.currentTarget.value.split("-");
            var month = array[1];
            var day = array[2];
            var constell = this._getAstro(month, day);
            select.setValue($("[selectdiv='result.constellation']"), constell);
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
            switch (code) {
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