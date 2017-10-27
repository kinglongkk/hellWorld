/**
 * Created by tom on 16-04-26.
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
            var _this = this;
            this._super();
            /**
             * 删除其他费用行
             */
            $("button.btn-danger").on("click",function(){
                var $preTr = $(this).parents("tr").prev();
                if (!!$preTr) {
                    $preTr.find("button").show();
                }
                $(this).parents("tr").remove();
            });

            /**
             * 新增其他费用行
             */
            $("button.addRow").on("click",function(){
                var allIndex = $("#totalIndex").val();
                var $thisTr = $(this).parents("tr");
                if (!!$thisTr) {
                    $thisTr.find("button").hide();
                }
                var $tr = $(this).parents("tbody").append("<tr><input type='hidden' class='form-control' value='' name='betLimitMultipleList["+allIndex+"].betNum'>"
                    +"<td><div class='input-group'><input type='text' class='form-control' value='' name='betLimitMultipleList["+allIndex+"].oddsMin'>"
                    +"<span class='input-group-addon abroder-no'>-</span><input type='text' class='form-control' value='' name='betLimitMultipleList["+allIndex+"].oddsMax'>"
                    +"</div></td><td><input type='text' class='form-control' value='' name='betLimitMultipleList["+allIndex+"].betMax'></td><td>"
                    +"<button type='button' class='btn btn-danger'>删除</button> <button type='button' class='btn btn-filter addRow'>新增</button></td></tr>");
                var $tbody_firsttd = $(this).parents("tbody").children("tr:first").children("td:first");
                if (!!$tbody_firsttd.attr("rowspan")) {
                    $tbody_firsttd.attr("rowspan",parseInt($tbody_firsttd.attr("rowspan"))+1);
                } else {
                    $tbody_firsttd.attr("rowspan",2);
                }

                $("#totalIndex").val(parseInt(allIndex)+1);
                $("button","#tab-content").unbind();
                _this.onPageLoad();
            });

            $("#addTbody").on("click",function(){
                var allIndex = $("#totalIndex").val();
                var $tr = $(this).parents("tbody").before("<tbody></tbody><tr><td rowspan=''><div class='input-group'><input type='text' class='form-control' value='' name='betLimitMultipleList["+allIndex+"].betNum'>"
                    +"<span class='input-group-addon abroder-no'>串1</span></div></td><td><div class='input-group'><input type='text' class='form-control' value='' name='betLimitMultipleList["+allIndex+"].oddsMin'>"
                    +"<span class='input-group-addon abroder-no'>-</span><input type='text' class='form-control' value='' name='betLimitMultipleList["+allIndex+"].oddsMax'>"
                    +"</div></td><td><input type='text' class='form-control' value='' name='betLimitMultipleList["+allIndex+"].betMax'></td><td>"
                    +"<button type='button' class='btn btn-danger'>删除</button> <button type='button' class='btn btn-filter addRow'>新增</button></td></tr></tbody>");
                $("#totalIndex").val(parseInt(allIndex)+1);
                $("button","#tab-content").unbind();
                _this.onPageLoad();
            });
        },

        myValidateForm:function(e,btnOption){
            var valid = true;
            /*$("table tbody tr:last").each(function(index,item){
                var lastOddsMax = $(item).find("[name$='oddsMax']").val();
                if (lastOddsMax=='' || $.trim(lastOddsMax)=='+') {
                    $(item).find("[name$='oddsMax']").val(999999999);
                }
            });*/
            if ($("table tbody tr").length==1) {
                window.top.topPage.showWarningMessage(window.top.message.setting['atleast.add.one']);
                return false;
            }
            $("table tbody").each(function(index,item){
                var ary = [];
                var $tr = $(item).find("tr");
                var betMinValue = $("#betMinParam").val();
                $tr.each(function(ind,ite){
                    var $oddsMin = $(ite).find("[name$='oddsMin']").val();
                    var $oddsMax = $(ite).find("[name$='oddsMax']").val();
                    var $betMax = $(ite).find("[name$='betMax']").val();
                    var minus = parseInt($oddsMax)-parseInt($oddsMin);
                    if (minus<=0) {
                        $(ite).find("[name$='oddsMax']").addClass("error");
                        valid = false;
                        $(ite).find("[name$='oddsMax']").formtip(window.top.message.setting['oddsmax.more.than.oddsmin']);
                    }
                    ary[ind] = parseInt($oddsMax);
                    if (ind!=0) {
                        var minThanMax = parseInt($oddsMin)-parseInt(ary[ind-1]);
                        if (minThanMax<=0) {
                            $(ite).find("[name$='oddsMin']").addClass("error");
                            valid = false;
                            $(ite).find("[name$='oddsMin']").formtip(window.top.message.setting['oddsmix.more.than.preoddsmax']);
                        }
                    }
                    if (parseInt($betMax)<=betMinValue) {
                        $(ite).find("[name$='betMax']").addClass("error");
                        valid = false;
                        $(ite).find("[name$='betMax']").formtip(window.top.message.setting['multiple.betmax.more.than.betmin']);
                    }
                })
            });
            if (!valid) {
                return false;
            }
            $("#tab-content").find("tbody").each(function(index,item){
                var betNum = $(item).find("[name$='betNum']:first").val();
                $(item).find("[name$='betNum']").val(betNum);
            });
            if (!this.validateForm(e)) {
                return false;
            }
            return true;
        },
    });
});