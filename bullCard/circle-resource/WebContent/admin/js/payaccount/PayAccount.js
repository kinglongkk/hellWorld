define(['common/BaseListPage','bootstrapswitch','jsrender'], function(BaseListPage,Bootstrapswitch) {
    var _this ;

    return BaseListPage.extend({
        rankTag:null,
        bootstrapswitch: Bootstrapswitch,

        /**
         * 初始化及构造函数，在子类中采用
         * this._super();
         * 调用
         */
        init : function() {
            this._super();
            _this=this;
        },

        /**
         * 页面加载事件函数
         */
        onPageLoad: function () {
            this._super();
            var _this = this;
            $(".dropdown-menu.lang li").on("mouseover",function(){
                $(this).addClass("hover");
            });
            $(".dropdown-menu.lang li").on("mouseleave",function(){
                $(this).removeClass("hover");
            });
            $(".btn-group").on('click',function () {
                _this.searchRankInfo($(this).attr("ajaxId"));
                $("td>.btn-group>ul.dropdown-menu").css({top:$(this).parent().offset().top-$("body").scrollTop()+28});
                $("td>.btn-group>ul.dropdown-menu").css({left:$(this).offset().left});
            });



            var $bootstrapSwitch = $('input[type=checkbox][name=my-checkbox]');
            this.unInitSwitch($bootstrapSwitch)
                .bootstrapSwitch({
                    onText: "启用",
                    offText: "停用",
                    onSwitchChange: function (e, state) {
                        var local = $(this).attr("local");
                        var _target = e.currentTarget;
                        var payRankId=$(_target).attr("payRankId");
                        var index=$(_target).attr("tt");

                        var status="";
                        var statusMsg="";
                        var addClass="";
                        var removeClass="";
                        if(state){
                            status="1";
                            statusMsg="正常"
                            addClass="label-success";
                            removeClass="label-danger";
                        }else{
                            status="2";
                            statusMsg="账户停用"
                            addClass="label-danger";
                            removeClass="label-success";
                        }
                        window.top.topPage.ajax({
                            url: root + '/payAccount/changePayStatus.html?result.id=' + payRankId + '&result.status='+status,
                            dataType: "json",
                            data: {"payRankId": payRankId},
                            success: function (data) {
                                if(data){
                                    $("#status"+index).text(statusMsg);
                                    $("#status"+index).removeClass(removeClass);
                                    $("#status"+index).addClass(addClass);
                                }
                            }
                        });
                    }
                }
            );



            //var $bootstrapSwitch = $('input[type=checkbox][name=my-checkbox]');
            //this.unInitSwitch($bootstrapSwitch)
            //    .bootstrapSwitch(
            //    {
            //        onText:"启用",
            //        offText: "停用",
            //        onSwitchChange: function (e, state) {
            //            var _target = e.currentTarget;
            //            var payRankId=$(_target).attr("payRankId");
            //            var index=$(_target).attr("tt");
            //            if (!$(_target).attr("isChanged")&&!state) {
            //                var okLabel = window.top.message.setting['common.ok'];
            //                var cancelLabel=window.top.message.setting['common.cancel'];
            //                window.top.topPage.ajax({
            //                    url: root + '/payAccount/payRankIsA.html',
            //                    dataType: "json",
            //                    data: {"payRankId": payRankId},
            //                    success: function (data) {
            //                        var count=data.length;
            //                        var rankName="";
            //                        $(data).each(function (index) {
            //                            rankName+="【"+data[index].rankName+"】";
            //                        });
            //                        var msg="";
            //                        if(count>0){
            //                            msg=window.top.message.content['payAccount.disablePormtp'].replace('#',rankName);
            //                        }else{
            //                            msg=window.top.message.content['payAccount.disable'];
            //                        }
            //                        window.top.topPage.showConfirmDynamic(window.top.message.common['msg'],msg,okLabel,cancelLabel, function (confirm) {
            //                            if(confirm && !$(_target).attr("isChanged")){
            //                                window.top.topPage.ajax({
            //                                    url: root + '/payAccount/changePayStatus.html?result.id=' + payRankId + '&result.status=2',
            //                                    dataType: "json",
            //                                    data: {"payRankId": payRankId},
            //                                    success: function (data) {
            //                                        $(_target).attr("isChanged", true);
            //                                        $(_target).bootstrapSwitch("state", !_target.checked);
            //                                        $("#status"+index).text(window.top.message.setting['site_operate.2']);
            //                                        $("#status"+index).removeClass("label-success");
            //                                        $("#status"+index).addClass("label-danger");
            //                                    }
            //                                });
            //
            //                            }
            //                        })
            //
            //                    }
            //                })
            //            } else if(!$(_target).attr("isChanged")&&state) {
            //                window.top.topPage.ajax({
            //                    url: root + '/payAccount/changePayStatus.html?result.id=' + payRankId + '&result.status=1',
            //                    dataType: "json",
            //                    data: {"payRankId": payRankId},
            //                    success: function (data) {
            //                        $("#status"+index).removeClass("label-danger");
            //                        $("#status"+index).addClass("label-success");
            //                        $("#status"+index).text(window.top.message.setting['site_operate.1']);
            //                    }
            //                });
            //
            //                return true;
            //            }else if($(_target).attr("isChanged")){
            //                $(_target).removeAttr("isChanged");
            //                return true;
            //            }
            //            return false;
            //        }
            //    });

        },

        bindEvent:function()
        {
            this._super();
            // 列表详情事件绑定
            this.initShowDetail();
            //跳转到层级充值页面
            $("#rankManage").on("click",function(e){
                /* var val = $('input[name="rank_id"]:checked').val();*/
                var url = "//vPlayerRankStatistics/list.html";
                $("#tot").attr('href',url);
                $("#tot").click();
            });
            //去除下拉框点击收缩
            $(".label-menu-o").on("click",function(e){
                e.stopPropagation();
            });
            $("#rankSure").on("click",function(e,option){
                var join = _this.getSelectIdsArray(e, option).join(",");
                var val = $('input[name="rank_id"]:checked').val();
                return {ids:this.getSelectIdsArray(e,option).join(",")};
            });
            $(this.formSelector).on("click",".dropdown-menu-stop", function (event) {
                event.stopPropagation();//阻止事件向上冒泡
            });
        },
        /**
         * 删除回调函数
         * @param e             事件对象
         * @param option        Button标签的参数
         */
        deleteCallbak:function(e,option)
        {
            this.query(e,option);
        },
        getSelectIdsAndRank:function(e,option)
        {
            return {ids:this.getSelectIdsArray(e,option).join(","),rankId:$('input[name="rank_id"]:checked').val()};
        },

        searchlistchange: function() {
            $("#searchlist").on("change",function(){
                var textname = $("#searchlist").val();
                $("#searchtext").val("");
            })
        },

        /**
         * 删除确认框
         * @param e
         * @param option
         */
        confirmDel:function(e,option) {
            var msg = window.top.message.content['payAccount.deleteConfirm']
            window.top.topPage.showConfirmMessage( msg, function( bol ){
                if( bol ){
                    window.top.topPage.doAjax(e, option);
                }
            });
        },

        /**
         * 搜索该账户的层级信息
         * @param payaccountId
         */
        searchRankInfo:function(payAccountId){
            var $this = this;
            if (payAccountId) {
                window.top.topPage.ajax({
                    url: root + '/vPayAccount/searchPayRankList.html',
                    dataType: "json",
                    data: {"search.id": payAccountId},
                    success: function (data) {
                        var $row = $("[ajaxId='"+payAccountId+"'] ul.dropdown-menu");
                        $row.empty();
                        $.each(data,function(index,content) {
                            var $liHtml = $("#rankTmpl").clone(true);
                            $liHtml.removeAttr("id");
                            $liHtml.find("a:eq(0)").text(content.rankName);
                            var $sb=$liHtml.find("a:eq(1)");
                            var sa = $sb.data("rel");
                            sa = sa.replace('{payRankId}',content.id);
                            $sb.data("rel",sa);
                            $liHtml.css("display","block");
                            $row.append($liHtml);
                        });
                        $(".dropdown-menu.lang li").on("mouseover",function(){
                            $(this).addClass("hover");
                        });
                        $(".dropdown-menu.lang li").on("mouseleave",function(){
                            $(this).removeClass("hover");
                        });
                        //$this.onPageLoad();
                    }
                });
            }
        },
        hideSettingCallback:function( event , option ){
            if(event.returnValue){
                $(event.currentTarget).next().click();
            }
        },
        playerTagSaveCallBack:function(e,option){
            this.rankTag.tagHasLoad(true);
            this.query(e,option);
        },
        toRankList: function (e,option) {
            $("#rankList").click();
        },
        myCallBack: function (e, opt) {
            alert(opt.data.state);
        },
        validateData: function (e, opt) {
            var selectIds =0;
            $(".player_tags .tag_checkbox").each(function (idx,item) {
                if($(item).val()==1){
                    selectIds ++ ;
                }
            });
            if(selectIds==0){
                var e = {};
                e.currentTarget = $(".pay-rank-confirm-css");
                page.showPopover(e, {}, 'danger', '层级不能为空', true);
                return false;
            }
            return true;
        }

    });
});