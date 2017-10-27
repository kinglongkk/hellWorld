//模板页面
define(['common/BaseEditPage'], function(BaseEditPage) {

    return BaseEditPage.extend({
        /**
         * 初始化及构造函数，在子类中采用
         * this._super();
         * 调用
         */
        init: function (title) {
            this.formSelector = "form";
            this._super();
            this.resizeDialog();
            this.loadField();
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
            var endTimeVal=$("#endTimeVal").val();
            if(endTimeVal.length<1){
                $("[name='result.endTime']").val($("[name='dateList1']").val());
            }
        },
        /**
         * 当前页面所有事件初始化函数
         */
        bindEvent: function () {
            this._super();
            var _this = this;
            //这里初始化所有的事件
            this._super();
            var _this = this;
            //这里初始化所有的事件
            $(this.formSelector).on("change", "#timeType", function () {
                var val=parseInt($(this).val());
                var dataval=$(this).find("option:selected").attr("dateval");
                //计算时间
                if(val==8){
                    $(".endTime").removeClass('hide');
                    $(".stop").addClass('hide');
                    $("[name='result.endTime']").val("");
                    $("#showTime").text("");
                }else{
                    $("[name='result.endTime']").val(dataval);
                    if(val=="1"){
                        $("#showTime").text("----");
                    }else{
                        $("#showTime").text(dataval);
                    }

                    $(".endTime").addClass('hide');
                    $(".stop").removeClass('hide');
                }
                _this.resizeDialog();
            });
            //只填写起始IP自动填写结束IP
            $(this.formSelector).on("blur", "[name='result.startIpStr']", function () {
                var reg= /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
                if(reg.test($(this).val())){
                    if($("[name='result.endIpStr']").val().length<1){
                        $("[name='result.endIpStr']").val($(this).val());
                    }
                }

            });
        },
        loadField: function () {
            var _this = this;
            var timeType=$("#timeType").val();
            if(timeType=="8"){
                $(".endTime").css('display','');
                _this.resizeDialog();
            }
        },
        saveValid: function (e) {
            var startIpStr=$.trim($("[name='result.startIpStr']").val());
            var endIpStr=$.trim($("[name='result.endIpStr']").val());
            if(endIpStr.length<1){
                $("[name='result.endIpStr']").val(startIpStr);
            }
            if(!this.validateForm(e)){
                return false;
            }
            //开始ip要小于结束ip
            var startIp=$("[name='result.startIpStr']").val().split(".");
            var endIp=$("[name='result.endIpStr']").val().split(".");
            for(var i=0;i<startIp.length;i++){
                if(parseInt(startIp[i])>parseInt(endIp[i])){
                    window.top.topPage.showErrorMessage(window.top.message.setting["siteConfine.ip.startGEendIp"]);
                    return false;
                }
            }
            return e.returnValue=true;
            return true;
        }
    });
});