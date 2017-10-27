define(['common/BaseListPage',"echartsAll"], function (BaseListPage) {
    return BaseListPage.extend({
        init: function () {
            echartPie();
        }
    });
});
/**
 * 代理商玩家前10汇总
 */
function echartPie(){
    var myChart = echarts.init(document.getElementById('pieBasic'));
    myChart.showLoading({
        text: '正在努力的读取数据中...'
    });
    var dataArray = [];
    $.ajax({
        type:"post",
        url:  root+"/playerSummery/indexPieAjax.html",
        data:{dateTime:$("input[name='dateTime']").val()},
        async : true
    }).done(function( data ) {
        var a = $.parseJSON(data);
        var jsonArr = new Array();
        for(var i =0 ; i < a.length;i++){
            var childArray = {};
            dataArray[i]=a[i].username;
            childArray["value"] =  a[i].percentage;
            childArray["name"] =a[i].username;
            jsonArr.push(childArray);
        }
        var title = "每日代理商玩家前10总数汇总"
        if(dataArray.length == 0){
            title = title + "【暂无数据】";
        }
        myChart.hideLoading();
        myChart.setOption({
            title : {
                text: title,
                x:'center'
            },
            tooltip : {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {d}%"
            },
            legend: {
                orient : 'vertical',
                x : 'left',
                data:dataArray
            },
            toolbox: {
                show : true,
                feature : {
                    mark : {show: true},
                    dataView : {show: false, readOnly: false},
                    magicType : {
                        show: true,
                        type: ['pie', 'funnel'],
                        option: {
                            funnel: {
                                x: '25%',
                                width: '50%',
                                funnelAlign: 'left',
                                max: 1548
                            }
                        }
                    },
                    restore : {show: true},
                    saveAsImage : {show: true}
                }
            },
            calculable : true,
            series : [
                {
                    name:'代理商',
                    type:'pie',
                    radius : '55%',
                    center: ['50%', '60%'],
                    data:jsonArr
                }
            ]
        });
    });

}
/**
 * 3d饼图
 */
// function pie3d(){
//     $("#pieBasic").css("width",$(document).width()-250);
//     var dataArray = [];
//     $.ajax({
//         type:"post",
//         url:  root+"/playerSummery/indexPieAjax.html",
//         data:{dateTime:$("input[name='dateTime']").val()},
//         async : true
//     }).done(function( data ) {
//         var a = $.parseJSON(data);
//         for(var i =0 ; i < a.length;i++){
//             var childArray = [];
//             childArray[0] = a[i].username;
//             childArray[1] = a[i].percentage;
//             dataArray.push(childArray);
//         }
//         var title = "每日代理商玩家前10总数汇总"
//         if(dataArray.length == 0){
//             title = title + "【暂无数据】";
//         }
//         Highcharts.chart('pieBasic', {
//             chart: {
//                 type: 'pie',
//                 options3d: {
//                     enabled: true,
//                     alpha: 45,
//                     beta: 0
//                 }
//             },
//             plotArea: {
//                 shadow: null,
//                 borderWidth: null,
//                 backgroundColor: null
//             },
//             title: {
//                 text: title,
//                 style:{
//                     color: "#333333",
//                     fontSize:"24px",
//                     fill: "#333333",
//                     width: "1612px",
//                     fontWeight:"bold",
//                     Boolean:true
//                 }
//             },
//             tooltip: {
//                 pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
//             },
//             plotOptions: {
//                 pie: {
//                     allowPointSelect: true,
//                     cursor: 'pointer',
//                     depth: 35,
//                     dataLabels: {
//                         enabled: true,
//                         format: '<b>{point.name}</b>: {point.percentage:.1f} %',
//                         style: {
//                             font: '13px Trebuchet MS, Verdana, sans-serif'
//                         }
//                     },
//                     showInLegend:true
//                 }
//             },
//             series: [{
//                 type: 'pie',
//                 name: '占比',
//                 data:dataArray
//             }]
//         });
//     });
//
//
// }

