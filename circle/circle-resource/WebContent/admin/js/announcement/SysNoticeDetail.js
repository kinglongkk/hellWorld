/**
 * Created by Orange on 2015-11-17
 */

define(['common/BaseEditPage'], function (BaseEditPage) {

    return BaseEditPage.extend({
        init: function () {
            this._super();
        },

        onPageLoad: function () {
            this._super();
            $("#index_1").children().text("编辑中");
            $(".click_Detail").on("click", function (e) {
                var _this = e.currentTarget;
                var id = $(_this).prop("id").substr(6,7);
                $(".click_Detail").each(function (e) {
                    var this_id = $(this).prop("id").substr(6,7);
                    if(this_id==id){
                        $("#div_"+this_id).removeClass("hide");
                        $(this).addClass("current")
                        $(this).children().text("编辑中");
                    }else{
                        $("#div_"+this_id).addClass("hide");
                        $(this).removeClass("current");
                        $(this).children().text("已编辑");
                    }
                });
            });
        }
    });

});
