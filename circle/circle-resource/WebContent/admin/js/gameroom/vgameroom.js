define(['common/BaseListPage'], function (BaseListPage) {
    return BaseListPage.extend({
        init: function () {
            aiRoomNumber();
            dayTotalWinlose();
        }
    });

});
        /**
         * 获取当前玩家数当前房间AI数
         */
        function aiRoomNumber(){
             $(".table-responsive").find("tbody .currentplayer").each(function(){
                 var obj = $(this);
                 var roomId = obj.attr("data");
                 $.ajax({
                     type:"post",
                     url:  root+"/vGameRoom/currentPlayer.html?roomId="+roomId,
                     async : true
                 }).done(function( data ) {
                     var dataobj = $.parseJSON(data);
                     obj.html(dataobj.currentPlayerCount);
                     obj.siblings("td.robot").html(dataobj.currentAiCount);
                 });
             });
        }

        /**
         * 获取当前房间的累计输赢
         */
        function dayTotalWinlose(){
            var gameIds="";
            $(".table-responsive").find("tbody .totalWin").each(function(){
                gameIds = gameIds + $(this).attr("data") +",";
            });
                $.ajax({
                    type:"post",
                    url:  root+"/vGameRoom/searchWinGameAmount.html?gameIds="+gameIds,
                    async : true
                }).done(function( data ) {
                    var dataobj = $.parseJSON(data);
                    if(dataobj.length == 0 || dataobj == null || dataobj == undefined){
                        $(".table-responsive").find("tbody .totalWin").each(function(){
                            $(this).html("0");
                        });
                    }else {
                        $(".table-responsive").find("tbody .totalWin").each(function () {
                            for (var i = 0; i < dataobj.length; i++) {
                                if ($(this).attr("data") == dataobj[i].id) {
                                    if(dataobj[i].winamount != "" && dataobj[i].winamount  != null) {
                                        var number = toThousands(dataobj[i].winamount);
                                        $(this).html(number);
                                    }else{
                                        $(this).html(0);
                                    }
                                }
                            }
                        });
                    }
                });

        /**
         * 格式化金币
         */
        function toThousands(money) {

            return money.toFixed(2).replace(/(\d{1,3})(?=(\d{3})+(?:$|\D))/g,"$1,");
        }
}