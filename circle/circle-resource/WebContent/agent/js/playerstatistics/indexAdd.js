define(['common/BaseListPage',"jqtongChart"], function (BaseListPage) {
    return BaseListPage.extend({
        init: function () {
            columnRotatedLabels();
        }
    });
});
/**
 * 新增玩家数
 */
function columnRotatedLabels(){
    var dataStr = $("#dataStr").val().split(",");
    var dataInt=[];
    $.ajax({
        type:"post",
        url:  root+"/playerSummery/indexAddAjax.html",
        data:{year:$("select[name='year']").val(),month:$("select[name='month']").val()},
        async : false
    }).done(function( data ) {
        dataInt= $.parseJSON(data);
    });

    var chart = new Highcharts.Chart({
        chart: {
            renderTo: 'columnRotatedLabels',
            defaultSeriesType: 'column',
            margin: [ 50, 50, 100, 80]
        },
        title: {
            text: '新增玩家数',
            style:{
                color: "#333333",
                fontSize:"24px",
                fill: "#333333",
                width: "1612px",
                fontWeight:"bold",
                Boolean:true
            }
        },
        xAxis: {
            categories: dataStr,
            labels: {
                rotation: -45,
                align: 'right',
                style: {
                    font: 'normal 13px Verdana, sans-serif'
                }
            }
        },
        yAxis: {
            min: 0,
            title: {
                text: '玩家数'
            }
        },
        legend: {
            enabled: false
        },
        tooltip: {
            formatter: function() {
                return '<b>'+ this.x +'</b><br/>'+
                    '玩家数量: '+ Highcharts.numberFormat(this.y, 1) +
                    ' 人';
            }
        },
        series: [{
            name: 'Population',
            data: dataInt,
            dataLabels: {
                enabled: true,
                rotation: -90,
                color: '#FFFFFF',
                align: 'right',
                x: -3,
                y: 10,
                formatter: function() {
                    return this.y;
                },
                style: {
                    font: 'normal 13px Verdana, sans-serif'
                }
            }
        }]
    });

}