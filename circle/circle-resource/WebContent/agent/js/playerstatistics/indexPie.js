define(['common/BaseListPage',"jqtongChart"], function (BaseListPage) {
    return BaseListPage.extend({
        init: function () {
            pieBasic2();
        }
    });
});
/**
 * 饼图
 */
function pieBasic(){
    // $("#pieBasic").css("height",    $(document.body).height()-100).css("width",$(document).width()-250);
    var dataArray = [];
    $.ajax({
        type:"post",
        url:  root+"",
        data:{dateTime:$("input[name='dateTime']").val()},
        async : false
        }).done(function( data ) {
            var a = $.parseJSON(data);
            for(var i =0 ; i < a.length;i++){
                var childArray = [];
                childArray[0] = ""+a[i].nickname+"";
                childArray[1] = a[i].percentage;
                dataArray.push(childArray);
            }
        });
    var title = "每日玩家前10汇总"
    if(dataArray.length == 0){
        title = title + "【暂无数据】";
    }

   var chart = new Highcharts.Chart({
        chart: {
            renderTo: 'pieBasic',
            margin: [50, 200, 60, 170]
        },
        title: {
            text: title
        },
        plotArea: {
            shadow: null,
            borderWidth: null,
            backgroundColor: null
        },
        tooltip: {
            formatter: function() {
                // return '<b>'+ this.point.name +'</b>: '+ this.y +' %';
                return '<b>'+ this.point.name +'</b>: ';
            }
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: true,
                    formatter: function() {
                        if (this.y > 5) return this.point.name;
                    },
                    color: 'white',
                    style: {
                        font: '13px Trebuchet MS, Verdana, sans-serif'
                    }
                }
            }
        },
        legend: {
            layout: 'vertical',
            style: {
                left: 'auto',
                bottom: 'auto',
                right: '50px',
                top: '100px'
            }
        },
        series: [{
            type: 'pie',
            name: 'Browser share',
            data: dataArray
        }]
    });
}

function pieBasic2(){
    $("#pieBasic").css("width",$(document).width()-250);
    var dataArray = [];
    $.ajax({
        type:"post",
        url:  root+"/playerSummery/indexPieAjax.html",
        data:{dateTime:$("input[name='dateTime']").val()},
        async : false
    }).done(function( data ) {
        var a = $.parseJSON(data);
        for(var i =0 ; i < a.length;i++){
            var childArray = [];
            childArray[0] = ""+a[i].nickname+"";
            childArray[1] = a[i].percentage;
            dataArray.push(childArray);
        }
    });
    var title = "每日代理商玩家前10总数汇总"
    if(dataArray.length == 0){
        title = title + "【暂无数据】";
    }

    Highcharts.chart('pieBasic', {
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            type: 'pie'
        },
        title: {
            text: title
        },
        tooltip: {
            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: true,
                    format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                    style: {
                        color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                    }
                }
            }
        },
        series: [{
            name: 'Brands',
            colorByPoint: true,
            data: dataArray
        }]
    });
}