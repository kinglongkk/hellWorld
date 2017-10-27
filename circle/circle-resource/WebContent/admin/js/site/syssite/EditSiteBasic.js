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
            var _this = this;
            /**
             * 经营地区、选择语言包 点击绑定事件
             */
            $(".add-shortcut-menu a").bind("click",function () {
                $(this).toggleClass("selected");
                var $index = $(this).data("index");
                var $value = $(this).data("value");
                var $a = $(this).parents("div.col-sm-5").find("a.pic");
                if ($(this).hasClass("selected")) {
                    $(this).parent().find("input[data-index="+$index+"]").val($value);
                    $a.text($a.text()?parseInt($a.text())+1:1);
                    $(this).parents("dd").find("input[name$='Num']").val($a.text());

                    if ($(this).parent().children("a").length==parseInt($a.text())) {
                        $(this).parents("div.col-sm-5").find("[name='selectAll']").prop("checked",true);
                    }

                    if (!!$(this).data("lang")) {
                        // 如果是语言包则动态增加语言名称
                        var locale = $(this).find("span").text();
                        _this.addSiteName($value,locale);
                        _this.addMainLanguage($value,locale);
                        if ($a.text()==1) {
                            $("div.mainLanguage").show();
                        }
                    }
                } else {
                    $(this).parent().find("input[data-index="+$index+"]").val('');
                    $a.text($a.text()?parseInt($a.text())-1:0);
                    if (parseInt($a.text())==0) {
                        $(this).parents("dd").find("input[name$='Num']").val('');
                    } else {
                        $(this).parents("dd").find("input[name$='Num']").val($a.text());
                    }
                    // 取消全选
                    $(this).parents("div.col-sm-5").find("[name=selectAll]:checkbox").attr("checked",false);

                    if (!!$(this).data("lang")) {
                        // 如果是语言包则动态删除语言名称
                        var $hiddenInput = $("#siteName").find("input[value="+$value+"]");
                        $hiddenInput.parent().remove();
                        select.removeOption($("[name='result.mainLanguage']"),$value);
                        if ($a.text()==0) {
                            $("div.mainLanguage").hide();
                        }
                    }
                }
            });

            /**
             * 更多XX 点击事件
             */
            $(".down-menu-sq").bind("click",function () {
                $(this).parents(".operate-memu").prev(".add-shortcut-menu").children("dd").toggleClass("open");
                $(this).parents(".operate-memu").toggleClass("open");
            });

            /**
             * 选择货币点击事件
             */
            $("[name*='siteCurrencyList']").bind("click",function(){
                var $a = $(this).parents("div.col-sm-5").find("a.currency");
                if ($(this).prop("checked")==true){
                    $(this).val($(this).data("value"));
                    $a.text($a.text()?parseInt($a.text())+1:1);
                    $(this).parents("dd").find("input[name$='Num']").val($a.text());

                    if ($(this).parents("dd").children("lavel").length==parseInt($a.text())) {
                        $(this).parents("div.col-sm-5").find("[name='selectAllCurrency']").prop("checked",true);
                    }

                    $("div.sitecurrency").css("display","");

                    _this.addMainCurrency($(this).data("value"),$(this).parent().text());

                } else {
                    $(this).val("");
                    $a.text($a.text()?parseInt($a.text())-1:0);
                    if (parseInt($a.text())==0) {
                        $(this).parents("dd").find("input[name$='Num']").val('');
                        $("div.sitecurrency").css("display","none");
                    } else {
                        $(this).parents("dd").find("input[name$='Num']").val($a.text());
                    }
                    // 取消全选
                    $(this).parents("div.col-sm-5").find("[name=selectAllCurrency]:checkbox").attr("checked",false);
                    select.removeOption($("[name='result.mainCurrency']"),$(this).data("value"));
                }
            });

            /**
             * 经营地区、选择语言包 全选点击事件
             */
            $("[name='selectAll']").bind("click",function(){
                var _this = this;
                var isCk = $(_this).prop("checked");
                var $a = $(_this).parents("div.col-sm-5").find("dl.add-shortcut-menu a");
                $.each($a,function(index,item) {
                    if (isCk==true){
                        if (!$(item).hasClass("selected")) {
                            $(item).trigger("click");
                        }
                    } else {
                        if ($(item).hasClass("selected")) {
                            $(item).trigger("click");
                        }
                    }
                });
            });

            /**
             * 货币全选事件
             */
            $("[name='selectAllCurrency']").bind("click",function(){
                var _this = this;
                var $ck = $(_this).prop("checked");
                var cks = $(_this).parents("div.col-sm-5").find("dl :checkbox");
                $.each(cks,function(index,item) {
                    $(item).trigger("click");
                    if ($ck==true) {
                        if (!$(item).prop("checked")==true) {
                            $(item).trigger("click");
                        }
                    } else {
                        if ($(item).prop("checked")==true) {
                            $(item).trigger("click");
                        }
                    }
                });
                $(_this).prop("checked",$ck);
            });
        },

        onPageLoad: function () {
            this._super();
        },

        /**
         * 下一步跳转到包网方案
         * @param e
         * @param option
         */
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
                    window.top.topPage.showWarningMessage(window.top.message.common["check.info"]);
                    $(e.currentTarget).unlock();
                }
            });
            $(e.currentTarget).unlock();
        },

        /**
         * 新增语言
         * @param locale zh_CN
         * @param language 简体中文
         */
        addSiteName: function (locale,language) {
            var len = $("#siteName").children("div").length;
            $("#siteName").append("<div class='input-group date m-b-sm'><span class='input-group-addon'>"+language+"</span>"+
                "<input type='hidden' name='siteNameList["+len+"].locale' value='"+locale+"'/>"+
                "<input type='text' name='siteNameList["+len+"].value' class='form-control' value=''/></div>")
        },

        /**
         * 增加主语言
         * @param locale
         * @param language
         */
        addMainLanguage:function(locale,language) {
            var $mainLanguage = $("[name='result.mainLanguage']");
            select.addOption($mainLanguage,locale ,language);
        },

        /**
         * 增加主语言
         * @param locale
         * @param language
         */
        addMainCurrency:function(currency,currencyName) {
            var $mainCurrency = $("[name='result.mainCurrency']");
            select.addOption($mainCurrency,currency ,currencyName);
        },

        /**
         * 站点类型
         * @param e
         * @param option
         */
        changeClassification: function(e, option) {
            var _this = this;
            if(e.returnValue) {
                window.top.topPage.ajax({
                    url: root + "/vSysSiteManage/queryCompanySiteClassify.html",
                    success: function(data) {
                        var $select = $("[name='result.siteClassifyKey']");
                        select.clearOption($select);
                        if(data){
                            data = eval("("+data+")");
                            for (var i = 0;data[i];i++){
                                select.addOption($select,data[i].key,data[i].value);
                            }
                        }
                        $(e.currentTarget).unlock();
                    },
                    error: function() {
                        $(e.currentTarget).unlock();
                    }
                });
            }
        },

        /**
         * 筛选条件第一列的下拉框点击事件
         */
        selectChange:function(event,option){
            window.top.topPage.ajax({
                url:root+"/vSysSiteManage/getDateByTimeZone.html",
                dataType:'JSON',
                data:{"timeZone":$("[name='result.timezone']").val()},
                success: function(data) {
                    $("#tz").text(data.time);
                },
                error: function() {
                    $(event.currentTarget).unlock();
                }
            })
            $(event.currentTarget).unlock();
        },

    });
});