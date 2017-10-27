define(['common/BaseListPage',"jqtongChart"], function (BaseListPage) {
    return BaseListPage.extend({
        init: function () {
            indexplaydata();
        }
    });
});
/**
 * 线性图
 */

function indexplaydata(){
    var dataStr = $("#dataStr").val();
    var dataArry = dataStr.split(",");
    var valStr = [];
    $.ajax({
        type:"post",
        url:  root+"/playerDataStatistics/indexDayLinesAjax.html",
        data:{year:$("select[name='year']").val(),month:$("select[name='month']").val()},
        async : false
    }).done(function( data ) {
        valStr = $.parseJSON(data);
    });
    Highcharts.chart('indexplaydata', {
        chart: {
            type: 'line'
        },
        title: {
            text: '每月盈亏',
            style:{
                color: "#333333",
                fontSize:"24px",
                fill: "#333333",
                width: "1612px",
                fontWeight:"bold",
                Boolean:true
            }
        },
        subtitle: {
            text: ''
        },
        xAxis: {
            categories: dataArry
        },
        yAxis: {
            title: {
                text: '额度'
            }
        },
        legend: {
            enabled: false
        },
        plotOptions: {
            line: {
                dataLabels: {
                    enabled: true
                },
                enableMouseTracking: false
            }
        },
        series: valStr
    });
}
