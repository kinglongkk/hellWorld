/**
 * Created by black .
 */
define(['common/BaseEditPage'], function (BaseEditPage) {
    return BaseEditPage.extend({

        init: function () {
            this._super("form");
        },
        /**
         * 当前页面所有事件初始化函数
         */
        bindEvent: function () {
            var _this=this;
            this._super();
        },

        /**
         * 维护必填项
         */
        clickShow: function(e){


            if (!(($("#maintainReason").val()) == "") || !(($(".form-control").val()) == "")){

                $("#maintainReason").attr("required","required");
                $("#maintainReason").attr("title", "此为必填项");
                $(".form-control").attr("required","required");
                $(".form-control").attr("title", "此为必填项");

            }else{

                $("#maintainReason").removeAttr("required","required");
                $(".form-control").removeAttr("required","required");
            }

        },

    });
});