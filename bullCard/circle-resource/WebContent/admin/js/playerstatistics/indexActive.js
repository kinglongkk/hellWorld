define(['common/BaseListPage',"echartsAll","jbootMultiselect"], function (BaseListPage) {
    return BaseListPage.extend({
        init: function () {
            $("select[name='agent']").multiselect({
                includeSelectAllOption: true,
                selectAllText: '全选',
                allSelectedText: '选中',
                enableFiltering: true
            });
            baiduEchartActive();
        }
    });
});
/**
 * 活跃玩家总数
 */
function baiduEchartActive(){
    var myChart = echarts.init(document.getElementById('activelineLabels'));
    myChart.showLoading({
        text: '正在努力的读取数据中...'
    });
    var dataStr = $("#dataStr").val().split(",");
    var dataInt=[];
    var year = $("select[name='year']").val();
    var month = $("select[name='month']").val();
    var agent = $("select[name='agent']").val();
    var rootUrl = root+"/playerSummery/indexMultipleActiveAjax.html?year="+year+"&month="+month+"&username="+agent;
    $.ajax({
        type:"post",
        url:  rootUrl,
        async : true
    }).done(function( data ) {
        dataInt= $.parseJSON(data);
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
                    name : '单位(人)',
                    splitArea : {show : true}
                }
            ],
            series : dataInt
        });
    });
}
/**
 * 柱形图 ：多个代理商对比
 */
// function activelineLabelsCompare(){
//     var dataStr = $("#dataStr").val().split(",");
//     var dataInt=[];
//     var year = $("select[name='year']").val();
//     var month = $("select[name='month']").val();
//     var agent = $("select[name='agent']").val();
//     var rootUrl = root+"/playerSummery/indexMultipleActiveAjax.html?year="+year+"&month="+month+"&username="+agent;
//     $.ajax({
//         type:"post",
//         url:  rootUrl,
//         async : true
//     }).done(function( data ) {
//         dataInt= $.parseJSON(data);
//         $('#activelineLabels').highcharts({
//             chart: {
//                 type: 'column'
//             },
//             title: {
//                 text: '活跃玩家总数',
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
//                 categories: dataStr,
//                 crosshair: true
//             },
//             yAxis: {
//                 min: 0,
//                 title: {
//                     text: '玩家数'
//                 }
//             },
//             tooltip: {
//                 headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
//                 pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
//                 '<td style="padding:0"><b>{point.y:.0f} 人</b></td></tr>',
//                 footerFormat: '</table>',
//                 shared: true,
//                 useHTML: true
//             },
//             plotOptions: {
//                 column: {
//                     pointPadding: 0.2,
//                     borderWidth: 0
//                 }
//             },
//             series: dataInt
//         });
//     });
// }
/**
 * 柱状图
 */
// function activelineLabels(){
//     $("#sliders").hide();
//     // $("#lineLabels").css("height",    $(document.body).height()-200);
//     var dataStr = $("#dataStr").val().split(",");
//     var dataInt=[];
//     $.ajax({
//         type:"post",
//         url:  root+"/playerSummery/indexActiveAjax.html",
//         data:{year:$("select[name='year']").val(),month:$("select[name='month']").val()},
//         async : false
//     }).done(function( data ) {
//         dataInt= $.parseJSON(data);
//     });
//
//     var chart = new Highcharts.Chart({
//         chart: {
//             renderTo: 'activelineLabels',
//             defaultSeriesType: 'column',
//             margin: [ 50, 50, 100, 80]
//         },
//         title: {
//             text: '统计玩家每月每天活跃玩家总数量',
//             style:{
//                 color: "#333333",
//                 fontSize:"24px",
//                 fill: "#333333",
//                 width: "1612px",
//                 fontWeight:"bold",
//                 Boolean:true
//             }
//         },
//         xAxis: {
//             categories: dataStr,
//             labels: {
//                 rotation: -45,
//                 align: 'right',
//                 style: {
//                     font: 'normal 13px Verdana, sans-serif'
//                 }
//             }
//         },
//         yAxis: {
//             min: 0,
//             title: {
//                 text: '玩家数'
//             }
//         },
//         legend: {
//             enabled: false
//         },
//         tooltip: {
//             formatter: function() {
//                 return '<b>'+ this.x +'</b><br/>'+
//                     '玩家数量: '+ Highcharts.numberFormat(this.y, 0) +
//                     ' 人';
//             }
//         },
//         series: [{
//             name: 'Population',
//             data: dataInt,
//             dataLabels: {
//                 enabled: true,
//                 rotation: -90,
//                 color: '#FFFFFF',
//                 align: 'right',
//                 x: -3,
//                 y: 10,
//                 formatter: function() {
//                     return this.y;
//                 },
//                 style: {
//                     font: 'normal 13px Verdana, sans-serif'
//                 }
//             }
//         }]
//     });
// }
/**
 * 3d图
 */
// function activelineLabels3d(){
//     $("#sliders").show();
//     var dataStr = $("#dataStr").val().split(",");
//     var dataInt=[];
//     $.ajax({
//         type:"post",
//         url:  root+"/playerSummery/indexActiveAjax.html",
//         data:{year:$("select[name='year']").val(),month:$("select[name='month']").val()},
//         async : false
//     }).done(function( data ) {
//         dataInt= $.parseJSON(data);
//     });
//
//     var chart = new Highcharts.Chart({
//         chart: {
//             renderTo: 'activelineLabels',
//             type: 'column',
//             options3d: {
//                 enabled: true,
//                 alpha: 15,
//                 beta: 15,
//                 depth: 50,
//                 viewDistance: 25
//             }
//         },
//         title: {
//             text: '统计玩家每月每天活跃玩家总数量',
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
//             categories: dataStr,
//             labels: {
//                 rotation: -45,
//                 align: 'right',
//                 style: {
//                     font: 'normal 13px Verdana, sans-serif'
//                 }
//             }
//         },
//         yAxis: {
//             min: 0,
//             title: {
//                 text: '玩家数'
//             }
//         },
//         legend: {
//             enabled: false
//         },
//         plotOptions: {
//             column: {
//                 depth: 25
//             }
//         },
//         tooltip: {
//             formatter: function() {
//                 return '<b>'+ this.x +'</b><br/>'+
//                     '玩家数量: '+ Highcharts.numberFormat(this.y, 0) +
//                     ' 人';
//             }
//         },
//         series: [{
//             data: dataInt
//         }]
//     });
//     $('#alpha-value').html(chart.options.chart.options3d.alpha);
//     $('#beta-value').html(chart.options.chart.options3d.beta);
//     $('#depth-value').html(chart.options.chart.options3d.depth);
//     $('#sliders input').on('input change', function () {
//         chart.options.chart.options3d[this.id] = this.value;
//         $('#alpha-value').html(chart.options.chart.options3d.alpha);
//         $('#beta-value').html(chart.options.chart.options3d.beta);
//         $('#depth-value').html(chart.options.chart.options3d.depth);
//         chart.redraw(false);
//     });
// }