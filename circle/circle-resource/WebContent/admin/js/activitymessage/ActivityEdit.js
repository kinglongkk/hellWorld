define(['common/BaseEditPage'], function (BaseEditPage) {

    var index = 0;
    return BaseEditPage.extend({
        init: function () {
            this._super();
        },

        bindEvent: function () {
            this._super();
            /*隐藏指定游戏div*/
            var hideGameType = $(".hideFalse option:selected").val();
            if (hideGameType == 'false'){
                $("#designatedGame").hide();
            }
            /*隐藏设置不同享*/
            var hideExclusiveActivity = $(".hideIsExclusive option:selected").val();
            if (hideExclusiveActivity == 'false'){
                $("#hideExclusiveActivity").hide();
            }
        },

        onPageLoad: function () {
            this._super();
        },

        /**
         * 获取游戏类型
         * @param e
         */
        getGameType:function(e){
            window.top.topPage.ajax({
                type: "post",
                url: root + "/activityMessage/getGameType.html",
                dataType:"json",
                data:{
                    "typeCode": e
                },
                success:function(data){
                    var dataLength = data.gameTypeCodes.length;
                    var str = "";
                    for(var i =0; i<dataLength; i++){
                        str += "<option value='"+data.gameTypeCodes[i]+"'>" + data.gameTypeTranss[i]+ "</option>";
                    }
                    $("#typeOption").html(str);
                    $(".fillOption").html(str);

                },
                error:function (a,b,c) {
                    alert("error")
                }
            });
        },

        /**
         * 点击新增一行列表
         * @param e
         */
        createTr:function(e) {
                var _len = ++index;
                var html = $("#trTmpl").render({len: _len});
                $("#trFill").append(html);

                var isLocked = $(e.currentTarget).isLocked();
                if (isLocked){
                    $(e.currentTarget).unlock();
                }

        },

        /**
         * 点击删除一行列表
         * @param e
         */
        deltr: function (e) {
           $("#"+e+"").remove();
            var isLocked = $(e.currentTarget).isLocked();
            if (isLocked){
                $(e.currentTarget).unlock();
            }
        },

        /**
         * 显示或者隐藏div
         * @param e
         */
        isDesignatedGame: function(e){
            if (e == 'false'){
                $("#designatedGame").hide();
            }
            if (e == 'true'){
                $("#designatedGame").show();
            }
        },

        /**
         * 显示或者隐藏不同享类型div
         * @param e
         */
        isExclusiveActivity: function(e){
            if (e == 'false'){
                $("#hideExclusiveActivity").hide();
            }
            if (e == 'true'){
                $("#hideExclusiveActivity").show();
            }
        },
    });
});