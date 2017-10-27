//模板页面
define(['common/BaseListPage','autocompleter'], function(BaseListPage) {
    var _this=this;
    return BaseListPage.extend({
        /**
         * 初始化及构造函数，在子类中采用
         * this._super();
         * 调用
         */
       // selectPure:null,
        init: function (title) {
            this.formSelector = "#mainFrame form";
            this._super("formSelector");

        },
        /**
         * 页面加载事件函数
         */
        onPageLoad: function () {
            /**
             * super中已经集成了
             *      验证、
             *      排序、
             *      分页、
             *      chosen Select
             * 控件的初始化
             */
            this._super();



        },
        /**
         * 当前对象事件初始化函数
         */
        bindEvent: function () {

            /**
             * super中已经集成了
             *      列头全选，全不选
             *      自定义列
             *      自定义查询下拉
             * 事件的初始化
             */
            this._super();
            var _this = this;


            /**
             * 实时查询站长账号
             */
            this.querySiteUserName();

            //显示高级搜索栏
            this.showSiteSearchBar();

        },

        querySiteUserName: function (e) {
            var btn_master = $("input[name='masterName']");
            btn_master.bind("input propertychange",function(){
                $("#noresult").css("display","none");
                var sInfo = {
                    'search.username': btn_master.val()
                };
                $.ajax({
                    type: "get",
                    dataType: "json",
                    url: root+"/report/gameTransaction/queryMaster.html",    //发送的地址
                    data: sInfo,
                    success: function(data) {
                        if( data == null){
                            $("#infoBox").html('');
                            $("#noresult").css("display","block");
                        }
                        $('.nope').autocompleter({
                            highlightMatches: true,
                            source: data,
                            template: '{{ label }}',
                            hint: true,
                            empty: false,
                            limit: 5
                        });
                    }
                });
            });
        },
        showSiteSearchBar:function(e){
            $("#searchBtn").on("click", function (e) {
                var $form = $(window.top.topPage.getCurrentForm(e));
                if($form.valid()){

                    window.top.topPage.ajax({
                        type: "post",
                        url: root+"/report/fundsLog/fundsList.html",
                        headers: {
                            "Soul-Requested-With": "XMLHttpRequest"
                        },
                        data: {
                            "mastername": $("input[name='masterName']").val()
                        },
                        success: function(msg){  //得到回复以后的回调函数
                            $("#mainFrame").html(msg);
                           /* $("#matchMaster").css("display","none");
                            $("#advanceSearch").css("display","block");
                            $("#detailPage").css("display","block");*/
                        },
                        error: function (data) {
                        }
                    });
                }
            });
        }


    });
});