/**
 * 饼图
 */
// function pieBasic(){
//     $("#pieBasic").css("height",    $(document.body).height()-100).css("width",$(document).width()-250);
//     var dataArray = [];
//     $.ajax({
//         type:"post",
//         url:  root+"/playerSummery/indexPieAjax.html",
//         data:{dateTime:$("input[name='dateTime']").val()},
//         async : false
//     }).done(function( data ) {
//         var a = $.parseJSON(data);
//         for(var i =0 ; i < a.length;i++){
//             var childArray = [];
//             childArray[0] = ""+a[i].nickname+"";
//             childArray[1] = a[i].percentage;
//             dataArray.push(childArray);
//         }
//     });
//     var title = "每日玩家前10汇总"
//     if(dataArray.length == 0){
//         title = title + "【暂无数据】";
//     }
//
//     var chart = new Highcharts.Chart({
//         chart: {
//             renderTo: 'pieBasic',
//             margin: [50, 200, 60, 170]
//         },
//         title: {
//             text: title,
//             style:{
//                 color: "#333333",
//                 fontSize:"24px",
//                 fill: "#333333",
//                 width: "1612px",
//                 fontWeight:"bold",
//                 Boolean:true
//             }
//         },
//         plotArea: {
//             shadow: null,
//             borderWidth: null,
//             backgroundColor: null
//         },
//         tooltip: {
//             formatter: function() {
//                 // return '<b>'+ this.point.name +'</b>: '+ this.y +' %';
//                 return '<b>'+ this.point.name +'</b>: ';
//             }
//         },
//         plotOptions: {
//             pie: {
//                 allowPointSelect: true,
//                 cursor: 'pointer',
//                 dataLabels: {
//                     enabled: true,
//                     formatter: function() {
//                         if (this.y > 5) return this.point.name;
//                     },
//                     color: 'white',
//                     style: {
//                         font: '13px Trebuchet MS, Verdana, sans-serif'
//                     }
//                 }
//             }
//         },
//         legend: {
//             layout: 'vertical',
//             style: {
//                 left: 'auto',
//                 bottom: 'auto',
//                 right: '50px',
//                 top: '100px'
//             }
//         },
//         series: [{
//             type: 'pie',
//             name: 'Browser share',
//             data: dataArray
//         }]
//     });
// }

// function pieBasic2(){
//     $("#pieBasic").css("width",$(document).width()-250);
//     var dataArray = [];
//     $.ajax({
//         type:"post",
//         url:  root+"/playerSummery/indexPieAjax.html",
//         data:{dateTime:$("input[name='dateTime']").val()},
//         async : false
//     }).done(function( data ) {
//         var a = $.parseJSON(data);
//         for(var i =0 ; i < a.length;i++){
//             var childArray = [];
//             childArray[0] = a[i].username;
//             childArray[1] = a[i].percentage;
//             dataArray.push(childArray);
//         }
//     });
//     var title = "每日代理商玩家前10总数汇总"
//     if(dataArray.length == 0){
//         title = title + "【暂无数据】";
//     }
//
//     Highcharts.chart('pieBasic', {
//         chart: {
//             plotBackgroundColor: null,
//             plotBorderWidth: null,
//             plotShadow: false,
//             type: 'pie'
//         },
//         title: {
//             text: title
//         },
//         tooltip: {
//             pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
//         },
//         plotOptions: {
//             pie: {
//                 allowPointSelect: true,
//                 cursor: 'pointer',
//                 dataLabels: {
//                     enabled: true,
//                     format: '<b>{point.name}</b>: {point.percentage:.1f} %',
//                     style: {
//                         color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
//                     }
//                 },
//                 showInLegend:true
//             }
//         },
//         series: [{
//             name: '占比',
//             colorByPoint: true,
//             data: dataArray
//         }]
//     });
// }