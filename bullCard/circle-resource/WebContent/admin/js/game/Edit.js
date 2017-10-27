/**
 * 代理游戏编辑
 * Created by black on 2016/12/8.
 */
define(['common/BaseEditPage'], function (BaseEditPage) {

    return BaseEditPage.extend({
        init: function () {
            this._super();
        },

        bindEvent: function () {
            this._super();

            $(".modal-body").on("change", "#firstType", function () {

                var typeCode = $("#firstType").val();
                $.ajax({
                    type: "post",
                    url: root + "/game/getSecondType.html",
                    dataType:"json",
                    data:{
                        "typeCode": typeCode
                    },
                    success:function(data){
                        var dataLength = data.secondTypeCodes.length;
                        var str = "";
                        for(var i =0; i<dataLength; i++){
                            str += "<option value='"+data.secondTypeCodes[i]+"'>" + data.secondTypeTranss[i]+ "</option>";
                        }
                        $("#typeOption").html(str);
                    },
                    error:function (jqXHR, textStatus, errorThrown) {
                        alert("you have a error")
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
