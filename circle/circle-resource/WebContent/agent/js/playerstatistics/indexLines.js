define(['common/BaseListPage',"jqtongChart"], function (BaseListPage) {
    return BaseListPage.extend({
        init: function () {
            lines2();
        }
    });
});
function lines2(){
    var dataStr = $("#dataStr").val();
    var dataArry = dataStr.split(",");
    var valStr = [];
    $.ajax({
        type:"post",
        url:  root+"/playerSummery/indexLinesAjax.html",
        data:{year:$("select[name='year']").val(),month:$("select[name='month']").val()},
        async : false
    }).done(function( data ) {
        valStr = $.parseJSON(data);
    });
    Highcharts.chart('lines', {
        chart: {
            type: 'line'
        },
        title: {
            text: '额度变化',
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
