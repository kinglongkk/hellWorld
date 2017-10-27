//模板页面
define(['common/BaseEditPage', 'bootstrapswitch','css!regionCss/regions.css'], function (BaseEditPage, Bootstrapswitch) {

    return BaseEditPage.extend({
        bootstrapswitch: Bootstrapswitch,
        /**
         * 初始化及构造函数，在子类中采用
         * this._super();
         * 调用
         */
        init: function () {
            this.formSelector = "form";
            this._super();
            //switch
            $("[name='my-checkbox']")
                .bootstrapSwitch();
        },
        /**
         * 页面加载和异步加载时需要重新初始化的工作
         */
        onPageLoad: function () {
            /**
             * super中已经集成了
             *      验证、
             *      chosen Select
             * 控件的初始化
             */
            this._super();
        },
        /**
         * 当前页面所有事件初始化函数
         */
        bindEvent: function () {
            var _this = this;
            $(this.formSelector).on("click", "#traSave", function () {
                window.top.topPage.ajax({
                    url: root + "/ccenterParam/saveTrafficStatistics.html",
                    date:{"result.trafficStatistics":$("#trafficStatistics").val(),
                        "result.id":$("#mstId").val()},
                    dataType: 'json',
                    success: function (data) {
                    }
                });
            })
            $("#li_top_1").addClass("active");



            $(this.formSelector).on("switchChange.bootstrapSwitch", 'input[name="my-checkbox"]',function(e,state) {
                var $this = $(this);
                $this.bootstrapSwitch('indeterminate',true);
                var _target = e.currentTarget;
                var type = $(_target).attr('mold');
                var url = $(_target).attr('address');
                var msg="";
                if(type == "area"&&state){
                    window.top.topPage.ajax({
                        url: root + url + "&result.status=" + (state ? "1" : "2"),
                        dataType: 'json',
                        success: function (data) {
                            if (data) {
                                _this.loadArea();
                            }
                        }
                    });
                }else{
                    //开启
                    if (type == "area") {
                        //
                        msg = window.top.message.setting['basic.areaMsg'];
                    } else if (type == "language") {
                        //开启
                        msg = window.top.message.setting['basic.languageMsg.' + state];
                    } else {
                        if (state) {
                            msg = window.top.message.setting['basic.currencyMsg.' + state];
                        } else {
                            //货币

                            msg = window.top.message.setting['basic.currencyMsg.' + state];
                        }
                    }
                    window.top.topPage.showConfirmMessage(msg, function (s) {
                        if(s){
                            window.top.topPage.ajax({
                                url: root + url + "&result.status=" + (state ? "1" : "2"),
                                dataType: 'json',
                                success: function (data) {
                                    if (data) {
                                        _this.loadArea();
                                    }
                                }
                            });
                        }else{
                            $this.bootstrapSwitch('state', !state,true);
                        }

                    });
                }

            });
            this._super();
            var _this = this;
            //这里初始化所有的事件
            //展开
            $(this.formSelector).on("click", ".more", function () {
                var className = $(this).attr("className");
                $(this).removeClass("more");
                $(this).addClass("stop");
                $("." + className).css("display", "block");
                var moreId=$(this).attr("moreId");
                $(moreId).text(window.top.message.setting['basic.stop']);
                $(".dropdown").addClass("dropup");
                $(".dropdown").removeClass("dropdown");
            });
            //收起
            $(this.formSelector).on("click", ".stop", function () {
                $(this).addClass("more");
                $(this).removeClass("stop");
                var className = $(this).attr("className");
                $("." + className).css("display", "none");
                var moreId=$(this).attr("moreId");
                $(moreId).text(window.top.message.setting['basic.exhibition'+className]);

                $(".dropup").addClass("dropdown");
                $(".dropup").removeClass("dropup");
            });
        },
        loadArea: function () {
            $("#mainFrame").load(root + window.location.hash.slice(1));
        }

    });
});