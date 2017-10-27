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
            /**
             * 删除其他费用行
             */
            $("button.btn-danger").on("click",function(){
                $(this).parent().parent().remove();
            });
            /**
             * 新增其他费用行
             */
            $("[name='addExpenses']").on("click",function(){
                var length = $("tbody").children().length;
                if (length<=20) {
                    var $name = $("tbody").children("tr:last").find("input:first").attr("name");
                    var dotIndex = $name.indexOf(".");
                    var $index = parseInt($name.substring(22,dotIndex))+1;
                    var $tr = "<tr><td><input type='text' class='form-control' name='siteOtherExpensesList["+$index+"].name'></td>"
                        +"<td><input type='text' class='form-control' name='siteOtherExpensesList["+$index+"].expense'></td>"
                        +"<td><input type='text' class='form-control' name='siteOtherExpensesList["+$index+"].remark'>"
                        +"<input type='hidden' name='siteOtherExpensesList["+$index+"].required' value='false'></td>"
                        +"<td><button type='button' class='btn btn-danger'>删除</button></td></tr>";
                    $("tbody").append($tr);
                    $("button.btn-danger").off("click").on("click",function(){
                        $(this).parent().parent().remove();
                    });
                }
            });

            $("[name='result.siteNetSchemeId']").on("change",function(){
                var $a = select.getSelected("[name='result.siteNetSchemeId']")
                $("[name='result.netscheme']").val($a.text());
                $("#previewContract").attr("href",$("#previewContract").attr("href").substring(0,$("#previewContract").attr("href").indexOf("?"))+"?search.id="+$a.attr("key"));
                if ($(this).val()) {
                    $("#previewcontract").css("display","");
                } else {
                    $("#previewcontract").css("display","none");
                }

            })
        },

        goSiteTemplate:function(e,option) {
            var url = root+'/vSysSiteManage/siteTemplate.html';
            var data = window.top.topPage.getCurrentFormData(e);
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

        /**
         * 站点基本信息
         * @param e
         * @param option
         */
        goSiteBasic:function(e,option) {
            var url = root+'/vSysSiteManage/siteBasic.html';
            // $("[name='search.lastStep']").val("true");
            var data = window.top.topPage.getCurrentFormData(e);
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
        }
    });
});