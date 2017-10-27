define(['common/BaseEditPage'], function (BaseEditPage) {

    return BaseEditPage.extend({
        init: function () {
            this._super();
        },
        onPageLoad: function () {
            var _this = this;
            this._super();
        },
        /**
         * 保存或更新前验证
         * @param e   事件对象
         * @return 验证是否通过
         */
        validateForm1: function(e) {
            var bringGoldMin = $.trim($("#bringGoldMin").val());
            var bringGoldMax = $.trim($("#bringGoldMax").val());
            if(bringGoldMin == "" || bringGoldMax == ""){
                $("#message").html("携带金币数不能为空");
                return false;
            }else{
                if(isNaN(Number(bringGoldMin)) || isNaN(Number(bringGoldMax))){
                    $("#message").html("携带金币数必须是数字");
                    return false;
                }
                if(Number(bringGoldMin) >= Number(bringGoldMax)){
                    $("#message").html("携带金币数前者不能大于或等于后者");
                    return false;
                }
            }
            var intervalMinTime = $.trim($("#intervalMinTime").val());
            var intervalMaxTime = $.trim($("#intervalMaxTime").val());
            if(intervalMinTime == "" || intervalMaxTime == "") {
                $("#message").html("进入时间间隔不能为空");
                return false;
            }else{
                if(isNaN(Number(intervalMinTime)) || isNaN(Number(intervalMaxTime))){
                    $("#message").html("进入时间间隔必须是数字");
                    return false;
                }
                if(Number(intervalMinTime) >= Number(intervalMaxTime)){
                    $("#message").html("进入时间间隔前者不能大于或等于后者");
                    return false;
                }
            }
            var leaveMinTime = $.trim($("#leaveMinTime").val());
            var leaveMaxTime = $.trim($("#leaveMaxTime").val());
            if(leaveMinTime == "" || leaveMaxTime == "") {
                $("#message").html("离开时间间隔不能为空");
                return false;
            }else{
                if(isNaN(Number(leaveMinTime)) || isNaN(Number(leaveMaxTime))){
                    $("#message").html("离开时间间隔必须是数字");
                    return false;
                }
                if(Number(intervalMinTime) >= Number(intervalMaxTime)){
                    $("#message").html("离开时间间隔前者不能大于或等于后者");
                    return false;
                }
            }
            var restMinGames = $.trim($("#restMinGames").val());
            var restMaxGames = $.trim($("#restMaxGames").val());
            if(leaveMinTime == "" || leaveMaxTime == "") {
                $("#message").html("游戏休息局数不能为空");
                return false;
            }else{
                if(isNaN(Number(restMinGames)) || isNaN(Number(restMaxGames))){
                    $("#message").html("游戏休息局数必须是数字");
                    return false;
                }
                if(Number(restMinGames) >= Number(restMaxGames)){
                    $("#message").html("游戏休息局数前者不能大于或等于后者");
                    return false;
                }
            }
            var chipRates = $.trim($("#chipRates").val());
            if(chipRates == "") {
                $("#message").html("投注筹码比率不能为空");
                return false;
            }
            var betCount = $.trim($("#betCount").val());
            if(betCount == "") {
                $("#message").html("人数上限不能为空");
                return false;
            }else{
                if(isNaN(Number(betCount))){
                    $("#message").html("人数上限必须是数字");
                    return false;
                }
            }
            var jsonArr = new Array();
            $("#aiTable tbody tr").each(function(index){
                var jsonObj = {};
                var id = $(this).find(".id").text();
                var playerProportionMin = $(this).find(".playerProportionMin").text();
                var playerProportionMax = $(this).find(".playerProportionMax").text();
                var aiProportionMin = $(this).find(".aiProportionMin").text();
                var aiProportionMax = $(this).find(".aiProportionMax").text();
                var jsonObj = {};
                jsonObj["id"]=id;
                jsonObj["playerProportionMin"]=playerProportionMin;
                jsonObj["playerProportionMax"]=playerProportionMax;
                jsonObj["aiProportionMin"]=aiProportionMin;
                jsonObj["aiProportionMax"]=aiProportionMax;
                jsonArr.push(jsonObj)
            });
            var strJson = JSON.stringify(jsonArr);
            $("#aiControlJson").val(strJson);
            var $form = $(window.top.topPage.getCurrentForm(e));
            return !$form.valid || $form.valid();
        },
        returnDate:function(){
            $("#refresMain").click();
        }
    });
});


function addAi(){
    var playerProportionMin = $.trim($("#playerProportionMin").val());
    var playerProportionMax = $.trim($("#playerProportionMax").val());
    var aiProportionMin = $.trim($("#aiProportionMin").val());
    var aiProportionMax = $.trim($("#aiProportionMax").val());
    if(playerProportionMin == "" || playerProportionMax == "") {
        $("#message").html("介于玩家人数不能为空");
        return false;
    }else{
        if(isNaN(Number(playerProportionMin)) || isNaN(Number(playerProportionMax))){
            $("#message").html("介于玩家人数必须是数字");
            return false;
        }
        if(Number(playerProportionMin) >= Number(playerProportionMax)){
            $("#message").html("介于玩家人数前者不能大于或等于后者");
            return false;
        }
        if(Number(playerProportionMin) >=100 ||  Number(playerProportionMax)>=100){
            $("#message").html("介于玩家人数不能超过100%");
            return false;
        }
    }
    if(aiProportionMin == "" || aiProportionMax == ""){
        $("#message").html("AI数不能为空");
        return false;
    }else{
        if(isNaN(Number(aiProportionMin)) || isNaN(Number(aiProportionMax))){
            $("#message").html("AI数必须是数字");
            return false;
        }
        if(Number(aiProportionMin) >= Number(aiProportionMax)){
            $("#message").html("AI数前者不能大于或等于后者");
            return false;
        }
        if(Number(aiProportionMin) >=100 ||  Number(aiProportionMax)>=100){
            $("#message").html("AI数不能超过100%");
            return false;
        }
    }
    var html = "<tr class=\"tab-detail\">";
    html = html + "<td class=\"text_r id\" style='text-align: center'></td>";
    html = html + "<td class=\"text_r playerProportionMin\" style='text-align: center'>"+playerProportionMin+"</td>";
    html = html + "<td class=\"text_r playerProportionMax\" style='text-align: center'>"+playerProportionMax+"</td>";
    html = html + "<td class=\"text_r aiProportionMin\" style='text-align: center'>"+aiProportionMin+"</td>";
    html = html + "<td class=\"text_r aiProportionMax\" style='text-align: center'>"+aiProportionMax+"</td>";
    html = html + "<td style='text-align: center'><a href='javasscript:void(0)' onclick='deleteAi(this)'>删除</a></td>";
    html = html + "</tr>";
    $("#aiTable tbody").append(html);
}
function deleteAi(obj){
    $(obj).parent().parent().remove();
}
