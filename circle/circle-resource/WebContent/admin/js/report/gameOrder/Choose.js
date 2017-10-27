/**
 * 返水明细-添加选择
 */

define(['common/BasePage'], function (BasePage) {

    return BasePage.extend({
        /**
         * js初始化
         */
        init: function () {
            this.formSelector = "form";
            //父项控制子项全选/全不选
            $("input[name='apicheck']").click(function(){
                var flag = this.checked;
                if(flag){
                    $(this).parents('td').siblings("td").find("input").prop("checked",true);
                }else{
                    $(this).parents('td').siblings("td").find("input").prop("checked",false);
                }
            });

            //子项部分选影响父项
            $("input[name='gamecheck']").click(function(){
                var flag = this.checked;
                if(flag){
                    $(this).parents('td').siblings("td").find("input").prop("checked",true);
                }else{
                    var m = $(this).parent().siblings().find("input:checked");
                    if(m.length>0){
                        return;
                    }else{
                        $(this).parents('td').siblings("td").find("input").prop("checked",false);
                    }
                }
            });
            this.reWrite();
        },
        /**
         * 全选
         */
        checkAll: function (e) {
            $('label').children('input[type=checkbox]').prop("checked", true);
            $(e.currentTarget).unlock();
        },
        /**
         * 清楚所有
         */
        clearAll: function (e) {
            $('label').children('input[type=checkbox]').prop("checked", false);
            $(e.currentTarget).unlock();
        },
        /**
         * api选择
         */
        choseApi: function (e, option) {
            var apiId = option.data;
            $('td').each(function () {
                if (apiId == $(this).attr("data-id")) {
                    $(this).children().children("input[type=checkbox]").prop("checked", true);
                }
            });
            $(e.currentTarget).unlock();
        },
        /**
         * 游戏类型选择
         */
        choseGameType: function (e, option) {
            var gameType = option.data;
            $('label').children('input[type=checkbox]').each(function () {
                if (gameType == $(this).attr("data-parent")) {
                    $(this).prop("checked", true);
                }
            });
            $(e.currentTarget).unlock();
        },
        /**
         * 确定选择
         * @param e
         * @param option
         */
        choose: function(e, option) {
            var tabTitles = [];
            var gameType = [];
            var gameName = [];
            var tabTitle = {};
            var flag;
            $("td[name='api_td']").each(function () {
                //先判断该api下有gametype
                if($(this).next().children().children("input[type=checkbox]").length>0){
                    tabTitle = {};
                    tabTitle.id = $(this).attr("data-id");
                    gameTypeArr = [];
                    gameNameArr = [];
                    flag = false;
                    if($(this).children().children().prop("checked")) {
                        tabTitle.state = true;
                        flag = true;
                    }

                    $(this).next().children().children("input[type=checkbox]").each(function (){
                        if(this.checked) {
                            gameTypeArr.push($(this).val());
                            gameNameArr.push($(this).parent("label").text());
                            flag = true;
                        }
                    });
                    tabTitle.gameType = gameTypeArr;
                    tabTitle.gameName = gameNameArr;
                    if(flag) {
                        tabTitles.push(tabTitle);
                    }
                }
            });
            $(e.currentTarget).unlock();
            this.returnValue=tabTitles;
            window.top.topPage.closeDialog();
        },
        /*checkbox回填 数据格式 [{"apiId":"1","gameId":["01"]},{"apiId":"3","gameId":["01"]}]*/
        reWrite: function () {
            var selectedJson = $("#gametypeList",parent.document).val();
            var objSelected;
            if(selectedJson!=''){
                objSelected = JSON.parse(selectedJson);
                $.each(objSelected,function(i,line){
                    $("td[name='api_td']").each(function(){
                        var _that = $(this);
                        if(_that.data("id")==line.apiId){
                            /*回选api*/
                            $(_that).find("input[name='apicheck']").attr("checked","checked");
                            $.each(line.gameId,function(k,v){
                                /*回选api下的gameType*/
                                $(_that).next().children().children("input[type=checkbox]").each(function (){
                                    var gameType = this;
                                    if($(gameType).val()== v){
                                        $(gameType).attr("checked","checked");
                                        $(gameType.currentTarget).unlock();
                                    }
                                })
                            })
                            $(_that.currentTarget).unlock();
                        }

                    })
                })
            }
        }
    });

});
