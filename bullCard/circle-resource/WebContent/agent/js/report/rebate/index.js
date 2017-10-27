/**
 * Created by fly on 15-10-12.
 */
define(['common/BaseListPage','highcharts'], function (BaseListPage) {

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
        },
        /** 页面加载事件函数 */
        onPageLoad: function () {
            this._super();
            var $cdata = $("#chartJson");
            if ($cdata.attr('data-size') > 0) {
                this.chartData($cdata.val());
            }
        },
        /** 当前对象事件初始化函数 */
        bindEvent: function () {
            this._super();
            //这里初始化所有的事件
        },

        /** 改变年 */
        changeYear: function() {
            select.setIndex("[name='search.rebateMonth']",0);
            var $period = $("[name='search.id']");
            select.setIndex($period, 0);
            select.clearOption($period,'-- ' + window.top.message.common['qi'] + ' --');
        },

        /** 改变月 */
        changeMonth: function() {
            var $year = $("[name='search.rebateYear']");
            var $month = $("[name='search.rebateMonth']");
            if ($year.val()) {
                var $period = $("[name='search.id']");
                if ($month.val()) {
                    window.top.topPage.ajax({
                        url: root + '/report/rebate/ajaxPeriods.html',
                        dataType: 'json',
                        type: 'POST',
                        data: {'search.rebateYear':$year.val(), 'search.rebateMonth':$month.val(), 'siteId':$('[name="search.siteId"]').val()},
                        success: function(data) {
                            select.clearOption($period, '-- ' + window.top.message.common['qi'] + ' --')
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
            };
        },

        /** 图表 */
        chartData: function(jsonStr) {
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
                    text: ''
                },
                subtitle: {
                    text: ''
                },
                xAxis: {
                    type: 'category'
                },
                yAxis: {
                    title: {
                        text: window.top.message.report['rebate.list.rebate']
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
                    name: window.top.message.report['rebate.list.rebate'],
                    colorByPoint: true,
                    data: dataArray
                }]

            });
        }
    });
});