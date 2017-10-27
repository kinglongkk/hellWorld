//模板页面
define(['common/BaseListPage', 'highcharts', 'autocompleter'], function (BaseListPage) {

    return BaseListPage.extend({
        /**
         * 初始化及构造函数，在子类中采用
         * this._super();
         * 调用
         */
        init: function (formSelector) {
            this.formSelector = this.formSelector || formSelector ||"#mainFrame form";
            this._super();
            $('.help-popover').popover();
            $(this.formSelector).on("submit",function(){ return false; });
        },
        /** 页面加载事件函数 */
        onPageLoad: function () {
            this._super();
            this.chartData($("#chartJson").val());
        },
        /** 当前对象事件初始化函数 */
        bindEvent: function () {
            this._super();
            //这里初始化所有的事件
        },
        /** 改变年 */
        changeYear: function() {
            $('span.detail').addClass('hide');
            select.setIndex("[name='search.rakebackMonth']",0);
            var $period = $("[name='search.id']");
            select.setIndex($period, 0);
            select.clearOption($period, '-- ' + window.top.message.common['qi'] + ' --');
        },
        /** 改变月 */
        changeMonth: function() {
            var siteId = $('[name="search.siteId"]').val();
            if (siteId) {
                $('span.detail').addClass('hide');
                var $year = $("[name='search.rakebackYear']");
                var $month = $("[name='search.rakebackMonth']");
                if ($year.val()) {
                    var $period = $("[name='search.id']");
                    if ($month.val()) {
                        window.top.topPage.ajax({
                            url: root + '/report/rakeback/site/ajaxPeriods.html',
                            dataType: 'json',
                            type: 'POST',
                            data: {'search.rakebackYear':$year.val(), 'search.rakebackMonth':$month.val(), 'siteId':siteId},
                            success: function(data) {
                                select.clearOption($period, '-- ' + window.top.message.common['qi'] + ' --');
                                if (data.length > 0) {
                                    select.enable($period);
                                    $.each(data,function(index, obj){
                                        select.addOption($period, obj.id, (obj.period + window.top.message.common['qi'] + obj.periodName));
                                    });
                                } else {
                                    select.disable($period);
                                }
                            }
                        });
                    } else {
                        select.clearOption($period, '-- ' + window.top.message.common['qi'] + ' --');
                        select.disable($period);
                    }
                } else {
                    window.top.topPage.showWarningMessage(window.top.message.report['tip.warn.selyear']);
                    select.setIndex($month, 0);
                    return;
                }
            }
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
        /** 切换站点 */
        changeSite: function(e) {
            $('span.detail').addClass('hide');
            var $year = $('[name="search.rakebackYear"]');
            var $month = $('[name="search.rakebackMonth"]');
            var $period = $('[name="search.id"]');

            select.clearOption($period, '-- ' + window.top.message.common['qi'] + ' --');
            if (e.key) {
                $('div.role').removeClass('hide');
                $('div.state').removeClass('hide');
                $('div.period').removeClass('hide');

                select.setIndex($year, 0);
                select.setIndex($month, 0);
                select.setIndex($period, 0);

                window.top.topPage.ajax({
                    url: root + '/report/rakeback/player/ajaxYears.html',
                    dataType: 'json',
                    type: 'POST',
                    data: {'siteId': e.key},
                    success: function(data) {
                        select.clearOption($year, '-- ' + window.top.message.common['year'] + ' --');
                        if (data.length > 0) {
                            $.each(data,function(index, obj){
                                select.addOption($year, obj, obj + window.top.message.common['year']);
                            });
                        }
                    }
                });
                $(this.formSelector).attr('action', root + '/report/rakeback/site/rakebackIndex.html');
            } else {
                $('div.role').addClass('hide');
                $('div.state').addClass('hide');
                $('div.period').addClass('hide');
                $(this.formSelector).attr('action', root + '/report/rakeback/player/rakebackIndex.html');
            }
        },
        /** 切换角色 */
        changeRole: function(e) {
            $('input.role').attr('name', e.key).val('');
        },

        /** 切换期数 */
        changePeriod: function(e) {
            var $detail = $('span.detail');
            if (e.key) {
                $detail.removeClass('hide');
            } else {
                $detail.addClass('hide');
            }
        },

        /** 查看详情 */
        queryDetail : function(event, option) {
            var $form = $(window.top.topPage.getCurrentForm(event));
            if(!$form.valid || $form.valid()) {
                $($form).attr('action', root + '/report/rakeback/site/detail/reportDetail.html');
                //$form.submit();
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
                        $($form).attr('action', root + '/report/rakeback/site/rakebackIndex.html');
                        window.top.topPage.showErrorMessage(window.top.message.common["server.error"]);
                        $(event.currentTarget).unlock();
                    }});
            } else {
                $(event.currentTarget).unlock();
            }
        },

        /** 图表 */
        chartData:function(jsonStr) {
            var data = eval("("+jsonStr+")");
            data = data == null ? '' : data;
            var dataArray = [];
            for (var i = 0; i < data.length; i++) {
                var type = data[i].drilldown;
                type = type == null ? '' : type;
                var config = {
                    y: parseFloat(data[i].y),
                    name: data[i].name + "<br/>" + type,
                    drilldown: type
                }
                dataArray.push(config);
            }
            $('#container').highcharts({
                chart: {
                    type: 'column'
                },
                title: {
                    text: ' '
                },
                subtitle: {
                    text: ' '
                },
                xAxis: {
                    type: 'category'
                },
                yAxis: {
                    title: {
                        text: window.top.message.report['rakeback.list.actual']
                    }
                },
                legend: {
                    enabled: false
                },
                plotOptions: {
                    series: {
                        borderWidth: 0,
                        dataLabels: {
                            enabled: true,
                            format: '{point.y:.1f}'
                        }
                    }
                },
                tooltip: {
                    headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
                    pointFormat: '<span style="color:{point.color}">{point.drilldown}</span>: <b>{point.y:.2f}</b><br/>'
                },
                series: [{
                    name: window.top.message.report['rakeback.list.actual'],
                    colorByPoint: true,
                    data: dataArray
                }]

            });
        }
    });
});