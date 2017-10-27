define(['common/BaseEditPage'], function (BaseEditPage) {

    return BaseEditPage.extend({
        init: function () {
            this._super();

        },

        onPageLoad: function () {
            this._super();
            $("#index_1").children().text("已编辑");
            $(".click_view_index").on("click", function (e) {
                var _this = e.currentTarget;
                var id = $(_this).prop("id").substr(6,7);
                $(".click_view_index").each(function (e) {
                    var this_id = $(this).prop("id").substr(6,7);
                    if(this_id==id){
                        $("#t_div_"+this_id).removeClass("hide");
                        $("#c_div_"+this_id).removeClass("hide");
                        $(this).addClass("current")
                        $(this).children().text("已编辑");
                    }else{
                        $("#t_div_"+this_id).addClass("hide");
                        $("#c_div_"+this_id).addClass("hide");
                        $(this).removeClass("current");
                        $(this).children().text("已编辑");
                    }
                });
            });
        },
        /**
         * 返回上一页
         * @param e
         */
        gameNoticePreviewLastStep: function (e) {
            var data = window.top.topPage.getCurrentFormData(e);
            window.top.topPage.ajax({
                type: 'POST',
                url: root + "/vGameAnnouncement/gameNotice.html",
                data: data,
                success: function (data) {
                    $("#mainFrame").html(data);
                }
            });
            $(e.currentTarget).unlock();

        },

        /**
         * 发送信息
         * @param e
         */
        saveGameNotice: function (e) {
            var data = window.top.topPage.getCurrentFormData(e);
            window.top.topPage.ajax({
                type:"post",
                url: root + "/vGameAnnouncement/saveGameNotice.html",
                data: data,
                success: function (data) {
                    $("#mainFrame").html(data);
                }
            });
            $(e.currentTarget).unlock();
        }


    });

});
