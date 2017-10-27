/**
 * 新增代理游戏
 * Created by black
 */
define(['common/BaseEditPage'], function (BaseEditPage) {

    return BaseEditPage.extend({
        init: function () {
            this._super();
        },

        bindEvent: function () {
            this._super();
            $(".modal-body").on("change", "#firstType", function () {

                var firstType = $("#firstType option:selected").val();
                var agentId = $("#agentId").val();

                $.ajax({
                    type: "post",
                    url: root + "/userAgentGame/selectSecondType.html",
                    dataType: "json",
                    data: {
                        "firstType" : firstType,
                        "agentId" : agentId
                    },
                    success: function (data) {
                        if (data.secondType.length == 0) {
                            var str = "<option value=''>" + "目前没有可以代理的游戏" + "</option>";
                        } else {
                            var dataLength = data.secondType.length;
                            var str = "";
                            for(var i = 0; i< dataLength; i++){
                                str += "<option value='"+data.secondType[i]['id']+"'>" +data.secondType[i]['name']+ "</option>";
                            }
                        }
                        $("#typeOption").html(str);
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        alert("you have a error");
                    }

                });
            });
        },

        onPageLoad: function () {
            var _this = this;
            this._super();
        },

    });
});