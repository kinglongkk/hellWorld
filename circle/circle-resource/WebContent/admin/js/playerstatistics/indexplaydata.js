define(['common/BaseListPage',"echartsAll","jbootMultiselect"], function (BaseListPage) {
    return BaseListPage.extend({
        init: function () {
            $("select[name='agent']").multiselect({
                includeSelectAllOption: true,
                selectAllText: '全选',
                allSelectedText: '选中',
                enableFiltering: true
            });
            baiduEchartProfit();

        }
    });
});
/**
 * echarts盈亏
 */
function baiduEchartProfit(){
    var myChart = echarts.init(document.getElementById('indexplaydata'));
    myChart.showLoading({
        text: '正在努力的读取数据中...'
    });
    var dataStr = $("#dataStr").val().split(",");
    var year = $("select[name='year']").val();
    var month = $("select[name='month']").val();
    var dataInt=[];
    var agent = $("select[name='agent']").val();
    var rootUrl = root+"/playerDataStatistics/indexMultipleDayLinesAjax.html?year="+year+"&month="+month+"&username="+agent;
    $.ajax({
        type:"post",
        url:  rootUrl,
        async : true
    }).done(function( data ) {
        dataInt = $.parseJSON(data);
        if(dataInt == ""){
            dataInt = new Array();
            var d = {};
            d["name"]="无数据";
            d["type"]="line";
            d["data"]="";
            dataInt.push(d);
        }
        myChart.hideLoading();
        myChart.setOption({
            tooltip : {
                trigger: 'axis'
            },
            legend: {
                data:agent
            },
            toolbox: {
                show : true,
                feature : {
                    mark : {show: true},
                    dataView : {show: false, readOnly: false},
                    magicType : {show: true, type: ['line', 'bar']},
                    restore : {show: true},
                    saveAsImage : {show: true}
                }
            },
            calculable : true,
            xAxis : [
                {
                    type : 'category',
                    data : dataStr
                }
            ],
            yAxis : [
                {
                    type : 'value',
                    scale:true,
                    splitNumber: 3,
                    boundaryGap: [0.05, 0.05],
                    axisLabel: {
                        formatter: function (v) {
                            return Math.round(v/10000) + ' 万'
                        }
                    },
                    splitArea : {show : true}
                }
            ],
            series : dataInt
        });
    });
}
/**
 * 线性图 : 代理商每月每天盈亏汇总
 */
// var valStrs=[];
// function indexplaydata(){
//     var dataStr = $("#dataStr").val();
//     var dataArry = dataStr.split(",");
//     var valStr = [];
//     var year = $("select[name='year']").val();
//     var month = $("select[name='month']").val();
//     var valStr = [];
//     var agent = $("select[name='agent']").val();
//     var rootUrl = root+"/playerDataStatistics/indexMultipleDayLinesAjax.html?year="+year+"&month="+month+"&username="+agent;
//     $.ajax({
//         type:"post",
//         url:  rootUrl,
//         async : true
//     }).done(function( data ) {
//         valStr = $.parseJSON(data);
//         valStrs = valStr;
//         Highcharts.chart('indexplaydata', {
//             chart: {
//                 type: 'line'
//             },
//             title: {
//                 text: '代理商每月每天盈亏汇总',
//                 style:{
//                     color: "#333333",
//                     fontSize:"24px",
//                     fill: "#333333",
//                     width: "1612px",
//                     fontWeight:"bold",
//                     Boolean:true
//                 }
//             },
//             subtitle: {
//                 text: ''
//             },
//             xAxis: {
//                 categories: dataArry
//             },
//             yAxis: {
//                 title: {
//                     text: '额度'
//                 }
//             },
//             plotOptions: {
//                 line: {
//                     dataLabels: {
//                         enabled: true
//                     },
//                     enableMouseTracking: false
//                 }
//             },
//             series: valStr
//         });
//     });
// }
/**
 * 柱状图 : 代理商每月每天盈亏汇总
 */
// function indexplaydatazhu(){
//     var dataStr = $("#dataStr").val();
//     var dataArry = dataStr.split(",");
//     var valStr = [];
//     var year = $("select[name='year']").val();
//     var month = $("select[name='month']").val();
//     var valStr = [];
//     var agent = $("select[name='agent']").val();
//     if(valStrs == null || valStrs.length==0) {
//         var rootUrl = root + "/playerDataStatistics/indexMultipleDayLinesAjax.html?year=" + year + "&month=" + month + "&username=" + agent;
//         $.ajax({
//             type: "post",
//             url: rootUrl,
//             async: false
//         }).done(function (data) {
//             valStr = $.parseJSON(data);
//         });
//     }else{
//         valStr = valStrs;
//     }
//     $('#indexplaydata').highcharts({
//         chart: {
//             type: 'column'
//         },
//         title: {
//             text: '代理商每月每天盈亏汇总',
//             style:{
//                 color: "#333333",
//                 fontSize:"24px",
//                 fill: "#333333",
//                 width: "1612px",
//                 fontWeight:"bold",
//                 Boolean:true
//             }
//         },
//         subtitle: {
//             text: ''
//         },
//         xAxis: {
//             categories: dataArry,
//             crosshair: true
//         },
//         yAxis: {
//             min: 0,
//             title: {
//                 text: '额度值'
//             }
//         },
//         tooltip: {
//             headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
//             pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
//             '<td style="padding:0"><b>{point.y:.1f} </b></td></tr>',
//             footerFormat: '</table>',
//             shared: true,
//             useHTML: true
//         },
//         plotOptions: {
//             column: {
//                 pointPadding: 0.2,
//                 borderWidth: 0
//             }
//         },
//         series: valStr
//     });
// }