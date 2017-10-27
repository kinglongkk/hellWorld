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
            var $this = this;
            $('[name="search.username"]').bind('input propertychange', function(){
                if ($(this).val()) {
                    $this.queryMaster($(this).val());
                } else {
                    $('span.hsel').text('').addClass('hide');
                    $('a.look').attr('class', 'btn btn-filter pull-right look');
                }
            })
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
            var $month = $("[name='search.rakebackMonth']");
            select.setIndex($month, 0);
        },
        /** 查找站长账号 */
        queryMaster: function(uname) {
            if (uname) {
                window.top.topPage.ajax({
                    url: root+'/report/rebate/queryMaster.html',
                    dataType: 'json',
                    type: 'POST',
                    data: {'search.username':uname},
                    success: function(data) {
                        if (data) {
                            $('.nope').autocompleter({
                                highlightMatches: true,
                                source: data,
                                template: '{{ label }}',
                                hint: true,
                                empty: false,
                                limit: 5
                            });
                            $('span.hsel').text('').addClass('hide');
                            $('a.look').attr('class', 'btn btn-filter pull-right look');
                        } else {
                            $('span.hsel').text('暂无符合条件的信息!').removeClass('hide');
                            $('a.look').attr('class', 'btn btn-default pull-right ui-button-disable disabled look');
                        }
                    }
                });
                $(this.formSelector).attr('action', root + '/report/rakeback/player/rakebackIndex.html');
            } else {
                $(this.formSelector).attr('action', root + '/report/rakeback/rakebackIndex.html');
            }
        },
        /** 检测站长账号是否存在 */
        checkMaster: function() {
            var uname = $('[name="search.username"]').val();
            if (uname) {
                var bool = false;
                window.top.topPage.ajax({
                    url: root+'/report/rebate/checkMaster.html',
                    dataType: 'json',
                    type: 'POST',
                    async: false,
                    data: {'search.username':uname, 'search.siteId':$('[name="search.centerId"]').val()},
                    success: function(data) {
                        if (!data) {
                            window.top.topPage.showWarningMessage(window.top.message.report['tip.warn.nomaster']);
                        } else {
                            bool = true;
                        }
                    }
                });
                return bool;
            } else {
                return true;
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