//模板页面
define(['common/BaseListPage'], function (BaseListPage) {

    return BaseListPage.extend({
        /**
         * 初始化及构造函数，在子类中采用
         * this._super();
         * 调用
         */
        init: function (formSelector) {
            this.formSelector = this.formSelector || formSelector ||"#mainFrame form";
            this._super();
        },
        /** 页面加载事件函数 */
        onPageLoad: function () {
            this._super();
        },
        /** 当前对象事件初始化函数 */
        bindEvent: function () {
            this._super();
            //这里初始化所有的事件
        },

        /** 改变年 */
        changeYear: function() {
            var $month = $("[name='search.rebateMonth']");
            var $period = $("[name='search.period']");

            select.setIndex($month, 0);
            select.clearOption($period, '-- ' + window.top.message.common['qi'] + ' --');
        },

        /** 改变月 */
        changeMonth: function() {
            var $year = $("[name='search.rebateYear']");
            var $month = $("[name='search.rebateMonth']");
            if ($year.val()) {
                var $period = $("[name='search.period']");
                select.clearOption($period, '-- ' + window.top.message.common['qi'] + ' --');
                this.changePeriod($year.val(), $month.val(), $period);
            } else {
                window.top.topPage.showWarningMessage(window.top.message.report['tip.warn.selyear']);
                select.setIndex($month, 0);
            }
        },

        changePeriod: function(year, month, $period) {
            if (month) {
                window.top.topPage.ajax({
                    url: root + '/report/rebate/site/detail/ajaxPeriods.html',
                    dataType: 'json',
                    type: 'POST',
                    data: {'search.rebateYear': year, 'search.rebateMonth':month, 'siteId':$('[name="search.siteId"]').val()},
                    success: function(data) {
                        if (data.length > 0) {
                            $.each(data,function(index, obj){
                                select.addOption($period, obj.period, (obj.period + window.top.message.common['qi'] + obj.periodName));
                            });
                        }
                    }
                });
            } else {
                select.clearOption($period, '-- ' + window.top.message.common['qi'] + ' --');
            }
        },

        /** 切换站点 */
        siteChange: function(e) {
            var $year = $('[name="search.rebateYear"]');
            window.top.topPage.ajax({
                url: root + '/report/rebate/site/detail/ajaxYears.html',
                dataType: 'json',
                type: 'POST',
                data: {'siteId': e.key},
                success: function(data) {
                    select.clearOption($year, '-- ' + window.top.message.common['year'] + ' --')
                    if (data.length > 0) {
                        $.each(data,function(index, obj){
                            select.addOption($year, obj, obj + window.top.message.common['year']);
                        });
                    }
                }
            });

        },

        /** 改变角色 */
        changeRole: function(e) {
            $('input.role').attr('name', e.key).val('');
        },

        /** 重写query方法 */
        query: function(event, option) {
            var $form = $(window.top.topPage.getCurrentForm(event));
            if(!$form.valid || $form.valid()) {
                window.top.topPage.ajax({
                    loading:true,
                    url:window.top.topPage.getCurrentFormAction(event),
                    headers: {
                        "Soul-Requested-With":"XMLHttpRequest"
                    },
                    type:"post",
                    data:this.getCurrentFormData(event),
                    success:function(data){
                        var $result=$("#mainFrame");
                        $result.html(data);
                        $(event.currentTarget).unlock()},
                    error:function(data, state, msg){
                        window.top.topPage.showErrorMessage(window.top.message.common["server.error"]);
                        $(event.currentTarget).unlock();
                    }});
            } else {
                $(event.currentTarget).unlock();
            }
        },
        toExportHistory:function(e,opt){
            if(e.returnValue=="showProcess"){
                var btnOption = {};
                btnOption.target = root + "/share/exports/showProcess.html";
                btnOption.text=window.top.message['export.exportdata'];
                btnOption.type="post",
                    btnOption.callback = function (e) {
                        $("#toExportHistory").click();
                    };
                window.top.topPage.doDialog({}, btnOption);
            }else if(e.returnValue){
                $("#toExportHistory").click();
            }
        },
        exportData: function (e,opt) {
            var data = $("#conditionJson").val();
            return data;
        },
        validateData: function (e,opt) {
            if($("[name='paging.totalCount']").val()==0){
                window.top.topPage.showWarningMessage(window.top.message.report["tip.warn.export.nodata"]);
                $(e.currentTarget).unlock();
                return;
            }
            var siteId= $("#siteId").val();
            if(!siteId||siteId==""){
                window.top.topPage.showWarningMessage(window.top.message.report["tip.warn.selectsite"]);
                $(e.currentTarget).unlock();
                return;
            }
            opt.target =  opt.target.replace('{siteId}',siteId);
            return true;
        }

    });
});