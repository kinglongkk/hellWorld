//模板页面
define(['common/BaseEditPage', 'jqFileInput', 'css!themesCss/fileinput/fileinput'], function (BaseEditPage) {

    return BaseEditPage.extend({
        /**
         * 初始化及构造函数，在子类中采用
         * this._super();
         * 调用
         */
        init: function (title) {
            this.formSelector = "form";
            this._super();
        },
        /**
         * 页面加载和异步加载时需要重新初始化的工作
         */
        onPageLoad: function () {
            /**
             * super中已经集成了
             *      验证、
             *      chosen Select
             * 控件的初始化
             */
            this._super();
            $("input[name='result.accountType']").val(1);
            $("[name='account2']").hide();
            this.initFileInput();
        },
        /**
         * 当前页面所有事件初始化函数
         */
        bindEvent: function () {
            this._super();
            var _this = this;
            //这里初始化所有的事件fullRank
            $(this.formSelector).on("change", "#fullRank", function () {
                var sta = $(this).is(':checked');
                $("input[name='result.fullRank']").val(sta);
                if (sta) {
                    //$(".allRank").addClass('hide');
                    $("input[name='rank']").attr('checked', true);
                } else {
                    $(".allRank").removeClass('hide');
                    $("input[name='rank']").attr('checked', false);
                }
            });
            //银行充值
            $(this.formSelector).on("click", "a[name='bankList']", function () {
                var bankName = $(this).attr('bankName');
                var showName = $(this).attr('showName');
                var bankIcon = $(this).attr('bankIcon');
                $("#accountType").val("1");
                $("#bankCode").val(bankName);
                var bankHtml = "<span id='showName' bankCode='" + bankName + "' ><img src='" + bankIcon + "' >&nbsp;&nbsp;" + showName + "</span>";
                $("#showName").replaceWith(bankHtml);
            });
            //输完账号自动获取银行
            $(this.formSelector).on("blur", "[name='account1']", function () {
                //显示重新选择
                if ($(this).val().trim().length > 3) {
                    $("[name='result.bankCode']").show();
                }

                var account = $(this).val();
                $("#account").val(account);
                if (account.length > 3) {
                    window.top.topPage.ajax({
                        url: root + '/payAccount/getBankInfo.html',
                        dataType: "json",
                        data: {"search.bankCardBegin": account,},
                        success: function (data) {
                            if (data.bank != null) {
                                select.setValue("#selectdivBank", data.bank.bankName);
                                $("#bankCode").val(data.bank.bankName);
                                //删除子元素
                                $("#currenct").children().remove();
                                $(data.siteCurrencyList).each(function (index) {
                                    var siteCurrencyList = data.siteCurrencyList;
                                    var currency = "<label class='m-r-sm'><input name='currency' type='checkbox' class='i-checks'\
                                    value='" + siteCurrencyList[index].code + "'> " + window.top.message.common[siteCurrencyList[index].code] + "</label>";
                                    $("#currenct").append(currency);
                                });
                            }

                        }
                    });
                } else if (account.length == 0) {
                    $("#showName").text(window.top.message.content['payAccount.pleaseAccount']);
                }
            });
            /**
             * 保存账号
             */
            $(this.formSelector).on("blur", ".account", function (e, message) {
                var val = $(this).val();
                $("#account").val(val);
            });
            /**
             * 重写验证
             */
            $(this.formSelector).on("validate", "#bankCode", function (e, message) {
                var accountType = $("#accountType").val();
                if (message) {
                    if (accountType == "2") {
                        $("#thirdError").formtip(message);
                    }
                    if (accountType == "1") {
                        $("#bankError").formtip(message);
                    }
                    e.result = true;
                }
                else {
                    e.result = false;
                }
            });
            /**
             * 重写验证-账号
             */
            $(this.formSelector).on("validate", "#account", function (e, message) {
                var accountType = $("#accountType").val();
                if (message) {
                    $("[name='account" + accountType).formtip(message);
                    e.result = true;
                }
                else {
                    e.result = false;
                }
            });
            /**
             * 货币
             */
            $(this.formSelector).on("validate", "#currencyStr", function (e, message) {
                var currencyNum = $("input[name='currency']:checked").length;
                if (!currencyNum > 0) {
                    $(".currency").formtip(message);
                    e.result = true;
                }
            });
            /**
             * 层级
             */
            $(this.formSelector).on("validate", "#rankStr", function (e, message) {
                var currencyNum = $("input[name='rank']:checked").length;
                if (!currencyNum > 0) {
                    $(".rank").formtip(message);
                    e.result = true;
                }
            });
            /* 全局表单验证 */
            $(this.formSelector).on('input change', function () {
                _this.TimeCallBack();
            });
        },

        initFileInput: function () {
            this.unInitFileInput($('.file')).fileinput({
                showUpload: false,
                maxFileCount: 1,
                maxFileSize: 1024,
                mainClass: "input-group",
                removeLabel: window.top.message.content['floatPic.file.upload.remove'],
                browseLabel: window.top.message.content['floatPic.file.upload.browse'] + '&hellip;',
                allowedFileExtensions: ['jpg'],
                msgInvalidFileExtension: window.top.message.content['floatPic.file.upload.msgInvalidFileExtension'],
                msgValidationError: window.top.message.content['floatPic.file.upload.msgValidationError'],
                msgSizeTooLarge: window.top.message.content['floatPic.file.upload.msgSizeTooLarge'],
            }).bind("filecleared", function (e) {
                e.fileInput.$container.prev().show();
            }).bind("fileloaded", function (e) {
                e.fileInput.$container.prev().hide();
                //如果为必填验证时需要加上这个
                //e.fileInput.$container.next().val("hasUploaded");
                e.fileInput.$container.parent().removeClass("error");
            });
        },

        /**
         * 图片上传
         * @param e
         * @param opt
         * @returns {boolean}
         */
        uploadPic: function (e, opt) {
            e.objId = $('div.payCode').attr('data-value');
            e.catePath = 'qrCode';
            if (!this.uploadAllFiles(e, opt)) return false;
            if (!this.validateForm(e)) return false;
            return $('.file-error-message:visible').length <= 0;
        },

        savePlayer: function (e, opt) {
            this.uploadPic(e, opt);
            var accountType = $("#accountType").val();
            var bankCode = '';
            if (accountType == "1") {
                //给默认值-银行
                var bankCode = $("#bankError").attr('value');
            } else {
                //第三方
                var bankCode = $("#third").attr('value');
            }
            $("#bankCode").val(bankCode);
            if (!this.validateForm(e)) {
                return;
            }
            return true;
        },
        accountTypeChange: function (e) {
            var accountType = e.key;
            $("#bankCode").val("");
            $("#third").val("");
            var bankHtml = "<span id='showName'>" + window.top.message.content['payAccount.pleaseAccount'] + "</span>";
            $("[name='result.bankCode']").hide();
            $("#showName").replaceWith(bankHtml);
            if (accountType == "1") {
                $(".bank").show();
                $(".third").hide();
                $('div.qr-code').hide();
                //给默认值-银行
            } else {
                $(".third").show();
                $(".bank").hide();
                var tchannel = $('[name="paging.pageSize"]').val();
                if (tchannel == 'other') {
                    $('div.qr-code').hide();
                } else {
                    $('div.qr-code').show();
                }
            }
            //账号输入的显示和隐藏
            $(".account").val("");
            $(".account").hide();
            $("[name='account" + accountType + "']").show();
            $("input[name='result.customBankName']").val('');
        },
        thirdChange: function (e) {
            $("input[name='result.customBankName']").val($(e.currentTarget).text());
            $("#bankCode").val(e.key);
            if ($('[name="result.accountType"]').val() == '2' && e.key != 'other') {
                $('div.qr-code').show();
            } else {
                $('div.qr-code').hide();
            }
            //第三方充值
            window.top.topPage.ajax({
                url: root + '/payAccount/getThirdBank.html',
                dataType: "json",
                data: {"search.bankCode": e.key},
                success: function (data) {
                    $("#currenct").children().remove();
                    if (data.siteCurrencyList != null) {
                        //删除子元素
                        $(data.siteCurrencyList).each(function (index) {
                            var siteCurrencyList = data.siteCurrencyList;
                            var currency = "<label class='m-r-sm'><input name='currency' type='checkbox' class='i-checks'\
                                value='" + siteCurrencyList[index].code + "'> " + window.top.message.common[siteCurrencyList[index].code] + "</label>";
                            $("#currenct").append(currency);
                        });
                    }

                }
            });
        },
        saveCallbak: function () {
            window.top.topPage.goToLastPage(true);
        },
        TimeCallBack: function () {
            var accountType = $("#accountType").val();
            var account = $("#account").val();
            var payName = $("input[name='result.payName']").val();
            var fullName = $("input[name='result.fullName']").val();
            var disableAmount = $("input[name='result.disableAmount']").val();

            if (account.length > 0 && payName.length > 0 && fullName.length > 0 && disableAmount.length > 0) {
                $("._search").unlock();
                $("._search").removeClass("disabled");
            } else {
                $("._search").lock();
                $("._search").addClass("disabled");
            }
        }
    });
});