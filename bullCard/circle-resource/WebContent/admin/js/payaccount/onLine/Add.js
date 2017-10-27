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
            $('.help-popover').popover();
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
            this._super();
            var _this = this;
            //这里初始化所有的事件
            $(this.formSelector).on("change","#fullRank", function () {
                var sta=$(this).is(':checked');
                $("input[name='result.fullRank']").val(sta);
                if(sta){
                    $(".allRank").addClass('hide');
                    $("input[name='rank']").attr('checked',true);
                }else{
                    $(".allRank").removeClass('hide');
                    $("input[name='rank']").attr('checked',false);
                }
            });

        },
        savePlayer: function (e, option) {
            var that=this;
            //最大值有值最小值没值，赋默认值1
            var singleDepositMin=$("#singleDepositMin").val();
            var singleDepositMax=$("#singleDepositMax").val();
            if(singleDepositMin.length==0&&singleDepositMax.length>0){
                $("#singleDepositMin").val(1);
            }
            //拼装接口参数json
            var jsonArray=[];
            $(".column").each(function (index) {
                var json={};
                var column=$("#column"+index).val();
                var val=$("#val"+index).val();
                var view=$("#view"+index).val();
                json.column=column.trim();
                json.value=val.trim();
                json.view=view.trim();
                jsonArray.push(json);
            });
            $("#channelJson").val(JSON.stringify(jsonArray));
            if (!this.validateForm(e)) {
                return;
            }

            return true;
        }
        ,
        savePayAccountAndFlowOrder: function () {
            $("#savePlsyer").click();
        },

        bankChannel: function (e) {
            if(e.key.length > 0) {
                $(".payDomain").removeClass("hide");
            } else {
                $(".payDomain").addClass("hide");
            }
            $(".column").remove();
            $("#currenct").children().remove();
            window.top.topPage.ajax({
                url: root + '/payAccount/queryChannelColumn.html',
                dataType: "json",
                data: {"channelCode": e.key},
                success:function (data) {
                    $(data.payApiParams).each(function (index) {
                        var name="";
                        var hide='';
                        if(data.payApiParams[index].paramMean=="merchantCode"){
                            name="result.account"
                        }else if(data.payApiParams[index].paramMean=="payDomain"){
                            name="payDomain"
                        }else{
                            name="channelJson"
                        }

                        var CloneHtml = "<div class='form-group clearfix line-hi34 column "+hide+"'>\
                                   <input type='hidden' id='column"+index+"' value='"+data.payApiParams[index].paramName+"'/>\
                                   <input type='hidden' id='view"+index+"' value='"+data.payApiParams[index].paramMean+"'/>\
                                   \<input type='hidden' id='"+data.payApiParams[index].paramMean+"' value='column"+index+"'/>\
                                   <label class='ft-bold col-sm-3 al-right line-hi34'><span\
                              class='co-red m-r-sm'>*</span>"+window.top.message.content['pay_channel.'+data.payApiParams[index].paramMean]+"：</label>\
                              <div class='col-sm-5'>\
                                  <div class='input-group date'><input class='form-control' id='val"+index+"' name='"+name+"'/><span\
                              class='input-group-addon bdn'>&nbsp;&nbsp;</span>\
                              </div>\
                              </div>\
                              </div>";
                        $(".third").after(CloneHtml);
                    });
                    //删除子元素
                    $(data.openAndSupportList).each(function (index) {
                        var openAndSupportList=data.openAndSupportList;
                        var currency="<label class='m-r-sm'><input name='currency' type='checkbox' class='i-checks'\
                                    value='"+openAndSupportList[index].code+"'> "+window.top.message.common[openAndSupportList[index].code]+"</label>";
                        $("#currenct").append(currency);
                    });
                }
            })
        },
        saveCallbak: function() {
            window.top.topPage.goToLastPage(true);
        }
    });
});